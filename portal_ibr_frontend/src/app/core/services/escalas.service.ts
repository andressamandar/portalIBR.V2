import {Injectable,inject} from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';




export type MinisterioEscala =
  | 'Louvor'
  | 'Midia';


export interface IntegranteEscala {
  id: string;
  nome: string;
  ativo: boolean;
}


export interface Escala {
  _id: string;
  ministerio: MinisterioEscala;
  data_id: string;
  data: string;

  funcoes: {
    [nomeFuncao: string]: IntegranteEscala[];
  };

  data_criacao: string | null;
  ultima_atualizacao: string | null;
}


export interface EscalasResponse {
  success: boolean;
  data: Escala[];
  total: number;
  message?: string;
}


export interface EscalaResponse {
  success: boolean;
  data: Escala | null;
  message?: string;
}


export interface SalvarEscalaRequest {
  ministerio: MinisterioEscala;
  data_id: string;
  data: string;

  funcoes: {
    [nomeFuncao: string]: string[];
  };
}


export interface AcaoEscalaResponse {
  success: boolean;
  data?: Escala;
  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class EscalasService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/escalas`;


  listar(
    ministerio: MinisterioEscala
  ): Observable<EscalasResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<EscalasResponse>(
      this.apiUrl,
      { params }
    );
  }


  buscarPorData(
    dataId: string,
    ministerio: MinisterioEscala
  ): Observable<EscalaResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<EscalaResponse>(
      `${this.apiUrl}/data/${dataId}`,
      { params }
    );
  }


  buscarPorId(
    escalaId: string
  ): Observable<EscalaResponse> {
    return this.http.get<EscalaResponse>(
      `${this.apiUrl}/${escalaId}`
    );
  }


  criar(
    dados: SalvarEscalaRequest
  ): Observable<AcaoEscalaResponse> {
    return this.http.post<AcaoEscalaResponse>(
      this.apiUrl,
      dados
    );
  }


  editar(
    escalaId: string,
    dados: SalvarEscalaRequest
  ): Observable<AcaoEscalaResponse> {
    return this.http.put<AcaoEscalaResponse>(
      `${this.apiUrl}/${escalaId}`,
      dados
    );
  }


  excluir(
    escalaId: string
  ): Observable<AcaoEscalaResponse> {
    return this.http.delete<AcaoEscalaResponse>(
      `${this.apiUrl}/${escalaId}`
    );
  }
}