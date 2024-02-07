import React from 'react'; 
import classes from './MultiSelect.module.css';
import { useContext, useState, useEffect } from "react";
import UiContext from '../../store/UiContext';
import AppContext from '../../store/AppContext';






function DataListRow(props){

    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme     = currentUiContext.theme;

    function getSingleSelectionStyle()
    {  // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_singleSelect;
            case 'Theme2': return classes.Theme2_singleSelect;
            case 'Theme3': return classes.Theme3_singleSelect;
            default: return classes.Theme1_singleSelect;
        }
    }



    return(
        (props.selectionMode == "single")?
            <div className={getSingleSelectionStyle()} style={{display:"flex", flexDirection:"row", justifyContent:"center", width:"100%"}} onDoubleClick={props.SelectionHandler}>
                <input type="hidden" value={props.rowId}/>           
                <div> {props.rowText}  </div>
            </div>
        :
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center", width:"100%"}}>
                <input id={props.rowId} type="hidden" value={props.rowId}/> 
                
                <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", width:"93%"}} >
                    <input type="checkbox" checked={props.selectChecked} onClick={props.selectionHandler}/>
                    <div id={props.rowText}> {props.rowText}  </div>
                </div>
            </div>
    );
}


function MultiSelect(props) {

    // const { t, i18n }       = useTranslation();
    const [SelectionString, setSelectionString]   = useState([]);
    const [selection, setSelection]               = useState([]);
    const [selectionTab, setSelectionTab]         = useState([]);


    
    useEffect(()=> {
        var tab_selection = [];
        props.fetchedData.map((elt)=>{
            tab_selection.push(false);
        });
        setSelectionTab(tab_selection);       
    },[]);


    
  
    function manageSelection(e, idElt, eltText, index){
        var tabSelect    = [...selectionTab];
        var tabSelection = [...selection];

        if(props.selectionMode=="single"){
            tabSelection.push({id:idElt, value:eltText});
        } else {
            console.log("ici");
            if(tabSelect[index]==false){
                tabSelection.push({id:idElt, value:eltText});
                tabSelect[index] = true;                
            } else {
                var searchIndex = tabSelection.findIndex((elt)=>elt.id == idElt)
                if(searchIndex!=-1){
                    tabSelection.splice(searchIndex,1);
                }
                tabSelect[index] = false;
            }  
            console.log("selections",tabSelection,tabSelect)
            setSelectionTab(tabSelect); 
            setSelection(tabSelection);      
        }

        setSelectionString(getSelection(tabSelection));
    }


    function getSelection(tabSelection){
        var selection = "";
        tabSelection.map((elt, index)=>{
            if(index < tabSelection.length-1){
                selection = selection + tabSelection[index].id +'_'+ tabSelection[index].value + '*';
            } else {
                selection = selection + tabSelection[index].id +'_'+ tabSelection[index].value;
            }
        })
        return selection;
    }


    return (
        <div id={props.id} className={classes.multiSelectContainer} style={{display:"flex", flexDirection:"row", ...props.MSContainerStyle}}> 
            <div style={{marginRight:"0.7vw"}}> 
                <select id={props.optionId} onChange={props.optionChangeHandler} style={props.comboBoxStyle}>
                    {(props.optData||[]).map((option)=> {
                        return(
                            <option  value={option.value}>{option.label}</option>
                        );
                    })}
                </select>
            </div>
                
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}> 
                <div style={{display:"flex",height:"3vh", flexDirection:"row", justifyContent:"center", alignItems:"center",border:"solid 1px gray", borderRadius:"2.3vh", marginBottom:"0.3vh", paddingLeft:"1vh"}}>
                    <input type="text"   style={{height:"3vh", marginTop:"1vh", border:"none", ...props.searchInputStyle}} onChange={props.searchTextChangeHandler}></input>
                    <img src={"images/loupe_trans.png"} className={classes.searchImgStyle}/>
                </div>

                <div style={{zIndex:"9999", paddingTop:"1vh", paddingBottom:"1vh",...props.dataFieldStyle}}>
                    {props.fetchedData.map((dataElt, index)=>{
                        return(
                            <DataListRow 
                                rowId            = {dataElt.id} 
                                rowText          = {dataElt.label} 
                                selectionMode    = {props.selectionMode} 
                                selectChecked    = {selectionTab[index]}
                                selectionHandler = {(e)=>manageSelection(e, dataElt.id, dataElt.label, index)}
                            />    
                        )
                                  
                    })}
                </div>
                
                <input id={"hidden_"+props.id} type="hidden" value={SelectionString}/>
                {/* <DataList data = {props.fetchedData} selectionMode={props.selectionMode} selectionHandler={props.selectionHandler}/> */}
            </div>
        </div>
    );
}

export default MultiSelect;