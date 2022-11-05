import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TendersComponent } from './components/tenders/tenders.component';
import { TermsComponent } from './components/terms/terms.component';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'tenders', component: TendersComponent },
	{ path: 'projects', component: ProjectsComponent },
	{ path: 'terms', component: TermsComponent },
	{ path: 'contact_us', component: ContactUsComponent },
	{ path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }