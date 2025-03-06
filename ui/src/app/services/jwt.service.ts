import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JWTService {
  // Key for storing the token in session storage
  readonly TOKEN_KEY = 'jwtToken';

  constructor() { }

  setJwtToken(token: string){
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isTokenValid(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      console.log("Token valid for " +  this.getTokenRemainingTime() + " seconds");
      return decodedToken.exp > currentTime;
    } catch (error) {
      // Token is invalid (cannot be decoded)
      return false;
    }
  }

  getTokenRemainingTime(): number {
    const token = this.getToken();

    if (!token) {
      return 0;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = decodedToken.exp - currentTime;

      return remainingTime > 0 ? remainingTime : 0;
    } catch (error) {
      return 0;
    }
  }

  clearToken(): void {
    // localStorage.removeItem(this.TOKEN_KEY);
    localStorage.setItem(this.TOKEN_KEY, '');
  }
}
