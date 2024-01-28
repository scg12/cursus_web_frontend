import React from "react";
import ReactDOM from 'react-dom';
import { useTranslation } from "react-i18next";
import MenuItemListP from '../../layout/cs_layout/menuItemList/MenuItemListP';
import classes from './DashBoardPage.module.css';
import M_classes from './M_DashBoardPage.module.css';
import MenuItemP from '../../layout/cs_layout/menuItem/MenuItemP';
import M from 'materialize-css';
import {isMobile} from 'react-device-detect';

import { useState, useEffect, useContext } from "react";
import UiContext from '../../../store/UiContext';
import AppContext from "../../../store/AppContext";

import FormLayout from "../../layout/cs_layout/formLayout/FormLayout";
import CahierDeTexte from "../scolarite/subPages/CahierDeTexte";

import ProgramCoverNiveau from './subPages/ProgramCover/ProgramCoverNiveau';
import ProgramCoverClass  from './subPages/ProgramCover/ProgramCoverClass';
import ProgramCoverMatiere from './subPages/ProgramCover/ProgramCoverMatiere';

import Effectifs from './subPages/effectifs/Effectifs';
import Frais from './subPages/frais/Frais';
import Assiduite from './subPages/assiduite/Assiduite';
import Resultats from './subPages/resultats/Resultats';
import MatiereProgress from './subPages/ProgramCover/MatiereProgress';

import axiosInstance from '../../../axios';
import axios from 'axios';

var groupWidth;
// var idClasseProgress = 0;

function DashBoardPage() {
      
  const { t, i18n } = useTranslation();
  const currentUiContext = useContext(UiContext);
  const currentAppContext = useContext(AppContext);
  
  //Cette constante sera lu lors de la configuration de l'utilisateur.
  const selectedTheme = currentUiContext.theme;
 //const [curentMenuItemPId,setMenuItemPId]=useState(10);
 
  const [optNiveauPC, setOptNiveauPC] = useState([{value:0, label:"  Tous  "}]);
  const [optClassePC, setOptClassePC] = useState([{value:0, label:"  Toutes  "}]);
  const [optMatieresPC, setOptMatieresPC] = useState([{value:0, label:"  Toutes  "}]);

  const [optNiveauEFF, setOptNiveauEFF] = useState([{value:0, label:"  Tous  "}]);
  const [optClasseEFF, setOptClasseEFF] = useState([{value:0, label:"  Toutes  "}]);
  const [optMatieresEFF, setOptMatieresEFF] = useState([{value:0, label:"  Toutes  "}]);

  const [optNiveauFR, setOptNiveauFR] = useState([{value:0, label:"  Tous  "}]);
  const [optClasseFR, setOptClasseFR] = useState([{value:0, label:"  Toutes  "}]);
  const [optMatieresFR, setOptMatieresFR] = useState([{value:0, label:"  Toutes  "}]);

  const [optNiveauASS, setOptNiveauASS] = useState([{value:0, label:"  Tous  "}]);
  const [optClasseASS, setOptClasseASS] = useState([{value:0, label:"  Toutes  "}]);
  const [optMatieresASS, setOptMatieresASS] = useState([{value:0, label:"  Toutes  "}]);

  const [optNiveauRES, setOptNiveauRES] = useState([{value:0, label:"  Tous  "}]);
  const [optClasseRES, setOptClasseRES] = useState([{value:0, label:"  Toutes  "}]);
  const [optMatieresRES, setOptMatieresRES] = useState([{value:0, label:"  Toutes  "}]);


  const [prgramCoverSelectedLevel, setPrgramCoverSelectedLevel]   = useState({label:'Tous'  , id:0});
  const [prgramCoverSelectedClass, setPrgramCoverSelectedClass]   = useState({label:'Toutes', id:0});
  const [progCoverSelectedMatiere, setPrgramCoverSelectedMatiere] = useState({label:'Toutes', id:0});

  
  const [isInscritLevelChart, setIsInscritLevelChart] = useState(false);
  const [isInscritClassChart, setIsInscritClassChart] = useState(false);
  
  const [isFraisScolaireLevel, setIsFraisScolaireLevel] = useState(false);
  const [isFraisScolaireClass, setIsFraisScolaireClass] = useState(false);
 
  
  const [effectifLevel, setEffectifLevel]       = useState({'id':'0','label':"Tous"});
  const [effectifClass, setEffectifClass]       = useState({'id':'0','label':"Toutes"});
  const [effectifLevelFrais, setEffectifLevelFrais]       = useState({'id':'0','label':"Tous"});
  const [effectifClassFrais, setEffectifClassFrais]       = useState({'id':'0','label':"Toutes"});

  const [assiduiteLevel, setAssiduiteLevel]     = useState({label:'Tous', id:0});
  const [assiduiteClass, setAssiduiteClass]     = useState({label:'Toutes', id:0});
  const [assiduiteMatiere, setAssiduiteMatiere] = useState({label:'Toutes', id:0});

  const [resultatLevel, setResultatLevel]       = useState({'id':'0','label':"Tous"});
  const [resultatClass, setResultatClass]       = useState({'id':'0','label':"Tous"});
  const [resultatMatiere, setResultatMatiere]   = useState({'id':'0','label':"Tous"});
  // const [resultatLevel, setResultatLevel]       = useState(1);
  // const [resultatClass, setResultatClass]       = useState(1);
  // const [resultatMatiere, setResultatMatiere]   = useState(1);


    const [DoughnutData, setDoughnutData] = useState([100,0]);
    const [BarchartData, setBarChartData] = useState([0,0,0]);
    const [LabelsFrais, setLabelsFrais] = useState([]);
    const [LabelsResult, setLabelsResult] = useState([]);
    const [LabelsFraisClasse, setLabelsFraisClasse] = useState([]);
    const [BarchartDataFrais, setBarChartDataFrais] = useState([]);
    const [BarchartDataResultNiveau, setBarChartDataResultNiveau] = useState([]);
    const [BarchartDataResultClasse, setBarChartDataResultClasse] = useState([]);
    const [BarchartDataResultMatiere, setBarChartDataResultMatiere] = useState([]);
    const [BarchartClasseData, setBarChartClasseData] = useState([0,0,0]);
    const [BarchartClasseDataFrais, setBarChartClasseDataFrais] = useState([]);
    const [barchartDataLabels, setBarchartDataLabels] = useState([]);
    const [barchartDataValues, setBarchartDataValues] = useState([]);
    const [listMatieresProgress, setListMatieresProgress] = useState("");
    const [ouvertureCahierTexte,setOuvertureCahierTexte] =useState(false);
    const [idGroupeMatieres,setIdGroupeMatieres] = useState([]);
    const [DoughnutDataAssiduiteNiveau, setDoughnutDataAssiduiteNiveau] = useState([])
    const [DoughnutDataAssiduiteClasse, setDoughnutDataAssiduiteClasse] = useState([])
    const [DoughnutDataAssiduiteMatiere, setDoughnutDataAssiduiteMatiere] = useState([])
    const [sanctionLabels,setSanctionLabels] = useState([])
    const [absenceLabels,setAbsenceLabels] = useState([])
    // const [typeGroupeMatieres,setTypeGroupeMatieres] = useState("");
    const [niveau_effectif_selected, setNiveau_effectif_selected] = useState('0');
    const [classe_effectif_selected, setClasse_effectif_selected] = useState('0');

    const axiosInstance2 = axios.create({
      baseURL: '',
      timeout: 50000,
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      }, 
    });
    ;
    var curentClass = {'id':'0','label':"Toutes"};
    var curentMatiere = {'id':'0','label':"Toutes"};


  useEffect(()=> {
    var tabNiveaux  = [...getEtabNiveaux(currentAppContext.currentEtab)];
    var tabClasses  = [... getEtabClassesNiveau(currentAppContext.currentEtab, 0)];
    var tabMatieres = [... getEtabMatieresClasse(currentAppContext.currentEtab, 0)];

  


    console.log('tetete',tabClasses);
    //------- Niveau ---------
    setOptNiveauPC(tabNiveaux);
    setOptNiveauEFF(tabNiveaux);
    setOptNiveauFR(tabNiveaux);
    setOptNiveauASS(tabNiveaux);
    setOptNiveauRES(tabNiveaux);

    //------- Classes ---------
    setOptClassePC(tabClasses);
    setOptClasseEFF(tabClasses);
    setOptClasseFR(tabClasses);
    setOptClasseRES(tabClasses);

    //------- Classes ---------
    setOptMatieresPC(tabMatieres);
    setOptMatieresASS(tabMatieres);
    setOptMatieresRES(tabMatieres);

    init();  
    
    startnotifMotion();
    
  },[]);

  function startnotifMotion(){
    var notifZone = document.getElementById("notifZone"); 

    if(notifZone.classList.contains('notifFrom')){
        notifZone.classList.remove('notifFrom');
    }
    
    if(!notifZone.classList.contains('moveNotifToTop')){
        notifZone.classList.add('moveNotifToTop');
    }

    if(!notifZone.classList.contains('notifTo')){
        notifZone.classList.add('notifTo');
    }
  }


  function getCurrentContaintTheme()
  { // Choix du theme courant

    if(isMobile){
      switch(selectedTheme){
        case 'Theme1': return M_classes.Theme1_mainContentPosition ;
        case 'Theme2': return M_classes.Theme2_mainContentPosition ;
        case 'Theme3': return M_classes.Theme3_mainContentPosition ;
        default: return M_classes.Theme1_mainContentPosition ;
      }

    } else {
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_mainContentPosition ;
        case 'Theme2': return classes.Theme2_mainContentPosition ;
        case 'Theme3': return classes.Theme3_mainContentPosition ;
        default: return classes.Theme1_mainContentPosition ;
      }

    }
    
  }

 function getSectionBgClr()
  {  // Choix du theme courant
     switch(selectedTheme){
          case 'Theme1': return classes.Theme1_sectionBg ;
          case 'Theme2': return classes.Theme2_sectionBg ;
          case 'Theme3': return classes.Theme3_sectionBg ;
          default: return classes.Theme1_sectionBg ;
      }
  }

  function getEtabNiveaux(sousEtabId){
    var tempTable=[{value: 0,      label: (i18n.language=='fr') ? ' Tous ' : ' All '  }]
    var sousEtabNiveau =  currentAppContext.infoNiveaux.filter((niveau)=>niveau.id_setab == sousEtabId)

    sousEtabNiveau.map((niveau)=>{
      tempTable.push({value:niveau.id_niveau, label:niveau.libelle});
    });

    console.log('oiiii', currentAppContext.infoClasses);     
    return(tempTable);
  }

  function getEtabClassesNiveau(sousEtabId, niveauId){
    var tempTable=[{value: 0,      label: (i18n.language=='fr') ? ' Toutes ' : ' All '  }]
    var tabClasses
     
    if(niveauId == 0) {
      tabClasses =  currentAppContext.infoClasses.filter((classe)=>classe.id_setab == sousEtabId)
      tabClasses.map((classe)=>{
      tempTable.push({value:classe.id_classe, label:classe.libelle});
      });
    } else {
      tabClasses =  currentAppContext.infoClasses.filter((classe)=>classe.id_setab == sousEtabId && classe.id_niveau == niveauId )
      tabClasses.map((classe)=>{
        tempTable.push({value:classe.id_classe, label:classe.libelle});
      });   

    }
    return(tempTable);
  }

  function getEtabMatieresClasse(sousEtabId, classeId){
    var tempTable=[{value: 0,      label: (i18n.language=='fr') ? ' Toutes ' : ' All '  }]
    var tabMatieres
    console.log("******* classeId: ",classeId,classeId==0);
    if(classeId==0 ){
      tabMatieres = currentAppContext.infoMatieres.filter((matiere)=>matiere.id_setab==sousEtabId)
      tabMatieres.map((matiere)=>{
        tempTable.push({value:matiere.id_matiere, label:matiere.libelle});
      })
      

    } else {
      tabMatieres = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
      tabMatieres.map((matiere)=>{
        tempTable.push({value:matiere.id_matiere, label:matiere.libelle_matiere});
      })

    }   
    console.log("hshsh",tempTable, currentAppContext.infoCours);
    return(tempTable);

  } 

 const tabMatieres=[
  {value: '0',      label:'Toutes'           },
  {value: '1',      label:'Anglais'          },
  {value: '2',      label:'Allemand'         },
  {value: '3',      label:'Maths'            },
  {value: '4',      label:'PCT'              },
  {value: '5',      label:'SVT'              },
  {value: '6',      label:'Histoire'         },
  {value: '7',      label:'Geographie'       }
];

