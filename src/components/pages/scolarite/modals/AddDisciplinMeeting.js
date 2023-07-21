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
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


var LIST_ELEVES = undefined;
var SELECTED_ROLE = undefined;
var SELECTED_PARTICIPANT = undefined;
var SELECTED_DECISION = 0 //0-> Recale, 1-> Admis, 2-> Traduit, 3->Blame, 4->Autre
var SELECTED_ELEVE = undefined;
var CURRENT_RESPONSABLE_ID= undefined;
var CURRENT_RESPONSABLE_LABEL = undefined;
var MEETING_OBJET_ID = undefined;
var MEETING_OBJET_LABEL = undefined;
var periodeId = undefined;

var eleves_data=[];



var MEETING = {
    //---Infos Generales 
    id:-1,
    classeId : 0,
    classeLabel:'',

    responsableId:0,
    responsableLabel:'',

    profPrincipalId :0,
    profPrincipalLabel : '',

    date:'',
    heure:'',

    objetId:0,
    objetLabel:'',

    autreObjet:'',

    etat:0,
    etatLabel:'En cours',

    decision:'',
    note_passage:0,

    note_exclusion:0,
    //---participants
    listParticipants : [], 
    
    //----Eleves convoques
    listConvoques:[],

    //---decisions cas par cas
    listCaspasCas : [],
   
    //---prof presents
    listPresents : [],
};

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;


