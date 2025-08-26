import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {MatButtonModule} from "@angular/material/button";
import {GalleryService} from "../../services/gallery.service";
import {Store} from "@ngrx/store";
import {GalleryState} from "./store/gallery.reducer";
import {loadGallery} from "./store/gallery.actions";

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
                private store: Store<{ gallery: GalleryState }>
                ) {
    }

    ngOnInit() {
    }

    fetchGallery() {
        // this.store.dispatch(loadGallery());

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
