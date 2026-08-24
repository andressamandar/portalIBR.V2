import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';


export type MinisterioDisponibilidade =
  | 'Louvor'
  | 'Midia';


export interface DataDisponivel {
  _id: string;
  data: string;
  tipo: string;
  nome_evento: string | null;
}


export interface DisponibilidadeItem {
  data_id: string;
  data: string;
  disponivel: boolean;
}


export interface DisponibilidadeIntegrante {
  _id: string;
  integrante_id: string;
  integrante_nome: string;
  ministerio: MinisterioDisponibilidade;
  disponibilidades: DisponibilidadeItem[];
  data_preenchimento: string | null;
}


export interface IntegranteDisponivel {
  integrante_id: string;
  integrante_nome: string;
}


export interface PreenchimentoDisponibilidade {
  nome: string;
  preencheu: boolean;
}


export interface DisponibilidadeLimitada {
  nome: string;
  datas: string[];
}


export interface DatasDisponiveisResponse {
  success: boolean;
  data: DataDisponivel[];
  message?: string;
}


export interface DisponibilidadeResponse {
  success: boolean;
  data: DisponibilidadeIntegrante | null;
  message?: string;
}


export interface IntegrantesDisponiveisResponse {
  success: boolean;
  data: IntegranteDisponivel[];
  total: number;
  message?: string;
}


export interface PreenchimentoResponse {
  success: boolean;
  data: PreenchimentoDisponibilidade[];
  message?: string;
}


export interface DisponibilidadesLimitadasResponse {
  success: boolean;
  data: DisponibilidadeLimitada[];
  message?: string;
}


export interface SalvarDisponibilidadeRequest {
  integrante_id: string;
  integrante_nome: string;
  ministerio: MinisterioDisponibilidade;
  disponibilidades: DisponibilidadeItem[];
}


@Injectable({
  providedIn: 'root'
})
export class DisponibilidadesService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/disponibilidades`;


  listarDatasDisponiveis(
    ministerio: MinisterioDisponibilidade
  ): Observable<DatasDisponiveisResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<DatasDisponiveisResponse>(
      `${this.apiUrl}/datas-disponiveis`,
      { params }
    );
  }


  salvar(
    dados: SalvarDisponibilidadeRequest
  ): Observable<DisponibilidadeResponse> {
    return this.http.post<DisponibilidadeResponse>(
      this.apiUrl,
      dados
    );
  }


  buscarPorIntegrante(
    integranteId: string,
    ministerio: MinisterioDisponibilidade
  ): Observable<DisponibilidadeResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<DisponibilidadeResponse>(
      `${this.apiUrl}/integrante/${integranteId}`,
      { params }
    );
  }


  listarDisponiveisPorData(
    dataId: string,
    ministerio: MinisterioDisponibilidade
  ): Observable<IntegrantesDisponiveisResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<IntegrantesDisponiveisResponse>(
      `${this.apiUrl}/data/${dataId}/disponiveis`,
      { params }
    );
  }


  visualizarPreenchimento(
    ministerio: MinisterioDisponibilidade
  ): Observable<PreenchimentoResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<PreenchimentoResponse>(
      `${this.apiUrl}/preenchimento`,
      { params }
    );
  }


  listarLimitadas(
    ministerio: MinisterioDisponibilidade
  ): Observable<DisponibilidadesLimitadasResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<DisponibilidadesLimitadasResponse>(
      `${this.apiUrl}/limitadas`,
      { params }
    );
  }
}