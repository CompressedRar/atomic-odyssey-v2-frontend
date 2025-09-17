import { useEffect, useState, useRef } from "react";
import elements from "../assets/periodic-table.json"
import ModelViewer from "./ModelViewer";

function ElementInformation(props){
    const [elementDisplay, setDisplay] = useState("flex")
    const element = elements[props.elementName]
    const wrapperRef = useRef(null);
    const CategorySymbols = {
        "nonmetal" : "diamond",
        "metalloid": "memory",
        "actinide": "lab_research",
        "lanthanides" : "broadcast_on_home",
        "noblegas": "airwave",
        "post-transition-metal" : "construction",
        "transitionmetal" : "electric_bolt",
        "alkaline-earth-metal" : "nutrition",
        "alkalimetal": "battery_android_frame_shield"
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                props.onClick(); // trigger close
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props]);

    return (
        <div className="element-information-container " id ={props.elementName} style={{display: elementDisplay}}>
                <span id="close-button" >
                    <button onClick={props.onClick}>Close</button>
                </span>
                <div className="element-information">
                    <div className="element-image-container">
                        <img src={element["image"]["url"]} alt="" />
                        
                        <div className="stats-container">
                                <span className="element-stat">
                                    <span className="material-symbols-outlined">{element["phase"] == "Gas" ? "air": "stroke_full"}</span>
                                    <span className="label">{element["phase"]}</span>
                                </span>
                                <span className="element-stat">
                                    <span className="material-symbols-outlined">{CategorySymbols[element["category"]]}</span>
                                    <span className="label">{element["category"]}</span>
                                </span>
                                <span className="element-stat">
                                    <span>{element["atomic_mass"]}</span>
                                    <div className="label">Mass</div>
                                    
                                </span>
                                <span className="element-stat">
                                    <span>{element["density"]}</span>   
                                    <div className="label">Density</div>
                                    
                                </span>
                                <span className="element-stat">
                                    
                                    <span>{element["boil"]? element["boil"] + "K": "None"}</span>
                                    <div className="label">Boiling Point</div>
                                </span>
                                <span className="element-stat">
                                    <span>{element["appearance"]?  element["appearance"]: "None"}</span>
                                    <div className="label">Appearance</div>
                                    
                                </span>
                            </div>  
                    </div>
                    <div className="element-stats-container">
                        <span className="element-name-symbol-container">
                            <span className="pair">
                                <span className="element-symbol">{element["symbol"]}</span>
                                <span className="element-stats-name">{element["name"]}</span>
                            </span>
                            <p className="element-summary" style={{fontSize: "1.5rem"}}>
                                {element.summary}
                            </p>
                            <span className="element-stat">
                                <div >Period: </div>
                                <span className="label">{element["period"]}</span>                                    
                            </span>
                            <span className="element-stat">
                                <div >Group: </div>
                                <span className="label">{element["group"]}</span>                                    
                            </span>
                            
                            <span className="element-stat">
                                <div >Discovered by: </div>
                                <span className="label">{element["discovered_by"]}</span>                                    
                            </span>
                            <span className="element-stat">
                                <div >Electron Configuration: </div>
                                <span className="label">{element["electron_configuration"]}</span>                                    
                            </span>
                        </span>
                    </div>
                    <div className="element-model-container">
                        <h1>3D Model</h1>
                        <ModelViewer link = {element["bohr_model_3d"]}></ModelViewer>
                    </div>
                </div>
            </div>
    )
}

export default ElementInformation