# Endpoints

Base: `http://127.0.0.1:8000`. Requisições com corpo usam JSON, exceto o envio de vídeo.

Formato de erro:

```json
{"error": {"code": "validation_error", "message": "Revise os campos informados.", "fields": {"email": "Informe um e-mail válido."}}}
```

Acesso: **público**, **sessão** (qualquer conta) ou **admin**.

## Autenticação e perfil

| Método | Rota | Acesso | Corpo | Resultado |
|---|---|---|---|---|
| POST | `/api/auth/register` | público | `name`, `email`, `password` | 201 e cookie de sessão. 409 se o e-mail existir |
| POST | `/api/auth/login` | público | `email`, `password` | 200 e cookie. 401 ou 429 |
| POST | `/api/auth/logout` | público | | Encerra a sessão |
| GET | `/api/me` | público | | `{user}`, ou `null` sem sessão |
| PATCH | `/api/me` | sessão | `name`, `company`, `job_title` | Perfil atualizado |
| GET | `/api/me/learning` | sessão | | `continue_watching`, `history`, `paths`, `stats` |

## Catálogo e reprodução

| Método | Rota | Acesso | Observação |
|---|---|---|---|
| GET | `/api/categories` | público | Categorias e contagem de vídeos |
| GET | `/api/videos?q=&category=` | público | Busca sem diferenciar acentos. Cada item traz `locked` e `lock_reason` |
| GET | `/api/videos/{id}` | público | Detalhe, `stream_url` e `resume_seconds`. Vídeo bloqueado vem sem URL |
| GET | `/api/videos/{id}/stream` | conforme plano | Aceita `Range`. 401 sem sessão, 403 sem plano |
| GET | `/api/thumbs/{arquivo}` | público | Miniaturas |
| PUT | `/api/progress/{id}` | conforme plano | `position_seconds`, `duration_seconds` opcional |

Motivos de bloqueio: `login_required`, `plan_required`, `trial_expired`.

## Diagnóstico e trilhas

| Método | Rota | Acesso | Corpo |
|---|---|---|---|
| GET | `/api/diagnostic/flow` | público | |
| POST | `/api/diagnostic/evaluate` | público | `situation`, `answers` |
| GET | `/api/paths` | sessão | |
| POST | `/api/paths` | sessão | `situation`, `answers`. O servidor recalcula o resultado |
| DELETE | `/api/paths/{id}` | sessão | Somente trilhas da própria conta |

Exemplo de `evaluate`:

```json
{"situation": "documentacao", "answers": {"d_problema": "pendencias", "d_tipo": "trabalhista", "d_notificacao": "nao"}}
```

A resposta traz `summary`, `answers`, `checklist` e `path`, em que cada item tem `video` e `reason`.

## Administração

| Método | Rota | Corpo |
|---|---|---|
| GET, POST | `/api/admin/videos` | `title`, `description`, `category_id`, `access_level`, `license_note` |
| PATCH, DELETE | `/api/admin/videos/{id}` | Campos a alterar, incluindo `status` |
| PUT | `/api/admin/videos/{id}/file` | Arquivo bruto, com `Content-Type` `video/mp4` ou `video/webm` |
| POST | `/api/admin/categories` | `name`, `description` |
| PATCH, DELETE | `/api/admin/categories/{id}` | `name`, `description`. Exclusão retorna 409 se houver vídeos |
| GET | `/api/admin/users` | |
| PATCH | `/api/admin/users/{id}` | `plan`: `trial` ou `premium` |

Saúde do serviço: `GET /api/health`.
