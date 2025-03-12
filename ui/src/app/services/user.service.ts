import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const apiUrl = `${environment.baseUrl}`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient,) { }

  saveUserInfo(user: any){
    return this.http.put(`${apiUrl}/api/userDetails/saveUserInfo`,user,{withCredentials: true});
  }

  uploadUserImage(){

  }

}
