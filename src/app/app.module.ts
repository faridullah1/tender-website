import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

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
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

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
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	ReactiveFormsModule,
	HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
