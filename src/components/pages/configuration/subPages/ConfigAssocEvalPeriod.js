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



var typedEvalName     = undefined;
var typedEvalID       = undefined;
var typedEvalPourcent = undefined;
var CURRENT_PERIOD_ID = undefined;
var LIST_SEQ_IDS      = undefined;

var tabTrimestres     = [];
var evaluations       = [];
var eval_data         = [];



function ConfigAssocEvalPeriod(props) {
    const { t, i18n }       = useTranslation();
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme     = currentUiContext.theme;

    const [isValid, setIsValid] = useState(false);
    
    
    const [optTirmestres, setOptTirmestres]  = useState([]);
    const [listEvals,     setListEvals]      = useState([{id:0, nomEval:'', PourcentEval:0,  etat:-1}]);
    const [optEvals,      setOptEvals ]      = useState([]);

    
    useEffect(()=> {
        console.log("valeure", props.defaultMembres);
        listTrimestres();
        listSequences();
    },[]);


    function listTrimestres(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        tabTrimestres = [];
        axiosInstance
        .post(`list-trimestres/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{           
            res.data.map((trm)=>{tabTrimestres.push({value:trm.id, label:trm.libelle})});
            setOptTirmestres(tabTrimestres);
        }, (err)=>{setOptTirmestres([])});  
    }


    function listSequences(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
       
       
        evaluations = [];
        axiosInstance
        .post(`list-sequences/`,{id_sousetab: currentAppContext.currentEtab,id_trimestre:""}).then((res)=>{
                console.log(res.data);
                res.data.sequences.map((seq)=>{evaluations.push({id:seq.id, nomEval:seq.libelle, PourcentEval:0})
            });          
            
            setOptEvals(evaluations);    
            typedEvalName = evaluations[0].nomEval;
            typedEvalID   = evaluations[0].id;
        })  
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


    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
      }
    }


    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
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
   
    /************************************ JSX Code ************************************/

    //----------------- EVALUATION -----------------

    const LigneEvaluationHeader=(props)=>{
        return(
            <div style={{display:'flex', paddingLeft:"0.3vw", color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>{t("eval_name")}</div>
                <div style={{width:'11.3vw'}}>{t("pourcent")}</div>
                <div style={{width:'7vw', marginLeft:'1.7vw'}}>{t("action")}</div>
            </div>
        );
    }

    const LigneEvaluation=(props)=>{
        const [etat, setEtat] = useState(props.etat);
        return(
            <div style={{display:'flex', paddingTop:props.isHeader? "0vh":"1.3vh", color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'4.3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black', }}>
                <div style={{width:'17vw'}}>
                    {(etat >= 0) ? 
                        props.nomEval
                        :
                        <select id='evalNameId' style={{height:'3.5vh', marginBottom:"1vh", fontSize:'0.87vw', width:'11.3vw', borderRadius:'1vh', borderColor:'grey', borderWidth:'1px'}} onChange={evaluationChangeHandler} >
                            {(optEvals||[]).map((option)=> {
                                return(
                                    <option  value={option.id}>{option.nomEval}</option>
                                );
                            })}
                        </select>
                    }
                </div>
                
                <div style={{width:'11.3vw'}}>
                    {(etat >= 0) ? 
                        props.PourcentEval
                      :
                       <input id="evalPourcentId" type="number" style={{width:"3vw", height:"3vh", borderBottom:"none", borderStyle:"solid", borderWidth:1, borderColor:"grey",borderRadius:"1vh"}} onChange={evalPourcentChangeHandler}/> 
                    }
                   %
                </div>
              
                <div style={{width:'7vw', marginLeft:'1.7vw', display:'flex', flexDirection:'row', paddingBottom:"1vh", marginLeft:"0.7vw"}}> 
                    
                    <img src="images/cancel_trans.png"  
                        id={props.evaluationId}
                        width={25} 
                        height={33} 
                        className={classes.cellPointer} 
                        onClick={deleteEvaluation}                         
                        alt=''
                    />
                    

                   { etat==-1 &&
                        <img src="images/checkp_trans.png"  
                            width={19} 
                            height={19} 
                            className={classes.cellPointer} 
                            onClick={addEvaluation}                         
                            alt=''
                            style={{marginLeft:'0.7vw', marginTop:'1.2vh'}}
                        />
                   }

                    { etat>=0 &&
                        <img src="icons/baseline_edit.png"  
                            width={20} 
                            height={20} 
                            className={classes.cellPointer} 
                            alt=''
                            style={{marginLeft:'0.3vw', marginTop:'1vh'}}
                            onClick={()=>{updateEvaluation(props.evaluationId); setEtat(-1)}}
                        />
                    }
                    
                </div>

            </div>
        );
    }

    function evaluationChangeHandler(e){
        console.log(e, e.target.value);
        typedEvalID = e.target.value;

        document.getElementById('evalNameId').style.borderRadius = '1vh';
        document.getElementById('evalNameId').style.border = '1px solid grey';
        typedEvalName = optEvals.find((ev)=>ev.id == typedEvalID).nomEval;
    }


    function evalPourcentChangeHandler(e){
        document.getElementById('evalPourcentId').style.borderRadius = '1vh';
        document.getElementById('evalPourcentId').style.border = '1px solid grey';
        console.log(e, e.target.value);
        typedEvalPourcent = e.target.value;        
    }


    function addEvalRow(e){    

        var errorDiv         = document.getElementById('errMsgPlaceHolder');
        errorDiv.className   = null;
        errorDiv.textContent = '';

        eval_data = [...listEvals];

        var tabEvals = [];
        evaluations.map((ev1)=>{
            if(eval_data.find((ev2)=>ev2.id==ev1.id) == undefined){
                tabEvals.push(ev1)
            }
        });
        setOptEvals(tabEvals);

        typedEvalID   = tabEvals[0].id;
        typedEvalName = tabEvals[0].nomEval;
        
        var index = eval_data.findIndex((elt)=>elt.etat==-1);
        if (index <0){            
            eval_data.push({id:0, nomEval:'', PourcentEval:0,  etat:-1});
            setListEvals(eval_data);
            console.log(eval_data);
        } 
    }

    function addEvaluation(e){
        var errorDiv         = document.getElementById('errMsgPlaceHolder');
        errorDiv.className   = null;
        errorDiv.textContent = '';

        eval_data =[...listEvals];

        if(typedEvalName==undefined || typedEvalName==""){
            document.getElementById('evalNameId').style.borderRadius = '1vh';
            document.getElementById('evalNameId').style.border = '2px solid red';
            return -1;
        }

        if(typedEvalPourcent==undefined || isNaN(typedEvalPourcent)){
            document.getElementById('evalPourcentId').style.borderRadius = '1vh';
            document.getElementById('evalPourcentId').style.border = '2px solid red';
            return -1;
        }

        var index = eval_data.findIndex((elt)=>elt.etat==-1);
        if (index >=0) eval_data.splice(index,1);
    
        eval_data.push({id:typedEvalID, nomEval:typedEvalName, PourcentEval:typedEvalPourcent, etat:0});

        setListEvals(eval_data);

        //setOptEvals(tabEval);
        
        typedEvalName     = undefined;
        typedEvalID       = undefined;
        typedEvalPourcent = undefined;        
    }


    function deleteEvaluation(e){
        console.log(e);
        eval_data = [...listEvals];
        var evaluationId = e.target.id;

        var index = eval_data.findIndex((elt)=>elt.id==evaluationId);
       // var evalToDelete = eval_data.find((elt)=>elt.id==idParticipant);

        if (index >=0){
            eval_data.splice(index,1);
            setListEvals(eval_data);

            // if(participantToDelete.value > 0){
            //     eval_data = [...optAutresMembres];
            //     eval_data.push(participantToDelete);
            //     setOptAutresMembres(eval_data);
            // }
        }

        typedEvalName=undefined;
        typedEvalPourcent = undefined;
    }


    function updateEvaluation(idEval){
        var errorDiv         = document.getElementById('errMsgPlaceHolder');
        errorDiv.className   = null;
        errorDiv.textContent = '';

        eval_data = [...listEvals];
        var index = eval_data.findIndex((ev)=>ev.id==idEval);
        var evalToUpdate = eval_data.find((ev)=>ev.id==idEval);
        if(evalToUpdate!=undefined) {
            
            evalToUpdate.etat=-1; 
            eval_data.splice(index,1,evalToUpdate);

            setListEvals(eval_data);
            setOptEvals(evaluations);
        }
        
        typedEvalID   = eval_data[0].id;
        typedEvalName = eval_data[0].nomEval;

    }


    function getSelectDropDownTextColr() {
        switch(selectedTheme){
            case 'Theme1': return 'rgb(60, 160, 21)';
            case 'Theme2': return 'rgb(64, 49, 165)';
            case 'Theme3': return 'rgb(209, 30, 90)';
            default: return 'rgb(60, 160, 21)';
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

    function getConfigTitleColor(){
        switch(selectedTheme){
            case 'Theme1': return "#3ca015" ;
            case 'Theme2': return "#2358bb" ;
            case 'Theme3': return "#d11e5a" ;
            default: return "#3ca015" ;
        }
    }


    /************************************ Handlers ************************************/  
    
    function validEvalPeriodeAssoc(){
        LIST_SEQ_IDS    = []; 
        var somPourcent = 0;

        var errorDiv         = document.getElementById('errMsgPlaceHolder');
        errorDiv.className   = null;
        errorDiv.textContent = '';

        listEvals.map((ev)=> {
            somPourcent = somPourcent + ev.PourcentEval;
            LIST_SEQ_IDS.push(ev.id);
        });

        if(somPourcent>100 || somPourcent<0){
            //Afficher un message d'erreur
            var errorDiv         = document.getElementById('errMsgPlaceHolder');
            var errorMsg         = t("pourcent_error");
            errorDiv.className   = classes.errorMsg;
            errorDiv.textContent = errorMsg;    
            return;
        }



        axiosInstance.post(`assoc-sequences-trimestre/`, {
            id_trimestre   : CURRENT_PERIOD_ID, 
            list_Seq_Ids   : LIST_SEQ_IDS.join('_'),
            id_sousetab    : currentAppContext.currentEtab
        }).then((res)=>{
            console.log(res.data);
            //Afficher un message de succes
            var successDiv         = document.getElementById('errMsgPlaceHolder');
            var succesMsg          = t("assoc_success");
            successDiv.className   = classes.formSuccessMsg;
            successDiv.textContent = succesMsg;  
            //On met a jour la liste des sequences dispo  
            
        },(err)=>{
            console.log(err);
            //Afficher un message d'erreur
            var errorDiv         = document.getElementById('errMsgPlaceHolder');
            var errorMsg         = t("assoc_error");
            errorDiv.className   = classes.errorMsg;
            errorDiv.textContent = errorMsg;    
        });      

    }
     
 
    // function cancelHandler(){
    //     props.cancelHandler();
    // }
   

    function periodeEvalChanged(e){
        var errorDiv         = document.getElementById('errMsgPlaceHolder');
        errorDiv.className   = null;
        errorDiv.textContent = '';

        CURRENT_PERIOD_ID = e.target.value;
        getPeriodEvals(CURRENT_PERIOD_ID);      
    }


    function getPeriodEvals(periodId){

        var evTab     = [];
        var evIdTab   = [];
        var optEvTab  = [];

        axiosInstance
        .post(`list-sequences/`,{id_sousetab: currentAppContext.currentEtab,id_trimestre:periodId}).then((res)=>{
                console.log("sequences"+res.data.sequences);
                res.data.sequences.map((seq)=>{evTab.push({id:seq.id, etat:0, nomEval:seq.libelle, PourcentEval:0/*PourcentEval:seq.pourcentage*/})
            });          
            
            evTab.map((ev)=>evIdTab.push(ev.id))
            evaluations.map((ev)=>{
                if(!evIdTab.includes(ev.id)){
                    optEvTab.push(ev)
            }});
            setListEvals(evTab);
            setOptEvals(optEvTab);    

            typedEvalName = optEvTab[0].nomEval;
            typedEvalID   = optEvTab[0].id;
        })  


    }
    

   function cancelHandler(e){
        var errorDiv         = document.getElementById('errMsgPlaceHolder');
        errorDiv.className   = null;
        errorDiv.textContent = '';
        
        setOptEvals(evaluations);
        setListEvals([{id:0, nomEval:'', PourcentEval:0,  etat:-1}]);        
   }

    


    return (
        <div className={classes.formStyle}>
                
            <div id='errMsgPlaceHolder'/>
          
            <div id='etape1' className={classes.etapeP}>
                <div className={classes.inputRowLeft} style={{color:getConfigTitleColor(), fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:getConfigTitleColor(), borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                    {t("affect_seq_trim")}
                </div>

                <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}> 
                    <select className={classes.comboBoxStyle} id="id_trimestre" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}} onChange={periodeEvalChanged}>  
                        {                        
                        (optTirmestres||[]).map((option)=> {
                            return(
                                currentUiContext.formInputs[3]==option.value?
                                <option key={option.value} style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                :
                                <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>

                    <CustomButton
                        btnText         ={t('add_eval')} 
                        buttonStyle     = {getButtonStyle()}
                        btnTextStyle    = {classes.btnTextStyleP}
                        btnClickHandler = {addEvalRow}
                        style           = {{marginLeft:"2vw", height:"4.3vh", width:"fit-content",paddingLeft:"0.3vw", paddingRight:"0.3vw"}}
                    />
                </div>
                
                <div className={classes.inputRowLeft}>
                    <div style={{display:'flex', justifyContent:"center", flexDirection:'column', marginTop:'0.7vh', marginLeft:'0vw', paddingLeft:"1vw", width:"99%",paddingRight:"1vw", height:'30vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                        <LigneEvaluationHeader date={'Date'} nbreJours={'Nbre Jours'} etat={'Etat'}/>
                        {(listEvals||[]).map((ev,index)=>{
                            return <LigneEvaluation evaluationId={ev.id}  nomEval={ev.nomEval} PourcentEval={ev.PourcentEval} etat={ev.etat}/>
                            })
                        }

                        <div className={classes.inputRowLeft} style={{justifyContent:"center", marginTop: '2vh', width:"100%"}}>
                            <CustomButton
                                btnText         = {t("cancel")} 
                                buttonStyle     = {getButtonStyle()}
                                btnTextStyle    = {classes.btnTextStyle}
                                btnClickHandler = {cancelHandler}
                                // style           = {{height:"4.3vh"}}
                            />                            
                        
                            <CustomButton
                                btnText         = {t("valider")} 
                                buttonStyle     = {getButtonStyle()}
                                btnTextStyle    = {classes.btnTextStyle}
                                btnClickHandler = {validEvalPeriodeAssoc}
                                style           = {{marginLeft:"2vw", /*height:"4.3vh"*/}}
                            />
                        
                        </div>
                        
                    </div>

                </div>
                                    
            </div>
           
        </div>
       
    );
 }
 export default ConfigAssocEvalPeriod;
 