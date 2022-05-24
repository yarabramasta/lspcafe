declare module '@/interfaces/menu' {
	interface Menu {
		id: string;
		image: string;
		name: string;
		description: string;
		price: number;
		stock: number;
		created_at: string;
	}

	type MenuInput = Omit<Menu, 'image' | 'created_at'>;
}

export {};
