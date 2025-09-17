import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Survival.css";
import BackgroundVideo from "../components/BackgroundVideo";

// Periodic table elements (simplified)
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

// Quiz image data
const quizData = [
    {
        images: ["/images/oxygen/oxygen1.jpg", "/images/oxygen/oxygen2.jpg", "/images/oxygen/oxygen3.jpg", "/images/oxygen/oxygen4.jpg"],
        answer: "OXYGEN",
    },
    {
        images: ["/images/gold/gold1.jpg", "/images/gold/gold2.jpg", "/images/gold/gold3.jpg", "/images/gold/gold4.jpg"],
        answer: "GOLD",
    },
    {
        images: ["/images/helium/helium1.jpg", "/images/helium/helium2.jpg", "/images/helium/helium3.jpg", "/images/helium/helium4.jpg"],
        answer: "HELIUM",
    },
    {
        images: ["/images/hydrogen/hydrogen1.jpg", "/images/hydrogen/hydrogen2.jpg", "/images/hydrogen/hydrogen3.jpg", "/images/hydrogen/hydrogen4.jpg"],
        answer: "HYDROGEN",
    },
    {
        images: ["/images/lithium/lithium1.jpg", "/images/lithium/lithium2.jpg", "/images/lithium/lithium3.jpg", "/images/lithium/lithium4.jpg"],
        answer: "LITHIUM",
    },
    {
        images: ["/images/beryllium/beryllium1.jpg", "/images/beryllium/beryllium2.jpg", "/images/beryllium/beryllium3.jpg", "/images/beryllium/beryllium4.jpg"],
        answer: "BERYLLIUM",
    },
    {
        images: ["/images/boron/boron1.jpg", "/images/boron/boron2.jpg", "/images/boron/boron3.jpg", "/images/boron/boron4.jpg"],
        answer: "BORON",
    },
    {
        images: ["/images/carbon/carbon1.jpg", "/images/carbon/carbon2.jpg", "/images/carbon/carbon3.jpg", "/images/carbon/carbon4.jpg"],
        answer: "CARBON",
    },
    {
        images: ["/images/nitrogen/nitrogen1.jpg", "/images/nitrogen/nitrogen2.jpg", "/images/nitrogen/nitrogen3.jpg", "/images/nitrogen/nitrogen4.jpg"],
        answer: "NITROGEN",
    },
    {
        images: ["/images/fluorine/fluorine1.jpg", "/images/fluorine/fluorine2.jpg", "/images/fluorine/fluorine3.jpg", "/images/fluorine/fluorine4.jpg"],
        answer: "FLUORINE",
    },
    {
        images: ["/images/neon/neon1.jpg", "/images/neon/neon2.jpg", "/images/neon/neon3.jpg", "/images/neon/neon4.jpg"],
        answer: "NEON",
    },
    {
        images: ["/images/sodium/sodium1.jpg", "/images/sodium/sodium2.jpg", "/images/sodium/sodium3.jpg", "/images/sodium/sodium4.jpg"],
        answer: "SODIUM",
    },
    {
        images: ["/images/aluminium/aluminium1.jpg", "/images/aluminium/aluminium2.jpg", "/images/aluminium/aluminium3.jpg", "/images/aluminium/aluminium4.jpg"],
        answer: "ALUMINIUM",
    },
    {
        images: ["/images/magnesium/magnesium1.jpg", "/images/magnesium/magnesium2.jpg", "/images/magnesium/magnesium3.jpg", "/images/magnesium/magnesium4.jpg"],
        answer: "MAGNESIUM",
    },
    {
        images: ["/images/silicon/silicon1.jpg", "/images/silicon/silicon2.jpg", "/images/silicon/silicon3.jpg", "/images/silicon/silicon4.jpg"],
        answer: "SILICON",
    },
    {
        images: ["/images/phosphorus/phosphorus1.jpg", "/images/phosphorus/phosphorus2.jpg", "/images/phosphorus/phosphorus3.jpg", "/images/phosphorus/phosphorus4.jpg"],
        answer: "PHOSPHORUS",
    },
    {
        images: ["/images/sulfur/sulfur1.jpg", "/images/sulfur/sulfur2.jpg", "/images/sulfur/sulfur3.jpg", "/images/sulfur/sulfur4.jpg"],
        answer: "SULFUR",
    },
    {
        images: ["/images/chlorine/chlorine1.jpg", "/images/chlorine/chlorine2.jpg", "/images/chlorine/chlorine3.jpg", "/images/chlorine/chlorine4.jpg"],
        answer: "CHLORINE",
    },
    {
        images: ["/images/argon/argon1.jpg", "/images/argon/argon2.jpg", "/images/argon/argon3.jpg", "/images/argon/argon4.jpg"],
        answer: "ARGON",
    },
    {
        images: ["/images/potassium/potassium1.jpg", "/images/potassium/potassium2.jpg", "/images/potassium/potassium3.jpg", "/images/potassium/potassium4.jpg"],
        answer: "POTASSIUM",
    },
    {
        images: ["/images/calcium/calcium1.jpg", "/images/calcium/calcium2.jpg", "/images/calcium/calcium3.jpg", "/images/calcium/calcium4.jpg"],
        answer: "CALCIUM",
    },
    {
        images: ["/images/titanium/titanium1.jpg", "/images/titanium/titanium2.jpg", "/images/titanium/titanium3.jpg", "/images/titanium/titanium4.jpg"],
        answer: "TITANIUM",
    },
    {
        images: ["/images/vanadium/vanadium1.jpg", "/images/vanadium/vanadium2.jpg", "/images/vanadium/vanadium3.jpg", "/images/vanadium/vanadium4.jpg"],
        answer: "VANADIUM",
    },
    {
        images: ["/images/chromium/chromium1.jpg", "/images/chromium/chromium2.jpg", "/images/chromium/chromium3.jpg", "/images/chromium/chromium4.jpg"],
        answer: "CHROMIUM",
    },
    {
        images: ["/images/manganese/manganese1.jpg", "/images/manganese/manganese2.jpg", "/images/manganese/manganese3.jpg", "/images/manganese/manganese4.jpg"],
        answer: "MANGANESE",
    },
    {
        images: ["/images/iron/iron1.jpg", "/images/iron/iron2.jpg", "/images/iron/iron3.jpg", "/images/iron/iron4.jpg"],
        answer: "IRON",
    },
    {
        images: ["/images/cobalt/cobalt1.jpg", "/images/cobalt/cobalt2.jpg", "/images/cobalt/cobalt3.jpg", "/images/cobalt/cobalt4.jpg"],
        answer: "COBALT",
    },
    {
        images: ["/images/nickel/nickel1.jpg", "/images/nickel/nickel2.jpg", "/images/nickel/nickel3.jpg", "/images/nickel/nickel4.jpg"],
        answer: "NICKEL",
    },
    {
        images: ["/images/copper/copper1.jpg", "/images/copper/copper2.jpg", "/images/copper/copper3.jpg", "/images/copper/copper4.jpg"],
        answer: "COPPER",
    },
    {
        images: ["/images/zinc/zinc1.jpg", "/images/zinc/zinc2.jpg", "/images/zinc/zinc3.jpg", "/images/zinc/zinc4.jpg"],
        answer: "ZINC",
    },
    {
        images: ["/images/gallium/gallium1.jpg", "/images/gallium/gallium2.jpg", "/images/gallium/gallium3.jpg", "/images/gallium/gallium4.jpg"],
        answer: "GALLIUM",
    },
    {
        images: ["/images/germanium/germanium1.jpg", "/images/germanium/germanium2.jpg", "/images/germanium/germanium3.jpg", "/images/germanium/germanium4.jpg"],
        answer: "GERMANIUM",
    },
    {
        images: ["/images/arsenic/arsenic1.jpg", "/images/arsenic/arsenic2.jpg", "/images/arsenic/arsenic3.jpg", "/images/arsenic/arsenic4.jpg"],
        answer: "ARSENIC",
    },
    {
        images: ["/images/selenium/selenium1.jpg", "/images/selenium/selenium2.jpg", "/images/selenium/selenium3.jpg", "/images/selenium/selenium4.jpg"],
        answer: "SELENIUM",
    },
    {
        images: ["/images/bromine/bromine1.jpg", "/images/bromine/bromine2.jpg", "/images/bromine/bromine3.jpg", "/images/bromine/bromine4.jpg"],
        answer: "BROMINE",
    },
    {
        images: ["/images/krypton/krypton1.jpg", "/images/krypton/krypton2.jpg", "/images/krypton/krypton3.jpg", "/images/krypton/krypton4.jpg"],
        answer: "KRYPTON",
    },
    {
        images: ["/images/rubidium/rubidium1.jpg", "/images/rubidium/rubidium2.jpg", "/images/rubidium/rubidium3.jpg", "/images/rubidium/rubidium4.jpg"],
        answer: "RUBIDIUM",
    },
    {
        images: ["/images/strontium/strontium1.jpg", "/images/strontium/strontium2.jpg", "/images/strontium/strontium3.jpg", "/images/strontium/strontium4.jpg"],
        answer: "STRONTIUM",
    },
    {
        images: ["/images/yttrium/yttrium1.jpg", "/images/yttrium/yttrium2.jpg", "/images/yttrium/yttrium3.jpg", "/images/yttrium/yttrium4.jpg"],
        answer: "YTTRIUM",
    },
    {
        images: ["/images/zirconium/zirconium1.jpg", "/images/zirconium/zirconium2.jpg", "/images/zirconium/zirconium3.jpg", "/images/zirconium/zirconium4.jpg"],
        answer: "ZIRCONIUM",
    },
    {
        images: ["/images/niobium/niobium1.jpg", "/images/niobium/niobium2.jpg", "/images/niobium/niobium3.jpg", "/images/niobium/niobium4.jpg"],
        answer: "NIOBIUM",
    },
    {
        images: ["/images/molybdenum/molybdenum1.jpg", "/images/molybdenum/molybdenum2.jpg", "/images/molybdenum/molybdenum3.jpg", "/images/molybdenum/molybdenum4.jpg"],
        answer: "MOLYBDENUM",
    },
    {
        images: ["/images/technetium/technetium1.jpg", "/images/technetium/technetium2.jpg", "/images/technetium/technetium3.jpg", "/images/technetium/technetium4.jpg"],
        answer: "TECHNETIUM",
    },
    {
        images: ["/images/ruthenium/ruthenium1.jpg", "/images/ruthenium/ruthenium2.jpg", "/images/ruthenium/ruthenium3.jpg", "/images/ruthenium/ruthenium4.jpg"],
        answer: "RUTHENIUM",
    },
    {
        images: ["/images/rhodium/rhodium1.jpg", "/images/rhodium/rhodium2.jpg", "/images/rhodium/rhodium3.jpg", "/images/rhodium/rhodium4.jpg"],
        answer: "RHODIUM",
    },
    {
        images: ["/images/palladium/palladium1.jpg", "/images/palladium/palladium2.jpg", "/images/palladium/palladium3.jpg", "/images/palladium/palladium4.jpg"],
        answer: "PALLADIUM",
    },
    {
        images: ["/images/silver/silver1.jpg", "/images/silver/silver2.jpg", "/images/silver/silver3.jpg", "/images/silver/silver4.jpg"],
        answer: "SILVER",
    },
    {
        images: ["/images/cadmium/cadmium1.jpg", "/images/cadmium/cadmium2.jpg", "/images/cadmium/cadmium3.jpg", "/images/cadmium/cadmium4.jpg"],
        answer: "CADMIUM",
    },
    {
        images: ["/images/indium/indium1.jpg", "/images/indium/indium2.jpg", "/images/indium/indium3.jpg", "/images/indium/indium4.jpg"],
        answer: "INDIUM",
    },
    {
        images: ["/images/tin/tin1.jpg", "/images/tin/tin2.jpg", "/images/tin/tin3.jpg", "/images/tin/tin4.jpg"],
        answer: "TIN",
    },
    {
        images: ["/images/antimony/antimony1.jpg", "/images/antimony/antimony2.jpg", "/images/antimony/antimony3.jpg", "/images/antimony/antimony4.jpg"],
        answer: "ANTIMONY",
    },
    {
        images: ["/images/tellurium/tellurium1.jpg", "/images/tellurium/tellurium2.jpg", "/images/tellurium/tellurium3.jpg", "/images/tellurium/tellurium4.jpg"],
        answer: "TELLURIUM",
    },
    {
        images: ["/images/iodine/iodine1.jpg", "/images/iodine/iodine2.jpg", "/images/iodine/iodine3.jpg", "/images/iodine/iodine4.jpg"],
        answer: "IODINE",
    },
    {
        images: ["/images/xenon/xenon1.jpg", "/images/xenon/xenon2.jpg", "/images/xenon/xenon3.jpg", "/images/xenon/xenon4.jpg"],
        answer: "XENON",
    },
    {
        images: ["/images/cesium/cesium1.jpg", "/images/cesium/cesium2.jpg", "/images/cesium/cesium3.jpg", "/images/cesium/cesium4.jpg"],
        answer: "CESIUM",
    },
    {
        images: ["/images/barium/barium1.jpg", "/images/barium/barium2.jpg", "/images/barium/barium3.jpg", "/images/barium/barium4.jpg"],
        answer: "BARIUM",
    },
    {
        images: ["/images/lanthanum/lanthanum1.jpg", "/images/lanthanum/lanthanum2.jpg", "/images/lanthanum/lanthanum3.jpg", "/images/lanthanum/lanthanum4.jpg"],
        answer: "LANTHANUM",
    },
    {
        images: ["/images/cerium/cerium1.jpg", "/images/cerium/cerium2.jpg", "/images/cerium/cerium3.jpg", "/images/cerium/cerium4.jpg"],
        answer: "CERIUM",
    },
    {
        images: ["/images/praseodymium/praseodymium1.jpg", "/images/praseodymium/praseodymium2.jpg", "/images/praseodymium/praseodymium3.jpg", "/images/praseodymium/praseodymium4.jpg"],
        answer: "PRASEODYMIUM",
    },
    {
        images: ["/images/neodymium/neodymium1.jpg", "/images/neodymium/neodymium2.jpg", "/images/neodymium/neodymium3.jpg", "/images/neodymium/neodymium4.jpg"],
        answer: "NEODYMIUM",
    },
    {
        images: ["/images/promethium/promethium1.jpg", "/images/promethium/promethium2.jpg", "/images/promethium/promethium3.jpg", "/images/promethium/promethium4.jpg"],
        answer: "PROMETHIUM",
    },
    {
        images: ["/images/samarium/samarium1.jpg", "/images/samarium/samarium2.jpg", "/images/samarium/samarium3.jpg", "/images/samarium/samarium4.jpg"],
        answer: "SAMARIUM",
    },
    {
        images: ["/images/europium/europium1.jpg", "/images/europium/europium2.jpg", "/images/europium/europium3.jpg", "/images/europium/europium4.jpg"],
        answer: "EUROPIUM",
    },
    {
        images: ["/images/gadolinium/gadolinium1.jpg", "/images/gadolinium/gadolinium2.jpg", "/images/gadolinium/gadolinium3.jpg", "/images/gadolinium/gadolinium4.jpg"],
        answer: "GADOLINIUM",
    },
    {
        images: ["/images/terbium/terbium1.jpg", "/images/terbium/terbium2.jpg", "/images/terbium/terbium3.jpg", "/images/terbium/terbium4.jpg"],
        answer: "TERBIUM",
    },
    {
        images: ["/images/dysprosium/dysprosium1.jpg", "/images/dysprosium/dysprosium2.jpg", "/images/dysprosium/dysprosium3.jpg", "/images/dysprosium/dysprosium4.jpg"],
        answer: "DYSPROSIUM",
    },
    {
        images: ["/images/holmium/holmium1.jpg", "/images/holmium/holmium2.jpg", "/images/holmium/holmium3.jpg", "/images/holmium/holmium4.jpg"],
        answer: "HOLMIUM",
    },
    {
        images: ["/images/erbium/erbium1.jpg", "/images/erbium/erbium2.jpg", "/images/erbium/erbium3.jpg", "/images/erbium/erbium4.jpg"],
        answer: "ERBIUM",
    },
    {
        images: ["/images/thulium/thulium1.jpg", "/images/thulium/thulium2.jpg", "/images/thulium/thulium3.jpg", "/images/thulium/thulium4.jpg"],
        answer: "THULIUM",
    },
    {
        images: ["/images/ytterbium/ytterbium1.jpg", "/images/ytterbium/ytterbium2.jpg", "/images/ytterbium/ytterbium3.jpg", "/images/ytterbium/ytterbium4.jpg"],
        answer: "YTTERBIUM",
    },
    {
        images: ["/images/lutetium/lutetium1.jpg", "/images/lutetium/lutetium2.jpg", "/images/lutetium/lutetium3.jpg", "/images/lutetium/lutetium4.jpg"],
        answer: "LUTETIUM",
    },
    {
        images: ["/images/hafnium/hafnium1.jpg", "/images/hafnium/hafnium2.jpg", "/images/hafnium/hafnium3.jpg", "/images/hafnium/hafnium4.jpg"],
        answer: "HAFNIUM",
    },
    {
        images: ["/images/tantalum/tantalum1.jpg", "/images/tantalum/tantalum2.jpg", "/images/tantalum/tantalum3.jpg", "/images/tantalum/tantalum4.jpg"],
        answer: "TANTALUM",
    },
    {
        images: ["/images/tungsten/tungsten1.jpg", "/images/tungsten/tungsten2.jpg", "/images/tungsten/tungsten3.jpg", "/images/tungsten/tungsten4.jpg"],
        answer: "TUNGSTEN",
    },
    {
        images: ["/images/rhenium/rhenium1.jpg", "/images/rhenium/rhenium2.jpg", "/images/rhenium/rhenium3.jpg", "/images/rhenium/rhenium4.jpg"],
        answer: "RHENIUM",
    },
    {
        images: ["/images/osmium/osmium1.jpg", "/images/osmium/osmium2.jpg", "/images/osmium/osmium3.jpg", "/images/osmium/osmium4.jpg"],
        answer: "OSMIUM",
    },
    {
        images: ["/images/iridium/iridium1.jpg", "/images/iridium/iridium2.jpg", "/images/iridium/iridium3.jpg", "/images/iridium/iridium4.jpg"],
        answer: "IRIDIUM",
    },
    {
        images: ["/images/platinum/platinum1.jpg", "/images/platinum/platinum2.jpg", "/images/platinum/platinum3.jpg", "/images/platinum/platinum4.jpg"],
        answer: "PLATINUM",
    },
    {
        images: ["/images/mercury/mercury1.jpg", "/images/mercury/mercury2.jpg", "/images/mercury/mercury3.jpg", "/images/mercury/mercury4.jpg"],
        answer: "MERCURY",
    },
    {
        images: ["/images/thallium/thallium1.jpg", "/images/thallium/thallium2.jpg", "/images/thallium/thallium3.jpg", "/images/thallium/thallium4.jpg"],
        answer: "THALLIUM",
    },
    {
        images: ["/images/lead/lead1.jpg", "/images/lead/lead2.jpg", "/images/lead/lead3.jpg", "/images/lead/lead4.jpg"],
        answer: "LEAD",
    },
    {
        images: ["/images/bismuth/bismuth1.jpg", "/images/bismuth/bismuth2.jpg", "/images/bismuth/bismuth3.jpg", "/images/bismuth/bismuth4.jpg"],
        answer: "BISMUTH",
    },
    {
        images: ["/images/polonium/polonium1.jpg", "/images/polonium/polonium2.jpg", "/images/polonium/polonium3.jpg", "/images/polonium/polonium4.jpg"],
        answer: "POLONIUM",
    },
    {
        images: ["/images/radon/radon1.jpg", "/images/radon/radon2.jpg", "/images/radon/radon3.jpg", "/images/radon/radon4.jpg"],
        answer: "RADON",
    },
    {
        images: ["/images/francium/francium1.jpg", "/images/francium/francium2.jpg", "/images/francium/francium3.jpg", "/images/francium/francium4.jpg"],
        answer: "FRANCIUM",
    },
    {
        images: ["/images/radium/radium1.jpg", "/images/radium/radium2.jpg", "/images/radium/radium3.jpg", "/images/radium/radium4.jpg"],
        answer: "RADIUM",
    },
    {
        images: ["/images/actinium/actinium1.jpg", "/images/actinium/actinium2.jpg", "/images/actinium/actinium3.jpg", "/images/actinium/actinium4.jpg"],
        answer: "ACTINIUM",
    },
    {
        images: ["/images/thorium/thorium1.jpg", "/images/thorium/thorium2.jpg", "/images/thorium/thorium3.jpg", "/images/thorium/thorium4.jpg"],
        answer: "THORIUM",
    },
    {
        images: ["/images/protactinium/protactinium1.jpg", "/images/protactinium/protactinium2.jpg", "/images/protactinium/protactinium3.jpg", "/images/protactinium/protactinium4.jpg"],
        answer: "PROTACTINIUM",
    },
    {
        images: ["/images/uranium/uranium1.jpg", "/images/uranium/uranium2.jpg", "/images/uranium/uranium3.jpg", "/images/uranium/uranium4.jpg"],
        answer: "URANIUM",
    },
    {
        images: ["/images/neptunium/neptunium1.jpg", "/images/neptunium/neptunium2.jpg", "/images/neptunium/neptunium3.jpg", "/images/neptunium/neptunium4.jpg"],
        answer: "NEPTUNIUM",
    },
    {
        images: ["/images/plutonium/plutonium1.jpg", "/images/plutonium/plutonium2.jpg", "/images/plutonium/plutonium3.jpg", "/images/plutonium/plutonium4.jpg"],
        answer: "PLUTONIUM",
    },
    {
        images: ["/images/americium/americium1.jpg", "/images/americium/americium2.jpg", "/images/americium/americium3.jpg", "/images/americium/americium4.jpg"],
        answer: "AMERICIUM",
    },
    {
        images: ["/images/curium/curium1.jpg", "/images/curium/curium2.jpg", "/images/curium/curium3.jpg", "/images/curium/curium4.jpg"],
        answer: "CURIUM",
    },
    {
        images: ["/images/berkelium/berkelium1.jpg", "/images/berkelium/berkelium2.jpg", "/images/berkelium/berkelium3.jpg", "/images/berkelium/berkelium4.jpg"],
        answer: "BERKELIUM",
    },
    {
        images: ["/images/californium/californium1.jpg", "/images/californium/californium2.jpg", "/images/californium/californium3.jpg", "/images/californium/californium4.jpg"],
        answer: "CALIFORNIUM",
    },
    {
        images: ["/images/fermium/fermium1.jpg", "/images/fermium/fermium2.jpg", "/images/fermium/fermium3.jpg", "/images/fermium/fermium4.jpg"],
        answer: "FERMIUM",
    },
    {
        images: ["/images/mendelevium/mendelevium1.jpg", "/images/mendelevium/mendelevium2.jpg", "/images/mendelevium/mendelevium3.jpg", "/images/mendelevium/mendelevium4.jpg"],
        answer: "MENDELEVIUM",
    },
    {
        images: ["/images/nobelium/nobelium1.jpg", "/images/nobelium/nobelium2.jpg", "/images/nobelium/nobelium3.jpg", "/images/nobelium/nobelium4.jpg"],
        answer: "NOBELIUM",
    },
    {
        images: ["/images/lawrencium/lawrencium1.jpg", "/images/lawrencium/lawrencium2.jpg", "/images/lawrencium/lawrencium3.jpg", "/images/lawrencium/lawrencium4.jpg"],
        answer: "LAWRENCIUM",
    },
    {
        images: ["/images/dubnium/dubnium1.jpg", "/images/dubnium/dubnium2.jpg", "/images/dubnium/dubnium3.jpg", "/images/dubnium/dubnium4.jpg"],
        answer: "DUBNIUM",
    },
    {
        images: ["/images/rutherfordium/rutherfordium1.jpg", "/images/rutherfordium/rutherfordium2.jpg", "/images/rutherfordium/rutherfordium3.jpg", "/images/rutherfordium/rutherfordium4.jpg"],
        answer: "RUTHERFORDIUM",
    },
    {
        images: ["/images/seaborgium/seaborgium1.jpg", "/images/seaborgium/seaborgium2.jpg", "/images/seaborgium/seaborgium3.jpg", "/images/seaborgium/seaborgium4.jpg"],
        answer: "SEABORGIUM",
    },
    {
        images: ["/images/bohrium/bohrium1.jpg", "/images/bohrium/bohrium2.jpg", "/images/bohrium/bohrium3.jpg", "/images/bohrium/bohrium4.jpg"],
        answer: "BOHRIUM",
    },
    {
        images: ["/images/hassium/hassium1.jpg", "/images/hassium/hassium2.jpg", "/images/hassium/hassium3.jpg", "/images/hassium/hassium4.jpg"],
        answer: "HASSIUM",
    },
    {
        images: ["/images/meitnerium/meitnerium1.jpg", "/images/meitnerium/meitnerium2.jpg", "/images/meitnerium/meitnerium3.jpg", "/images/meitnerium/meitnerium4.jpg"],
        answer: "MEITNERIUM",
    },
    {
        images: ["/images/darmstadtium/darmstadtium1.jpg", "/images/darmstadtium/darmstadtium2.jpg", "/images/darmstadtium/darmstadtium3.jpg", "/images/darmstadtium/darmstadtium4.jpg"],
        answer: "DARMSTADTIUM",
    },
    {
        images: ["/images/roentgenium/roentgenium1.jpg", "/images/roentgenium/roentgenium2.jpg", "/images/roentgenium/roentgenium3.jpg", "/images/roentgenium/roentgenium4.jpg"],
        answer: "ROENTGENIUM",
    },
    {
        images: ["/images/copernicium/copernicium1.jpg", "/images/copernicium/copernicium2.jpg", "/images/copernicium/copernicium3.jpg", "/images/copernicium/copernicium4.jpg"],
        answer: "COPERNICIUM",
    },
    {
        images: ["/images/nihonium/nihonium1.jpg", "/images/nihonium/nihonium2.jpg", "/images/nihonium/nihonium3.jpg", "/images/nihonium/nihonium4.jpg"],
        answer: "NIHONIUM",
    },
    {
        images: ["/images/flerovium/flerovium1.jpg", "/images/flerovium/flerovium2.jpg", "/images/flerovium/flerovium3.jpg", "/images/flerovium/flerovium4.jpg"],
        answer: "FLEROVIUM",
    },
    {
        images: ["/images/moscovium/moscovium1.jpg", "/images/moscovium/moscovium2.jpg", "/images/moscovium/moscovium3.jpg", "/images/moscovium/moscovium4.jpg"],
        answer: "MOSCOVIUM",
    },
    {
        images: ["/images/livermorium/livermorium1.jpg", "/images/livermorium/livermorium2.jpg", "/images/livermorium/livermorium3.jpg", "/images/livermorium/livermorium4.jpg"],
        answer: "LIVERMORIUM",
    },
    {
        images: ["/images/tennessine/tennessine1.jpg", "/images/tennessine/tennessine2.jpg", "/images/tennessine/tennessine3.jpg", "/images/tennessine/tennessine4.jpg"],
        answer: "TENNESSINE",
    },
    {
        images: ["/images/oganesson/oganesson1.jpg", "/images/oganesson/oganesson2.jpg", "/images/oganesson/oganesson3.jpg", "/images/oganesson/oganesson4.jpg"],
        answer: "OGANESSON",
    },
];

