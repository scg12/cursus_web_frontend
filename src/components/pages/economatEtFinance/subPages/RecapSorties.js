import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import MsgBox from '../../../msgBox/MsgBox';
import MultiSelect from '../../../multiSelect/MultiSelect'
import {isMobile} from 'react-device-detect';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import {createPrintingPages} from '../reports/PrintingModule';
import PDFTemplate from '../reports/PDFTemplate';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import EtatPaiementStaff from '../reports/EtatPaiementStaff';

import {getTodayDate,convertDateToUsualDate, formatCurrency, changeDateIntoMMJJAAAA, ajouteZeroAuCasOu} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";



var CURRENT_QUALITE;
var CURRENT_QUALITE_LABEL;
var CUR_DATE_DEB = "";
var CUR_DATE_FIN = "";

var listReceipient;
var LIST_GENERALE;
var LIST_GENERALE_PAIEMENTS;
var LISTE_FILTRE;
var filterString ="";


var listEns = [];
var listAdm = [];
var listAll = [];
var listElt = {}

var JOUR_DEB="", MOIS_DEB="", YEAR_DEB="", DATEDEB_VERIF='';
var JOUR_FIN="", MOIS_FIN="", YEAR_FIN="", DATEFIN_VERIF='';

const MultiSelectId = "MS-3";

const ROWS_PER_PAGE   = 40;
var ElevePageSet      = [];
var printedETFileName ='';

var chosenMsgBox;
const MSG_SUCCESS_RECAP =11;
const MSG_WARNING_RECAP =12;
const MSG_ERROR_RECAP   =13;


var MOUSE_INSIDE_DROPDOWN = false;



