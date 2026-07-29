import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  environment
} from '../../../environments/environment';

export type MinisterioIntegrante =
  | 'Louvor'
  | 'Midia';

export interface IntegranteLogin {
  id: string;
  nome: string;
}

export interface IntegrantesLoginResponse {
  success: boolean;
  data: IntegranteLogin[];
  total: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IntegrantesService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/integrantes`;

  listarOpcoesLogin(
    ministerio: MinisterioIntegrante
  ): Observable<IntegrantesLoginResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<IntegrantesLoginResponse>(
      `${this.apiUrl}/login-opcoes`,
      { params }
    );
  }
}