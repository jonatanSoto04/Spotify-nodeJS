import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
//import usuario
import { UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from "./components/home.component";
//Import de artista
import { ArtistListComponent } from "./components/artist-list.component";
import { ArtistLAddComponent } from "./components/artist-add.component";
import { ArtistEditComponent } from "./components/artist-edit.component";
import { ArtistDetailComponent } from "./components/artist-detail.component";
//import album
import { AlbumAddComponent } from "./components/album-add.component";
import { AlbumEditComponent } from "./components/album-edit.component";
import { AlbumDetailComponent } from "./components/album-detail.component";
//impor de cancion
import { SongEditComponent } from "./components/song-edit.component";
import { SongAddComponent } from "./components/song-add.component";

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'artist-list/:page', component: ArtistListComponent},
  { path: 'crear-artist', component: ArtistLAddComponent},
  { path: 'mis-datos', component: UserEditComponent },
  { path: 'edit-artist/:id', component: ArtistEditComponent },
  { path: 'artista/:id', component: ArtistDetailComponent },
  { path: 'crear-album/:artist', component: AlbumAddComponent},
  { path: 'edit-album/:id', component: AlbumEditComponent },
  { path: 'album/:id', component: AlbumDetailComponent },
  { path: 'crear-cancion/:album', component: SongAddComponent},
  { path: 'edit-song/:id', component: SongEditComponent },
  { path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes);