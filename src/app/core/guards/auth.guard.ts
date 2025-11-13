import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _router =inject(Router);
  const isBrowser=inject(PLATFORM_ID)
  if (isPlatformBrowser(isBrowser)) {

  if (localStorage.getItem('userToken') === null) {
    _router.navigate(['/login']);
    return false;
  }
  return true;
}
return false;
};
