import type { Product } from "@/types/product";
export type { Product } from "@/types/product";
export type { Category } from "@/types/product";
export { formatPrice } from "@/lib/format";

export const categories = [
  { id: "iluminacion", name: "Iluminación", color: "#F5A623" },
  { id: "generales", name: "Generales", color: "#4ABFBF" },
  { id: "baterias", name: "Baterías", color: "#7ED321" },
  { id: "kit-especiales", name: "Kit Especiales", color: "#D0021B" },
  { id: "amarras", name: "Amarras", color: "#9B59B6" },
  { id: "herramientas", name: "Herramientas", color: "#3498DB" },
  { id: "extintores", name: "Extintores", color: "#E74C3C" },
  { id: "calefaccion", name: "Calefacción", color: "#2ECC71" },
  { id: "electrico", name: "Eléctrico", color: "#F39C12" },
  { id: "seguridad", name: "Seguridad", color: "#1ABC9C" },
  { id: "adhesivos", name: "Adhesivos y Selladores", color: "#8E44AD" },
  { id: "otros", name: "Otros", color: "#95A5A6" },
];

export const brands = [
  "Braslux",
  "Loctite",
  "Teroson",
  "Wurth",
  "Danval",
  "3-RHO",
  "Moura",
  "Optibelt",
  "Recambio SpA",
];

function detectBrand(name: string): string {
  const n = name.toUpperCase();
  if (n.includes("BRASLUX")) return "Braslux";
  if (n.includes("LOCTITE") || n.includes("TEROSON")) return "Loctite";
  if (n.includes("WURTH")) return "Wurth";
  if (n.includes("DANVAL")) return "Danval";
  if (n.includes("3-RHO")) return "3-RHO";
  if (n.includes("MOURA")) return "Moura";
  if (n.includes("OPTIBELT")) return "Optibelt";
  return "Recambio SpA";
}

function detectCategory(code: string, name: string): string {
  const n = name.toUpperCase();
  if (n.includes("FOCO LED") || n.includes("FARO") || n.includes("LANTERNA") || n.includes("LINTERNA") || n.includes("LUZ") || n.includes("MICA")) return "iluminacion";
  if (n.includes("BATERIA") || n.includes("BATERÍA")) return "baterias";
  if (n.includes("EXTINTOR")) return "extintores";
  if (n.includes("CALEFAC")) return "calefaccion";
  if (n.includes("AMARRA")) return "amarras";
  if (n.includes("KIT")) return "kit-especiales";
  if (n.includes("HERRAMIENTA") || n.includes("BROCA") || n.includes("CARRO TALLER") || n.includes("DISCO DE CORTE")) return "herramientas";
  if (n.includes("SELLADOR") || n.includes("SILICONA") || n.includes("ADHESIVO") || n.includes("TRABADOR") || n.includes("FORMADOR") || n.includes("REMOVEDOR") || n.includes("PEGAMENTO") || n.includes("SELLANTE")) return "adhesivos";
  if (n.includes("SENSOR") || n.includes("SWITCH") || n.includes("RELE") || n.includes("RELAY") || n.includes("FUSIBLE") || n.includes("VALVULA ELECTRO")) return "electrico";
  if (n.includes("GUANTE") || n.includes("SEGURIDAD")) return "seguridad";
  if (n.includes("LUBRICANTE") || n.includes("AFLOJADOR") || n.includes("LIMPIA CONTACTO") || n.includes("GRASA") || n.includes("ANTIADHERENTE") || n.includes("CORREA")) return "otros";
  return "generales";
}

function detectImage(code: string, name: string): string {
  const n = name.toUpperCase();

  // Exact matches (JPGs/WebP/PNG)
  if (n.includes("LOCTITE 242") || n.includes("TRABADOR ROSCA 242")) return "/products/loctite-242.jpg";
  if (n.includes("LOCTITE") && n.includes("243")) return "/products/loctite-243.jpg";
  if (n.includes("495") && n.includes("LOCTITE")) return "/products/loctite-495.jpg";
  if (n.includes("7647") && n.includes("LOCTITE")) return "/products/loctite-7647.jpg";
  if (n.includes("8608") && n.includes("LOCTITE")) return "/products/loctite-8608.jpg";
  if (n.includes("454") && (n.includes("LOCTITE") || n.includes("ADHESIVO"))) return "/products/adhesivo-454.jpg";
  if (n.includes("569") && n.includes("SELLADOR")) return "/products/sellador-roscas-569.jpg";
  if (n.includes("LATERAL") && n.includes("AMBAR") && n.includes("BRASLUX")) return "/products/braslux-lateral-ambar.jpg";
  if (n.includes("LATERAL") && n.includes("ROJO") && n.includes("BRASLUX")) return "/products/braslux-lateral-rojo.jpg";
  if (n.includes("BROCA")) return "/products/broca-wurth.webp";
  if (n.includes("GRASA") && n.includes("WURTH")) return "/products/grasa-wurth.jpg";
  if (n.includes("BATERIA") && n.includes("150")) return "/products/bateria-moura-150.png";
  if (n.includes("BATERIA") && n.includes("220")) return "/products/bateria-moura-220.png";

  // Loctite category-based
  if (n.includes("TEROSON")) return "/products/teroson-sellador.svg";
  if ((n.includes("TRABADOR") || n.includes("THREADLOCKER")) && n.includes("LOCTITE")) return "/products/loctite-bottle.svg";
  if ((n.includes("SILICONA") || n.includes("RTV")) && n.includes("LOCTITE")) return "/products/loctite-silicona.svg";
  if ((n.includes("SPRAY") || n.includes("LUBRICANTE") || n.includes("AFLOJADOR") || n.includes("LIMPIA CONTACTO") || n.includes("CORREA")) && n.includes("LOCTITE")) return "/products/loctite-spray.svg";
  if ((n.includes("SELLADOR") || n.includes("SELLANTE") || n.includes("FORMADOR") || n.includes("REMOVEDOR") || n.includes("ANTIADHERENTE")) && n.includes("LOCTITE")) return "/products/loctite-bottle.svg";
  if (n.includes("LOCTITE") && (n.includes("GRASA") || n.includes("PENETRANTE"))) return "/products/loctite-spray.svg";

  // Foco LED specific sizes and types
  if ((n.includes("FOCO LED") || n.includes("FOCO LED") || n.includes("FOCO LED")) && n.includes("125MM")) {
    if (n.includes("ROJO") || n.includes("FRENO") || n.includes("POSICIÓN") || n.includes("POSICION")) return "/products/foco-led-125mm-rojo.svg";
    if (n.includes("AMBAR") || n.includes("ÁMBAR") || n.includes("DIRECCIONAL") || n.includes("INTERMITENTE")) return "/products/foco-led-125mm-ambar.svg";
    if (n.includes("CRISTAL") || n.includes("RETROCESO") || n.includes("REVERSA") || n.includes("TRANSPARENTE") || n.includes("RESERVA")) return "/products/foco-led-125mm-cristal.svg";
    // 125mm multifunción with rojo+blanco
    if (n.includes("MULTIFUNCIÓN") || n.includes("MULTIFUNCION")) return "/products/foco-led-125mm-rojo.svg";
    return "/products/foco-led-125mm-ambar.svg";
  }
  if ((n.includes("FOCO LED") || n.includes("FOCO LED")) && n.includes("96MM")) return "/products/foco-led-96mm.svg";
  if ((n.includes("FOCO LED") || n.includes("FOCO LED")) && n.includes("75MM")) return "/products/foco-led-75mm.svg";
  if ((n.includes("FOCO") || n.includes("LED")) && n.includes("LATERAL") && n.includes("OVALADO")) return "/products/foco-led-lateral-ovalado.svg";
  if ((n.includes("FOCO") || n.includes("LED")) && n.includes("LATERAL") && n.includes("RECTANGULAR")) return "/products/braslux-lateral-ambar.jpg";
  if ((n.includes("FOCO") || n.includes("LED")) && (n.includes("PATENTE") || n.includes("PLACA"))) return "/products/foco-led-patente.svg";
  if ((n.includes("FOCO") || n.includes("LED")) && (n.includes("CORTESÍA") || n.includes("CORTESIA") || n.includes("CABINA") || n.includes("CONDUCTOR"))) return "/products/foco-led-cortesia.svg";
  if ((n.includes("FOCO") || n.includes("LED")) && n.includes("TRASERO") && n.includes("OVALADO")) return "/products/foco-led-lateral-ovalado.svg";
  if ((n.includes("FOCO") || n.includes("LED")) && n.includes("PARADA")) return "/products/foco-led-125mm-rojo.svg";
  if ((n.includes("FOCO") || n.includes("LED")) && n.includes("REFLECTOR") && n.includes("CUADRADO")) return "/products/foco-led-96mm.svg";
  if ((n.includes("FOCO") || n.includes("LED")) && n.includes("FRENO") && n.includes("TERCERA")) return "/products/foco-led-125mm-rojo.svg";
  // Foco LED with 122mm (similar to 125mm)
  if ((n.includes("FOCO") || n.includes("LED")) && n.includes("122MM")) {
    if (n.includes("ROJO") || n.includes("FRENO") || n.includes("POSICIÓN") || n.includes("POSICION")) return "/products/foco-led-125mm-rojo.svg";
    if (n.includes("REVERSA") || n.includes("RETROCESO")) return "/products/foco-led-125mm-cristal.svg";
    return "/products/foco-led-125mm-ambar.svg";
  }
  // Foco lateral with reflector (not ovalado/rectangular)
  if ((n.includes("FOCO") || n.includes("LED")) && n.includes("LATERAL") && n.includes("REFLECTAN")) return "/products/foco-led-lateral-ovalado.svg";
  // Any remaining Foco/Faro LED
  if (n.includes("FOCO LED") || n.includes("FOCO LED") || n.includes("FARO LED") || (n.includes("FOCO") && n.includes("LED"))) return "/products/foco-led-125mm-ambar.svg";

  // Mica / Reflector (not LED)
  if (n.includes("MICA") || (n.includes("REFLECTOR") && !n.includes("LED"))) return "/products/foco-led-lateral-ovalado.svg";
  // Linterna / Lanterna
  if (n.includes("LINTERNA") || n.includes("LANTERNA")) return "/products/foco-led-125mm-rojo.svg";

  // Electrical / Sensors
  if (n.includes("CONECTOR SELLADO") || n.includes("CONECTOR") && n.includes("SELLADO")) return "/products/conector-sellado.svg";
  if (n.includes("SOQUETE")) return "/products/soquete-universal.svg";
  if (n.includes("RELÉ") || n.includes("RELE") || n.includes("RELAY")) return "/products/rele-temporizador.svg";
  if (n.includes("CAMPANILLA") || n.includes("ALARMA") || n.includes("TIMBRE") || n.includes("BUZZER") || n.includes("BITONAL")) return "/products/campanilla-alarma.svg";
  if (n.includes("SENSOR") && (n.includes("PRESIÓN") || n.includes("PRESION")) && n.includes("ACEITE")) return "/products/sensor-presion.svg";
  if (n.includes("SWITCH") && (n.includes("PUERTA") || n.includes("AIRE"))) return "/products/switch-puerta.svg";
  if (n.includes("SENSOR") && (n.includes("SUSPENSIÓN") || n.includes("SUSPENSION") || n.includes("NIVELACIÓN") || n.includes("NIVELACION"))) return "/products/sensor-presion.svg";
  if (n.includes("VÁLVULA") || n.includes("VALVULA") && (n.includes("ABS") || n.includes("ELECTROMAGN"))) return "/products/valvula-abs.svg";
  if (n.includes("MOTOR") && (n.includes("TURBINA") || n.includes("DEFROSTER"))) return "/products/motor-defroster.svg";
  if (n.includes("FUSIBLE")) return "/products/fusible.svg";
  if (n.includes("TAPA") && n.includes("DEPÓSITO") || n.includes("TAPA") && n.includes("DEPOSITO") || n.includes("TAPA CON LLAVE")) return "/products/tapa-deposito.svg";
  if (n.includes("DEPÓSITO") && (n.includes("REFRIGERANTE") || n.includes("RESERVA")) || n.includes("DEPOSITO") && (n.includes("REFRIGERANTE") || n.includes("RESERVA"))) return "/products/deposito-refrigerante.svg";
  if (n.includes("FILTRO") && (n.includes("ACEITE") || n.includes("HIDRÁULICO") || n.includes("HIDRAULICO") || n.includes("AIRE"))) return "/products/filtro-hidraulico.svg";
  if (n.includes("SENSOR") && (n.includes("TEMPERATURA") || n.includes("NIVEL") && n.includes("REFRIGERANTE"))) return "/products/sensor-temperatura.svg";
  if (n.includes("MANGUERA")) return "/products/manguera-aire.svg";
  if (n.includes("BOMBA") && n.includes("LAVAPARABRISAS")) return "/products/bomba-lavaparabrisas.svg";
  if (n.includes("ABRAZADERA")) return "/products/abrazadera-metalica.svg";
  if (n.includes("BOCINA")) return "/products/bocina-24v.svg";
  if (n.includes("INDICADOR") && n.includes("COMBUSTIBLE")) return "/products/indicador-combustible.svg";
  if (n.includes("KIT") && (n.includes("PALANCA") || n.includes("HERRAMIENTA"))) return "/products/kit-herramientas.svg";
  if (n.includes("CARRO") && n.includes("TALLER")) return "/products/kit-herramientas.svg";
  if (n.includes("DISCO") && n.includes("CORTE")) return "/products/disco-corte.svg";
  if (n.includes("GUANTE") && n.includes("NITRILO")) return "/products/guantes-nitrilo.svg";
  if (n.includes("GUANTE") && n.includes("CABRITILLA")) return "/products/guantes-cabritilla.svg";
  if ((n.includes("JABÓN") || n.includes("JABON") || n.includes("LIMPIADOR")) && n.includes("WURTH")) return "/products/jabon-industrial.svg";
  if (n.includes("CORREA") && n.includes("OPTIBELT")) return "/products/correa-optibelt.svg";
  if (n.includes("REMACHE")) return "/products/remache-pop.svg";
  if (n.includes("POLEA") && n.includes("TENSORA")) return "/products/polea-tensora.svg";
  if (n.includes("DISPLAY") && (n.includes("RELOJ") || n.includes("TEMPERATURA"))) return "/products/display-reloj.svg";
  if (n.includes("TIRADOR") && n.includes("VENTANA")) return "/products/tirador-ventana.svg";
  if (n.includes("GARRA") && n.includes("ASIENTO")) return "/products/tirador-ventana.svg";
  if (n.includes("BASE") && (n.includes("TUBO") || n.includes("PASAMANO") || n.includes("PILAR"))) return "/products/tirador-ventana.svg";
  if (n.includes("TOPE") && n.includes("PARACHOQUE")) return "/products/tapa-deposito.svg";
  if (n.includes("VARILLA") && n.includes("NIVEL")) return "/products/sensor-presion.svg";
  if (n.includes("CUERPO") && n.includes("PULSADOR") || n.includes("TECLA")) return "/products/switch-puerta.svg";
  if (n.includes("INTERRUPTOR")) return "/products/switch-puerta.svg";
  if (n.includes("SENSOR") && (n.includes("ACEITE") || n.includes("CARTER"))) return "/products/sensor-presion.svg";
  if (n.includes("SENSOR") && n.includes("CORTE") && n.includes("CORREA")) return "/products/sensor-presion.svg";
  if (n.includes("GUARDAPOLVO")) return "/products/tapa-deposito.svg";
  if (n.includes("MOPA")) return "/products/jabon-industrial.svg";
  // Sensor pressure/temperature (general catch-all for remaining sensors)
  if (n.includes("SENSOR") && (n.includes("PRESIÓN") || n.includes("PRESION"))) return "/products/sensor-presion.svg";
  if (n.includes("SENSOR")) return "/products/sensor-presion.svg";
  // Difusor de aire (ventilation) → use a generic part
  if (n.includes("DIFUSOR") && n.includes("AIRE")) return "/products/deposito-refrigerante.svg";
  // Depósito aceite hidráulico
  if (n.includes("DEPÓSITO") || n.includes("DEPOSITO")) return "/products/deposito-refrigerante.svg";
  // Tapa (general remaining)
  if (n.includes("TAPA")) return "/products/tapa-deposito.svg";
  // Guía puerta
  if (n.includes("GUÍA") || n.includes("GUIA")) return "/products/tirador-ventana.svg";
  // Válvula (remaining)
  if (n.includes("VÁLVULA") || n.includes("VALVULA")) return "/products/valvula-abs.svg";

  return "/products/placeholder.svg";
}

