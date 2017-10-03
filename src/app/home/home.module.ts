import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared';

const homeRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: HomeComponent,
  }
]);

@NgModule({
  imports: [
    homeRouting,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
  ]
})
export class HomeModule {}
