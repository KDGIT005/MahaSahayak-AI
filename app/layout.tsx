import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'MahaSahayak AI — Mahakumbh 2028 Smart Volunteer Deployment',
  description:
    'AI-powered volunteer deployment and workforce optimization platform for Mahakumbh 2028. Manage 50,000+ volunteers across 10 zones with Google Gemini AI.',
  keywords: 'Mahakumbh 2028, volunteer management, AI deployment, Prayagraj, Kumbh Mela',
  openGraph: {
    title: 'MahaSahayak AI — Mahakumbh 2028',
    description: 'AI-Powered Volunteer Deployment Platform for Mahakumbh 2028',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="translate-patch"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof Node === 'function' && Node.prototype) {
                const originalRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                  if (child.parentNode !== this) {
                    if (console) { console.error('Cannot remove a child from a different parent', child, this); }
                    return child;
                  }
                  return originalRemoveChild.apply(this, arguments);
                };
                const originalInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, referenceNode) {
                  if (referenceNode && referenceNode.parentNode !== this) {
                    if (console) { console.error('Cannot insert before a reference node from a different parent', referenceNode, this); }
                    return newNode;
                  }
                  return originalInsertBefore.apply(this, arguments);
                };
              }
            `
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'hi,en', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
      </body>
    </html>
  );
}