function AddDisciplinMeeting(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const [isValid, setIsValid] = useState(false);
    const [optObjet, setOptObjet] = useState(getListObjets());
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;
    const [etape,setEtape] = useState(1);
    const [etape1InActiv, setEtape1InActiv] = useState(setButtonDisable(1));
    const [etape2InActiv, setEtape2InActiv] = useState(setButtonDisable(2));
    const [tabParticipant, setTabParticipant] = useState([]);
    const [tabEleves, setTabEleves]= useState([]);
    const [tabElevesDecisions, setTabElevesDecisions]= useState([]);
   
   // const [tabPresents, setTabPresents] = useState([]);
    const [optOK, setOptOK] = useState([]);
    
    const [optResponsable, setOptResponsable] = useState(getListResponsables());
    const [optRole, setOptRole]= useState(getListRoles());
    const [optConvoques, setOptConvoques] = useState([]);
    const [optPeriode, setOptPeriode] = useState([]);
    const [isBilan, setIsBilan] = useState(false);
    const [notifVisible, setNotifVisible]= useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [currentDecision, setCurrentDecision]=useState(0);
    const [currentMotif, setCurrentMotif]=useState(0);
    const [presents, setPresents]= useState([]);
    const [sanctions, setSanctions] = useState([]);
  
    useEffect(()=> {

        getClassStudentList(props.currentClasseId);
        setOptPeriode(nonDefini);
        /*setOptResponsable(tabResponsables);
        setOptRole(tabRoles);
        setOptObjet(tabObjets);*/
       
        MEETING = {
            classeId : props.currentClasseId,
            classeLabel:props.currentClasseLabel,
            profPrincipalId : props.currentPpId,
            profPrincipalLabel : props.currentPpLabel,

            id : putToEmptyStringIfUndefined(currentUiContext.formInputs[0]),

            responsableId:putToEmptyStringIfUndefined(currentUiContext.formInputs[1]),
            responsableLabel:putToEmptyStringIfUndefined(currentUiContext.formInputs[10]),

            date:putToEmptyStringIfUndefined(currentUiContext.formInputs[2]),
            heure:putToEmptyStringIfUndefined(currentUiContext.formInputs[3]),

            objetId:putToEmptyStringIfUndefined(currentUiContext.formInputs[4]),
            objetLabel:putToEmptyStringIfUndefined(currentUiContext.formInputs[11]),

            autreObjet:putToEmptyStringIfUndefined(currentUiContext.formInputs[5]),

            decision:putToEmptyStringIfUndefined(currentUiContext.formInputs[6]),

            note_passage:putToEmptyStringIfUndefined(currentUiContext.formInputs[7]),
            note_exclusion:putToEmptyStringIfUndefined(currentUiContext.formInputs[8]),

            etat : putToEmptyStringIfUndefined(currentUiContext.formInputs[9]),
           
            //---participants
            listParticipants : [...getListParticipants()],  
            
            //---prof presents
            listPresents : [...getListPresents()],
        
            //---decisions cas par cas
            listCaspasCas :  [...getListEleveConvoques()],

            //---Eleves convoques
            listConvoques: [...getListEleveConvoques()],
                        
        };    

        
        setTabParticipant([...getListParticipants()]);
        setTabEleves([...getListEleveConvoques()]);
        

        if (props.formMode == 'modif'){
            console.log('responsable:',MEETING.responsableId)
            tabResponsables.splice(0,1);
            var responsable = tabResponsables.find((resp)=>resp.value == MEETING.responsableId);
            var index = tabResponsables.findIndex((resp)=>resp.value == MEETING.responsableId);
            tabResponsables.splice(index,1);
            tabResponsables.unshift(responsable);
            setOptResponsable(tabResponsables);

            CURRENT_RESPONSABLE_ID =  MEETING.responsableId;
            CURRENT_RESPONSABLE_LABEL = MEETING.responsableLabel;

            /*tabObjets.splice(0,1);
            var objet = tabObjets.find((obj)=>obj.value == MEETING.objetId);
            index = tabObjets.findIndex((obj)=>obj.value == MEETING.objetId);
            tabObjets.splice(index,1);
            tabObjets.unshift(objet);
            //setOptObjet(tabObjets);

            MEETING_OBJET_ID = MEETING.objetId;
            MEETING_OBJET_LABEL =  MEETING.objetLabel;*/

            if(MEETING.etat==0) setNotifVisible(true);
        } 

        console.log(currentUiContext.formInputs);        

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
        })  
        return listEleves;     
    }

    function getElevesTab(elevesTab){
        var tabEleves = [{value:0,label:"- "+t('choisir')+" -"}]
        var new_eleve;
        elevesTab.map((eleve)=>{
            new_eleve = {};
            new_eleve.value = eleve.id;
            new_eleve.label = eleve.nom +' '+eleve.prenom;
            tabEleves.push(new_eleve);       
        })
        return tabEleves;
    }

    function periodeChangeHandler(e){
        if(e.target.value > 0){
            periodeId = e.target.value;
        } else periodeId = undefined;
    }

   
    function objetChangeHandler(e){
        var typeConseil = e.target.value;
        var tabPeriode=nonDefini;
        
       if(typeConseil != "null"){       
            switch(typeConseil){
                case 'sequentiel': {tabPeriode = [...props.sequencesDispo]; break;}
                case 'trimestriel': {tabPeriode = [...props.trimestresDispo]; break;}
                default:tabPeriode = nonDefini;
            }
            console.log("periode choisie",tabPeriode, typeConseil)
            setOptPeriode(tabPeriode);
            var meeting = tabObjets.find((meetg)=>meetg.value==e.target.value);

            MEETING_OBJET_ID = meeting.value;
            MEETING_OBJET_LABEL = meeting.label;

            if(MEETING_OBJET_ID == tabObjets[3].value) setIsBilan(true);
            else setIsBilan(false);

            // if(MEETING_OBJET_ID == tabObjets[4].value) setSeeDetail(true);
            // else setSeeDetail(false);
        }else{
            // setSeeDetail(false);
            setIsBilan(false);
            MEETING_OBJET_ID = undefined;
            MEETING_OBJET_LABEL = undefined;
        }
    }

    const nonDefini=[        
        {value: -1,   label:'-----'+ t('non defini') +'-----' },
    ];


    function getListParticipants(){
        return([
            {id:1, nom:'MBARGA Alfred',   role: 'Proviseur',      roleId:0, present:true, etat:1},
            {id:2, nom:'MOUDIO Luc',      role: 'Prof Principal', roleId:1, present:true, etat:1},
            {id:3, nom:'DEMBA BA Lucas',  role: 'Enseignant',     roleId:2, present:true, etat:1},            
        ]);
    }

    function getListEleveConvoques(){
        if(props.formMode == 'creation') return [];
        
        if(props.formMode == 'modif')
        return([
            {id:21, nom:'TINA Thomas',         motifId:0,  decisionLabel:'Absence',    decisions:[0,1,2,3,4], etat:0},
            {id:22, nom:'BOMBA NKODO Luc',     motifId:1,  decisionLabel:'Conduite',   decisions:[0,1,2,3.4], etat:0},
            {id:23, nom:'MOULIOM Hubert',      motifId:2,  decisionLabel:'Autre',      decisions:[0,1,2,3,4], etat:0},
        ]);

        if(props.formMode == 'consult')
        return([
            {id:21, nom:'TINA Thomas',         motifId:0,  decisionLabel:'Absence',    decisions:[0,1,2,3,4], etat:1},
            {id:22, nom:'BOMBA NKODO Luc',     motifId:1,  decisionLabel:'Conduite',   decisions:[0,1,2,3.4], etat:1},
            {id:23, nom:'MOULIOM Hubert',      motifId:2,  decisionLabel:'Autre',      decisions:[0,1,2,3,4], etat:1},
        ]);
    }

   /* function getListCasParCas(){
        if(props.formMode == 'creation') return [];
        else
        return([
            {id:1, nom:'TABI Thomas',  decisionId:0,  decisionLabel:'Recale',  decisions:[0,1,2,3,4], etat:1},
            {id:2, nom:'ANABA Luc',    decisionId:1,  decisionLabel:'Admis',   decisions:[0,1,2,3,4], etat:1},
            {id:3, nom:'TALLA Hubert', decisionId:2,  decisionLabel:'Traduit', decisions:[0,1,2,3,4], etat:1},
        ]);
    }*/

    function getListPresents(){
        if(props.formMode != 'consult') return [];
        else
        return([
            {id:1, nom:'MBARGA Alfred',   role: 'Proviseur',      roleId:0,  etat:1},
            {id:2, nom:'MOUDIO Luc',      role: 'Prof Principal', roleId:1,  etat:1},
            {id:3, nom:'DEMBA BA Lucas',  role: 'Enseignant',     roleId:2,  etat:1},            
        ]);
    }

    function getListResponsables(){
        return [        
            {value: 0,   label:'-----'+ t('choisir') +'-----'},
            {value: 11,  label:'Mr MBANBILI Hubert'          },
            {value: 12,  label:'Mme TIEFONG Huguette'        },
            {value: 13,  label:'Mme HEMLE MArthe'            },
            {value: 14,  label:'Mme EMORO MArthe'            },
            {value: 15,  label:'Mme TALLA Isabelle'          },
        ];
    }
    

    function getListObjets(){
        return[
            {value:"null", label:'-----'+ t('choisir') +'-----'    },
            {value:"sequentiel",  label:"Conseil bilan sequentiel" },
            {value:"trimestriel", label:"Conseil bilan trimestriel"},
        ];    
    }

    function getListRoles(){
        return [
            {value:-1,label:t('choisir')},
            {value:0, label:'President'},
            {value:1, label:'Prof Principal'},
            {value:2, label:'Enseignant'}
        ];
    }

    const tabResponsables=[        
        {value: 0,   label:'----'+ t('choisir') +'----'},
        {value: 11,  label:'Mr MBANBILI Hubert'        },
        {value: 12,  label:'Mme TIEFONG Huguette'      },
        {value: 13,  label:'Mme HEMLE MArthe'          },
        {value: 14,  label:'Mme EMORO MArthe'          },
        {value: 15,  label:'Mme TALLA Isabelle'        },
    ];

    const tabObjets=[
        {value:0, label:'----'+ t('choisir') +'----'},
        {value:1, label:"Conseil bilan sequentiel" },
        {value:2, label:"Conseil bilan trimestriel"},
        {value:3, label:"Conseil bilan annuel"     },
        {value:4, label:"Autre conseil"            },
    ];

    const tabParticipants=[
        {value:-1, label:'---'+ t('choisir') +'---'},
        {value:1,  label:'MBARGA Alfred'           },
        {value:2,  label:'MOUDIO Luc'              },
        {value:3,  label:'DEMBA BA Lucas'          }
    ];

    const tabRoles=[
        {value:-1, label:t('choisir')    },
        {value:0,  label:'President'     },
        {value:1,  label:'Prof Principal'},
        {value:2,  label:'Enseignant'    }
    ];

    var participant_data = [
        {id:1, nom:'MBARGA Alfred',   role: 'Proviseur',      roleId:0,  present:true, etat:1},
        {id:2, nom:'MOUDIO Luc',      role: 'Prof Principal', roleId:1,  present:true, etat:1},
        {id:3, nom:'DEMBA BA Lucas',  role: 'Enseignant',     roleId:2,  present:true, etat:1},            

    ];
   
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

    function getNotifButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_notifButtonStyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_notifButtonStyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P;
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
        getFormData1();
        if(formDataCheck1().length==0){
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }       
            MEETING.etat = 0 ;
            MEETING.etatLabel = 'En cours' ;
                      
            props.actionHandler(MEETING);
            setNotifVisible(true);
           
           /* chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")+"\n"+t("notify_prof")
            })*/
         
        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1();
        }

    }

    function gotoStep2Handler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        getFormData1();
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
        getFormData2();
        setEtape2InActiv(true);
        setEtape(1);
        setFormData1();
    }

   

    
    function finishAllSteps(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',MEETING);
        getFormData2();
        console.log('apres:',MEETING);
        if(formDataCheck2().length==0){
           if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
              
            MEETING.etat = 1 ;
            MEETING.etatLabel = 'Cloture' ;       
            props.actionHandler(MEETING);

            /*chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")+"\n"+t("print_pv_question") 
            })*/
            

        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck2();
        }
    }   

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }


    function getFormData1(){
        
        MEETING.id      = -1;
        MEETING.classeId = props.currentClasseId; 
        MEETING.classeLabel  =  props.currentClasseLabel;

        MEETING.responsableId = CURRENT_RESPONSABLE_ID; 
        MEETING.responsableLabel  =  CURRENT_RESPONSABLE_LABEL;

        MEETING.profPrincipalId = props.currentPpId; 
        MEETING.profPrincipalLabel  =  props.currentPpLabel;

        MEETING.date = document.getElementById('anne').value+'-'+ document.getElementById('mois').value + '-' + document.getElementById('jour').value;
        MEETING.heure = document.getElementById('heure').value+':'+ document.getElementById('min').value ;
        
        //MEETING.objetId = MEETING_OBJET_ID;
        //MEETING.objetLabel = MEETING_OBJET_LABEL;

        //MEETING.autreObjet = (document.getElementById('autre_conseilC')!= null)? document.getElementById('autre_conseilC').value : '';
        MEETING.listParticipants  = [...tabParticipant];

        MEETING.listConvoques = [...tabEleves];
       
        console.log(MEETING);
    }

    function getFormData2(){
        
        MEETING.decision = document.getElementById('bilan').value;
        //MEETING.note_passage = (document.getElementById('note_passage')==null||document.getElementById('note_passage')==undefined) ? -1 : document.getElementById('note_passage').value;
        //MEETING.note_exclusion = (document.getElementById('note_exclusion')==null||document.getElementById('note_exclusion')==undefined) ? -1 : document.getElementById('note_exclusion').value;
        MEETING.listParticipants = [...tabParticipant];
        MEETING.listPresents = [...tabParticipant.filter((participant)=>participant.present == true)];
        MEETING.listCaspasCas = [...optConvoques];
        console.log(MEETING);        
    }

    function setFormData1(){
        var tabEleve=[];        
        tabEleve[1]  =  MEETING.responsableId; 
        tabEleve[10]  =  MEETING.responsableLabel; 
        tabEleve[2]  =  convertDateToUsualDate(MEETING.date);
        tabEleve[3]  =  MEETING.heure; 
        tabEleve[9]  =  MEETING.etat;
        //tabEleve[4]  =  MEETING.objetId;
        currentUiContext.setFormInputs(tabEleve);
        console.log(MEETING.date);
    }
  
    function setFormData2(){
        var tabEleve=[];  
        var tabConvoques = [];
        var elvConvoque = {};
        console.log("eleves convoques",tabEleves);
      
        var profPresent =[];
        tabParticipant.map((elt, index)=>{profPresent[index]=true});
        setPresents(profPresent);

        tabEleves.map((elt,index)=>{
            elvConvoque={};
            elvConvoque.id = elt.id;
            elvConvoque.nom = elt.nom;
            elvConvoque.etat = elt.etat;
            elvConvoque.decisionId = 0;
            elvConvoque.decisionLabel ="";
            elvConvoque.decisions =[0,1,2,3,4];
            tabConvoques.push(elvConvoque)
        });

        setOptConvoques(tabConvoques);

        var tabSanctions=[];
        tabEleves.map((elt,index)=>{tabSanctions[index]=0});
        setSanctions(tabSanctions);

        tabEleve[6] = MEETING.decision;
        tabEleve[9]  =  MEETING.etat;
        //tabEleve[7] = MEETING.note_passage ==-1 ? 0 : MEETING.note_passage;
        //tabEleve[8] = MEETING.note_exclusion == -1 ? 0 : MEETING.note_exclusion;
        currentUiContext.setFormInputs(tabEleve);
        console.log('convoques',currentUiContext.formInputs, optConvoques);
    }

   
    function formDataCheck1(){       
        var errorMsg='';
        var meeting_hour = MEETING.heure.split(':')[0];
        var meeting_min = MEETING.heure.split(':')[1]
        if(meeting_hour[0]=='0') meeting_hour = meeting_hour[1];
        if(meeting_min[0]=='0')  meeting_min  = meeting_min[1];
       // console.log('jjjj',eval(meeting_hour),eval(meeting_min));
       
        if(MEETING.responsableId  == undefined){
            errorMsg= t("select_meeting_pres");
            return errorMsg;
        }

        if(MEETING.date.length == 0) {
            errorMsg= t("enter_meeting_date");
            return errorMsg;
        } 

        if(!((isNaN(MEETING.date) && (!isNaN(Date.parse(MEETING.date)))))){
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

        /*if( MEETING.objetId == undefined ){
            errorMsg="Veuillez selectionner l'objet du conseil  !";
            return errorMsg;
        }*/    
        return errorMsg;  
    }
    
    function formDataCheck2(){       
        var errorMsg='';
        
        /*if(MEETING.note_passage != -1 && MEETING.note_passage.length == 0 ){
            errorMsg="Veuillez saisir la note de passage arretee !";
            return errorMsg;
        }

        if(MEETING.note_passage != -1 && isNaN(MEETING.note_passage)){
            errorMsg="Veuillez saisir la note de passage valide !";
            return errorMsg;
        }

        if(MEETING.note_passage != -1 && (MEETING.note_passage > 20 || MEETING.note_passage < 0)){
            errorMsg="Veuillez saisir la note de passage valide !";
            return errorMsg;
        }

        if(MEETING.note_exclusion != -1 && MEETING.note_exclusion.length == 0 ){
            errorMsg="Veuillez saisir la note eliminatoire arretee !";
            return errorMsg;
        }

        if(MEETING.note_exclusion != -1 && isNaN(MEETING.note_exclusion)){
            errorMsg="Veuillez saisir la note eliminatoire valide !";
            return errorMsg;
        }

        if(MEETING.note_exclusion != -1 && (MEETING.note_exclusion > 20 || MEETING.note_exclusion < 0)){
            errorMsg="Veuillez saisir la note eliminatoire valide !";
            return errorMsg;
        }*/

        if(MEETING.decision.length == 0 ){
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


    function responsableChangeHandler(e){
        if(e.target.value > 0){
            var responsable = tabResponsables.find((resp)=>resp.value == e.target.value);
            
            CURRENT_RESPONSABLE_ID = responsable.value;
            CURRENT_RESPONSABLE_LABEL = responsable.label;

        } else{
            CURRENT_RESPONSABLE_ID = undefined;
            CURRENT_RESPONSABLE_LABEL = undefined;
        }
    }

    /*function objetChangeHandler(e){
       if(e.target.value > 0){
            var meeting = tabObjets.find((meetg)=>meetg.value==e.target.value);

            MEETING_OBJET_ID = meeting.value;
            MEETING_OBJET_LABEL = meeting.label;

            if(MEETING_OBJET_ID == tabObjets[3].value) setIsBilan(true);
            else setIsBilan(false);

            if(MEETING_OBJET_ID == tabObjets[4].value) setSeeDetail(true);
            else setSeeDetail(false);
        }else{
            setSeeDetail(false);
            setIsBilan(false);
            MEETING_OBJET_ID = undefined;
            MEETING_OBJET_LABEL = undefined;
        }
    }*/


    function cancelHandler(){
        MEETING={};
        props.cancelHandler();
    }
  
    function moveToLeft(){
        if(isButtonClicked) 
        document.getElementById("etape1").classList.add('gotoRight');
    }

    /************************************ JSX Code ************************************/

    //----------------- PARTICIPANT------------

    function participantChangeHandler(e){
        console.log(e, e.target.value);
        if(e.target.value != optResponsable[0].value){
            document.getElementById('participantId').style.borderRadius = '1vh';
            document.getElementById('participantId').style.border = '0.47vh solid rgb(128, 180, 248)';
            SELECTED_PARTICIPANT = e.target.value;

        }else{
            document.getElementById('participantId').style.borderRadius = '1vh';
            document.getElementById('participantId').style.border = '0.47vh solid red';
            SELECTED_PARTICIPANT = undefined;
        }

    }

    function roleChangeHandler(e){
        if(e.target.value != optRole[0].value){
            document.getElementById('roleId').style.borderRadius = '1vh';
            document.getElementById('roleId').style.border = '0.47vh solid rgb(128, 180, 248)';
            SELECTED_ROLE = e.target.value;
        }else{
            document.getElementById('roleId').style.borderRadius = '1vh';
            document.getElementById('roleId').style.border = '0.47vh solid red';
            SELECTED_ROLE = undefined;
        }
    }

    function addParticipantRow(){
        participant_data = [...tabParticipant];
        var index = participant_data.findIndex((elt)=>elt.id==0);
        if (index <0){
            
            participant_data.push({id:0, nom:'', role:'', present:true, etat:-1});
            setTabParticipant(participant_data);
            console.log(participant_data);
        } else {alert("ici")}
    }

    function addParticipant(){
        participant_data =[...tabParticipant];
        if(SELECTED_PARTICIPANT==undefined){
        document.getElementById('participantId').style.borderRadius = '1vh';
        document.getElementById('participantId').style.border = '0.47vh solid red';
        return -1;
        }

        if(SELECTED_ROLE==undefined){
        document.getElementById('roleId').style.borderRadius = '1vh';
        document.getElementById('roleId').style.border = '0.47vh solid red';
        return -1
        }
        
        var index = participant_data.findIndex((elt)=>elt.id==0);
        if (index >=0) participant_data.splice(index,1);
      
        var nomParticipant = optResponsable.find((participant)=>participant.value==SELECTED_PARTICIPANT).label;
        var roleParticipant = optRole.find((role)=>role.value==SELECTED_ROLE).label
        participant_data.push({id:SELECTED_PARTICIPANT, nom:nomParticipant, roleId:SELECTED_ROLE, role:roleParticipant, present:true, etat:0});
        setTabParticipant(participant_data);
        SELECTED_PARTICIPANT=undefined;
        SELECTED_ROLE = undefined

    }

    function deleteParticipant(e){
        console.log(e);
        participant_data =[...tabParticipant];
        var idParticipant = e.target.id;
        var index = participant_data.findIndex((elt)=>elt.id==idParticipant);
        if (index >=0){
            participant_data.splice(index,1);
            setTabParticipant(participant_data);
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
                        <select id='participantId' style={{height:'3.5vh', fontSize:'0.87vw', paddingTop:'1.3vh', width:'11.3vw', marginBottom:1}} onChange={participantChangeHandler} className={classes.comboBoxStyle}>
                            {(optResponsable||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select> 
                    }
                </div>
                
                <div style={{width:'11.3vw'}}> 
                    {(props.etat >= 0) ? 
                        props.role
                        :
                        <select id='roleId' style={{height:'3.5vh', fontSize:'0.87vw', paddingTop:'1.3vh', width:'11.3vw', marginBottom:1}} onChange={roleChangeHandler} className={classes.comboBoxStyle}>
                            {(optRole||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select> 
                    }
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

    //----------------- ELEVE CONVOQUES------------

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
            eleves_data.push({id:0, nom:'', decisions:[0,1,2,3,4], decisionsId:0, decisionsLabel:'', etat:-1});
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
        eleves_data.push({id:SELECTED_ELEVE, nom:eleveNom, decisionId:currentMotif, decisionLabel:getMotif(currentMotif), decisions:[0,1,2,3,4], etat:0})
        setTabEleves(eleves_data);
        
        SELECTED_ELEVE=undefined;
    }

    function getMotif(motifId){
        switch(motifId){
            case 0: return  t('absence');
            case 1: return  t('conduite');
            case 2: return  t('autre');
            default: return t('absence');
        }
   
    }

    function getDecision(decisionId){
        switch(decisionId){
            case 0: return  t('Recale');
            case 1: return  t('Admis');
            case 2: return  t('Traduit');
            case 3: return  t('Blame');
            default: return t('autre');
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
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>{t("nom")}</div>
                <div style={{width:'30vw'}}>{t("motif")}</div>
                <div style={{width:'7vw', marginLeft:'1.7vw'}}>{t("action")}</div>
            </div>
        );
    }

    const LigneEleve=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>
                    {(props.etat >= 0) ? 
                        props.nom
                      
                     :
                        <select id='eleveId' style={{height:'3.5vh', borderRadius:"1vh", fontSize:'0.87vw', width:'11.3vw', borderStyle:'solid', borderColor:'rgb(128, 180, 248)', borderWidth:'0.47vh', fontWeight:'solid'}} onChange={eleveChangeHandler}>
                            {(LIST_ELEVES||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select> 
                    }                   
                </div>


                {(props.etat >= 0) ?
                   <div style={{marginLeft:'0vw', width:'30vw'}}> {props.motif} </div>
                   
                   :
                        <div style={{display:'flex',  flexDirection:'row',   width:'30vw', alignItems:'center'}}> 
                            <input type='radio' id='absence' style={{width:'1vw', height:'2vh'}} checked={props.absence == currentMotif}  value={0} name={'eleveConv'+props.rowIndex} onClick={()=>{setCurrentMotif(0)}}/>
                            <label style={{ color:'black', fontWeight:"bold", fontSize:"0.77vw", marginLeft:'0.13vw', marginRight:"1vw"}}>{t("absences")} </label>
                                            
                            <input type='radio'  id='conduite' style={{width:'1vw', height:'2vh'}} checked={props.conduite== currentMotif}  value={1} name={'eleveConv'+props.rowIndex} onClick={()=>{setCurrentMotif(1)}}/>
                            <label style={{ width:'2vw', color:'black',  fontWeight:"bold", fontSize:"0.77vw", marginRight:"2vw", marginLeft:"0.3vw"}}>{t("conduite")}</label>

                            <input type='radio' id='autre'  style={{width:'1vw', height:'2vh'}} checked={props.autre== currentMotif}  value={2} name={'eleveConv'+props.rowIndex} onClick={()=>{setCurrentMotif(2)}}/>
                            <label style={{width:'2vw', color:'black', fontWeight:"bold", fontSize:"0.77vw", marginLeft:'0.13vw', marginRight:"1vw"}}>{t("autre")}</label>

                            {/*<input type='radio' id='blame' style={{width:'1vw', height:'2vh'}} checked={props.blame== currentDecision}  value={3} name={'eleveDecision'+props.rowIndex} onClick={()=>{setCurrentDecision(3)}}/>
                            <label style={{width:'2vw', color:'black', fontWeight:"bold", fontSize:"0.77vw", marginLeft:'0.13vw', marginRight:"1vw"}}>Blame </label>
                                            
                            <input type='radio' id='autre' style={{width:'1vw', height:'2vh'}} checked={props.autre== currentDecision}  value={4} name={'eleveDecision'+props.rowIndex} onClick={()=>{setCurrentDecision(4)}}/>
                            <label style={{color:'black',  fontWeight:"bold", fontSize:"0.77vw", marginRight:"0.3vw", marginLeft:"0.3vw"}}>Autre </label>*/}
                        </div>
                    }
              
                <div style={{width:'7vw', marginLeft:'1.7vw', display:'flex', flexDirection:'row'}}> 
                    {(props.etat<=0)&&
                        <img src="images/cancel_trans.png"
                            id={props.eleveId}  
                            width={ isMobile? '10vw':25} 
                            height={isMobile? '13.7vw':33}
                            className={classes.cellPointer} 
                            onClick={deleteEleve}                         
                            alt=''
                        />
                    }
                  
                    {(props.etat==-1)&&
                        <img src="images/checkp_trans.png"  
                            width={ isMobile? '7.7vw':19} 
                            height={isMobile? '7.7vw':19} 
                            className={classes.cellPointer} 
                            onClick={addEleve}                         
                            alt=''
                            style={{marginLeft:'1vw', marginTop:'1.2vh'}}
                        />
                    }
                </div>

            </div>
        );
    }

    //----------------- DECISION AU CAS PAR CAS ------------

    function eleveDecisionChangeHandler(e){
        if(e.target.value != tabEleves[0].value){
            document.getElementById('eleveId').style.borderRadius = '1vh';
            document.getElementById('eleveId').style.border = '0.47vh solid rgb(128, 180, 248)';
        
            SELECTED_ELEVE = e.target.value;
        
        }else{
            document.getElementById('eleveId').style.borderRadius = '1vh';
            document.getElementById('eleveId').style.border = '0.47vh solid red';
            SELECTED_ELEVE=undefined
        }
    }

   /* function addEleveRow(){
        eleves_data = [...tabEleves];
        var index = eleves_data.findIndex((elt)=>elt.id==0);
        if (index <0){
            eleves_data.push({id:0, nom:'', decisions:[0,1,2], decisionsId:0, decisionsLabel:'', etat:0});
            setTabEleves(eleves_data);
        } else {alert("ici")}

    }*/

    function updateEleve(e,rowIndex){
        eleves_data = [...optConvoques];
       
        var cur_eleveId= e.target.id;
       
        var index = eleves_data.findIndex((eleve)=>eleve.id == cur_eleveId);
        var cur_eleve = eleves_data.find((eleve)=>eleve.id == cur_eleveId);

        cur_eleve.etat=1;
        cur_eleve.decisionsId=sanctions[index];
        cur_eleve.decisionLabel = getDecision(sanctions[index]);

        console.log('curentEleve', cur_eleve);

        eleves_data.splice(index,1,cur_eleve);
       
        setOptConvoques(eleves_data);     

        console.log(optConvoques,tabEleves);  
        
    }

    
    function getDecision(decisionId){
        switch(decisionId){
            case 0: return t('aucune');
            case 1: return t('consigne');
            case 2: return t('excl_temp');
            case 3: return t('excl_def');
            default: return t('autre');
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

    function updateSanction(value, rowIndex){
        var tab=[...sanctions];
        tab[rowIndex]= value;
        setSanctions(tab);
        //setCurrentDecision(value);
       
    }

    const LigneEleveDecisionHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>{t("nom")}</div>
                <div style={{width:'30vw'}}>{t("decision")}</div>
                <div style={{width:'7vw', marginLeft:'1.7vw'}}>{t("action")}</div>
            </div>
        );
    }

    const LigneEleveDecision=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>
                    {props.nom}
                </div>


                {(props.etat == 1) ?
                   <div style={{marginLeft:'0vw', width:'30vw'}}> {props.decision} </div>
                   
                   :
                        <div style={{display:'flex',  flexDirection:'row',   width:'30vw', alignItems:'center'}}> 
                            <input type='radio' id='aucune' style={{width:'1vw', height:'2vh'}} checked={props.aucune == sanctions[props.rowIndex]}  value={0} name={'eleveDecision'+props.rowIndex} onClick={()=>{updateSanction(0,props.rowIndex)}}/>
                            <label style={{ color:'black', fontWeight:"bold", fontSize:"0.77vw", marginLeft:'0.13vw', marginRight:"1vw"}}> {t("aucune")}</label>
                                            
                            <input type='radio'  id='consigne' style={{width:'1vw', height:'2vh'}} checked={props.consigne== sanctions[props.rowIndex]}  value={1} name={'eleveDecision'+props.rowIndex} onClick={()=>{updateSanction(1,props.rowIndex)}}/>
                            <label style={{ width:'2vw', color:'black',  fontWeight:"bold", fontSize:"0.77vw", marginRight:"2vw", marginLeft:"0.3vw"}}> {t("consigne")} </label>

                            <input type='radio' id='exclusion_temp'  style={{width:'1vw', height:'2vh'}} checked={props.excluTemp == sanctions[props.rowIndex]}  value={2} name={'eleveDecision'+props.rowIndex} onClick={()=>{updateSanction(2,props.rowIndex)}}/>
                            <label style={{width:'3.3vw', color:'black', fontWeight:"bold", fontSize:"0.77vw", marginLeft:'0.13vw', marginRight:"1vw" }}>{ t('excl_temp')}</label>

                            <input type='radio' id='exclusion_def' style={{width:'1vw', height:'2vh'}} checked={props.excluDef== sanctions[props.rowIndex]}  value={3} name={'eleveDecision'+props.rowIndex} onClick={()=>{updateSanction(3,props.rowIndex)}}/>
                            <label style={{width:'3.3vw', color:'black', fontWeight:"bold", fontSize:"0.77vw", marginLeft:'0.13vw', marginRight:"1vw"}}>{ t('excl_def')} </label>
                                            
                            <input type='radio' id='autre' style={{width:'1vw', height:'2vh'}} checked={props.autre== sanctions[props.rowIndex]}  value={4} name={'eleveDecision'+props.rowIndex} onClick={()=>{updateSanction(4,props.rowIndex)}}/>
                            <label style={{color:'black',  fontWeight:"bold", fontSize:"0.77vw", marginRight:"0.3vw", marginLeft:"0.3vw"}}>{t("autre")} </label>
                        </div>
                    }
              
                <div style={{width:'7vw', marginLeft:'1.7vw', display:'flex', flexDirection:'row'}}> 
                    {/*(props.formMode!='consult')&&
                        <img src="images/cancel_trans.png"
                            id={props.eleveId}  
                            width={25} 
                            height={33} 
                            className={classes.cellPointer} 
                            onClick={deleteEleve}                         
                            alt=''
                        />*/
                    }
                   
                {(props.etat!=1)&&
                    <img src="images/checkp_trans.png"  
                        width={ isMobile? '7.7vw':19} 
                        height={isMobile? '7.7vw':19} 
                        id={props.eleveId}
                        className={classes.cellPointer} 
                        onClick={updateEleve}                         
                        alt=''
                        style={{marginLeft:'1vw', marginTop:'0.3vh'}}
                    />
                }
                   
                </div>

            </div>
        );
    }


    function addPresent(id){
      /*  var presents=[];
        presents = [...tabPresents];
        var profPresent = tabParticipant.find((prof)=>prof.id==id)
        var index = presents.findIndex((prof)=>prof.id==id)
        if(index<0){
            presents.push(profPresent);
            setTabPresents(presents);
        }

        console.log('liste des presents:', tabPresents);*/
    }

    function removePresent(id){
      /*  var presents=[];
        presents = [...tabPresents];
        var index = presents.findIndex((prof)=>prof.id==id)
        if(index>=0){
            presents.splice(index,1);
            setTabPresents(presents);
        }*/

    }

    function managePresent(e){
        e.preventDefault();
        var participants = [...tabParticipant];
        var tabPresent = [...presents];
        var row = e.target.id;
        if(e.target.checked){
            tabPresent[row]=true;
            participants[row].present= true;
            e.target.checked = true;
            setPresents(tabPresent);
            setTabParticipant(participants);

            //addPresent(idProf)
        }  
        else {
           tabPresent[row]=false;
           participants[row].present= false;
           e.target.checked = false;

            setPresents(tabPresent);
            setTabParticipant(participants);
            //removePresent(idProf)
        }
        console.log(tabParticipant);
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
           
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/ConseilDiscipline.png'/>
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
                <div id='etape1' className={classes.etapeP} onLoad={()=>{moveToLeft()}}>
                    <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                    {t("etape")+' 1'}: {t("conseil_class_prepa")}
                        {(props.formMode=='consult')&&
                            <div style={{display:'flex', flexDirection:'row', position:'absolute', right:0, top:'-0.7vh' }}>
                                {(currentUiContext.formInputs[9]==1) ?  //conseil cloture
                                    <CustomButton
                                        btnText= {t("print_pv")} 
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
                        
                        {/*
                            notifVisible &&
                            <div style={{position:'absolute', right:0, top:'-0.7vh' }}>
                              

                                <CustomButton
                                    btnText={t('alert_profs')}
                                    hasIconImg= {true}
                                    imgSrc='images/alarme.png'
                                    imgStyle = {classes.grdBtnImgStyle}  
                                    buttonStyle={getNotifButtonStyle()}
                                    btnTextStyle = {classes.notifBtnTextStyle}
                                    btnClickHandler={props.cancelHandler}
                                    
                                />
                            </div>
                        */}

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
                                    <input id="classe" type="text" className={classes.inputRowControl }  defaultValue={props.currentClasseLabel} style={{width:'4vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}} disabled={true}/>
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
                                        <input id="responsableLabel" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[10]}    style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                        <input id="responsableId" type="hidden"   className={classes.inputRowControl}   defaultValue={currentUiContext.formInputs[1]}   style={{width:'6vw',  height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>  
                                    :
                                    <div>                                     
                                        <select id='responsable' defaultValue={MEETING.responsableId} onChange={responsableChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-2vw', height:'1.87vw', fontSize:'1vw',width:'15vw'}}>
                                            {(optResponsable||[]).map((option)=> {
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
                                        <input id="date_meeting" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[2]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>
                                    :
                                    (currentUiContext.formInputs[2].length == 0) ?
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="jour"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} />/
                                        <input id="mois"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  />/
                                        <input id="anne"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("heure"))}}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  />
                                    </div>
                                    :
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="jour"  type="text"  maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}      className={classes.inputRowControl}  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}  defaultValue={currentUiContext.formInputs[2].split("/")[0]} />/
                                        <input id="mois"  type="text"  maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}      className={classes.inputRowControl}  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[2].split("/")[1]} />/
                                        <input id="anne" type="text"  maxLength={4}   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("heure"))}}     className={classes.inputRowControl}  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[2].split("/")[2]} />
                                    </div>
                                }

                                <div className={classes.inputRowLabelP} style={{fontWeight:570, marginLeft:'2vw'}}>
                                    {t("heure_conseil")}:
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="heure" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[3]} style={{width:'3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}}/>
                                    </div>
                                    :
                                    (currentUiContext.formInputs[3].length == 0) ?
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="heure"  type="text"  Placeholder='hh'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure"), document.getElementById("min"))}}     maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}} /><b>h</b>
                                        <input id="min"  type="text"    Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min"), null)}}                                maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  /><b>min</b>
                                    </div>
                                    :
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="heure"  type="text" maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure"), document.getElementById("min"))}}      className={classes.inputRowControl}  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}}  defaultValue={currentUiContext.formInputs[3].split(":")[0]} /><b>h</b>
                                        <input id="min"  type="text"   maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min"), null)}}                                  className={classes.inputRowControl}  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[3].split(":")[1]} /><b>min</b>
                                    </div>
                                }

                            </div>

                            <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("meeting_purpose")}:
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="objetLabel" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[11]} style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
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

                                {/*(seeDetail==true) ?
                                    <div> 
                                        <input id="autre_conseilC" type="text" className={classes.inputRowControl } Placeholder={'  precider les details '} defaultValue={currentUiContext.formInputs[3]} style={{marginLeft:'1.3vw', height:'1.7rem', width:'13vw', fontSize:'1.13vw'}}/>
                                    </div>
                                    :
                                    null
                            */}
                               
                            </div>

                             <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("periode_associee")}:  
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="periodeLabel" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[10]}    style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
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

                            {/*<div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    Professeur Principal:  
                                </div>
                                    
                                <div> 
                                    <input id="profPrincipalLabel" type="text" disabled={true} className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-2vw', height:'1rem', width:'15vw', fontSize:'1.13vw'}}/>
                                    <input id="profPrincipalId" type="hidden"  defaultValue={props.currentPpId}/>
                                </div>
                            </div>*/}
                    
                           
                            
                           
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
                                            btnText={t("add")}
                                            buttonStyle={getSmallButtonStyle()}
                                            style={{marginBottom:'-0.3vh', marginRight:'0.8vw'}}
                                            btnTextStyle = {classes.btnSmallTextStyle}
                                            btnClickHandler={addEleveRow}
                                        />   
                                    }                
                                </div>

                               

                                <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'19.3vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                                    <LigneEleveHeader/>
                                    {(tabEleves||[]).map((eleve, index)=>{
                                        return <LigneEleve  eleveId ={eleve.id} rowIndex={index} nom={eleve.nom} motif={eleve.decisionLabel} absence={eleve.decisions[0]} conduite={eleve.decisions[1]} autre={eleve.decisions[2]} etat={eleve.etat}/>
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
                                    {(tabParticipant||[]).map((prof)=>{
                                        return <LigneProfParticipant  participantId={prof.id} nom={prof.nom} role={prof.role} etat={prof.etat}/>
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
                        
                        {
                            notifVisible &&
                            <div style={{position:'absolute', right:0, top:'-0.7vh' }}>
                               {/* <CustomButton
                                    btnText='Notifier les concernes' 
                                    buttonStyle={getNotifButtonStyle()}
                                    btnTextStyle = {classes.notifBtnTextStyle}
                                    btnClickHandler={props.cancelHandler}
                                    />*/}


                                <CustomButton
                                    btnText={t('alert_profs')}
                                    hasIconImg= {true}
                                    imgSrc='images/alarme.png'
                                    imgStyle = {classes.grdBtnImgStyle}  
                                    buttonStyle={getNotifButtonStyle()}
                                    btnTextStyle = {classes.notifBtnTextStyle}
                                    btnClickHandler={props.cancelHandler}
                                    /*disable={(isValid==false)}   */
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
                            {(isBilan==true)&&
                                <div className={classes.inputRowLeft} style={{height:'3.7vh'}}> 
                                    <div style={{display:'flex', flexDirection:'row', marginLeft:'0vw'}}>
                                        <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                            {t("moy_passage")}:
                                        </div>
                                            
                                        <div> 
                                            <input id="note_passage" type="number" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[7]} style={{marginLeft:'-3vw', height:'1rem', width:'3.7vw', fontSize:'1.13vw'}} />
                                        </div>
                                    </div>

                                    <div style={{display:'flex', flexDirection:'row', marginLeft:'2vw', marginRight:'2vw'}}>
                                        <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                            {t("moy_exclusion")}:
                                        </div>
                                            
                                        <div> 
                                            <input id="note_exclusion" type='number' className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[8]} style={{marginLeft:'-3vw', height:'1rem', width:'3.7vw', fontSize:'1.13vw'}}/>
                                                
                                        </div>
                                    </div>

                                    <CustomButton
                                        btnText= {t("voir_stats")}
                                        buttonStyle={getSmallButtonStyle()}
                                        style={{marginBottom:'2.3vh', marginRight:'4.3vw'}}
                                        btnTextStyle = {classes.btnSmallTextStyle}
                                        btnClickHandler = {() => {addEleveRow()}}
                                    />     
                               
                                </div>
                          
                            }

                            <div className={classes.inputRowLeft} style={{height:'11.7vh'}}> 
                                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                    {t("dicision_resume")}:
                                </div>
                                    
                                <div> 
                                    <textarea id='bilan' rows={50}  className={classes.comboBoxStyle} defaultValue={currentUiContext.formInputs[6]} style={{marginLeft:'-2vw', height:'12vh',width:'27vw', fontSize:'0.77vw'}}/>
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
                                        {/*<CustomButton
                                            btnText='ajouter' 
                                            buttonStyle={getSmallButtonStyle()}
                                            style={{marginBottom:'-0.3vh', marginRight:'0.3vw'}}
                                            btnTextStyle = {classes.btnSmallTextStyle}
                                            btnClickHandler = {() => {addEleveRow()}}
                                        />  */}                    
                                    </div>

                                    <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', height:'23vh',overflowY:'scroll', justifyContent:'flex-start'}}>
                                        <LigneEleveDecisionHeader/>
                                        {(optConvoques||[]).map((eleve, index)=>{
                                            return <LigneEleveDecision  eleveId ={eleve.id} rowIndex={index} nom={eleve.nom} decision={eleve.decisionLabel} aucune={eleve.decisions[0]} consigne={eleve.decisions[1]} excluTemp={eleve.decisions[2]} excluDef={eleve.decisions[3]} autre={eleve.decisions[4]} etat={eleve.etat}/>
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
                                    {(tabParticipant||[]).map((participant, index)=>{
                                        return <LignePresent id={participant.id} rowIndex={index} nom={participant.nom}/>
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
                    imgStyle = {classes.frmBtnImgStyle1} 
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
 