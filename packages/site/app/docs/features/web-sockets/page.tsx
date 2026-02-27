"use client";

import { CodeBlock, Callout } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function WebSocketsPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.webSockets.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.webSockets.description}
      </p>

      <h2>{t.docs.webSockets.whatIs}</h2>
      <p>
        {t.docs.webSockets.whatIsDesc}
      </p>

      <h2>{t.docs.webSockets.createEndpoint}</h2>
      <p>{t.docs.webSockets.createViaUI}</p>
      <ol>
        <li>{t.docs.webSockets.step1}</li>
        <li>{t.docs.webSockets.step2}</li>
        <li>{t.docs.webSockets.step3}</li>
        <li>{t.docs.webSockets.step4}</li>
        <li>{t.docs.webSockets.step5}</li>
      </ol>

      <h3>{t.docs.webSockets.createViaAPI}</h3>
      <CodeBlock code={`POST /api/ws-endpoints
{
  "path": "/ws/chat",
  "eventType": "message",
  "response": {
    "message": "Welcome to the chat!",
    "user": "{{faker.person.fullName}}"
  },
  "delay": 0
}`} language="json" />

      <h2>{t.docs.webSockets.connecting}</h2>
      <p>{t.docs.webSockets.clientExample}</p>
      <CodeBlock code={`// JavaScript client example
const ws = new WebSocket('ws://localhost:3001/ws/chat');

ws.onopen = () => {
  console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.send(JSON.stringify({ message: 'Hello!' }));`} language="javascript" />

      <h2>{t.docs.webSockets.eventTypes}</h2>
      <p>{t.docs.webSockets.eventTypesDesc}</p>
      <ul>
        <li><strong>message</strong> - {t.docs.webSockets.message}</li>
        <li><strong>connection</strong> - {t.docs.webSockets.connection}</li>
        <li><strong>disconnect</strong> - {t.docs.webSockets.disconnect}</li>
        <li><strong>error</strong> - {t.docs.webSockets.error}</li>
      </ul>

      <h2>Faker Templates</h2>
      <p>
        You can use Faker templates in your responses to generate realistic data. Use the {"{{faker.module.method}}"} syntax.
      </p>

      <h3>Person</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left py-2 px-3">Template</th><th className="text-left py-2 px-3">Example Output</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.fullName}}"}</td><td className="py-2 px-3">John Doe</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.firstName}}"}</td><td className="py-2 px-3">Jane</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.lastName}}"}</td><td className="py-2 px-3">Smith</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.email}}"}</td><td className="py-2 px-3">jane.smith@example.com</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.jobTitle}}"}</td><td className="py-2 px-3">Software Engineer</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Date & Time</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left py-2 px-3">Template</th><th className="text-left py-2 px-3">Example Output</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.past}}"}</td><td className="py-2 px-3">2024-01-15T10:30:00.000Z</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.future}}"}</td><td className="py-2 px-3">2027-06-20T14:45:00.000Z</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.recent}}"}</td><td className="py-2 px-3">2026-02-25T09:15:00.000Z</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.month}}"}</td><td className="py-2 px-3">March</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.weekday}}"}</td><td className="py-2 px-3">Monday</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Location</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left py-2 px-3">Template</th><th className="text-left py-2 px-3">Example Output</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.city}}"}</td><td className="py-2 px-3">New York</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.country}}"}</td><td className="py-2 px-3">United States</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.street}}"}</td><td className="py-2 px-3">123 Main Street</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.zipCode}}"}</td><td className="py-2 px-3">10001</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.latitude}}"}</td><td className="py-2 px-3">40.7128</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Internet</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left py-2 px-3">Template</th><th className="text-left py-2 px-3">Example Output</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.url}}"}</td><td className="py-2 px-3">https://example.com</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.email}}"}</td><td className="py-2 px-3">user@example.com</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.username}}"}</td><td className="py-2 px-3">john_doe123</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.ip}}"}</td><td className="py-2 px-3">192.168.1.1</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.uuid}}"}</td><td className="py-2 px-3">a1b2c3d4-e5f6-7890-abcd-ef1234567890</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Commerce & Finance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left py-2 px-3">Template</th><th className="text-left py-2 px-3">Example Output</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.commerce.productName}}"}</td><td className="py-2 px-3">Ergonomic Wooden Chair</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.commerce.price}}"}</td><td className="py-2 px-3">42.00</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.finance.currencyCode}}"}</td><td className="py-2 px-3">USD</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.finance.bitcoinAddress}}"}</td><td className="py-2 px-3">1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Data Types</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left py-2 px-3">Template</th><th className="text-left py-2 px-3">Example Output</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.string.uuid}}"}</td><td className="py-2 px-3">550e8400-e29b-41d4-a716-446655440000</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.string.alpha}}"}</td><td className="py-2 px-3">abcDEF</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.string.numeric}}"}</td><td className="py-2 px-3">1234567890</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.datatype.boolean}}"}</td><td className="py-2 px-3">true</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.number.int}}"}</td><td className="py-2 px-3">42</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Lorem (Text)</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b"><th className="text-left py-2 px-3">Template</th><th className="text-left py-2 px-3">Example Output</th></tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lorem.word}}"}</td><td className="py-2 px-3">lorem</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lorem.sentence}}"}</td><td className="py-2 px-3">Lorem ipsum dolor sit amet.</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lorem.paragraph}}"}</td><td className="py-2 px-3">Multiple sentences...</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Example: Notification Endpoint</h2>
      <CodeBlock code={`{
  "path": "/ws/notifications",
  "eventType": "message",
  "response": {
    "id": "{{faker.string.uuid}}",
    "type": "notification",
    "title": "{{faker.lorem.sentence}}",
    "message": "{{faker.lorem.paragraph}}",
    "user": {
      "name": "{{faker.person.fullName}}",
      "email": "{{faker.internet.email}}",
      "avatar": "{{faker.image.avatar}}"
    },
    "read": "{{faker.datatype.boolean}}",
    "createdAt": "{{faker.date.recent}}"
  },
  "delay": 1000
}`} language="json" />

      <Callout type="tip">
        You can also use simple format: {"{{faker.uuid}}"}, {"{{faker.email}}"}, {"{{faker.sentence}}"}, etc.
      </Callout>

      <Callout type="info">
        For a complete reference of all available Faker templates, see the <a href="/docs/faker-templates" className="underline">Faker Templates</a> documentation.
      </Callout>

      <h2>{t.docs.webSockets.authentication}</h2>
      <p>{t.docs.webSockets.authDesc}</p>

      <h2>{t.docs.webSockets.apiReference}</h2>
      <p>{t.docs.webSockets.wsEndpoints}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">{t.docs.apiReference.method}</th>
              <th className="text-left py-2 px-3">{t.docs.apiReference.route}</th>
              <th className="text-left py-2 px-3">{t.docs.apiReference.descriptionCol}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono">GET</td>
              <td className="py-2 px-3 font-mono">/api/ws-endpoints</td>
              <td className="py-2 px-3">{t.docs.webSockets.listWsEndpoints}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono">POST</td>
              <td className="py-2 px-3 font-mono">/api/ws-endpoints</td>
              <td className="py-2 px-3">{t.docs.webSockets.createWsEndpoint}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono">GET</td>
              <td className="py-2 px-3 font-mono">/api/ws-endpoints/:id</td>
              <td className="py-2 px-3">{t.docs.webSockets.listWsEndpoints}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-mono">PUT</td>
              <td className="py-2 px-3 font-mono">/api/ws-endpoints/:id</td>
              <td className="py-2 px-3">{t.docs.webSockets.updateWsEndpoint}</td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-mono">DELETE</td>
              <td className="py-2 px-3 font-mono">/api/ws-endpoints/:id</td>
              <td className="py-2 px-3">{t.docs.webSockets.deleteWsEndpoint}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
