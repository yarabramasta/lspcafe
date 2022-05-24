import MenuRepo, { schema, updateSchema } from './menu_repo';

declare module '@/entities/menu' {
  type MenuType = 'makanan' | 'minuman';

  interface Menu {
    id: string;
    image: string;
    name: string;
    description: string;
    menu_type: MenuType;
    price: number;
    stock: number;
    created_at: string;
  }

  type MenuInput = Omit<Menu, 'id' | 'image' | 'created_at'>;
  type TransactionMenu = Pick<Menu, 'id' | 'name' | 'image' | 'price'>;
}

const menuRepo = new MenuRepo();
const MenuSchema = schema;
const UpdateMenuSchema = updateSchema;

export { menuRepo, MenuSchema, UpdateMenuSchema };
