import { CodeBlock, Callout } from "@/components/docs";

export default function SchemasPage() {
  return (
    <>
      <h1>Schemas</h1>
      <p className="text-lg text-muted-foreground">
        Crie schemas e gere dados fake automaticamente.
      </p>

      <h2>O que são Schemas?</h2>
      <p>
        Schemas são definições de estrutura de dados que permitem gerar 
        dados fake automaticamente usando Faker.
      </p>

      <h2>Criar um Schema</h2>
      <ol>
        <li>Acesse a seção &ldquo;Schemas&rdquo; na interface web</li>
        <li>Clique em &ldquo;New Schema&rdquo;</li>
        <li>Defina o nome e os campos</li>
        <li>Salve o schema</li>
      </ol>

      <h2>Campos Faker</h2>
      <p>
        Você pode usar diversos tipos de dados Faker:
      </p>

      <CodeBlock code={`{
  "name": "person.fullName",
  "email": "internet.email",
  "age": "number.int",
  "address": "location.streetAddress",
  "phone": "phone.number",
  "avatar": "image.avatar",
  "createdAt": "date.past"
}`} language="json" />

      <h2>Gerar Dados</h2>
      <p>
        Após criar um schema, você pode gerar dados fake:
      </p>

      <CodeBlock code="GET /api/schema/users?count=10" language="bash" />

      <h2>Relacionamentos</h2>
      <p>
        Você pode criar relacionamentos entre schemas:
      </p>
      <ul>
        <li>One-to-One</li>
        <li>One-to-Many</li>
        <li>Many-to-Many</li>
      </ul>

      <Callout type="tip">
        Os relacionamentos permitem criar dados realistas com associações entre entidades.
      </Callout>
    </>
  );
}
