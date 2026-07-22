export type DistributorRow = {
	id: string;
	distributor: string;
	region: string;
	category: string;
	manager: string;
	units: number;
	revenue: number;
	growth: number;
};

/** Мок-данные для примера таблицы с ресайзом колонок — вымышленные дистрибьюторы. */
export const DISTRIBUTOR_ROWS: DistributorRow[] = [
	{ id: "1", distributor: "ООО «Фармтрейд»", region: "Москва", category: "Pharma", manager: "Иванова А.", units: 12480, revenue: 18_240_500, growth: 6.4 },
	{ id: "2", distributor: "СЗ Дистрибуция", region: "Санкт-Петербург", category: "Perfum", manager: "Смирнов К.", units: 8210, revenue: 11_030_200, growth: -2.1 },
	{ id: "3", distributor: "УралФарм", region: "Екатеринбург", category: "Pharma", manager: "Петров Д.", units: 6640, revenue: 9_412_800, growth: 3.7 },
	{ id: "4", distributor: "СибТорг", region: "Новосибирск", category: "E-Com", manager: "Кузнецова Е.", units: 5120, revenue: 7_004_100, growth: 12.9 },
	{ id: "5", distributor: "ЮгОптТорг", region: "Краснодар", category: "Perfum", manager: "Морозов И.", units: 4380, revenue: 5_920_600, growth: 1.2 },
	{ id: "6", distributor: "ВолгаФарм", region: "Казань", category: "Pharma", manager: "Соколова М.", units: 3990, revenue: 5_310_000, growth: -0.8 },
	{ id: "7", distributor: "ДальПоставка", region: "Владивосток", category: "E-Com", manager: "Новиков П.", units: 2870, revenue: 4_012_300, growth: 8.6 },
	{ id: "8", distributor: "ЦентрМедТорг", region: "Воронеж", category: "Pharma", manager: "Волкова С.", units: 3510, revenue: 4_780_900, growth: 4.5 },
	{ id: "9", distributor: "СеверОптТорг", region: "Архангельск", category: "Perfum", manager: "Лебедев Г.", units: 1980, revenue: 2_640_400, growth: -4.3 },
	{ id: "10", distributor: "ПрайдДистрибьюшн", region: "Ростов-на-Дону", category: "E-Com", manager: "Егорова Н.", units: 2340, revenue: 3_105_700, growth: 9.8 }
];
