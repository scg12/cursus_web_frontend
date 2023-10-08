import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import FicheDisciplinaire from "../modals/FicheDisciplinaire";
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {isMobile} from 'react-device-detect';
import {convertDateToUsualDate, getTodayDate} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer,PDFDownloadLink } from '@react-pdf/renderer';
import PDFTemplate from '../reports/PDFTemplate';
import StudentList from '../reports/StudentList';
import FicheDReport from '../reports/FicheDReport';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import StudentListTemplate from '../reports/StudentListTemplate';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
let CURRENT_PROF_PP_ID;
let CURRENT_PROF_PP_LABEL;

var JOUR_DEB='', MOIS_DEB='', YEAR_DEB='', DATEDEB_RECH ='';
var JOUR_FIN='', MOIS_FIN='', YEAR_FIN='', DATEFIN_RECH ='';

var LIST_ELEVES     = [];
var LIST_ABSENCES   = [];
var LIST_SANCTIONS  = [];

var SELECTED_ELEVE  = {};
var ELEVE_ABSENCES  = [];
var ELEVE_SANCTIONS = [];

var listElt         = {};
var pageSet         = [];
var page            = {};

var  printedETFileName = "";

var chosenMsgBox;
const MSG_SUCCESS_FD = 1;
const MSG_WARNING_FD = 2;
const MSG_ERROR_FD   = 3;

const ROWS_PER_PAGE= 40;
var ElevePageSet=[];


