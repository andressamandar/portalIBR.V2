import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

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

  escala_criada: boolean;

  salva: boolean;

  editando: boolean;
}


@Component({
  selector: 'app-disponibilidade',

  standalone: true,

  imports: [
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],

  templateUrl:
    './disponibilidade.component.html',

  styleUrl:
    './disponibilidade.component.scss'
})
export class DisponibilidadeComponent
  implements OnInit {

  private readonly authService =
    inject(AuthService);

  private readonly disponibilidadesService =
    inject(
      DisponibilidadesService
    );

  private readonly snackbar =
    inject(
      PortalSnackbarService
    );

  private readonly router =
    inject(Router);


  readonly usuario:
    AuthUsuario | null =
      this.authService
        .obterUsuario();


  datas:
    DataDisponibilidadeTela[] = [];

  carregando = false;

  salvando = false;


  ngOnInit(): void {
    this.carregarDisponibilidades();
  }


  get temDatasEmEdicao(): boolean {
    return this.datas.some(
      item =>
        !item.escala_criada
        &&
        (
          !item.salva
          ||
          item.editando
        )
    );
  }


  get possuiAlteracao(): boolean {
    return this.datas.some(
      item =>
        item.editando
    );
  }


  private carregarDisponibilidades():
    void {

    if (!this.usuario?.id) {

      this.snackbar.error(
        'Não foi possível identificar o integrante.'
      );

      void this.router.navigate([
        '/louvor/integrante'
      ]);

      return;
    }

    this.carregando = true;

    this.disponibilidadesService
      .listarDatasDisponiveis(
        'Louvor'
      )
      .subscribe({
        next: response => {
          this.prepararDatas(
            response.data
          );
        },

        error: erro => {
          this.carregando = false;

          const mensagem =
            erro?.error?.message
            ??
            'Não foi possível carregar as datas disponíveis.';

          this.snackbar.error(
            mensagem
          );
        }
      });
  }


  private prepararDatas(
    datasDisponiveis:
      DataDisponivel[]
  ): void {

    if (!this.usuario?.id) {
      this.carregando = false;
      return;
    }

    this.disponibilidadesService
      .buscarPorIntegrante(
        this.usuario.id,
        'Louvor'
      )
      .subscribe({
        next: response => {

          const salvas =
            response.data
              ?.disponibilidades
            ??
            [];

          this.datas =
            datasDisponiveis
              .filter(data => {

                const salva =
                  salvas.find(
                    item =>
                      item.data_id
                      ===
                      data._id
                  );

                /*
                 * Data sem escala:
                 * sempre aparece.
                 *
                 * Data com escala:
                 * só continua aparecendo
                 * caso o integrante já
                 * tenha informado sua
                 * disponibilidade.
                 */

                return (
                  !data.escala_criada
                  ||
                  !!salva
                );
              })
              .map(data => {

                const disponibilidadeSalva =
                  salvas.find(
                    item =>
                      item.data_id
                      ===
                      data._id
                  );

                const salva =
                  !!disponibilidadeSalva;

                return {
                  data_id:
                    data._id,

                  data:
                    data.data,

                  tipo:
                    data.tipo,

                  nome_evento:
                    data.nome_evento,

                  disponivel:
                    disponibilidadeSalva
                      ? disponibilidadeSalva
                          .disponivel
                      : true,

                  escala_criada:
                    data.escala_criada,

                  salva,

                  editando:
                    !salva
                    &&
                    !data.escala_criada
                };
              });

          this.carregando = false;
        },

        error: erro => {
          this.carregando = false;

          const mensagem =
            erro?.error?.message
            ??
            'Não foi possível carregar sua disponibilidade.';

          this.snackbar.error(
            mensagem
          );
        }
      });
  }


  alternarDisponibilidade(
    item:
      DataDisponibilidadeTela
  ): void {

    if (
      item.escala_criada
    ) {
      return;
    }

    if (
      item.salva
      &&
      !item.editando
    ) {
      return;
    }

    item.disponivel =
      !item.disponivel;
  }


  editarDisponibilidade(
    item:
      DataDisponibilidadeTela
  ): void {

    if (
      item.escala_criada
    ) {
      return;
    }

    item.editando = true;
  }


  salvar(): void {

    if (
      !this.usuario?.id
      ||
      this.salvando
      ||
      !this.temDatasEmEdicao
    ) {
      return;
    }

    this.salvando = true;

    const dados:
      SalvarDisponibilidadeRequest = {

      integrante_id:
        this.usuario.id,

      integrante_nome:
        this.usuario.nome,

      ministerio:
        'Louvor',

      disponibilidades:
        this.datas.map(
          item => ({
            data_id:
              item.data_id,

            data:
              item.data,

            disponivel:
              item.disponivel
          })
        )
    };

    this.disponibilidadesService
      .salvar(
        dados
      )
      .subscribe({
        next: () => {

          this.salvando = false;

          this.datas =
            this.datas.map(
              item => ({
                ...item,

                salva: true,

                editando: false
              })
            );

          this.snackbar.success(
            'Disponibilidade salva com sucesso.'
          );
        },

        error: erro => {

          this.salvando = false;

          const mensagem =
            erro?.error?.message
            ??
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
    ] = data.split(
      '-'
    );

    return (
      `${dia}/${mes}/${ano}`
    );
  }


  descricaoData(
    item:
      DataDisponibilidadeTela
  ): string {

    if (
      item.tipo === 'Outros'
      &&
      item.nome_evento
    ) {
      return item.nome_evento;
    }

    return item.tipo;
  }


  voltar(): void {

    void this.router.navigate([
      '/louvor/integrante'
    ]);
  }

}