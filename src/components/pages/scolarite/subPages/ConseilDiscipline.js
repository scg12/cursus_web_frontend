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

var CURRENT_MEETING={};
let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
let CONVOQUE_PAR ={};

var CURRENT_MEETING={};
var printedETFileName='';
var SEQUENCES_DISPO = [];
var TRIMESTRES_DISPO  = [];
var ANNEE_DISPO = [];
var DEFAULT_MEMBERS = []; 
var OTHER_MEMBERS = [];
var PRESENTS_MEMBERS = [];

var printedETFileName='';

var listElt ={
    rang:1, 
    presence:1, 
    matricule:"",
    displayedName:'',
    nom: '',
    prenom: '', 
    date_naissance: '', 
    lieu_naissance:'', 
    date_entree:'', 
    nom_pere: '',  
    nom_mere : '',
    tel_pere : '',
    tel_mere : '',
    email_pere : '',
    email_mere : '',
    etab_provenance:'',
    id:1,
    redouble: '',
    sexe:'M', 
    
    nom_parent      : '', 
    tel_parent      : '', 
    email_parent    : '',
   
}

var MEETING = {
    //---Infos Generales 
    id:-1,
    classId : 0,
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
   
    //---prof presents
    listPresents : [],

    //---decisions cas par cas
    listCaspasCas : [],

    //---Eleves convoques
    listConvoques: [],
};




var pageSet = [];

var page = {
    pageTitle:'',
    pageRows:[],
    pageNumber:0,
}

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const ROWS_PER_PAGE= 40;
var ElevePageSet=[];
var CCPageSet=[];

