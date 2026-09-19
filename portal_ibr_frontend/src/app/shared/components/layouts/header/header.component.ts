import {
  Component,
  OnInit
} from '@angular/core';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  AuthService,
  AuthUsuario
} from '../../../../core/services/auth.service';

import {
  Notificacao,
  NotificacoesService
} from '../../../../core/services/notificacoes.service';


@Component({
  selector: 'app-header',

  imports: [
    MatIconModule,
    MatButtonModule
  ],

  templateUrl:
    './header.component.html',

  styleUrl:
    './header.component.scss'
})
export class HeaderComponent
  implements OnInit {

  usuario: AuthUsuario | null = null;

  notificacoes: Notificacao[] = [];

  naoLidas = 0;

  painelNotificacoesAberto = false;

  carregandoNotificacoes = false;


  constructor(
    private authService:
      AuthService,

    private notificacoesService:
      NotificacoesService
  ) {}


  ngOnInit(): void {
    this.usuario =
      this.authService.obterUsuario();

    this.carregarQuantidadeNaoLidas();
  }


  get nomeUsuario(): string {
    return (
      this.usuario?.nome
      ||
      'Usuário'
    );
  }


  get inicialUsuario(): string {
    return (
      this.nomeUsuario
        .trim()
        .charAt(0)
        .toUpperCase()
      ||
      'U'
    );
  }


  get perfilUsuario(): string {
    switch (
      this.usuario?.perfil
    ) {

      case 'lideranca_louvor':
        return 'Liderança Louvor';

      case 'lideranca_midia':
        return 'Liderança Mídia';

      case 'integrante_louvor':
        return 'Integrante Louvor';

      case 'integrante_midia':
        return 'Integrante Mídia';

      default:
        return '';
    }
  }


  carregarQuantidadeNaoLidas(): void {
    this.notificacoesService
      .contarNaoLidas()
      .subscribe({
        next: response => {
          this.naoLidas =
            response.data.nao_lidas;
        },

        error: () => {
          this.naoLidas = 0;
        }
      });
  }


  alternarPainelNotificacoes(): void {
    this.painelNotificacoesAberto =
      !this.painelNotificacoesAberto;

    if (
      this.painelNotificacoesAberto
    ) {
      this.carregarNotificacoes();
    }
  }


  fecharPainelNotificacoes(): void {
    this.painelNotificacoesAberto =
      false;
  }


  carregarNotificacoes(): void {
    this.carregandoNotificacoes =
      true;

    this.notificacoesService
      .listar()
      .subscribe({
        next: response => {
          this.notificacoes =
            response.data.notificacoes;

          this.naoLidas =
            response.data.nao_lidas;

          this.carregandoNotificacoes =
            false;
        },

        error: () => {
          this.notificacoes = [];

          this.carregandoNotificacoes =
            false;
        }
      });
  }


  marcarComoLida(
    notificacao: Notificacao
  ): void {

    if (notificacao.lida) {
      return;
    }

    this.notificacoesService
      .marcarComoLida(
        notificacao._id
      )
      .subscribe({
        next: () => {
          notificacao.lida = true;

          if (
            this.naoLidas > 0
          ) {
            this.naoLidas--;
          }
        }
      });
  }


  marcarTodasComoLidas(): void {
    if (
      this.naoLidas === 0
    ) {
      return;
    }

    this.notificacoesService
      .marcarTodasComoLidas()
      .subscribe({
        next: () => {
          this.notificacoes =
            this.notificacoes.map(
              notificacao => ({
                ...notificacao,
                lida: true
              })
            );

          this.naoLidas = 0;
        }
      });
  }


  formatarHorario(
    data: string | null
  ): string {

    if (!data) {
      return '';
    }

    const dataNotificacao =
      new Date(data);

    const agora =
      new Date();

    const diferencaMs =
      agora.getTime()
      -
      dataNotificacao.getTime();

    const diferencaMinutos =
      Math.floor(
        diferencaMs / 60000
      );

    if (
      diferencaMinutos < 1
    ) {
      return 'Agora';
    }

    if (
      diferencaMinutos < 60
    ) {
      return (
        `Há ${diferencaMinutos} min`
      );
    }

    const diferencaHoras =
      Math.floor(
        diferencaMinutos / 60
      );

    if (
      diferencaHoras < 24
    ) {
      return (
        `Há ${diferencaHoras}h`
      );
    }

    return (
      dataNotificacao
        .toLocaleDateString(
          'pt-BR'
        )
    );
  }


  iconeNotificacao(
    tipo: Notificacao['tipo']
  ): string {

    switch (tipo) {

      case 'disponibilidade_salva':
      case 'disponibilidade_alterada':
        return 'event_available';

      case 'escala_criada':
      case 'escala_alterada':
        return 'calendar_month';

      case 'louvores_definidos':
      case 'louvores_alterados':
        return 'music_note';

      case 'solicitacao_nova':
      case 'solicitacao_editada':
        return 'campaign';

      default:
        return 'notifications';
    }
  }

}