/****************************************** Les Data ****************************************/
function init(){
  var level ={};
  level.id = '0';
  level.label = 'Tous';

  getData('0','0');
  // getMatiereData('0');
  getEffectifData('0');
  getFraisNiveau('0');
  getResultNiveau('0');
  getAssiduiteNiveau('0');
  console.log(level)
  //-------- Charger les classes a partir du niveau --------- 
  var tabClasses = getEtabClassesNiveau(currentAppContext.currentEtab, level.id);
  setOptClassePC(tabClasses);
  currentUiContext.setPrgramCoverSelectedLevel(level);
}

const getMatiereData=(niveauId)=>{
  axiosInstance.post(`program-cover-matiere/`, {
    id_niveau  : niveauId, //1,
    id_matiere : progCoverSelectedMatiere.id, //props.selectedMatiere.id,
    id_classe  : prgramCoverSelectedClass.id, //props.selectedClasse.id,
    id_sousetab: currentAppContext.currentEtab,  
  }).then((res)=>{
    // console.log(res.data);
    // createProgressionMatieres(progCoverSelectedMatiere,res.data.res);
    createProgressionMatieres(progCoverSelectedMatiere.id,res.data.res);
    setListMatieresProgress(res.data.res)
    setOuvertureCahierTexte(res.data.ouverture_cahier_de_texte)
    setIdGroupeMatieres(res.data.id_groupes)
    // setTypeGroupeMatieres(res.data.type_groupe)
  });
}
const getMatiereData2=(classeId,matiereId)=>{
  axiosInstance.post(`program-cover-matiere/`, {
    // id_niveau  : document.querySelectorAll('#selectNiveau1').value,
    // id_niveau  : 0,
    id_niveau  : currentUiContext.prgramCoverSelectedLevel.id,
    id_matiere : matiereId,
    id_classe  : classeId,
    id_sousetab: currentAppContext.currentEtab  
  }).then((res)=>{
    // createProgressionMatieres(progCoverSelectedMatiere,res.data.res);
    console.log("!!!",res.data)
    createProgressionMatieres(matiereId,res.data.res);
    setListMatieresProgress(res.data.res)
    setOuvertureCahierTexte(res.data.ouverture_cahier_de_texte)
    setIdGroupeMatieres(res.data.id_groupes)
    // setTypeGroupeMatieres(res.data.type_groupe)

  });
}


