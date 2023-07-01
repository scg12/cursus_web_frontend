import React from 'react';
import classes from "./Book.module.css";
import CustomButton from '../customButton/CustomButton';
import UiContext from '../../store/UiContext';
import AppContext from '../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import {createCTStructure, TAB_ETATLESSONS} from './CT_Module';
import axiosInstance from '../../axios';
import { useTranslation } from "react-i18next";
import '../../translation/i18n';

let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;

let CURRENT_COURS_ID;
let CURRENT_COURS_LABEL;
var CURRENT_FICHE_PROGRESSION;

function Cover(props){

    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const [isValid, setIsValid] = useState(false);
    const [bookOpen, setBookOpen] = useState(false);
    const selectedTheme = currentUiContext.theme;
    const [optClasse, setOpClasse] = useState([]);
    const [optCours, setOpCours] = useState([{value: '0',      label: (i18n.language=='fr') ? ' Choisir ' : ' Choose'}]);
    

    useEffect(()=> {

        if(props.currentClasse==null && props.currentMatiere==null){
            getEtabListClasses();
        }else{
            if(props.currentMatiere!=null) setIsValid(true);
        }     
        
    },[]);

    function initTableOfContent(){
        var parentDiv = document.getElementById('preface');
        if (parentDiv!=null)
        while(parentDiv.firstChild) parentDiv.removeChild(parentDiv.firstChild);
    }


    const getEtabListClasses=()=>{
        var tempTable=[{value: '0',      label: (i18n.language=='fr') ? ' Choisir ' : ' Choose'  }]
         axiosInstance.post(`list-classes/`, {
             id_sousetab: currentAppContext.currentEtab,
         }).then((res)=>{
                 console.log(res.data);
                 res.data.map((classe)=>{
                 tempTable.push({value:classe.id, label:classe.libelle})
                 setOpClasse(tempTable);
                 console.log(tempTable);
            })         
         }) 
    }

    const getClassListCours=(classeId)=>{
        var tempTable=[{value: '0',      label: (i18n.language=='fr') ? ' Choisir ' : ' Choose'  }]
         
        if(classeId!=0){
            axiosInstance.post(`list-cours-classe/`, {
                id_sousetab: currentAppContext.currentEtab,
                id_classe : classeId
            }).then((res)=>{
                console.log(res.data);
                var cours = [...res.data[0].id_cours.split('_')];
                var libellesCours = [...res.data[0].libelle_cours.split(',')]; 
                
                for(var i = 0; i< cours.length; i++) {
                    tempTable.push({value:cours[i], label:libellesCours[i]})
                } 
                setOpCours(tempTable);        
                console.log("iciciicic",tempTable);                        
            }) 

        } else  setOpCours(tempTable);
              
    }

     

    function dropDownHandler(e){
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getClassListCours(CURRENT_CLASSE_ID);   
            document.getElementById("selectId2").options[0].selected=true;
            setIsValid(false);
            //initTableOfContent();
        }else{
            getClassListCours(0); 
            setIsValid(false);
            //initTableOfContent();
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
        }
    }

    function dropDownMatiereHandler(e){      
        if(e.target.value != optCours[0].value){
            setIsValid(true);
            CURRENT_COURS_ID = e.target.value; 
            CURRENT_COURS_LABEL = optCours[optCours.findIndex((cours)=>(cours.value == CURRENT_COURS_ID))].label;          
            createFicheProgression(CURRENT_COURS_ID);
            console.log('cours', CURRENT_COURS_ID);
        }else{
            setIsValid(false);
            //initTableOfContent();
            CURRENT_COURS_ID =undefined; 
            CURRENT_COURS_LABEL ='';
        }
    }

    const createFicheProgression=(coursId)=>{  
        let cts = [];
        let mods = [];
        let chaps = [];
        // axiosInstance.post(`get-fiche-progression/`, {
        axiosInstance.post(`get-cahier-texte/`, {
            id_cours: coursId,
        }).then((res)=>{
            // console.log('fiche progress:', res.data);
            res.data.cts.map(item=>cts.push(item));
            res.data.mods.map(item=>mods.push(item));
            res.data.chaps.map(item=>chaps.push(item));

            console.log("cts: ",cts);
            console.log(mods);
            console.log(chaps);
            createCTStructure(coursId,cts,mods,chaps);   
            /*currentAppContext.setEtatLesson(TAB_ETATLESSONS)
            console.log('etats', currentAppContext.etatLesson)*/                     
        }) 
    }

    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
      }
    }
    
    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
      }
    }

   
    return(
        <div id={props.id} className={classes.couverture}>
            <div className={classes.darkBorder}/>           
            <div className={classes.infoZone}>
                <div className={classes.inputRow} style={{marginLeft:"-5.3vh"}}>                    
                    <div className={classes.inputRowLabelSmall} style={{fontWeight:"700", width:'5vw', paddingTop: '2vh', marginLeft:"-5vh"}}>
                        {t("class")} :                
                    </div>
                    
                    <div>
                        {(props.currentClasse== null) ?                       
                            <select id='selectId1' onChange={dropDownHandler}   className={classes.comboBoxStyle} style={{ width: '5.3vw', marginLeft:"-1vh", marginTop:"1vh", height: "1.3rem", borderLeft:"none", borderRight:"none", borderTop:"none", borderBottom: "1px solid gray", fontSize: "0.93vw" }}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>
                            :
                            <div>
                                <input id='classeId' type='hidden' value={props.currentClasse.id}/>
                                <input id='classeLabel' type='text' value={props.currentClasse.label} style={{ width: '5.3vw', marginLeft:"-1vh", marginTop:"1vh", height: "1.3rem", borderLeft:"none", borderRight:"none", borderTop:"none", borderBottom: "1px solid gray", fontSize: "0.93vw" }}/>                          
                            </div>                        
                        }
                    </div>                    
                </div>

                <div className={classes.inputRow} style={{marginLeft:"7.3vh"}}>
                    <div className={classes.inputRowLabelSmall} style={{ fontWeight:"700", width:'5vw', paddingTop: '2vh', marginLeft:"-7vh"}}>
                        {t("matiere")} :                
                    </div>
                    
                    <div>
                        {(props.currentMatiere == null) ?
                            <select id='selectId2' onChange={dropDownMatiereHandler} className={classes.comboBoxStyle} style={{ width: '10.3vw', marginTop:"2vh", marginLeft:"-1vh", height: "1.3rem", borderLeft:"none", borderRight:"none", borderTop:"none", borderBottom: "1px solid gray", fontSize: "0.93vw" }}>
                                {(optCours||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>
                            :
                            <div>
                                <input id='matiereLabel' type='text' value={props.currentMatiere.label} style={{ width: '10.3vw', marginTop:"2vh", marginLeft:"-1vh", height: "1.3rem", borderLeft:"none", borderRight:"none", borderTop:"none", borderBottom: "1px solid gray", fontSize: "0.93vw" }}/>
                                <input id='matiereId' type='hidden' value={props.currentClasse.id}/>
                            </div>                        
                        }
                    </div>                 
                </div>

                <div className={classes.inputRow} style={{ marginTop:(props.currentMatiere == null) ? null:'-1vh'}}>
                    <CustomButton
                        id='openCloseButton'
                        btnText={props.openText}
                        buttonStyle={getSmallButtonStyle()}
                        btnTextStyle = {classes.btnSmallTextStyle}
                        btnClickHandler={props.openBookHandler}
                        disable = {(isValid==false)}
                    />                    
                </div>
              
            </div>

        </div>
 
           
    );
}
export default Cover;