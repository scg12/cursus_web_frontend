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
import CursusAcad from './CursusAcad';

var cur_fileToUpload = undefined;
var cur_coursId = undefined;
var selected_niveau = undefined;
var selected_classe = undefined;
var selected_annee = undefined;
var matricule = undefined;
var nom_eleve = undefined;
var searchedEleves = [];




var chosenMsgBox;
const MSG_SUCCESS_FP =11;
const MSG_WARNING_FP =12;
const MSG_ERROR_FP   =13;

var SEARCHED_ELEVE = undefined;

function SearchAcademicHistory(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme = currentUiContext.theme;
    const [fileSelected, setFileSelected] = useState(false)
    const [isActualStudent,setIsActualStudent]= useState(true);
    const [eleves, setEleves]= useState([]);
    const [elevesP, setElevesP]= useState([])
    
    //const [formMode,setFormMode] = useState("creation") //creation, modif, consult


    const [optClasse, setOptClasse] = useState([]);
    const [optNiveau, setOptNiveau] = useState([]);
    const [optAnnee,  setOptAnnee]= useState([]);
    const [modalOpen,setModalOpen] = useState(0);
    const [inputDataCorrect, setInputDataCorrect] = useState(false);
    
    const [matriculeEnable, setMatriculeEnable] = useState(false);
    const [anneeEnable, setAnneeEnable]   = useState(false)
    const [niveauEnable, setNiveauEnable] = useState(false);
    const [classeEnable, setClasseEnable] = useState(false);
    //const [nomEnable, setNomEnable] = useState(false);
    const [matriculeComplete, setMatriculeComplete] = useState(false);
   // const [nomComplete, setNomComplete] = useState(false)

    useEffect(()=> {
        setOptAnnee(tabAnnee)
        getEtabListClasses();
        getEtabNiveaux();
        currentUiContext.setIsParentMsgBox(false);
    },[]);

   var tabAnnee=
    [   {label:'2020', value:1},
        {label:'2021', value:2},
        {label:'2022', value:3},
        {label:'2023', value:4},
    ];


    var tabEleves=[
        {nom:'ATANGANA Simplice',    value:1},
        {nom:'BELINGA Martin Emile', value:2},
        {nom:'MBARGA Luc  Dimitri',  value:3},
        {nom:'TALLA Hugues Ulrich',  value:4},
        {nom:'ATABONG  Martial',     value:5},
    ];


    const getEtabListClasses=()=>{
        var tempTable=[];
        
        axiosInstance.post(`list-classes/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{                
            res.data.map((classe)=>{
                tempTable.push({value:classe.id, label:classe.libelle})              
            })
            selected_classe = tempTable[0].value;
            setOptClasse(tempTable);   
             
        })
         
    }


    function getEleveData(eleveData){
        var dataEleve = {};
        return new Promise(function(resolve, reject){

            axiosInstance.post(`get-dossier-eleve/`, {
                id_eleve      : isActualStudent ? eleveData.id : eleveData.id_eleve,
                id_sousetab   : currentAppContext.currentEtab,
                est_scolarise : isActualStudent
    
            }).then((res)=>{    
                // var tab = res.data.dossier_eleve[0]; 
                // dataEleve.historic = [];    
                // for(var p=0; p<7; p++)  dataEleve.historic.push(tab);
                eleveData.age       =  res.data.age_actuel;
                dataEleve.persoData =  eleveData; 
                dataEleve.historic  = res.data.dossier_eleve;                
                
                console.log("fffff",dataEleve);   
                resolve(dataEleve);    
            });        
           
        });
        
    }


    const LigneEleve= (props)=>{
        return(
            <div class={"rowHover"} style={{display:"flex", flexDirection:"row",marginBottom:"1.3vh", paddingLeft:"1vh"}}   onDoubleClick={()=>{getEleveData(props.eleveData).then((elvData)=>{SEARCHED_ELEVE={...elvData}; console.log("elvdata",SEARCHED_ELEVE); setModalOpen(1);})}}>
               <img  src={'images/dossierEleve.png'} alt='dossierIcon' style={{width:'1.63vw', height:'1.87vw', marginRight:'1vw',borderRadius:"3px", border:"solid 1px #4a4646"}}/>
               <div style={{fontSize:'0.9vw',  fontWeight:'bold'}}>{props.nom +' '+ props.prenom}</div>
            </div>
        );
    }

    function getEtabNiveaux(){
        var tempTable=[]
        var tabNiveau=[];
         
        tabNiveau =  currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == currentAppContext.currentEtab)
        tabNiveau.map((classe)=>{
        tempTable.push({value:classe.id_niveau, label:classe.libelle});
        });
        selected_niveau = tempTable[0].value;
        setOptNiveau(tempTable);
    }

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_FP: {
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

    const rejectHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_FP: {
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
    
    function classeChangeHandler(e){
        selected_classe = e.target.value;
        searchedEleves = [];
        setEleves([]);
        setElevesP([]);
        console.log('classe Id :',selected_classe);
    }

    function niveauChangeHandler(e){
        selected_niveau = e.target.value;
        searchedEleves = [];
        setEleves([]);
        setElevesP([]);
    }
    
    function anneeChangeHandler(e){
        selected_annee = e.target.value;
        searchedEleves = [];
        setEleves([]);
        setElevesP([]);
    }

    function matriculeActivateHandler(){
        if(!matriculeEnable){
            if(!isActualStudent) setAnneeEnable(false);
            setClasseEnable(false);
            setNiveauEnable(false);
            setMatriculeEnable(true);            
        }else{
            setMatriculeEnable(false);          
        }
        searchedEleves = [];
        setEleves([]);
        setElevesP([]);
        setMatriculeComplete(false);
        matricule='';
        document.getElementById('matricule').value = '';
    }

    function niveauActiveHandler(){
        if(!niveauEnable){
            if(matriculeEnable)setNiveauEnable(false);
            else {
                setNiveauEnable(true);
                setClasseEnable(false);
            }
        }else {setNiveauEnable(false);}
        searchedEleves = [];
        setEleves([]);
        setElevesP([]);
    }

    function classeActiteHandler(){
        if(!classeEnable){
            if(matriculeEnable)setClasseEnable(false);
            else {
                setClasseEnable(true); 
                setNiveauEnable(false);
            }
        }else setClasseEnable(false);
        searchedEleves = [];
        setEleves([]);
        setElevesP([]);
    }

    function AnneeActivateHandler(){
        if(!anneeEnable){
            if(matriculeEnable) setAnneeEnable(false);
            else setAnneeEnable(true);
        }else setAnneeEnable(false);

    }

   /* function nomActivateHandler(){
        if(!nomEnable){
            if(matriculeEnable) setNomEnable(false);
            else setNomEnable(true);
        }else setNomEnable(false);
        setNomComplete(false);
        document.getElementById('nom').value = '';
    }*/

    function quitForm(){
        setModalOpen(0);
    }

  
    function matriculeChangeHandler(e){
        matricule = e.target.value;
        console.log(matricule);
        if(matricule.length > 0) setMatriculeComplete(true);
        else setMatriculeComplete(false);         
    }

    function nomChangeHandler(e){
        nom_eleve = e.target.value;
       
        if(nom_eleve.length > 0){
            var filteredEleves = [...searchedEleves.filter((elev)=>elev.nom.toLowerCase().includes(nom_eleve.toLowerCase()))];
            setEleves(filteredEleves);
        } else{
            setEleves(searchedEleves);
        }
       
    }

    function searchStudent(){

        var listEleves=[];
        setEleves([]);
        axiosInstance.post(`find-eleve/`, {
            matricule   : matriculeEnable ? matricule      :'',
            id_niveau   : niveauEnable    ? selected_niveau:'',
            id_classe   : classeEnable    ? selected_classe:'',
           

        }).then((res)=>{
            console.log("resultats eleves",res.data);
                       
            if(matriculeEnable) {
                searchedEleves.push(res.data);
                listEleves.push(res.data);
                setEleves(listEleves);
                setElevesP(listEleves); 
            } else {               
                res.data.map((elt)=>{listEleves.push(elt); searchedEleves.push(elt);})
                setEleves(listEleves);   
                setElevesP(listEleves);           
            }       
            console.log(eleves)
        })  
        
    }

    function searchArchivedStudent(){

        var listEleves=[];
        setEleves([]);
        axiosInstance.post(`find-archive-eleve/`, {
            matricule   : matriculeEnable ? matricule      :'',
            id_niveau   : niveauEnable    ? selected_niveau:'',
            id_classe   : classeEnable    ? selected_classe:'',
            annee_depart: anneeEnable     ? selected_annee :'',
           

        }).then((res)=>{
            console.log("resultats eleves",res.data);
                       
            if(matriculeEnable) {
                searchedEleves.push(res.data);
                listEleves.push(res.data);
                setEleves(listEleves);
                setElevesP(listEleves); 
            } else {               
                res.data.map((elt)=>{listEleves.push(elt); searchedEleves.push(elt);})
                setEleves(listEleves);   
                setElevesP(listEleves);           
            }       
            console.log(eleves)
        })  
        
    }


    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formContainerP5}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/RechercheDossier.png'/>
                </div>
                           
                <div className={classes.formMainTitle} >
                    {t("student_history_search_M")}
                </div>                
            </div>

            {(modalOpen == 1)&& 
                <CursusAcad 
                    est_scolarise =  {isActualStudent}
                    eleve         =  {SEARCHED_ELEVE.persoData} 
                    dossierEleve  =  {SEARCHED_ELEVE.historic}
                    cancelHandler =  {quitForm}
                /> 
            }

            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox && <BackDrop/>}
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
            
            <div className={classes.searchFormContainer} style={{marginTop:'7vh'}}>               
                <div style={{display:'flex', flexDirection:'row', marginTop:"2vh", marginBottom:'3vh'}}>
                    <input type='radio' style={{width:'1.7vw', height:'2.3vh'}} checked={isActualStudent}  value={'presents'} name='ficheProg' onClick={()=>{isActualStudent? setIsActualStudent(false):setIsActualStudent(true); setEleves([])}}/>
                    <label style={{color:'black',  fontWeight:"bold", fontSize:"1vw", marginRight:"12.3vw", marginLeft:"0.3vw", marginTop:"0vw"}}>{t("current_student")} </label>

                    <input type='radio' style={{width:'1.7vw', height:'2.3vh'}} checked={!isActualStudent}  value={'presents'} name='ficheProg' onClick={()=>{isActualStudent? setIsActualStudent(false):setIsActualStudent(true); setEleves([])}}/>
                    <label style={{color:'black', fontWeight:"bold", fontSize:"1vw", marginLeft:'0.13vw', marginRight:"1vw",marginTop:"0vw" }}>{t("not_current_student")}</label>
                </div> 
                <div className={classes.legend} style={{ marginRight:"0.3vw", top:'17vh'}}> <label style={{/*color:'#e0e06c',*/ color:"white",  fontWeight:"bold", fontSize:"0.83vw",}}><i>{t("select_criteria")}</i></label></div>                    
                <div className={classes.container} style={{marginBottom:'2vw', borderRadius:'7px', marginLeft:"-0.77vw", border:"solid 1.87px gray", justifyContent:'center', alignItems:'center', width:'95%', height:'22vh', paddingLeft:"1vw"}}> 
                    {isActualStudent ?
                        <div className={classes.container} style={{marginBottom:'3.7vh', marginTop:'4.3vh',width:'100%'}}>
                            <div className={classes.inputRowLeft} style={{marginTop:"3.7vh"}}>
                                <div className={classes.container}>
                                    <div className={classes.inputRowLeft}>
                                        <input type='radio' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={matriculeEnable}  value={'presents'} name='matri' onClick={()=>{matriculeActivateHandler()}}/>
                                        <div style={{width:'5.3vw',fontWeight:570}}>
                                            {t('matricule_short')}:  
                                        </div>
                                        
                                        <div style={{marginBottom:'1.3vh'}}>
                                            <input type='text' id='matricule' disabled={!matriculeEnable} style={{height:'3.3vh', fontSise:'0.9rem', width:'10vw', border:'solid 1px gray', borderRadius:4}} onChange={(e)=>matriculeChangeHandler(e)}/>
                                        </div>
                                    </div>

                                    <div className={classes.inputRowLeft} style={{marginTop:"1vh"}}>
                                        <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={niveauEnable}  value={'presents'} name='matri' onClick={()=>{niveauActiveHandler()}}/>
                                        <div style={{width:'7.7vw', fontWeight:570}}>
                                            {t('level')}:  
                                        </div>
                                        
                                        <div style={{marginBottom:'1.3vh', marginLeft:'6vw'}}> 
                                            <select id='optNiveau' disabled={!niveauEnable} defaultValue={1} onChange={niveauChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'4vh',width:'8vw'}}>
                                                {(optNiveau||[]).map((option)=> {
                                                    return(
                                                        <option  value={option.value}>{option.label}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                    
                                        <div className={classes.inputRowLabel} style={{fontWeight:570, marginLeft:'6.3vw'}}>
                                            <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh', marginLeft:'1.3vw'}} checked={classeEnable}  value={'presents'} name='matri' onClick={()=>{classeActiteHandler()}}/>
                                            {t('class')}:   
                                        </div>
                            
                                        <div style={{marginBottom:'1.3vh', marginLeft:'4vw'}}> 
                                            <select id='optClasse' disabled={!classeEnable} defaultValue={1} onChange={classeChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'4vh',width:'8vw'}}>
                                                {(optClasse||[]).map((option)=> {
                                                    return(
                                                        <option  value={option.value}>{option.label}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>                       
                                        
                                    </div>

                                </div>

                            
                            </div>

                            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-end', marginRight:'1.3vw', marginTop:'-3vh', width:'100%'}}>
                                <CustomButton
                                    btnText={t('rechercher')}
                                    hasIconImg= {true}
                                    imgSrc='images/loupe_trans.png'
                                    imgStyle = {classes.searchImgStyle}  
                                    buttonStyle={getGridButtonStyle()}
                                    btnTextStyle = {classes.gridBtnTextStyle}
                                    btnClickHandler={()=>{searchStudent();}}
                                    disable={!matriculeComplete &&!anneeEnable&&!niveauEnable&&!classeEnable}   
                                />
                            </div>      

                            {/*<div className={classes.inputRowLeft} style={{marginTop:"1vh"}}>
                                <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={nomEnable}  value={'presents'} name='matri' onClick={()=>{nomActivateHandler()}}/>
                                <div style={{width:'11.3vw', fontWeight:570}}>
                                    {t('Nom')}:  
                                </div>
                                
                                <div style={{marginBottom:'1.3vh', marginLeft:'-1.7vw'}}> 
                                    <input type='text' id='nom' disabled={!nomEnable} style={{height:'3.3vh', fontSise:'0.9rem', width:'30.3vw', border:'solid 1px gray', borderRadius:4}} onChange={nomChangeHandler}/>
                                </div> 
                            </div>*/}

                        </div>
                        :                                
                        <div className={classes.container} style={{marginBottom:'3.7vh', height:"22vh", marginTop:'4.3vh',width:'100%'}}>
                            <div className={classes.inputRowLeft} style={{marginTop:"3.7vh"}}>
                                <div className={classes.container}>
                                    <div className={classes.inputRowLeft}>
                                        <input type='radio' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={matriculeEnable}  value={'presents'} name='matri' onClick={()=>{matriculeActivateHandler()}}/>
                                        <div style={{width:'5.3vw',fontWeight:570}}>
                                            {t('matricule_short')}:  
                                        </div>
                                        
                                        <div style={{marginBottom:'1.3vh'}}>
                                            <input type='text' disabled={!matriculeEnable} style={{height:'3.3vh', marginLeft:"1.7vw", fontSise:'0.9rem', width:'10vw', border:'solid 1px gray', borderRadius:4}} onChange={matriculeChangeHandler}/>
                                        </div>
                                    </div>

                                    <div className={classes.inputRowLeft} style={{marginTop:"1vh"}}>
                                        <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={niveauEnable}  value={'presents'} name='matri' onClick={()=>{niveauActiveHandler()}}/>
                                        <div style={{width:'12.3vw', fontWeight:570}}>
                                            {t('last_level')}:  
                                        </div>
                                        
                                        <div style={{marginBottom:'1.3vh', marginLeft:'6.3vw'}}> 
                                            <select id='optNiveau' disabled={!niveauEnable} defaultValue={1} onChange={classeChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-9.3vw', height:'4vh',width:'8vw'}}>
                                                {(optNiveau||[]).map((option)=> {
                                                    return(
                                                        <option  value={option.value}>{option.label}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        
                                    </div>

                                </div>

                                <div className={classes.container} style={{alignItems:'flex-start'}}>
                                    <div className={classes.inputRowLeft} style={{marginTop:"-1.7vh", marginBottom:"1vh"}}>
                                        <div className={classes.inputRowLabel} style={{fontWeight:570, width:'19.3vw'}}>
                                            <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={anneeEnable}  value={'presents'} name='matri' onClick={()=>{AnneeActivateHandler()}}/>
                                            {t('last_year')}:                                          
                                        </div>
                                    
                                        <div style={{marginBottom:'1.3vh', marginLeft:'-2vw'}}>  
                                            <select id='optAnnee' disabled={!anneeEnable} defaultValue={1} onChange={anneeChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-5.7vw', height:'4vh',width:'8.7vw'}}>
                                                {(optAnnee||[]).map((option)=> {
                                                    return(
                                                        <option  value={option.value}>{option.label}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>     

                                    <div className={classes.inputRowLeft} style={{marginTop:"1vh"}}>
                                        <div className={classes.inputRowLabel} style={{fontWeight:570, width:'15.3vw'}}>
                                            <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={classeEnable}  value={'presents'} name='matri' onClick={()=>{classeActiteHandler()}}/>
                                            {t('last_class')}:   
                                        </div>
                                    
                                        <div style={{marginBottom:'1.3vh', marginLeft:'6.3vw'}}> 
                                            <select id='optClasse' disabled={!classeEnable} defaultValue={1} onChange={classeChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-9.7vw', height:'4vh',width:'8.7vw'}}>
                                                {(optClasse||[]).map((option)=> {
                                                    return(
                                                        <option  value={option.value}>{option.label}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>                               
                                </div>
                            </div>

                            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-end', marginRight:'1.3vw', marginTop:'-1vh', width:'100%'}}>
                                <CustomButton
                                    btnText={t('Rechercher')}
                                    hasIconImg= {true}
                                    imgSrc='images/loupe_trans.png'
                                    imgStyle = {classes.searchImgStyle}  
                                    buttonStyle={getGridButtonStyle()}
                                    btnTextStyle = {classes.gridBtnTextStyle}
                                    btnClickHandler={()=>{searchArchivedStudent();}}
                                    disable={!matriculeComplete &&!anneeEnable&&!niveauEnable&&!classeEnable }   
                                />
                            </div>    

                            {/*<div className={classes.inputRowLeft} style={{marginTop:"1vh"}}>
                                <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={nomEnable}  value={'presents'} name='matri' onClick={()=>{nomActivateHandler()}}/>
                                <div style={{width:'10.3vw', fontWeight:570}}>
                                    {t('Nom')}:  
                                </div>
                                
                                <div style={{marginBottom:'1.3vh', marginLeft:'-5.7vw'}}> 
                                    <input type='text' disabled={!nomEnable} style={{height:'3.3vh', fontSise:'0.9rem', width:'30.3vw', border:'solid 1px gray', borderRadius:4}} onChange={nomChangeHandler}/>
                                </div>

                                <div style={{marginLeft:'2vw', marginTop:'1.3vh', justifySelf:'flex-end'}}>
                                    <CustomButton
                                        btnText={t('Rechercher')}
                                        hasIconImg= {true}
                                        imgSrc='images/loupe_trans.png'
                                        imgStyle = {classes.searchImgStyle}  
                                        buttonStyle={getGridButtonStyle()}
                                        btnTextStyle = {classes.gridBtnTextStyle}
                                        btnClickHandler={()=>{searchStudent();}}
                                        disable={!matriculeComplete &&!anneeEnable&&!niveauEnable&&!classeEnable &&!nomComplete}   
                                    />
                                </div>                                            
                            
                            </div>*/}
                        </div>
                        
                    }
                </div>

                {eleves.length >= 6 && 
                    <div style={{alignSelf:"flex-end", marginRight:"3.97vw", marginTop:"-3vh"}}>
                        <CustomButton
                            btnText={t('cancel')}
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.btnTextStyle}
                            btnClickHandler={props.cancelHandler}
                        />

                    </div>
                }

                {elevesP.length > 1 && 
                    <div className={classes.inputRowLeft} style={{marginTop:"1vh"}}>
                        {/*<input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.7vh'}} checked={nomEnable}  value={'presents'} name='matri' onClick={()=>{nomActivateHandler()}}/>*/}
                        <div style={{width:'19.3vw', fontWeight:570}}>
                            {t("searched_name")}:  
                        </div>
                        
                        <div style={{marginBottom:'1.3vh', marginLeft:'-5.7vw'}}> 
                            <input type='text' /*disabled={!nomEnable}*/ style={{height:'3.3vh', fontSise:'0.9rem', width:'30.3vw', border:'solid 1px gray', borderRadius:4}} onChange={nomChangeHandler}/>
                        </div>
                    </div>
                }

                {elevesP.length==1 && <div className={classes.legend} style={{marginLeft:"0.7vw",top:'43.3vh'}}> <label style={{color:'white',  fontWeight:"bold", fontSize:"0.83vw",}}><i>{eleves.length} {eleves.length>1 ? t("results"):t("result")}</i></label></div>}
                {elevesP.length>1 &&  <div className={classes.legend} style={{marginLeft:"0.7vw",top:eleves.length>1 ? '51.3vh':'50.7vh'}}> <label style={{color:'white',  fontWeight:"bold", fontSize:"0.83vw",}}><i>{eleves.length} {eleves.length>1 ? t("results"):t("result")}</i></label></div>}
                
                {elevesP.length>0 &&
                    <div className={classes.dataZone}>                
                        {eleves.map((eleve, pos)=>{
                            return(
                                <LigneEleve index={pos}  nom={eleve.nom} prenom={eleve.prenom} eleveData={eleve}/>
                            );
                        })}
                    </div>
                }
            </div>
            {eleves.length < 6 && 
                <div className={classes.formButtonRowPP}>                
                    <CustomButton
                        btnText={t('cancel')}
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={props.cancelHandler}
                    />

                {/* <CustomButton
                        btnText={t('ok')}
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={saveOrUploadFP}
                        disable={(isActualStudent) ? !isActualStudent :!fileSelected}
                />*/}                
                </div>
            }
        </div>       
    );
 }
 export default SearchAcademicHistory;
 