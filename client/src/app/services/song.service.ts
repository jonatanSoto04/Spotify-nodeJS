import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { Song } from "../models/song";

@Injectable({
    providedIn: 'root'
})
export class SongService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getSong(token: any, id: number) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'song/' + id, { headers: headers });
    }

    addSong(token: any, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'song', params, { headers: headers });
    }

    editSong(token: any, id: number, song: Song) {
        let params = JSON.stringify(song);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'song/' + id, params, { headers: headers });
    }

}