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

import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

import {
  DataEscala,
  DatasService
} from '../../../../core/services/datas.service';

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


@Component({
  selector: 'app-download-escala',
  standalone: true,
  imports: [
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalEmptyStateComponent
  ],
  templateUrl: './download-escala.component.html',
  styleUrl: './download-escala.component.scss'
})
export class DownloadEscalaComponent
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly escalasService =
    inject(EscalasService);

  private readonly datasService =
    inject(DatasService);

  private readonly snackbar =
    inject(PortalSnackbarService);


  escalas: Escala[] = [];

  datas: DataEscala[] = [];

  carregando = false;

  gerandoPdf = false;


  ngOnInit(): void {
    this.carregarDados();
  }


  private carregarDados(): void {
    this.carregando = true;

    forkJoin({
      escalas:
        this.escalasService.listar(
          'Louvor'
        ),

      datas:
        this.datasService.listar(
          'Louvor'
        )
    }).subscribe({
      next: response => {

        this.escalas =
          response.escalas.data;

        this.datas =
          response.datas.data;

        this.carregando = false;
      },

      error: erro => {

        this.carregando = false;

        const mensagem =
          erro?.error?.message ??
          'Não foi possível carregar as escalas.';

        this.snackbar.error(
          mensagem
        );
      }
    });
  }


  obterFuncoesPreenchidas(
    escala: Escala
  ): string[] {

    return Object.keys(
      escala.funcoes ?? {}
    ).filter(
      funcao =>
        (
          escala.funcoes[funcao] ?? []
        ).length > 0
    );
  }


  private obterDescricaoData(
    escala: Escala
  ): string {

    const dataCadastrada =
      this.datas.find(
        data =>
          data._id === escala.data_id
      );

    if (!dataCadastrada) {
      return '';
    }

    if (
      dataCadastrada.tipo === 'Outros'
    ) {
      return (
        dataCadastrada.nome_evento ??
        'Evento'
      );
    }

    return dataCadastrada.tipo;
  }


  baixarPdf(): void {

    if (
      this.escalas.length === 0 ||
      this.gerandoPdf
    ) {
      return;
    }

    this.gerandoPdf = true;

    try {

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.setFont(
        'helvetica',
        'bold'
      );

      pdf.setFontSize(16);

      pdf.text(
        'MINISTÉRIO DE LOUVOR',
        14,
        16
      );

      pdf.setFontSize(12);

      pdf.text(
        'ESCALA',
        14,
        23
      );


      const corpo: any[] = [];


      for (
        const escala of this.escalas
      ) {

        const descricao =
          this.obterDescricaoData(
            escala
          );

        const tituloData =
          descricao
            ? `${this.formatarData(escala.data)} - ${descricao}`
            : this.formatarData(
                escala.data
              );


        corpo.push([
          {
            content: tituloData,
            colSpan: 2,
            styles: {
              fontStyle: 'bold'
            }
          }
        ]);


        const funcoes =
          this.obterFuncoesPreenchidas(
            escala
          );


        for (const funcao of funcoes) {

          const integrantes =
            escala.funcoes[
              funcao
            ]
              .map(
                integrante =>
                  integrante.nome
              )
              .join(', ');

          corpo.push([
            funcao,
            integrantes
          ]);
        }
      }


      autoTable(
        pdf,
        {
          startY: 30,

          head: [
            [
              'Função',
              'Integrantes'
            ]
          ],

          body: corpo,

          theme: 'grid',

          styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 3,
            valign: 'middle'
          },

          headStyles: {
            fillColor: [
              17,
              90,
              138
            ],
            textColor: 255,
            fontStyle: 'bold'
          },

          columnStyles: {
            0: {
              cellWidth: 48
            }
          },

          margin: {
            left: 14,
            right: 14,
            bottom: 14
          }
        }
      );


      pdf.save(
        'escala-louvor.pdf'
      );

      this.snackbar.success(
        'Escala gerada com sucesso.'
      );

    } catch {

      this.snackbar.error(
        'Não foi possível gerar o PDF da escala.'
      );

    } finally {

      this.gerandoPdf = false;
    }
  }


  formatarData(
    data: string
  ): string {

    const [
      ano,
      mes,
      dia
    ] = data.split('-');

    return `${dia}/${mes}/${ano}`;
  }


  voltar(): void {
    void this.router.navigate([
      '/louvor/lideranca/escala'
    ]);
  }
}