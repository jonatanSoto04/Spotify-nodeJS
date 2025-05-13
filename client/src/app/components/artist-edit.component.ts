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
import { uploadService } from "../services/upload.service";

@Component({
    selector: 'artist-edit',
    standalone: true,
    templateUrl: '../views/artist-add.html',
    imports: [NgIf, FormsModule, HttpClientModule],
    providers: [UserService, ArtistService, uploadService]
})

export class ArtistEditComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public identity: User | null = null;
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public is_edit;
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: uploadService
    ) {
        this.titulo = 'Editar Artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.artist = new Artist(' ','', '', '');
        this.is_edit = true;
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
    
    onSubmit() {
        console.log(this.artist);
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            if (!this.token) {
                this.errorMessage = 'No se encontró el token de autenticación.';
                return;
            }
            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                (response: any) => {
                    this.artist = response.artist;
                    if (!response.artist) {
                        this.errorMessage = ('Error en el servidor');
                    } else {
                        this.errorMessage = ('El artista se ha actualizado correctamente');
                        
                        //Subir imagen del artista
                        this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, [], this.filesToUpload, this.token!  ,'image')
                            .then(
                                (result) => {
                                    this._router.navigate(['/artist-list', 1]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            )
                        //this.artist = response.artist;
                        //this._router.navigate(['/editar-artista'], response.artist);
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

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }



}