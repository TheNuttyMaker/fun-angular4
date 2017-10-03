import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AccountModule } from './account/account.module';
import { HomeModule } from './home/home.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {
  FooterComponent,
  HeaderComponent,
  SharedModule,
  AccountDataService,
  ContactsDataService,
} from './shared';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AccountModule,
    HomeModule,
    rootRouting,
    SharedModule,
    NgxDatatableModule,
  ],
  providers: [
    ContactsDataService,
    AccountDataService

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
