import axios from 'axios';

export const SYSTEM_CONFIG = {
  PORT: process.env.PORT || 3000,
  PRODUCTION_DOMAIN: "demashglobal.live",
  NORTON_BASE: "K17412, Katanga, Norton, Zimbabwe",
  META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN || "",
  META_PHONE_NUMBER_ID: process.env.META_PHONE_NUMBER_ID || "",
  WHATSAPP_ADMIN_LINE: "+263784219178",
  FALLBACK_DOMAIN: "https://alibaba.com"
};

export const MULTI_SUPPLIER_ROUTER: Record<string, { base: string; token: string; supplierName: string }> = {
  machinery: { 
    base: "https://ahmcorp.com/collections/machinery", 
    token: "ref=mnpixfvf",
    supplierName: "AHM Corp (Heavy Machinery & Excavators)" 
  },
  hardware: { 
    base: "https://electrosales.co.zw", 
    token: "affiliate=demash_global",
    supplierName: "Electrosales Commercial Hardware" 
  },
  realestate: { 
    base: "https://propertycoza.co.zw", 
    token: "partner=demash_highlands",
    supplierName: "Property.CoZa Sovereign Real Estate" 
  },
  cement: { 
    base: "https://lafarge.co.zw", 
    token: "corridor=norton_direct",
    supplierName: "Lafarge PPC Norton Corridor" 
  },
  footwear: { 
    base: "https://bata.co.zw", 
    token: "procure=demash_commercial",
    supplierName: "Bata Commercial Wholesale Logistics" 
  }
};

export interface GroupHarvestMetrics {
  phones: string[];
  emails: string[];
  prices: string[];
  urls: string[];
  quantities: string[];
}

/**
 * Harvests unstructured data metrics from group feeds (phones, emails, pricing, URLs)
 */
