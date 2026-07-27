const coupons = [
  {
    id: 1,
    code: "GROCIFY10",
    discountType: "percent",
    discountValue: 10,
    minOrderValue: 200,
    expiryDate: "2026-12-31",
    usageLimit: 100,
    usedCount: 12,
    isActive: true,
  },
  {
    id: 2,
    code: "FLAT50",
    discountType: "flat",
    discountValue: 50,
    minOrderValue: 499,
    expiryDate: "2026-09-30",
    usageLimit: 50,
    usedCount: 8,
    isActive: true,
  },
  {
    id: 3,
    code: "WELCOME20",
    discountType: "percent",
    discountValue: 20,
    minOrderValue: 300,
    expiryDate: "2026-08-15",
    usageLimit: 200,
    usedCount: 45,
    isActive: false,
  },
];

export default coupons;
