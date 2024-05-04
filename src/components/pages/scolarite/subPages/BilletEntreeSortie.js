import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import {isMobile} from 'react-device-detect';
import BilletES from "../modals/BilletES";
import Billet_ES from "../reports/Billet_ES";
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate,ajouteZeroAuCasOu, darkGrey, getTodayDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import PDFTemplate from '../reports/PDFTemplate'


var JOUR_DEB, MOIS_DEB, YEAR_DEB, DATEDEB_VERIF='';
var JOUR_FIN, MOIS_FIN, YEAR_FIN, DATEFIN_VERIF='';
let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
let SELECTED_DATE;
var CURRENT_AUTORISATION_ID;




var listElt ={};
var ElevePageSet={};

var JOUR, MOIS, YEAR, DATE_VERIF;
var tabAbsenceCours;
var listAutorisations;
var eleves_data;


var BILLET_SORTIE ={}
var modalMode = 'creation';

var chosenMsgBox;
const MSG_SUCCESS_BS  = 1;
const MSG_WARNING_BS  = 2;
const MSG_QUESTION_BS = 3;
var printedETFileName='';


function BilletEntreeSortie(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [present, setPresent]= useState(0);
    const [absent, setAbsent]= useState(0);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const [optClasse, setOpClasse] = useState([]);
    const [optCours, setOpCours] = useState([]);
    const [optDate, setOpDate] = useState([]);
    const [isDateFull, setIsDateFull]=useState(false);
    const[courseSelected, setCourseSelected] = useState(false);
    const[modalMode, setModalMode]= useState("creation");
    const[imageUrl, setImageUrl] = useState('');
    

    useEffect(()=> {
        currentUiContext.setIsParentMsgBox(false);
        if(gridRows.length ==0){
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
        var tempTable  = [{value: '0',      label: (i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '  }];

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
                 break;
             }
             j++;
         }
         i++;
        }   
         setOpClasse(tempTable); 
     }

    const  getStudentAuthSortie=(classeId)=>{
        listAutorisations = [];

        axiosInstance.post(`list-billets-e-s/`, {
            id_classe: classeId,
        }).then((res)=>{
            console.log(res.data);
            listAutorisations = [...formatList(res.data.res)]
            console.log(listAutorisations);
            setGridRows(listAutorisations);
            console.log(gridRows);
        })  
          
    }

    const  getClassStudentList=(classId)=>{
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log("eleves", res.data);
            eleves_data = getElevesTab(res.data);
        })  
    }

    function getElevesTab(elevesTab){
        var tabEleves = [{value:0,label:"---------------- "+t('choose_eleve')+" ---------------"}]
        var new_eleve;
        elevesTab.map((eleve)=>{
            new_eleve = {};
            new_eleve.value = eleve.id;
            new_eleve.label = eleve.nom +' '+eleve.prenom;
            tabEleves.push(new_eleve);       
        })
        return tabEleves;
    }


    function changeDateIntoMMJJAAAA(date){
        var dateTab = date.split('/');
        return dateTab[1]+'/'+dateTab[0]+'/'+dateTab[2];
    }
    

    function filterAuthSortie(list, dateDeb, dateFin){
        var resultList = [];
        console.log('filtre',list, dateDeb);
       

        if(dateDeb != '' && dateFin == ''){
            resultList = list.filter((elt)=>new Date(changeDateIntoMMJJAAAA(elt.dateJour_deb.split(' ')[0])) >= new Date(changeDateIntoMMJJAAAA(dateDeb)));
            setGridRows(resultList);
            return resultList;
        }

        if(dateDeb == '' && dateFin != ''){
            resultList = list.filter((elt)=>new Date(changeDateIntoMMJJAAAA(elt.dateJour_fin.split(' ')[0])) <= new Date(changeDateIntoMMJJAAAA(dateFin)));
            setGridRows(resultList);
            return resultList;
        }

        if(dateDeb != '' && dateFin != ''){
            resultList = list.filter((elt)=>(new Date(changeDateIntoMMJJAAAA(elt.dateJour_deb.split(' ')[0])) >= new Date(changeDateIntoMMJJAAAA(dateDeb)) && new Date(changeDateIntoMMJJAAAA(elt.dateJour_fin.split(' ')[0])) <= new Date(changeDateIntoMMJJAAAA(dateFin))));
            setGridRows(resultList);
            return resultList;
        }

        setGridRows(list);
        return list;

    }

   
    function classeChangeHandler(e){       
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value;
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getStudentAuthSortie(CURRENT_CLASSE_ID);
            getClassStudentList(CURRENT_CLASSE_ID);
            initDatefields();
            setIsValid(true);
        }else{
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            listAutorisations = [];
            initDatefields();
            setIsValid(false);
            setGridRows(listAutorisations);
            eleves_data = [];
        }
    }

    function initDatefields(){
        document.getElementById("jour_deb").value ='';
        document.getElementById("mois_deb").value ='';
        document.getElementById("anne_deb").value ='';

        document.getElementById("jour_fin").value ='';
        document.getElementById("mois_fin").value ='';
        document.getElementById("anne_fin").value ='';
    }

   

    function AddNewBilletHandler(){
        setModalMode('creation');
        setModalOpen(3);
    }


    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt             = {};
            listElt.id_billet   = elt.id_billet;
            listElt.id          = rang; 
            listElt.idEleve     = elt.id;
            listElt.matricule   = elt.matricule;  
            listElt.nom_only    = elt.nom_only;
            listElt.prenom_only = elt.prenom_only;
            listElt.nom         = elt.nom;
            listElt.rang        = ajouteZeroAuCasOu(rang); 
            listElt.type_duree  = elt.type_duree;
            listElt.date_jour   = (listElt.type_duree=='jour') ? '': elt.date_jour;
            listElt.date_deb    = elt.date_deb;
            listElt.date_fin    = elt.date_fin;
            listElt.status      = elt.status;
            
            if (listElt.type_duree != 'jour'){
                listElt.dateJour_deb = elt.date_jour+' '+elt.date_deb;
                listElt.dateJour_fin = elt.date_jour+' '+elt.date_fin;
            } else {
                listElt.dateJour_deb = elt.date_deb;
                listElt.dateJour_fin = elt.date_fin;

            }

            
            listElt.statusLabel = elt.status? t("justified") : t("non_justified");
            formattedList.push(listElt)
            rang ++;
        })
        return formattedList;
    }


    function NonJustifyAuthExist(eleveId){
        var elevData = listAutorisations.find((elt)=>elt.idEleve == eleveId && elt.status == false);
        console.log("resultat",listAutorisations,elevData,eleveId);
        if (elevData == undefined) return false;
        else return true;        
    }


    
    
