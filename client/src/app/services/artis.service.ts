import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { GLOBAL } from './global';
import { Artist } from "../models/artist";

@Injectable({
    providedIn: 'root'
})
export class ArtistService {
    public url: string;

    constructor (private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    getArtists(token: string, page: number){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization':token
        })
        return this._http.get(this.url+'artists/'+page, {headers});
    }

    getArtist(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization':token
        })
        return this._http.get(this.url+'artist/'+id, {headers});
    }

    addArtist(token: any, artist: Artist){
        let pareams = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.post(this.url+'artist',pareams, {headers: headers});
    }

    editArtist(token: string, id:string, artist: Artist){
        let pareams = JSON.stringify(artist);
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization':token
        });

        return this._http.put(this.url+'artist/'+id, pareams, {headers: headers});
    }

    deleteArtist(token: string, id: string){
        let headers = new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization':token
        })
        return this._http.delete(this.url+'artist/'+id, {headers});
    }
}