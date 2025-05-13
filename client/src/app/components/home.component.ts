import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { User } from "../models/user";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'home',
    standalone: true,
    templateUrl: '../views/home.html',
    imports: [FormsModule, HttpClientModule, RouterModule],
})

export class HomeComponent implements OnInit{
    public titulo: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Artistas';
    }

    ngOnInit(){
        console.log('home.component.ts cargado');
        //listado de artistas
    }

}