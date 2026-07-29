import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {PortalDialogComponent} from '../../../../shared/components/ui/portal-dialog/portal-dialog.component';
import { PortalSnackbarService } from '../../../../core/services/portal-snackbar.service';
import {PortalSelectComponent, PortalSelectOption} from '../../../../shared/components/ui/portal-select/portal-select.component';
import { LogoComponent } from '../../../../shared/components/ui/logo/logo.component';
import { SelectionCardComponent } from '../../../../shared/components/ui/selection-card/selection-card.component';
import { PortalButtonComponent } from '../../../../shared/components/ui/portal-button/portal-button.component';
import { PortalInputComponent } from '../../../../shared/components/ui/portal-input/portal-input.component';
import {PortalAutocompleteComponent, PortalAutocompleteOption} from '../../../../shared/components/ui/portal-autocomplete/portal-autocomplete.component';
import {PortalLoadingComponent} from '../../../../shared/components/ui/portal-loading/portal-loading.component';
import {PortalEmptyStateComponent} from '../../../../shared/components/ui/portal-empty-state/portal-empty-state.component';


@Component({
  selector: 'app-ui-kit',
  standalone: true,
  imports: [
    FormsModule,
    LogoComponent,
    SelectionCardComponent,
    PortalButtonComponent,
    PortalInputComponent,
    PortalAutocompleteComponent,
    PortalSelectComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './ui-kit.component.html',
  styleUrl: './ui-kit.component.scss'
})
export class UiKitComponent {
  private readonly snackbar = inject(PortalSnackbarService);
  private readonly dialog = inject(MatDialog);

  
  campoComErro = 'Valor inválido';
  campoSomenteLeitura = 'Igreja Batista Redenção';
  campoDesabilitado = '';


  integranteSelectSelecionado: PortalSelectOption | null = null;

  funcoesSelectSelecionadas: PortalSelectOption[] = [];

  selectDesabilitado: PortalSelectOption | null = null;

  integrantes: PortalAutocompleteOption[] = [
    { id: '1', nome: 'Andressa' },
    { id: '2', nome: 'Eduardo' },
    { id: '3', nome: 'Gustavo' },
    { id: '4', nome: 'João' },
    { id: '5', nome: 'Mariana' }
  ];

  funcoes: PortalAutocompleteOption[] = [
    { id: '1', nome: 'Ministração' },
    { id: '2', nome: 'Soprano' },
    { id: '3', nome: 'Contralto' },
    { id: '4', nome: 'Tenor' },
    { id: '5', nome: 'Barítono' },
    { id: '6', nome: 'Teclado' },
    { id: '7', nome: 'Violão' },
    { id: '8', nome: 'Bateria' }
  ];

  integranteSelecionado: PortalAutocompleteOption | null = null;

  funcoesSelecionadas: PortalAutocompleteOption[] = [];

  integrantesAssincronos: PortalAutocompleteOption[] = [];

  integranteAssincronoSelecionado:
    PortalAutocompleteOption | null = null;

  carregandoIntegrantes = false;

  autocompleteDesabilitado:
    PortalAutocompleteOption | null = null;

  registrarClique(nome: string): void {
    console.log(`Componente clicado: ${nome}`);
  }

  buscarIntegrantes(termo: string): void {
    this.carregandoIntegrantes = true;

    const pesquisa = termo.toLowerCase().trim();

    setTimeout(() => {
      this.integrantesAssincronos =
        this.integrantes.filter(
          integrante =>
            String(integrante['nome'])
              .toLowerCase()
              .includes(pesquisa)
        );

      this.carregandoIntegrantes = false;
    }, 700);
  }

  mostrarSucesso(): void {
  this.snackbar.success('Operação realizada com sucesso.');
  }

  mostrarErro(): void {
    this.snackbar.error('Não foi possível concluir a operação.');
  }

  mostrarAviso(): void {
    this.snackbar.warning('Revise as informações preenchidas.');
  }

  mostrarInformacao(): void {
    this.snackbar.info('Os dados foram atualizados.');
  }

  abrirDialogConfirmacao(): void {
    const dialogRef = this.dialog.open(PortalDialogComponent, {
      data: {
        title: 'Confirmar operação',
        message: 'Deseja realmente continuar com esta operação?',
        type: 'confirm',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado === true) {
        this.snackbar.success('Operação confirmada.');
      } else {
        this.snackbar.info('Operação cancelada.');
      }
    });
  }

  abrirDialogExclusao(): void {
    const dialogRef = this.dialog.open(PortalDialogComponent, {
      data: {
        title: 'Excluir integrante',
        message: 'Esta ação não poderá ser desfeita. Deseja continuar?',
        type: 'danger',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado === true) {
        this.snackbar.success('Exclusão confirmada.');
      } else {
        this.snackbar.info('Exclusão cancelada.');
      }
    });
  }

  abrirDialogInformacao(): void {
    this.dialog.open(PortalDialogComponent, {
      data: {
        title: 'Informação',
        message: 'As alterações foram salvas e já estão disponíveis.',
        type: 'info',
        confirmText: 'Entendi',
        showCancel: false
      }
    });
  }

  executarAcaoEmptyState(): void {
  this.snackbar.success('Ação do estado vazio executada.');
  }
}