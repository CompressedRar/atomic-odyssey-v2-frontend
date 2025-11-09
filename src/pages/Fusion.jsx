import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import periodicJspon from "../assets/periodic-table.json"
import "../styles/Classic.css";


const elementsData  = Object.values(periodicJspon)

const compounds = [
  { formula: "H2O", elements: { H: 2, O: 1 }, name: "Water" },
  { formula: "CO2", elements: { C: 1, O: 2 }, name: "Carbon Dioxide" },
  { formula: "NH3", elements: { N: 1, H: 3 }, name: "Ammonia" },
  { formula: "CH4", elements: { C: 1, H: 4 }, name: "Methane" },
  { formula: "NaCl", elements: { Na: 1, Cl: 1 }, name: "Sodium Chloride" },

  // Additional Common Compounds
  { formula: "O2", elements: { O: 2 }, name: "Oxygen Gas" },
  { formula: "H2", elements: { H: 2 }, name: "Hydrogen Gas" },
  { formula: "N2", elements: { N: 2 }, name: "Nitrogen Gas" },
  { formula: "HCl", elements: { H: 1, Cl: 1 }, name: "Hydrogen Chloride" },
  { formula: "CO", elements: { C: 1, O: 1 }, name: "Carbon Monoxide" },

  // Acids
  { formula: "H2SO4", elements: { H: 2, S: 1, O: 4 }, name: "Sulfuric Acid" },
  { formula: "HNO3", elements: { H: 1, N: 1, O: 3 }, name: "Nitric Acid" },
  { formula: "H2CO3", elements: { H: 2, C: 1, O: 3 }, name: "Carbonic Acid" },

  // Bases
  { formula: "NaOH", elements: { Na: 1, O: 1, H: 1 }, name: "Sodium Hydroxide" },
  { formula: "KOH", elements: { K: 1, O: 1, H: 1 }, name: "Potassium Hydroxide" },
  { formula: "Ca(OH)2", elements: { Ca: 1, O: 2, H: 2 }, name: "Calcium Hydroxide" },

  // More Useful Compounds
  { formula: "CaCO3", elements: { Ca: 1, C: 1, O: 3 }, name: "Calcium Carbonate" },
  { formula: "KCl", elements: { K: 1, Cl: 1 }, name: "Potassium Chloride" },
  { formula: "MgO", elements: { Mg: 1, O: 1 }, name: "Magnesium Oxide" },
  { formula: "Fe2O3", elements: { Fe: 2, O: 3 }, name: "Iron(III) Oxide / Rust" },
  { formula: "SO2", elements: { S: 1, O: 2 }, name: "Sulfur Dioxide" },
  { formula: "SO3", elements: { S: 1, O: 3 }, name: "Sulfur Trioxide" },
  { formula: "NO2", elements: { N: 1, O: 2 }, name: "Nitrogen Dioxide" },
  { formula: "N2O", elements: { N: 2, O: 1 }, name: "Nitrous Oxide / Laughing Gas" },

  { formula: "C2H6",  name: "Ethane",        elements: { C: 2, H: 6 } },
  { formula: "C3H8",  name: "Propane",       elements: { C: 3, H: 8 } },
  { formula: "C4H10", name: "Butane",        elements: { C: 4, H: 10 } },

  // Alcohols
  { formula: "CH3OH",   name: "Methanol",    elements: { C: 1, H: 4, O: 1 } },
  { formula: "C2H5OH",  name: "Ethanol",     elements: { C: 2, H: 6, O: 1 } },
  { formula: "C3H7OH",  name: "Propanol",    elements: { C: 3, H: 8, O: 1 } },

  // Organic acids
  { formula: "CH3COOH", name: "Acetic Acid", elements: { C: 2, H: 4, O: 2 } },
  { formula: "HCOOH",   name: "Formic Acid", elements: { C: 1, H: 2, O: 2 } },

  // Amines
  { formula: "CH3NH2",  name: "Methylamine", elements: { C: 1, H: 5, N: 1 } },
  { formula: "C2H5NH2", name: "Ethylamine",  elements: { C: 2, H: 7, N: 1 } },

  // Aromatic (very common example)
  { formula: "C6H6",  name: "Benzene",       elements: { C: 6, H: 6 } }
];

