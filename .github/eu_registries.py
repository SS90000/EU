"""Open trials from European registries that are not on ClinicalTrials.gov.

  CTIS   (EU Clinical Trials Information System, euclinicaltrials.eu): France, Germany, Italy, Spain
  ISRCTN (isrctn.com): all five countries, mainly the UK
  DRKS   (German Clinical Trials Register, drks.de): Germany. Only records registered or last updated
         from 2025, which DRKS publishes under CC BY 4.0; older records may be under copyright.
         Each record keeps the date it was retrieved, which the page shows with the source.

Records that carry a ClinicalTrials.gov number already in the main download are skipped,
so a trial appears once. Sites have no map position in these registries; it comes from
cities already known from ClinicalTrials.gov, then from OpenStreetMap's Nominatim
(cached in data/_ref/geo.json, at most one request per second).

Only the Python standard library is used.
"""
import gzip, html.parser, io, json, os, re, time, urllib.parse, urllib.request, zipfile
import xml.etree.ElementTree as ET
from http import cookiejar
from datetime import datetime, timezone

CTIS = "https://euclinicaltrials.eu/ctis-public-api"
ISRCTN = "https://www.isrctn.com/api/query/format/default"
UA = "Mozilla/5.0 (compatible; FindMyTrial/1.0; data build; salishseven@gmail.com)"
CTIS_COUNTRIES = ("France", "Germany", "Italy", "Spain")
UK_NATIONS = {"England", "Scotland", "Wales", "Northern Ireland", "United Kingdom"}
NS = {"i": "http://www.67bricks.com/isrctn"}

bt = None  # the build_trials module, set by run()


def http(url, data=None, kind="json", timeout=180, tries=5):
    for attempt in range(tries):
        try:
            hdr = {"User-Agent": UA, "Accept": "application/json" if kind == "json" else "application/xml"}
            body = None
            if data is not None:
                body = json.dumps(data).encode()
                hdr["Content-Type"] = "application/json"
            req = urllib.request.Request(url, data=body, headers=hdr)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                raw = r.read()
            return json.loads(raw) if kind == "json" else raw
        except Exception as e:
            wait = 5 * (attempt + 1)
            bt.log(f"Request to {url[:80]} failed ({e}); retrying in {wait}s")
            time.sleep(wait)
    raise RuntimeError(f"{url[:60]} did not respond")


def contact(*parts):
    return " · ".join(p.strip() for p in parts if p and p.strip())


def clean_city(c):
    """'Toulouse Cedex 9' -> 'Toulouse', 'Rozzano (MI)' / 'Rozzano MI' -> 'Rozzano', 'Badalona, Barcelona' -> 'Badalona'."""
    c = (c or "").strip()
    if re.fullmatch(r"[-–.\s]*|n/?a|none|do not edit|.*no country specified.*", c, re.I):
        return ""
    c = re.sub(r"\s*\([^)]*\)", "", c)
    c = re.sub(r"\s+cedex\b.*$", "", c, flags=re.I)
    c = re.split(r",|\s[-–/]\s", c)[0].strip()
    c = re.sub(r"\s+[A-Z]{2}$", "", c)  # Italian province code
    c = re.sub(r"\s+\d+$", "", c)       # arrondissement numbers
    return c.title() if c.isupper() else c


def dmy(s):
    """'21/11/2026' -> '2026-11-21'"""
    m = re.match(r"(\d\d)/(\d\d)/(\d{4})", s or "")
    return f"{m.group(3)}-{m.group(2)}-{m.group(1)}" if m else ""


# ---------- CTIS ----------
CTIS_CACHE = None  # set in run()
PHASE_RX = re.compile(r"Phase\s+(IV|III|II|I)\b")
ROMAN = {"I": "1", "II": "2", "III": "3", "IV": "4"}


def ctis_phase(text):
    ph = []
    for m in PHASE_RX.findall(text or ""):
        if ROMAN[m] not in ph:
            ph.append(ROMAN[m])
    return "/".join(sorted(ph))


def ctis_ages(text):
    """'18-64 years, 65+ years' -> (18, None)"""
    lo, hi, unbounded = [], [], False
    for a, b in re.findall(r"(\d+)\s*-\s*(\d+)", text or ""):
        lo.append(int(a)); hi.append(int(b))
    for a in re.findall(r"(\d+)\s*\+", text or ""):
        lo.append(int(a)); unbounded = True
    if re.search(r"in utero|preterm|newborn", text or "", re.I):
        lo.append(0)
    if not lo:
        return None, None
    return min(lo), (None if unbounded or not hi else max(hi))


