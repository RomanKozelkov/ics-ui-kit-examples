export const promoKeys = {
	promo: "promo",
	fetch: (range?: { dateBegin: string; dateEnd: string }) => [promoKeys.promo, "fetch", range] as const
} as const;
