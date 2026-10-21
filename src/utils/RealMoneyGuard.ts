export const RealMoneyGuard = {
  transactions: [] as any[],
  validateRealMoney: (payment: any) => {
    // ONLY count if Supplier POS receipt + Paynow verified + referral code
    return payment.status === 'Paid' && payment.paynowVerified === true && !!payment.supplierPosReceiptId && !!payment.referralCode;
  },
  getRealTotal: () => 0,
  lockButton: (id: string) => {
    const btn = document.getElementById(id) as HTMLButtonElement;
    if (btn) { btn.disabled = true; setTimeout(() => btn.disabled = false, 3000); }
  }
}
