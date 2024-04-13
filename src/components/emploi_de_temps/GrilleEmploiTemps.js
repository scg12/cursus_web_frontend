import React from 'react';
import classes from './EmploiT.module.css';
import classesPP from '../pages/scolarite/subPages/SubPages.module.css';
import LigneProfs from './LigneProfs'
import LigneValeur from './LigneValeur';
import CustomButton from '../customButton/CustomButton';
import classesPal from './palette/Palette.module.css';
import DroppableDiv from '../droppableDiv/DroppableDiv';
import DownloadTemplate from '../../components/downloadTemplate/DownloadTemplate';
import Jour from './Jour';
import MatiereDiv from './matiereDiv/MatiereDiv';

import { useContext, useState, useEffect} from "react";
import UiContext from '../../store/UiContext';
import AppContext from "../../store/AppContext";

import { useTranslation } from "react-i18next";
import '../../translation/i18n';
import {isMobile} from 'react-device-detect';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {TouchBackend} from 'react-dnd-touch-backend';
import axiosInstance from '../../axios';
import {COLORS,generateRandomNumbers} from './ET_Module';
import classesP from '../emploi_de_temps/palette/Palette.module.css';
import MsgBox from '../msgBox/MsgBox';
import BackDrop from '../backDrop/BackDrop';
import PDFTemplate from '../pages/scolarite/reports/PDFTemplate';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ETTemplate from '../pages/scolarite/reports/ETTemplate';
import {createPrintingPages} from '../pages/scolarite/reports/PrintingModule';
import { darkGrey, getTodayDate } from '../../store/SharedData/UtilFonctions';



let CURRENT_MATIERE_LIST;
let CURRENT_DROPPED_MATIERE_LIST;
let SELECTED_PROF_ID;
let indexClasse = -1;
let OLD_DROPPED_MATIERE = [];


let CURRENT_PROFS_LIST;
let CURRENT_DROPPED_PROFS_LIST;
var PROF_DATA = {};

let CURRENT_EMPLOIS_DE_TEMPS;



var chosenMsgBox;
const MSG_SUCCESS    = 1;
const MSG_WARNING    = 2;
const MSG_QUESTION1  = 3;
const MSG_QUESTION2  = 4;

const MSG_QUESTION_PAL1 = 110;
const MSG_QUESTION_PAL2 = 111;
const MSG_SUCCESS_PAL   = 120;
const MSG_WARNING_PAL   = 130;
const MSG_ERROR_PAL     = 140;

var droppedPPid;
var matiereToDelete;
var matiereDropZone;
var matiereProfIndex;
 
const ROWS_PER_PAGE= 40;
var currentClasseId = undefined;
var currentClasseLabel = undefined;
var ETPageSet ={};
var printedETFileName='';
var CURRENT_PP = undefined;
var TAB_PROF_PRINCIPAUX = [];


