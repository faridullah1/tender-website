import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { LoginTypeSelectionComponent } from './components/auth/login-type-selection/type-selection.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TendersComponent } from './components/tenders/tenders.component';
import { TermsComponent } from './components/terms/terms.component';
import { LoginComponent } from './components/auth/login/login.component';
import { CreateAccountComponent } from './components/auth/create-account/create-account.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { OurWorksComponent } from './components/our-works/our-works.component';
import { HomeComponent } from './components/home/home.component';
import { BiddingFormComponent } from './components/tenders/bidding-form/bidding-form.component';
import { PricingComponent } from './components/tenders/pricing/pricing.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'tenders', component: TendersComponent, canActivate: [AuthGuard] },
	{ 
		path: 'bidding', 
		component: BiddingFormComponent, 
		data: { userTypes: ['Consultant', 'Supplier', 'Contractor'] }, 
		canActivate: [AuthGuard] 
	},
	{ 
		path: 'pricing/:id', 
		component: PricingComponent, 
		data: { userTypes: ['Consultant', 'Supplier', 'Contractor'] }, 
		canActivate: [AuthGuard] 
	},
	{ path: 'projects', component: ProjectsComponent, data: { userTypes: ['Client'] }, canActivate: [AuthGuard] },
	{ path: 'our_works', component: OurWorksComponent },
	{ path: 'terms', component: TermsComponent },
	{ path: 'contact_us', component: ContactUsComponent },
	{ path: 'login-type', component: LoginTypeSelectionComponent },
	{ path: 'login/:type', component: LoginComponent },
	{ path: 'create-account/:type', component: CreateAccountComponent },
	{ path: 'confirm/:confirmationCode', component: VerifyEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }