import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddDisciplinMeeting from "../modals/AddDisciplinMeeting";
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import {isMobile} from 'react-device-detect';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import PDFTemplate from '../reports/PDFTemplate';
import StudentList from '../reports/StudentList';
import PVCDMeeting from '../reports/PVCDMeeting';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
var CURRENT_MEETING = {};


var printedETFileName = '';
var SEQUENCES_DISPO   = [];
var TRIMESTRES_DISPO  = [];
var ANNEE_DISPO       = [];

var DEFAULT_MEMBERS  = []; 
var PRESENTS_MEMBERS = [];
var OTHER_MEMBERS    = [];
var CONVOQUE_PAR    = [];

var DEFAULT_MEMBERS_ADD  = []; 
var PRESENTS_MEMBERS_ADD = [];
var OTHER_MEMBERS_ADD    = [];
var CONVOQUE_PAR_ADD     = [];

var ELEVES_SANCTIONS = [];

var ELEVES_MOTIFS    = [];
var LIST_MOTIFS      = [];
var LIST_SANCTIONS   = [];
var LIST_ELEVES      = [];
var CURRENT_POS      = [];


var LIST_CONSEILS_INFOS = [];
var printedETFileName   = '';

var listElt = {}

var MEETING = {}

var pageSet = [];

var page = {
    pageTitle:'',
    pageRows:[],
    pageNumber:0,
}

var chosenMsgBox;
const MSG_SUCCESS_CREATE       = 1;
const MSG_SUCCESS_UPDATE       = 2;
const MSG_SUCCESS_UPDATE_PRINT = 3;
const MSG_WARNING              = 4; 
const MSG_CONFIRM              = 5;

const ROWS_PER_PAGE= 40;
var ElevePageSet=[];
var CCPageSet=[];

