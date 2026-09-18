PERMISSOES = {

    # ===================================
    # LIDERANÇA LOUVOR
    # ===================================

    "lideranca_louvor": [

        "gerenciar_datas",
        "criar_escala",
        "editar_escala",

        "visualizar_preenchimento",
        "visualizar_disponibilidades",

        "gerenciar_integrantes",

        "gerenciar_louvores",
        "escolher_qualquer_louvor",

        "baixar_pdf",

        "visualizar_escala_completa"

    ],

    # ===================================
    # INTEGRANTE LOUVOR
    # ===================================

    "integrante_louvor": [

        "preencher_disponibilidade",

        "visualizar_louvores",

        "visualizar_minha_escala",
        "visualizar_escala_completa",

        "baixar_minha_escala",
        "baixar_escala_completa"

    ],

        # ===================================
        # LIDERANÇA MIDIA
        # ===================================

    "lideranca_midia": [

        "gerenciar_datas",
        "criar_escala",
        "editar_escala",

        "visualizar_preenchimento",
        "visualizar_disponibilidades",

        "gerenciar_integrantes",

        "visualizar_tarefas",
        "gerenciar_tarefas",
        "concluir_tarefa",
        "gerenciar_solicitacoes",

        "baixar_pdf"
    ],

    # ===================================
    # INTEGRANTE MIDIA
    # ===================================

    "integrante_midia": [

    "preencher_disponibilidade",

    "visualizar_tarefas",
    "assumir_tarefa",
    "concluir_tarefa",

    "visualizar_minha_escala",
    "visualizar_escala_completa",

    "baixar_minha_escala",
    "baixar_escala_completa"

    ]

}


def tem_permissao(perfil, permissao):
    return permissao in PERMISSOES.get(perfil, [])