/*************************** DataGrid Declaration ***************************/    
const columnsFr = [

    {
        field: 'rang',
        headerName: 'N°',
        width: 70,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
       
    {
        field: 'matricule',
        headerName: 'MATRICULE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'nom',
        headerName: 'NOM ET PRENOM(S)',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'nom_only',
        headerName: 'NOM ET PRENOM(S)',
        width: 200,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'prenom_only',
        headerName: 'NOM ET PRENOM(S)',
        width: 200,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'dateJour_deb',
        headerName: 'DATE DEBUT',
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'dateJour_fin',
        headerName: 'DATE FIN',
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'date_deb',
        headerName: 'DATE DEBUT',
        width: 120,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'date_fin',
        headerName:'DATE FIN',
        width: 120,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle,
            
    },

    {
        field: 'type_duree',
        headerName:'DUREE EN',
        width: 200,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'status',
        headerName: 'STATUS',
        width: 120,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'statusLabel',
        headerName: 'STATUS PERMISSION',
        width: 140,
        editable: false,
        headerClassName:classes.GridColumnStyle,
            
    },

    {
        field: 'id_billet',
        headerName:'ID AUTORISATION',
        width: 200,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    
    {
        field: '',
        headerName: 'ACTIONS',
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            return(
               (params.row.status == false) ?
               <div className={classes.inputRow}>
                    <img src="icons/baseline_edit.png"  
                        width={20} 
                        height={20} 
                        className={classes.cellPointer} 
                        style={{marginRight:'0.5vw',  cursor:"pointer"}}
                        onClick={(event)=> {
                            event.ignore = true;
                        }}
                        alt=''
                    />

                    |
               
                    <img src="images/validateAuthSortie.png"  
                        width={17} 
                        height={17} 
                        className={classes.cellPointer} 
                        style={{marginLeft:'0.7vw', marginRight:'0.7vw', cursor:"pointer"}}
                        onClick={(event)=> {
                            //event.ignore = true;
                            CURRENT_AUTORISATION_ID = params.row.id_billet;
                            chosenMsgBox = MSG_QUESTION_BS;
                            currentUiContext.showMsgBox({
                                visible:true, 
                                msgType:"question", 
                                msgTitle:t("justyfy_authorization_M"), 
                                message:t("justify_authorization")
                            })
                        }}
                        alt=''
                    />

               
                    |


                    <img src="images/print.png"  
                        width={23} 
                        height={23} 
                        className={classes.cellPointer} 
                        style={{marginLeft:'0.7vw', cursor:"pointer"}}
                        onClick={(event)=> {
                            event.ignore = false;
                            printBillet(params.row)
                        }}
                        alt=''
                    />
                </div>
            :

                <div className={classes.inputRow}>  
                    <img src="images/blank.png"  
                        width={23} 
                        height={23} 
                        className={classes.cellPointer} 
                        style={{marginRight:'0.3vw', cursor:"pointer"}}
                        onClick={(event)=> {
                            event.ignore = true;
                        }}
                        alt=''
                    />  

                    <img src="images/blank.png"  
                        width     = {17} 
                        height    = {17} 
                        className = {classes.cellPointer} 
                        style={{marginLeft:'0.5vw', marginRight:'0.5vw', cursor:"pointer"}}
                        onClick={(event)=> {
                            event.ignore = true;
                        }}
                        alt=''
                    />    

                    <img src="images/print.png"  
                        width     = {23} 
                        height    = {23} 
                        className = {classes.cellPointer} 
                        style={{marginRight:'0.4vw', cursor:"pointer"}}
                        onClick={(event)=> {
                            event.ignore = false;
                            printBillet(params.row)
                        }}
                        alt=''
                    />
                </div>
            )}           
            
        },
    ];

    const columnsEn = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 70,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
       
        {
            field: 'matricule',
            headerName: 'REG. CODE',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'nom',
            headerName: 'NAME AND SURNAME',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'nom_only',
            headerName: 'NOM ET PRENOM(S)',
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'prenom_only',
            headerName: 'NOM ET PRENOM(S)',
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'dateJour_deb',
            headerName: 'DATE DEBUT',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'dateJour_fin',
            headerName: 'DATE FIN',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'date_deb',
            headerName:'START DATE',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle,
                
        },

        {
            field: 'date_fin',
            headerName:'END DATE',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle,
        
                
        },
    
        {
            field: 'type_duree',
            headerName:'DURATION IN',
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'status',
            headerName: 'STATUS',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'statusLabel',
            headerName:'PERMISSION STATUS',
            width: 140,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'id_billet',
            headerName:'ID AUTORISATION',
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
    
        {
            field: '',
            headerName: 'ACTIONS',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    (params.row.status == false) ?
                    <div className={classes.inputRow}>
                        <img src="icons/baseline_edit.png"  
                            width={20} 
                            height={20} 
                            className={classes.cellPointer} 
                            style={{marginRight:'0.5vw', cursor:"pointer"}}
                            onClick={(event)=> {
                                event.ignore = true;
                            }}
                            alt=''
                        />

                        |
                        
                        <img src="images/validateAuthSortie.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            style={{marginLeft:'0.7vw', marginRight:'0.7vw', cursor:"pointer"}}
                            onClick={(event)=> {
                                event.ignore = false;
                                CURRENT_AUTORISATION_ID = params.row.id_billet;
                                chosenMsgBox = MSG_QUESTION_BS;
                                currentUiContext.showMsgBox({
                                    visible:true, 
                                    msgType:"question", 
                                    msgTitle:t("justyfy_authorization_M"), 
                                    message:t("justify_authorization")
                                })
                            }}
                            alt=''
                        />

                        
                        |


                        <img src="images/print.png"  
                            width={23} 
                            height={23} 
                            className={classes.cellPointer} 
                            style={{marginLeft:'0.7vw', cursor:"pointer"}}
                            onClick={(event)=> {
                                event.ignore = false;
                                printBillet(params.row)
                            }}
                            alt=''
                        />
                    </div>
                :



                    <div className={classes.inputRow}>
                        <img src="images/blank.png"  
                            width={23} 
                            height={23} 
                            className={classes.cellPointer} 
                            style={{marginRight:'0.5vw', cursor:"pointer"}}                          
                            alt=''
                        />   

                        <img src="images/blank.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            style={{marginLeft:'0.4vw', marginRight:'0.3vw', cursor:"pointer"}}                       
                            alt=''
                        />


                        <img src="images/print.png"  
                            width={23} 
                            height={22} 
                            className={classes.cellPointer} 
                            style={{marginLeft:'0.4vw', cursor:"pointer"}}
                            onClick={(event)=> {
                                event.ignore = false;
                                printBillet(params.row)
                            }}
                            alt=''
                        />
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
    function consultRowData(row){
        var inputs=[];      
        inputs[0]= row.idEleve;
        inputs[1]= row.id_billet;
        inputs[2]= currentAppContext.currentEtab;
        inputs[3]= CURRENT_CLASSE_ID;
        inputs[4]= row.nom;
        inputs[5]= row.type_duree;
        inputs[6]= row.date_deb;
        inputs[7]= row.date_fin;
        inputs[8]= row.date_jour;
        inputs[9]= row.status;
       // inputs[10] = [...eleves_data];
     
        currentUiContext.setFormInputs(inputs);
        setModalMode('consult');
        setModalOpen(3);    
    }   


    function handleEditBS(row){ 
        console.log("selected row",row);
        var inputs=[];
        inputs[0]= row.idEleve;
        inputs[1]= row.id_billet;
        inputs[2]= currentAppContext.currentEtab;
        inputs[3]= CURRENT_CLASSE_ID;
        inputs[4]= row.nom;
        inputs[5]= row.type_duree;
        inputs[6]= row.date_deb;
        inputs[7]= row.date_fin;
        inputs[8]= row.date_jour;
        inputs[9]= row.status;
       // inputs[10] = [...eleves_data];
        
        currentUiContext.setFormInputs(inputs);
        console.log("Billes edit",row, currentUiContext.formInputs);
        setModalMode('modif');
        setModalOpen(3);
    }

    function printBillet(row){
       
        if(CURRENT_CLASSE_ID != undefined){
            var PRINTING_DATA ={
                currentClasse    : CURRENT_CLASSE_LABEL,
                dateText         : getTodayDate(),
                leftHeaders      : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire","Delegation Regionale du centre", "Delegation Departementale du Mfoundi"],
                centerHeaders    : [currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+'  Telephone:'+ currentAppContext.currentEtabInfos.tel],
                rightHeaders     : ["Republic Of Cameroon", "Peace-Work-Fatherland","Ministere des enseignement secondaire","Delegation Regionale du centre", "Delegation Departementale du Mfoundi"],
                pageImages       : [imgUrl],
                pageImagesDefault: [imgUrlDefault],
                pageTitle        : (row.status == false) ? t("exit_ticket_M") : t("entry_ticket_M"),
                billetInfos      : row                
            };

            printedETFileName    = (row.status == false) ? "billet_sortie.pdf" : "billet_entree.pdf";           
            setModalOpen(4);
            ElevePageSet         = {...PRINTING_DATA};
            console.log("ici la",ElevePageSet,PRINTING_DATA);                    
        } else{
            chosenMsgBox = MSG_WARNING_BS;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "warning", 
                msgTitle : t("ATTENTION!"), 
                message  : t("must_select_class")
            })            
        } 
    }

        
    const closePreview =()=>{
        setModalOpen(0);
    }
    

    
    function quitForm() {
        setModalOpen(0)
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

    function getJourDebAndFilter(e){
        setGridRows([]);
        JOUR_DEB = e.target.value;
        DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        console.log("date verif",listAutorisations);
        if(DATEDEB_VERIF.length==10) filterAuthSortie(listAutorisations,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterAuthSortie(listAutorisations,'',DATEFIN_VERIF);

    }

    function getJourFinAndFilter(e){
        setGridRows([]);
        JOUR_FIN = e.target.value;
        DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_VERIF.length==10) filterAuthSortie(listAutorisations,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterAuthSortie(listAutorisations, '', DATEDEB_VERIF);

    }

    function getMoisDebAndFilter(e, dateFin){
        setGridRows([]);
        MOIS_DEB = e.target.value;
        DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        console.log("date verif",DATEDEB_VERIF);
        if(DATEDEB_VERIF.length==10) filterAuthSortie(listAutorisations,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterAuthSortie(listAutorisations, '', DATEFIN_VERIF);
    }

    function getMoisFinAndFilter(e){
        setGridRows([]);
        MOIS_FIN = e.target.value;
        DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_VERIF.length==10) filterAuthSortie(listAutorisations,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterAuthSortie(listAutorisations, DATEDEB_VERIF, '');
    }


    function getYearDebAndFilter(e){
        setGridRows([]);
        YEAR_DEB = e.target.value;
        DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        console.log("date verif",DATEDEB_VERIF);
        if(DATEDEB_VERIF.length==10) filterAuthSortie(listAutorisations,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterAuthSortie(listAutorisations, '', DATEFIN_VERIF);
    }

    function getYearFinAndFilter(e){
        setGridRows([]);
        YEAR_FIN = e.target.value;
        DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_VERIF.length==10) filterAuthSortie(listAutorisations,'',DATEFIN_VERIF);
        else filterAuthSortie(listAutorisations, '', '');
    }


 
    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_BS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                setGridRows(listAutorisations);
                return 1;
                
            }

            case MSG_WARNING_BS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               
                return 1;
            }

            case MSG_QUESTION_BS :{
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                justifyAuthorization();
                return 1;

            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }        
    }

    const rejectHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_BS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_BS :{
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_QUESTION_BS :{
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               //justifyAuthorization();
                return 1;

            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }
  
    }


    
    function addNewAutSortie(BilletSortie){        
        console.log("Billet", BilletSortie);
        if(NonJustifyAuthExist(BilletSortie.id_eleves)){
            chosenMsgBox = MSG_WARNING_BS;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "danger", 
                msgTitle:t("error_M"), 
                message :t("non_justify_auth_exist")
            })         

        } else {
            axiosInstance.post(`create-billet-sortie/`, {
                id_sousetab :  BilletSortie.id_sousetab,
                id_classe   :  BilletSortie.id_classe,
                id_eleves   :  BilletSortie.id_eleves,
                type_duree  :  BilletSortie.type_duree,
                date_deb    :  BilletSortie.date_deb,
                date_fin    :  BilletSortie.date_fin,
                date_jour   :  BilletSortie.date_jour,
                id_user     :  currentAppContext.idUser
                
            }).then((res)=>{   
                console.log("resultat",res.data);
                listAutorisations = [...formatList(res.data.status)]; 
                
                console.log(listAutorisations);
                
                chosenMsgBox = MSG_SUCCESS_BS;
                currentUiContext.showMsgBox({
                    visible  : true, 
                    msgType:"info", 
                    msgTitle:t("success_modif_M"), 
                    message:t("success_modif")
                })          
            })

        }
        
    }

   
    function MofifyAutSortie(BilletSortie){
        console.log("Billet", BilletSortie);
        axiosInstance.post(`update-billet-sortie/`, {
            id_sousetab :  BilletSortie.id_sousetab,
            id_classe   :  BilletSortie.id_classe,
            id_eleves   :  BilletSortie.id_eleves,
            type_duree  :  BilletSortie.type_duree,
            date_deb    :  BilletSortie.date_deb,
            date_fin    :  BilletSortie.date_fin,
            date_jour   :  BilletSortie.date_jour,
            id_billet   :  BilletSortie.id_billet,
            status      :  BilletSortie.status == true ? 1 : 0,
            id_user     :  currentAppContext.idUser
            
        }).then((res)=>{   
            console.log("resultat",res.data); 
            listAutorisations = [...formatList(res.data.status)];         
            chosenMsgBox = MSG_SUCCESS_BS;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType:"info", 
                msgTitle:t("success_modif_M"), 
                message:t("success_modif")
            })          
          
        })
    }

    function justifyAuthorization(){
      
        axiosInstance.post(`validate-billet-entree/`, {
            id_billet   : CURRENT_AUTORISATION_ID,
            id_classe   : CURRENT_CLASSE_ID,
            status      : 1,
            id_sousetab : currentAppContext.currentEtab,
            id_user     : currentAppContext.idUser
        }).then((res)=>{
            console.log(res.data);
            listAutorisations = [...formatList(res.data.status)];
           
            chosenMsgBox = MSG_SUCCESS_BS;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType:"info", 
                msgTitle:t("success_modif_M"), 
                message:t("success_modif")
            });          
            console.log(listAutorisations);
        })  

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
            {(modalOpen==3) && 
                <BilletES 
                    formMode={modalMode} 
                    currentClasseId={CURRENT_CLASSE_ID} 
                    eleves = {eleves_data}
                    cancelHandler={quitForm}  
                    createElthandler={addNewAutSortie}  
                    ModifyEltHandler={MofifyAutSortie} 
                />            
            }

            {(modalOpen==4) &&              
                <PDFTemplate previewCloseHandler={closePreview}>
                    {isMobile?
                        <PDFDownloadLink  document ={<Billet_ES pageSet={ElevePageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <Billet_ES pageSet={ElevePageSet}/>
                        </PDFViewer>
                    }
                </PDFTemplate>
            } 

            {(currentUiContext.msgBox.visible == true) && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {currentUiContext.msgBox.msgType == "question" ? t('yes'):t('ok')}
                    buttonRejectText = {t('no')}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            <div className={classes.inputRow}>               
                <div className={classes.formTitle}>
                    {t('exit_entry_ticket_management_M')}  
                </div>                
            </div>

            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('class_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optClasse' onChange={classeChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1,marginLeft:'1vw'}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>

                    <div className={classes.gridTitle} style={{marginLeft:"-3.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_deb')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour_deb"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_deb"), document.getElementById("mois_deb"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourDebAndFilter} style={{width:'1.3vw', fontSize:'1.17vw', height:'1.3vw', marginLeft:'-2vw', color:'#065386', fontWeight:'bold'}} />/
                                <input id="mois_deb"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_deb"), document.getElementById("anne_deb"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisDebAndFilter} style={{width:'1.4vw', fontSize:'1.17vw', height:'1.3vw', marginLeft:'0vw', color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne_deb"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_deb"), document.getElementById("jour_fin"))}}     maxLength={4}     className={classes.inputRowControl }   onChange={getYearDebAndFilter}style={{width:'2.7vw', fontSize:'1vw', height:'1.17vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold', marginTop:"0.3vh"}}  />
                            </div>  
                        </div>
                        
                    </div>


                    <div className={classes.gridTitle} style={{marginLeft:"-3.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_fin')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour_fin"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_fin"), document.getElementById("mois_fin"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourFinAndFilter} style={{width:'1.3vw', fontSize:'1.17vw', height:'1.3vw', marginLeft:'-2vw', color:'#065386', fontWeight:'bold'}} />/
                                <input id="mois_fin"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_fin"), document.getElementById("anne_fin"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisFinAndFilter} style={{width:'1.4vw', fontSize:'1.17vw', height:'1.3vw', marginLeft:'0vw', color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne_fin"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_fin"), null)}}     maxLength={4}     className={classes.inputRowControl }  onChange={getYearFinAndFilter}style={{width:'2.7vw', fontSize:'1vw', height:'1.17vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold', marginTop:"0.3vh"}}  />
                            </div>  
                        </div>
                        
                    </div>


                    <div className={classes.gridAction}> 
                        
                        <CustomButton
                            btnText={t('new_authorisation')}
                            hasIconImg= {true}
                            imgSrc='images/BilletEntreeSortie.png'
                            // imgStyle = {classes.grdBtnImgStyle}  
                            // buttonStyle={getGridButtonStyle()}
                            // btnTextStyle = {classes.gridBtnTextStyleP}

                            imgStyle = {classes.grdBtnImgStyleP}  
                            buttonStyle={getGridButtonStyle()}
                            style={{width:"12.3vw", height:"4.3vh"}}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            
                            btnClickHandler={AddNewBilletHandler}
                            disable={(isValid==false)}   
                        />
                       
                    </div>
                        
                </div>
                    
                

           
                <div className={classes.gridDisplay} >
                    <StripedDataGrid
                        rows={gridRows}
                        columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                        getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : (params.field==='statusLabel' && params.row.status==true)?  classes.enCoursStyleP: (params.field==='statusLabel' && params.row.status==false) ? classes.clotureStyleP : classes.gridRowStyle }
                       
                        
                        onCellClick={(params,event)=>{
                            if(event.ignore) {
                                handleEditBS(params.row)
                            }
                        }}  
                        
                        onRowDoubleClick ={(params, event) => {
                            if(!event.ignore){
                                event.defaultMuiPrevented = true;
                                consultRowData(params.row);
                            }
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
export default BilletEntreeSortie;