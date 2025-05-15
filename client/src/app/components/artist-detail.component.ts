import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params, RouterModule } from "@angular/router";
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artis.service";
import { GLOBAL } from "../services/global";
import { Artist } from '../models/artist';
import { User } from "../models/user";
import { AlbumService } from "../services/album.service";
import { Album } from "../models/album";
import { resourceLimits } from "worker_threads";

@Component({
    selector: 'artist-detail',
    standalone: true,
    templateUrl: '../views/artist-detail.html',
    imports: [NgIf, NgForOf, FormsModule, HttpClientModule, RouterModule],
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
    public identity: User | null = null;
    public artist: Artist | null = null;
    public albums: Album[] | null = null;
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public filesToUpload: Array<File> = [];
    public confirmado: string | null = null;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }


    ngOnInit() {
        console.log('artist-add.component.ts cargado');
        //Llamar al metodo del api para sacar el id getArtist
        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            if (!this.token) {
                this.errorMessage = 'No se encontró el token de autenticación.';
                return;
            }
            this._artistService.getArtist(this.token, id).subscribe(
                (response: any) => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;
                        //sacar los album del artista
                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            (response: any) => {
                                if (!response.albums) {
                                    this.errorMessage = 'Este artista no tiene albums'
                                } else {
                                    this.albums = response.albums;
                                }
                            },
                            error => {
                                console.log(error);
                                if (error.error && error.error.message) {
                                    this.errorMessage = error.error.message;
                                } else {
                                    this.errorMessage = 'Error inesperado en la petición.';
                                }
                            });
                    }
                },
                error => {
                    console.log(error);
                    if (error.error && error.error.message) {
                        this.errorMessage = error.error.message;
                    } else {
                        this.errorMessage = 'Error inesperado en la petición.';
                    }
                });
        });
    }
    onDeleteConfirm(id: string) {
        this.confirmado = id;
    }

    onCancelAlbum() {
        this.confirmado = null;
    }

    onDeleteAlbum(id: string) {
        this._artistService.deleteArtist(this.token!, id).subscribe(
            (response: any) => {
                if (!response.artist) {
                    alert('Error en el servidor')
                } else {
                    //this.getArtists();
                }
            },
            error => {
                console.log(error);
                if (error.error && error.error.message) {
                    this.errorMessage = error.error.message;
                } else {
                    this.errorMessage = 'Error inesperado en la petición.';
                }
            }
        );
    }
}