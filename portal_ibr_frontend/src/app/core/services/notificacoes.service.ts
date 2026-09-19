import {
  HttpClient
} from '@angular/common/http';

import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs';


export interface Notificacao {
  _id: string;

  tipo:
    | 'disponibilidade_salva'
    | 'disponibilidade_alterada'
    | 'escala_criada'
    | 'escala_alterada'
    | 'louvores_definidos'
    | 'louvores_alterados'
    | 'solicitacao_nova'
    | 'solicitacao_editada';

  titulo: string;
  mensagem: string;

  ministerio:
    | 'Louvor'
    | 'Midia'
    | string;

  destinatario_perfil: string;
  destinatario_id: string | null;

  referencia_tipo: string | null;
  referencia_id: string | null;

  lida: boolean;

  data_cadastro: string | null;
  expira_em: string | null;
}


export interface NotificacoesResponse {
  success: boolean;

  data: {
    notificacoes: Notificacao[];
    nao_lidas: number;
  };

  total: number;
}


export interface NaoLidasResponse {
  success: boolean;

  data: {
    nao_lidas: number;
  };
}


export interface NotificacaoResponse {
  success: boolean;

  data: Notificacao;

  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {

  private readonly apiUrl =
    'http://localhost:5000/api/notificacoes';


  constructor(
    private http: HttpClient
  ) {}


  listar(): Observable<
    NotificacoesResponse
  > {
    return this.http.get<
      NotificacoesResponse
    >(
      this.apiUrl
    );
  }


  contarNaoLidas(): Observable<
    NaoLidasResponse
  > {
    return this.http.get<
      NaoLidasResponse
    >(
      `${this.apiUrl}/nao-lidas`
    );
  }


  marcarComoLida(
    id: string
  ): Observable<
    NotificacaoResponse
  > {
    return this.http.put<
      NotificacaoResponse
    >(
      `${this.apiUrl}/${id}/lida`,
      {}
    );
  }


  marcarTodasComoLidas(): Observable<
    unknown
  > {
    return this.http.put(
      `${this.apiUrl}/marcar-todas-lidas`,
      {}
    );
  }

}