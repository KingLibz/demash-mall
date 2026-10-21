/**
 * DEMASH REAL MONEY GUARD - Prevents double-count
 */
const processedTransactions = new Set<string>();
const pendingButtons = new Set<string>();
export const RealMoneyGuard = {
  lockButton: (buttonId: string): boolean => {
    if (pendingButtons.has(buttonId)) return false;
    pendingButtons.add(buttonId);
    return true;
  },
  unlockButton: (buttonId: string) => { pendingButtons.delete(buttonId); },
  isAlreadyCounted: (ref: string): boolean => processedTransactions.has(ref),
  validateRealMoney: (data: { reference: string, paynowReference: string, amount: string, status: string, hash: string, expectedHash: string }) => {
    if (data.status.toLowerCase() !== "paid") return { isReal: false, reason: `Status ${data.status}` };
    if (data.hash !== data.expectedHash) return { isReal: false, reason: "Invalid Hash" };
    if (processedTransactions.has(data.paynowReference)) return { isReal: false, reason: "Duplicate" };
    processedTransactions.add(data.paynowReference);
    return { isReal: true, reason: "REAL MONEY" };
  }
}