function getData(niveauId,classeId){
  console.log("progCoverSelectedMatiere: ",progCoverSelectedMatiere);

  axiosInstance.post(`program-cover-niveau/`, {
      id_niveau   : niveauId,
      // id_matiere  : progCoverSelectedMatiere.id,
      id_matiere  : '0',
      // id_classe   : prgramCoverSelectedClass.id,
      id_classe   : classeId,
      id_sousetab : currentAppContext.currentEtab,        
      
  }).then((res)=>{
    // var tabClasses = getEtabClassesNiveau(currentAppContext.currentEtab, niveauId);
    // console.log("tabClasses: ",tabClasses)
    // setOptClassePC(tabClasses);
    // var tabMatieres = getEtabMatieresClasse(currentAppContext.currentEtab,'0')
    // console.log("tabMatieres: ",tabMatieres)
    // setOptMatieresPC(tabMatieres);
    // setPrgramCoverSelectedClass(tabClasses[0])
    // setPrgramCoverSelectedMatiere(tabMatieres[0])

      console.log("!!!",res.data);
      setDoughnutData(res.data.doughnut_data);       
      setBarchartDataLabels(res.data.barchart_data.classes);
      setBarchartDataValues(res.data.barchart_data.taux);
      createProgressionMatieres(progCoverSelectedMatiere.id,res.data.matiere_data[0]);
      setListMatieresProgress(res.data.matiere_data[0]) 
      setOuvertureCahierTexte(res.data.matiere_data[1])
      setIdGroupeMatieres(res.data.matiere_data[2])
      // setTypeGroupeMatieres(res.data.matiere_data[3])

      

  })
  // if(niveauId<=3)
  //   setDoughnutData([55,45]);  
  // else
  //   setDoughnutData([20,80]);       

}

function getEffectifData(niveauId){
  let selectedClass = document.querySelector('#selectclass2').value;
  // console.log("SALUT Eff: ",niveauId," isInscritLevelChart: ",isInscritLevelChart," classe: ",selectedClass);
  axiosInstance.post(`effectif-data-niveau/`, {
      id_niveau : niveauId,
      id_classe : selectedClass,
      is_inscrit : isInscritLevelChart,
      is_inscrit_classe : isInscritClassChart,
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getEffectifData: ",res.data);
      setBarChartData(res.data.effectif_niveau_data);
      setBarChartClasseData(res.data.effectif_classe_data)

  })
}

function getEffectifData2(){
  let selectedClass = document.querySelector('#selectclass2').value;
  // console.log("SALUT Eff2: ",effectifLevel.id," isInscritLevelChart: ",!isInscritLevelChart,selectedClass);
  axiosInstance.post(`effectif-data-niveau/`, {
      id_niveau : effectifLevel.id,
      id_classe : selectedClass,
      is_inscrit : !isInscritLevelChart,
      is_inscrit_classe : isInscritClassChart,
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getEffectifData2: ",res.data);
      setBarChartData(res.data.effectif_niveau_data);
      setBarChartClasseData(res.data.effectif_classe_data)
    })
}

function getEffectifClassesData(classeId){
  // let selectedClass = document.querySelector('#selectclass2').value;
  // console.log("SALUT  classe: ",classeId," isInscritClassChart: ",isInscritClassChart);
  axiosInstance.post(`effectif-data-classe/`, {
      id_classe : classeId,
      id_niveau : effectifLevel.id,
      is_inscrit : isInscritClassChart,
      is_inscrit_niveau : isInscritLevelChart,
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getEffectifClassesData: ",res.data);
      setBarChartClasseData(res.data.effectif_classe_data)
  })
}

function getEffectifClassesData2(){
  // let id_cl = '0' ? effectifClass.id === undefined : effectifClass.id;
  let selectedClass = document.querySelector('#selectclass2').value;
  // console.log("SALUT  classe: ",selectedClass," isInscritClassChart: ",isInscritClassChart);
  axiosInstance.post(`effectif-data-classe/`, {
      id_classe : selectedClass,
      id_niveau : effectifLevel.id,
      is_inscrit : !isInscritClassChart,
      is_inscrit_niveau : isInscritLevelChart,
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getEffectifClassesData2: ",res.data);
      setBarChartClasseData(res.data.effectif_classe_data)
  })
}

function getFraisNiveau(niveauId){
  let selectedClass = document.querySelector('#selectclass3').value;
  // console.log("SALUT Eff: ",niveauId," isInscritLevelChart: ",isInscritLevelChart," classe: ",selectedClass);
  axiosInstance.post(`frais-data-niveau/`, {
      id_niveau : niveauId,
      id_classe : selectedClass,
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getFraisNiveau: ",res.data);
      setLabelsFrais(res.data.frais_labels);
      setLabelsFraisClasse(res.data.frais_labels_classe);
      setBarChartDataFrais(res.data.frais_niveau_data);
      setBarChartClasseDataFrais(res.data.frais_classe_data)

  })
}

function getFraisClasse(classeId){
  axiosInstance.post(`frais-data-niveau/`, {
      id_classe : classeId,
      id_niveau : effectifLevelFrais.id,
      // option : "classe",
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getFraisClasse: ",res.data);
      // setLabelsFrais(res.data.frais_labels);
      setLabelsFraisClasse(res.data.frais_labels_classe);
      setBarChartClasseDataFrais(res.data.frais_classe_data)
  })
}


function getResultNiveau(niveauId){
  let selectedClass = document.querySelector('#selectClasse5').value;
  let selectedMatiere = document.querySelector('#selectMatiere5').value;
  // console.log("SALUT Eff: ",niveauId," isInscritLevelChart: ",isInscritLevelChart," classe: ",selectedClass);
  axiosInstance.post(`res-data-niveau/`, {
      id_niveau : niveauId,
      id_classe : selectedClass,
      id_matiere : selectedMatiere,
      option : "niveau",
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getResultNiveau: ",res.data);
      setLabelsResult(res.data.res_labels);
      setBarChartDataResultNiveau(res.data.res_niveau_data);
      setBarChartDataResultClasse(res.data.res_classe_data);
      setBarChartDataResultMatiere(res.data.res_matiere_data);

  })
}

function getResultClasse(classeId){
  let selectedMatiere = document.querySelector('#selectMatiere5').value;
  axiosInstance.post(`res-data-niveau/`, {
      id_classe : classeId,
      id_niveau : resultatLevel.id,
      id_matiere : selectedMatiere,
      option : "classe",
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getResultClasse: ",res.data);
      setLabelsResult(res.data.res_labels);
      setBarChartDataResultClasse(res.data.res_classe_data);
      setBarChartDataResultMatiere(res.data.res_matiere_data);

  })
}

function getResultMatiere(matiereId){
  axiosInstance.post(`res-data-niveau/`, {
      id_matiere : matiereId,
      id_classe : resultatClass.id,
      id_niveau : resultatLevel.id,
      option : "matiere",
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("getResultMatiere: ",res.data);
      setLabelsResult(res.data.res_labels);
      setBarChartDataResultMatiere(res.data.res_matiere_data);
  })
}

function getAssiduiteNiveau(niveauId){
  let selectedClass = document.querySelector('#selectClasse4').value;
  let selectedMatiere = document.querySelector('#selectMatiere4').value;
  // console.log("SALUT Eff: ",niveauId," isInscritLevelChart: ",isInscritLevelChart," classe: ",selectedClass);
  axiosInstance.post(`assiduite/`, {
      id_niveau : niveauId,
      id_classe : selectedClass,
      id_matiere : selectedMatiere,
      option : "niveau",
      id_sousetab:currentAppContext.currentEtab,        
      
  }).then((res)=>{
      console.log("ggg getAssiduiteNiveau: ",res.data);
      setDoughnutDataAssiduiteNiveau(res.data.data_niveau);
      setDoughnutDataAssiduiteClasse(res.data.data_classe);
      setDoughnutDataAssiduiteMatiere(res.data.data_matiere);
      setSanctionLabels(res.data.sanctions_labels);
      setAbsenceLabels(res.data.absences_labels);

  })
}

