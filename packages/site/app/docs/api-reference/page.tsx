"use client";

import { CodeBlock } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function APIReferencePage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.apiReference.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.apiReference.description}
      </p>

      <h2>{t.docs.apiReference.baseUrl}</h2>
      <CodeBlock code="http://localhost:3001/api" language="bash" />

      <h2>{t.docs.apiReference.endpoints}</h2>

      <h3>{t.docs.apiReference.mockEndpoints}</h3>
      <table className="w-full border-collapse my-4">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">{t.docs.apiReference.method}</th>
            <th className="text-left py-2">{t.docs.apiReference.route}</th>
            <th className="text-left py-2">{t.docs.apiReference.descriptionCol}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/mock/endpoints</td>
            <td className="py-2">{t.docs.apiReference.listEndpoints}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">POST</span></td>
            <td className="py-2 font-mono">/mock/endpoints</td>
            <td className="py-2">{t.docs.apiReference.createEndpoint}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-blue-600 font-mono">PUT</span></td>
            <td className="py-2 font-mono">/mock/endpoints/:id</td>
            <td className="py-2">{t.docs.apiReference.updateEndpoint}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-red-600 font-mono">DELETE</span></td>
            <td className="py-2 font-mono">/mock/endpoints/:id</td>
            <td className="py-2">{t.docs.apiReference.deleteEndpoint}</td>
          </tr>
        </tbody>
      </table>

      <h3>{t.docs.apiReference.schemas}</h3>
      <table className="w-full border-collapse my-4">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">{t.docs.apiReference.method}</th>
            <th className="text-left py-2">{t.docs.apiReference.route}</th>
            <th className="text-left py-2">{t.docs.apiReference.descriptionCol}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/schemas</td>
            <td className="py-2">{t.docs.apiReference.listSchemas}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">POST</span></td>
            <td className="py-2 font-mono">/schemas</td>
            <td className="py-2">{t.docs.apiReference.createSchema}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/schemas/:name/generate</td>
            <td className="py-2">{t.docs.apiReference.generateData}</td>
          </tr>
        </tbody>
      </table>

      <h3>{t.docs.apiReference.logs}</h3>
      <table className="w-full border-collapse my-4">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">{t.docs.apiReference.method}</th>
            <th className="text-left py-2">{t.docs.apiReference.route}</th>
            <th className="text-left py-2">{t.docs.apiReference.descriptionCol}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/logs</td>
            <td className="py-2">{t.docs.apiReference.listLogs}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-red-600 font-mono">DELETE</span></td>
            <td className="py-2 font-mono">/logs</td>
            <td className="py-2">{t.docs.apiReference.clearLogs}</td>
          </tr>
        </tbody>
      </table>

      <h3>{t.docs.apiReference.users}</h3>
      <table className="w-full border-collapse my-4">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2">{t.docs.apiReference.method}</th>
            <th className="text-left py-2">{t.docs.apiReference.route}</th>
            <th className="text-left py-2">{t.docs.apiReference.descriptionCol}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">POST</span></td>
            <td className="py-2 font-mono">/auth/register</td>
            <td className="py-2">{t.docs.apiReference.register}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">POST</span></td>
            <td className="py-2 font-mono">/auth/login</td>
            <td className="py-2">{t.docs.apiReference.login}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2"><span className="text-green-600 font-mono">GET</span></td>
            <td className="py-2 font-mono">/auth/me</td>
            <td className="py-2">{t.docs.apiReference.getCurrentUser}</td>
          </tr>
        </tbody>
      </table>

      <h2>{t.docs.apiReference.statusCodes}</h2>
      <ul>
        <li><strong>200</strong> - {t.docs.apiReference.success.replace("200 - ", "")}</li>
        <li><strong>201</strong> - {t.docs.apiReference.created.replace("201 - ", "")}</li>
        <li><strong>400</strong> - {t.docs.apiReference.badRequest.replace("400 - ", "")}</li>
        <li><strong>401</strong> - {t.docs.apiReference.unauthorized.replace("401 - ", "")}</li>
        <li><strong>404</strong> - {t.docs.apiReference.notFound.replace("404 - ", "")}</li>
        <li><strong>500</strong> - {t.docs.apiReference.serverError.replace("500 - ", "")}</li>
      </ul>
    </>
  );
}
