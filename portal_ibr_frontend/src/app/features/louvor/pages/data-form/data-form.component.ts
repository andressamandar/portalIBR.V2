import {Component,inject,OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {DatasService,SalvarDataRequest,TipoData} from '../../../../core/services/datas.service';
import {PortalSnackbarService} from '../../../../core/services/portal-snackbar.service';
import {PortalInputComponent} from '../../../../shared/components/ui/portal-input/portal-input.component';
import {PortalSelectComponent,PortalSelectOption} from '../../../../shared/components/ui/portal-select/portal-select.component';
import {PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';
import {PortalLoadingComponent} from '../../../../shared/components/ui/portal-loading/portal-loading.component';

@Component({
  selector: 'app-data-form',
  standalone: true,
  imports: [
    FormsModule,
    PortalInputComponent,
    PortalSelectComponent,
    PortalButtonComponent,
    PortalLoadingComponent
  ],
  templateUrl: './data-form.component.html',
  styleUrl: './data-form.component.scss'
})
export class DataFormComponent implements OnInit {
  private readonly datasService =
    inject(DatasService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  dataCulto = '';

  tipoSelecionado:
    PortalSelectOption | null = null;

  nomeEvento = '';

  salvando = false;
  carregando = false;

  readonly dataId =
    this.route.snapshot.paramMap.get('id');

  readonly modoEdicao =
    this.dataId !== null;

  readonly tipos: PortalSelectOption[] = [
    {
      id: 'domingo',
      nome: 'Domingo',
      valor: 'Domingo'
    },
    {
      id: 'quinta',
      nome: 'Quinta',
      valor: 'Quinta'
    },
    {
      id: 'outros',
      nome: 'Outros',
      valor: 'Outros'
    }
  ];

  ngOnInit(): void {
    if (this.modoEdicao) {
      this.carregarData();
    }
  }

  get tipo(): TipoData | null {
    if (!this.tipoSelecionado) {
      return null;
    }

    return this.tipoSelecionado['valor'] as TipoData;
  }

  get ehOutroTipo(): boolean {
    return this.tipo === 'Outros';
  }

  get formularioValido(): boolean {
    if (
      !this.dataCulto ||
      !this.tipo
    ) {
      return false;
    }

    if (
      this.ehOutroTipo &&
      !this.nomeEvento.trim()
    ) {
      return false;
    }

    return true;
  }

  private carregarData(): void {
    if (!this.dataId) {
      return;
    }

    this.carregando = true;

    this.datasService
      .buscarPorId(this.dataId)
      .subscribe({
        next: response => {
          const data = response.data;

          this.dataCulto = data.data;

          this.tipoSelecionado =
            this.tipos.find(
              tipo =>
                tipo['valor'] === data.tipo
            ) ?? null;

          this.nomeEvento =
            data.nome_evento ?? '';

          this.carregando = false;
        },

        error: erro => {
          this.carregando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar a data.';

          this.snackbar.error(mensagem);

          void this.router.navigate([
            '/louvor/lideranca/escala/datas'
          ]);
        }
      });
  }

  salvar(): void {
    if (
      !this.formularioValido ||
      this.salvando ||
      !this.tipo
    ) {
      return;
    }

    this.salvando = true;

    const dados: SalvarDataRequest = {
      ministerio: 'Louvor',
      data: this.dataCulto,
      tipo: this.tipo,
      nome_evento:
        this.ehOutroTipo
          ? this.nomeEvento.trim()
          : null
    };

    if (
      this.modoEdicao &&
      this.dataId
    ) {
      this.datasService
        .editar(
          this.dataId,
          dados
        )
        .subscribe({
          next: response => {
            this.salvando = false;

            this.snackbar.success(
              response.message ??
              'Data atualizada com sucesso.'
            );

            void this.router.navigate([
              '/louvor/lideranca/escala/datas'
            ]);
          },

          error: erro => {
            this.salvando = false;

            const mensagem =
              erro?.error?.message ??
              'Não foi possível atualizar a data.';

            this.snackbar.error(mensagem);
          }
        });

      return;
    }

    this.datasService
      .cadastrar(dados)
      .subscribe({
        next: response => {
          this.salvando = false;

          this.snackbar.success(
            response.message ??
            'Data cadastrada com sucesso.'
          );

          void this.router.navigate([
            '/louvor/lideranca/escala/datas'
          ]);
        },

        error: erro => {
          this.salvando = false;

          const mensagem =
            erro?.error?.message ??
            'Não foi possível cadastrar a data.';

          this.snackbar.error(mensagem);
        }
      });
  }

  cancelar(): void {
    void this.router.navigate([
      '/louvor/lideranca/escala/datas'
    ]);
  }
}