function detectImageArray(code: string, name: string): string[] {
  const main = detectImage(code, name);
  const n = name.toUpperCase();

  // Loctite products
  if (n.includes("LOCTITE") || n.includes("TEROSON")) {
    const alts = ["/products/loctite-bottle.svg", "/products/loctite-silicona.svg", "/products/loctite-spray.svg"];
    const filtered = alts.filter(a => a !== main);
    return [main, filtered[0], filtered[1]];
  }

  // LED / Iluminación products
  if (n.includes("FOCO") || n.includes("LED") || n.includes("MICA") || n.includes("LINTERNA") || n.includes("LANTERNA") || n.includes("REFLECTOR")) {
    const alts = ["/products/foco-led-125mm-ambar.svg", "/products/foco-led-125mm-rojo.svg", "/products/foco-led-125mm-cristal.svg", "/products/foco-led-96mm.svg", "/products/foco-led-lateral-ovalado.svg"];
    const filtered = alts.filter(a => a !== main);
    return [main, filtered[0], filtered[1], filtered[2]];
  }

  // Connectors
  if (n.includes("CONECTOR")) return [main, "/products/soquete-universal.svg", "/products/foco-led-lateral-ovalado.svg"];
  if (n.includes("SOQUETE")) return [main, "/products/conector-sellado.svg", "/products/foco-led-lateral-ovalado.svg"];

  // Electrical
  if (n.includes("RELÉ") || n.includes("RELE") || n.includes("RELAY") || n.includes("CAMPANILLA") || n.includes("TIMBRE") || n.includes("BUZZER") || n.includes("ALARMA") || n.includes("BITONAL")) {
    return [main, "/products/rele-temporizador.svg", "/products/campanilla-alarma.svg"];
  }

  // Sensors
  if (n.includes("SENSOR") || n.includes("SWITCH")) {
    return [main, "/products/sensor-presion.svg", "/products/sensor-temperatura.svg"];
  }

  // Herramientas
  if (n.includes("BROCA") || n.includes("KIT") || n.includes("CARRO TALLER") || n.includes("DISCO")) {
    return [main, "/products/kit-herramientas.svg", "/products/disco-corte.svg"];
  }

  // Guantes / Seguridad
  if (n.includes("GUANTE")) return [main, "/products/guantes-nitrilo.svg", "/products/guantes-cabritilla.svg"];

  // Correa
  if (n.includes("CORREA")) return [main, "/products/polea-tensora.svg", "/products/correa-optibelt.svg"];

  // General mechanical parts
  if (n.includes("FILTRO") || n.includes("DEPOSITO") || n.includes("DEPÓSITO") || n.includes("MANGUERA") || n.includes("ABRAZADERA") || n.includes("BOMBA") || n.includes("TAPA")) {
    return [main, "/products/filtro-hidraulico.svg", "/products/deposito-refrigerante.svg"];
  }

  // Tirador / Garra / Base
  if (n.includes("TIRADOR") || n.includes("GARRA") || n.includes("BASE") || n.includes("GUÍA") || n.includes("GUIA")) {
    return [main, "/products/tirador-ventana.svg", "/products/tapa-deposito.svg"];
  }

  // Default fallback
  return [main, main, main];
}

