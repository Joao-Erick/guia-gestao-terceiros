# Premissas, limitações, riscos e próximos passos

## Premissas

- O PDF oficial do evento foi tratado como fonte prioritária. Ele pede catálogo, reprodução, perfis, papéis, histórico e continuar assistindo, além de repositório com instruções, pitch e este registro.
- "Perfis" foi implementado como perfil da conta: nome, empresa, cargo e plano. Não há vários perfis por conta.
- Uma conta nova nasce no plano Básico, com 14 dias de teste.
- Contas do plano Básico também podem salvar trilhas, porque o diagnóstico convida quem acabou de se cadastrar a salvar o resultado. O prompt lista trilhas salvas no plano Assinante, então esta é uma decisão a confirmar.
- Quando o teste termina, a pessoa continua vendo o catálogo, mas não reproduz vídeos.
- Sem pagamento, o administrador ativa e encerra a assinatura. Essa função é uma pequena aba do painel, adicionada para demonstrar a mudança de plano.

## Limitações conhecidas

- Os seis vídeos são demonstrativos: slides sem narração, com 48 segundos cada. Devem ser trocados pelos vídeos finais da equipe no painel administrativo.
- O conteúdo jurídico é um resumo educativo e não passou por revisão de advogado.
- Esta implementação foi preparada como MVP independente para demonstração. A integração com outras versões ou contribuições da equipe não foi verificada nesta auditoria.
- A API utiliza Starlette. FastAPI foi considerado apenas no planejamento inicial; não é usado nesta versão.
- Não há recuperação de senha nem troca de senha.
- Vídeos criados no painel não têm envio de miniatura. A interface mostra uma capa gerada com título e categoria.
- O player usa os controles nativos do navegador, sem legendas ou troca de qualidade.
- `frontend/package.json` não tem arquivo de travamento, porque o ambiente de construção não tinha acesso à internet.
- A duração automática no envio depende do `ffprobe`. Sem ele, a duração é preenchida na primeira reprodução.

- A demonstração pública está disponível em https://guia-gestao-terceiros.onrender.com/ (Render Free). Banco e uploads usam armazenamento efêmero, sem garantia de persistência após reinício ou deploy; a instância pode suspender por inatividade.
- Não foram feitos testes de carga ou validação de escalabilidade em produção.

## Riscos

| Risco | Impacto | Como reduzir |
|---|---|---|
| Rede instável no Demo Day | Alto | Rodar localmente. Fontes, vídeos e frontend estão no projeto |
| Python ausente ou antigo na máquina da demo | Alto | Testar `iniciar.bat` antes do code freeze |
| Dados alterados nos ensaios | Médio | Executar `python run.py --reset` antes da banca |
| Orientação jurídica mal interpretada | Médio | Manter os avisos e validar o conteúdo com especialistas |
| Hipótese de dor ainda não validada | Médio | Validar com mentores no checkpoint |

## Próximos passos

1. Validar o problema e o diagnóstico com os mentores.
2. Revisar o conteúdo jurídico com um especialista.
3. Gravar e publicar os vídeos finais, com narração e legendas.
4. Integrar pagamento e recuperação de senha.
5. Migrar para PostgreSQL, armazenamento de objetos e HLS.
6. Adicionar painel para empresas com várias pessoas e relatórios de equipe.