function ConseilDiscipline(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid]  = useState(false);
    const [gridMeeting, setGridMeeting] = useState([]);
    const [modalOpen, setModalOpen]     = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse]      = useState([]);
    const [listClasses, setListClasses] = useState([]);
    const[isLoading,setIsloading] = useState(false);
    // const[LoadingVisible,setLoadingVisible] = useState(false);
    const selectedTheme = currentUiContext.theme;

    

    useEffect(()=> {
        if(gridMeeting.length==0)  CURRENT_CLASSE_ID = undefined;       
        getEtabListClasses();
        getMotifConvocation();
        getTypeSAnction();
    },[]);

    function getDisciplinMeetingData(classId){
        var listConseils = [];
        setModalOpen(5);
        axiosInstance.post(`list-conseil-disciplines/`, {
            id_classe  : classId,
            id_sousetab: currentAppContext.currentEtab
        }).then((res)=>{
            console.log("donnees",res.data);

            if(res.data!= undefined && res.data!=null){
                LIST_CONSEILS_INFOS = [...res.data.conseil_disciplines];
                
                CONVOQUE_PAR_ADD     = [...res.data.enseignants_conv];
                DEFAULT_MEMBERS_ADD  = [...res.data.enseignants_classe];
                OTHER_MEMBERS_ADD    = [...res.data.autres_enseignants];
                PRESENTS_MEMBERS_ADD = [...res.data.enseignants_classe];
                

                SEQUENCES_DISPO   =  createLabelValueTable(res.data.seqs);
                TRIMESTRES_DISPO  =  createLabelValueTable(res.data.trims);
                ANNEE_DISPO = [{value:"annee",label:t("annee")+' '+new Date().getFullYear()}];

                listConseils = [...formatList(res.data.conseil_disciplines, res.data.seqs, res.data.trims)]
                console.log(listConseils);   
            }

            var listEleves = []
            axiosInstance.post(`list-eleves/`, {
                id_classe: classId,
            }).then((res)=>{
                console.log(res.data);
                console.log(listEleves);
                LIST_ELEVES= [...getElevesTab(res.data)];
                console.log("Eleves",LIST_ELEVES) ; 
                setIsloading(false);

                setGridMeeting(listConseils);
                console.log(gridMeeting);
                setModalOpen(0);
            })  
        })
    }

    
    const getEtabListClasses=()=>{
       var tempTable  = [{value: '0',      label: (i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '  }];
       var tempTableP = [];
        // axiosInstance.post(`list-classes/`, {
        //     id_sousetab: currentAppContext.currentEtab,
        // }).then((res)=>{
        //     console.log(res.data);
        //     res.data.map((classe)=>{
        //         tempTable.push({value:classe.id, label:classe.libelle});
        //         tempTableP.push({value:classe.id, label:classe.libelle});
        //     })
        //     setOpClasse(tempTable);
        //     setListClasses(tempTableP);
        //     console.log(tempTable);                 
        // }) 
        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
        console.log(classes)
        let classes_user;
        
        classes_user = currentAppContext.infoUser.admin_classes;

        let n = classes_user.length;
        let m = classes.length;
        let i = 0;
        let j = 0;
       while(i<n){
        j = 0;
        while(j<m){
            if(classes_user[i].id==classes[j].id_classe){
                tempTable.push({value:classes_user[i].id, label:classes_user[i].libelle})
                tempTableP.push({value:classes_user[i].id, label:classes_user[i].libelle})
                break;
            }
            j++;
        }
        i++;
       }
           
        setOpClasse(tempTable); 
        setListClasses(tempTableP);

    }


    function getMotifConvocation(){
        LIST_MOTIFS = []
        axiosInstance.post(`list-causes-convocation-cd/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{            
            LIST_MOTIFS = [...formatMotif(res.data)];           
            console.log("motifs convocation",res.data,LIST_MOTIFS);
        })  
    }

    function getTypeSAnction(){
        LIST_SANCTIONS = []
        axiosInstance.post(`list-type-sanctions/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
            console.log(res.data);
            LIST_SANCTIONS = [...formatMotif(res.data.sanctions)];
            console.log("sanction convocation",res.data,LIST_SANCTIONS);
          
        }) 
        return LIST_SANCTIONS; 
    }

    function formatMotif(list){
        var tabMotif = [];
        (list||[]).map((elt)=>tabMotif.push({value:elt.id, label:elt.libelle}));
        return tabMotif;
    }

    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            console.log(listEleves);
            LIST_ELEVES= [...getElevesTab(res.data)];
            console.log("Eleves",LIST_ELEVES) ; 
            setIsloading(false);
        })  
    }

    function initMotifsTab(motif){
        ELEVES_MOTIFS = [];
        (LIST_ELEVES||[]).map((elt)=>{
            CURRENT_POS.push(0);
            ELEVES_MOTIFS.push(motif);
        });
        //setTabElevesMotifs(Motifs);
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

    const getListConseilDiscipline =(classeId,sousEtabId)=>{
        var listConseils = [];
        axiosInstance.post(`list-conseil-disciplines/`, {
            id_classe: classeId,
            id_sousetab: sousEtabId
        }).then((res)=>{
            console.log("donnees",res.data);

            if(res.data!= undefined && res.data!=null){
                LIST_CONSEILS_INFOS = [...res.data.conseil_disciplines];
                
                CONVOQUE_PAR_ADD     = [...res.data.enseignants_conv];
                DEFAULT_MEMBERS_ADD  = [...res.data.enseignants_classe];
                OTHER_MEMBERS_ADD    = [...res.data.autres_enseignants];
                PRESENTS_MEMBERS_ADD = [...res.data.enseignants_classe];
                

                SEQUENCES_DISPO   =  createLabelValueTable(res.data.seqs);
                TRIMESTRES_DISPO  =  createLabelValueTable(res.data.trims);
                ANNEE_DISPO = [{value:"annee",label:t("annee")+' '+new Date().getFullYear()}];

                listConseils = [...formatList(res.data.conseil_disciplines, res.data.seqs, res.data.trims)]
                console.log(listConseils);   
                //setIsloading(false);             
            }

            setGridMeeting(listConseils);
            console.log(gridMeeting);
        })  
        
    }

    function createLabelValueTable(tab){
        var resultTab = [];
        if(tab.length>0){
            tab.map((elt)=>{
                resultTab.push({value:elt.id, label:elt.libelle});
            })
        }
        return resultTab;
    }

    function createLabelValueTableWithUserS(tab, present, etat){
        var resultTab = [];
        if(tab.length>0){
            tab.map((elt)=>{
                resultTab.push({value:elt.id_user, label:elt.nom, role:elt.type, present:present, etat:etat});
            })
        }
        return resultTab;
    }

    function createListElevesSanctions(sanctionsList, etat){
        var ElevesList = [];
        (sanctionsList||[]).map((elt) => {
            ElevesList.push({id:elt.id_eleve, nom:elt.nom, decisionsId:elt.id, decisionLabel:elt.libelle, etat:etat})
        })
        return ElevesList;
    }

    function createListElevesMotifs(motifsList, etat){
        var ElevesList = [];
        (motifsList||[]).map((elt) => {
            ElevesList.push({id:elt.id_eleve, nom:elt.nom, motifId:elt.id, motifLabel:elt.libelle, etat:etat})
        })
        return ElevesList;
    }

    function formatList(listConseil,seqInfos,trimInfos){
        var rang = 1;  var formattedList = [];
       
        (listConseil||[]).map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.date_prevue     = elt.date_prevue;
            listElt.heure_prevue    = elt.heure_prevue;
            listElt.type_conseil    = elt.type_conseil;
            listElt.id_type_conseil = elt.id_type_conseil;
            listElt.resume_general_decisions = elt.resume_general_decisions;
            listElt.nom            = elt.convoque_par.nom;
            listElt.user_id        = elt.convoque_par.id_user;
            listElt.rang           = rang; 
            listElt.status         = elt.status; 
            listElt.periodeId      = listElt.id_type_conseil;
            listElt.periode        = getPeriodeLabel(listElt.id_type_conseil, listElt.periodeId, seqInfos, trimInfos);
            listElt.etatLabel      = (elt.status == 0) ? t('en_cours') :t('cloture');
            listElt.date_effective = (elt.status == 1) ? elt.date_effective : "";      
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    
    function getPeriodeLabel(typeConseil, idPeriode, listSequence, listTrimestres){
        var foundedPeriode={id:-1, libelle:''};     
        
        if(listSequence   == undefined) listSequence   = [];
        if(listTrimestres == undefined) listTrimestres = [];
           
        switch(typeConseil){
            case "sequentiel":{
                foundedPeriode = listSequence.find((seq)=>(seq.id==idPeriode));
                break; 
            }

            case "trimestriel":{
                foundedPeriode = listTrimestres.find((trim)=>(trim.id==idPeriode));
                break; 
            }
         
        }
       
        if (foundedPeriode == undefined) return "";
        else return foundedPeriode.libelle;
    }

    
   
    function dropDownHandler(e){
        //console.log(e.target.value)
        var grdRows;
        if(e.target.value != optClasse[0].value){
            
            setIsValid(true);            
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse.find((classe)=>(classe.value == CURRENT_CLASSE_ID)).label;

            //setIsloading(true);
            getDisciplinMeetingData(CURRENT_CLASSE_ID);
            // getListConseilDiscipline(CURRENT_CLASSE_ID, currentAppContext.currentEtab);  
            // getClassStudentList(CURRENT_CLASSE_ID);
               
        }else{
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setGridMeeting([]);
            setIsValid(false);
        }
    }

/*************************** DataGrid Declaration ***************************/ 


const columnsFr = [
    {
        field: 'id',
        headerName: 'ID',
        width: 130,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'rang',
        headerName: 'N°',
        width: 70,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },       
    {
        field: 'date_prevue',
        headerName: 'DATE PREVUE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'heure_prevue',
        headerName: 'HEURE PREVUE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'type_conseil',
        headerName: 'TYPE DE CONSEIL',
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'id_type_conseil',
        headerName: 'OBJET DU CONSEIL',
        width: 50,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'periode',
        headerName: 'PERIODE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'nom',
        headerName: 'CONVOQUE PAR',
        width: 180,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'user_id',
        headerName: 'CONVOQUE PAR',
        width: 50,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'status',
        headerName: 'ETAT',
        width: 70,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'etatLabel',
        headerName: 'ETAT',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'date_effective',
        headerName: 'DATE EFFECTIVE',
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'resume_general_decisions',
        headerName: 'DECISION',
        width: 120,
        editable: false,
        hide : true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'is_all_class_convoke',
        headerName: 'Toute la classe',
        width: 120,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'Action',
        headerName: '',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            
            return(
                (params.row.status==0)?
                <div className={classes.inputRow}>
                    <img src="icons/baseline_edit.png"  
                        width={17} 
                        height={17} 
                        className={classes.cellPointer} 
                        onClick={(event)=> {
                            event.ignore = true;
                        }}
                        alt=''
                    />
                    <img src="icons/baseline_delete.png"  
                        width={17} 
                        height={17} 
                        className={classes.cellPointer} 
                        onClick={(event)=> {
                            event.ignore = true;
                        }}
                        alt=''
                    />
                </div>
                :null
            )}           
            
        },

    ];

    const columnsEn = [
        {
            field: 'id',
            headerName: 'ID',
            width: 130,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'rang',
            headerName: 'N°',
            width: 70,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
           
        {
            field: 'date_prevue',
            headerName: 'MEETING DATE',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'heure_prevue',
            headerName: 'MEETING HOUR',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'type_conseil',
            headerName: 'TYPE OF CONSEIL',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_type_conseil',
            headerName: 'OBJET DU CONSEIL',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'periode',
            headerName: 'PERIODE',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'nom',
            headerName: 'INITIATED BY',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'user_id',
            headerName: 'INITIATED BY',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'status',
            headerName: 'STATUS',
            width: 70,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'etatLabel',
            headerName: 'STATUS',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'date_effective',
            headerName: 'EFFECTIVE DATE',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'resume_general_decisions',
            headerName: 'DECISION',
            width: 120,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'is_all_class_convoke',
            headerName: 'All the class',
            width: 120,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'Action',
            headerName: '',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                
                return(
                    (params.row.status==0)?
                    <div className={classes.inputRow}>
                        <img src="icons/baseline_edit.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            onClick={(event)=> {
                                event.ignore = true;
                            }}
                            alt=''
                        />
                        <img src="icons/baseline_delete.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            onClick={(event)=> {
                                event.ignore = true;
                            }}
                            alt=''
                        />
                    </div>
                    :null
                )}           
                
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
    
