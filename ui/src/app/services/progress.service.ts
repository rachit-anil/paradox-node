import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProgressService {
  private progressBarSubject = new Subject<boolean>();

  get progressStatus() {
    return this.progressBarSubject;
  }

  showProgressBar() {
    this.progressBarSubject.next(true);
  }

  hideProgressBar() {
    this.progressBarSubject.next(false);
  }
}
