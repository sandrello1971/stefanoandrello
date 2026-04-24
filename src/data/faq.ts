export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'I corsi sono riconosciuti dall’EU AI Act?',
    answer:
      'Sì. INITIUM offre copertura piena dell’Art. 4 del Regolamento UE 2024/1689 nelle quattro aree di AI Literacy richieste. CONSILIUM copre le aree direzionali (governance, policy, selezione progetti). PRIMUS è propedeutico.',
  },
  {
    question: 'Posso iniziare da CONSILIUM o devo fare per forza PRIMUS?',
    answer:
      'Sì, puoi entrare al livello giusto per il tuo ruolo. PRIMUS è consigliato per team che non hanno mai affrontato il tema; CONSILIUM è dedicato alla direzione; INITIUM serve a tutti gli operativi.',
  },
  {
    question: 'I corsi si svolgono in azienda o online?',
    answer:
      'Entrambe le modalità. Le sessioni esperienziali in presenza sono più efficaci per il workshop PRIMUS e il laboratorio CONSILIUM. INITIUM si presta anche al formato blended (live online + esercitazioni asincrone).',
  },
  {
    question: 'Posso finanziarli con fondi interprofessionali?',
    answer:
      'Sì. I corsi sono compatibili con i principali fondi interprofessionali (Fondimpresa, Fondirigenti, For.Te.). Forniamo la documentazione necessaria per il caricamento dei piani formativi.',
  },
  {
    question: 'Che differenza c’è tra un corso AI generico e il Percorso AI Ratio?',
    answer:
      'Tre cose: la struttura in tre domande chiare (perché/cosa/come), la conformità documentata all’Art. 4 EU AI Act, e il fatto che ogni tappa produce output operativi — non slide ma decisioni, regole d’uso, progetti pilota.',
  },
];
