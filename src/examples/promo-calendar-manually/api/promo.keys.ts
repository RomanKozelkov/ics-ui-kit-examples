export const promoKeys = {
	promo: "promo",
	fetch: () => [promoKeys.promo, "fetch"] as const
} as const;
