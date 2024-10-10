import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationComponent } from './github-integration/integration/integration.component';

const routes: Routes = [
  { path: '', component: IntegrationComponent },
  { path: 'auth', component: IntegrationComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