function ConseilDiscipline(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid] = useState(false);
    const [gridMeeting, setGridMeeting]= useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse] = useState([]);
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

    const getListConseilDiscipline =(classeId,sousEtabId)=>{
        axiosInstance.post(`list-conseil-disciplines/`, {
            id_classe: classeId,
            id_sousetab: sousEtabId
        }).then((res)=>{
            console.log("donnees",res.data);
            CONVOQUE_PAR.USERID = res.data.convoque_par.id_user;
            CONVOQUE_PAR.ROLE   = res.data.convoque_par.type;
            CONVOQUE_PAR.NOM    =  res.data.convoque_par.nom;

            SEQUENCES_DISPO   =  createLabelValueTable(res.data.seqs_dispo);
            TRIMESTRES_DISPO  =  createLabelValueTable(res.data.trims_dispo);
            DEFAULT_MEMBERS   =  (res.data.conseil_classes.length>0) ?  createLabelValueTableWithUserS(res.data.conseil_classes.membres) : [];
            OTHER_MEMBERS     =  (res.data.conseil_classes.length>0) ?  createLabelValueTableWithUserS(res.data.conseil_classes.membres_a_ajouter) : [];
            PRESENTS_MEMBERS  =  (res.data.conseil_classes.length>0) ?  createLabelValueTableWithUserS(res.data.conseil_classes.membres_presents)  : [];
            ANNEE_DISPO = [{value:"annee",label:t("annee")+' '+new Date().getFullYear()}]

            var listConseils = [...formatList(res.data.conseil_classes, res.data.prof_principal, res.seqs_dispo, res.trims_dispo)]
            console.log(listConseils);
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

    function createLabelValueTableWithUserS(tab){
        var resultTab = [];
        if(tab.length>0){
            tab.map((elt)=>{
                resultTab.push({value:elt.id_user, label:elt.nom, role:elt.type});
            })
        }
        return resultTab;
    }




   
   

    function formatList(listConseil,ConvoquePar,seqInfos,trimInfos){
        var rang = 1;
        var formattedList =[]
        listConseil.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.date_prevue  = elt.date_prevue;
            listElt.heure_prevue = elt.heure_prevue;
            listElt.type_conseil = elt.type_conseil;
            listElt.id_type_conseil = elt.id_type_conseil;
            listElt.nom = ConvoquePar.nom;
            listElt.user_id = ConvoquePar.id_user;
            listElt.rang = rang; 
            listElt.status = elt.status; 
            listElt.periodeId = elt.status;
            listElt.periode = getPeriodeLabel(listElt.id_type_conseil,seqInfos, trimInfos);
            listElt.etatLabel = (elt.status == 0) ? t('en_cours') :t('cloture');
            listElt.date_effective = (elt.status == 1) ? elt.date_effective : "";      
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    function getPeriodeLabel(idPeriode, listSequence, listTrimestres){
        var foundedPeriode={};        
        foundedPeriode = listSequence.find((seq)=>(seq.id==idPeriode));
        if (foundedPeriode==-1){
            foundedPeriode = listTrimestres.find((trim)=>(trim.id==idPeriode));
            if (foundedPeriode==-1){
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
            
            getListConseilDiscipline(CURRENT_CLASSE_ID, currentAppContext.currentEtab);  
               
        }else{
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setGridMeeting([]);
            setIsValid(false);
        }
    }

/*************************** DataGrid Declaration ***************************/ 

const conseil_data =[
    {id:1, date:'12/05/2023', heure:'12:45', objetId:1, objetLabel:'Bilan sequentiel', responsableId:11, responsableLabel:'Mr MBALLA Alfred',   profPrincipalLabel:'Mr MBARGA Alphonse',  etat:0,  etatLabel:  'En cours', decision:'blallalalalal' },
    {id:2, date:'18/05/2023', heure:'08:45', objetId:1, objetLabel:'Bilan sequentiel', responsableId:12, responsableLabel:'Mr TOWA Luc',        profPrincipalLabel:'Mr MBARGA Alphonse',  etat:0,  etatLabel:  'En cours', decision:'blallalalalal' },
    {id:3, date:'02/05/2023', heure:'09:30', objetId:1, objetLabel:'Bilan sequentiel', responsableId:13, responsableLabel:'Mr OBATE Simplice',  profPrincipalLabel:'Mr MBARGA Alphonse',  etat:0,  etatLabel:  'En cours', decision:'blallalalalal' },
    {id:4, date:'17/05/2023', heure:'15:45', objetId:1, objetLabel:'Bilan sequentiel', responsableId:14, responsableLabel:'Mr TSALA Pascal',    profPrincipalLabel:'Mr MBARGA Alphonse',  etat:1,  etatLabel:  'Cloture' , decision:'blallalalalal' },
    {id:5, date:'03/05/2023', heure:'10:20', objetId:1, objetLabel:'Bilan sequentiel', responsableId:15, responsableLabel:'Mr TCHIALEU Hugues', profPrincipalLabel:'Mr MBARGA Alphonse',  etat:1,  etatLabel:  'Cloture' , decision:'blallalalalal' }
];
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

    
   /* {
        field: 'responsableId',
        headerName: 'CHEF DE CONSEIL',
        width: 50,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },*/

    /*{
        field: 'responsableLabel',
        headerName: 'CHEF DE CONSEIL',
        width: 180,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },*/

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

    /*{
        field: 'decision',
        headerName: 'DECISION DU CONSEIL',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },*/

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
        hide:(props.formMode=='ajout')? false : true,
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
    
       /* {
            field: 'responsableId',
            headerName: 'CHEF DE CONSEIL',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },*/
    
        /*{
            field: 'responsableLabel',
            headerName: 'CHEF DE CONSEIL',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },*/
    
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
    
        /*{
            field: 'decision',
            headerName: 'DECISION DU CONSEIL',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },*/
    
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
            hide:(props.formMode=='ajout')? false : true,
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
        
        inputs[0]= row.id;
        inputs[1]= row.responsableId;
        inputs[2]= row.date;
        inputs[3]= row.heure;
        //inputs[4]= row.objetId;
        
        inputs[5]= row.autreObjet;
        inputs[6]= row.decision;
        inputs[7]= row.note_passage;

        inputs[8] = row.note_exclusion;
        inputs[9] = row.etat;

        inputs[10]= row.responsableLabel;
        //inputs[11]= row.objetLabel;
        
        currentUiContext.setFormInputs(inputs);
        console.log("laligne",row, currentUiContext.formInputs);
        setModalOpen(2);
    }

    function consultRowData(row){
        var inputs=[];

        inputs[0]= row.id;
        inputs[1]= row.responsableId;
        inputs[2]= row.date;
        inputs[3]= row.heure;
        //inputs[4]= row.objetId;
        
        inputs[5]= row.autreObjet;
        inputs[6]= row.decision;
        inputs[7]= row.note_passage;

        inputs[8] = row.note_exclusion;
        inputs[9] = row.etat;

        inputs[10]= row.responsableLabel;
        //inputs[11]= row.objetLabel;
       
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);
    }

  
    function addClassMeeting(meeting) {       
        console.log('Ajout',meeting);
        conseil_data.push(meeting);
        setGridMeeting(conseil_data);
        CURRENT_MEETING = meeting;
        chosenMsgBox = MSG_SUCCESS;
        currentUiContext.showMsgBox({
            visible:true, 
            msgType:"question", 
            msgTitle:t("success_add_M"), 
            message:t("success_add")+"\n"+t("print_pv_question") 
        })
           
        /*axiosInstance.post(`create-eleve/`, {
            id_classe : CURRENT_CLASSE_ID,
            id_sousetab:currentAppContext.currentEtab,
            matricule : eleve.matricule, 
            nom : eleve.nom,
            adresse : eleve.adresse,
            prenom : eleve.prenom, 
            sexe : eleve.sexe,
            date_naissance : eleve.date_naissance,
            lieu_naissance : eleve.lieu_naissance,
            date_entree : eleve.date_entree,
            nom_pere : eleve.nom_pere,
            prenom_pere : eleve.prenom_pere, 
            nom_mere : eleve.nom_mere,
            prenom_mere : eleve.prenom_mere, 
            tel_pere : eleve.tel_pere,    
            tel_mere : eleve.tel_mere,    
            email_pere : eleve.email_pere,
            email_mere : eleve.email_mere,
            photo_url : eleve.photo_url, 
            redouble : (eleve.redouble == "O") ? true : false,
            age :  eleve.age,
            est_en_regle : eleve.est_en_regle,
            etab_provenance : eleve.etab_provenance,            
        }).then((res)=>{
            console.log(res.data);

            setModalOpen(0);
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")+"\n"+t("print_pv_question") 
            })
        })  */    
    }
    
    function modifyClassMeeting(meeting) {
        console.log('update',meeting);
        conseil_data.push(meeting);
        setGridMeeting(conseil_data);
        CURRENT_MEETING = meeting;
        chosenMsgBox = MSG_SUCCESS;
        currentUiContext.showMsgBox({
            visible:true, 
            msgType:"question", 
            msgTitle:t("success_add_M"), 
            message:t("success_add")+"\n"+t("notify_prof")
        })
     
        /*axiosInstance.post(`update-eleve/`, {
            id_classe : CURRENT_CLASSE_ID,
            id : eleve.id, 
            nom : eleve.nom,
            adresse : eleve.adresse,
            prenom : eleve.prenom, 
            sexe : eleve.sexe,
            date_naissance : eleve.date_naissance,
            lieu_naissance : eleve.lieu_naissance,
            date_entree : eleve.date_entree,
            nom_pere : eleve.nom_pere,
            prenom_pere : eleve.prenom_pere, 
            nom_mere : eleve.nom_mere,
            prenom_mere : eleve.prenom_mere, 
            tel_pere : eleve.tel_pere,    
            tel_mere : eleve.tel_mere,    
            email_pere : eleve.email_pere,
            email_mere : eleve.email_mere,
            photo_url : eleve.photo_url, 
            redouble : (eleve.redouble == "O") ? true : false,
            age :  eleve.age,
            est_en_regle : eleve.est_en_regle,
            etab_provenance : eleve.etab_provenance, 

        }).then((res)=>{
            console.log(res.data);
            setModalOpen(0);
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")+"\n"+t("notify_prof")
            })
           
            
        })*/
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
            setModalOpen(1); 
            initFormInputs();
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

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
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

            case MSG_SUCCESS: {
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
            
            {(modalOpen!=0) && <BackDrop/>}
            {(modalOpen >0 && modalOpen<4) && <AddDisciplinMeeting convoquePar={CONVOQUE_PAR}  currentClasseLabel={CURRENT_CLASSE_LABEL} currentClasseId={CURRENT_CLASSE_ID} formMode={(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  actionHandler={(modalOpen==1) ? addClassMeeting : modifyClassMeeting} cancelHandler={quitForm} />}
            {(modalOpen==4) &&
                <PDFTemplate previewCloseHandler={closePreview}>
                    { isMobile?
                        <PDFDownloadLink  document ={<PVCDMeeting pageSet={CCPageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "loading...":  <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
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
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {"oui"}
                    buttonRejectText = {"non"}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />               
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
                            getCellClassName={(params) => (params.field==='etatLabel' && params.row.etat ==1)?  classes.clotureStyle: (params.field==='etatLabel' && params.row.etat ==0) ? classes.enCoursStyle : classes.gridRowStyle }
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