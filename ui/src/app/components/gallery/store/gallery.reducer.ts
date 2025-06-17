import { createReducer, on } from '@ngrx/store';
import { loadGallery, loadImagesSuccess, loadImagesFailure } from './gallery.actions';

export interface GalleryState {
    images: string[];
    loading: boolean;
    error: any;
}

export const initialGalleryState: GalleryState = {
    images: [],
    loading: false,
    error: null,
};

export const galleryReducer = createReducer(
    initialGalleryState,
    on(loadGallery, (state) => ({ ...state, loading: true, error: null })),
    on(loadImagesSuccess, (state, { images }) => ({ ...state, images, loading: false })),
    on(loadImagesFailure, (state, { error }) => ({ ...state, error, loading: false }))
);