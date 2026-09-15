# NAMO 3D STUDIJA — GitHub ir Vercel

Esamo namo projekto galutiniai UI pakeitimai: pašalintas fotografavimo mygtukas ir PNG eksporto kodas; CTA tekstas centruotas nepriklausomai nuo rodyklės; kūrėjo užrašas turi didesnį tarpą. 3D modelis, laiptai, medžiagos ir baldų valdymas nepakeisti.

## Paleidimas kompiuteryje

Reikia Node.js 22 arba naujesnio ir npm. Šiame aplanke:

```powershell
npm install
npm run dev
```

Atidarykite http://localhost:5173. Serverio langą palikite atidarytą. Sustabdyti: Ctrl+C.

## Production patikra

```powershell
npm run build
npm run preview
```

Atidarykite http://localhost:4173. Vercel paleidžia build, bet jam nereikia preview ar dev serverio.

## Ką kelti į GitHub

Įkelkite VISĄ šio aplanko turinį, kad package.json būtų repository šaknyje:

- src/ — esamas 3D modelis ir valdymas;
- dist/ — HTML, CSS, nuotraukos, planai, logo, šriftai ir surinktas app.js;
- scripts/ — dev, build, preview ir geometrijos patikra;
- LICENSES/ — bibliotekų ir šrifto licencijos;
- package.json, package-lock.json, vercel.json, .gitignore ir README.md.

SVARBU: šiame projekte dist/ taip pat saugomi originalūs statiniai failai. Jo neištrinkite ir nepridėkite prie .gitignore. Build atnaujina dist/app.js, o nuotraukas ir kitus failus palieka vietoje.

Nekelkite node_modules/, .git/, .sites-runtime/, .openai/, .vercel/, .env failų, testų ekrano nuotraukų, žurnalų ar ZIP archyvų. Pateiktame ZIP šių failų nėra.

## Vercel nustatymai

1. Vercel pasirinkite Add New → Project ir importuokite savo GitHub repository.
2. Root Directory: repository šaknis (./), kur yra package.json. Jei įkėlėte visą house-viewer aplanką kaip poaplankį, nurodykite house-viewer.
3. Framework Preset: Other.
4. Install Command: npm install.
5. Build Command: npm run build.
6. Output Directory: dist.
7. Environment Variables: nereikalingi.
8. Papildomi perrašymai, serverio funkcijos ar duomenų bazės nereikalingi.

vercel.json jau nurodo Other, diegimo ir build komandas bei dist išvestį. Naudokite palaikomą Node.js 22 arba naujesnį leidimą. Viešai nuorodai Vercel projekto Deployment Protection nustatymuose production prieiga turi būti be Vercel prisijungimo; jei paskyra įjungia apsaugą, išjunkite ją šiam viešam puslapiui.

Oficiali konfigūracijos dokumentacija: https://vercel.com/docs/project-configuration/vercel-json

## Funkcijos ir duomenys

Aukštų bei sklypo perjungimas, pasukimas, priartinimas, sienų aukštis, patalpų vaizdai, baldų judinimas ir pasukimas veikia tik naršyklėje. Baldų pakeitimai laikini — puslapio atnaujinimas grąžina pradinį išdėstymą. Fotografavimo funkcija pašalinta.

SUSISIEKITE atidaro WhatsApp numeriu +370 616 28580 su iš anksto parengta žinute apie Zūbiškių g. 3A.

Modelio geometrija ir procedūrinės tekstūros yra src/; visos nuotraukos, planai, logo ir šriftai — dist/. Nėra veikimo priklausomybės nuo ChatGPT, localhost ar laikinų URL. localhost instrukcijose naudojamas tik vietinei peržiūrai. WhatsApp reikalingas internetas.

Geometrija išlaiko pirminius planų patalpų poligonus ir plotus. Nuotraukomis interpretuotos detalės bei laiptų pakopų matmenys pažymėti apytiksliais. Tai nėra statybos ar kadastrinis modelis.

## Patikros

npm run check patikrina pirminių poligonų tęstinumą ir vietinių išteklių buvimą. Production UI tikrinamas desktop ir 390 × 844 mobiliojo ekrano dydžiu. Telefono dydžio emuliacija nėra bandymas fiziniame iPhone ar Android įrenginyje.
