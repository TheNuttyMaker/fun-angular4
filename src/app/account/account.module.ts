import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { SharedModule } from '../shared';

const accountRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'account',
    component: AccountComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'account/:id',
    component: AccountComponent,
    // canActivate: [AuthGuard],
    // resolve: {
    //   
    // }
  }
]);

@NgModule({
  imports: [
    accountRouting,
    SharedModule
  ],
  declarations: [
    AccountComponent
  ],
  providers: [
    // EditableArticleResolver
  ]
})
export class AccountModule {}
