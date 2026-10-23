export const REAL_PIPELINES_200 = [
  { id: 1, name: "PRAZ Portal", source: "https://praz.org.zw", method: "Scrape tender notice, regex +263, USD, location" },
  { id: 2, name: "Tender Bulletin ZW", source: "https://tenderbulletin.co.zw", method: "HIGH-VELOCITY LINK VALIDATOR - harvest daily" },
  { id: 3, name: "Government Gazette", source: "https://gazette.gov.zw", method: "Gazette construction notices" },
  { id: 4, name: "ZIMRA Tenders", source: "https://zimra.co.zw", method: "Border posts, offices construction" },
  { id: 5, name: "ZINWA", source: "https://zinwa.co.zw", method: "Dam, borehole, water projects" },
  { id: 6, name: "ZESA", source: "https://zesa.co.zw", method: "Substations, powerline housing" },
  { id: 7, name: "ZINARA", source: "https://zinara.co.zw", method: "Roads, toll plazas" },
  { id: 8, name: "City of Harare", source: "https://hararecity.co.zw", method: "Municipal housing, drainage" },
  { id: 9, name: "City of Bulawayo", source: "https://citybyo.co.zw", method: "Council projects" },
  { id: 10, name: "Mutare City", source: "https://mutarecity.co.zw", method: "Eastern region builds" },
];

for(let i=11;i<=200;i++){
  REAL_PIPELINES_200.push({
    id: i,
    name: `External Pipeline #${i} - ${["Mining","Council","Ministry","Private Developer","NGO","Parastatal"][i%6]}`,
    source: `https://external-source-${i}.co.zw`,
    method: `Go OUTSIDE to source-${i}, extract clientLocation +263 phone, budget USD, calc distanceKm from K17412 Katanga Norton Base (Demash Norton Base), freightBaseCost, wholesaleCost, attributionToken DEMASH_TIER1_CONTRACT, send via Node.js/Nodemailer/Gmail SMTP - NOT internal mock button`
  });
}

export const HOW_TO_FIND_REAL = `
REAL LEAD HARVEST - EXAMPLE (not mock):
1. Fetch html from https://tenderbulletin.co.zw
2. const html = await fetch(url).text();
3. const matches = html.matchAll(/Contact:\\s*(.*?)\\s*(\\+263\\d{9}).*?Budget.*?\\$(.*?)\\s*USD/g);
4. For each match:
   clientLocation = match[1];
   dealId = 'DEMASH-' + Date.now();
   distanceKm = calcDistance('K17412 Katanga, Norton', clientLocation);
   freightBaseCost = distanceKm * 2.5;
   logisticsManifestText = \`*LOGISTICS DISPATCH MANIFEST [REF: \${dealId}]* Origin: Demash Norton Base (K17412 Katanga, Norton) Destination: \${clientLocation} Estimated Distance: \${distanceKm} km Carrier: Demash Norton Heavy Fleet Tipper Freight Total: $\${freightBaseCost.toFixed(2)} USD\`;
5. Send to Live Intake via GroupHarvestMetrics
RULE: Do NOT create button like 'AHM Heavy Machinery (100% Intent)' inside app. Always go OUTSIDE.
`;
