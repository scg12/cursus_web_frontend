import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddClassMeeting from "../modals/AddClassMeeting";
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import {isMobile} from 'react-device-detect';
import PDFTemplate from '../reports/PDFTemplate';
import StudentList from '../reports/StudentList';
import PVCCMeeting from '../reports/PVCCMeeting';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";

var CURRENT_MEETING={};
let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;

let CURRENT_PROF_PP_ID;
let CURRENT_PROF_PP_USERID;
let CURRENT_PROF_PP_LABEL;

var printedETFileName='';
var SEQUENCES_DISPO = [];
var TRIMESTRES_DISPO  = [];
var ANNEE_DISPO = [];

var DEFAULT_MEMBERS = []; 
var OTHER_MEMBERS = [];
var PRESENTS_MEMBERS = [];

var DEFAULT_MEMBERS_ADD = []; 
var PRESENTS_MEMBERS_ADD = [];
var OTHER_MEMBERS_ADD = [];

var INFO_ELEVES = [];

var LIST_CONSEILS_INFOS =[];


var listElt ={};

var MEETING = {};

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
const MSG_WARNING        = 4;
const ROWS_PER_PAGE= 40;
var CCPageSet=[];


function ConseilClasse(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid] = useState(false);
    const [gridMeeting, setGridMeeting]= useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse] = useState([]);
    const[isLoading,setIsloading] = useState(false);
    const[LoadingVisible,setLoadingVisible] = useState(false);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        if(gridMeeting.length==0)  CURRENT_CLASSE_ID = undefined;
        getEtabListClasses();
    },[]);

    
    const getEtabListClasses=()=>{
       var tempTable=[{value: '0',      label: (i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '  }]
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

    const getListConseilClasse =(classeId,sousEtabId)=>{
        var listConseils = [];
        axiosInstance.post(`list-conseil-classes/`, {
            id_classe: classeId,
            id_sousetab: sousEtabId
        }).then((res)=>{
            console.log("donnees",res.data);
            if(res.data!= undefined && res.data!=null){
                LIST_CONSEILS_INFOS = [...res.data.conseil_classes];

                CURRENT_PROF_PP_ID      = res.data.prof_principal.id;
                CURRENT_PROF_PP_USERID  = res.data.prof_principal.user_id;
                CURRENT_PROF_PP_LABEL   = res.data.prof_principal.nom;
                
                DEFAULT_MEMBERS_ADD  = [...res.data.enseignants_classe];
                OTHER_MEMBERS_ADD    = [...res.data.autres_enseignants];
                PRESENTS_MEMBERS_ADD = [...res.data.enseignants_classe];

                SEQUENCES_DISPO   =  createLabelValueTableDejaTenu(res.data.seqs_dispo);
                TRIMESTRES_DISPO  =  createLabelValueTableDejaTenu(res.data.trims_dispo);
                ANNEE_DISPO = [{value:"annee",label:t("annee")+' '+new Date().getFullYear()}];

                listConseils = [...formatList(res.data.conseil_classes,res.data.prof_principal,res.data.seqs_dispo, res.data.trims_dispo)]
                console.log(listConseils);                
            }
     
            setGridMeeting(listConseils);
            console.log(gridMeeting);
            
            setIsloading(false);
        })  
    }


    function createLabelValueTableDejaTenu(tab){
        var resultTab = [];
        if(tab.length>0){
            tab.map((elt)=>{
                resultTab.push({value:elt.id, label:elt.libelle, deja_tenu:elt.deja_tenu});
            })
        }
        return resultTab;
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
    

    function formatList(listConseil,ProfInfo,seqInfos,trimInfos){
        var rang = 1;
        var formattedList =[]
        listConseil.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.date_prevue  = elt.date_prevue;
            listElt.heure_prevue = elt.heure_prevue;
            listElt.type_conseil = elt.type_conseil;
            listElt.id_type_conseil = elt.id_type_conseil;
            listElt.nom = (ProfInfo!= undefined && ProfInfo!= {})?  ProfInfo.nom : t("non_defini");
            listElt.user_id = ProfInfo.user_id;
            listElt.rang = rang; 
            listElt.status = elt.status; 
            listElt.resume_general_decisions = elt.resume_general_decisions;
            listElt.periodeId = elt.id_type_conseil;
            listElt.periode = getPeriodeLabel(listElt.periodeId,seqInfos,trimInfos);
            listElt.etatLabel = (elt.status == 0) ? t('en_cours') :t('cloture');
            listElt.date_effective = (elt.status == 1) ? elt.date_effective : "";      
            formattedList.push(listElt);            
            rang ++;
        })
        return formattedList;
    }


    function getPeriodeLabel(idPeriode,listSequence, listTrimestres){
        var foundedPeriode={id:-1, libelle:''};     
        
        if(listSequence   == undefined) listSequence   = {};
        if(listTrimestres == undefined) listTrimestres = {};
           
        
        foundedPeriode = listSequence.find((seq)=>(seq.id==idPeriode));
        if (foundedPeriode == undefined){
            foundedPeriode = listTrimestres.find((trim)=>(trim.id==idPeriode));
            if (foundedPeriode == undefined){
                foundedPeriode = {id:-1, libelle:t('conseil_anuuel')};
            }
        }

        return foundedPeriode.libelle;
    }


    function dropDownHandler(e){
        //console.log(e.target.value)
        var grdRows;
        if(e.target.value != optClasse[0].value){
            
            setIsValid(true);
            
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse.find((classe)=>(classe.value == CURRENT_CLASSE_ID)).label;
            
            setIsloading(true);
            getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab);  
            
              
        } else {
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
        headerName: 'PROF PRINCIPAL',
        width: 180,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'user_id',
        headerName: 'PROF PRINCIPAL',
        width: 50,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'resume_general_decisions',
        headerName: 'DECISION',
        width: 200,
        editable: false,
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

    /*{
        field: 'heure_effective',
        headerName: 'DATE EFFECTIVE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },*/

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
            headerName: 'MEETING PURPOSE',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'id_type_conseil',
            headerName: 'MEETING PURPOSE',
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
            headerName: 'HEAD TEACHER',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'user_id',
            headerName: 'PROF PRINCIPAL',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'resume_general_decisions',
            headerName: 'DECISION',
            width: 200,
            editable: false,
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
    
        /*{
            field: 'heure_effective',
            headerName: 'DATE EFFECTIVE',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },*/
    
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
        inputs[12]='';
        inputs[13]= '';
       
        currentUiContext.setFormInputs(inputs)
    }

    function handleEditRow(row){       
        var inputs=[];       
        var CURRENT_CC    =  LIST_CONSEILS_INFOS.find((cd)=>cd.id == row.id);
        console.log("hhhjki",CURRENT_CC.membres_presents);
      
        DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(CURRENT_CC.membres, true, 1);
        OTHER_MEMBERS     =  createLabelValueTableWithUserS(CURRENT_CC.membres_a_ajouter,false, -1);
        PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(CURRENT_CC.membres_presents,true, 0);
        INFO_ELEVES       =  CURRENT_CC.info_eleves;
        
        inputs[0] = row.id;
        inputs[1] = row.date_prevue;
        inputs[2] = row.heure_prevue;
        inputs[3] = row.type_conseil;
        inputs[4] = row.id_type_conseil;
        
        inputs[5] = row.periode;
        inputs[6] = row.nom;
        inputs[7] = row.user_id;

        inputs[8]  = row.status;
        inputs[9]  = row.statusLabel;
        inputs[10] = [...INFO_ELEVES];
        inputs[11] = row.resume_general_decisions;
  
  
        currentUiContext.setFormInputs(inputs);
        console.log("laligne",row, currentUiContext.formInputs);
        setModalOpen(2);       
    }

    function consultRowData(row){
        var inputs=[];
        var CURRENT_CC    =  LIST_CONSEILS_INFOS.find((cd)=>cd.id == row.id);
      
        DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(CURRENT_CC.membres, true, 1);
        OTHER_MEMBERS     =  createLabelValueTableWithUserS(CURRENT_CC.membres_a_ajouter,false, -1);
        PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(CURRENT_CC.membres_presents,true, 0);
        INFO_ELEVES       =  CURRENT_CC.info_eleves;
        
        inputs[0] = row.id;
        inputs[1] = row.date_prevue;
        inputs[2] = row.heure_prevue;
        inputs[3] = row.type_conseil;
        inputs[4] = row.id_type_conseil;
        
        inputs[5] = row.periode;
        inputs[6] = row.nom;
        inputs[7] = row.user_id;

        inputs[8]  = row.status;
        inputs[9]  = row.statusLabel;
        inputs[10] = [...INFO_ELEVES];
        inputs[11] = row.resume_general_decisions;
  
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);
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

    function createGridData(list){
        var listData = [];
        var listDataElt;

        if(list.length>0){
            list.map((elt)=>{
                listDataElt = {};
               
                listDataElt.id = elt.id;
                listDataElt.rang = elt.rang;
                listDataElt.date_prevue = elt.date_prevue;
                listDataElt.heure_prevue = elt.heure_prevue;
                listDataElt.type_conseil = elt.type_conseil;
                listDataElt.id_type_conseil = elt.id_type_conseil;
                listDataElt.periode = elt.periode;
                listDataElt.nom = elt.nom; 
                listDataElt.user_id = elt.user_id;
                listDataElt.status = elt.status;
                listDataElt.etatLabel = elt.etatLabel;
                listDataElt.date_effective = elt.date_effective;
                listDataElt.periode = elt.periode;
                listDataElt.periode = elt.periode;
                listDataElt.periode = elt.periode;

                listData.push(listDataElt)
            })
        }

        return listData
    }
  

    function addClassMeeting(meeting) {       
        console.log('Ajout',meeting);
        CURRENT_MEETING = meeting;
           
        axiosInstance.post(`create-conseil-classe/`, {
            id_sousetab     : meeting.id_sousetab,
            id_classe       : meeting.classeId,
            id_pp           : meeting.profPrincipalId,
            id_pp_user      : meeting.currentPpUserId,
            type_conseil    : meeting.type_conseilId,
            date_prevue     : meeting.date,
            heure_prevue    : meeting.heure,
            id_periode      : meeting.id_periode,
            alerter_membres : meeting.alerter_membres,
            id_membres      : meeting.id_membres,
            roles_membres   : meeting.roles_membres
            
        }).then((res)=>{
           var gridData = formatList(res.data.conseil_classes, res.data.prof_principal, res.data.seqs_dispo, res.data.trims_dispo)
            setGridMeeting(gridData);
            console.log(res.data);
            //setModalOpen(0);
            chosenMsgBox = MSG_SUCCESS_CREATE;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")
            })
        })    
    }
    
    function modifyClassMeeting(meeting) {
        console.log('Modif',meeting);
        CURRENT_MEETING = meeting;
           
        axiosInstance.post(`update-conseil-classe/`, {
            id_conseil_classe              : meeting.id_conseil_classe,
            id_sousetab                    : meeting.id_sousetab,
            id_classe                      : meeting.classeId,
            id_pp                          : meeting.profPrincipalId,
            id_pp_user                     : meeting.currentPpUserId,
            type_conseil                   : meeting.type_conseilId,
            date_prevue                    : meeting.date,
            heure_prevue                   : meeting.heure,
            id_periode                     : meeting.id_periode,
            alerter_membres                : meeting.alerter_membres,
            id_membres                     : meeting.id_membres,
            roles_membres                  : meeting.roles_membres,
            
            id_eleves                      : meeting.id_eleves,
            list_decisions_conseil_eleves  : meeting.id_eleves,
            list_classes_promotions_eleves : meeting.id_eleves,
            resume_general_decisions       : meeting.resume_general_decisions,
            membre_presents                : meeting.membre_presents,
            to_close                       : meeting.to_close

        }).then((res)=>{
           var gridData = createGridData(res.data.conseil_classes)
            setGridMeeting(gridData);
            console.log(res.data);

           //setModalOpen(0);
           if(meeting.to_close==1){                
            chosenMsgBox = MSG_SUCCESS_UPDATE_PRINT;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("success_add_M"), 
                message:t("success_add") + ' '+ t("print_pv") + '?'
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
   
    function AddNewMeetingHandler(e){
       
        if(CURRENT_CLASSE_ID != undefined){         
            DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(DEFAULT_MEMBERS_ADD,   true,   1);
            OTHER_MEMBERS     =  createLabelValueTableWithUserS(OTHER_MEMBERS_ADD,     false, -1);
            PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(PRESENTS_MEMBERS_ADD,  true,   0);
            
            if(isLoading==false){
                setModalOpen(1); 
                initFormInputs();
                setLoadingVisible(false);
            }else{
                setLoadingVisible(true);
            }
          
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
                //setModalOpen(4); //debut de l'impression
                //printMeetingReport()
                getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab);  
                return 1;
            }

            case MSG_SUCCESS_UPDATE:{
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab);  
                //setModalOpen(0); 
                return 1;

            }

            case MSG_SUCCESS_UPDATE_PRINT:{
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab); 
                printMeetingReport() 
                //setModalOpen(0); 
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
                //getClassStudentList(CURRENT_CLASSE_ID); 
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
                
                typeMeeting     : CURRENT_MEETING.objetLabel,
                compteRendu     : CURRENT_MEETING.decision,
                successMark     : '', //CURRENT_MEETING.note_passage,
                exclusionMark   : '', //CURRENT_MEETING.note_exclusion,
                elevesDecisions : [], // pour le moment [...CURRENT_MEETING.listCaspasCas],
                participants    : [...CURRENT_MEETING.listParticipants],

                leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders:["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
                rightHeaders:["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
                pageImages:["images/collegeVogt.png"],
                pageTitle: "Proces verbal du conseil de classe de la classe de  " + CURRENT_CLASSE_LABEL,
               
                numberEltPerPage:ROWS_PER_PAGE  
            };
            printedETFileName = "PV_Conseil_classe("+CURRENT_CLASSE_LABEL+").pdf"
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
            {LoadingVisible && 
                <div className={classes.formET} style={{alignItems:"center", width:'100%', height:'100%', backgroundColor:"white"}}>
                    <img src='images/Loading_icon.gif' alt="loading..." />
                </div>    
            }
            {(modalOpen!=0) && <BackDrop/>}
            {(modalOpen >0 && modalOpen<4) && 
                <AddClassMeeting 
                    defaultMembres     = {DEFAULT_MEMBERS}  
                    otherMembres       = {OTHER_MEMBERS} 
                    presentsMembres    = {PRESENTS_MEMBERS} 
                    sequencesDispo     = {SEQUENCES_DISPO} 
                    trimestresDispo    = {TRIMESTRES_DISPO} 
                    anneDispo          = {ANNEE_DISPO} 
                    currentPpUserId    = {CURRENT_PROF_PP_USERID} 
                    currentPpId        = {CURRENT_PROF_PP_ID} 
                    currentPpLabel     = {CURRENT_PROF_PP_LABEL} 
                    currentClasseLabel = {CURRENT_CLASSE_LABEL} 
                    currentClasseId    = {CURRENT_CLASSE_ID} 
                    formMode           = {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  
                    actionHandler      = {(modalOpen==1) ? addClassMeeting : modifyClassMeeting} 
                    printReportHandler = {printReport}
                    cancelHandler      = {quitForm}
                />
            }
            {(modalOpen==4) && 
                <PDFTemplate previewCloseHandler={closePreview}>
                    { isMobile?
                        <PDFDownloadLink  document ={ <PVCCMeeting pageSet={CCPageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "loading...":  <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>                    
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <PVCCMeeting pageSet={CCPageSet}/>
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
            <div className={classes.inputRow} >
                {(props.formMode=='ajout')?  
                    <div className={classes.formTitle}>
                        {t('gest_conseilC_M')}  
                    </div>
                    :
                    <div className={classes.formTitle}>
                        {t('consult_conseilC_M')} 
                    </div>
                }
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('conseilC_list_M')}  :
                        </div>
                      
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
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
                            getCellClassName={(params) => (params.field==='etatLabel' && params.row.status==1)?  classes.clotureStyle: (params.field==='etatLabel' && params.row.status==0) ? classes.enCoursStyle : classes.gridRowStyle }
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
export default ConseilClasse;