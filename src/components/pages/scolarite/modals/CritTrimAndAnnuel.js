import React from 'react';
import ReactDOM from 'react-dom';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import {isMobile} from 'react-device-detect';
import CustomButton from "../../../customButton/CustomButton";
import  FormNumero from "../../../formPuce/FormNumero";
import FormPuce from '../../../formPuce/FormPuce';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from '../../../backDrop/BackDrop';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate,changeDateIntoMMJJAAAA, getTodayDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


var LIST_ELEVES = undefined;
var SELECTED_ROLE = undefined;
var SELECTED_PARTICIPANT = undefined;
var SELECTED_DECISION = 0 //0-> Recale, 1-> Admis, 2-> Traduit, 3->Blame, 4->Autre
var SELECTED_ELEVE = undefined;
var MEETING_OBJET_ID = undefined;
var MEETING_OBJET_LABEL = undefined;


var PERIODE_ID = undefined;
var PERIODE_LABEL = "";
var MEETING_GEN_DECISION = undefined;
var CRITERIA = {};

var LIST_NEXT_CLASSES ='';


var participant_data = [];

var eleves_data=[];
var MEETING = {};
var dateDeb, heureDeb;

var list_decisions_conseil_eleves  = [];
var list_classes_promotions_eleves = [];

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;


function CritTrimAndAnnuel(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme = currentUiContext.theme;

    const [isValid, setIsValid] = useState(false);    
    const [optClassed, setOptClassed]   = useState([]);
    const [infosEleves, setInfosEleves] = useState([]);
    const [formMode, setFormMode] = useState(props.formMode);

    const tabClasse = [
        {value:1,  label:t("yes") },
        {value:0,  label:t("no")  },
    ];
    
    useEffect(()=> {
        setInfosEleves(props.infosEleves); 
        setOptClassed(tabClasse);
    },[]);

   
    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }


    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
        }
    }
   
    /************************************ Handlers ************************************/  
   
    
    function quitFormAndGetData(){
        //props.closePreview(listDecisions, listPromotions);
    }

    function genererBulletins(){
        props.generateBulletinHandler(CRITERIA)
    }
   
    /************************************ JSX Code ************************************/
    function periodeCheck(e,rowIndex){
        
    }

    function classedChangeHandler(e,rowIndex){

    }

    const LigneEleveHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'50vw', fontSize:'0.77vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black', position:"absolute", top:'10vh'}}>
                <div style={{width:'8vw'}}>   {t("matricule")}           </div>
                <div style={{width:'17vw'}}>  {t("nom")}                 </div> 
                { props.tabPeriodes.map((periode=>{
                    return(                        
                        <div style={{width:'5vw', marginLeft:'0.7vw'}}>  {periode.libelle} </div>
                    )                         
                    
                }))}
                <div style={{width:'15vw'}}>  {t("trim_considere")} </div>
                <div style={{width:'8vw'}}>   {t("classer")}        </div> 
            </div>
        );
    }

    const LigneEleve=(props)=>{
        
        return(
            <div style={{display:'flex', color:'black', backgroundColor: (props.rowIndex % 2==0) ? 'white':'#e2e8f0cf', flexDirection:'row', height: 'fit-content',width:'50vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw', fontSize:"0.77vw", fontWeight:'bold'}}>         
                    {props.eleve.matricule}                     
                </div>

                <div style={{width:'3vw', textAlign:'center'}}>                             
                    {props.eleve.nom}                     
                </div>
                
                { props.eleve.notes.map((note=>{
                    return(                        
                        <div style={{width:'5vw', marginLeft:'0.7vw'}}>  {note} </div>
                    )                         
                    
                }))}

                <div style={{width:'15vw'}}>
                    { props.tabPeriodes.map((periode=>{
                        return(                        
                            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly"}}>
                                <input type="checkbox" checked={true} onClick={()=>periodeCheck(props.rowIndex)}/>
                                <div>{periode.label}</div>
                            </div>
                        )                         
                        
                    }))}
                </div>
                
                <div style={{width:'7vw'}}>
                    <select id={'decision'+ props.eleveId} style={{height:'3.3vh', borderRadius:"1vh", fontSize:'0.77vw', width:'7.7vw', borderStyle:'solid', borderColor:'rgb(128, 180, 248)', borderWidth:'0.47vh', fontWeight:'solid'}} onChange={(e)=>classedChangeHandler(e,props.rowIndex)}>
                        {(optClassed||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>                                  
                </div>
            </div>        
        );
    }

    return (
        <div className={'card '+ classes.formContainerP} style={{width:"53vw"}}>           
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/criteresGeneration.png'/>
                </div>

                <div className={classes.formMainTitle} >
                    {t("CRITERES DE SELECTION DES ELEVES POUR GENERATION") }
                </div>
                
                
            </div>
                
            <div id='errMsgPlaceHolder'/> 
          
            <div style={{display:'flex', flexDirection:'column', paddingLeft: "2vw", paddingRight:"2vw",  paddinginTop:'30.7vh', height:'70vh', width:'80vw',  justifyContent:'center', position:"absolute"}}>
                <LigneEleveHeader/>
                <div style={{display:'flex', flexDirection:'column', position:"absolute", top:"13vh", width:"50vw", height:"73vh", overflowY:"scroll", overflowX:'scroll'}}>
                    {(infosEleves||[]).map((eleve, index)=>{
                        return (
                            <LigneEleve eleve={eleve}/>
                        )                            
                    })}
                    
                </div>   
                    
            </div>

            <div style={{display:'flex', flexDirection:'row', position:'absolute', right:0, bottom:'3vh'}}>

                <CustomButton
                    btnText={t("quitter")} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={quitFormAndGetData}
                />

                <CustomButton
                    btnText={t("generer")} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={genererBulletins}
                />
            </div>

        </div>
       
    );
 }
 export default CritTrimAndAnnuel;
 