function RecapSorties(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [gridRows, setGridRows] = useState([]);
    const [total_paye, setTotalPaye]= useState(0);
    const [absent, setAbsent]= useState(0);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const [optDestinataire, setOpDestinataire] = useState([]);
    const [listProfs, setListProfs] = useState([]);
    

    useEffect(()=> {
        currentUiContext.setIsParentMsgBox(false);
        if(gridRows.length ==0){
            CURRENT_QUALITE = undefined;
        }  
        setOpDestinataire(tabDestinataires);
        CURRENT_QUALITE = "all"  ;
        CURRENT_QUALITE_LABEL = tabDestinataires[0].label;
        getListPersonnel(CURRENT_QUALITE);    
    },[]);

    var tabDestinataires =[
        {value:"all", label:i18n.language=='fr'? "Tous" : "All"},
        {value:"enseignant", label:i18n.language=='fr'? "Enseignants" : "Teachers"},
        {value:"adminStaff", label:i18n.language=='fr'? "Administration" : "Administration"}
    ]




    const  getListPersonnel=(qualiteId)=>{
        listReceipient = "";
        axiosInstance.post(`list-personnel/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
            console.log(res.data);

            res.data.adminstaffs.map((elt)=>{
                listAll.push(elt);
            });

            res.data.enseignants.map((elt)=>{
                listAll.push(elt);
            });

            listEns = formatListEns(res.data.enseignants);
            listAdm = formatListEns(res.data.adminstaffs);
            listAll = formatListEns(listAll);
            
            switch(qualiteId){
                case "all": { console.log("val 1",listAll); LIST_GENERALE = [...listAll]; /*setListProfs(listAll);*/ break;}
                case "enseignant": { console.log("val 2",listEns); LIST_GENERALE = [...listEns]; /*setListProfs(listEns);*/ break;}
                case "adminStaff": { console.log("val 3",listAdm); LIST_GENERALE = [...listAdm]; /*setListProfs(listAdm);*/ break;}
            }  
            getListPaiement(0);         
        })  
    }

    const formatListEns=(list) =>{
        var formattedList = [];
        var rang = 1;
        list.map((elt)=>{
            listElt={};
            listElt.id       = elt.id;
            listElt.rang     = ajouteZeroAuCasOu(rang);
            listElt.label    = elt.nom +' '+elt.prenom;
            listElt.nom      = elt.nom;
            listElt.prenom   = elt.prenom;
            formattedList.push(listElt); 
            rang++;           
        });
       return formattedList;
    }

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


    /*************************** DataGrid Declaration ***************************/    
    const columnsFr = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'id',
            headerName: 'ID',
            width: 33,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'poste',
            headerName: "POSTE",
            width: 150,
            editable: false,
            headerClassName:classes.GridColumnStyle,           
              
        },       
       
        {
            field: 'displayedName',
            headerName: 'NOM(S) ET PRENOM(S)',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'displayedMontant',
            headerName: 'MONTANT PAYE',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'montant',
            headerName: 'MONTANT PAYE',
            width: 110,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'date',
            headerName: 'DATE PAIEMENT',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
      
    ];

    const columnsEn = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'id',
            headerName: 'ID',
            width: 33,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'poste',
            headerName: "POSITION",
            width: 150,
            editable: false,
            headerClassName:classes.GridColumnStyle,           
              
        },       
       
        {
            field: 'displayedName',
            headerName: 'NAME(S) ET SURMES(S)',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedMontant',
            headerName: 'MONTANT PAYE',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'montant',
            headerName: 'MONTANT PAYE',
            width: 110,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'date',
            headerName: 'PAYMENT DATE',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
      
    ];
    
/*************************** Handler functions ***************************/
    function recepientChangeHandler(e){
        CURRENT_QUALITE  = e.target.value;
        CURRENT_QUALITE_LABEL = tabDestinataires.find((elt)=>elt.value == CURRENT_QUALITE).label;
        
        document.getElementById("searchText").value = "";
        setListProfs([]);
        console.log("qualite",CURRENT_QUALITE);
       
        switch(CURRENT_QUALITE){
            case "all"       : { 
                LIST_GENERALE= [...listAll]; 
                LISTE_FILTRE = [...LIST_GENERALE_PAIEMENTS]

                if(DATEDEB_VERIF=="" && DATEFIN_VERIF==""){
                    setGridRows(LISTE_FILTRE);
                    setTotalPaye(calculTotal(LISTE_FILTRE));
                } else {
                    filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
                }             
                
                console.log("val",listAll,LIST_GENERALE); 
                break;
            }
            case "enseignant": { 
                LIST_GENERALE= [...listEns]; 
                LISTE_FILTRE = LIST_GENERALE_PAIEMENTS.filter((elt)=>elt.poste=="enseignant")
                if(DATEDEB_VERIF=="" && DATEFIN_VERIF==""){
                    setGridRows(LISTE_FILTRE);
                    setTotalPaye(calculTotal(LISTE_FILTRE));
                } else {
                    filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
                }               
                
                console.log("val",listEns,LIST_GENERALE); 
                break;
            }
            case "adminStaff": { 
                LIST_GENERALE= [...listAdm]; 
                LISTE_FILTRE = LIST_GENERALE_PAIEMENTS.filter((elt)=>elt.poste!="enseignant")
                
                if(DATEDEB_VERIF=="" && DATEFIN_VERIF==""){
                    setGridRows(LISTE_FILTRE);
                    setTotalPaye(calculTotal(LISTE_FILTRE));
                } else {
                    filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
                }   
                
                console.log("val",listAdm,LIST_GENERALE); 
                break;
            }
        } 
        
    }

    function calculTotal(list){
        var montantTotal = 0;
        list.map((elt)=>{
            montantTotal = montantTotal + elt.montant;
        });
        return montantTotal;
    }

    function getListPaiement(user_id){
        axiosInstance.post(`bilan-paiement-personnel/`, {
            id_sousetab    : currentAppContext.currentEtab,            
            user_id        : user_id,
            type_personnel : CURRENT_QUALITE,
            date_deb       : CUR_DATE_DEB,
            date_fin       : CUR_DATE_FIN         
        }).then((res)=>{
            console.log("resultat",res.data.res);
            LIST_GENERALE_PAIEMENTS = formatListPaie(res.data.res);
            LISTE_FILTRE = [...LIST_GENERALE_PAIEMENTS];
            setGridRows(LIST_GENERALE_PAIEMENTS);
            setTotalPaye(res.data.montant_total);                       
        })  
    }


    const formatListPaie=(list) =>{
        var formattedList = [];
        var rang = 1;
        list.map((elt)=>{
            listElt={};
            listElt.id               = elt.id;
            listElt.displayedName    = elt.nom +' '+elt.prenom;
            listElt.poste            = elt.poste.toLowerCase();
            listElt.nom              = elt.nom;
            listElt.prenom           = elt.prenom;
            listElt.displayedMontant = formatCurrency(elt.montant)+' FCFA';
            listElt.montant          = elt.montant;
            listElt.date             = convertDateToUsualDate(elt.date);
            listElt.rang             = rang;
            formattedList.push(listElt);  
            rang++;          
        });

       return formattedList;
    }

    function searchTextChangeHandler(e){
        var name = e.target.value;
        setListProfs(LIST_GENERALE);
        console.log("fffff",name,LIST_GENERALE);
        
        var matchedEleves =  LIST_GENERALE.filter((elt)=>elt.label.toLowerCase().includes(name.toLowerCase()));
        LISTE_FILTRE = LIST_GENERALE_PAIEMENTS.filter((elt)=>elt.displayedName.toLowerCase().includes(name.toLowerCase()));
        setListProfs(matchedEleves);
        setGridRows(LISTE_FILTRE);
        setTotalPaye(calculTotal(LISTE_FILTRE));
        
    }

    function validateSelectionHandler(e){
        var name = document.getElementById("searchText").value;
        LISTE_FILTRE = LIST_GENERALE_PAIEMENTS.filter((elt)=>elt.displayedName.toLowerCase().includes(name.toLowerCase()));
        setGridRows(LISTE_FILTRE);
        setTotalPaye(calculTotal(LISTE_FILTRE));
        setListProfs([]);
    }

    function consultRowData(row){
        var inputs=[];

        // inputs[0]= row.nom;
        // inputs[1]= row.prenom;
        // inputs[2]= row.date_naissance;
        // inputs[3]= row.lieu_naissance;
        // inputs[4]= row.etab_origine;

        // inputs[5]= row.nom_pere;
        // inputs[6]= row.email_pere;
        // inputs[7]= row.tel_pere;

        // inputs[8]= row.nom_mere;
        // inputs[9]= row.email_mere;
        // inputs[10]= row.tel_mere;

        // inputs[11]= row.matricule;
     
        // currentUiContext.setFormInputs(inputs)
        // setModalOpen(3);

    }   
    
    function quitForm() {
        setModalOpen(0)
    }

   
    function handlePresence(params){
        console.log(params);
        if(params.presence == 0) {
            params.presence = 1;
           // setTotalPaye(present+1);
            setAbsent(absent-1);
        }
        else{
            params.presence = 0;
            //setTotalPaye(present-1);
            setAbsent(absent+1);
        } 
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

    

    function filterPaiement(list, dateDeb, dateFin){
        var resultList = [...list];
        console.log('filtre ici',list, dateDeb, dateFin);
       

        if(dateDeb != '' && dateFin == ''){
            filterString =  t('from') +':'+ dateDeb+' '+t('to')+ ':'+getTodayDate();
            resultList = list.filter((elt)=>new Date(changeDateIntoMMJJAAAA(elt.date.split(' ')[0])) >= new Date(changeDateIntoMMJJAAAA(dateDeb)));
        }

        if(dateDeb == '' && dateFin != ''){
            filterString = t('from') +':'+ getTodayDate()+' '+t('to')+ ':'+dateFin;
            resultList = list.filter((elt)=>new Date(changeDateIntoMMJJAAAA(elt.date.split(' ')[0])) <= new Date(changeDateIntoMMJJAAAA(dateFin)));
        }

        if(dateDeb != '' && dateFin != ''){
            filterString = t('from') +':'+ dateDeb+' '+t('to')+ ':'+dateFin;
            resultList = list.filter((elt)=>(new Date(changeDateIntoMMJJAAAA(elt.date.split(' ')[0])) >= new Date(changeDateIntoMMJJAAAA(dateDeb)) && new Date(changeDateIntoMMJJAAAA(elt.date.split(' ')[0])) <= new Date(changeDateIntoMMJJAAAA(dateFin))));
        }

        setGridRows(resultList);
        setTotalPaye(calculTotal(resultList));
        return resultList;

    }

   
    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);
                setGridRows([]);
                setTotalPaye(0);
                setAbsent(0);
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

            case MSG_SUCCESS_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_RECAP :{
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
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

    function getJourDebAndFilter(e){
        setGridRows([]);
        JOUR_DEB = e.target.value;
        DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        console.log("date verif",gridRows);
        if(DATEDEB_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterPaiement(LISTE_FILTRE,'',DATEFIN_VERIF);
    }

    function getJourFinAndFilter(e){
        setGridRows([]);
        JOUR_FIN = e.target.value;
        DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterPaiement(LISTE_FILTRE, '', DATEDEB_VERIF);
    }

    function getMoisDebAndFilter(e, dateFin){
        setGridRows([]);
        MOIS_DEB = e.target.value;
        DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        console.log("date verif",DATEDEB_VERIF);
        if(DATEDEB_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterPaiement(LISTE_FILTRE, '', DATEFIN_VERIF);
    }

    function getMoisFinAndFilter(e){
        setGridRows([]);
        MOIS_FIN = e.target.value;
        DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterPaiement(LISTE_FILTRE, DATEDEB_VERIF, '');
    }


    function getYearDebAndFilter(e){
        setGridRows([]);
        YEAR_DEB = e.target.value;
        DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        console.log("date verif",DATEDEB_VERIF);
        if(DATEDEB_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
        else filterPaiement(LISTE_FILTRE, '', DATEFIN_VERIF);
    }

    function getYearFinAndFilter(e){
        setGridRows([]);
        YEAR_FIN = e.target.value;
        DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
        if(DATEFIN_VERIF.length==10) filterPaiement(LISTE_FILTRE,'',DATEFIN_VERIF);
        else filterPaiement(LISTE_FILTRE, '', '');
    }

    
    const closePreview =()=>{
        setModalOpen(0);
    }

    const printStudentList=()=>{
        
        if(CURRENT_QUALITE != undefined){
            var PRINTING_DATA ={
                dateText         : 'Yaounde,'+ getTodayDate(),
                leftHeaders      : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders    : ["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
                rightHeaders     : ["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
                pageImages       : ["images/collegeVogt.png"],
                pageTitle        : "Bilan des paiements du personnel ",
                tableHeaderModel : ["N°",t("poste"), t("displayedName_M"), t("total_paye_M"), t("date_paement_M")],
                tableData        : [...gridRows],
                total_paye       : total_paye,
                numberEltPerPage : ROWS_PER_PAGE  
            };
            printedETFileName = 'Bilan_paiements.pdf';
            setModalOpen(1);
            ElevePageSet=[];
            ElevePageSet = createPrintingPages(PRINTING_DATA);
            ElevePageSet[0].filterString = filterString +'  '+ t('position') +':'+CURRENT_QUALITE_LABEL ;
            ElevePageSet[ElevePageSet.length-1].total_paye = total_paye;
            console.log("ici la",ElevePageSet,gridRows);                    
        } else{
            chosenMsgBox = MSG_WARNING_RECAP;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "warning", 
                msgTitle : t("warning_M"), 
                message  : t("must_select_class")
            })            
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
        <div className={classes.formStyleP} onClick={()=>{if(!MOUSE_INSIDE_DROPDOWN && listProfs.length>0) {document.getElementById("hidden1_"+MultiSelectId).value = ""; setListProfs([]);}}}>
            {(modalOpen==1) && <BackDrop/>}
            {(modalOpen==1) && 
                <PDFTemplate previewCloseHandler={closePreview} style={{height:"85.7vh"}}>
                    { isMobile?
                        <PDFDownloadLink fileName={printedETFileName}   
                            document = { 
                                <EtatPaiementStaff pageSet={ElevePageSet}/>
                            }
                        >
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                             <EtatPaiementStaff pageSet={ElevePageSet}/>
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
                    {t('bilan_paiement_staff_M')}  
                </div>                
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText} style={{width:"8vw"}}>
                            {t('personnel_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <MultiSelect
                                id                  = {MultiSelectId}
                                //-----Fields-----
                                optData             = {optDestinataire}
                                fetchedData         = {listProfs}
                                selectionMode       = {"single"}
                            
                                //-----Handler-----
                                optionChangeHandler     = {recepientChangeHandler  }
                                searchTextChangeHandler = {searchTextChangeHandler }
                                selectValidatedHandler  = {validateSelectionHandler}
                                mouseLeave              = {()=>{MOUSE_INSIDE_DROPDOWN = false}}
                                mouseEnter              = {()=>{MOUSE_INSIDE_DROPDOWN = true }}
                            
                                //-----Styles-----
                                searchInputStyle    = {{fontSize:"0.87vw", height:"4.7vh"}}
                                searchInputStyleP   = {{height:"4vh", width:"13vw"}}
                                comboBoxStyle       = {{width:"13vw", height:"4vh", border:"solid 2px #8eb1ec", fontSize:"1vw", borderRadius:"3px"}}
                                dataFieldStyle      = {{minHeight:"5vh", borderRadius:"1vh", height:"fit-content", maxHeight:"53vw", overflowY:"scroll", border:"solid 1px gray", fontSize:"0.8vw", fontWeight:100, backgroundColor:"whitesmoke", position:"absolute", top:"22.3vh", width:"13vw"}}
                                MSContainerStyle    = {{/*border:"solid 1px grey",*/ padding:"1vh", marginRight:"1vh", marginBottom:"-1vh"}}
                            />
                            
                        </div>
                    </div>
 
                  
                    <div className={classes.gridTitle} style={{marginLeft:"1vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_deb')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                            {/*<select id='optDate' onChange={dateChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optDate||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>*/} 
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour_deb"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_deb"), document.getElementById("mois_deb"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourDebAndFilter} style={{width:'1.3vw', fontSize:'1vw', height:'1.3vw', marginLeft:'-2vw', color:'#065386', fontWeight:'bold'}} />/
                                <input id="mois_deb"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_deb"), document.getElementById("anne_deb"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisDebAndFilter} style={{width:'1.4vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw', color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne_deb"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_deb"), document.getElementById("jour_fin"))}}                                     maxLength={4}     className={classes.inputRowControl }  onChange={getYearDebAndFilter} style={{width:'2.7vw', fontSize:'1vw', height:'1.3vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold'}}  />
                            </div>                             
                                    
                        </div>
                        
                    </div>

                    <div className={classes.gridTitle} style={{marginLeft:"-3.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_fin')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                            {/*<select id='optDate' onChange={dateChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optDate||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>*/} 
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour_fin"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_fin"), document.getElementById("mois_fin"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourFinAndFilter} style={{width:'1.3vw', fontSize:'1vw', height:'1.3vw', marginLeft:'-2vw', color:'#065386', fontWeight:'bold'}} />/
                                <input id="mois_fin"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_fin"), document.getElementById("anne_fin"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisFinAndFilter} style={{width:'1.4vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw', color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne_fin"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_fin"), null)}}                                     maxLength={4}     className={classes.inputRowControl }  onChange={getYearFinAndFilter} style={{width:'2.7vw', fontSize:'1vw', height:'1.3vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold'}}  />
                            </div>  
                            
                                    
                        </div>
                        
                    </div>
                    
                                
                    <div className={classes.gridAction}>                       
                        <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printStudentList}
                               
                        />

                    </div>
                        
                </div>
                    
                

                {(modalOpen==0) ?
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                            getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                            
                            onCellClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    handlePresence(params.row)
                                }
                            }}  
                            
                        //    onRowDoubleClick ={(params, event) => {
                        //        if(!event.ignore){
                        //             event.defaultMuiPrevented = true;
                        //             consultRowData(params.row);
                        //         }
                        //     }}
                            
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
                    :
                    null
                }
            
            </div>
            <div style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"center", color:"black", fontWeight:"800", fontSize:"0.97VW",marginRight:"3vw"}}>
                <div> {t('total_paye_M')} :</div>
                <div style={{marginLeft:"0.3vw"}}> {formatCurrency(total_paye)} FCFA</div>          
            </div>
        </div>
        
    );
} 
export default RecapSorties;