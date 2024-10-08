import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import LoadingView from '../../../loadingView/LoadingView';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, createBulletinToPrintData, getMatieresWithTeachersNames,ajouteZeroAuCasOu, darkGrey} from '../../../../store/SharedData/UtilFonctions';

import {isMobile} from 'react-device-detect';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFTemplate from '../reports/PDFTemplate';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import CritSequentiel from '../modals/CritSequentiel';
import ResultatsGeneration from '../modals/ResultatsGeneration';
import BulletinEleve from '../reports/BulletinEleve';
import {useTranslation} from "react-i18next";



var chosenMsgBox;
const MSG_SUCCESS_GENRPT = 11;
const MSG_WARNING_GENRPT = 12;
const MSG_ERROR_GENRPT   = 13;

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

var ELEVES_DATA;
var ElevePageSet={};
var printedETFileName ='';

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

var ELEVES_C_TO_PRINT;
var ELEVES_NC_TO_PRINT;
var PROF_PRINCIPAL     = undefined;
var listMatiereEtProfs = '';



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
    const [elevesCL, setEleveCL] = useState([]);
    const [elevesNCL,setEleveNCL] = useState([]);
    const [bullTypeLabel, setBullTypeLabel] = useState();
    const[imageUrl, setImageUrl] = useState('');
    const selectedTheme = currentUiContext.theme;

    var firstItem = {
        value: -1,   
        label:'-----'+ t('choisir') +'-----'
    }

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

        var cnv = document.getElementById('output');
        while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
        var cnx = cnv.getContext('2d');
        var url = darkGrey(document.getElementById("logo_url").value,cnv,cnx);
        setImageUrl(url);
        
    },[]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;




    const getEtabListClasses=()=>{
        var tempTable=[{value: '0',      label: (i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '  }];
        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
        console.log(classes)
        let classes_user;
        if(currentAppContext.infoUser.is_pp){
            if(currentAppContext.infoUser.is_prof_only) 
                classes_user = currentAppContext.infoUser.pp_classes;
            else{
                // On verifie que admin_classes inclut pp_classes sinon on lui ajoute pp_classes
                classes_user = currentAppContext.infoUser.admin_classes;
                let pp_classes = currentAppContext.infoUser.pp_classes;
                // console.log(pp_classes)
                pp_classes.forEach(classe => {
                    if((classes_user.filter( cl => cl.id === classe.id)).length<=0)
                        classes_user.push({"id":classe.id,"libelle":classe.libelle})

                });
            }
        }
        else{
            classes_user = currentAppContext.infoUser.admin_classes;
        }
            
        // classes_user.forEach(classe => {
        // console.log(classe.id);
        // if((classes.filter( cl => cl.id_classe === classe.id)).length>0){
        //     // classes_user.push({"id":classe.id,"libelle":classe.libelle})
        //     tempTable.push({value:classe.id, label:classe.libelle})
        // }

        // });
    let n = classes_user.length;
       let m = classes.length;
       let i = 0;
       let j = 0;
    //    console.log("classes_user: ",classes_user)
       while(i<n){
        j = 0;
        while(j<m){
            if(classes_user[i].id==classes[j].id_classe){
                tempTable.push({value:classes_user[i].id, label:classes_user[i].libelle})
                break;
            }
            j++;
        }
        i++;
       }
           
        setOpClasse(tempTable);
    }

    function getStudentGenerationInfo(classeId, periode, typeBulletin){
        var type_generation = 'sequence';

        console.log("classe,periode",classeId, periode);

        switch(typeBulletin){
            case 1 : {
                type_generation = 'sequence';
                break;
            }

            case 2 : {
                type_generation = 'trimestre';
                break;
                
            }
            case 3 : {
                type_generation = 'annuel';
                break;
            }
        }

        if(classeId>0 && periode>0) {
            setModalOpen(5)
            axiosInstance.post('list-eleves-pour-generation-bulletins/', {
                type_generation : type_generation,
                id_classe       : classeId,
                id_sousetab     : currentAppContext.currentEtab,
                id_periode      : periode,
                
            }).then((res)=>{
                console.log("les eleves",res.data);
                setModalOpen(0);

                switch(typeBulletin){
                    case 1 : {
                        listEleves = formatSeqList(res.data.res);
                        break;
                    }
        
                    case 2 : {
                        listEleves = formatTrimList(res.data.res, res.data.periode);
                        break;                        
                    }
        
                    case 3 : {
                        listEleves = formatAnnualList(res.data.res, res.data.periode);
                        break;
                    }
                }
                setGridRows(listEleves);
            })

        }
       
    }


    const formatSeqList=(list) =>{
        var rang = 1;
        var matiereIndispSansNote = []
        var formattedList = []

        list.map((elt)=>{
            listElt={};
            listElt.id        = elt.id_eleve;
            listElt.nom       = elt.nom;
            listElt.rang      = ajouteZeroAuCasOu(rang); 
            listElt.matricule = elt.matricule;
            listElt.moyenne   = elt.moyenne;
            listElt.nb_matiere_sans_notes = elt.nb_matiere_sans_notes;
            listElt.nb_coef_manquants = elt.nb_coef_manquants;
            listElt.nb_matiere_indispensable_sans_notes = elt.nb_matiere_indispensable_sans_notes;
            listElt.matiere_indispensables = elt.matiere_indispensables;
            elt.matiere_indispensables.map((matiere)=> matiereIndispSansNote.push(matiere.libelle));
            listElt.matieres_spe_manquante = matiereIndispSansNote.join(" ");
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }


    const formatTrimList=(list, listSeqId) =>{
        var rang = 1;        
        var notesSeq      = [];
        var classerSeq    = [];
        var formattedList = [];
        enCompte1 = []; enCompte2 = [];  classer = [];

        list.map((elt)=>{
            notesSeq             = [0,0];
            classerSeq           = [true,true];
            listElt              ={};
            listElt.id           = elt.id_eleve;
            listElt.nom          = elt.nom;
            listElt.rang         = ajouteZeroAuCasOu(rang); 
            listElt.matricule    = elt.matricule;
            listElt.moyennes_seq = elt.moyennes_seq;
            listElt.moyennes_seq.map((nt,index)=>{notesSeq[index]=nt});
            
            listElt.moy_seq1     = notesSeq[0];
            listElt.id_seq1      = listSeqId[0];

            listElt.moy_seq2     = notesSeq[1];
            listElt.id_seq2      = listSeqId[1];
            
            listElt.classees_seq = elt.classees_seq;
            listElt.classees_seq.map((el,index)=>classerSeq[index]=el);

            listElt.classer_seq1 = classerSeq[0];
            listElt.classer_seq2 = classerSeq[1];

            enCompte1.push(listSeqId[0]);
            enCompte2.push(listSeqId[1]);

            classer.push(1);
                       
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }


    const formatAnnualList=(list,listTrimId) =>{
        var rang = 1;
        var notesTrim     = [];
        var classerTrim   = [];
        var formattedList = [];
        enCompte1 = []; enCompte2 = []; enCompte3 = []; classer = [];

        list.map((elt)=>{
            notesTrim = [0,0,0];
            classerTrim = [true,true,true];
            listElt={};
            listElt.id   = elt.id_eleve;
            listElt.nom  = elt.nom;
            listElt.rang = ajouteZeroAuCasOu(rang); 
            listElt.matricule    = elt.matricule;
            listElt.moyennes_trimestre = elt.moyennes_trimestre;
            listElt.moyennes_trimestre.map((nt, index)=>{notesTrim[index]=nt});
            
            listElt.moy_trim1  = notesTrim[0];
            listElt.moy_trim2  = notesTrim[1];
            listElt.moy_trim3  = notesTrim[2];
            
            listElt.classees_trim = elt.classees_trim;
            listElt.classees_trim.map((el,index)=>classerTrim[index]=el)
            
            listElt.classer_trim1  = classerTrim[0];
            listElt.classer_trim2  = classerTrim[1];
            listElt.classer_trim3  = classerTrim[2];
           
            enCompte1.push(listTrimId[0]);
            enCompte2.push(listTrimId[1]);
            enCompte3.push(listTrimId[2]);

            classer.push(1);
          
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    function changeBulletinType(typeBulletin){
        setTypeBulletin(typeBulletin);
        getActivatedEvalPeriods(typeBulletin);
        getStudentGenerationInfo(CURRENT_CLASSE_ID,CURRENT_PERIOD_ID,typeBulletin);
    }


    function getActivatedSequences(){
        var tempTable=[];
        tabSequences = [];
        
        axiosInstance.post(`list-sequences/`, {
            id_sousetab: currentAppContext.currentEtab,
            id_trimestre:"",
            // option: "bulletin_trimetriel"
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
        tabCurrentAnnee = [{value: 1,      label: t("annee")+ ' '+ CURRENT_ANNEE_SCOLAIRE  }]  
        tabCurrentAnnee.unshift(firstItem);     
    }


    function getActivatedEvalPeriods(typebultin){    
        CURRENT_PERIOD_ID = undefined;
        setGridRows([]);

        if(document.getElementById('optPeriode').options != undefined && document.getElementById('optPeriode').options[0] != undefined){
            document.getElementById('optPeriode').options[0].selected = true;
        }
       
        switch(typebultin){
            case 1: {setOptPeriode(tabSequences);    break;}
          
            case 2: {setOptPeriode(tabTrimestres);   break;}
            
            case 3: {setOptPeriode(tabCurrentAnnee); break;}     
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
        if(e.target.value > 0){
            CURRENT_CLASSE_ID      = e.target.value; 
            CURRENT_CLASSE_LABEL   = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            
            PROF_PRINCIPAL         = currentUiContext.currentPPList.find((elt)=>elt.id_classe == CURRENT_CLASSE_ID);
            CURRENT_PERIOD_ID      = document.getElementById('optPeriode').value;

            listMatiereEtProfs = getMatieresWithTeachersNames(CURRENT_CLASSE_ID, currentUiContext.emploiDeTemps, currentUiContext.matiereSousEtab, currentUiContext.listProfs);
        
            console.log("chargement",CURRENT_CLASSE_ID,CURRENT_PERIOD_ID,typeBulletin);
            getStudentGenerationInfo(CURRENT_CLASSE_ID,CURRENT_PERIOD_ID,typeBulletin);
            setCanGenerate(true);
        }else{
            setCanGenerate(false);
            CURRENT_CLASSE_ID    = undefined;
            CURRENT_CLASSE_LABEL = '';
            listMatiereEtProfs   = '';
            setIsValid(false);
            setGridRows([]);
        }
    }

    
    function dropDownPeriodHandler(e){
        if(e.target.value > 0){
            console.log("icicciicicicigfgf", e.target.value);
            CURRENT_PERIOD_ID = e.target.value; 
            CURRENT_PERIOD_LABEL = optPeriode.find((elt)=>elt.value == CURRENT_PERIOD_ID).label;
            if(typeBulletin==2) getTrimSequences(CURRENT_PERIOD_LABEL);
            getStudentGenerationInfo(CURRENT_CLASSE_ID,CURRENT_PERIOD_ID,typeBulletin);
           
        }else{
            CURRENT_PERIOD_ID = undefined;
            setGridRows([])
           //if(isValid)  setIsValid(false);
        }
    }

/*************************** DataGrid Declaration ***************************/    

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
        field: 'nb_matiere_sans_notes',
        headerName: t('matiere_sans_note_M'),
        width: 170,
        editable: false,
        headerClassName:classes.GridColumnStyleP,                
    },

    {
        field: 'nb_coef_manquants',
        headerName: t('coef_manquants_M'),
        width: 170,
        editable: false,
        headerClassName:classes.GridColumnStyleP,                
    },

    {
        field: 'matieres_spe_manquantes',
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
            field: 'classer_seq1',
            headerName:   '',
            width: 120,
            editable: false,
            hide:true,
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
            field: 'classer_seq2',
            headerName:   '',
            width: 120,
            editable: false,
            hide:true,
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
            field: 'id_trim1',
            headerName:  '',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'classer_trim1',
            headerName:   '',
            width: 120,
            editable: false,
            hide:true,
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
            field: 'id_trim2',
            headerName:  '',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'classer_trim2',
            headerName:  '',
            width: 120,
            editable: false,
            hide:true,
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
            field: 'id_trim3',
            headerName:  '',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'classer_trim3',
            headerName:  '',
            width: 120,
            editable: false,
            hide:true,
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
    
    const acceptHandler=()=>{
        switch(chosenMsgBox){

            case MSG_SUCCESS_GENRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING_GENRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }

            case MSG_ERROR_GENRPT: {
                setModalOpen(0);
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
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_GENRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING_GENRPT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }

            case MSG_ERROR_GENRPT: {
                setModalOpen(0);
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


    const printStudentReports=()=>{
        if(ELEVES_C_TO_PRINT != {}){
            ElevePageSet = {};
            ElevePageSet.typeBulletin    = typeBulletin;
            ElevePageSet.isElevesclasse  = true;
            ElevePageSet.periode         = CURRENT_PERIOD_LABEL;
            ElevePageSet.effectif        = listEleves.length;
            ElevePageSet.elvToPrintData  = elevesCL;
            ElevePageSet.entete_fr       = {... ELEVES_DATA.entete_fr};
            ElevePageSet.entete_en       = {... ELEVES_DATA.entete_en};
            ElevePageSet.titreBulletin   = getBulletinTypeLabel(typeBulletin)+'-'+CURRENT_PERIOD_LABEL;
            ElevePageSet.etabLogo        = imgUrl;
            ElevePageSet.profPrincipal   = (PROF_PRINCIPAL!=undefined)? getTitre(PROF_PRINCIPAL.sexe)+' '+PROF_PRINCIPAL.PP_nom :t("not_defined");  
            ElevePageSet.classeLabel     = CURRENT_CLASSE_LABEL; 
            printedETFileName            = getBulletinTypeLabel(typeBulletin)+'_'+CURRENT_PERIOD_LABEL+'('+CURRENT_CLASSE_LABEL+').pdf';
            setModalOpen(4); 
                          
        } else{
            chosenMsgBox = MSG_WARNING_GENRPT;
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
        selectedElevesIds =[];
        setIsValid(false);                 
        setModalOpen(0);
    }

    function genSeqBulletin(criteria){
        console.log("criteres",criteria, CURRENT_PERIOD_ID);
        ELEVES_DATA = {};
        setModalOpen(5);
        
        axiosInstance.post(`generer-bulletin-classe/`, {
            id_sousetab                     : currentAppContext.currentEtab,
            id_classe                       : CURRENT_CLASSE_ID,
            id_sequence                     : CURRENT_PERIOD_ID,
            id_matieres_ne_pouvant_manquer  : criteria.id_matieres_ne_pouvant_manquer,
            nb_max_matieres_sans_note       : criteria.nb_max_matieres_sans_note,
            nb_max_coefs_manquants          : criteria.nb_max_coefs_manquants,
            id_user                         : currentAppContext.idUser  
                                 
        }).then((res)=>{

            ELEVES_DATA = res.data;
            console.log("RESULTATS GENSEQ", ELEVES_DATA);

            ELEVES_C_TO_PRINT = createBulletinToPrintData(typeBulletin, ELEVES_DATA, listMatiereEtProfs,true);
            console.log("eleves_data",ELEVES_C_TO_PRINT);  
            setEleveCL(ELEVES_C_TO_PRINT); 

            ELEVES_NC_TO_PRINT = createBulletinToPrintData(typeBulletin, ELEVES_DATA, listMatiereEtProfs,false);
            setEleveNCL(ELEVES_NC_TO_PRINT);

            setModalOpen(6);
       
        },(res)=>{
            chosenMsgBox = MSG_ERROR_GENRPT;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "danger", 
                msgTitle : t("error_M"), 
                message  : t("error_when_generating")
            })        
        })
    }

    function genTrimBulletin(){
        var id_eleves = []; periodes_considerees = [];
        ELEVES_DATA = {};        

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

            setModalOpen(5);
            axiosInstance.post(`generer-bulletin-trimestre-classe/`, {
                id_sousetab          : currentAppContext.currentEtab,
                id_classe            : CURRENT_CLASSE_ID,
                id_trimestre         : CURRENT_PERIOD_ID,
                id_eleves            : eleves_ids,              
                periodes_considerees : seq_consideree,
                classer              : toBeClassed,
                id_user              : currentAppContext.idUser  
            }).then((res)=>{

                ELEVES_DATA = res.data;
                console.log("RESULTATS GENSEQ", ELEVES_DATA);

                ELEVES_C_TO_PRINT = createBulletinToPrintData(typeBulletin, ELEVES_DATA, listMatiereEtProfs, true)
                console.log("eleves_data",ELEVES_C_TO_PRINT);  
                setEleveCL(ELEVES_C_TO_PRINT); 
    
                ELEVES_NC_TO_PRINT = createBulletinToPrintData(typeBulletin, ELEVES_DATA, listMatiereEtProfs, false);
                setEleveNCL(ELEVES_NC_TO_PRINT);

                setModalOpen(6);

            },(res)=>{
                chosenMsgBox = MSG_ERROR_GENRPT;
                currentUiContext.showMsgBox({
                    visible  : true, 
                    msgType  : "danger", 
                    msgTitle : t("error_M"), 
                    message  : t("error_when_generating")
                })        
            })
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
        ELEVES_DATA = {};

        if(gridRows.length>0){
            gridRows.map((elt, index)=>{
                id_eleves.push(elt.id);
                periodes_considerees[index] = getListTrimCons(enCompte1[index], enCompte2[index], enCompte3[index]);
                
            });

            var eleves_ids      =  id_eleves.join('²²');
            var trim_consideree =  periodes_considerees.join('&');
            var toBeClassed     =  classer.join('²²');

            console.log("data",eleves_ids,trim_consideree, toBeClassed);

            setModalOpen(5);
            axiosInstance.post(`generer-bulletin-annee-classe/`, {
                id_sousetab          : currentAppContext.currentEtab,
                id_classe            : CURRENT_CLASSE_ID,
                id_trimestre         : CURRENT_PERIOD_ID,
                id_eleves            : eleves_ids,              
                periodes_considerees : trim_consideree,
                classer              : toBeClassed,
                id_user              : currentAppContext.idUser 
                 
            }).then((res)=>{

                console.log(res);
                ELEVES_DATA = res.data;
          
                ELEVES_C_TO_PRINT = createBulletinToPrintData(typeBulletin, ELEVES_DATA, listMatiereEtProfs, true);
                console.log("eleves_data",ELEVES_C_TO_PRINT);  
                setEleveCL(ELEVES_C_TO_PRINT); 
    
                ELEVES_NC_TO_PRINT = createBulletinToPrintData(typeBulletin, ELEVES_DATA, listMatiereEtProfs, false);
                setEleveNCL(ELEVES_NC_TO_PRINT);

                setModalOpen(6);
         
            },(res)=>{
                chosenMsgBox = MSG_ERROR_GENRPT;
                currentUiContext.showMsgBox({
                    visible  : true, 
                    msgType  : "danger", 
                    msgTitle : t("error_M"), 
                    message  : t("error_when_generating")
                })        
            })
        }
        
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

    function getBulletinTypeLabel(typeBulletin){
        switch(typeBulletin){
            case 1: {return(t('bulletin_sequentiel')); } 
            case 2: {return(t('bulletin_trimestriel'));}
            case 3: {return(t('bulletin_annuel'));     }
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
            {(modalOpen==4) &&                 
                <PDFTemplate previewCloseHandler={closePreview}>
                    { isMobile?
                        <PDFDownloadLink fileName={printedETFileName}   
                            document = { 
                                <BulletinEleve data={ElevePageSet}/>
                            }
                        >
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
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
            {(modalOpen==5)    && <LoadingView loadinText={t('traitement')} loadingTextStyle={{color:"white"}}/>}
           
            {(modalOpen==6) &&  
                <ResultatsGeneration
                    typeBulletin          = {typeBulletin}
                    bullPeriodeLabel      = {CURRENT_PERIOD_LABEL}
                    annee                 = {CURRENT_ANNEE_SCOLAIRE}
                    classeId              = {CURRENT_CLASSE_ID} 
                    elevesClasses         = {elevesCL}
                    elevesNClasses        = {elevesNCL} 
                    cancelHandler         = {()=>setModalOpen(0)}
                    generateHandler       = {generateBulletinHandler}
                    printReportHandler    = {printStudentReports}
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

                        //getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                        getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : (params.field.includes('moy_') && params.row['classer_'+params.field.split('_')[1]] == false)?  classes.gridNoteRedRowStyle : classes.gridRowStyle }
                       
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