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

import { PDFViewer } from '@react-pdf/renderer';
import PDFTemplate from '../reports/PDFTemplate';
import CritSequentiel from '../modals/CritSequentiel';
import ResultatsGeneration from '../modals/ResultatsGeneration';
import BulletinSequence from '../reports/BulletinSequence';
import {useTranslation} from "react-i18next";



var chosenMsgBox;
const MSG_SUCCESS_NOTES =11;
const MSG_WARNING_NOTES =12;
const MSG_ERROR_NOTES   =13;

var CURRENT_ANNEE_SCOLAIRE;

let CURRENT_CLASSE_ID;
let CURRENT_PERIOD_ID;
let CURRENT_PERIOD_LABEL;
let CURRENT_CLASSE_LABEL;
var selectedElevesIds = new Array();

var listElt    = {};
var listEleves = [];
var pageSet    = [];

var page = {
    pageTitle:'',
    pageRows:[],
    pageNumber:0,
}

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const ROWS_PER_PAGE= 40;
var ElevePageSet={};

var tabSequences    = [];
var tabTrimestres   = [];
var tabCurrentAnnee = [];

var LIST_SEQUENCE   = [];
var LIST_TRIMESTRES = [];

var periodes_considerees = [];
var classer   = [];
var enCompte1 = [];
var enCompte2 = [];
var enCompte3 = [];


