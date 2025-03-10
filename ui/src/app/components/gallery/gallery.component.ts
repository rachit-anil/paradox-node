import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {MatButtonModule} from "@angular/material/button";
import {GalleryService} from "../../services/gallery.service";

@Component({
    selector: "app-gallery",
    standalone: true,
    imports: [MatButtonModule],
    templateUrl: "./gallery.component.html",
    styleUrl: "./gallery.component.scss",
})
export class GalleryComponent implements OnInit {
    constructor(
                private http: HttpClient,
                private authService: AuthService,
                private galleryService: GalleryService,
                ) {
    }

    ngOnInit() {
    }

    fetchGallery() {
        this.galleryService.getGalleryContents()
            .subscribe({
                next: (response: any) => {
                    console.log("Gallery details");
                },
                error: (error) => {
                },
            });
    }
}
