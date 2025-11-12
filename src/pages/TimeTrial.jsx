import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TimeTrial.css";
import BackgroundVideo from "../components/BackgroundVideo";
import { auth } from "../configs/FirebaseConfig";
import { getDatabase, ref, get, set, push } from "firebase/database";

import Swal from "sweetalert2";

const quizData = [
  { images: ["/images/oxygen/oxygen1.jpg", "/images/oxygen/oxygen2.jpg", "/images/oxygen/oxygen3.jpg", "/images/oxygen/oxygen4.jpg"], answer: "OXYGEN", },
  { images: ["/images/gold/gold1.jpg", "/images/gold/gold2.jpg", "/images/gold/gold3.jpg", "/images/gold/gold4.jpg"], answer: "GOLD", },
  { images: ["/images/helium/helium1.jpg", "/images/helium/helium2.jpg", "/images/helium/helium3.jpg", "/images/helium/helium4.jpg"], answer: "HELIUM", },
  { images: ["/images/hydrogen/hydrogen1.jpg", "/images/hydrogen/hydrogen2.jpg", "/images/hydrogen/hydrogen3.jpg", "/images/hydrogen/hydrogen4.jpg"], answer: "HYDROGEN", },
  { images: ["/images/lithium/lithium1.jpg", "/images/lithium/lithium2.jpg", "/images/lithium/lithium3.jpg", "/images/lithium/lithium4.jpg"], answer: "LITHIUM", },
  { images: ["/images/beryllium/beryllium1.jpg", "/images/beryllium/beryllium2.jpg", "/images/beryllium/beryllium3.jpg", "/images/beryllium/beryllium4.jpg"], answer: "BERYLLIUM", },
  { images: ["/images/boron/boron1.jpg", "/images/boron/boron2.jpg", "/images/boron/boron3.jpg", "/images/boron/boron4.jpg"], answer: "BORON", },
  { images: ["/images/carbon/carbon1.jpg", "/images/carbon/carbon2.jpg", "/images/carbon/carbon3.jpg", "/images/carbon/carbon4.jpg"], answer: "CARBON", },
  { images: ["/images/nitrogen/nitrogen1.jpg", "/images/nitrogen/nitrogen2.jpg", "/images/nitrogen/nitrogen3.jpg", "/images/nitrogen/nitrogen4.jpg"], answer: "NITROGEN", },
  { images: ["/images/fluorine/fluorine1.jpg", "/images/fluorine/fluorine2.jpg", "/images/fluorine/fluorine3.jpg", "/images/fluorine/fluorine4.jpg"], answer: "FLUORINE", },
  { images: ["/images/neon/neon1.jpg", "/images/neon/neon2.jpg", "/images/neon/neon3.jpg", "/images/neon/neon4.jpg"], answer: "NEON", },
  { images: ["/images/sodium/sodium1.jpg", "/images/sodium/sodium2.jpg", "/images/sodium/sodium3.jpg", "/images/sodium/sodium4.jpg"], answer: "SODIUM", },
  { images: ["/images/aluminium/aluminium1.jpg", "/images/aluminium/aluminium2.jpg", "/images/aluminium/aluminium3.jpg", "/images/aluminium/aluminium4.jpg"], answer: "ALUMINIUM", },
  { images: ["/images/magnesium/magnesium1.jpg", "/images/magnesium/magnesium2.jpg", "/images/magnesium/magnesium3.jpg", "/images/magnesium/magnesium4.jpg"], answer: "MAGNESIUM", },
  { images: ["/images/silicon/silicon1.jpg", "/images/silicon/silicon2.jpg", "/images/silicon/silicon3.jpg", "/images/silicon/silicon4.jpg"], answer: "SILICON", },
  { images: ["/images/phosphorus/phosphorus1.jpg", "/images/phosphorus/phosphorus2.jpg", "/images/phosphorus/phosphorus3.jpg", "/images/phosphorus/phosphorus4.jpg"], answer: "PHOSPHORUS", },
  { images: ["/images/sulfur/sulfur1.jpg", "/images/sulfur/sulfur2.jpg", "/images/sulfur/sulfur3.jpg", "/images/sulfur/sulfur4.jpg"], answer: "SULFUR", },
  { images: ["/images/chlorine/chlorine1.jpg", "/images/chlorine/chlorine2.jpg", "/images/chlorine/chlorine3.jpg", "/images/chlorine/chlorine4.jpg"], answer: "CHLORINE", },
  { images: ["/images/argon/argon1.jpg", "/images/argon/argon2.jpg", "/images/argon/argon3.jpg", "/images/argon/argon4.jpg"], answer: "ARGON", },
  { images: ["/images/potassium/potassium1.jpg", "/images/potassium/potassium2.jpg", "/images/potassium/potassium3.jpg", "/images/potassium/potassium4.jpg"], answer: "POTASSIUM", },
  { images: ["/images/calcium/calcium1.jpg", "/images/calcium/calcium2.jpg", "/images/calcium/calcium3.jpg", "/images/calcium/calcium4.jpg"], answer: "CALCIUM", },
  { images: ["/images/titanium/titanium1.jpg", "/images/titanium/titanium2.jpg", "/images/titanium/titanium3.jpg", "/images/titanium/titanium4.jpg"], answer: "TITANIUM", },
  { images: ["/images/vanadium/vanadium1.jpg", "/images/vanadium/vanadium2.jpg", "/images/vanadium/vanadium3.jpg", "/images/vanadium/vanadium4.jpg"], answer: "VANADIUM", },
  { images: ["/images/chromium/chromium1.jpg", "/images/chromium/chromium2.jpg", "/images/chromium/chromium3.jpg", "/images/chromium/chromium4.jpg"], answer: "CHROMIUM", },
  { images: ["/images/manganese/manganese1.jpg", "/images/manganese/manganese2.jpg", "/images/manganese/manganese3.jpg", "/images/manganese/manganese4.jpg"], answer: "MANGANESE", },
  { images: ["/images/iron/iron1.jpg", "/images/iron/iron2.jpg", "/images/iron/iron3.jpg", "/images/iron/iron4.jpg"], answer: "IRON", },
  { images: ["/images/cobalt/cobalt1.jpg", "/images/cobalt/cobalt2.jpg", "/images/cobalt/cobalt3.jpg", "/images/cobalt/cobalt4.jpg"], answer: "COBALT", },
  { images: ["/images/nickel/nickel1.jpg", "/images/nickel/nickel2.jpg", "/images/nickel/nickel3.jpg", "/images/nickel/nickel4.jpg"], answer: "NICKEL", },
  { images: ["/images/copper/copper1.jpg", "/images/copper/copper2.jpg", "/images/copper/copper3.jpg", "/images/copper/copper4.jpg"], answer: "COPPER", },
  { images: ["/images/zinc/zinc1.jpg", "/images/zinc/zinc2.jpg", "/images/zinc/zinc3.jpg", "/images/zinc/zinc4.jpg"], answer: "ZINC", },
  { images: ["/images/gallium/gallium1.jpg", "/images/gallium/gallium2.jpg", "/images/gallium/gallium3.jpg", "/images/gallium/gallium4.jpg"], answer: "GALLIUM", },
  { images: ["/images/germanium/germanium1.jpg", "/images/germanium/germanium2.jpg", "/images/germanium/germanium3.jpg", "/images/germanium/germanium4.jpg"], answer: "GERMANIUM", },
  { images: ["/images/arsenic/arsenic1.jpg", "/images/arsenic/arsenic2.jpg", "/images/arsenic/arsenic3.jpg", "/images/arsenic/arsenic4.jpg"], answer: "ARSENIC", },
  { images: ["/images/selenium/selenium1.jpg", "/images/selenium/selenium2.jpg", "/images/selenium/selenium3.jpg", "/images/selenium/selenium4.jpg"], answer: "SELENIUM", },
  { images: ["/images/bromine/bromine1.jpg", "/images/bromine/bromine2.jpg", "/images/bromine/bromine3.jpg", "/images/bromine/bromine4.jpg"], answer: "BROMINE", },
  { images: ["/images/krypton/krypton1.jpg", "/images/krypton/krypton2.jpg", "/images/krypton/krypton3.jpg", "/images/krypton/krypton4.jpg"], answer: "KRYPTON", },
  { images: ["/images/rubidium/rubidium1.jpg", "/images/rubidium/rubidium2.jpg", "/images/rubidium/rubidium3.jpg", "/images/rubidium/rubidium4.jpg"], answer: "RUBIDIUM", },
  { images: ["/images/strontium/strontium1.jpg", "/images/strontium/strontium2.jpg", "/images/strontium/strontium3.jpg", "/images/strontium/strontium4.jpg"], answer: "STRONTIUM", },
  { images: ["/images/yttrium/yttrium1.jpg", "/images/yttrium/yttrium2.jpg", "/images/yttrium/yttrium3.jpg", "/images/yttrium/yttrium4.jpg"], answer: "YTTRIUM", },
  { images: ["/images/zirconium/zirconium1.jpg", "/images/zirconium/zirconium2.jpg", "/images/zirconium/zirconium3.jpg", "/images/zirconium/zirconium4.jpg"], answer: "ZIRCONIUM", },
  { images: ["/images/niobium/niobium1.jpg", "/images/niobium/niobium2.jpg", "/images/niobium/niobium3.jpg", "/images/niobium/niobium4.jpg"], answer: "NIOBIUM", },
  { images: ["/images/molybdenum/molybdenum1.jpg", "/images/molybdenum/molybdenum2.jpg", "/images/molybdenum/molybdenum3.jpg", "/images/molybdenum/molybdenum4.jpg"], answer: "MOLYBDENUM", },
  { images: ["/images/technetium/technetium1.jpg", "/images/technetium/technetium2.jpg", "/images/technetium/technetium3.jpg", "/images/technetium/technetium4.jpg"], answer: "TECHNETIUM", },
  { images: ["/images/ruthenium/ruthenium1.jpg", "/images/ruthenium/ruthenium2.jpg", "/images/ruthenium/ruthenium3.jpg", "/images/ruthenium/ruthenium4.jpg"], answer: "RUTHENIUM", },
  { images: ["/images/rhodium/rhodium1.jpg", "/images/rhodium/rhodium2.jpg", "/images/rhodium/rhodium3.jpg", "/images/rhodium/rhodium4.jpg"], answer: "RHODIUM", },
  { images: ["/images/palladium/palladium1.jpg", "/images/palladium/palladium2.jpg", "/images/palladium/palladium3.jpg", "/images/palladium/palladium4.jpg"], answer: "PALLADIUM", },
  { images: ["/images/silver/silver1.jpg", "/images/silver/silver2.jpg", "/images/silver/silver3.jpg", "/images/silver/silver4.jpg"], answer: "SILVER", },
  { images: ["/images/cadmium/cadmium1.jpg", "/images/cadmium/cadmium2.jpg", "/images/cadmium/cadmium3.jpg", "/images/cadmium/cadmium4.jpg"], answer: "CADMIUM", },
  { images: ["/images/indium/indium1.jpg", "/images/indium/indium2.jpg", "/images/indium/indium3.jpg", "/images/indium/indium4.jpg"], answer: "INDIUM", },
  { images: ["/images/tin/tin1.jpg", "/images/tin/tin2.jpg", "/images/tin/tin3.jpg", "/images/tin/tin4.jpg"], answer: "TIN", },
  { images: ["/images/antimony/antimony1.jpg", "/images/antimony/antimony2.jpg", "/images/antimony/antimony3.jpg", "/images/antimony/antimony4.jpg"], answer: "ANTIMONY", },
  { images: ["/images/tellurium/tellurium1.jpg", "/images/tellurium/tellurium2.jpg", "/images/tellurium/tellurium3.jpg", "/images/tellurium/tellurium4.jpg"], answer: "TELLURIUM", },
  { images: ["/images/iodine/iodine1.jpg", "/images/iodine/iodine2.jpg", "/images/iodine/iodine3.jpg", "/images/iodine/iodine4.jpg"], answer: "IODINE", },
  { images: ["/images/xenon/xenon1.jpg", "/images/xenon/xenon2.jpg", "/images/xenon/xenon3.jpg", "/images/xenon/xenon4.jpg"], answer: "XENON", },
  { images: ["/images/cesium/cesium1.jpg", "/images/cesium/cesium2.jpg", "/images/cesium/cesium3.jpg", "/images/cesium/cesium4.jpg"], answer: "CESIUM", },
  { images: ["/images/barium/barium1.jpg", "/images/barium/barium2.jpg", "/images/barium/barium3.jpg", "/images/barium/barium4.jpg"], answer: "BARIUM", },
  { images: ["/images/lanthanum/lanthanum1.jpg", "/images/lanthanum/lanthanum2.jpg", "/images/lanthanum/lanthanum3.jpg", "/images/lanthanum/lanthanum4.jpg"], answer: "LANTHANUM", },
  { images: ["/images/cerium/cerium1.jpg", "/images/cerium/cerium2.jpg", "/images/cerium/cerium3.jpg", "/images/cerium/cerium4.jpg"], answer: "CERIUM", },
  { images: ["/images/praseodymium/praseodymium1.jpg", "/images/praseodymium/praseodymium2.jpg", "/images/praseodymium/praseodymium3.jpg", "/images/praseodymium/praseodymium4.jpg"], answer: "PRASEODYMIUM", },
  { images: ["/images/neodymium/neodymium1.jpg", "/images/neodymium/neodymium2.jpg", "/images/neodymium/neodymium3.jpg", "/images/neodymium/neodymium4.jpg"], answer: "NEODYMIUM", },
  { images: ["/images/promethium/promethium1.jpg", "/images/promethium/promethium2.jpg", "/images/promethium/promethium3.jpg", "/images/promethium/promethium4.jpg"], answer: "PROMETHIUM", },
  { images: ["/images/samarium/samarium1.jpg", "/images/samarium/samarium2.jpg", "/images/samarium/samarium3.jpg", "/images/samarium/samarium4.jpg"], answer: "SAMARIUM", },
  { images: ["/images/europium/europium1.jpg", "/images/europium/europium2.jpg", "/images/europium/europium3.jpg", "/images/europium/europium4.jpg"], answer: "EUROPIUM", },
  { images: ["/images/gadolinium/gadolinium1.jpg", "/images/gadolinium/gadolinium2.jpg", "/images/gadolinium/gadolinium3.jpg", "/images/gadolinium/gadolinium4.jpg"], answer: "GADOLINIUM", },
  { images: ["/images/terbium/terbium1.jpg", "/images/terbium/terbium2.jpg", "/images/terbium/terbium3.jpg", "/images/terbium/terbium4.jpg"], answer: "TERBIUM", },
  { images: ["/images/dysprosium/dysprosium1.jpg", "/images/dysprosium/dysprosium2.jpg", "/images/dysprosium/dysprosium3.jpg", "/images/dysprosium/dysprosium4.jpg"], answer: "DYSPROSIUM", },
  { images: ["/images/holmium/holmium1.jpg", "/images/holmium/holmium2.jpg", "/images/holmium/holmium3.jpg", "/images/holmium/holmium4.jpg"], answer: "HOLMIUM", },
  { images: ["/images/erbium/erbium1.jpg", "/images/erbium/erbium2.jpg", "/images/erbium/erbium3.jpg", "/images/erbium/erbium4.jpg"], answer: "ERBIUM", },
  { images: ["/images/thulium/thulium1.jpg", "/images/thulium/thulium2.jpg", "/images/thulium/thulium3.jpg", "/images/thulium/thulium4.jpg"], answer: "THULIUM", },
  { images: ["/images/ytterbium/ytterbium1.jpg", "/images/ytterbium/ytterbium2.jpg", "/images/ytterbium/ytterbium3.jpg", "/images/ytterbium/ytterbium4.jpg"], answer: "YTTERBIUM", },
  { images: ["/images/lutetium/lutetium1.jpg", "/images/lutetium/lutetium2.jpg", "/images/lutetium/lutetium3.jpg", "/images/lutetium/lutetium4.jpg"], answer: "LUTETIUM", },
  { images: ["/images/hafnium/hafnium1.jpg", "/images/hafnium/hafnium2.jpg", "/images/hafnium/hafnium3.jpg", "/images/hafnium/hafnium4.jpg"], answer: "HAFNIUM", },
  { images: ["/images/tantalum/tantalum1.jpg", "/images/tantalum/tantalum2.jpg", "/images/tantalum/tantalum3.jpg", "/images/tantalum/tantalum4.jpg"], answer: "TANTALUM", },
  { images: ["/images/tungsten/tungsten1.jpg", "/images/tungsten/tungsten2.jpg", "/images/tungsten/tungsten3.jpg", "/images/tungsten/tungsten4.jpg"], answer: "TUNGSTEN", },
  { images: ["/images/rhenium/rhenium1.jpg", "/images/rhenium/rhenium2.jpg", "/images/rhenium/rhenium3.jpg", "/images/rhenium/rhenium4.jpg"], answer: "RHENIUM", },
  { images: ["/images/osmium/osmium1.jpg", "/images/osmium/osmium2.jpg", "/images/osmium/osmium3.jpg", "/images/osmium/osmium4.jpg"], answer: "OSMIUM", },
  { images: ["/images/iridium/iridium1.jpg", "/images/iridium/iridium2.jpg", "/images/iridium/iridium3.jpg", "/images/iridium/iridium4.jpg"], answer: "IRIDIUM", },
  { images: ["/images/platinum/platinum1.jpg", "/images/platinum/platinum2.jpg", "/images/platinum/platinum3.jpg", "/images/platinum/platinum4.jpg"], answer: "PLATINUM", },
  { images: ["/images/mercury/mercury1.jpg", "/images/mercury/mercury2.jpg", "/images/mercury/mercury3.jpg", "/images/mercury/mercury4.jpg"], answer: "MERCURY", },
  { images: ["/images/thallium/thallium1.jpg", "/images/thallium/thallium2.jpg", "/images/thallium/thallium3.jpg", "/images/thallium/thallium4.jpg"], answer: "THALLIUM", },
  { images: ["/images/lead/lead1.jpg", "/images/lead/lead2.jpg", "/images/lead/lead3.jpg", "/images/lead/lead4.jpg"], answer: "LEAD", },
  { images: ["/images/bismuth/bismuth1.jpg", "/images/bismuth/bismuth2.jpg", "/images/bismuth/bismuth3.jpg", "/images/bismuth/bismuth4.jpg"], answer: "BISMUTH", },
  { images: ["/images/polonium/polonium1.jpg", "/images/polonium/polonium2.jpg", "/images/polonium/polonium3.jpg", "/images/polonium/polonium4.jpg"], answer: "POLONIUM", },
  { images: ["/images/radon/radon1.jpg", "/images/radon/radon2.jpg", "/images/radon/radon3.jpg", "/images/radon/radon4.jpg"], answer: "RADON", },
  { images: ["/images/francium/francium1.jpg", "/images/francium/francium2.jpg", "/images/francium/francium3.jpg", "/images/francium/francium4.jpg"], answer: "FRANCIUM", },
  { images: ["/images/radium/radium1.jpg", "/images/radium/radium2.jpg", "/images/radium/radium3.jpg", "/images/radium/radium4.jpg"], answer: "RADIUM", },
  { images: ["/images/actinium/actinium1.jpg", "/images/actinium/actinium2.jpg", "/images/actinium/actinium3.jpg", "/images/actinium/actinium4.jpg"], answer: "ACTINIUM", },
  { images: ["/images/thorium/thorium1.jpg", "/images/thorium/thorium2.jpg", "/images/thorium/thorium3.jpg", "/images/thorium/thorium4.jpg"], answer: "THORIUM", },
  { images: ["/images/protactinium/protactinium1.jpg", "/images/protactinium/protactinium2.jpg", "/images/protactinium/protactinium3.jpg", "/images/protactinium/protactinium4.jpg"], answer: "PROTACTINIUM", },
  { images: ["/images/uranium/uranium1.jpg", "/images/uranium/uranium2.jpg", "/images/uranium/uranium3.jpg", "/images/uranium/uranium4.jpg"], answer: "URANIUM", },
  { images: ["/images/neptunium/neptunium1.jpg", "/images/neptunium/neptunium2.jpg", "/images/neptunium/neptunium3.jpg", "/images/neptunium/neptunium4.jpg"], answer: "NEPTUNIUM", },
  { images: ["/images/plutonium/plutonium1.jpg", "/images/plutonium/plutonium2.jpg", "/images/plutonium/plutonium3.jpg", "/images/plutonium/plutonium4.jpg"], answer: "PLUTONIUM", },
  { images: ["/images/americium/americium1.jpg", "/images/americium/americium2.jpg", "/images/americium/americium3.jpg", "/images/americium/americium4.jpg"], answer: "AMERICIUM", },
  { images: ["/images/curium/curium1.jpg", "/images/curium/curium2.jpg", "/images/curium/curium3.jpg", "/images/curium/curium4.jpg"], answer: "CURIUM", },
  { images: ["/images/berkelium/berkelium1.jpg", "/images/berkelium/berkelium2.jpg", "/images/berkelium/berkelium3.jpg", "/images/berkelium/berkelium4.jpg"], answer: "BERKELIUM", },
  { images: ["/images/californium/californium1.jpg", "/images/californium/californium2.jpg", "/images/californium/californium3.jpg", "/images/californium/californium4.jpg"], answer: "CALIFORNIUM", },
  { images: ["/images/fermium/fermium1.jpg", "/images/fermium/fermium2.jpg", "/images/fermium/fermium3.jpg", "/images/fermium/fermium4.jpg"], answer: "FERMIUM", },
  { images: ["/images/mendelevium/mendelevium1.jpg", "/images/mendelevium/mendelevium2.jpg", "/images/mendelevium/mendelevium3.jpg", "/images/mendelevium/mendelevium4.jpg"], answer: "MENDELEVIUM", },
  { images: ["/images/nobelium/nobelium1.jpg", "/images/nobelium/nobelium2.jpg", "/images/nobelium/nobelium3.jpg", "/images/nobelium/nobelium4.jpg"], answer: "NOBELIUM", },
  { images: ["/images/lawrencium/lawrencium1.jpg", "/images/lawrencium/lawrencium2.jpg", "/images/lawrencium/lawrencium3.jpg", "/images/lawrencium/lawrencium4.jpg"], answer: "LAWRENCIUM", },
  { images: ["/images/dubnium/dubnium1.jpg", "/images/dubnium/dubnium2.jpg", "/images/dubnium/dubnium3.jpg", "/images/dubnium/dubnium4.jpg"], answer: "DUBNIUM", },
  { images: ["/images/rutherfordium/rutherfordium1.jpg", "/images/rutherfordium/rutherfordium2.jpg", "/images/rutherfordium/rutherfordium3.jpg", "/images/rutherfordium/rutherfordium4.jpg"], answer: "RUTHERFORDIUM", },
  { images: ["/images/seaborgium/seaborgium1.jpg", "/images/seaborgium/seaborgium2.jpg", "/images/seaborgium/seaborgium3.jpg", "/images/seaborgium/seaborgium4.jpg"], answer: "SEABORGIUM", },
  { images: ["/images/bohrium/bohrium1.jpg", "/images/bohrium/bohrium2.jpg", "/images/bohrium/bohrium3.jpg", "/images/bohrium/bohrium4.jpg"], answer: "BOHRIUM", },
  { images: ["/images/hassium/hassium1.jpg", "/images/hassium/hassium2.jpg", "/images/hassium/hassium3.jpg", "/images/hassium/hassium4.jpg"], answer: "HASSIUM", },
  { images: ["/images/meitnerium/meitnerium1.jpg", "/images/meitnerium/meitnerium2.jpg", "/images/meitnerium/meitnerium3.jpg", "/images/meitnerium/meitnerium4.jpg"], answer: "MEITNERIUM", },
  { images: ["/images/darmstadtium/darmstadtium1.jpg", "/images/darmstadtium/darmstadtium2.jpg", "/images/darmstadtium/darmstadtium3.jpg", "/images/darmstadtium/darmstadtium4.jpg"], answer: "DARMSTADTIUM", },
  { images: ["/images/roentgenium/roentgenium1.jpg", "/images/roentgenium/roentgenium2.jpg", "/images/roentgenium/roentgenium3.jpg", "/images/roentgenium/roentgenium4.jpg"], answer: "ROENTGENIUM", },
  { images: ["/images/copernicium/copernicium1.jpg", "/images/copernicium/copernicium2.jpg", "/images/copernicium/copernicium3.jpg", "/images/copernicium/copernicium4.jpg"], answer: "COPERNICIUM", },
  { images: ["/images/nihonium/nihonium1.jpg", "/images/nihonium/nihonium2.jpg", "/images/nihonium/nihonium3.jpg", "/images/nihonium/nihonium4.jpg"], answer: "NIHONIUM", },
  { images: ["/images/flerovium/flerovium1.jpg", "/images/flerovium/flerovium2.jpg", "/images/flerovium/flerovium3.jpg", "/images/flerovium/flerovium4.jpg"], answer: "FLEROVIUM", },
  { images: ["/images/moscovium/moscovium1.jpg", "/images/moscovium/moscovium2.jpg", "/images/moscovium/moscovium3.jpg", "/images/moscovium/moscovium4.jpg"], answer: "MOSCOVIUM", },
  { images: ["/images/livermorium/livermorium1.jpg", "/images/livermorium/livermorium2.jpg", "/images/livermorium/livermorium3.jpg", "/images/livermorium/livermorium4.jpg"], answer: "LIVERMORIUM", },
  { images: ["/images/tennessine/tennessine1.jpg", "/images/tennessine/tennessine2.jpg", "/images/tennessine/tennessine3.jpg", "/images/tennessine/tennessine4.jpg"], answer: "TENNESSINE", },
  { images: ["/images/oganesson/oganesson1.jpg", "/images/oganesson/oganesson2.jpg", "/images/oganesson/oganesson3.jpg", "/images/oganesson/oganesson4.jpg"], answer: "OGANESSON", },
];

