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
    selector: 'artist-add',
    standalone: true,
    templateUrl: '../views/artist-add.html',
    imports: [NgIf, FormsModule, HttpClientModule],
    providers: [UserService, ArtistService]
})

export class ArtistLAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity: User | null = null;
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Crear artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.artist = new Artist('', '', '', '');
        this.is_edit = false;
    }

    ngOnInit() {
        console.log('artist-add.component.ts cargado');

        //listado de artistas
    }

    onSubmit() {
        console.log(this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe(
            (response: any) => {
                this.artist = response.artist;
                if (!response.artist) {
                    this.errorMessage = ('Error en el servidor');
                } else {
                    this.errorMessage = ('El artista se ha creado correctamente');
                    this.artist = response.artist;
                    this._router.navigate(['/edit-artist', response.artist._id]);
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

    fileChangeEvent(event: any): void {
        const file = event.target.files[0];
        console.log('Archivo seleccionado:', file);
    }

}