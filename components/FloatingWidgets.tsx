'use client';

import Script from 'next/script';

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? '15072009576';

export default function FloatingWidgets() {
  const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
    'Hi ElitePartz! I have a question about an order.'
  )}`;

  return (
    <>
      {/* ── Smartsupp Live Chat (renders its own bubble at bottom-right ~20px) ── */}
      <Script
        id="smartsupp-chat"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '9dd2b0591537f07ec61ad30d18b186c125f7e049';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `,
        }}
      />

      {/*
        WhatsApp button — fixed at bottom: 100px so it sits clearly above
        the Smartsupp bubble (~56px tall at bottom: 20px).
        Uses <img> with a local SVG so the logo is immune to CSS color inheritance.
      */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with ElitePartz on WhatsApp"
        title="Chat with us on WhatsApp"
        style={{
          position:        'fixed',
          bottom:          '100px',
          right:           '20px',
          zIndex:          9998,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          width:           '56px',
          height:          '56px',
          borderRadius:    '50%',
          backgroundColor: '#25D366',
          boxShadow:       '0 4px 16px rgba(0,0,0,0.30)',
          cursor:          'pointer',
          textDecoration:  'none',
          transition:      'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform   = 'scale(1.08)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow   = '0 6px 20px rgba(0,0,0,0.35)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform   = 'scale(1)';
          (e.currentTarget as HTMLAnchorElement).style.boxShadow   = '0 4px 16px rgba(0,0,0,0.30)';
        }}
      >
        {/* SVG served from /public — completely isolated from CSS inheritance */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={56}
          height={56}
          style={{ display: 'block', borderRadius: '50%' }}
        />
      </a>
    </>
  );
}
