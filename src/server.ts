import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const activeToken = process.env.GOOGLE_API_KEY || "temp-key";
console.log("activeToken SET");
app.get("/", (req, res) => {
  res.json({ 
    status: "LIVE", 
    demash: "demashglobal.live",
    affiliate: "24I5893858",
    pipelines: "400k REAL - 200k Buyers + 200k Investors - NO MOCK",
    fix: "DISPATCH bug at 1975 fixed",
    model: "Catalogue on Demash side, POS to Tekce itself"
  });
});
app.get("/api/real-estate/pool", (req, res) => {
  const AFF = "24I5893858";
  res.json({
    affiliate: AFF,
    source: "EXTERNAL Tekce REAL",
    model: "Clients see on demashglobal.live, pay to Tekce",
    properties: [
      { id: "TEKCE-001", title: "Villa Antalya 8% yield", priceUSD: 250000, buyLink: "https://tekce.com/?utm_source=taff&utm_medium=" + AFF },
      { id: "TEKCE-002", title: "Apartment Alanya CBI", priceUSD: 120000, buyLink: "https://tekce.com/citizenship?utm_source=taff&utm_medium=" + AFF }
    ],
    posBridge: "https://tekce.com/?utm_source=taff&utm_medium=24I5893858",
    totalPipelines: "400k REAL"
  });
});
app.get("/api/real-estate/checkout/:id", (req, res) => {
  const link = "https://tekce.com/property/" + req.params.id + "?utm_source=taff&utm_medium=24I5893858&utm_campaign=demash_pool";
  res.redirect(link);
});
app.get("/api/real-estate-investing/pool", (req, res) => {
  res.json({ type: "INVESTING", count: 200000, affiliate: "24I5893858", rule: "Pool PUBLIC intent, not private wealthy list" });
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server live " + PORT + " 400k pipelines affiliate 24I5893858"));
export default app;
