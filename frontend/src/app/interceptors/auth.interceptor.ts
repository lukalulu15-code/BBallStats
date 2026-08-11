import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const jeIgracRuta = router.url.startsWith('/igrac-stranica');
  const token = jeIgracRuta ? sessionStorage.getItem('tokenI') : sessionStorage.getItem('tokenT');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