function GenStudentReport(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const [isValid, setIsValid] = useState(false);
    const [canGenerate, setCanGenerate] = useState(false);
    const [gridRows, setGridRows]   = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse]  = useState([]);
    const [optPeriode, setOptPeriode]     = useState([]);
    const [typeBulletin, setTypeBulletin] = useState(1);
    const [seq1, setSeq1] = useState("1");
    const [seq2, setSeq2] = useState("2");
    const [optOuiNon,setOptOuiNon] = useState([]);
    const selectedTheme = currentUiContext.theme;

    const tabPeriode =[
        {value:0, label:(i18n.language=='fr') ? ' Choisir une periode ' :'  Select a period  '},
        {value:1, label:' sequence '},
        {value:2, label:' Trimestre '},
        {value:3, label:' Annuel '},

    ]

    const tabOuiNon =[
        {value:1, label: t('yes')},
        {value:0, label: t('no') },
    ]

    useEffect(()=> {
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        setOptOuiNon(tabOuiNon);
       
        getActivatedSequences();
        getActivatedTrimestres();
        getActivatedAnnee();

        getActivatedEvalPeriods(1);

        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
            CURRENT_PERIOD_ID = undefined;
        }

        getEtabListClasses();
      
        
    },[]);

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

    function getTodayDate(){
        var annee = new Date().getFullYear();
        var mm  = (new Date().getMonth()+1).length==1 ? '0'+(new Date().getMonth()+1) : (new Date().getMonth()+1);
        var jj = (new Date().getDate()).length==1 ? '0'+(new Date().getDate()) : (new Date().getDate())
        return annee+'-'+ mm+'-'+jj;
    }

    const  getClassStudentList=(classId)=>{
        listEleves = []
        axiosInstance.post(`eleves-situation-financiere/`, {
            id_classe: classId,
            date_limite:getTodayDate()
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data.eleves)]
            console.log(listEleves);
            //setGridRows(listEleves);
            //console.log(gridRows);
        })  
        return listEleves;     
    }

    function getClassNoteSequence(classId, periode){
        // listEleves = []
        // axiosInstance.post(`eleves-notes-sequence/`, {
        //     id_classe: classId,
        //     id_periode: periode

        // }).then((res)=>{
        //     console.log(res.data);
        //     listEleves = [...formatList(res.data.eleves)]
        //     console.log(listEleves);
        //     //setGridRows(listEleves);
        //     //console.log(gridRows);
        // })  
        // return listEleves;  
        setGridRows(dataSeq);
    }

    function getClassNotesTrimestre(classId, periode){
        // listEleves = []
        // axiosInstance.post(`eleves-notes-trimestre/`, {
        //     id_classe: classId,
        //     id_periode: periode

        // }).then((res)=>{
        //     console.log(res.data);
        //     listEleves = [...formatList(res.data.eleves)]
        //     console.log(listEleves);
        //     //setGridRows(listEleves);
        //     //console.log(gridRows);
        // })  
        // return listEleves; 
        dataTrim.map((elt)=>{
            enCompte1.push(elt.id_seq1);
            enCompte2.push(elt.id_seq2);
            classer.push(1);
        })
        setGridRows(dataTrim);
    }

    function getClassNotesAnnee(classId, periode){
        // listEleves = []
        // axiosInstance.post(`eleves-notes-annee/`, {
        //     id_classe : classId,
        //     id_periode: periode,
            
        // }).then((res)=>{
        //     console.log(res.data);
        //     listEleves = [...formatList(res.data.eleves)]
        //     console.log(listEleves);
        //     //setGridRows(listEleves);
        //     //console.log(gridRows);
        // })  
        // return listEleves; 
        
        dataAnnee.map((elt)=>{
            enCompte1.push(elt.id_trim1);
            enCompte2.push(elt.id_trim2);
            enCompte3.push(elt.id_trim3);
            classer.push(1);
        })        
        setGridRows(dataAnnee);
    }


    function getStudentGenerationInfo(classeId, periode, typeBulletin){
        enCompte1 = []; enCompte2 = []; enCompte3 = []; classer = [];
        if(classeId!=undefined && periode!=undefined) {
            switch(typeBulletin){
                case 1 : {
                    getClassNoteSequence(classeId, periode);
                    return;
                }
    
                case 2 : {
                    getClassNotesTrimestre(classeId, periode);
                    return;
                    
                }
    
                case 3 : {
                    getClassNotesAnnee(classeId, periode);
                    return;
                }
            }

        }
       
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
        setGridRows(listEleves.filter((elt)=>elt.en_regle==enRegle));         
    }

    function changeBulletinType(typeBulletin){
        setTypeBulletin(typeBulletin);
        getActivatedEvalPeriods(typeBulletin);
        getStudentGenerationInfo(CURRENT_CLASSE_ID,CURRENT_PERIOD_ID,typeBulletin);
    }

    function getActivatedSequences(){
        var tempTable=[];
        
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
        })
        
    }

    function getActivatedTrimestres(){
        var tempTable = []
              
        axiosInstance.post(`list-trimestres/`, {
            id_sousetab: currentAppContext.currentEtab,
            id_trimestre:""
        }).then((res)=>{    
            tabTrimestres = [];               
            tempTable = [...res.data];                         
            tempTable.map((seq)=>{
                if(seq.is_active == true){
                    tabTrimestres.push({value:seq.id, label:seq.libelle});
                    LIST_TRIMESTRES.push(seq);
                }                              
            })
        })
    }

    function getActivatedAnnee(){
        tabCurrentAnnee = [{value: 0,      label: t("annee")+ ' '+ CURRENT_ANNEE_SCOLAIRE  }]       
    }


    function getActivatedEvalPeriods(typebultin){       
        switch(typebultin){
            case 1: {setOptPeriode(tabSequences);       return;} 
            case 2: {setOptPeriode(tabTrimestres);      return;}
            case 3: {setOptPeriode(tabCurrentAnnee);    return;}
        }    
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
            setCanGenerate(true);
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            CURRENT_PERIOD_ID = optPeriode[0].value;
            console.log("chargement",CURRENT_CLASSE_ID,CURRENT_PERIOD_ID,typeBulletin);
            getStudentGenerationInfo(CURRENT_CLASSE_ID,CURRENT_PERIOD_ID,typeBulletin);
        }else{
            setCanGenerate(false);
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setIsValid(false);
            setGridRows([]);
        }
    }

    
    function dropDownPeriodHandler(e){
        // if(e.target.value != optPeriode[0].value){
            CURRENT_PERIOD_ID = e.target.value; 
            if(typeBulletin==2){
                CURRENT_PERIOD_LABEL = optPeriode.find((elt)=>elt.value == CURRENT_PERIOD_ID).label;
                getTrimSequences(CURRENT_PERIOD_LABEL);
            }
            getStudentGenerationInfo(CURRENT_CLASSE_ID,CURRENT_PERIOD_ID,typeBulletin);
           
        // }else{
        //     CURRENT_PERIOD_ID = undefined;
        //     if(isValid)  setIsValid(false);
        // }
    }


    
/*************************** DataGrid Declaration ***************************/    
/*---DATA*/

var dataSeq   = [
    {rang:1, id:123, matricule:"HT25647R3", nom:"Mballa alphonse",        moyenne:"11.75", nb_max_matieres_sans_note:"2", classserl:"1", classser:'2' },
    {rang:2, id:124, matricule:"HT25647S3", nom:"Mbombo njoya armel",     moyenne:"11.75", nb_max_matieres_sans_note:"0", classserl:"3", classser:'2' },
    {rang:3, id:125, matricule:"HT25645V7", nom:"Mndeng salome huguette", moyenne:"11.75", nb_max_matieres_sans_note:"1", classserl:"5", classser:'3'},
];

