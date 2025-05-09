import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs'
import { GLOBAL } from './global';
import { Interpolation } from "@angular/compiler";

//permite usar este servicio en otras clases o en otros componentes
@Injectable({
    providedIn: 'root'
})
export class UserService {
    public url: string;
    public identity = null;
    public token: string | null = null;
    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }
    signup(user_to_login: any, gethash: boolean | null = null): Observable<any> {
        if (gethash != null) {
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'login', params, { headers });
    }

    register(user_to_register: any): Observable<any>{
        let params = JSON.stringify(user_to_register); 
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'register', params, { headers: headers });
    }

    getIdentity() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const identity = JSON.parse(localStorage.getItem('identity')!);
            this.identity = identity !== 'undefined' ? identity : null;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const token = localStorage.getItem('token');
            this.token = token !== 'undefined' ? token : null;
        } else {
            this.token = null;
        }
        return this.token;
    }
}
