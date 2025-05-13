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

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    imports: [NgIf, NgForOf, FormsModule, HttpClientModule, RouterModule],
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public titulo: string;
    public artists: Artist[] = [];
    public identity: User | null = null;
    public token: string | null = null;
    public url: string;
    public next_page;
    public prev_page;
    public errorMessage: string | null = null;
    public confirmado: string | null = null;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit() {
        console.log('artist-list.component.ts cargado');
        //listado de artistas
        this.getArtists();
    }

    getArtists() {
        this._route.params.forEach((params: Params) => {
            let page = +params['page'];
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;
                if (this.prev_page == 0) {
                    this.prev_page = 1;
                }
            }

            this._artistService.getArtists(this.token!, page).subscribe(
                (response: any) => {
                    this.artists = response.artists;
                    if (!response.artists) {
                        this._router.navigate(['/']);
                    } else {
                        this.artists = response.artists;
                        console.log(this.artists + 'Lista de artistas');
                        console.log(response.artists);
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
    onDeleteConfirm(id: string) {
        this.confirmado = id;
    }

    onCancelArtist() {
        this.confirmado = null;
    }

    onDeleteArtist(id: string) {
        this._artistService.deleteArtist(this.token!, id).subscribe(
            (response: any) => {
                if (!response.artist) {
                    alert('Error en el servidor')
                } else {
                    this.getArtists();
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