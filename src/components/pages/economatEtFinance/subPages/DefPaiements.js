import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import DefPaiementEns from "../../economatEtFinance/modals/DefPaiementEns";
import DefPaiementAdm from "../../economatEtFinance/modals/DefPaiementAdm";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import {isMobile} from 'react-device-detect';
//import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_QUALITE_ID;
let CURRENT_QUALITE_LABEL;

var listElt = {}



var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const ROWS_PER_PAGE= 40;
var ElevePageSet=[];
var printedETFileName ='';


function DefPaiements(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid]           = useState(false);
    const [gridRows, setGridRows]         = useState([]);
    const [modalOpen, setModalOpen]       = useState(0);  //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [typePaiement, setTypePaiement] = useState(0);
    const [optQualite, setOpQualite]      = useState(tabQualite);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        
        if(gridRows.length==0){
            CURRENT_QUALITE_ID = undefined;
        }

      
       setOpQualite(tabQualite)
       CURRENT_QUALITE_ID    = tabQualite[0].value; 
       CURRENT_QUALITE_LABEL = tabQualite[0].label; 

       getListPersonnel(currentAppContext.currentEtab, CURRENT_QUALITE_ID);       
    },[]);

    var tabQualite =[
        {value:1, label:i18n.language=='fr'? "Enseignant" : "Teacher"},
        {value:2, label:i18n.language=='fr'? "Administration" : "Administration"}
    ]

   
    const  getListPersonnel=(sousEtabId, qualiteId)=>{
        var listPersonnel = []
        axiosInstance.post(`list-personnel/`, {
            id_sousetab: sousEtabId,
        }).then((res)=>{
            console.log(res.data);
            if(qualiteId == 1){
                listPersonnel = [...formatListEns(res.data.enseignants)]
            } else {
                listPersonnel = [...formatListAdm(res.data.adminstaffs)]
            }
           
            console.log("data staff",listPersonnel);
            setGridRows(listPersonnel);
            console.log(gridRows);
        })  
    }

    const formatListEns=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id             = elt.id 
            listElt.id_ens         = elt.id_ens;
            listElt.displayedName  = elt.nom +' '+elt.prenom;
            listElt.nom            = elt.nom;
            listElt.prenom         = elt.prenom;
            listElt.rang           = rang; 
            listElt.type_salaire   = elt.type_salaire==""? t("to_define"):elt.type_salaire; 
            listElt.type_salaire_libelle = elt.type_salaire==""? t("to_define"):t(elt.type_salaire);
            listElt.salaire        = listElt.type_salaire=="permanent"? elt.salaire:0;
            listElt.quota_horaire  = listElt.type_salaire=="permanent"? 0:elt.salaire;
            listElt.portee_salaire = elt.portee_salaire;
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    const formatListAdm=(list) =>{
        var rang = 1;
        var formattedList         = []
        var adm_fonctions         = "";
        var salaire_fonctions     = 0;
        var list_salaire_fonction = "";
        var adm_data;
        list.map((elt)=>{
            listElt = {};
            listElt.id                    =  elt.id ;
            listElt.id_ens                =  elt.id_ens;
            listElt.displayedName         = elt.nom +' '+elt.prenom;
            listElt.nom                   = elt.nom;
            listElt.prenom                = elt.prenom;
            listElt.rang                  = rang; 
            listElt.is_prof               = elt.is_prof ; 
            listElt.adm_data              = elt.admin_data;
            adm_data                      = elt.admin_data;

            adm_data.map((elt, index)=>{
                if(index < adm_data.length-1){
                    adm_fonctions         = adm_fonctions + elt.hierarchie + ', ';
                    list_salaire_fonction = list_salaire_fonction + elt.salaire +'_';
                } else {
                    adm_fonctions         = adm_fonctions + elt.hierarchie;
                    list_salaire_fonction = list_salaire_fonction + elt.salaire;
                } 
                    salaire_fonctions     = salaire_fonctions + elt.salaire;
            })
            
            console.log("fonctions", adm_fonctions);
            
            listElt.list_salaire_fonction = list_salaire_fonction;
            listElt.salaire_fonctions     = salaire_fonctions;
            listElt.salaire_prof          = listElt.is_prof ? elt.salaire_prof : 0;
            listElt.salaire               = listElt.salaire_fonctions +  listElt.salaire_prof;

            listElt.fonctions             = adm_fonctions; 
            listElt.fonctions_Gen         = listElt.is_prof ? adm_fonctions + ", " + t("teacher") : adm_fonctions ; 

            
            listElt.type_salaire          = listElt.is_prof  ? elt.type_salaire_prof : ""; 
            listElt.portee_salaire        = elt.admin_data.portee_salaire;
            
            adm_fonctions         = '';
            list_salaire_fonction = "";
            salaire_fonctions     = 0;
            
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }


    function dropDownHandler(e){  
        CURRENT_QUALITE_ID = e.target.value; 
        CURRENT_QUALITE_LABEL = optQualite[optQualite.findIndex((classe)=>(classe.value == CURRENT_QUALITE_ID))].label;
        getListPersonnel(currentAppContext.currentEtab, CURRENT_QUALITE_ID);  
        // console.log(CURRENT_QUALITE_LABEL) 
    }
 
/*************************** DataGrid Declaration ***************************/    
    const columnsFr = [

        {
            field: 'id',
            headerName: "",
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'id_ens',
            headerName: "",
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_adminstaff_ens',
            headerName: "",
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
       
        {
            field: 'rang',
            headerName: "N°",
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'displayedName',
            headerName: "NOM(S) ET PRENOM(S)",
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'adm_data',
            headerName:"FONCTIONS",
            width: 300,
            editable: false,
            hide :  true,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'fonctions',
            headerName:"FONCTIONS",
            width: 300,
            editable: false,
            hide :  true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'fonctions_Gen',
            headerName:"FONCTIONS",
            width: 300,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 1)? true : false,
            headerClassName:classes.GridColumnStyle
        },

        

        {
            field: 'list_salaire_fonction',
            headerName:"FONCTIONS",
            width: 300,
            editable: false,
            hide :  true,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'type_salaire',
            headerName: "TYPE DE CONTRAT",
            width:120,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },    

        {
            field: 'type_salaire_libelle',
            headerName: "TYPE DE CONTRAT",
            width:120,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 2)? true : false,
            headerClassName:classes.GridColumnStyle
        },    

      
        {
            field: 'quota_horaire',
            headerName: "QUOTA HORAIRE",
            width: 100,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 2)? true : false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'is_prof',
            headerName: "",
            width: 100,
            editable: false,
            hide :  true ,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'salaire_fonctions',
            headerName:"SALAIRE ADM.",
            width: 90,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 1)? true : false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'salaire_prof',
            headerName:"SALAIRE ENS.",
            width: 90,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 1)? true : false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'salaire',
            headerName:"SALAIRE TOTAL",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: '',
            headerName: 'ACTION',
            width: 15,
            editable: false,
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
                    </div>
                )
            }           
                
        },
    
    ];

    const columnsEn = [
        {
            field: 'id',
            headerName: "",
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'id_ens',
            headerName: "",
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_adminstaff_ens',
            headerName: "",
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'rang',
            headerName: "N°",
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'displayedName',
            headerName: "NAME(S) ET SURNAME(S)",
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'adm_data',
            headerName:"FONCTIONS",
            width: 300,
            editable: false,
            hide :  true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'fonctions',
            headerName:"FONCTIONS",
            width: 300,
            editable: false,
            hide :  true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'fonctions_Gen',
            headerName:"FONCTIONS",
            width: 300,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 1)? true : false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'list_salaire_fonction',
            headerName:"FONCTIONS",
            width: 300,
            editable: false,
            hide :  true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'type_salaire',
            headerName: "CONTRACT TYPE",
            width:120,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },  
        
        {
            field: 'type_salaire_libelle',
            headerName: "TYPE DE CONTRAT",
            width:120,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 2)? true : false,
            headerClassName:classes.GridColumnStyle
        },   

        {
            field: 'quota_horaire',
            headerName: "QUOTA HORAIRE",  // a traduire
            width: 100,
            editable: false,
            hide : (CURRENT_QUALITE_ID == 2)? true : false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'is_prof',
            headerName: "",
            width: 100,
            editable: false,
            hide :  true ,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'salaire_fonctions',
            headerName:"ADM. SALARY",
            width: 90,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 1)? true : false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'salaire_prof',
            headerName:"TEACHER SALARY",
            width: 120,
            editable: false,
            hide :  (CURRENT_QUALITE_ID == 1)? true : false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'salaire',
            headerName:"GLOBAL SALARY",  //a traduire
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        }, 

        {
            field: '',
            headerName: 'ACTION',
            width: 15,
            editable: false,
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
                    </div>
                )
            }           
                
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

    function handleEditRow(row, qualiteId){       
        var inputs=[];
        
        if(qualiteId == 1){
            inputs[0]= row.id + '_' + row.id_ens;
            inputs[1]= row.displayedName;
            inputs[2]= row.type_salaire == "permanent" ? row.salaire : row.quota_horaire;
            inputs[3]= row.salaire;  
            inputs[4]= row.type_salaire;      
        } else {
            inputs[0]= row.id + '_' + row.id_ens;
            inputs[1]= row.displayedName;
            inputs[2]= row.salaire_prof;
            inputs[3]= row.salaire;
            inputs[4]= row.salaire_fonctions;
            inputs[5]= row.salaire_prof;
            inputs[6]= row.is_prof;
            inputs[7]= row.type_salaire;
            inputs[8]= row.fonctions;
            inputs[9]= row.list_salaire_fonction;
            inputs[10]= row.adm_data;
        }
       
        currentUiContext.setFormInputs(inputs)
        
        if(qualiteId == 1) {
            setTypePaiement(1);
            setModalOpen(1);
        }
        else {
            setTypePaiement(2);
            setModalOpen(1);        
        }
    }

    function consultRowData(row,qualiteId){
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
        
        if(qualiteId == 1) {
            setTypePaiement(1);
            setModalOpen(2);
        }
        else {
            setTypePaiement(2);
            setModalOpen(2);        
        }

    }

    function updatePaiement(CURRENT_PAIEMENT) {       
        console.log('Ajout',CURRENT_PAIEMENT);
        axiosInstance.post(`update-salaire-personnel/`, {
            
            id_sousetab                        : CURRENT_PAIEMENT.id_sousetab,
            type_personnel                     : CURRENT_PAIEMENT.type_personnel,
            type_salaire                       : CURRENT_PAIEMENT.type_salaire,
            portee_salaire                     : CURRENT_PAIEMENT.portee_salaire,
            id_user                            : CURRENT_PAIEMENT.id_user,
            id_ens                             : CURRENT_PAIEMENT.id_ens,
            salaire                            : CURRENT_PAIEMENT.salaire,
            is_salaire_total                   : CURRENT_PAIEMENT.is_salaire_total==true? "true":"false",
            tab_salaire                        : CURRENT_PAIEMENT.tab_salaire,
            is_enseignant                      : CURRENT_PAIEMENT.is_enseignant==true? "true":"false",
            id_adminstaff_enseignant           : CURRENT_PAIEMENT.id_adminstaff_enseignant,
            type_salaire_adminstaff_enseignant : CURRENT_PAIEMENT.type_salaire_adminstaff_enseignant,
            salaire_adminstaff_enseignant      : CURRENT_PAIEMENT.salaire_adminstaff_enseignant,
     
        }).then((res)=>{
            console.log(res.data);
            //setModalOpen(0);
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
            id_classe : CURRENT_QUALITE_ID,
            id : eleve.id, 
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
            //setModalOpen(0);
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
        setTypePaiement(0)
    }
   
    function saveNewMsgHandler(e){
        if(CURRENT_QUALITE_ID != undefined){
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
                getListPersonnel(currentAppContext.currentEtab, CURRENT_QUALITE_ID);
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
        
         if(CURRENT_QUALITE_ID != undefined){
        //     var PRINTING_DATA ={
        //         dateText:'Yaounde, le 14/03/2023',
        //         leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
        //         centerHeaders:["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
        //         rightHeaders:["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
        //         pageImages:["images/collegeVogt.png"],
        //         pageTitle: "Liste des eleves de la classe de " + CURRENT_QUALITE_LABEL,
        //         tableHeaderModel:["matricule", "nom et prenom(s)", "date naissance", "lieu naissance", "enrole en", "Nom Parent", "nouveau"],
        //         tableData :[...gridRows],
        //         numberEltPerPage:ROWS_PER_PAGE  
        //     };
        //     printedETFileName = 'Liste_eleves('+CURRENT_QUALITE_LABEL+').pdf';
        //     setModalOpen(4);
        //     ElevePageSet=[];
        //     //ElevePageSet = [...splitArray([...gridRows], "Liste des eleves de la classe de " + CURRENT_QUALITE_LABEL, ROWS_PER_PAGE)];          
        //     ElevePageSet = createPrintingPages(PRINTING_DATA);
        //     console.log("ici la",ElevePageSet,gridRows);                    
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
            {(typePaiement != 0) && <BackDrop/>}
            {(typePaiement == 1) && 
                <DefPaiementEns 
                    formMode      = 'creation'
                    actionHandler = {updatePaiement} 
                    cancelHandler = {quitForm}
                />
            }

            {(typePaiement == 2) && 
                <DefPaiementAdm  
                    formMode      = 'creation' 
                    actionHandler = {updatePaiement} 
                    cancelHandler = {quitForm}
                />
            }
            
            {(typePaiement!=0) && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true)&& <BackDrop/>}
            {(currentUiContext.msgBox.visible == true)&&
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
                <div className={classes.formTitle}>
                    {t('def_paiement_personnel_M')} 
                </div>
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('type_de_salarie_M')}  :
                        </div>
                      
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select id='selectClass1' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optQualite||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                     
                        {/* <CustomButton
                            btnText={t('nouv_communique')}
                            hasIconImg= {true}
                            imgSrc='images/NewComInterne.png'
                            //imgSrc='images/addNewUserOrg.png'
                            imgStyle = {classes.grdBtnImgStyleP}  
                            buttonStyle={getGridButtonStyle()}
                            style={{width:"12.3vw", height:"4.3vh"}}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={saveNewMsgHandler}
                            // disable={(isValid==false)}   
                        /> */}
                         

                        {/* <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printStudentList}
                            disable={(isValid==false)}   
                        /> */}

                        {/* <CustomButton
                            btnText={t('importer')}
                            hasIconImg= {true}
                            imgSrc='images/import.png'
                            imgStyle = {classes.grdBtnImgStyle} 
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(isValid==false)}    
                        /> */}
                    </div>
                        
                </div>
                    
                

             
                <div className={classes.gridDisplay} >
                    <StripedDataGrid
                        
                        rows={gridRows}
                        columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                        getCellClassName={(params) => (params.field==='displayedName')? classes.gridMainRowStyle : (params.field==='quota_horaire' || params.field==='salaire_fonctions'|| params.field==='salaire_prof')? classes.gridRowRightStyle : (params.field ==='salaire') ? classes.gridRowRightBoldStyle : classes.gridRowStyle}
                        // onCellClick={handleDeleteRow}
                        onRowClick={(params,event)=>{
                            if(event.ignore) {
                                handleEditRow(params.row, CURRENT_QUALITE_ID)
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
export default DefPaiements;