import {Component,inject,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriaLouvor,LouvoresService,SalvarLouvorRequest} from '../../../../core/services/louvores.service';
import {PortalSnackbarService} from '../../../../core/services/portal-snackbar.service';
import {PortalInputComponent} from '../../../../shared/components/ui/portal-input/portal-input.component';
import {PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';
import {PortalLoadingComponent} from '../../../../shared/components/ui/portal-loading/portal-loading.component';
import {PortalSelectComponent,PortalSelectOption} from '../../../../shared/components/ui/portal-select/portal-select.component';

@Component({
  selector: 'app-louvor-form',
  standalone: true,
  imports: [
    FormsModule,
    PortalInputComponent,
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalSelectComponent,

  ],
  templateUrl: './louvor-form.component.html',
  styleUrl: './louvor-form.component.scss'
})
export class LouvorFormComponent
  implements OnInit {

  private readonly louvoresService =
    inject(LouvoresService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);


  louvor = '';
  link = '';
  tom = '';

  categoriaSelecionada:
  PortalSelectOption | null = null;


  readonly categorias:
    PortalSelectOption[] = [
      {
        id: 'agitado',
        nome: 'Agitado',
        valor: 'Agitado'
      },
      {
        id: 'calmo',
        nome: 'Calmo',
        valor: 'Calmo'
      }
    ];

  carregando = false;
  salvando = false;


  readonly louvorId =
    this.route.snapshot.paramMap.get('id');

  readonly modoEdicao =
    this.louvorId !== null;


  ngOnInit(): void {
    if (this.modoEdicao) {
      this.carregarLouvor();
    }
  }


  get formularioValido(): boolean {
    return (
      this.louvor.trim().length > 0 &&
      this.categoria !== null
    );
  }

  get categoria(): CategoriaLouvor | null {
    if (!this.categoriaSelecionada) {
      return null;
    }

    return this.categoriaSelecionada[
      'valor'
    ] as CategoriaLouvor;
  }


  private carregarLouvor(): void {
    if (!this.louvorId) {
      return;
    }

    this.carregando = true;

    this.louvoresService
      .buscarPorId(
        this.louvorId
      )
      .subscribe({
        next: response => {

          this.louvor =
            response.data.louvor;

          this.link =
            response.data.link ?? '';

          this.tom =
            response.data.tom ?? '';

          this.categoriaSelecionada =
            this.categorias.find(
              categoria =>
                categoria['valor'] ===
                response.data.categoria
            ) ?? null;

          this.carregando = false;
        },

        error: erro => {

          this.carregando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar o louvor.';

          this.snackbar.error(
            mensagem
          );

          void this.router.navigate([
            '/louvor/lideranca/louvores/gerenciar'
          ]);
        }
      });
  }


  salvar(): void {
    if (
      !this.formularioValido ||
      this.salvando ||
      !this.categoria
    ) {
    return;
}

    const dados: SalvarLouvorRequest = {
      louvor:
        this.louvor.trim(),

      link:
        this.link.trim(),

      tom:
        this.tom.trim(),

      categoria:
        this.categoria
    };

    this.salvando = true;


    if (
      this.modoEdicao &&
      this.louvorId
    ) {

      this.louvoresService
        .editar(
          this.louvorId,
          dados
        )
        .subscribe({
          next: response => {

            this.salvando = false;

            this.snackbar.success(
              response.message ??
              'Louvor atualizado com sucesso.'
            );

            void this.router.navigate([
              '/louvor/lideranca/louvores/gerenciar'
            ]);
          },

          error: erro => {

            this.salvando = false;

            const mensagem =
              erro?.error?.message ??
              'Não foi possível atualizar o louvor.';

            this.snackbar.error(
              mensagem
            );
          }
        });

      return;
    }


    this.louvoresService
      .cadastrar(dados)
      .subscribe({
        next: response => {

          this.salvando = false;

          this.snackbar.success(
            response.message ??
            'Louvor cadastrado com sucesso.'
          );

          void this.router.navigate([
            '/louvor/lideranca/louvores/gerenciar'
          ]);
        },

        error: erro => {

          this.salvando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível cadastrar o louvor.';

          this.snackbar.error(
            mensagem
          );
        }
      });
  }


  cancelar(): void {
    void this.router.navigate([
      '/louvor/lideranca/louvores/gerenciar'
    ]);
  }
}