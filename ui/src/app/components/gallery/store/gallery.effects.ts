import {inject, Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import { loadImagesSuccess, loadImagesFailure, loadGallery} from './gallery.actions';
import {GalleryService} from "../../../services/gallery.service";

@Injectable()
export class GalleryEffects {
    constructor(private galleryService: GalleryService) {
    }

    private actions$ = inject(Actions); // ← Lazy injection

    loadImages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadGallery),
            switchMap(() =>
                // Simulate an API call
                this.galleryService.getGalleryContents().pipe(
                    map((data: any) => loadImagesSuccess({ images: [data.message] })),
                    catchError((error) => of(loadImagesFailure({ error })))
                )
            )
        )
    );

}