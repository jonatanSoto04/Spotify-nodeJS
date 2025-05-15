import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params, RouterModule } from "@angular/router";
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { GLOBAL } from "../services/global";
import { User } from "../models/user";
import { AlbumService } from "../services/album.service";
import { Album } from "../models/album";

@Component({
    selector: 'album-detail',
    standalone: true,
    templateUrl: '../views/album-detail.html',
    imports: [NgIf, FormsModule, HttpClientModule, RouterModule],
    providers: [UserService, AlbumService]
})

export class AlbumDetailComponent implements OnInit {
    public identity: User | null = null;
    public album: Album | null = null;
    public albums: Album[] = [];
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public filesToUpload: Array<File> = [];
    public confirmado: string | null = null;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService
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
        console.log('getAlbum el metodo funciona');
        
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
                        /*
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
                            */
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
    
}