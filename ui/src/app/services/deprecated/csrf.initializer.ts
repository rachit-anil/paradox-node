import { APP_INITIALIZER, Provider } from '@angular/core';
import { CsrfService } from './csrf.service';

export function csrfInitializerFactory(csrfService: CsrfService): () => Promise<void> {
    return () => csrfService.getCsrfToken().toPromise().then(() => {});
}

export const CSRF_INITIALIZER_PROVIDER: Provider = {
    provide: APP_INITIALIZER,
    useFactory: csrfInitializerFactory,
    deps: [CsrfService],
    multi: true,
};