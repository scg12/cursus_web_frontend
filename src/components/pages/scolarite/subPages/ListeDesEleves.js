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
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import PDFTemplate from '../reports/PDFTemplate';
import {isMobile} from 'react-device-detect';
import StudentList from '../reports/StudentList';
import StudentListTemplate from '../reports/StudentListTemplate';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;

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


function ListeDesEleves(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse] = useState([]);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        
        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }

        getEtabListClasses();
        
    },[]);

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
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data)]
            console.log(listEleves);
            setGridRows(listEleves);
            console.log(gridRows);
        })  
        return listEleves;     
    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id              = elt.id;
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


    function dropDownHandler(e){
        //console.log(e.target.value)
        var grdRows;
        if(e.target.value != optClasse[0].value){
            setIsValid(true);
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getClassStudentList(CURRENT_CLASSE_ID);   
            console.log(CURRENT_CLASSE_LABEL)          
        }else{
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setGridRows([]);
            setIsValid(false);
        }
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
                        width={17} 
                        height={17} 
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
            printedETFileName = 'Liste_eleves('+CURRENT_CLASSE_LABEL+').pdf';
            setModalOpen(4);
            ElevePageSet=[];
            //ElevePageSet = [...splitArray([...gridRows], "Liste des eleves de la classe de " + CURRENT_CLASSE_LABEL, ROWS_PER_PAGE)];          
            ElevePageSet = createPrintingPages(PRINTING_DATA);
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
            {(modalOpen >0 && modalOpen<4) && 
                <AddStudent 
                    currentClasseLabel={optClasse[optClasse.findIndex((classe)=> classe.value == CURRENT_CLASSE_ID)].label} 
                    currentClasseId={CURRENT_CLASSE_ID} 
                    formMode= {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  
                    actionHandler={(modalOpen==1) ? addNewStudent : modifyStudent} 
                    cancelHandler={quitForm}
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
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('student_list_M')}  :
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
                                btnText={t('New_student')}
                                hasIconImg= {true}
                                imgSrc='images/addNewSchoolStud.png'
                                //imgSrc='images/addNewUserOrg.png'
                                imgStyle = {classes.grdBtnImgStyleP}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyle}
                                btnClickHandler={AddNewStudentHandler}
                                disable={(isValid==false)}   
                            />
                            :
                            null
                        }

                        <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printStudentList}
                            disable={(isValid==false)}   
                        />

                        <CustomButton
                            btnText={t('importer')}
                            hasIconImg= {true}
                            imgSrc='images/import.png'
                            imgStyle = {classes.grdBtnImgStyle} 
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(isValid==false)}    
                        />
                    </div>
                        
                </div>
                    
                

             
                <div className={classes.gridDisplay} >
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