var dataTrim  = [
    {rang:1, id:123, matricule:"HT25647R3", nom:"Mballa alphonse",        id_seq1:1, moy_seq1:"11.75",  id_seq2:2, moy_seq2:"12.5",  enCompte1:'1',enCompte2:'2', toBeClassed:1},
    {rang:2, id:125, matricule:"HT25647S3", nom:"Mbombo njoya armel",     id_seq1:1, moy_seq1:"07.75",  id_seq2:2, moy_seq2:"13.75", enCompte1:'1',enCompte2:'2', toBeClassed:1},
    {rang:3, id:126, matricule:"HT25645V7", nom:"Mndeng salome huguette", id_seq1:1, moy_seq1:"15.75",  id_seq2:2, moy_seq2:"12.75", enCompte1:'1',enCompte2:'2', toBeClassed:1},
];

var dataAnnee = [
    {rang:1, id:124, matricule:"HT25647R3", nom:"Mballa alphonse",        id_trim1:1, moy_trim1:"11.75", id_trim2:2, moy_trim2:"12.75", id_trim3:3, moy_trim3:"07.5", enCompte:'1²²2²²3', toBeClassed:1},
    {rang:2, id:125, matricule:"HT25647S3", nom:"Mbombo njoya armel",     id_trim1:1, moy_trim1:"11.75", id_trim2:2, moy_trim2:"12.75", id_trim3:3, moy_trim3:"08.5", enCompte:'1²²2²²3', toBeClassed:1},
    {rang:3, id:126, matricule:"HT25645V7", nom:"Mndeng salome huguette", id_trim1:1, moy_trim1:"11.75", id_trim2:2, moy_trim2:"12.75", id_trim3:3, moy_trim3:"05.5", enCompte:'1²²2²²3', toBeClassed:1},
];



const columnsSeq = [
    {
        field: 'rang',
        headerName: "N°",
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

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
        field: 'moyenne',
        headerName: t('moySeq_M'),
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'nb_max_matieres_sans_note',
        headerName: t('matiere_sans_note_M'),
        width: 170,
        editable: false,
        headerClassName:classes.GridColumnStyleP,                
    },

    {
        field: 'classerl',
        headerName: t('coef_manquants_M'),
        width: 170,
        editable: false,
        headerClassName:classes.GridColumnStyleP,                
    },

    {
        field: 'classer',
        headerName: t('matieres_spe_manquante_M'),
        width: 170,
        editable: false,
        headerClassName:classes.GridColumnStyleP,                
    },

    
    {
        field: 'id',
        headerName: '',
        width: 15,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyleP,
         
        },
    ];

    const columnsTrim = [
        {
            field: 'rang',
            headerName: "N°",
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
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
            field: 'id_seq1',
            headerName:  t('moy_seq_M')+seq1,
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'moy_seq1',
            headerName:  t('moy_seq_M')+seq1,
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'id_seq2',
            headerName:  t('moy_seq_M')+seq1,
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'moy_seq2',
            headerName:   t('moy_seq_M')+seq2,
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'considered_seq',
            headerName: t('considered_seq'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow}>
                        <div style={{display:"flex",flexDirection:"row"}}>
                            <input id={params.row.id_seq1} type='checkbox' defaultChecked={true} onClick={(e)=>{(e.target.checked) ? enCompte1[params.row.rang-1] = params.row.id_seq1:enCompte1[params.row.rang-1]=""}}/>
                            <div>{"Seq"+seq1}</div>
                        </div>
                        <div style={{marginLeft:"1.7vw",display:"flex",flexDirection:"row"}}>
                            <input id={params.row.id_seq2} type='checkbox' defaultChecked={true} onClick={(e)=>{(e.target.checked) ? enCompte2[params.row.rang-1] = params.row.id_seq1:enCompte2[params.row.rang-1]=""}}/>
                            <div>{"Seq"+seq2}</div>
                        </div>
                    </div>
                )
            }           
                
        },

        { 
            field: 'classer',
            headerName: t('class_student_M'),
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow}>
                        <select onChange={(e)=>{classer[params.row.rang-1] = e.target.value}} id='a_changer' className={classes.comboBoxStyle} style={{width:'4.3vw'}}>
                                {(optOuiNon||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                        </select>
                    </div>
                )
            }           
                
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
    
    

    const columnsYear = [
       
        {
            field: 'rang',
            headerName: "N°",
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

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
            field: 'moy_trim1',
            headerName: t('moy_trim_M')+'1',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'moy_trim2',
            headerName: t('moy_trim_M')+'2',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'moy_trim3',
            headerName: t('moy_trim_M')+'3',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'considered_trim',
            headerName: t('considered_trim'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow}>
                        <div style={{display:"flex",flexDirection:"row"}}>
                            <input id={params.row.id_trim1} type='checkbox' defaultChecked={true} onClick={(e)=>{(e.target.checked) ? enCompte1[params.row.rang-1] = params.row.id_trim1:enCompte1[params.row.rang-1]=""}}/>
                            <div>{"Trim1"}</div>
                        </div>
                        <div style={{marginLeft:"1.7vw",display:"flex",flexDirection:"row"}}>
                            <input id={params.row.id_trim2} type='checkbox' defaultChecked={true} onClick={(e)=>{(e.target.checked) ? enCompte2[params.row.rang-1] = params.row.id_trim2:enCompte2[params.row.rang-1]=""}}/>
                            <div>{"Trim2"}</div>
                        </div>
                        <div style={{marginLeft:"1.7vw",display:"flex",flexDirection:"row"}}>
                            <input id={params.row.id_trim3} type='checkbox' defaultChecked={true} onClick={(e)=>{(e.target.checked) ? enCompte3[params.row.rang-1] = params.row.id_trim3:enCompte3[params.row.rang-1]=""}}/>
                            <div>{"Trim3"}</div>
                        </div>
                    </div>
                )
            }
                
        },

        {
            field: 'classser',
            headerName: t('class_student_M'),
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow}>
                        <select onChange={(e)=>{classer[params.row.rang-1] = e.target.value}} id='a_changer' className={classes.comboBoxStyle} style={{width:'4.3vw'}}>
                                {(optOuiNon||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                        </select>
                    </div>
                )
            }
                
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
    
