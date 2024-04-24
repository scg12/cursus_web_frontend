import React from 'react';
import ReactDOM from 'react-dom';
import { useFilePicker } from 'use-file-picker';
import {isMobile} from 'react-device-detect';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import  FormNumero from "../../../formPuce/FormNumero";
import FormPuce from '../../../formPuce/FormPuce';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from '../../../backDrop/BackDrop';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate, changeDateIntoMMJJAAAA, getTodayDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";

var MEETING = {};
var LIST_ELEVES = undefined;
var SELECTED_ROLE = undefined;
var SELECTED_PARTICIPANT = undefined;

var SELECTED_ELEVE = undefined;
var CONVOQUE_PAR_ID= undefined;
var CONVOQUE_PAR_LABEL = undefined;
var ALL_STUDENTS_CONVOCATED = false;
var MEETING_OBJET_ID = undefined;
var MEETING_OBJET_LABEL = undefined;
var PERIODE_ID = undefined;
var PERIODE_LABEL = "";
var MEETING_GEN_DECISION = undefined

var listMotifs = [];
var listSanctions = [];
var SANCTIONS_PAR_ELEVES = [];
var MOTIFS_PAR_ELEVES = [];
var participant_data = [];
var CURRENT_POS = [];

var ELEVES_MOTIFS  = [];
var LIST_MOTIFS    = [];
var LIST_SANCTIONS = [];

var eleves_data=[];

var dateDeb, heureDeb;
var OTHER_MEMBRES_ORIGIN=[]

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;




