import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jeIgracRuta = state.url.startsWith('/igrac-stranica');
  const token = jeIgracRuta ? sessionStorage.getItem('tokenI') : sessionStorage.getItem('tokenT');
  if (token) {
    return true;
  }
  router.navigate(['login-stranica']);
  return false;
};