function GrilleEmploiTemps(props) {
  
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n } = useTranslation(); 

     //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(false);
   
    const [optClasse, setOptClasse] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    
    const [listMatieres,setListMatieres] = useState([]);
    const [isPPset, setIsPPset] = useState(false);
    const [selectedPP, setSelectedPP] = useState({});
    const [currentPP, setCurrentPP] = useState({});
    const[imageUrl, setImageUrl] = useState('');
    
    
    
    function createOption2(libellesOption){
        var newTab=[];
        for(var i=0; i< libellesOption.length; i++){
            var obj={
                value: libellesOption[i].id,
                label: libellesOption[i].libelle
            }
            newTab.push(obj);
        }
        return newTab;
    }
    
    
    
    useEffect(()=> {
        console.log("les menus",currentUiContext.previousSelectedMenuID, currentUiContext.currentSelectedMenuID);

        var cnv = document.getElementById('output');
        while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
        var cnx = cnv.getContext('2d');
        var url = darkGrey(document.getElementById("logo_url").value,cnv,cnx);
        setImageUrl(url);

       // if((currentUiContext.previousSelectedMenuID != currentUiContext.currentSelectedMenuID) || (currentUiContext.previousSelectedMenuID=='0' && currentUiContext.currentSelectedMenuID=='0')){
        if(optClasse.length == 0){
            console.log("00000 ",currentUiContext)
       
            if(currentUiContext.TAB_CRENEAU_PAUSE.length>0) {
           
                console.log("00000 ",currentUiContext)
                // setOptClasse(createOption2(currentUiContext.classeEmploiTemps));
                setOptClasse(createOption2(currentAppContext.infoUser.admin_classes));
                console.log("init TAB_VALEUR_HORAIRE",currentUiContext.classeEmploiTemps.length,currentUiContext.TAB_VALEUR_HORAIRE)
            

                // Affichage initial des matières pr la première classe selectionnée
                if(currentUiContext.classeEmploiTemps.length>0){
                    // currentUiContext.setNbRefreshEmpoiTemps();
                    currentUiContext.addMatiereToDroppedMatiereList([],-2);
                    console.log("nb_refresh: ",currentUiContext.nbRefreshEmpoiTemps);
                    console.log("=currentUiContext.CURRENT_DROPPED_MATIERE_LIST: ",currentUiContext.CURRENT_DROPPED_MATIERE_LIST)
                    currentClasseId = currentUiContext.classeEmploiTemps[0].id;
                    currentClasseLabel = currentUiContext.classeEmploiTemps[0].libelle;                
                }

                console.log("currentClasseId: ",currentClasseId,currentUiContext.classeEmploiTemps)
                indexClasse = currentUiContext.classeEmploiTemps.findIndex(c=>c.id==currentClasseId);
                console.log("INDEX: ",indexClasse);

                //TAB_PROF_PRINCIPAUX = [...currentUiContext.currentPPList];
                CURRENT_PP = getPPInfos(currentClasseId);
                console.log("PP", CURRENT_PP,currentPP);
                setCurrentPP(CURRENT_PP); setSelectedPP(CURRENT_PP);
                setIsPPset(currentPP!=undefined && currentPP!={})



                clearGrille(currentUiContext.TAB_PERIODES, currentUiContext.TAB_JOURS.length);
                
            
            
                initProfList(currentUiContext.listProfs);
                clearMatiereList(currentUiContext.matiereSousEtab); 
                var tabMatieres=[]
                
                var listMat = currentUiContext.listMatieres[indexClasse];

                tabMatieres = listMat.split('_');
                initMatiereList(tabMatieres);             
                setListMatieres(tabMatieres);
               
            
            
                var ET_data = getSaveEmploiTempsData(currentClasseId);
            
                initGrille(ET_data,currentUiContext.matiereSousEtab,currentUiContext.listProfs,currentClasseId,currentUiContext.emploiDeTemps,"");
                currentUiContext.setCurrentIdClasseEmploiTemps(currentClasseId);
                currentUiContext.setIndexClasse(indexClasse);
                let liste_dropped_matiere = currentUiContext.CURRENT_DROPPED_MATIERE_LIST.filter(ce=>ce.idClasse==currentClasseId).concat(OLD_DROPPED_MATIERE)
                console.log("+++ liste_dropped_matiere: ",liste_dropped_matiere);
                CURRENT_DROPPED_MATIERE_LIST = liste_dropped_matiere;
                currentUiContext.addMatiereToDroppedMatiereList(liste_dropped_matiere,-2);
                
                console.log("profs LIST: ",currentUiContext.CURRENT_DROPPED_PROFS_LIST,currentUiContext.listProfs)
            
            }  

            currentUiContext.setETDataChanged(false);
        }
 
    },[currentUiContext.TAB_CRENEAU_PAUSE]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;

   
    /*************************** <Managing Theme> ****************************/

    function getCurrentTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_footer;
            case 'Theme2': return classes.Theme2_footer;
            case 'Theme3': return classes.Theme3_footer;
            default: return classes.Theme1_footer;
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
   
/*************************** <Other functions> ****************************/

    function getPPInfos(classeId){
        var ppInfo = undefined;
        if(currentUiContext.currentPPList!= undefined && currentUiContext.currentPPList.length>0){
           var pp = currentUiContext.currentPPList.find((elt)=>elt.id_classe == classeId);
           if(pp!=undefined){
                ppInfo = {}
                ppInfo.NomProf = pp.PP_nom;
                ppInfo.id      = pp.PP_id; 
                ppInfo.sexe    = pp.sexe;          
            }
        }
        console.log('currentPP',ppInfo);
        return ppInfo;
    }

    function validerPP(e){
        console.log("les tabs",currentUiContext.currentPPList,currentUiContext.CURRENT_DROPPED_PROFS_LIST)

        TAB_PROF_PRINCIPAUX = (currentUiContext.currentPPList!=undefined)? [...currentUiContext.currentPPList]:[];

        if(selectedPP!= undefined){
            setIsPPset(true);
            setCurrentPP(selectedPP);

            var ppId = currentUiContext.CURRENT_DROPPED_PROFS_LIST.find((elt)=>elt.NomProf==selectedPP.NomProf);
            var idProf = ppId.idProf.split('_')[2];

            if(TAB_PROF_PRINCIPAUX.length>0){
                var ppData = TAB_PROF_PRINCIPAUX.find((elt)=>elt.id_classe==currentClasseId);
                if(ppData != undefined){
                    var ppIndex =  TAB_PROF_PRINCIPAUX.findIndex((elt)=>elt.id_classe==currentClasseId);
                    TAB_PROF_PRINCIPAUX[ppIndex].PP_nom = selectedPP.NomProf;
                    TAB_PROF_PRINCIPAUX[ppIndex].PP_id  = idProf;
                    TAB_PROF_PRINCIPAUX[ppIndex].sexe   = selectedPP.sexe;
                    currentUiContext.setCurrentPPList(TAB_PROF_PRINCIPAUX);
                }else{
                    var ppInfo = {};
                    ppInfo.id_classe = currentClasseId;
                    ppInfo.PP_nom    = selectedPP.NomProf;
                    ppInfo.PP_id     = idProf;
                    ppInfo.sexe      = selectedPP.sexe;
                    TAB_PROF_PRINCIPAUX.push(ppInfo);
                    currentUiContext.setCurrentPPList(TAB_PROF_PRINCIPAUX);                
                }    

            } else{
                var ppInfo = {};
                ppInfo.id_classe = currentClasseId;
                ppInfo.PP_nom    = selectedPP.NomProf;
                ppInfo.PP_id     = idProf;
                ppInfo.sexe      = selectedPP.sexe;
                TAB_PROF_PRINCIPAUX.push(ppInfo);
                currentUiContext.setCurrentPPList(TAB_PROF_PRINCIPAUX);
            }

        } else {
            setIsPPset(false);
            setCurrentPP({});
        }

    }

    function getSelectedProf(e){
        var pp_nom = e.target.id
        var PPSelected = currentUiContext.CURRENT_DROPPED_PROFS_LIST.find((prof)=>prof.NomProf == pp_nom);
       
        if (PPSelected != undefined) {
            var curent_pp = {...PPSelected}
            setSelectedPP(curent_pp);
        }
    }

    function getMatieres(indexClasse){
      let ligne = "";
    //   indexClasse = currentUiContext.classeEmploiTemps.findIndex(c=>c.id==currentClasseId);
      ligne = currentUiContext.listMatieres[indexClasse];
      console.log("LIGNE: ",ligne)
      return ligne;
    }
    
    // *activer
    function getEmploiDeTempsString(classeId){
        return '';
    }

    /*************************** <Managing Handlers> ****************************/
    function saveEmploiDeTemps(classeId){
        //Ici on ecrit le code du save.
    }

    // *activer
    function dropDownHandler(e){  
        currentClasseId    = e.target.value;
        currentClasseLabel = optClasse.find((elt)=>elt.value == currentClasseId).label;
        let indexClasse    = currentUiContext.classeEmploiTemps.findIndex(c=>c.id==currentClasseId);

        //currentUiContext.setETDataChanged(false);
        currentUiContext.setIndexClasse(indexClasse); 
        currentUiContext.setCurrentIdClasseEmploiTemps(currentClasseId);

        loadClassesET(currentClasseId);
       
        //gerer le profs principaux
        //au chargement, voir s'il y a un pp et le definir ds les useStates
        var PP_info = currentUiContext.currentPPList.find((elt)=>elt.id_classe == currentClasseId);
        if(PP_info != undefined){
            CURRENT_PP = {}
            CURRENT_PP.NomProf = PP_info.PP_nom;
            CURRENT_PP.id      = PP_info.PP_id;
            CURRENT_PP.sexe    = PP_info.sexe;
            setCurrentPP(CURRENT_PP);
            setSelectedPP(CURRENT_PP);
            setIsPPset(true);
        } else {
            setCurrentPP({});
            setSelectedPP({});
            setIsPPset(false);
        }
        
    }

    function loadClassesET(classId){
        
        var tabMatieres=[];
        
        currentUiContext.setNbRefreshEmpoiTemps(1);

        clearGrille(currentUiContext.TAB_PERIODES,currentUiContext.TAB_JOURS);

        //Initialisation de la liste des profs 
        initProfList(currentUiContext.listProfs);

        //Initialisation de la liste des  matieres 
        //clearMatiereList(currentUiContext.matiereSousEtab); 
        let indexClasse = currentUiContext.classeEmploiTemps.findIndex(c=>c.id==classId);
        var listMat = getMatieres(indexClasse);
        console.log("ICI listMat: ",listMat);
        tabMatieres = listMat.split('_');
        initMatiereList(tabMatieres);
        setListMatieres(tabMatieres);

        //Pre-remplissage de la grille avec les creneau deja configures 
        var ET_data = getSaveEmploiTempsData(classId);
        console.log("ET_data.length: ",ET_data.length);
        console.log("currentClasseId: ",classId);
        console.log("init currentUiContext.emploiDeTemps: ",currentUiContext.emploiDeTemps);
        
        initGrille(ET_data,currentUiContext.matiereSousEtab,currentUiContext.listProfs,classId,currentUiContext.emploiDeTemps,"dropDownHandler");
       
        // currentUiContext.setIndexClasse(indexClasse); 
        // currentUiContext.setCurrentIdClasseEmploiTemps(classId);
        console.log("OLD_MATIERES: ",OLD_DROPPED_MATIERE);
        
        console.log("**CURRENT_DROPPED_MATIERE_LIST: ",currentUiContext.CURRENT_DROPPED_MATIERE_LIST.filter(ce=>ce.idClasse==classId));
        let liste_dropped_matiere = currentUiContext.CURRENT_DROPPED_MATIERE_LIST.filter(ce=>ce.idClasse==classId).concat(OLD_DROPPED_MATIERE)
        
        console.log("+++ liste_dropped_matiere: ",liste_dropped_matiere);
        CURRENT_DROPPED_MATIERE_LIST = liste_dropped_matiere;
        
        currentUiContext.addMatiereToDroppedMatiereList(liste_dropped_matiere,-2);        
        console.log("currentUiContext.CURRENT_DROPPED_MATIERE_LIST: ",currentUiContext.CURRENT_DROPPED_MATIERE_LIST)        
    }


    
   
// *desactiver
    function getSaveEmploiTempsData(classeId){
        var ET_data='';
        //Requete axios pour rechercher les donnees d'emploi de temps existantes pour cette classe.
        /*axiosInstance.post(`get-emploiTemps/`, {
            code_classe: classeId,
        }).then((res)=>{
            console.log(res.data);
            ET_data = res.data ///bref on retourne la chaine 
        })*/
        var ET_data = getEmploiDeTempsString(classeId);

        return ET_data;
    }

   /*************************** <Utility Functions> ****************************/
    
    function calculDureePause(creneau){
        var tabHeure, tabHeureDeb,tabHeureFin;
        var dureePause=[];
        tabHeure = creneau.split('_');
        tabHeureDeb = tabHeure[0].split('h');
        tabHeureFin = tabHeure[1].split('h');
        // console.log("calculDureePause: ",tabHeureDeb, tabHeureFin);
        tabHeureDeb[0] =Evaluate(tabHeureDeb[0]);
        tabHeureDeb[1] =Evaluate(tabHeureDeb[1]);
        tabHeureFin[0] =Evaluate(tabHeureFin[0]);
        tabHeureFin[1] =Evaluate(tabHeureFin[1]);
        if( tabHeureDeb[0]==tabHeureFin[0]){
            dureePause.push(0);
            dureePause.push(tabHeureFin[1] - tabHeureDeb[1]);
        }else{
            if(tabHeureDeb[1]==tabHeureFin[1]){
                dureePause.push((tabHeureFin[0] -  tabHeureDeb[0]))
                dureePause.push(0); 
            } else{
                dureePause.push(tabHeureFin[0] -  (tabHeureDeb[0]+1));
                dureePause.push((60-tabHeureDeb[1])+tabHeureFin[1]);
            }           

        }
        
        return ((dureePause[0]*60)+ dureePause[1]);
    }

    function computePauseDivSize(dureePauseEnMinutes){
        let minutes = calculDureePause(currentUiContext.intervalleMaxTranche)
        return Math.floor(dureePauseEnMinutes*65/minutes);
        // return Math.floor(dureePauseEnMinutes*60/(currentUiContext.TAB_PERIODES.length))/60;
    }

    function calculMarge(creneau){
        var heure,marge, tabHeureDeb;
        let minutes = calculDureePause(currentUiContext.intervalleMaxTranche)
        tabHeureDeb = creneau.split('_');
        heure = tabHeureDeb[0].split('h');
        // marge = (Evaluate(heure[1])*60/(currentUiContext.TAB_PERIODES.length))/60;
        marge = (Evaluate(heure[1])*65/minutes);
        return Math.floor(marge);
    }

/****************************Copié depuis ET_Module**************************** */
function initGrille(ET_data,matiereSousEtab,listProfs,id_classe,emploiDeTemps,functionAppellante) {
    var i, j, jour, periode, codeMatiere, profId,id_tranche;
    // on doit aussi ajouter l'id de la classe en parametre
    // on cherche dans emploiDeTemps l'attribut value et on travaille avec
    // var tabMatiere = ET_data.split('|');
    var controleur;
    if (functionAppellante=="dropDownHandler"){
        controleur = 0;
        // currentUiContext.setNbRefreshEmpoiTemps(0);
    }
    else controleur = currentUiContext.nbRefreshEmpoiTemps;

    if(controleur==0 ){
        var tabMatiere = [];
        console.log("ET_data: ",ET_data," id_classe: ",id_classe);
        i = 0;
        let emploiTemps = emploiDeTemps.filter(em=>!em.modify.includes("s")&&em.id_classe==id_classe)
        console.log("emploiTemps: ",emploiTemps);
        // console.log("initGrille :",matiereSousEtab);
        let cpte_emploiTemps = emploiTemps.length;
        while(i < cpte_emploiTemps) {
            console.log("emploiTemps:[i] ",i,emploiTemps[i]);
            // jour = tabMatiere[i].split(':')[0];
            jour = emploiTemps[i].id_jour;
            // periode = tabMatiere[i].split(':')[1].split('*')[0];
            periode = emploiTemps[i].libelle;
            id_tranche = emploiTemps[i].id_tranche;
            // codeMatiere = tabMatiere[i].split(':')[1].split('*')[1];
            codeMatiere = emploiTemps[i].id_matiere;
            
            var idMatiereToDrop = 'DM_'+jour +'_' +  periode;
            var matiereIndex = CURRENT_MATIERE_LIST.findIndex((matiere)=> matiere.codeMatiere == codeMatiere);
            
            if(matiereIndex >= 0){
                var droppedMatiere = {...CURRENT_MATIERE_LIST[matiereIndex]};
                
                droppedMatiere.idMatiere = idMatiereToDrop;
                droppedMatiere.idJour = jour;
                droppedMatiere.isSelected = false;
                droppedMatiere.isOld = true;
                droppedMatiere.idClasse = id_classe;
                droppedMatiere.heureDeb = periode.split('_')[0];
                droppedMatiere.heureFin = periode.split('_')[1];
                droppedMatiere.tabProfsID =[];
                //droppedMatiere.tabProfsID.push(tabMatiere[i].split(':')[1].split('*')[2]);            
                
                //POSITIONNEMENT DE L'ELEMENT SUR LA GRILLE
                var parentDiv = document.createElement('div');
                parentDiv.id = droppedMatiere.idMatiere;
                parentDiv.className = classes.droppedMatiereStyle;
                parentDiv.style = "background-color:"+CURRENT_MATIERE_LIST[matiereIndex].colorCode;
            

                var enfanDiv = document.createElement('div');
                enfanDiv.id = droppedMatiere.idMatiere + '_sub';
                enfanDiv.className = classes.matiereTitleStyle;
                enfanDiv.textContent = droppedMatiere.libelleMatiere;

                parentDiv.appendChild(enfanDiv);
                // console.log("enfanDiv: ",enfanDiv);
                // console.log("parentDiv: ",parentDiv);

                var idDropZone = jour +'_'+ periode;
                console.log('zone de drop :', idDropZone)
                var containerDiv = document.getElementById(idDropZone);
                containerDiv.appendChild(parentDiv);
                parentDiv.addEventListener('click', (e) => {matiereClickHandler(e)})
                
                //S'IL YA UN OU DES PROFS, ON LES GERE
                if(emploiTemps[i].value!="" && emploiTemps[i].value.split('*').length>2&& emploiTemps[i].value.split('*')[2].length>2) {
                    // var countProf =  tabMatiere[i].split(':')[1].split('*').length-2;
                    var countProf =  emploiTemps[i].id_enseignants.length;
                    j = 0;
                    while(j<countProf){
                        console.log("emploiTemps[i].id_enseignants[j]: ",emploiTemps[i].id_enseignants[j])
                        // var droppedProfId = 'DP_'+ tabMatiere[i].split(':')[1].split('*')[j+2].split('%')[1] + '_' + jour +'_' +  periode;
                        var droppedProfId = 'DP_prof_'+ emploiTemps[i].id_enseignants[j]+"_"+emploiTemps[i].id_jour+"_"+emploiTemps[i].libelle
                        
                        var droppedprofImgDiv = document.createElement('div');
                        droppedprofImgDiv.id = droppedProfId +'_img';
                        droppedprofImgDiv.className = classes.profImgStyle;


                        var droppedprofImg = document.createElement('img');
                        droppedprofImg.className = classes.imgStyle +' '+ classes.profImgStyle;
                        droppedprofImg.id = droppedProfId +'_img';

                        // droppedprofImg.setAttribute('src', "images/maleTeacher.png");
                        var sexe = "M";
                        if(emploiTemps[i].value.split(':')[1].split('*')[j+2].split('%')[0].includes('Mr.'))
                            droppedprofImg.setAttribute('src', "images/maleTeacher.png");
                        else{
                            sexe = "F";
                            droppedprofImg.setAttribute('src', "images/femaleTeacher.png");
                        }
                            // droppedprofImg.setAttribute('src',(tabMatiere[i].split(':')[1].split('*')[j+2].split('%')[0].includes('Mme.'))? "images/femaleTeacher.png":"images/femaleTeacher.png");
                        droppedprofImg.style.display = 'block';

                        droppedprofImg.addEventListener('click', (e) => {droppedProfClickHandler(e)})

                        
                        var droppedprofText = document.createElement('div');
                        droppedprofText.id = droppedProfId +'_sub';
                        droppedprofText.className = classes.profTextSyle;
                        // droppedprofText.textContent = tabMatiere[i].split(':')[1].split('*')[j+2].split('%')[0];
                        if(sexe=="M")
                            droppedprofText.textContent = emploiTemps[i].value.split("*")[2+j].split("%")[0].split("Mr.")[1];
                        else
                            droppedprofText.textContent = emploiTemps[i].value.split("*")[2+j].split("%")[0].split("Mme.")[1];
                        droppedprofText.addEventListener('click', (e) => {droppedProfClickHandler(e)})


                    
                        droppedprofImgDiv.appendChild(droppedprofImg)
                        droppedprofImgDiv.appendChild(droppedprofText)
                        //droppedprofImgDiv.addEventListener('click', (e) => {droppedProfClickHandler(e)})


                        var droppedprofDiv = document.createElement('div');
                        droppedprofDiv.id = droppedProfId;
                        droppedprofDiv.className = classes.profDivStyle;
                        droppedprofDiv.appendChild(droppedprofImgDiv);
                        //droppedprofDiv.addEventListener('click', () => {droppedProfClickHandler(droppedProfId)})
                        
                        var container = document.getElementById('P_'+ jour + '_' +  periode);
                        container.appendChild(droppedprofDiv)
                        //container.addEventListener('click', () => {droppedProfClickHandler(droppedProfId)})
                        droppedMatiere.tabProfsID.push(droppedProfId);
                        
                        // let listProfs = currentUiContext.listProfs;
                        // let nb = listProfs.length;
                        // let nb_cours = 0;
                        // for(let i=0;i<nb;i++){
                        //     nb_cours = currentUiContext.emploiDeTemps.filter(item=>item.id_enseignants.includes(listProfs[i].id)).length;
                        //     console.log("YOOOOOOO ",listProfs[i],nb_cours);
                        // }

                        PROF_DATA = {};
                        PROF_DATA.idProf     = droppedProfId;
                        PROF_DATA.sexe       = sexe;
                        PROF_DATA.NomProf    =  droppedprofText.textContent;
                        PROF_DATA.idJour     = jour;
                        PROF_DATA.idMatiere  = idMatiereToDrop;
                        PROF_DATA.heureDeb   = periode.split('_')[0];
                        PROF_DATA.heureFin   = periode.split('_')[1];
                        PROF_DATA.isSelected = false
                        
                        CURRENT_DROPPED_PROFS_LIST.push(PROF_DATA);
                        j++;
                        console.log(PROF_DATA, CURRENT_DROPPED_PROFS_LIST)
                    }
                }
                
                OLD_DROPPED_MATIERE.push(droppedMatiere);
                //MISE A JOUR DES DONNEES GLOBALES
                //AddValueToValueDroppedMatiereList(-1,droppedMatiere);          
            }  
            i++;         
        }
   
    } else loadClassesET(id_classe);      
 
    currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST,-1);
    currentUiContext.setNbRefreshEmpoiTemps(0);
}

