import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Medium.css";
import BackgroundVideo from "../components/BackgroundVideo"
import Swal from "sweetalert2";

const quizData = [
  { images: ["/images/hydrogen/hydrogen1.jpg", "/images/hydrogen/hydrogen2.jpg", "/images/hydrogen/hydrogen3.jpg"], answer: "HYDROGEN" },
  { images: ["/images/helium/helium1.jpg", "/images/helium/helium2.jpg", "/images/helium/helium3.jpg"], answer: "HELIUM" },
  { images: ["/images/lithium/lithium1.jpg", "/images/lithium/lithium2.jpg", "/images/lithium/lithium3.jpg"], answer: "LITHIUM" },
  { images: ["/images/beryllium/beryllium1.jpg", "/images/beryllium/beryllium2.jpg", "/images/beryllium/beryllium3.jpg"], answer: "BERYLLIUM" },
  { images: ["/images/boron/boron1.jpg", "/images/boron/boron2.jpg", "/images/boron/boron3.jpg"], answer: "BORON" },
  { images: ["/images/carbon/carbon1.jpg", "/images/carbon/carbon2.jpg", "/images/carbon/carbon3.jpg"], answer: "CARBON" },
  { images: ["/images/nitrogen/nitrogen1.jpg", "/images/nitrogen/nitrogen2.jpg", "/images/nitrogen/nitrogen3.jpg"], answer: "NITROGEN" },
  { images: ["/images/oxygen/oxygen1.jpg", "/images/oxygen/oxygen2.jpg", "/images/oxygen/oxygen3.jpg"], answer: "OXYGEN" },
  { images: ["/images/fluorine/fluorine1.jpg", "/images/fluorine/fluorine2.jpg", "/images/fluorine/fluorine3.jpg"], answer: "FLUORINE" },
  { images: ["/images/neon/neon1.jpg", "/images/neon/neon2.jpg", "/images/neon/neon3.jpg"], answer: "NEON" },
  { images: ["/images/sodium/sodium1.jpg", "/images/sodium/sodium2.jpg", "/images/sodium/sodium3.jpg"], answer: "SODIUM" },
  { images: ["/images/magnesium/magnesium1.jpg", "/images/magnesium/magnesium2.jpg", "/images/magnesium/magnesium3.jpg"], answer: "MAGNESIUM" },
  { images: ["/images/aluminium/aluminium1.jpg", "/images/aluminium/aluminium2.jpg", "/images/aluminium/aluminium3.jpg"], answer: "ALUMINIUM" },
  { images: ["/images/silicon/silicon1.jpg", "/images/silicon/silicon2.jpg", "/images/silicon/silicon3.jpg"], answer: "SILICON" },
  { images: ["/images/phosphorus/phosphorus1.jpg", "/images/phosphorus/phosphorus2.jpg", "/images/phosphorus/phosphorus3.jpg"], answer: "PHOSPHORUS" },
  { images: ["/images/sulfur/sulfur1.jpg", "/images/sulfur/sulfur2.jpg", "/images/sulfur/sulfur3.jpg"], answer: "SULFUR" },
  { images: ["/images/chlorine/chlorine1.jpg", "/images/chlorine/chlorine2.jpg", "/images/chlorine/chlorine3.jpg"], answer: "CHLORINE" },
  { images: ["/images/argon/argon1.jpg", "/images/argon/argon2.jpg", "/images/argon/argon3.jpg"], answer: "ARGON" },
  { images: ["/images/potassium/potassium1.jpg", "/images/potassium/potassium2.jpg", "/images/potassium/potassium3.jpg"], answer: "POTASSIUM" },
  { images: ["/images/calcium/calcium1.jpg", "/images/calcium/calcium2.jpg", "/images/calcium/calcium3.jpg"], answer: "CALCIUM" },
  { images: ["/images/scandium/scandium1.jpg", "/images/scandium/scandium2.jpg", "/images/scandium/scandium3.jpg"], answer: "SCANDIUM" },
  { images: ["/images/titanium/titanium1.jpg", "/images/titanium/titanium2.jpg", "/images/titanium/titanium3.jpg"], answer: "TITANIUM" },
  { images: ["/images/vanadium/vanadium1.jpg", "/images/vanadium/vanadium2.jpg", "/images/vanadium/vanadium3.jpg"], answer: "VANADIUM" },
  { images: ["/images/chromium/chromium1.jpg", "/images/chromium/chromium2.jpg", "/images/chromium/chromium3.jpg"], answer: "CHROMIUM" },
  { images: ["/images/manganese/manganese1.jpg", "/images/manganese/manganese2.jpg", "/images/manganese/manganese3.jpg"], answer: "MANGANESE" },
  { images: ["/images/iron/iron1.jpg", "/images/iron/iron2.jpg", "/images/iron/iron3.jpg"], answer: "IRON" },
  { images: ["/images/cobalt/cobalt1.jpg", "/images/cobalt/cobalt2.jpg", "/images/cobalt/cobalt3.jpg"], answer: "COBALT" },
  { images: ["/images/nickel/nickel1.jpg", "/images/nickel/nickel2.jpg", "/images/nickel/nickel3.jpg"], answer: "NICKEL" },
  { images: ["/images/copper/copper1.jpg", "/images/copper/copper2.jpg", "/images/copper/copper3.jpg"], answer: "COPPER" },
  { images: ["/images/zinc/zinc1.jpg", "/images/zinc/zinc2.jpg", "/images/zinc/zinc3.jpg"], answer: "ZINC" },
  { images: ["/images/gallium/gallium1.jpg", "/images/gallium/gallium2.jpg", "/images/gallium/gallium3.jpg"], answer: "GALLIUM" },
  { images: ["/images/germanium/germanium1.jpg", "/images/germanium/germanium2.jpg", "/images/germanium/germanium3.jpg"], answer: "GERMANIUM" },
  { images: ["/images/arsenic/arsenic1.jpg", "/images/arsenic/arsenic2.jpg", "/images/arsenic/arsenic3.jpg"], answer: "ARSENIC" },
  { images: ["/images/selenium/selenium1.jpg", "/images/selenium/selenium2.jpg", "/images/selenium/selenium3.jpg"], answer: "SELENIUM" },
  { images: ["/images/bromine/bromine1.jpg", "/images/bromine/bromine2.jpg", "/images/bromine/bromine3.jpg"], answer: "BROMINE" },
  { images: ["/images/krypton/krypton1.jpg", "/images/krypton/krypton2.jpg", "/images/krypton/krypton3.jpg"], answer: "KRYPTON" },
  { images: ["/images/rubidium/rubidium1.jpg", "/images/rubidium/rubidium2.jpg", "/images/rubidium/rubidium3.jpg"], answer: "RUBIDIUM" },
  { images: ["/images/strontium/strontium1.jpg", "/images/strontium/strontium2.jpg", "/images/strontium/strontium3.jpg"], answer: "STRONTIUM" },
  { images: ["/images/yttrium/yttrium1.jpg", "/images/yttrium/yttrium2.jpg", "/images/yttrium/yttrium3.jpg"], answer: "YTTRIUM" },
  { images: ["/images/zirconium/zirconium1.jpg", "/images/zirconium/zirconium2.jpg", "/images/zirconium/zirconium3.jpg"], answer: "ZIRCONIUM" },
  { images: ["/images/niobium/niobium1.jpg", "/images/niobium/niobium2.jpg", "/images/niobium/niobium3.jpg"], answer: "NIOBIUM" },
  { images: ["/images/molybdenum/molybdenum1.jpg", "/images/molybdenum/molybdenum2.jpg", "/images/molybdenum/molybdenum3.jpg"], answer: "MOLYBDENUM" },
  { images: ["/images/technetium/technetium1.jpg", "/images/technetium/technetium2.jpg", "/images/technetium/technetium3.jpg"], answer: "TECHNETIUM" },
  { images: ["/images/ruthenium/ruthenium1.jpg", "/images/ruthenium/ruthenium2.jpg", "/images/ruthenium/ruthenium3.jpg"], answer: "RUTHENIUM" },
  { images: ["/images/rhodium/rhodium1.jpg", "/images/rhodium/rhodium2.jpg", "/images/rhodium/rhodium3.jpg"], answer: "RHODIUM" },
  { images: ["/images/palladium/palladium1.jpg", "/images/palladium/palladium2.jpg", "/images/palladium/palladium3.jpg"], answer: "PALLADIUM" },
  { images: ["/images/silver/silver1.jpg", "/images/silver/silver2.jpg", "/images/silver/silver3.jpg"], answer: "SILVER" },
  { images: ["/images/cadmium/cadmium1.jpg", "/images/cadmium/cadmium2.jpg", "/images/cadmium/cadmium3.jpg"], answer: "CADMIUM" },
  { images: ["/images/indium/indium1.jpg", "/images/indium/indium2.jpg", "/images/indium/indium3.jpg"], answer: "INDIUM" },
  { images: ["/images/tin/tin1.jpg", "/images/tin/tin2.jpg", "/images/tin/tin3.jpg"], answer: "TIN" },
  { images: ["/images/antimony/antimony1.jpg", "/images/antimony/antimony2.jpg", "/images/antimony/antimony3.jpg"], answer: "ANTIMONY" },
  { images: ["/images/tellurium/tellurium1.jpg", "/images/tellurium/tellurium2.jpg", "/images/tellurium/tellurium3.jpg"], answer: "TELLURIUM" },
  { images: ["/images/iodine/iodine1.jpg", "/images/iodine/iodine2.jpg", "/images/iodine/iodine3.jpg"], answer: "IODINE" },
  { images: ["/images/xenon/xenon1.jpg", "/images/xenon/xenon2.jpg", "/images/xenon/xenon3.jpg"], answer: "XENON" },
  { images: ["/images/cesium/cesium1.jpg", "/images/cesium/cesium2.jpg", "/images/cesium/cesium3.jpg"], answer: "CESIUM" },
  { images: ["/images/barium/barium1.jpg", "/images/barium/barium2.jpg", "/images/barium/barium3.jpg"], answer: "BARIUM" },
  { images: ["/images/lanthanum/lanthanum1.jpg", "/images/lanthanum/lanthanum2.jpg", "/images/lanthanum/lanthanum3.jpg"], answer: "LANTHANUM" },
  { images: ["/images/cerium/cerium1.jpg", "/images/cerium/cerium2.jpg", "/images/cerium/cerium3.jpg"], answer: "CERIUM" },
  { images: ["/images/praseodymium/praseodymium1.jpg", "/images/praseodymium/praseodymium2.jpg", "/images/praseodymium/praseodymium3.jpg"], answer: "PRASEODYMIUM" },
  { images: ["/images/neodymium/neodymium1.jpg", "/images/neodymium/neodymium2.jpg", "/images/neodymium/neodymium3.jpg"], answer: "NEODYMIUM" },
  { images: ["/images/promethium/promethium1.jpg", "/images/promethium/promethium2.jpg", "/images/promethium/promethium3.jpg"], answer: "PROMETHIUM" },
  { images: ["/images/samarium/samarium1.jpg", "/images/samarium/samarium2.jpg", "/images/samarium/samarium3.jpg"], answer: "SAMARIUM" },
  { images: ["/images/europium/europium1.jpg", "/images/europium/europium2.jpg", "/images/europium/europium3.jpg"], answer: "EUROPIUM" },
  { images: ["/images/gadolinium/gadolinium1.jpg", "/images/gadolinium/gadolinium2.jpg", "/images/gadolinium/gadolinium3.jpg"], answer: "GADOLINIUM" },
  { images: ["/images/terbium/terbium1.jpg", "/images/terbium/terbium2.jpg", "/images/terbium/terbium3.jpg"], answer: "TERBIUM" },
  { images: ["/images/dysprosium/dysprosium1.jpg", "/images/dysprosium/dysprosium2.jpg", "/images/dysprosium/dysprosium3.jpg"], answer: "DYSPROSIUM" },
  { images: ["/images/holmium/holmium1.jpg", "/images/holmium/holmium2.jpg", "/images/holmium/holmium3.jpg"], answer: "HOLMIUM" },
  { images: ["/images/erbium/erbium1.jpg", "/images/erbium/erbium2.jpg", "/images/erbium/erbium3.jpg"], answer: "ERBIUM" },
  { images: ["/images/thulium/thulium1.jpg", "/images/thulium/thulium2.jpg", "/images/thulium/thulium3.jpg"], answer: "THULIUM" },
  { images: ["/images/ytterbium/ytterbium1.jpg", "/images/ytterbium/ytterbium2.jpg", "/images/ytterbium/ytterbium3.jpg"], answer: "YTTERBIUM" },
  { images: ["/images/lutetium/lutetium1.jpg", "/images/lutetium/lutetium2.jpg", "/images/lutetium/lutetium3.jpg"], answer: "LUTETIUM" },
  { images: ["/images/hafnium/hafnium1.jpg", "/images/hafnium/hafnium2.jpg", "/images/hafnium/hafnium3.jpg"], answer: "HAFNIUM" },
  { images: ["/images/tantalum/tantalum1.jpg", "/images/tantalum/tantalum2.jpg", "/images/tantalum/tantalum3.jpg"], answer: "TANTALUM" },
  { images: ["/images/tungsten/tungsten1.jpg", "/images/tungsten/tungsten2.jpg", "/images/tungsten/tungsten3.jpg"], answer: "TUNGSTEN" },
  { images: ["/images/rhenium/rhenium1.jpg", "/images/rhenium/rhenium2.jpg", "/images/rhenium/rhenium3.jpg"], answer: "RHENIUM" },
  { images: ["/images/osmium/osmium1.jpg", "/images/osmium/osmium2.jpg", "/images/osmium/osmium3.jpg"], answer: "OSMIUM" },
  { images: ["/images/iridium/iridium1.jpg", "/images/iridium/iridium2.jpg", "/images/iridium/iridium3.jpg"], answer: "IRIDIUM" },
  { images: ["/images/platinum/platinum1.jpg", "/images/platinum/platinum2.jpg", "/images/platinum/platinum3.jpg"], answer: "PLATINUM" },
  { images: ["/images/mercury/mercury1.jpg", "/images/mercury/mercury2.jpg", "/images/mercury/mercury3.jpg"], answer: "MERCURY" },
  { images: ["/images/thallium/thallium1.jpg", "/images/thallium/thallium2.jpg", "/images/thallium/thallium3.jpg"], answer: "THALLIUM" },
  { images: ["/images/lead/lead1.jpg", "/images/lead/lead2.jpg", "/images/lead/lead3.jpg"], answer: "LEAD" },
  { images: ["/images/bismuth/bismuth1.jpg", "/images/bismuth/bismuth2.jpg", "/images/bismuth/bismuth3.jpg"], answer: "BISMUTH" },
  { images: ["/images/polonium/polonium1.jpg", "/images/polonium/polonium2.jpg", "/images/polonium/polonium3.jpg"], answer: "POLONIUM" },
  { images: ["/images/astatine/astatine1.jpg", "/images/astatine/astatine2.jpg", "/images/astatine/astatine3.jpg"], answer: "ASTATINE" },
  { images: ["/images/radon/radon1.jpg", "/images/radon/radon2.jpg", "/images/radon/radon3.jpg"], answer: "RADON" },
  { images: ["/images/francium/francium1.jpg", "/images/francium/francium2.jpg", "/images/francium/francium3.jpg"], answer: "FRANCIUM" },
  { images: ["/images/radium/radium1.jpg", "/images/radium/radium2.jpg", "/images/radium/radium3.jpg"], answer: "RADIUM" },
  { images: ["/images/actinium/actinium1.jpg", "/images/actinium/actinium2.jpg", "/images/actinium/actinium3.jpg"], answer: "ACTINIUM" },
  { images: ["/images/thorium/thorium1.jpg", "/images/thorium/thorium2.jpg", "/images/thorium/thorium3.jpg"], answer: "THORIUM" },
  { images: ["/images/protactinium/protactinium1.jpg", "/images/protactinium/protactinium2.jpg", "/images/protactinium/protactinium3.jpg"], answer: "PROTACTINIUM" },
  { images: ["/images/uranium/uranium1.jpg", "/images/uranium/uranium2.jpg", "/images/uranium/uranium3.jpg"], answer: "URANIUM" },
  { images: ["/images/neptunium/neptunium1.jpg", "/images/neptunium/neptunium2.jpg", "/images/neptunium/neptunium3.jpg"], answer: "NEPTUNIUM" },
  { images: ["/images/plutonium/plutonium1.jpg", "/images/plutonium/plutonium2.jpg", "/images/plutonium/plutonium3.jpg"], answer: "PLUTONIUM" },
  { images: ["/images/americium/americium1.jpg", "/images/americium/americium2.jpg", "/images/americium/americium3.jpg"], answer: "AMERICIUM" },
  { images: ["/images/curium/curium1.jpg", "/images/curium/curium2.jpg", "/images/curium/curium3.jpg"], answer: "CURIUM" },
  { images: ["/images/berkelium/berkelium1.jpg", "/images/berkelium/berkelium2.jpg", "/images/berkelium/berkelium3.jpg"], answer: "BERKELIUM" },
  { images: ["/images/californium/californium1.jpg", "/images/californium/californium2.jpg", "/images/californium/californium3.jpg"], answer: "CALIFORNIUM" },
  { images: ["/images/einsteinium/einsteinium1.jpg", "/images/einsteinium/einsteinium2.jpg", "/images/einsteinium/einsteinium3.jpg"], answer: "EINSTEINIUM" },
  { images: ["/images/fermium/fermium1.jpg", "/images/fermium/fermium2.jpg", "/images/fermium/fermium3.jpg"], answer: "FERMIUM" },
  { images: ["/images/menedelevium/menedelevium1.jpg", "/images/menedelevium/menedelevium2.jpg", "/images/menedelevium/menedelevium3.jpg"], answer: "MENDELEVIUM" },
  { images: ["/images/nobelium/nobelium1.jpg", "/images/nobelium/nobelium2.jpg", "/images/nobelium/nobelium3.jpg"], answer: "NOBELIUM" },
  { images: ["/images/lawrencium/lawrencium1.jpg", "/images/lawrencium/lawrencium2.jpg", "/images/lawrencium/lawrencium3.jpg"], answer: "LAWRENCIUM" },
  { images: ["/images/rutherfordium/rutherfordium1.jpg", "/images/rutherfordium/rutherfordium2.jpg", "/images/rutherfordium/rutherfordium3.jpg"], answer: "RUTHERFORDIUM" },
  { images: ["/images/dubnium/dubnium1.jpg", "/images/dubnium/dubnium2.jpg", "/images/dubnium/dubnium3.jpg"], answer: "DUBNIUM" },
  { images: ["/images/seaborgium/seaborgium1.jpg", "/images/seaborgium/seaborgium2.jpg", "/images/seaborgium/seaborgium3.jpg"], answer: "SEABORGIUM" },
  { images: ["/images/bohrium/bohrium1.jpg", "/images/bohrium/bohrium2.jpg", "/images/bohrium/bohrium3.jpg"], answer: "BOHRIUM" },
  { images: ["/images/hassium/hassium1.jpg", "/images/hassium/hassium2.jpg", "/images/hassium/hassium3.jpg"], answer: "HASSIUM" },
  { images: ["/images/meitnerium/meitnerium1.jpg", "/images/meitnerium/meitnerium2.jpg", "/images/meitnerium/meitnerium3.jpg"], answer: "MEITNERIUM" },
  { images: ["/images/darmstadtium/darmstadtium1.jpg", "/images/darmstadtium/darmstadtium2.jpg", "/images/darmstadtium/darmstadtium3.jpg"], answer: "DARMSTADTIUM" },
  { images: ["/images/roentgenium/roentgenium1.jpg", "/images/roentgenium/roentgenium2.jpg", "/images/roentgenium/roentgenium3.jpg"], answer: "ROENTGENIUM" },
  { images: ["/images/copernicium/copernicium1.jpg", "/images/copernicium/copernicium2.jpg", "/images/copernicium/copernicium3.jpg"], answer: "COPERNICIUM" },
  { images: ["/images/nihonium/nihonium1.jpg", "/images/nihonium/nihonium2.jpg", "/images/nihonium/nihonium3.jpg"], answer: "NIHONIUM" },
  { images: ["/images/flerovium/flerovium1.jpg", "/images/flerovium/flerovium2.jpg", "/images/flerovium/flerovium3.jpg"], answer: "FLEROVIUM" },
  { images: ["/images/moscovium/moscovium1.jpg", "/images/moscovium/moscovium2.jpg", "/images/moscovium/moscovium3.jpg"], answer: "MOSCOVIUM" },
  { images: ["/images/livermorium/livermorium1.jpg", "/images/livermorium/livermorium2.jpg", "/images/livermorium/livermorium3.jpg"], answer: "LIVERMORIUM" },
  { images: ["/images/tennessine/tennessine1.jpg", "/images/tennessine/tennessine2.jpg", "/images/tennessine/tennessine3.jpg"], answer: "TENNESSINE" },
  { images: ["/images/oganesson/oganesson1.jpg", "/images/oganesson/oganesson2.jpg", "/images/oganesson/oganesson3.jpg"], answer: "OGANESSON" }
];

