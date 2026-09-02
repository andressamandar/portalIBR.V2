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


export interface LouvorEscalado {
  louvor_id: string;
  louvor: string;
  link: string;
  categoria: string;
  tom: string;
}


export interface LouvoresEscala {
  _id: string;
  ministerio: string;
  data_id: string;
  louvores: LouvorEscalado[];
  ultima_atualizacao: string | null;
}


export interface LouvoresEscalaResponse {
  success: boolean;
  data: LouvoresEscala | null;
  message?: string;
}


export interface LouvoresEscalaListaResponse {
  success: boolean;
  data: LouvoresEscala[];
  total: number;
  message?: string;
}


export interface SalvarLouvorEscalaItem {
  louvor_id: string;
  tom: string;
}


export interface SalvarLouvoresEscalaRequest {
  ministerio: string;
  data_id: string;
  louvores: SalvarLouvorEscalaItem[];
}


@Injectable({
  providedIn: 'root'
})
export class LouvoresEscalaService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/louvores-escala`;


  listar(
    ministerio: string
  ): Observable<LouvoresEscalaListaResponse> {

    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<LouvoresEscalaListaResponse>(
      this.apiUrl,
      { params }
    );
  }


  buscarPorData(
    dataId: string,
    ministerio: string
  ): Observable<LouvoresEscalaResponse> {

    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<LouvoresEscalaResponse>(
      `${this.apiUrl}/data/${dataId}`,
      { params }
    );
  }


  salvar(
    dados: SalvarLouvoresEscalaRequest
  ): Observable<LouvoresEscalaResponse> {

    return this.http.post<LouvoresEscalaResponse>(
      this.apiUrl,
      dados
    );
  }
}