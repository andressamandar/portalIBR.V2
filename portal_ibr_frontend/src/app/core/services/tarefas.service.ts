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


export type StatusTarefa =
  | 'A Fazer'
  | 'Fazendo'
  | 'Concluído';


export interface Tarefa {
  _id: string;

  ministerio: string;

  solicitante: string;

  formatos_solicitados: string[];

  descricao: string;

  sugestao_arte: string;

  data_evento: string;

  horario_evento: string;

  data_entrega: string;

  status: StatusTarefa;

  responsavel_id: string | null;

  responsavel_nome: string | null;

  data_cadastro: string | null;
}


export interface TarefasResponse {
  success: boolean;

  data: Tarefa[];

  total: number;

  message?: string;
}


export interface TarefaResponse {
  success: boolean;

  data: Tarefa;

  message?: string;
}


export interface SalvarTarefaRequest {
  ministerio: string;

  solicitante: string;

  formatos_solicitados: string[];

  descricao: string;

  sugestao_arte: string;

  data_evento: string;

  horario_evento: string;

  data_entrega: string;
}


export interface AcaoTarefaResponse {
  success: boolean;

  data?: {
    id?: string;
  };

  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class TarefasService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/tarefas`;


  listar(): Observable<TarefasResponse> {

    return this.http.get<TarefasResponse>(
      this.apiUrl
    );

  }


  buscarPorId(
    tarefaId: string
  ): Observable<TarefaResponse> {

    return this.http.get<TarefaResponse>(
      `${this.apiUrl}/${tarefaId}`
    );

  }


  cadastrar(
    dados: SalvarTarefaRequest
  ): Observable<AcaoTarefaResponse> {

    return this.http.post<AcaoTarefaResponse>(
      this.apiUrl,
      dados
    );

  }


  editar(
    tarefaId: string,
    dados: SalvarTarefaRequest
  ): Observable<AcaoTarefaResponse> {

    return this.http.put<AcaoTarefaResponse>(
      `${this.apiUrl}/${tarefaId}`,
      dados
    );

  }


  excluir(
    tarefaId: string
  ): Observable<AcaoTarefaResponse> {

    return this.http.delete<AcaoTarefaResponse>(
      `${this.apiUrl}/${tarefaId}`
    );

  }


  assumir(
    tarefaId: string
  ): Observable<AcaoTarefaResponse> {

    return this.http.put<AcaoTarefaResponse>(
      `${this.apiUrl}/${tarefaId}/assumir`,
      {}
    );

  }


  concluir(
    tarefaId: string
  ): Observable<AcaoTarefaResponse> {

    return this.http.put<AcaoTarefaResponse>(
      `${this.apiUrl}/${tarefaId}/concluir`,
      {}
    );

  }

}