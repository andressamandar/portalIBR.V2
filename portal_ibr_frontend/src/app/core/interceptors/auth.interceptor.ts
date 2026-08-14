import {
  inject
} from '@angular/core';

import {
  HttpInterceptorFn
} from '@angular/common/http';

import {
  AuthService
} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request,
  next
) => {
  const authService = inject(AuthService);

  const token = authService.obterToken();

  if (!token) {
    return next(request);
  }

  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authenticatedRequest);
};