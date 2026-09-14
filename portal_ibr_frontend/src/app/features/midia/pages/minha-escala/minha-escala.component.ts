import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

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

  private readonly snackbar =
    inject(PortalSnackbarService);


  carregando = false;

  gerandoPdf = false;

  escalas:
    MinhaEscalaItem[] = [];


  ngOnInit(): void {
    this.carregarMinhaEscala();
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


  voltar(): void {

    void this.router.navigate([
      '/midia/integrante'
    ]);

  }

}