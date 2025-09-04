import { useEffect, useState } from "react";
import elements from "../assets/periodic-table.json"
function ElementInformation(props){
    const [elementDisplay, setDisplay] = useState("flex")
    const element = elements[props.elementName]
    

    return (
        <div className="element-information-container " id ={props.elementName} style={{display: elementDisplay}}>
                <span id="close-button" >
                    <button onClick={props.onClick}>CLose</button>
                </span>
                <div className="element-information">
                    <div className="element-image-container">
                        <img src={element["image"]["url"]} alt="" />
                        
                        
                    </div>
                    <div className="element-stats-container">
                        <span className="element-name-symbol-container">
                            <span className="pair">
                                <span className="element-symbol">{element["symbol"]}</span>
                                <span className="element-stats-name">{element["name"]}</span>
                            </span>
                            <div className="stats-container">
                                <span className="element-stat">
                                    <div>Phase : </div>
                                    <span>{element["phase"]}</span>
                                </span>
                                <span className="element-stat">
                                    <div>Category :</div>
                                    <span>{element["category"]}</span>
                                </span>
                                <span className="element-stat">
                                    <div>Atomic Mass :</div>
                                    <span>{element["atomic_mass"]}</span>
                                </span>
                                <span className="element-stat">
                                    <div>Density :</div>
                                    <span>{element["density"]}</span>
                                </span>
                                <span className="element-stat">
                                    <div>Boiling Point :</div>
                                    <span>{element["boil"]}</span>
                                </span>
                                <span className="element-stat">
                                    <div>Appearance :</div>
                                    <span>{element["appearance"]}</span>
                                </span>
                            </div>
                        </span>
                    </div>
                    <div className="element-summary-container">

                    </div>
                </div>
            </div>
    )
}

export default ElementInformation