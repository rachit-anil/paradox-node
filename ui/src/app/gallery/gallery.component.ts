import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-gallery",
  standalone: true,
  imports: [],
  templateUrl: "./gallery.component.html",
  styleUrl: "./gallery.component.scss",
})
export class GalleryComponent implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.getGalleryDetails();
  }

  getGalleryDetails() {
    this.http
      .get("http://localhost:8080/gallery", { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          console.log("Gallery details");
        },
        error: (error) => {},
      });
  }
}