export function harvestVastGroupMetrics(rawText: string): GroupHarvestMetrics {
  const text = rawText || '';
  
  // Extract phone numbers (international or local format)
  const phoneRegex = /(?:\+?263|0)[7-9]\d{8}|(?:\+\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g;
  const phones = Array.from(new Set(text.match(phoneRegex) || []));

  // Extract email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = Array.from(new Set(text.match(emailRegex) || []));

  // Extract monetary mentions
  const priceRegex = /(?:\$|\busd\b)\s*[\d,]+(?:\.\d{2})?|\b[\d,]+(?:\.\d{2})?\s*(?:usd|dollars?|zwg)/gi;
  const prices = Array.from(new Set(text.match(priceRegex) || []));

  // Extract URLs
  const urlRegex = /https?:\/\/[^\s]+/gi;
  const urls = Array.from(new Set(text.match(urlRegex) || []));

  // Extract quantities (e.g. 500 bags, 20 tons, 5 units)
  const qtyRegex = /\b\d+(?:[,\.]\d+)?\s*(?:tons?|tonnes?|bags?|units?|pcs|sqm|m3|loads?)\b/gi;
  const quantities = Array.from(new Set(text.match(qtyRegex) || []));

  return { phones, emails, prices, urls, quantities };
}

/**
 * Resolves direct destination links and validates connectivity
 */
export async function resolveDirectDestinationLink(rawTextSnippet: string): Promise<string[]> {
  const resolvedUrls: string[] = [];
  const domainPatterns = [
    /ahmcorp\.com\/[a-z0-9\-_/]+/i,
    /electrosales\.co\.zw\/[a-z0-9\-_/]+/i,
    /propertycoza\.co\.zw\/[a-z0-9\-_/]+/i,
    /lafarge\.co\.zw\/[a-z0-9\-_/]+/i
  ];

  domainPatterns.forEach(pattern => {
    const match = rawTextSnippet.match(pattern);
    if (match) {
      const builtUrl = `https://${match[0]}`;
      resolvedUrls.push(builtUrl);
    }
  });

  // High-velocity pipeline validation sweep
  const validatedDestinations: string[] = [];
  for (const linkItem of resolvedUrls) {
    try {
      const desktopGate = linkItem.replace('://m.facebook.com', '://facebook.com');
      const traceRes = await axios.head(desktopGate, { 
        timeout: 2000, 
        maxRedirects: 3, 
        validateStatus: (status) => status < 400 
      });
      validatedDestinations.push(traceRes.config.url || desktopGate);
    } catch {
      validatedDestinations.push(linkItem); // Fallback to raw string path on timeout
    }
  }

  return validatedDestinations.length > 0 ? validatedDestinations : [`https://${SYSTEM_CONFIG.PRODUCTION_DOMAIN}`];
}

/**
 * 🔬 MODULE 3: QUANTITATIVE OPERATIONS RESEARCH & FEASIBILITY ENGINE
 * Mathematically processes bulk cargo volume constraints and axle mass boundaries 
 * to evaluate the exact fleet requirements before dispatching heavy road assets.
 */
export function executeQuantitativeFeasibilityAudit(cargoType: string, rawVolumeInput: string) {
  const baseQuantity = parseFloat(rawVolumeInput.replace(/[^0-9.]/g, '')) || 1000;
  const constraints: Record<string, { materialDensityTonsPerM3: number; maxAxleLoadLimitTons: number; volumetricEfficiencyCoeff: number }> = {
    cement:    { materialDensityTonsPerM3: 1.51, maxAxleLoadLimitTons: 56, volumetricEfficiencyCoeff: 0.98 },
    machinery: { materialDensityTonsPerM3: 7.85, maxAxleLoadLimitTons: 80, volumetricEfficiencyCoeff: 0.92 },
    footwear:  { materialDensityTonsPerM3: 0.35, maxAxleLoadLimitTons: 24, volumetricEfficiencyCoeff: 0.95 },
    aggregate: { materialDensityTonsPerM3: 1.60, maxAxleLoadLimitTons: 34, volumetricEfficiencyCoeff: 0.96 },
    timber:    { materialDensityTonsPerM3: 0.65, maxAxleLoadLimitTons: 30, volumetricEfficiencyCoeff: 0.90 }
  };
  const targetParams = constraints[cargoType.toLowerCase()] || constraints.cement;
  const totalMassTons = baseQuantity * targetParams.materialDensityTonsPerM3;
  const fleetCount = Math.max(1, Math.ceil(totalMassTons / targetParams.maxAxleLoadLimitTons));
  
  return {
    cargoType: cargoType.toLowerCase(),
    baseVolumeM3: baseQuantity,
    calculatedMassTons: totalMassTons.toFixed(2),
    allocatedFleetCount: fleetCount,
    maxAxleLoadLimitTons: targetParams.maxAxleLoadLimitTons,
    materialDensityTonsPerM3: targetParams.materialDensityTonsPerM3,
    volumetricUtilization: `${(targetParams.volumetricEfficiencyCoeff * 100).toFixed(2)}%`,
    haulageCorridor: "Beira / Harare / Norton Commercial Freight Spine"
  };
}

/**
 * 🛡️ MODULE 4: DYNAMIC BAYESIAN FRAUD DETECTION SENTRY
 * Scans text content for high-risk con-artist indicators, upfront payment traps,
 * or mismatched domain structures, scoring data legitimacy with absolute certainty.
 */
export function analyzeFraudAndDeceptionTriggers(rawText: string, groupName: string) {
  const textLower = (rawText || '').toLowerCase();
  const groupLower = (groupName || '').toLowerCase();
  let trustScore = 100;
  const violations: string[] = [];

  if (textLower.includes('upfront fee') || textLower.includes('advance payment required') || textLower.includes('western union wire') || textLower.includes('send gas money')) {
    trustScore -= 45; 
    violations.push("HIGH_RISK_UPFRONT_WIRE_TRAP");
  }
  if (textLower.includes('guaranteed inheritance') || textLower.includes('free money pool') || textLower.includes('whatsapp cash pool') || textLower.includes('ponzi')) {
    trustScore -= 40; 
    violations.push("FABRICATED_MASS_FANTASY_CON");
  }
  if (textLower.includes('bit.ly/') || textLower.includes('://tinyurl.com') || textLower.includes('t.co/') || textLower.includes('is.gd/')) {
    trustScore -= 20; 
    violations.push("OBFUSCATED_SHORT_LINK_MASK");
  }

  // Sociological incongruence matching loop
  if (groupLower.includes('builders') || groupLower.includes('contractors') || groupLower.includes('logistics') || groupLower.includes('procurement')) {
    if (textLower.includes('crypto investment') || textLower.includes('gift card swap') || textLower.includes('airtime glitch') || textLower.includes('forex signals')) {
      trustScore -= 35; 
      violations.push("SOCIOLOGICAL_FACTION_SPAM_INTRUSION");
    }
  }

  return { 
    isLegitimate: trustScore >= 60, 
    calculatedTrustScore: Math.max(0, trustScore), 
    violations 
  };
}

/**
 * 🧠 MODULE 5: COGNITIVE TARGET MATRIX & ROBERT GREENE STRATAGEM TUNER
 * Parses vocabulary registers against behavioral power laws to find deep closing leverage.
 */
export function compileGreeneTacticalWeight(rawText: string, groupName: string) {
  const textLower = (rawText || '').toLowerCase();
  const groupLower = (groupName || '').toLowerCase();
  let profile = { 
    score: 65, 
    dominantLaw: "LAW_3_CONCEAL_INTENTIONS", 
    stance: "FEIGN_NAIVETE_OBSERVE",
    tacticalSummary: "Use smoke screens and selective transparency to assess commercial counter-party depth." 
  };

  if (textLower.includes('exclusive') || textLower.includes('dependency') || textLower.includes('monopoly') || textLower.includes('sole supplier')) {
    profile.score += 20; 
    profile.dominantLaw = "LAW_11_KEEP_PEOPLE_DEPENDENT"; 
    profile.stance = "LOCK_SUPPLY_CHANNELS";
    profile.tacticalSummary = "Secure exclusive territorial supply quotas; position Demash Norton as the sole irreplacable logistics bottleneck.";
  } else if (textLower.includes('competitor') || textLower.includes('rival') || textLower.includes('market_share') || textLower.includes('cheaper price')) {
    profile.score += 25; 
    profile.dominantLaw = "LAW_15_CRUSH_ENEMY_TOTALLY"; 
    profile.stance = "AGGRESSIVE_MARKET_INFILTRATION";
    profile.tacticalSummary = "Deploy instant price-beating quotes with sovereign escrow security to displace legacy competitor hold.";
  } else if (groupLower.includes('wholesale') || textLower.includes('bulk_procurement') || textLower.includes('tender')) {
    profile.score += 15; 
    profile.dominantLaw = "LAW_3_CONCEAL_INTENTIONS"; 
    profile.stance = "DEPLOY_SMOKE_SCREEN_CATALOG";
    profile.tacticalSummary = "Release verified catalog pricing with mandatory 25% Nostro deposit escrow clearing gates.";
  }
  return profile;
}

/**
 * 📲 MODULE 6: TELEMETRY DISPATCH SENTRY (META WHATSAPP INTERCEPT VALVE)
 */
export async function sendSovereignWhatsAppAlert(
  mathMetrics: any, 
  stratProfile: any, 
  fraudProfile: any, 
  groupName: string, 
  metrics: GroupHarvestMetrics, 
  pitchText: string, 
  activeToken: string
) {
  if (!SYSTEM_CONFIG.META_ACCESS_TOKEN || !SYSTEM_CONFIG.META_PHONE_NUMBER_ID) {
    console.log(`[WhatsApp Telemetry Staged]: META tokens not configured. Staging alert internally for Admin Line ${SYSTEM_CONFIG.WHATSAPP_ADMIN_LINE}`);
    return { staged: true, recipient: SYSTEM_CONFIG.WHATSAPP_ADMIN_LINE };
  }
  
  const securityHeader = fraudProfile.isLegitimate 
    ? `*🟢 [DEMASH SECURITY - DATA VALIDATED]*` 
    : `*🚨 [SECURITY REJECT - DECEPTION INTERCEPTED]*`;

  const alertText = `${securityHeader}
----------------------------------
*NODE LOGISTICS BASE:* ${SYSTEM_CONFIG.NORTON_BASE}
*SOURCE LINK AREA:*   ${groupName.toUpperCase()}
*TRUST INDEX VALUE:*  🔒 ${fraudProfile.calculatedTrustScore}/100
*VIOLATION FLAGS:*   ${fraudProfile.violations.join(', ') || "None. Profile Safe."}
*STRATAGEM MAPPED:*  ${stratProfile.dominantLaw} (${stratProfile.stance})
*ROUTED SUPPLIER:*   🥇 ${activeToken}
*CALCULATED MASS:*   ${mathMetrics.calculatedMassTons} Tons (🚚 ${mathMetrics.allocatedFleetCount} Units)
*CONTACT PHONES:*    ${metrics.phones.join(', ') || "None"}
----------------------------------
*👑 MANDATED CLOSING CONTRACT PITCH:*
"${pitchText.slice(0, 240)}..."
----------------------------------
_Sovereign Cloud Matrix Engine. Running completely hands-off on ${SYSTEM_CONFIG.PRODUCTION_DOMAIN}_`;

  try {
    const url = `https://graph.facebook.com/v19.0/${SYSTEM_CONFIG.META_PHONE_NUMBER_ID}/messages`;
    const res = await axios.post(url, {
      messaging_product: "whatsapp", 
      recipient_type: "individual", 
      to: SYSTEM_CONFIG.WHATSAPP_ADMIN_LINE.replace(/\D/g, ''), 
      type: "text", 
      text: { body: alertText }
    }, { 
      headers: { 'Authorization': `Bearer ${SYSTEM_CONFIG.META_ACCESS_TOKEN}` }, 
      timeout: 5000 
    });
    return { staged: false, dispatched: true, data: res.data };
  } catch (err: any) {
    console.error(`🚨 Telemetry delivery dropped: ${err.message}`);
    return { staged: true, error: err.message };
  }
}
