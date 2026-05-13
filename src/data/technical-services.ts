export interface TechnicalService {
  title: string;
  focus: string;
  description: string;
  image: string;
  systems?: string[];
}

export interface TechnicalServiceStat {
  value: string;
  label: string;
  description: string;
}

export interface TechnicalServiceProcessStep {
  title: string;
  description: string;
}

export interface TechnicalServiceCommitment {
  title: string;
  description: string;
}

export const technicalServiceIntro = {
  eyebrow: "Servicio t\u00e9cnico especializado",
  title: "Electr\u00f3nica aplicada al transporte pesado",
  description:
    "Diagnosticamos, reparamos y programamos sistemas electr\u00f3nicos que afectan la disponibilidad real de buses, camiones y flotas.",
  supportingText:
    "Intervenimos m\u00f3dulos de motor, cabina, tableros INS y sistemas de informaci\u00f3n al pasajero con criterio de laboratorio, lectura t\u00e9cnica de falla y foco en continuidad operativa.",
};

export const technicalServiceHighlights = [
  "Lectura t\u00e9cnica de fallas sobre s\u00edntoma, m\u00f3dulo y contexto de operaci\u00f3n.",
  "Reparaci\u00f3n, configuraci\u00f3n y programaci\u00f3n de sistemas cr\u00edticos de motor y cabina.",
  "Recuperaci\u00f3n de tableros INS y soporte para itinerarios y letreros electr\u00f3nicos.",
  "Intervenciones pensadas para bajar detenciones, recuperar estabilidad y sostener la operaci\u00f3n.",
];

export const technicalServiceStats: TechnicalServiceStat[] = [
  {
    value: "PLD / MR / MCM",
    label: "Motor y gesti\u00f3n electr\u00f3nica",
    description:
      "Intervenci\u00f3n sobre control, respuesta y estabilidad de plataformas pesadas.",
  },
  {
    value: "INS 2010 - 2014",
    label: "Visualizaci\u00f3n y monitoreo",
    description:
      "Recuperaci\u00f3n de lectura cr\u00edtica para el operador y seguimiento de la unidad.",
  },
  {
    value: "Mobitec / Iluminator",
    label: "Informaci\u00f3n al pasajero",
    description:
      "Configuraci\u00f3n y soporte para itinerarios, rutas y continuidad de visualizaci\u00f3n.",
  },
];

export const technicalServiceProcess: TechnicalServiceProcessStep[] = [
  {
    title: "Evaluaci\u00f3n del caso",
    description:
      "Revisamos la falla reportada, antecedentes del equipo y contexto de uso para definir una ruta t\u00e9cnica clara.",
  },
  {
    title: "Intervenci\u00f3n especializada",
    description:
      "Reparamos, configuramos o programamos seg\u00fan el sistema involucrado, priorizando estabilidad electr\u00f3nica y continuidad.",
  },
  {
    title: "Validaci\u00f3n operativa",
    description:
      "Contrastamos el resultado con la funci\u00f3n esperada del m\u00f3dulo para devolver una soluci\u00f3n confiable y trazable.",
  },
];

export const technicalServices: TechnicalService[] = [
  {
    title: "M\u00f3dulos de Motor",
    focus: "PLD, MR, MR2 y MCM con foco en respuesta, estabilidad y continuidad de marcha.",
    description:
      "Atendemos unidades de control que gobiernan inyecci\u00f3n, protecciones y l\u00f3gica del motor. El trabajo considera lectura t\u00e9cnica de la falla, recuperaci\u00f3n de comunicaci\u00f3n y ajuste electr\u00f3nico para que la unidad vuelva a operar con menor riesgo de detenci\u00f3n.",
    image: "/banners/banner2.jpg",
    systems: ["PLD", "MR", "MR2", "MCM"],
  },
  {
    title: "M\u00f3dulos de Cabina",
    focus: "MDM, FR, CPC, CPC-FR y CPC3 para mantener control, seguridad y coordinaci\u00f3n del veh\u00edculo.",
    description:
      "Intervenimos m\u00f3dulos asociados a gesti\u00f3n el\u00e9ctrica, funciones de cabina y comunicaci\u00f3n interna. El servicio combina reparaci\u00f3n, configuraci\u00f3n y ajuste fino para sostener un comportamiento confiable en ruta, taller o faena.",
    image: "/banners/banner5.jpg",
    systems: ["MDM", "FR", "CPC", "CPC-FR", "CPC3"],
  },
  {
    title: "Tableros Electr\u00f3nicos INS",
    focus: "INS 2010, 2012 y 2014 con recuperaci\u00f3n de visualizaci\u00f3n, alertas y monitoreo.",
    description:
      "Recuperamos tableros con fallas de lectura, alertas o comportamiento irregular para devolver informaci\u00f3n clara al operador. Priorizamos estabilidad de indicaciones, continuidad de monitoreo y respuesta confiable en cabina.",
    image: "/banners/banner6.jpg",
    systems: ["INS 2010", "INS 2012", "INS 2014"],
  },
  {
    title: "Itinerarios y Letreros Electr\u00f3nicos",
    focus: "Soporte para Mobitec e Iluminator orientado a visibilidad, configuraci\u00f3n de rutas y operaci\u00f3n diaria.",
    description:
      "Realizamos reparaci\u00f3n, configuraci\u00f3n e integraci\u00f3n de sistemas de informaci\u00f3n al pasajero. Corregimos problemas de visualizaci\u00f3n, parametrizaci\u00f3n de rutas y continuidad de funcionamiento en buses y transporte de pasajeros.",
    image: "/banners/banner3.jpg",
    systems: ["Mobitec", "Iluminator"],
  },
  {
    title: "Soluciones Electr\u00f3nicas para Veh\u00edculos Pesados",
    focus: "Diagn\u00f3stico, integraci\u00f3n y optimizaci\u00f3n cuando la falla involucra m\u00e1s de un sistema.",
    description:
      "Cuando el problema requiere una mirada transversal, abordamos el sistema completo para ordenar diagn\u00f3stico, reparaci\u00f3n e integraci\u00f3n. El objetivo es recuperar confiabilidad electr\u00f3nica y reducir reincidencias en la operaci\u00f3n de la unidad o la flota.",
    image: "/banners/banner1.jpg",
  },
];

export const technicalServiceCoverage = [
  "M\u00f3dulos de motor y cabina para plataformas de transporte pesado.",
  "Tableros INS con recuperaci\u00f3n de visualizaci\u00f3n, alertas y monitoreo.",
  "Itinerarios y letreros electr\u00f3nicos para transporte de pasajeros.",
  "Apoyo t\u00e9cnico para talleres, operadores y flotas que requieren continuidad operativa.",
];

export const technicalServiceCommitments: TechnicalServiceCommitment[] = [
  {
    title: "Intervenciones con foco operativo",
    description:
      "Cada caso se aborda pensando en devolver estabilidad electr\u00f3nica, reducir tiempos detenidos y sostener la disponibilidad de la unidad.",
  },
  {
    title: "Criterio t\u00e9cnico antes de reemplazar",
    description:
      "Priorizamos diagn\u00f3stico preciso y lectura real de la falla para evitar cambios innecesarios y orientar mejor la soluci\u00f3n.",
  },
  {
    title: "Soporte alineado a flotas y talleres",
    description:
      "Trabajamos sobre necesidades concretas de transporte pesado, operaci\u00f3n de pasajeros y mantenimiento especializado.",
  },
];
