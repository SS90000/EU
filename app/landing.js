/* Country landing page for the EU5 finders: four area cards with today's counts. Uses COUNTRY (countries.js) and ORG (settings.js). */
"use strict";
(() => {
  const LANGS = ["en", "fr", "de", "it", "es"], LI = l => Math.max(0, LANGS.indexOf(l));
  const T = {
    en: { h1: c => `Find clinical trials ${c}`, lede: "Choose an area to search open clinical trials and studies near you. Each section shows every site's status and contact and the full eligibility criteria, so you can raise the right studies with your care team.",
          onc: "Cancer", oncP: "All types of cancer, including blood cancers and childhood cancers.", neu: "Neurological conditions", neuP: "Stroke, epilepsy, MS, Parkinson's, dementia, migraine, ALS and more.",
          oth: "Other conditions", othP: "Heart, lungs, diabetes, mental health, infections, pregnancy and healthy volunteers.", rar: "Rare diseases", rarP: "Rare cancers and rare neurological, genetic, blood and metabolic conditions. These studies also appear in the other sections.",
          go: "Open →", studies: n => `${n} open studies`, all: "All countries",
          note: d => `Pilot. Not medical advice. Data from ClinicalTrials.gov, the EU's CTIS and ISRCTN, updated daily${d ? ` (last update ${d})` : ""}. Trials registered only in national registries (such as Germany's DRKS) are not included yet. In an emergency, call ${COUNTRY.emergency}.`,
          foot: `Operated by ${ORG.name}. Not affiliated with or endorsed by ClinicalTrials.gov or the U.S. National Library of Medicine.` },
    fr: { h1: c => `Trouver des essais cliniques ${c}`, lede: "Choisissez un domaine pour chercher des essais et des études ouverts près de chez vous. Chaque section indique le statut et le contact de chaque site et les critères d'admissibilité complets.",
          onc: "Cancer", oncP: "Tous les types de cancer, y compris les cancers du sang et de l'enfant.", neu: "Maladies neurologiques", neuP: "AVC, épilepsie, SEP, Parkinson, démence, migraine, SLA et plus.",
          oth: "Autres maladies", othP: "Cœur, poumons, diabète, santé mentale, infections, grossesse et volontaires sains.", rar: "Maladies rares", rarP: "Cancers rares et maladies rares neurologiques, génétiques, sanguines et métaboliques. Ces études figurent aussi dans les autres sections.",
          go: "Ouvrir →", studies: n => `${n} études ouvertes`, all: "Tous les pays",
          note: d => `Pilote. Ne constitue pas un avis médical. Données de ClinicalTrials.gov, du CTIS européen et d'ISRCTN, mises à jour chaque jour${d ? ` (dernière mise à jour : ${d})` : ""}. Les essais inscrits seulement dans des registres nationaux ne sont pas encore inclus. En cas d'urgence, composez le ${COUNTRY.emergency}.`,
          foot: `Exploité par ${ORG.name}. Non affilié à ClinicalTrials.gov ni à la National Library of Medicine des États-Unis, et non approuvé par eux.` },
    de: { h1: c => `Klinische Studien ${c} finden`, lede: "Wählen Sie ein Gebiet, um offene klinische Studien in Ihrer Nähe zu suchen. Jeder Bereich zeigt Status und Kontakt jedes Zentrums und die vollständigen Teilnahmekriterien.",
          onc: "Krebs", oncP: "Alle Krebsarten, auch Blutkrebs und Krebs im Kindesalter.", neu: "Neurologische Erkrankungen", neuP: "Schlaganfall, Epilepsie, MS, Parkinson, Demenz, Migräne, ALS und mehr.",
          oth: "Andere Erkrankungen", othP: "Herz, Lunge, Diabetes, psychische Gesundheit, Infektionen, Schwangerschaft und gesunde Freiwillige.", rar: "Seltene Erkrankungen", rarP: "Seltene Krebsarten und seltene neurologische, genetische, Blut- und Stoffwechselerkrankungen. Diese Studien erscheinen auch in den anderen Findern.",
          go: "Öffnen →", studies: n => `${n} offene Studien`, all: "Alle Länder",
          note: d => `Pilot. Keine medizinische Beratung. Daten von ClinicalTrials.gov, dem EU-Register CTIS und ISRCTN, täglich aktualisiert${d ? ` (letzte Aktualisierung ${d})` : ""}. Studien, die nur in nationalen Registern wie dem DRKS stehen, sind noch nicht enthalten. Im Notfall rufen Sie ${COUNTRY.emergency} an.`,
          foot: `Betrieben von ${ORG.name}. Nicht verbunden mit ClinicalTrials.gov oder der U.S. National Library of Medicine und nicht von ihnen unterstützt.` },
    it: { h1: c => `Trova studi clinici ${c}`, lede: "Scegli un'area per cercare studi clinici aperti vicino a te. Ogni area mostra lo stato e il contatto di ogni centro e i criteri di partecipazione completi.",
          onc: "Cancro", oncP: "Tutti i tipi di tumore, compresi i tumori del sangue e dell'infanzia.", neu: "Malattie neurologiche", neuP: "Ictus, epilessia, SM, Parkinson, demenza, emicrania, SLA e altro.",
          oth: "Altre malattie", othP: "Cuore, polmoni, diabete, salute mentale, infezioni, gravidanza e volontari sani.", rar: "Malattie rare", rarP: "Tumori rari e malattie rare neurologiche, genetiche, del sangue e del metabolismo. Questi studi compaiono anche nelle altre aree.",
          go: "Apri →", studies: n => `${n} studi aperti`, all: "Tutti i paesi",
          note: d => `Pilota. Non è un parere medico. Dati di ClinicalTrials.gov, del CTIS europeo e di ISRCTN, aggiornati ogni giorno${d ? ` (ultimo aggiornamento ${d})` : ""}. Gli studi registrati solo in registri nazionali non sono ancora inclusi. In caso di emergenza chiama il ${COUNTRY.emergency}.`,
          foot: `Gestito da ${ORG.name}. Non affiliato a ClinicalTrials.gov né alla U.S. National Library of Medicine, e non approvato da loro.` },
    es: { h1: c => `Encuentre ensayos clínicos ${c}`, lede: "Elija un área para buscar ensayos y estudios clínicos abiertos cerca de usted. Cada área muestra el estado y el contacto de cada centro y los criterios de participación completos.",
          onc: "Cáncer", oncP: "Todos los tipos de cáncer, incluidos los de la sangre y los infantiles.", neu: "Enfermedades neurológicas", neuP: "Ictus, epilepsia, EM, párkinson, demencia, migraña, ELA y más.",
          oth: "Otras enfermedades", othP: "Corazón, pulmones, diabetes, salud mental, infecciones, embarazo y voluntarios sanos.", rar: "Enfermedades raras", rarP: "Cánceres raros y enfermedades raras neurológicas, genéticas, de la sangre y metabólicas. Estos estudios también aparecen en las otras áreas.",
          go: "Abrir →", studies: n => `${n} estudios abiertos`, all: "Todos los países",
          note: d => `Piloto. No es consejo médico. Datos de ClinicalTrials.gov, del CTIS europeo y de ISRCTN, actualizados a diario${d ? ` (última actualización: ${d})` : ""}. Los ensayos registrados solo en registros nacionales aún no se incluyen. En caso de urgencia, llame al ${COUNTRY.emergency}.`,
          foot: `Gestionado por ${ORG.name}. Sin relación con ClinicalTrials.gov ni con la Biblioteca Nacional de Medicina de EE. UU., y sin su respaldo.` }
  };
  const NAMES = { en: "English", fr: "Français", de: "Deutsch", it: "Italiano", es: "Español" };
  const LBL = { en: "Language", fr: "Langue", de: "Sprache", it: "Lingua", es: "Idioma" };
  let lang = (() => {
    try { const q = new URLSearchParams(location.search).get("lang"); if (COUNTRY.langs.includes(q)) return q; } catch (e) {}
    try { const m = localStorage.getItem("ctf-lang"); if (COUNTRY.langs.includes(m)) return m; } catch (e) {}
    return COUNTRY.langs[0]; })();
  const pick = l => { lang = l; try { localStorage.setItem("ctf-lang", l); } catch (e) {} render(); };
  let META = null;
  const $ = id => document.getElementById(id);
  const loc = () => COUNTRY.locales[lang] || lang;
  function render() {
    const t = T[lang], i = LI(lang);
    document.documentElement.lang = lang;
    document.title = `${COUNTRY.name[i]} · Find My Trial™`;
    $("sub").textContent = `${COUNTRY.name[i]} · ${["Pilot", "Pilote", "Pilot", "Pilota", "Piloto"][i]}`;
    const g = $("langGroup"); g.hidden = COUNTRY.langs.length < 2;
    g.innerHTML = COUNTRY.langs.map(l => `<button type="button" data-lang="${l}" lang="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`).join("");
    g.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => pick(b.dataset.lang));
    let lp = $("langPick");
    if (!lp) { lp = document.createElement("div"); lp.id = "langPick"; lp.className = "langpick"; $("h1").before(lp); }
    lp.hidden = COUNTRY.langs.length < 2;
    lp.innerHTML = `<span>${LBL[lang]}:</span>` + COUNTRY.langs.map(l => `<button type="button" data-l="${l}" lang="${l}" aria-pressed="${l === lang}">${NAMES[l]}</button>`).join("");
    lp.querySelectorAll("[data-l]").forEach(b => b.onclick = () => pick(b.dataset.l));
    $("h1").textContent = t.h1(COUNTRY.inName[i]); $("lede").textContent = t.lede;
    document.querySelectorAll("[data-t]").forEach(el => el.textContent = t[el.dataset.t]);
    document.querySelectorAll("a.areacard").forEach(a => a.href = a.dataset.href + `?lang=${lang}`);
    $("allLink").href = "../" + (lang !== "en" ? `?lang=${lang}` : "");
    document.querySelectorAll("[data-n]").forEach(el => { const a = META && META.areas && META.areas[el.dataset.n]; el.textContent = a ? t.studies(a.studies.toLocaleString(loc())) : "…"; });
    const d = META ? new Date(META.built).toLocaleDateString(loc(), { year: "numeric", month: "short", day: "numeric" }) : "";
    $("note").textContent = t.note(d); $("foot").textContent = t.foot;
  }
  render();
  fetch(DATA + "meta.json").then(r => r.ok ? r.json() : null).then(m => { META = m; render(); }).catch(() => {});
})();
