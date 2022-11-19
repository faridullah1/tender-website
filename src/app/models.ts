export type LoginAccountType = 'Client' | 'Supplier' | 'Contractor' | 'Consultant';

export interface GenericApiResponse {
	status: 'success' | 'fail' | 'error',
	data: any;
	message: string;
}

export interface LoginType {
	type: LoginAccountType;
	image: string;
	visible: boolean;
}