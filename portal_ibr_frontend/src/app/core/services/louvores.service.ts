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


export type CategoriaLouvor =
  | 'Agitado'
  | 'Calmo';


export interface Louvor {
  _id: string;
  louvor: string;
  link: string;
  tom: string;
  categoria: CategoriaLouvor | '';
}

export interface LouvoresResponse {
  success: boolean;
  data: Louvor[];
  total: number;
  message?: string;
}


export interface LouvorResponse {
  success: boolean;
  data: Louvor;
  message?: string;
}

export interface SalvarLouvorRequest {
  louvor: string;
  link: string;
  tom: string;
  categoria: CategoriaLouvor;
}


export interface AcaoLouvorResponse {
  success: boolean;
  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class LouvoresService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/louvores`;


  listar(): Observable<LouvoresResponse> {

    return this.http.get<LouvoresResponse>(
      this.apiUrl
    );
  }


  buscarPorId(
    louvorId: string
  ): Observable<LouvorResponse> {

    return this.http.get<LouvorResponse>(
      `${this.apiUrl}/${louvorId}`
    );
  }


  cadastrar(
    dados: SalvarLouvorRequest
  ): Observable<LouvorResponse> {

    return this.http.post<LouvorResponse>(
      this.apiUrl,
      dados
    );
  }


  editar(
    louvorId: string,
    dados: SalvarLouvorRequest
  ): Observable<LouvorResponse> {

    return this.http.put<LouvorResponse>(
      `${this.apiUrl}/${louvorId}`,
      dados
    );
  }


  excluir(
    louvorId: string
  ): Observable<AcaoLouvorResponse> {

    return this.http.delete<AcaoLouvorResponse>(
      `${this.apiUrl}/${louvorId}`
    );
  }
}