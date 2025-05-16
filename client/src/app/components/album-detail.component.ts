import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params, RouterModule } from "@angular/router";
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { GLOBAL } from "../services/global";
import { User } from "../models/user";
import { AlbumService } from "../services/album.service";
import { SongService } from "../services/song.service";
import { Album } from "../models/album";
import { Song } from "../models/song";
import { Artist } from "../models/artist";
import { ArtistService } from "../services/artis.service";

@Component({
    selector: 'album-detail',
    standalone: true,
    templateUrl: '../views/album-detail.html',
    imports: [NgIf, NgForOf, FormsModule, HttpClientModule, RouterModule],
    providers: [UserService, AlbumService, SongService, ArtistService]
})

export class AlbumDetailComponent implements OnInit {
    public identity: User | null = null;
    public album: Album | null = null;
    public artist: Artist | null = null;
    public songs: Array<Song> = [];
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public filesToUpload: Array<File> = [];
    public confirmado: string | null = null;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService,
        private _artistService: ArtistService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }


    ngOnInit() {
        console.log('album-detail.component.ts cargado');
        //Llamar al metodo del api para sacar el album
        this.getAlbum();

    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            if (!this.token) {
                this.errorMessage = 'No se encontró el token de autenticación.';
                return;
            }
            this._albumService.getAlbum(this.token, id).subscribe(
                (response: any) => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
                        this._artistService.getArtist(this.token!, response.album.artist._id).subscribe(
                            (response: any) => {
                                if (!response.artist) {
                                    this.errorMessage = 'No existe el artista.';
                                } else {
                                    this.artist = response.artist;
                                }
                            },
                            error => {
                                console.log(error);
                                this.errorMessage = 'Error al obtener el artista.';
                            }
                        );
                        //sacar los canciones de un album
                        this._songService.getSongs(this.token, response.album._id).subscribe(
                            (response: any) => {
                                if (!response.songs) {
                                    this.errorMessage = 'Este album no tinene canciones';
                                } else {
                                    this.songs = response.songs;
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

    onCancelSong() {
        this.confirmado = null;
    }

    onDeleteSong(id: string) {
        this._songService.deleteSong(this.token!, id).subscribe(
            (response: any) => {
                if (!response.song){
                    alert('Error en el servidor');
                } else {
                    this.getAlbum();
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