function matiereClickHandler(e){
    var indexMatiere, codeMatiere, matiereId;
    console.log('event',e);
    // console.log('matiereClickHandler listProfs',listProfs);
    matiereId = e.target.id;
    matiereId = e.target.id;
    if (matiereId.includes('_sub'))  matiereId = matiereId.substring(0,matiereId.length-4)
    if(e.ctrlKey || e.metaKey){
        if(!isCellSelected(matiereId)) {
            //clearCellSelection();
            selectCell(matiereId);                
        } else {
            //clearCellSelection();
            disSelectCell(matiereId);             
        }
    } else {
        if(!isCellSelected(matiereId)) {
            clearCellSelection();
            selectCell(matiereId);                
        } else {
            clearCellSelection();
            disSelectCell(matiereId);                
        }

    }
    
    var countSelected = getCountSelectedDroppedMatieres()

    if(countSelected==1){
       
        var periode ; //ici il faudra initialiser la periode de la matiere selectionnee.
        let liste_prof = [], tab_prof_id;
        
        indexMatiere  = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>(matiere.isSelected == true));
        codeMatiere   = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].codeMatiere;
      
        periode       = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].idMatiere;
        tab_prof_id   = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].tabProfsID;

        
        tab_prof_id.forEach(prof => {console.log("$$ prof: ",prof,prof.split("DP_prof_")[1].split("_")[0]);
            liste_prof.push(parseInt(prof.split("DP_prof_")[1].split("_")[0]))
        });

        console.log("data matiere",codeMatiere, periode, liste_prof,CURRENT_DROPPED_MATIERE_LIST,indexMatiere)

        searchAndSetProfLibresInProfDiv(codeMatiere,periode,liste_prof);                                            

    } else {
        if(countSelected >1){
            
            if(selectedDroppedMatiereHaveSameCode()){
                let liste_prof = [],tab_prof_id;
                //On obtient le sous tab des matieres selected
                var tabDroppedSelectedMatieres =  CURRENT_DROPPED_MATIERE_LIST.filter((matiere)=>(matiere.isSelected == true) && matiere.idClasse == currentClasseId);
                
                //On cherche la matiere qui le moins de profs dispo
                var matiereWithLowestFreeProfs = tabDroppedSelectedMatieres[0];

                tabDroppedSelectedMatieres.map((dropSelMat, index)=>{
                    if(index>0){
                        console.log("idMatieres", matiereWithLowestFreeProfs.codeMatiere, dropSelMat.codeMatiere);
                        console.log("Prof Libres", getProfLibres(matiereWithLowestFreeProfs.codeMatiere, matiereWithLowestFreeProfs.idMatiere), getProfLibres(dropSelMat.codeMatiere, dropSelMat.idMatiere));
                        if(getProfLibres(matiereWithLowestFreeProfs.codeMatiere, matiereWithLowestFreeProfs.idMatiere).length > getProfLibres(dropSelMat.codeMatiere, dropSelMat.idMatiere).length){
                            matiereWithLowestFreeProfs = {...dropSelMat};
                        }
                    } 
                })
     
                codeMatiere  = matiereWithLowestFreeProfs.codeMatiere;
                periode      = matiereWithLowestFreeProfs.idMatiere;
                tab_prof_id  = matiereWithLowestFreeProfs.tabProfsID;
                console.log("prof",tab_prof_id);

                tab_prof_id.forEach(prof => {
                    liste_prof.push(parseInt(prof.split("DP_prof_")[1].split("_")[0]))
                });
                console.log("liste_prof: ",liste_prof)
                searchAndSetProfLibresInProfDiv(codeMatiere,periode,liste_prof);
            }
        }
    }
}

function getProfLibres(codeMatiere, periode){
        
    console.log("periode la",periode);
    let idjour  = periode.split("DM_")[1].split("_")[0];
    let tranche = periode.split("DM_")[1].split("_")[1]+"_";
    tranche += periode.split("DM_")[1].split("_")[2];

    let listProfs     = currentUiContext.listProfs;
    let emploiDeTemps = currentUiContext.emploiDeTemps;
    var profOccupes   = [];
    
    //On obtient tous les enseignants de la matiere
    let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);

    //On obtient toutes les entree de l'ET qui correspondent au jour la et a la tranche la
    let emploi_selected = emploiDeTemps.filter(e=>e.id_matiere==codeMatiere && e.id_jour==idjour && e.libelle==tranche);
    console.log("ET selected", emploiDeTemps, emploi_selected, codeMatiere, idjour, tranche);
   
    //Les profs occupes seront tous les profs de ces entrees la.
    for(let j=0; j<emploi_selected.length; j++){
        emploi_selected[j].id_enseignants.forEach(prof => {
            profOccupes.push(prof)
        });
    }
     
    //Les profs libres sont les autees profs de cette matiere qui ne sont pas occupes.
    return profsMatieres.filter(p=>!profOccupes.includes(p.id));
    
}



function initProfList(listProfs){
    clearProflist();
    SELECTED_PROF_ID='';
    CURRENT_DROPPED_PROFS_LIST=[];
   
}


function clearProflist(){
    var draggableSon, draggableSonText, draggableSonImg;   
    currentUiContext.listProfs.map((prof,index)=>{
        draggableSon                  = document.getElementById('prof_' + prof.id);
        draggableSonText              = document.getElementById('prof_' + prof.id+'_sub');
        draggableSonImg               = document.getElementById('prof_' + prof.id + '_img');      
        draggableSonImg               = document.querySelector('#prof_' + prof.id + '_img > img');

        draggableSon.style.display     = 'none';
        draggableSonText.style.display = 'none';
        draggableSonImg.style.display  = 'none';
    }) 
    CURRENT_PROFS_LIST = [];
}


function clearGrille(TAB_PERIODES,TAB_JOURS) {
    var DropZoneId;
    var childDivs;
    var parentDivs;
    var NB_PERIODE = TAB_PERIODES.length;
    var DAYS_COUNT = TAB_JOURS.length;
   
    for (var dayId = 0; dayId < DAYS_COUNT; dayId++) {
        for (var periode = 0; periode < NB_PERIODE; periode++)
         {
            //La DropZone de la Matiere
            DropZoneId = TAB_JOURS[dayId].id+"_"+TAB_PERIODES[periode].duree;
            childDivs = document.getElementById(DropZoneId);
            console.log("DropZoneId hhhh: ",DropZoneId)
            if (childDivs!=null){
                while(childDivs.firstChild) childDivs.removeChild(childDivs.firstChild);
                /*childDivs = childDivs.childNodes;
                for(var i = 0; i < childDivs.length; i++){
                    console.log("son: ",childDivs[i])
                    childDivs[i].remove();
                }*/
            }                
            //La DroZone du Prof
            DropZoneId = 'P_'+TAB_JOURS[dayId].id+'_'+TAB_PERIODES[periode].duree;
            parentDivs = document.getElementById(DropZoneId);
            console.log("DropZoneId2: ",DropZoneId)
            if (parentDivs!=null)
                while(parentDivs.firstChild) parentDivs.removeChild(parentDivs.firstChild);

            // if (parentDivs!=null){
            //     if (parentDivs.style.borderColor=='red'){
            //         parentDivs.style.borderStyle = null;
            //         parentDivs.style.borderWidth = null;
            //         parentDivs.style.borderColor = null;
            //         parentDivs.className = classes.ProfDroppableDivstyle;
            //     }
            //     childDivs = parentDivs.childNodes;
            //     console.log("childDivs ",childDivs)
            //     console.log("childDivs.childNodes: ",childDivs.length)
            //     for(var i = 0; i < childDivs.length; i++){
            //         console.log("son: ",childDivs[i])
            //         childDivs[i].remove();
            //     }
            // }                
            
        }
    }

}

function clearMatiereList(matieres){
    var parent, enfants, draggableSon;
    //On initialise tout ce aui concerne la matiere.
    CURRENT_DROPPED_MATIERE_LIST=[];
    CURRENT_MATIERE_LIST=[];
    
    
    /*parent = document.getElementById('matieres');
    enfants = parent.childNodes;
    
    for (var i = 0; i < MATIERE_MAXSIZE; i++) {
        parent =  document.getElementById('matiere_' + matieres[i].id);
        draggableSon = document.getElementById('matiere_' + matieres[i].id+'_sub');
        parent.className = null;
        parent.title = '';
        draggableSon.textContent ='';
        draggableSon.className = null; 
    }  */
    currentUiContext.setCURRENT_MATIERE_LIST([])  
}

function initMatiereList(listeMatieres){
   
    var MATIERE_DATA ={};
    var tabMatiere =[];

    CURRENT_MATIERE_LIST=[];
    console.log("listeMatieres: ",listeMatieres)
    
    listeMatieres.map((matiere, index)=>{
        tabMatiere = matiere.split('*');
        MATIERE_DATA = {};
        MATIERE_DATA.libelleMatiere = tabMatiere[0];
        MATIERE_DATA.idMatiere = 'matiere_' + tabMatiere[1];
        MATIERE_DATA.codeMatiere = tabMatiere[1];
        MATIERE_DATA.colorCode = tabMatiere[2];
        
        CURRENT_MATIERE_LIST.push(MATIERE_DATA);

    })
   
    console.log('matieres',CURRENT_MATIERE_LIST);
    currentUiContext.setCURRENT_MATIERE_LIST(CURRENT_MATIERE_LIST);
}

