"use client";

import { Callout } from "@/components/docs";
import { useTranslation } from "@/lib/i18n";

export default function GettingStartedPage() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t.docs.gettingStarted.title}</h1>
      <p className="text-lg text-muted-foreground">
        {t.docs.gettingStarted.description}
      </p>

      <h2>{t.docs.gettingStarted.whatIs}</h2>
      <p>
        {t.docs.gettingStarted.whatIsDescription}
      </p>

      <Callout type="tip" title={t.callout.slogan}>
        &ldquo;{t.home.sloganText}&rdquo;
      </Callout>

      <h2>{t.docs.gettingStarted.mainFeatures}</h2>
      <ul>
        <li>{t.docs.gettingStarted.featureList.createEndpoints}</li>
        <li>{t.docs.gettingStarted.featureList.httpMethods}</li>
        <li>{t.docs.gettingStarted.featureList.schemas}</li>
        <li>{t.docs.gettingStarted.featureList.fakeData}</li>
        <li>{t.docs.gettingStarted.featureList.auth}</li>
        <li>{t.docs.gettingStarted.featureList.webUI}</li>
        <li>{t.docs.gettingStarted.featureList.cli}</li>
      </ul>

      <h2>{t.docs.gettingStarted.nextSteps}</h2>
      <p>
        {t.docs.gettingStarted.readyToStart}{" "}
        <a href="/docs/installation">
          {t.docs.installation.title}
        </a>{" "}
        {t.docs.gettingStarted.toLearnInstall}
      </p>
    </>
  );
}
