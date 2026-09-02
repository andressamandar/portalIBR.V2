import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  forkJoin
} from 'rxjs';

import {
  DisponibilidadeIntegrante,
  DisponibilidadeLimitada,
  DisponibilidadesService
} from '../../../../core/services/disponibilidades.service';

import {
  Integrante,
  IntegrantesService
} from '../../../../core/services/integrantes.service';

import {
  PortalSnackbarService
} from '../../../../core/services/portal-snackbar.service';

import {
  PortalButtonComponent
} from '../../../../shared/components/ui/portal-button/portal-button.component';

import {
  PortalLoadingComponent
} from '../../../../shared/components/ui/portal-loading/portal-loading.component';

import {
  PortalEmptyStateComponent
} from '../../../../shared/components/ui/portal-empty-state/portal-empty-state.component';


interface ColunaData {
  id: string;
  data: string;
  descricao: string;
}


interface LinhaDisponibilidade {
  integranteId: string;
  nome: string;

  disponibilidades: {
    [dataId: string]: boolean | null;
  };
}


@Component({
  selector: 'app-visualizar-disponibilidades',
  standalone: true,
  imports: [
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './visualizar-disponibilidades.component.html',
  styleUrl: './visualizar-disponibilidades.component.scss'
})
export class VisualizarDisponibilidadesComponent
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly disponibilidadesService =
    inject(DisponibilidadesService);

  private readonly integrantesService =
    inject(IntegrantesService);

  private readonly snackbar =
    inject(PortalSnackbarService);


  carregando = false;

  datas: ColunaData[] = [];

  linhas: LinhaDisponibilidade[] = [];

  disponibilidadesLimitadas:
    DisponibilidadeLimitada[] = [];


  ngOnInit(): void {
    this.carregarDados();
  }


  private carregarDados(): void {
    this.carregando = true;

    forkJoin({
      datas:
        this.disponibilidadesService
          .listarDatasDisponiveis(
            'Louvor'
          ),

      integrantes:
        this.integrantesService
          .listar(
            'Louvor'
          ),

      disponibilidades:
        this.disponibilidadesService
          .listar(
            'Louvor'
          ),

      limitadas:
        this.disponibilidadesService
          .listarLimitadas(
            'Louvor'
          )
    }).subscribe({
      next: response => {

        this.datas =
          response.datas.data.map(
            data => ({
              id: data._id,
              data: data.data,
              descricao:
                data.tipo === 'Outros'
                  ? data.nome_evento ?? 'Evento'
                  : data.tipo
            })
          );

        this.disponibilidadesLimitadas =
          response.limitadas.data;

        this.montarTabela(
          response.integrantes.data,
          response.disponibilidades.data
        );

        this.carregando = false;
      },

      error: erro => {
        this.carregando = false;

        const mensagem =
          erro?.error?.message ??
          'Não foi possível carregar as disponibilidades.';

        this.snackbar.error(
          mensagem
        );
      }
    });
  }


  private montarTabela(
    integrantes: Integrante[],
    disponibilidades:
      DisponibilidadeIntegrante[]
  ): void {

    this.linhas =
      integrantes.map(
        integrante => {

          const preenchimento =
            disponibilidades.find(
              item =>
                item.integrante_id ===
                integrante._id
            );

          const disponibilidadesPorData: {
            [dataId: string]:
              boolean | null;
          } = {};

          for (const data of this.datas) {

            const item =
              preenchimento
                ?.disponibilidades
                .find(
                  disponibilidade =>
                    disponibilidade.data_id ===
                    data.id
                );

            disponibilidadesPorData[
              data.id
            ] =
              item
                ? item.disponivel
                : null;
          }

          return {
            integranteId:
              integrante._id,

            nome:
              integrante.nome,

            disponibilidades:
              disponibilidadesPorData
          };
        }
      )
      .sort(
        (a, b) =>
          a.nome.localeCompare(
            b.nome,
            'pt-BR'
          )
      );
  }


  obterDisponibilidade(
    linha: LinhaDisponibilidade,
    dataId: string
  ): boolean | null {

    return (
      linha.disponibilidades[
        dataId
      ] ?? null
    );
  }


  formatarData(
    data: string
  ): string {

    const [
      ano,
      mes,
      dia
    ] = data.split('-');

    return `${dia}/${mes}`;
  }


  voltar(): void {
    void this.router.navigate([
      '/louvor/lideranca/escala'
    ]);
  }
}