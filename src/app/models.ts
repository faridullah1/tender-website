export type LoginAccountType = 'Client' | 'Supplier' | 'Contractor' | 'Consultant';

export interface GenericApiResponse {
	status: 'success' | 'fail' | 'error',
	data: any;
	access_token: string;
	message: string;
}

export interface LoginType {
	type: LoginAccountType;
	image: string;
	visible: boolean;
}

export interface UserInfo {
	id: number;
	name: string;
	email: string;
	type: LoginAccountType;
}