def ctis_trim(rec, srow):
    """Keep only what the finder needs from one CTIS record (they are about 200 KB each)."""
    aa = rec.get("authorizedApplication") or {}
    p1 = aa.get("authorizedPartI") or {}
    td = p1.get("trialDetails") or {}
    ids = td.get("clinicalTrialIdentifiers") or {}
    sec = ids.get("secondaryIdentifyingNumbers") or {}
    ti = td.get("trialInformation") or {}
    mc = ti.get("medicalCondition") or {}
    el = ti.get("eligibilityCriteria") or {}
    pop = ti.get("populationOfTrialSubjects") or {}
    dur = ti.get("trialDuration") or {}
    conds = [c.get("medicalCondition", "") for c in mc.get("partIMedicalConditions") or [] if c.get("medicalCondition")]
    terms = [c.get("termName", "") for c in mc.get("meddraConditionTerms") or [] if c.get("termName")]
    rare = any(c.get("isConditionRareDisease") for c in mc.get("partIMedicalConditions") or [])
    inc = [c.get("principalInclusionCriteria", "") for c in el.get("principalInclusionCriteria") or []]
    exc = [c.get("principalExclusionCriteria", "") for c in el.get("principalExclusionCriteria") or []]
    groups = [g.get("name", "") for g in pop.get("clinicalTrialGroups") or []]
    sponsor, central = "", ""
    for sp in p1.get("sponsors") or []:
        if not sponsor:
            sponsor = ((sp.get("organisation") or {}).get("name") or "")
        for c in sp.get("publicContacts") or []:
            if not central:
                central = contact(c.get("functionalName"), c.get("telephone"), c.get("functionalEmailAddress"))
    products = []
    for p in p1.get("products") or []:
        n = p.get("productName") or (p.get("productDictionaryInfo") or {}).get("prodName") or ""
        if n and n not in products and not re.search(r"placebo", n, re.I):
            products.append(n)
    sites, start = {}, {}
    for p2 in aa.get("authorizedPartsII") or []:
        mi = p2.get("mscInfo") or {}
        cn = mi.get("countryName") or mi.get("mscName") or ""
        if cn not in CTIS_COUNTRIES:
            continue
        start[cn] = ((mi.get("activeTrialRecruitmentPeriod") or {}).get("recruitmentStartDate")
                     or (mi.get("activeTrialPeriod") or {}).get("trialStartDate") or "")
        lst = sites.setdefault(cn, [])
        for s in p2.get("trialSites") or []:
            oa = s.get("organisationAddressInfo") or {}
            org, ad, pi = oa.get("organisation") or {}, oa.get("address") or {}, s.get("personInfo") or {}
            name = org.get("name") or "Study site"
            dept = s.get("departmentName") or ""
            if dept and dept.lower() not in ("na", "n/a", "-", "none"):
                name = f"{name} – {dept}"
            who = contact(pi.get("firstName", ""), pi.get("lastName", "")).replace(" · ", " ")
            lst.append({"f": name[:160], "city": clean_city(ad.get("city")), "zip": (ad.get("postcode") or "").strip(),
                        "c": contact(who, pi.get("telephone") or oa.get("phone"), pi.get("email") or oa.get("email"))})
    title = ids.get("publicTitle") or ids.get("fullTitle") or srow.get("ctTitle", "")
    obj = (ti.get("trialObjective") or {}).get("mainObjective", "")
    return {"t": title, "o": ids.get("fullTitle", ""), "ac": ids.get("shortTitle", "") if len(ids.get("shortTitle", "")) <= 25 else "",
            "nct": ((sec.get("nctNumber") or {}).get("number") or "").strip().upper(),
            "isrctn": ((sec.get("isrctnNumber") or {}).get("number") or "").strip().upper(),
            "conds": conds, "terms": terms, "rare": rare, "ta": srow.get("therapeuticAreas") or [],
            "inc": inc, "exc": exc, "obj": obj, "hv": any(re.search(r"healthy", g, re.I) for g in groups),
            "prod": products, "sp": sponsor or srow.get("sponsor", ""), "cc": central,
            "end": dur.get("estimatedEndDate") or dur.get("estimatedGlobalEndDate") or "",
            "start": start, "sites": sites,
            "ph": ctis_phase(srow.get("trialPhase")), "age": srow.get("ageGroup", ""), "sex": srow.get("gender", ""),
            "upd": dmy(srow.get("lastUpdated")), "stamp": srow.get("lastPublicationUpdate") or srow.get("lastUpdated") or ""}


