import React from 'react'; 
import classes from './MultiSelect.module.css';
import CustomButton from '../customButton/CustomButton';
import { useContext, useState, useEffect } from "react";
import UiContext from '../../store/UiContext';
import AppContext from '../../store/AppContext';
import { useTranslation } from "react-i18next";






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
            <div className={getSingleSelectionStyle()} style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", width:"100%", paddingLeft:"1vw"}} onClick={props.selectionHandler}>
                <input id={props.rowId} type="hidden" value={props.rowId}/>
                <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", width:"100%"}} >
                    <div style={{fontSize:"1.7vw", marginTop:"-2.3vh", width:"10%"}}>.</div>           
                    <div style={{width:"100%", textOverflow:"ellipsis"}} id={props.rowId}> {props.rowText} </div>
                </div>
            </div>
        :
            <div style={{display:"flex", flexDirection:"row", justifyContent:"center", width:"100%"}}>
                <input id={props.rowId} type="hidden" value={props.rowId}/> 
                
                <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", width:"93%"}} >
                    <input type="checkbox" checked={props.selectChecked} onClick={props.selectionHandler}/>
                    <div id={props.rowId} style={{width:"100%", textOverflow:"ellipsis"}}> {props.rowText}  </div>
                </div>
            </div>
    );
}


function MultiSelect(props) {

    const { t, i18n }       = useTranslation();
    const [SelectionString,   setSelectionString]    = useState([]);
    const [SelectionIdString, setSelectionIdString]  = useState([]);
    const [selection, setSelection]               = useState([]);
    const [selectionTab, setSelectionTab]         = useState([]);


    
    useEffect(()=> {
        var tab_selection = [];
        props.fetchedData.map((elt)=>{
            tab_selection.push(false);
        });
        setSelectionTab(tab_selection);       
    },[props.fetchedData]);


    
  
    function manageSelection(e, idElt, eltText, index){
        var tabSelect    = [...selectionTab];
        var tabSelection = [...selection];

        if(props.selectionMode == "single"){
            tabSelection.push({id:idElt, value:eltText});
            document.getElementById("searchText").value = eltText;
            console.log("ici",tabSelection);
            props.selectValidatedHandler();
        } else {
            console.log("select", tabSelect, tabSelection);
            if(eltText == t('all')){
                if(tabSelect[index]==false){
                    tabSelection = [];
                    tabSelect    = [];
                    props.fetchedData.map((elt,index)=>{
                        if(index > 0){
                            tabSelection.push({id:elt.id, value:elt.label});}
                            tabSelect.push(true);
                                           
                    })
                } else {
                    tabSelection = [];
                    tabSelect    = [];
                    props.fetchedData.map((elt,index)=>{
                        // if(index > 0){
                        //     tabSelection.push({id:elt.id, value:elt.label});}
                            tabSelect.push(false);
                                           
                    })

                }

            } else{
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

            }
           
            console.log("selections",tabSelection,tabSelect)
            setSelectionTab(tabSelect); 
            setSelection(tabSelection);      
        }

        
        document.getElementById("hidden1_"+props.id).value = getSelectionIds(tabSelection);
        document.getElementById("hidden2_"+props.id).value = getSelection(tabSelection).split('_').join(",");
        
    }


    function getSelection(tabSelection){
        var selection   = "";
        tabSelection.map((elt, index)=>{
            if(index < tabSelection.length-1){
                selection   = selection + elt.value +'_';
            } else {
                selection   = selection + elt.value ;
            }
        })
        return selection;
    }

    function getSelectionIds(tabSelection){
        var selectionId = "";
        tabSelection.map((elt, index)=>{
            if(index < tabSelection.length-1){
                selectionId = selectionId + elt.id + '*' + elt.value +'_';                
            } else {
                selectionId = selectionId + elt.id + '*' + elt.value;
            }
        })
        console.log("destinataires",selectionId);
        return selectionId;
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
                <div style={{display:"flex",height:"3vh", flexDirection:"row", justifyContent:"center", alignItems:"center",border:"solid 1px gray", borderRadius:"2.3vh", marginBottom:"0.3vh", paddingLeft:"1vh", ...props.searchInputStyleP}}>
                    <input id={"searchText"} type="text"   style={{height:"3vh", marginTop:"1vh", border:"none", ...props.searchInputStyle}} onChange={props.searchTextChangeHandler}></input>
                    <img src={"images/loupe_trans.png"} className={classes.searchImgStyle}/>
                </div>

                {(props.fetchedData.length>0)&& 
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
                    

                        {(props.selectionMode=="multiple")&&
                            <div style={{display:"flex", flexDirection:"column",alignItems:"flex-end", width:"93%"}}>
                                <CustomButton
                                    btnText= {t("ok")}  
                                    buttonStyle={classes.btnAdd}
                                    btnTextStyle = {classes.btnTextStyle}
                                    hasIconImg= {false}
                                    btnClickHandler={props.selectValidatedHandler}
                                />
                            </div>
                        }
                    </div>
                }
                                
                
                <input id={"hidden1_"+props.id} type="hidden" />
                <input id={"hidden2_"+props.id} type="hidden" />
                {/* <DataList data = {props.fetchedData} selectionMode={props.selectionMode} selectionHandler={props.selectionHandler}/> */}
            </div>
        </div>
    );
}

export default MultiSelect;