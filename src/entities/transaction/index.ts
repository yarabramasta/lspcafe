import { TransactionMenu } from '../menu';

declare module '@/entities/transaction' {
  interface Transaction {
    id: string;
    user_id: string;
    transaction_code: string;
    table_code: number;
    qty_total: number;
    total_payment: number;
    created_at: string;
    items: TransactionItemResult[];
  }

  type TransactionInput = Pick<
    Transaction,
    'qty_total' | 'total_payment' | 'user_id'
  >;

  type TransactionResult = Omit<Transaction, 'user_id'>;

  interface TransactionItem {
    id: string;
    transaction_id: string;
    menu_id: string;
    user_id: string;
    qty: number;
    menu?: TransactionMenu;
  }

  interface TransactionItemJoinResult
    extends Omit<TransactionItem, 'menu' | 'transaction_id' | 'user_id'> {
    menu_id: string;
    menu_image: string;
    menu_name: string;
    menu_price: number;
  }

  type TransactionItemInput = Pick<
    TransactionItem,
    'transaction_id' | 'menu_id' | 'qty' | 'user_id'
  >;

  type TransactionItemResult = Omit<
    TransactionItem,
    'transaction_id' | 'menu_id' | 'user_id'
  >;
}

export {};
