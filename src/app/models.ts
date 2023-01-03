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
	userId: number;
	name: string;
	email: string;
	mobileNumber: string;
	type: LoginAccountType;
	bids: Bid[];
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

	remainingTime: string | 0 | -1;			// remainingTime = '2 Days, 10 hours'
											// remainingTime = 0 if tender is closed
											// remainingTime = -1 if tender is not started yet.
	status: 'Open' | 'Under Evaluation';
	submitting: boolean;
	canBid: boolean;
	bid: Bid
}

export interface Bid {
	biddingId: number;
	tenderId: number;
	status: 'Qualified' | 'Not_Qualified' | null;
}