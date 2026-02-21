import { CodeBlock, Callout } from "@/components/docs";

export default function AuthenticationPage() {
  return (
    <>
      <h1>Authentication</h1>
      <p className="text-lg text-muted-foreground">
        Adicione autenticação aos seus endpoints mock.
      </p>

      <h2>Tipos de Autenticação</h2>
      <p>
        O Mockario suporta diversos tipos de autenticação:
      </p>

      <h3>JWT (JSON Web Token)</h3>
      <CodeBlock code={`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "jwt",
    "secret": "your-secret-key"
  }
}`} language="json" />

      <h3>API Key</h3>
      <CodeBlock code={`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "apiKey",
    "header": "X-API-Key",
    "key": "your-api-key"
  }
}`} language="json" />

      <h3>Basic Auth</h3>
      <CodeBlock code={`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "basic",
    "username": "admin",
    "password": "password"
  }
}`} language="json" />

      <h3>Bearer Token</h3>
      <CodeBlock code={`{
  "path": "/api/protected",
  "method": "GET",
  "auth": {
    "type": "bearer",
    "token": "your-bearer-token"
  }
}`} language="json" />

      <h2>Rotas de Auth Automáticas</h2>
      <p>
        O Mockario cria automaticamente rotas de autenticação:
      </p>
      <ul>
        <li><code>POST /api/auth/register</code> - Criar usuário</li>
        <li><code>POST /api/auth/login</code> - Fazer login</li>
        <li><code>GET /api/auth/me</code> - Obter usuário atual</li>
      </ul>

      <h2>Gerenciar Usuários</h2>
      <p>
        Você pode criar e gerenciar usuários através da interface web 
        ou da API.
      </p>

      <Callout type="warning" title="Segurança">
        Estes são endpoints mock. Não use em produção! As senhas e tokens são armazenados de forma simplificada.
      </Callout>
    </>
  );
}
