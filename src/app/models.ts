export type LoginAccountType = 'Client' | 'Supplier' | 'Contractor' | 'Consultant';

export interface LoginType {
	type: LoginAccountType;
	image: string;
	visible: boolean;
}