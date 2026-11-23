# Find My Trial™ · Europe (pilot)

Find My Trial™: patient-facing search for open clinical trials in France, Germany, Italy, Spain and the United Kingdom, by Salish Seven.

- Country picker: https://ss90000.github.io/EU/
- Each country: `/fr/`, `/de/`, `/it/`, `/es/`, `/uk/`, with four sections each: `oncology/`, `neurology/`, `other/`, `rare/`
- Languages: English plus the national language (French, German, Italian, Spanish). Study details from the registry stay in English.

Data is rebuilt daily by `.github/workflows/update-trials.yml` (one data folder per country under `data/`):

1. ClinicalTrials.gov: every recruiting or not-yet-recruiting study with a site in the country.
2. EU CTIS (euclinicaltrials.eu), for France, Germany, Italy and Spain: trials whose status in that country is authorised, started or recruiting. Code: `.github/eu_registries.py`.
3. ISRCTN (isrctn.com), all five countries: ongoing trials with a site in the country and a recruitment period that has not ended.
4. DRKS, the German Clinical Trials Register (drks.de, run by BfArM), for Germany: studies that are recruiting or about to recruit and were registered or last updated from 2025. DRKS publishes those records under CC BY 4.0; older records may be under copyright and are left out. The build uses the website's own bulk JSON download (the same search and "Download" steps a person takes, ticking "I accept the terms of use", which Salish Seven has reviewed and accepted). As the DRKS terms require, every DRKS study shows the source (DRKS) and the date the data was retrieved. DRKS sites have a name and city only, so map positions are looked up by city.

A trial whose CTIS, ISRCTN or DRKS record gives a ClinicalTrials.gov number already in step 1 (or that a ClinicalTrials.gov record lists as a secondary ID) is skipped, so each trial appears once. Each card shows a small registry label when it does not come from ClinicalTrials.gov, and the record link goes to that registry. CTIS and ISRCTN records have no map coordinates; positions come from the same city on ClinicalTrials.gov, otherwise from OpenStreetMap Nominatim (cached in `data/_ref/geo.json`). The CTIS download is cached in `data/_ref/ctis.json.gz` and only changed records are fetched again.

## What is not included yet

- DRKS records last updated before 2025, which the DRKS terms say may be under copyright.
- Trials found only in other national registries.
- ISRCTN or CTIS trials that list no site in the country (only the country), since they cannot be placed on the map or matched to a city.
- Studies not open to new participants (active but not recruiting, by invitation, suspended, completed). Counts are in each `data/<country>/meta.json` under `notIncluded`.

Not medical advice.

## Quality checks

- **Duplicates.** A trial listed in more than one registry is shown once: CTIS and ISRCTN records are dropped when they give a ClinicalTrials.gov number already listed, or when a ClinicalTrials.gov record names them as a secondary ID.
- **Human review (November 2026).** A person checked 10 trials from the new registries (two per country, EU CTIS and ISRCTN) against the registry record. 1 was in the wrong section (a stop-smoking study offered at lung cancer screening, filed under cancer) and none had the wrong intervention type. The rule was fixed for all three sites. The ClinicalTrials.gov part uses the same rules as Canada and the US, where 45 reviewed studies had 4 in the wrong section, all fixed.

The sorting into sections and categories is automatic (text matching), so some studies will still be in the wrong place. Each pattern found in a review is fixed in `.github/build_trials.py` so that every similar study moves too, not just the one reviewed.