function Evaluate(val){
    if(val==''||val==' '|| isNaN(val)) return 0;
    else return eval(val);

}

function droppedProfClickHandler(e){
    var droppedProfDiv = e.target.id;
    console.log(droppedProfDiv," ici") 

    //On enleve l'extension _sub ou _img
    droppedProfDiv = droppedProfDiv.substring(0,droppedProfDiv.length-4)
    profZoneClickedHandler(droppedProfDiv);  
    console.log(droppedProfDiv) 
}


function  isCellSelected (cellId) {

    var index = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId && matiere.idClasse == currentClasseId)
    console.log("matiere",CURRENT_DROPPED_MATIERE_LIST, CURRENT_DROPPED_MATIERE_LIST.find((matiere)=>matiere.idMatiere == cellId),currentUiContext.currentIdClasseEmploiTemps)
    return (CURRENT_DROPPED_MATIERE_LIST[index].isSelected == true);
}


function getCountSelectedDroppedMatieres(){
    var count = 0;
    for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
        if(CURRENT_DROPPED_MATIERE_LIST[i].idClasse == currentClasseId && CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
    }
    console.log("count selected",count,currentClasseId);
    return count;
}


function getCountSelectedDroppedProfs(){
    var count = 0;
    for(var i=0 ; i<CURRENT_DROPPED_PROFS_LIST.length; i++){
        if(CURRENT_DROPPED_PROFS_LIST[i].isSelected==true) count++;
    }
    return count;
}

function selectedDroppedMatiereHaveSameCode(){
    var areSame = true;
    var i = 1;
    var firstSelectedIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected==true && matiere.idClasse == currentClasseId);
    var codeMatiere = CURRENT_DROPPED_MATIERE_LIST[firstSelectedIndex].codeMatiere;

    while(i < CURRENT_DROPPED_MATIERE_LIST.length && areSame==true) {
        if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected == true && CURRENT_DROPPED_MATIERE_LIST[i].idClasse == currentClasseId && CURRENT_DROPPED_MATIERE_LIST[i].codeMatiere != codeMatiere) areSame = false;
        i++;       
    }
    return areSame;
}

function clearCellSelection(){
       
    for(var i=0; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){ 
        if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected){                
            disSelectCell(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere);
        }         
        
    }
     
}

function selectCell(cellId){  
    var matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId && matiere.idClasse == currentClasseId);

    CURRENT_DROPPED_MATIERE_LIST[matiereIndex].isSelected = true;      
    
    document.getElementById(cellId).style.borderColor ='red';

    console.log("etat", cellId, CURRENT_DROPPED_MATIERE_LIST[matiereIndex],CURRENT_DROPPED_MATIERE_LIST)
    
    clearProflist();
}


function disSelectCell(cellId) {
  
    var matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=> matiere.idMatiere == cellId && matiere.idClasse == currentClasseId);
    
    CURRENT_DROPPED_MATIERE_LIST[matiereIndex].isSelected = false;
    
    if(document.getElementById(cellId).style.backgroundColor.length==0){
        document.getElementById(cellId).style.borderColor = 'rgb(6, 83, 134)';
    } else{
        document.getElementById(cellId).style.borderColor = document.getElementById(cellId).style.backgroundColor;
    }

    console.log("etat", cellId, CURRENT_DROPPED_MATIERE_LIST[matiereIndex],CURRENT_DROPPED_MATIERE_LIST)
    
    clearProflist();

}


function getProfsList(codeMatiere, periode){


    var tabProfs,profList;
    var codeMatiere;

    profList = getProfs(codeMatiere)
    tabProfs = profList.split('_');
    initProfListWithProfs(tabProfs);

    /*countMatieres = getCountSelectedDroppedMatieres();
    if(countMatieres == 0) {
        alert('Vous devez selectionner une matiere!');
    } else {
        if(countMatieres > 1) {
            alert('Vous devez selectionner une seule matiere!');
        } else {
            profList = getProfs(codeMatiere)
            tabProfs = profList.split('_');
            initProfListWithProfs(tabProfs);
        } 
    }*/
}
function initProfListWithProfs2(listeProf){
    var parent = document.getElementById('profList');
    var draggableSon, draggableSonText, draggableSonImg;

    clearProflist();
    console.log(listeProf);
    let nb = listeProf.length;
    let nb_cours = 0;
    for (var i = 0; i < nb; i++) {
        nb_cours = currentUiContext.emploiDeTemps.filter(item=>item.id_enseignants.includes(listeProf[i].id)).length;
        PROF_DATA = {};

        draggableSon =  document.getElementById('prof_' + listeProf[i].id);
        draggableSonText = document.getElementById('prof_' + listeProf[i].id+'_sub');
        
        draggableSon.className = classesP.profDivStyle;  
        draggableSon.title = listeProf[i].nom+" "+listeProf[i].prenom;       
        
        draggableSonText.textContent = listeProf[i].nom+" ("+nb_cours+")";
        draggableSonText.className = classesP.profTextSyle;            

        draggableSonImg =  document.getElementById('prof_' + listeProf[i].id + '_img');
        draggableSonImg.className = classesP.profImgStyle;

        draggableSonImg = document.querySelector('#prof_' + listeProf[i].id + '_img > img')
        if(listeProf[i].sexe=="M")
            draggableSonImg.setAttribute('src',"images/maleTeacher.png");
        else
            draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
        draggableSonImg.style.display = 'block';


       
        
        
        PROF_DATA.idProf = 'prof_' +listeProf[i].id;
        PROF_DATA.NomProf = listeProf[i].nom;
        
        CURRENT_PROFS_LIST.push(PROF_DATA);
        currentUiContext.setCurrentProfList(CURRENT_PROFS_LIST);
        PROF_DATA = {};                                     
    }
 
}
// *desactiver
function initProfListWithProfs(listeProf){
    var parent = document.getElementById('profList');
    var draggableSon, draggableSonText, draggableSonImg;

    clearProflist();
    //alert(listeProf);
  
    for (var i = 0; i < listeProf.length; i++) {
        PROF_DATA = {};
        draggableSon =  document.getElementById('prof_' + (i+1));
        draggableSonText = document.getElementById('prof_' + (i+1)+'_sub');
        
        draggableSon.className = classesP.profDivStyle;  
        draggableSon.title = listeProf[i];       
        
        draggableSonText.textContent = listeProf[i];
        draggableSonText.className = classesP.profTextSyle;            

        draggableSonImg =  document.getElementById('prof_' + (i+1) + '_img');
        draggableSonImg.className = classesP.profImgStyle;

        draggableSonImg = document.querySelector('#prof_' + (i+1) + '_img > img')
        if(listeProf[i].includes('Mr.')) {
            draggableSonImg.setAttribute('src',"images/maleTeacher.png");
        }else{
            draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
        }
        
        
        PROF_DATA.idProf = 'prof_' + (i+1);
        PROF_DATA.NomProf = listeProf[i];
        
        CURRENT_PROFS_LIST.push(PROF_DATA);
        PROF_DATA = {};                                     
    }
 
}
function profZoneClickedHandler(id){
    SELECTED_PROF_ID = id;
    var idTab = SELECTED_PROF_ID.split('_');
    var ProfDroppableZone = 'P_'+idTab[3]+'_'+idTab[4]+'_'+idTab[5];
    var index;
       
    if (idTab[0]=='DP') {
        
        index = CURRENT_DROPPED_PROFS_LIST.findIndex((prof)=>prof.idProf == id)
       
        if(index >=0) {
            if(CURRENT_DROPPED_PROFS_LIST[index].isSelected == false){
                CURRENT_DROPPED_PROFS_LIST[index].isSelected = true;
                document.getElementById(SELECTED_PROF_ID).style.borderStyle ='solid';
                document.getElementById(SELECTED_PROF_ID).style.borderWidth ='1px';  
                document.getElementById(SELECTED_PROF_ID).style.borderColor ='red';

            } else {
                CURRENT_DROPPED_PROFS_LIST[index].isSelected = false;
                document.getElementById(SELECTED_PROF_ID).style.borderStyle = null;
                document.getElementById(SELECTED_PROF_ID).style.borderWidth = null;
                document.getElementById(SELECTED_PROF_ID).style.borderColor = null;
            }
            currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST,-1);
        } else{
            alert('Ye Le prof selectionne ne figure pas dans la lista des profs')
        }        
    }      
}
function getProfs(codeMatiere){
    
    // switch(codeMatiere){
    //     case '001': return listProfs[1] ;
    //     case '002': return listProfs[2] ;
    //     case '003': return listProfs[3]
    //     default: return listProfs[0];
    //     //case 'matiere_4':   return listProfs[2] ;           
    // }
  
}

function searchAndSetProfLibresInProfDiv(codeMatiere, periode, liste_prof_current_tranche){
    let idjour  = periode.split("DM_")[1].split("_")[0];
    let tranche = periode.split("DM_")[1].split("_")[1]+"_";

    tranche += periode.split("DM_")[1].split("_")[2];
    console.log("tranche: ",tranche)
    console.log("y Periode: ",periode);

    let listProfs     = currentUiContext.listProfs;
    let emploiDeTemps = currentUiContext.emploiDeTemps;
   
    let profLibres    = [], profOccupes = [];

    //On obtient tous les enseignants de la matiere
    let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);
    console.log("*** profsMatieres: ",profsMatieres)
    console.log("*** emploiDeTemps: ",emploiDeTemps)
    
    //On obtient toutes les entree de l'ET qui correspondent au jour la et a la tranche la
    let emploi_selected = emploiDeTemps.filter(e=>e.id_matiere==codeMatiere && e.id_jour==idjour && e.libelle==tranche);
    console.log("emploi_selected: ",emploi_selected)
   
    //Les profs occupes seront tous les profs de ces entrees la.
    for(let j=0; j<emploi_selected.length; j++){
        emploi_selected[j].id_enseignants.forEach(prof => {
            profOccupes.push(prof)
        });
    }

    // profOccupes.forEach(p => {
    //     if (!liste_prof_current_tranche.includes(p.id_enseignants))
    //     profLibres.push(p)
    // });

    liste_prof_current_tranche.forEach(p => {
       if(!profOccupes.includes(p))  profOccupes.push(p)               
    });
    
    //Les profs libres sont les autees profs de cette matiere qui ne sont pas occupes.
    profLibres = profsMatieres.filter(p=>!profOccupes.includes(p.id))


    console.log("*** profLibres: ",profLibres);
    console.log("*** profOccupes: ",profOccupes);
    console.log("*** liste_prof_cureent_tranche: ",liste_prof_current_tranche);
    initProfDivWithListProfs(profLibres);    
}

