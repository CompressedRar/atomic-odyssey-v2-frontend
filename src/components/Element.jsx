import { useState, useEffect } from "react";



function Element(props){
    const atomicNumber = props.atomicNumber ? props.atomicNumber: 0
    const symbol = props.symbol ? props.symbol: "N"
    const elementName = props.elementName ? props.elementName: "None"
    const atomicMass = props.atomicMass ? props.atomicMass: 0
    const category = props.category ? props.category: "None"
    const period = props.period ? props.period: 0
    const phase = props.phase ? props.phase: "None"
    const density = props.density ? props.density: 0
    const isEmpty = props.isEmpty ? props.isEmpty: false
    const color = props.Color ? `#${props.Color}` : "#ffffff"


    const isHighlighted = props.isHighlighted

    const [styling, setStyling] = useState({})
    const groups = {'nonmetal': "var(--nonmetal)", 
                    'noblegas' : "var(--noblegas)",
                    'alkaline-earth-metal': "var(--earthalkalinemetal)", 
                    'metalloid': "var(--metalloid)", 
                    'post-transition-metal': "var(--posttransitionmetal)", 
                    'alkalimetal': "var(--alkalimetal)", 
                    'transitionmetal': "var(--transitionmetal)", 
                    'lanthanide': "var(--lanthanide)",
                    'actinide': "var(--actinide)"}
    
    const toggleHighlight = () => {
        setStyling(isHighlighted? {backgroundColor: groups[category], color: "black"}: {})
    } 
    
    useEffect(()=> {
        
        toggleHighlight()
    }, [])
    
    return (
        <div className={ !isEmpty? `element ${category}`: "element empty-element"}>
            <span className="atomic-number">{atomicNumber}</span>
            <span className="symbol">{symbol}</span>
            <span className="element-name">{elementName}</span>
            <span style={{opacity:0}}>{category}</span>

            <div className="element-information-container ">
                <div className="element-information">
                    <div className="element-image-container">
                        <img src="" alt="" />
                    </div>
                    <div className="element-stats-container">
                        <span className="element-name-symbol-container">
                            <span className="element-symbol"></span>
                            <span className="element-stats-name"></span>
                        </span>
                    </div>
                    <div className="element-model-container">

                    </div>
                    <div className="element-summary-container">

                    </div>
                </div>
            </div>
        </div>

        
    )
}

export default Element