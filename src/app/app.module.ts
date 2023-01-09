// Angular core modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Routing module
import { AppRoutingModule } from './app-routing.module';

// 3rd party modules
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginTypeSelectionComponent } from './components/auth/login-type-selection/type-selection.component';
import { TendersComponent } from './components/tenders/tenders.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { TermsComponent } from './components/terms/terms.component';
import { LoginComponent } from './components/auth/login/login.component';
import { CreateAccountComponent } from './components/auth/create-account/create-account.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { AddProjectComponent } from './components/projects/add-project/add-project.component';
import { OurWorksComponent } from './components/our-works/our-works.component';
import { HomeComponent } from './components/home/home.component';
import { BiddingFormComponent } from './components/tenders/bidding-form/bidding-form.component';
import { PricingComponent } from './components/tenders/pricing/pricing.component';
import { TenderDetailComponent } from './components/tenders/tender-detail/tender-detail.component';
import { NotificationsComponent } from './components/notifications/notifications.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginTypeSelectionComponent,
    TendersComponent,
	ProjectsComponent,
    ContactUsComponent,
    TermsComponent,
    LoginComponent,
    CreateAccountComponent,
    VerifyEmailComponent,
    AddProjectComponent,
    OurWorksComponent,
    HomeComponent,
    BiddingFormComponent,
    PricingComponent,
    TenderDetailComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
	BrowserAnimationsModule,
    AppRoutingModule,
	ReactiveFormsModule,
	HttpClientModule,
	ToastrModule.forRoot(),
	ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
