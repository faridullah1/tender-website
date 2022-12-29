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

export interface Project {
	projectId: number;
	name: string;
	location: string;
	description: string;
	type: string;
	image: string;
	isApproved: boolean;
}

export interface Tender {
	tenderId: number;
	tenderNumber: string;
	type: string;
	openingDate: Date;
	closingDate: Date;
	minimumPrice: number;
	maximumPrice: number;
	location: string;
	description: string;
	projectId: number;

	remainingTime: string | 0;
}