function AddDisciplinMeeting(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme = currentUiContext.theme;


    const [optObjet, setOptObjet] = useState([]);
    const [etape,setEtape] = useState(1);
    const [etape1InActiv, setEtape1InActiv] = useState(setButtonDisable(1));
    const [etape2InActiv, setEtape2InActiv] = useState(setButtonDisable(2));   

    
    const [tabElevesDecisions, setTabElevesDecisions]= useState([]);
    const [tabProfsPresents, setTabProfsPresents] = useState([]);
    const [optConvocateurs, setOptConvocateurs] = useState([]);
    const [optMembres, setOptMembres] = useState([]);
    const [optAutresMembres, setOptAutresMembres] = useState([]);
   
    const [optPeriode, setOptPeriode] = useState([]);
    const [presents, setPresents]= useState([]);
    const [etats, setEtats]= useState([]);
   
    const [tabSanctions, setTabSanctions] = useState([]);
    const [tabMotifs, setTabMotifs] = useState([]);
    const [tabElevesMotifs, setTabElevesMotifs]= useState([]);
    const [allStudentsConvocated, setAllStudentsConvocated] = useState(false);
    const [elevesSanctions, setElevesSanctions] = useState([]);
   
    
    var firstSelectItem1 = {
        value: 0,   
        label:'-----'+ t('choisir') +'-----'
    }

    var firstSelectItem2 = {
        value: undefined,   
        label:'-----'+ t('choisir') +'-----'
    }

    const nonDefini=[        
        {value: -1,   label:'-----'+ t('not_defined') +'-----' },
    ];

    const choisir = [        
        {value: undefined,   label:'-----'+ t('choisir') +'-----' },
    ];

    const tabTypeConseil=[
        {value:"sequentiel",  label:"Conseil bilan sequentiel" },
        {value:"trimestriel", label:"Conseil bilan trimestriel"}       
    ];
    
   
  
    useEffect(()=> {

        getClassStudentList(props.currentClasseId);
        setOptPeriode(nonDefini);       
       

        LIST_MOTIFS    = props.motifsConv;
        LIST_ELEVES    = props.eleves;
        LIST_SANCTIONS = props.sanctionsConv

        if(LIST_MOTIFS.length > 0){
            setTabMotifs(LIST_MOTIFS);
        }

        if(LIST_SANCTIONS.length > 0){
            setTabSanctions(LIST_SANCTIONS);
        }
       
        setTabElevesMotifs([]);
    
        if (props.formMode == 'creation'){

            console.log("Motifs",tabElevesMotifs, LIST_MOTIFS,ELEVES_MOTIFS, CURRENT_POS, LIST_ELEVES);
            
            var tempTab = [...tabTypeConseil];
            tempTab.unshift(firstSelectItem2);
            setOptObjet(tempTab);
            
            var tempTab = [...props.convoquePar];
            tempTab.unshift(firstSelectItem1);
            setOptConvocateurs(tempTab);
            
            tempTab = [...props.defaultMembres];
           //tempTab.unshift(firstSelectItem1);
            setOptMembres(tempTab);
    
            tempTab = [...props.othersMembres];
            tempTab.unshift(firstSelectItem1);
           
            OTHER_MEMBRES_ORIGIN = [...tempTab];
            setOptAutresMembres(tempTab);

            console.log("les tableaux",optConvocateurs,optMembres,optAutresMembres);

        } else {

            var tempTab = [...props.convoquePar];
            //tempTab.unshift(firstSelectItem1);
            setOptConvocateurs(tempTab);
            
            tempTab = [...props.defaultMembres];
            //tempTab.unshift(firstSelectItem1);
            setOptMembres(tempTab);
    
            tempTab = [...props.othersMembres];

            OTHER_MEMBRES_ORIGIN = [...tempTab];
            //tempTab.unshift(firstSelectItem1);
            setOptAutresMembres(tempTab);

            tempTab = [...props.presentsMembres];
            setTabProfsPresents(tempTab);
            console.log("prepeh",tempTab);

            console.log("les tableaux",optConvocateurs,optMembres,optAutresMembres);

            var ListElevesDecision = [...currentUiContext.formInputs[10]];
            var ListElevesSanction = [...currentUiContext.formInputs[11]];

            setTabElevesMotifs(ListElevesDecision);

            if(ListElevesSanction.length > 0){
                initSanctionTab(ListElevesSanction);
                setTabElevesDecisions(ListElevesSanction);          
            }                
            else{
                initSanctionTab(ListElevesDecision);
                var tabDecisions = [];
                if(ListElevesDecision.length > 0){
                    ListElevesDecision.map((elt)=>tabDecisions.push({id:elt.id, nom:elt.nom, decisionId:elt.motifId, decisionLabel:elt.motifLabel, etat:elt.etat}));
                }                
                setTabElevesDecisions(tabDecisions);
            } 

           console.log("dicisions",ListElevesDecision);

            MEETING = {};
        
            MEETING.id_conseil_discipline      = putToEmptyStringIfUndefined(currentUiContext.formInputs[0]);
            MEETING.classeId                   = props.currentClasseId; 
            MEETING.classeLabel                = props.currentClasseLabel;
    
            MEETING.convoque_par               = {}; 
            MEETING.convoque_par.nom           = putToEmptyStringIfUndefined(currentUiContext.formInputs[6]); //Mettre le nom
            MEETING.convoque_par.id_user       = putToEmptyStringIfUndefined(currentUiContext.formInputs[7]); //mettre l'ID
            
            MEETING.date                       = putToEmptyStringIfUndefined(currentUiContext.formInputs[1]);
            MEETING.heure                      = putToEmptyStringIfUndefined(currentUiContext.formInputs[2]);
            
            MEETING.type_conseil               = putToEmptyStringIfUndefined(currentUiContext.formInputs[3]);  //Mettre le type de conseil
            MEETING.periode                    = putToEmptyStringIfUndefined(currentUiContext.formInputs[5]);
            MEETING.id_periode                 = putToEmptyStringIfUndefined(currentUiContext.formInputs[4]); //Mettre la periode       
            MEETING.alerter_membres            = true;
            
            //----- 2ieme partie du formulaire1 ----- 
            MEETING.is_all_class_convoke       = putToEmptyStringIfUndefined(currentUiContext.formInputs[12]); 
            MEETING.resume_general_decisions   = putToEmptyStringIfUndefined(currentUiContext.formInputs[13]); 
            MEETING_GEN_DECISION               =  MEETING.resume_general_decisions;
           
            MEETING.etat                       = putToEmptyStringIfUndefined(currentUiContext.formInputs[8]);
            MEETING.status                     = putToEmptyStringIfUndefined(currentUiContext.formInputs[8]);
            MEETING.statusLabel                = putToEmptyStringIfUndefined(currentUiContext.formInputs[9]);

            if (props.formMode == 'modif') {
                //initialisation du select convoque par
                var index1          = props.convoquePar.findIndex((elt)=>elt.value == MEETING.convoque_par.id_user);
                var convocateur     = props.convoquePar.find((elt)=>elt.value == MEETING.convoque_par.id_user);
                var tabConvocateurs = [... props.convoquePar];
                
                tabConvocateurs.splice(index1,1);
                tabConvocateurs.unshift(convocateur);

                CONVOQUE_PAR_ID    = convocateur.value; //mettre l'ID
                CONVOQUE_PAR_LABEL = convocateur.label; //Mettre le nom

                setOptConvocateurs(tabConvocateurs);


                //initialisation du select objet du conseil
                var index2  = tabTypeConseil.findIndex((elt)=>elt.value ==  MEETING.type_conseil);
                var objet   = tabTypeConseil.find((elt)=>elt.value ==  MEETING.type_conseil);
                var listTypeConseils = [...tabTypeConseil];
                
                listTypeConseils.splice(index2,1);
                listTypeConseils.unshift(objet);

                MEETING_OBJET_LABEL = objet.label;  
                MEETING_OBJET_ID    = objet.value;   
                
                setOptObjet(listTypeConseils);

                
                //initialisation du select periode associee
                var tabPeriode =[];
                switch(objet.value){
                    case 'sequentiel'  : {tabPeriode = [...props.sequencesDispo];              break;}
                    case 'trimestriel' : {tabPeriode = [...props.trimestresDispo];             break;}
                    default: tabPeriode = nonDefini;
                }
                
                var index3  = tabPeriode.findIndex((elt)=>elt.value == MEETING.id_periode);
                var periode = tabPeriode.find((elt)=>elt.value ==  MEETING.id_periode);

                tabPeriode.splice(index3,1);
                tabPeriode.unshift(periode);

                PERIODE_ID    = periode.value;
                PERIODE_LABEL = periode.label;

                setOptPeriode(tabPeriode);
            }

            // } else {
            //     tempTab = [...props.defaultMembres];
            //     setTabProfsPresents(tempTab);
            // }

        } 

        console.log(currentUiContext.formInputs);        

    },[]);

    
    const  getClassStudentList=(classId)=>{      
        return new Promise(function(resolve, reject){
            var listEleves = [];
            axiosInstance.post(`list-eleves/`, {
                id_classe: classId,
            }).then((res)=>{
                console.log(res.data);
                console.log(listEleves);
                LIST_ELEVES= [...getElevesTab(res.data)];
                // setElevesList(LIST_ELEVES);
                resolve(LIST_ELEVES); 
            });
        });      
    }

    function getElevesTab(elevesTab){
        var tabEleves = [
                            {value:-1,     label:"----- "+t('choisir')+" -----"},
                            {value: 'all', label:"----- "+t('all_students')+" -----"}
                        ]
        var new_eleve;

        elevesTab.map((eleve)=>{
            new_eleve = {};
            new_eleve.value = eleve.id;
            new_eleve.label = eleve.nom +' '+eleve.prenom;
            tabEleves.push(new_eleve);       
        });

        return tabEleves;
    }

    function initMotifsTab(motif){
        ELEVES_MOTIFS = [];
        (LIST_ELEVES||[]).map((elt)=>{
            CURRENT_POS.push(0);
            ELEVES_MOTIFS.push(motif);
        });
    }

    function initSanctionTab(lisElevestSanctions){     
        var sanctionsEleves = [];
        var tab = [];
        var i = 0;
        (lisElevestSanctions||[]).map((elt, rowIndex)=>{  
            for(i=0; i<LIST_SANCTIONS.length; i++){
                tab.push(-1);                
            }       
            // sanctionsEleves[rowIndex]=[...tab];
            // tab = [];
            sanctionsEleves[rowIndex] =  LIST_SANCTIONS[0].value;
        });

        SANCTIONS_PAR_ELEVES = [...sanctionsEleves];
        console.log("eleves sanctions", sanctionsEleves,lisElevestSanctions, SANCTIONS_PAR_ELEVES);
        setElevesSanctions(sanctionsEleves);
    }
 
    function formatMotif(list){
        var tabMotif = [];
        (list||[]).map((elt)=>tabMotif.push({value:elt.libelle, label:elt.description}));
        return tabMotif;
    }

    function periodeChangeHandler(e){
        if(e.target.value > 0){
            PERIODE_ID    = e.target.value;
            PERIODE_LABEL = e.target.label;
        } else {
            PERIODE_ID = undefined;
            PERIODE_LABEL = "";
        }
    }

   
    function objetChangeHandler(e){
        var typeConseil = e.target.value;
        var tabPeriode = nonDefini;
        
        if(typeConseil != undefined){       
            switch(typeConseil){
                case 'sequentiel'  : {tabPeriode = [...props.sequencesDispo];              break;}
                case 'trimestriel' : {tabPeriode = [...props.trimestresDispo];             break;}                
                default: tabPeriode = nonDefini;
            }
            console.log("periode choisie",tabPeriode, typeConseil, props.sequencesDispo)
            setOptPeriode(tabPeriode);
            
            var meeting = tabTypeConseil.find((meetg)=>meetg.value==e.target.value);

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

            PERIODE_ID          = undefined;
            PERIODE_LABEL       = undefined;
        }
    }

    function getDecisionGeneraleHandler(e){
        MEETING_GEN_DECISION = e.target.value;
        //console.log("ici",MEETING_GEN_DECISION);
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
           
        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1();
        }

    }

    function gotoStep2Handler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        getFormData();
        if(formDataCheck1().length==0){
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }  
                        
            setEtape2InActiv(false);
            setEtape(2);
            setFormData2();
            //props.actionHandler(MEETING);
        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1();
        }
    }

    function backToStep1Handler(){
        getFormData();
        setEtape2InActiv(true);
        setEtape(1);
        //setFormData1();
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
            MEETING.statLabel = t('cloture') ; 
            MEETING.to_close = true;      
            props.closeHandler(MEETING);  

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
        if(props.formMode == "creation") MEETING.id_conseil_discipline = -1;             
        else MEETING.id_conseil_discipline = currentUiContext.formInputs[0]; 
        
        MEETING.id_sousetab          =  currentAppContext.currentEtab;
        MEETING.classeId             =  props.currentClasseId; 
        MEETING.classeLabel          =  props.currentClasseLabel;
        MEETING.convoque_par         = {}; 
        MEETING.convoque_par.id_user = CONVOQUE_PAR_ID; //mettre l'ID
        MEETING.convoque_par.nom     = CONVOQUE_PAR_LABEL; //Mettre le nom
        
        MEETING.type_conseil         = MEETING_OBJET_LABEL;  //Mettre le type de conseil
        MEETING.type_conseilId       = MEETING_OBJET_ID;     //Mettre l'ID type conseil
        
        MEETING.id_periode           = PERIODE_ID            //Mettre la periode   
        MEETING.periode              = PERIODE_LABEL;    
        
        MEETING.alerter_membres      = true;
        if (props.formMode != 'consult'){       
            if(etape==1){
                dateDeb                  = document.getElementById('jour').value+'/'+ document.getElementById('mois').value + '/' + document.getElementById('anne').value;
                heureDeb                 = document.getElementById('heure').value+':'+ document.getElementById('min').value ;

                MEETING.date  = dateDeb;
                MEETING.heure = heureDeb;
            
            } else{

                MEETING.date  = dateDeb;
                MEETING.heure = heureDeb;
            }

        } else {
            MEETING.date                = putToEmptyStringIfUndefined(currentUiContext.formInputs[1]);
            MEETING.heure               = putToEmptyStringIfUndefined(currentUiContext.formInputs[2]);
        }

        MEETING.date_effective          = getTodayDate();       

        //----- 2ieme partie du formulaire1 ----- 
        MEETING.id_eleves               = getListElementByFields(tabElevesMotifs, "id");  //Mettre la chaine des eleves separe par²²
        MEETING.is_all_class_convoke    = ALL_STUDENTS_CONVOCATED;       //Mettre la bonne valeur
        
        MEETING.motif_generale_classe   = getListElementByFields(tabElevesMotifs, "motifLabel");
        MEETING.list_motifs_covocations = getListElementByFields(tabElevesMotifs, "motifLabel");

        //----- 3ieme partie du formulaire1 ----- 
        MEETING.id_membres     = getListElementByFields(optMembres.filter((elt)=>elt.value!=CONVOQUE_PAR_ID), "value");    //Mettre la liste des membres separe par²²
        MEETING.roles_membres  = getListElementByFields(optMembres.filter((elt)=>elt.value!=CONVOQUE_PAR_ID), "role");     //Roles des membres

        //----- 1ere partie du formulaire2 -----
        MEETING.resume_general_decisions = MEETING_GEN_DECISION;   //Resumer des decisions

        //----- 2ieme partie du formulaire2 -----
        //MEETING.id_eleves  =  getListElementByFields(tabElevesDecisions, "id");
        console.log("decisions", tabElevesDecisions);
        MEETING.list_decisions_conseil_eleves    = getListElementByFields(tabElevesDecisions, "decisionId"); //Liste des decisions pour chaque eleves separe par²²
        MEETING.id_type_sanction_generale_classe = getListElementByFields(tabElevesDecisions, "decisionId"); //Sanction generale si toute la classe est convoquee

        //----- 3ieme partie du formulaire2 -----
        if(props.formMode == 'creation'){
            MEETING.membre_presents = getListElementByFields(optMembres, "value");                         //Liste des membres presents
        } else {
            MEETING.membre_presents = getListElementByFields(tabProfsPresents.filter((prof)=>prof.present == true), "value");  //Liste des membres presents
        }

        MEETING.to_close = false;

        //-------------- Pour les besoin d'impression -------------
        MEETING.listConvoques    = [...tabElevesMotifs];
        MEETING.listCaspasCas    = [...tabElevesDecisions];
        MEETING.listParticipants = [...tabProfsPresents];
       
        console.log(MEETING);
    }

    
    function setFormData1(){
        var tabEleve  = [];        
        tabEleve[1]   =  convertDateToUsualDate(MEETING.date);
        tabEleve[2]   =  MEETING.heure; 
        tabEleve[8]   =  MEETING.status;
        tabEleve[9]   =  MEETING.statusLabel;

       
        tabEleve[3]   =  MEETING.type_conseil; 
        tabEleve[4]   =  MEETING.id_type_conseil;
        tabEleve[5]   =  MEETING.periode;
        tabEleve[6]   =  MEETING.convoque_par.nom;   
        tabEleve[7]   =  MEETING.convoque_par.id_user;          
        

        //tabEleve[4]  =  MEETING.objetId;
        currentUiContext.setFormInputs(tabEleve);
        console.log(MEETING.date);
    }
  
    function setFormData2(){
      
        var tabDecisions = [];
        var elvDecision  = {};     
        // var profPresent  = [];

        // optMembres.map((elt, index)=>{profPresent[index]=true});
        // setPresents(profPresent);

        var profPresent = [];
        optMembres.map((elt)=>{
            profPresent.push({value:elt.value, label:elt.label, role:elt.role, present:true, etat:0});
        });      
      
        console.log("presents absents",tabProfsPresents, profPresent)
        var tempTab = [];

        profPresent.map((elt1)=>{
            var result = tabProfsPresents.find((elt2)=>elt2.value == elt1.value);
            if(result!= undefined){
                elt1.present = true;
                tempTab.push({value:elt1.value, label:elt1.label, role:elt1.role, present:result.present, etat:result.etat});
            } else {
                elt1.present = false;
                tempTab.push({value:elt1.value, label:elt1.label, role:elt1.role, present:false, etat:0});
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

        if(props.formMode!="consult"){

            (tabElevesMotifs||[]).map((elt,index)=>{
                elvDecision = {};
                elvDecision.id = elt.id;
                elvDecision.nom = elt.nom;
                elvDecision.etat = 0;
                elvDecision.decisionId = "";
                elvDecision.decisionLabel ="";
            
                tabDecisions.push(elvDecision);
            });

            setTabElevesDecisions(tabDecisions);

        } else {

            (tabElevesDecisions||[]).map((elt,index)=>{
                elvDecision = {};
                elvDecision.id = elt.id;
                elvDecision.nom = elt.nom;
                elvDecision.etat = 1;
                elvDecision.decisionId = elt.decisionId;
                elvDecision.decisionLabel = elt.decisionLabel;
            
                tabDecisions.push(elvDecision);
            });

            setTabElevesDecisions(tabDecisions);
        }

        var tabEleve  = [];  
        tabEleve[0]   =  MEETING.id_conseil_discipline;      
        tabEleve[1]   =  convertDateToUsualDate(MEETING.date);
        tabEleve[2]   =  MEETING.heure; 
        tabEleve[3]   =  MEETING.type_conseil; 
        tabEleve[4]   =  MEETING.id_type_conseil;
        tabEleve[6]   =  MEETING.convoque_par.nom;   
        tabEleve[7]   =  MEETING.convoque_par.id_user;          
        tabEleve[8]   =  MEETING.status;
        tabEleve[9]   =  MEETING.statusLabel
        tabEleve[13]  =  MEETING.resume_general_decisions;
       
           

        //tabEleve[4]  =  MEETING.objetId;
        currentUiContext.setFormInputs(tabEleve);
        console.log(MEETING.date);

    }

   
    function formDataCheck1(){       
        var errorMsg='';
        console.log("heure",MEETING.heure)
        var meeting_hour = MEETING.heure.split(':')[0];
        var meeting_min = MEETING.heure.split(':')[1]

        if(meeting_hour[0]=='0') meeting_hour = meeting_hour[1];
        if(meeting_min[0]=='0')  meeting_min  = meeting_min[1];
       
        if( MEETING.convoque_par.id_user  == undefined){
            errorMsg= t("select_meeting_convcator");
            return errorMsg;
        }

        if( MEETING.type_conseil==0){
            errorMsg= t("select_meeting_purpose");
            return errorMsg;
        }

        if( MEETING.id_periode ==-1){
            errorMsg= t("select_meeting_period");
            return errorMsg;
        }

        if(MEETING.date.length == 0) {
            errorMsg= t("enter_meeting_date");
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
            errorMsg= t("enter_good_meeting_hour");
            return errorMsg;
        }

        //Test de posteriorite a la date d'aujourd'hui
        if(new Date(changeDateIntoMMJJAAAA(MEETING.date)+' 23:59:59') < new Date()) {
            errorMsg = t("meeting_date_lower_than_today_error");
            return errorMsg;
        }

        if(MEETING.id_eleves == "0"){
            errorMsg= t("student_not_selected");
            return errorMsg;
        }
    
        return errorMsg;  
    }
    
    function formDataCheck2(){       
        var errorMsg='';

        if(tabElevesDecisions.length > 0 && tabElevesDecisions.find((elt)=>elt.decisionId=='')!= undefined){
            errorMsg=t("some_meeting_decision_not_set");
            return errorMsg;
        }
    
        if(MEETING.resume_general_decisions.length == 0 ){
            errorMsg=t("type_meeting_decision");
            return errorMsg;
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


    function convocateurChangeHandler(e){

        if(e.target.value > 0){
            var convocateur = optConvocateurs.find((resp)=>resp.value == e.target.value);
            
            CONVOQUE_PAR_ID   = convocateur.value;
            CONVOQUE_PAR_LABEL = convocateur.label;

            var otherMembres = [...OTHER_MEMBRES_ORIGIN.filter((elt)=>elt.value != CONVOQUE_PAR_ID)];
            setOptAutresMembres(otherMembres);

        } else{
            CONVOQUE_PAR_ID = undefined;
            CONVOQUE_PAR_LABEL = undefined;

            var otherMembres = [...OTHER_MEMBRES_ORIGIN];
            setOptAutresMembres(otherMembres);
        }
    }

    

    function cancelHandler(){
        MEETING={};
        props.cancelHandler();
    }

 
    /************************************ JSX Code ************************************/

    //----------------- PARTICIPANT------------

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
            //setTabParticipant(participant_data);
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
       
        participant_data.push({value:SELECTED_PARTICIPANT, label:nomParticipant, role:SELECTED_ROLE, present:true, etat:0});
        console.log("participant",participant_data);
        setOptMembres(participant_data);

        participant_data = [...optAutresMembres];
        participant_data.splice(indexParticipant,1);
        setOptAutresMembres(participant_data);
        
        SELECTED_PARTICIPANT=undefined;
        SELECTED_ROLE = undefined;

    }

    function deleteParticipant(e){
        console.log(e);
        participant_data =[...optMembres];
        console.log("tabparticipants",participant_data);
        
        var idParticipant = e.target.id;
        var index = participant_data.findIndex((elt)=>elt.value==idParticipant);
        var participantToDelete = participant_data.find((elt)=>elt.value==idParticipant);
        
        if (index >= 0){
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

    //------------------------- ELEVES CONVOQUES ---------------------------
    function eleveChangeHandler(e){

        var index  = LIST_ELEVES.findIndex((elt)=>elt.value == e.target.value);
        var elvElt = LIST_ELEVES.find((elt)=>elt.value == e.target.value);

        if(e.target.value<0){  // aucune selection
           
            document.getElementById('eleveId').style.borderRadius = '1vh';
            document.getElementById('eleveId').style.border = '0.47vh solid red';           

            // document.getElementById('eleveId').style.borderRadius = '1vh';
            // document.getElementById('eleveId').style.border = '0.47vh solid rgb(128, 180, 248)';
        
            SELECTED_ELEVE=undefined;
            ALL_STUDENTS_CONVOCATED = false;
        
        } else {

            if(e.target.value == 'all'){  // selection de tous les eleves
                document.getElementById('eleveId').style.borderRadius = '1vh';
                document.getElementById('eleveId').style.border = '0.47vh solid rgb(128, 180, 248)';
                SELECTED_ELEVE = 'all';
                ALL_STUDENTS_CONVOCATED = true;
               
            } else {                

                document.getElementById('eleveId').style.borderRadius = '1vh';
                document.getElementById('eleveId').style.border = '0.47vh solid rgb(128, 180, 248)';
                SELECTED_ELEVE = e.target.value;
                ALL_STUDENTS_CONVOCATED = false;                
            }
   
        }
    }

    function addEleveRow(){
        eleves_data = [...tabElevesMotifs];
        console.log("eleves motifs", tabElevesMotifs, tabMotifs);
        var index = eleves_data.findIndex((elt)=>elt.id==0);
        if (index <0){
            eleves_data.push({id:0, nom:'', motifId:tabMotifs[0].value, motifLabel:tabMotifs[0].label, etat:-1});
            setTabElevesMotifs(eleves_data);
        }
    }

    function addEleve(rowIndex){
        console.log("colone",rowIndex,tabElevesMotifs);
        
        var motif = tabElevesMotifs[rowIndex];
        eleves_data = [...tabElevesMotifs];

        if(SELECTED_ELEVE==undefined){
            document.getElementById('eleveId').style.borderRadius = '1vh';
            document.getElementById('eleveId').style.border = '0.47vh solid red';
            return -1;
        }
        
        var index = eleves_data.findIndex((eleve)=>eleve.id==0);
        if (index >= 0)  eleves_data.splice(index,1);
        
        var eleveNom = LIST_ELEVES.find((eleve)=>eleve.value==SELECTED_ELEVE).label;
        eleves_data.push({id:SELECTED_ELEVE, nom:eleveNom, motifId:motif.motifId, motifLabel:motif.motifLabel, etat:0})
        setTabElevesMotifs(eleves_data);
        
        SELECTED_ELEVE = undefined;

        if(ALL_STUDENTS_CONVOCATED) //desactiver le boutton ajouter d'en haut
        setAllStudentsConvocated(true);       
    }

    
    function deleteEleve(e){        
        var eleveId = e.target.id;
        eleves_data = [...tabElevesMotifs];
        var index = eleves_data.findIndex((eleve)=>eleve.id==eleveId);
        if (index >= 0) {
            eleves_data.splice(index,1);
            setTabElevesMotifs(eleves_data);
        }
        
        SELECTED_ELEVE=undefined;   
        //activer le boutton ajouter d'en haut
        setAllStudentsConvocated(false);
    }


    function motifChangeHandler(row,e){
        var cur_motif_value = e.target.value;

        var eleveMotifs = [...tabElevesMotifs];
        var motif = tabMotifs.find((elt)=>elt.value == cur_motif_value);

        eleveMotifs[row].motifId    = motif.value;
        eleveMotifs[row].motifLabel = motif.label; 

       // setTabElevesMotifs(eleveMotifs);
        console.log("yyyyy", eleveMotifs[row],motif.label);
    }

    function updateMotif(e, row, index){
        var motif = tabMotifs[index];
        var eleveMotifs = [...tabElevesMotifs];
       
        eleveMotifs[row].motifId    = motif.value;
        eleveMotifs[row].motifLabel = motif.label; 

        setTabElevesMotifs(eleveMotifs);
        console.log("yyyyy", eleveMotifs[row],tabMotifs[index])
    }


    const LigneEleveHeader=(props)=>{
        return(
           
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'19vw'}}>{t("nom")}</div>
                <div style={{width:'20vw'}}>{t("motif")}</div>
                <div style={{width:'7vw', marginLeft:'-2.7vw'}}>{t("action")}</div>               
            </div>
     
        );
    }

    const LigneEleve=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                {(props.etat >= 0) ? 
                    <div style={{minWidth:'17vw', marginRight:"0vw"}}>                    
                        {props.nom}                                    
                    </div>
                      
                    :

                    <select id='eleveId' style={{height:'3.3vh', borderRadius:"1vh", fontSize:'0.87vw', width:'14.3vw', borderStyle:'solid', borderColor:'rgb(128, 180, 248)', borderWidth:'0.47vh', fontWeight:'solid'}} onChange={eleveChangeHandler}>
                        {(LIST_ELEVES||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>                
                }   

                {(props.etat >= 0) ?
                   <div style={{minWidth:'13vw', fontWeight:"bolder", marginRight:"-4vw",}}> {props.motif} </div>
                   :
                    <select id='eleveId' style={{height:'3.3vh', borderRadius:"1vh", fontSize:'0.87vw', marginLeft:"2vw", width:'11.3vw', borderStyle:'solid', borderColor:'rgb(128, 180, 248)', borderWidth:'0.47vh', fontWeight:'solid'}} onChange={(e)=>motifChangeHandler(props.rowIndex,e)}>
                        {(tabMotifs||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                        // <div style={{display:'flex',  flexDirection:'row',   width:'30vw', alignItems:'center'}}> 
                        // { 
                        //     tabMotifs.map((motif,index)=>{
                        //         return (
                        //             <div style={{display:'flex', flexDirection:'row',}}>
                        //                 <input type='radio' id={'motif'+props.rowIndex+'_'+index} style={{width:'0.8vw', height:'1.57vh', marginLeft:"0.45vw"}} checked={tabElevesMotifs[props.rowIndex].motifId == tabMotifs[index].value}   name={'eleveConv'+props.rowIndex} onClick={(e)=>{updateMotif(e,props.rowIndex,index)}}/>
                        //                 <label style={{ color:'black', fontWeight:"bold", fontSize:"0.67vw", marginLeft:'0.13vw', marginRight:"1vw", width:"fit-content"}}>{motif.label} </label>
                        //             </div>    
                        //         )                                
                        //     })

                            
                        // }  
                        // </div>
                }
              
                {(props.etat<=0)&&
                    <div style={{width:'7vw', marginLeft:'7.7vw', display:'flex', flexDirection:'row'}}>                    
                        <img src="images/cancel_trans.png"
                            id={props.eleveId}  
                            width     = {isMobile? '10vw'  :25} 
                            height    = {isMobile? '13.7vw':33}
                            className = {classes.cellPointer} 
                            onClick   = {deleteEleve}                         
                            alt=''
                        />
                    </div>                
                }

                {(props.etat==-1)&&
                    <div style={{width:'7vw', marginLeft:'-4.7vw', display:'flex', flexDirection:'row'}}> 
                    
                            <img src="images/checkp_trans.png"  
                                width     = {isMobile? '7.7vw':19.7} 
                                height    = {isMobile? '7.7vw':19} 
                                className = {classes.cellPointer} 
                                style     = {{marginLeft:'1vw', marginTop:'0.04vh'}}
                                onClick={()=>{addEleve(props.rowIndex)}}                         
                                alt=''                            
                            />
                        
                    </div>
                }

            </div>
        );
    }



//----------------- DECISION AU CAS PAR CAS ------------

    function updateEleve(e,rowIndex){
        eleves_data = [...tabElevesDecisions];

        console.log("ffffft",tabElevesDecisions, elevesSanctions);
       
        var cur_eleveId= e.target.id;
        var index = eleves_data.findIndex((eleve)=>eleve.id == cur_eleveId);
        var cur_eleve = eleves_data.find((eleve)=>eleve.id == cur_eleveId);

        //var sanctionId  = elevesSanctions[rowIndex];
        
        var sanctionId  = SANCTIONS_PAR_ELEVES[rowIndex];
        //var sanctionId = sanctions.find((elt)=>elt > 0)

        cur_eleve.etat = 1;
        cur_eleve.decisionId   = sanctionId;
        cur_eleve.decisionLabel = tabSanctions.find((elt)=>elt.value == sanctionId).label;

        console.log('curentEleve', cur_eleve);

        eleves_data.splice(index,1,cur_eleve);
       
        setTabElevesDecisions(eleves_data);    
       // setElevesSanctions(SANCTIONS_PAR_ELEVES); 
    }


    function decisionChangeHandler(e, row){
        var cur_sanction_value  = e.target.value;
        // var sanctionEleves      = [...elevesSanctions];
        // sanctionEleves[row] = cur_sanction_value;
        SANCTIONS_PAR_ELEVES[row] = cur_sanction_value;

        //setElevesSanctions(sanctionEleves);
        // var sanctionRow         = tabSanctions.find((elt)=>elt.value == cur_sanction_value);
        

        // //var lastCheckedPos = sanctionRow.findIndex((elt)=> elt > 0);
        // console.log("lastPos", lastCheckedPos);
        // if(lastCheckedPos >= 0 && lastCheckedPos!=index ){
        //     sanctionEleves[row][lastCheckedPos] = -1;
        //     sanctionEleves[row][index] = cur_sanction_value;

        // }else{
        //     if(lastCheckedPos < 0) sanctionEleves[row][index] = cur_sanction_value;
        // }
        
    }


    function updateSanction(e, row, index){
        var lastCheckedPos ;
       
        console.log("types sanctions",tabSanctions)
        var sanctionEleves = [...elevesSanctions];
        var sanctionRow    = [...sanctionEleves[row]];

        lastCheckedPos = sanctionRow.findIndex((elt)=> elt > 0);
        console.log("lastPos", lastCheckedPos);
        if(lastCheckedPos >= 0 && lastCheckedPos!=index ){
            sanctionEleves[row][lastCheckedPos] = -1;
            sanctionEleves[row][index] = tabSanctions[index].value;

        }else{
            if(lastCheckedPos < 0) sanctionEleves[row][index] = tabSanctions[index].value;
        }
        
        setElevesSanctions(sanctionEleves);     
    }


    const LigneEleveDecisionHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'30vw'}}>{t("nom")}</div>
                <div style={{width:'30vw'}}>{t("decision")}</div>
                <div style={{width:'7vw', marginLeft:'1.7vw'}}>{t("action")}</div>
            </div>
        );
    }

    const LigneEleveDecision=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
              
                <div style={{minWidth:'17vw'}}>
                    {props.nom}
                </div>

                {(props.etat == 1) ?
                   <div style={{minWidth:'20vw', fontWeight:"bolder"}}> {props.decision} </div>                   
                   :
                    <select id={'eleveId'+props.rowIndex} style={{height:'3.3vh', borderRadius:"1vh", fontSize:'0.87vw', width:'11.3vw', borderStyle:'solid', borderColor:'rgb(128, 180, 248)', borderWidth:'0.47vh', fontWeight:'solid'}} onChange={(e)=>decisionChangeHandler(e, props.rowIndex)}>
                        {(tabSanctions||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                        // <div style={{display:'flex',  flexDirection:'row',   width:'30vw', alignItems:'center'}}>
                        //     {tabSanctions.map((sanction, index)=>{
                        //         return (
                        //             <div> 
                        //                 <input type='radio' id={'sanction'+props.rowIndex+'_'+index} style={{marginLeft:'0.45vw',width:'0.8vw', height:'1.57vh'}} checked={elevesSanctions[props.rowIndex][index]>0}  value={0} name={'eleveDecision'+props.rowIndex} onClick={(e)=>{updateSanction(e,props.rowIndex,index)}}/>
                        //                 <label style={{ color:'black', fontWeight:"bold", fontSize:"0.67vw", marginLeft:'0.13vw', marginRight:"1vw", width:"5vw", display:"contents"}}>{sanction.label}</label>
                        //            </div>

                        //         )
                        //     })}
                        
                        // </div>
                }
              
                <div style={{width:'7vw', marginLeft:'8.7vw', display:'flex', flexDirection:'row'}}> 
                    {(props.etat!=1)&&
                        <img src="images/checkp_trans.png"  
                            width  = {isMobile? '7.7vw':19} 
                            height = {isMobile? '7.7vw':19} 
                            id     = {props.eleveId}
                            style  = {{marginLeft:'1vw', marginTop:'0.3vh'}}
                            className={classes.cellPointer} 
                            onClick={(e)=>{updateEleve(e,props.rowIndex)}}                         
                            alt=''                        
                        />
                    }
                </div>

            </div>
        );
    }


//----------------------- PROFS PRESENTS -----------------------
   
    function managePresent(e){
        // e.preventDefault();
        // var participants = [...optMembres];
        // var tabPresent = [...presents];
        // var row = e.target.id;

        // if(e.target.checked){
        //     tabPresent[row]=true;
        //     participants[row].present= true;
        //     e.target.checked = true;
        //     setPresents(tabPresent);
        //     setOptMembres(participants);

        // } else {
        //     tabPresent[row]=false;
        //     participants[row].present= false;
        //     e.target.checked = false;
        //     setPresents(tabPresent);
        //     setOptMembres(participants);
        // }

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
        <div className={'card '+ classes.formContainerP}>
           
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/addCD.png'/>
                </div>
                {(props.formMode == 'creation')  ?                
                    <div className={classes.formMainTitle} >
                        {t("enreg_conseil_d")}
                    </div>
                : (props.formMode == 'modif') ?
                    <div className={classes.formMainTitle} >
                        {t("modif_conseil_d")}
                    </div>
                :
                    <div className={classes.formMainTitle} >
                       {t("consult_conseil_d")}
                    </div>
                
                }
                
            </div>
                
            <div id='errMsgPlaceHolder'/> 

            {(etape == 1) &&
                <div id='etape1' className={classes.etapeP}>
                    <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                    {t("etape")+' 1'}: {t("conseil_class_prepa")}
                        {(props.formMode=='consult')&&
                            <div style={{display:'flex', flexDirection:'row', position:'absolute', right:0, top:'-0.7vh' }}>
                                {(currentUiContext.formInputs[8]==1) ?  //conseil cloture
                                    <CustomButton
                                        btnText= {t("print_pv")} 
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
                            style={{marginBottom:'-1vh'}}
                            puceImgStyle={{marginRight:'-0.3vw'}}
                        />
                        
                       
                    </div>

                    <div className={classes.inputRowLeft}>
                        <div className={classes.groupInfo} style={{fontSize:'1vw'}}>
                            <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("classe_cible")}:
                                </div>                    
                                <div style={{marginBottom:'1.3vh', marginLeft:'-2vw'}}>  
                                    <input id="classe" type="text"    defaultValue={props.currentClasseLabel} style={{width:'3vw', textAlign:'center', height:'1.3vw', fontSize:'1.3vw', marginLeft:'0vw', color:'#898585'}} disabled={true}/>
                                    <input id="classe" type="hidden"  defaultValue={props.currentClasseId}/>
                                </div>
                            </div>
                            <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("convoque_par")}:
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="convoqueParLabel" type="text"     className={classes.inputRowControl}   defaultValue={currentUiContext.formInputs[6]}   style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                        <input id="convoqueParId"    type="hidden"   className={classes.inputRowControl}   defaultValue={currentUiContext.formInputs[7]}   style={{width:'6vw',  height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>  
                                    :
                                    <div>                                     
                                        <select id='convoquePar' defaultValue={MEETING.responsableId} onChange={convocateurChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-2vw', height:'1.87vw', fontSize:'1vw',width:'15vw'}}>
                                            {(optConvocateurs||[]).map((option)=> {
                                                return(
                                                    <option  value={option.value}>{option.label}</option>
                                                );
                                            })}
                                        </select> 
                                    </div>
                                }
                            </div>

                            <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("date_conseil")}:
                                </div>
                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="date_meeting" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[1]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>
                                    :
                                    (currentUiContext.formInputs[2].length == 0) ?
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="jour"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} />/
                                        <input id="mois"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw', textAlign:"center"}}  />/
                                        <input id="anne"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("heure"))}}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  />
                                    </div>
                                    :
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="jour"  type="text"  maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}      className={classes.inputRowControl}  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}  defaultValue={currentUiContext.formInputs[1].split("/")[0]} />/
                                        <input id="mois"  type="text"  maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}      className={classes.inputRowControl}  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw', textAlign:"center"}}   defaultValue={currentUiContext.formInputs[1].split("/")[1]} />/
                                        <input id="anne" type="text"   maxLength={4}   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("heure"))}}    className={classes.inputRowControl}  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[1].split("/")[2]} />
                                    </div>
                                }

                                <div className={classes.inputRowLabelP} style={{fontWeight:570, marginLeft:'2vw'}}>
                                    {t("heure_conseil")}:
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="heure" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[2]} style={{width:'3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}}/>
                                    </div>
                                    :
                                    (currentUiContext.formInputs[3].length == 0) ?
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="heure"  type="text"  Placeholder='hh'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure"), document.getElementById("min"))}}     maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}} /><b>h</b>
                                        <input id="min"  type="text"    Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min"), null)}}                                maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  /><b>min</b>
                                    </div>
                                    :
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="heure"  type="text" maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure"), document.getElementById("min"))}}      className={classes.inputRowControl}  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}}  defaultValue={currentUiContext.formInputs[2].split(":")[0]} /><b>h</b>
                                        <input id="min"  type="text"   maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min"), null)}}                                  className={classes.inputRowControl}  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[2].split(":")[1]} /><b>min</b>
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
                                        <input id="objetId" type="hidden"  className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[4]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
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
                                        <input id="periodeId" type="hidden"   className={classes.inputRowControl}   defaultValue={currentUiContext.formInputs[4]}   style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
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

                           
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', height:'19.3vh', marginLeft:'-2vw'}}>
                                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:'1vw', fontWeight:'bold', marginBottom:'0vh', marginLeft:'0vw', width:'97%'}}>
                                    <FormPuce menuItemId ='1' 
                                        isSimple={true} 
                                        noSelect={true} 
                                        imgSource={'images/' + getPuceByTheme()} 
                                        withCustomImage={true} 
                                        imageStyle={classes.PuceStyle}    
                                        libelle = {t("eleves_convoques")} 
                                        itemSelected={null}
                                        style={{marginBottom:'-1vh'}}
                                        puceImgStyle={{marginRight:'-0.3vw', marginTop:props.formMode!='consult'? '1vh':'0vh'}} 
                                    />
                                    {(props.formMode!='consult')&&  
                                        <CustomButton
                                            id = {"addEleve"}
                                            btnText={t("add")}
                                            buttonStyle={getSmallButtonStyle()}
                                            style={{marginBottom:'-0.3vh', marginRight:'0.8vw'}}
                                            btnTextStyle = {classes.btnSmallTextStyle}
                                            btnClickHandler={addEleveRow}
                                            disable = {allStudentsConvocated}
                                        />   
                                    }                
                                </div>

                                <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'19.3vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                                    <LigneEleveHeader/>
                                    {(tabElevesMotifs||[]).map((eleve, index)=>{
                                        return <LigneEleve  eleveId ={eleve.id} rowIndex={index} nom={eleve.nom} motif={eleve.motifLabel}  etat={eleve.etat}/>
                                        })
                                    }
                                </div>

                            </div>

                            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', height:'23vh', marginLeft:'-2vw'}}>
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
                                        puceImgStyle={{marginRight:'-0.3vw', marginTop:props.formMode!='consult'? '1vh':'0vh'}}
                                    />  
                                    {(props.formMode!='consult')&&
                                        <CustomButton
                                            btnText={t("add")}
                                            buttonStyle={getSmallButtonStyle()}
                                            style={{marginBottom:'-0.3vh', marginRight:'0.8vw'}}
                                            btnTextStyle = {classes.btnSmallTextStyle}
                                            btnClickHandler={addParticipantRow}
                                        />  
                                    }                 
                                </div>

                                <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'23vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                                    <LigneProfParticipantHeader date={'Date'} nbreJours={t('nbre_jours')} etat={'Etat'}/>
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
                                {(currentUiContext.formInputs[9]==1) ?  //conseil cloture
                                    <CustomButton
                                        btnText={t("print_pv")}
                                        buttonStyle={getSmallButtonStyle()}
                                        style={{marginBottom:'-0.3vh', marginRight:'1vw'}}
                                        btnTextStyle = {classes.btnSmallTextStyle}
                                        btnClickHandler={props.cancelHandler}
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
                                    libelle ={t("general_decisions")}
                                    itemSelected={null}
                                    style={{marginBottom:'-1vh'}}
                                    puceImgStyle={{marginRight:'-0.3vw'}}
                                />
                                
                            </div>

                        </div>
                            
                            <div className={classes.inputRowLeft} style={{height:'11.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("dicision_resume")}:
                                </div>
                                    
                                <div> 
                                    <textarea id='bilan' rows={50}  onChange={getDecisionGeneraleHandler} className={classes.comboBoxStyle} defaultValue={currentUiContext.formInputs[13]} style={{marginLeft:'-2vw', height:'12vh',width:'27vw', fontSize:'0.77vw'}}/>
                                </div>
                            </div>

                            <div className={classes.inputRowLeft}> 
                                <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', height:'23vh', marginLeft:'-2vw'}}>
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
                                            puceImgStyle={{marginRight:'-0.3vw'}}
                                        />  
                                    </div>                                    
                                  
                                    <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'23vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                                        <LigneEleveDecisionHeader/>
                                        {(tabElevesDecisions||[]).map((eleve, index)=>{
                                            return <LigneEleveDecision  eleveId ={eleve.id} rowIndex={index} nom={eleve.nom} decision={eleve.decisionLabel} etat={eleve.etat}/>
                                            })
                                        }
                                    </div>                                  

                                </div>
                            </div>


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
                                        puceImgStyle={{marginRight:'-0.3vw'}}
                                    />  
                                                   
                                </div>

                                <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'20vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                                    <LignePresentsHeader/>
                                    {(tabProfsPresents||[]).map((participant, index)=>{
                                        return <LignePresent id={participant.id} rowIndex={index} nom={participant.label}/>
                                        })
                                    }
                                </div>

                            </div>
                           
                        </div>
                       
                    </div>

                    {(props.formMode != 'consult') &&
                        <div className={classes.inputRowRight} style={{position:'absolute', bottom:'0vh', marginBottom: isMobile ? '-1vh':'-3vh'}}>
                            <CustomButton
                                btnText= {'< '+t("etape")+' 1'}
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
                    btnText= {t("info_prelim")}
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
 export default AddDisciplinMeeting;
 