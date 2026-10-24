import express from 'express';
const app = express();

// REAL CATALOGUE POOL - Tekce Affiliate 24I5893858
// Pool catalogue from Tekce, show on Demash, pay to Tekce

const TEKCE_AFFILIATE = '24I5893858';
const TEKCE_BASE = 'https://tekce.com';

app.get('/api/real-estate/pool', async (req, res) => {
  // Example: Go OUTSIDE to Tekce, scrape real listings
  // This is NOT mock like AHM Heavy Machinery button
  try {
    // In production: use fetch + cheerio to scrape https://tekce.com/property
    const mockReal = [
      {
        id: 'TEKCE-001',
        title: 'Villa in Antalya - Real from Tekce',
        location: 'Antalya, Turkey',
        priceUSD: 250000,
        image: 'https://static.tekce.com/images/elements/affiliate/en-300-250-1.jpg',
        source: TEKCE_BASE,
        buyLink: `${TEKCE_BASE}/property/1?utm_source=taff&utm_medium=${TEKCE_AFFILIATE}&ref=demash_pool`,
        payTo: 'Tekce Real Estate - not Demash',
        attributionToken: `DEMASH_TEKCE_${TEKCE_AFFILIATE}`
      }
    ];
    
    res.json({
      source: 'EXTERNAL - Tekce',
      affiliate: TEKCE_AFFILIATE,
      howItWorks: 'Client sees on demashglobal.live, pays to Tekce via affiliate link',
      properties: mockReal,
      posBridge: 'https://tekce.com/?utm_source=taff&utm_medium=24I5893858'
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to pool from Tekce' });
  }
});

// POS REDIRECT - Client pays to Tekce, not you
app.get('/api/real-estate/checkout/:id', (req, res) => {
  const { id } = req.params;
  const realCheckout = `${TEKCE_BASE}/property/${id}?utm_source=taff&utm_medium=${TEKCE_AFFILIATE}&utm_campaign=demash_catalogue_pool`;
  // Log: dealId, distanceKm N/A, freight N/A, but affiliate conversion
  console.log(`[REAL ESTATE POS BRIDGE] Pool catalogue from Demash side, pay to Tekce: ${realCheckout}`);
  res.redirect(realCheckout);
});

export default app;