function initProfDivWithListProfs(listeProf){
    var draggableSon, draggableSonText, draggableSonImg;   
    let nb_cours = 0;
    let nb_profs = listeProf.length;
    
    clearProflist();
    
    for (var i = 0; i < nb_profs; i++) {
        nb_cours  = currentUiContext.emploiDeTemps.filter(item=>item.id_enseignants.includes(listeProf[i].id)).length;
        var heure = "heure";
        if (nb_cours==0) heure = '';
        if (nb_cours>1)  heure = "heures";

        PROF_DATA = {};
        draggableSon                  = document.getElementById('prof_' + listeProf[i].id);
        draggableSonText              = document.getElementById('prof_' + listeProf[i].id+'_sub');
        
        draggableSon.className        = classesP.profDivStyle;  
        draggableSon.title            = listeProf[i].nom+" "+listeProf[i].prenom;       
        
        draggableSonText.textContent  = listeProf[i].nom+" ("+ nb_cours+"h)";
        draggableSonText.className    = classesP.profTextSyle;            

        draggableSonImg               = document.getElementById('prof_' + listeProf[i].id + '_img');
        draggableSonImg.className     = classesP.profImgStyle;


        draggableSonImg               = document.querySelector('#prof_' + listeProf[i].id + '_img > img')

        if(listeProf[i].sexe=="F"){
            draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
           
        } else{
            draggableSonImg.setAttribute('src',"images/maleTeacher.png");
        }
        
        draggableSon.style.display     = 'block';
        draggableSonText.style.display = 'block';
        draggableSonImg.style.display  = 'block';
       
        PROF_DATA.idProf  = 'prof_' +listeProf[i].id;
        PROF_DATA.NomProf = listeProf[i].nom;
        PROF_DATA.sexe    = listeProf[i].sexe;
        
        CURRENT_PROFS_LIST.push(PROF_DATA);
        currentUiContext.setCurrentProfList(CURRENT_PROFS_LIST);
        PROF_DATA = {};                                     
    }
 
}


function getProfsList2(codeMatiere,periode,liste_prof_current_tranche){
    let idjour = periode.split("DM_")[1].split("_")[0];
    let tranche = periode.split("DM_")[1].split("_")[1]+"_";
    tranche += periode.split("DM_")[1].split("_")[2];
    console.log("tranche: ",tranche)
    console.log("y Periode: ",periode);
    let listProfs = currentUiContext.listProfs;
    let emploiDeTemps = currentUiContext.emploiDeTemps;
    var libre=true;
    let profLibres = [],profOccupes = [];
    let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);
    console.log("*** profsMatieres: ",profsMatieres)
    console.log("*** emploiDeTemps: ",emploiDeTemps)
    let emploi_selected = emploiDeTemps.filter(e=>!e.modify.includes("s")&&e.id_matiere==codeMatiere&&e.id_jour==idjour&&e.libelle==tranche);
    console.log("emploi_selected: ",emploi_selected)
    let emp;
    let idProfs =[];
    for(let j=0;j<emploi_selected.length;j++){
        emploi_selected[j].id_enseignants.forEach(prof => {
            profOccupes.push( prof)
        });
    }

    profOccupes.forEach(p => {
        if (!liste_prof_current_tranche.includes(p.id_enseignants))
        profLibres.push(p)
    });

    liste_prof_current_tranche.forEach(p => {
       if(!profOccupes.includes(p))
            profOccupes.push(p)
    });

    profLibres = profsMatieres.filter(p=>!profOccupes.includes(p.id))


    console.log("*** profLibres: ",profLibres);
    console.log("*** profOccupes: ",profOccupes);
    console.log("*** liste_prof_cureent_tranche: ",liste_prof_current_tranche);
    initProfListWithProfs2(profLibres);
}



function cancelETData() {
    if(currentClasseId!= undefined){
        
        //Initialisation de la Grille d'emploi de temps 
        clearGrille(currentUiContext.TAB_PERIODES,currentUiContext.TAB_JOURS);

        //Initialisation de la liste des profs 
        initProfList();
        currentUiContext.addProfToDroppedProfList([],-1);
        
        //Initialisation de la liste des  matieres 
        var emploiTemps = [...currentUiContext.emploiDeTemps];
        emploiTemps.map((elt)=>{
            if(elt.id_classe==currentClasseId)  elt.modify +="s";
        })
        console.log("ANNULER: ",emploiTemps)
        currentUiContext.setEmploiDeTemps(emploiTemps);
        currentUiContext.addMatiereToDroppedMatiereList([],-1);
        currentUiContext.setETDataChanged(false);        
    }

}

function createPPString(){
    var queryString ='';
    var eltString   ='';
    var tabSize =  currentUiContext.currentPPList.length;

    if(tabSize>0){
        currentUiContext.currentPPList.map((elt, index)=>{
            eltString = elt.id_classe+'*'+elt.PP_id+'*'+elt.PP_nom;
            if(tabSize == index+1) queryString = queryString + eltString;
            else queryString = queryString + eltString+'_';           
        })
    }
    return queryString;
}


function updateETHandler(emploiDetempsToUpdate){
   
    var emploiDeTemps = [];
    var ppString = createPPString();
    console.log("data ici",emploiDetempsToUpdate, ppString);

    setModalOpen(3);
    axiosInstance .post(`set-emploi-de-temps/`,{
        id_sousetab    : currentAppContext.currentEtab,
        id_user        : currentAppContext.idUser,
        emploiDeTemps  : emploiDetempsToUpdate,
        profPrincipaux : ppString 
    }).then((res)=>{
        res.data.emplois.map((em)=>{emploiDeTemps.push(em)});
        console.log(res.data.emplois);
        currentUiContext.setEmploiDeTemps(emploiDeTemps);
        setModalOpen(0);
        chosenMsgBox = MSG_SUCCESS;
        currentUiContext.showMsgBox({
            visible  : true, 
            msgType:"info", 
            msgTitle:t("success_modif_M"), 
            message:t("success_modif")
        })         
    })

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
            
            currentUiContext.setETDataChanged(true);
            return 1;
        }

        case MSG_QUESTION1: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            }) 
           
            updateETHandler(currentUiContext.emploiDeTemps);
            return 1;
        }


        case MSG_QUESTION2: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            })
            
            cancelETData();
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

        case MSG_QUESTION_PAL1: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            })             
            //currentUiContext.setIsParentMsgBox(true);
            while(CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected == true && matiere.idClasse == currentClasseId)>=0)  {
                matiereToDelete = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected == true && matiere.idClasse == currentClasseId);
                deleteEffectivelyMatiere(matiereToDelete);
            }   
            setSelectedPP({});
            setCurrentPP({});
            setIsPPset(false);

            return 1;
        }


        case MSG_QUESTION_PAL2: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            }) 
            //currentUiContext.setIsParentMsgBox(true);
            //On update l'emploi de temps avec les modifs pour suppression effective
            //currentUiContext.setEmploiDeTemps(ppemploiDeTemps);
            deleteEffectivelyProfs();
            
            setCurrentPP({});
            setSelectedPP({});
            setIsPPset(false);
            return 1;            
        }

        case MSG_SUCCESS_PAL: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            }) 
            //currentUiContext.setIsParentMsgBox(true);
            return 1;
            
        }

        case MSG_WARNING_PAL: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            })  
            //currentUiContext.setIsParentMsgBox(true);
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
        case MSG_QUESTION_PAL1: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            }) 
            // currentUiContext.setIsParentMsgBox(true);
            return 1;
        }

        case MSG_QUESTION_PAL2: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            }) 
            // currentUiContext.setIsParentMsgBox(true);
            return 1;
        }

        case MSG_SUCCESS_PAL: {
            currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            }) 
        // currentUiContext.setIsParentMsgBox(true);
            return 1;
        }

        case MSG_WARNING_PAL :{
                currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            })  
        // currentUiContext.setIsParentMsgBox(true);
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


function cancelHandler(){
    chosenMsgBox = MSG_QUESTION2;
    currentUiContext.showMsgBox({
        visible:true, 
        msgType:"question", 
        msgTitle : t("cancellation_M"),  
        message  : t("rollback_changes")
    })
}

function UpdateEmploiDeTemps(){
    chosenMsgBox = MSG_QUESTION1;
    currentUiContext.showMsgBox({
        visible:true, 
        msgType:"question", 
        msgTitle : t("confirm_M"),
        message  : t("save_changes")        
    })
}

function PrintEmploiDeTemps(){
  
    if(currentClasseId != undefined){     
        var PRINTING_DATA ={
            dateText            :'Yaounde, ' + t('le')+' '+ getTodayDate(),
            leftHeaders         : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
            centerHeaders       : [currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+'  Telephone:'+ currentAppContext.currentEtabInfos.tel],
            rightHeaders        : ["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire "+ currentAppContext.activatedYear.libelle],
            pageImages          : [imgUrl],
            pageImagesDefault   : [imgUrlDefault],
            pageTitle           : t("class_schedule") + currentClasseLabel ,
            tableHeaderModel    : ["matricule", "nom et prenom(s)", "date naissance", "lieu naissance", "enrole en", "Nom Parent", "nouveau"],
            tableData           : [],
            isClassET           : true,
            tabCreneauPause     :  currentUiContext.TAB_CRENEAU_PAUSE,
            dureePause          : currentUiContext.intervalleMaxTranche,
            valeurHoraires      : currentUiContext.TAB_VALEUR_HORAIRE,
            ListeJours          : currentUiContext.TAB_JOURS,
            ListePeriodes       : currentUiContext.TAB_PERIODES, 
            intervalleMaxTranche: currentUiContext.intervalleMaxTranche,
            numberEltPerPage    : ROWS_PER_PAGE,
            emploiDeTemps       : currentUiContext.emploiDeTemps.filter(em=>!em.modify.includes("s") && em.id_classe == currentClasseId),
            matieres            : currentUiContext.CURRENT_MATIERE_LIST,
            profs               : currentUiContext.listProfs,
            profprincipal       : (currentPP==undefined || currentPP == {}) ? '': (currentPP.sexe == 'M') ? 'Mr ' + currentPP.NomProf : 'Mme ' + currentPP.NomProf
        };
        printedETFileName = "Emplois_de_temps_("+currentClasseLabel+").pdf"    
        setModalOpen(4);
        ETPageSet={...PRINTING_DATA};
        console.log(ETPageSet);       
        
    } else{
        chosenMsgBox = MSG_WARNING;
        currentUiContext.showMsgBox({
            visible  : true, 
            msgType  : "warning", 
            msgTitle : t("warning_M"), 
            message  : t("must_select_class")
        })            
    }      
}


const closePreview =()=>{
    setModalOpen(0);
}

function distinctList(list, prop){
    console.log("tabblle", list,currentUiContext.CURRENT_DROPPED_PROFS_LIST);
    var resultList = [];
    if(list!= undefined && list.length > 0){
        list.map((elt1)=>{
            if(resultList.find((elt2)=>elt2[prop] == elt1[prop])==undefined){
                resultList.push(elt1);
            }    
        })

    }
    console.log("ABBLE", resultList);
    return resultList;
}

function getPPClasses(pp_nom){
   
    var listClasses = '('+t("no_class")+')';
    var pp_classes = [];
    console.log("Liste des PPs:", currentUiContext.currentPPList);
    TAB_PROF_PRINCIPAUX = (currentUiContext.currentPPList != undefined) ? [...currentUiContext.currentPPList]:[];
    console.log("gdgdg",TAB_PROF_PRINCIPAUX)
  
    if(TAB_PROF_PRINCIPAUX.length>0){
       pp_classes = TAB_PROF_PRINCIPAUX.filter((elt)=>elt.PP_nom == pp_nom);
       
       if(pp_classes.length>0){
            listClasses = '(PP:'; 
            pp_classes.map((elt, index)=>{
                var classeProf = optClasse.find((classe)=>classe.value == elt.id_classe);
                if(classeProf!=undefined){                
                    if(index+1 == pp_classes.length)
                        listClasses = listClasses + classeProf.label+')';
                    else
                        listClasses = listClasses + classeProf.label + ',';
                }               
            })
        }
    }
    return listClasses;    
}