const TOTAL_GAME_TIME = 300;

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
  const [hintsLeft, setHintsLeft] = useState(4);

  const currentQuiz = questions[current];
  const [guess, setGuess] = useState(Array(currentQuiz.answer.length).fill(""));
  const [letters, setLetters] = useState(generateLetters(currentQuiz.answer));


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);

          Swal.fire({
            icon: "warning",
            title: "⏰ Time's up!",
            text: "Game Over!",
            confirmButtonText: "Back to Menu",
            allowOutsideClick: false,
          }).then(() => {
            navigate(-1);
          });

          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

    const newLetters = [...letters];
    const firstEmpty = newLetters.indexOf(null);
    if (firstEmpty !== -1) {
      newLetters[firstEmpty] = letter;
    }
    setLetters(newLetters);
  };


  const useHint = () => {
    if (hintsLeft <= 0) {
      Swal.fire({
        icon: "error",
        title: "No hints left!",
        text: "You’ve already used all your hints.",
        confirmButtonText: "OK",
      });
      return;
    }

    const correctLetters = currentQuiz.answer.split("");
    const wrongIndexes = letters
      .map((l, i) => (l && !correctLetters.includes(l) ? i : null))
      .filter((i) => i !== null);

    if (wrongIndexes.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No wrong letters left!",
        text: "You’ve already eliminated the incorrect ones.",
        confirmButtonText: "Got it",
      });
      return;
    }

    const toRemove = wrongIndexes
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const newLetters = [...letters];
    toRemove.forEach((i) => {
      newLetters[i] = null;
    });

    setLetters(newLetters);
    setHintsLeft(hintsLeft - 1);

    Swal.fire({
      icon: "success",
      title: "Hint used!",
      text: "We’ve eliminated some wrong letters for you.",
      timer: 1500,
      showConfirmButton: false,
    });
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
    if (guess.join("") === currentQuiz.answer) {
      setScore((prev) => prev + 10);
      const newAnswered = [...answered];
      newAnswered[current] = true;
      setAnswered(newAnswered);

      Swal.fire({
        icon: "success",
        title: "✅ Correct!",
        text: "+10 points",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        nextRound(false);
      });
    } else {
      setScore((prev) => Math.max(0, prev - 10));
      Swal.fire({
        icon: "error",
        title: "❌ Wrong answer!",
        text: "-10 points",
        confirmButtonText: "Try Again",
      });
    }
  };

  const nextRound = (isPass = false) => {
    if (isPass) {
      Swal.fire({
        title: "Are you sure?",
        text: "Passing will reduce your score by 5 points!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, pass",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setScore((prev) => Math.max(0, prev - 5));
          goToNext();
        }
      });
    } else {
      goToNext();
    }
  };

  const goToNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      Swal.fire({
        title: "🎉 Game Over!",
        text: `Your final score: ${score}`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1);
      });
    }
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

    Swal.fire({
      icon: "info",
      title: "No previous unanswered questions!",
      text: "You’ve reached the start already.",
      confirmButtonText: "Okay",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="time-trial-container">
      <BackgroundVideo></BackgroundVideo>
      <button className="back-btn" onClick={handleBack}>
        ←
      </button>
      <h1>⏱   Chemistry Time Trial</h1>
      <p className="timer">Time Left: {formatTime(timeLeft)}</p>
      <p className="score">Score: {score}</p>

      <div className="images">
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
        <button className="hint-btn" onClick={useHint}>💡 Hint {hintsLeft}</button>
      </div>
    </div>
  );
}
