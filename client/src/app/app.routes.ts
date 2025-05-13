import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from "./components/artist-list.component";
import { HomeComponent } from "./components/home.component";
import { ArtistLAddComponent } from "./components/artist-add.component";
import { ArtistEditComponent } from "./components/artist-edit.component";
import { ArtistDetailComponent } from "./components/artist-detail.component";

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'artist-list/:page', component: ArtistListComponent},
  { path: 'crear-artist', component: ArtistLAddComponent},
  { path: 'mis-datos', component: UserEditComponent },
  { path: 'edit-artist/:id', component: ArtistEditComponent },
  { path: 'artista/:id', component: ArtistDetailComponent },
  { path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);