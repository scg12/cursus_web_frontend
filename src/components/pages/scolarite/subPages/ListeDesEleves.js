import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddStudent from "../modals/AddStudent";
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import MultiSelect from '../../../multiSelect/MultiSelect';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, getTodayDate, darkGrey, ajouteZeroAuCasOu, convertDateToAAAAMMjj} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import PDFTemplate from '../reports/PDFTemplate';
import {isMobile} from 'react-device-detect';
import StudentList from '../reports/StudentList';
import StudentListTemplate from '../reports/StudentListTemplate';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";
import ImportExportData from '../modals/ImportExportData';
import ImportWizard from '../modals/ImportWizard';


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;

var MOUSE_INSIDE_DROPDOWN = false;

var listElt ={}


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
var printedETFileName ='';
var tempTable;
var MultiSelectId = "searchStudent";

var LIST_GENERALE_ELEVES   = [];
var list_destinataire      = "";
var list_destinataires_ids = "";
var DATA_IMPORTED          = undefined


function ListeDesEleves(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid]                       = useState(false);
    const [gridRows, setGridRows]                     = useState([]);
    const [exportData, setExportData]                 = useState([]);
    const [modalOpen, setModalOpen]                   = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse]                    = useState([]);
    const [listEleves, setListEleves]                 = useState([]);
    const [isDataImport, setIsDataImport]             = useState(true);
    const [imageUrl, setImageUrl]                     = useState('');
    const [multiSelectVisible, setMultiSelectVisible] = useState(false);
    const [importedData, setImportedData]             = useState([]);
    const selectedTheme = currentUiContext.theme;

    const EXPORT_TEMPLATE = [
        {   
            rang               : "",
            nom                : "",
            prenom             : "",
            age                : "",
            sexe               : "",
            date_naissance     : "",
            lieu_naissance     : "",
            date_entree        : "",
            nom_pere           : "",
            prenom_pere        : "",
            tel_pere           : "",
            email_pere         : "",
            nom_mere           : "",
            prenom_mere        : "",
            tel_mere           : "",
            email_mere         : "",
            etab_provenance    : "",
            redouble           : "",          
        }
    ]

    useEffect(()=> {
        
        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }

        var cnv = document.getElementById('output');
        while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
        var cnx = cnv.getContext('2d');
        var url = darkGrey(document.getElementById("logo_url").value,cnv,cnx);
        setImageUrl(url);

        getEtabListClasses();
        
    },[]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;


    const getEtabListClasses=()=>{
       var tempTable=[{value: '0',      label: (i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '  }]
       let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
       console.log(classes)
       let classes_user;
       if(currentAppContext.infoUser.is_prof_only) 
            classes_user = currentAppContext.infoUser.prof_classes;
       else
            classes_user = currentAppContext.infoUser.admin_classes;
       console.log(currentAppContext.infoUser.is_prof_only,classes_user)

       let n = classes_user.length;
       let m = classes.length;
       let i = 0;
       let j = 0;
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
        // axiosInstance.post(`list-classes/`, {
        //     id_sousetab: currentAppContext.currentEtab,
        // }).then((res)=>{
        //         res.data.map((classe)=>{
        //         tempTable.push({value:classe.id, label:classe.libelle})
        //         setOpClasse(tempTable);
        //         console.log(res.data)
        //    })         
        // }) 
       
    }

    const  getClassStudentList=(classId)=>{
        var listEleves       = [];
        var listElevesExport = [];
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves           = [...formatList(res.data)];
            LIST_GENERALE_ELEVES = [...formatList(res.data)];
            listElevesExport     = [...createExportList(res.data)];
            

            console.log(listEleves);
            setGridRows(listEleves);
            setExportData(listElevesExport);
            console.log("donnees",exportData,listElevesExport);
        })  
        return listEleves;     
    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id              = elt.id;
            listElt.label           = elt.nom +' '+elt.prenom;
            listElt.displayedName   = elt.nom +' '+elt.prenom;
            listElt.nom             = elt.nom;
            listElt.age             = elt.age;
            listElt.prenom          = elt.prenom;
            listElt.rang            = rang; 
            listElt.presence        = 1; 
            listElt.matricule       = elt.matricule;
            listElt.date_naissance  = convertDateToUsualDate(elt.date_naissance);
            listElt.lieu_naissance  = elt.lieu_naissance;
            listElt.date_entree     = elt.date_entree;
            listElt.nom_pere        = elt.nom_pere;
            listElt.tel_pere        = elt.tel_pere;    
            listElt.email_pere      = elt.email_pere;
            listElt.nom_mere        = elt.nom_mere;
            listElt.tel_mere        = elt.tel_mere;   
            listElt.email_mere      = elt.email_mere;
            listElt.etab_provenance = elt.etab_provenance;
            listElt.sexe            = elt.sexe;
            listElt.photo_url       = elt.photo_url;
            listElt.redouble        = (elt.redouble == false) ? (i18n.language=='fr') ? "Nouveau" : "Non repeating" : (i18n.language=='fr') ? "Redoublant" :"Repeating";

            listElt.nom_parent      = (elt.nom_pere.length>0) ? elt.nom_pere:elt.nom_mere ;
            listElt.tel_parent      = (elt.nom_pere.length>0) ? elt.tel_pere : elt.tel_mere;    
            listElt.email_parent    = (elt.nom_pere.length>0) ? elt.email_pere : elt.email_mere;

            
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    const createExportList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.rang            = ajouteZeroAuCasOu(rang) ; 
            listElt.matricule       = elt.matricule;           
            listElt.nom             = elt.nom;
            listElt.prenom          = elt.prenom;
            listElt.age             = elt.age;      
            listElt.sexe            = elt.sexe;  
            listElt.date_naissance  = convertDateToUsualDate(elt.date_naissance);
            listElt.lieu_naissance  = elt.lieu_naissance;
            listElt.date_entree     = elt.date_entree;
            listElt.nom_pere        = elt.nom_pere;
            listElt.tel_pere        = elt.tel_pere;    
            listElt.email_pere      = elt.email_pere;
            listElt.nom_mere        = elt.nom_mere;
            listElt.tel_mere        = elt.tel_mere;   
            listElt.email_mere      = elt.email_mere;
            listElt.etab_provenance = elt.etab_provenance;           
            listElt.redouble        = (elt.redouble == false) ? (i18n.language=='fr') ? "Nouveau" : "Non repeating" : (i18n.language=='fr') ? "Redoublant" :"Repeating";

            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }
    


    function dropDownHandler(e){
        //console.log(e.target.value)
        var grdRows;
        if(e.target.value != optClasse[0].value){
            setIsValid(true);
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getClassStudentList(CURRENT_CLASSE_ID);   
            console.log(CURRENT_CLASSE_LABEL);   
            document.getElementById("searchText").value = "";       
        }else{
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setGridRows([]);
            setIsValid(false);
            document.getElementById("searchText").value ="";
        }
    }

    function searchTextChangeHandler(e){
        var name = e.target.value;
        console.log("fffff",name,LIST_GENERALE_ELEVES)
        //var tabEleves     = [...listEleves];        
        var matchedEleves =  LIST_GENERALE_ELEVES.filter((elt)=>elt.displayedName.toLowerCase().includes(name.toLowerCase()));
        setGridRows(matchedEleves);
        setListEleves(matchedEleves);
    }


    function validateSelectionHandler(e){
        list_destinataire      = document.getElementById("hidden2_"+MultiSelectId).value;
        list_destinataires_ids = document.getElementById("hidden1_"+MultiSelectId).value;
        var searchedName       =  document.getElementById("searchText").value;
        var matchedEleves =  LIST_GENERALE_ELEVES.filter((elt)=>elt.displayedName.toLowerCase().includes(searchedName.toLowerCase()));
        setListEleves([]);
        setGridRows(matchedEleves);
        setMultiSelectVisible(false);
    }

 
/*************************** DataGrid Declaration ***************************/    
const columnsFr = [
       
    {
        field: 'matricule',
        headerName: 'MATRICULE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'displayedName',
        headerName: 'NOM ET PRENOM(S)',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'nom',
        headerName: 'NOM',
        width: 200,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },
   
    {
        field: 'prenom',
        headerName: 'PRENOM',
        width: 200,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'date_naissance',
        headerName: 'DATE NAISSANCE',
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'lieu_naissance',
        headerName: 'LIEU NAISANCE',
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'date_entree',
        headerName: 'DATE ENTREE',
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle,
            
    },

    {
        field: 'nom_parent',
        headerName: 'NOM PARENT',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field: 'tel_parent',
        headerName: 'TEL. PARENT',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'email_parent',
        headerName: 'EMAIL PARENT',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'nom_pere',
        headerName: 'NOM PERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field: 'tel_pere',
        headerName: 'TEL. PERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'email_pere',
        headerName: 'EMAIL PERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'nom_mere',
        headerName: 'NOM MERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field: 'tel_mere',
        headerName: 'TEL. MERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'email_mere',
        headerName: 'EMAIL MERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },


    {
        field: 'redouble',
        headerName: 'SITUATION',
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle,
            
    },

    {
        field: 'photo_url',
        headerName: 'photo',
        hide:true,
        width: 110,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle,            
    },

    {
        field: 'sexe',
        headerName: 'SEXE',
        hide:true,
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle,            
    },

    {
        field: 'id',
        headerName: '',
        width: 15,
        editable: false,
        hide:(props.formMode=='ajout')? false : true,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            return(
                <div className={classes.inputRow}>
                    <img src="icons/baseline_edit.png"  
                        width     = {17} 
                        height    = {17} 
                        className = {classes.cellPointer} 
                        onClick={(event)=> {
                            event.ignore = true;
                        }}
                        alt=''
                    />
                    {(params.row.email_mere=='' && params.row.email_pere=='') ?
                        <img src="images/defautEmail.png"  
                            width     = {20} 
                            height    = {20} 
                            style     = {{marginLeft:'1vw', borderRadius:10}}
                            className = {classes.cellPointer} 
                            alt=''
                        />
                        :
                        <img src="images/blank.png"  
                            width     = {20} 
                            height    = {20} 
                            style     = {{marginLeft:'1vw', borderRadius:10}}
                            className = {classes.cellPointer} 
                            alt=''
                        />
                    }
                </div>
            )}           
            
        },
    ];

    const columnsEn = [
       
        {
            field: 'matricule',
            headerName: 'REG. CODE',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'displayedName',
            headerName: 'NAME AND SURNAME',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'nom',
            headerName: (i18n.lng=='fr')?'NOM':'NAME',
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
       
        {
            field: 'prenom',
            headerName: 'SURNAME',
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'date_naissance',
            headerName: 'BIRTH DATE',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'lieu_naissance',
            headerName:'BIRTH PLACE',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_entree',
            headerName:'REG. YEAR',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
    
        {
            field: 'nom_parent',
            headerName:'PARENT NAME',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'tel_parent',
            headerName:'PARENT TEL.',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'email_parent',
            headerName:'PARENT EMAIL',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'nom_pere',
            headerName:'FATHER NAME',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'tel_pere',
            headerName:'FATHER TEL.',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'email_pere',
            headerName:'FATHER EMAIL',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'nom_mere',
            headerName:'MOTHER NAME',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'tel_mere',
            headerName: 'MOTHER TEL.',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'email_mere',
            headerName:'MOTHER EMAIL',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
    
        {
            field: 'redouble',
            headerName:'SITUATION',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
    
        {
            field: 'sexe',
            headerName:'SEX',
            hide:true,
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,                
        },

        {
            field: 'photo_url',
            headerName: 'photo',
            hide:true,
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle,            
        },
    
        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:(props.formMode=='ajout')? false : true,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
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

                        {(params.row.email_mere=='' && params.row.email_pere=='')?
                            <img src="images/defautEmail.png"  
                                width     = {20} 
                                height    = {20} 
                                style     = {{marginLeft:'1vw', borderRadius:10}}
                                className = {classes.cellPointer} 
                                alt=''
                            />
                            :
                            <img src="images/blank.png"  
                                width     = {20} 
                                height    = {20} 
                                style     = {{marginLeft:'1vw', borderRadius:10}}
                                className = {classes.cellPointer} 
                                alt=''
                            />
                        }
                    </div>
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
        
        inputs[0] = row.nom;
        inputs[1] = row.prenom;
        inputs[2] = row.date_naissance;
        inputs[3] = row.lieu_naissance;
        inputs[4] = row.etab_provenance;

        inputs[5] = row.nom_pere;
        inputs[6] = row.email_pere;
        inputs[7] = row.tel_pere;

        inputs[8] = row.nom_mere;
        inputs[9] = row.email_mere;
        inputs[10]= row.tel_mere;

        inputs[11]= row.id;

        inputs[12]=(row.sexe=='masculin'||row.sexe=='M')?'M':'F';
        inputs[13]= (row.redouble=='Redoublant')? 'O': 'N';

        inputs[14]= row.date_entree;
        inputs[15]= row.photo_url;

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
        inputs[15]= row.photo_url;

     
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);

    }

    function addNewStudent(eleve) {       
        console.log('Ajout',eleve);
           
        axiosInstance.post(`create-eleve/`, {
            id_classe       : CURRENT_CLASSE_ID,
            id_sousetab     : currentAppContext.currentEtab,
            matricule       : eleve.matricule, 
            nom             : eleve.nom,
            adresse         : eleve.adresse,
            prenom          : eleve.prenom, 
            sexe            : eleve.sexe,
            date_naissance  : eleve.date_naissance,
            lieu_naissance  : eleve.lieu_naissance,
            date_entree     : eleve.date_entree,
            nom_pere        : eleve.nom_pere,
            prenom_pere     : eleve.prenom_pere, 
            nom_mere        : eleve.nom_mere,
            prenom_mere     : eleve.prenom_mere, 
            tel_pere        : eleve.tel_pere,    
            tel_mere        : eleve.tel_mere,    
            email_pere      : eleve.email_pere,
            email_mere      : eleve.email_mere,
            photo_url       : eleve.photo_url, 
            redouble        : (eleve.redouble == "O") ? true : false,
            age             : eleve.age,
            est_en_regle    : eleve.est_en_regle,
            etab_provenance : eleve.etab_provenance, 
            id_user         : currentAppContext.idUser           
        }).then((res)=>{
            console.log(res.data);
            var status = res.data.status;

            setModalOpen(0);
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")
            })
        })      
    }
    
    function modifyStudent(eleve) {
        console.log('Modif',eleve);
     
        axiosInstance.post(`update-eleve/`, {
            id_classe       : CURRENT_CLASSE_ID,
            id              : eleve.id, 
            id_sousetab     : currentAppContext.currentEtab,
            matricule       : eleve.matricule, 
            nom             : eleve.nom,
            adresse         : eleve.adresse,
            prenom          : eleve.prenom, 
            sexe            : eleve.sexe,
            date_naissance  : eleve.date_naissance,
            lieu_naissance  : eleve.lieu_naissance,
            date_entree     : eleve.date_entree,
            nom_pere        : eleve.nom_pere,
            prenom_pere     : eleve.prenom_pere, 
            nom_mere        : eleve.nom_mere,
            prenom_mere     : eleve.prenom_mere, 
            tel_pere        : eleve.tel_pere,    
            tel_mere        : eleve.tel_mere,    
            email_pere      : eleve.email_pere,
            email_mere      : eleve.email_mere,
            photo_url       : eleve.photo_url, 
            redouble        : (eleve.redouble == "O") ? true : false,
            age             :  eleve.age,
            est_en_regle    : eleve.est_en_regle,
            etab_provenance : eleve.etab_provenance, 
            id_user         : currentAppContext.idUser

        }).then((res)=>{
            console.log(res.data);
            setModalOpen(0);
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_modif_M"), 
                message:t("success_modif")
            })
            
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
   
    function AddNewStudentHandler(e){
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
                getClassStudentList(CURRENT_CLASSE_ID); 
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
        
    }

    const printStudentList=()=>{
       
        if(CURRENT_CLASSE_ID != undefined){
            var PRINTING_DATA ={
                dateText         : 'Yaounde, ' + t('le')+' '+ getTodayDate(),
                leftHeaders      : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders    : [currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+'  Telephone:'+ currentAppContext.currentEtabInfos.tel],
                rightHeaders     : ["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", t("annee_scolaire")+' '+ currentAppContext.activatedYear.libelle],
                pageImages       : [imgUrl], 
                pageImagesDefault: [imgUrlDefault],
                pageTitle        : t("studentList_of")+' : '+ CURRENT_CLASSE_LABEL,
                tableHeaderModel : [t("matricule_short"), t('displayedName_M'), t("form_dateNaiss"), t("form_lieuNaiss"), t("enrole en"), t("nom_parent"), t("nouveau")],
                tableData        : [...gridRows],
                numberEltPerPage : ROWS_PER_PAGE  
            };
            printedETFileName    = 'Liste_eleves('+CURRENT_CLASSE_LABEL+').pdf';
            setModalOpen(4);
            ElevePageSet         = [];
            ElevePageSet         = createPrintingPages(PRINTING_DATA,i18n.language);
            console.log("ici la",ElevePageSet,gridRows);                    
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

    function handleImport(importedData){
        console.log("donnees importees", importedData);
        DATA_IMPORTED = [...importedData];
        setImportedData(importedData);
        setModalOpen(6)
    }


    function checkImportedData(eleve,row){         
        var errorMsg='';

        console.log("eleve+row",eleve)

        if(eleve.nom == undefined || eleve.nom.length == 0){
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_student_name'); 
            return errorMsg;
        }

        if (eleve.prenom == undefined || eleve.prenom.length == 0 ) {
            errorMsg=  t('row')+ ' '+ row +': '+ t('enter_student_surname'); 
            return errorMsg;
        }

        if(eleve.date_naissance == undefined || eleve.date_naissance.length==0) {
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_correct_bithDate'); 
            return errorMsg;
        } 

        if(!((isNaN(convertDateToAAAAMMjj(eleve.date_naissance)) && (!isNaN(Date.parse(convertDateToAAAAMMjj(eleve.date_naissance))))))){
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_correct_bithDate'); 
            return errorMsg;
        }

        if(eleve.lieu_naissance.length == 0 ){
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_student_bithPlace');  
            return errorMsg;
        } 

        
        if(eleve.nom_pere == undefined && eleve.nom_mere == undefined){
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_parent_name_atLeast'); 
            return errorMsg;
        }
        

        //------------------ Permettre aussi a l'import de ne mettre aucun email. Cette donnee pourra etre mise a jour apres ----------- 
        // if( eleve.email_pere == undefined &&  eleve.email_mere == undefined){
        //     errorMsg= t('row')+ ' '+ row +': '+ t('enter_parent_email_atLeast'); 
        //     return errorMsg;
        // }
    

        if(eleve.email_pere != undefined && !eleve.email_pere.includes('@')){
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_father_correct_email'); 
            return errorMsg ;
        }  

        if(eleve.email_mere != undefined && !eleve.email_mere.includes('@')){
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_mother_correct_email'); 
            return errorMsg;
        } 
            
        
        if((eleve.tel_mere==undefined && eleve.tel_pere==undefined)||(eleve.tel_mere!= undefined && eleve.tel_mere.length >0 && isNaN(eleve.tel_mere.replace(/\s/g,'')))||(eleve.tel_pere!= undefined && eleve.tel_pere.length >0 && isNaN(eleve.tel_pere.replace(/\s/g,''))) ){
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_correct_phone_number'); 
            console.log(eleve.tel_pere.replace(/\s/g,''))
            return errorMsg;
        }

        return errorMsg;    
    }


    function insertImportedDataInBD(eleve){
        console.log("date convertie", convertDateToAAAAMMjj(eleve.date_naissance));

        axiosInstance.post(`create-eleve/`, {
            id_classe       : CURRENT_CLASSE_ID,
            id_sousetab     : currentAppContext.currentEtab,
            nom             : eleve.nom,
            adresse         : "",
            prenom          : eleve.prenom, 
            sexe            : eleve.sexe,
            date_naissance  : convertDateToAAAAMMjj(eleve.date_naissance),
            lieu_naissance  : eleve.lieu_naissance,
            date_entree     : eleve.date_entree,
            nom_pere        : eleve.nom_pere==undefined?    "" : eleve.nom_pere,
            prenom_pere     : eleve.prenom_pere==undefined? "" : eleve.prenom_pere,
            nom_mere        : eleve.nom_mere==undefined?    "" : eleve.nom_mere,
            prenom_mere     : eleve.prenom_mere==undefined? "" : eleve.prenom_mere,
            tel_pere        : eleve.tel_pere==undefined?    "" : eleve.tel_pere,    
            tel_mere        : eleve.tel_mere==undefined?    "" : eleve.tel_mere,
            email_pere      : eleve.email_pere==undefined?  "" : eleve.email_pere,
            email_mere      : eleve.email_mere==undefined?  "" : eleve.email_mere,
            photo_url       : "", 
            redouble        : (eleve.redouble == "O") ? true : false,
            age             : eleve.age,
            est_en_regle    : false,
            etab_provenance : eleve.etab_provenance, 
            id_user         : currentAppContext.idUser           
        }).then((res)=>{
            console.log("resultat ajout",res.data);
            //----- On met la donnee ds un tableau pour faire le formatList ------
            var tabEleve = [];
            tabEleve.push(res.data.eleve);
            var elevResult = formatList(tabEleve); 

            //----- On met la donnee ds la grille ------            
            LIST_GENERALE_ELEVES.push(elevResult[0]);    
            console.log("liste totale",LIST_GENERALE_ELEVES)       
            setGridRows((gridRows)=>[...gridRows, elevResult[0]]);          
        })      
    }

    // function refreshGrid(){
    //     var gridData  = [...gridRows];
    //     var  allData = gridData.concat(DATA_IMPORTED);
    //     setGridRows(allData);
    // }

    
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
        <div className={classes.formStyleP} onClick={()=>{if(!MOUSE_INSIDE_DROPDOWN && listEleves.length>0) {document.getElementById("hidden1_"+MultiSelectId).value = ""; setListEleves([]);}}}>
            
            {(modalOpen!=0) && <BackDrop/>}
            {(modalOpen >0 && modalOpen<4) && 
                <AddStudent 
                    currentClasseLabel = {CURRENT_CLASSE_LABEL} 
                    currentClasseId    = {CURRENT_CLASSE_ID} 
                    formMode           = {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  
                    actionHandler      = {(modalOpen==1) ? addNewStudent : modifyStudent} 
                    cancelHandler      = {quitForm}
                />
            }

            {(modalOpen==4) &&              
                <PDFTemplate previewCloseHandler={closePreview}>
                    {isMobile?
                        <PDFDownloadLink  document ={<StudentListTemplate pageSet={ElevePageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <StudentListTemplate pageSet={ElevePageSet}/>
                        </PDFViewer>
                    }
                </PDFTemplate>
            } 
          
           
            
            {(currentUiContext.msgBox.visible == true)&&(chosenMsgBox==MSG_SUCCESS||chosenMsgBox==MSG_WARNING)&& <BackDrop/>}
            {(currentUiContext.msgBox.visible == true)&&(chosenMsgBox==MSG_SUCCESS||chosenMsgBox==MSG_WARNING)&&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("non")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            <div className={classes.inputRow} >
                {(props.formMode=='ajout')?  
                    <div className={classes.formTitle}>
                        {t('enreg_student')}  
                    </div>
                    :
                    <div className={classes.formTitle}>
                        {t('consult_list_M')} 
                    </div>
                }
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle} style={{width:"47vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('student_list_M')}  :
                        </div>
                      
                        {/* <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select id='selectClass1' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>  
                        </div> */}

                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <MultiSelect
                                id                  = {MultiSelectId}
                                //-----Fields-----
                                optData             = {optClasse}
                                fetchedData         = {listEleves}
                                selectionMode       = {"single"}
                                placeholder         = {"--- "+t("name_to_seach")+" ---"}
                                title               ={""}
                            
                                //-----Handler-----
                                optionChangeHandler     = {dropDownHandler         }
                                searchTextChangeHandler = {searchTextChangeHandler }
                                selectValidatedHandler  = {validateSelectionHandler}
                                mouseLeave              = {()=>{MOUSE_INSIDE_DROPDOWN = false}}
                                mouseEnter              = {()=>{MOUSE_INSIDE_DROPDOWN = true }}

                            
                                //-----Styles-----
                                searchInputStyle    = {{fontSize:"0.87vw", height:"4.7vh"}}
                                searchInputStyleP   = {{height:"4vh", backgroundColor:"ghostwhite"}}
                                comboBoxStyle       = {{width:"10.3vw", height:"4vh", border:"solid 2px #8eb1ec", fontSize:"1vw", borderRadius:"1vh"}}
                                dataFieldStyle      = {{minHeight:"5vh", borderRadius:"1vh", height:"fit-content", maxHeight:"53vw", overflowY:"scroll", border:"solid 1px gray", fontSize:"0.8vw", fontWeight:100, backgroundColor:"white", position:"absolute", top:"22.3vh", width:"13vw"}}
                                MSContainerStyle    = {{/*border:"solid 1px grey",*/ padding:"1vh", marginRight:"1vh", marginBottom:"-1vh"}}
                            />
                           
                        </div>                        
                        
                    </div>
                    
                                
                    <div className={classes.gridAction} style={{paddingTop:"0.57vh", width:"33vw"}}> 
                        {(props.formMode=='ajout')?
                            <CustomButton
                                btnText         = {t('New_student')}
                                hasIconImg      = {true}
                                imgSrc          = 'images/addNewSchoolStud.png'
                                //imgSrc='images/addNewUserOrg.png'
                                imgStyle        = {classes.grdBtnImgStyleP}  
                                buttonStyle     = {getGridButtonStyle()}
                                btnTextStyle    = {classes.gridBtnTextStyle}
                                btnClickHandler = {AddNewStudentHandler}
                                disable         = {(isValid==false)}   
                            />
                            :
                            null
                        }

                        <CustomButton
                            btnText         = {t('imprimer')}
                            hasIconImg      = {true}
                            imgSrc          = 'images/printing1.png'
                            imgStyle        = {classes.grdBtnImgStyle}  
                            buttonStyle     = {getGridButtonStyle()}
                            btnTextStyle    = {classes.gridBtnTextStyle}
                            btnClickHandler = {printStudentList}
                            disable         = {(isValid==false)}   
                        />
                     
                       {(props.formMode=='ajout')?
                            <CustomButton
                                btnText         = {t('importer')}
                                hasIconImg      = {true}
                                imgSrc          = 'images/import.png'
                                imgStyle        = {classes.grdBtnImgStyle} 
                                buttonStyle     = {getGridButtonStyle()}
                                btnTextStyle    = {classes.gridBtnTextStyle}
                                btnClickHandler = {()=>{setModalOpen(5); setIsDataImport(true); currentUiContext.setFormInputs([])}}
                                disable         = {(isValid==false)}    
                            />
                            :
                            null
                        }

                        {(props.formMode=='ajout')?
                            <CustomButton
                                btnText         = {t('exporter')}
                                hasIconImg      = {true}
                                imgSrc          = 'images/export.png'
                                imgStyle        = {classes.grdBtnImgStyleP3} 
                                buttonStyle     = {getGridButtonStyle()}
                                btnTextStyle    = {classes.gridBtnTextStyle}
                                btnClickHandler = {()=>{setModalOpen(5); setIsDataImport(false); currentUiContext.setFormInputs([])}}
                                disable         = {(isValid==false)}    
                            />
                            :
                            null
                        }

                    </div>
                        
                </div>
                    
                

             
                <div className={classes.gridDisplay} >

                    {(modalOpen == 5) &&    
                        <ImportExportData       
                            isImport       = {isDataImport}  
                            titleText      = {isDataImport? t('student_import'):t('student_export')}
                            exportFileName = {"export_eleves_"+CURRENT_CLASSE_LABEL}
                            tempFileName   = {"eleves_template_"+CURRENT_CLASSE_LABEL}
                            classeLabel    = {CURRENT_CLASSE_LABEL}
                            actionHandler  = {(isDataImport)  ? handleImport    : null} 
                            dataToExport   = {(!isDataImport) ? exportData      : null}
                            importTemplate = {(isDataImport)  ? EXPORT_TEMPLATE : null}
                            cancelHandler  = {quitForm} 
                        />
                    }

                    {(modalOpen == 6) &&    
                        <ImportWizard       
                            ImportedData      = {importedData}  
                            dataCheckFunction = {checkImportedData} 
                            insertFunction    = {insertImportedDataInBD}
                            // updateGridFct     = {refreshGrid}
                            cancelHandler     = {quitForm} 
                        />
                    }


                    <StripedDataGrid
                        
                        rows={gridRows}
                        columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                        getCellClassName={(params) => (params.field==='displayedName')? classes.gridMainRowStyle : classes.gridRowStyle }
                        // onCellClick={handleDeleteRow}
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
            </div>
        </div>
        
    );
} 
export default ListeDesEleves;