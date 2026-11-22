/* Country settings for the EU5 finders. Each page sets COUNTRY_CODE before loading this file.
   Every label list is [English, French, German, Italian, Spanish]. */
"use strict";
const EU_HELP = {
  cancerLine: (org, num) => [
    `For cancer information and support, ${org} can be reached free of charge on ${num}.`,
    `Pour de l'information et du soutien sur le cancer, ${org} répond gratuitement au ${num}.`,
    `Informationen und Unterstützung zu Krebs erhalten Sie kostenlos bei ${org} unter ${num}.`,
    `Per informazioni e supporto sul cancro, ${org} risponde gratuitamente al numero ${num}.`,
    `Para información y apoyo sobre el cáncer, ${org} atiende gratuitamente en el ${num}.`],
  doctor: extra => [
    `For general health advice, contact your doctor${extra ? `, or call ${extra}` : ""}.`,
    `Pour des conseils de santé, communiquez avec votre médecin${extra ? ` ou appelez le ${extra}` : ""}.`,
    `Für allgemeine gesundheitliche Fragen wenden Sie sich an Ihre Ärztin oder Ihren Arzt${extra ? ` oder rufen Sie ${extra} an` : ""}.`,
    `Per consigli sulla salute, rivolgetevi al vostro medico${extra ? ` o chiamate il ${extra}` : ""}.`,
    `Para consejos de salud, consulte a su médico${extra ? ` o llame al ${extra}` : ""}.`],
  crisis: (num, name) => [
    `If you are in crisis or thinking about suicide, call ${num} (${name}).`,
    `En situation de crise ou si vous pensez au suicide, appelez le ${num} (${name}).`,
    `Wenn Sie in einer Krise sind oder an Suizid denken, rufen Sie ${num} an (${name}).`,
    `Se siete in crisi o pensate al suicidio, chiamate il ${num} (${name}).`,
    `Si está en crisis o piensa en el suicidio, llame al ${num} (${name}).`],
  gdpr: ["the EU General Data Protection Regulation (GDPR)", "le Règlement général sur la protection des données (RGPD)",
         "die Datenschutz-Grundverordnung (DSGVO)", "il Regolamento generale sulla protezione dei dati (GDPR)", "el Reglamento General de Protección de Datos (RGPD)"],
  notAffiliated: ["ClinicalTrials.gov or the U.S. National Library of Medicine", "ClinicalTrials.gov, la National Library of Medicine des États-Unis",
                  "ClinicalTrials.gov oder der U.S. National Library of Medicine", "ClinicalTrials.gov o la U.S. National Library of Medicine",
                  "ClinicalTrials.gov o la Biblioteca Nacional de Medicina de EE. UU."],
  region: ["Region", "Région", "Region", "Regione", "Región"],
  anywhere: n => [`Anywhere in ${n[0]}`, `Partout ${n[1]}`, `Überall ${n[2]}`, `Ovunque ${n[3]}`, `En todo ${n[4]}`]
};
const EU_COUNTRIES = {
  fr: { code: "FR", reg: "France", name: ["France", "France", "Frankreich", "Francia", "Francia"],
        inName: ["in France", "en France", "in Frankreich", "in Francia", "en Francia"],
        anyIn: ["France", "en France", "in Frankreich", "in Francia", "Francia"],
        langs: ["fr", "en"], locales: { fr: "fr-FR", en: "en-GB" }, unit: "km", dists: [10, 25, 50, 100, 250],
        center: [46.6, 2.4], zoom: 5, mapName: "France", emergency: "112",
        support: { oncology: EU_HELP.cancerLine("Cancer info (Institut national du cancer)", "0 805 123 124"), other: EU_HELP.doctor("116 117") },
        crisis: EU_HELP.crisis("3114", "numéro national de prévention du suicide") },
  de: { code: "DE", reg: "Germany", name: ["Germany", "Allemagne", "Deutschland", "Germania", "Alemania"],
        inName: ["in Germany", "en Allemagne", "in Deutschland", "in Germania", "en Alemania"],
        anyIn: ["Germany", "en Allemagne", "in Deutschland", "in Germania", "Alemania"],
        langs: ["de", "en"], locales: { de: "de-DE", en: "en-GB" }, unit: "km", dists: [10, 25, 50, 100, 250],
        center: [51.2, 10.4], zoom: 5, mapName: "Germany", emergency: "112",
        support: { oncology: EU_HELP.cancerLine("der Krebsinformationsdienst (DKFZ)", "0800 420 30 40"), other: EU_HELP.doctor("116 117") },
        crisis: EU_HELP.crisis("0800 111 0 111", "TelefonSeelsorge") },
  it: { code: "IT", reg: "Italy", name: ["Italy", "Italie", "Italien", "Italia", "Italia"],
        inName: ["in Italy", "en Italie", "in Italien", "in Italia", "en Italia"],
        anyIn: ["Italy", "en Italie", "in Italien", "in Italia", "Italia"],
        langs: ["it", "en"], locales: { it: "it-IT", en: "en-GB" }, unit: "km", dists: [10, 25, 50, 100, 250],
        center: [42.5, 12.5], zoom: 5, mapName: "Italy", emergency: "112",
        support: { oncology: EU_HELP.cancerLine("AIMaC", "840 503 579"), other: EU_HELP.doctor("") },
        crisis: EU_HELP.crisis("02 2327 2327", "Telefono Amico Italia") },
  es: { code: "ES", reg: "Spain", name: ["Spain", "Espagne", "Spanien", "Spagna", "España"],
        inName: ["in Spain", "en Espagne", "in Spanien", "in Spagna", "en España"],
        anyIn: ["Spain", "en Espagne", "in Spanien", "in Spagna", "España"],
        langs: ["es", "en"], locales: { es: "es-ES", en: "en-GB" }, unit: "km", dists: [10, 25, 50, 100, 250],
        center: [40.2, -3.7], zoom: 5, mapName: "Spain", emergency: "112",
        support: { oncology: EU_HELP.cancerLine("Infocáncer (Asociación Española Contra el Cáncer)", "900 100 036"), other: EU_HELP.doctor("") },
        crisis: EU_HELP.crisis("024", "Línea 024 de atención a la conducta suicida") },
  uk: { code: "GB", reg: "United Kingdom", name: ["United Kingdom", "Royaume-Uni", "Vereinigtes Königreich", "Regno Unito", "Reino Unido"],
        inName: ["in the United Kingdom", "au Royaume-Uni", "im Vereinigten Königreich", "nel Regno Unito", "en el Reino Unido"],
        anyIn: ["the UK", "au Royaume-Uni", "im Vereinigten Königreich", "nel Regno Unito", "Reino Unido"],
        langs: ["en"], locales: { en: "en-GB" }, unit: "mi", dists: [10, 25, 50, 100, 200],
        center: [54.5, -3], zoom: 5, mapName: "United Kingdom", emergency: "999",
        support: { oncology: EU_HELP.cancerLine("the Macmillan Support Line", "0808 808 00 00"), other: EU_HELP.doctor("NHS 111") },
        crisis: EU_HELP.crisis("116 123", "Samaritans"),
        privacyLaw: ["the UK GDPR and the Data Protection Act 2018", "le RGPD britannique et la Data Protection Act 2018", "die britische DSGVO und den Data Protection Act 2018",
                     "il GDPR britannico e il Data Protection Act 2018", "el RGPD del Reino Unido y la Data Protection Act 2018"] }
};
const COUNTRY = EU_COUNTRIES[typeof COUNTRY_CODE === "string" ? COUNTRY_CODE : "fr"];
COUNTRY.region = EU_HELP.region;
COUNTRY.regionAny = EU_HELP.anywhere(COUNTRY.anyIn);
COUNTRY.privacyLaw = COUNTRY.privacyLaw || EU_HELP.gdpr;
COUNTRY.notAffiliated = EU_HELP.notAffiliated;
COUNTRY.regionFr = {};
