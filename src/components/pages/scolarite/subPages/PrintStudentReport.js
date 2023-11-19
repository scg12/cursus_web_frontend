import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import {isMobile} from 'react-device-detect';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFTemplate from '../reports/PDFTemplate';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import BulletinEleve from '../reports/BulletinEleve';
import BulletinSequence from '../reports/BulletinSequence';
import BulletinTrimestriel from '../reports/BulletinTrimestriel'
import BulletinAnnuel from '../reports/BulletinAnnuel';
import {useTranslation} from "react-i18next";



var chosenMsgBox;
const MSG_SUCCESS_PrRPT = 11;
const MSG_WARNING_PrRPT = 12;
const MSG_ERROR_PrRPT   = 13;

var CURRENT_ANNEE_SCOLAIRE;

let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;

let CURRENT_PERIOD_ID;
let CURRENT_PERIOD_LABEL;

let CURRENT_TYPE_BULLETIN_ID;
var selectedElevesIds   = new Array();
var selectedNCElevesIds = new Array();

var listElt    = {};
var listEleves = [];
var pageSet    = [];

var page = {
    pageTitle:'',
    pageRows:[],
    pageNumber:0,
}

const ROWS_PER_PAGE= 40;
var ElevePageSet={};
var ELEVES_DATA;
var printedETFileName ='';

var tabSequences    = [];
var tabTrimestres   = [];
var tabCurrentAnnee = [];

var LIST_SEQUENCE   = [];
var LIST_TRIMESTRES = [];


var ELEVES_CL ;
var ELEVES_NCL;
var PROF_PRINCIPAL = undefined;



