import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthPerfil,
  AuthService
} from '../services/auth.service';


export const authGuard: CanActivateFn = (
  route
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.obterToken();
  const usuario = authService.obterUsuario();

  if (!token || !usuario) {
    return router.createUrlTree(['/']);
  }

  const perfisPermitidos =
    route.data?.['perfis'] as AuthPerfil[] | undefined;

  if (
    perfisPermitidos &&
    !perfisPermitidos.includes(usuario.perfil)
  ) {
    return router.createUrlTree(['/']);
  }

  return true;
};