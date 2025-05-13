import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';
import { GLOBAL } from '../services/global';

@Component({
    standalone: true,
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    imports: [NgIf, FormsModule, HttpClientModule],
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public titulo: string;
    public user: User;
    public identity: User | null = null;
    public token: string | null = null;
    public alertMessage: string | null = null;
    public url:string;
    public filesToUpload: Array<File> | null = null;

    constructor(
        private _userService: UserService
    ) {
        this.titulo = 'Actualizar mis datos';

        // LocalStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url
        if (this.identity) {
            this.user = this.identity;
        } else {
            this.user = new User('', '', '', '', '', 'ROLE_USER', '');
        }
    }

    ngOnInit() {
        console.log('user-edit.component.ts cargado');
    }

    onSubmit() {
        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.alertMessage = 'El usuario no se ha actualizado';
                } else {
                    //this.user = response.user; 
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById("identity_name")!.innerHTML = this.user.name;
                    
                    if(!this.filesToUpload){
                        //redireccion
                    }else{
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload)
                        .then(
                            (result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                let image_path = this.url + 'get-image-user/' + this.user.image;
                                document.getElementById("image-logged")?.setAttribute('src', image_path);
                            });
                    }
                    this.alertMessage = 'El usuario se ha actualizado conrrectamente';
                }
            },
            error => {
                console.log(error);
                if (error.error && error.error.message) {
                    this.alertMessage = error.error.message;
                } else {
                    this.alertMessage = 'Error inesperado en la petición.';
                }
            }
        );
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        var token = this.token;
        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST', url, true);
            if (token) {
                xhr.setRequestHeader('Authorization', token);
            }
            xhr.send(formData);
        });
    }

}