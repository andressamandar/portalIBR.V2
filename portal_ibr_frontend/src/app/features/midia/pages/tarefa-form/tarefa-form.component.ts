import {Component,inject, OnInit} from '@angular/core';
import {PortalSelectComponent,PortalSelectOption} from '../../../../shared/components/ui/portal-select/portal-select.component';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute,Router} from '@angular/router';
import {SalvarTarefaRequest,TarefasService} from '../../../../core/services/tarefas.service';
import {PortalSnackbarService} from '../../../../core/services/portal-snackbar.service';
import {PortalInputComponent} from '../../../../shared/components/ui/portal-input/portal-input.component';
import { PortalButtonComponent} from '../../../../shared/components/ui/portal-button/portal-button.component';
import { PortalLoadingComponent} from '../../../../shared/components/ui/portal-loading/portal-loading.component';


@Component({
  selector: 'app-tarefa-form',
  standalone: true,
  imports: [
    FormsModule,
    PortalInputComponent,
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalSelectComponent,
  ],
  templateUrl: './tarefa-form.component.html',
  styleUrl: './tarefa-form.component.scss'
})
export class TarefaFormComponent
  implements OnInit {

  private readonly tarefasService =
    inject(TarefasService);

  private readonly snackbar =
    inject(PortalSnackbarService);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);


  ministerio = '';

  solicitante = '';

  formatosSelecionados:
    PortalSelectOption[] = [];

  descricao = '';

  sugestaoArte = '';

  dataEvento = '';

  horarioEvento = '';

  dataEntrega = '';


  salvando = false;

  carregando = false;


  readonly tarefaId =
    this.route.snapshot.paramMap.get('id');

  readonly modoEdicao =
    this.tarefaId !== null;

  readonly formatos: PortalSelectOption[] = [
    {
      id: 'instagram-story',
      nome: 'Instagram Story'
    },
    {
      id: 'instagram-post',
      nome: 'Instagram Post'
    },
    {
      id: 'projecao',
      nome: 'Projeção'
    },
    {
      id: 'todos-tamanhos',
      nome: 'Todos os tamanhos'
    }
  ];

  ngOnInit(): void {

    if (this.modoEdicao) {
      this.carregarTarefa();
    }

  }


  get formularioValido(): boolean {

    return (
      this.ministerio.trim().length > 0 &&
      this.solicitante.trim().length > 0 &&
      this.obterFormatosSolicitados().length > 0 &&
      this.descricao.trim().length > 0 &&
      this.dataEvento.length > 0 &&
      this.horarioEvento.length > 0 &&
      this.dataEntrega.length > 0
    );

  }


  private carregarTarefa(): void {

    if (!this.tarefaId) {
      return;
    }


    this.carregando = true;


    this.tarefasService
      .buscarPorId(
        this.tarefaId
      )
      .subscribe({

        next: response => {

          const tarefa =
            response.data;


          this.ministerio =
            tarefa.ministerio;

          this.solicitante =
            tarefa.solicitante;

          this.formatosSelecionados =
            this.formatos.filter(
              formato =>
                tarefa.formatos_solicitados.includes(
                  String(
                    formato['nome']
                  )
                )
          );

          this.descricao =
            tarefa.descricao;

          this.sugestaoArte =
            tarefa.sugestao_arte;

          this.dataEvento =
            tarefa.data_evento;

          this.horarioEvento =
            tarefa.horario_evento;

          this.dataEntrega =
            tarefa.data_entrega;


          this.carregando =
            false;

        },


        error: erro => {

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar a tarefa.';


          this.snackbar.error(
            mensagem
          );


          this.voltarParaLista();

        }

      });

  }


  salvar(): void {

    if (
      !this.formularioValido ||
      this.salvando
    ) {
      return;
    }


    const dados:
      SalvarTarefaRequest = {

      ministerio:
        this.ministerio.trim(),

      solicitante:
        this.solicitante.trim(),

      formatos_solicitados:
        this.obterFormatosSolicitados(),

      descricao:
        this.descricao.trim(),

      sugestao_arte:
        this.sugestaoArte.trim(),

      data_evento:
        this.dataEvento,

      horario_evento:
        this.horarioEvento,

      data_entrega:
        this.dataEntrega

    };


    this.salvando = true;


    if (
      this.modoEdicao &&
      this.tarefaId
    ) {

      this.editarTarefa(
        dados
      );

      return;

    }


    this.cadastrarTarefa(
      dados
    );

  }


  private cadastrarTarefa(
    dados: SalvarTarefaRequest
  ): void {

    this.tarefasService
      .cadastrar(
        dados
      )
      .subscribe({

        next: response => {

          this.salvando =
            false;


          this.snackbar.success(
            response.message ??
            'Tarefa cadastrada com sucesso.'
          );


          this.voltarParaLista();

        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível cadastrar a tarefa.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private editarTarefa(
    dados: SalvarTarefaRequest
  ): void {

    if (!this.tarefaId) {
      return;
    }


    this.tarefasService
      .editar(
        this.tarefaId,
        dados
      )
      .subscribe({

        next: response => {

          this.salvando =
            false;


          this.snackbar.success(
            response.message ??
            'Tarefa atualizada com sucesso.'
          );


          this.voltarParaLista();

        },


        error: erro => {

          this.salvando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível atualizar a tarefa.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private obterFormatosSolicitados(): string[] {

    return this.formatosSelecionados.map(
      formato =>
        String(
          formato['nome']
        )
    );

  }


  private voltarParaLista(): void {

    void this.router.navigate([
      '/midia/lideranca/tarefas'
    ]);

  }


  cancelar(): void {

    this.voltarParaLista();

  }

}