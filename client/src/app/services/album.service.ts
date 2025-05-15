import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { Album } from "../models/album";

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getAlbums(token: any, artistId = null) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        if (artistId == null) {
            return this._http.get(this.url + 'albums', { headers: headers });
        } else {
            return this._http.get(this.url + 'albums/' + artistId, { headers: headers });
        }


    }

    getAlbum(token: string, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.get(this.url + 'album/' + id, { headers });
    }

    addAlbum(token: any, album: Album) {
        let pareams = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'album', pareams, { headers: headers });
    }

    editAlbum(token: any, id: string, album: Album) {
        let pareams = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'album/' + id, pareams, { headers: headers });
    }

    deleteAlbum(token: string, id: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url + 'album/' + id, { headers });
    }

}