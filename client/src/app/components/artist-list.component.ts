import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params, RouterModule } from "@angular/router";
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from "../services/user.service";
import { GLOBAL } from "../services/global";
import { Artist } from '../models/artist';
import { User } from "../models/user";

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    imports: [NgIf, FormsModule, HttpClientModule, RouterModule],
    providers: [UserService]
})

export class ArtistListComponent implements OnInit{
    public titulo: string;
    public artist: Artist[] = [];
    public identity: User | null = null;
    public token: string | null = null;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
    }

    ngOnInit(){
        console.log('artist-list.component.ts cargado');
        //listado de artistas
    }

}