/****************************************** Les Handlers ****************************************/
//---------------- Programme Completion -----------------//
const progCompletionLevelHandler=(e)=>{  
  setDoughnutData([0,0]);
  var curentLevel = e.target.value;  
  var cur_index = optNiveauPC.findIndex((index)=>index.value == curentLevel);
  var libelleLevel = optNiveauPC[cur_index].label;
  
  var level ={};
  level.id = curentLevel;
  level.label = libelleLevel;
  // currentUiContext.setPrgramCoverSelectedLevel(level);

  var tabClasses = getEtabClassesNiveau(currentAppContext.currentEtab, level.id);
  console.log("tabClasses: ",tabClasses)
  setOptClassePC(tabClasses);
  var tabMatieres = getEtabMatieresClasse(currentAppContext.currentEtab,'0')
  console.log("tabMatieres: ",tabMatieres)
  var classe = {}
  classe.id = tabClasses[0].value;
  classe.label = tabClasses[0].label;
  setPrgramCoverSelectedClass(classe);

  setOptMatieresPC(tabMatieres);
  console.log("$$$$ tabClasses[0]: ",tabClasses[0])
  // idClasseProgress = tabClasses[0].id
  var matiere = {}
  matiere.id = tabMatieres[0].value;
  matiere.label = tabMatieres[0].label;
  setPrgramCoverSelectedMatiere(matiere); 
  console.log(level)
  //-------- Charger les classes a partir du niveau --------- 
  // var tabMatieres = getEtabMatieresClasse(currentAppContext.currentEtab,tabClasses[0].id)
 
  var select = document.querySelector('#selectClasse1');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));

  var select = document.querySelector('#selectMatiere1');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));
  getData(curentLevel,'0');

  currentUiContext.setPrgramCoverSelectedLevel(level);
}

const progCompletionClassHandler=(e)=>{  
  var curentClass = e.target.value;  
  var cur_index = optClassePC.findIndex((index)=>index.value == curentClass);
  var libelleClasse = optClassePC[cur_index].label;

  var classe ={};
  classe.id = curentClass;
  classe.label = libelleClasse;

  //-------- Charger les matierers a partir de la classe
  var tabMatieres = getEtabMatieresClasse(currentAppContext.currentEtab,classe.id)
  setOptMatieresPC(tabMatieres);
  setPrgramCoverSelectedClass(classe);
  // idClasseProgress = classe.id;
  var select = document.querySelector('#selectMatiere1');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));
  // getEffectifData(curentLevel);
  // console.log(document.querySelectorAll('#selectNiveau1').value);

  getMatiereData2(classe.id,'0');
  
}

const progCompletionMatiereHandler=(e)=>{
  var curentMatiere  = e.target.value;
  var cur_index      = optMatieresPC.findIndex((index)=>index.value == curentMatiere);
  var libelleMatiere = optMatieresPC[cur_index].label; 
  
  var matiere        = {};
  matiere.id         = curentMatiere;
  matiere.label      = libelleMatiere;
  setPrgramCoverSelectedMatiere(matiere); 
  console.log("## prgramCoverSelectedClass.id: ",prgramCoverSelectedClass.id)
  
  axiosInstance.post(`program-cover-matiere/`, {
    id_niveau   : document.querySelector("#selectNiveau1").value,
    // id_matiere : progCoverSelectedMatiere.id,
    id_matiere  : curentMatiere,
    id_classe   : prgramCoverSelectedClass.id,
    // id_classe   : idClasseProgress,
    id_sousetab : currentAppContext.currentEtab,        
    
  }).then((res)=>{
      console.log("!!!",res.data);
      setListMatieresProgress(res.data.res)
      setOuvertureCahierTexte(res.data.ouverture_cahier_de_texte)
      createProgressionMatieres(matiere,res.data.res)
      setIdGroupeMatieres(res.data.id_groupes)
      // setTypeGroupeMatieres(res.data.type_groupe)

  })
  // var select = document.querySelector('#selectMatiere1');
  // select.addEventListener('change', function(){})
  // select.value = curentMatiere;
  // select.dispatchEvent(new Event('change'));
}

function createProgressionMatieres(matiere, listMatieresProgress){
  var tabMatieres=[];
  var listMat="";
  var matTab=[];
  var groupCount;
  var parentDiv,j;
  

  //initialisation de la div conteneur.
  parentDiv = document.getElementById('matieresProgress');
  groupCount = parentDiv.childNodes.length;
  
  if(groupCount>0){           
      for(var i = 1; i <= groupCount; i++)
      // for(var i = 0; i < groupCount; i++)
      {
          document.getElementById('sousGroupe'+i).remove();
      }
  }   
  console.log("ooo matiere: ",matiere) 
  if(matiere != undefined) {
      //Recuperation De la liste des matieres avc leur infos.        
      // listMat = getMatieres(parseInt(matiere));
      // listMat = "3+Allemand*1*78_Francais*1*84_Anglais*1*62_Histoire*2*73_ECM*2*75_SVT*2*82_PCT*2*93_Maths*2*72_Sport*3*100_TM*3*100_ESF*3*100";
      // console.log("matiere : ", matiere," listMat: ",listMat)

      //Extraction du nombre de groupes et calcul de la largeur d'un groupe. 
      listMat =listMatieresProgress;
      console.log("ooo listMatieresProgress :",listMatieresProgress)
      console.log("ooo idGroupeMatieres :",idGroupeMatieres)
      // console.log("typeGroupeMatieres :",typeGroupeMatieres)
      matTab = listMat.split('+');
      groupCount = matTab[0];
      console.log("cc groupCount:",groupCount)
      if (listMat != ""){
      if(groupCount==1) {
          groupWidth = 12
      }
      else{
        groupWidth = (Math.round(40/groupCount)-7)
      }
      //groupWidth = (groupCount!=0)? (groupCount==2)? 40: (Math.round(40/groupCount)-7) :40;

      //Creation du tableau des matieres.
      tabMatieres = matTab[1].split('_');
  
      //Creation des sous Divs conteneurs et
      //Ajout des matieres avec leur progression.
      var position = 0;
      for (var i = 1; i <=groupCount; i++)
      // for (var i = 0; i <groupCount; i++)
       {
          var cell = document.createElement('div');
          cell.id='sousGroupe'+i;

          cell.className=classes.matiereProgress;
          cell.style.width = groupWidth;

          parentDiv.appendChild(cell);
          for (var j = 0; j < tabMatieres.length; j++) {  

            if(getStringAtPosition(tabMatieres[j],1)==i)
            {
                var sousDiv = document.createElement('div');
                sousDiv.className= classes.inputRowLeft;
                  document.getElementById('sousGroupe'+i).appendChild(sousDiv);
                ReactDOM.render(<MatiereProgress matiereInfo={tabMatieres[j]}/>,sousDiv)
            }                    
          }       
      }
    }
  } 
}

function getStringAtPosition(examSting,pos){      
  var tabResult = examSting.split('*');
  // console.log('parpapa', tabResult)
  if (tabResult.length==1) return 1;
  if((pos >= 0)&&(pos<=tabResult.length-1)) return tabResult[pos];
  else return undefined;    
}



//---------------- Effectifs -----------------//

