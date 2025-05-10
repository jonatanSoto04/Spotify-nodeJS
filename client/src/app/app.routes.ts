import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit.component';


export const routes: Routes = [
  { path: 'user-edit', component: UserEditComponent },
  { path: '', redirectTo: 'user-edit', pathMatch: 'full' },
  { path: '**', component: UserEditComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);