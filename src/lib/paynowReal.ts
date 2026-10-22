// REAL PAYNOW - Partner verified - ONLY newest key works
// OLD keys a19f... and bc8cf... are EXPIRED - do not use - they cause mock/not reachable
export const PAYNOW_REAL = {
  id: 27523,
  key: "ed2213ae-49ac-4cf5-b735-4f578a7aaccc",
  company: "Demash Global MISIT",
  address: "K17412 Katanga Norton",
  tel: "0784219178",
  // REAL payments check:
  // Login https://www.paynow.co.zw -> Transactions -> ID 27523
  // If payment shows there, it's REAL. If not, it's MOCK old ID.
  bannedOld: [27382, "a19f4a0f-19a7-4910-a973-c1be75a8efaa", "bc8cf235-b446-4e21-890b-def29a27a1d4"]
};
