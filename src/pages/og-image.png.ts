export const prerender = true;

import { Resvg } from '@resvg/resvg-js';

// Layout editoriale: cream bg, eyebrow, titolo Fraunces-style su 2 righe,
// sottotitolo, accent gold, footer Glitch magenta in basso a destra.
// Renderizzato a 2400x1260 (2x retina) per nitidezza dopo compressione di
// LinkedIn / Facebook / X. La canvas dichiarata nei meta resta 1200x630.
// Fonts: serif/sans-serif/monospace generici risolti via fontconfig.

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1260" viewBox="0 0 2400 1260">
  <rect width="2400" height="1260" fill="#F5EFE0"/>

  <text x="160" y="240"
        font-family="Inter, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
        font-size="36" font-weight="500" letter-spacing="5.4" fill="#7A6B5D">
    STEFANOANDRELLO.ME
  </text>

  <text x="160" y="480"
        font-family="Fraunces, Georgia, 'Times New Roman', serif"
        font-size="160" font-weight="600" fill="#0B1F3A">
    AI Strategist
  </text>

  <text x="160" y="656"
        font-family="Fraunces, Georgia, 'Times New Roman', serif"
        font-size="160" font-weight="600" fill="#0B1F3A">
    per PMI italiane.
  </text>

  <text x="160" y="800"
        font-family="Inter, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
        font-size="56" font-weight="400" fill="#3D3A35">
    Formazione EU AI Act &#183; AI agentica &#183; MCP server
  </text>

  <rect x="160" y="1040" width="480" height="4" fill="#C8A858"/>

  <text x="2240" y="1110" text-anchor="end"
        font-family="'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
        font-size="32" font-weight="700" fill="#C724FF">
    Glitch &#8212; Il glitch &#232; umano.
  </text>
</svg>`;

const opts = {
  fitTo: { mode: 'width' as const, value: 2400 },
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
