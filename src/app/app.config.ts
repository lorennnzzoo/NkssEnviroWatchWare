import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { definePreset } from '@primeng/themes';
import { provideToastr } from 'ngx-toastr';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e6f2fa',
      100: '#cce5f5',
      200: '#99cbed',
      300: '#66b0e5',
      400: '#3396dc',
      500: '#1478B4',  // Base Color
      600: '#126aa1',
      700: '#0f5a87',
      800: '#0c496e',
      900: '#093956',
      950: '#052637'   // Darkest
      // 50: '#f1f8e7',
      // 100: '#e3f1cf',
      // 200: '#cbe3a9',
      // 300: '#b3d583',
      // 400: '#9bc85d',
      // 500: '#8EC04A',  // Base Color
      // 600: '#7eac42',
      // 700: '#6b9638',
      // 800: '#587f2e',
      // 900: '#446625',
      // 950: '#2e4a18'   // Darkest


    },
    secondary: {

    }
  }
});
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withHashLocation()), provideHttpClient(), provideAnimations(), provideToastr(), provideAnimationsAsync(),
  providePrimeNG({
    theme: {
      preset: MyPreset,
      options: {
        darkModeSelector: false || 'none'
      }
    }
  })]
};


