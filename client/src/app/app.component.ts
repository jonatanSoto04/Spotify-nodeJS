import { Component, OnInit, ɵrestoreComponentResolutionQueue } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from './services/user.service'
import { User } from './models/user';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { error } from 'console';
import { response } from 'express';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, RouterOutlet, FormsModule, HttpClientModule, RouterModule],
  providers: [UserService],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public title = 'cliente';
  public user: User;
  public user_register: User;
  public identity: User | null = null;
  public token: String | null = null;
  public errorMessage: String | null = null;
  public alertRegister: String | null = null;
  constructor(
    private _userService: UserService
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');

  }
//crear sesion
  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit() {
    console.log(this.user);
    // Conseguir los datos de usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if (!this.identity || !this.identity._id) {
          alert("El usuario no está correctamente identificado");
        } else {
          // Crear elemento en el localstorage para tener al usuario en sesión
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('identity', JSON.stringify(identity));
          }

          // Conseguir el token para enviárselo a cada petición HTTP
          this._userService.signup(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if (!token || token.length <= 0) {
                alert("El token no se ha generado");
              } else {
                // Crear elemento en el localstorage para tener token disponible
                if (typeof window !== 'undefined' && window.localStorage) {
                  localStorage.setItem('token', token);
                }
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
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
  //cerrar sesion
  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear;
    this.identity = null;
    this.token = null;

  }
  //registrar nuevo usuario
  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;
        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        console.log(error);
        if (error.error && error.error.message) {
          this.alertRegister = error.error.message;
        } else {
          this.alertRegister = 'Error inesperado en la petición.';
        }
      }
    );
  }


}
