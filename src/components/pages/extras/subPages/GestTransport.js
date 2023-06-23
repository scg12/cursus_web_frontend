

import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import BackDrop from "../../../backDrop/BackDrop";
import MsgBox from '../../../msgBox/MsgBox';

import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


let INITIAL_CLASSE_ID;
let FINAL_CLASSE_ID;
let CURRENT_NIVEAU_ID;
var selectedElevesIds = new Array();
var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;

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


function GestTransport(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const [isValid, setIsValid] = useState(false);
    const [gridRowsDep, setGridRowsDep] = useState([]);
    const [gridRowsFin, setGridRowsFin] = useState([]);
    //const [chosenMsgBox, setChosenMsgBox] = useState(MSG_SUCCESS); //1= MsgBox succes, 2= warning
    const [optClasseDep, setOpClasseDep] = useState([]);
    const [optClasseFin, setOpClasseFin] = useState([]);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        
        if(gridRowsDep.length==0){
            INITIAL_CLASSE_ID = undefined;
            FINAL_CLASSE_ID = undefined;
        }

        if(gridRowsFin.length==0){
            FINAL_CLASSE_ID = undefined;
        }

        getEtabListClasses();
    },[]);


    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.displayedName  = elt.nom +' '+elt.prenom;
            listElt.nom = elt.nom;
            listElt.prenom = elt.prenom;
            listElt.rang = rang; 
            listElt.presence = 1; 
            listElt.matricule = elt.matricule;
            listElt.date_naissance = convertDateToUsualDate(elt.date_naissance);
            listElt.lieu_naissance = elt.lieu_naissance;
            listElt.date_entree = elt.date_entree;
            listElt.nom_pere = elt.nom_pere;
            listElt.tel_pere = elt.tel_pere;    
            listElt.email_pere = elt.email_pere;
            listElt.nom_mere = elt.nom_mere;
            listElt.tel_mere = elt.tel_mere;   
            listElt.email_mere = elt.email_mere;
            listElt.etab_provenance = elt.etab_provenance;
            listElt.sexe = elt.sexe;
            listElt.redouble = (elt.redouble == false) ? "nouveau" : "Redoublant";

            listElt.nom_parent = (elt.nom_pere.length>0) ? elt.nom_pere:elt.nom_mere ;
            listElt.tel_parent = (elt.nom_pere.length>0) ? elt.tel_pere : elt.tel_mere;    
            listElt.email_parent = (elt.nom_pere.length>0) ? elt.email_pere : elt.email_mere;

            
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }



    const getEtabListClasses=()=>{
       var tempTable=[{value: '0',      label:(i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  ', id_niveau:0    }]
        axiosInstance.post(`list-classes/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
                console.log(res.data);
                res.data.map((classe)=>{
                tempTable.push({value:classe.id, label:classe.libelle, id_niveau:classe.id_niveau})
                setOpClasseDep(tempTable);
           })         
        }) 
    }

    const  getClassStudentListDep=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data)]
            console.log(listEleves);
            setGridRowsDep(listEleves);
            console.log(gridRowsDep);
        })  
        return listEleves;     
    }

    const  getClassStudentListFin=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data)]
            console.log(listEleves);
            setGridRowsFin(listEleves);
            console.log(gridRowsFin);
        })  
        return listEleves;     
    }

    function dropDownHandler1(e){
        var tempTable=[];
        selectedElevesIds = new Array();
        
        if(e.target.value != optClasseDep[0].value){
            getClassStudentListDep(e.target.value);
            INITIAL_CLASSE_ID = e.target.value;
            CURRENT_NIVEAU_ID = optClasseDep[optClasseDep.findIndex((classe)=> classe.value ==INITIAL_CLASSE_ID)].id_niveau;
            optClasseDep.map((classe)=>{
                if((classe.id_niveau == CURRENT_NIVEAU_ID && classe.value != INITIAL_CLASSE_ID )||(classe.value==0))  tempTable.push(classe)
            })  

            setOpClasseFin(tempTable);
            document.getElementById("selectClass2").options[0].selected=true;
            setGridRowsFin([]);
            FINAL_CLASSE_ID = undefined;
            console.log(e.target.name)
        }else{
            tempTable=[{value: '0',      label:(i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  ', id_niveau:0    }];
            setOpClasseFin(tempTable);
            INITIAL_CLASSE_ID = undefined;
            CURRENT_NIVEAU_ID = undefined;
            setGridRowsDep([]);
            setGridRowsFin([]);
        }
    }

    function dropDownHandler2(e){
        if(e.target.value != optClasseFin[0].value){
            getClassStudentListFin(e.target.value);
            FINAL_CLASSE_ID = e.target.value;
                      
        }else{
            FINAL_CLASSE_ID = undefined;
            selectedElevesIds = new Array();
            setIsValid(false);
            setGridRowsFin([]);
        }       
    }
    
/*************************** DataGrid Declaration ***************************/    

const columnsModel1Fr = [
    {
        field: 'id',
        headerName: 'id',
        width: 15,
        editable: false,
        hide: true,
    },
    
     {
        field: 'matricule',
        headerName: 'MATRICULE',
        hide: true,
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
        width: 300,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
     },

 ];

    const columnsModel1En = [
       {
            field: 'id',
            headerName: 'id',
            width: 15,
            editable: false,
            hide: true,
            headerClassName:classes.GridColumnStyle,
        },
       
        {
            field: 'matricule',
            headerName: 'REG. CODE',
            hide: true,
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedName',
            headerName: 'NME AND SURNAME',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'nom',
            headerName: 'NAME',
            width: 300,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
      
    ];


    const columnsModel2Fr = [
        
        {
            field: 'matricule',
            headerName: 'MATRICULE',
            hide: true,
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedName',
            headerName: 'NOM ET PRENOM(S)',
            width: 300,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
       
       
    ];

    const columnsModel2En = [
       
        {
            field: 'matricule',
            headerName: 'REG CODE',
            hide: true,
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedName',
            headerName: 'NAME AND SURNAME',
            width: 300,
            editable: false,
            headerClassName:classes.GridColumnStyle
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
    function changeStudentClassHandler(e){
       
        if(selectedElevesIds[0].length == 0) {
            chosenMsgBox = MSG_WARNING;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"warning", 
                msgTitle : t("warning_M"), 
                message  : t("must_select_student")
            })

        } else {
            
            //var listEleves = selectedElevesIds.join('_');
                
            axiosInstance.post(`change-eleves-classe/`, {
                    id_classe_dep   : INITIAL_CLASSE_ID,
                    id_classe_cible : FINAL_CLASSE_ID,
                    eleves_ids_list : selectedElevesIds[0], 

                }).then((res)=>{
                console.log(res.data);
                chosenMsgBox = MSG_SUCCESS;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"info", 
                    msgTitle:t("change_class_success_M"), 
                    message:t("change_class_success"),
                });               
       
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
                getClassStudentListFin(FINAL_CLASSE_ID);
                getClassStudentListDep(INITIAL_CLASSE_ID);
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

      '& .super-added-theme': {
        backgroundColor: 'rgba(247, 212, 115, 0.5)',
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
            <div className={classes.inputRow}>
                <div className={classes.formTitle}>
                    {t('GESTION DU TRANSPORT DES ELEVES')}
                </div>
            </div>
            
        </div>
        
    );
} 
export default GestTransport;