const groupColors = {
  "alkalimetal": "#cc80ff",           // Alkali metals
  "alkaline-earth-metal": "#c2ff00",         // Alkaline earth metals
  "transitionmetal": "#e06633",       // Transition metals
  "post-transition-metal": "#668080",  // Post-transition metals
  "metalloid": "#daa520",        // Metalloids
  "nonmetal": "#ffff30",         // Nonmetals
  "noblegas": "#b3e3f5",            // Noble gases
  "lanthanide": "#8fffc7",       // Lanthanides
  "actinide": "#008fff"          // Actinides
};

export default function FusionMode() {
  const navigate = useNavigate();

  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showOverlay, setShowOverlay] = useState(true);
  const handleQuit = () => setShowQuitConfirm(true);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);



  const currentCompound = compounds[currentIndex];

  const handleSelectElement = (symbol) => {
    setSelected(prev => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + 1
    }));
  };

  const handleRemoveElement = (symbol) => {
  setSelected(prev => {
    const copy = { ...prev };

    if (copy[symbol] > 1) {
      copy[symbol] -= 1;
    } else {
      delete copy[symbol];
    }

    return copy;
  });
};

  const handleSubmit = () => {
    const target = currentCompound.elements;
    let correct = true;

    for (let el in target) {
      if ((selected[el] || 0) !== target[el]) correct = false;
    }

    // also ensure no extra selected elements
    for (let el in selected) {
      if (!(el in target)) correct = false;
    }

    if (correct) {
      setFeedback("Correct!");
      setScore(score + 10);
      setSelected({});
      if (currentIndex < compounds.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFeedback("Game Complete!");
      }
    } else {
      setFeedback("Wrong Combination!");
      setScore(Math.max(score - 3, 0));
      setSelected({});
    }

    setTimeout(() => setFeedback(""), 1000);
  };

  return (
    <div className="periodic-game">
      <div className="game-options">
        <div className="top-button">
            <button onClick={() => navigate(-1)}>← Exit</button>
        </div>

        <div className="score-container">
            <span>Score</span> <span>{score}</span>
        </div>
      </div>

      {showOverlay && (
        <div className="fusion-target-overlay" onClick={() => setShowOverlay(false)}>
            <h1>Create: {currentCompound.formula}</h1>
            <p>Tap anywhere to start</p>
        </div>
        )}

    <div className="fusion-target-header">
        <span>Create</span> 
        <strong>{currentCompound.formula}</strong>
        <span>{currentCompound.name}</span>

        <div className="selected-display">
            {Object.keys(selected).length === 0 ? (
                <p>No elements selected</p>
            ) : (
                Object.entries(selected).map(([symbol, count]) => (
                <div
                    key={symbol}
                    className="selected-card"
                    onClick={() => handleRemoveElement(symbol)}
                >
                    <span className="card-symbol">{symbol}</span>
                    <span className="card-count">× {count}</span>
                </div>
                ))
            )}
        </div>

    </div>


      

      <div className="periodic-grid built" style={{scale:0.9}}>
        {elementsData.map((el) => (
            <div
            key={el.symbol}
            className="cell selectable fusion-cell"
            style={{
                gridRow: el.ypos,
                gridColumn: el.xpos,
                borderStyle:"none", 
                backgroundColor:`${groupColors[el.category]}`
                
            }}
            onClick={() => handleSelectElement(el.symbol)}
            >
            <span className="symbol" style={{ color:"black", }}>{el.symbol}</span>
            </div>
        ))}
        </div>

      <div className="submit-floating" onClick={handleSubmit}>
        Submit
        </div>

        {feedback && <p className="feedback-popup">
            <h1>{feedback}</h1>
            </p>}



    </div>

    
  );
}