def ctis_refresh():
    """Bring the shared CTIS cache up to date (once per day; the other countries reuse it)."""
    cache = {}
    if os.path.exists(CTIS_CACHE):
        with gzip.open(CTIS_CACHE, "rt", encoding="utf-8") as f:
            cache = json.load(f)
        age_h = (time.time() - os.path.getmtime(CTIS_CACHE)) / 3600
        if cache.get("_complete") and cache.get("_day") == datetime.now(timezone.utc).strftime("%Y-%m-%d") and age_h < 20:
            bt.log(f"CTIS: using today's download ({len(cache['trials'])} trials)")
            return cache["trials"]
    old = cache.get("trials", {})
    rows, total = {}, None
    # the search answers at most 10,000 results per sort order, so read newest first and then oldest first
    for direction in ("DESC", "ASC"):
        page = 1
        while True:
            j = http(CTIS + "/search", {"pagination": {"page": page, "size": 100},
                                        "sort": {"property": "decisionDate", "direction": direction}, "searchCriteria": {}})
            total = (j.get("pagination") or {}).get("totalRecords", total)
            data = j.get("data") or []
            for d in data:
                rows[d["ctNumber"]] = d
            if not data or not (j.get("pagination") or {}).get("nextPage") or len(rows) >= (total or 0):
                break
            page += 1
            time.sleep(0.3)
        if total and len(rows) >= total:
            break
    bt.log(f"CTIS: {len(rows)} of {total} trials listed")
    want = {}
    for n, d in rows.items():
        st = {}
        for x in d.get("trialCountries") or []:
            c, _, code = x.rpartition(":")
            if c in CTIS_COUNTRIES and code in ("2", "3", "4"):
                st[c] = "R" if code == "4" else "NYR"
        if st:
            want[n] = (d, st)
    trials, fetched, failed = {}, 0, 0
    for n, (d, st) in want.items():
        stamp = d.get("lastPublicationUpdate") or d.get("lastUpdated") or ""
        prev = old.get(n)
        if prev and prev.get("stamp") == stamp:
            prev["st"] = st
            trials[n] = prev
            continue
        try:
            rec = http(CTIS + "/retrieve/" + urllib.parse.quote(n), tries=3)
            tr = ctis_trim(rec, d)
            tr["st"] = st
            trials[n] = tr
            fetched += 1
        except Exception as e:
            failed += 1
            if prev:
                prev["st"] = st
                trials[n] = prev
        time.sleep(0.25)
    bt.log(f"CTIS: {len(want)} trials open or about to open in FR/DE/IT/ES; {fetched} downloaded, {failed} failed")
    complete = total is not None and len(rows) >= 0.98 * total and failed < 0.05 * max(1, len(want))
    os.makedirs(os.path.dirname(CTIS_CACHE), exist_ok=True)
    with gzip.open(CTIS_CACHE, "wt", encoding="utf-8") as f:
        json.dump({"_complete": complete, "_day": datetime.now(timezone.utc).strftime("%Y-%m-%d"), "trials": trials},
                  f, ensure_ascii=False, separators=(",", ":"))
    return trials


def ctis_rows(country, skip):
    trials = ctis_refresh()
    out, dup = [], 0
    for n, tr in trials.items():
        st = tr["st"].get(country)
        if not st:
            continue
        if tr.get("nct") in skip or tr.get("isrctn") in skip:
            dup += 1
            continue
        a0, a1 = ctis_ages(tr["age"])
        sx = tr["sex"].lower()
        sites = [dict(s, s=st, pr="", city=clean_city(s["city"])) for s in tr["sites"].get(country, [])]
        crit = ""
        if tr["inc"]:
            crit += "Inclusion criteria:\n" + "\n".join(f"{i + 1}. {x}" for i, x in enumerate(tr["inc"]))
        if tr["exc"]:
            crit += "\nExclusion criteria:\n" + "\n".join(f"{i + 1}. {x}" for i, x in enumerate(tr["exc"]))
        out.append({"id": n, "src": "ctis", "title": tr["t"], "official": tr["o"], "ac": tr["ac"],
                    "conds": list({c.strip().lower(): c.strip() for c in reversed(tr["conds"] + tr["terms"]) if c.strip()}.values())[::-1], "anc": tr["ta"], "rare": tr["rare"],
                    "summary": ("Main objective: " + tr["obj"]) if tr["obj"] and not tr["obj"].lower().startswith(("main", "primary")) else tr["obj"],
                    "crit": crit, "kind": "treat", "ph": tr["ph"], "a0": a0, "a1": a1,
                    "sx": "F" if "female" in sx and "male" not in sx.replace("female", "") else "M" if "male" in sx and "female" not in sx else "A",
                    "hv": tr["hv"], "upd": tr["upd"], "pcd": tr["end"], "start": tr["start"].get(country, ""),
                    "sp": tr["sp"], "cc": tr["cc"], "iv": ["drug"],
                    "ivs": [{"type": "DRUG", "name": p} for p in tr["prod"]], "sites": sites, "nct": tr.get("nct", "")})
    bt.log(f"CTIS {country}: {len(out)} trials not on ClinicalTrials.gov ({dup} skipped as already there)")
    return out