const effectifNiveauHandler=(e)=>{
  var curentLevel = e.target.value;  
  var cur_index = optNiveauEFF.findIndex((index)=>index.value == curentLevel);
  var libelleLevel = optNiveauEFF[cur_index].label;
  
  var level ={};
  level.id = curentLevel;
  level.label = libelleLevel;
  // setNiveau_effectif_selected(curentLevel);

  console.log(level)
  //-------- Charger les classes a partir du niveau --------- 
  var tabClasses = getEtabClassesNiveau(currentAppContext.currentEtab, level.id);
  setOptClasseEFF(tabClasses);
  setEffectifClass(tabClasses[0])
  setEffectifLevel(level);
  var select = document.querySelector('#selectclass2');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));
  getEffectifData(curentLevel);

}

const effectifClasseHandler=(e)=>{
  curentClass = e.target.value;  
  var cur_index = optClasseEFF.findIndex((index)=>index.value == curentClass);
  var libelleClass = optClasseEFF[cur_index].label;
  
  var classe ={};
  classe.id = curentClass;
  classe.label = libelleClass;

  getEffectifClassesData(curentClass)
  console.log(classe)
  setEffectifClass(classe); 
}

//---------------- Frais -----------------//

const fraisNiveauHandler=(e)=>{
  var curentLevel = e.target.value;  
  var cur_index = optNiveauFR.findIndex((index)=>index.value == curentLevel);
  var libelleLevel = optNiveauFR[cur_index].label;
  
  var level ={};
  level.id = curentLevel;
  level.label = libelleLevel;

  
  console.log(level)
  //-------- Charger les classes a partir du niveau --------- 
  var tabClasses = getEtabClassesNiveau(currentAppContext.currentEtab, level.id);
  setOptClasseFR(tabClasses);
  setEffectifClassFrais(tabClasses[0])
  setEffectifLevelFrais(level);
  var select = document.querySelector('#selectclass3');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));
  getFraisNiveau(curentLevel);
  //set (level);  
}

const fraisClasseHandler=(e)=>{
  curentClass = e.target.value;  
  var cur_index = optClasseFR.findIndex((index)=>index.value == curentClass);
  var libelleClass = optClasseFR[cur_index].label;
  
  var classe ={};
  classe.id = curentClass;
  classe.label = libelleClass;

  getFraisClasse(curentClass)
  console.log(classe)
  setEffectifClassFrais(classe); 
}

//---------------- Assiduite -----------------//

const assiduiteNiveauHandler=(e)=>{
  var curentLevel = e.target.value;  
  var cur_index = optNiveauASS.findIndex((index)=>index.value == curentLevel);
  var libelleLevel = optNiveauASS[cur_index].label;
  
  var level ={};
  level.id = curentLevel;
  level.label = libelleLevel;

  
  console.log(level)
  //-------- Charger les classes a partir du niveau --------- 
  var tabClasses = getEtabClassesNiveau(currentAppContext.currentEtab, level.id);
  setOptClasseASS(tabClasses);
  var tabMatieres = getEtabMatieresClasse(currentAppContext.currentEtab,'0');
  var classe = {}
  classe.id = tabClasses[0].value;
  classe.label = tabClasses[0].label;
  setAssiduiteClass(classe);
  setOptMatieresASS(tabMatieres);
  var matiere = {}
  matiere.id = tabMatieres[0].value;
  matiere.label = tabMatieres[0].label;
  setAssiduiteMatiere(matiere);

  var select = document.querySelector('#selectClasse4');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));

  var select = document.querySelector('#selectMatiere4');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));
  // getAssiduiteNiveau(curentLevel,'0');

  axiosInstance.post(`assiduite/`, {
    id_niveau : curentLevel,
    id_classe : classe.id,
    id_matiere : matiere.id,
    option : "niveau",
    id_sousetab:currentAppContext.currentEtab,        
    
}).then((res)=>{
    console.log("ggg getAssiduiteNiveau: ",res.data);
    setDoughnutDataAssiduiteNiveau(res.data.data_niveau);
    setDoughnutDataAssiduiteClasse(res.data.data_classe);
    setDoughnutDataAssiduiteMatiere(res.data.data_matiere);
    setSanctionLabels(res.data.sanctions_labels);
    setAbsenceLabels(res.data.absences_labels);

})

  setAssiduiteLevel(level);
 
  
}

const assiduiteClasseHandler=(e)=>{
  var curentClass = e.target.value;  
  var cur_index = optClasseASS.findIndex((index)=>index.value == curentClass);
  var libelleClasse = optClasseASS[cur_index].label;

  var classe ={};
  classe.id = curentClass;
  classe.label = libelleClasse;

  var tabMatieres = getEtabMatieresClasse(currentAppContext.currentEtab,classe.id)
  setOptMatieresASS(tabMatieres);
  setAssiduiteClass(classe);
  var select = document.querySelector('#selectMatiere4');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));

  axiosInstance.post(`assiduite/`, {
    id_niveau : assiduiteLevel.id,
    id_classe : curentClass,
    id_matiere : "0",
    option : "classe",
    id_sousetab:currentAppContext.currentEtab,        
    
}).then((res)=>{
    console.log("getAssiduiteNiveau: ",res.data);
    // setDoughnutDataAssiduiteNiveau(res.data.data_niveau);
    setDoughnutDataAssiduiteClasse(res.data.data_classe);
    setDoughnutDataAssiduiteMatiere(res.data.data_matiere);
    setSanctionLabels(res.data.sanctions_labels);
    setAbsenceLabels(res.data.absences_labels);

})

}

const assiduiteMatiereHandler=(e)=>{
  var curentMatiere  = e.target.value;
  var cur_index      = optMatieresASS.findIndex((index)=>index.value == curentMatiere);
  var libelleMatiere = optMatieresASS[cur_index].label; 
  
  var matiere        = {};
  matiere.id         = curentMatiere;
  matiere.label      = libelleMatiere;
  setAssiduiteMatiere(matiere); 

  axiosInstance.post(`assiduite/`, {
    id_niveau : assiduiteLevel.id,
    id_classe : assiduiteClass.id,
    id_matiere : curentMatiere,
    option : "matiere",
    id_sousetab:currentAppContext.currentEtab,        
    
}).then((res)=>{
    console.log("getAssiduiteNiveau: ",res.data);
    // setDoughnutDataAssiduiteNiveau(res.data.data_niveau);
    // setDoughnutDataAssiduiteClasse(res.data.data_classe);
    setDoughnutDataAssiduiteMatiere(res.data.data_matiere);
    // setSanctionLabels(res.data.sanctions_labels);
    setAbsenceLabels(res.data.absences_labels);

})

}

//---------------- Resultats -----------------//

const resultatsNiveauHandler=(e)=>{
  var curentLevel = e.target.value;  
  var cur_index = optNiveauRES.findIndex((index)=>index.value == curentLevel);
  var libelleLevel = optNiveauRES[cur_index].label;
  
  var level ={};
  level.id = curentLevel;
  level.label = libelleLevel;
  
  console.log(level)
  //-------- Charger les classes a partir du niveau --------- 
  var tabClasses = getEtabClassesNiveau(currentAppContext.currentEtab, level.id);
  var tabMatieres = getEtabMatieresClasse(currentAppContext.currentEtab, 0)
  console.log(tabClasses[0]," ++++++++++ tabMatieres:", tabMatieres);
  setOptClasseRES(tabClasses);
  setResultatClass(tabClasses[0])
  setResultatLevel(level);
  setOptMatieresRES(tabMatieres);
  setResultatMatiere(tabMatieres[0]);
  var select = document.querySelector('#selectClasse5');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));

  var select = document.querySelector('#selectMatiere5');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));
  getResultNiveau(curentLevel);
  
}

