import { CodeBlock, Callout } from "@/components/docs";

export default function InstallationPage() {
  return (
    <>
      <h1>Installation</h1>
      <p className="text-lg text-muted-foreground">
        Aprenda como instalar e configurar o Mockario no seu projeto.
      </p>

      <h2>Requisitos</h2>
      <ul>
        <li>Node.js 18 ou superior</li>
        <li>npm ou yarn</li>
      </ul>

      <h2>Instalação</h2>
      <p>
        O Mockario pode ser instalado globalmente via npm:
      </p>

      <CodeBlock code="npm install -g mockario" language="bash" />

      <p>Ou pode ser usado diretamente com npx:</p>

      <CodeBlock code="npx mockario --version" language="bash" />

      <Callout type="note">
        Recomendamos usar npx para evitar instalações globais e sempre usar a versão mais recente.
      </Callout>

      <h2>Verificação</h2>
      <p>Para verificar se a instalação foi bem sucedida:</p>

      <CodeBlock code="npx mockario --help" language="bash" />

      <h2>Próximos Passos</h2>
      <p>
        Agora que você tem o Mockario instalado, vá para o{" "}
        <a href="/docs/quick-start">
          Quick Start
        </a>{" "}
        para criar seu primeiro endpoint mock.
      </p>
    </>
  );
}
