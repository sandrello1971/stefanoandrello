export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'Su cosa puoi affiancarmi concretamente?',
    answer:
      'Su quattro fronti. Strategia: dove l\'AI entra in azienda e dove no, con quale governance. Formazione: progetti formativi su misura per il tuo team, non da catalogo. AI agentica e MCP: progettazione e sviluppo di agenti AI custom. Scrittura e speaking: intervento su eventi aziendali, scuole, istituti.',
  },
  {
    question: 'La tua formazione è riconosciuta ai fini dell\'EU AI Act?',
    answer:
      'Sì. I percorsi formativi che progetto sono strutturati per coprire le quattro aree di AI Literacy richieste dall\'Art. 4 del Regolamento (UE) 2024/1689 — comprensione tecnologica, conoscenza applicativa, pensiero critico, conformità normativa — con materiali documentabili in caso di audit.',
  },
  {
    question: 'In azienda o online?',
    answer:
      'Entrambe. Le sessioni esperienziali e laboratori direzionali funzionano meglio in presenza. I percorsi più estesi si prestano al blended (live online + esercitazioni asincrone). Decidiamo in base al team e al settore.',
  },
  {
    question: 'I percorsi formativi sono finanziabili con fondi interprofessionali?',
    answer:
      'Sì. I percorsi che progetto sono compatibili con i principali fondi interprofessionali (Fondimpresa, Fondirigenti, For.Te.). Ti fornisco la documentazione necessaria per il caricamento dei piani formativi.',
  },
  {
    question: 'Che differenza c\'è fra te e altri consulenti AI?',
    answer:
      'Tre cose, principalmente. Lavoro solo con PMI italiane e capisco i loro vincoli reali (non scrivo il piano di Google). Costruisco con metodo human-in-the-loop: l\'umano resta al centro, l\'AI accelera. E ho un punto di vista pubblico — tre libri e il manifesto Glitch — che puoi leggere prima di decidere se vale la pena parlarci.',
  },
];