// Products from Excel (PRODUCTOS CON STOCK + ROTATIVOS) with prices
const excelProducts: Product[] = [
  {
    code: "99-05-02-015-114",
    name: "Relé Temporizador 24V 5 Pines Danval",
    category: "electrico",
    brand: "Danval",
    price: 8900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Relé temporizador de 24V con 5 pines de conexión, diseñado para sistemas eléctricos de buses y vehículos pesados. Fabricado por Danval con alta confiabilidad y durabilidad en condiciones exigentes de operación.",
    specs: { "Voltaje": "24V DC", "Pines": "5", "Marca": "Danval", "Tipo": "Temporizador", "Montaje": "Riel DIN / Panel", "Protección": "IP40" },
    inStock: true,
  },
  {
    code: "99-03-19-015-175",
    name: "Campanilla Alarma Sonora Bitonal Danval",
    category: "electrico",
    brand: "Danval",
    price: 11490,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Campanilla de alarma sonora bitonal para sistemas de transporte público. Emite dos tonos distintivos para señalización de parada y emergencia. Instalación directa en el sistema eléctrico del vehículo.",
    specs: { "Voltaje": "24V DC", "Tipo sonido": "Bitonal", "Nivel sonoro": "85 dB", "Marca": "Danval", "Montaje": "Superficie", "Material carcasa": "ABS" },
    inStock: true,
  },
  {
    code: "99-01-02-015-93",
    name: "Timbre Pulsador Inalámbrico Danval",
    category: "electrico",
    brand: "Danval",
    price: 13600,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Timbre pulsador inalámbrico de alta frecuencia para solicitud de parada en buses urbanos. No requiere cableado, facilitando la instalación y mantenimiento. Alcance efectivo en todo el interior del vehículo.",
    specs: { "Voltaje": "24V DC", "Tipo": "Inalámbrico", "Frecuencia": "433 MHz", "Alcance": "30m", "Marca": "Danval", "Material botón": "Policarbonato" },
    inStock: true,
  },
  {
    code: "04-06-11-006-133",
    name: "Sensor Presión Aceite 7722 3-RHO",
    category: "electrico",
    brand: "3-RHO",
    price: 52900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor de presión de aceite de alta precisión para motores diesel de vehículos pesados. Señal analógica confiable con conexión directa al tablero de instrumentos. Compatible con motores Mercedes-Benz serie 900.",
    specs: { "Voltaje": "24V", "Rango presión": "0-10 Bar", "Conexión": "Rosca M14x1.5", "Material": "Acero inoxidable", "Compatibilidad": "Mercedes-Benz OM-906/OM-926", "Referencia": "7722", "Señal": "Analógica resistiva" },
    inStock: true,
  },
  {
    code: "04-02-12-006-149",
    name: "Switch Aire Puerta Pata Plana 5589 3-RHO",
    category: "electrico",
    brand: "3-RHO",
    price: 5576,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Switch de aire para puerta con pata plana, ideal para sistemas neumáticos de apertura de puertas en buses. Activación confiable y respuesta rápida. Referencia 3-RHO 5589.",
    specs: { "Tipo": "Switch neumático", "Conexión": "Pata plana", "Presión trabajo": "0-8 Bar", "Referencia": "5589", "Marca": "3-RHO", "Material": "Latón niquelado" },
    inStock: true,
  },
  {
    code: "51-31-51-023-711",
    name: "Sensor Suspensión Nivelación E-3 906",
    category: "electrico",
    brand: "Recambio SpA",
    price: 41272,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor de nivelación para suspensión neumática electrónica E-3, compatible con chasis Mercedes-Benz 906. Permite el control automático de altura del vehículo para mantener la estabilidad y confort de marcha.",
    specs: { "Voltaje": "24V", "Tipo": "Sensor inductivo", "Compatibilidad": "Mercedes-Benz Chasis 906", "Sistema": "Suspensión neumática E-3", "Conector": "3 pines", "Material": "Aluminio / Plástico técnico" },
    inStock: true,
  },
  {
    code: "04-07-12-999-192",
    name: "Válvula Electromagnética ABS MB926",
    category: "electrico",
    brand: "Recambio SpA",
    price: 68000,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Válvula electromagnética para sistema de frenos ABS, diseñada para Mercedes-Benz con motor OM-926. Control preciso de presión hidráulica en el circuito de frenado para máxima seguridad.",
    specs: { "Voltaje": "24V DC", "Tipo": "Electromagnética ABS", "Compatibilidad": "Mercedes-Benz OM-926", "Presión máx.": "150 Bar", "Conector": "2 pines", "Material": "Acero / Aluminio" },
    inStock: true,
  },
  {
    code: "99-03-09-999-107",
    name: "Motor Turbina Defroster",
    category: "generales",
    brand: "Recambio SpA",
    price: 38600,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Motor de turbina para sistema defroster de parabrisas en buses y vehículos pesados. Alto caudal de aire para desempañado rápido y efectivo. Funcionamiento silencioso con rodamientos sellados de larga duración.",
    specs: { "Voltaje": "24V DC", "Tipo": "Motor centrífugo", "Caudal": "Alto rendimiento", "Aplicación": "Defroster parabrisas", "Rodamientos": "Sellados", "Material": "Plástico técnico / Metal" },
    inStock: true,
  },
  {
    code: "04-01-00-004-662",
    name: "Tapa Depósito Hidráulico",
    category: "generales",
    brand: "Recambio SpA",
    price: 2490,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tapa para depósito de aceite hidráulico de dirección asistida. Sellado hermético que previene contaminación del fluido. Compatible con depósitos estándar Mercedes-Benz serie LO y OF.",
    specs: { "Material": "Polipropileno", "Compatibilidad": "Mercedes-Benz LO-916/OF-1721", "Tipo montaje": "Rosca estándar", "Color": "Negro", "Sello": "Incluido" },
    inStock: true,
  },
  {
    code: "99-01-10-004-156",
    name: "Tapa Depósito Refrigerante Reserplastic",
    category: "generales",
    brand: "Recambio SpA",
    price: 3200,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tapa de depósito de refrigerante marca Reserplastic con válvula de presión integrada. Mantiene la presión correcta del sistema de enfriamiento para un funcionamiento óptimo del motor.",
    specs: { "Material": "Polipropileno reforzado", "Presión apertura": "1.0 Bar", "Válvula": "Presión integrada", "Compatibilidad": "Mercedes-Benz LO/OF", "Color": "Negro" },
    inStock: true,
  },
  {
    code: "00-05-51-018-843",
    name: "Kit Palancas Plástica Desarme 11 Pza Wurth",
    category: "herramientas",
    brand: "Wurth",
    price: 13990,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Set profesional de 11 palancas plásticas para desarme de paneles, tapizados y molduras sin dañar superficies. Fabricadas en nylon reforzado de alta resistencia. Indispensable para trabajos de carrocería interior.",
    specs: { "Cantidad": "11 piezas", "Material": "Nylon reforzado", "Marca": "Wurth", "Aplicación": "Desarme paneles y molduras", "Color": "Naranja", "Estuche": "Incluido" },
    inStock: true,
  },
  {
    code: "00-05-51-056-457",
    name: "Trabador Rosca 272 50ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 26900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Trabador de roscas de alta resistencia Loctite 272, formulado para aplicaciones que requieren máxima fijación en temperaturas elevadas. Ideal para pernos y tuercas expuestos a vibración severa y calor extremo.",
    specs: { "Contenido": "50ml", "Color": "Rojo", "Resistencia temp.": "-55°C a 230°C", "Tiempo curado": "24 horas", "Tipo": "Anaeróbico alta resistencia", "Aplicación": "Roscas metálicas alta temperatura", "Viscosidad": "Medio-alto" },
    inStock: true,
  },
  {
    code: "00-05-51-056-458",
    name: "Trabador Rosca 242 50ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 24900,
    images: ["/products/loctite-242.jpg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Trabador de roscas de resistencia media Loctite 242, permite desmontaje con herramientas manuales estándar. Previene aflojamiento por vibración en pernos, tornillos y tuercas de uso general.",
    specs: { "Contenido": "50ml", "Color": "Azul", "Resistencia temp.": "-55°C a 150°C", "Tiempo curado": "24 horas", "Tipo": "Anaeróbico media resistencia", "Aplicación": "Roscas metálicas M6-M20", "Viscosidad": "Medio" },
    inStock: true,
  },
  {
    code: "00-05-51-056-459",
    name: "Formador Juntas 515 Piezas Mecánicas 50ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 21200,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Formador de juntas anaeróbico Loctite 515 para sellado de superficies mecanizadas. Rellena irregularidades y forma una junta flexible y resistente a fluidos. Ideal para tapas de carter, carcasas y bridas.",
    specs: { "Contenido": "50ml", "Color": "Púrpura", "Resistencia temp.": "-55°C a 150°C", "Tiempo curado": "24 horas", "Tipo": "Anaeróbico formador de juntas", "Aplicación": "Bridas y superficies mecanizadas", "Holgura máx.": "0.25mm" },
    inStock: true,
  },
  {
    code: "00-05-51-056-461",
    name: "Removedor Empaquetadura SF790 Shisel 510grs Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 24900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Removedor de empaquetaduras en aerosol Loctite SF790 Chisel, disuelve residuos de juntas, silicona y adhesivos curados. Fórmula de acción rápida que no daña superficies metálicas ni aluminio.",
    specs: { "Contenido": "510g (aerosol)", "Tipo": "Removedor químico", "Aplicación": "Empaquetaduras y juntas curadas", "Acción": "Rápida 10-15 min", "Superficie": "Metales, aluminio", "Inflamable": "Sí" },
    inStock: true,
  },
  {
    code: "00-05-51-056-462",
    name: "Sellador Roscas 569 50ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 22900,
    images: ["/products/sellador-roscas-569.jpg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sellador de roscas hidráulicas Loctite 569 para conexiones de tubería que transportan fluidos a presión. Sella roscas cónicas y cilíndricas con curado rápido, reemplazando cinta teflón de manera permanente.",
    specs: { "Contenido": "50ml", "Color": "Blanco", "Resistencia temp.": "-55°C a 150°C", "Tiempo curado": "24 horas", "Tipo": "Anaeróbico sellador", "Aplicación": "Roscas hidráulicas y neumáticas", "Presión máx.": "69 MPa" },
    inStock: true,
  },
  {
    code: "00-05-51-056-463",
    name: "Silicona Cobre 5920 70ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 6890,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Silicona de cobre Loctite 5920 para formación de juntas en caliente, resistente a temperaturas extremas de motores. Excelente flexibilidad y adherencia en superficies metálicas sometidas a expansión térmica.",
    specs: { "Contenido": "70ml", "Color": "Cobre", "Resistencia temp.": "-55°C a 315°C", "Tiempo curado": "24 horas", "Tipo": "Silicona RTV", "Aplicación": "Juntas de motor alta temperatura", "Holgura máx.": "6mm" },
    inStock: true,
  },
  {
    code: "00-05-51-056-464",
    name: "Silicona Negra 598 70ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 4690,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Silicona negra multiuso Loctite 598 para formación de juntas en motores y transmisiones. Resistente a aceites, combustibles y líquidos de refrigeración. Cura a temperatura ambiente formando una junta elástica.",
    specs: { "Contenido": "70ml", "Color": "Negro", "Resistencia temp.": "-55°C a 260°C", "Tiempo curado": "24 horas", "Tipo": "Silicona RTV", "Aplicación": "Juntas generales motor y transmisión", "Holgura máx.": "6mm" },
    inStock: true,
  },
  {
    code: "00-05-51-056-465",
    name: "Silicona Gris 5699 RTV 70ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 4690,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Silicona gris Loctite 5699 de alto rendimiento para juntas flexibles en motores y cajas de cambio. Formulación libre de ácido que no corroe sensores ni componentes electrónicos cercanos.",
    specs: { "Contenido": "70ml", "Color": "Gris", "Resistencia temp.": "-55°C a 260°C", "Tiempo curado": "24 horas", "Tipo": "Silicona RTV libre de ácido", "Aplicación": "Juntas con componentes electrónicos", "Holgura máx.": "6mm" },
    inStock: true,
  },
  {
    code: "00-05-51-056-466",
    name: "Adhesivo Instantáneo 495 20grs Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 10090,
    images: ["/products/loctite-495.jpg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Adhesivo instantáneo de uso general Loctite 495, ideal para uniones rápidas de metal, plástico y caucho. Secado en segundos con excelente resistencia al corte y tracción en superficies lisas.",
    specs: { "Contenido": "20g", "Color": "Transparente", "Resistencia temp.": "-55°C a 80°C", "Tiempo fijación": "5-20 segundos", "Tipo": "Cianoacrilato", "Aplicación": "Metal, plástico, caucho", "Viscosidad": "Baja" },
    inStock: true,
  },
  {
    code: "00-05-51-056-467",
    name: "Sellador Carrocería 9360 290ml Teroson Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 7490,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sellador de carrocería Teroson 9360 para juntas de carrocería, soldaduras y costuras en vehículos. Alta adherencia sobre metal pintado o con imprimación. Puede ser pintado una vez curado.",
    specs: { "Contenido": "290ml (cartucho)", "Color": "Gris", "Resistencia temp.": "-40°C a 90°C", "Tiempo curado": "48 horas", "Tipo": "Poliuretano", "Aplicación": "Sellado juntas carrocería", "Pintable": "Sí" },
    inStock: true,
  },
  {
    code: "00-05-51-056-469",
    name: "Antiadherente Base Cobre 8008 1lb Loctite",
    category: "otros",
    brand: "Loctite",
    price: 26200,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Compuesto antiadherente a base de cobre Loctite 8008, previene agarrotamiento y corrosión en roscas, pernos y uniones metálicas expuestas a altas temperaturas. Facilita el desmontaje futuro de componentes.",
    specs: { "Contenido": "1 libra (454g)", "Color": "Cobre", "Resistencia temp.": "-30°C a 980°C", "Tipo": "Pasta antiadherente", "Base": "Cobre", "Aplicación": "Roscas, pernos, tuercas", "Formato": "Tarro" },
    inStock: true,
  },
  {
    code: "00-05-51-056-470",
    name: "Grasa Dieléctica 8423 Lubricante/Penetrante 80ml Loctite",
    category: "otros",
    brand: "Loctite",
    price: 9490,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Grasa dieléctrica Loctite 8423 diseñada para proteger conectores eléctricos contra humedad y corrosión. Mejora la conductividad y previene falsos contactos en sistemas eléctricos automotrices.",
    specs: { "Contenido": "80ml", "Color": "Translúcido", "Resistencia temp.": "-40°C a 200°C", "Tipo": "Grasa dieléctrica silicónica", "Aplicación": "Conectores y bornes eléctricos", "Propiedad": "Aislante eléctrico" },
    inStock: true,
  },
  {
    code: "00-05-51-056-471",
    name: "Lubricante Multiuso 8608 Super Lub 300ml Loctite",
    category: "otros",
    brand: "Loctite",
    price: 3490,
    images: ["/products/loctite-8608.jpg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Lubricante multiuso en aerosol Loctite 8608 Super Lub para mecanismos, bisagras, cables y componentes móviles. Desplaza humedad, lubrica y protege contra la corrosión con una película duradera.",
    specs: { "Contenido": "300ml (aerosol)", "Tipo": "Lubricante multiuso", "Aplicación": "Bisagras, cables, mecanismos", "Propiedades": "Desplaza humedad, anticorrosivo", "Temperatura uso": "-20°C a 150°C", "Propelente": "Sin CFC" },
    inStock: true,
  },
  {
    code: "00-05-51-056-472",
    name: "Aflojador Alto Rendimiento Solvo Rust 8713 Super Penetrante 347grs Loctite",
    category: "otros",
    brand: "Loctite",
    price: 9150,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Penetrante de alto rendimiento Loctite 8713 Solvo Rust para aflojar tuercas, pernos y uniones oxidadas. Acción capilar rápida que penetra en roscas corroídas facilitando el desmontaje sin dañar componentes.",
    specs: { "Contenido": "347g (aerosol)", "Tipo": "Penetrante aflojador", "Acción": "Capilar rápida", "Aplicación": "Roscas y uniones oxidadas", "Temperatura uso": "-20°C a 60°C", "Propelente": "Sin CFC" },
    inStock: true,
  },
  {
    code: "00-05-51-056-473",
    name: "Lubricante Correa 5408 340grs Loctite",
    category: "otros",
    brand: "Loctite",
    price: 14690,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Lubricante especial para correas Loctite 5408, elimina chirridos y prolonga la vida útil de correas de transmisión. Mejora la flexibilidad del caucho sin degradar el material de la correa.",
    specs: { "Contenido": "340g (aerosol)", "Tipo": "Lubricante para correas", "Aplicación": "Correas V, poly-V, dentadas", "Efecto": "Elimina chirridos, acondiciona", "Material compatible": "Caucho EPDM, neopreno", "Temperatura uso": "-20°C a 120°C" },
    inStock: true,
  },
  {
    code: "00-05-51-056-475",
    name: "Limpia Contacto 7647 Inflamable 220ml Loctite",
    category: "otros",
    brand: "Loctite",
    price: 5090,
    images: ["/products/loctite-7647.jpg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Limpiador de contactos eléctricos Loctite 7647, remueve grasa, polvo y óxido de conexiones electrónicas. Evaporación rápida sin dejar residuos, restaurando la conductividad de contactos y conectores.",
    specs: { "Contenido": "220ml (aerosol)", "Tipo": "Limpiador de contactos", "Evaporación": "Rápida sin residuos", "Aplicación": "Conectores, relés, sensores", "Inflamable": "Sí", "Dieléctrico": "Sí" },
    inStock: true,
  },
  {
    code: "00-05-51-056-481",
    name: "Trabador Rosca 277 50ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 24900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Trabador de roscas permanente Loctite 277, formulado para pernos de gran diámetro y roscas gruesas. Máxima resistencia al aflojamiento en uniones sometidas a cargas pesadas y vibraciones constantes.",
    specs: { "Contenido": "50ml", "Color": "Rojo", "Resistencia temp.": "-55°C a 150°C", "Tiempo curado": "24 horas", "Tipo": "Anaeróbico alta resistencia", "Aplicación": "Roscas M25 a M80", "Viscosidad": "Alto (tixotrópico)" },
    inStock: true,
  },
  {
    code: "00-05-51-056-482",
    name: "Trabador Perno 243 50ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 24900,
    images: ["/products/loctite-243.jpg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Trabador de pernos de resistencia media Loctite 243, versión mejorada del 242 con mayor tolerancia a superficies contaminadas con aceite. Ideal para mantenimiento donde la limpieza perfecta no es posible.",
    specs: { "Contenido": "50ml", "Color": "Azul", "Resistencia temp.": "-55°C a 180°C", "Tiempo curado": "24 horas", "Tipo": "Anaeróbico media resistencia", "Aplicación": "Roscas M6-M20 (tolera aceite)", "Viscosidad": "Medio" },
    inStock: true,
  },
  {
    code: "00-05-51-056-483",
    name: "Sellante Uniones Multipropósito con Teflón 592 50ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 21200,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sellante de uniones multipropósito Loctite 592 con PTFE (teflón) integrado para roscas de sistemas hidráulicos y neumáticos. Sellado instantáneo a baja presión con curado completo en 24 horas.",
    specs: { "Contenido": "50ml", "Color": "Blanco", "Resistencia temp.": "-55°C a 150°C", "Tiempo curado": "24 horas", "Tipo": "Anaeróbico con PTFE", "Aplicación": "Roscas hidráulicas y neumáticas", "Presión máx.": "69 MPa" },
    inStock: true,
  },
  {
    code: "00-05-51-056-710",
    name: "Adhesivo Pegamento 454 Gel 20g Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 18000,
    images: ["/products/adhesivo-454.jpg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Adhesivo instantáneo en gel Loctite 454 para superficies verticales y porosas sin goteo. Excelente para uniones donde se requiere control de aplicación preciso sobre caucho, metal y plásticos.",
    specs: { "Contenido": "20g", "Color": "Transparente", "Resistencia temp.": "-55°C a 80°C", "Tiempo fijación": "10-30 segundos", "Tipo": "Cianoacrilato gel", "Aplicación": "Metal, plástico, caucho, porosos", "Viscosidad": "Alta (gel, no gotea)" },
    inStock: true,
  },
  {
    code: "04-01-02-014-518",
    name: "Foco LED Claridad 12/24V Ambar",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: 5390,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED de posición lateral color ámbar con funcionamiento en 12 y 24 voltios. Excelente visibilidad para señalización en vehículos de transporte. Bajo consumo energético y larga vida útil.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Ámbar", "Tipo": "LED", "Consumo": "0.5W", "Vida útil": "50.000 horas", "Protección": "IP67", "Aplicación": "Posición lateral" },
    inStock: true,
  },
  {
    code: "04-01-02-014-585",
    name: "Foco LED Crystal Retroceso Patente Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 6000,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED Crystal para luz de retroceso y patente Braslux. Lente cristalino de alta transparencia con LED de última generación. Diseñado para buses y camiones con conector sellado.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Blanco", "Tipo": "LED Crystal", "Consumo": "1W", "Vida útil": "50.000 horas", "Protección": "IP67", "Marca": "Braslux" },
    inStock: true,
  },
  {
    code: "04-01-02-014-69",
    name: "Foco LED Intermitente Delantero 70mm 12/24V Ambar Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 4212,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED intermitente delantero de 70mm de diámetro color ámbar Braslux. Compatible con sistemas eléctricos 12/24V para buses urbanos e interurbanos. Encendido instantáneo sin tiempo de calentamiento.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "70mm", "Color luz": "Ámbar", "Tipo": "LED intermitente", "Consumo": "0.5W", "Vida útil": "50.000 horas", "Protección": "IP67", "Homologación": "ECE R6" },
    inStock: true,
  },
  {
    code: "04-01-02-014-70",
    name: "Foco LED 85mm Cabina Conductor 12/24V Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 9778,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED de 85mm para iluminación interior de cabina de conductor Braslux. Luz blanca neutra que no genera fatiga visual. Ideal para lectura de instrumentos y documentos en conducción nocturna.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "85mm", "Color luz": "Blanco neutro", "Tipo": "LED interior", "Consumo": "1.5W", "Vida útil": "50.000 horas", "Protección": "IP44", "Ángulo apertura": "120°" },
    inStock: true,
  },
  {
    code: "04-01-02-014-71",
    name: "Foco LED Lateral Reflector Ovalado Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 12690,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral con reflector ovalado Braslux para señalización lateral en buses y camiones. Diseño aerodinámico con lente de policarbonato resistente a impactos y rayos UV.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Ovalado", "Color luz": "Ámbar", "Tipo": "LED con reflector", "Consumo": "0.5W", "Vida útil": "50.000 horas", "Protección": "IP67", "Material lente": "Policarbonato UV" },
    inStock: true,
  },
  {
    code: "04-01-02-014-743",
    name: "Mica Roja Reflectante 84mm Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 2390,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Mica reflectante roja de 84mm Braslux para señalización trasera obligatoria. Cumple normativa de reflectancia para vehículos de transporte. Fijación adhesiva y mecánica.",
    specs: { "Diámetro": "84mm", "Color": "Rojo", "Tipo": "Reflector catadióptrico", "Fijación": "Adhesivo + tornillo", "Material": "PMMA", "Homologación": "ECE R3", "Marca": "Braslux" },
    inStock: true,
  },
  {
    code: "04-01-06-014-1105",
    name: "Foco LED Posición/Freno 125mm Luz Roja Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 15900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 125mm con doble función posición y freno, luz roja Braslux. Diferencia de intensidad luminosa entre posición y frenado para máxima seguridad. Conector sellado de 3 vías incluido.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Rojo", "Tipo": "LED posición/freno", "Consumo": "2W/4W", "Vida útil": "50.000 horas", "Protección": "IP67", "Conector": "Sellado 3 vías" },
    inStock: true,
  },
  {
    code: "04-01-06-014-79",
    name: "Foco LED Trasero 96mm 24V Intermitente Ambar Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 11990,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 96mm para función intermitente/direccional color ámbar Braslux. Frecuencia de parpadeo conforme a normativa. Diseño compacto para configuraciones traseras modulares.",
    specs: { "Voltaje": "24V DC", "Diámetro": "96mm", "Color luz": "Ámbar", "Tipo": "LED intermitente", "Consumo": "1.5W", "Vida útil": "50.000 horas", "Protección": "IP67", "Homologación": "ECE R6" },
    inStock: true,
  },
  {
    code: "04-01-06-014-80",
    name: "Foco LED Trasero Ovalado 12/24V Rojo Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 5900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero ovalado en color rojo Braslux, compatible con sistemas 12 y 24 voltios. Perfil bajo para montaje en espacios reducidos. Sellado contra agua y polvo para uso exterior.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Ovalado", "Color luz": "Rojo", "Tipo": "LED trasero", "Consumo": "0.5W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "04-11-10-107-1047",
    name: "Polea Tensora Soporte REJ",
    category: "generales",
    brand: "Recambio SpA",
    price: 52400,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Polea tensora con soporte tipo REJ para sistemas de transmisión por correa en motores Mercedes-Benz. Rodamiento sellado de alta carga con tensor automático integrado para mantener la tensión óptima.",
    specs: { "Tipo": "Polea tensora con soporte", "Rodamiento": "Sellado doble", "Compatibilidad": "Mercedes-Benz OM-906/OM-926", "Material": "Acero y polímero técnico", "Referencia": "REJ", "Aplicación": "Correa accesorios motor" },
    inStock: true,
  },
  {
    code: "80-32-53-018-754",
    name: "Carro Taller con Herramientas Wurth",
    category: "herramientas",
    brand: "Wurth",
    price: 890000,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Carro de taller profesional Wurth equipado con herramientas de calidad industrial. Estructura robusta de acero con cajones con guías de rodamiento y cierre centralizado. Incluye surtido completo de herramientas manuales.",
    specs: { "Marca": "Wurth", "Tipo": "Carro taller equipado", "Material": "Acero laminado", "Cajones": "7 cajones con guías", "Cierre": "Centralizado con llave", "Ruedas": "4 (2 con freno)", "Color": "Rojo Wurth", "Contenido": "Herramientas incluidas" },
    inStock: true,
  },
  {
    code: "84-47-51-056-484",
    name: "Silicona RTV 593 Negra 70ml Loctite",
    category: "adhesivos",
    brand: "Loctite",
    price: 4690,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Silicona negra RTV Loctite 593 para sellado de juntas de motor y transmisión. Formulación de uso general con buena resistencia a fluidos automotrices. Excelente relación calidad-precio para mantenimiento rutinario.",
    specs: { "Contenido": "70ml", "Color": "Negro", "Resistencia temp.": "-55°C a 260°C", "Tiempo curado": "24 horas", "Tipo": "Silicona RTV", "Aplicación": "Juntas motor y transmisión", "Holgura máx.": "6mm" },
    inStock: true,
  },
  {
    code: "99-01-02-014-73",
    name: "Foco LED Lateral Rectangular Ambar Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 4410,
    images: ["/products/braslux-lateral-ambar.jpg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral rectangular color ámbar Braslux para señalización lateral normativa en buses y camiones. Diseño rectangular compacto con lente refractora para máxima visibilidad angular.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Rectangular", "Color luz": "Ámbar", "Tipo": "LED lateral", "Consumo": "0.3W", "Vida útil": "50.000 horas", "Protección": "IP67", "Homologación": "ECE R91" },
    inStock: true,
  },
  {
    code: "99-01-02-015-72",
    name: "Foco LED Parada Solicitada 24V Danval",
    category: "iluminacion",
    brand: "Danval",
    price: 21800,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED indicador de parada solicitada Danval 24V para buses de transporte público. Señal luminosa clara y visible que indica al conductor la solicitud de detención en la próxima parada.",
    specs: { "Voltaje": "24V DC", "Color luz": "Rojo/Ámbar", "Tipo": "LED indicador", "Marca": "Danval", "Aplicación": "Indicador parada solicitada", "Montaje": "Panel interior bus" },
    inStock: true,
  },
  {
    code: "99-01-06-014-76",
    name: "Foco LED Trasero Freno 125mm Rojo Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 18603,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de freno de 125mm rojo Braslux de alta intensidad luminosa. Respuesta instantánea que mejora la distancia de reacción del vehículo que sigue. LED de última generación con óptica optimizada.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Rojo", "Tipo": "LED freno alta intensidad", "Consumo": "4W", "Vida útil": "50.000 horas", "Protección": "IP67", "Homologación": "ECE R7" },
    inStock: true,
  },
  {
    code: "99-01-06-014-77",
    name: "Foco LED 125mm Trasero Duo Ambar/Rojo Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 15770,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero dual de 125mm Braslux con funciones combinadas ámbar (direccional) y rojo (posición/freno). Solución compacta que reduce puntos de montaje en la configuración trasera del vehículo.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Ámbar + Rojo", "Tipo": "LED dual direccional/freno", "Consumo": "3W", "Vida útil": "50.000 horas", "Protección": "IP67", "Conector": "Sellado 4 vías" },
    inStock: true,
  },
  {
    code: "99-01-06-014-78",
    name: "Foco LED Trasero 125mm Retroceso Transparente Braslux",
    category: "iluminacion",
    brand: "Braslux",
    price: 16970,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de retroceso de 125mm con lente transparente Braslux. Luz blanca de alta potencia para iluminación efectiva al retroceder. Compatible con el sistema modular de focos traseros de 125mm.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Blanco", "Tipo": "LED retroceso", "Consumo": "3W", "Vida útil": "50.000 horas", "Protección": "IP67", "Homologación": "ECE R23" },
    inStock: true,
  },
  // Excel - ROTATIVOS extras (not already in stock)
  {
    code: "00-01-51-056-625",
    name: "Teroson Bond 180 True PL 310ml (Silicona Uretano P-Vidrios)",
    category: "adhesivos",
    brand: "Loctite",
    price: 7900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Adhesivo de poliuretano Teroson Bond 180 para pegado de parabrisas y vidrios en vehículos. Curado rápido con excelente adhesión estructural. Cumple los estándares de seguridad para montaje de cristales automotrices.",
    specs: { "Contenido": "310ml (cartucho)", "Color": "Negro", "Tiempo manipulación": "15 minutos", "Curado completo": "24 horas", "Tipo": "Poliuretano monocomponente", "Aplicación": "Pegado de vidrios automotrices", "Resistencia temp.": "-40°C a 90°C" },
    inStock: true,
  },
  {
    code: "00-70-19-000-477",
    name: "Guantes Nitrilo Talla L 3.5grs",
    category: "seguridad",
    brand: "Recambio SpA",
    price: 4900,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Caja de guantes desechables de nitrilo talla L, peso 3.5g por guante. Excelente resistencia a químicos, aceites y solventes. Sin látex, ideales para personas con sensibilidad alérgica.",
    specs: { "Talla": "L (Large)", "Material": "Nitrilo", "Peso por guante": "3.5g", "Libre de": "Látex y polvo", "Color": "Azul", "Resistencia": "Aceites, solventes, químicos" },
    inStock: true,
  },
  {
    code: "86-53-51-999-1093",
    name: "Mopa Sin Palo",
    category: "otros",
    brand: "Recambio SpA",
    price: 1400,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Repuesto de mopa sin palo para limpieza de pisos en talleres y áreas de trabajo. Fibras de algodón de alta absorción para una limpieza eficiente. Compatible con palos de mopa estándar.",
    specs: { "Tipo": "Repuesto mopa", "Material": "Algodón", "Incluye palo": "No", "Aplicación": "Limpieza pisos taller", "Ancho": "40cm" },
    inStock: true,
  },
  {
    code: "84-47-51-018-1014",
    name: "Jabón Limpiador Manos Industrial 4 Lts Wurth",
    category: "otros",
    brand: "Wurth",
    price: 22110,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Jabón industrial Wurth para limpieza profunda de manos, remueve grasa, aceite y suciedad de taller. Fórmula con micropartículas abrasivas suaves que no irritan la piel. Con dosificador compatible.",
    specs: { "Contenido": "4 litros", "Marca": "Wurth", "Tipo": "Jabón industrial con micropartículas", "Aplicación": "Limpieza de manos", "pH": "Neutro", "Aroma": "Cítrico" },
    inStock: true,
  },
  {
    code: "70-70-50-094-751",
    name: "Guantes Cabritilla",
    category: "seguridad",
    brand: "Recambio SpA",
    price: 1290,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Guantes de cabritilla de cuero natural para trabajos mecánicos de precisión. Proporcionan excelente sensibilidad táctil manteniendo protección contra abrasión. Costuras reforzadas para mayor durabilidad.",
    specs: { "Material": "Cuero cabritilla natural", "Tipo": "Guante de precisión", "Protección": "Abrasión y corte leve", "Costuras": "Reforzadas", "Uso": "Mecánica, manipulación piezas" },
    inStock: true,
  },
  {
    code: "00-06-51-75-631",
    name: "Correa Aire Acondicionado Lisa 2B-76 / 1930mm Lisa Optibelt",
    category: "otros",
    brand: "Optibelt",
    price: 54330,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Correa lisa Optibelt para compresor de aire acondicionado, perfil 2B-76 con longitud de 1930mm. Fabricada en caucho EPDM de alta calidad para resistencia al calor y desgaste prolongado.",
    specs: { "Perfil": "2B-76", "Longitud": "1930mm", "Tipo": "Lisa (Flat belt)", "Material": "Caucho EPDM", "Marca": "Optibelt", "Aplicación": "Compresor aire acondicionado", "Resistencia temp.": "-30°C a 120°C" },
    inStock: true,
  },
  {
    code: "00-00-19-115-1085",
    name: "Disco de Corte Poliflex",
    category: "herramientas",
    brand: "Recambio SpA",
    price: 485,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Disco de corte Poliflex para amoladora angular, diseñado para corte rápido y limpio de metales ferrosos. Espesor reducido para menor esfuerzo y acabado sin rebabas.",
    specs: { "Tipo": "Disco de corte", "Material abrasivo": "Óxido de aluminio", "Aplicación": "Metales ferrosos", "RPM máx.": "12.200", "Marca": "Poliflex", "Espesor": "1.6mm" },
    inStock: true,
  },
  {
    code: "00-00-19-042-286",
    name: "Broca 3mm",
    category: "herramientas",
    brand: "Recambio SpA",
    price: 820,
    images: ["/products/broca-wurth.webp", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Broca de acero rápido HSS de 3mm de diámetro para perforación en metal, madera y plástico. Punta afilada de 118° para centrado preciso y perforación sin desviación.",
    specs: { "Diámetro": "3mm", "Material": "Acero rápido HSS", "Punta": "118°", "Largo total": "61mm", "Largo útil": "33mm", "Aplicación": "Metal, madera, plástico" },
    inStock: true,
  },
  {
    code: "00-00-19-042-287",
    name: "Broca 5mm",
    category: "herramientas",
    brand: "Recambio SpA",
    price: 1530,
    images: ["/products/broca-wurth.webp", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Broca de acero rápido HSS de 5mm de diámetro, apta para perforación de alta velocidad en metales y aleaciones. Tratamiento superficial para mayor resistencia al desgaste y mejor evacuación de viruta.",
    specs: { "Diámetro": "5mm", "Material": "Acero rápido HSS", "Punta": "118°", "Largo total": "86mm", "Largo útil": "52mm", "Aplicación": "Metal, madera, plástico" },
    inStock: true,
  },
  {
    code: "99-05-99-999-218",
    name: "Remache Pop 4,8x24",
    category: "otros",
    brand: "Recambio SpA",
    price: 33,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Remache tipo pop de aluminio/acero de 4.8mm de diámetro y 24mm de largo. Fijación rápida y permanente para chapas, paneles y componentes de carrocería sin necesidad de acceso trasero.",
    specs: { "Diámetro": "4.8mm", "Largo": "24mm", "Material cuerpo": "Aluminio", "Material vástago": "Acero", "Rango agarre": "14-18mm", "Tipo": "Pop estándar" },
    inStock: true,
  },
  {
    code: "81-52-51-057-379",
    name: "Remache Pop 4,8x30",
    category: "otros",
    brand: "Recambio SpA",
    price: 43,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Remache tipo pop de aluminio/acero de 4.8mm de diámetro y 30mm de largo para materiales de mayor espesor. Unión estructural confiable para paneles de carrocería y accesorios exteriores.",
    specs: { "Diámetro": "4.8mm", "Largo": "30mm", "Material cuerpo": "Aluminio", "Material vástago": "Acero", "Rango agarre": "20-25mm", "Tipo": "Pop estándar" },
    inStock: true,
  },
  {
    code: "99-01-07-008-222",
    name: "Fusible Tipo Enchufe 15Amp",
    category: "electrico",
    brand: "Recambio SpA",
    price: 115,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Fusible automotriz tipo enchufe (blade) de 15 amperios para protección de circuitos eléctricos. Color azul según norma internacional de identificación. Compatible con portafusibles estándar.",
    specs: { "Amperaje": "15A", "Tipo": "Enchufe (blade/espada)", "Voltaje máx.": "32V DC", "Color": "Azul", "Norma": "ISO 8820", "Material": "Zinc / Plástico" },
    inStock: true,
  },
];

// Products from PDF catalog (no prices - catalog only)
const catalogProducts: Product[] = [
  // ILUMINACIÓN
  {
    code: "8610.00.462",
    name: "Conjunto Difusor de Aire Color Gris",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conjunto difusor de aire para sistema de ventilación interior de buses, acabado color gris. Regulación de caudal y dirección del flujo de aire para confort de pasajeros.",
    specs: { "Color": "Gris", "Material": "ABS", "Tipo": "Difusor regulable", "Aplicación": "Ventilación interior bus", "Montaje": "Clip / Tornillo" },
    inStock: true,
  },
  {
    code: "8610.00.464",
    name: "Conjunto Difusor de Aire Color Grafito",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conjunto difusor de aire para ventilación interior en color grafito. Diseño estético moderno compatible con interiores de buses de última generación. Flujo de aire ajustable en dirección e intensidad.",
    specs: { "Color": "Grafito", "Material": "ABS", "Tipo": "Difusor regulable", "Aplicación": "Ventilación interior bus", "Montaje": "Clip / Tornillo" },
    inStock: true,
  },
  {
    code: "8636.00.000",
    name: "Tope de Parachoque",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tope de goma para parachoque de bus, absorbe impactos menores durante maniobras de estacionamiento. Material elastomérico de alta resistencia a la intemperie y deformación permanente.",
    specs: { "Material": "Caucho EPDM", "Color": "Negro", "Tipo": "Tope absorbente", "Montaje": "Perno pasante", "Aplicación": "Parachoque bus" },
    inStock: true,
  },
  {
    code: "8420.60.909",
    name: "Tirador de Ventana Liso 60",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tirador de ventana liso de 60mm para ventanas correderas de buses. Acabado suave al tacto con agarre ergonómico. Fabricado en polímero técnico resistente a rayos UV.",
    specs: { "Largo": "60mm", "Material": "Polímero técnico", "Acabado": "Liso", "Color": "Negro", "Aplicación": "Ventanas correderas bus", "Resistencia UV": "Sí" },
    inStock: true,
  },
  {
    code: "8420.50.909",
    name: "Tirador de Ventana Liso 50",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tirador de ventana liso de 50mm para ventanas correderas de buses de pasajeros. Diseño compacto para espacios reducidos con superficie antideslizante integrada.",
    specs: { "Largo": "50mm", "Material": "Polímero técnico", "Acabado": "Liso", "Color": "Negro", "Aplicación": "Ventanas correderas bus", "Resistencia UV": "Sí" },
    inStock: true,
  },
  {
    code: "8421.51.909",
    name: "Tirador de Ventana con Relieve 50",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tirador de ventana con superficie en relieve de 50mm que proporciona mejor agarre. Textura antideslizante que facilita la operación incluso con manos húmedas o guantes.",
    specs: { "Largo": "50mm", "Material": "Polímero técnico", "Acabado": "Con relieve", "Color": "Negro", "Aplicación": "Ventanas correderas bus", "Agarre": "Textura antideslizante" },
    inStock: true,
  },
  {
    code: "8423.00.001",
    name: "Tirador de Ventana Base Plana 60mm",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tirador de ventana con base plana de 60mm para montaje sobre perfil de aluminio. Base amplia que distribuye la fuerza de agarre uniformemente sobre el marco de la ventana.",
    specs: { "Largo": "60mm", "Material": "Polímero técnico", "Base": "Plana", "Color": "Negro", "Aplicación": "Ventanas con perfil aluminio", "Montaje": "Sobre perfil" },
    inStock: true,
  },
  {
    code: "8424.00.002",
    name: "Tirador de Ventana Base Relieve 60mm",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tirador de ventana con base en relieve de 60mm que ofrece mayor tracción al operar las ventanas correderas. Diseño robusto para uso intensivo en transporte público.",
    specs: { "Largo": "60mm", "Material": "Polímero técnico", "Base": "Con relieve", "Color": "Negro", "Aplicación": "Ventanas correderas bus", "Montaje": "Sobre perfil" },
    inStock: true,
  },
  {
    code: "8618.32.462",
    name: "Base Tubo Pilar 32 Onix",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Base para tubo pilar de 32mm acabado color Onix para pasamanos y barras de sujeción en buses. Fijación segura al piso o techo del vehículo con tornillería oculta.",
    specs: { "Diámetro tubo": "32mm", "Color": "Onix", "Material": "Zamac / ABS", "Tipo": "Base de fijación", "Montaje": "Tornillería oculta", "Aplicación": "Pasamanos interior bus" },
    inStock: true,
  },
  {
    code: "8618.34.462",
    name: "Base Tubo Pilar 34 Onix",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Base para tubo pilar de 34mm acabado Onix, diseñada para pilares verticales de sujeción en buses urbanos. Acabado resistente a la corrosión y al contacto frecuente de pasajeros.",
    specs: { "Diámetro tubo": "34mm", "Color": "Onix", "Material": "Zamac / ABS", "Tipo": "Base de fijación", "Montaje": "Tornillería oculta", "Aplicación": "Pilares verticales bus" },
    inStock: true,
  },
  {
    code: "4617.32.462",
    name: "Base Pasamano Minusválido D32 Onix",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Base para pasamano de accesibilidad para personas con movilidad reducida, diámetro 32mm color Onix. Cumple normativa de accesibilidad universal para transporte público.",
    specs: { "Diámetro tubo": "32mm", "Color": "Onix", "Material": "Zamac / ABS", "Normativa": "Accesibilidad universal", "Tipo": "Base pasamano PMR", "Montaje": "Tornillería reforzada" },
    inStock: true,
  },
  {
    code: "4648.LD.466",
    name: "Garra de Asiento LD Gris",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Garra de fijación para asiento lado derecho (LD) en color gris. Sistema de anclaje rápido para instalación y desmontaje de asientos de pasajeros en buses.",
    specs: { "Lado": "Derecho (LD)", "Color": "Gris", "Material": "Acero estampado / Polímero", "Tipo": "Garra de fijación", "Aplicación": "Asientos pasajeros bus", "Sistema": "Anclaje rápido" },
    inStock: true,
  },
  {
    code: "4648.LE.466",
    name: "Garra de Asiento LE Gris",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Garra de fijación para asiento lado izquierdo (LE) en color gris. Complemento del sistema de anclaje para montaje seguro de asientos en configuración estándar de buses.",
    specs: { "Lado": "Izquierdo (LE)", "Color": "Gris", "Material": "Acero estampado / Polímero", "Tipo": "Garra de fijación", "Aplicación": "Asientos pasajeros bus", "Sistema": "Anclaje rápido" },
    inStock: true,
  },
  {
    code: "8097.70.301",
    name: "Foco Led Trasero 125mm Ambar Direccional",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 125mm color ámbar para función direccional en buses y camiones. Alta visibilidad diurna y nocturna con distribución luminosa homogénea.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Ámbar", "Tipo": "LED direccional", "Consumo": "2W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8044.70.301",
    name: "Foco Led Tech Trasero 125mm Direccional",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED línea Tech trasero de 125mm para señalización direccional. Tecnología de última generación con mayor eficiencia luminosa y diseño moderno de óptica escalonada.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Ámbar", "Tipo": "LED Tech direccional", "Consumo": "1.5W", "Vida útil": "50.000 horas", "Protección": "IP67", "Línea": "Tech" },
    inStock: true,
  },
  {
    code: "8044.70.302",
    name: "Foco Led Trasero 125mm Posición/Freno",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 125mm con doble función posición y freno. Dos niveles de intensidad luminosa diferenciados que cumplen con la normativa vigente de iluminación vehicular.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Rojo", "Tipo": "LED posición/freno", "Consumo": "2W/4W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8044.70.305",
    name: "Foco Led Trasero 125mm Tech Reversa",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero línea Tech de 125mm para luz de reversa con lente transparente. Iluminación potente en blanco puro para maniobras de retroceso seguras en condiciones de baja visibilidad.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Blanco", "Tipo": "LED Tech reversa", "Consumo": "3W", "Vida útil": "50.000 horas", "Protección": "IP67", "Línea": "Tech" },
    inStock: true,
  },
  {
    code: "8012.24.315",
    name: "Foco Led Trasero 125mm Cristal Direccional",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 125mm con lente cristal para direccional. El lente cristalino permite ver los LED individuales apagados dando un aspecto premium al vehículo.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Ámbar (lente cristal)", "Tipo": "LED cristal direccional", "Consumo": "2W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8012.24.325",
    name: "Foco Led Trasero 125mm Cristal Posición/Freno",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 125mm con lente cristal para posición y freno. Estética moderna con LED rojos visibles a través de la óptica transparente. Compatible con el sistema modular de 125mm.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Rojo (lente cristal)", "Tipo": "LED cristal posición/freno", "Consumo": "2W/4W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8097.70.302",
    name: "Foco Led Trasero 125mm Rojo Posición/Freno",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 125mm rojo para funciones combinadas de posición y freno. Distribución luminosa optimizada para detección rápida por parte de otros conductores.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Rojo", "Tipo": "LED posición/freno", "Consumo": "2W/4W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8097.60.305",
    name: "Foco Led Trasero 125mm Reserva",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 125mm para luz de reversa/reserva con lente blanca. Alta luminosidad para iluminación del área posterior durante maniobras nocturnas de estacionamiento.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Blanco", "Tipo": "LED reversa", "Consumo": "3W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8048.70.301",
    name: "Foco Led Trasero 96mm Direccional",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 96mm de diámetro para función direccional ámbar. Formato compacto ideal para configuraciones traseras que requieren múltiples funciones en espacios reducidos.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "96mm", "Color luz": "Ámbar", "Tipo": "LED direccional", "Consumo": "1.5W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8048.70.302",
    name: "Foco Led Trasero 96mm Posición/Freno",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 96mm con doble función posición y freno en rojo. Formato reducido compatible con el sistema modular de iluminación trasera para buses urbanos.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "96mm", "Color luz": "Rojo", "Tipo": "LED posición/freno", "Consumo": "1.5W/3W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8048.70.305",
    name: "Foco Led Trasero 96mm Reversa",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de 96mm para luz de retroceso con lente transparente. Formato compacto que complementa las funciones direccional y freno del sistema modular de 96mm.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "96mm", "Color luz": "Blanco", "Tipo": "LED reversa", "Consumo": "2W", "Vida útil": "50.000 horas", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8938.80.301",
    name: "Foco Led Tech Trasero 75mm Direccional",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED línea Tech trasero de 75mm para función direccional. El formato más compacto de la línea, ideal para vehículos medianos y configuraciones traseras con espacio limitado.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "75mm", "Color luz": "Ámbar", "Tipo": "LED Tech direccional", "Consumo": "1W", "Vida útil": "50.000 horas", "Protección": "IP67", "Línea": "Tech" },
    inStock: true,
  },
  {
    code: "8938.80.305",
    name: "Foco Led Tech Trasero 75mm Reversa",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED línea Tech trasero de 75mm para luz de reversa blanca. Compacto y eficiente, con conector sellado para instalación rápida en el sistema eléctrico del vehículo.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "75mm", "Color luz": "Blanco", "Tipo": "LED Tech reversa", "Consumo": "1.5W", "Vida útil": "50.000 horas", "Protección": "IP67", "Línea": "Tech" },
    inStock: true,
  },
  {
    code: "7071.50.301",
    name: "Foco Led Lateral Posición Reflector Ovalado Ambar Caio-Euro6",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral ovalado ámbar con reflector integrado, diseñado para carrocerías Caio Euro6. Cumple normativa de señalización lateral obligatoria con función LED y catadióptrico en una sola pieza.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Ovalado", "Color luz": "Ámbar", "Tipo": "LED lateral con reflector", "Compatibilidad": "Caio Euro6", "Protección": "IP67", "Homologación": "ECE R91" },
    inStock: true,
  },
  {
    code: "7071.50.302",
    name: "Foco Led Lateral Posición Reflector Ovalado Roja",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral ovalado rojo con reflector para señalización trasera lateral. Ideal para la zona posterior del vehículo donde la normativa exige señalización en color rojo.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Ovalado", "Color luz": "Rojo", "Tipo": "LED lateral con reflector", "Protección": "IP67", "Homologación": "ECE R91" },
    inStock: true,
  },
  {
    code: "7071.50.304",
    name: "Foco Led Lateral Posición Reflector Ovalado Verde",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral ovalado verde con reflector para señalización especial. Utilizado en vehículos de emergencia o transporte especial que requieren identificación luminosa diferenciada.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Ovalado", "Color luz": "Verde", "Tipo": "LED lateral con reflector", "Protección": "IP67", "Aplicación": "Señalización especial" },
    inStock: true,
  },
  {
    code: "8070.52.302",
    name: "Foco Led Tercera Luz de Freno Cable con Terminal",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tercera luz de freno LED con cable y terminal de conexión directa. Montaje en la parte superior trasera del vehículo para cumplimiento normativo de iluminación de freno complementaria.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Rojo", "Tipo": "LED tercera luz freno", "Conexión": "Cable con terminal", "Protección": "IP67", "Montaje": "Superior trasero" },
    inStock: true,
  },
  {
    code: "8070.53.302",
    name: "Foco Led Trasero Luz de Freno Sellado 2 Vías 125mm Reserva",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de freno de 125mm con conector sellado de 2 vías. Diseño hermético que garantiza funcionamiento confiable en condiciones de lluvia, polvo y lavado a presión.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Rojo", "Tipo": "LED freno sellado", "Conector": "Sellado 2 vías", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8914.00.001",
    name: "Foco Led Posición/Direccional con Reflector Cuadrado",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED cuadrado con doble función posición y direccional, incorpora reflector catadióptrico. Diseño compacto para montaje en esquinas de carrocería con máxima visibilidad angular.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Cuadrado", "Color luz": "Ámbar", "Tipo": "LED posición/direccional", "Reflector": "Catadióptrico integrado", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8976.10.301",
    name: "Foco Lateral Posición Reflectante Ambar",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco lateral de posición con reflector ámbar para señalización lateral normativa. Combina función LED activa con reflector pasivo para visibilidad tanto con motor encendido como apagado.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Ámbar", "Tipo": "LED lateral reflectante", "Protección": "IP67", "Reflector": "Integrado", "Homologación": "ECE R91" },
    inStock: true,
  },
  {
    code: "8976.10.302",
    name: "Foco Lateral Posición Reflectante Rojo",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco lateral de posición con reflector rojo para la zona trasera lateral del vehículo. Señalización dual activa y pasiva que cumple la normativa de visibilidad para vehículos pesados.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Rojo", "Tipo": "LED lateral reflectante", "Protección": "IP67", "Reflector": "Integrado", "Homologación": "ECE R91" },
    inStock: true,
  },
  {
    code: "8996.51.305",
    name: "Foco Led Placa Patente Sellado 2 Vías",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED para iluminación de placa patente con conector sellado de 2 vías. Luz blanca uniforme que garantiza la legibilidad de la matrícula en condiciones nocturnas.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Blanco", "Tipo": "LED placa patente", "Conector": "Sellado 2 vías", "Protección": "IP67", "Homologación": "ECE R4" },
    inStock: true,
  },
  {
    code: "8916.70.301",
    name: "Foco Led Lateral Posición/Direccional con Reflector Ovalado",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral ovalado con doble función posición y direccional más reflector integrado. Solución completa de señalización lateral que combina tres funciones en una sola pieza.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Ovalado", "Color luz": "Ámbar", "Tipo": "LED posición/direccional", "Reflector": "Integrado", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8916.84.301",
    name: "Foco Led Lateral Posición/Direccional con Reflector Ovalado",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral ovalado de mayor tamaño con funciones de posición y direccional. Reflector catadióptrico perimetral para visibilidad pasiva. Versión reforzada para carrocerías de gran porte.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Ovalado grande", "Color luz": "Ámbar", "Tipo": "LED posición/direccional reforzado", "Reflector": "Catadióptrico perimetral", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8524.81.301",
    name: "Foco Led Lateral Posición/Direccional con Reflector Rectangular",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral rectangular con funciones de posición y direccional más reflector. Formato rectangular para integración en carrocerías con líneas rectas y perfiles cuadrados.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Rectangular", "Color luz": "Ámbar", "Tipo": "LED posición/direccional", "Reflector": "Integrado", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "8996.80.305",
    name: "Foco Led Placa Patente",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED compacto para iluminación de placa patente trasera. Montaje superficial con carcasa de bajo perfil que no interfiere con el diseño del parachoque.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Blanco", "Tipo": "LED placa patente", "Montaje": "Superficial", "Protección": "IP67", "Homologación": "ECE R4" },
    inStock: true,
  },
  {
    code: "8996.50.305",
    name: "Foco Led Placa Patente Cable con Terminal",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED para placa patente con cable y terminal de conexión directa al arnés eléctrico. Instalación simplificada sin necesidad de conectores adicionales.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Blanco", "Tipo": "LED placa patente", "Conexión": "Cable con terminal", "Protección": "IP67", "Homologación": "ECE R4" },
    inStock: true,
  },
  {
    code: "8011.24.001",
    name: "Foco Led Cortesía Puerta",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED de cortesía para iluminación de acceso en puertas de bus. Se activa con la apertura de la puerta proporcionando luz de bienvenida y seguridad para el ascenso de pasajeros.",
    specs: { "Voltaje": "12/24V DC", "Color luz": "Blanco cálido", "Tipo": "LED cortesía", "Activación": "Apertura de puerta", "Protección": "IP44", "Montaje": "Empotrado" },
    inStock: true,
  },
  {
    code: "3099.00.009",
    name: "Conector Sellado 2 Vías",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conector eléctrico sellado de 2 vías para conexión de focos LED y accesorios de iluminación. Protección IP67 contra agua y polvo con sistema de retención positiva de cables.",
    specs: { "Vías": "2", "Tipo": "Conector sellado", "Protección": "IP67", "Material": "Nylon PA66", "Sección cable": "0.5-1.5mm²", "Aplicación": "Iluminación exterior" },
    inStock: true,
  },
  {
    code: "3099.10.001",
    name: "Conector Sellado 3 Vías",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conector eléctrico sellado de 3 vías para focos LED con funciones múltiples. Permite conexión de positivo, masa y señal adicional en un solo conector estanco.",
    specs: { "Vías": "3", "Tipo": "Conector sellado", "Protección": "IP67", "Material": "Nylon PA66", "Sección cable": "0.5-1.5mm²", "Aplicación": "Focos LED multifunción" },
    inStock: true,
  },
  {
    code: "3056.00.003",
    name: "Conector Sellado 4 Vías",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conector eléctrico sellado de 4 vías para focos LED con múltiples funciones integradas. Compatible con focos traseros combinados de posición, freno, direccional y reversa.",
    specs: { "Vías": "4", "Tipo": "Conector sellado", "Protección": "IP67", "Material": "Nylon PA66", "Sección cable": "0.5-1.5mm²", "Aplicación": "Focos combinados traseros" },
    inStock: true,
  },
  {
    code: "3840.05.003",
    name: "Conector Sellado 5 Vías",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conector eléctrico sellado de 5 vías para aplicaciones de iluminación complejas. Permite conexiones múltiples en un solo punto estanco para sistemas de luces traseras avanzados.",
    specs: { "Vías": "5", "Tipo": "Conector sellado", "Protección": "IP67", "Material": "Nylon PA66", "Sección cable": "0.5-1.5mm²", "Aplicación": "Sistemas iluminación avanzados" },
    inStock: true,
  },
  {
    code: "8501.91.009",
    name: "Soquete Universal 1 Contacto",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Soquete universal de 1 contacto para conexión rápida de focos y lámparas. Compatible con múltiples tipos de portalámparas estándar del mercado automotriz.",
    specs: { "Contactos": "1", "Tipo": "Soquete universal", "Material": "Latón / PBT", "Sección cable": "0.5-2.5mm²", "Aplicación": "Portalámparas automotriz" },
    inStock: true,
  },
  {
    code: "8502.91.009",
    name: "Soquete Universal 2 Contacto",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Soquete universal de 2 contactos para lámparas de doble filamento o LED bifunción. Conexión segura con terminales de latón para buena conductividad eléctrica.",
    specs: { "Contactos": "2", "Tipo": "Soquete universal", "Material": "Latón / PBT", "Sección cable": "0.5-2.5mm²", "Aplicación": "Lámparas doble función" },
    inStock: true,
  },
  {
    code: "8501.90.301",
    name: "Soquete Universal 1P 300Luva",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Soquete universal de 1 polo con manguito protector de 300mm. Cable prelongado con terminal para instalación directa sin necesidad de empalmes adicionales.",
    specs: { "Contactos": "1", "Tipo": "Soquete con manguito", "Largo cable": "300mm", "Material": "Latón / PBT", "Sección cable": "0.5-1.5mm²", "Aplicación": "Instalación directa" },
    inStock: true,
  },
  {
    code: "8517.70.325",
    name: "Foco Led Trasero 125mm Posición/Freno/Reversa",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero multifunción de 125mm que integra posición, freno y reversa en una sola unidad. Solución todo-en-uno que simplifica la instalación trasera reduciendo puntos de montaje.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "125mm", "Color luz": "Rojo + Blanco", "Tipo": "LED multifunción", "Funciones": "Posición/Freno/Reversa", "Protección": "IP67", "Conector": "Sellado 4 vías" },
    inStock: true,
  },
  // GENERALES from PDF
  {
    code: "000842",
    name: "Tapa con Llave Reserva AdBlue",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tapa con llave de seguridad para depósito de AdBlue (urea). Previene el robo y contaminación del aditivo SCR necesario para el sistema de reducción de emisiones Euro 5/6.",
    specs: { "Material": "Polipropileno / Acero inoxidable", "Tipo": "Con llave de seguridad", "Compatibilidad": "Depósitos AdBlue estándar", "Sello": "NBR resistente a urea", "Color": "Azul (norma ISO 22241)" },
    inStock: true,
  },
  {
    code: "000015",
    name: "Depósito Reserva Refrigerante",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Depósito de reserva de refrigerante para sistema de enfriamiento de motor. Permite la expansión y recuperación del líquido refrigerante manteniendo el nivel óptimo del circuito.",
    specs: { "Material": "Polipropileno translúcido", "Capacidad": "Estándar OEM", "Compatibilidad": "Mercedes-Benz LO/OF", "Incluye": "Manguera y conexiones", "Marca nivel": "Mín/Máx" },
    inStock: true,
  },
  {
    code: "000396",
    name: "Varilla Nivel Aceite Hidráulico Dirección",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Varilla de medición de nivel de aceite hidráulico para el sistema de dirección asistida. Indicadores de nivel mínimo y máximo grabados para verificación rápida durante el mantenimiento.",
    specs: { "Material": "Acero inoxidable / Plástico", "Marcas nivel": "Mín/Máx", "Compatibilidad": "Mercedes-Benz LO-916/OF-1721", "Tipo": "Varilla medición", "Sello": "O-ring incluido" },
    inStock: true,
  },
  {
    code: "000373",
    name: "Conjunto Fijador Filtro de Aceite Hidráulico",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conjunto de fijación para filtro de aceite hidráulico de dirección asistida. Incluye soporte, abrazadera y herrajes necesarios para el montaje seguro del elemento filtrante.",
    specs: { "Material": "Acero galvanizado", "Incluye": "Soporte, abrazadera, herrajes", "Compatibilidad": "Mercedes-Benz LO/OF", "Tipo": "Conjunto fijación", "Tratamiento": "Galvanizado anticorrosión" },
    inStock: true,
  },
  {
    code: "000194",
    name: "Depósito Aceite Hidráulico Dirección Completo",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Depósito completo para aceite hidráulico de dirección asistida con tapa, filtro interno y conexiones. Reemplazo directo del depósito original para mantener la eficiencia del sistema de dirección.",
    specs: { "Material": "Polímero técnico", "Incluye": "Tapa, filtro, conexiones", "Compatibilidad": "Mercedes-Benz LO-916/OF-1721", "Tipo": "Depósito completo", "Capacidad": "Estándar OEM" },
    inStock: true,
  },
  {
    code: "000372",
    name: "Filtro Aceite Hidráulico Dirección",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Elemento filtrante para aceite hidráulico del sistema de dirección asistida. Retiene partículas metálicas y contaminantes que degradan la bomba y cilindro de dirección.",
    specs: { "Tipo": "Elemento filtrante", "Filtración": "10 micrones", "Compatibilidad": "Mercedes-Benz LO/OF", "Material filtrante": "Celulosa/Sintético", "Intervalo cambio": "Según manual OEM" },
    inStock: true,
  },
  {
    code: "000308",
    name: "Abrazadera Tapa Filtro Aire",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Abrazadera de cierre para tapa de filtro de aire del motor. Sistema de cierre rápido que asegura el sellado hermético del conjunto filtrante contra la entrada de contaminantes.",
    specs: { "Material": "Acero galvanizado", "Tipo": "Cierre rápido", "Compatibilidad": "Conjunto filtro aire Mercedes-Benz", "Acabado": "Galvanizado", "Aplicación": "Tapa filtro aire motor" },
    inStock: true,
  },
  {
    code: "000085",
    name: "Sensor Presión y Temperatura Aire (4 Bar) LO915",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor combinado de presión y temperatura de aire de admisión para motor Mercedes-Benz LO915. Envía señal al módulo de control electrónico para optimizar la inyección de combustible.",
    specs: { "Voltaje": "5V (señal)", "Rango presión": "0-4 Bar", "Compatibilidad": "Mercedes-Benz LO-915", "Tipo": "Sensor combinado MAP/IAT", "Conector": "4 pines", "Material": "Plástico técnico / Latón" },
    inStock: true,
  },
  {
    code: "000235",
    name: "Conjunto Filtro de Aire Motor",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conjunto completo de filtro de aire para motor incluyendo carcasa, elemento primario y elemento de seguridad. Filtración de alta eficiencia para proteger el motor contra partículas abrasivas.",
    specs: { "Tipo": "Conjunto filtro aire completo", "Incluye": "Carcasa, elemento primario, seguridad", "Compatibilidad": "Mercedes-Benz OM-906/OM-926", "Eficiencia": "99.9%", "Material carcasa": "Polipropileno" },
    inStock: true,
  },
  {
    code: "000355",
    name: "Sensor Nivel Refrigerante LO916",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor de nivel de líquido refrigerante para Mercedes-Benz LO916. Detecta nivel bajo de refrigerante y activa la alerta en el tablero para prevenir sobrecalentamiento del motor.",
    specs: { "Voltaje": "24V", "Tipo": "Sensor de nivel flotador", "Compatibilidad": "Mercedes-Benz LO-916", "Conector": "2 pines", "Material": "Plástico técnico", "Señal": "On/Off" },
    inStock: true,
  },
  {
    code: "000523",
    name: "Tapa Conjunto Filtro de Aire Motor",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tapa superior para conjunto de filtro de aire del motor. Cierre hermético con junta perimetral que evita la entrada de aire no filtrado al sistema de admisión.",
    specs: { "Material": "Polipropileno reforzado", "Tipo": "Tapa con junta", "Compatibilidad": "Mercedes-Benz OM-906/OM-926", "Junta": "Perimetral incluida", "Cierre": "Clip rápido" },
    inStock: true,
  },
  {
    code: "000712",
    name: "Sensor Temperatura Refrigerante",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor de temperatura de líquido refrigerante tipo NTC para monitoreo continuo de la temperatura del motor. Envía señal al indicador del tablero y al módulo de control electrónico.",
    specs: { "Tipo": "NTC (coeficiente negativo)", "Rango temp.": "-40°C a 130°C", "Conexión": "Rosca M12x1.5", "Conector": "2 pines", "Material": "Latón", "Compatibilidad": "Mercedes-Benz OM-904/906/926" },
    inStock: true,
  },
  {
    code: "000774",
    name: "Válvula de PO Conjunto Filtro de Aire Motor",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Válvula de descarga de polvo (PO) para conjunto filtro de aire del motor. Evacua automáticamente las partículas gruesas atrapadas en la trampa de polvo antes del elemento filtrante.",
    specs: { "Material": "Caucho EPDM", "Tipo": "Válvula evacuación polvo", "Funcionamiento": "Automático por succión", "Compatibilidad": "Filtro aire Mercedes-Benz", "Color": "Negro" },
    inStock: true,
  },
  {
    code: "000567",
    name: "Sensor Presión y Temperatura Aire (3.5 Bar)",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor combinado de presión y temperatura de aire de admisión con rango de 3.5 Bar. Para motores con turbo de menor presión de soplado. Señal analógica al módulo de gestión del motor.",
    specs: { "Voltaje": "5V (señal)", "Rango presión": "0-3.5 Bar", "Tipo": "Sensor combinado MAP/IAT", "Conector": "4 pines", "Material": "Plástico técnico / Latón", "Compatibilidad": "Mercedes-Benz serie 900" },
    inStock: true,
  },
  {
    code: "000690",
    name: "Manguera Aire Admisión Filtro Aire Motor LO915",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Manguera de aire de admisión que conecta el filtro de aire con el turbocompresor del motor LO915. Fabricada en caucho reforzado con malla textil para soportar depresión y temperatura.",
    specs: { "Material": "Caucho reforzado con malla", "Compatibilidad": "Mercedes-Benz LO-915", "Tipo": "Manguera admisión", "Resistencia temp.": "-40°C a 120°C", "Aplicación": "Filtro aire a turbo" },
    inStock: true,
  },
  {
    code: "000070",
    name: "Sensor Nivel Refrigerante",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor de nivel de refrigerante universal para depósitos de expansión Mercedes-Benz. Tipo flotador magnético con contacto reed para detección precisa del nivel mínimo de refrigerante.",
    specs: { "Voltaje": "24V", "Tipo": "Flotador magnético reed", "Conector": "2 pines", "Material": "Polipropileno / Magnético", "Señal": "On/Off", "Compatibilidad": "Mercedes-Benz serie LO/OF" },
    inStock: true,
  },
  {
    code: "000424",
    name: "Manguera Aire Admisión Filtro Aire Motor 904",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Manguera de aire de admisión para motor Mercedes-Benz OM-904. Conecta la salida del filtro de aire con la entrada del turbocompresor manteniendo un flujo de aire limpio y sin fugas.",
    specs: { "Material": "Caucho reforzado con malla", "Compatibilidad": "Mercedes-Benz OM-904", "Tipo": "Manguera admisión", "Resistencia temp.": "-40°C a 120°C", "Aplicación": "Filtro aire a turbo" },
    inStock: true,
  },
  {
    code: "000472",
    name: "Guía Puerta Corredera Vito",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Guía de deslizamiento para puerta corredera lateral de Mercedes-Benz Vito. Permite el movimiento suave y alineado de la puerta sobre el riel. Incluye rodamiento para operación silenciosa.",
    specs: { "Material": "Polímero técnico / Acero", "Compatibilidad": "Mercedes-Benz Vito/Viano", "Tipo": "Guía con rodamiento", "Posición": "Puerta corredera lateral", "Incluye": "Rodamiento integrado" },
    inStock: true,
  },
  {
    code: "000393",
    name: "Tapa Depósito Refrigerante",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tapa estándar para depósito de refrigerante con válvula de presión y vacío. Mantiene la presión correcta del sistema de enfriamiento para optimizar el punto de ebullición del refrigerante.",
    specs: { "Material": "Polipropileno", "Presión apertura": "1.0 Bar", "Válvula": "Presión y vacío", "Compatibilidad": "Mercedes-Benz serie LO/OF", "Color": "Negro" },
    inStock: true,
  },
  {
    code: "000386",
    name: "Tapa Depósito Refrigerante M48",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tapa para depósito de refrigerante con rosca M48 y válvula reguladora de presión. Formato grande para depósitos de vehículos pesados con alta capacidad de refrigerante.",
    specs: { "Material": "Polipropileno reforzado", "Rosca": "M48", "Presión apertura": "1.0 Bar", "Válvula": "Presión integrada", "Compatibilidad": "Depósitos M48 estándar" },
    inStock: true,
  },
  {
    code: "000525",
    name: "Abrazadera Metálica 85mm",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Abrazadera metálica de 85mm de diámetro para fijación de mangueras de admisión y escape. Banda ancha de acero inoxidable con tornillo de apriete para sellado uniforme.",
    specs: { "Diámetro": "85mm", "Material": "Acero inoxidable", "Ancho banda": "12mm", "Tipo": "Tornillo sin fin", "Aplicación": "Mangueras admisión/escape" },
    inStock: true,
  },
  {
    code: "000556",
    name: "Bomba Eléctrica Lavaparabrisas 24V",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Bomba eléctrica de 24V para sistema lavaparabrisas de buses y vehículos pesados. Motor sumergible de bajo consumo con presión suficiente para alcanzar toda la superficie del parabrisas.",
    specs: { "Voltaje": "24V DC", "Tipo": "Bomba centrífuga sumergible", "Presión": "1.5 Bar", "Caudal": "2 L/min", "Conector": "2 pines", "Aplicación": "Sistema lavaparabrisas" },
    inStock: true,
  },
  {
    code: "000157",
    name: "Depósito Refrigerante LO",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Depósito de expansión de refrigerante específico para chasis Mercedes-Benz serie LO. Material translúcido que permite verificación visual del nivel sin necesidad de abrir la tapa.",
    specs: { "Material": "Polipropileno translúcido", "Compatibilidad": "Mercedes-Benz serie LO", "Tipo": "Depósito expansión", "Incluye": "Conexiones y sensor nivel", "Marca nivel": "Mín/Máx grabado" },
    inStock: true,
  },
  {
    code: "A3825427517",
    name: "Sensor Corte Correa",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor detector de corte o rotura de correa de accesorios del motor. Activa alarma en el tablero cuando detecta la pérdida de la correa para prevenir daños por sobrecalentamiento.",
    specs: { "Referencia OEM": "A3825427517", "Tipo": "Sensor inductivo", "Compatibilidad": "Mercedes-Benz OM-906/OM-926", "Señal": "Digital On/Off", "Conector": "2 pines" },
    inStock: true,
  },
  {
    code: "A3760940065",
    name: "Guardapolvo Tapa Filtro",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Guardapolvo protector para tapa de filtro de aire del motor. Protege la junta de la tapa contra la acumulación de suciedad que podría comprometer el sellado del filtro.",
    specs: { "Referencia OEM": "A3760940065", "Material": "Caucho EPDM", "Tipo": "Guardapolvo protector", "Compatibilidad": "Mercedes-Benz OM-906/OM-926", "Color": "Negro" },
    inStock: true,
  },
  {
    code: "W23326",
    name: "Indicador Combustible",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Indicador de nivel de combustible para tablero de instrumentos de buses. Escala analógica con iluminación interna para lectura clara en condiciones nocturnas.",
    specs: { "Referencia": "W23326", "Voltaje": "24V", "Tipo": "Indicador analógico", "Iluminación": "Interna", "Diámetro": "52mm", "Aplicación": "Tablero instrumentos bus" },
    inStock: true,
  },
  {
    code: "392",
    name: "Tapa Depósito Hidráulico",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tapa de reemplazo para depósito de aceite hidráulico de dirección. Incluye junta de estanqueidad nueva para garantizar el sellado correcto y evitar pérdida de fluido.",
    specs: { "Material": "Polipropileno", "Tipo": "Tapa con junta", "Junta": "NBR incluida", "Compatibilidad": "Depósito hidráulico dirección estándar", "Color": "Negro" },
    inStock: true,
  },
  {
    code: "C4XD",
    name: "Interruptor Puerta Caio",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Interruptor eléctrico de puerta para carrocerías Caio. Detecta la posición abierta o cerrada de la puerta para activación de alarmas, luces de cortesía y sistema de seguridad.",
    specs: { "Tipo": "Interruptor de posición", "Compatibilidad": "Carrocerías Caio", "Contactos": "NA/NC", "Voltaje": "24V DC", "Montaje": "Marco de puerta" },
    inStock: true,
  },
  {
    code: "C5AB20",
    name: "Cuerpo Pulsadores Puertas Caio",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Conjunto de cuerpo de pulsadores para control de puertas en carrocerías Caio. Panel integrado con botones de apertura y cierre para el conductor, con indicadores luminosos de estado.",
    specs: { "Tipo": "Panel pulsadores", "Compatibilidad": "Carrocerías Caio", "Funciones": "Apertura/Cierre puertas", "Voltaje": "24V DC", "Indicadores": "LED de estado" },
    inStock: true,
  },
  {
    code: "3931064",
    name: "Tecla 2 Posiciones Tipo Marcopolo",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Tecla interruptora de 2 posiciones (on/off) tipo Marcopolo para panel de control del conductor. Diseño estándar intercambiable con iluminación de estado incorporada.",
    specs: { "Tipo": "Tecla 2 posiciones", "Compatibilidad": "Tipo Marcopolo", "Voltaje": "24V DC", "Iluminación": "LED indicador", "Montaje": "Panel recortable", "Contactos": "ON/OFF" },
    inStock: true,
  },
  {
    code: "B65",
    name: "Bocina 24V Tipo Plato",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Bocina eléctrica de 24V tipo plato para señalización acústica de buses y vehículos pesados. Sonido potente y claro que cumple normativa de nivel sonoro para transporte público.",
    specs: { "Voltaje": "24V DC", "Tipo": "Plato (disco)", "Nivel sonoro": "105-118 dB", "Frecuencia": "400 Hz", "Material": "Acero cromado", "Montaje": "Perno central" },
    inStock: true,
  },
  {
    code: "001006",
    name: "Sensor Nivel Aceite Carter 904-924-906-926",
    category: "generales",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Sensor de nivel de aceite del cárter para motores Mercedes-Benz OM-904, OM-924, OM-906 y OM-926. Monitorea continuamente el nivel de lubricante y alerta al conductor ante nivel bajo.",
    specs: { "Tipo": "Sensor capacitivo", "Compatibilidad": "OM-904/924/906/926", "Conector": "3 pines", "Señal": "Analógica", "Montaje": "Carter motor", "Material": "Aluminio / Plástico técnico" },
    inStock: true,
  },
  {
    code: "AB17.4",
    name: "Relé Temporizador Timbre con Buzzer",
    category: "electrico",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Relé temporizador con buzzer integrado para sistema de timbre de parada solicitada en buses. Genera señal acústica y eléctrica temporizada al recibir pulso del pulsador de pasajeros.",
    specs: { "Voltaje": "24V DC", "Tipo": "Relé temporizador con buzzer", "Tiempo": "Ajustable", "Salida": "Relé + Buzzer", "Montaje": "Riel DIN", "Referencia": "AB17.4" },
    inStock: true,
  },
  {
    code: "AB27.1",
    name: "Interruptor Timbre para Tubo",
    category: "electrico",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Interruptor pulsador de timbre para montaje en tubo pasamano de buses urbanos. Los pasajeros presionan para solicitar parada. Diseño ergonómico y resistente al uso intensivo.",
    specs: { "Voltaje": "24V DC", "Tipo": "Pulsador normalmente abierto", "Montaje": "Abrazadera para tubo", "Diámetro tubo": "25-32mm", "Material": "ABS / Acero inoxidable", "Referencia": "AB27.1" },
    inStock: true,
  },
  {
    code: "AB25.4",
    name: "Relé Temporizador Timbre sin Buzzer",
    category: "electrico",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Relé temporizador para sistema de timbre sin buzzer incorporado. Versión silenciosa que solo activa la señal luminosa de parada solicitada, ideal para combinar con campanilla externa.",
    specs: { "Voltaje": "24V DC", "Tipo": "Relé temporizador", "Tiempo": "Ajustable", "Salida": "Relé (sin buzzer)", "Montaje": "Riel DIN", "Referencia": "AB25.4" },
    inStock: true,
  },
  {
    code: "AB18.5C",
    name: "Display Reloj y Temperatura para Cabina",
    category: "electrico",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Display digital para cabina de bus que muestra hora y temperatura ambiente. Pantalla LED de alta visibilidad legible bajo luz solar directa. Información útil para conductor y pasajeros.",
    specs: { "Voltaje": "24V DC", "Display": "LED rojo", "Funciones": "Reloj + Temperatura", "Sensor temp.": "Incluido", "Montaje": "Empotrado panel", "Referencia": "AB18.5C" },
    inStock: true,
  },
  {
    code: "CB03.3r",
    name: "Timbre Bitonal",
    category: "electrico",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Timbre bitonal compacto para sistema de parada solicitada en buses. Emite dos tonos secuenciales distintivos que se escuchan claramente sobre el ruido ambiente del vehículo.",
    specs: { "Voltaje": "24V DC", "Tipo sonido": "Bitonal secuencial", "Nivel sonoro": "80 dB", "Montaje": "Superficie", "Material": "ABS", "Referencia": "CB03.3r" },
    inStock: true,
  },
  {
    code: "E-DHL-90",
    name: "Foco Led Lateral Posición/Direccional con Reflector Ovalado",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED lateral ovalado con funciones de posición y direccional más reflector catadióptrico. Versión alternativa con conexión DHL para sistemas eléctricos de carrocerías específicas.",
    specs: { "Voltaje": "12/24V DC", "Forma": "Ovalado", "Color luz": "Ámbar", "Tipo": "LED posición/direccional", "Reflector": "Catadióptrico", "Protección": "IP67", "Referencia": "E-DHL-90" },
    inStock: true,
  },
  {
    code: "E-R122-DI",
    name: "Foco Led Trasero Direccional 122mm con Conector Original",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero direccional de 122mm con conector original plug-and-play. Reemplazo directo sin modificaciones en el arnés eléctrico existente. Ámbar de alta visibilidad.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "122mm", "Color luz": "Ámbar", "Tipo": "LED direccional", "Conector": "Original plug-and-play", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "E-R122-ST",
    name: "Foco Led Trasero Freno/Posición 122mm con Conector Original",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de freno y posición de 122mm con conector original. Instalación directa sin adaptadores para reemplazo de unidades originales. Doble intensidad luminosa normativa.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "122mm", "Color luz": "Rojo", "Tipo": "LED freno/posición", "Conector": "Original plug-and-play", "Protección": "IP67" },
    inStock: true,
  },
  {
    code: "E-R1222-R",
    name: "Foco Led Trasero Reversa 122mm con Conector Original",
    category: "iluminacion",
    brand: "Recambio SpA",
    price: null,
    images: ["/products/placeholder.svg", "/products/placeholder.svg", "/products/placeholder.svg"],
    description: "Foco LED trasero de reversa de 122mm con conector original para instalación plug-and-play. Luz blanca potente para iluminación trasera durante maniobras de retroceso.",
    specs: { "Voltaje": "12/24V DC", "Diámetro": "122mm", "Color luz": "Blanco", "Tipo": "LED reversa", "Conector": "Original plug-and-play", "Protección": "IP67" },
    inStock: true,
  },
];

// Apply detectImageArray to all products so every product gets proper images
const allProducts = [...excelProducts, ...catalogProducts].map((p) => ({
  ...p,
  images: detectImageArray(p.code, p.name),
}));

export const products: Product[] = allProducts;