function getRandomElement() {
    return elements[Math.floor(Math.random() * elements.length)];
}

function getRandomMissingField(element) {
    const fields = ["name", "symbol", "number"];
    return fields[Math.floor(Math.random() * fields.length)];
}

function getElementImage(elementName) {
    const data = quizData.find((item) => item.answer.toUpperCase() === elementName.toUpperCase());
    if (data) {
        return data.images[Math.floor(Math.random() * data.images.length)];
    }
    return null;
}

const Survival = () => {
    const navigate = useNavigate();

    const [hp, setHp] = useState(5);
    const [score, setScore] = useState(0);

    const [currentElement, setCurrentElement] = useState(getRandomElement());
    const [missingField, setMissingField] = useState(getRandomMissingField(getRandomElement()));
    const [answer, setAnswer] = useState("");
    const [elementImage, setElementImage] = useState(getElementImage(currentElement.name));

    // Generate new question
    const newQuestion = () => {
        const el = getRandomElement();
        setCurrentElement(el);
        setMissingField(getRandomMissingField(el));
        setAnswer("");
        setElementImage(getElementImage(el.name));
    };

    const checkAnswer = () => {
        const correct =
            (missingField === "name" && answer.toLowerCase() === currentElement.name.toLowerCase()) ||
            (missingField === "symbol" && answer.toLowerCase() === currentElement.symbol.toLowerCase()) ||
            (missingField === "number" && parseInt(answer) === currentElement.number);

        if (correct) {
            setScore(score + 1);
            newQuestion();
        } else {
            setHp(hp - 1);
            if (hp - 1 <= 0) {
                alert(`💀 Game Over! Final Score: ${score}`);
                navigate(-1);
            } else {
                newQuestion();
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="survival-container">
            <BackgroundVideo />
            <button className="back-btn" onClick={handleBack}>
                ←
            </button>

            <h1>⚔️ Periodic Table Survival</h1>

            <div className="status-bar">
                <p>❤️ HP: {hp}</p>
                <p>Score: {score}</p>
            </div>

            <div className="element-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <p><strong>Atomic Number :</strong> {missingField === "number" ? "???" : currentElement.number}</p>
                    <p><strong>Symbol :</strong> {missingField === "symbol" ? "???" : currentElement.symbol}</p>
                    <p><strong>Name :</strong> {missingField === "name" ? "???" : currentElement.name}</p>
                </div>
                {elementImage && <img src={elementImage} alt={currentElement.name} style={{ width: "340px", height: "340px", objectFit: "contain" }} />}
            </div>

            <input
                type="text"
                value={answer}
                placeholder={`Enter the missing ${missingField}`}
                onChange={(e) => setAnswer(e.target.value)}
                className="answer-input"
            />

            <button onClick={checkAnswer} className="submit-btn">Submit</button>
        </div>
    );
};

export default Survival;