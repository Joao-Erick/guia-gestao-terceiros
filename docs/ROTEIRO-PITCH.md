# Pitch técnico e demonstração — 3 minutos

**Duração total: 180 segundos, incluindo demonstração obrigatória.** Ensaie com cronômetro. Os valores financeiros abaixo são apenas exemplos hipotéticos, não resultados validados.

| Tempo | Fala e ação |
|---|---|
| 0:00–0:20 — Problema | “Gestores que acompanham prestadores terceirizados precisam lidar com documentos, contratos e riscos, mas nem sempre sabem por onde começar. Isso pode gerar retrabalho. Como exemplo hipotético, cinco horas semanais a R$ 40 por hora representam R$ 9.600 por ano.” |
| 0:20–0:35 — Solução | “Criamos o Guia para a Gestão de Terceiros: um streaming educativo que identifica a dificuldade do gestor e recomenda vídeos, explicando cada escolha e propondo próximos passos.” |
| 0:35–1:50 — Demonstração ao vivo | **Não cadastre conta ao vivo.** Na homepage, selecione o cenário “Tenho problemas com documentação”, percorra as respostas pré-definidas e mostre o resultado com vídeos recomendados e checklist. Na conta assinante já autenticada, mostre rapidamente uma trilha salva, o catálogo com busca, reproduza alguns segundos de um vídeo e a seção “continuar assistindo”. Na janela de administrador já autenticada, mostre a gestão de vídeos e assinaturas. Diga: “Cadastro, autenticação, perfis, papéis, catálogo, busca, reprodução, histórico e retomada estão implementados.” |
| 1:50–2:20 — Arquitetura e escala | “O frontend usa React; a API, Python com Starlette; e a persistência, SQLite. O MVP já está disponível em uma demonstração pública no Render, mas ainda usa uma única instância e serve vídeos pela aplicação. Para produção, o caminho é separar vídeos em armazenamento com CDN, migrar para um banco apropriado à concorrência, adicionar monitoramento e testar carga. Isso ainda não foi implementado.” |
| 2:20–2:45 — Modelo de negócio e impacto | “Nossa hipótese de receita é assinatura empresarial por número de usuários. Queremos reduzir o tempo para encontrar orientações relevantes e melhorar a capacitação. O impacto ainda precisa ser medido com gestores reais, usando conclusão de trilhas e aprendizagem.” |
| 2:45–3:00 — Próximo passo | “Buscamos uma empresa parceira para um piloto de capacitação em gestão de terceiros. Com esse piloto, poderemos validar o problema, a utilidade das recomendações e a disposição de pagamento.” |

**Demonstração online:** https://guia-gestao-terceiros.onrender.com/ — teste antes do pitch. A instância gratuita pode demorar a despertar e não garante persistência de dados. Tenha uma gravação e uma execução local de reserva.

## Preparação da demonstração

1. Reinicie a base demonstrativa, se necessário, com o servidor parado: `python run.py --reset`. **Isso apaga dados locais existentes.**
2. Deixe as janelas e contas demonstrativas autenticadas, com zoom legível. Não digite credenciais na apresentação.
3. Ensaie os cliques da demonstração para caber em 75 segundos. Se o fluxo for longo, reduza a navegação; não ultrapasse três minutos.
4. Grave uma demonstração de reserva e salve localmente. Teste no computador da apresentação, sem depender de internet.
5. Tenha respostas para segurança, requisitos, limitações dos vídeos, receita e escalabilidade. A banca terá tempo separado para perguntas.

## Limitações que devem ser declaradas se perguntarem

- Os seis vídeos são demonstrações em slides, sem narração.
- O diagnóstico é baseado em regras, não em IA generativa.
- Não há gateway de pagamento; a ativação de assinatura é manual.
- Não há métricas reais de economia, impacto ou escalabilidade em produção.
- Conteúdo jurídico educativo ainda requer revisão especializada.
