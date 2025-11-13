import { NgxSpinnerModule } from 'ngx-spinner';

import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headerInterceptor } from './core/interceptors/header.interceptor';
import { errorsInterceptor } from './core/interceptors/errors.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true ,}), provideRouter(routes,withViewTransitions()),
     provideClientHydration(), provideAnimationsAsync(),provideHttpClient(
      withFetch(),
      withInterceptors([headerInterceptor,errorsInterceptor,loadingInterceptor])
     ),
     provideAnimations()
    ],
};
