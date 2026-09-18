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


export type StatusSolicitacao =
  | 'Recebida'
  | 'Convertida';


export type StatusTarefaSolicitacao =
  | 'A Fazer'
  | 'Fazendo'
  | 'Concluído'
  | null;


export interface Solicitacao {

  _id: string;

  ministerio: string;

  solicitante: string;

  formatos_solicitados: string[];

  descricao: string;

  sugestao_arte: string;

  data_evento: string;

  horario_evento: string;

  data_entrega: string;

  status: StatusSolicitacao;

  tarefa_id: string | null;

  status_tarefa: StatusTarefaSolicitacao;

  data_cadastro: string | null;

}


export interface SolicitacoesResponse {

  success: boolean;

  data: Solicitacao[];

  total: number;

  message?: string;

}


export interface SolicitacaoResponse {

  success: boolean;

  data: Solicitacao;

  message?: string;

}


export interface NovaSolicitacaoRequest {

  ministerio: string;

  solicitante: string;

  formatos_solicitados: string[];

  descricao: string;

  sugestao_arte: string;

  data_evento: string;

  horario_evento: string;

  data_entrega: string;

}


export interface NovaSolicitacaoResponse {

  success: boolean;

  data: {
    id: string;
  };

  message?: string;

}


export interface ConverterSolicitacaoResponse {

  success: boolean;

  data: {
    tarefa_id: string;
  };

  message?: string;

}


@Injectable({
  providedIn: 'root'
})
export class SolicitacoesService {

  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    `${environment.apiUrl}/api/solicitacoes`;


  cadastrar(
    dados: NovaSolicitacaoRequest
  ): Observable<NovaSolicitacaoResponse> {

    return this.http.post<NovaSolicitacaoResponse>(
      this.apiUrl,
      dados
    );

  }


  listar(): Observable<SolicitacoesResponse> {

    return this.http.get<SolicitacoesResponse>(
      this.apiUrl
    );

  }


  buscarPorId(
    solicitacaoId: string
  ): Observable<SolicitacaoResponse> {

    return this.http.get<SolicitacaoResponse>(
      `${this.apiUrl}/${solicitacaoId}`
    );

  }


  converterEmTarefa(
    solicitacaoId: string
  ): Observable<ConverterSolicitacaoResponse> {

    return this.http.put<ConverterSolicitacaoResponse>(
      `${this.apiUrl}/${solicitacaoId}/converter`,
      {}
    );

  }

}