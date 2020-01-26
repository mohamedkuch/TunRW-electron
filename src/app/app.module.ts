import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { OnePageComponent } from './onePage/onepage.component';
import { HeaderComponent } from './onePage/header/header.component';
import { TopCoverComponent } from './onePage/topcover/topcover.component';
import { AboutComponent } from './onePage/about/about.component';
import { ServicesComponent } from './onePage/services/services.component';
import { EventsComponent } from './onePage/events/events.component';
import { ProjectsComponent, DialogOverviewExampleDialog } from './onePage/projects/projects.component';
import { PartnersComponent } from './onePage/partners/partners.component';
import { ContactComponent } from './onePage/contact/contact.component';


import { PageNotFoundComponent } from './404/pagenotfound.component';

// Admin imports
import { AdminComponent } from './admin/admin.component';
import { AdminEventsComponent } from './admin/admin-events/admin-events.component';
import { AdminPartnersComponent } from './admin/admin-partners/admin-partners.component';
import { CreateEventComponent } from './admin/admin-events/create-event/create-event.component';
import { AdminListEventsComponent } from './admin/admin-events/list-event/list-event.component';
import { HeaderAdminComponent } from './admin/header-admin/header-admin.component';
import { MembersAdminComponent } from './admin/admin-members/admin-members.component';
import { CreateMemberComponent } from './admin/admin-members/create-member/create-member.component'
import { AdminProjectsComponent } from './admin/admin-projects/admin-projects.component';
import { AdminListProjectsComponent } from './admin/admin-projects/list-project/list-project.component';
import { CreateProjectComponent } from './admin/admin-projects/ceate-project/create-project.component';
import { LoginComponent } from './admin/auth/login/login.component';
import { AuthInterceptor } from './admin/auth/auth-interceptor';
import { AdminMemberListComponent } from './admin/admin-members/list-members/list-members.component';


import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './app-routing.module';
import { ClickOutsideModule } from 'ng-click-outside';

import { ChartsModule } from 'ng2-charts';
import { AngularMaterialModule } from './angular-material.module';
import { GestureConfig, MatButtonModule, MatTooltipModule, MatBadgeModule, MatIconModule, MatDividerModule, MatListModule } from '@angular/material';
import {MatSliderModule} from '@angular/material/slider';
import { AdminListPartnersComponent } from './admin/admin-partners/list-partner/list-partner.component';
import { CreatePartnerComponent } from './admin/admin-partners/create-partner/create-partner.component';
import { AdminServicesComponent } from './admin/admin-services/admin-services.component';
import { AdminListServicesComponent } from './admin/admin-services/list-service/list-service.component';
import { CreateServiceComponent } from './admin/admin-services/create-service/create-service.component';


import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AdminAboutComponent } from './admin/admin-about/admin-about.component';
import { AdminListTeamMembersComponent } from './admin/admin-about/list-team-member/list-team-member.component';
import { CreateTeamMemberComponent } from './admin/admin-about/create-team-member/create-team-member.component';
import { CreateAboutTextComponent } from './admin/admin-about/create-text-about/create-text-about.component';
import { AdminListAboutTextComponent } from './admin/admin-about/list-about-text/list-about.component';
@NgModule({
  declarations: [
    OnePageComponent,
    AppComponent,
    HeaderComponent ,
    TopCoverComponent,
    AboutComponent,
    ServicesComponent,
    EventsComponent,
    ProjectsComponent,
    PartnersComponent,
    ContactComponent,
    AdminComponent,

    MembersAdminComponent,
    AdminEventsComponent,
    AdminPartnersComponent,
    AdminProjectsComponent,
    AdminServicesComponent,

    CreateMemberComponent,
    CreateProjectComponent,
    CreateEventComponent,
    CreatePartnerComponent,
    CreateServiceComponent,


    AdminMemberListComponent,
    AdminListEventsComponent,
    AdminListProjectsComponent,
    AdminListPartnersComponent,
    AdminListServicesComponent,

    AdminAboutComponent,
    AdminListTeamMembersComponent,
    CreateTeamMemberComponent,
    CreateAboutTextComponent,
    AdminListAboutTextComponent,

    LoginComponent,
    HeaderAdminComponent,
    ErrorComponent,
    DialogOverviewExampleDialog,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    HttpClientModule,
    MatSliderModule,
    MatButtonModule,
    SlickCarouselModule,
    MatTooltipModule,
    MatBadgeModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    ClickOutsideModule,
    ChartsModule
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},  
    {provide : HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }
  
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, DialogOverviewExampleDialog]
})
export class AppModule {


 }
