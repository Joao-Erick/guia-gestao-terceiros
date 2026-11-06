# Relatório de testes

Executado em 05/11/2026, com Python 3.13, Chromium 153 e Playwright 1.63, em ambiente Linux.

| Bateria | Testes | Aprovados | Falhas |
|---|---|---|---|
| API contra servidor real (`backend/tests`) | 32 | 32 | 0 |
| Navegador real (`e2e`) | 26 | 26 | 0 |

As saídas completas estão em [saida-testes-api.txt](saida-testes-api.txt) e [saida-testes-navegador.txt](saida-testes-navegador.txt). As capturas geradas pelos testes estão em [capturas](capturas).

## Cobertura dos itens obrigatórios

| Item | Requisito | API | Navegador | Resultado |
|---|---|---|---|---|
| 1 | Cadastro de novo usuário | Sim | Sim | Passou |
| 2 | Login e logout | Sim | Sim | Passou, inclusive invalidação do cookie antigo |
| 3 | Permissões de administrador e assinante | Sim | Sim | Passou |
| 4 | Busca por vídeos | Sim | Sim | Passou, inclusive sem acentos |
| 5 | Reprodução de vídeo real | Sim | Sim | Passou no Chromium: tempo avançou e quadros foram decodificados |
| 6 | Bloqueio de conteúdo exclusivo | Sim | Sim | Passou, inclusive em acesso direto ao arquivo |
| 7 | Salvamento do progresso | Sim | Sim | Passou |
| 8 | Retomada de vídeo | Sim | Sim | Passou após sair e entrar de novo |
| 9 | Histórico de reprodução | Sim | Sim | Passou |
| 10 | Diagnóstico com caminhos diferentes | Sim | Sim | Passou. A API percorreu todos os caminhos da árvore |
| 11 | Recomendações com justificativas | Sim | Sim | Passou |
| 12 | Salvamento da trilha após autenticação | Sim | Sim | Passou com conta nova e existente |
| 13 | Responsividade mobile e desktop | Não se aplica | Sim | Sem rolagem horizontal de 320 a 1440 px nas rotas testadas |

## Também verificado

- Painel administrativo pela interface: criação, envio de arquivo, publicação, reprodução e exclusão de vídeo, além de categorias e ativação de assinatura.
- Rejeição de arquivo falso, entrada inválida, escalonamento de papel no cadastro e injeção SQL na busca.
- Limite de tentativas de login e isolamento de dados entre usuários.
- Ausência de erros de JavaScript no console nos testes com a fixture `page`.

## Problemas encontrados e corrigidos

| Problema | Como foi encontrado | Correção |
|---|---|---|
| Caminhos do diagnóstico com só um vídeo | Teste de todos os caminhos | Trilha mínima por situação |
| Tabela do admin alargava a página no celular | Revisão das capturas | Layout empilhado e posicionamento corrigido |
| Teste de responsividade não detectava esse problema | Revisão das capturas | Teste passou a medir contra a largura esperada |
| Selos "Bloqueado" em vídeos introdutórios e sobre a miniatura | Revisão das capturas | Selos por nível de acesso, no canto inferior |
| Rodapé do vídeo atrás dos controles do player | Revisão das capturas | Vídeos regenerados com o aviso no topo |
| Excluir vídeo demonstrativo apagaria o arquivo do projeto | Revisão de código | Arquivos demonstrativos preservados |
| Possível tipo de arquivo incorreto no Windows | Revisão de código | Tipos definidos no servidor |

## O que não pôde ser verificado

- **Windows:** a aplicação foi executada apenas em Linux. O `iniciar.bat` não foi executado.
- **Outros navegadores:** Firefox, Safari, Edge e Chrome em celular real não foram testados. O teste móvel emula um celular no Chromium.
- **Áudio:** os vídeos não têm som.
- **`npm install` e `pip install` a partir da internet:** o ambiente não tinha acesso aos registros de pacotes. As versões foram fixadas conforme o que estava instalado.
- **Carga e concorrência:** não houve teste de desempenho.
- **Acessibilidade:** há foco visível, rótulos e movimento reduzido, mas não houve auditoria com leitor de tela.
- **Revisão jurídica:** nenhum especialista revisou o conteúdo.
