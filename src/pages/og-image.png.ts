export const prerender = true;

import { Resvg } from '@resvg/resvg-js';

// Layout editoriale: cream bg, eyebrow, titolo Fraunces-style su 2 righe,
// sottotitolo, accent gold, footer Glitch magenta in basso a destra.
// Fonts: serif/sans-serif/monospace generici risolti via fontconfig.
// Per font di brand reali (Fraunces / Inter / JetBrains Mono), aggiungere
// i .ttf in public/fonts/ e passarli a Resvg via opts.font.fontFiles.

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F5EFE0"/>

  <!-- Eyebrow -->
  <text x="80" y="120"
        font-family="Inter, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
        font-size="18" font-weight="500" letter-spacing="2.7" fill="#7A6B5D">
    STEFANOANDRELLO.ME
  </text>

  <!-- Titolo, due righe (size 80 + line-height 1.1 = 88px tra baselines) -->
  <text x="80" y="240"
        font-family="Fraunces, Georgia, 'Times New Roman', serif"
        font-size="80" font-weight="600" fill="#0B1F3A">
    AI Strategist
  </text>
  <text x="80" y="328"
        font-family="Fraunces, Georgia, 'Times New Roman', serif"
        font-size="80" font-weight="600" fill="#0B1F3A">
    per PMI italiane.
  </text>

  <!-- Sottotitolo -->
  <text x="80" y="400"
        font-family="Inter, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
        font-size="28" font-weight="400" fill="#3D3A35">
    Formazione EU AI Act &#183; AI agentica &#183; MCP server
  </text>

  <!-- Accent gold (240x2) sopra il footer -->
  <rect x="80" y="520" width="240" height="2" fill="#C8A858"/>

  <!-- Footer Glitch in basso a destra -->
  <text x="1120" y="555" text-anchor="end"
        font-family="'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
        font-size="16" font-weight="700" fill="#C724FF">
    Glitch &#8212; Il glitch &#232; umano.
  </text>
</svg>`;

const opts = {
  fitTo: { mode: 'width' as const, value: 1200 },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: 'Inter',
  },
  background: '#F5EFE0',
};

export async function GET() {
  const resvg = new Resvg(svg, opts);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
