"use client";
import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

const GA = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GTM = process.env.NEXT_PUBLIC_GTM_ID;

export function Analytics() {
  useEffect(() => { track("landing_page_view", { path: window.location.pathname, referrer_host: document.referrer ? new URL(document.referrer).host : "direct" }); }, []);
  return (
    <>
      {GTM && (
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}</Script>
      )}
      {GA && !GTM && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');`}</Script>
        </>
      )}
    </>
  );
}
