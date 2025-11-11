import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import periodicJson from "../assets/periodic-table.json";
import compounds from "../assets/compound.json";
import "../styles/Classic.css";

const elementsData = Object.values(periodicJson);

const groupColors = {
  alkalimetal: "#cc80ff",
  "alkaline-earth-metal": "#c2ff00",
  transitionmetal: "#e06633",
  "post-transition-metal": "#668080",
  metalloid: "#daa520",
  nonmetal: "#ffff30",
  noblegas: "#b3e3f5",
  lanthanide: "#8fffc7",
  actinide: "#008fff",
};

export default function PlaygroundMode() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState({});
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showCompoundsModal, setShowCompoundsModal] = useState(false);
  const [confettiConfig, setConfettiConfig] = useState(null); // {x, y}
  const gridRef = useRef(null);

  const handleSelectElement = (symbol) => {
    setSelected((prev) => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + 1,
    }));
  };

  const handleRemoveElement = (symbol) => {
    setSelected((prev) => {
      const updated = { ...prev };
      if (updated[symbol] > 1) updated[symbol] -= 1;
      else delete updated[symbol];
      return updated;
    });
  };

  const clearSelection = () => setSelected({});

  const displayFormula =
    Object.entries(selected)
      .map(([symbol, count]) => (count > 1 ? `${symbol}${count}` : symbol))
      .join("") || "—";

  const matchedCompound = compounds.find(
    (c) => JSON.stringify(c.elements) === JSON.stringify(selected)
  );

  // Trigger confetti effect on correct combination
  const [pulse, setPulse] = useState(false);

// Trigger confetti and pulse on correct combination
useEffect(() => {
  if (matchedCompound && Object.keys(selected).length > 0) {
    // Compute average position of selected elements
    const positions = Object.keys(selected)
      .map((symbol) => document.getElementById(`el-${symbol}`))
      .filter(Boolean)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });

    if (positions.length) {
      const avgX = positions.reduce((a, b) => a + b.x, 0) / positions.length;
      const avgY = positions.reduce((a, b) => a + b.y, 0) / positions.length;

      setConfettiConfig({ x: avgX, y: avgY });
      setPulse(true); // trigger pulse

      const audio = new Audio("/assets/correct-sound.mp3");
      audio.play();

      const timer = setTimeout(() => {
        setConfettiConfig(null);
        setPulse(false); // stop pulse after animation
      }, 1500);

      return () => clearTimeout(timer);
    }
  }
}, [matchedCompound]);


  return (
    <div className="periodic-game" ref={gridRef}>
      {/* Confetti */}
      {confettiConfig && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          initialVelocityX={{ min: -10, max: 10 }}
          initialVelocityY={{ min: -10, max: 10 }}
          width={window.innerWidth}
          height={window.innerHeight}
          confettiSource={{
            x: confettiConfig.x,
            y: confettiConfig.y,
            w: 0,
            h: 0,
          }}
        />
      )}

      {/* Top Bar */}
      <div className="game-options">
        <div className="top-button">
          <button onClick={() => setShowQuitConfirm(true)}>← Exit</button>
        </div>
        <div className="top-button show-compound">
          <button onClick={() => setShowCompoundsModal(true)}>Show Compounds</button>
        </div>
      </div>

      {/* Start Overlay */}
      {showOverlay && (
        <div
          className="fusion-target-overlay"
          onClick={() => setShowOverlay(false)}
        >
          <h1>Practice Mode</h1>
          <small>Tap elements to build compounds freely.</small>
          <p>Tap anywhere to begin</p>
        </div>
      )}

      {/* Header */}
      <div className="fusion-target-header">
        <div className="compound-info">
          <span>Current Formula:</span>
          <span className="compound-name" style={{ fontSize: "2rem" }}>
            {displayFormula}
          </span>
        </div>

        <div className="compound-info">
        {matchedCompound ? (
          <span className={`match-name ${pulse ? "pulse" : ""}`}>
            {matchedCompound.formula} — {matchedCompound.name}
          </span>
        ) : (
          <span className="muted">No known compound yet</span>
        )}
      </div>

        <button className="clear-btn" onClick={clearSelection}>
          Clear
        </button>

        <div className="selected-display">
          {Object.keys(selected).length === 0 ? (
            <p>No elements selected</p>
          ) : (
            Object.entries(selected).map(([symbol, count]) => (
              <div
                key={symbol}
                id={`el-${symbol}`}
                className="selected-card glow"
                onClick={() => handleRemoveElement(symbol)}
              >
                <span className="card-symbol">{symbol}</span>
                <span className="card-count">× {count}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="periodic-grid" style={{ scale: 0.9, marginTop: "15vh" }}>
        {elementsData.map((el) => (
          <div
            key={el.symbol}
            id={`el-${el.symbol}`}
            className="cell selectable fusion-cell"
            style={{
              gridRow: el.ypos,
              gridColumn: el.xpos,
              borderColor: groupColors[el.category],
            }}
            onClick={() => handleSelectElement(el.symbol)}
          >
            <span
              className="symbol"
              style={{ color: groupColors[el.category] }}
            >
              {el.symbol}
            </span>
          </div>
        ))}
      </div>

      {/* Compounds Modal */}
      {showCompoundsModal && (
        <div
          className="fusion-target-overlay"
          onClick={() => setShowCompoundsModal(false)}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.95)",
              padding: "20px",
              borderRadius: "12px",
              maxHeight: "80vh",
              overflowY: "scroll",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "10px" }}>All Compounds</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "40px",
                justifyItems: "center",
              }}
            >
              {compounds.map((c) => (
                <div
                  key={c.formula}
                  style={{
                    padding: "10px",
                    border: "1px solid #fff",
                    borderRadius: "8px",
                    cursor: "pointer",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.05)",
                    width: "100%",
                  }}
                  onClick={() => {
                    setSelected(c.elements);
                    setShowCompoundsModal(false);
                  }}
                >
                  <strong>{c.formula}</strong>
                  <p style={{ fontSize: "0.8rem", margin: "4px 0 0 0" }}>{c.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quit Confirm */}
      {showQuitConfirm && (
        <div className="quit-confirm-overlay">
          <div className="quit-confirm-modal">
            <h2>Quit Practice?</h2>
            <p>Progress isn't tracked here — it's just practice.</p>
            <div className="quit-confirm-buttons">
              <button className="yes-btn" onClick={() => navigate("/main")}>
                Yes
              </button>
              <button
                className="no-btn"
                onClick={() => setShowQuitConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
