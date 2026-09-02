import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  jsPDF
} from 'jspdf';

import autoTable from 'jspdf-autotable';

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
  PortalSelectComponent,
  PortalSelectOption
} from '../../../../shared/components/ui/portal-select/portal-select.component';


interface FuncaoEscalaCompleta {
  nome: string;
  integrantes: string[];
}


interface EscalaCompletaItem {
  escala: Escala;
  funcoes: FuncaoEscalaCompleta[];
}


interface MesOption
  extends PortalSelectOption {

  id: string;
  nome: string;
}


interface DataEscalaTabela {
  id: string;
  data: string;
  label: string;
}


interface LinhaEscalaTabela {
  integrante: string;

  funcoesPorData: {
    [dataId: string]: string;
  };
}


@Component({
  selector: 'app-escala-completa',
  standalone: true,
  imports: [
    FormsModule,
    PortalButtonComponent,
    PortalLoadingComponent,
    PortalSelectComponent
  ],
  templateUrl: './escala-completa.component.html',
  styleUrl: './escala-completa.component.scss'
})
export class EscalaCompletaComponent
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly escalasService =
    inject(EscalasService);

  private readonly snackbar =
    inject(PortalSnackbarService);


  carregando = false;

  gerandoPdf = false;


  escalas:
    EscalaCompletaItem[] = [];


  mesesOpcoes:
    MesOption[] = [];


  mesSelecionado:
    MesOption | null = null;


  ngOnInit(): void {

    this.carregarEscalas();

  }


  get escalasMesSelecionado():
    EscalaCompletaItem[] {

    if (!this.mesSelecionado) {
      return [];
    }


    return this.escalas
      .filter(
        item =>
          item.escala.data.startsWith(
            this.mesSelecionado!.id
          )
      )
      .sort(
        (a, b) =>
          a.escala.data.localeCompare(
            b.escala.data
          )
      );
  }


  get datasMesSelecionado():
    DataEscalaTabela[] {

    return this.escalasMesSelecionado
      .map(
        item => ({

          id:
            item.escala.data_id,

          data:
            item.escala.data,

          label:
            this.formatarDataCurta(
              item.escala.data
            )

        })
      )
      .sort(
        (a, b) =>
          a.data.localeCompare(
            b.data
          )
      );
  }


  get linhasTabela():
    LinhaEscalaTabela[] {

    const escalasMes =
      this.escalasMesSelecionado;


    const datas =
      this.datasMesSelecionado;


    const integrantes =
      new Set<string>();


    escalasMes.forEach(
      item => {

        item.funcoes.forEach(
          funcao => {

            funcao.integrantes.forEach(
              integrante => {

                integrantes.add(
                  integrante
                );

              }
            );

          }
        );

      }
    );


    const nomes =
      Array.from(
        integrantes
      )
        .sort(
          (a, b) =>
            a.localeCompare(
              b,
              'pt-BR'
            )
        );


    return nomes.map(
      integrante => {

        const funcoesPorData: {
          [dataId: string]: string;
        } = {};


        datas.forEach(
          data => {

            const escala =
              escalasMes.find(
                item =>
                  item.escala.data_id ===
                  data.id
              );


            if (!escala) {

              funcoesPorData[
                data.id
              ] = '—';

              return;

            }


            const funcoes =
              escala.funcoes

                .filter(
                  funcao =>
                    funcao.integrantes
                      .includes(
                        integrante
                      )
                )

                .map(
                  funcao =>
                    funcao.nome
                );


            funcoesPorData[
              data.id
            ] =
              funcoes.length > 0
                ? funcoes.join(' / ')
                : '—';

          }
        );


        return {

          integrante,

          funcoesPorData

        };

      }
    );
  }


  private carregarEscalas(): void {

    this.carregando = true;


    this.escalasService
      .listar('Louvor')
      .subscribe({

        next: response => {

          this.escalas =
            response.data

              .sort(
                (a, b) =>
                  a.data.localeCompare(
                    b.data
                  )
              )

              .map(
                escala => ({

                  escala,

                  funcoes:
                    this.montarFuncoes(
                      escala
                    )

                })
              );


          this.montarOpcoesMes();


          this.carregando =
            false;

        },


        error: erro => {

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar a escala completa.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private montarOpcoesMes(): void {

    const mesAtual =
      this.obterMesAtual();


    const meses =
      new Set<string>();


    /*
     * O mês atual sempre aparece,
     * mesmo que ainda não tenha escala.
     */
    meses.add(
      mesAtual
    );


    this.escalas.forEach(
      item => {

        meses.add(
          item.escala.data.substring(
            0,
            7
          )
        );

      }
    );


    this.mesesOpcoes =
      Array.from(
        meses
      )

        .sort()

        .map(
          mes => ({

            id:
              mes,

            nome:
              this.formatarMes(
                mes
              )

          })
        );


    /*
     * Ao abrir a página,
     * o mês atual fica selecionado.
     */
    this.mesSelecionado =
      this.mesesOpcoes.find(
        mes =>
          mes.id === mesAtual
      ) ?? null;

  }


  private montarFuncoes(
    escala: Escala
  ): FuncaoEscalaCompleta[] {

    return Object.entries(
      escala.funcoes
    )

      .filter(
        ([, integrantes]) =>
          integrantes.length > 0
      )

      .map(
        ([nome, integrantes]) => ({

          nome,

          integrantes:
            integrantes.map(
              integrante =>
                integrante.nome
            )

        })
      );

  }


  private obterMesAtual(): string {

    const hoje =
      new Date();


    const ano =
      hoje.getFullYear();


    const mes =
      String(
        hoje.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    return `${ano}-${mes}`;

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


  private formatarDataCurta(
    data: string
  ): string {

    const [
      ,
      mes,
      dia
    ] = data.split('-');


    return `${dia}/${mes}`;

  }


  formatarMes(
    chaveMes: string
  ): string {

    const [
      ano,
      mes
    ] = chaveMes.split('-');


    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ];


    const indiceMes =
      Number(mes) - 1;


    return `${
      meses[indiceMes]
    } de ${ano}`;

  }


  baixarPdf(): void {

    if (
      !this.mesSelecionado ||
      this.gerandoPdf
    ) {
      return;
    }


    const datas =
      this.datasMesSelecionado;


    const linhas =
      this.linhasTabela;


    if (
      datas.length === 0
    ) {

      this.snackbar.error(
        'Não existem escalas cadastradas para o mês selecionado.'
      );

      return;

    }


    this.gerandoPdf = true;


    try {

      const doc =
        new jsPDF({

          orientation:
            'landscape',

          unit:
            'mm',

          format:
            'a4'

        });


      /*
       * TÍTULO
       */
      doc.setFont(
        'helvetica',
        'bold'
      );


      doc.setFontSize(
        16
      );


      doc.text(
        'Escala Completa - Ministério de Louvor',
        14,
        15
      );


      /*
       * MÊS
       */
      doc.setFont(
        'helvetica',
        'normal'
      );


      doc.setFontSize(
        11
      );


      doc.text(
        this.formatarMes(
          this.mesSelecionado.id
        ),
        14,
        22
      );


      /*
       * CABEÇALHO DA TABELA
       */
      const cabecalho = [

        'Integrante',

        ...datas.map(
          data =>
            data.label
        )

      ];


      /*
       * LINHAS DA TABELA
       */
      const corpo =
        linhas.map(
          linha => [

            linha.integrante,

            ...datas.map(
              data =>
                linha.funcoesPorData[
                  data.id
                ] ?? '—'
            )

          ]
        );


      /*
       * Ajuste automático do tamanho
       * da fonte conforme a quantidade
       * de datas existentes no mês.
       */
      let tamanhoFonte =
        8;


      if (
        datas.length > 6
      ) {

        tamanhoFonte =
          7;

      }


      if (
        datas.length > 9
      ) {

        tamanhoFonte =
          6;

      }


      /*
       * TABELA
       */
      autoTable(
        doc,
        {

          startY:
            28,


          head: [
            cabecalho
          ],


          body:
            corpo,


          theme:
            'grid',


          styles: {

            font:
              'helvetica',

            fontSize:
              tamanhoFonte,

            cellPadding:
              1.8,

            valign:
              'middle',

            halign:
              'center',

            overflow:
              'linebreak'

          },


          headStyles: {

            fontStyle:
              'bold',

            halign:
              'center',

            fillColor: [
              17,
              90,
              138
            ],

            textColor:
              255

          },


          columnStyles: {

            0: {

              fontStyle:
                'bold',

              halign:
                'left',

              cellWidth:
                40

            }

          },


          margin: {

            top:
              28,

            right:
              8,

            bottom:
              10,

            left:
              8

          },


          horizontalPageBreak:
            true,


          horizontalPageBreakRepeat:
            0

        }
      );


      doc.save(
        `escala-completa-louvor-${this.mesSelecionado.id}.pdf`
      );


      this.snackbar.success(
        'PDF da escala completa gerado com sucesso.'
      );

    } catch (erro) {

      console.error(
        'Erro ao gerar PDF:',
        erro
      );


      this.snackbar.error(
        'Não foi possível gerar o PDF da escala completa.'
      );

    } finally {

      this.gerandoPdf =
        false;

    }

  }


  voltar(): void {

    void this.router.navigate([
      '/louvor/integrante'
    ]);

  }

}