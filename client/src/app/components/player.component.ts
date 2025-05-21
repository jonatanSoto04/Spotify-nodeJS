import { Component, OnInit } from "@angular/core";
import { Song } from "../models/song";
import { GLOBAL } from "../services/global";
import { NgIf } from "@angular/common";

@Component({
  selector: 'player',
  templateUrl: '../views/player.html',
    standalone: true,
    imports: [NgIf],
})

export class PlayerComponent implements OnInit {
    public url: string;
    public song: Song | null = null;

    constructor(){
        this.url = GLOBAL.url;
        this.song = new Song('', 1, '', 1, '', '');
    }


    ngOnInit(): void {
        let song = JSON.parse(localStorage.getItem('currentSong')!);
        if(song){
            this.song = song;
        }else{
            this.song = new Song('', 1, '', 1, '', '');
        }
    }
}