import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
// import { startAuctionEffect } from './store/auction1/auction.effects';
import * as auctionEffects from './store/auction1/auction.effects';
import { errorInterceptor } from './interceptors/error.interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { 
        duration: 10000,//100000
        verticalPosition: 'top',
        // horizontalPosition: '',
        panelClass: ''
      }
    },
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, tokenInterceptor])), provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideStore(),
    // provideEffects(auctionEffects)
]
};
