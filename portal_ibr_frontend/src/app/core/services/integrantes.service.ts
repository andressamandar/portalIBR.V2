import {Injectable,inject} from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

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

  listar(
    ministerio: MinisterioIntegrante,
    somenteAtivos = true
  ): Observable<IntegrantesResponse> {
    let params = new HttpParams()
      .set('ministerio', ministerio);

    if (somenteAtivos) {
      params = params.set('ativos', 'true');
    }

    return this.http.get<IntegrantesResponse>(
      this.apiUrl,
      { params }
    );
  }

  cadastrar(
    dados: CadastrarIntegranteRequest
  ): Observable<CadastrarIntegranteResponse> {
    return this.http.post<CadastrarIntegranteResponse>(
      this.apiUrl,
      dados
    );
  }

  buscarPorId(
    id: string
  ): Observable<IntegranteResponse> {
    return this.http.get<IntegranteResponse>(
      `${this.apiUrl}/${id}`
    );
  }


  editar(
    id: string,
    dados: EditarIntegranteRequest
  ): Observable<EditarIntegranteResponse> {
    return this.http.put<EditarIntegranteResponse>(
      `${this.apiUrl}/${id}`,
      dados
    );
  }


}


export interface Integrante {
  _id: string;
  nome: string;
  ministerios: string[];
  funcoes: string[];
  perfil_ministro: boolean;
  ativo: boolean;
  data_cadastro: string | null;
}

export interface IntegrantesResponse {
  success: boolean;
  data: Integrante[];
  total: number;
  message?: string;
}

export interface CadastrarIntegranteRequest {
  nome: string;
  ministerios: string[];
  funcoes: string[];
  perfil_ministro: boolean;
}

export interface CadastrarIntegranteResponse {
  success: boolean;

  data: {
    id: string;
  };

  message?: string;
}

export interface IntegranteResponse {
  success: boolean;
  data: Integrante;
  message?: string;
}

export interface EditarIntegranteRequest {
  nome: string;
  ministerios: string[];
  funcoes: string[];
  perfil_ministro: boolean;
}

export interface EditarIntegranteResponse {
  success: boolean;
  message?: string;
}