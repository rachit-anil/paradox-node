import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {ProgressService} from "./progress.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import { environment } from '../../environments/environment';
import {JWTService} from "./jwt.service";
import {Router} from "@angular/router";
import {SnackbarService} from "./snackbar.service";

const apiUrl = `${environment.baseUrl}`;

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private authenticationStatus$ = new BehaviorSubject<boolean>(false); // This should be managed based on your authentication logic
    private authenticationStatus = false; // This should be managed based on your authentication logic

    constructor(
        private http: HttpClient,
        private progressService: ProgressService,
        private snackbarService: SnackbarService,
        private jwtService: JWTService,
        private router: Router
    ) {
    }

    setUserAuthenticationStatus(authenticationStatus: boolean) {
        this.authenticationStatus = authenticationStatus;
        this.authenticationStatus$.next(this.authenticationStatus);
    }

    get isUserAuthenticated$(): Observable<boolean> {
        return this.authenticationStatus$.asObservable();
    }

    get isUserAuthenticated(): boolean {
        return this.authenticationStatus;
    }

    logoutUser() {
        this.jwtService.clearToken();
        this.router.navigate(['/login']);
        this.snackbarService.openSnackBar('Token Expired. Please login');
        this.setUserAuthenticationStatus(false);
    }

    loginUser(username: string, password: string) {
        // return this.http.post(`${apiUrl}/auth/login`, {email, password});
        const basicAuthHeader = "Basic " + btoa(username + ":" + password);
        const headers = new HttpHeaders({
            Authorization: basicAuthHeader,
        });

        return this.http
            .post(`${apiUrl}/auth/login`,{username, password},{withCredentials:true});
    }

    registerUser(registerData: any) {
        return this.http.post(`${apiUrl}/auth/signup`, registerData);
    }

    gallery(){
    }

    refreshToken(){
        return this.http.get(`${apiUrl}/auth/refreshToken`,{withCredentials:true});
    }
}
