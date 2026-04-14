export interface Category {
	slug: string;
	name: string;
	images: { dark: string; light: string };
}

export interface CategoriesGroup {
	name: string;
	categories: Category[];
}

export interface CanvasAttributes {
	title: string;
	category: string;
	canvas: {
		classNames?: string;
		height?: number;
	};
	props?: Record<string, any>;
}

export interface UiComponent {
	component: string;
	slug: string;
	code: { fileName: string; language: string; code: string }[];
	attributes: CanvasAttributes;
}