const TOTAL_GAME_TIME = 900;

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateLetters(answer) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let pool = answer.split("");
  while (pool.length < 12) {
    pool.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  return shuffleArray(pool);
}

export default function TimeTrial() {
  const navigate = useNavigate();
  const [questions] = useState(() => shuffleArray(quizData));
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_GAME_TIME);
  const [score, setScore] = useState(0);

  const [answered, setAnswered] = useState(Array(quizData.length).fill(false));
  const [hintsLeft, setHintsLeft] = useState(5);
  const [firstPassUsed, setFirstPassUsed] = useState(false);

  const currentQuiz = questions[current];
  const [guess, setGuess] = useState(Array(currentQuiz.answer.length).fill(""));
  const [letters, setLetters] = useState(generateLetters(currentQuiz.answer));

  const [isStarting, setIsStarting] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const [feedback, setFeedback] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [activeModal, setActiveModal] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const showFeedback = (msg, color) => {
    setFeedback({ msg, color });
    setTimeout(() => setFeedback(null), 1200);
  };

  const saveScoreToLeaderboard = async (answeredQuestions) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      let username = "Anonymous";
      let profilePic = "https://via.placeholder.com/50";
      if (snapshot.exists()) {
        if (snapshot.val().username) username = snapshot.val().username;
        if (snapshot.val().profilePic) profilePic = snapshot.val().profilePic;
      }

      const totalTimeTaken = TOTAL_GAME_TIME - timeLeft;
      const leaderboardRef = ref(db, `leaderboards/timeTrialEasy/${user.uid}`);
      const leaderboardSnap = await get(leaderboardRef);
      const oldData = leaderboardSnap.exists() ? leaderboardSnap.val() : {};
      const updatedGamesPlayed = (oldData.gamesPlayed || 0) + 1;

      await set(leaderboardRef, {
        uid: user.uid,
        name: username,
        email: user.email,
        profilePic,
        score,
        gamesPlayed: updatedGamesPlayed,
        totalTimeTaken,
        timestamp: Date.now(),
      });

      console.log("✅ Score saved to leaderboard!");
    } catch (err) {
      console.error("❌ Error saving score:", err);
    }
  };

  // ⏳ Intro screen timing
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
    const endTimer = setTimeout(() => setIsStarting(false), 4500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  // 🕒 Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const saveScoreToHistory = async (answeredQuestions) => {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        let username = "Anonymous";
        let profilePic = "https://via.placeholder.com/50";
        if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.username) username = data.username;
        if (data.profilePic) profilePic = data.profilePic;
        }

        const totalTimeTaken = TOTAL_GAME_TIME - timeLeft;

        // ✅ Use push() to create a unique entry for each game
        const historyRef = ref(db, `history/Classic/${user.uid}`);
        const newEntryRef = push(historyRef);

        await set(newEntryRef, {
        uid: user.uid,
        name: username,
        email: user.email,
        profilePic,
        score,
        totalTimeTaken,
        timestamp: Date.now(),
        answeredQuestions: answeredQuestions || [],
        });

        console.log("✅ Score added to history!");
    } catch (err) {
        console.error("❌ Error saving score:", err);
    }
    };

  useEffect(() => {
    if (isGameOver) {
      const answeredQuestions = answered.filter((a) => a).length;
      saveScoreToLeaderboard(answeredQuestions);
      saveScoreToHistory(answeredQuestions)
      setActiveModal("gameover"); // ✅ FIXED HERE
    }
  }, [isGameOver]);

  const fetchLeaderboard = async () => {
    try {
      const db = getDatabase();
      const snapshot = await get(ref(db, "leaderboards/timeTrialEasy"));
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        const sorted = data.sort((a, b) => b.score - a.score);
        setLeaderboardData(sorted);
      }
    } catch (err) {
      console.error("❌ Error fetching leaderboard:", err);
    }
  };

  // ✅ Fix: remove auto-show menu — player must click
  useEffect(() => {
    if (isGameOver) {
      setShowOptions(false);
    }
  }, [isGameOver]);

  // Reset for new question
  useEffect(() => {
    setGuess(Array(currentQuiz.answer.length).fill(""));
    setLetters(generateLetters(currentQuiz.answer));
  }, [currentQuiz]);

  const handleLetterClick = (letter, index) => {
    const emptyIndex = guess.indexOf("");
    if (emptyIndex !== -1) {
      const newGuess = [...guess];
      newGuess[emptyIndex] = letter;
      setGuess(newGuess);

      const newLetters = [...letters];
      newLetters[index] = null;
      setLetters(newLetters);
    }
  };

  const handleRemoveLetter = (index) => {
    const newGuess = [...guess];
    const letter = newGuess[index];
    if (!letter) return;

    newGuess[index] = "";
    setGuess(newGuess);

    // Return the removed letter to the letters pool
    const newLetters = [...letters];
    const emptySlot = newLetters.indexOf(null);
    if (emptySlot !== -1) {
      newLetters[emptySlot] = letter;
    } else {
      newLetters.push(letter);
    }
    setLetters(newLetters);
  };

  const useHint = () => {
    if (hintsLeft <= 0) return showFeedback("❌ No hints left!", "red");

    const correctLetters = currentQuiz.answer.split("");
    const wrongIndexes = letters
      .map((l, i) => (l && !correctLetters.includes(l) ? i : null))
      .filter((i) => i !== null);

    if (wrongIndexes.length === 0)
      return showFeedback("ℹ️ No wrong letters left!", "orange");

    const toRemove = wrongIndexes.sort(() => 0.5 - Math.random()).slice(0, 3);
    const newLetters = [...letters];
    toRemove.forEach((i) => {
      newLetters[i] = null;
    });

    setLetters(newLetters);
    setHintsLeft(hintsLeft - 1);
    showFeedback("✨ Hint used!", "limegreen");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleClear = () => {
    const newLetters = [...letters];
    guess.forEach((letter) => {
      if (letter) {
        const emptySlot = newLetters.indexOf(null);
        if (emptySlot !== -1) newLetters[emptySlot] = letter;
      }
    });
    setLetters(newLetters);
    setGuess(Array(currentQuiz.answer.length).fill(""));
  };

  const checkAnswer = () => {
    if (guess.includes("")) return showFeedback("⚠️ Fill all Answer Boxes first!", "orange");

    if (guess.join("") === currentQuiz.answer) {
      setScore((prev) => prev + 10);
      const newAnswered = [...answered];
      newAnswered[current] = true;
      setAnswered(newAnswered);
      showFeedback("+10 pts", "limegreen");
      setTimeout(() => nextRound(false), 1300);
    } else {
      setScore((prev) => {
        if (prev > 0) {
          showFeedback("-10 pts", "red");
          return Math.max(0, prev - 10);
        } else {
          showFeedback("❌ Wrong Answer!", "red");
          return prev;
        }
      });

      setLetters((prevLetters) => {
        const restored = [...prevLetters];
        guess.forEach((letter) => {
          if (letter) {
            const emptyIndex = restored.indexOf(null);
            if (emptyIndex !== -1) restored[emptyIndex] = letter;
          }
        });
        return restored;
      });
      setGuess(Array(currentQuiz.answer.length).fill(""));
    }
  };

  const nextRound = (isPass = false) => {
    if (isPass) {
      if (score <= 0) return showFeedback("❌ Not enough points to pass!", "red");
      if (!firstPassUsed) setFirstPassUsed(true);
      setScore((prev) => Math.max(0, prev - 5));
      showFeedback("-5 pts (Pass)", "orange");
      goToNext();
    } else goToNext();
  };

  const goToNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
    else setIsGameOver(true);
  };

  const previousRound = () => {
    let prevIndex = current - 1;
    while (prevIndex >= 0) {
      if (!answered[prevIndex]) {
        setCurrent(prevIndex);
        return;
      }
      prevIndex--;
    }
    showFeedback("ℹ️ No previous unanswered questions!", "orange");
  };

  const handleExit = () => {
    navigate(-1);
  };

  // const handleBack = () => navigate(-1);
  // const handleRestart = () => window.location.reload();
  // const handleLeaderboard = () => navigate("/leaderboard");

  if (isStarting) {
    return (
      <div className="time-trial-container">
        <BackgroundVideo />
        <h1 className={`time-trial-title ${fadeOut ? "fade-out" : "fade-in"}`}>
          ⚡ Chemistry Time Trial ⚡
        </h1>
        <p className={`subtitle ${fadeOut ? "fade-out" : "fade-in"}`}>Get ready...</p>
      </div>
    );
  }

  return (
    <div className="time-trial-container">
      <BackgroundVideo />
      <div className="top-buttons" style={{ position: "fixed", top: "10px", left: "10px", zIndex: 999 }}>
        <button className="exit-btn" onClick={handleExit}
          style={{
            fontSize: "1.5rem", padding: "10px 15px", borderRadius: "8px",
            background: "transparent", color: "#fff", fontWeight: "bold", cursor: "pointer",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          ←
        </button>
      </div>

      <div className="game-ui">
        <h1 className="time-trial-title">Chemistry Time Trial</h1>

        <div className="current-state-container">
          <p className="timer">Time Left: {formatTime(timeLeft)}</p>
          <p className="score">Score: {score}</p>
        </div>

        {feedback && (
          <div
            className="feedback-text"
            style={{
              position: "absolute",
              top: "120px",
              left: "50%",
              transform: "translateX(-50%)",
              color: feedback.color,
              fontSize: "28px",
              fontWeight: "bold",
              animation: "floatUp 1.2s ease-out",
              pointerEvents: "none",
              textShadow: "2px 2px 6px black",
            }}
          >
            {feedback.msg}
          </div>
        )}

        <div className="images-gridd">
          {currentQuiz.images.map((img, i) => (
            <img key={i} src={img} alt="chemistry clue" />
          ))}
        </div>

        <div className="answer-box">
          {guess.map((l, i) => (
            <span key={i} className="letter" onClick={() => handleRemoveLetter(i)}>
              {l || "_"}
            </span>
          ))}
        </div>

        <div className="letters-grid">
          {letters.map((letter, i) => (
            <button key={i} disabled={!letter} onClick={() => handleLetterClick(letter, i)}>
              {letter || ""}
            </button>
          ))}
        </div>

        <div className="ccontrols">
          <button onClick={checkAnswer}>Submit</button>
          <button onClick={handleClear}>Clear</button>
          <button onClick={() => nextRound(true)}>Pass</button>
          <button onClick={previousRound}>Previous</button>
          <button className="hint-btn" onClick={useHint}>
            <span className="material-symbols-outlined">lightbulb</span> Hint {hintsLeft}
          </button>
        </div>
      </div>

      {/* --- Game Over Modal --- */}
      {isGameOver && activeModal === "gameover" && (
        <div className="game-over-modal" style={{ zIndex: 20 }}>
          <div className="modal-content">
            <h1>Game Over!</h1>
            <p>Final Score: {score}</p>
            <p>Answered Questions: {answered.filter(a => a).length}</p>
            <div className="modal-buttons">
              <button
                className="btn try-again"
                onClick={() => {
                  setTimeLeft(TOTAL_GAME_TIME);
                  setScore(0);
                  setDisplayedScore(0);
                  setQuestionCount(0);
                  setIsGameOver(false);
                  setActiveModal(null);
                  setAnswered(Array(quizData.length).fill(false));
                  setCurrent(0);
                }}
              >
                Try Again
              </button>
              <button className="btn menu" onClick={() => navigate(-1)}>
                Back to Menu
              </button>
              <button
                className="btn leaderboard"
                onClick={() => {
                  fetchLeaderboard();
                  setActiveModal("leaderboard");
                }}
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Leaderboard Modal --- */}
      {isGameOver && activeModal === "leaderboard" && (
        <div className="leaderboard-modal" style={{ zIndex: 20 }}>
          <div className="modal-content leaderboard-content">
            <h2>Leaderboard</h2>
            <div className="leaderboard-top3">
              {leaderboardData[1] && (
                <div className="podium silver">
                  <div className="avatar">
                    <img src={leaderboardData[1].profilePic} alt="" />
                  </div>
                  <p className="name">{leaderboardData[1].name}</p>
                  <p className="score">Score: {leaderboardData[1].score}</p>
                  <p className="username">{leaderboardData[1].email}</p>
                </div>
              )}
              {leaderboardData[0] && (
                <div className="podium gold">
                  <div className="crown">👑</div>
                  <div className="avatar">
                    <img src={leaderboardData[0].profilePic} alt="" />
                  </div>
                  <p className="name">{leaderboardData[0].name}</p>
                  <p className="score">Score: {leaderboardData[0].score}</p>
                  <p className="username">{leaderboardData[0].email}</p>
                </div>
              )}
              {leaderboardData[2] && (
                <div className="podium bronze">
                  <div className="avatar">
                    <img src={leaderboardData[2].profilePic} alt="" />
                  </div>
                  <p className="name">{leaderboardData[2].name}</p>
                  <p className="score">Score: {leaderboardData[2].score}</p>
                  <p className="username">{leaderboardData[2].email}</p>
                </div>
              )}
            </div>

            <div className="leaderboard-list">
              {leaderboardData.slice(3).map((player, idx) => (
                <div key={idx} className="leaderboard-row">
                  <img src={player.profilePic} alt="" />
                  <div className="info">
                    <p className="username">{player.email}</p>
                  </div>
                  <p className="score">{player.score}</p>
                </div>
              ))}
            </div>

            <button className="btn close" onClick={() => setActiveModal("gameover")}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