/*************************** Handler functions ***************************/
    function initFormInputs(){
        var inputs=[];
        inputs[0] = '';
        inputs[1] = '';
        inputs[2] = '';
        inputs[3] = '';
        inputs[4] = '';
        inputs[5] = '';       
        inputs[6] = '';
        inputs[7] = '';        
        inputs[8] = '';
        inputs[9] = '';
        inputs[10]= '';
        inputs[11]= '';
        inputs[12]='';
        inputs[13]= '';
       
        currentUiContext.setFormInputs(inputs)
    }

    function handleEditRow(row){       
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

        console.log("laligne",row);
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

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

            case MSG_SUCCESS_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING_NOTES: {
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

    const rejectHandler=()=>{
        
    }

    const printStudentList=()=>{
        if(CURRENT_CLASSE_ID != undefined){           
            setModalOpen(5);
            let formData = new FormData();
           
            formData.append('id_classe',CURRENT_CLASSE_ID);
            formData.append('id_sequence',CURRENT_PERIOD_ID);
            formData.append('id_eleves',selectedElevesIds[0].join('_'));

            const config = {headers:{'Content-Type':'multipart/form-data'}};
            axiosInstance
            .post(`imprimer-bulletin-classe/`,formData,config)
            .then((response) => {  
               // setModalOpen(0);              
                ElevePageSet={};
                ElevePageSet.effectif = listEleves.length;
                ElevePageSet.eleveNotes = [... response.data.eleve_results];
                ElevePageSet.noteRecaps = [... response.data.note_recap_results];
                ElevePageSet.groupeRecaps = [... response.data.groupe_recap_results];
                ElevePageSet.entete_fr ={... response.data.entete_fr};
                ElevePageSet.entete_en ={... response.data.entete_en};
                ElevePageSet.titreBulletin ={... response.data.titre_bulletin};
                ElevePageSet.etabLogo = "images/collegeVogt.png";
                ElevePageSet.profPrincipal = 'MESSI Martin';
                ElevePageSet.classeLabel = CURRENT_CLASSE_LABEL;                
                console.log("ici la",ElevePageSet,gridRows);  
                setModalOpen(4);               
            })          
                          
        } else{
            chosenMsgBox = MSG_WARNING;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "warning", 
                msgTitle : t("ATTENTION!"), 
                message  : t("must_select_class")
            })            
        }      
    }

    const closePreview =()=>{
        selectedElevesIds =[];
        setIsValid(false);                 
        setModalOpen(0);
    }

    function genSeqBulletin(criteria){
        console.log("criteres",criteria, CURRENT_PERIOD_ID);
        //-- A ACTIVER LE MOMENT VENU
        // setModalOpen(5);
        // axiosInstance.post(`generer-bulletin-classe/`, {
        //     id_sousetab : currentAppContext.currentEtab,
        //     id_classe   : CURRENT_CLASSE_ID,
        //     id_sequence : CURRENT_PERIOD_ID,
        //     id_matieres_ne_pouvant_manquer : criteria.id_matieres_ne_pouvant_manquer,
        //     nb_max_matieres_sans_note      : criteria.nb_max_matieres_sans_note,
        //     nb_max_coefs_manquants         : criteria.nb_max_coefs_manquants                       
        // }).then((res)=>{
        //     setModalOpen(1);    
            
        //     // chosenMsgBox = MSG_WARNING_NOTES;
        //     // currentUiContext.showMsgBox({
        //     //     visible:true, 
        //     //     msgType:"info", 
        //     //     msgTitle:t("error_M"), 
        //     //     message:t("no_activated_period")
        //     // })       
           
        // })
    }

    function genTrimBulletin(){
        var id_eleves = []; periodes_considerees = [];        

        if(gridRows.length>0){
            gridRows.map((elt, index)=>{
                id_eleves.push(elt.id);
                periodes_considerees[index] = (enCompte1[index].length==0)?  
                enCompte2[index] 
                :(enCompte2[index].length==0) ? 
                enCompte1[index] 
                : enCompte1[index] +'²²'+ enCompte2[index];
            });

            var eleves_ids     =  id_eleves.join('²²');
            var seq_consideree =  periodes_considerees.join('&');
            var toBeClassed    =  classer.join('²²');

            console.log("data",eleves_ids,seq_consideree, toBeClassed);

            setModalOpen(6);
            // axiosInstance.post(`generer-bulletin-trimestre-classe/`, {
            //     id_sousetab  : currentAppContext.currentEtab,
            //     id_classe    : CURRENT_CLASSE_ID,
            //     id_trimestre : CURRENT_PERIOD_ID,
            //     id_eleves    : eleves_ids,              
            //     periodes_considerees : seq_consideree,
            //     classer      : toBeClassed
            // }).then((res)=>{
            //     setModalOpen(2);    
            
            
            // })
        }
    }

    function getListTrimCons(trim1,trim2,trim3){
        if(trim1.length==0){
            if(trim2.length==0){
                if(trim3.length==0)return '';
                else return trim3;
            } else {
                if(trim3.length==0) return trim2
                else return trim2+'²²'+trim3
            }
        } else{
            if(trim2.length==0){
                if(trim3.length==0)return trim1;
                else return trim1+'²²'+trim3;
            } else {
                if(trim3.length==0) return trim1+'²²'+trim2
                else return trim1+'²²'+trim2+'²²'+trim3
            }
        }

    }

    function genYearBulletin(){
        var id_eleves = []; periodes_considerees = [];        

        if(gridRows.length>0){
            gridRows.map((elt, index)=>{
                id_eleves.push(elt.id);
                periodes_considerees[index] = getListTrimCons(enCompte1[index], enCompte2[index], enCompte3[index]);
                
            });

            var eleves_ids      =  id_eleves.join('²²');
            var trim_consideree =  periodes_considerees.join('&');
            var toBeClassed     =  classer.join('²²');

            console.log("data",eleves_ids,trim_consideree, toBeClassed);

            setModalOpen(6);
            // axiosInstance.post(`generer-bulletin-annee-classe/`, {
            //     id_sousetab          : currentAppContext.currentEtab,
            //     id_classe            : CURRENT_CLASSE_ID,
            //     id_trimestre         : CURRENT_PERIOD_ID,
            //     id_eleves            : eleves_ids,              
            //     periodes_considerees : trim_consideree,
            //     classer              : toBeClassed
            // }).then((res)=>{
            //     console.log(res)
            //     setModalOpen(2);    
            // })
        }
        setModalOpen(6);
        axiosInstance.post(`generer-bulletin-annee-classe/`, {
            id_sousetab : currentAppContext.currentEtab,
            id_classe   : CURRENT_CLASSE_ID,
        }).then((res)=>{
            console.log(res)
            setModalOpen(3);    
           
        })
    }


    const generateBulletinHandler=(criteria)=>{       
        switch(typeBulletin){
            case 1:{
                if(criteria=="none") setModalOpen(3);
                else genSeqBulletin(criteria);
                return;
            }            

            case 2:{
                genTrimBulletin();
               return;
            }

            case 3:{
                genYearBulletin();
                return;
            }
        }
    }
 
    /********************************** JSX Code **********************************/   
    const ODD_OPACITY = 0.2;
    
    const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
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

    return (
        <div className={classes.formStyleP}>
            
            {(modalOpen!=0) && <BackDrop/>}
            {(modalOpen==4) && <PDFTemplate previewCloseHandler={closePreview}><PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}><BulletinSequence data={ElevePageSet}/></PDFViewer></PDFTemplate>} 
            
            {(currentUiContext.msgBox.visible == true)  && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
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

             {(modalOpen==6) &&  
                <ResultatsGeneration
                    typeBulletin     = {typeBulletin}
                    bullPeriodeLabel = {optPeriode[0].label}
                    annee            = {CURRENT_ANNEE_SCOLAIRE}
                    classeId         = {CURRENT_CLASSE_ID}  
                    tabPeriodes      = {[]}
                    cancelHandler    = {()=>setModalOpen(0)}
                    generateHandler  = {generateBulletinHandler}
                /> 
            }  


            <div className={classes.inputRow}>                
                <div className={classes.formTitle}>
                    {t('Gen_bulletin_M')}   
                </div>
                   
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle} style={{width:"77vw"}}>                  
                        <div className={classes.gridTitleText} style={{width:"5.7vw", fontSize:"0.87vw"}}>
                            {t('class_M')} :
                        </div>
                      
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select onChange={dropDownHandler} id='selectClass1' className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1, marginLeft:"-1vw"}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>

                        
                        <div style={{display:"flex", flexDirection:"row",justifyContent:"space-evenly", width:"30vw", borderRadius:3, border:"solid 1px gray", marginLeft:"1vw", marginBottom:"0.3vh"}}>
                            
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <input type="radio" name="type_bulletin" checked={typeBulletin==1} onClick={()=>{changeBulletinType(1)}}/>
                                <div style={{fontSize:"0.83vw", fontWeight:'bolder',marginLeft:"0.17vw"}}>{t('bulletin_sequentiel')}</div>
                            </div>

                            <div style={{marginLeft:"1vw", display:"flex", flexDirection:"row"}}>
                                <input type="radio" name="type_bulletin" checked={typeBulletin==2} onClick={()=>{changeBulletinType(2)}}/>
                                <div style={{fontSize:"0.83vw", fontWeight:'bolder',marginLeft:"0.17vw"}}>{t('bulletin_trimestriel')}</div>
                            </div>

                            <div style={{marginLeft:"1vw", display:"flex", flexDirection:"row"}}>
                                <input type="radio" name="type_bulletin" checked={typeBulletin==3} onClick={()=>{changeBulletinType(3)}}/>
                                <div style={{fontSize:"0.83vw", fontWeight:'bolder',marginLeft:"0.17vw"}}>{t('bulletin_annuel')}</div>
                            </div>
                        </div>

                        <div className={classes.gridTitleText} style={{marginLeft:'1vw',width:"5.7vw", fontSize:"0.87vw"}}>
                            {t('period_M')} :
                        </div>
                      
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select onChange={dropDownPeriodHandler} id='optPeriode' className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1, marginLeft:"-1vw"}}>
                                {(optPeriode||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
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
                            btnText= {t('generate')}
                            hasIconImg= {true}
                            imgSrc='images/engrenage1.png'
                            imgStyle = {classes.grdBtnImgStyleP}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>generateBulletinHandler("none")}
                            disable={(canGenerate==false)}   
                        />                      
                       
                    </div>
                        
                </div>
                    
                

               
                <div className={classes.gridDisplay} >
                    {(modalOpen!=0) && <BackDrop/>}
                    {(modalOpen==3) &&  
                        <CritSequentiel 
                            classeId={CURRENT_CLASSE_ID}  
                            cancelHandler   = {()=>setModalOpen(0)}
                            generateHandler = {generateBulletinHandler}
                        />
                    } 
                    <StripedDataGrid
                        rows={gridRows}
                        columns={(typeBulletin == 1) ? columnsSeq : (typeBulletin == 2) ? columnsTrim : columnsYear}

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
            
            </div>
        </div>
        
    );
} 
export default GenStudentReport;