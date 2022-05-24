import MenuRepo, { schema } from './menu_repo';

declare module '@/entities/menu' {
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

const menuRepo = new MenuRepo();
const MenuSchema = schema;

export { menuRepo, MenuSchema };
