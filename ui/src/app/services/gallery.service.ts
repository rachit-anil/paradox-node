import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

const apiUrl = `${environment.baseUrl}`;


//Should be injected only when the user is logged in
//Should be lazy loaded
@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(  private http: HttpClient,) { }

  getGalleryContents(){
    return this.http
        .get(`${apiUrl}/auth/gallery` , {withCredentials: true});
  }
}
