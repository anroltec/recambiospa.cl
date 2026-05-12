export interface TechnicalService {
  title: string;
  description: string;
  image: string;
  systems?: string[];
}

export const technicalServiceIntro = {
  eyebrow: "Servicio t\u00e9cnico especializado",
  title: "Electr\u00f3nica aplicada al transporte pesado",
  description:
    "Diagn\u00f3stico, reparaci\u00f3n y programaci\u00f3n de sistemas electr\u00f3nicos para buses, camiones y flotas, con foco en continuidad operativa, seguridad y confiabilidad.",
};

export const technicalServices: TechnicalService[] = [
  {
    title: "M\u00f3dulos de Motor",
    description:
      "Diagn\u00f3stico, reparaci\u00f3n y programaci\u00f3n especializada de m\u00f3dulos electr\u00f3nicos para veh\u00edculos pesados. Trabajamos con sistemas cr\u00edticos de gesti\u00f3n de motor como PLD, MR, MR2 y MCM, asegurando un funcionamiento eficiente, mayor rendimiento y reducci\u00f3n de fallas operativas. Nuestro servicio t\u00e9cnico utiliza herramientas avanzadas para detectar problemas electr\u00f3nicos, optimizar par\u00e1metros y devolver la m\u00e1xima confiabilidad a tu flota.",
    image: "/banners/banner2.jpg",
    systems: ["PLD", "MR", "MR2", "MCM"],
  },
  {
    title: "M\u00f3dulos de Cabina",
    description:
      "Servicio t\u00e9cnico integral para m\u00f3dulos electr\u00f3nicos de cabina orientado a mantener el control, seguridad y comunicaci\u00f3n del veh\u00edculo en perfecto estado. Reparamos y configuramos sistemas MDM, FR, CPC, CPC-FR y CPC3, garantizando estabilidad el\u00e9ctrica, correcto funcionamiento de sensores y una operaci\u00f3n confiable en carretera y faena.",
    image: "/banners/banner5.jpg",
    systems: ["MDM", "FR", "CPC", "CPC-FR", "CPC3"],
  },
  {
    title: "Tableros Electr\u00f3nicos INS",
    description:
      "Especialistas en reparaci\u00f3n, mantenci\u00f3n y recuperaci\u00f3n de tableros electr\u00f3nicos INS modelos 2010, 2012 y 2014. Restauramos funciones esenciales de visualizaci\u00f3n, alertas y monitoreo del veh\u00edculo, entregando soluciones r\u00e1pidas y precisas para minimizar tiempos de detenci\u00f3n y mantener el control total de la unidad.",
    image: "/banners/banner6.jpg",
    systems: ["INS 2010", "INS 2012", "INS 2014"],
  },
  {
    title: "Itinerarios y Letreros Electr\u00f3nicos",
    description:
      "Implementaci\u00f3n, reparaci\u00f3n y soporte t\u00e9cnico para sistemas de itinerarios y letreros electr\u00f3nicos de transporte. Trabajamos con equipos y componentes de marcas como Mobitec e Iluminator, asegurando alta visibilidad, configuraci\u00f3n correcta de rutas y funcionamiento continuo para buses y veh\u00edculos de transporte pesado.",
    image: "/banners/banner3.jpg",
    systems: ["Mobitec", "Iluminator"],
  },
  {
    title: "Soluciones Electr\u00f3nicas para Veh\u00edculos Pesados",
    description:
      "Desarrollamos soluciones t\u00e9cnicas y electr\u00f3nicas adaptadas a las necesidades del transporte pesado. Desde diagn\u00f3stico avanzado hasta integraci\u00f3n de componentes y optimizaci\u00f3n de sistemas el\u00e9ctricos, ofrecemos soporte especializado para mejorar la seguridad, continuidad operativa y eficiencia de cada veh\u00edculo o flota.",
    image: "/banners/banner1.jpg",
  },
];

export const technicalServiceHighlights = [
  "Diagn\u00f3stico electr\u00f3nico avanzado para sistemas cr\u00edticos de motor y cabina.",
  "Reparaci\u00f3n, configuraci\u00f3n y programaci\u00f3n especializada de m\u00f3dulos.",
  "Recuperaci\u00f3n de tableros INS y soporte para itinerarios y letreros electr\u00f3nicos.",
  "Soluciones orientadas a reducir fallas operativas y mejorar la continuidad de flota.",
];
