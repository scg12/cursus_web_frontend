import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import axios from 'axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';

var cur_fileToUpload = undefined;
var cur_sequence = undefined;
var cur_coursId = undefined;
var selected_file_name='';
var LISTE_SEQUENCES=[];
var LISTE_TRIMESTRE=[];


var chosenMsgBox;
const MSG_SUCCESS =11;
const MSG_WARNING =12;
const MSG_ERROR   =13;

function ActivateSequence(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme = currentUiContext.theme;
    const [fileSelected, setFileSelected] = useState(false)
    const [sequenceActivated, setSequenceActivated] = useState(false);
    const [checkDisabled, setCheckDisabled] = useState(true);
    
    
   
    const [isValid,setIsValid]= useState(false);
    
    //const [formMode,setFormMode] = useState("creation") //creation, modif, consult


    const [optPeriode, setOptPeriode] = useState([]);
    const [inputDataCorrect, setInputDataCorrect] = useState(false);

    useEffect(()=> {
        selected_file_name='';
        getListSequences();
        currentUiContext.setIsParentMsgBox(false);
        //console.log("msgParents:", currentUiContext.isParentMsgBox)
    },[]);

    var tabPeriode =[
        {label: (i18n.language=='fr') ? '  -- Choisir une période --  ' : '  --Select period --  '  , value: "seq0", actived:false},
        {label:"Sequence 1", value:"seq1", actived:false},
        {label:"Sequence 2", value:"seq2", actived:true },
        {label:"Sequence 3", value:"seq3", actived:true },
        {label:"Sequence 4", value:"seq4", actived:true },
        {label:"Sequence 5", value:"seq6", actived:true },
        {label:"Sequence 6", value:"seq7", actived:true },
    ]

    /*.append({"id":seq.id,"libelle":seq.libelle,"id_trimestre":id_trimestre,"libelle_trimestre":libelle_trimestre,
            "date_deb":seq.date_deb,"date_fin":seq.date_fin,"is_active":seq.is_active,
            "numero":seq.numero})*/


    const getListSequences=()=>{
        var tempTable=[{label: (i18n.language=='fr') ? '  -- Choisir une période --  ' : '  --Select period --  '  , value: 0}]
        LISTE_SEQUENCES=[];
        LISTE_TRIMESTRE=[];
        axiosInstance.post(`list-sequences/`, {
            id_sousetab: currentAppContext.currentEtab,
            id_trimestre:""
        }).then((res)=>{   
            
            LISTE_SEQUENCES = [...res.data.sequences];    
            LISTE_TRIMESTRE = [...res.data.trimestres];        
            res.data.sequences.map((seq)=>{
                tempTable.push({value:seq.id, label:seq.libelle})              
            })   
            setOptPeriode(tempTable); 
            console.log("resultat",res.data, LISTE_SEQUENCES, LISTE_TRIMESTRE); 
        })
        //setOptPeriode(tabPeriode);
    }

   

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               
                return 1;
                
            }

            case MSG_WARNING: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               
            }
        }        
    }

    const rejectHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
            }
        }
        
    }
    
    

    
    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
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

    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
        }
    }

    function getNotifButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_notifButtonStyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_notifButtonStyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P;
        }
    }

   
    /************************************ Handlers ************************************/    
    
    function sequenceChangeHandler(e){
       
        if(e.target.value != optPeriode[0].value){
            cur_sequence = e.target.value;
            //console.log(e.target);
            var etat = LISTE_SEQUENCES.find((elt)=>elt.id==cur_sequence).is_active;
            console.log(etat);
            setCheckDisabled(false);
            setSequenceActivated(etat);
            setIsValid(false);   
                    
        }else{
            cur_sequence = undefined;
            setCheckDisabled(true);
            setSequenceActivated(false);
            setIsValid(false);            
        }
    }
    

    function activateOrDesactivateEvalPeriod(){
        var sequenceToUpdate = LISTE_SEQUENCES.find((elt)=>elt.id==cur_sequence);
        console.log(sequenceToUpdate);
        axiosInstance.post(`update-sequence/`, {
            id : sequenceToUpdate.id,
            id_sousetab : currentAppContext.currentEtab,
            id_trimestre : sequenceToUpdate.id_trimestre,
            libelle : sequenceToUpdate.libelle,
            date_deb : sequenceToUpdate.date_deb,
            date_fin : sequenceToUpdate.date_fin,
            is_active : sequenceActivated,
            numero : sequenceToUpdate.numero
            
        }).then((res)=>{   
            console.log("resultat",res.data); 
            LISTE_SEQUENCES = [...res.data.sequences];  
            
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType:"info", 
                msgTitle:t("success_modif_M"), 
                message:t("success_modif")
            })          
           /* res.data.sequences.map((seq)=>{
                tempTable.push({value:seq.id, label:seq.libelle})              
            })   
            setOptPeriode(tempTable); */
        })
       
    }

    function manageEvalActivation(){
        if(sequenceActivated) setSequenceActivated(false);
        else setSequenceActivated(true);
        setIsValid(true);
    }

    
    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formContainerPPPP}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/activateNotes.png'/>
                </div>
                           
                <div className={classes.formMainTitle} style={{textTransform:'uppercase', fontSize:'1vw', marginLeft:'1vw'}} >
                    {t("new_evaluationP")}
                </div>                
            </div>

            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox && <BackDrop style={{height:'37vh'}}/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("non")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            
                <div className={classes.etape}>                   
     
                    <div className={classes.inputRowLeft} style={{marginLeft:'2vw', marginBottom:"4vh"}}> 
                        <div style={{width:'25vw', marginRight:"1vw",fontWeight:570}}>
                            {t('period')}:  
                        </div>
                            
                        <div style={{marginBottom:'0vh', marginLeft:'-5.7vw'}}> 
                            
                            <select id='optSequence' defaultValue={1} onChange={sequenceChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'1.73rem',width:'12vw'}}>
                                {(optPeriode||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>
                        </div>                            
                        
                    </div>
                    
                    <div className={classes.inputRowLeft} style={{marginLeft:'2vw'}}>
                        <div style={{marginTop:'0.23vh'}}>  
                            <input type='checkbox' disabled={checkDisabled} checked={sequenceActivated} style={{width:"1.3vw", height:"1.3vw"}} onChange={manageEvalActivation}/>                             
                        </div>

                        <div className={classes.inputRowLabel} style={{fontWeight:570, marginLeft:'0.3vw', width:"20vw"}}>
                            {sequenceActivated ? t('disable_mark_recording') : t('enable_mark_recording')}   
                        </div>
                    </div>

                </div>
            
            <div className={classes.formButtonRowP}>
             
                <CustomButton
                    btnText={t('ok')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={activateOrDesactivateEvalPeriod}
                    disable={(isValid) ? !isValid :!fileSelected}
                />

                <CustomButton
                    btnText={t('cancel')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
            </div>

        </div>
       
    );
 }
 export default ActivateSequence;
 