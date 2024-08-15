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

var listDecisions  = [];
var listPromotions = [];

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;


function ConfigAssocEvalPeriod(props) {
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
    const [etats, setEtats]= useState([]);
    

    const [optDecisions, setOptDecisions] = useState([]);
    const [optVerdict, setOptVerdict] = useState([]);
    const [optPromuEn, setOptPromuEn] = useState([]);
    const [infosEleves, setInfosEleves] = useState([]);
    const [formMode, setFormMode] = useState(props.formMode);
    const [LargeViewOpen, setLargeViewOpen] = useState(false);

    const[listDecisions, setListDecisions]   = useState([]);
    const[listPromotions, setListPromotions] = useState([]);
    const [optTirmestres, setOptTirmestres]  = useState([]);



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
        {value:"sequentiel",  label:t("conseil_bilan_seq")      },
        {value:"trimestriel", label:t("conseil_bilan_trim")     },
        {value:"annuel",      label:t("conseil_bilan_annuel")   },
    ];

    const verdictAnnuel = [
        {value:"admis",        label:t("Admis") },
        {value:"admis_sdc",    label:t("Admis SDC.") },
        {value:"redouble",     label:t("Redouble")},
        {value:"redouble_sdc", label:t("Redouble SDC.")},
        {value:"exclu",        label:t("Exclu")},
        {value:"Exclu_sdc",    label:t("Exclu SDC.")},
    ];


    const tabTrimestres = [
        {value:1,     label:t("Trimestre1") },
        {value:2,     label:t("Trimestre2") },
        {value:3,     label:t("Trimestre3")},
        {value:4,     label:t("Trimestre4")},
        {value:5,     label:t("Trimestre5")},
        {value:6,     label:t("Trimestre6")},
    ];
    
    
    
    
    useEffect(()=> {
        console.log("valeure", props.defaultMembres);
        //getClassStudentList(props.currentClasseId);

        setOptTirmestres(tabTrimestres)
       
        setOptPeriode(nonDefini);

        LIST_ELEVES = props.eleves;

        var tempTab = [...tabTypeConseil];
        tempTab.unshift(firstSelectItem2);
        setOptObjet(tempTab);

        tempTab = [...tabTypeConseil];
        //tempTab.unshift(firstSelectItem);
        setOptMembres(tempTab);

        tempTab = [...tabTypeConseil];
        tempTab.unshift(firstSelectItem1);
        setOptAutresMembres(tempTab);

        console.log("les tableaux", optMembres,optAutresMembres);

        console.log("hhgtuiop",currentUiContext.formInputs);
            

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
        var tabEleves = [{value:0,label:"- "+t("select_eleve")+" -"}]
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
        currentUiContext.setFormIsloading(true);
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
            props.closeHandler(MEETING);  
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
            
        MEETING.id_sousetab        =  currentAppContext.currentEtab;

        MEETING.classeId           =  props.currentClasseId; 
        MEETING.classeLabel        =  props.currentClasseLabel;

        MEETING.currentPpUserId    = props.currentPpUserId;
        MEETING.profPrincipalId    = props.currentPpId; 
        MEETING.profPrincipalLabel = props.currentPpLabel;
            
            
        MEETING.type_conseil       = MEETING_OBJET_LABEL;  //Mettre le type de conseil
        MEETING.type_conseilId     = MEETING_OBJET_ID;     //Mettre l'ID type conseil
            
        MEETING.id_periode         = PERIODE_ID            //Mettre la periode   
        MEETING.periode            = PERIODE_LABEL;               
            
        MEETING.alerter_membres    = true;

        if (props.formMode != 'consult'){
            if(etape==1){
                dateDeb  = document.getElementById('jour').value+'/'+ document.getElementById('mois').value + '/' + document.getElementById('anne').value;
                heureDeb = document.getElementById('heure').value+':'+ document.getElementById('min').value ;
                    
                MEETING.date   = dateDeb;
                MEETING.heure  = heureDeb;
            } else{
                MEETING.date   = dateDeb;
                MEETING.heure  = heureDeb;
            }
        } else {
            MEETING.date       = putToEmptyStringIfUndefined(currentUiContext.formInputs[1]);
            MEETING.heure      = putToEmptyStringIfUndefined(currentUiContext.formInputs[2]);
        }

        MEETING.date_effective = getTodayDate();
            
        //----- 2ieme partie du formulaire1 ----- 
        MEETING.id_eleves      = getListElementByFields(tabEleves, "value");               //Mettre la chaine des eleves separe par²²

        //----- 3ieme partie du formulaire1 ----- 
        MEETING.id_membres     = getListElementByFields(optMembres, "value");              //Mettre la liste des membres separe par²²
        MEETING.roles_membres  = getListElementByFields(optMembres, "role");               //Roles des membres
        //MEETING.membre_presents = getListElementByFields(tabProfsPresents, "value");     //Mettre la liste des membres presents separe par²²
        
        //----- 1ere partie du formulaire2 -----
        MEETING.resume_general_decisions = MEETING_GEN_DECISION;                           //Resumer des decisions

        //----- 2ieme partie du formulaire2 -----
        MEETING.id_eleves  =  getListElementByFields(infosEleves, "id");
        MEETING.list_decisions_conseil_eleves  = [...listDecisions].join("²²");
        MEETING.list_classes_promotions_eleves = [...listPromotions].join("²²");

        //----- 3ieme partie du formulaire2 -----
        
        if(props.formMode == 'creation'){
            MEETING.membre_presents = getListElementByFields(optMembres, "value");        //Liste des membres presents
        } else {
            MEETING.membre_presents = getListElementByFields(tabProfsPresents.filter((prof)=>prof.present == true), "value");  //Liste des membres presents
        }

       
        MEETING.to_close = false;

        //-------------- Pour les besoin d'impression -------------
        MEETING.listDecisions        = [...listDecisions];
        MEETING.listPromotions       = [...listPromotions];
        MEETING.classProm            = [...props.nextClasses];
        MEETING.infoGeneralesEleves  = [...infosEleves];
        MEETING.listParticipants     = [...tabProfsPresents];
       
        console.log("donnees du meeting",MEETING);       
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
   
        // var profPresent =[];
        // optMembres.map((elt)=>{profPresent.push(true)});
        // setPresents(profPresent);

        var profPresent = [];
        optMembres.map((elt)=>{
            profPresent.push({value:elt.value, label:elt.label, role:elt.role, present:true, etat:0});
        })
      
      
        console.log("presents absents",tabProfsPresents, profPresent)
        var tempTab = [];

        profPresent.map((elt1)=>{
            var result = tabProfsPresents.find((elt2)=>elt2.value == elt1.value);
            if(result!= undefined){
                elt1.present = true;
                tempTab.push({value:elt1.value, label:elt1.label, role:elt1.role, present:elt1.present, etat:(props.formMode == "consult") ? 1:0});
            } else {
                elt1.present = false;
                tempTab.push({value:elt1.value, label:elt1.label, role:elt1.role, present:false, etat:(props.formMode == "consult") ? 1:0});
            }
        })

        setTabProfsPresents(tempTab);
        var tabPresent = []; var tabEtats = []
        tempTab.map((elt)=> {
            tabPresent.push(elt.present);
            tabEtats.push(elt.etat);
        });
        setPresents(tabPresent);
        setEtats(tabEtats);
        
        console.log("presents absents",tabProfsPresents, profPresent,tempTab, presents)
        

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
        if(meeting_min[0] =='0')  meeting_min  = meeting_min[1];
       
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
        //au cas ou on veut creer un conseil annuel, on test si un conseil annuel a deja ete cree avant

        if(props.formMode == "creation" && MEETING.type_conseilId=="annuel" && props.cca_created){
            errorMsg = t("annual_meeting_already_created");
            return errorMsg;
        }

        if(optMembres.length<=0){
            errorMsg = t("no_participant_added");
            return errorMsg;
        }

        var index = optMembres.findIndex((elt)=>elt.value==0);
        if (index >=0){
            console.log("participant",participant_data);
            errorMsg = t("no_participant_name");
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
        setTabProfsPresents(participant_data);

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
                <div style={{width:'17vw'}}>{t("eval_name")}</div>
                <div style={{width:'11.3vw'}}>{t("pourcent")}</div>
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
                            <div style ={{width:'100%', display:'flex', flexDirection:'row', justifyContent:"flex-start"}}> 
                                <div style={{fontWeight:'bold', paddingLeft:"2vw", marginRight:"0.3vw", justifyContent:"center"}}>  
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
        //var participants = [...optMembres];
        var profPresents = [...tabProfsPresents];
        var tabPresent = [...presents];
        var row = e.target.id;

        if(e.target.checked){
            tabPresent[row] = true;
            profPresents[row].present = true;
            //e.target.checked = true;
            //setOptMembres(participants);
            setPresents(tabPresent);
            setTabProfsPresents(profPresents);
        } else {
            tabPresent[row] = false;
            profPresents[row].present = false;
            //e.target.checked = false;
            setPresents(tabPresent);
            setTabProfsPresents(profPresents);
        }
        console.log("profs presents",profPresents);
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
                    <input type='checkbox' disabled={etats[props.rowIndex]==1} style={{width:'1vw', height:'2vh'}} checked={presents[props.rowIndex]==true}  id={props.rowIndex} name ={'Present'+props.rowIndex} onChange={managePresent}/>                    
                </div>
                           
            </div>
        );
    }



    return (
        <div className={classes.formStyle}>
                
            <div id='errMsgPlaceHolder'/>
          
            <div id='etape1' className={classes.etapeP} onLoad={()=>{moveToLeft()}}>
                <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                    {t("conseil_class_prepa")}
                </div>

                <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}> 
                    <select className={classes.comboBoxStyle} id="id_trimestre" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}>  
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
                        btnTextStyle    = {classes.btnTextStyle}
                        btnClickHandler = {props.cancelHandler}
                        style           = {{marginLeft:"2vw", height:"4.3vh"}}
                    />
                </div>
                
                <div className={classes.inputRowLeft}>
                    <div style={{display:'flex', justifyContent:"center", flexDirection:'column', marginTop:'0.7vh', marginLeft:'0vw', paddingLeft:"1vw", width:"99%",paddingRight:"1vw", height:'30vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                        <LigneProfParticipantHeader date={'Date'} nbreJours={'Nbre Jours'} etat={'Etat'}/>
                        {(optMembres||[]).map((prof)=>{
                            return <LigneProfParticipant  participantId={prof.value} nom={prof.label} role={prof.role} etat={prof.etat}/>
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
                            btnClickHandler = {saveMeetingHandler}
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
 