# ---------- ISRCTN ----------
def tx(el, path):
    x = el.find(path, NS)
    return (x.text or "").strip() if x is not None and x.text else ""


def isr_years(el):
    if el is None:
        return None
    v, u = el.get("value"), (el.get("unit") or "years")
    try:
        return bt.years(f"{float(v)} {u.rstrip('s')}")
    except (TypeError, ValueError):
        return None


ISR_IVT = {"Drug": "drug", "Biological/Vaccine": "bio", "Device": "device", "Procedure/Surgery": "proc",
           "Behavioural": "behav", "Supplement": "diet", "Genetic": "gene", "Other": "other", "Mixed": "other"}


def isrctn_rows(country, skip):
    q = f'recruitmentCountry:"{country}" AND trialStatus:ongoing'
    raw = http(ISRCTN + "?" + urllib.parse.urlencode({"q": q, "limit": 3000}), kind="xml", timeout=600, tries=3)
    root = ET.fromstring(raw)
    total = int(root.get("totalCount") or 0)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    names = UK_NATIONS if country == "United Kingdom" else {country}
    out, dup, nosite, closed, n = [], 0, 0, 0, 0
    for ft in root.findall("i:fullTrial", NS):
        n += 1
        tr = ft.find("i:trial", NS)
        num = "ISRCTN" + tx(tr, "i:isrctn")
        nct = tx(tr, "i:externalRefs/i:clinicalTrialsGovNumber").upper()
        eu = tx(tr, "i:externalRefs/i:eudraCTNumber")
        if nct in skip or eu in skip or num in skip:
            dup += 1
            continue
        p = tr.find("i:participants", NS)
        start = tx(p, "i:recruitmentStart")[:10]
        end = tx(p, "i:recruitmentEnd")[:10]
        override = tx(p, "i:recruitmentStatusOverride") + " " + tx(p, "i:recruitmentStartStatusOverride")
        if re.search(r"suspend|stop|halt|withdraw|complet|terminat", override, re.I) or (end and end < now):
            closed += 1
            continue
        st = "NYR" if start and start > now else "R"
        sites = []
        for c in p.findall("i:trialCentres/i:trialCentre", NS):
            if tx(c, "i:country") not in names:
                continue
            sites.append({"f": tx(c, "i:name")[:160] or "Study site", "city": clean_city(tx(c, "i:city")), "zip": tx(c, "i:zip"),
                          "s": st, "pr": "", "c": ""})
        if not sites:
            nosite += 1
            continue
        td = tr.find("i:trialDescription", NS)
        conds = [tx(c, "i:description") for c in tr.findall("i:conditions/i:condition", NS) if tx(c, "i:description")]
        dclass = [tx(c, "i:diseaseClass1") for c in tr.findall("i:conditions/i:condition", NS) if tx(c, "i:diseaseClass1")]
        ivs, ivt, phases = [], set(), set()
        for iv in tr.findall("i:interventions/i:intervention", NS):
            t = tx(iv, "i:interventionType")
            ivt.add(ISR_IVT.get(t, "other"))
            d = tx(iv, "i:drugNames") or tx(iv, "i:description")
            ivs.append({"type": t.upper(), "name": d[:300]})
            ph = tx(iv, "i:phase")
            for m in re.findall(r"Phase\s+(IV|III|II|I)\b", ph):
                phases.add(ROMAN[m])
        design = tx(tr, "i:trialDesign/i:primaryStudyDesign")
        sec = tx(tr, "i:trialDesign/i:secondaryStudyDesign")
        kind = "obs" if re.search(r"observational", design, re.I) else \
               "diag" if re.search(r"diagnos|screen", sec, re.I) else "treat" if ivt & {"drug", "bio", "proc", "device", "rad"} else "support"
        cc = ""
        for c in ft.findall("i:contact", NS):
            types = [tx(x, ".") for x in c.findall("i:contactTypes/i:contactType", NS)]
            if "Public" in types or not cc:
                cd = c.find("i:contactDetails", NS)
                cc = contact((tx(c, "i:title") + " " + tx(c, "i:forename") + " " + tx(c, "i:surname")).strip(),
                             tx(cd, "i:telephone") if cd is not None else "", tx(cd, "i:email") if cd is not None else "")
                if "Public" in types:
                    break
        sponsor = tx(ft, "i:sponsor/i:organisation")
        g = tx(p, "i:gender").lower()
        inc, exc = tx(p, "i:inclusion"), tx(p, "i:exclusion")
        out.append({"id": num, "src": "isrctn", "title": tx(td, "i:title"), "official": tx(td, "i:scientificTitle"),
                    "ac": tx(td, "i:acronym")[:25], "conds": conds, "anc": dclass,
                    "rare": bool(re.search(r"\brare\b", " ".join(conds), re.I)),
                    "summary": tx(td, "i:plainEnglishSummary"),
                    "crit": (f"Inclusion criteria:\n{inc}" if inc else "") + (f"\nExclusion criteria:\n{exc}" if exc else ""),
                    "kind": kind, "ph": "/".join(sorted(phases)),
                    "a0": isr_years(p.find("i:lowerAgeLimit", NS)), "a1": isr_years(p.find("i:upperAgeLimit", NS)),
                    "sx": "F" if g == "female" else "M" if g == "male" else "A",
                    "hv": tx(p, "i:healthyVolunteersAllowed") == "true",
                    "upd": (tr.get("lastUpdated") or "")[:10], "pcd": tx(tr, "i:trialDesign/i:overallEndDate")[:10] or end,
                    "start": start, "sp": sponsor, "cc": cc, "iv": sorted(ivt - {"other"}) or ["other"], "ivs": ivs,
                    "sites": sites, "nct": nct})
    bt.log(f"ISRCTN {country}: {n} of {total} ongoing records read; {len(out)} added, {dup} already on ClinicalTrials.gov or CTIS, "
           f"{closed} closed to recruitment, {nosite} list no site in {country}")
    return out


