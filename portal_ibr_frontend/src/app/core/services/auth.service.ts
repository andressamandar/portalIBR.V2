import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';


export type AuthPerfil =
  | 'lideranca_louvor'
  | 'lideranca_midia'
  | 'integrante_louvor'
  | 'integrante_midia';


export interface LoginRequest {
  perfil: AuthPerfil;
  senha: string;
  nome?: string;
}


export interface AuthUsuario {
  id: string | null;
  nome: string;
  perfil: AuthPerfil;
}


export interface LoginResponse {
  success: boolean;

  data: {
    usuario: AuthUsuario;
    token: string;
  };

  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/usuarios`;

  private readonly tokenKey =
    'portal_ibr_token';

  private readonly usuarioKey =
    'portal_ibr_usuario';


  login(
    dados: LoginRequest
  ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      dados
    );
  }


  salvarSessao(
    token: string,
    usuario: AuthUsuario
  ): void {
    localStorage.setItem(
      this.tokenKey,
      token
    );

    localStorage.setItem(
      this.usuarioKey,
      JSON.stringify(usuario)
    );
  }


  obterToken(): string | null {
    return localStorage.getItem(
      this.tokenKey
    );
  }


  obterUsuario(): AuthUsuario | null {
    const usuario =
      localStorage.getItem(
        this.usuarioKey
      );

    if (!usuario) {
      return null;
    }

    try {
      return JSON.parse(usuario) as AuthUsuario;
    } catch {
      return null;
    }
  }


  logout(): void {
    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.usuarioKey
    );
  }


  estaAutenticado(): boolean {
    return !!this.obterToken();
  }
}