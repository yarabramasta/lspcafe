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

	type MenuInput = Omit<Menu, 'id' | 'image' | 'created_at'>;
}

export {};
