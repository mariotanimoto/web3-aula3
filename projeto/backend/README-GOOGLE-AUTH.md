# Backend – autenticação Google

A autenticação de usuários é feita exclusivamente pelo Google Identity Services. O backend valida a credencial Google, cria o usuário no primeiro acesso e emite um JWT para as chamadas autenticadas.

## Configuração

1. Copie `.env.example` para `.env`.
2. Configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `RAWG_API_KEY`, `GOOGLE_CLIENT_ID`, `JWT_SECRET` e `FRONTEND_URL`.
3. Instale as dependências:

```bash
npm install
```

4. Execute as migrations:

```bash
npm run migrate
```

5. Inicie o servidor:

```bash
npm start
```

## Banco de dados limpo

Se tabelas foram apagadas manualmente, mas os registros de migrations continuam em `SequelizeMeta`, o Sequelize pode considerar que elas já foram executadas. Para recriar o banco de desenvolvimento do zero, conecte ao MySQL e execute:

```sql
DROP DATABASE game_library;
CREATE DATABASE game_library;
```

Depois execute `npm run migrate`.

Isso apaga todos os dados desse banco.

## Usuários

Não existe mais campo de senha no modelo de usuário. O usuário é criado automaticamente no primeiro login Google. A tabela `usuarios` mantém `nome`, `email`, `googleId`, `foto`, `createdAt` e `updatedAt`.

A migration `20261123000100-remove-senha-from-usuarios.js` remove a coluna `senha` de bancos que já tinham sido migrados. Em instalações novas, a migration inicial já cria a tabela sem essa coluna.

## Endpoints de autenticação

- `POST /api/auth/google`: recebe `{ "credential": "..." }`, valida a credencial Google e cria ou localiza o usuário.
- `GET /api/auth/me`: retorna o usuário associado ao JWT enviado no cabeçalho `Authorization: Bearer <token>`.

Não envie nem armazene senha local. `DB_PASSWORD` continua existindo apenas para a conexão do backend com o MySQL.
