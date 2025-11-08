import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Survival.css";
import BackgroundVideo from "../components/BackgroundVideo";
import another_elements from "../assets/periodic-table.json"
import Swal from "sweetalert2";
import { auth } from "../configs/FirebaseConfig";
import { getDatabase, ref, get, set, onValue } from "firebase/database";


const elements = [
    { name: "Hydrogen", symbol: "H", number: 1 },
    { name: "Helium", symbol: "He", number: 2 },
    { name: "Lithium", symbol: "Li", number: 3 },
    { name: "Beryllium", symbol: "Be", number: 4 },
    { name: "Boron", symbol: "B", number: 5 },
    { name: "Carbon", symbol: "C", number: 6 },
    { name: "Nitrogen", symbol: "N", number: 7 },
    { name: "Oxygen", symbol: "O", number: 8 },
    { name: "Fluorine", symbol: "F", number: 9 },
    { name: "Neon", symbol: "Ne", number: 10 },
    { name: "Sodium", symbol: "Na", number: 11 },
    { name: "Magnesium", symbol: "Mg", number: 12 },
    { name: "Aluminum", symbol: "Al", number: 13 },
    { name: "Silicon", symbol: "Si", number: 14 },
    { name: "Phosphorus", symbol: "P", number: 15 },
    { name: "Sulfur", symbol: "S", number: 16 },
    { name: "Chlorine", symbol: "Cl", number: 17 },
    { name: "Argon", symbol: "Ar", number: 18 },
    { name: "Potassium", symbol: "K", number: 19 },
    { name: "Calcium", symbol: "Ca", number: 20 },
    { name: "Scandium", symbol: "Sc", number: 21 },
    { name: "Titanium", symbol: "Ti", number: 22 },
    { name: "Vanadium", symbol: "V", number: 23 },
    { name: "Chromium", symbol: "Cr", number: 24 },
    { name: "Manganese", symbol: "Mn", number: 25 },
    { name: "Iron", symbol: "Fe", number: 26 },
    { name: "Cobalt", symbol: "Co", number: 27 },
    { name: "Nickel", symbol: "Ni", number: 28 },
    { name: "Copper", symbol: "Cu", number: 29 },
    { name: "Zinc", symbol: "Zn", number: 30 },
    { name: "Gallium", symbol: "Ga", number: 31 },
    { name: "Germanium", symbol: "Ge", number: 32 },
    { name: "Arsenic", symbol: "As", number: 33 },
    { name: "Selenium", symbol: "Se", number: 34 },
    { name: "Bromine", symbol: "Br", number: 35 },
    { name: "Krypton", symbol: "Kr", number: 36 },
    { name: "Rubidium", symbol: "Rb", number: 37 },
    { name: "Strontium", symbol: "Sr", number: 38 },
    { name: "Yttrium", symbol: "Y", number: 39 },
    { name: "Zirconium", symbol: "Zr", number: 40 },
    { name: "Niobium", symbol: "Nb", number: 41 },
    { name: "Molybdenum", symbol: "Mo", number: 42 },
    { name: "Technetium", symbol: "Tc", number: 43 },
    { name: "Ruthenium", symbol: "Ru", number: 44 },
    { name: "Rhodium", symbol: "Rh", number: 45 },
    { name: "Palladium", symbol: "Pd", number: 46 },
    { name: "Silver", symbol: "Ag", number: 47 },
    { name: "Cadmium", symbol: "Cd", number: 48 },
    { name: "Indium", symbol: "In", number: 49 },
    { name: "Tin", symbol: "Sn", number: 50 },
    { name: "Antimony", symbol: "Sb", number: 51 },
    { name: "Tellurium", symbol: "Te", number: 52 },
    { name: "Iodine", symbol: "I", number: 53 },
    { name: "Xenon", symbol: "Xe", number: 54 },
    { name: "Cesium", symbol: "Cs", number: 55 },
    { name: "Barium", symbol: "Ba", number: 56 },
    { name: "Lanthanum", symbol: "La", number: 57 },
    { name: "Cerium", symbol: "Ce", number: 58 },
    { name: "Praseodymium", symbol: "Pr", number: 59 },
    { name: "Neodymium", symbol: "Nd", number: 60 },
    { name: "Promethium", symbol: "Pm", number: 61 },
    { name: "Samarium", symbol: "Sm", number: 62 },
    { name: "Europium", symbol: "Eu", number: 63 },
    { name: "Gadolinium", symbol: "Gd", number: 64 },
    { name: "Terbium", symbol: "Tb", number: 65 },
    { name: "Dysprosium", symbol: "Dy", number: 66 },
    { name: "Holmium", symbol: "Ho", number: 67 },
    { name: "Erbium", symbol: "Er", number: 68 },
    { name: "Thulium", symbol: "Tm", number: 69 },
    { name: "Ytterbium", symbol: "Yb", number: 70 },
    { name: "Lutetium", symbol: "Lu", number: 71 },
    { name: "Hafnium", symbol: "Hf", number: 72 },
    { name: "Tantalum", symbol: "Ta", number: 73 },
    { name: "Tungsten", symbol: "W", number: 74 },
    { name: "Rhenium", symbol: "Re", number: 75 },
    { name: "Osmium", symbol: "Os", number: 76 },
    { name: "Iridium", symbol: "Ir", number: 77 },
    { name: "Platinum", symbol: "Pt", number: 78 },
    { name: "Gold", symbol: "Au", number: 79 },
    { name: "Mercury", symbol: "Hg", number: 80 },
    { name: "Thallium", symbol: "Tl", number: 81 },
    { name: "Lead", symbol: "Pb", number: 82 },
    { name: "Bismuth", symbol: "Bi", number: 83 },
    { name: "Polonium", symbol: "Po", number: 84 },
    { name: "Astatine", symbol: "At", number: 85 },
    { name: "Radon", symbol: "Rn", number: 86 },
    { name: "Francium", symbol: "Fr", number: 87 },
    { name: "Radium", symbol: "Ra", number: 88 },
    { name: "Actinium", symbol: "Ac", number: 89 },
    { name: "Thorium", symbol: "Th", number: 90 },
    { name: "Protactinium", symbol: "Pa", number: 91 },
    { name: "Uranium", symbol: "U", number: 92 },
    { name: "Neptunium", symbol: "Np", number: 93 },
    { name: "Plutonium", symbol: "Pu", number: 94 },
    { name: "Americium", symbol: "Am", number: 95 },
    { name: "Curium", symbol: "Cm", number: 96 },
    { name: "Berkelium", symbol: "Bk", number: 97 },
    { name: "Californium", symbol: "Cf", number: 98 },
    { name: "Einsteinium", symbol: "Es", number: 99 },
    { name: "Fermium", symbol: "Fm", number: 100 },
    { name: "Mendelevium", symbol: "Md", number: 101 },
    { name: "Nobelium", symbol: "No", number: 102 },
    { name: "Lawrencium", symbol: "Lr", number: 103 },
    { name: "Rutherfordium", symbol: "Rf", number: 104 },
    { name: "Dubnium", symbol: "Db", number: 105 },
    { name: "Seaborgium", symbol: "Sg", number: 106 },
    { name: "Bohrium", symbol: "Bh", number: 107 },
    { name: "Hassium", symbol: "Hs", number: 108 },
    { name: "Meitnerium", symbol: "Mt", number: 109 },
    { name: "Darmstadtium", symbol: "Ds", number: 110 },
    { name: "Roentgenium", symbol: "Rg", number: 111 },
    { name: "Copernicium", symbol: "Cn", number: 112 },
    { name: "Nihonium", symbol: "Nh", number: 113 },
    { name: "Flerovium", symbol: "Fl", number: 114 },
    { name: "Moscovium", symbol: "Mc", number: 115 },
    { name: "Livermorium", symbol: "Lv", number: 116 },
    { name: "Tennessine", symbol: "Ts", number: 117 },
    { name: "Oganesson", symbol: "Og", number: 118 }
];

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

