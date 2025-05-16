import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { SongService } from "../services/song.service";
import { GLOBAL } from "../services/global";
import { Song } from "../models/song";
import { User } from "../models/user";

@Component({
    selector: 'song-add',
    standalone: true,
    templateUrl: '../views/song-add.html',
    imports: [NgIf, FormsModule, HttpClientModule],
    providers: [UserService, SongService]
})

export class SongAddComponent implements OnInit {
    public titulo: string;
    public song: Song;
    public identity: User | null = null;
    public token: string | null = null;
    public url: string;
    public errorMessage: string | null = null;
    public is_edit;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService
    ) {
        this.titulo = 'Crear nueva cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.song = new Song('',1, '', 1, '', '');
        this.is_edit = false;
    }

    ngOnInit() {
        console.log('song-add.component.ts cargado');
    }


    onSubmit() {
        this._route.params.forEach((params: Params) => {
            let album_id = params['album'];
            this.song.album = album_id;
            console.log(this.song);
            this._songService.addSong(this.token, this.song).subscribe(
                (response: any) => {
                    this.song = response.song;
                    if (!response.song) {
                        this.errorMessage = ('Error en el servidor');
                    } else {
                        this.errorMessage = ('La cancion se ha creado correctamente');
                        this.song = response.song;
                        this._router.navigate(['/edit-song', response.song._id]);
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