# ---------- DRKS ----------
DRKS = "https://drks.de/search"
DRKS_FROM = "2025-01-01"  # records registered or updated from this date are CC BY 4.0 (DRKS terms of use)
DRKS_PHASE = {"PHASE_0": "", "PHASE_I": "1", "PHASE_I_II": "1/2", "PHASE_II": "2", "PHASE_II_III": "2/3", "PHASE_III": "3", "PHASE_IV": "4"}
DRKS_DRUG = re.compile(r"\b(drug|medication|tablet|capsule|infusion|injection|placebo|dose|dosing|mg\b|vaccin|Arzneimittel|Medikament)", re.I)
DRKS_DEVICE = re.compile(r"\b(device|implant|stent|app\b|software|wearable|Medizinprodukt)", re.I)
DRKS_BEHAV = re.compile(r"\b(training|exercise|counsel|education|psychotherap|cognitive behavio|coaching|program(me)?\b)", re.I)


class Forms(html.parser.HTMLParser):
    """Collects each form's action and the fields a browser would send."""
    def __init__(self):
        super().__init__()
        self.forms, self.cur, self.sel = {}, None, None

    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag == "form":
            self.cur = a.get("id") or a.get("name") or str(len(self.forms))
            self.forms[self.cur] = {"action": a.get("action", ""), "fields": {}, "buttons": [], "selects": {}}
        elif self.cur is None:
            return
        elif tag == "input" and a.get("name"):
            t = (a.get("type") or "text").lower()
            if t in ("checkbox", "radio") and "checked" not in a:
                return
            if t in ("submit", "button", "image"):
                return
            self.forms[self.cur]["fields"][a["name"]] = a.get("value", "")
        elif tag == "button" and a.get("name"):
            self.forms[self.cur]["buttons"].append(a["name"])
        elif tag == "select" and a.get("name"):
            # a multiple select with nothing chosen sends nothing; a single one sends its first option
            self.sel, self.multi, self.first = a["name"], "multiple" in a, True
        elif tag == "option" and self.sel:
            f = self.forms[self.cur]["fields"]
            if "selected" in a:
                if self.multi:
                    f.setdefault(self.sel, [])
                    f[self.sel].append(a.get("value", ""))
                else:
                    f[self.sel] = a.get("value", "")
            elif self.first and not self.multi:
                f.setdefault(self.sel, a.get("value", ""))
            self.first = False

    def handle_endtag(self, tag):
        if tag == "select":
            self.sel = None
        elif tag == "form":
            self.cur = None


