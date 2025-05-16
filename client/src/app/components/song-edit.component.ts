import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { SongService } from "../services/song.service";
import { uploadService } from "../services/upload.service"; 
import { GLOBAL } from "../services/global";
import { Song } from "../models/song";
import { User } from "../models/user";
import e from "express";

@Component({
    selector: 'song-edit',
    standalone: true,
    templateUrl: '../views/song-add.html',
    imports: [NgIf, FormsModule, HttpClientModule],
    providers: [UserService, SongService, uploadService]
})

export class SongEditComponent implements OnInit {
    public titulo: string;
    public song: Song;
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
        private _songService: SongService,
        private _uploadService: uploadService
    ) {
        this.titulo = 'editar cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.song = new Song('',1, '', 1, '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        console.log('song-edit.component.ts cargado');
        //sacar la cancion a editar
        this.getSong();
    }

    getSong() {
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._songService.getSong(this.token!, id).subscribe(
                (response: any) => {
                    this.song = response.song;
                    if (!response.song) {
                        this._router.navigate(['/']);
                    } else {
                        this.song = response.song;
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
            this._songService.editSong(this.token, id, this.song).subscribe(
                (response: any) => {
                    this.song = response.song;
                    if (!response.song) {
                        this.errorMessage = ('Error en el servidor');
                    } else {
                        if(!this.filesToUpload){
                             this._router.navigate(['/album', response.song.album]);
                        }else{

                            this.errorMessage = ('La cancion se ha actualizado correctamente');
                            //subir la cancion
                            this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token!, 'file')
                            .then(
                                (result) => {
                                    this._router.navigate(['/album', response.song.album]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            )
                        }
                        //this._router.navigate(['/edit-album', response.song._id]);
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

    fileChangeEvent(fileInput: any){
        this.filesToUpload = fileInput.target.files;
    }

}