function getADroppedProfSelectionCount(selectedMatiere,profId){
    var count = 0;
    var listSize,i;
  
    console.log("Matiere",selectedMatiere);
    if(selectedMatiere.length > 0){
        console.log("ichdhhdhdhProf",profId)
        listSize = selectedMatiere.length;
        i = 0;
        while(i<listSize){
            console.log("gdgdgdgdgddgopd")
            console.log("Matiere",selectedMatiere[i]);
            if(selectedMatiere[i].tabProfsID.length > 0){                
                if(selectedMatiere[i].tabProfsID.find((elt)=>elt == profId) != undefined) count++;
            }
            i++;
        }
    }   
    console.log("count",count);     
    return count;
}



function deleteEffectivelyMatiere(toDeleIndex){
    
    var DropZoneId,toDeleIndex, droppedProfId, profDropZone,idTab;  
    var AssociatedProfCount =  CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.length;

    DropZoneId =  CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].idMatiere;
    var idTab = DropZoneId.split('_');
    var index = 0;

    while(index < AssociatedProfCount){

        var matiereToDeleteProf = {...CURRENT_DROPPED_MATIERE_LIST[toDeleIndex]};
        console.log("MATIERE", matiereToDeleteProf)
        droppedProfId = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID[index];                       
        profDropZone  =  document.getElementById(droppedProfId); 
        
        var idProf    = droppedProfId.split('_')[2];                                
        var profIndex = CURRENT_DROPPED_PROFS_LIST.findIndex((elt)=>elt.idProf == droppedProfId);
        var droppedPP = CURRENT_DROPPED_PROFS_LIST.filter((elt)=>elt.idProf.split('_')[2] == idProf);
        var droppedSelectedPP = getADroppedProfSelectionCount(CURRENT_DROPPED_MATIERE_LIST.filter((elt)=>elt.isSelected==true && elt.idClasse==currentClasseId),droppedProfId);
       
        // var children = profDropZone.childNodes;   
        // for(var i = 0; i < children.length; i++){
        //     children[i].remove();
        // } 
    
        while(profDropZone.firstChild) profDropZone.removeChild(profDropZone.firstChild);

        profDropZone.remove();

        if (profDropZone.style.borderColor=='red'){
            profDropZone.style.borderStyle = null;
            profDropZone.style.borderWidth = null;
            profDropZone.style.borderColor = null;
        }       
      
        if(droppedPP.length == droppedSelectedPP){
            var nomProf = CURRENT_DROPPED_PROFS_LIST[profIndex].NomProf;
            var idPP = "prof_" + nomProf;
            console.log("prof",idPP);
            if(document.getElementById(idPP)!=null) document.getElementById(idPP).style.display="none";           
        }

        CURRENT_DROPPED_PROFS_LIST.splice(profIndex,1);                         
       
        index++;         
    }

    CURRENT_DROPPED_MATIERE_LIST.splice(toDeleIndex,1);
    document.getElementById(DropZoneId).remove(); 
    clearProflist();


    // let emploiDeTemps = currentUiContext.emploiDeTemps;
    let emp = CURRENT_EMPLOIS_DE_TEMPS.filter(e=>e.id_classe == currentClasseId &&
        e.id_jour==idTab[1]&&e.libelle==idTab[2]+"_"+idTab[3]&&e.id_matiere==matiereToDeleteProf.codeMatiere);
    let empIndex = CURRENT_EMPLOIS_DE_TEMPS.findIndex(e=>e.id_classe == currentClasseId &&
        e.id_jour==idTab[1]&&e.libelle==idTab[2]+"_"+idTab[3]&&e.id_matiere==matiereToDeleteProf.codeMatiere);
        console.log("empIndex: ",empIndex);

    if (emp.length>0){
        let empToUpdate = emp[0];
        // C'est un cours qui a été créé pendant la session courante on peut simplement le supprimer
        if(empToUpdate.modify.includes("c"))
        CURRENT_EMPLOIS_DE_TEMPS.splice(empIndex,1)                
        // Ca vient de la bd donc la suppression doit se faire en bd
        else{
            empToUpdate.modify +="s";
            CURRENT_EMPLOIS_DE_TEMPS.splice(empIndex,1,empToUpdate)
            console.log("emploiDeTemps: ",CURRENT_EMPLOIS_DE_TEMPS);
        }
    }   

}

function deleteEffectivelyProfs(){
    var DropProfId, children, profDropZone;
    var associatedMatiere, idTab, matiereIndex,profIndex, indexProf;
   

    
    var countProfs = getCountSelectedDroppedProfs();
    var idClasse  = document.getElementById("selectClasse").value;

    console.log("delete prof: ",countProfs, CURRENT_DROPPED_PROFS_LIST);

  
    while(CURRENT_DROPPED_PROFS_LIST.findIndex((prof)=>prof.isSelected == true)>=0){
        profIndex  = CURRENT_DROPPED_PROFS_LIST.findIndex((prof)=>prof.isSelected == true)
        DropProfId = CURRENT_DROPPED_PROFS_LIST[profIndex].idProf;

        var idProf    = DropProfId.split('_')[2];
        var droppedPP = CURRENT_DROPPED_PROFS_LIST.filter((elt)=>elt.idProf.split('_')[2] == idProf);
        var droppedSelectedPP = CURRENT_DROPPED_PROFS_LIST.filter((elt)=>elt.idProf.split('_')[2] == idProf && elt.isSelected == true);

        
        associatedMatiere = CURRENT_DROPPED_PROFS_LIST[profIndex].idMatiere;
        matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == associatedMatiere && matiere.idClasse == currentClasseId)
        
        if (profIndex>=0 && matiereIndex>=0){
            indexProf = CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.findIndex((prof)=> prof == DropProfId);
            
            CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.splice(indexProf,1);

            var id_matiere = CURRENT_DROPPED_MATIERE_LIST[matiereIndex].codeMatiere;
            var tab = DropProfId.split("_");
            //let emploiDeTemps = currentUiContext.emploiDeTemps;
            let emp = CURRENT_EMPLOIS_DE_TEMPS.filter(e=>e.id_classe == currentClasseId &&
                e.id_jour==tab[3]&&e.libelle==tab[4]+"_"+tab[5]&&e.id_matiere==id_matiere);
            console.log("emp: ",emp);
            let nomProf = CURRENT_DROPPED_PROFS_LIST[profIndex].NomProf[1];
            console.log("Mr"+nomProf+"%prof_"+tab[2]);
            
            // 5:10h30_11h25*2*Mr.Enseigant1 Aminata%prof_5*Mr.Censeur Censeur%prof_14
            let listProfs = currentUiContext.listProfs.filter(item=>item.id==tab[2]);
            console.log(listProfs);
            nomProf  = listProfs[0].nom+" "+listProfs[0].prenom;
            var sexe = listProfs[0].sexe;
            if(emp.length>0){
                for(let i=0;i<emp.length;i++){
                    let val =  emp[i].value;
                    console.log(val,"Mr."+nomProf+"%prof_"+tab[2]);
                    val = (sexe=='M') ? val.replace("*Mr."+nomProf+"%prof_"+tab[2],"") : val.replace("*Mme."+nomProf+"%prof_"+tab[2],"");
                    emp[i].value = val;
                    console.log(emp);
                }
                
                let empIndex =-1;
                
                empIndex=CURRENT_EMPLOIS_DE_TEMPS.findIndex(e=>e.id_classe== currentClasseId &&
                    e.id_jour==tab[3]&&e.libelle==tab[4]+"_"+tab[5]&&e.id_matiere==id_matiere);
                    console.log("empIndex: ",empIndex);
                    if(empIndex>-1){
                        CURRENT_EMPLOIS_DE_TEMPS[empIndex] = emp[0];
                        CURRENT_EMPLOIS_DE_TEMPS[empIndex].modify += "e";
                        CURRENT_EMPLOIS_DE_TEMPS[empIndex].id_enseignants.splice();
                        let idEnsIndex = -1;
                        idEnsIndex = CURRENT_EMPLOIS_DE_TEMPS[empIndex].id_enseignants.findIndex(item=>item==tab[2]);
                        console.log("idEnsIndex: ",idEnsIndex,tab[2])
                        if(idEnsIndex>-1) 
                        CURRENT_EMPLOIS_DE_TEMPS[empIndex].id_enseignants.splice(idEnsIndex,1);

                    }
                console.log("emploiDeTemps: ",CURRENT_EMPLOIS_DE_TEMPS)                     
            }
            
           
            profDropZone =  document.getElementById(DropProfId); 
            
            children = profDropZone.childNodes;   
            for(var i = 0; i < children.length; i++){
                children[i].remove();
            } 
            profDropZone.remove();
    
            if (profDropZone.style.borderColor=='red'){
                profDropZone.style.borderStyle = null;
                profDropZone.style.borderWidth = null;
                profDropZone.style.borderColor = null;
                profDropZone.className = null;
            }

            if(droppedPP.length == droppedSelectedPP.length){
                var ProfName = CURRENT_DROPPED_PROFS_LIST[profIndex].NomProf;
                var idPP = "prof_" + ProfName;
                if(document.getElementById(idPP)!=null) document.getElementById(idPP).style.display="none";
            }
                
            CURRENT_DROPPED_PROFS_LIST.splice(profIndex,1);       
        
        
        } else alert("Erreur, le prof n'est pas enregistre pour une matiere");              
    }
}





/*************************** <JSX Code> ****************************/

