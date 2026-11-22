# Clinical Trial Finder · Europe (beta)

Patient-facing finders for open clinical trials in France, Germany, Italy, Spain and the United Kingdom, by Salish Seven.

- Country picker: https://ss90000.github.io/EU/
- Each country: `/fr/`, `/de/`, `/it/`, `/es/`, `/uk/`, with four sections each: `oncology/`, `neurology/`, `other/`, `rare/`
- Languages: English plus the national language (French, German, Italian, Spanish). Study details from the registry stay in English.

Data comes from ClinicalTrials.gov and is rebuilt daily by `.github/workflows/update-trials.yml` (one data folder per country under `data/`).

## What is not included yet

- Trials registered only in the EU Clinical Trials Information System (CTIS), the UK's ISRCTN registry or national registries such as DRKS (Germany). Adding these is the planned second step.
- Studies not open to new participants (active but not recruiting, by invitation, suspended, completed). Counts are in each `data/<country>/meta.json` under `notIncluded`.

Not medical advice.