// --- Helper Functions ---
function getRandomElement() {
    return elements[Math.floor(Math.random() * elements.length)];
}

function getRandomMissingFields() {
    const fields = ["name", "symbol"];
    const shuffled = fields.sort(() => 0.5 - Math.random());
    return [shuffled[0]];
}

function getElementImage(elementName) {
    const data = quizData.find(
        (item) => item.answer.toUpperCase() === elementName.toUpperCase()
    );
    if (data) {
        return data.images[Math.floor(Math.random() * data.images.length)];
    }
    return null;
}

const Survival = () => {
    const navigate = useNavigate();

    // --- Game States ---
    const [isStarting, setIsStarting] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const [hp, setHp] = useState(100);
    const [score, setScore] = useState(0);
    const [displayedScore, setDisplayedScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [feedback, setFeedback] = useState(null);
    const [isGameOver, setIsGameOver] = useState(false);

    const [answer, setAnswer] = useState("");
    const [activeModal, setActiveModal] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);

    // --- Falling Cards ---
    const [fallingCards, setFallingCards] = useState([]);
    const columns = [10, 30, 50, 70, 86];
    const maxFalling = 10;
    const minDistance = 120;

    // constants for overlap control
    const CARD_HEIGHT = 300;
    const SAFE_VERTICAL_GAP = CARD_HEIGHT * 1.2;

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

            // ✅ Now get the leaderboard entry for this user
            const leaderboardRef = ref(db, `leaderboards/normalSurvival/${user.uid}`);
            const leaderboardSnap = await get(leaderboardRef);
            const oldData = leaderboardSnap.exists() ? leaderboardSnap.val() : {};

            // ✅ Increment games played safely
            const updatedGamesPlayed = (oldData.gamesPlayed || 0) + 1;

            // ✅ Save the new score and updated gamesPlayed
            await set(leaderboardRef, {
                uid: user.uid,
                name: username,
                email: user.email,
                profilePic,
                score,
                gamesPlayed: updatedGamesPlayed,
                questions: answeredQuestions,
                timestamp: Date.now(),
            });

            console.log("✅ Score saved to leaderboard!");
        } catch (err) {
            console.error("❌ Error saving score:", err);
        }
    };

    // --- Utilities ---
    const showFeedback = (msg, color = "white") => {
        setFeedback({ msg, color });
        setTimeout(() => setFeedback(null), 1200);
    };

    // --- Position Helper (No Overlap) ---
    const isSpaceFree = (x, y = -220) => {
        return !fallingCards.some(card => {
            const verticalDistance = Math.abs(card.y - y);
            const horizontalDistance = Math.abs(card.x - x);
            return horizontalDistance < minDistance && verticalDistance < SAFE_VERTICAL_GAP;
        });
    };

    // --- Spawning Cards ---
    const spawnFallingCard = () => {
        setFallingCards(prev => {
            if (prev.length >= maxFalling) return prev;

            const availableColumns = columns.filter(col => {
                return !prev.some(card => {
                    const verticalDistance = Math.abs(card.y - (-220));
                    const horizontalDistance = Math.abs(card.x - col);
                    return horizontalDistance < minDistance && verticalDistance < SAFE_VERTICAL_GAP;
                });
            });

            if (availableColumns.length === 0) return prev;

            const x = availableColumns[Math.floor(Math.random() * availableColumns.length)];
            const el = getRandomElement();

            const newCard = {
                id: Date.now() + Math.random(),
                x,
                y: -220,
                speed: Math.random() * 1 + 0.5,
                element: el,
                missing: getRandomMissingFields(),
                image: getElementImage(el.name),
                fadingOut: false,
                rotation: Math.random() * 10 - 5,
                scale: 0.9 + Math.random() * 0.2,
            };

            return [...prev, newCard];
        });
    };

    const spawnMultipleCards = (count = maxFalling) => {
        setFallingCards(prev => {
            let spawned = 0;
            const shuffledColumns = [...columns].sort(() => 0.5 - Math.random());
            const updated = [...prev];

            for (let col of shuffledColumns) {
                if (spawned >= count) break;
                const isFree = !updated.some(card => {
                    const verticalDistance = Math.abs(card.y - (-220));
                    const horizontalDistance = Math.abs(card.x - col);
                    return horizontalDistance < minDistance && verticalDistance < SAFE_VERTICAL_GAP;
                });

                if (!isFree) continue;

                const el = getRandomElement();
                const newCard = {
                    id: Date.now() + Math.random(),
                    x: col,
                    y: -220,
                    speed: Math.random() * 1.2 + 0.5,
                    element: el,
                    missing: getRandomMissingFields(),
                    image: getElementImage(el.name),
                    fadingOut: false,
                    rotation: Math.random() * 10 - 5,
                    scale: 0.9 + Math.random() * 0.2,
                };

                updated.push(newCard);
                spawned++;
            }
            return updated;
        });
    };

    // --- Intro and Countdown ---
    useEffect(() => {
        if (isStarting) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                    setIsStarting(false);
                    setIsCountingDown(true);
                }, 1000);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isStarting]);

    useEffect(() => {
        if (!isCountingDown) return;
        let c = 3;
        setCountdown(c);

        const interval = setInterval(() => {
            c -= 1;
            setCountdown(c);

            if (c < 0) {
                clearInterval(interval);
                setIsCountingDown(false);
                setTimeout(() => spawnMultipleCards(2 + Math.floor(Math.random() * 2)), 300);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isCountingDown]);

    // --- Score Display Animation ---
    useEffect(() => {
        if (displayedScore === score) return;
        const step = score > displayedScore ? 1 : -1;
        const timer = setInterval(() => {
            setDisplayedScore(prev => {
                if (prev === score) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + step;
            });
        }, 30);
        return () => clearInterval(timer);
    }, [score, displayedScore]);

    const gameOver = () => {
        if (isGameOver) return;
        setIsGameOver(true);
    };

    useEffect(() => {
        if (isGameOver) {
            saveScoreToLeaderboard(questionCount);
            setActiveModal("gameover");
        }
    }, [isGameOver]);

    // --- Falling Update ---
    useEffect(() => {
        if (isGameOver || isCountingDown) return;
        let animFrame;

        const update = () => {
            setFallingCards(prev => {
                const updated = prev.map(card => ({ ...card, y: card.y + card.speed }));

                const survived = updated.filter(card => {
                    if (card.y > window.innerHeight) {
                        setHp(h => {
                            const newHp = h - 10;
                            if (newHp <= 0) gameOver();
                            return newHp;
                        });
                        showFeedback("-10 HP", "red");
                        return false;
                    }
                    return true;
                });

                if (survived.length < maxFalling && Math.random() < 0.05) {
                    spawnMultipleCards(2 + Math.floor(Math.random() * 3));
                }

                return survived;
            });

            animFrame = requestAnimationFrame(update);
        };

        animFrame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animFrame);
    }, [isGameOver, isCountingDown]);

    // --- Handle Answers ---
    const handleSubmit = () => {
        if (!answer.trim()) return;
        handleAnswerCorrect(answer.trim());
        setAnswer("");
    };

    const handleAnswerCorrect = (ans) => {
        setFallingCards(prev => {
            let found = false;
            const updated = prev.map(card => {
                let correct = true;
                card.missing.forEach(field => {
                    if (field === "name" && ans.toLowerCase() !== card.element.name.toLowerCase()) correct = false;
                    if (field === "symbol" && ans.toLowerCase() !== card.element.symbol.toLowerCase()) correct = false;
                    if (field === "number" && parseInt(ans) !== card.element.number) correct = false;
                });

                if (correct && !found) {
                    found = true;
                    setScore(s => s + 10);
                    setHp(h => Math.min(100, h + 10));
                    setQuestionCount(q => q + 1);
                    showFeedback("+10 pts, +10 HP", "limegreen");
                    return { ...card, fadingOut: true };
                }
                return card;
            });

            if (!found) {
                setHp(h => {
                    const newHp = h - 10;
                    if (newHp <= 0) gameOver();
                    return newHp;
                });
                showFeedback("-10 HP", "red");
            }

            return updated.filter(c => !c.fadingOut);
        });
    };

    // --- Leaderboard ---
    const fetchLeaderboard = () => {
        const db = getDatabase();
        const lbRef = ref(db, "leaderboards/normalSurvival");

        onValue(lbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const arr = Object.values(data);
                arr.sort((a, b) => b.questions - a.questions || b.score - a.score);
                setLeaderboardData(arr);
            } else {
                setLeaderboardData([]);
            }
        });
    };

    const handleExit = () => navigate(-1);

    // --- UI RENDER ---
    if (isStarting) {
        return (
            <div className="time-trial-container">
                <BackgroundVideo />
                <h1 className={`time-trial-title ${fadeOut ? "fade-out" : "fade-in"}`}>
                    Periodic Table Survival
                </h1>
                <p className={`subtitle ${fadeOut ? "fade-out" : "fade-in"}`}>Get ready...</p>
            </div>
        );
    }

    return (
        <div className="survival-container">
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="background-video"
                style={{opacity:"1", filter:"brightness(10%)"}}
            >
                <source src="/videos/3.mp4" type="video/mp4" />
            </video>

            {/* Countdown */}
            {isCountingDown && (
                <div className="countdown-overlay" style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "8rem",
                    fontWeight: "bold",
                    zIndex: 9999,
                    textShadow: "0 0 20px #00f0ff",
                }}>
                    {countdown > 0 ? countdown : "GO!"}
                </div>
            )}

            {/* UI Layer */}
            <div className="ui-container" style={{ position: "relative", zIndex: 10 }}>
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

                <h1>Periodic Table Survival - Normal</h1>

                <div className="status-bar">
                    <div className="hp-status">
                        <p>HP : {hp}</p>
                        <div className="hp-bar">
                            <div className="hp-fill"
                                style={{
                                    width: `${hp}%`,
                                    background: hp > 50 ? "limegreen" : hp > 20 ? "orange" : "red",
                                }}
                            />
                        </div>
                    </div>
                    <p>Score : {displayedScore}</p>
                    <p>Answered: {questionCount}</p>
                </div>

                {feedback && (
                    <div className="feedback-text" style={{
                        position: "absolute", top: "100px", left: "50%",
                        transform: "translateX(-50%)", color: feedback.color,
                        fontSize: "24px", fontWeight: "bold",
                        animation: "floatUp 1.2s ease-out", pointerEvents: "none",
                        textShadow: "2px 2px 4px black",
                    }}>
                        {feedback.msg}
                    </div>
                )}

                {!isGameOver && (
                    <div className="answer-wrapper" style={{ marginTop: "500px" }}>
                        <input
                            type="text"
                            value={answer}
                            placeholder="Enter your answer"
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmit();
                            }}
                            className="answer-input"
                            autoFocus
                        />
                        <button onClick={handleSubmit} className="submit-btn">Submit</button>
                    </div>
                )}
            </div>

            {/* Cards */}
            <div className="card-container" style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "100vh", zIndex: 1, pointerEvents: "none",
            }}>
                {fallingCards.map((card) => (
  <div
    key={card.id}
    className={`element-card-modern ${card.fadingOut ? "fade-out" : ""}`}
    style={{
      left: `${card.x}%`,
      top: `${card.y}px`,
      transform: `rotate(${card.rotation || 0}deg) scale(${card.scale || 1})`,
    }}
  >
    <div className="card-glow"></div>
    <img
      src={card.image || "/default-bg.jpg"}
      alt={card.element.name}
      className="card-image"
    />
    <div className="card-gradient"></div>

    <div className="card-content">
      <h2 className="card-symbol">
        {card.missing.includes("symbol") ? "???" : card.element.symbol}
      </h2>
      <p className="card-name">
        {card.missing.includes("name") ? "???" : card.element.name}
      </p>
      <p className="card-number">
        {card.missing.includes("number")
          ? "Atomic No: ???"
          : `Atomic No: ${card.element.number}`}
      </p>
    </div>
  </div>
))}


            </div>

            <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -50px); }
        }
        .fade-out { opacity: 0; transition: opacity 0.7s; }
      `}</style>

            {/* --- Game Over Modal --- */}
            {activeModal === "gameover" && (
                <div className="game-over-modal" style={{ zIndex: 20 }}>
                    <div className="modal-content">
                        <h1>Game Over!</h1>
                        <p>Final Score: {score}</p>
                        <p>Answered Questions: {questionCount}</p>
                        <div className="modal-buttons">
                            <button
                                className="btn try-again"
                                onClick={() => {
                                    // Reset all gameplay stats
                                    setHp(100);
                                    setScore(0);
                                    setDisplayedScore(0);
                                    setQuestionCount(0);
                                    setFallingCards([]);
                                    setTimeLeft(20);

                                    // Close Game Over modal
                                    setActiveModal(null);

                                    // Mark game as not over
                                    setIsGameOver(false);

                                    // Start countdown again before spawning
                                    setIsCountingDown(true);
                                }}
                            >
                                Try Again
                            </button>
                            <button className="btn menu" onClick={() => navigate(-1)}>Back to Menu</button>
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
            {activeModal === "leaderboard" && (
                <div className="leaderboard-modal" style={{ zIndex: 20 }}>
                    <div className="modal-content leaderboard-content">
                        <h2>Leaderboard</h2>
                        <div className="leaderboard-top3">
                            {leaderboardData[1] && (
                                <div className="podium silver">
                                    <div className="avatar"><img src={leaderboardData[1].profilePic} alt="" /></div>
                                    <p className="name">{leaderboardData[1].name}</p>
                                    <p className="score">Answered Questions: {leaderboardData[1].questions}</p>
                                    <p className="username">{leaderboardData[1].email}</p>
                                </div>
                            )}
                            {leaderboardData[0] && (
                                <div className="podium gold">
                                    <div className="crown">👑</div>
                                    <div className="avatar"><img src={leaderboardData[0].profilePic} alt="" /></div>
                                    <p className="name">{leaderboardData[0].name}</p>
                                    <p className="score">Answered Questions: {leaderboardData[0].questions}</p>
                                    <p className="username">{leaderboardData[0].email}</p>
                                </div>
                            )}
                            {leaderboardData[2] && (
                                <div className="podium bronze">
                                    <div className="avatar"><img src={leaderboardData[2].profilePic} alt="" /></div>
                                    <p className="name">{leaderboardData[2].name}</p>
                                    <p className="score">Answered Questions: {leaderboardData[2].questions}</p>
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
                                    <p className="score">{player.questions}</p>
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
};

export default Survival;