def drks_export(status):
    """Search DRKS for one recruitment status and return the JSON export (the same steps as the website's Download button)."""
    jar = cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    op.addheaders = [("User-Agent", UA)]

    def page(url, data=None):
        body = urllib.parse.urlencode(data, doseq=True).encode() if data is not None else None
        with op.open(url, data=body, timeout=300) as r:
            return r.geturl(), r.read()

    url, raw = page(DRKS + "/en")
    f = Forms(); f.feed(raw.decode("utf-8", "replace"))
    sf = f.forms["searchForm"]
    fields = dict(sf["fields"])
    status_key = next((k for k in fields if k.endswith(":trialStatus")), None)
    if not status_key:
        raise RuntimeError(f"DRKS search form has no status field; forms {list(f.forms)}; fields {list(fields)[:40]}")
    fields[status_key] = status
    fields[sf["buttons"][-1]] = ""  # the last button of the form is "Search"
    url, raw = page(urllib.parse.urljoin(url, sf["action"]), fields)
    f = Forms(); f.feed(raw.decode("utf-8", "replace"))
    if "resultForm" not in f.forms:
        msg = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", raw.decode("utf-8", "replace")))
        raise RuntimeError("DRKS search page changed: " + msg[msg.find("German Clinical Trials Register"):][:300])
    rf = f.forms["resultForm"]
    fields = dict(rf["fields"])
    fields["selectedType"] = "JSON"
    btn = next((b for b in rf["buttons"] if b.endswith("downloadTrial")), None)
    if not btn:
        raise RuntimeError(f"DRKS results page has no download button; buttons {rf['buttons'][:40]}; fields {list(rf['fields'])[:40]}")
    fields[btn.rsplit(":", 1)[0] + ":confirmationDownload"] = "on"  # "I accept the terms of use"
    fields[btn] = ""
    page(urllib.parse.urljoin(url, rf["action"]), fields)
    _, raw = page(DRKS + "/download/export")
    with zipfile.ZipFile(io.BytesIO(raw)) as z:
        return json.loads(z.read(z.namelist()[0]).decode("utf-8"))


def drks_loc(items, key, lang="en"):
    """Pick the English text of a list of {idLocale:{locale}, key: ...}, else German."""
    by = {((x.get("idLocale") or x.get("idArm") or {}).get("locale")): x.get(key) for x in items or []}
    return (by.get(lang) or by.get("de") or "").strip()


def drks_age(a):
    if not a or a.get("amount") is None:
        return None
    return bt.years(f"{a['amount']} {str(a.get('unit', 'YEARS')).lower().rstrip('s')}")