/*************************** Handler functions ***************************/
function setEditMeetingGlobalData(meeting){
    return new Promise(function(resolve, reject){

        var convoquePar      =  meeting.convoque_par;
        if(CONVOQUE_PAR_ADD != undefined){
            if(CONVOQUE_PAR_ADD.find((elt)=>elt.id_user==convoquePar.id_user)==undefined){
                CONVOQUE_PAR_ADD.unshift(convoquePar);
            }           
        }
      
        DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(meeting.membres, true, 1);
        OTHER_MEMBERS     =  createLabelValueTableWithUserS(meeting.membres_a_ajouter,false, -1);
        PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(meeting.membres_presents,true, 0);
        CONVOQUE_PAR      =  createLabelValueTableWithUserS(CONVOQUE_PAR_ADD,true, 0);
       
        if(meeting.is_all_class_convoke){
            ELEVES_SANCTIONS  = createListElevesSanctions(meeting.sanction_generale_classe,0);
            ELEVES_MOTIFS     = createListElevesMotifs(meeting.motif_generale_classe,0);
        } else {
            ELEVES_SANCTIONS  =  createListElevesSanctions(meeting.sanctions_car_par_cas,0);
            ELEVES_MOTIFS     =  createListElevesMotifs(meeting.motif_cas_par_cas,0);
        } 

        resolve(1);
    });

}

    function handleDeleteRow(params){
        if(params.field=='id'){
            //console.log(params.row.matricule);
            deleteRow(params.row.matricule);            
        }
    }

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
        inputs[12]= '';
        inputs[13]= '';
       
        currentUiContext.setFormInputs(inputs)
    }
    

    function handleEditRow(row){       
        var inputs=[];   
        
        var CURRENT_CD    =  LIST_CONSEILS_INFOS.find((cd)=>cd.id == row.id);
        // var convoquePar   =  CURRENT_CD.convoque_par;

        // console.log("le meeting", CONVOQUE_PAR_ADD, CURRENT_CD);

        // if(CONVOQUE_PAR_ADD != undefined){
        //     if(CONVOQUE_PAR_ADD.find((elt)=>elt.id_user==convoquePar.id_user)==undefined){
        //         CONVOQUE_PAR_ADD.unshift(convoquePar);
        //     }           
        // }//else CONVOQUE_PAR_ADD = [];
      
        // DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(CURRENT_CD.membres, true, 1);
        // OTHER_MEMBERS     =  createLabelValueTableWithUserS(CURRENT_CD.membres_a_ajouter,false, -1);
        // PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(CURRENT_CD.membres_presents,true, 0);
        // CONVOQUE_PAR      =  createLabelValueTableWithUserS(CONVOQUE_PAR_ADD,true, 0);
       
        // if(CURRENT_CD.is_all_class_convoke){
        //     ELEVES_SANCTIONS  = createListElevesSanctions(CURRENT_CD.sanction_generale_classe,0);
        //     ELEVES_MOTIFS     = createListElevesMotifs(CURRENT_CD.motif_generale_classe,0);
        // } else {
        //     ELEVES_SANCTIONS  =  createListElevesSanctions(CURRENT_CD.sanctions_car_par_cas,0);
        //     ELEVES_MOTIFS     =  createListElevesMotifs(CURRENT_CD.motif_cas_par_cas,0);
        // } 

        setEditMeetingGlobalData(CURRENT_CD).then(()=>{
            console.log("convocateurs",CONVOQUE_PAR);    
            inputs[0] = row.id;
            inputs[1] = row.date_prevue;
            inputs[2] = row.heure_prevue;
            inputs[3] = row.type_conseil;
            inputs[4] = row.id_type_conseil;
            
            inputs[5] = row.periode;
            inputs[6] = row.nom;
            inputs[7] = row.user_id;

            inputs[8] = row.status;
            inputs[9] = row.statusLabel;

            inputs[10] = [...ELEVES_MOTIFS];
            inputs[11] = [...ELEVES_SANCTIONS];
        
            inputs[12] = row.is_all_class_convoke;
            inputs[13] = row.resume_general_decisions;      
            
            currentUiContext.setFormInputs(inputs);
            console.log("laligne",row, currentUiContext.formInputs);
            setModalOpen(2);
        })


        
    }

    function setConsMeetingGlobalData(meeting){
        return new Promise(function(resolve, reject){
    
            var convoquePar      =  meeting.convoque_par;
            if(CONVOQUE_PAR_ADD != undefined){
                if(CONVOQUE_PAR_ADD.find((elt)=>elt.id_user==convoquePar.id_user)==undefined){
                    CONVOQUE_PAR_ADD.unshift(convoquePar);
                }           
            }
          
            DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(meeting.membres, true, 1);
            OTHER_MEMBERS     =  createLabelValueTableWithUserS(meeting.membres_a_ajouter,false, -1);
            PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(meeting.membres_presents,true, 1);
            ELEVES_SANCTIONS  =  createListElevesSanctions(meeting.sanctions_car_par_cas,1);
            ELEVES_MOTIFS     =  createListElevesMotifs(meeting.motif_cas_par_cas,1);
            CONVOQUE_PAR      =  createLabelValueTableWithUserS(CONVOQUE_PAR_ADD,true, 1);
    
            resolve(1);
        });
    
    }
    

    function consultRowData(row){
        var inputs=[];       
        var CURRENT_CD    =  LIST_CONSEILS_INFOS.find((cd)=>cd.id == row.id);
        // var convoquePar   =  CURRENT_CD.convoque_par;

        // console.log("le meeting", CONVOQUE_PAR_ADD, CURRENT_CD);

        // if(CONVOQUE_PAR_ADD != undefined){
        //     if(CONVOQUE_PAR_ADD.find((elt)=>elt.id_user==convoquePar.id_user)==undefined){
        //         CONVOQUE_PAR_ADD.unshift(convoquePar);
        //     }           
        // }

        // DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(CURRENT_CD.membres, true, 1);
        // OTHER_MEMBERS     =  createLabelValueTableWithUserS(CURRENT_CD.membres_a_ajouter,false, -1);
        // PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(CURRENT_CD.membres_presents,true, 1);
        // ELEVES_SANCTIONS  =  createListElevesSanctions(CURRENT_CD.sanctions_car_par_cas,1);
        // ELEVES_MOTIFS     =  createListElevesMotifs(CURRENT_CD.motif_cas_par_cas,1);
        // CONVOQUE_PAR      =  createLabelValueTableWithUserS(CONVOQUE_PAR_ADD,true, 1);

        setConsMeetingGlobalData(CURRENT_CD).then(()=>{
            inputs[0]= row.id;
            inputs[1]= row.date_prevue;
            inputs[2]= row.heure_prevue;
            inputs[3]= row.type_conseil;
            inputs[4]= row.id_type_conseil;
            
            inputs[5]= row.periode;
            inputs[6]= row.nom;
            inputs[7]= row.user_id;

            inputs[8] = row.status;
            inputs[9] = row.statusLabel;

            inputs[10]= [...ELEVES_MOTIFS];
            inputs[11]= [...ELEVES_SANCTIONS];

            inputs[12]= row.is_all_class_convoke;
            inputs[13]= row.resume_general_decisions;
            
            currentUiContext.setFormInputs(inputs)
            setModalOpen(3);

        });
        

        
    }

    function getTypeConseil(code){
        switch(code){
            case '1': return "sequentiel" ;
            case '2': return "trimestriel" ;
            case '3': return "annuel";
        }
    }

    function getMembresId(tab){
        var tabResults = [];
        tab.map((elt)=>{
            tabResults.push(elt.value);
        })

        return tabResults.join("²²")
    }

    function getMembreRoles(tab){
        var tabResults = [];
        tab.map((elt)=>{
            tabResults.push(elt.role);
        })
        return tabResults.join("²²")
    }

 
    function addMeeting(meeting) {       
        console.log('Ajout',meeting);
        CURRENT_MEETING = meeting;
        setIsloading(true);
        axiosInstance.post(`create-conseil-discipline/`, {
            id_sousetab               : meeting.id_sousetab,
            id_classe                 : meeting.classeId,
            id_convocateur            : meeting.convoque_par.id_user,
            is_all_class_convoke      : meeting.is_all_class_convoke,
            id_eleves                 : meeting.id_eleves,
            type_conseil              : meeting.type_conseilId,
            date_prevue               : meeting.date,
            heure_prevue              : meeting.heure,
            id_periode                : meeting.id_periode,
            alerter_membres           : meeting.alerter_membres,
            id_membres                : meeting.id_membres,
            roles_membres             : meeting.roles_membres,
            membres_presents          : meeting.membre_presents,
            list_motifs_covocations   : meeting.list_motifs_covocations
            
        }).then((res)=>{
           var gridData = formatList(res.data.conseil_disciplines, res.data.seqs, res.data.trims);
         
            setGridMeeting(gridData);
            console.log(res.data);
            setIsloading(false);
            setModalOpen(0);
            chosenMsgBox = MSG_SUCCESS_CREATE;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")
            })
        })    
    }

  
    
    function modifyMeeting(meeting) {
        console.log('Modif',meeting);
        CURRENT_MEETING = meeting;
        setIsloading(true);
        axiosInstance.post(`update-conseil-discipline/`, {
            id_conseil_discipline            : meeting.id_conseil_discipline,
            id_sousetab                      : meeting.id_sousetab,
            id_classe                        : meeting.classeId,
            convoque_par                     : meeting.convoque_par.id_user,
            is_all_class_convoke             : meeting.is_all_class_convoke,
            id_eleves                        : meeting.id_eleves,
            type_conseil                     : meeting.type_conseilId,
            date_prevue                      : meeting.date,
            date_effective                   : meeting.date_effective,
            heure_prevue                     : meeting.heure,
            id_periode                       : meeting.id_periode,
            alerter_membres                  : meeting.alerter_membres,
            id_membres                       : meeting.id_membres,
            roles_membres                    : meeting.roles_membres,
            resume_general_decisions         : meeting.resume_general_decisions,
            to_close                         : meeting.to_close,
            membre_presents                  : meeting.membre_presents,            
            id_eleves                        : meeting.id_eleves,
            list_motifs_covocations          : meeting.list_motifs_covocations,
            list_decisions_conseil_eleves    : meeting.to_close ? meeting.list_decisions_conseil_eleves    : "",
            id_type_sanction_generale_classe : meeting.to_close ? meeting.id_type_sanction_generale_classe : "",

        }).then((res)=>{
           var gridData = formatList(res.data.conseil_disciplines, res.data.seqs, res.data.trims);
            setGridMeeting(gridData);
            console.log(res.data);
            setIsloading(false);
            //setModalOpen(0);
           
            if(meeting.to_close==1){                
                chosenMsgBox = MSG_SUCCESS_UPDATE_PRINT;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"question", 
                    msgTitle:t("success_add_M"), 
                    message:t("success_add") + '  '+ t("print_pv") +'?'
                });
                //setModalOpen(0);

            } else {
                chosenMsgBox = MSG_SUCCESS_UPDATE;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"info", 
                    msgTitle:t("success_add_M"), 
                    message:t("success_add")
                })
            }
           
        })
    }

    function meetingClosureHandler(meeting){
        CURRENT_MEETING = meeting; 
        if(CURRENT_MEETING.status == 1){
            chosenMsgBox = MSG_CONFIRM;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("confirm_meeting_closure_M"), 
                message:t("confirm_meeting_closure")
            });
        }
    }


    function deleteRow(rowId) {
       // alert(rowId);
        //Message de confirmation
        /*if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-etab/`, {
                id:rowId,
            }).then((res)=>{
                console.log(res.data.status)
                 //Mise a jour du tableau
                //setDataState(result)
            })              
        }*/
    } 

    function quitForm() {
        //ClearForm();
        setModalOpen(0)
    }

    
    function setMeetingGlobalData(){
        return new Promise(function(resolve, reject){
            DEFAULT_MEMBERS  =  createLabelValueTableWithUserS(DEFAULT_MEMBERS_ADD,  true,   1);     
            CONVOQUE_PAR     =  createLabelValueTableWithUserS(CONVOQUE_PAR_ADD,     true,   1);
            OTHER_MEMBERS    =  createLabelValueTableWithUserS(OTHER_MEMBERS_ADD,    false, -1);
            PRESENTS_MEMBERS =  createLabelValueTableWithUserS(PRESENTS_MEMBERS_ADD,  true,  0);            
            
            ELEVES_SANCTIONS =  [];
            ELEVES_MOTIFS    =  [];
            resolve(1);
        });

    }
   
    function AddNewMeetingHandler(e){
        if(CURRENT_CLASSE_ID != undefined){   
            // DEFAULT_MEMBERS  =  createLabelValueTableWithUserS(DEFAULT_MEMBERS_ADD,  true,   1);     
            // CONVOQUE_PAR     =  createLabelValueTableWithUserS(CONVOQUE_PAR_ADD,     true,   1);
            // OTHER_MEMBERS    =  createLabelValueTableWithUserS(OTHER_MEMBERS_ADD,    false, -1);            
            
            // ELEVES_SANCTIONS =  [];
            // ELEVES_MOTIFS    =  [];
            setMeetingGlobalData().then(()=>{
                setModalOpen(1); 
                initFormInputs();
            });
           
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

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_CREATE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilDiscipline(CURRENT_CLASSE_ID, currentAppContext.currentEtab);  
                return 1;
            }

            case MSG_SUCCESS_UPDATE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilDiscipline(CURRENT_CLASSE_ID, currentAppContext.currentEtab);
                if(CURRENT_MEETING.status==1) printMeetingReport();                
                return 1;
            }

            case MSG_SUCCESS_UPDATE_PRINT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilDiscipline(CURRENT_CLASSE_ID, currentAppContext.currentEtab);
                printMeetingReport();                
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

            case MSG_CONFIRM: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                modifyMeeting(CURRENT_MEETING);
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

            case MSG_SUCCESS_CREATE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_SUCCESS_UPDATE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_SUCCESS_UPDATE_PRINT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilDiscipline(CURRENT_CLASSE_ID, currentAppContext.currentEtab); 
                setModalOpen(0);
                return 1;
            }

            case MSG_CONFIRM: {
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

    function printReport(meeting){
        CURRENT_MEETING = meeting;
        console.log("Impression", meeting);
        printMeetingReport();
    }

    const printMeetingReport=()=>{

        if(CURRENT_CLASSE_ID != undefined){
            var PRINTING_DATA ={
                date:'27/04/2023',
                time:'17h45',
                schoolName:'College FX Vogt',
                quartier:'Mvolye',
                ville:'Yaounde',
                
                typeMeeting : CURRENT_MEETING.objetLabel,
                compteRendu: CURRENT_MEETING.decision,
                //successMark:CURRENT_MEETING.note_passage,
                //exclusionMark:CURRENT_MEETING.note_exclusion,
                eleveConvoques:  [...CURRENT_MEETING.listConvoques],
                elevesDecisions: [...CURRENT_MEETING.listCaspasCas],
                participants:    [...CURRENT_MEETING.listParticipants],

                leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders:["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
                rightHeaders:["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
                pageImages:["images/collegeVogt.png"],
                pageTitle: "Proces verbal du conseil de classe de la classe de  " + CURRENT_CLASSE_LABEL,
               
                numberEltPerPage:ROWS_PER_PAGE  
            };
            printedETFileName = "PV_Conseil_discipline("+CURRENT_CLASSE_LABEL+").pdf";
            
            setModalOpen(4);
            CCPageSet={...PRINTING_DATA};
            console.log("ici la",CCPageSet);                    
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
            
            {/* {LoadingVisible && 
                <div className={classes.formET} style={{alignItems:"center", width:'100%', height:'100%', backgroundColor:"white"}}>
                    <img src='images/Loading_icon.gif' alt="loading..." />
                </div>
            } */}

            {(modalOpen!=0) && <BackDrop/>}
            {(modalOpen>0 && modalOpen<4) && 
                <AddDisciplinMeeting
                    currentClasseLabel = {CURRENT_CLASSE_LABEL} 
                    currentClasseId    = {CURRENT_CLASSE_ID}     
                    defaultMembres     = {DEFAULT_MEMBERS} 
                    othersMembres      = {OTHER_MEMBERS} 
                    presentsMembres    = {PRESENTS_MEMBERS}
                    convoquePar        = {CONVOQUE_PAR} 
                    sequencesDispo     = {SEQUENCES_DISPO}
                    trimestresDispo    = {TRIMESTRES_DISPO}
                    motifsConv         = {LIST_MOTIFS}
                    sanctionsConv      = {LIST_SANCTIONS}
                    eleves             = {LIST_ELEVES}
                    listClasses        = {listClasses}
                    formMode           = {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}
                    actionHandler      = {(modalOpen==1) ? addMeeting : modifyMeeting}
                    closeHandler       = {meetingClosureHandler}
                    printReportHandler = {printReport}
                    cancelHandler      = {quitForm} 
                />
            }

            {(modalOpen==4) &&
                <PDFTemplate previewCloseHandler={closePreview}>
                    { isMobile?
                        <PDFDownloadLink  document ={<PVCDMeeting pageSet={CCPageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "":  <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>                    
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                           <PVCDMeeting pageSet={CCPageSet}/>
                        </PDFViewer>
                    }
                </PDFTemplate>
            }
            
            {(currentUiContext.msgBox.visible == true)  && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) &&
                <MsgBox 
                    msgTitle    = {currentUiContext.msgBox.msgTitle} 
                    msgType     = {currentUiContext.msgBox.msgType} 
                    message     = {currentUiContext.msgBox.message} 
                    customImg   = {true}
                    customStyle = {true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {(currentUiContext.msgBox.msgType  == "question")? t("yes") : t("ok")}
                    buttonRejectText = {t("no")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
               />             
            }

            {(isLoading) &&
                <div style={{ alignSelf: 'center',position:'absolute', top:"60.7vh",  fontSize:'1.2vw', fontWeight:'800', color:'#4d4848', zIndex:'1207',marginTop:'-5.7vh'}}> 
                    {t('traitement')}...
                </div>                    
            }

            {(isLoading) &&
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
                    top:'58.3vh',
                    backgroundColor: 'white',
                    zIndex: 1207,
                    overflow: 'hidden'
                }}
                >
                    <img src='images/Loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
                </div>                    
            }

            {(modalOpen==5) &&
                <div style={{ alignSelf: 'center',position:'absolute', top:'49.3%', fontWeight:'bolder', color:'#fffbfb', zIndex:'1207',marginTop:'-2.7vh', fontSise:'0.9vw'}}> 
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
                {(props.formMode=='ajout')?  
                    <div className={classes.formTitle}>
                        {t('gest_conseilD_M')}  
                    </div>
                    :
                    <div className={classes.formTitle}>
                        {t('consult_conseilD_M')}  
                    </div>
                }
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('conseilD_list_M')}  :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='selectClass1' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                        {(props.formMode=='ajout')?
                            <CustomButton
                                btnText={t('New_one')}
                                hasIconImg= {false}
                                //imgSrc='images/addNewUserOrg.png'
                                //imgStyle = {classes.grdBtnImgStyle}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyleP}
                                btnClickHandler={AddNewMeetingHandler}
                                disable={(isValid==false)}   
                            />
                            :
                            null
                        }

                       {/* <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printMeetingReport}
                            disable={(isValid==false)}   
                        />*/}

                       
                    </div>
                        
                    </div>
                    
                

                {/*(modalOpen==0) ?*/
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridMeeting}
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                            getCellClassName={(params) => 
                                (params.field==='etatLabel' && params.row.status==1)?  
                                classes.clotureStyle 
                                : (params.field==='etatLabel' && params.row.status==0) ? 
                                classes.enCoursStyle 
                                : (params.field==='type_conseil'|| params.field==='date_effective') ? 
                                classes.gridRowStyleBOLD :
                                classes.gridRowStyle 
                            }
                            onCellClick={handleDeleteRow}
                            onRowClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    handleEditRow(params.row)
                                }
                            }}  
                            
                            onRowDoubleClick ={(params, event) => {
                                event.defaultMuiPrevented = true;
                                consultRowData(params.row)
                            }}
                            
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
                  /*  :
                    null
                        */}
            
            </div>
        </div>
        
    );
} 
export default ConseilDiscipline;