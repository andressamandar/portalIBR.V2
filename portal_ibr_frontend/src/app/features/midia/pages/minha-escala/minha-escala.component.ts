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
  jsPDF
} from 'jspdf';

import {
  AuthService
} from '../../../../core/services/auth.service';

import {
  Escala,
  EscalasService
} from '../../../../core/services/escalas.service';

import {
  IntegrantesService
} from '../../../../core/services/integrantes.service';

import {
  LouvorEscalado,
  LouvoresEscalaService
} from '../../../../core/services/louvores-escala.service';

import {
  PortalSnackbarService
} from '../../../../core/services/portal-snackbar.service';

import {
  PortalButtonComponent
} from '../../../../shared/components/ui/portal-button/portal-button.component';

import {
  PortalLoadingComponent
} from '../../../../shared/components/ui/portal-loading/portal-loading.component';


interface MinhaEscalaItem {
  escala: Escala;
  funcoes: string[];
}


interface EscalaIntegradaItem {
  ministerio: 'Louvor' | 'Midia';
  escala: Escala;
  funcoes: string[];
  louvores: LouvorEscalado[];
}


@Component({
  selector: 'app-minha-escala',
  standalone: true,
  imports: [
    PortalButtonComponent,
    PortalLoadingComponent
  ],
  templateUrl: './minha-escala.component.html',
  styleUrl: './minha-escala.component.scss'
})
export class MinhaEscalaComponent
  implements OnInit {

  private readonly router =
    inject(Router);

  private readonly authService =
    inject(AuthService);

  private readonly escalasService =
    inject(EscalasService);

  private readonly integrantesService =
    inject(IntegrantesService);

  private readonly louvoresEscalaService =
    inject(LouvoresEscalaService);

  private readonly snackbar =
    inject(PortalSnackbarService);


  carregando = false;

  gerandoPdf = false;

  gerandoPdfCompleto = false;

  podeBaixarEscalaCompleta = false;


  escalas:
    MinhaEscalaItem[] = [];


  ngOnInit(): void {

    this.carregarMinhaEscala();

    this.verificarMinisteriosIntegrante();

  }


  private carregarMinhaEscala(): void {

    const usuario =
      this.authService.obterUsuario();


    if (!usuario?.id) {

      this.snackbar.error(
        'Não foi possível identificar o integrante.'
      );

      return;
    }


    this.carregando = true;


    this.escalasService
      .listar('Midia')
      .subscribe({

        next: response => {

          const hoje =
            this.obterDataHoje();


          this.escalas =
            response.data

              .filter(
                escala =>
                  escala.data >= hoje
              )

              .map(
                escala => ({
                  escala,

                  funcoes:
                    this.obterFuncoesIntegrante(
                      escala,
                      usuario.id!
                    )
                })
              )

              .filter(
                item =>
                  item.funcoes.length > 0
              )

              .sort(
                (a, b) =>
                  a.escala.data.localeCompare(
                    b.escala.data
                  )
              );


          this.carregando =
            false;

        },


        error: erro => {

          this.carregando =
            false;


          const mensagem =
            erro?.error?.message ??
            'Não foi possível carregar sua escala.';


          this.snackbar.error(
            mensagem
          );

        }

      });

  }


  private verificarMinisteriosIntegrante(): void {

    const usuario =
      this.authService.obterUsuario();


    if (!usuario?.id) {
      return;
    }


    this.integrantesService
      .buscarPorId(
        usuario.id
      )
      .subscribe({

        next: response => {

          const ministerios =
            response.data.ministerios.filter(
              ministerio =>
                ministerio === 'Louvor' ||
                ministerio === 'Midia'
            );


          this.podeBaixarEscalaCompleta =
            ministerios.length > 1;

        },


        error: () => {

          this.podeBaixarEscalaCompleta =
            false;

        }

      });

  }


  private obterFuncoesIntegrante(
    escala: Escala,
    integranteId: string
  ): string[] {

    return Object.entries(
      escala.funcoes
    )

      .filter(
        ([, integrantes]) =>
          integrantes.some(
            integrante =>
              integrante.id ===
              integranteId
          )
      )

      .map(
        ([nomeFuncao]) =>
          nomeFuncao
      );

  }


  private obterDataHoje(): string {

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


    const dia =
      String(
        hoje.getDate()
      ).padStart(
        2,
        '0'
      );


    return `${ano}-${mes}-${dia}`;

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


  baixarPdf(): void {

    if (
      this.escalas.length === 0 ||
      this.gerandoPdf
    ) {
      return;
    }


    this.gerandoPdf = true;


    try {

      const usuario =
        this.authService
          .obterUsuario();


      const doc =
        new jsPDF();


      let y = 20;


      doc.setFont(
        'helvetica',
        'bold'
      );


      doc.setFontSize(
        18
      );


      doc.text(
        'Minha Escala - Ministério de Mídia',
        14,
        y
      );


      y += 10;


      doc.setFont(
        'helvetica',
        'normal'
      );


      doc.setFontSize(
        11
      );


      doc.text(
        `Integrante: ${usuario?.nome ?? ''}`,
        14,
        y
      );


      y += 12;


      this.escalas.forEach(
        (
          item,
          indice
        ) => {

          if (
            y > 260
          ) {

            doc.addPage();

            y = 20;

          }


          doc.setFont(
            'helvetica',
            'bold'
          );


          doc.setFontSize(
            14
          );


          doc.text(
            this.formatarData(
              item.escala.data
            ),
            14,
            y
          );


          y += 8;


          doc.setFont(
            'helvetica',
            'normal'
          );


          doc.setFontSize(
            11
          );


          const textoFuncoes =
            `Função(ões): ${item.funcoes.join(', ')}`;


          const linhas =
            doc.splitTextToSize(
              textoFuncoes,
              175
            );


          doc.text(
            linhas,
            14,
            y
          );


          y +=
            linhas.length * 6;


          if (
            indice <
            this.escalas.length - 1
          ) {

            y += 6;


            doc.setDrawColor(
              220
            );


            doc.line(
              14,
              y,
              196,
              y
            );


            y += 10;

          }

        }
      );


      doc.save(
        'minha-escala-midia.pdf'
      );


      this.snackbar.success(
        'PDF da sua escala gerado com sucesso.'
      );

    } catch (erro) {

      console.error(
        'Erro ao gerar PDF:',
        erro
      );


      this.snackbar.error(
        'Não foi possível gerar o PDF da sua escala.'
      );

    } finally {

      this.gerandoPdf =
        false;

    }

  }


  baixarPdfCompleto(): void {

    const usuario =
      this.authService.obterUsuario();


    if (
      !usuario?.id ||
      this.gerandoPdfCompleto
    ) {
      return;
    }


    this.gerandoPdfCompleto =
      true;


    forkJoin({

      escalasLouvor:
        this.escalasService.listar(
          'Louvor'
        ),

      escalasMidia:
        this.escalasService.listar(
          'Midia'
        ),

      louvores:
        this.louvoresEscalaService.listar(
          'Louvor'
        )

    }).subscribe({

      next: response => {

        const hoje =
          this.obterDataHoje();


        const escalasIntegradas:
          EscalaIntegradaItem[] = [];


        response.escalasLouvor.data

          .filter(
            escala =>
              escala.data >= hoje
          )

          .forEach(
            escala => {

              const funcoes =
                this.obterFuncoesIntegrante(
                  escala,
                  usuario.id!
                );


              if (
                funcoes.length === 0
              ) {
                return;
              }


              const louvoresDaData =
                response.louvores.data.find(
                  item =>
                    item.data_id ===
                    escala.data_id
                )
                  ?.louvores
                ?? [];


              escalasIntegradas.push({

                ministerio:
                  'Louvor',

                escala,

                funcoes,

                louvores:
                  louvoresDaData

              });

            }
          );


        response.escalasMidia.data

          .filter(
            escala =>
              escala.data >= hoje
          )

          .forEach(
            escala => {

              const funcoes =
                this.obterFuncoesIntegrante(
                  escala,
                  usuario.id!
                );


              if (
                funcoes.length === 0
              ) {
                return;
              }


              escalasIntegradas.push({

                ministerio:
                  'Midia',

                escala,

                funcoes,

                louvores: []

              });

            }
          );


        escalasIntegradas.sort(
          (a, b) => {

            const comparacaoData =
              a.escala.data.localeCompare(
                b.escala.data
              );


            if (
              comparacaoData !== 0
            ) {
              return comparacaoData;
            }


            if (
              a.ministerio ===
              b.ministerio
            ) {
              return 0;
            }


            return (
              a.ministerio === 'Louvor'
                ? -1
                : 1
            );

          }
        );


        if (
          escalasIntegradas.length === 0
        ) {

          this.gerandoPdfCompleto =
            false;


          this.snackbar.error(
            'Você não possui próximas escalas para gerar o PDF.'
          );

          return;

        }


        this.gerarPdfCompleto(
          escalasIntegradas
        );


        this.gerandoPdfCompleto =
          false;


        this.snackbar.success(
          'PDF da escala completa gerado com sucesso.'
        );

      },


      error: erro => {

        this.gerandoPdfCompleto =
          false;


        const mensagem =
          erro?.error?.message ??
          'Não foi possível carregar as escalas para gerar o PDF completo.';


        this.snackbar.error(
          mensagem
        );

      }

    });

  }


  private gerarPdfCompleto(
    escalas: EscalaIntegradaItem[]
  ): void {

    const usuario =
      this.authService.obterUsuario();


    const doc =
      new jsPDF();


    let y = 20;


    doc.setFont(
      'helvetica',
      'bold'
    );


    doc.setFontSize(
      18
    );


    doc.text(
      'Minha Escala Completa',
      14,
      y
    );


    y += 10;


    doc.setFont(
      'helvetica',
      'normal'
    );


    doc.setFontSize(
      11
    );


    doc.text(
      `Integrante: ${usuario?.nome ?? ''}`,
      14,
      y
    );


    y += 14;


    const datas =
      Array.from(
        new Set(
          escalas.map(
            item =>
              item.escala.data
          )
        )
      ).sort();


    datas.forEach(
      (
        data,
        indiceData
      ) => {

        if (
          y > 245
        ) {

          doc.addPage();

          y = 20;

        }


        doc.setFont(
          'helvetica',
          'bold'
        );


        doc.setFontSize(
          14
        );


        doc.text(
          this.formatarData(
            data
          ),
          14,
          y
        );


        y += 9;


        const escalasDaData =
          escalas.filter(
            item =>
              item.escala.data ===
              data
          );


        escalasDaData.forEach(
          item => {

            if (
              y > 250
            ) {

              doc.addPage();

              y = 20;

            }


            doc.setFont(
              'helvetica',
              'bold'
            );


            doc.setFontSize(
              11
            );


            doc.text(
              item.ministerio === 'Louvor'
                ? 'LOUVOR'
                : 'MÍDIA',
              18,
              y
            );


            y += 7;


            doc.setFont(
              'helvetica',
              'normal'
            );


            const textoFuncoes =
              `Função(ões): ${item.funcoes.join(', ')}`;


            const linhasFuncoes =
              doc.splitTextToSize(
                textoFuncoes,
                170
              );


            doc.text(
              linhasFuncoes,
              18,
              y
            );


            y +=
              linhasFuncoes.length * 6;


            if (
              item.ministerio ===
              'Louvor'
            ) {

              y += 2;


              doc.setFont(
                'helvetica',
                'bold'
              );


              doc.text(
                'Louvores:',
                18,
                y
              );


              y += 7;


              doc.setFont(
                'helvetica',
                'normal'
              );


              if (
                item.louvores.length === 0
              ) {

                const mensagem =
                  'Nenhum louvor escalado para esta data até o momento.';


                const linhas =
                  doc.splitTextToSize(
                    mensagem,
                    165
                  );


                doc.text(
                  linhas,
                  22,
                  y
                );


                y +=
                  linhas.length * 6;

              } else {

                item.louvores.forEach(
                  (
                    louvor,
                    indiceLouvor
                  ) => {

                    if (
                      y > 270
                    ) {

                      doc.addPage();

                      y = 20;

                    }


                    const tom =
                      louvor.tom
                        ? ` - Tom: ${louvor.tom}`
                        : '';


                    const texto =
                      `${indiceLouvor + 1}. ${louvor.louvor}${tom}`;


                    const linhas =
                      doc.splitTextToSize(
                        texto,
                        160
                      );


                    doc.text(
                      linhas,
                      22,
                      y
                    );


                    y +=
                      linhas.length * 6;

                  }
                );

              }

            }


            y += 7;

          }
        );


        if (
          indiceData <
          datas.length - 1
        ) {

          doc.setDrawColor(
            220
          );


          doc.line(
            14,
            y,
            196,
            y
          );


          y += 10;

        }

      }
    );


    doc.save(
      'minha-escala-completa.pdf'
    );

  }


  voltar(): void {

    void this.router.navigate([
      '/midia/integrante'
    ]);

  }

}