def drks_rows(skip):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    out, dup, old, abroad = [], 0, 0, 0
    for status, st in (("RECRUITING", "R"), ("PENDING", "NYR")):
        for x in drks_export(status):
            if max(x.get("lastUpdate") or "", x.get("registrationDrks") or "") < DRKS_FROM:
                old += 1
                continue
            rec = x.get("recruitment") or {}
            if "DE" not in [((c.get("idCountry") or {}).get("code")) for c in rec.get("countries") or []]:
                abroad += 1
                continue
            sec = x.get("secondaryIds") or {}
            other = (sec.get("otherPrimaryRegisterId") or "").strip().upper()
            eudract = (sec.get("eudraCtNumber") or "").strip()
            nct = other if other.startswith("NCT") else ""
            if x["drksId"] in skip or nct in skip or other in skip or (eudract and eudract in skip):
                dup += 1
                continue
            d = x.get("trialDescriptions") or []
            title = drks_loc(d, "title") or x["drksId"]
            conds = []
            for c in x.get("studiedHealthConditions") or []:
                t = drks_loc(c.get("studiedHealthConditionDescriptions"), "comment")
                if t and t not in conds:
                    conds.append(t)
            rd = rec.get("recruitmentDescriptions") or []
            inc, exc = drks_loc(rd, "inclusionCriteria"), drks_loc(rd, "exclusionCriteria")
            sc = x.get("studyCharacteristic") or {}
            arms = [g.get("comment", "").strip() for g in x.get("observationalGroups") or []
                    if (g.get("idArm") or {}).get("locale") == "en" and g.get("comment")]
            armtxt = " ".join(arms)
            iv = ["drug"] if eudract or DRKS_DRUG.search(armtxt) else ["device"] if DRKS_DEVICE.search(armtxt) \
                else ["behav"] if DRKS_BEHAV.search(armtxt) else ["other"]
            kind = "obs" if sc.get("type") == "NON_INTERVENTIONAL" else bt.KIND.get(sc.get("purpose") or "", "support")
            cc, sp = "", ""
            for c in x.get("trialContacts") or []:
                t, ct = (c.get("idContactIdType") or {}).get("type"), c.get("contact") or {}
                if t == "PUBLIC_QUERIES" and not cc:
                    who = " ".join(v for v in (ct.get("title"), ct.get("firstName"), ct.get("lastName")) if v)
                    cc = contact(who, ct.get("affiliation"), ct.get("phone"), ct.get("email"))
                if t == "PRIMARY_SPONSOR" and not sp:
                    sp = ct.get("affiliation") or " ".join(v for v in (ct.get("firstName"), ct.get("lastName")) if v)
            sites = [{"f": (i.get("name") or "Study site")[:160], "city": clean_city(i.get("city")), "zip": "", "s": st, "pr": "", "c": ""}
                     for i in rec.get("institutes") or []]
            if not sites:
                continue
            g = (rec.get("gender") or "ALL").upper()
            out.append({"id": x["drksId"], "src": "drks", "title": title, "official": "", "ac": (drks_loc(d, "acronym") or "")[:25],
                        "conds": conds, "anc": [], "rare": False, "summary": drks_loc(d, "summary"),
                        "crit": (f"Inclusion criteria:\n{inc}" if inc else "") + (f"\nExclusion criteria:\n{exc}" if exc else ""),
                        "kind": kind, "ph": DRKS_PHASE.get(sc.get("phase") or "", ""),
                        "a0": drks_age(rec.get("minimumAge")), "a1": drks_age(rec.get("maximumAge")),
                        "sx": "F" if g == "FEMALE" else "M" if g == "MALE" else "A", "hv": bool(rec.get("healthyVolunteers")),
                        "upd": x.get("lastUpdate") or "", "pcd": rec.get("scheduledCompletionDate") or "",
                        "start": rec.get("actualStartDate") or rec.get("scheduledStartDate") or "", "sp": sp, "cc": cc, "iv": iv,
                        "ivs": [{"type": "ARM", "name": a[:300]} for a in arms], "sites": sites, "nct": nct, "retrieved": today})
            skip.add(x["drksId"])
    bt.log(f"DRKS: {len(out)} trials added; {dup} already on ClinicalTrials.gov, CTIS or ISRCTN; "
           f"{old} left out because they were last updated before 2025 (not under the open licence); {abroad} recruit only outside Germany")
    return out


# ---------- map positions ----------
def geocode(rows, known):
    """known: {ckey(city): (lat, lon)} from ClinicalTrials.gov sites in the same country."""
    path = os.path.join(bt.REF, "geo.json")
    cache = {}
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            cache = json.load(f)
    cc = {"France": "fr", "Germany": "de", "Italy": "it", "Spain": "es", "United Kingdom": "gb"}[bt.COUNTRY]
    looked, placed, missing = 0, 0, 0
    for r in rows:
        for s in r["sites"]:
            k = bt.ckey(s["city"])
            pos = known.get(k) if k else None
            ck = f"{cc}|{k}|{s['zip'][:3] if not k else ''}"
            if pos is None and (k or s["zip"]):
                if ck in cache:
                    pos = cache[ck]
                elif looked < 600:
                    looked += 1
                    qs = {"format": "json", "limit": 1, "countrycodes": cc}
                    if k:
                        qs["city"] = s["city"]
                    if s["zip"] and not k:
                        qs["postalcode"] = s["zip"]
                    try:
                        j = http("https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(qs), tries=2, timeout=30)
                        pos = [round(float(j[0]["lat"]), 4), round(float(j[0]["lon"]), 4)] if j else None
                    except Exception:
                        pos = None
                    cache[ck] = pos
                    time.sleep(1.1)
            if pos is None and k and s["zip"]:
                zk = f"{cc}||{s['zip'].replace(' ', '')[:5]}"
                if zk in cache:
                    pos = cache[zk]
                elif looked < 600:
                    looked += 1
                    try:
                        j = http("https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
                            {"format": "json", "limit": 1, "countrycodes": cc, "postalcode": s["zip"]}), tries=2, timeout=30)
                        pos = [round(float(j[0]["lat"]), 4), round(float(j[0]["lon"]), 4)] if j else None
                    except Exception:
                        pos = None
                    cache[zk] = pos
                    time.sleep(1.1)
            if pos:
                s["lat"], s["lon"] = pos[0], pos[1]
                placed += 1
            else:
                s["lat"], s["lon"] = None, None
                missing += 1
    with open(path, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, separators=(",", ":"))
    bt.log(f"Map positions: {placed} sites placed, {missing} without a position ({looked} new place lookups)")