const resultatsClasseHandler=(e)=>{
  curentClass = e.target.value;  
  var cur_index = optClasseRES.findIndex((index)=>index.value == curentClass);
  var libelleClass = optClasseRES[cur_index].label;
  
  var classe ={};
  classe.id = curentClass;
  classe.label = libelleClass;

  var tabMatieres = getEtabMatieresClasse(currentAppContext.currentEtab, classe.id)
  setOptMatieresRES(tabMatieres);
  setResultatMatiere(tabMatieres[0]);
  setResultatClass(classe);
  var select = document.querySelector('#selectMatiere5');
  select.addEventListener('change', function(){})
  select.value = '0';
  select.dispatchEvent(new Event('change'));

  getResultClasse(curentClass)
  console.log(classe)
  // setResultatClass(classe); 
}

const resultatsMatiereHandler=(e)=>{
  curentMatiere = e.target.value;  
  var cur_index = optMatieresRES.findIndex((index)=>index.value == curentMatiere);
  var libelleMatiere = optMatieresRES[cur_index].label;
  
  var matiere ={};
  matiere.id = curentMatiere;
  matiere.label = libelleMatiere;

  getResultMatiere(curentMatiere)
  console.log(matiere)
  setResultatMatiere(matiere); 
}





/****************************************** fin des Handlers ************************************/
  
  
  return ( 
    <div className={classes.viewContent}>
      <div className= {getCurrentContaintTheme()}>
        <div className={classes.dashBoardRow}>
            
          <div className={isMobile ? M_classes.sectionTitle +' '+ getSectionBgClr() : classes.sectionTitle +' '+ getSectionBgClr()}>
            {t('taux_couverture')}
          </div>
            
            
          <div className={classes.column25}>
            <div className={classes.selectZone} style={{marginLeft:'-3.7vw'}}>
              <div className={classes.labelTitle}>{t('level')} : </div>
              <select id='selectNiveau1' onChange={progCompletionLevelHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                  {(optNiveauPC||[]).map((option)=> {
                      return(
                          <option  value={option.value}>{option.label}</option>
                      );
                  })}
              </select> 
            </div>
            <div style={{paddingTop:'13vh', display: 'flex', width:'13vw', height:'0vw', justifyContent:'center', alignItems:'center'}}>
              <ProgramCoverNiveau  id='couvertureByLevel' DoughnutData={DoughnutData} selectedNiveau={currentUiContext.prgramCoverSelectedLevel.id}/>
            </div>
          </div>
            
            
          <div className={classes.column26}>
            <div className={classes.selectZone} style={{marginLeft:'2vh'}}>
              <div className={classes.labelTitle}> {t('class')}   : </div>
              <select id='selectClasse1' onChange={progCompletionClassHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                  {(optClassePC||[]).map((option)=> {
                      return(
                          <option  value={option.value}>{option.label}</option>
                      );
                  })}
              </select> 

            </div>
            <div style={{  width:'20vw', height:'23vw', justifyContent:'center'}}>
              <ProgramCoverClass barchartDataLabels={barchartDataLabels} barchartDataValues={barchartDataValues}  selectedClasse={prgramCoverSelectedClass.id}/>
            </div>
            
          </div>

          <div>
            <div className={classes.selectZone} style={{marginLeft:'2vh'}}>
                <div className={classes.labelTitle}> {t('matiere')}   : </div>
                <select id='selectMatiere1' onChange={progCompletionMatiereHandler} className={classes.comboBoxStyle} style={{width:'10.3vw', marginBottom:1}}>
                    {(optMatieresPC||[]).map((option)=> {
                        return(
                            <option  value={option.value}>{option.label}</option>
                        );
                    })}
                </select> 

            </div>

            <div style={{  width:'20vw', height:'23vw', justifyContent:'center'}}>
              <ProgramCoverMatiere listMatieresProgress={listMatieresProgress}
               selectedClasse={prgramCoverSelectedClass}
                selectedMatiere={progCoverSelectedMatiere}
                ouvertureCahierTexte={ouvertureCahierTexte}
                idGroupeMatieres={idGroupeMatieres}
                // typeGroupeMatieres={typeGroupeMatieres} 
                />
            </div>          
  
          </div>
            
            
          

        </div>

        <div className={classes.dashBoardRow}>
          <div className={isMobile ? M_classes.sectionTitle+' '+ getSectionBgClr() : classes.sectionTitle +' '+ getSectionBgClr()}>
            {t('effectifs')}
          </div>
          
          <div className={classes.column30}>
            <div className={classes.selectZone} style={{marginLeft:'-4.7vw'}}>
              <div className={classes.labelTitle}> {t('level')}   : </div>
              <select id='selectNiveau2' onChange={effectifNiveauHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                {(optNiveauEFF||[]).map((option)=> {
                    return(
                      <option  value={option.value}>{option.label}</option>
                    );
                })}
              </select>
              <div style={{display:'flex', flexDirection:'row', alignItems:'center', paddingTop:'0.7vh' }}>
                <label style={{color:'grey', marginLeft:'2vw', marginRight:3}}>{t('effectifs_total')} </label>
                <input type='radio' checked={!isInscritLevelChart}  value={'enreg'} name='effectifsNiveau' onClick={()=> { console.log(isInscritLevelChart); isInscritLevelChart ? setIsInscritLevelChart(false) :setIsInscritLevelChart(true);getEffectifData2()}}/>
                <label style={{color:'grey', marginLeft:'2vw', marginRight:3}}> {t('effectifs_inscrit')}</label>
                <input type='radio' checked={isInscritLevelChart}  value={'inscrits'} name='effectifsNiveau' onClick={()=> { console.log(isInscritLevelChart); isInscritLevelChart ? setIsInscritLevelChart(false) :setIsInscritLevelChart(true);getEffectifData2()}}/>
              </div> 

            </div>
          
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
              <div style={{  width:'20vw', height:'23vw', justifyContent:'center'}}>
                <Effectifs BarchartData={BarchartData} selectedClass='' selectedNiveau={effectifLevel} isInscrits={isInscritLevelChart}/>
              </div>             
            </div>
          </div>

  
          <div style={{display:'flex', flexDirection:'column'}}>
            <div className={classes.selectZone} style={{marginLeft:'2vw'}}>
              <div className={classes.labelTitle}> {t('class')}   : </div>
              <select id='selectclass2' onChange={effectifClasseHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                {(optClasseEFF||[]).map((option)=> {
                    return(
                      <option  value={option.value}>{option.label}</option>
                    );
                })}
              </select>
              <div style={{display:'flex', flexDirection:'row', alignItems:'center', paddingTop:'0.7vh' }}>
                <label style={{color:'grey', marginLeft:'2vw', marginRight:3}}>{t('effectifs_total')} </label>
                <input type='radio' checked={!isInscritClassChart}  value={'enreg'} name='effectifsClasse' onClick={()=> { isInscritClassChart ? setIsInscritClassChart(false) :setIsInscritClassChart(true);getEffectifClassesData2()}}/>
                <label style={{color:'grey', marginLeft:'2vw', marginRight:3}}> {t('effectifs_inscrit')} </label>
                <input type='radio' checked={isInscritClassChart}  value={'inscrits'} name='effectifsClasse' onClick={()=> { isInscritClassChart ? setIsInscritClassChart(false) :setIsInscritClassChart(true);getEffectifClassesData2()}}/>
              </div> 
            </div>    
            
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
              <div style={{  width:'20vw', height:'23vw', justifyContent:'center'}}>
                <Effectifs BarchartData={BarchartClasseData} selectedNiveau='' selectedClass={effectifClass} isInscrits={isInscritClassChart}/>
              </div>             
            </div> 
          </div>                     
          
        </div>

        <div className={classes.dashBoardRow}>
          <div className={isMobile ? M_classes.sectionTitle+' '+ getSectionBgClr() : classes.sectionTitle +' '+ getSectionBgClr()}>
            {t('frais')}
          </div>
            
          <div className={classes.column30}>
            <div className={classes.selectZone} style={{marginLeft:'-4.3vw'}}>
              <div className={classes.labelTitle}> {t('level')}   : </div>
              <select id='selectNiveau3' onChange={fraisNiveauHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                {(optNiveauFR||[]).map((option)=> {
                    return(
                      <option  value={option.value}>{option.label}</option>
                    );
                })}
              </select>
              {/* <div style={{display:'flex', flexDirection:'row', alignItems:'center', paddingTop:'0.7vh' }}> */}
                {/* <label style={{color:'grey', marginLeft:'2vw', marginRight:1}}>{t('frais_scolariteP')} </label> */}
                {/* <input type='radio' checked={!isFraisScolaireLevel}  value={'inscrits'} name='fraisNiveau' onClick={()=> { isFraisScolaireLevel ? setIsFraisScolaireLevel(false) :setIsFraisScolaireLevel(true)}}/> */}
                {/* <label style={{color:'grey', marginLeft:'2vw', marginRight:1}}> {t('other_fees')} </label> */}
                {/* <input type='radio' checked={isFraisScolaireLevel}  value={'enreg'} name='fraisNiveau' onClick={()=> { isFraisScolaireLevel ? setIsFraisScolaireLevel(false) :setIsFraisScolaireLevel(true)}}/> */}
              {/* </div>  */}

            </div>
          
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
              <div style={{  width:'20vw', height:'23vw', justifyContent:'center'}}>
                <Frais LabelsFraisClasse={LabelsFraisClasse} LabelsFrais={LabelsFrais} BarchartData={BarchartDataFrais} selectedClass='' selectedNiveau={effectifLevelFrais} isSchoolFees={!isFraisScolaireLevel}/>
              </div>             
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column'}}>
            <div className={classes.selectZone} style={{marginLeft:'2vw'}}>
              <div className={classes.labelTitle}> {t('class')}   : </div>
              <select id='selectclass3' onChange={fraisClasseHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                {(optClasseFR||[]).map((option)=> {
                    return(
                      <option  value={option.value}>{option.label}</option>
                    );
                })}
              </select>

              {/* <div style={{display:'flex', flexDirection:'row', alignItems:'center', paddingTop:'0.7vh' }}> */}
                {/* <label style={{color:'grey', marginLeft:'2vw', marginRight:1}}> {t('frais_scolariteP')} </label> */}
                {/* <input type='radio' checked={!isFraisScolaireClass}  value={'enreg'} name='fraisClasse' onClick={()=> { isFraisScolaireClass ? setIsFraisScolaireClass(false) :setIsFraisScolaireClass(true)}}/> */}
                {/* <label style={{color:'grey', marginLeft:'2vw', marginRight:1}}> {t('other_fees')}  </label> */}
                {/* <input type='radio' checked={isFraisScolaireClass}  value={'inscrits'} name='fraisClasse' onClick={()=> { isFraisScolaireClass ? setIsFraisScolaireClass(false) :setIsFraisScolaireClass(true)}}/> */}
              {/* </div>  */}
            </div>    
            
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
              <div style={{  width:'20vw', height:'23vw', justifyContent:'center'}}>
                <Frais LabelsFraisClasse={LabelsFraisClasse} LabelsFrais={LabelsFrais} BarchartData={BarchartClasseDataFrais} selectedNiveau='' selectedClass={effectifClassFrais} isSchoolFees={isFraisScolaireClass}/>
              </div>             
            </div> 
          </div>

  
          

        </div>

        <div className={classes.dashBoardRow}>
          <div className={isMobile ? M_classes.sectionTitle+' '+ getSectionBgClr() : classes.sectionTitle +' '+ getSectionBgClr()}>
            {t('assiduite')}
          </div>
          
            
          <div className={classes.column25}>
            <div className={classes.selectZone} style={{marginLeft:'-1vw'}}>
              <div className={classes.labelTitle} style={{width:'4vw'}}> {t('level')} : </div>
              <select id='selectNiveau4' onChange={assiduiteNiveauHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                  {(optNiveauASS||[]).map((option)=> {
                      return(
                          <option  value={option.value}>{option.label}</option>
                      );
                  })}
              </select>

              <div style={{display:'flex', flexDirection:'column', justifyContent:"center", alignItems:'flex-end', paddingTop:'0.7vh', width:'7.7vw'}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteLevel==1}  value={'enreg'} name='AssiduiteLevel' onClick={()=> {setAssiduiteLevel(1)}}/>
                  <label style={{color:'grey', marginLeft:'0vw', marginRight:1}}> Absences </label>
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteLevel==2}  value={'inscrits'} name='AssiduiteLevel' onClick={()=> {setAssiduiteLevel(2)}}/>
                  <label style={{color:'grey', marginLeft:'0.13vw', marginRight:1}}> Consigne </label>
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteLevel==3}  value={'inscrits'} name='AssiduiteLevel' onClick={()=> {setAssiduiteLevel(3)}}/>
                  <label style={{color:'grey', marginLeft:'0.1vw', marginRight:1}}> Exclusion </label>
                </div>
              </div>  

            </div>

            <div style={{paddingTop:'8vh', display: 'flex', width:'15vw', height:'0vw', justifyContent:'center', alignItems:'center'}}>
              <Assiduite id='Assiduite_niveau' Labels={sanctionLabels} DoughnutData={DoughnutDataAssiduiteNiveau} selectedNiveau={prgramCoverSelectedLevel.id} selectedClass='' selectedMatiere='' codeAssiduite={assiduiteLevel}/>
            </div>

          </div>
            
            
          <div className={classes.column26}>
            <div className={classes.selectZone} style={{marginLeft:'2vh'}}>
              <div className={classes.labelTitle}> {t('class')}   : </div>
              <select id='selectClasse4' onChange={assiduiteClasseHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                  {(optClasseASS||[]).map((option)=> {
                      return(
                          <option  value={option.value}>{option.label}</option>
                      );
                  })}
              </select> 

              <div style={{display:'flex', flexDirection:'column', justifyContent:"center", alignItems:'flex-end', paddingTop:'0.7vh', width:'12vw'}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteClass==1}  value={'enreg'} name='AssiduiteClasse'   onClick={()=> {setAssiduiteClass(1)}}/>
                  <label style={{color:'grey', marginLeft:'0vw', marginRight:1}}> Absences </label>
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteClass==2}  value={'inscrits'} name='AssiduiteClasse' onClick={()=> {setAssiduiteClass(2)}}/>
                  <label style={{color:'grey', marginLeft:'0.13vw', marginRight:1}}> Consigne </label>
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteClass==3}  value={'inscrits'} name='AssiduiteClasse' onClick={()=> {setAssiduiteClass(3)}}/>
                  <label style={{color:'grey', marginLeft:'0.1vw', marginRight:1}}> Exclusion </label>
                </div>
              </div> 

            </div>
            <div style={{paddingTop:'8vh', display: 'flex', width:'15vw', height:'0vw', justifyContent:'center', alignItems:'center'}}>
              <Assiduite id='Assiduite_classe' Labels={sanctionLabels} DoughnutData={DoughnutDataAssiduiteClasse} selectedNiveau='' selectedClass={prgramCoverSelectedLevel.id} selectedMatiere='' codeAssiduite={assiduiteClass}/>
            </div>
            
          </div>

          <div>
            <div className={classes.selectZone} style={{marginLeft:'2vh'}}>
              <div className={classes.labelTitle}> {t('matiere')}: </div>
              <select id='selectMatiere4' onChange={assiduiteMatiereHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                  {(optMatieresASS||[]).map((option)=> {
                      return(
                          <option  value={option.value}>{option.label}</option>
                      );
                  })}
              </select> 

              <div style={{display:'flex', flexDirection:'column', justifyContent:"center", alignItems:'flex-end', paddingTop:'0.7vh', width:'12vw'}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteMatiere==1}  value={'enreg'} name='AssiduiteMatiere'   onClick={()=> {setAssiduiteMatiere(1)}}/>
                  <label style={{color:'grey', marginLeft:'0vw', marginRight:1}}> Absences </label>
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteMatiere==2}  value={'inscrits'} name='AssiduiteMatiere' onClick={()=> {setAssiduiteMatiere(2)}}/>
                  <label style={{color:'grey', marginLeft:'0.13vw', marginRight:1}}> Consigne </label>
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                  <input type='radio' checked={assiduiteMatiere==3} value={'inscrits'} name='AssiduiteMatiere' onClick={()=> {setAssiduiteMatiere(3)}}/>
                  <label style={{color:'grey', marginLeft:'0.1vw', marginRight:1}}> Exclusion </label>
                </div>
              </div>              

            </div>

            <div style={{paddingTop:'8vh', display: 'flex', width:'15vw', height:'0vw', justifyContent:'center', alignItems:'center'}}>
              <Assiduite id='Assiduite_matiere' Labels={absenceLabels} DoughnutData={DoughnutDataAssiduiteMatiere} selectedNiveau='' selectedClass='' selectedMatiere={prgramCoverSelectedLevel.id} codeAssiduite={assiduiteMatiere}/>
            </div>
  
          </div> 

        </div>

        <div className={classes.dashBoardRow}>
          <div className={isMobile ? M_classes.sectionTitle+' '+ getSectionBgClr() : classes.sectionTitle +' '+ getSectionBgClr()}>
            {t('resultats_scolaires')}
          </div>
          
            
          <div className={classes.column25}>
            <div className={classes.selectZone} style={{marginLeft:'-1vw'}}>
              <div className={classes.labelTitle} style={{width:'4vw'}}> {t('level')}   : </div>
              <select id='selectNiveau5' onChange={resultatsNiveauHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                {(optNiveauRES||[]).map((option)=> {
                    return(
                        <option  value={option.value}>{option.label}</option>
                    );
                })}
              </select> 
              {/* <div style={{display:'flex', flexDirection:'column', justifyContent:"center", alignItems:'flex-end', paddingTop:'0.7vh', width:'10vw'}}>
                <div style={{display:'flex', flexDirection:'row', width:'8.7vw'}}>
                  <input type='radio' checked={resultatLevel==1}  value={'enreg'} name='resultatLevel'   onClick={()=> {setResultatLevel(1)}}/>
                  <label style={{color:'grey', marginLeft:'0.1vw', marginRight:1}}> {t('resultats_scolaires')} </label>
                </div>

                <div style={{display:'flex', flexDirection:'row', width:'8.7vw'}}>
                  <input type='radio' checked={resultatLevel==2}  value={'inscrits'} name='resultatLevel' onClick={()=> {setResultatLevel(2)}}/>
                  <label style={{color:'grey', marginLeft:'0.13vw', marginRight:1}}> {t('exams_officiels')}  </label>
                </div>

              </div>  */}

            </div>

            <div style={{paddingTop:'8vh', display: 'flex', width:'15vw', height:'0vw', justifyContent:'center', alignItems:'center'}}>
              <Resultats LabelsResult={LabelsResult} BarchartData={BarchartDataResultNiveau} selectedNiveau={prgramCoverSelectedLevel.id} selectedClass='' selectedMatiere='' codeResultat={resultatLevel}/>
            </div>
            
          </div>
            
            
          <div className={classes.column26}>
            <div className={classes.selectZone} style={{marginLeft:'2vh'}}>
              <div className={classes.labelTitle}> {t('class')}   : </div>
              <select id='selectClasse5' onChange={resultatsClasseHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                  {(optClasseRES||[]).map((option)=> {
                      return(
                          <option  value={option.value}>{option.label}</option>
                      );
                  })}
              </select> 

              {/* <div style={{display:'flex', flexDirection:'column', justifyContent:"center", alignItems:'flex-end', paddingTop:'0.7vh', width:'12vw'}}>
                <div style={{display:'flex', flexDirection:'row', width:'8.7vw'}}>
                  <input type='radio' checked={resultatClass==1}  value={'enreg'} name='resultatClass'   onClick={()=> {setResultatClass(1)}}/>
                  <label style={{color:'grey', marginLeft:'0.1vw', marginRight:1}}> {t('resultats_scolaires')} </label>
                </div>

                <div style={{display:'flex', flexDirection:'row', width:'8.7vw'}}>
                  <input type='radio' checked={resultatClass==2}  value={'inscrits'} name='resultatClass' onClick={()=> {setResultatClass(2)}}/>
                  <label style={{color:'grey', marginLeft:'0.13vw', marginRight:1}}> {t('exams_officiels')} </label>
                </div>

              </div>  */}

            </div>

            <div style={{paddingTop:'8vh', display: 'flex', width:'15vw', height:'0vw', justifyContent:'center', alignItems:'center'}}>
              <Resultats LabelsResult={LabelsResult} BarchartData={BarchartDataResultClasse} selectedNiveau='' selectedClass={prgramCoverSelectedLevel.id} selectedMatiere='' codeResultat={resultatClass}/>
            </div>
            
          </div>

          <div>
            <div className={classes.selectZone} style={{marginLeft:'2vh'}}>
              <div className={classes.labelTitle}> {t('matiere')}: </div>
              <select id='selectMatiere5' onChange={resultatsMatiereHandler} className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1}}>
                  {(optMatieresRES||[]).map((option)=> {
                      return(
                          <option  value={option.value}>{option.label}</option>
                      );
                  })}
              </select> 
              {/* <div style={{display:'flex', flexDirection:'column', justifyContent:"center", alignItems:'flex-end', paddingTop:'0.7vh', width:'12vw'}}>
                <div style={{display:'flex', flexDirection:'row', width:'8.7vw'}}>
                  <input type='radio' checked={resultatMatiere==1}  value={'enreg'} name='resultatMatiere'   onClick={()=> {setResultatMatiere(1)}}/>
                  <label style={{color:'grey', marginLeft:'0.1vw', marginRight:1}}> {t('resultats_scolaires')} </label>
                </div>

              </div>  */}
            </div>
            <div style={{paddingTop:'8vh', display: 'flex', width:'15vw', height:'0vw', justifyContent:'center', alignItems:'center'}}>
              <Resultats LabelsResult={LabelsResult} BarchartData={BarchartDataResultMatiere} selectedNiveau='' selectedClass='' selectedMatiere={prgramCoverSelectedLevel.id} codeResultat={1}/>
            </div>  
          </div>

        </div>

        
        
      </div>

      <div id="side-menu" class="sidenav side-menu">
        <FormLayout formCode={'10'}>
          { <CahierDeTexte currentClasse={{value:prgramCoverSelectedClass.id,label:prgramCoverSelectedClass.label}} currentMatiere={{value:progCoverSelectedMatiere.id,label:progCoverSelectedMatiere.label}}/>  }
          {/* { <CahierDeTexte currentClasse={prgramCoverSelectedClass} currentMatiere={progCoverSelectedMatiere}/>  } */}
        </FormLayout>     
      </div>
    </div>
  );
} 
export default DashBoardPage;