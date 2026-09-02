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
  AuthService,
  AuthUsuario
} from '../../../../core/services/auth.service';

import {
  DataDisponivel,
  DisponibilidadesService,
  SalvarDisponibilidadeRequest
} from '../../../../core/services/disponibilidades.service';

import {
  Escala,
  EscalasService
} from '../../../../core/services/escalas.service';

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


interface DataDisponibilidadeTela {
  data_id: string;
  data: string;
  tipo: string;
  nome_evento: string | null;
  disponivel: boolean;
  bloqueadaPorLouvor: boolean;
}


@Component({
  selector: 'app-disponibilidade',
  standalone: true,
  imports: [
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './disponibilidade.component.html',
  styleUrl: './disponibilidade.component.scss'
})
export class DisponibilidadeComponent
  implements OnInit {

  private readonly authService =
    inject(AuthService);

  private readonly disponibilidadesService =
    inject(DisponibilidadesService);

  private readonly escalasService =
    inject(EscalasService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);


  readonly usuario: AuthUsuario | null =
    this.authService.obterUsuario();


  datas: DataDisponibilidadeTela[] = [];

  carregando = false;

  salvando = false;


  ngOnInit(): void {
    this.carregarDisponibilidades();
  }


  private carregarDisponibilidades(): void {

    if (!this.usuario?.id) {

      this.snackbar.error(
        'Não foi possível identificar o integrante.'
      );

      void this.router.navigate([
        '/midia/integrante'
      ]);

      return;
    }


    this.carregando = true;


    forkJoin({

      datas:
        this.disponibilidadesService
          .listarDatasDisponiveis(
            'Midia'
          ),

      disponibilidade:
        this.disponibilidadesService
          .buscarPorIntegrante(
            this.usuario.id,
            'Midia'
          ),

      escalasLouvor:
        this.escalasService.listar(
          'Louvor'
        )

    }).subscribe({

      next: response => {

        const datasDisponiveis =
          response.datas.data;

        const disponibilidadesSalvas =
          response.disponibilidade
            .data
            ?.disponibilidades ?? [];

        const escalasLouvor =
          response.escalasLouvor.data;


        this.prepararDatas(
          datasDisponiveis,
          disponibilidadesSalvas,
          escalasLouvor
        );


        this.carregando =
          false;

      },


      error: erro => {

        this.carregando =
          false;


        const mensagem =
          erro?.error?.message ??
          'Não foi possível carregar as datas disponíveis.';


        this.snackbar.error(
          mensagem
        );

      }

    });

  }


  private prepararDatas(
    datasDisponiveis: DataDisponivel[],
    disponibilidadesSalvas: {
      data_id: string;
      data: string;
      disponivel: boolean;
    }[],
    escalasLouvor: Escala[]
  ): void {

    if (!this.usuario?.id) {
      return;
    }


    this.datas =
      datasDisponiveis.map(
        data => {

          const disponibilidadeSalva =
            disponibilidadesSalvas.find(
              item =>
                item.data_id === data._id
            );


          const bloqueadaPorLouvor =
            this.estaEscaladoNoLouvor(
              data.data,
              escalasLouvor
            );


          return {

            data_id:
              data._id,

            data:
              data.data,

            tipo:
              data.tipo,

            nome_evento:
              data.nome_evento,

            bloqueadaPorLouvor,

            disponivel:
              bloqueadaPorLouvor
                ? false
                : disponibilidadeSalva
                  ? disponibilidadeSalva.disponivel
                  : true

          };

        }
      );

  }


  private estaEscaladoNoLouvor(
    data: string,
    escalasLouvor: Escala[]
  ): boolean {

    if (!this.usuario?.id) {
      return false;
    }


    const escalaDaData =
      escalasLouvor.find(
        escala =>
          escala.data === data
      );


    if (!escalaDaData) {
      return false;
    }


    return Object
      .values(
        escalaDaData.funcoes ?? {}
      )
      .some(
        integrantes =>
          integrantes.some(
            integrante =>
              integrante.id ===
              this.usuario?.id
          )
      );

  }


  alternarDisponibilidade(
    item: DataDisponibilidadeTela
  ): void {

    if (item.bloqueadaPorLouvor) {

      this.snackbar.warning(
        'Você já está escalado no Ministério de Louvor nesta data.'
      );

      return;
    }


    item.disponivel =
      !item.disponivel;

  }


  salvar(): void {

    if (
      !this.usuario?.id ||
      this.salvando
    ) {
      return;
    }


    this.salvando =
      true;


    const dados:
      SalvarDisponibilidadeRequest = {

      integrante_id:
        this.usuario.id,

      integrante_nome:
        this.usuario.nome,

      ministerio:
        'Midia',

      disponibilidades:
        this.datas.map(
          item => ({

            data_id:
              item.data_id,

            data:
              item.data,

            disponivel:
              item.bloqueadaPorLouvor
                ? false
                : item.disponivel

          })
        )

    };


    this.disponibilidadesService
      .salvar(
        dados
      )
      .subscribe({

        next: response => {

          this.salvando =
            false;


          this.snackbar.success(
            response.message ??
            'Disponibilidade salva com sucesso.'
          );

        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível salvar sua disponibilidade.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  formatarData(
    data: string
  ): string {

    const [
      ano,
      mes,
      dia
    ] =
      data.split('-');


    return `${dia}/${mes}/${ano}`;

  }


  descricaoData(
    item: DataDisponibilidadeTela
  ): string {

    if (
      item.tipo === 'Outros' &&
      item.nome_evento
    ) {
      return item.nome_evento;
    }


    return item.tipo;

  }


  voltar(): void {

    void this.router.navigate([
      '/midia/integrante'
    ]);

  }

}