# ---------- into the finder's format ----------
def to_row(x):
    x["title"] = " ".join((x["title"] or x["official"] or x["id"]).split())
    x["official"] = " ".join((x["official"] or "").split())
    if x["a1"] is not None and x["a1"] >= 90:
        x["a1"] = None  # registries use 99, 100 or 120 to mean "no upper limit"
    ident = {"briefTitle": x["title"], "officialTitle": x["official"]}
    conds = {"conditions": x["conds"], "keywords": ["rare disease"] if x["rare"] else []}
    areas = bt.classify(ident, conds, [], x["anc"], x["hv"])
    extent = []
    if "oncology" in areas:
        txt = " | ".join([x["title"], *x["conds"]]) + " | " + bt.NOT_ADV.sub(" ", re.split(r"exclusion criteria", x["crit"], flags=re.I)[0])
        extent = [k for k, rx in (("early", bt.EARLY), ("advanced", bt.ADV)) if rx.search(txt)]
    row = {"id": x["id"], "src": x["src"], "t": x["title"], "ac": x["ac"], "k": x["kind"], "ph": x["ph"], "areas": areas, "x": extent,
           "sx": x["sx"], "a0": x["a0"], "a1": x["a1"], "hv": x["hv"], "upd": x["upd"], "pcd": x["pcd"], "sp": x["sp"],
           "sites": x["sites"], "cc": x["cc"], "iv": x["iv"]}
    detail = {"id": x["id"], "src": x["src"], "title": x["title"], "official": x["official"], "summary": x["summary"],
              "conditions": x["conds"], "interventions": x["ivs"], "criteria": x["crit"],
              "minAge": f"{x['a0']:g} Years" if x["a0"] is not None else "", "maxAge": f"{x['a1']:g} Years" if x["a1"] is not None else "",
              "sex": {"F": "FEMALE", "M": "MALE"}.get(x["sx"], "ALL"), "healthy": x["hv"], "studyType": "OBSERVATIONAL" if x["kind"] == "obs" else "INTERVENTIONAL",
              "purpose": "", "enrollment": None, "start": x["start"], "pcd": x["pcd"], "upd": x["upd"], "sponsor": x["sp"],
              "areas": sorted(areas), "central": [x["cc"]] if x["cc"] else [], "sites": x["sites"], "sitesOutside": 0}
    if x.get("nct"):
        detail["nct"] = x["nct"]
    if x.get("retrieved"):
        detail["retrieved"] = x["retrieved"]
    return row, detail


def run(module, ct_ids, ct_rows):
    """Return (rows, details, counts) for COUNTRY from CTIS and ISRCTN, skipping trials already in ct_ids."""
    global bt, CTIS_CACHE
    bt = module
    CTIS_CACHE = os.path.join(bt.REF, "ctis.json.gz")
    country = bt.COUNTRY
    known = {}
    for r in ct_rows:
        for s in r["sites"]:
            if s.get("lat") is not None:
                known.setdefault(bt.ckey(s["city"]), (s["lat"], s["lon"]))
    skip = set(ct_ids)
    found, counts = [], {}
    if country in CTIS_COUNTRIES:
        try:
            c = ctis_rows(country, skip)
            found += c
            counts["ctis"] = len(c)
            skip |= {x["id"] for x in c}
        except Exception as e:
            bt.log(f"CTIS step skipped ({e!r})")
    try:
        i = isrctn_rows(country, skip)
        found += i
        counts["isrctn"] = len(i)
    except Exception as e:
        bt.log(f"ISRCTN step skipped ({e!r})")
    if country == "Germany":
        try:
            skip |= {x["id"] for x in found} | {x["nct"] for x in found if x.get("nct")}
            dk = drks_rows(skip)
            found += dk
            counts["drks"] = len(dk)
        except Exception as e:
            bt.log(f"DRKS step skipped ({e!r})")
    geocode(found, known)
    out = [to_row(x) for x in found]
    return out, counts
