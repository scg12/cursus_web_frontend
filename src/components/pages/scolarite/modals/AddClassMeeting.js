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
import DecisionCCAnnuel from './DecisionCCAnnuel';


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

var listDecisions  = [];
var listPromotions = [];

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;


function AddClassMeeting(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme = currentUiContext.theme;

    const [isValid, setIsValid] = useState(false);
    
    const [etape,setEtape] = useState(1);
    const [etape1InActiv, setEtape1InActiv] = useState(setButtonDisable(1));
    const [etape2InActiv, setEtape2InActiv] = useState(setButtonDisable(2));
    
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
    const [LargeViewOpen, setLargeViewOpen] = useState(false);

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

    var NDEF = {
        value: -1,
        label: t("not_defined")
    }

    var firstSelectItem3 = {
        value: undefined,   
        label:'--'+ t('choisir') +'--'
    }

    const nonDefini=[        
        {value: -1,   label:'-----'+ t('not_defined') +'-----' },
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
        console.log("valeure", props.defaultMembres);
        //getClassStudentList(props.currentClasseId);
       
        setOptPeriode(nonDefini);
 
        if (props.formMode == 'creation'){

            LIST_ELEVES = props.eleves;

            var tempTab = [...tabTypeConseil];
            tempTab.unshift(firstSelectItem2);
            setOptObjet(tempTab);
   
            tempTab = [...props.defaultMembres];
           //tempTab.unshift(firstSelectItem);
            setOptMembres(tempTab);
    
            tempTab = [...props.otherMembres];
            tempTab.unshift(firstSelectItem1);
            setOptAutresMembres(tempTab);

            console.log("les tableaux", optMembres,optAutresMembres);

        } else {

            //---------- liste des promotions possibles ----------
            var tabPromu = [...props.nextClasses];
            tabPromu.unshift(NDEF);
            tabPromu.unshift(firstSelectItem3);
            setOptPromuEn(tabPromu);


            //---------- liste des Decisions possibles----------
            var tabVerdict = [...verdictAnnuel];
            tabVerdict.unshift(firstSelectItem3);
            setOptVerdict(tabVerdict);


 
            var tempTab = [...props.defaultMembres];
            //tempTab.unshift(firstSelectItem1);
            setOptMembres(tempTab);
    
            tempTab = [...props.otherMembres];
            tempTab.unshift(firstSelectItem1);
            setOptAutresMembres(tempTab);

            tempTab = [...props.presentsMembres];
            setTabProfsPresents(tempTab);

            tempTab = []; // a initialiser d'abord...
            tempTab.unshift(choisir);
            setOptDecisions(tempTab);


            tempTab = []; // a initialiser d'abord...
            tempTab.unshift(choisir);
            setOptDecisions(tempTab);

            var infos_eleves = currentUiContext.formInputs[10];
            setInfosEleves(infos_eleves);
            console.log("infos Eleves",infos_eleves);

            var listDecisions  = [];
            var listpromotions = [];

            if(props.nextClasses.length>0){
                infos_eleves.map((elt)=>{
                //  if(elt.decision_final_conseil_classe !== null && elt.decision_final_conseil_classe.length > 0 && elt.classe_annee_prochaine_id > 0){
                    if(elt.decision_final_conseil_classe != null && elt.classe_annee_prochaine_id != null){
                        listDecisions.push(elt.decision_final_conseil_classe);
                        listpromotions.push(elt.classe_annee_prochaine_id);
                    }else{
                        listDecisions.push("admis");
                        listpromotions.push(props.nextClasses[0].value);
                    }              
                })
            } else {
                infos_eleves.map((elt)=>{
                    if(elt.decision_final_conseil_classe != null && elt.classe_annee_prochaine_id != null){
                        listDecisions.push(elt.decision_final_conseil_classe);
                        listpromotions.push(elt.classe_annee_prochaine_id);
                    }else{
                        listDecisions.push("admis");
                        listpromotions.push(NDEF);
                    }
                })
            }
            
            setListDecisions(listDecisions);
            setListPromotions(listpromotions);

            console.log("les tableaux",optMembres,optAutresMembres);

            MEETING = {};
        
            MEETING.id_conseil_classe  = putToEmptyStringIfUndefined(currentUiContext.formInputs[0]);
            MEETING.classeId           = props.currentClasseId; 
            MEETING.classeLabel        = props.currentClasseLabel;
            
            MEETING.currentPpUserId    = props.currentPpUserId;
            MEETING.profPrincipalId    = props.currentPpId; 
            MEETING.profPrincipalLabel = props.currentPpLabel;
           
            
            MEETING.date         = putToEmptyStringIfUndefined(currentUiContext.formInputs[1]);
            MEETING.heure        = putToEmptyStringIfUndefined(currentUiContext.formInputs[2]);
            MEETING.periode      = putToEmptyStringIfUndefined(currentUiContext.formInputs[5]); //Mettre la periode 
            MEETING.id_periode   = putToEmptyStringIfUndefined(currentUiContext.formInputs[4]); //Mettre la periode              

            PERIODE_ID    = MEETING.id_periode;
            PERIODE_LABEL = MEETING.periode;

            
            MEETING.type_conseil    = putToEmptyStringIfUndefined(currentUiContext.formInputs[3]);  //Mettre le type de conseil
            MEETING.alerter_membres = true;
            
            MEETING_OBJET_ID    = putToEmptyStringIfUndefined(currentUiContext.formInputs[4]);
            MEETING_OBJET_LABEL =  MEETING.type_conseil;
            
            //----- 2ieme partie du formulaire1 ----- 
            MEETING.resume_general_decisions = putToEmptyStringIfUndefined(currentUiContext.formInputs[11]); 
            MEETING.status = putToEmptyStringIfUndefined(currentUiContext.formInputs[8]);
            MEETING.etat = putToEmptyStringIfUndefined(currentUiContext.formInputs[8]);

            MEETING_GEN_DECISION = MEETING.resume_general_decisions;

            if(MEETING.type_conseil=="annuel") setIsBilan(true);

            console.log("meeting",MEETING);

            if (props.formMode == 'modif') {

                //initialisation du select objet du conseil
                var tempTab = [...tabTypeConseil];             
                var index1  = tempTab.findIndex((elt)=>elt.value ==  MEETING.type_conseil);
                var objet   = tempTab.find((elt)=>elt.value ==  MEETING.type_conseil);
                
                tempTab.splice(index1,1);
                tempTab.unshift(objet);
                
                MEETING_OBJET_ID    = objet.value;
                MEETING_OBJET_LABEL = objet.label;

                setOptObjet(tempTab);
                
                //initialisation du select periode associee
               

                var tabPeriode =[];
                switch(objet.value){
                    case 'sequentiel'  : {tabPeriode = [...props.sequencesDispo];              break;}
                    case 'trimestriel' : {tabPeriode = [...props.trimestresDispo];             break;}
                    case 'annuel'      : {tabPeriode = [...props.anneDispo]; setIsBilan(true); break;}
                    default: tabPeriode = nonDefini;
                }
                

                var index2  = tabPeriode.findIndex((elt)=>elt.value == MEETING.id_periode);
                var periode = tabPeriode.find((elt)=>elt.value ==  MEETING.id_periode);
                
                console.log("objet",objet,MEETING.type_conseil, MEETING.id_periode,periode, tabPeriode);
                tabPeriode.splice(index2,1);
                tabPeriode.unshift(periode);

                PERIODE_ID    = periode.value;
                PERIODE_LABEL = periode.label;

                setOptPeriode(tabPeriode)
            }

            console.log("hhgtuiop",currentUiContext.formInputs);
        }      

    },[]);

    
    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            console.log(listEleves);
            LIST_ELEVES= [...getElevesTab(res.data)];
            console.log(LIST_ELEVES) ;  
            if(LIST_ELEVES.length>0){
                LIST_ELEVES.map((elt)=>{
                    list_decisions_conseil_eleves.push(undefined);
                    list_classes_promotions_eleves.push(undefined);
                }) 
            }       
        })  
        return listEleves;     
    }

    const getNextClassPossibles =(classeId) =>{
        axiosInstance.post(`list-classes-prochaines/`, {
            id_classe: classeId,
        }).then((res)=>{
            console.log(res.data);
            LIST_NEXT_CLASSES = res.data.classes;
               
        }) 

    }

    function getElevesTab(elevesTab){
        var tabEleves = [{value:0,label:"- Choisir un eleve -"}]
        var new_eleve;
        elevesTab.map((eleve)=>{
            new_eleve = {};
            new_eleve.value = eleve.id;
            new_eleve.label = eleve.nom +' '+eleve.prenom;
            tabEleves.push(new_eleve);       
        })
        return tabEleves;
    }

   
   
    function setButtonDisable(etape){
        switch(props.formMode){  
            case 'creation':                     
                switch(etape){
                    case 1: return false;
                    case 2: return true;
                }
            case 'modif':
                switch(etape){
                    case  1: return false;
                    case  2: return true;
                }
            default : 
                switch(etape){
                    case  1: return false;
                    case  2: return false;
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
   
    /************************************ Handlers ************************************/  
    function getDecisionGeneraleHandler(e){
        //console.log("dfdffd",e);
        MEETING_GEN_DECISION = e.target.value;
    }


    function periodeChangeHandler(e){
        console.log("hdhhdh",e.target.value)
        if(e.target.value > 0){
            PERIODE_ID    = e.target.value;
            PERIODE_LABEL = e.target.label;
        } else {
            PERIODE_ID = undefined;
            PERIODE_LABEL = "";
        }
    }


    function getNonSelectedMembers(){
        var tabOthers = [...props.otherMembers];
        var members = [... props.defaultMembrers];
        var tabNonSelectedElt =[]
        
        tabOthers.map((elt)=>{
            if(!members.includes(elt)){
                tabNonSelectedElt.push(elt);
            }
        })

        return tabNonSelectedElt;
    }
  
    function saveMeetingHandler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        getFormData();
      
        if(formDataCheck1().length==0){

            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            } 

            MEETING.status = 0 ;
            MEETING.statusLabel = t('en_cours') ;

            props.actionHandler(MEETING);
           // else props.modifyClassMeeting(MEETING);
           
        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1();
        }

    }

    function gotoStep2Handler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log("toronto1", currentUiContext.formInputs);
        getFormData();
        if(formDataCheck1().length==0){
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }  
                        
            setEtape2InActiv(false);
            setEtape(2);
            setFormData2();
            setIsButtonClicked(true);
        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1();
        }
        
    }

    function backToStep1Handler(){
        console.log("toronto2", currentUiContext.formInputs);
        getFormData();
        //setFormData();
        setEtape2InActiv(true);
        setEtape(1);       
    }
    
    function finishAllSteps(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',MEETING);
        getFormData();
        console.log('apres:',MEETING);
        
        if(formDataCheck2().length==0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
              
            MEETING.status = 1 ;
            MEETING.statusLabel = t('cloture') ; 
            MEETING.to_close = true;    
            props.actionHandler(MEETING);  
            //props.modifyMeetingHandler(MEETING);

        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck2();
        }
    }   


    function printReportHandler(){
        console.log('avant:',MEETING);
        getFormData();
        props.printReportHandler(MEETING);
        console.log('apres:',MEETING);
    }


    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getListElementByFields(tabEleves, fields){
        var tab = [] ;
        console.log(tabEleves);
        (tabEleves||[]).map((elev,index)=>{tab.push(elev[fields])});

        if (tab.length==0) return '';
        else return tab.join('²²');
    }
    

    function getFormData(){
        
        MEETING = {};

        //----- 1ere partie du formulaire1 ----- 
        if(props.formMode == "creation") MEETING.id_conseil_classe = -1;             
        else MEETING.id_conseil_classe = currentUiContext.formInputs[0]; 
            
        MEETING.id_sousetab    =  currentAppContext.currentEtab;

        MEETING.classeId       =  props.currentClasseId; 
        MEETING.classeLabel    =  props.currentClasseLabel;

        MEETING.currentPpUserId    = props.currentPpUserId;
        MEETING.profPrincipalId    = props.currentPpId; 
        MEETING.profPrincipalLabel = props.currentPpLabel;
            
            
        MEETING.type_conseil    = MEETING_OBJET_LABEL;  //Mettre le type de conseil
        MEETING.type_conseilId  = MEETING_OBJET_ID;     //Mettre l'ID type conseil
            
        MEETING.id_periode      = PERIODE_ID            //Mettre la periode   
        MEETING.periode         = PERIODE_LABEL;  
              
            
        MEETING.alerter_membres = true;
        if (props.formMode != 'consult'){
            if(etape==1){
                dateDeb  = document.getElementById('jour').value+'/'+ document.getElementById('mois').value + '/' + document.getElementById('anne').value;
                heureDeb = document.getElementById('heure').value+':'+ document.getElementById('min').value ;
                    
                MEETING.date  = dateDeb;
                MEETING.heure = heureDeb;
            } else{
                MEETING.date  = dateDeb;
                MEETING.heure = heureDeb;
            }
        } else {
            MEETING.date         = putToEmptyStringIfUndefined(currentUiContext.formInputs[1]);
            MEETING.heure        = putToEmptyStringIfUndefined(currentUiContext.formInputs[2]);
        }

        MEETING.date_effective   = getTodayDate();
            
        //----- 2ieme partie du formulaire1 ----- 
        MEETING.id_eleves = getListElementByFields(tabEleves, "value");                 //Mettre la chaine des eleves separe par²²

        //----- 3ieme partie du formulaire1 ----- 
        MEETING.id_membres      = getListElementByFields(optMembres, "value");          //Mettre la liste des membres separe par²²
        MEETING.roles_membres   = getListElementByFields(optMembres, "role");           //Roles des membres
        //MEETING.membre_presents = getListElementByFields(tabProfsPresents, "value");    //Mettre la liste des membres presents separe par²²
        
        
        //----- 1ere partie du formulaire2 -----
        MEETING.resume_general_decisions = MEETING_GEN_DECISION;                        //Resumer des decisions

        //----- 2ieme partie du formulaire2 -----
        MEETING.id_eleves  =  getListElementByFields(infosEleves, "id");
        MEETING.list_decisions_conseil_eleves  = [...listDecisions].join("²²");
        MEETING.list_classes_promotions_eleves = [...listPromotions].join("²²");

        //----- 3ieme partie du formulaire2 -----
        MEETING.membre_presents = getListElementByFields(tabProfsPresents, "value");  //Liste des membres presents
        MEETING.to_close = false;

        //-------------- Pour les besoin d'impression -------------
        MEETING.listDecisions        = [...listDecisions];
        MEETING.listPromotions       = [...listPromotions];
        MEETING.classProm            = [...props.nextClasses];
        MEETING.infoGeneralesEleves  = [...infosEleves];
        MEETING.listParticipants     = [...tabProfsPresents];
       
        console.log(MEETING);       
    }


    function setFormData1(){
        var tabEleve=[];        
        tabEleve[1]  =  convertDateToUsualDate(MEETING.date); 
        tabEleve[2]  =  MEETING.heure;
        tabEleve[3]  =  MEETING.type_conseil; 
        tabEleve[4]  =  MEETING.id_type_conseil;
        tabEleve[5]  =  MEETING.periode;
        tabEleve[8]  =  MEETING.status;
        tabEleve[9]  =  MEETING.statusLabel;
        tabEleve[11] =  MEETING.resume_general_decisions;
       
        currentUiContext.setFormInputs(tabEleve);
        console.log(MEETING.date);
    }
  
    function setFormData2(){
        var tabEleve=[];       
 
        var profPresent =[];
        optMembres.map((elt, index)=>{profPresent[index]=true});
        setPresents(profPresent);

        profPresent = [];
        optMembres.map((elt)=>{
            profPresent.push({value:elt.value, label:elt.label, role:elt.role, present:elt.present, etat:0});
        })

        setTabProfsPresents(profPresent);

        tabEleve[0]  =  MEETING.id_conseil_classe;
        tabEleve[1]  =  convertDateToUsualDate(MEETING.date); 
        tabEleve[2]  =  MEETING.heure;
        tabEleve[3]  =  MEETING.type_conseil; 
        tabEleve[4]  =  MEETING.id_type_conseil; 
        tabEleve[5]  =  MEETING.periode;      
        tabEleve[8]  =  MEETING.status;
        tabEleve[9]  =  MEETING.statusLabel;
        tabEleve[11] =  MEETING.resume_general_decisions;
        currentUiContext.setFormInputs(tabEleve);

        console.log('ici',currentUiContext.formInputs, profPresent);
    }

   
    function formDataCheck1(){       
        var errorMsg='';
        var meeting_hour = MEETING.heure.split(':')[0];
        var meeting_min = MEETING.heure.split(':')[1];
       
        if(meeting_hour[0]=='0') meeting_hour = meeting_hour[1];
        if(meeting_min[0]=='0')  meeting_min  = meeting_min[1];
       
        if(MEETING.date.length == 0) {
            errorMsg=t("enter_meeting_date");
            return errorMsg;
        } 

        if(!((isNaN(changeDateIntoMMJJAAAA(MEETING.date)) && (!isNaN(Date.parse(changeDateIntoMMJJAAAA(MEETING.date))))))){
            errorMsg=t("enter_good_meeting_date");
            return errorMsg;
        }

        if(meeting_hour.length == 0|| meeting_min.length == 0) {
            errorMsg=t("enter_good_meeting_hour");
            return errorMsg;
        } 

        if(isNaN(meeting_hour)||isNaN(meeting_min)){
            errorMsg=t("enter_good_meeting_hour");
            return errorMsg;
        }

        if((eval(meeting_hour)>22 || eval(meeting_hour)< 7)  || (eval(meeting_min)>59 || eval(meeting_min)<0)){
            errorMsg=t("enter_good_meeting_hour");
            return errorMsg;
        }

        if( MEETING.type_conseilId == undefined ){
            errorMsg=t("selecte_meeting_purpose");
            return errorMsg;
        }    

        //Test de posteriorite a la date d'aujourd'hui
        if(new Date(changeDateIntoMMJJAAAA(MEETING.date)+' 23:59:59') < new Date()) {
            errorMsg = t("meeting_date_lower_than_today_error");
            return errorMsg;
        }
        return errorMsg;  
    }
    
    function formDataCheck2(){       
        var errorMsg='';
        

        if(MEETING.resume_general_decisions.length == 0 ){
            errorMsg=t("type_meeting_decision");
            return errorMsg;
        }

        if(MEETING.type_conseilId == "annuel"){
            
            if(list_decisions_conseil_eleves.find((elt)=>elt==undefined)!= undefined){
                errorMsg = t("decision_not_set");
                return errorMsg;
            }
    
            if(list_classes_promotions_eleves.find((elt)=>elt==undefined)!= undefined){
                errorMsg = t("next_class_not_set");
                return errorMsg;
            }

        }
       
        return errorMsg;  
    }


    
    function moveOnMax(e,currentField, nextField){
        if(nextField!=null){
            e = e || window.event;
            if(e.keyCode != 9){
                if(currentField.value.length >= currentField.maxLength){
                    nextField.focus();
                }
            }
        }
     
    }

    function showStep1(){
        if(props.formMode=='consult'){
            setFormData1(); setEtape(1);
        }
    }

    function showStep2(){
        if(props.formMode=='consult'){
            setFormData2(); setEtape(2);
        }

    }

    
    function objetChangeHandler(e){
       
        var typeConseil = e.target.value;
        var tabPeriode = nonDefini;
        
       if(typeConseil != undefined){       
            switch(typeConseil){
                case 'sequentiel'  : {tabPeriode = [...props.sequencesDispo];              break;}
                case 'trimestriel' : {tabPeriode = [...props.trimestresDispo];             break;}
                case 'annuel'      : {tabPeriode = [...props.anneDispo]; setIsBilan(true); break;}
                default: tabPeriode = nonDefini;
            }
            
            if(typeConseil=='sequentiel'|| typeConseil=='trimestriel'){
                setOptPeriode(tabPeriode.filter((elt)=>elt.deja_tenu == 0));
            } else setOptPeriode(tabPeriode);

            console.log("periode choisie",tabPeriode, typeConseil);

            var meeting = tabTypeConseil.find((meetg)=>meetg.value == typeConseil);

            MEETING_OBJET_ID    = meeting.value;
            MEETING_OBJET_LABEL = meeting.label;

            if(tabPeriode.length>0){                
                PERIODE_ID    = tabPeriode[0].value;
                PERIODE_LABEL = tabPeriode[0].label;
            }else{
                PERIODE_ID    = undefined;
                PERIODE_LABEL = undefined;
            }           
  
        } else {
            MEETING_OBJET_ID    = undefined;
            MEETING_OBJET_LABEL = undefined;

            PERIODE_ID    = undefined;
            PERIODE_LABEL = undefined;
        }
    }


    function cancelHandler(){
        MEETING={};
        props.cancelHandler();
    }
  
    function moveToLeft(){
        if(isButtonClicked) 
        document.getElementById("etape1").classList.add('gotoRight');
    }

    function agrandirView(){
        setLargeViewOpen(true);
    }

    function quitPreview(List_Decisions, List_promotions){
        console.log("donnnee",List_Decisions, List_promotions);
        
        setListDecisions(List_Decisions);
        setListPromotions(List_promotions);
        
        setLargeViewOpen(false);
    }

    /************************************ JSX Code ************************************/

    //----------------- PARTICIPANT-----------------
   
    function participantChangeHandler(e){
        console.log(e, e.target.value);
        if(e.target.value != optAutresMembres[0].value){

           var selected_memmbre = optAutresMembres.find((elt)=>(elt.value == e.target.value));

            document.getElementById('participantId').style.borderRadius = '1vh';
            document.getElementById('participantId').style.border = '0.47vh solid rgb(128, 180, 248)';
            SELECTED_PARTICIPANT = e.target.value;
            SELECTED_ROLE = selected_memmbre.role;

        }else{
            document.getElementById('participantId').style.borderRadius = '1vh';
            document.getElementById('participantId').style.border = '0.47vh solid red';
            SELECTED_PARTICIPANT = undefined;
            SELECTED_ROLE = undefined;
        }

    }


    function addParticipantRow(){       
        participant_data = [...optMembres];
        var index = participant_data.findIndex((elt)=>elt.value==0);
        if (index <0){            
            participant_data.push({value:0, label:'', role:'', present:true, etat:-1});
            setOptMembres(participant_data);
            console.log(participant_data);
        } 
    }

    function addParticipant(){
        participant_data =[...optMembres];

        if(SELECTED_PARTICIPANT==undefined){
            document.getElementById('participantId').style.borderRadius = '1vh';
            document.getElementById('participantId').style.border = '0.47vh solid red';
            return -1;
        }

        var index = participant_data.findIndex((elt)=>elt.value==0);
        if (index >=0) participant_data.splice(index,1);
      
        var nomParticipant   = optAutresMembres.find((participant)=>participant.value==SELECTED_PARTICIPANT).label;
        var indexParticipant = optAutresMembres.findIndex((participant)=>participant.value==SELECTED_PARTICIPANT)
        
        participant_data.push({value:SELECTED_PARTICIPANT, label:nomParticipant, /*roleId:SELECTED_ROLE,*/ role:SELECTED_ROLE, present:true, etat:0});
        setOptMembres(participant_data);

        participant_data = [...optAutresMembres];
        participant_data.splice(indexParticipant,1);
        setOptAutresMembres(participant_data);
        
        SELECTED_PARTICIPANT=undefined;
        SELECTED_ROLE = undefined;        
    }

    function deleteParticipant(e){
        console.log(e);
        console.log("participants",optMembres);
        participant_data =[...optMembres];
        var idParticipant = e.target.id;

        var index = participant_data.findIndex((elt)=>elt.value==idParticipant);
        var participantToDelete = participant_data.find((elt)=>elt.value==idParticipant);

        if (index >=0){
            participant_data.splice(index,1);
            setOptMembres(participant_data);

            if(participantToDelete.value > 0){
                participant_data = [...optAutresMembres];
                participant_data.push(participantToDelete);
                setOptAutresMembres(participant_data);
            }
        }
        SELECTED_PARTICIPANT=undefined;
        SELECTED_ROLE = undefined

    }

    const LigneProfParticipantHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>{t("nom")}</div>
                <div style={{width:'11.3vw'}}>{t("qualite")}</div>
                <div style={{width:'7vw', marginLeft:'1.7vw'}}>{t("action")}</div>
            </div>
        );
    }

    const LigneProfParticipant=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>
                    {(props.etat >= 0) ? 
                        props.nom
                     :
                        <select id='participantId' style={{height:'3.5vh', fontSize:'0.87vw', paddingTop:'1.3vh', width:'11.3vw', borderRadius:'1vh', borderColor:'#80b4f8', borderWidth:'0.47vh'}} onChange={participantChangeHandler} >
                            {(optAutresMembres||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select> 
                    }
                </div>
                
                <div style={{width:'11.3vw'}}>
                    { props.role}
                </div>
              
                <div style={{width:'7vw', marginLeft:'1.7vw', display:'flex', flexDirection:'row'}}> 
                    {(props.etat<=0)&&
                        <img src="images/cancel_trans.png"  
                            id={props.participantId}
                            width={25} 
                            height={33} 
                            className={classes.cellPointer} 
                            onClick={deleteParticipant}                         
                            alt=''
                        />
                    }

                    {(props.etat<0)&&
                        <img src="images/checkp_trans.png"  
                            width={19} 
                            height={19} 
                            className={classes.cellPointer} 
                            onClick={addParticipant}                         
                            alt=''
                            style={{marginLeft:'1vw', marginTop:'1.2vh'}}
                        />
                    }
                </div>

            </div>
        );
    }

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

    function addEleveRow(){
        eleves_data = [...tabEleves];
        var index = eleves_data.findIndex((elt)=>elt.id==0);
        if (index <0){
            eleves_data.push({id:0, nom:'', decisions:[0,1,2,3,4], decisionsId:0, decisionsLabel:'', etat:0});
            setTabEleves(eleves_data);
        } else {alert("ici")}

    }

    function addEleve(){
        eleves_data = [...tabEleves];
        if(SELECTED_ELEVE==undefined){
            document.getElementById('eleveId').style.borderRadius = '1vh';
            document.getElementById('eleveId').style.border = '0.47vh solid red';
            return -1;
        }
        
        var index = eleves_data.findIndex((eleve)=>eleve.id==0);
        if (index >= 0)  eleves_data.splice(index,1);
        
        var eleveNom = LIST_ELEVES.find((eleve)=>eleve.value==SELECTED_ELEVE).label;
        eleves_data.push({id:SELECTED_ELEVE, nom:eleveNom, decisionsId:currentDecision, decisionLabel:getDecision(currentDecision), decisions:[0,0,0,0,0], etat:1})
        setTabEleves(eleves_data);
        
        SELECTED_ELEVE=undefined;
    }

    function getDecision(decisionId){
        switch(decisionId){
            case 0:  return t('recale');
            case 1:  return t('admis');
            case 2:  return t('traduit');
            case 3:  return t('blame')
            default: return t("autre");
        }
   
    }

    function deleteEleve(e){
        var eleveId = e.target.id;
        eleves_data = [...tabEleves];
        var index = eleves_data.findIndex((eleve)=>eleve.id==eleveId);
        if (index >= 0) {
            eleves_data.splice(index,1);
            setTabEleves(eleves_data);
        }
        SELECTED_ELEVE=undefined;
    }

    const LigneEleveHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'50vw', fontSize:'0.77vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}> {t("nom")}               </div> 
                <div style={{width:'3vw'}}>  {t("age")}               </div>   
                <div style={{width:'7vw'}}>  {t("redouble")}?         </div>
                <div style={{width:'5.3vw'}}>{t("Abs. NJ")}           </div> 
                <div style={{width:'5.3vw'}}>{t("Abs. J")}            </div>
                <div style={{width:'17vw', textAlign:"center"}}> {t("Convocation CD.")}   </div>
                <div style={{width:'7vw'}}>  {t("Moyenne")}          </div>
                <div style={{width:'13vw'}}> {t("decision")}          </div>
                <div style={{width:'13vw'}}> {t("Promu en")}          </div>
            </div>
        );
    }

    const LigneEleve=(props)=>{
        var taille;
        useEffect(()=> {
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
                            <div style ={{width:'100%', display:'flex', flexDirection:'row', justifyContent:"center"}}> 
                                <div style={{fontWeight:'bold', marginRight:"0.3vw", justifyContent:"center"}}>  
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
                    <div style={{width:'13vw', fontSize:"0.77vw",  textAlign:"center"}}>{ (MEETING.status == 1) ? props.decision_finale : t("not_set")}</div>
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
                    <div style={{width:'13vw', fontSize:"0.77vw",  textAlign:"center"}}>{(MEETING.status == 1) ? props.promuEn : t("not_set")}</div>

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

    //----------------- ENSEIGNANTS PRESENTS ------------

    function managePresent(e){
        e.preventDefault();
        var participants = [...optMembres];
        var tabPresent = [...presents];
        var row = e.target.id;

        if(e.target.checked){
            tabPresent[row]=true;
            participants[row].present= true;
            e.target.checked = true;
            setPresents(tabPresent);
            setOptMembres(participants);

        } else {
           tabPresent[row]=false;
           participants[row].present= false;
           e.target.checked = false;
            setPresents(tabPresent);
            setOptMembres(participants);
        }

    }

    const LignePresentsHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>{t("nom")}</div>
                <div style={{width:'10vw'}}>{t("present")}</div>
            </div>
        );
    }

    const LignePresent=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>               
                    {props.nom}                   
                </div>
                
                <div style={{display:'flex',  flexDirection:'row', alignItems:'center'}}> 
                    <input type='checkbox' style={{width:'1vw', height:'2vh'}} checked={presents[props.rowIndex]}  id={props.rowIndex} name ={'Present'+props.rowIndex} onChange={managePresent}/>                    
                </div>              
            </div>
        );
    }



    return (
        <div className={'card '+ classes.formContainerP}>
            {(currentUiContext.formIsloading) && <BackDrop/>}
            {(currentUiContext.formIsloading) &&
                <div style={{ alignSelf: 'center',position:'absolute', top:"60vh",  fontSize:'0.9vw', fontWeight:'bolder', color:'#fffbfb', zIndex:'1207',marginTop:'-5.7vh'}}> 
                    {t('loading')}...
                </div>                    
            }
            {(currentUiContext.formIsloading) &&
                <div style={{   
                    alignSelf: 'center',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '13vw',
                    height: '3.13vh',
                    position: 'absolute',
                    top:'57vh',
                    backgroundColor: 'white',
                    zIndex: '1200',
                    overflow: 'hidden'
                }}
                >
                    <img src='images/Loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
                </div>                    
            }

            {LargeViewOpen && 
                <DecisionCCAnnuel 
                    infosEleves    = {infosEleves} 
                    nextClasses    = {props.nextClasses}
                    listDecisions  = {listDecisions}
                    listPromotions = {listPromotions}
                    closePreview   = {quitPreview}
                    formMode       = {formMode}
                    MEETING        = {MEETING}
                />
            }
            
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/ConseilClasse.png'/>
                </div>
                {(props.formMode == 'creation')  ?                
                    <div className={classes.formMainTitle} >
                        {t("enreg_conseil_c")}
                    </div>
                : (props.formMode == 'modif') ?
                    <div className={classes.formMainTitle} >
                        {t("modif_conseil_c")}
                    </div>
                :
                    <div className={classes.formMainTitle} >
                        {t("consult_conseil_c")}
                    </div>
                
                }
                
            </div>
                
            <div id='errMsgPlaceHolder'/> 

            {(etape == 1) &&
                <div id='etape1' className={classes.etapeP} onLoad={()=>{moveToLeft()}}>
                    <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                        {t("etape")+' 1'}: {t("conseil_class_prepa")}
                        {(props.formMode=='consult')&&
                            <div style={{display:'flex', flexDirection:'row', position:'absolute', right:0, top:'-0.7vh' }}>
                                {(currentUiContext.formInputs[8]==1) ?  //conseil cloture
                                    <CustomButton
                                        btnText={t("print_pv")} 
                                        buttonStyle={getSmallButtonStyle()}
                                        style={{marginBottom:'-0.3vh', marginRight:'1vw'}}
                                        btnTextStyle = {classes.btnSmallTextStyle}
                                        btnClickHandler={printReportHandler}
                                    />
                                    :null
                                }
                                <CustomButton
                                    btnText={t("quitter")} 
                                    buttonStyle={getSmallButtonStyle()}
                                    style={{marginBottom:'-0.3vh', marginRight:'0.8vw'}}
                                    btnTextStyle = {classes.btnSmallTextStyle}
                                    btnClickHandler={props.cancelHandler}
                                />
                            </div>
                        }
                 
                    </div>
                    <div style={{fontSize:'1vw', fontWeight:'bold', marginBottom:'2vh', marginLeft:'0vw'}}>
                        <FormPuce menuItemId ='1' 
                            isSimple={true} 
                            noSelect={true} 
                            imgSource={'images/' + getPuceByTheme()} 
                            withCustomImage={true} 
                            imageStyle={classes.PuceStyle}    
                            libelle = {t("meeting_gen_info")}   
                            itemSelected={null}
                        />
                        
                       
                    </div>

                    <div className={classes.inputRowLeft}>
                        <div className={classes.groupInfo} style={{fontSize:'1vw'}}>
                            <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570, }}>
                                    {t("classe_cible")}: 
                                </div>                    
                                <div style={{marginBottom:'1.3vh', marginLeft:'-2vw'}}>  
                                    <input id="classe" type="text" className={classes.inputRowControl }  defaultValue={props.currentClasseLabel} style={{width:'3vw', textAlign:'center', height:'1.3vw', fontSize:'1.3vw', marginLeft:'0vw', color:'#898585'}} disabled={true}/>
                                    <input id="classe" type="hidden"  defaultValue={props.currentClasseId}/>
                                </div>
                            </div>
                           
                            <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("prof_principal")}:
                                </div>
                                    
                                <div> 
                                    <input id="profPrincipalLabel" type="text" disabled={true} className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-2vw', height:'1rem', width:'15vw', fontSize:'1.13vw', color:'#898585'}}/>
                                    <input id="profPrincipalId" type="hidden"  defaultValue={props.currentPpId}/>
                                </div>
                            </div>
                    
                            <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("date_conseil")} :  
                                </div>
                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="date_meeting" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[1]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>
                                    :
                                    (currentUiContext.formInputs[1].length == 0) ?
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="jour"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', fontSize:'1vw', height:'1.3vw', marginLeft:'-2vw'}} />/
                                        <input id="mois"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw'}}  />/
                                        <input id="anne"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("heure"))}}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw'}}  />
                                    </div>
                                    :
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="jour"  type="text"  maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}      className={classes.inputRowControl}  style={{width:'1.3vw', fontSize:'1vw', height:'1.3vw', marginLeft:'-2vw'}}  defaultValue={currentUiContext.formInputs[1].split("/")[0]} />/
                                        <input id="mois"  type="text"  maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}      className={classes.inputRowControl}  style={{width:'1.7vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[1].split("/")[1]} />/
                                        <input id="anne" type="text"  maxLength={4}   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("heure"))}}     className={classes.inputRowControl}  style={{width:'2.7vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[1].split("/")[2]} />
                                    </div>
                                }

                                <div className={classes.inputRowLabelP} style={{fontWeight:570, marginLeft:'2vw'}}>
                                    {t("heure_conseil")} :  
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="heure" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[2]} style={{width:'3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}}/>
                                    </div>
                                    :
                                    (currentUiContext.formInputs[2].length == 0) ?
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="heure"  type="text"  Placeholder='hh'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure"), document.getElementById("min"))}}     maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}} /><b>h</b>
                                        <input id="min"  type="text"    Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min"), document.getElementById("objet"))}}     maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  /><b>min</b>
                                    </div>
                                    :
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="heure"  type="text" maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure"), document.getElementById("min"))}}      className={classes.inputRowControl}  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}}  defaultValue={currentUiContext.formInputs[2].split(":")[0]} /><b>h</b>
                                        <input id="min"  type="text"   maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min"), document.getElementById("objet"))}}      className={classes.inputRowControl}  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[2].split(":")[1]} /><b>min</b>
                                    </div>
                                }

                            </div>

                            <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("meeting_purpose")}:
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="objetLabel" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[3]} style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                        <input id="objetId" type="hidden"    className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[4]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>  
                                    :

                                    <select id='objet' defaultValue={MEETING.objetId} onChange={objetChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-2vw', height:'1.87vw',width:'15vw'}}>
                                        {(optObjet||[]).map((option)=> {
                                            return(
                                                <option  value={option.value}>{option.label}</option>
                                            );
                                        })}
                                    </select>
                                }

                               
                            </div>

                             <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("periode_associee")}:  
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="periodeLabel" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[5]}    style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                        <input id="periodeId" type="hidden"   className={classes.inputRowControl}   defaultValue={currentUiContext.formInputs[1]}   style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>  
                                    :
                                    <div>                                     
                                        <select id='periode' defaultValue={MEETING.responsableId} onChange={periodeChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-2vw', height:'1.87vw',width:'15vw'}}>
                                            {(optPeriode||[]).map((option)=> {
                                                return(
                                                    <option  value={option.value}>{option.label}</option>
                                                );
                                            })}
                                        </select> 
                                    </div>
                                }
                            </div>

                            
                           
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', height:'33vh', marginLeft:'-2vw'}}>
                                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:'1vw', fontWeight:'bold', marginBottom:'0vh', marginLeft:'0vw', width:'97%'}}>
                                    <FormPuce menuItemId ='1' 
                                        isSimple={true} 
                                        noSelect={true} 
                                        imgSource={'images/' + getPuceByTheme()} 
                                        withCustomImage={true} 
                                        imageStyle={classes.PuceStyle}    
                                        libelle = {t("profs_convoques")}   
                                        itemSelected={null}
                                        style={{marginBottom:'-1vh'}}
                                        puceImgStyle={{marginRight:'-0.3vw', marginTop:'1vh'}}
                                    />  

                                    {(props.formMode!='consult')&&
                                        <CustomButton
                                            btnText={t("add")} 
                                            buttonStyle={getSmallButtonStyle()}
                                            style={{marginBottom:'-0.3vh', marginRight:'0.8vw'}}
                                            btnTextStyle = {classes.btnSmallTextStyle}
                                            btnClickHandler={()=>{addParticipantRow()}}
                                        />    
                                    }               
                                </div>

                                <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'30vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                                    <LigneProfParticipantHeader date={'Date'} nbreJours={'Nbre Jours'} etat={'Etat'}/>
                                    {(optMembres||[]).map((prof)=>{
                                        return <LigneProfParticipant  participantId={prof.value} nom={prof.label} role={prof.role} etat={prof.etat}/>
                                        })
                                    }
                                </div>

                            </div>
                            
                        </div>
                       
                    </div>
                    
                    
                    {(props.formMode != 'consult') &&
                        <div className={classes.inputRowRight} style={{position:'absolute', bottom:'0', marginBottom: isMobile ? '-1vh':'-3vh'}}>
                            <CustomButton
                                btnText={t("cancel")} 
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={cancelHandler}
                            />                            
                           
                            <CustomButton
                                btnText={t("save")} 
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={saveMeetingHandler}
                            />
                            
                            {(props.formMode == 'modif') &&
                                <CustomButton
                                    btnText={t("etape")+' 2 >'} 
                                    buttonStyle={getGridButtonStyle()}
                                    btnTextStyle = {classes.btnTextStyle}
                                    btnClickHandler={gotoStep2Handler}
                                />
                            }
                        </div>
                    }                    
                </div>
            }

            {(etape > 1) &&
                <div id ='etape2' className={classes.etapeP} onLoad={()=>{document.getElementById("etape2").classList.add('gotoLeft');}} >
                    <div className={classes.inputRowLeft} style={{color:'rgb(185, 131, 14)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(185, 131, 14)', borderBottomWidth:1.97, marginBottom:'3vh'}}> 
                        {t("etape")+' 2'}: {t("closing_meeting")}
                        {(props.formMode=='consult')&&
                            <div style={{display:'flex', flexDirection:'row', position:'absolute', right:0, top:'-0.7vh' }}>
                                {(currentUiContext.formInputs[8]==1) ?  //conseil cloture
                                    <CustomButton
                                        btnText={t("print_pv")} 
                                        buttonStyle={getSmallButtonStyle()}
                                        style={{marginBottom:'-0.3vh', marginRight:'1vw'}}
                                        btnTextStyle = {classes.btnSmallTextStyle}
                                        btnClickHandler={printReportHandler}
                                    />
                                    :null
                                }
                                <CustomButton
                                    btnText={t("quitter")} 
                                    buttonStyle={getSmallButtonStyle()}
                                    style={{marginBottom:'-0.3vh', marginRight:'0.8vw'}}
                                    btnTextStyle = {classes.btnSmallTextStyle}
                                    btnClickHandler={props.cancelHandler}
                                />
                            </div>
                        }
                        
                      

                    </div>

                    <div className={classes.groupInfo}>
                        <div className={classes.inputRowLeft}> 
                            <div style={{fontSize:'1vw', fontWeight:'bold', marginBottom:'0.7vh', marginLeft:'-2vw'}}>
                                <FormPuce menuItemId ='1' 
                                    isSimple={true} 
                                    noSelect={true} 
                                    imgSource={'images/' + getPuceByTheme()} 
                                    withCustomImage={true} 
                                    imageStyle={classes.PuceStyle}    
                                    libelle = {t("general_decisions")}   
                                    itemSelected={null}
                                />
                                
                            </div>

                        </div>
                     
                        <div className={classes.inputRowLeft} style={{height:'11.7vh'}}> 
                            <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                {t("dicision_resume")}:  
                            </div>
                                
                            <div> 
                                <textarea id='bilan' rows={50}  className={classes.comboBoxStyle} onChange={getDecisionGeneraleHandler} defaultValue={currentUiContext.formInputs[11]} style={{marginLeft:'-2vw', height:'12vh',width:'27vw', fontSize:'0.77vw'}}/>
                            </div>
                        </div>
                        
                        { isBilan==true &&                        
                            <div className={classes.inputRowLeft}> 
                                <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', height:'30vh', marginLeft:'-2vw'}}>
                                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:'1vw', fontWeight:'bold', marginBottom:'0vh', marginLeft:'0vw', width:'97%'}}>
                                        <FormPuce menuItemId ='1' 
                                            isSimple={true} 
                                            noSelect={true} 
                                            imgSource={'images/' + getPuceByTheme()} 
                                            withCustomImage={true} 
                                            imageStyle={classes.PuceStyle}    
                                            libelle = {t("decision_cas_par_cas")} 
                                            itemSelected={null}
                                            style={{marginBottom:'-1vh'}}
                                            puceImgStyle={{marginRight:'-0.3vw', marginTop:'1vh'}}
                                        />
                                       
                                        <CustomButton
                                            btnText={t("agrandir_grille")} 
                                            buttonStyle={getSmallButtonStyle()}
                                            style={{marginBottom:'-0.3vh', marginRight:'0.3vw'}}
                                            btnTextStyle = {classes.btnSmallTextStyle}
                                            btnClickHandler = {() => {agrandirView()}}
                                        />  
                                                           
                                    </div>

                                    <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'30vh', width:'40vw', overflowX:'scroll', justifyContent:'flex-start'}}>
                                        <LigneEleveHeader/>
                                    
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
                            </div>
                        }


                        <div className={classes.inputRowLeft}> 

                            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', height:'20vh', marginLeft:'-2vw'}}>
                                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:'1vw', fontWeight:'bold', marginBottom:'0vh', marginLeft:'0vw', width:'97%'}}>
                                    <FormPuce menuItemId ='1' 
                                        isSimple={true} 
                                        noSelect={true} 
                                        imgSource={'images/' + getPuceByTheme()} 
                                        withCustomImage={true} 
                                        imageStyle={classes.PuceStyle}    
                                        libelle = {t("presence_effective")} 
                                        itemSelected={null}
                                        style={{marginBottom:'-1vh'}}
                                        puceImgStyle={{marginRight:'-0.3vw', marginTop:'1vh'}}
                                    />  
                                                   
                                </div>

                                <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'20vh', minWidth:'40vw', overflowY:'scroll', justifyContent:'flex-start'}}>
                                    <LignePresentsHeader/>
                                    {(tabProfsPresents||[]).map((participant, index)=>{
                                        return <LignePresent id={participant.value} rowIndex={index} nom={participant.label}/>
                                        })
                                    }
                                </div>

                            </div>
                           
                        </div>
                       
                    </div>

                    {(props.formMode != 'consult') &&
                        <div className={classes.inputRowRight} style={{position:'absolute', bottom:'0vh', marginBottom: isMobile ? '-1vh':'-3vh'}}>
                            <CustomButton
                                btnText={'< '+t("etape")+' 1'}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={backToStep1Handler}
                            />
                            <CustomButton
                                btnText={t("terminer")} 
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={finishAllSteps}
                            />
                        </div>                        
                    }                    
                    
                </div>
            }
            
            <div className={classes.formButtonRow}>
                <CustomButton
                    btnText={t("info_prelim")}
                    hasIconImg= {true}
                    imgSrc='images/etape1.png'
                    imgStyle = {classes.frmBtnImgStyle1}   
                    buttonStyle={classes.buttonEtape1}
                    btnTextStyle = {classes.btnEtapeTextStyle}
                    btnClickHandler={()=>{showStep1();}}
                    disable={etape1InActiv}
                />
               
                <CustomButton
                    btnText={t("decision_conseil")}
                    hasIconImg= {true}
                    imgSrc='images/etape2.png'
                    imgStyle = {classes.frmBtnImgStyle2} 
                    buttonStyle={classes.buttonEtape3}
                    btnTextStyle = {classes.btnEtapeTextStyle}
                    btnClickHandler={(etape2InActiv) ? null:()=>{showStep2();}}
                    disable={etape2InActiv} 
                />
                
            </div>

        </div>
       
    );
 }
 export default AddClassMeeting;
 