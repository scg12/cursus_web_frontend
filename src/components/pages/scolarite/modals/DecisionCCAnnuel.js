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
var MEETING_GEN_DECISION = undefined

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


function DecisionCCAnnuel(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme = currentUiContext.theme;

    const [isValid, setIsValid] = useState(false);
    
    const [etape,setEtape] = useState(1);
    //const [etape1InActiv, setEtape1InActiv] = useState(setButtonDisable(1));
    //const [etape2InActiv, setEtape2InActiv] = useState(setButtonDisable(2));
    
    const [tabEleves, setTabEleves]= useState([]);
    const [optObjet, setOptObjet] = useState([]);
    
    const [isBilan, setIsBilan] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [currentDecision, setCurrentDecision]=useState(0);
    

    const [optMembres, setOptMembres] = useState([]);
    const [optAutresMembres, setOptAutresMembres] = useState([]);
    const [tabProfsPresents, setTabProfsPresents] = useState([]);
   
    const [optPeriode, setOptPeriode] = useState([]);
    const [presents, setPresents]= useState([]);

    const [optDecisions, setOptDecisions] = useState([]);
    const [optVerdict, setOptVerdict] = useState([]);
    const [optPromuEn, setOptPromuEn] = useState([]);
    const [infosEleves, setInfosEleves] = useState([]);
    const [formMode, setFormMode] = useState(props.formMode);

    const[listDecisions, setListDecisions]   = useState([]);
    const[listPromotions, setListPromotions] = useState([]);

    var firstSelectItem1 = {
        value: 0,   
        label:'-----'+ t('choisir') +'-----'
    }

    var firstSelectItem2 = {
        value: undefined,   
        label:'-----'+ t('choisir') +'-----'
    }

    var RAS = {
        value: -1,
        label: "R.A.S"
    }

    var firstSelectItem3 = {
        value: undefined,   
        label:'--'+ t('choisir') +'--'
    }

    const nonDefini=[        
        {value: -1,   label:'-----'+ t('non defini') +'-----' },
    ];

    const choisir = [        
        {value: undefined,   label:'-----'+ t('choisir') +'-----' },
    ];

    
    const tabTypeConseil=[
        {value:"sequentiel",  label:"Conseil bilan sequentiel" },
        {value:"trimestriel", label:"Conseil bilan trimestriel"},
        {value:"annuel",      label:"Conseil bilan annuel"     },
    ];

    const verdictAnnuel = [
        {value:"admis",        label:t("Admis") },
        {value:"admis_sdc",    label:t("Admis SDC.") },
        {value:"redouble",     label:t("Redouble")},
        {value:"redouble_sdc", label:t("Redouble SDC.")},
        {value:"exclu",        label:t("Exclu")},
        {value:"Exclu_sdc",    label:t("Exclu SDC.")},
    ];
    
    
    
    useEffect(()=> {
        setInfosEleves(props.infosEleves); 

        if(props.listDecisions.length==0 || props.listPromotions.length==0){
            props.infosEleves.map((elt)=>{
                list_decisions_conseil_eleves.push(undefined);
                list_classes_promotions_eleves.push(undefined);
            })             
        }else{
            list_decisions_conseil_eleves  = [...props.listDecisions];
            list_classes_promotions_eleves = [...props.listPromotions];           
        }
        
        setListDecisions(list_decisions_conseil_eleves);
        setListPromotions(list_classes_promotions_eleves);

        var tabPromu = [...props.nextClasses];        
        tabPromu.unshift(RAS);
        tabPromu.unshift(firstSelectItem3);
        setOptPromuEn(tabPromu);
       
        verdictAnnuel.unshift(firstSelectItem3);
        setOptVerdict(verdictAnnuel);
        
        console.log("meeting gdgdg",props.MEETING)

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
        props.closePreview(listDecisions, listPromotions);
    }
   
    /************************************ JSX Code ************************************/
    //----------------- ELEVE (cas par cas)------------

    function decisionChangeHandler(e,rowIndex){
        var selectedDecision = e.target.value;  //initialiser les selects avec undefined
        list_decisions_conseil_eleves = [...listDecisions];
        if(selectedDecision != undefined){
            list_decisions_conseil_eleves[rowIndex] = selectedDecision;
        } else {
            list_decisions_conseil_eleves[rowIndex] = undefined;
        }        
        console.log("class decision",list_decisions_conseil_eleves);
        setListDecisions(list_decisions_conseil_eleves);
    }


    function promotionChangeHandler(e,rowIndex){
        var selectedclassePromotion = e.target.value;  //initialiser les selects avec undefined
        list_classes_promotions_eleves = [...listPromotions];
        if(selectedclassePromotion != undefined){
            list_classes_promotions_eleves[rowIndex] = selectedclassePromotion;
        } else {
            list_classes_promotions_eleves[rowIndex] = undefined;
        }
        console.log("class prom",list_classes_promotions_eleves);
        setListPromotions(list_classes_promotions_eleves);
    }


    function eleveChangeHandler(e){
        if(e.target.value != LIST_ELEVES[0].value){
            document.getElementById('eleveId').style.borderRadius = '1vh';
            document.getElementById('eleveId').style.border = '0.47vh solid rgb(128, 180, 248)';
        
            SELECTED_ELEVE = e.target.value;
        
        }else{
            document.getElementById('eleveId').style.borderRadius = '1vh';
            document.getElementById('eleveId').style.border = '0.47vh solid red';
            SELECTED_ELEVE=undefined
        }
    }

    const LigneEleveHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'50vw', fontSize:'0.77vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black', position:"absolute", top:'10vh'}}>
                <div style={{width:'17vw'}}> {t("nom")}               </div> 
                <div style={{width:'3vw'}}>  {t("age")}               </div>   
                <div style={{width:'7vw'}}>  {t("redouble")}?         </div>
                <div style={{width:'5.3vw'}}>{t("Abs. NJ")}           </div> 
                <div style={{width:'5.3vw'}}>{t("Abs. J")}            </div>
                <div style={{width:'17vw'}}> {t("Convocation CD.")}   </div>
                <div style={{width:'7vw'}}>  {t("Moyenne")}          </div>
                <div style={{width:'13vw'}}> {t("decision")}          </div>
                <div style={{width:'13vw'}}> {t("Promu en")}          </div>
            </div>
        );
    }

    const LigneEleve=(props)=>{
        useEffect(()=> {
            var taille;
            if(formMode!="consult"){
                (listDecisions.length>0) ? taille = listDecisions.length : (listPromotions.length>0) ? taille = listPromotions.length : taille=0
                if(taille > 0 ){
                    if(props.rowIndex < taille){
                        console.log("infos",props.rowIndex)
                        var selectedIndex = optVerdict.findIndex((elt)=>elt.value == listDecisions[props.rowIndex]);
                        if(selectedIndex >=0){
                            document.getElementById('decision'+ props.eleveId).options[selectedIndex].selected = true;
                        }

                        var selectedIndex = optPromuEn.findIndex((elt)=>elt.value == listPromotions[props.rowIndex]);
                        if(selectedIndex >=0){
                            document.getElementById('promuEn'+ props.eleveId).options[selectedIndex].selected  = true;
                        }                        
                    }
                }
            }            
        },[]);

        return(
            <div style={{display:'flex', color:'black', backgroundColor: (props.rowIndex % 2==0) ? 'white':'#e2e8f0cf', flexDirection:'row', height: 'fit-content',width:'50vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw', fontSize:"0.77vw", fontWeight:'bold'}}>         
                    {props.nom}                     
                </div>

                <div style={{width:'3vw', textAlign:'center'}}>                             
                    {props.age}                     
                </div>
                
                <div style={{width:'7vw',   fontSize:"0.77vw",  textAlign:"center"}}>                                         
                    {props.redouble}                
                </div>
                
                <div style={{width:'5.3vw', textAlign:"center", fontSize:"0.77vw", fontWeight:"bold", color:"red"}}>       
                    {props.absences_nj}             
                </div>
                
                <div style={{width:'5.3vw', textAlign:"center", fontSize:"0.77vw", fontWeight:"bold", color:"green"}}>     
                    {props.absences_j}             
                </div>
                
                <div style={{width:'17vw', fontSize:'0.67vw', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', paddingTop:"0.7vh"}}>                            
                    {(props.convocations.split('_')||[]).map((elt)=>{                        
                        return (
                            <div style ={{width:'100%', display:'flex', flexDirection:'row'}}> 
                                <div style={{fontWeight:'bold', marginRight:"0.3vw"}}>  
                                    {elt.split(' ')[0]} 
                                </div>
                                <div>  {elt.split(' ')[1]} </div>                              
                            </div>
                        );                        
                    })}
                </div>
                
                <div style={{width:"7vw"}} > 
                    {props.moyenne}                 
                </div>
 
                {(formMode=="consult")?
                    <div style={{width:'13vw', fontSize:"0.77vw",  textAlign:"center"}}>{props.decision_finale}</div>
                    :
                    <div style={{width:'13vw'}}>
                        <select id={'decision'+ props.eleveId} style={{height:'3.3vh', borderRadius:"1vh", fontSize:'0.77vw', width:'7.7vw', borderStyle:'solid', borderColor:'rgb(128, 180, 248)', borderWidth:'0.47vh', fontWeight:'solid'}} onChange={(e)=>decisionChangeHandler(e,props.rowIndex)}>
                            {(optVerdict||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select> 
                    </div>
                
                }
           

                {(formMode=="consult")?
                    <div style={{width:'13vw', fontSize:"0.77vw",  textAlign:"center"}}>{props.promuEn}</div>

                    :

                    <div style={{width:'13vw'}}>
                        <select id={'promuEn'+ props.eleveId} style={{height:'3.3vh', borderRadius:"1vh", fontSize:'0.77vw', width:'7.7vw', borderStyle:'solid', borderColor:'rgb(128, 180, 248)', borderWidth:'0.47vh', fontWeight:'solid'}} onChange={(e)=>promotionChangeHandler(e,props.rowIndex)}>
                            {(optPromuEn||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select> 
                    </div>
                }
               
              
            </div>
        );
    }

    


    return (
        <div className={'card '+ classes.formContainerP} style={{width:"53vw"}}>
           
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/ConseilClasse.png'/>
                </div>

                <div className={classes.formMainTitle} >
                    {t("Decisions au cas par cas")}
                </div>
                
                
            </div>
                
            <div id='errMsgPlaceHolder'/> 
          
            <div style={{display:'flex', flexDirection:'column', paddingLeft: "2vw", paddingRight:"2vw",  paddinginTop:'30.7vh', height:'70vh', width:'80vw',  justifyContent:'center', position:"absolute"}}>
                <LigneEleveHeader/>
                <div style={{display:'flex', flexDirection:'column', position:"absolute", top:"13vh", width:"50vw", height:"73vh", overflowY:"scroll", overflowX:'scroll'}}>
                    {(infosEleves||[]).map((eleve, index)=>{
                        return (
                            <LigneEleve  
                                eleveId         =  {eleve.id} 
                                rowIndex        =  {index} 
                                nom             =  {eleve.nom} 
                                age             =  {eleve.age}
                                redouble        =  {eleve.redouble==false ? t("no"):t("yes")} 
                                absences_nj     =  {eleve.absences_nj} 
                                absences_j      =  {eleve.absences_j} 
                                convocations    =  {eleve.convocations}
                                moyenne         =  {eleve.moyenne}
                                decision_finale =  {eleve.decision_final_conseil_classe}
                                promuEn         =  {eleve.classe_annee_prochaine_id} 
                            />
                            )
                            
                        })
                    }
                </div>   
                    
            </div>

            <div style={{display:'flex', flexDirection:'row', position:'absolute', right:0, bottom:'3vh'}}>
                <CustomButton
                    btnText={t("quitter")} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={quitFormAndGetData}
                />
            </div>

        </div>

         
       
       
    );
 }
 export default DecisionCCAnnuel;
 