function Studentprofile(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [isValid, setIsValid] = useState(false);

    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse] = useState([]);
    const selectedTheme = currentUiContext.theme;
   

    const tabPeriode =[
        {value:0, label:(i18n.language=='fr') ? ' Choisir une periode ' :'  Select a period  '},
        {value:1, label:' sequence '},
        {value:2, label:' Trimestre '},
        {value:3, label:' Annuel '},

    ]

    useEffect(()=> {
        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }
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

    function changeDateIntoMMJJAAAA(date){
        var dateTab = date.split('/');
        return dateTab[1]+'/'+dateTab[0]+'/'+dateTab[2];
    }

    function changeDateIntoAAAAMMJJ(date){
        var dateTab = date.split('/');
        return dateTab[2]+'-'+dateTab[1]+'-'+dateTab[0];
    }

    const  getClassStudentList=(classeId)=>{
        var listEleves = [];
        axiosInstance.post(`list-eleves/`, {
            id_classe: classeId,
        }).then((res)=>{
            console.log(res.data);            
            LIST_ELEVES = res.data;           
            listEleves = [...formatList(LIST_ELEVES, LIST_ABSENCES, LIST_SANCTIONS)]
            console.log(listEleves);

            if(DATEDEB_RECH.length==0 && DATEFIN_RECH.length==0){
                setGridRows(listEleves);
            }
            
            console.log(gridRows);
        })  
        return listEleves;     
    }

    const getStudentFiches=(dateDeb, dateFin)=>{
        dateDeb = dateDeb.includes("undefined")?"":dateDeb;
        dateFin = dateFin.includes("undefined")?"":dateFin;
        var listEleves = []
        axiosInstance.post(`list-fiche-disciplinaires/`, {
            id_sousetab: currentAppContext.currentEtab,
            id_classe  : CURRENT_CLASSE_ID,
            date_deb   : dateDeb,
            date_fin   : dateFin
        }).then((res)=>{
            console.log("les donnees",res.data);
            LIST_ABSENCES  = [...arrangeDates(res.data.absences)];
            LIST_SANCTIONS = [...arrangeDates(res.data.sanctions)];

            listEleves = [...formatList(LIST_ELEVES, LIST_ABSENCES, LIST_SANCTIONS)]
            console.log(listEleves);
            setGridRows(listEleves);
            console.log(gridRows);
        })  
        return listEleves; 
    }

    function ChangeDateIntoJJMMAAAA(date){
        var dateTab = date.split("-");
        if(dateTab.length==3){
            return(dateTab[2]+'-'+dateTab[1]+'-'+dateTab[0]);
        }else return date;
        
    }

    function arrangeDates(list){
        if(list.length>0){
            list.map((elt)=>elt.date = ChangeDateIntoJJMMAAAA(elt.date))
        }
        console.log("la liste la",list);
        return list;
    }


    function searchStudent(){
        var errorMsg = givenDateOk();
        if(errorMsg.length==0){
            getStudentFiches(changeDateIntoAAAAMMJJ(DATEDEB_RECH),changeDateIntoAAAAMMJJ(DATEFIN_RECH));
        } else {
            //Produire un message d'erreur....
            chosenMsgBox = MSG_ERROR_FD;
            currentUiContext.showMsgBox({
                visible :true, 
                msgType :"info", 
                msgTitle: t("date_error_M"), 
                message : errorMsg
            })
        }
    }

    function givenDateOk(){ 
       
        if(DATEDEB_RECH.length>0 && DATEDEB_RECH.length<10){
            return t('start_date_error');
        }

        if(DATEFIN_RECH.length>0 && DATEFIN_RECH.length<10){
            return t('end_date_error');
        }

        if(DATEDEB_RECH.length>0 && !((isNaN(changeDateIntoMMJJAAAA(DATEDEB_RECH)) && (!isNaN(Date.parse(changeDateIntoMMJJAAAA(DATEDEB_RECH))))))){
            return t('start_date_error');
        }

        if(DATEFIN_RECH.length>0 && !((isNaN(changeDateIntoMMJJAAAA(DATEFIN_RECH)) && (!isNaN(Date.parse(changeDateIntoMMJJAAAA(DATEFIN_RECH))))))){
            return t('end_date_error');
        }

        if(new Date(changeDateIntoMMJJAAAA(DATEDEB_RECH)) > new Date(changeDateIntoMMJJAAAA(DATEFIN_RECH))) {
            return t('start_date_greater_than_end_date');
        } 
        return '';
    }


    function getJourDebAndFilter(e){
        setGridRows([]);
        JOUR_DEB = e.target.value;
        DATEDEB_RECH = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        if(DATEDEB_RECH=='//') DATEDEB_RECH = ''; 
        
        if(DATEDEB_RECH=='' && DATEFIN_RECH=='') {
            LIST_ELEVES    = [];
            LIST_ABSENCES  = [];
            LIST_SANCTIONS = [];
            getClassStudentList(CURRENT_CLASSE_ID);
        }

        if(DATEDEB_RECH.length==10 || DATEFIN_RECH.length==10) setIsValid(true);
        else setIsValid(false);
        // if(DATEDEB_RECH.length==10) filterAuthSortie(listAutorisations,DATEDEB_RECH,DATEFIN_RECH);
        // else filterAuthSortie(listAutorisations,'',DATEFIN_RECH);

    }

    function getJourFinAndFilter(e){
        setGridRows([]);
        JOUR_FIN = e.target.value;
        DATEFIN_RECH = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_RECH=='//') DATEFIN_RECH = ''; 
        
        if(DATEDEB_RECH=='' && DATEFIN_RECH=='') {
            LIST_ELEVES    = [];
            LIST_ABSENCES  = [];
            LIST_SANCTIONS = [];
            getClassStudentList(CURRENT_CLASSE_ID);
        }

        if(DATEDEB_RECH.length==10 || DATEFIN_RECH.length==10) setIsValid(true);
        else setIsValid(false);
        // if(DATEFIN_RECH.length==10) filterAuthSortie(listAutorisations,DATEDEB_RECH,DATEFIN_RECH);
        // else filterAuthSortie(listAutorisations, '', DATEDEB_RECH);

    }

    function getMoisDebAndFilter(e, dateFin){
        setGridRows([]);
        MOIS_DEB = e.target.value;
        DATEDEB_RECH = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        if(DATEDEB_RECH=='//') DATEDEB_RECH = ''; 
        console.log("date verif",DATEDEB_RECH);
        
        if(DATEDEB_RECH=='' && DATEFIN_RECH=='') {
            LIST_ELEVES    = [];
            LIST_ABSENCES  = [];
            LIST_SANCTIONS = [];
            getClassStudentList(CURRENT_CLASSE_ID);
        }

        if(DATEDEB_RECH.length==10 || DATEFIN_RECH.length==10) setIsValid(true);
        else setIsValid(false);

        // if(DATEDEB_RECH.length==10) filterAuthSortie(listAutorisations,DATEDEB_RECH,DATEFIN_RECH);
        // else filterAuthSortie(listAutorisations, '', DATEFIN_RECH);
    }

    function getMoisFinAndFilter(e){
        setGridRows([]);
        MOIS_FIN = e.target.value;
        DATEFIN_RECH = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_RECH=='//') DATEFIN_RECH = ''; 
        
        if(DATEDEB_RECH=='' && DATEFIN_RECH=='') {
            LIST_ELEVES    = [];
            LIST_ABSENCES  = [];
            LIST_SANCTIONS = [];
            getClassStudentList(CURRENT_CLASSE_ID);
        }   

        if(DATEDEB_RECH.length==10 || DATEFIN_RECH.length==10) setIsValid(true);
        else setIsValid(false);

        // if(DATEFIN_RECH.length==10) filterAuthSortie(listAutorisations,DATEDEB_RECH,DATEFIN_RECH);
        // else filterAuthSortie(listAutorisations, DATEDEB_RECH, '');
    }


    function getYearDebAndFilter(e){
        setGridRows([]);
        YEAR_DEB = e.target.value;
        DATEDEB_RECH = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        if(DATEDEB_RECH=='//') DATEDEB_RECH = ''; 
        
        if(DATEDEB_RECH=='' && DATEFIN_RECH=='') {
            LIST_ELEVES    = [];
            LIST_ABSENCES  = [];
            LIST_SANCTIONS = [];
            getClassStudentList(CURRENT_CLASSE_ID);
        }

        if(DATEDEB_RECH.length==10 || DATEFIN_RECH.length==10) setIsValid(true);
        else setIsValid(false);
        
        console.log("date verif",DATEDEB_RECH);
        // if(DATEDEB_RECH.length==10) filterAuthSortie(listAutorisations,DATEDEB_RECH,DATEFIN_RECH);
        // else filterAuthSortie(listAutorisations, '', DATEFIN_RECH);
    }

    function getYearFinAndFilter(e){
        setGridRows([]);
        YEAR_FIN = e.target.value;
        DATEFIN_RECH = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_RECH=='//') DATEFIN_RECH = ''; 

        if(DATEDEB_RECH=='' && DATEFIN_RECH=='') {
            LIST_ELEVES    = [];
            LIST_ABSENCES  = [];
            LIST_SANCTIONS = [];
            getClassStudentList(CURRENT_CLASSE_ID);
        }

        if(DATEDEB_RECH.length==10 || DATEFIN_RECH.length==10) setIsValid(true);
        else setIsValid(false);

        // if(DATEFIN_RECH.length==10) filterAuthSortie(listAutorisations,'',DATEFIN_RECH);
        // else filterAuthSortie(listAutorisations, '', '');
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
   

    const formatList=(list,absences,sanctions) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.rang           = rang;
            listElt.id             = elt.id;
            listElt.matricule      = elt.matricule;
            listElt.displayedName  = elt.nom + ' '+elt.prenom;             
            listElt.nb_heures      = getEleveAbsences(elt.id, absences);
            listElt.nb_sanctions   = getEleveSanctions(elt.id,sanctions);
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    function getEleveAbsences(id_eleve, listAbsences){
        var countAbsences = 0;
        console.log("absences",listAbsences);
        if(listAbsences.length>0){
            var eleveAbs = listAbsences.filter((elv)=>elv.id == id_eleve);
            if(eleveAbs.length>0){
                eleveAbs.map((elv)=>{
                    countAbsences += elv.nb_heures;
                })
            }
        }
        
        return countAbsences;
    }

    function getEleveSanctions(id_eleve, listSanctions){
        var countSanctions = 0;
        console.log("sanctions",listSanctions);
        if(listSanctions.length > 0){
            var eleveSanc = listSanctions.filter((elv)=>elv.id == id_eleve && elv.libelle.length >0);         
            countSanctions = eleveSanc.length;
        }
        return countSanctions;
    }


    function dropDownHandler(e){        
        if(e.target.value != optClasse[0].value){
            LIST_ABSENCES  = [];
            LIST_SANCTIONS = [];
            LIST_ELEVES    = [];

            CURRENT_CLASSE_ID    = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getClassStudentList(CURRENT_CLASSE_ID);
            
            if(DATEDEB_RECH.length==10 && DATEFIN_RECH.length==10) {
                var errorMsg = givenDateOk();
                if(errorMsg.length==0){
                    console.log("jjjj",changeDateIntoAAAAMMJJ(DATEDEB_RECH),changeDateIntoAAAAMMJJ(DATEFIN_RECH))
                    getStudentFiches(changeDateIntoAAAAMMJJ(DATEDEB_RECH),changeDateIntoAAAAMMJJ(DATEFIN_RECH));
                } else {
                    //Mesage d'erreur
                    chosenMsgBox = MSG_ERROR_FD;
                    currentUiContext.showMsgBox({
                        visible :true, 
                        msgType :"info", 
                        msgTitle: t("date_error_M"), 
                        message : errorMsg
                    })
                }
            }            
            else{
                //if(DATEDEB_RECH.length==0 && DATEFIN_RECH.length==0)  getClassStudentList(CURRENT_CLASSE_ID); 

                if(DATEDEB_RECH.length==10){
                    var dateFin = getTodayDate();
                    getStudentFiches(changeDateIntoAAAAMMJJ(DATEDEB_RECH),changeDateIntoAAAAMMJJ(dateFin));
                }

                if(DATEFIN_RECH.length==10){
                    //var dateFin = getTodayDate();
                    getStudentFiches(changeDateIntoAAAAMMJJ(DATEFIN_RECH),changeDateIntoAAAAMMJJ(DATEFIN_RECH));
                }
            }
          
        }else{
            initDateFields();
            LIST_ABSENCES  = [];
            LIST_SANCTIONS = [];
            LIST_ELEVES    = [];

            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setGridRows([]);
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
        field: 'matricule',
        headerName: 'MATRICULE',
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
       
    {
        field: 'displayedName',
        headerName: 'NOM(S) ET PRENOM(S)',
        width: 250,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field: 'nb_heures',
        headerName: 'ABSENCES',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },    

    {
        field: 'nb_sanctions',
        headerName: 'SANCTIONS',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: '',
        headerName: 'ACTION',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            
            return(
                
                <div className={classes.inputRowLeft} style={{marginLeft:"0.3vw"}}>
                    <img src="images/lunette.png"  
                        width={30} 
                        height={20} 
                        className={classes.cellPointer} 
                        onClick={(event)=> {
                            event.ignore = true;
                        }}
                        alt=''
                    />
                  
                </div>
               
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
            field: 'matricule',
            headerName: 'STUDENT ID',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
           
        {
            field: 'displayedName',
            headerName: 'NAME(S) AND SURNAME(S)',
            width: 250,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'nb_heures',
            headerName: 'ABSENCES',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },    
    
        {
            field: 'nb_sanctions',
            headerName: 'SANCTIONS',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: '',
            headerName: 'ACTION',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                
                return(
                    
                    <div className={classes.inputRowLeft} style={{marginLeft:"0.3vw"}}>
                        <img src="images/lunette.png"  
                            width={30} 
                            height={20} 
                            className={classes.cellPointer} 
                            onClick={(event)=> {
                                event.ignore = true;
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
        SELECTED_ELEVE  = {};
        SELECTED_ELEVE  = LIST_ELEVES.find((elt)  =>   elt.id  == row.id);
        ELEVE_ABSENCES  = LIST_ABSENCES.filter((elt)=> elt.id  == row.id);
        ELEVE_SANCTIONS = LIST_SANCTIONS.filter((elt)=>(elt.id == row.id && elt.libelle.length>0));
        console.log("dgdgd",ELEVE_SANCTIONS)
        setModalOpen(3);
    }

    function quitForm() {
        //ClearForm();
        setModalOpen(0)
    }
   
  

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_FD: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING_FD: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }

            case MSG_ERROR_FD: {
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

            case MSG_SUCCESS_FD: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING_FD: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }

            case MSG_ERROR_FD: {
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
   
    
    const printStudentProfille=()=>{       
        var PRINTING_DATA ={
            dateText            :'Yaounde, le 14/03/2023',
            leftHeaders         :["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
            centerHeaders       :["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
            rightHeaders        :["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
            pageImages          :["images/collegeVogt.png"],
            pageTitle           : "Fiche disciplinaire",            
            absencesHeaderModel :[t('date'), t('nbre_hour'), t('justify'), t('not_justify')],
            absencesData        :[...ELEVE_ABSENCES],
            sanctionsHeaderModel:[t('date'), t('libelle'), t('duree')],
            sanctionsData       :[...ELEVE_SANCTIONS],
            eleveInfo           :SELECTED_ELEVE,
            classeLabel         :CURRENT_CLASSE_LABEL,

            numberEltPerPage:ROWS_PER_PAGE  
        };
       
        printedETFileName = "FD("+SELECTED_ELEVE.nom+").pdf"
        setModalOpen(5);
        ElevePageSet=PRINTING_DATA;
        console.log("ici la",ElevePageSet,gridRows);                    
    }

    const printStudentList=()=>{
        if(CURRENT_CLASSE_ID != undefined){
            var PRINTING_DATA ={
                dateText:'Yaounde, le 14/03/2023',
                leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders:["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
                rightHeaders:["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
                pageImages:["images/collegeVogt.png"],
                pageTitle: "Liste des eleves de la classe de " + CURRENT_CLASSE_LABEL,
                tableHeaderModel:["matricule", "nom et prenom(s)", "date naissance", "lieu naissance", "enrole en", "Nom Parent", "nouveau"],
                tableData :[...gridRows],
                numberEltPerPage:ROWS_PER_PAGE  
            };

            printedETFileName = "ListeABsences("+CURRENT_CLASSE_LABEL+").pdf"
            setModalOpen(4);
            ElevePageSet=[];
            //ElevePageSet = [...splitArray([...gridRows], "Liste des eleves de la classe de " + CURRENT_CLASSE_LABEL, ROWS_PER_PAGE)];          
            ElevePageSet = createPrintingPages(PRINTING_DATA);
            console.log("ici la",ElevePageSet,gridRows);                    
        } else{
            chosenMsgBox = MSG_WARNING_FD;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "warning", 
                msgTitle : t("warning_M"), 
                message  : t("must_select_class")
            })            
        }      
    }

    
    const closePreview =(e)=>{
        setModalOpen(0);
    }

    function dropDownPeriodHandler(e){

    }

    function initDateFields(){
        document.getElementById("jour_deb").value = "";
        document.getElementById("mois_deb").value = "";
        document.getElementById("anne_deb").value = "";

        document.getElementById("jour_fin").value = "";
        document.getElementById("mois_fin").value = "";
        document.getElementById("anne_fin").value = "";  
        DATEDEB_RECH ='';
        DATEFIN_RECH ='';
        setIsValid(false);                              
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
                    {   isMobile?
                        <PDFDownloadLink  document ={ <StudentListTemplate pageSet={ElevePageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "loading...":  <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>                    
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <StudentListTemplate pageSet={ElevePageSet}/>
                        </PDFViewer>

                    }
                    
                </PDFTemplate>
            } 
            {(modalOpen==5) && 
                <PDFTemplate previewCloseHandler={closePreview}>
                    { isMobile?
                        <PDFDownloadLink  document ={ <FicheDReport pageSet={ElevePageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "loading...":  <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>                    
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <FicheDReport pageSet={ElevePageSet}/>
                        </PDFViewer>
                    }
                </PDFTemplate>
            } 
            {(modalOpen >0 && modalOpen<4) && 
                <FicheDisciplinaire 
                    currentClasseLabel = {CURRENT_CLASSE_LABEL} 
                    currentClasseId    = {CURRENT_CLASSE_ID} 
                    eleve              = {SELECTED_ELEVE} 
                    absences           = {ELEVE_ABSENCES} 
                    sanctions          = {ELEVE_SANCTIONS} 
                    dateDeb            = {DATEDEB_RECH}
                    dateFin            = {DATEFIN_RECH}
                    formMode           = {'consult'}   
                    cancelHandler      = {quitForm} 
                    printFDHandler     = {printStudentProfille}
                />
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
                    buttonAcceptText = {(currentUiContext.msgBox.msgType == 'info')? t("ok"):t("yes")}
                    buttonRejectText = {t("no")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />               
            }
            <div className={classes.inputRow} >
                {(props.formMode=='ajout')?  
                    <div className={classes.formTitle}>
                        {t('sit_disciplinaire_M')}  
                    </div>
                    :
                    <div className={classes.formTitle}>
                        {t('sit_disciplinaire_M')}
                    </div>
                }
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle} style={{width:"23vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('class_M')}  :
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

                    <div className={classes.gridTitle} style={{width:"27vw",marginLeft:"0.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_deb')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour_deb"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_deb"), document.getElementById("mois_deb"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourDebAndFilter} style={{width:'1.3vw', fontSize:'1.17vw', height:'1.3vw',  marginLeft:'-2vw',   color:'#065386', fontWeight:'bold'}}/>/
                                <input id="mois_deb"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_deb"), document.getElementById("anne_deb"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisDebAndFilter} style={{width:'1.4vw', fontSize:'1.17vw', height:'1.3vw',  marginLeft:'0vw',    color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne_deb"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_deb"), document.getElementById("jour_fin"))}}      maxLength={4}     className={classes.inputRowControl }  onChange={getYearDebAndFilter} style={{width:'2.7vw', fontSize:'1vw',    height:'1.17vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold'}}/>
                            </div>  
                        </div>
                    </div>


                    <div className={classes.gridTitle} style={{width:"17vw", marginLeft:"2vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_fin')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour_fin"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_fin"), document.getElementById("mois_fin"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourFinAndFilter} style={{width:'1.3vw', fontSize:'1.17vw', height:'1.3vw',  marginLeft:'-2vw',   color:'#065386', fontWeight:'bold'}}/>/
                                <input id="mois_fin"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_fin"), document.getElementById("anne_fin"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisFinAndFilter} style={{width:'1.4vw', fontSize:'1.17vw', height:'1.3vw',  marginLeft:'0vw',    color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne_fin"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_fin"), null)}}                                     maxLength={4}     className={classes.inputRowControl }  onChange={getYearFinAndFilter} style={{width:'2.7vw', fontSize:'1vw',    height:'1.17vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold'}}/>
                            </div>  
                        </div>
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                        <CustomButton
                            btnText={t('rechercher')}
                            hasIconImg= {true}
                            imgSrc='images/loupe_trans.png'
                            imgStyle = {classes.searchImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>{searchStudent()}}
                            disable={(isValid==false)}   
                        />

                       {<CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printStudentList}
                            //disable={(isValid==false)}   
                        />}
   
                    </div>
                        
                </div>
                    
                

                {/*(modalOpen==0) ?*/
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                            getCellClassName={(params) => (params.field==='displayedName')? classes.gridMainRowStyle : classes.gridRowStyle }
                            // onCellClick={handleDeleteRow}
                            onRowClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    consultRowData(params.row)
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
export default Studentprofile;