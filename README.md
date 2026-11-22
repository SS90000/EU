# Clinical Trial Finder · Europe (beta)

Patient-facing finders for open clinical trials in France, Germany, Italy, Spain and the United Kingdom, by Salish Seven.

- Country picker: https://ss90000.github.io/EU/
- Each country: `/fr/`, `/de/`, `/it/`, `/es/`, `/uk/`, with four sections each: `oncology/`, `neurology/`, `other/`, `rare/`
- Languages: English plus the national language (French, German, Italian, Spanish). Study details from the registry stay in English.

Data is rebuilt daily by `.github/workflows/update-trials.yml` (one data folder per country under `data/`):

1. ClinicalTrials.gov: every recruiting or not-yet-recruiting study with a site in the country.
2. EU CTIS (euclinicaltrials.eu), for France, Germany, Italy and Spain: trials whose status in that country is authorised, started or recruiting. Code: `.github/eu_registries.py`.
3. ISRCTN (isrctn.com), all five countries: ongoing trials with a site in the country and a recruitment period that has not ended.

A trial whose CTIS or ISRCTN record gives a ClinicalTrials.gov number already in step 1 (or that a ClinicalTrials.gov record lists as a secondary ID) is skipped, so each trial appears once. Each card shows a small registry label when it does not come from ClinicalTrials.gov, and the record link goes to that registry. CTIS and ISRCTN records have no map coordinates; positions come from the same city on ClinicalTrials.gov, otherwise from OpenStreetMap Nominatim (cached in `data/_ref/geo.json`). The CTIS download is cached in `data/_ref/ctis.json.gz` and only changed records are fetched again.

## What is not included yet

- Trials registered only in national registries, such as DRKS (Germany). DRKS has no public API; its website offers a bulk download that requires accepting its terms of use, so it is left for a later step.
- ISRCTN or CTIS trials that list no site in the country (only the country), since they cannot be placed on the map or matched to a city.
- Studies not open to new participants (active but not recruiting, by invitation, suspended, completed). Counts are in each `data/<country>/meta.json` under `notIncluded`.

Not medical advice.
