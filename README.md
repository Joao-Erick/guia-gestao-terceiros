# Guia para a Gestão de Terceiros

Plataforma de streaming educativo para gestores de empresas que contratam serviços terceirizados.
O streaming é o produto principal. O diferencial é um diagnóstico guiado por regras, que recomenda uma trilha de vídeos e explica cada recomendação.

Projeto do Hack Garanhuns Tech 2026, Desafio 2: Streaming Platform Engineering.

## Demonstração online (Render)

**[ABRIR A PLATAFORMA — DEMONSTRAÇÃO ONLINE](https://guia-gestao-terceiros.onrender.com/)**

Acesse pelo navegador, sem instalar Python. Na primeira visita, o serviço gratuito pode levar mais de 50 segundos para responder. Use somente as contas demonstrativas abaixo; o ambiente não tem persistência garantida.


Para disponibilizar a aplicação no navegador, sem instalação local:

1. Entre em [Render](https://dashboard.render.com/blueprints) e escolha **New Blueprint Instance**.
2. Conecte o GitHub e selecione este repositório. O arquivo [render.yaml](render.yaml) configura o serviço web.
3. Confirme a criação e aguarde o deploy. Abra a URL `https://...onrender.com` informada pelo Render.
4. Verifique `/api/health`, login, diagnóstico, catálogo e reprodução de vídeo.

**Atenção:** o plano gratuito do Render pode suspender a instância por inatividade e utiliza armazenamento efêmero. Contas, progresso e vídeos enviados pelo painel podem desaparecer após reinicializações ou novos deploys. Os vídeos demonstrativos incluídos no GitHub permanecem no código e são recriados no início. Use somente dados fictícios, não informações reais. Para persistência, configure armazenamento e banco adequados em um plano compatível.

O repositório GitHub mostra o **código**, não executa a aplicação automaticamente. Para avaliação rápida, prefira a URL do Render depois que o deploy estiver concluído.

## Como executar

Requisito: Python 3.10 ou superior. O frontend já vem compilado, então Node.js não é necessário para rodar.

No Windows, dê dois cliques em `iniciar.bat` (ele cria o ambiente virtual, instala as dependências e inicia o servidor), ou use os comandos abaixo:

```bash
python -m venv .venv
.venv\Scripts\activate          # Linux e macOS: source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Abra <http://127.0.0.1:8000>. O banco SQLite e os dados demonstrativos são criados no primeiro início.

Para voltar ao estado inicial antes de uma demonstração, pare o servidor e execute `python run.py --reset`.

## Contas demonstrativas

Todas são sintéticas e usam a senha `Demo@2026`.

| Conta | Papel e plano | O que demonstra |
|---|---|---|
| `admin@demo.guia.test` | Administrador | Gerencia vídeos, categorias e assinaturas |
| `assinante@demo.guia.test` | Assinante | Acesso completo, com progresso já iniciado |
| `basico@demo.guia.test` | Básico, teste de 14 dias | Vê o catálogo e assiste só ao conteúdo introdutório |
| `expirado@demo.guia.test` | Teste encerrado | Vê o catálogo, sem reprodução |

## Testes

```bash
pip install -r requirements-dev.txt
playwright install chromium
python -m pytest backend/tests     # API contra servidor real
python -m pytest e2e               # navegador real, gera docs/capturas
```

Os testes usam banco e mídia temporários. Os resultados registrados estão em [docs/RELATORIO-TESTES.md](docs/RELATORIO-TESTES.md).

## Como alterar o frontend

Requer Node.js 18 ou superior.

```bash
cd frontend
npm install
npm run build
```

## Configuração

Copie `.env.example` para `.env` somente se precisar alterar algum valor. Todas as opções estão descritas nesse arquivo.

## Estrutura

```
backend/app      API, regras de acesso, diagnóstico e banco
backend/tests    testes de API
frontend/src     aplicação React
frontend/dist    frontend compilado, servido pelo backend
media            vídeos e miniaturas demonstrativos
tools            gerador dos vídeos demonstrativos
e2e              testes em navegador real
docs             documentação da entrega
```

## Documentação

- [Arquitetura](docs/ARQUITETURA.md)
- [Endpoints](docs/API.md)
- [Relatório de testes](docs/RELATORIO-TESTES.md)
- [Premissas, limitações, riscos e próximos passos](docs/PREMISSAS-LIMITACOES-RISCOS.md)
- [Roteiro do pitch de 3 minutos](docs/ROTEIRO-PITCH.md)

## Entrega do hackathon

Este repositório reúne o código-fonte, as instruções de execução e a documentação técnica do MVP. Para avaliação, siga **Como executar**, utilize as contas demonstrativas e consulte os documentos em `docs/`. A aplicação teve testes automatizados registrados em Linux e foi iniciada manualmente no Windows pelo responsável pelo projeto. O deploy online precisa de validação separada.

## Conteúdo

Os vídeos foram criados para este projeto, são demonstrativos e não têm narração. O conteúdo é educativo e não substitui a avaliação jurídica de cada caso. A fonte Inter é distribuída sob a licença SIL Open Font License, incluída em `frontend/public/fonts`.
