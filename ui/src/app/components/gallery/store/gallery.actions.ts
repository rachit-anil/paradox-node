import { createAction, props } from '@ngrx/store';

export const loadGallery = createAction('[Gallery] Load Gallery');
export const loadImagesSuccess = createAction(
    '[Gallery] Load Images Success',
    props<{ images: string[] }>()
);
export const loadImagesFailure = createAction(
    '[Gallery] Load Images Failure',
    props<{ error: any }>()
);