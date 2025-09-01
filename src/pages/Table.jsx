import { useState, useEffect } from "react";
import { Logout } from "../components/Logout";
import Element from "../components/Element"
import elements from "../assets/periodic-table.json"
import BackgroundVideo from "../components/BackgroundVideo";

import "../styles/Game.css"

function Table(){
    //19x10 table layout dito

    const [el, setElements] = useState(new Array())
    const [searchKeyword, setSearchKeyword] = useState("")
    const groups = {'nonmetal': "var(--nonmetal)", 
                    'noblegas' : "var(--noblegas)",
                    'alkaline-earth-metal': "var(--earthalkalinemetal)", 
                    'metalloid': "var(--metalloid)", 
                    'post-transition-metal': "var(--posttransitionmetal)", 
                    'alkalimetal': "var(--alkalimetal)", 
                    'transitionmetal': "var(--transitionmetal)", 
                    'lanthanide': "var(--lanthanide)",
                    'actinide': "var(--actinide)"}

    function addEmptyElements(elementArray, number){
        for(var a = 0; a < number; a++){
            var newElement = <Element elementName = "Empty" isEmpty = {true}></Element>;
            elementArray = [...elementArray, newElement]         
              
        }
        return elementArray   
    }

    function iterateElements(){
        var keys = Object.keys(elements)
        var allElementsInHTML = new Array()
        var count = 0
        for(const i of keys){

            if(count == 1) {
                
                allElementsInHTML = addEmptyElements(allElementsInHTML, 17)
            }
            else if (count == 4){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 11)
            }
            else if (count == 12){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 11)
            }
            else if (count == 21){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 1)
            }
            else if (count == 39){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 1)
            }
            else if (count == 57){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 1)
            }
            else if (count == 75){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 1)
            }
            else if (count == 90){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 23)
            }
            else if (count == 90){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 4)
            }
            else if (count == 104){
                allElementsInHTML = addEmptyElements(allElementsInHTML, 5)
            }

            var newElement = <Element elementName = {elements[i]["name"]} 
            atomicNumber = {elements[i]["number"]} 
            symbol = {elements[i]["symbol"]}
            Color = {elements[i]["cpk-hex"]}
            category = {elements[i]["category"]}
            ></Element>;
            
            
            allElementsInHTML = [...allElementsInHTML, newElement]
            count++
        }
        return allElementsInHTML
    }

    const checkAllElements = (e) => {
        setSearchKeyword(e.target.value)
        console.log(e.target.value)
        var getAllElement = document.getElementsByClassName("element")

        for(const i of getAllElement){
            var category = i.children[3].textContent.toLowerCase()
            var atomicNumber = i.children[0].textContent
            var symbol = i.children[1].textContent.toLowerCase()
            var elementName = i.children[2].textContent.toLowerCase()
            
            

            if(category == "none") {
                
                continue
            }
            

            if(e.target.value == ""){
                
                
                i.classList.remove("highlight")
                continue
            } 

            if (category.includes(searchKeyword.toLowerCase()) || atomicNumber.includes(searchKeyword) || symbol.includes(searchKeyword.toLowerCase()) || elementName.includes(searchKeyword.toLowerCase())){
                i.classList.add("highlight")
            }
            else {
                i.classList.remove("highlight")
            }
        }
        
        
    }

    return(
        
        <div className="table-container">
            <div className="search-container">
                <input type="text" placeholder="Search element name, atomic number, group" onChange={checkAllElements}/>
            </div>
            <div className="legend-container">
                <div className="legend" >
                    <div className="element-legend actinide">*</div>
                    <div>Alkali Metal</div>
                </div>
                <div className="legend">
                    <div className="element-legend alkaline-earth-metal">*</div>
                    <div>Alkaline Earth Metal</div>
                </div>
                <div className="legend">
                    <div className="element-legend transitionmetal">*</div>
                    <div>Transition Metal</div>
                </div>
                <div className="legend">
                    <div className="element-legend post-transition-metal">*</div>
                    <div>Post Transition Metal</div>
                </div>
                <div className="legend">
                    <div className="element-legend metalloid">*</div>
                    <div>Metalloid</div>
                </div>
                <div className="legend">
                    <div className="element-legend nonmetal">*</div>
                    <div>Non-Metal</div>
                </div>
                <div className="legend">
                    <div className="element-legend noblegas">*</div>
                    <div>Noble Gas</div>
                </div>
                <div className="legend">
                    <div className="element-legend lanthanide">*</div>
                    <div>Lanthanide</div>
                </div>
                <div className="legend">
                    <div className="element-legend actinide">*</div>
                    <div>Actinide</div>
                </div>
            </div>
            <div className="table">
                {
                    iterateElements()
                }
                
            </div>
        </div>
    )
}

export default Table