function Palette(props) {

    const currentUiContext = useContext(UiContext);
    const [isValid,setIsValid]=useState(false);
  
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();
  
    function getOngletProfStyle()
    { // Choix du theme courant
        if(currentUiContext.isMatiereEnable){
            switch(selectedTheme){
                case 'Theme1': return classesPal.paletteContainerP + ' '+ classesPal.Theme1_Btnstyle +' buttonDefault ';
                case 'Theme2': return classesPal.paletteContainerP + ' '+ classesPal.Theme2_Btnstyle +' buttonDefault ';
                case 'Theme3': return classesPal.paletteContainerP + ' '+ classesPal.Theme3_Btnstyle +' buttonDefault ';
                default: return classesPal.paletteContainerP + ' '+ classesPal.Theme3_Btnstyle +' buttonDefault ';
            }
        } else {
            switch(selectedTheme){
                case 'Theme1': return classesPal.paletteContainerP + ' '+ classesPal.Theme1_Btnstyle +' buttonDefault Theme1_active';
                case 'Theme2': return classesPal.paletteContainerP + ' '+ classesPal.Theme2_Btnstyle +' buttonDefault Theme2_active';
                case 'Theme3': return classesPal.paletteContainerP + ' '+ classesPal.Theme3_Btnstyle +' buttonDefault Theme3_active';
                      default: return classesPal.paletteContainerP + ' '+ classesPal.Theme3_Btnstyle +' buttonDefault Theme1_active';
            }

        }
       
    }

    function getOngletMatiereStyle()
    { // Choix du theme courant
        if(currentUiContext.isMatiereEnable){
            switch(selectedTheme){
                case 'Theme1': return classesPal.paletteContainerP + ' '+ classesPal.Theme1_Btnstyle +' buttonDefault Theme1_active';
                case 'Theme2': return classesPal.paletteContainerP + ' '+ classesPal.Theme2_Btnstyle +' buttonDefault Theme2_active';
                case 'Theme3': return classesPal.paletteContainerP + ' '+ classesPal.Theme3_Btnstyle +' buttonDefault Theme3_active';
                      default: return classesPal.paletteContainerP + ' '+ classesPal.Theme3_Btnstyle +' buttonDefault Theme1_active';
            }
           
        } else {
            switch(selectedTheme){
                case 'Theme1': return classesPal.paletteContainerP + ' '+ classesPal.Theme1_Btnstyle +' buttonDefault ';
                case 'Theme2': return classesPal.paletteContainerP + ' '+ classesPal.Theme2_Btnstyle +' buttonDefault ';
                case 'Theme3': return classesPal.paletteContainerP + ' '+ classesPal.Theme3_Btnstyle +' buttonDefault ';
                      default: return classesPal.paletteContainerP + ' '+ classesPal.Theme3_Btnstyle +' buttonDefault ';
            }
        }       
    }

    function deleteElements(){
        CURRENT_DROPPED_MATIERE_LIST = currentUiContext.CURRENT_DROPPED_MATIERE_LIST;
        CURRENT_DROPPED_PROFS_LIST   = currentUiContext.CURRENT_DROPPED_PROFS_LIST;
        CURRENT_EMPLOIS_DE_TEMPS     = currentUiContext.emploiDeTemps;
        
        console.log("CURRENT_DROPPED_MATIERE_LIST: ",CURRENT_DROPPED_MATIERE_LIST);
        console.log("CURRENT_DROPPED_PROFS_LIST: ",CURRENT_DROPPED_PROFS_LIST);
        
        deleteMatiere();
        deleteProf();
        
        currentUiContext.addMatiereToDroppedMatiereList(CURRENT_DROPPED_MATIERE_LIST,-1);
        currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST,-1);
        currentUiContext.setEmploiDeTemps(CURRENT_EMPLOIS_DE_TEMPS);
    }

    function getCountSelectedDroppedMatieres(){
        var count = 0;
        for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
            if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
        }
        return count;
    }
    
    function isProfPrincipal(idprof,classeId){
        var pp = currentUiContext.currentPPList.find((elt)=>(elt.PP_id == idprof && elt.id_classe == classeId))
        if(pp!=undefined) return true;
        else return false;
    }


    function existProfPrincipal(listProfIDs, idClasse){
        var existPP = -1;
        if(listProfIDs.length > 0){
            var countPP = listProfIDs.length;
            var i = 0;
            while(i < countPP && existPP==-1){
                if (isProfPrincipal(listProfIDs[i].split('_')[2], idClasse)) existPP=i;
                i++;
            }
        }
        return existPP;
    }
    
    
    function deleteMatiere () {

        var toDeleIndex;
        var tabPos;  
        var idClasse  = document.getElementById("selectClasse").value;  

        var deleteContinu = true;
        
        //Obtenir la liste des classe selectionnees
        var selectedMatieres = CURRENT_DROPPED_MATIERE_LIST.filter((matiere)=>matiere.isSelected == true && matiere.idClasse == currentClasseId);
        
        //Obtenir la taille de cette liste
        var countMatiere = selectedMatieres.length;
        
        //On n'a pas encore trouve
        var PPExistIndex = -1;
        
        //parcourir cette liste et pour chaque matiere voir si les prof associe est pp
        tabPos = 0; 
        while(tabPos < countMatiere && PPExistIndex==-1){            
            PPExistIndex = existProfPrincipal(selectedMatieres[tabPos].tabProfsID, idClasse);
            tabPos++;
        }

        if(PPExistIndex >= 0){                        
            var dProfId = selectedMatieres[tabPos-1].tabProfsID[PPExistIndex];
            var idProf    = dProfId.split('_')[2];
            var droppedPP = CURRENT_DROPPED_PROFS_LIST.filter((elt)=>elt.idProf.split('_')[2] == idProf);
            var droppedSelectedPP = getADroppedProfSelectionCount(selectedMatieres,dProfId);
            
            if(droppedPP.length == droppedSelectedPP){
                deleteContinu = false;
                chosenMsgBox  = MSG_QUESTION_PAL1;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"question", 
                    msgTitle:t("confirm_M"),
                    message:t("delete_pp_question")
                })   

            }                            
        
        }

        if(deleteContinu){
            toDeleIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected == true && matiere.idClasse == currentClasseId);

            while(toDeleIndex>=0)  {
                deleteEffectivelyMatiere(toDeleIndex);
                toDeleIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected == true && matiere.idClasse == currentClasseId);
                
            }

        }

       
       
        
        // tabPos = 0;       

        // while(tabPos<countMatiere){
        //     toDeleIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected == true);
        //     if(toDeleIndex >= 0)  deleteEffectivelyMatiere(toDeleIndex);
        //     tabPos++;             
        // }

        //if(countMatiere>0) clearProflist();  
    }

    
   
    

    function clearPPList(){
        var parentDiv = document.getElementById("profsList2");
        var childDiv = undefined
        while(parentDiv.firstChild){
            childDiv = parentDiv.firstChild;
            parentDiv.removeChild(parentDiv.firstChild);
        } 
    }

   
    
    function deleteProf(){      
        
        var countProfs = getCountSelectedDroppedProfs();
        var idClasse  = document.getElementById("selectClasse").value;
       
        if (countProfs >0) {
            //verifier s'il y a un prof principal dedans qui est tel que en le supprimant, 
            //il ne restera plus de profs.
            var listProf = [];
            CURRENT_DROPPED_PROFS_LIST.map((elt)=>listProf.push(elt.idProf));
            var PPExistIndex = existProfPrincipal(listProf, idClasse);           
           
            if(PPExistIndex >= 0){
                var DropProfId = CURRENT_DROPPED_PROFS_LIST[PPExistIndex].idProf;
                var idProf     = DropProfId.split('_')[2];                    
                var droppedPP = CURRENT_DROPPED_PROFS_LIST.filter((elt)=>elt.idProf.split('_')[2] == idProf);
                var droppedSelectedPP = CURRENT_DROPPED_PROFS_LIST.filter((elt)=>elt.idProf.split('_')[2] == idProf && elt.isSelected == true);
                
                if(droppedPP.length == droppedSelectedPP.length){
                    chosenMsgBox = MSG_QUESTION_PAL2;
                    currentUiContext.showMsgBox({
                        visible  : true, 
                        msgType  : "question", 
                        msgTitle : t("question_M"),
                        message  : t("delete_pp_question")
                    }) 
                } else deleteEffectivelyProfs();

            } else deleteEffectivelyProfs();
        }
    }
    
    // function clearProflist(){
    //     let listProfs = currentUiContext.listProfs;
    //     var draggableSon, draggableSonText, draggableSonImg;
    //     var PROFLIST_MAXSIZE =listProfs.length;
    //     for (var i = 0; i < PROFLIST_MAXSIZE; i++) {
    //         draggableSon =  document.getElementById('prof_' + listProfs[i].id);
    //         draggableSonText = document.getElementById('prof_' + listProfs[i].id+'_sub');
        
    //         draggableSon.className = null;
    //         draggableSon.title = '';
    //         draggableSonText.textContent ='';
    //         draggableSonText.className = null;

    //         draggableSonImg =  document.getElementById('prof_' + listProfs[i].id + '_img');
    //         draggableSonImg.className = null;

    //         draggableSonImg = document.querySelector('#prof_' + listProfs[i].id + '_img > img');
    //         draggableSonImg.style.display = 'none';
    //     } 
    //     CURRENT_PROFS_LIST = [];
    // }

    function clearProflist(){
        var draggableSon, draggableSonText, draggableSonImg;   
        currentUiContext.listProfs.map((prof,index)=>{
            draggableSon                  = document.getElementById('prof_' + prof.id);
            draggableSonText              = document.getElementById('prof_' + prof.id+'_sub');
            draggableSonImg               = document.getElementById('prof_' + prof.id + '_img');      
            draggableSonImg               = document.querySelector('#prof_' + prof.id + '_img > img');
    
            draggableSon.style.display     = 'none';
            draggableSonText.style.display = 'none';
            draggableSonImg.style.display  = 'none';
        }) 
        CURRENT_PROFS_LIST = [];
    }
    

    function getCountSelectedDroppedProfs(){
        var count = 0;
        var nb = CURRENT_DROPPED_PROFS_LIST.length;
        for(let i=0 ; i<nb; i++){
            if(CURRENT_DROPPED_PROFS_LIST[i].isSelected==true) count++;
        }
        return count;
    }

    function getProfsList2(codeMatiere)
    {   console.log("codeMatiere: ",codeMatiere);
        var libre=true;
        let listProfs = currentUiContext.listProfs;
        let emploiDeTemps = currentUiContext.emploiDeTemps
        let profLibres = [];
        let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);
        console.log("*** listProfs: ",listProfs)
        for(let i=0;i<profsMatieres.length;i++){
            libre = true;
            for(let j=0;j<emploiDeTemps.length;j++){
                if(emploiDeTemps[j].id_enseignants.includes(profsMatieres[i].id)){
                    // console.log("==EGALITE  emploiDeTemps[j]: ",emploiDeTemps[j],"profsMatieres[i]: ",profsMatieres[i],emploiDeTemps[j].id_enseignants.includes(profsMatieres[i].id))
                    libre=false;
                    break;
                }
            }
            if (libre) profLibres.push(profsMatieres[i])
        }
        console.log("*** profLibres: ",profLibres)
        // profList = getProfs(codeMatiere)
        // tabProfs = profList.split('_');
        // initProfListWithProfs2(profsMatieres);
        initProfListWithProfs2(profLibres);
    
    }
    function initProfListWithProfs2(){
        var parent = document.getElementById('profList');
        var draggableSon, draggableSonText, draggableSonImg;
        let listeProf = currentUiContext.listeProf;
        clearProflist();
        //alert(listeProf);
      
        for (var i = 0; i < listeProf.length; i++) {
            PROF_DATA = {};
            draggableSon =  document.getElementById('prof_' + listeProf[i].id);
            draggableSonText = document.getElementById('prof_' + listeProf[i].id+'_sub');
            
            draggableSon.className = classesP.profDivStyle;  
            draggableSon.title = listeProf[i].nom+" "+listeProf[i].prenom;       
            
            draggableSonText.textContent = listeProf[i].nom;
            draggableSonText.className = classesP.profTextSyle;            
    
            draggableSonImg =  document.getElementById('prof_' + listeProf[i].id + '_img');
            draggableSonImg.className = classesP.profImgStyle;
    
            draggableSonImg = document.querySelector('#prof_' + listeProf[i].id + '_img > img')
    
            draggableSonImg.setAttribute('src',"images/maleTeacher.png");
    
            // if(listeProf[i].includes('Mr.')) {
            //     draggableSonImg.setAttribute('src',"images/maleTeacher.png");
            // }else{
            //     draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
            // }
            
            
            PROF_DATA.idProf = 'prof_' +listeProf[i].id;
            PROF_DATA.NomProf = listeProf[i].nom;
            
            CURRENT_PROFS_LIST.push(PROF_DATA);
            PROF_DATA = {};                                     
        }
     
    }

    
    function enableMatieresList(){
        currentUiContext.setIsMatiereEnable(true);
    }

    
    function initMatiereList(listeMatieres){
        var CURRENT_MATIERE_LIST=[];
        console.log("listeMatieres: ",listeMatieres)
      
        var MATIERE_DATA ={}
        var parent, draggableSon;
        var tabMatiere =[];
        
        for (var i = 0; i < listeMatieres.length; i++) {
            
            tabMatiere = listeMatieres[i].split('*');
            parent =  document.getElementById('matiere_' + tabMatiere[1]);
            draggableSon = document.getElementById('matiere_' + tabMatiere[1]+'_sub');
            parent.className = classes.matiereStyle; 
            
            // parent.style.backgroundColor=COLORS[colorIndexes[i]];  
            parent.style.backgroundColor=tabMatiere[2];  
            parent.title = tabMatiere[0];
            
            MATIERE_DATA = {};
            MATIERE_DATA.idMatiere = 'matiere_' + tabMatiere[1];
            MATIERE_DATA.libelleMatiere = tabMatiere[0];
            MATIERE_DATA.codeMatiere = tabMatiere[1];
           
            MATIERE_DATA.colorCode = tabMatiere[2];
            
            CURRENT_MATIERE_LIST[i] = MATIERE_DATA;
            
            draggableSon.textContent = tabMatiere[0];
            draggableSon.className = classes.matiereTitleStyle;                     
                  
        }
        MATIERE_DATA = {};
        console.log('matieres',CURRENT_MATIERE_LIST);
        currentUiContext.setCURRENT_MATIERE_LIST(CURRENT_MATIERE_LIST);
    }

    function enableprofsList(){
        currentUiContext.setIsMatiereEnable(false);
    }
   
    return (    
        <div style={{display:'flex', flexDirection:'column'}}> 
            <div className={classesPal.paletteContainer} style={{marginBottom:'2vh'}}> 
                <div className={classesPal.buttonContainer}>
                    <CustomButton
                        btnText=''
                        buttonStyle={classesPal.buttonStyle}
                        //btnTextStyle = {classes.btnTextStyleX}
                        hasIconImg= {true}
                        imgSrc='images/delete.png'
                        imgStyle = {classesPal.imgStyle}
                        btnClickHandler={deleteElements}
                    />           
                </div>
            </div>

            <CustomButton  
                id='matieresPalette'
                btnText=' Matieres'
                hasIconImg= {false}
                buttonStyle={getOngletMatiereStyle()}
                style={{marginBottom:'1.3vh'}}
                btnClickHandler={enableMatieresList}
                btnTextStyle={classesPal.ongletTexte}                                                   
            />

            <CustomButton 
                id='profPrincipalPalette' 
                btnText=' Principal'
                hasIconImg= {false}
                buttonStyle={getOngletProfStyle()}
                btnClickHandler={enableprofsList}
                btnTextStyle={classesPal.ongletTexte} 
                disable={(currentUiContext.CURRENT_DROPPED_PROFS_LIST.length == 0)}                                                   
            />  
        </div> 
       
    );
}



