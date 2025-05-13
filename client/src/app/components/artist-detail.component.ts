import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artis.service";
import { GLOBAL } from "../services/global";
import { Artist } from '../models/artist';
import { User } from "../models/user";

@Component({
    selector: 'artist-detail',
    standalone: true,
    templateUrl: '../views/artist-detail.html',
    imports: [NgIf, FormsModule, HttpClientModule],
    providers: [UserService, ArtistService]
})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist | null = null;
    public identity: User | null = null;
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
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
                    this.artist = response.artist;
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;
                        //sacar los album del artista
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
        });
    }

}