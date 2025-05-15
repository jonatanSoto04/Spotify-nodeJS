import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { ArtistService } from "../services/artis.service";
import { AlbumService } from "../services/album.service";
import { GLOBAL } from "../services/global";
import { Album } from "../models/album";
import { uploadService } from "../services/upload.service";

@Component({
    selector: 'album-edit',
    standalone: true,
    templateUrl: '../views/album-add.html',
    imports: [NgIf, FormsModule, HttpClientModule],
    providers: [UserService, AlbumService, uploadService]
})

export class AlbumEditComponent implements OnInit {
    public titulo: string;
    public album: Album;
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public is_edit;
    public filesToUpload: Array<File> = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: uploadService
    ) {
        this.titulo = 'Editar album';
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.album = new Album('', '', '', 2025, '', '');
        this.is_edit = true;
        this._uploadService;
    }

    ngOnInit() {
        console.log('albumComponent corriendo');
        //Captura el album
        this.getAlbum();
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token!, id).subscribe(
                (response: any) => {
                    this.album = response.album;
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
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
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                (response: any) => {
                    this.album = response.album;
                    if (!response.album) {
                        this.errorMessage = ('Error en el servidor');
                    } else {
                        if (!this.filesToUpload) {
                            // redirigir
                            this._router.navigate(['/artista', response.album.artist]);
                        } else {
                            this.errorMessage = ('El album se ha actualizado correctamente');
                            //Subir imagen del album
                            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token!, 'image')
                                .then(
                                    (result) => {
                                        this._router.navigate(['/artista', response.album.artist]);
                                    },
                                    (error) => {
                                        console.log(error);
                                    }
                                )
                        }
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