function LigneMatieres(props) {
  
   return (
        <div style={{display:'flex', flexDirection:'row'}}>
            <div className={classes.matiereTitle} style={{marginLeft:'-2.7vw'}}>{t('matieres')}</div>
            <div id='matieres' className={classes.listeMatieres + ' matieres'}>
                {(listMatieres||[]).map((matiere) => {
                    return (
                        <MatiereDiv id={"matiere_"+matiere.split('*')[1]}
                            title = {matiere.split('*')[0]}
                            dragDivClassName  = {classes.matiereStyle} 
                            matiereTitleStyle = {classes.matiereTitleStyle} 
                            dropDivClassName  = {null}
                            style={{backgroundColor:matiere.split('*')[2]}}
                           
                        >
                            {matiere.split('*')[0]} 
                        </MatiereDiv>
                    );
                })} 
                  
            </div>       

        </div>
        
    );
}

function LigneProfPrincipal(props) {
  
    const currentUiContext = useContext(UiContext);
    const { t, i18n } = useTranslation();

    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classesPP.Theme1_BtnstyleSmall ;
        case 'Theme2': return classesPP.Theme2_BtnstyleSmall ;
        case 'Theme3': return classesPP.Theme3_BtnstyleSmall ;
        default: return classesPP.Theme1_BtnstyleSmall ;
      }
    }


    return (
        <div style={{display:'flex', flexDirection:'row'}}>

            <div className={classes.profTitle} style={{marginLeft:'-3vw'}}>{t('enseignants')}</div>
            <div id='profsList1' style={{display:'flex', flexDirection:'row', alignItems:'center', borderStyle:'solid', borderWidth:'1.7px',paddingLeft:'0.5vw',borderRadius:'4px', width:'65vw', height:"5.7vw", /*position:'absolute'*/}}>
               
                <div id= "profsList2" style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', overflowX:'scroll', width:'87%'}}>
                    {distinctList(currentUiContext.CURRENT_DROPPED_PROFS_LIST,"NomProf").map((prof) => {
                        return (
                                <div id ={"prof_" + prof.NomProf} style={{display:'flex', flexDirection:'column', marginLeft:'1vw'}}> 
                                    <div style={{display:'flex', flexDirection:'row'}}> 
                                        <input id ={prof.NomProf} type='radio' name='ppsList' checked={selectedPP!=undefined && selectedPP.NomProf==prof.NomProf} onClick={getSelectedProf}/>
                                        <img  src = {prof.sexe=='M'? "images/maleTeacher.png" : "images/femaleTeacher.png"} style={{width:'2vw'}}/>
                                    </div>
                                    
                                    <div style={{display:'flex', flexDirection:'column'}}> 
                                        <div style={{fontSize:'0.9vw'}}>{prof.NomProf}</div>
                                        <div style={{fontSize:'0.79vw', textAlign:'center', marginTop:'-0.77vh',/*color:'red'*/ color:'#3a5da1',fontWeight:'bold'}}>{getPPClasses(prof.NomProf)}</div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                 

                <CustomButton
                    id = {"addEleve"}
                    btnText={t("def_as_principal")}
                    buttonStyle={getSmallButtonStyle()}
                    style={{marginBottom:'-0.3vh'}}
                    btnTextStyle = {classesPP.btnSmallTextStyle}
                    btnClickHandler={validerPP}
                />
            </div>
            
        </div>       
    );
}




    return (              
       <DndProvider backend={isMobile? TouchBackend: HTML5Backend} options= {isMobile ? {enableTouchEvents: true, enableMouseEvents: false,  delayTouchStart:5000}:null}>
            {(currentUiContext.TAB_JOURS.length>0) ?
                <div className={classes.formET} >
                    {(modalOpen!=0) && <BackDrop/>}
                    {(modalOpen==4) && 
                        <PDFTemplate previewCloseHandler={closePreview}>
                            {isMobile?
                                <PDFDownloadLink  document ={<ETTemplate pageSet={ETPageSet}/>} fileName={printedETFileName}>
                                    {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                                </PDFDownloadLink>
                                :
                                <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                                    <ETTemplate pageSet={ETPageSet}/>
                                </PDFViewer>
                            }
                        </PDFTemplate>
                    }  
                   
                    <div className={classes.formTitle +' '+classes.margBottom3}>
                        {t('schedule_creation_M')} 
                    </div>   
                   
                    {(currentUiContext.msgBox.visible == true)  && <BackDrop/>}
                    {(currentUiContext.msgBox.visible == true) &&
                        <MsgBox 
                            msgTitle = {currentUiContext.msgBox.msgTitle} 
                            msgType  = {currentUiContext.msgBox.msgType} 
                            message  = {currentUiContext.msgBox.message} 
                            customImg ={true}
                            customStyle={true}
                            contentStyle={classes.msgContent}
                            imgStyle={classes.msgBoxImgStyleP}
                            buttonAcceptText = {(currentUiContext.msgBox.msgType == "question") ? t("yes"):t("ok")}
                            buttonRejectText = {t("no")}  
                            buttonAcceptHandler = {acceptHandler}  
                            buttonRejectHandler = {rejectHandler}            
                        />                 
                    }

                    {(modalOpen==3) &&
                        <div style={{ alignSelf: 'center',position:'absolute',  fontSize:'0.9vw', fontWeight:'bolder', color:'#fffbfb', zIndex:'1207',marginTop:'-5.7vh'}}> 
                            {t('loading')}...
                        </div>                    
                    }
                    {(modalOpen==3) &&
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
                            backgroundColor: 'white',
                            zIndex: '1200',
                            overflow: 'hidden'
                        }}
                        >
                            <img src='images/Loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
                        </div>                    
                    }
                      
                    <div className={classes.inputRow}>
                        <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                            {t('class_M')}:                       
                        </div>
                        <div>
                            <select id='selectClasse' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>
                        </div>     
                        {isPPset && currentPP!={} &&currentPP!=undefined &&
                            <div className={classes.bold+ ' '+classes.fontSize1} style={{marginLeft:"1.3vw",alignSelf:'center'}}>
                                {t('principal_M')} :                        
                            </div>
                        }
                        {isPPset && currentPP!={} &&currentPP!=undefined &&
                            <div  className= {classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center', color:'#3a5da1'}}>
                                {currentPP.sexe =='M' ? ' Mr '+ currentPP.NomProf :' Mme '+ currentPP.NomProf}
                            </div>   
                        }          
                    </div>  
               
                
               
                    <div className={classes.fullSchedule}>
                      
                        <div className={classes.PalettePosition}>
                            <Palette/>
                        </div>

                        <div style={{display:'flex', flexDirection:'row',justifyContent:'center'}}>
                            <div className={classes.grilleEtMatiere}> 
                                <div className={classes.grille}>

                                    <LigneValeur/>

                                    {(currentUiContext.TAB_JOURS).map((jour,indjour) => {
                                        return (
                                        
                                            <div id={jour.id} className={jour.numero_jour==1 ? classes.ligneDebut :jour.numero_jour==6? classes.ligneFin : classes.ligne}> 
                                                <Jour jourName={t(jour.libelle)}/>
                                                {currentUiContext.TAB_PERIODES.map((periode,index) => {
                                                    return (
                                                        (periode.duree.includes('B_'))?
                                                        <div className={classes.DroppableZone} style={{width:computePauseDivSize(calculDureePause(periode.duree.substring(2)))+'vw'}}>
                                                            <div className={classes.pauseZone}/>
                                                        </div>
                                                        :
                                                        currentUiContext.TAB_JOURS[indjour].tranches[index]==1?
                                                            <div className={classes.DroppableZone} style={{width:computePauseDivSize(calculDureePause(periode.duree))+'vw'}}>
                                                                <DroppableDiv
                                                                    id={jour.id+'_'+periode.duree}
                                                                    acceptType='matiere'
                                                                    CurrentMatiereList = {props.CurrentMatiereList}
                                                                    // listProfs = {currentUiContext.listProfs}
                                                                    className={classes.droppableDivstyle}
                                                                    style={{marginLeft:calculMarge(periode.duree.substring(2))+'vw', }}
                                                                />                                                                                                           
                                                            
                                                                <DroppableDiv
                                                                    id={'P_'+jour.id+'_'+periode.duree}
                                                                    acceptType='profImage'
                                                                    CurrentMatiereList = {props.CurrentMatiereList}
                                                                    className={classes.ProfDroppableDivstyle}
                                                                />
                                                            </div>
                                                        :
                                                            <div className={classes.DroppableZone} style={{width:computePauseDivSize(calculDureePause(periode.duree))+'vw'}}>
                                                                <div className={classes.pauseZone}/>
                                                            </div>
                                                        
                                                        );
                                                    })
                                                } 
                                            </div>
                                        );
                                    })}                         
                            
                                </div> 
                                {
                                    currentUiContext.isMatiereEnable ?

                                    <LigneMatieres/>
                                    :
                                    <LigneProfPrincipal/>                               
                                }
                                
                                
                            </div>

                         
                            <div className={classes.profSelect}>
                                <div className={classes.profListTitle}> {t('enseignants')}</div>
                                <LigneProfs/>
                            </div> 
                            

                        </div>
                    
                   
                    </div>
               


                <div className={classes.buttonRow}>
                  
                    <CustomButton
                        btnText={t('cancel')}  
                        buttonStyle={getButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={cancelHandler}
                    />

                    <CustomButton
                        btnText={t('save')} 
                        buttonStyle={getButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={UpdateEmploiDeTemps}
                        disable={(currentUiContext.ETDataChanged==false)}
                        // disable={(currentUiContext.CURRENT_DROPPED_MATIERE_LIST.length == 0)}
                    />

                    <CustomButton
                        btnText={t('imprimer')}
                        buttonStyle={getButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={PrintEmploiDeTemps}
                        //disable={(isValid==false)}
                    />
                    
                </div>
            </div>
            :
                <div className={classes.formET} style={{alignItems:"center", width:'100%', height:'100%', backgroundColor:"white"}}>
                    <img src='images/Loading_icon.gif' alt="loading..." />
                </div>
            }
        </DndProvider>
    
    );
}

export default GrilleEmploiTemps;