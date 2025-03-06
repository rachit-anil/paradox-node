import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: "app-gallery",
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: "./gallery.component.html",
    styleUrl: "./gallery.component.scss",
})
export class GalleryComponent implements OnInit {
    constructor(private http: HttpClient, private authService: AuthService) {
    }

    ngOnInit() {
    }

    fetchGallery() {
        this.http
            .get("http://localhost:8080/auth/gallery", {withCredentials: true})
            .subscribe({
                next: (response: any) => {
                    console.log("Gallery details");
                },
                error: (error) => {
                },
            });
    }
}
