import {Component,inject,OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {LogoComponent} from '../../../../shared/components/ui/logo/logo.component';
import {PortalInputComponent} from '../../../../shared/components/ui/portal-input/portal-input.component';
import {PortalAutocompleteComponent} from '../../../../shared/components/ui/portal-autocomplete/portal-autocomplete.component';
import {PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';
import {IntegrantesService,IntegranteLogin,MinisterioIntegrante} from '../../../../core/services/integrantes.service';
import {AuthService,AuthPerfil} from '../../../../core/services/auth.service';
import {PortalSnackbarService} from '../../../../core/services/portal-snackbar.service';


type LoginMinisterio = 'louvor' | 'midia';

type LoginPerfil = 'lideranca' | 'integrante';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    LogoComponent,
    PortalInputComponent,
    PortalAutocompleteComponent,
    PortalButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly integrantesService =
    inject(IntegrantesService);

  private readonly authService =
    inject(AuthService);

  private readonly snackbar =
    inject(PortalSnackbarService);


  readonly ministerio =
    this.route.snapshot.data['ministerio'] as LoginMinisterio;

  readonly perfil =
    this.route.snapshot.data['perfil'] as LoginPerfil;


  integrantes: IntegranteLogin[] = [];

  integranteSelecionado:
    IntegranteLogin | null = null;

  senha = '';

  carregandoIntegrantes = false;
  enviando = false;


  ngOnInit(): void {
    if (this.ehIntegrante) {
      this.carregarIntegrantes();
    }
  }


  get nomeMinisterio(): string {
    return this.ministerio === 'louvor'
      ? 'Ministério de Louvor'
      : 'Ministério de Mídia';
  }


  get tituloPerfil(): string {
    return this.perfil === 'lideranca'
      ? 'Acesso da Liderança'
      : 'Acesso do Integrante';
  }


  get descricaoPerfil(): string {
    if (this.perfil === 'lideranca') {
      return 'Informe a senha da liderança para continuar.';
    }

    return 'Selecione seu nome e informe a senha para continuar.';
  }


  get ehIntegrante(): boolean {
    return this.perfil === 'integrante';
  }


  get formularioValido(): boolean {
    const senhaPreenchida =
      this.senha.trim().length > 0;

    if (this.ehIntegrante) {
      return (
        this.integranteSelecionado !== null &&
        senhaPreenchida
      );
    }

    return senhaPreenchida;
  }


  private carregarIntegrantes(): void {
    this.carregandoIntegrantes = true;

    const ministerio: MinisterioIntegrante =
      this.ministerio === 'louvor'
        ? 'Louvor'
        : 'Midia';

    this.integrantesService
      .listarOpcoesLogin(ministerio)
      .subscribe({
        next: response => {
          this.integrantes = response.data;
          this.carregandoIntegrantes = false;
        },

        error: erro => {
          this.integrantes = [];
          this.carregandoIntegrantes = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar os integrantes.';

          this.snackbar.error(mensagem);
        }
      });
  }


  private obterPerfilApi(): AuthPerfil {
    if (
      this.ministerio === 'louvor' &&
      this.perfil === 'lideranca'
    ) {
      return 'lideranca_louvor';
    }

    if (
      this.ministerio === 'louvor' &&
      this.perfil === 'integrante'
    ) {
      return 'integrante_louvor';
    }

    if (
      this.ministerio === 'midia' &&
      this.perfil === 'lideranca'
    ) {
      return 'lideranca_midia';
    }

    return 'integrante_midia';
  }


  entrar(): void {
    if (!this.formularioValido || this.enviando) {
      return;
    }

    this.enviando = true;

    const dados = {
      perfil: this.obterPerfilApi(),
      senha: this.senha.trim(),
      ...(this.ehIntegrante
        ? {
            nome:
              this.integranteSelecionado?.nome
          }
        : {})
    };

    this.authService
      .login(dados)
      .subscribe({
        next: response => {
          this.authService.salvarSessao(
            response.data.token,
            response.data.usuario
          );

          this.enviando = false;

          this.snackbar.success(
            `Bem-vindo(a), ${response.data.usuario.nome}.`
          );

          switch (response.data.usuario.perfil) {
            case 'lideranca_louvor':
              void this.router.navigate([
                '/louvor/lideranca'
              ]);
              break;

            case 'integrante_louvor':
              void this.router.navigate([
                '/louvor/integrante'
              ]);
              break;

            case 'lideranca_midia':
              void this.router.navigate([
                '/midia/lideranca'
              ]);
              break;

            case 'integrante_midia':
              void this.router.navigate([
                '/midia/integrante'
              ]);
              break;
          }
        },

        error: erro => {
          this.enviando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível realizar o login.';

          this.snackbar.error(mensagem);
        }
      });
  }


  voltar(): void {
    void this.router.navigate([
      `/${this.ministerio}`
    ]);
  }
}