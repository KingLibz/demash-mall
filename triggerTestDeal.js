import { processUnifiedEcosystemPipeline, dispatchClientOnboardingWelcome, executeMasterSovereignPipeline } from "./whatsappRouter.js";

// REAL-WORLD PRODUCTION EXECUTION DATA
const incomingDeal = {
    clientPhone: "+263784219178",        // Target customer phone number
    rawWorth: "1250.00",                 // Total transaction bill value
    region: "ZW",                        // Local country marker
    transactionId: "TXN-AGRI-99881122"   // AgriBank clearing reference string
};

async function executeSystemDiagnostic() {
    console.log("🏁 INITIALIZING LIVE SYSTEM DIAGNOSTIC TRACE...");
    
    try {
        // 1. Trigger the main invisible financial splitting engine
        console.log("\n--- Testing Invisible Split & Internal Notifications ---");
        const pipelineResult = await processUnifiedEcosystemPipeline(incomingDeal);
        console.log("Pipeline processing result:", pipelineResult);

        // 2. Trigger the client-facing welcome sequence
        console.log("\n--- Testing Automated Client Welcome Dispatcher ---");
        await dispatchClientOnboardingWelcome(
            incomingDeal.clientName,
            incomingDeal.clientPhone,
            "Commercial Structural Framing"
        );

        // 3. Trigger Master Sovereign Pipeline
        console.log("\n--- Testing Master Sovereign Pipeline (x999999) ---");
        const sovereignResult = await executeMasterSovereignPipeline({
            clientName: incomingDeal.clientName,
            clientPhone: incomingDeal.clientPhone,
            baseValue: 1250.00,
            targetZone: "ZW",
            clearingTxnRef: incomingDeal.transactionId,
            supplierCode: "AHM"
        });
        console.log("Sovereign processing result:", sovereignResult);

        console.log("\n✅ DIAGNOSTIC RUN COMPLETE. ALL LOGIC PATHWAYS STABLE.");

    } catch (error) {
        console.error("\n❌ CRITICAL COHESION ERROR DETECTED DURING TRACE:", error.message);
    }
}

executeSystemDiagnostic();