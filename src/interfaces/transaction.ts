import { Menu } from '@/interfaces/menu';
import { UserResult } from '@/interfaces/user';

declare module '@/interfaces/transaction' {
	interface Transaction {
		id: string;
		user_id: string;
		transaction_code: string;
		table_code: number;
		qty_total: number;
		total_payment: number;
		created_at: string;
		user?: UserResult;
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
		qty: number;
		menu?: Menu;
	}

	type TransactionItemInput = Pick<
		TransactionItem,
		'transaction_id' | 'menu_id'
	>;

	type TransactionItemResult = Omit<
		TransactionItem,
		'transaction_id' | 'menu_id'
	>;
}

export {};
