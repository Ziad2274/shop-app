import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authedGuard: CanActivateFn = (route, state) => {
  const _router =inject(Router);
  const isBrowser=inject(PLATFORM_ID)
  if (isPlatformBrowser(isBrowser)) {
      if (localStorage.getItem('userToken') !== null) {
    _router.navigate(['/home']);
    return false;
  }
  return true;
  }
  return false;

};
