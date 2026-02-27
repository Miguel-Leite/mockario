"use client";

import { CodeBlock, Callout } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function FakerTemplatesPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>Faker Templates</h1>
      <p className="text-lg text-muted-foreground">
        Generate realistic fake data with Faker. Works in both HTTP endpoints and WebSocket responses.
      </p>

      <h2>Introduction</h2>
      <p>
        Faker templates allow you to generate realistic, dynamic data in your mock responses. 
        Use the {"{{faker.method}}"} syntax in your JSON responses to automatically generate data.
      </p>

      <Callout type="info">
        Works in: HTTP endpoints, WebSocket auto-responses, Schema generation
      </Callout>

      <h2>Syntax Formats</h2>
      <p>Two formats are supported:</p>

      <h3>Simple Format</h3>
      <CodeBlock code={`"{{faker.uuid}}"`} language="json" />

      <h3>Nested Format (Recommended)</h3>
      <CodeBlock code={`"{{faker.person.fullName}}"`} language="json" />

      <h2>Person</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.fullName}}"}</td><td className="py-2 px-3">John Doe</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.firstName}}"}</td><td className="py-2 px-3">Jane</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.lastName}}"}</td><td className="py-2 px-3">Smith</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.middleName}}"}</td><td className="py-2 px-3">Marie</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.email}}"}</td><td className="py-2 px-3">jane.smith@example.com</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.gender}}"}</td><td className="py-2 px-3">Female</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.jobTitle}}"}</td><td className="py-2 px-3">Software Engineer</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.person.bio}}"}</td><td className="py-2 px-3">Lover of travel and coffee...</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Date & Time</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.past}}"}</td><td className="py-2 px-3">2024-01-15T10:30:00.000Z</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.future}}"}</td><td className="py-2 px-3">2027-06-20T14:45:00.000Z</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.recent}}"}</td><td className="py-2 px-3">2026-02-25T09:15:00.000Z</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.soon}}"}</td><td className="py-2 px-3">2026-02-28T12:00:00.000Z</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.birthdate}}"}</td><td className="py-2 px-3">1985-07-10T00:00:00.000Z</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.month}}"}</td><td className="py-2 px-3">March</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.date.weekday}}"}</td><td className="py-2 px-3">Monday</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Location</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.city}}"}</td><td className="py-2 px-3">New York</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.country}}"}</td><td className="py-2 px-3">United States</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.countryCode}}"}</td><td className="py-2 px-3">US</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.street}}"}</td><td className="py-2 px-3">123 Main Street</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.state}}"}</td><td className="py-2 px-3">California</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.zipCode}}"}</td><td className="py-2 px-3">10001</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.latitude}}"}</td><td className="py-2 px-3">40.7128</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.location.longitude}}"}</td><td className="py-2 px-3">-74.0060</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Internet</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.url}}"}</td><td className="py-2 px-3">https://example.com</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.email}}"}</td><td className="py-2 px-3">user@example.com</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.username}}"}</td><td className="py-2 px-3">john_doe123</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.password}}"}</td><td className="py-2 px-3">xK9#mP2$</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.ip}}"}</td><td className="py-2 px-3">192.168.1.1</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.ipv4}}"}</td><td className="py-2 px-3">192.168.1.100</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.ipv6}}"}</td><td className="py-2 px-3">2001:0db8:85a3:0000:0000:8a2e:0370:7334</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.mac}}"}</td><td className="py-2 px-3">00:1A:2B:3C:4D:5E</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.internet.userAgent}}"}</td><td className="py-2 px-3">Mozilla/5.0...</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Commerce & Finance</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.commerce.productName}}"}</td><td className="py-2 px-3">Ergonomic Wooden Chair</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.commerce.price}}"}</td><td className="py-2 px-3">42.00</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.commerce.department}}"}</td><td className="py-2 px-3">Electronics</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.finance.currencyCode}}"}</td><td className="py-2 px-3">USD</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.finance.amount}}"}</td><td className="py-2 px-3">99.99</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.finance.bitcoinAddress}}"}</td><td className="py-2 px-3">1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.finance.iban}}"}</td><td className="py-2 px-3">DE89 3704 0044 0532 0130 00</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Data Types</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.string.uuid}}"}</td><td className="py-2 px-3">550e8400-e29b-41d4-a716-446655440000</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.string.alpha}}"}</td><td className="py-2 px-3">abcDEF</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.string.alphanumeric}}"}</td><td className="py-2 px-3">abc123DEF456</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.string.numeric}}"}</td><td className="py-2 px-3">1234567890</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.number.int}}"}</td><td className="py-2 px-3">42</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.number.float}}"}</td><td className="py-2 px-3">42.5</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.datatype.boolean}}"}</td><td className="py-2 px-3">true</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Lorem (Text)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lorem.word}}"}</td><td className="py-2 px-3">lorem</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lorem.words}}"}</td><td className="py-2 px-3">lorem ipsum dolor</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lorem.sentence}}"}</td><td className="py-2 px-3">Lorem ipsum dolor sit amet.</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lorem.sentences}}"}</td><td className="py-2 px-3">Two sentences here.</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lorem.paragraph}}"}</td><td className="py-2 px-3">Multiple sentences...</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Vehicle</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.vehicle.vehicle}}"}</td><td className="py-2 px-3">Toyota Camry</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.vehicle.manufacturer}}"}</td><td className="py-2 px-3">Toyota</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.vehicle.model}}"}</td><td className="py-2 px-3">Camry</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.vehicle.color}}"}</td><td className="py-2 px-3">Red</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.vehicle.fuel}}"}</td><td className="py-2 px-3">Electric</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.vehicle.vin}}"}</td><td className="py-2 px-3">1G1YY22G965104590</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Music</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.music.songName}}"}</td><td className="py-2 px-3">Bohemian Rhapsody</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.music.artist}}"}</td><td className="py-2 px-3">Queen</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.music.album}}"}</td><td className="py-2 px-3">A Night at the Opera</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.music.genre}}"}</td><td className="py-2 px-3">Rock</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Image</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Template</th>
              <th className="text-left py-2 px-3">Example Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.image.avatar}}"}</td><td className="py-2 px-3">https://cloudflare-ipfs.com/...</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.image.url}}"}</td><td className="py-2 px-3">https://placehold.co/600x400</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Practical Examples</h2>

      <h3>HTTP Endpoint Response</h3>
      <CodeBlock code={`{
  "path": "/api/users",
  "method": "GET",
  "response": {
    "id": "{{faker.string.uuid}}",
    "name": "{{faker.person.fullName}}",
    "email": "{{faker.internet.email}}",
    "avatar": "{{faker.image.avatar}}",
    "address": {
      "city": "{{faker.location.city}}",
      "country": "{{faker.location.country}}",
      "zipCode": "{{faker.location.zipCode}}"
    },
    "createdAt": "{{faker.date.past}}",
    "isActive": "{{faker.datatype.boolean}}"
  }
}`} language="json" />

      <h3>WebSocket Auto-Response</h3>
      <CodeBlock code={`{
  "path": "/ws/chat",
  "eventType": "message",
  "response": {
    "id": "{{faker.string.uuid}}",
    "user": {
      "name": "{{faker.person.fullName}}",
      "avatar": "{{faker.image.avatar}}"
    },
    "message": "{{faker.lorem.sentence}}",
    "timestamp": "{{faker.date.recent}}"
  },
  "delay": 500
}`} language="json" />

      <h3>Notification Endpoint</h3>
      <CodeBlock code={`{
  "path": "/ws/notifications",
  "eventType": "message",
  "response": {
    "id": "{{faker.string.uuid}}",
    "type": "notification",
    "title": "{{faker.commerce.productName}}",
    "message": "{{faker.lorem.paragraph}}",
    "user": {
      "id": "{{faker.string.uuid}}",
      "name": "{{faker.person.fullName}}",
      "email": "{{faker.internet.email}}"
    },
    "priority": "{{faker.number.int}}",
    "read": "{{faker.datatype.boolean}}",
    "createdAt": "{{faker.date.recent}}"
  },
  "delay": 1000
}`} language="json" />

      <h2>Quick Reference</h2>
      <p>Commonly used aliases (simpler format):</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">Alias</th>
              <th className="text-left py-2 px-3">Equivalent To</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.uuid}}"}</td><td className="py-2 px-3">{"{{faker.string.uuid}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.email}}"}</td><td className="py-2 px-3">{"{{faker.internet.email}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.name}}"}</td><td className="py-2 px-3">{"{{faker.person.fullName}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.firstName}}"}</td><td className="py-2 px-3">{"{{faker.person.firstName}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.lastName}}"}</td><td className="py-2 px-3">{"{{faker.person.lastName}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.city}}"}</td><td className="py-2 px-3">{"{{faker.location.city}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.country}}"}</td><td className="py-2 px-3">{"{{faker.location.country}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.phone}}"}</td><td className="py-2 px-3">Phone number</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.price}}"}</td><td className="py-2 px-3">{"{{faker.commerce.price}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.word}}"}</td><td className="py-2 px-3">{"{{faker.lorem.word}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.sentence}}"}</td><td className="py-2 px-3">{"{{faker.lorem.sentence}}"}</td></tr>
            <tr className="border-b"><td className="py-2 px-3 font-mono">{"{{faker.paragraph}}"}</td><td className="py-2 px-3">{"{{faker.lorem.paragraph}}"}</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
