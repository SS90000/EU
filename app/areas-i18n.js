/* German, Italian and Spanish wording for the four finder areas. Adds them after English and French in areas.js. */
"use strict";
(() => {
  const X = {
    oncology: {
      brand: ["Studienfinder Krebs", "Ricerca studi clinici sul cancro", "Buscador de ensayos sobre cáncer"],
      short: ["Alle Krebsarten", "Tutti i tumori", "Todos los cánceres"],
      studies: ["offene Krebsstudien", "studi oncologici aperti", "estudios de cáncer abiertos"],
      h1: c => [`Klinische Krebsstudien ${c[2]} finden`, `Trova studi clinici sul cancro ${c[3]}`, `Encuentre ensayos clínicos sobre cáncer ${c[4]}`],
      lede: ["Suchen Sie offene klinische Studien zu jeder Krebsart, in Ihrer Nähe oder im ganzen Land. Sehen Sie Status und Kontakt jedes Studienzentrums und lesen Sie die vollständigen Teilnahmekriterien, damit Sie die passenden Studien mit Ihrem Behandlungsteam besprechen können.",
             "Cerca studi clinici aperti per qualsiasi tipo di tumore, vicino a te o in tutto il paese. Vedi lo stato e il contatto di ogni centro e leggi i criteri di partecipazione completi, per parlarne con la tua équipe di cura.",
             "Busque ensayos y estudios clínicos abiertos para cualquier tipo de cáncer, cerca de usted o en todo el país. Vea el estado y el contacto de cada centro y lea los criterios de participación completos, para hablarlo con su equipo médico."],
      tagNote: ["Krebsart und Krankheitsstadium werden automatisch erkannt und können falsch sein.", "Il tipo di tumore e lo stadio sono rilevati automaticamente e possono essere errati.", "El tipo de cáncer y el estadio se detectan automáticamente y pueden ser erróneos."],
      catLabel: ["Krebsart", "Tipo di tumore", "Tipo de cáncer"], catAny: ["Jede Krebsart", "Qualsiasi tipo di tumore", "Cualquier tipo de cáncer"],
      about: ["zu Krebs", "sul cancro", "sobre el cáncer"],
      tagged: ["Die Krebsart jeder Studie, und ob sie für ein frühes oder fortgeschrittenes Stadium gedacht scheint, werden", "Il tipo di tumore di ogni studio, e se sembra rivolto a una malattia iniziale o avanzata, sono rilevati", "El tipo de cáncer de cada estudio, y si parece dirigido a una enfermedad inicial o avanzada, se detectan"],
      cats: {
        breast: ["Brust", "Mammella", "Mama"], lung: ["Lunge", "Polmone", "Pulmón"], prostate: ["Prostata", "Prostata", "Próstata"],
        colorectal: ["Darm und Anus", "Colon-retto e ano", "Colorrectal y anal"], upperGI: ["Magen und Speiseröhre", "Stomaco ed esofago", "Estómago y esófago"],
        pancreas: ["Bauchspeicheldrüse", "Pancreas", "Páncreas"], liver: ["Leber und Gallenwege", "Fegato e vie biliari", "Hígado y vías biliares"], kidney: ["Niere", "Rene", "Riñón"],
        bladder: ["Blase und Harnwege", "Vescica e vie urinarie", "Vejiga y vías urinarias"], gyn: ["Gynäkologisch (Eierstock, Gebärmutter, Gebärmutterhals)", "Ginecologico (ovaio, utero, cervice)", "Ginecológico (ovario, útero, cuello uterino)"],
        headneck: ["Kopf und Hals", "Testa e collo", "Cabeza y cuello"], thyroid: ["Schilddrüse", "Tiroide", "Tiroides"], brain: ["Gehirn und Rückenmark", "Cervello e midollo spinale", "Cerebro y médula espinal"],
        skin: ["Haut und Melanom", "Pelle e melanoma", "Piel y melanoma"], leukemia: ["Leukämie und MDS", "Leucemia e MDS", "Leucemia y SMD"], lymphoma: ["Lymphom", "Linfoma", "Linfoma"],
        myeloma: ["Myelom und Plasmazellen", "Mieloma e plasmacellule", "Mieloma y células plasmáticas"], sarcoma: ["Sarkom und GIST", "Sarcoma e GIST", "Sarcoma y GIST"],
        neuroendocrine: ["Neuroendokrin", "Neuroendocrino", "Neuroendocrino"], germcell: ["Hoden und Keimzellen", "Testicolo e cellule germinali", "Testículo y células germinales"],
        mesothelioma: ["Mesotheliom", "Mesotelioma", "Mesotelioma"], childhood: ["Krebs im Kindesalter", "Tumori infantili", "Cánceres infantiles"],
        solid: ["Für viele solide Tumorarten offen", "Aperto a molti tipi di tumori solidi", "Abierto a muchos tipos de tumores sólidos"], general: ["Alle Krebsarten, Nachsorge und unterstützende Versorgung", "Qualsiasi tumore, sopravvivenza e cure di supporto", "Cualquier cáncer, supervivencia y cuidados de apoyo"]
      }
    },
    neurology: {
      brand: ["Studienfinder Neurologie", "Ricerca studi clinici in neurologia", "Buscador de ensayos en neurología"],
      short: ["Neurologische Erkrankungen", "Malattie neurologiche", "Enfermedades neurológicas"],
      studies: ["offene Studien zu neurologischen Erkrankungen", "studi aperti su malattie neurologiche", "estudios abiertos sobre enfermedades neurológicas"],
      h1: c => [`Klinische Studien zu neurologischen Erkrankungen ${c[2]} finden`, `Trova studi clinici su malattie neurologiche ${c[3]}`, `Encuentre ensayos clínicos sobre enfermedades neurológicas ${c[4]}`],
      lede: ["Suchen Sie offene klinische Studien zu Schlaganfall, Epilepsie, Multipler Sklerose, Parkinson, Demenz, Migräne, ALS und anderen neurologischen Erkrankungen. Sehen Sie Status und Kontakt jedes Studienzentrums und lesen Sie die vollständigen Teilnahmekriterien.",
             "Cerca studi clinici aperti su ictus, epilessia, sclerosi multipla, Parkinson, demenza, emicrania, SLA e altre malattie neurologiche. Vedi lo stato e il contatto di ogni centro e leggi i criteri di partecipazione completi.",
             "Busque ensayos y estudios clínicos abiertos sobre ictus, epilepsia, esclerosis múltiple, párkinson, demencia, migraña, ELA y otras enfermedades neurológicas. Vea el estado y el contacto de cada centro y lea los criterios de participación completos."],
      tagNote: ["Die Erkrankung jeder Studie wird automatisch erkannt und kann falsch sein.", "La malattia di ogni studio è rilevata automaticamente e può essere errata.", "La enfermedad de cada estudio se detecta automáticamente y puede ser errónea."],
      catLabel: ["Erkrankung", "Malattia", "Enfermedad"], catAny: ["Jede neurologische Erkrankung", "Qualsiasi malattia neurologica", "Cualquier enfermedad neurológica"],
      about: ["zu einer neurologischen Erkrankung", "su una malattia neurologica", "sobre una enfermedad neurológica"],
      tagged: ["Die Erkrankung jeder Studie wird", "La malattia di ogni studio è rilevata", "La enfermedad de cada estudio se detecta"],
      cats: {
        stroke: ["Schlaganfall und Hirngefäße", "Ictus e vasi del cervello", "Ictus y vasos del cerebro"], epilepsy: ["Epilepsie und Anfälle", "Epilessia e crisi", "Epilepsia y crisis"],
        ms: ["Multiple Sklerose und verwandte Erkrankungen", "Sclerosi multipla e malattie correlate", "Esclerosis múltiple y enfermedades relacionadas"], movement: ["Parkinson und Bewegungsstörungen", "Parkinson e disturbi del movimento", "Párkinson y trastornos del movimiento"],
        dementia: ["Alzheimer, Demenz und Gedächtnis", "Alzheimer, demenza e memoria", "Alzheimer, demencia y memoria"], headache: ["Migräne und Kopfschmerz", "Emicrania e cefalea", "Migraña y cefalea"],
        als: ["ALS und Motoneuronerkrankungen", "SLA e malattie del motoneurone", "ELA y enfermedades de la motoneurona"], neuromuscular: ["Nerven und Muskeln (Neuropathie, Myasthenie)", "Nervi e muscoli (neuropatia, miastenia)", "Nervios y músculos (neuropatía, miastenia)"],
        injury: ["Verletzungen von Gehirn und Rückenmark", "Lesioni del cervello e del midollo spinale", "Lesiones del cerebro y de la médula espinal"], braintumour: ["Tumoren von Gehirn und Rückenmark", "Tumori del cervello e del midollo", "Tumores del cerebro y la médula"],
        sleep: ["Schlafstörungen", "Disturbi del sonno", "Trastornos del sueño"], childneuro: ["Neurologische Erkrankungen im Kindesalter", "Malattie neurologiche dell'infanzia", "Enfermedades neurológicas infantiles"],
        neuroinfect: ["Entzündungen und Infektionen des Gehirns", "Infiammazioni e infezioni del cervello", "Inflamación e infección del cerebro"], generalneuro: ["Andere neurologische Erkrankungen", "Altre malattie neurologiche", "Otras enfermedades neurológicas"]
      }
    },
    other: {
      brand: ["Studienfinder", "Ricerca studi clinici", "Buscador de ensayos clínicos"],
      short: ["Andere Erkrankungen", "Altre malattie", "Otras enfermedades"],
      studies: ["offene Studien zu anderen Erkrankungen", "studi aperti su altre malattie", "estudios abiertos sobre otras enfermedades"],
      h1: c => [`Klinische Studien zu anderen Erkrankungen ${c[2]} finden`, `Trova studi clinici su altre malattie ${c[3]}`, `Encuentre ensayos clínicos sobre otras enfermedades ${c[4]}`],
      lede: ["Suchen Sie offene klinische Studien zu Herz- und Lungenerkrankungen, Diabetes, psychischer Gesundheit, Infektionen, Schwangerschaft, seltenen Erkrankungen und vielen anderen Erkrankungen, auch Studien für gesunde Freiwillige. Krebs und neurologische Erkrankungen haben eigene Finder.",
             "Cerca studi clinici aperti su cuore e polmoni, diabete, salute mentale, infezioni, gravidanza, malattie rare e molte altre malattie, compresi studi per volontari sani. Cancro e malattie neurologiche hanno i propri strumenti.",
             "Busque ensayos y estudios clínicos abiertos sobre corazón y pulmones, diabetes, salud mental, infecciones, embarazo, enfermedades raras y muchas otras, incluidos estudios para voluntarios sanos. El cáncer y las enfermedades neurológicas tienen sus propios buscadores."],
      tagNote: ["Das Gebiet jeder Studie wird automatisch erkannt und kann falsch sein.", "L'area di ogni studio è rilevata automaticamente e può essere errata.", "El área de cada estudio se detecta automáticamente y puede ser errónea."],
      catLabel: ["Gebiet", "Area", "Área"], catAny: ["Jede Erkrankung", "Qualsiasi malattia", "Cualquier enfermedad"],
      about: ["zu einer anderen Erkrankung als Krebs oder einer neurologischen Erkrankung", "su una malattia diversa dal cancro o da una malattia neurologica", "sobre una enfermedad distinta del cáncer o de una enfermedad neurológica"],
      tagged: ["Das Gebiet jeder Studie wird", "L'area di ogni studio è rilevata", "El área de cada estudio se detecta"],
      cats: {
        heart: ["Herz und Blutgefäße", "Cuore e vasi sanguigni", "Corazón y vasos sanguíneos"], mental: ["Psychische Gesundheit und Sucht", "Salute mentale e dipendenze", "Salud mental y adicciones"],
        lung: ["Lunge und Atmung", "Polmoni e respirazione", "Pulmones y respiración"], metabolic: ["Diabetes, Gewicht und Hormone", "Diabete, peso e ormoni", "Diabetes, peso y hormonas"],
        digestive: ["Verdauung und Leber", "Digestione e fegato", "Digestión e hígado"], kidney: ["Niere und Harnwege", "Reni e vie urinarie", "Riñón y vías urinarias"],
        women: ["Frauengesundheit und Schwangerschaft", "Salute femminile e gravidanza", "Salud de la mujer y embarazo"], immune: ["Immunsystem, Arthritis und Allergie", "Sistema immunitario, artrite e allergie", "Sistema inmunitario, artritis y alergia"],
        skin: ["Haut und Wunden", "Pelle e ferite", "Piel y heridas"], blood: ["Bluterkrankungen", "Malattie del sangue", "Trastornos de la sangre"], infection: ["Infektionen und Impfstoffe", "Infezioni e vaccini", "Infecciones y vacunas"],
        musculoskeletal: ["Knochen, Gelenke und Verletzungen", "Ossa, articolazioni e lesioni", "Huesos, articulaciones y lesiones"], eyeent: ["Augen, Ohren, Nase, Hals und Mund", "Occhi, orecchie, naso, gola e bocca", "Ojos, oídos, nariz, garganta y boca"],
        genetic: ["Genetische, seltene und Neugeborenen-Erkrankungen", "Malattie genetiche, rare e neonatali", "Enfermedades genéticas, raras y neonatales"], pain: ["Schmerz, Chirurgie und Intensivmedizin", "Dolore, chirurgia e terapia intensiva", "Dolor, cirugía y cuidados intensivos"],
        healthy: ["Studien für gesunde Freiwillige", "Studi per volontari sani", "Estudios para voluntarios sanos"], general: ["Andere Erkrankungen", "Altre malattie", "Otras enfermedades"]
      }
    },
    rare: {
      brand: ["Studienfinder Seltene Erkrankungen", "Ricerca studi sulle malattie rare", "Buscador de ensayos sobre enfermedades raras"],
      short: ["Seltene Erkrankungen", "Malattie rare", "Enfermedades raras"],
      studies: ["offene Studien zu seltenen Erkrankungen", "studi aperti su malattie rare", "estudios abiertos sobre enfermedades raras"],
      h1: c => [`Klinische Studien zu seltenen Erkrankungen ${c[2]} finden`, `Trova studi clinici sulle malattie rare ${c[3]}`, `Encuentre ensayos clínicos sobre enfermedades raras ${c[4]}`],
      lede: ["Suchen Sie offene klinische Studien zu seltenen Erkrankungen, darunter seltene Krebsarten und seltene neurologische, genetische, Blut- und Stoffwechselerkrankungen. Diese Studien erscheinen auch in den anderen Findern.",
             "Cerca studi clinici aperti sulle malattie rare, compresi tumori rari e malattie rare neurologiche, genetiche, del sangue e del metabolismo. Questi studi compaiono anche negli altri strumenti.",
             "Busque ensayos y estudios clínicos abiertos sobre enfermedades raras, incluidos cánceres raros y enfermedades raras neurológicas, genéticas, de la sangre y metabólicas. Estos estudios también aparecen en los otros buscadores."],
      tagNote: ["Seltene Erkrankungen werden automatisch erkannt, indem die Erkrankungen jeder Studie mit der Orphanet-Liste verglichen werden, und können falsch sein.", "Le malattie rare sono rilevate automaticamente confrontando le malattie di ogni studio con l'elenco di Orphanet, e possono essere errate.", "Las enfermedades raras se detectan automáticamente comparando las enfermedades de cada estudio con la lista de Orphanet, y pueden ser erróneas."],
      catLabel: ["Art der seltenen Erkrankung", "Tipo di malattia rara", "Tipo de enfermedad rara"], catAny: ["Jede seltene Erkrankung", "Qualsiasi malattia rara", "Cualquier enfermedad rara"],
      about: ["zu einer seltenen Erkrankung", "su una malattia rara", "sobre una enfermedad rara"],
      tagged: ["Ob eine Studie eine seltene Erkrankung betrifft, und deren Art, werden", "Se uno studio riguarda una malattia rara, e il suo tipo, sono rilevati", "Si un estudio trata de una enfermedad rara, y su tipo, se detectan"],
      cats: {
        rarecancer: ["Seltene Krebsarten", "Tumori rari", "Cánceres raros"], rareneuro: ["Seltene neurologische und neuromuskuläre Erkrankungen", "Malattie rare neurologiche e neuromuscolari", "Enfermedades raras neurológicas y neuromusculares"],
        genetic: ["Seltene genetische, Stoffwechsel- und Neugeborenen-Erkrankungen", "Malattie rare genetiche, metaboliche e neonatali", "Enfermedades raras genéticas, metabólicas y neonatales"], blood: ["Seltene Bluterkrankungen", "Malattie rare del sangue", "Trastornos raros de la sangre"],
        metabolic: ["Seltene Hormon- und Stoffwechselerkrankungen", "Malattie rare ormonali e metaboliche", "Enfermedades raras hormonales y metabólicas"], immune: ["Seltene Immun- und Entzündungserkrankungen", "Malattie rare immunitarie e infiammatorie", "Enfermedades raras inmunitarias e inflamatorias"],
        lung: ["Seltene Lungenerkrankungen", "Malattie rare dei polmoni", "Enfermedades raras del pulmón"], heart: ["Seltene Herz- und Gefäßerkrankungen", "Malattie rare del cuore e dei vasi", "Enfermedades raras del corazón y los vasos"],
        kidney: ["Seltene Nierenerkrankungen", "Malattie rare dei reni", "Enfermedades raras del riñón"], digestive: ["Seltene Verdauungs- und Lebererkrankungen", "Malattie rare digestive e del fegato", "Enfermedades raras digestivas y hepáticas"],
        skin: ["Seltene Haut- und Bindegewebserkrankungen", "Malattie rare della pelle e del tessuto connettivo", "Enfermedades raras de la piel y el tejido conectivo"], musculoskeletal: ["Seltene Knochen- und Muskelerkrankungen", "Malattie rare delle ossa e dei muscoli", "Enfermedades raras de huesos y músculos"],
        eyeent: ["Seltene Augen- und Ohrenerkrankungen", "Malattie rare degli occhi e delle orecchie", "Enfermedades raras de ojos y oídos"], infection: ["Seltene Infektionen", "Infezioni rare", "Infecciones raras"],
        raregeneral: ["Andere seltene Erkrankungen", "Altre malattie rare", "Otras enfermedades raras"]
      }
    }
  };
  const ext = (base, add) => [P2(base, 0), P2(base, 1), ...add];
  const P2 = (arr, i) => arr[i] != null ? arr[i] : arr[0];
  for (const [a, x] of Object.entries(X)) {
    const A0 = AREAS[a]; if (!A0) continue;
    for (const k of ["brand", "short", "studies", "lede", "tagNote", "catLabel", "catAny", "about", "tagged"]) A0[k] = ext(A0[k], x[k]);
    const h1 = A0.h1; A0.h1 = c => [...h1(c).slice(0, 2), ...x.h1(c)];
    for (const [c, v] of Object.entries(x.cats)) if (A0.cats[c]) A0.cats[c] = ext(A0.cats[c], v);
  }
})();
