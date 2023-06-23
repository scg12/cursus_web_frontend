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
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer } from '@react-pdf/renderer';
import PDFTemplate from '../reports/PDFTemplate';
import StudentList from '../reports/StudentList';
import StudentListTemplate from '../reports/StudentListTemplate';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
let CURRENT_PROF_PP_ID;
let CURRENT_PROF_PP_LABEL;

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


function Studentprofile(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid] = useState(false);
    const [gridMeeting, setGridMeeting]= useState([]);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse] = useState([]);
    const selectedTheme = currentUiContext.theme;
    const [optPeriode, setOpPeriode] = useState([]);
   

    const tabPeriode =[
        {value:0, label:(i18n.language=='fr') ? ' Choisir une periode ' :'  Select a period  '},
        {value:1, label:' sequence '},
        {value:2, label:' Trimestre '},
        {value:3, label:' Annuel '},

    ]

    useEffect(()=> {
        setOpPeriode(tabPeriode);

        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }

        getEtabListClasses();

        setGridMeeting(conseil_data);
        
        
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

    const getProfPrincipal=(classeId, setabId)=>{
        /*axiosInstance.post(`get-profPrincipal/`, {
            id_classe : classeId,
            id_sousetab:setabId,
                        
        }).then((res)=>{
            console.log(res.data);

            CURRENT_PROF_PP_ID = res.data.id ;
            CURRENT_PROF_PP_LABEL = res.data.label
            
        })*/     

        CURRENT_PROF_PP_ID = 12 ;
        CURRENT_PROF_PP_LABEL = 'MBAMI Thomas'
    }

   

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
            listElt.redouble = (elt.redouble == false) ? (i18n.language=='fr') ? "Nouveau" : "Non repeating" : (i18n.language=='fr') ? "Redoublant" :"Repeating";

            listElt.nom_parent = (elt.nom_pere.length>0) ? elt.nom_pere:elt.nom_mere ;
            listElt.tel_parent = (elt.nom_pere.length>0) ? elt.tel_pere : elt.tel_mere;    
            listElt.email_parent = (elt.nom_pere.length>0) ? elt.email_pere : elt.email_mere;

            
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
            getProfPrincipal(currentAppContext.currentEtab, CURRENT_CLASSE_ID); 
            console.log(CURRENT_CLASSE_LABEL)          
        }else{
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setGridRows([]);
            setIsValid(false);
        }
    }

/*************************** DataGrid Declaration ***************************/ 

const conseil_data =[
    {id:1, date:'12/05/2023', heure:'4eA1', objetId:1, objetLabel:'Bilan sequentiel', responsableId:1, responsableLabel:'Mr MBALLA Alfred', profPrincipalLabel:'Mr MBARGA Alphonse',     etat:0,  etatLabel:  'En cours' },
    {id:2, date:'18/05/2023', heure:'4eA1', objetId:1, objetLabel:'Bilan sequentiel', responsableId:2, responsableLabel:'Mr TOWA Luc', profPrincipalLabel:'Mr MBARGA Alphonse',          etat:0,  etatLabel:  'En cours' },
    {id:3, date:'02/05/2023', heure:'4eA1', objetId:1, objetLabel:'Bilan sequentiel', responsableId:3, responsableLabel:'Mr OBATE Simplice', profPrincipalLabel:'Mr MBARGA Alphonse',    etat:0,  etatLabel:  'En cours' },
    {id:4, date:'17/05/2023', heure:'4eA1', objetId:1, objetLabel:'Bilan sequentiel', responsableId:4, responsableLabel:'Mr TSALA Pascal', profPrincipalLabel:'Mr MBARGA Alphonse',      etat:1,  etatLabel:  'Cloture'  },
    {id:5, date:'03/05/2023', heure:'4eA1', objetId:1, objetLabel:'Bilan sequentiel', responsableId:5, responsableLabel:'Mr TCHIALEU Hugues', profPrincipalLabel:'Mr MBARGA Alphonse',   etat:1,  etatLabel:  'Cloture'  }
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
        field: 'responsableLabel',
        headerName: 'NOM(S) ET PRENOM(S)',
        width: 250,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'heure',
        headerName: 'CLASSE',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field: 'etatLabel',
        headerName: 'PERIODE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'objetId',
        headerName: 'ABSENCES',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },    

    {
        field: 'responsableId',
        headerName: 'CONSIGNES',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'etat',
        headerName: 'EXCLUSION',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
  
    {
        field: 'profPrincipalLabel',
        headerName: 'AUTRE PUNITION',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: '',
        headerName: '',
        width: 150,
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
            field: 'responsableLabel',
            headerName: 'NAME(S) AND SURNAME(S)',
            width: 250,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'heure',
            headerName: 'CLASS',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },   
        
        {
            field: 'etatLabel',
            headerName: 'PERIOD',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
       

        {
            field: 'objetId',
            headerName: 'ABSENCES',
            width: 80,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'responsableId',
            headerName: 'LABOUR PUNITION',
            width: 80,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'etat',
            headerName: 'EXCLUSION',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

    
        {
            field: 'profPrincipalLabel',
            headerName: 'OTHER PUNITION',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        
    
        {
            field: '',
            headerName: '',
            width: 150,
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
        inputs[4]= row.objetId;

        inputs[5]= row.autreObjet;
        inputs[6]= row.decision;
        inputs[7]= row.note_passage;

        inputs[8] = row.note_exclusion;
        inputs[9] = row.etat;
        /*inputs[10]= row.tel_mere;

        inputs[11]= row.id;

        inputs[12]=(row.sexe=='masculin'||row.sexe=='M')?'M':'F';
        inputs[13]= (row.redouble=='Redoublant')? 'O': 'N';

        inputs[14]= row.date_entree;*/

        
        currentUiContext.setFormInputs(inputs);
        console.log("laligne",row, currentUiContext.formInputs);
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

    function addClassMeeting(meeting) {       
        console.log('Ajout',meeting);
        conseil_data.push(meeting);
        setGridMeeting(conseil_data);
           
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
                msgType:"info", 
                msgTitle:t("success_modif"), 
                message:t("success_modif_M")
            })
        })  */    
    }
    
    function modifyClassMeeting(meeting) {
        console.log('Modif',meeting);
     
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
                msgType:"info", 
                msgTitle:t("success_modif_M"), 
                message:t("success_modif")
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

    
    const closePreview =(e)=>{
        setModalOpen(0);
    }

    function dropDownPeriodHandler(e){

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
            {(modalOpen==4) &&  <PDFTemplate previewCloseHandler={closePreview}><PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}><StudentListTemplate pageSet={ElevePageSet}/></PDFViewer></PDFTemplate>} 
            {(modalOpen >0 && modalOpen<4) && <FicheDisciplinaire currentPpId={CURRENT_PROF_PP_ID} currentPpLabel={CURRENT_PROF_PP_LABEL} currentClasseLabel={'6eA'} currentClasseId={2} formMode= {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  actionHandler={(modalOpen==1) ? addClassMeeting : modifyClassMeeting} cancelHandler={quitForm} />}
            
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
                    <div className={classes.gridTitle} style={{width:"72vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('class_disciplinary_sit_M')}  :
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

                        <div className={classes.gridTitleText} style={{marginLeft:'3vw'}}>
                            {t('period_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select onChange={dropDownPeriodHandler} id='selectPeriod1' className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optPeriode||[]).map((option)=> {
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
                            //rows={gridRows}
                            rows={gridMeeting}
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                            getCellClassName={(params) => (params.field==='responsableLabel')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default Studentprofile;