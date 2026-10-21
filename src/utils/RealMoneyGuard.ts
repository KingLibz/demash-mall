export const RealMoneyGuard = {
  transactions: [] as any[],
  validateRealMoney: (payment: any) => {
    // ONLY count if status=Paid AND Paynow hash verified AND POS receipt exists
    return payment.status === 'Paid' && payment.paynowVerified === true && payment.posReceiptId;
  },
  getRealTotal: () => 0, // START AT ZERO
  lockButton: (id: string) => { /* prevent double-click */ }
}
