export const promoKeys = {
	promo: "promo",
	fetch: (year: number) => [promoKeys.promo, "fetch", year] as const,
	years: () => [promoKeys.promo, "years"] as const,
	holidays: (year: number) => [promoKeys.promo, "holidays", year] as const
} as const;
