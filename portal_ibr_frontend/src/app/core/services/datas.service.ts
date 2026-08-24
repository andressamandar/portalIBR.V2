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


export type TipoData =
  | 'Domingo'
  | 'Quinta'
  | 'Outros';

export type MinisterioData =
  | 'Louvor'
  | 'Midia';


export interface DataEscala {
  _id: string;
  ministerio: MinisterioData;
  data: string;
  tipo: TipoData;
  nome_evento: string | null;
  escala_criada: boolean;
  ativo: boolean;
  data_cadastro: string | null;
}


export interface DatasResponse {
  success: boolean;
  data: DataEscala[];
  total: number;
  message?: string;
}


export interface DataResponse {
  success: boolean;
  data: DataEscala;
  message?: string;
}


export interface SalvarDataRequest {
  ministerio: MinisterioData;
  data: string;
  tipo: TipoData;
  nome_evento: string | null;
}


export interface CadastrarDataResponse {
  success: boolean;

  data: {
    id: string;
  };

  message?: string;
}


export interface AcaoDataResponse {
  success: boolean;
  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class DatasService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/api/datas`;


  listar(
    ministerio: MinisterioData
  ): Observable<DatasResponse> {
    const params = new HttpParams()
      .set('ministerio', ministerio);

    return this.http.get<DatasResponse>(
      this.apiUrl,
      { params }
    );
  }


  buscarPorId(
    id: string
  ): Observable<DataResponse> {
    return this.http.get<DataResponse>(
      `${this.apiUrl}/${id}`
    );
  }


  cadastrar(
    dados: SalvarDataRequest
  ): Observable<CadastrarDataResponse> {
    return this.http.post<CadastrarDataResponse>(
      this.apiUrl,
      dados
    );
  }


  editar(
    id: string,
    dados: SalvarDataRequest
  ): Observable<AcaoDataResponse> {
    return this.http.put<AcaoDataResponse>(
      `${this.apiUrl}/${id}`,
      dados
    );
  }


  desativar(
    id: string
  ): Observable<AcaoDataResponse> {
    return this.http.delete<AcaoDataResponse>(
      `${this.apiUrl}/${id}`
    );
  }


  marcarEscalaCriada(
    id: string
  ): Observable<AcaoDataResponse> {
    return this.http.put<AcaoDataResponse>(
      `${this.apiUrl}/${id}/escala-criada`,
      {}
    );
  }
}