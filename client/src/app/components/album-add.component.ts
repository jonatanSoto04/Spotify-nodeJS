import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artis.service";
import { AlbumService } from "../services/album.service";
import { GLOBAL } from "../services/global";
import { Artist } from '../models/artist';
import { Album } from "../models/album";

@Component({
    selector: 'album-add',
    standalone: true,
    templateUrl: '../views/album-add.html',
    imports: [NgIf, FormsModule, HttpClientModule],
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist | null = null;
    public album: Album;
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Crear nuevo album';
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.album = new Album('', '', '', 2025, '', '');
        this.is_edit= false;
    }

    ngOnInit() {
        console.log('albumComponent corriendo');
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let artist_id = params['artist'];
            this.album.artist = artist_id;
            this._albumService.addAlbum(this.token, this.album).subscribe(
                (response: any) => {
                    this.album = response.album;
                    if (!response.album) {
                        this.errorMessage = ('Error en el servidor');
                    } else {
                        this.errorMessage = ('El album se ha creado correctamente');
                        this.album = response.album;
                        this._router.navigate(['/edit-album', response.album._id]);
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
    fileChangeEvent(event: any): void {
        const file = event.target.files[0];
        console.log('Archivo seleccionado:', file);
    }
}