function PrintStudentReport(props) {
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n }       = useTranslation();
    const [isValid1, setIsValid1]          = useState(false);
    const [isValid2, setIsValid2]          = useState(false);
    const [gridRowsCL, setGridRowsCL]    = useState([]);
    const [gridRowsNCL, setGridRowsNCL]  = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse]  = useState([]);
    const [optPeriode, setOptPeriode]       = useState([]);
    const [optTypeReport, setOptTypeReport] = useState([]);
    const [typeBulletin, setTypeBulletin] = useState(1);
    const [bullTypeLabel, setBullTypeLabel] = useState();
    const [seq1, setSeq1] = useState("1");
    const [seq2, setSeq2] = useState("2");
    const selectedTheme = currentUiContext.theme;

    var firstItem = {
        value: -1,   
        label:'-- '+ t('choisir') +' --'
    }

    const tabTypReport = [
        {value:1, label:t('bulletin_sequentiel') },
        {value:2, label:t('bulletin_trimestriel')},
        {value:3, label:t('bulletin_annuel')     },
    ]

    useEffect(()=> {
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;

        setOptTypeReport(tabTypReport);
       
        getActivatedSequences();
        getActivatedTrimestres();
        getActivatedAnnee();

        CURRENT_TYPE_BULLETIN_ID = 1;
        getActivatedEvalPeriods(CURRENT_TYPE_BULLETIN_ID);

        if(gridRowsCL.length==0){
            CURRENT_CLASSE_ID = undefined;
            CURRENT_PERIOD_ID = undefined;
        }

        getEtabListClasses();
        
    },[]);


    function getActivatedSequences(){
        var tempTable=[];
        tabSequences = [];
        
        axiosInstance.post(`list-sequences/`, {
            id_sousetab: currentAppContext.currentEtab,
            id_trimestre:""
        }).then((res)=>{                   
            tempTable = [...res.data.sequences];                         
            tempTable.map((seq)=>{
                if(seq.is_active == true){
                    tabSequences.push({value:seq.id, label:seq.libelle});
                    LIST_SEQUENCE.push(seq);
                }                              
            })  
            tabSequences.unshift(firstItem);
            console.log("seaadadad",tabSequences)
        })
    }

    function getActivatedTrimestres(){
        var tempTable = [];
        tabTrimestres = [];    
        axiosInstance.post(`list-trimestres/`, {
            id_sousetab: currentAppContext.currentEtab,
            id_trimestre:""
        }).then((res)=>{    
            tabTrimestres = [];               
            tempTable = [...res.data];                         
            tempTable.map((trim)=>{
                if(trim.is_active == true){
                    tabTrimestres.push({value:trim.id, label:trim.libelle});
                    LIST_TRIMESTRES.push(trim);
                }                              
            })
            tabTrimestres.unshift(firstItem);
        })
    }

    function getActivatedAnnee(){
        tabCurrentAnnee = [];
        tabCurrentAnnee = [{value: 0,      label: t("annee")+ ' '+ CURRENT_ANNEE_SCOLAIRE  }]  
        tabCurrentAnnee.unshift(firstItem);     
    }

    function getActivatedEvalPeriods(typebultin){    
        CURRENT_PERIOD_ID = undefined;
        setGridRowsCL([]); setGridRowsNCL([]);

        if(document.getElementById('optPeriode').options != undefined && document.getElementById('optPeriode').options[0] != undefined){
            document.getElementById('optPeriode').options[0].selected = true;
        }
       
        switch(typebultin){
            case 1: {setOptPeriode(tabSequences);    break;}
          
            case 2: {setOptPeriode(tabTrimestres);   break;}
            
            case 3: {setOptPeriode(tabCurrentAnnee); break;}     
        }  
    }

    const getEtabListClasses=()=>{
       var tempTable=[{value: '0',      label:(i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '    }]
        axiosInstance.post(`list-classes/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
                console.log(res.data);
                res.data.map((classe)=>{
                tempTable.push({value:classe.id, label:classe.libelle})
                setOpClasse(tempTable);
                console.log(tempTable);
           })         
        }) 
    }

    function getStudentListOfClass(classId) {
        return new Promise(function(resolve, reject){
            listEleves = []
            axiosInstance.post(`eleves-situation-financiere/`, {
                id_classe: classId,
                date_limite:getTodayDate()
            }).then((res)=>{
                console.log(res.data);
                listEleves = [...formatList(res.data.eleves)]
                console.log(listEleves);
                //setGridRowsCL(listEleves);           
                resolve(listEleves);  //Pas important pour mon cas ci
            })  
        });
    } 

    function getBulletinInfos(typeBulletin, idClasse, idSequence, studentList){
       console.log("type bulletin",typeBulletin);
        if(idClasse==undefined || idSequence==undefined){
            setGridRowsCL([]);  setGridRowsNCL([]);
        } else {
            setModalOpen(5);
            
            switch(typeBulletin){
                case 1: {getBullSequentielInfo(idClasse, idSequence, studentList);   break;} 
                case 2: {getBulltrimestrielInfo(idClasse, idSequence, studentList);  break;}
                case 3: {getBullAnnuellInfo(idClasse, idSequence, studentList);      break;}
            }

        }      
    }

    function convertElevesDataIntoarray(elevesData, typeBulletin){
        var elvData = [];
        var eleve   = {};
        var resultatElev = [];
        var cur_rang = 0;
        elevesData.map((elv)=>{
            eleve = {};
            resultatElev      = elv.resultat.split("~~~");
            console.log("resultElv:", resultatElev)
            eleve.id          = elv.id;
            eleve.rang        = elv.rang;
            eleve.isExeco     = elv.rang==cur_rang;
            if(eleve.isExeco) cur_rang = elv.rang;
            else cur_rang ++;
            eleve.matricule   = resultatElev[1].split("²²")[2];
            eleve.nom         = resultatElev[1].split("²²")[0] + ' '+resultatElev[1].split("²²")[1];
            console.log("typeBull",typeBulletin);

            switch(typeBulletin){ 
                case 1: {
                    console.log("ici1");
                    eleve.moyenne = resultatElev[resultatElev.length-1].split("²²")[2];
                    break;
                }

                case 2: {
                    eleve.moy_seq1 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moy_seq2 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moyenne  = resultatElev[resultatElev.length-1].split("²²")[2];
                    break;
                }

                case 3: {
                    eleve.moy_trim1 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moy_trim2 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moy_trim3 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moyenne   = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.decision  = "";
                    eleve.promuEn   = "";
                    break;
                }
            }

            elvData.push(eleve);    
        })

        return elvData;

    }


    function getBullSequentielInfo(idClasse, idSequence, studentList){
        var selectedEleves = []; ELEVES_DATA={}; ELEVES_CL = []; ELEVES_NCL = [];

        studentList.map((elt)=>selectedEleves.push(elt.id));
        axiosInstance.post(`imprimer-bulletin-classe/`, {
            id_classe   : idClasse,
            id_sequence : idSequence,
            id_eleves   : selectedEleves.join("_")
        }).then((res)=>{
            //chargement des gridViews
            if(res.data.status=="ok"){

                ELEVES_DATA = res.data;

                console.log("Donnes pr impression",ELEVES_DATA);

                var elevesClasses   = convertElevesDataIntoarray(ELEVES_DATA.eleve_results_c,  CURRENT_TYPE_BULLETIN_ID);
                var elevesNClasses  = convertElevesDataIntoarray(ELEVES_DATA.eleve_results_nc, CURRENT_TYPE_BULLETIN_ID);

                ELEVES_CL   = formatSeqList(elevesClasses, studentList);
                ELEVES_NCL  = formatSeqList(elevesNClasses, studentList);

                setGridRowsCL(ELEVES_CL);
                setGridRowsNCL(ELEVES_NCL);

            } else {
                chosenMsgBox = MSG_ERROR_PrRPT;
                currentUiContext.showMsgBox({
                    visible  : true, 
                    msgType  : "danger", 
                    msgTitle : t("error_M"), 
                    message  : t("report_not_yet_generated")
                })        
            }
            setModalOpen(0);           
        })  
       
    }

    function getBulltrimestrielInfo(idClasse, idSequence, studentList){
        var selectedEleves = []; ELEVES_DATA={}; ELEVES_CL = []; ELEVES_NCL = [];
        studentList.map((elt)=>selectedEleves.push(elt.id));
        axiosInstance.post(`imprimer-bulletin-trimestre-classe/`, {
            id_classe   : idClasse,
            id_trimestre : idSequence,
            id_eleves   : selectedEleves.join("_")
        }).then((res)=>{
            //chargement des gridViews
            if(res.data.status=="ok"){

                ELEVES_DATA = res.data;

                var elevesClasses   = convertElevesDataIntoarray(ELEVES_DATA.eleve_results_c,  CURRENT_TYPE_BULLETIN_ID);
                var elevesNClasses  = convertElevesDataIntoarray(ELEVES_DATA.eleve_results_nc, CURRENT_TYPE_BULLETIN_ID);

                ELEVES_CL   = formatTrimList(elevesClasses, studentList);
                ELEVES_NCL  = formatTrimList(elevesNClasses,studentList);

                setGridRowsCL(ELEVES_CL);
                setGridRowsNCL(ELEVES_NCL);

            } else {
                chosenMsgBox = MSG_ERROR_PrRPT;
                currentUiContext.showMsgBox({
                    visible  : true, 
                    msgType  : "danger", 
                    msgTitle : t("error_M"), 
                    message  : t("report_not_yet_generated")
                })        
            }
            setModalOpen(0);           
        })  

    }

    function getBullAnnuellInfo(idClasse, idSequence, studentList){
        var selectedEleves = []; ELEVES_DATA={}; ELEVES_CL = []; ELEVES_NCL = [];
        studentList.map((elt)=>selectedEleves.push(elt.id));
        axiosInstance.post(`imprimer-bulletin-annee-classe/`, {
            id_classe   : idClasse,
            id_sequence : idSequence,
            id_eleves   : selectedEleves.join("_")
        }).then((res)=>{
            //chargement des gridViews
            if(res.data.status=="ok"){

                ELEVES_DATA = res.data;

                var elevesClasses   = convertElevesDataIntoarray(ELEVES_DATA.eleve_results_c,  CURRENT_TYPE_BULLETIN_ID);
                var elevesNClasses  = convertElevesDataIntoarray(ELEVES_DATA.eleve_results_nc, CURRENT_TYPE_BULLETIN_ID);
                
                ELEVES_CL  = formatAnnualList(elevesClasses, studentList);
                ELEVES_NCL = formatAnnualList(elevesNClasses, studentList);

                setGridRowsCL(ELEVES_CL);
                setGridRowsNCL(ELEVES_NCL);

            } else {
                chosenMsgBox = MSG_ERROR_PrRPT;
                currentUiContext.showMsgBox({
                    visible  : true, 
                    msgType  : "danger", 
                    msgTitle : t("error_M"), 
                    message  : t("report_not_yet_generated")
                })        
            }
            setModalOpen(0);      
        })  
    }

    function getTodayDate(){
        var annee = new Date().getFullYear();
        var mm    = (new Date().getMonth()+1).length==1 ? '0'+(new Date().getMonth()+1) : (new Date().getMonth()+1);
        var jj    = (new Date().getDate()).length==1 ? '0'+(new Date().getDate()) : (new Date().getDate())
        return annee+'-'+ mm+'-'+jj;
    }

    function getPrefixeRang(rang){
        if(i18n.language =='fr'){
            switch(parseInt(rang)){
                case 1 : return 'er';
                default: return 'ieme';
            }

        } else {
            switch(rang){
                case 1 : return 'st';
                case 2 : return 'nd';
                case 3 : return 'rd';
                default: return 'th';
            }
        }
    }

    const formatSeqList=(list, listEnRegle) =>{
        var pos = 1;
        console.log("en regles",list,listEnRegle);
        var matiereIndispSansNote = []
        var formattedList = []

        list.map((elt)=>{
            listElt = {};
            listElt.id         = elt.id;
            listElt.nom        = elt.nom;
            listElt.rang       = elt.rang;
            listElt.isExeco    = elt.isExeco;
            listElt.pos        = pos; 
            listElt.matricule  = elt.matricule;
            listElt.moyenne    = elt.moyenne;
            // listElt.nb_matiere_sans_notes = elt.nb_matiere_sans_notes;
            // listElt.nb_coef_manquants = elt.nb_coef_manquants;
            // listElt.nb_matiere_indispensable_sans_notes = elt.nb_matiere_indispensable_sans_notes;
            // listElt.matiere_indispensables = (elt.matiere_indispensables!= undefined) ? elt.matiere_indispensables:[];
            // listElt.matiere_indispensables.map((matiere)=> matiereIndispSansNote.push(matiere.libelle));
            // listElt.matieres_spe_manquante = matiereIndispSansNote.join(" ");

            listElt.en_regle = listEnRegle.find((elv)=>elv.matricule==elt.matricule).en_regle;
            listElt.en_regle_Header = (listElt.en_regle == true) ? t("yes") : t("no");
            formattedList.push(listElt);
            pos ++;
        })
        return formattedList;
    }


    const formatTrimList=(list, listEnRegle) =>{
        var pos = 1;        
        var notesSeq      = [];
        var formattedList = [];
        console.log("en regles",list,listEnRegle);
       
        list.map((elt)=>{
            notesSeq  = [0,0];
            listElt   = {};
            listElt.id         = elt.id;
            listElt.nom        = elt.nom;
            listElt.rang       = elt.rang; 
            listElt.isExeco    = elt.isExeco;
            listElt.pos        = pos;
            listElt.matricule  = elt.matricule;
            // listElt.moyennes_seq = elt.moyennes_seq;
            // listElt.moyennes_seq.map((nt,index)=>{notesSeq[index]=nt});
            
            listElt.moy_seq1  = elt.moy_seq1;
            listElt.moy_seq2  = elt.moy_seq2;
            listElt.moyenne   = elt.moyenne;
           
            listElt.en_regle = listEnRegle.find((elv)=>elv.matricule==elt.matricule).en_regle;
            listElt.en_regle_Header = (listElt.en_regle == true) ? t("yes") : t("no");
          
            formattedList.push(listElt);
            pos ++;
        })
        return formattedList;
    }


    const formatAnnualList=(list, listEnRegle) =>{
        var pos = 1;
        var notesTrim     = [];
        var formattedList = [];
    
        list.map((elt)=>{
            notesTrim = [0,0,0];
            listElt   = {};
            listElt.id         = elt.id;
            listElt.nom        = elt.nom;
            listElt.rang       = elt.rang;
            listElt.isExeco    = elt.isExeco; 
            listElt.pos        = pos;
            listElt.matricule  = elt.matricule;
            // listElt.moyennes_trimestre = elt.moyennes_trimestre;
            // listElt.moyennes_trimestre.map((nt, index)=>{notesTrim[index]=nt});
            
            listElt.moy_trim1  = elt.moy_trim1;
            listElt.moy_trim2  = elt.moy_trim2;
            listElt.moy_trim3  = elt.moy_trim3;
            listElt.moyenne    = elt.moyenne;

            listElt.en_regle = listEnRegle.find((elv)=>elv.matricule==elt.matricule).en_regle;
            listElt.en_regle_Header = (listElt.en_regle == true) ? t("yes") : t("no");
            
            formattedList.push(listElt);
            //rang ++;
        })
        return formattedList;
    }


    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.nom = elt.nom;
            listElt.rang = rang; 
            listElt.matricule = elt.matricule;
            listElt.date_naissance = convertDateToUsualDate(elt.date_naissance);
            listElt.lieu_naissance = elt.lieu_naissance;
            listElt.date_entree = elt.date_entree;
            listElt.nom_pere = elt.nom_pere;
            listElt.nom_pere = elt.nom_mere;           
            listElt.en_regle = elt.en_regle ;
            listElt.en_regle_Header = (elt.en_regle == true) ? t("yes") : t("no");
            listElt.nom_parent = (elt.nom_pere.length>0) ? elt.nom_pere:elt.nom_mere ;           
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    function filterEleves(e){
        var list =[]
        var enRegle = e.target.checked;      
        console.log("check", enRegle);
        setGridRowsCL(ELEVES_CL.filter((elt)=>elt.en_regle==enRegle));         
    }

    function changeBulletinType(typeBulletin){
        setTypeBulletin(typeBulletin);
        getActivatedEvalPeriods(typeBulletin);
    }

    function getTrimSequences(trimestre){
        console.log("trimestre",trimestre)
       switch(trimestre){
        case "Trimestre1": {setSeq1("1"); setSeq2("2");   return;} 
        case "Trimestre2": {setSeq1("3"); setSeq2("4");   return;}
        case "Trimestre3": {setSeq1("5"); setSeq2("6");   return;}
       }
    }

    function dropDownHandler(e){ 
        if(e.target.value != optClasse[0].value){
            console.log("valeures",e.target.value, optClasse[0].value)
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;

            PROF_PRINCIPAL = currentUiContext.currentPPList.find((elt)=>elt.id_classe == CURRENT_CLASSE_ID);

            console.log("PP:",PROF_PRINCIPAL);
   
            getStudentListOfClass(CURRENT_CLASSE_ID).then((elevesList)=>{getBulletinInfos(CURRENT_TYPE_BULLETIN_ID, CURRENT_CLASSE_ID, CURRENT_PERIOD_ID, elevesList)});

        }else{           
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setIsValid1(false);
            setIsValid2(false);
            setGridRowsCL([]);
            setGridRowsNCL([]);
        }
    }

    function dropDownTypeReportHandler(e){
        CURRENT_TYPE_BULLETIN_ID = parseInt(e.target.value);
        console.log("type bulletin",CURRENT_TYPE_BULLETIN_ID);
        console.log("PP:",PROF_PRINCIPAL);
        changeBulletinType(CURRENT_TYPE_BULLETIN_ID);    
    }

    
    function dropDownPeriodHandler(e){
        if(e.target.value != optPeriode[0].value){
            CURRENT_PERIOD_ID    = e.target.value; 
            console.log("PP:",PROF_PRINCIPAL);
            CURRENT_PERIOD_LABEL = optPeriode.find((elt)=>elt.value == CURRENT_PERIOD_ID).label;
            getBulletinInfos(CURRENT_TYPE_BULLETIN_ID, CURRENT_CLASSE_ID, CURRENT_PERIOD_ID, listEleves);           
            // if(CURRENT_CLASSE_ID!=undefined) setIsValid(true);
            // else setIsValid(false);
        }else{
            CURRENT_PERIOD_ID    = undefined;
            CURRENT_PERIOD_LABEL = ''; 
            setIsValid1(false); 
            setIsValid2(false);        
        }
    }

    // function getBulletinTypeLabel(typeBulletin){
    //     switch(typeBulletin){
    //         case 1: {setBullTypeLabel(t('bulletin_sequentiel'));   return;} 
    //         case 2: {setBullTypeLabel(t('bulletin_trimestriel'));  return;}
    //         case 3: {setBullTypeLabel(t('bulletin_annuel'));       return;}
    //        }
    // }


    function getBulletinTypeLabel(typeBulletin){
        switch(typeBulletin){
            case 1: {return(t('bulletin_sequentiel')); } 
            case 2: {return(t('bulletin_trimestriel'));}
            case 3: {return(t('bulletin_annuel'));     }
           }
    }

   
    
/*************************** DataGrid Declaration ***************************/   
    const columnsSeq = [
        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'isExeco',
            headerName: t('execo'),
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'rang',
            headerName: t('rang_M'),
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow} style={{justifyContent:"flex-start"}}>
                        <b>{params.row.rang}</b> 
                        <b style={{verticalAlign:"super", fontSize:"0.77vw"}}>{getPrefixeRang(params.row.rang)}{params.row.isExeco?" ex":null}</b>
                        
                    </div>
                )}     
        },
        
        {
            field: 'moyenne',
            headerName: t('moySeq_M'),
            width: 125,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'en_regle_Header',
            headerName:t('en_regle_M')+' ?',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
        
        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyleP,
                
        }        
    ];

    const columnsSeqNC = [

        {
            field: 'pos',
            headerName:t("N°"),
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'moyenne',
            headerName: t('moySeq_M'),
            width: 125,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'en_regle_Header',
            headerName:t('en_regle_M')+' ?',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyleNC,
                
        },
        
        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyleNC,
                
        }        
    ];


    const columnsTrim = [
        
        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'isExeco',
            headerName: t('execo'),
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'rang',
            headerName: t('rang_M'),
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow} style={{justifyContent:"flex-start"}}>
                        <b>{params.row.rang}</b> 
                        <b style={{verticalAlign:"super", fontSize:"0.77vw"}}>{getPrefixeRang(params.row.rang)}{params.row.isExeco?" ex":null}</b>
                        
                    </div>
                )}     
        },

        // {
        //     field: 'id_seq1',
        //     headerName:  t('moy_seq_M')+seq1,
        //     width: 120,
        //     editable: false,
        //     hide:true,
        //     headerClassName:classes.GridColumnStyle
        // },
    
        {
            field: 'moy_seq1',
            headerName:  t('moy_seq_M')+seq1,
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        // {
        //     field: 'id_seq2',
        //     headerName:  t('moy_seq_M')+seq1,
        //     width: 120,
        //     editable: false,
        //     hide:true,
        //     headerClassName:classes.GridColumnStyle
        // },
    
        {
            field: 'moy_seq2',
            headerName:   t('moy_seq_M')+seq2,
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'moyenne',
            headerName: t('moyTrin_M'),
            width: 127,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'en_regle_Header',
            headerName:t('en_regle_M')+' ?',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,                
        },        
        
        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle,                
        },
    
    ];
    

    const columnsTrimNC = [
        {
            field: 'pos',
            headerName: t("N°"),
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },
        
        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },
        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        // {
        //     field: 'id_seq1',
        //     headerName:  t('moy_seq_M')+seq1,
        //     width: 120,
        //     editable: false,
        //     hide:true,
        //     headerClassName:classes.GridColumnStyleNC
        // },
    
        {
            field: 'moy_seq1',
            headerName:  t('moy_seq_M')+seq1,
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        // {
        //     field: 'id_seq2',
        //     headerName:  t('moy_seq_M')+seq1,
        //     width: 120,
        //     editable: false,
        //     hide:true,
        //     headerClassName:classes.GridColumnStyleNC
        // },
    
        {
            field: 'moy_seq2',
            headerName:   t('moy_seq_M')+seq2,
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'moyenne',
            headerName: t('moyTrin_M'),
            width: 127,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'en_regle_Header',
            headerName:t('en_regle_M')+' ?',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyleNC,                
        },        
        
        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyleNC,                
        },
    
    ];
    

    const columnsYear = [
       
        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'isExeco',
            headerName: t('execo'),
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'rang',
            headerName: t('rang_M'),
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow} style={{justifyContent:"flex-start"}}>
                        <b>{params.row.rang}</b> 
                        <b style={{verticalAlign:"super", fontSize:"0.77vw"}}>{getPrefixeRang(params.row.rang)}{params.row.isExeco?" ex":null}</b>
                        
                    </div>
                )}        
        },
    
        {
            field: 'moy_trim1',
            headerName: t('moy_trim_M')+'1',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'moy_trim2',
            headerName: t('moy_trim_M')+'2',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'moy_trim3',
            headerName: t('moy_trim_M')+'3',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'moyenne',
            headerName: t('moyGen_M'),
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'en_regle_Header',
            headerName:t('en_regle_M')+' ?',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },

        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle,               
        },        
    ];

    const columnsYearNC = [
        
        {
            field: 'pos',
            headerName: t("N°"),
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },
       
        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },
        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },
    
        {
            field: 'moy_trim1',
            headerName: t('moy_trim_M')+'1',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },
    
        {
            field: 'moy_trim2',
            headerName: t('moy_trim_M')+'2',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'moy_trim3',
            headerName: t('moy_trim_M')+'3',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'moyenne',
            headerName: t('moyGen_M'),
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyleNC
        },

        {
            field: 'en_regle_Header',
            headerName:t('en_regle_M')+' ?',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyleNC,
                
        },

        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyleNC,               
        },        
    ];

/*************************** Theme Functions ***************************/
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

    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
        }
    }
    
/*************************** Handler functions ***************************/
    
    function consultRowData(row){
        var inputs=[];
       
        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[2]= row.date_naissance;
        inputs[3]= row.lieu_naissance;
        inputs[4]= row.etab_provenance;

        inputs[5]= row.nom_pere;
        inputs[6]= row.email_pere;
        inputs[7]= row.tel_pere;

        inputs[8] = row.nom_mere;
        inputs[9] = row.email_mere;
        inputs[10]= row.tel_mere;

        inputs[11]= row.id;

        inputs[12]=(row.sexe=='masculin'||row.sexe=='M')?'M':'F';
        inputs[13]= (row.redouble=='Redoublant')? 'O': 'N';

        inputs[14]= row.date_entree;

     
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);

    }

  
    const acceptHandler=()=>{
        switch(chosenMsgBox){

            case MSG_SUCCESS_PrRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING_PrRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }

            case MSG_ERROR_PrRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                setGridRowsCL([]);
                setGridRowsNCL([]);
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

            case MSG_SUCCESS_PrRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING_PrRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }

            case MSG_ERROR_PrRPT: {
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

    function getEtMatiereWithMaxProf(ETTab){
        var nbrMaxProfs = 0; var curETMatiere;
        ETTab.map((etMat)=>{
            var countCurProf = etMat.id_enseignants.length;
            if(countCurProf>nbrMaxProfs)  {
                nbrMaxProfs  = countCurProf;
                curETMatiere =  etMat; 
            }
        })

        return curETMatiere
    }

    function getMatieresWithTeachersNames(classeId){
        var cur_matiere_id, cur_matiere_label, cur_profs=[], cur_profLabel, profsMatiere = "";
        var listMatiereProf = "", matieresTraites=[];
       
        var ETClasse = currentUiContext.emploiDeTemps.filter((etData)=>etData.id_classe == classeId);
        ETClasse.map((et,index1)=>{
            cur_matiere_id = et.id_matiere;
            cur_matiere_label = currentUiContext.matiereSousEtab.find((mat)=>mat.id == cur_matiere_id).libelle;

            if(matieresTraites.find((matId)=>matId==cur_matiere_id)==undefined){
                var tabMatieres   = ETClasse.filter((et)=>et.id_matiere == cur_matiere_id);
                var  curETMatiere = getEtMatiereWithMaxProf(tabMatieres);            
                cur_profs         = (curETMatiere!= undefined) ? curETMatiere.id_enseignants:[];

                cur_profs.map((profId, index2)=>{
                    var curProf = currentUiContext.listProfs.find((prf)=>prf.id == profId);
                    cur_profLabel = curProf.nom + ' '+ curProf.prenom;
                    if(index2 >= cur_profs.length-1)
                       profsMatiere = profsMatiere + cur_profLabel;
                    else 
                       profsMatiere = profsMatiere + cur_profLabel+",";
                })

                if(index1 >= ETClasse.length-1 )
                   listMatiereProf = listMatiereProf+cur_matiere_label+"_"+profsMatiere;
                else 
                   listMatiereProf = listMatiereProf+cur_matiere_label+"_"+profsMatiere+"&";           

                matieresTraites.push(cur_matiere_id); profsMatiere = "";
            }         
      
        })
        console.log("prof & Matieres:",listMatiereProf);
        return listMatiereProf;
    }


    const printOrderedStudentReports=(e)=>{
        var elevesToPrint = [];      
       
        if(ELEVES_DATA != {}){

            if(selectedElevesIds[0].length < ELEVES_DATA.eleve_results_c.length){
                selectedElevesIds[0].map((id)=>{
                    var eleve = ELEVES_DATA.eleve_results_c.find((elv)=>elv.id == id);
                    elevesToPrint.push(eleve);
                })
            } else {
                elevesToPrint = [...ELEVES_DATA.eleve_results_c];
            }

            console.log("data to print", elevesToPrint, selectedElevesIds.length, listEleves.length);

            ElevePageSet = {};
            ElevePageSet.typeBulletin   = typeBulletin;
            ElevePageSet.isElevesclasse = true;
            ElevePageSet.profMatieres   = getMatieresWithTeachersNames(CURRENT_CLASSE_ID);
            ElevePageSet.periode        = CURRENT_PERIOD_LABEL;
            ElevePageSet.effectif       = listEleves.length;
            ElevePageSet.eleveNotes     = elevesToPrint;
            ElevePageSet.noteRecaps     = [... ELEVES_DATA.note_recap_results];
            ElevePageSet.groupeRecaps   = [... ELEVES_DATA.groupe_recap_results];
            ElevePageSet.entete_fr      = {... ELEVES_DATA.entete_fr};
            ElevePageSet.entete_en      = {... ELEVES_DATA.entete_en};
            ElevePageSet.titreBulletin  = getBulletinTypeLabel(typeBulletin)+'-'+CURRENT_PERIOD_LABEL;
            ElevePageSet.etabLogo       = "images/collegeVogt.png";
            ElevePageSet.profPrincipal  = (PROF_PRINCIPAL!=undefined)? getTitre(PROF_PRINCIPAL.sexe)+' '+PROF_PRINCIPAL.PP_nom :t("not_defined");  
            ElevePageSet.classeLabel    = CURRENT_CLASSE_LABEL; 
            printedETFileName = getBulletinTypeLabel(typeBulletin)+'_'+CURRENT_PERIOD_LABEL+'('+CURRENT_CLASSE_LABEL+').pdf';
            setModalOpen(4); 
                          
        } else{
            chosenMsgBox = MSG_WARNING_PrRPT;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "warning", 
                msgTitle : t("ATTENTION!"), 
                message  : t("must_select_class")
            })            
        }      
    }

    const printNOrderedStudentReports=(e)=>{
        var elevesToPrint = [];

        if(selectedNCElevesIds[0].length < ELEVES_DATA.eleve_results_nc.length){
            selectedNCElevesIds[0].map((id)=>{
                var eleve = ELEVES_DATA.eleve_results_nc.find((elv)=>elv.id == id);
                elevesToPrint.push(eleve);
            })
        } else {
            elevesToPrint = [... ELEVES_DATA.eleve_results_nc]
        }

        if(ELEVES_DATA != {}){

            ElevePageSet = {};
            ElevePageSet.typeBulletin   = typeBulletin;
            ElevePageSet.isElevesclasse = false;
            ElevePageSet.profMatieres   = getMatieresWithTeachersNames(CURRENT_CLASSE_ID);
            ElevePageSet.periode        = CURRENT_PERIOD_LABEL;
            ElevePageSet.effectif       = listEleves.length;
            ElevePageSet.eleveNotes     = elevesToPrint;
            ElevePageSet.noteRecaps     = [... ELEVES_DATA.note_recap_results];
            ElevePageSet.groupeRecaps   = [... ELEVES_DATA.groupe_recap_results];
            ElevePageSet.entete_fr      = {... ELEVES_DATA.entete_fr};
            ElevePageSet.entete_en      = {... ELEVES_DATA.entete_en};
            ElevePageSet.titreBulletin  = getBulletinTypeLabel(typeBulletin)+'-'+CURRENT_PERIOD_LABEL;
            ElevePageSet.etabLogo       = "images/collegeVogt.png";
            ElevePageSet.profPrincipal  = (PROF_PRINCIPAL!=undefined)? getTitre(PROF_PRINCIPAL.sexe)+' '+PROF_PRINCIPAL.PP_nom :t("not_defined");  
            ElevePageSet.classeLabel    = CURRENT_CLASSE_LABEL; 
            printedETFileName = getBulletinTypeLabel(typeBulletin)+'_'+CURRENT_PERIOD_LABEL+'('+CURRENT_CLASSE_LABEL+').pdf';
            setModalOpen(4);
                          
        } else{
            chosenMsgBox = MSG_WARNING_PrRPT;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "warning", 
                msgTitle : t("ATTENTION!"), 
                message  : t("must_select_class")
            })            
        }      
    }



    

    function getTitre(sexe){        
        if(sexe=='M') return 'Mr';
        else return 'Mme';
    }


    
    const closePreview =()=>{
        selectedElevesIds   = [];
        selectedNCElevesIds = [];
        setIsValid1(false);  
        setIsValid2(false);                 
        setModalOpen(0);
    }

    
    /********************************** JSX Code **********************************/   
    const ODD_OPACITY = 0.2;
    
    const StripedDataGrid1 = styled(DataGrid)(({ theme }) => ({
      [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
        '&.Mui-selected': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
          '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY +
                theme.palette.action.selectedOpacity +
                theme.palette.action.hoverOpacity,
            ),
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
              ),
            },
          },
        },
      },
    }));

    const StripedDataGrid2 = styled(DataGrid)(({ theme }) => ({
        [`& .${gridClasses.row}.even`]: {
          backgroundColor: '#dcb5b5',
          '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
              backgroundColor: 'transparent',
            },
          },
          '&.Mui-selected': {
            backgroundColor: '#dcb5b5',
            '&:hover, &.Mui-hovered': {
              backgroundColor: '#dcb5b5',
              // Reset on touch devices, it doesn't add specificity
              '@media (hover: none)': {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  ODD_OPACITY + theme.palette.action.selectedOpacity,
                ),
              },
            },
          },
        },
    }));
  

    return (
        <div className={classes.formStyleP}>
            
            {(modalOpen!=0) && <BackDrop/>}
            {(modalOpen==4) && 
                <PDFTemplate previewCloseHandler={closePreview} >
                    { isMobile?
                        <PDFDownloadLink fileName={printedETFileName}   
                            document = { 
                                <BulletinEleve data={ElevePageSet}/>
                            }
                        >
                            {({blob, url, loading, error})=> loading ? "loading...": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <BulletinEleve data={ElevePageSet}/>
                        </PDFViewer>  
                    }               
                </PDFTemplate>
            }
            
            {(currentUiContext.msgBox.visible == true)  && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContentP}
                    imgStyle={classes.msgBoxImgStyle}
                    buttonAcceptText = {"ok"}
                    buttonRejectText = {"non"}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />               
            }

            {(modalOpen==5) && <BackDrop/>}
            {(modalOpen==5) &&
                <div style={{ alignSelf: 'center',position:'absolute', top:'50%', fontWeight:'bolder', color:'#fffbfb', zIndex:'1207',marginTop:'-2.7vh', fontSise:'0.9vw'}}> 
                    {t('traitement')}...
                </div>                    
            }
            {(modalOpen==5) &&
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
                    top:'50%',
                    zIndex: '1200',
                    overflow: 'hidden'
                }}
                >
                    <img src='images/Loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
                </div>                    
            }

            <div className={classes.inputRow} >
                <div className={classes.formTitle}>
                    {t('print_bulletin_M')}  
                </div>
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle} style={{width:"77vw"}}> 
                                                             
                        <div className={classes.gridTitleText} style={{width:"5.7vw", fontSize:"0.87vw"}}>
                            {t('class_M')} :
                        </div>
                    
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select onChange={dropDownHandler} id='selectClass1' className={classes.comboBoxStyle} style={{width:'10.3vw', marginBottom:1, marginLeft:"-1vw"}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>
                        

                       
                            <div className={classes.gridTitleText} style={{width:"9.7vw", fontSize:"0.87vw", marginLeft:"1vw"}}>
                                {t('type_bulletin_M')} :
                            </div>
                        
                            <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                                <select onChange={dropDownTypeReportHandler} id='optTypePeriode' className={classes.comboBoxStyle} style={{width:'10.3vw', marginBottom:1, marginLeft:"-2vw"}}>
                                    {(optTypeReport||[]).map((option)=> {
                                        return(
                                            <option  value={option.value}>{option.label}</option>
                                        );
                                    })}
                                </select>                          
                            </div>
                       

                       
                            <div className={classes.gridTitleText} style={{marginLeft:'1vw',width:"5.7vw", fontSize:"0.87vw"}}>
                                {t('period_M')} :
                            </div>
                        
                            <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                                <select onChange={dropDownPeriodHandler} id='optPeriode' className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1, marginLeft:"-1vw"}}>
                                    {(optPeriode||[]).map((option)=> {
                                        return(
                                            <option  value={option.value}>{option.label}</option>
                                        );
                                    })}
                                </select>                          
                            </div>
                       
                        <div style={{display:"flex", flexDirection:"row", marginLeft:"2vw", marginRight:"-2vw" }}>
                            <input type="checkbox" onClick={filterEleves}/> 
                            <div style={{marginLeft:"0.3vw", width:"17vw"}}>{t('paid_fees')}</div>
                        </div>
 
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                        {/* {(props.formMode =="generation") &&
                            <CustomButton
                                btnText={t('criteres')}
                                hasIconImg= {true}
                                imgSrc='images/checkCriteres.png'
                                imgStyle = {classes.grdBtnImgStyleP}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyle}
                                btnClickHandler={openCriterModal}
                                disable={(isValid==false)}   
                            />
                        } */}
                      
                       
                    
                        <CustomButton                          
                            id="eleves_C"
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printOrderedStudentReports}
                            disable={(isValid1==false)}   
                        />
                    </div>
                        
                </div>
                    
                

               
                <div  id='elev-classe' className={classes.gridDisplay} >
                    {(modalOpen!=0) && <BackDrop/>}
                   
                    <StripedDataGrid1 
                       
                       
                        rows={gridRowsCL}
                        //columns={(i18n.language == 'fr') ? columnsFr : columnsEn}
                        columns={(typeBulletin == 1) ? columnsSeq : (typeBulletin == 2) ? columnsTrim : columnsYear}

                        checkboxSelection = {true}
                            
                        onSelectionModelChange={(id)=>{
                            selectedElevesIds = new Array(id);
                            if(selectedElevesIds[0].length>0) setIsValid1(true);
                            else setIsValid1(false);
                            console.log("selections",selectedElevesIds);
                        }}


                        getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : (params.field==='rang')? classes.gridRangRowStyle:classes.gridRowStyle }
                        /*onCellClick={handleDeleteRow}
                        onRowClick={(params,event)=>{
                            if(event.ignore) {
                                //console.log(params.row);
                                handleEditRow(params.row)
                            }
                        }}*/  
                        
                        // onRowDoubleClick ={(params, event) => {
                        //     event.defaultMuiPrevented = true;
                        //     consultRowData(params.row)
                        // }}
                        
                        //loading={loading}
                        //{...data}
                        sx={{
                            //boxShadow: 2,
                            //border: 2,
                            //borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                                border:0,
                                borderColor:'none'
                            },
                            
                        }}
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even ' + classes.gridRowStyle : 'odd '+ classes.gridRowStyle
                        }
                    />
                </div>

                {gridRowsNCL.length > 0 && 
                    <div style={{width:"100%", fontSize:"0.9vw", fontWeight:"800", display:'flex', flexDirection:'row', marginTop:'1.3vh', marginBottom:'0.3vh', justifyContent:'space-between', borderBottom:'solid', borderBottomWidth:2}} >
                        <div style={{display:'flex', flexDirection:'row',justifyContent:'flex-start'}}>
                            <img src={'images/' + getPuceByTheme()} className={classes.PuceStyle}/>
                            {t("ELEVES NON CLASSES (ORDRE ALPHABETIQUE) ")}
                        </div>
                        
                            
                        <div className={classes.gridAction}> 
                            <CustomButton
                                key="eleves_NC"
                                id="eleves_NC"
                                btnText={t('imprimer')}
                                hasIconImg= {true}
                                imgSrc='images/printing1.png'
                                imgStyle = {classes.grdBtnImgStyle}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyle}
                                btnClickHandler={printNOrderedStudentReports}
                                disable={(isValid2==false)}   
                            />
                        </div>
                    </div>
                }
            
                {gridRowsNCL.length > 0 && 
                    <div  id='elev-non-classe' className={classes.gridDisplay} style={{maxHeight:'23vh'}} >
                        {(modalOpen!=0) && <BackDrop/>}
                    
                        <StripedDataGrid2
                            rows={gridRowsNCL}
                            //columns={(i18n.language == 'fr') ? columnsFr : columnsEn}
                            columns={(typeBulletin == 1) ? columnsSeqNC : (typeBulletin == 2) ? columnsTrimNC : columnsYearNC}

                            checkboxSelection = {true}
                                
                            onSelectionModelChange={(id)=>{
                                selectedNCElevesIds = new Array(id);
                                if(selectedNCElevesIds[0].length>0) setIsValid2(true);
                                else setIsValid2(false);
                                console.log("selections",selectedNCElevesIds);
                            }}


                            getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                            /*onCellClick={handleDeleteRow}
                            onRowClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    handleEditRow(params.row)
                                }
                            }}*/  
                            
                            // onRowDoubleClick ={(params, event) => {
                            //     event.defaultMuiPrevented = true;
                            //     consultRowData(params.row)
                            // }}
                            
                            //loading={loading}
                            //{...data}
                            sx={{
                                //boxShadow: 2,
                                //border: 2,
                                //borderColor: 'primary.light',
                                '& .MuiDataGrid-cell:hover': {
                                    color: 'primary.main',
                                    border:0,
                                    borderColor:'none'
                                },
                                
                            }}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even ' + classes.gridRowStyle : 'odd '+ classes.gridRowStyle
                            }
                        />
                    </div>
                }
            
            </div>
        </div>
        
    );
} 
export default PrintStudentReport;