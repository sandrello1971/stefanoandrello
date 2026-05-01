#!/usr/bin/env bash
set -euo pipefail

OPENAPI_TOKEN="${OPENAPI_TOKEN:-IL_TUO_TOKEN}"
VC_BASE="${VC_BASE:-https://visurecamerali.openapi.it}"
CF_PIVA="${CF_PIVA:-13267180969}"

OUT_PREFIX="samperone_ordinaria_attuale"
REQ_JSON="${OUT_PREFIX}_request.json"
STATUS_JSON="${OUT_PREFIX}_status.json"
ATTACH_JSON="${OUT_PREFIX}_allegato.json"
ZIP_FILE="${OUT_PREFIX}.zip"
OUT_DIR="${OUT_PREFIX}_dir"

if [[ "$OPENAPI_TOKEN" == "IL_TUO_TOKEN" || -z "$OPENAPI_TOKEN" ]]; then
  echo "Errore: imposta OPENAPI_TOKEN prima di eseguire lo script."
  echo 'Esempio: export OPENAPI_TOKEN="il_tuo_token"'
  exit 1
fi

command -v curl >/dev/null 2>&1 || { echo "curl non trovato"; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "jq non trovato"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "python3 non trovato"; exit 1; }
command -v unzip >/dev/null 2>&1 || { echo "unzip non trovato"; exit 1; }

echo "Richiedo visura ordinaria per CF/P.IVA: $CF_PIVA"
echo

curl -sS -X POST "$VC_BASE/ordinaria-societa-capitale" \
  -H "Authorization: Bearer $OPENAPI_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"cf_piva_id\":\"$CF_PIVA\"}" \
  > "$REQ_JSON"

echo "Risposta creazione richiesta:"
cat "$REQ_JSON" | jq
echo

REQ_ID="$(jq -r '.data.id // empty' "$REQ_JSON")"

if [[ -z "$REQ_ID" ]]; then
  echo "Errore: impossibile ricavare l'id richiesta."
  exit 1
fi

echo "ID richiesta: $REQ_ID"
echo

echo "Attendo 'Visura evasa'..."
while true; do
  curl -sS "$VC_BASE/ordinaria-societa-capitale/$REQ_ID" \
    -H "Authorization: Bearer $OPENAPI_TOKEN" \
    > "$STATUS_JSON"

  STATO="$(jq -r '.data.stato_richiesta // empty' "$STATUS_JSON")"
  echo "Stato: $STATO"

  if [[ "$STATO" == "Visura evasa" ]]; then
    break
  fi

  sleep 5
done

echo
echo "Visura pronta."
echo

curl -sS "$VC_BASE/ordinaria-societa-capitale/$REQ_ID/allegati" \
  -H "Authorization: Bearer $OPENAPI_TOKEN" \
  > "$ATTACH_JSON"

echo "Metadati allegato:"
cat "$ATTACH_JSON" | jq '{nome: .data.nome, dimensione: .data.dimensione}'
echo

jq -r '.data.file' "$ATTACH_JSON" | \
python3 -c 'import sys,base64,re; s=re.sub(r"\s+","",sys.stdin.read()); s += "=" * ((4-len(s)%4)%4); sys.stdout.buffer.write(base64.b64decode(s))' \
> "$ZIP_FILE"

echo "Tipo file decodificato:"
file "$ZIP_FILE"
echo

mkdir -p "$OUT_DIR"
unzip -o "$ZIP_FILE" -d "$OUT_DIR" >/dev/null

echo "Contenuto estratto:"
ls -lah "$OUT_DIR"
echo

if command -v open >/dev/null 2>&1; then
  open "$OUT_DIR"
fi

echo "Fatto."
echo "Cartella output: $OUT_DIR"
