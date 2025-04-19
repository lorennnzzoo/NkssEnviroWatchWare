import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const serviceUserBlockGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('Role');

  if (!role) return true; // Let AuthGuard or login page handle no-token case

  try {


    if (role === 'Service') {
      // Block access and redirect
      return router.createUrlTree(['/unauthorized']);
    }

    return true;
  } catch (e) {
    // Invalid token format or decode error
    return router.createUrlTree(['/login']);
  }
};
