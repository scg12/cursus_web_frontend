import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFTemplate from '../reports/PDFTemplate';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import MsgBox from '../../../msgBox/MsgBox';
import AddStudent from "../modals/AddStudent";
import ImportExportData from '../modals/ImportExportData';
import ImportWizard from '../modals/ImportWizard';
import ListNotesEleves from "../reports/ListNotesEleves";
import BackDrop from "../../../backDrop/BackDrop";
import LoadingView from '../../../loadingView/LoadingView';
import {isMobile} from 'react-device-detect';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, ajouteZeroAuCasOu, getTodayDate,darkGrey} from '../../../../store/SharedData/UtilFonctions';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";



let CURRENT_CLASSE_ID;
let CURRENT_COURS_ID;
let CURRENT_SEQUENCE_ID;
let CURRENT_COURS_COEF;
let CURRENT_COURS_GROUPE;
var CURRENT_CLASSE_LABEL;
var CURRENT_COURS_LABEL;
var NOTES_CHANGED_IDS =[];
var NOTES_CHANGES;
var printedETFileName='';
var TAILLE_GRILLE = 0;

var listElt ={
    rang:1, 
    presence:1, 
    matricule:"", 
    nom: '', 
    date_naissance: '', 
    lieu_naissance:'', 
    date_entree:'', 
    nom_pere: '',  
    redouble: '',  
    id:1,
}

var listEleves;
var listNotes;
var supA10 = 0;
var infA10 = 0;
var nonSaisi =0;

var chosenMsgBox;
const MSG_SUCCESS_NOTES        =11;
const MSG_WARNING_NOTES        =12;
const MSG_ERROR_NOTES          =13;
const MSG_WARNING_NOTES_IMPORT =14;
const MSG_WARNING_NOTES_EXPORT =15;
const ROWS_PER_PAGE= 40;
var ElevePageSet=[];
var gridData;



function SaveNotes(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid]              = useState(false);
    const [gridRows, setGridRows]            = useState([]);
    const [dataSaved, setDataSaved]          = useState(false);
    const [superieurA10, setSuperieurA10]    = useState(0);
    const [inferieureA10, setInferieureA10]  = useState(0);
    const [notesNonSaisie, setNotesNonSaisie]= useState(0);
    const [isDataImport, setIsDataImport]    = useState(true);
    const [modalOpen, setModalOpen]          = useState(0); //0 = close, 1=creation, 2=modif
    const [optClasse, setOpClasse]           = useState([]);
    const [optCours, setOpCours]             = useState([]);
    const [optPeriode, setOptPeriode]        = useState([]);
    const [imageUrl, setImageUrl]            = useState('');
    const [importedData, setImportedData]    = useState([]);
    const [exportData, setExportData]        = useState([]);
    const [exportTemplate, setExportTemplate]= useState([]);

    var EXPORT_TEMPLATE = [];
    

    useEffect(()=> {   
        NOTES_CHANGED_IDS =[];     
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
        getCoursClasse(currentAppContext.currentEtab, 0);
        getActivatedEvalPeriods(0);
        // ici on va activer ca lorsqu'on va charger le notes precedentes
        // setSuperieurA10(nbreSup10);
        // setInferieureA10(nbreInf10)
    },[]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;

    const getEtabListClasses=()=>{
        var tempTable=[{value: '0',      label:'Choisir une classe'    }];
        let classes_user;
        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);

            classes_user = currentAppContext.infoUser.prof_classes;
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
        //         console.log(res.data);
        //         res.data.map((classe)=>{
        //         tempTable.push({value:classe.id, label:classe.libelle})
        //         setOpClasse(tempTable);
        //     })         
        // }) 
    }

    const  getClassStudentList=(classId)=>{
        listEleves= [];
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log("eleves notes",res.data);

            listEleves        = [...formatList(res.data)];  

            EXPORT_TEMPLATE   = [...createExportTemplate(res.data)];  
            setExportTemplate(EXPORT_TEMPLATE);

            TAILLE_GRILLE = listEleves.length;

            console.log("template",EXPORT_TEMPLATE);
            setGridRows(listEleves);            
            calculTendance();  
           
        })  
        return listEleves;     
    }


    const createExportTemplate=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt           = {};
            listElt.rang      = ajouteZeroAuCasOu(rang);  
            listElt.matricule = elt.matricule;
            listElt.nom       = elt.nom ;   
            listElt.prenom    = elt.prenom;
            listElt.note      = '0'; 
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
            listElt.rang      = ajouteZeroAuCasOu(rang);
            listElt.matricule = elt.matricule;
            listElt.nom       = elt.nom +' '+elt.prenom;                      
            listElt.note      = elt.note; 
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.nom  = elt.nom +' '+elt.prenom;
            listElt.rang = ajouteZeroAuCasOu(rang);            
            listElt.matricule = elt.matricule;
            listElt.note = '00'; 
            listElt.deja_saisi = -1;
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    const  getClassStudentListWithNotes=(coursId, sequenceId)=>{        
        var listElevesExport = [];   
        listNotes            = [];      
        axiosInstance.post(`eleves-notes-cours-sequence/`, {
            id_cours: coursId,
            id_sequence:sequenceId
        }).then((res)=>{
            listNotes = [...res.data];
            console.log("LES NOTES",listNotes);
            updateStudentsNote(listNotes);   
            listElevesExport  = [...createExportList(listEleves)]; 
            setExportData(listElevesExport);     
        })  
    }

    function updateStudentsNote(notes){
        if(listEleves.length>0){
            listEleves.map((elev)=>{
                elev.note = '00';
                elev.deja_saisi = -1
            });          
        }  else {setGridRows([]); return 0;}

        if(notes.length>0){
            notes.map((ntElv)=>{
                var currentElev = listEleves.find((elev)=>elev.id == ntElv.eleves[0]);
                currentElev.note = ntElv.score;
                //   currentElev.deja_saisi = 1;
                ntElv.deja_saisi == 1 ?  currentElev.deja_saisi = 1 : currentElev.deja_saisi = -1;
               //currentElev.deja_saisi == 1? ntElv.deja_saisi:-1;
            })        
        } 
        calculTendance();  
        setGridRows(listEleves);
    }

    function getNotesCoursSequence(coursId, sequenceId){
        listNotes=[]
        axiosInstance.post(`list-notes-cours-sequence/`, {
            id_cours: coursId,
            id_sequence: sequenceId
        }).then((res)=>{
            console.log("notes",res.data.notes);
            listNotes = [...res.data.notes];
        })  
   
    }

    function getCoursClasse(sousEtabId, classeId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  ----- Choisir un cours ----- ' : ' ------ Select course ------ '  }]
        var tabCours;    
       
        if(classeId!=0){
            tabCours = currentAppContext.infoUser.prof_cours.filter(cours=>cours.id_classe ==classeId)
        
                tabCours.map((cours)=>{
                tempTable.push({value:cours.id_cours, label:cours.libelle_cours, coef:cours.coef_cours, groupeId:cours.id_groupe});
                })

        }       
        
        console.log('cours',tabCours,tempTable);
        setOpCours(tempTable);
        
        if( document.getElementById('optCours').options[0]!= undefined)
        document.getElementById('optCours').options[0].selected=true;     
    }

    function getActivatedEvalPeriods(coursId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  - Choisir une periode - ' : ' - Select period - '  }]
        var tabSequences;  

        if(coursId!=0){
            axiosInstance.post(`list-sequences/`, {
                id_sousetab: currentAppContext.currentEtab,
                id_trimestre:""
            }).then((res)=>{   
                
                tabSequences = [...res.data.sequences];    
                     
                res.data.sequences.map((seq)=>{
                    if(seq.is_active == true){
                        tempTable.push({value:seq.id, label:seq.libelle});
                    }                              
                })
    
                setOptPeriode(tempTable); 
    
                if(tabSequences.length==0){
                    chosenMsgBox = MSG_WARNING_NOTES;
                    currentUiContext.showMsgBox({
                        visible:true, 
                        msgType:"info", 
                        msgTitle:t("error_M"), 
                        message:t("no_activated_period")
                    })         
                }
            })

        } else {
            setOptPeriode(tempTable); 
        }            
        //setGridRows([]);
        if( document.getElementById('optPeriode').options[0]!= undefined)
        document.getElementById('optPeriode').options[0].selected=true;
    }

    function classeChangeHandler(e){       
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value;
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            
            getClassStudentList(CURRENT_CLASSE_ID)
            getCoursClasse(currentAppContext.currentEtab, CURRENT_CLASSE_ID);
            getActivatedEvalPeriods(-1);           
        }else{
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL =undefined;
            setGridRows([]);
            getCoursClasse(currentAppContext.currentEtab, 0);
            getActivatedEvalPeriods(0);
            setIsValid(false);
            setSuperieurA10(0);
            setInferieureA10(0);
            setNotesNonSaisie(0);
        }
       
    }

   
    function coursChangeHandler(e){       
        if(e.target.value != optCours[0].value){
            CURRENT_COURS_ID = e.target.value;
            
            var index = optCours.findIndex((op)=>op.value ==CURRENT_COURS_ID)
            CURRENT_COURS_LABEL = optCours[index].label;

            CURRENT_COURS_COEF = e.target[index].id.split('_')[0];
            CURRENT_COURS_GROUPE = e.target[index].id.split('_')[2];
            console.log("groupe",CURRENT_COURS_GROUPE, parseInt(CURRENT_COURS_GROUPE));
            
            getActivatedEvalPeriods(CURRENT_COURS_ID);  
            updateStudentsNote([]);          
            
        } else {
            CURRENT_COURS_ID = undefined;
            CURRENT_COURS_COEF = undefined;
            CURRENT_COURS_GROUPE = undefined;
            CURRENT_COURS_LABEL = undefined;
            //document.getElementById('optClasse').options[0].selected=true;
            updateStudentsNote([]);
            getActivatedEvalPeriods(0);
        }
    }

    function periodeChangeHandler(e){
        if(e.target.value != optPeriode[0].value){
            CURRENT_SEQUENCE_ID = e.target.value;
            getClassStudentListWithNotes(CURRENT_COURS_ID,CURRENT_SEQUENCE_ID);   
            setIsValid(true);
            //On pourra mettre les >10 et <10
            /*setSuperieurA10(presents);
            setInferieureA10(absents); */ 
        } else {
            CURRENT_SEQUENCE_ID = undefined;
            updateStudentsNote([]); 
            setIsValid(false);
          
        }
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
    
/*************************** Handler functions ***************************/
    function quitForm() {
        setModalOpen(0)
    }


    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);
                setGridRows([]);
                // setSuperieurA10(0);
                // setInferieureA10(0);
                return 1;
            }

            case MSG_WARNING_NOTES_IMPORT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //setModalOpen(0); 
                setModalOpen(2); 
                setIsDataImport(true); 
                currentUiContext.setFormInputs([]);
                return 1;
            }


            case MSG_WARNING_NOTES_EXPORT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // setModalOpen(0); 
                setModalOpen(2); 
                setIsDataImport(false); 
                currentUiContext.setFormInputs([]);
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

            case MSG_SUCCESS_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_NOTES :{
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }


            case MSG_WARNING_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);
                setGridRows([]);
                // setSuperieurA10(0);
                // setInferieureA10(0);
                return 1;
            }

            case MSG_WARNING_NOTES_IMPORT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })
                return 1;
            }

            case MSG_WARNING_NOTES_EXPORT: {
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
               // currentUiContext.setIsParentMsgBox(true);
            }
        }
        
    }

    function saveNotesHandler(e){
        var notes=[];       
        setModalOpen(4);
        listEleves.map((eleve)=>{
            if(NOTES_CHANGED_IDS.includes(eleve.id)) {
                notes.push(eleve.note);
            }
            console.log("notes et ids",notes, NOTES_CHANGED_IDS);
        });
        axiosInstance.post(`save-classe-note/`, {
            id_classe   : CURRENT_CLASSE_ID,
            id_cours    : CURRENT_COURS_ID,
            id_groupe   : CURRENT_COURS_GROUPE, 
            id_sequence : CURRENT_SEQUENCE_ID,
            coef        : CURRENT_COURS_COEF,
            notes       : notes.join('_'),
            elevesIds   : NOTES_CHANGED_IDS.join('_'),
            id_sousetab : currentAppContext.currentEtab,
            id_user     : currentAppContext.idUser

        }).then((res)=>{
            NOTES_CHANGED_IDS=[];
            getClassStudentListWithNotes(CURRENT_COURS_ID,CURRENT_SEQUENCE_ID);
            setModalOpen(0);
            setDataSaved(true);
            console.log(res.data);
            
            chosenMsgBox = MSG_SUCCESS_NOTES;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_operation_M"), 
                message:t("success_operation")
            })   
        })  

    }

    function updateNoteColor(e){
        console.log(e)
        var note = e.target.value;
        var idnote = e.target.id;
        var NoteDiv = "div"+e.target.id;
        var index = listEleves.findIndex((eleve)=>eleve.id==idnote)
        if(note < 0 || note > props.noteMax || isNaN(note)){
            document.getElementById(NoteDiv).style.backgroundColor='red';
            //document.getElementById(idnote).value = 'ERR';
            document.getElementById(idnote).style.color='white';
            listEleves[index].note = 0;
            
        } else {
            
            listEleves[index].deja_saisi = 0;
            document.getElementById(NoteDiv).style.backgroundColor='#dcd05c94';
            
            
            var id_note = NOTES_CHANGED_IDS.find((noteId)=>noteId==listEleves[index].id)

            if(id_note == -1 || id_note == undefined){
                NOTES_CHANGED_IDS.push(listEleves[index].id);
            }
            
            listEleves[index].note = note
            document.getElementById(idnote).value = note;
        }
        setGridRows(listEleves);
    }

    function calculTendance(){
        var supA10, infA10, nonSaisi;
        supA10 = 0; infA10 = 0; nonSaisi = 0;
        listEleves.map((eleve)=>{
            (eleve.deja_saisi<=0) ? nonSaisi++ : (eleve.note>=10) ? supA10++:infA10++
        })          
        setSuperieurA10(supA10); setInferieureA10(infA10); setNotesNonSaisie(nonSaisi);
        console.log("Apres calcul",listEleves)
    }

  

    /*************************** DataGrid Declaration ***************************/    
    const columns = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'deja_saisi',
            headerName: '',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'note',
            headerName: t('note_M')+'/'+props.noteMax,
            width: 80,
           // editable: (props.formMode!='consult')? true : false,
            headerClassName: classes.GridColumnStyle,  
           renderCell: (params)=>{
            return(
                // <div id={"div"+params.row.id} style={{display:"flex", flexDirection:"row",  justifyContent:"center", alignItems:'center', width:"60vw", height:"2vw", borderRadius:'3px', borderStyle:"solid", borderWidth:"1px", marginTop:"1vh", marginBottom:'1vh', borderColor:'#065386', backgroundColor:params.row.deja_saisi==-1 ? "#ec151080" : params.row.deja_saisi==0 ? "#dcd05c94":null}}>
                <div id={"div"+params.row.id} style={{display:"flex", flexDirection:"row",  justifyContent:"center", alignItems:'center', width:"60vw", height:"2vw", borderRadius:'3px', borderStyle:"solid", borderWidth:"1px", marginTop:"1vh", marginBottom:'1vh', borderColor:'#065386', backgroundColor:params.row.deja_saisi==-1||params.row.deja_saisi=== false ? "#ec151080" : params.row.deja_saisi==1 ? null:"#dcd05c94"}}>
                    <input type='text' id={params.row.id} onChange={updateNoteColor}   defaultValue={params.row.note} style={{textAlign:'center', fontSize:'0.9vw', color:params.row.note >=10? 'black':'red'}}/>
                </div>
            )}                     
        },
            
    ];

    const closePreview =()=>{
        setIsValid(false);                 
        setModalOpen(0);
    }

    const printStudentNotesList=()=>{
        if(CURRENT_CLASSE_ID != undefined){
            var PRINTING_DATA ={
                // dateText:'Yaounde, ' + t('le')+' '+ getTodayDate(),
                // leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                // centerHeaders:["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
                // rightHeaders:["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
                // pageImages:["images/collegeVogt.png"],
                // pageTitle: "Notes du cours " + CURRENT_COURS_LABEL,
                // tableHeaderModel:["N°","Matricule", "Nom et prenom(s)", "Note"],
                // tableData :[...gridRows],
                // numberEltPerPage:ROWS_PER_PAGE  

                leftHeaders      : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders    : [currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+'  Telephone:'+ currentAppContext.currentEtabInfos.tel],
                rightHeaders     : ["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", t("annee_scolaire")+' '+ currentAppContext.activatedYear.libelle],
                pageImages       : [imgUrl], 
                pageImagesDefault: [imgUrlDefault],
                pageTitle        : t("student_marks_for_course") + ' ' + CURRENT_COURS_LABEL + ', ' + t('class') + ' : ' + CURRENT_CLASSE_LABEL,
                tableHeaderModel : ["N°",t("matricule_short"), t("displayedName_M"), t("note")],
                tableData        : [...gridRows],
                numberEltPerPage : ROWS_PER_PAGE
            };
            printedETFileName = 'Notes_' + CURRENT_COURS_LABEL +'('+ CURRENT_CLASSE_LABEL+').pdf';
            setModalOpen(5);
            ElevePageSet=[];
            //ElevePageSet = [...splitArray([...gridRows], "Liste des eleves de la classe de " + CURRENT_CLASSE_LABEL, ROWS_PER_PAGE)];          
            ElevePageSet = createPrintingPages(PRINTING_DATA,i18n.language);
            console.log("ici la",ElevePageSet,gridRows);                    
        } else{
            chosenMsgBox = MSG_WARNING_NOTES;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "warning", 
                msgTitle : t("warning_M"), 
                message  : t("must_select_class")
            })            
        }      
    }

    function importHandler(){
        if(notesNonSaisie!=0){
            chosenMsgBox = MSG_WARNING_NOTES_IMPORT;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("warning_M"), 
                message:t("already_some_marks")
            });
        } else {
            setModalOpen(2); 
            setIsDataImport(true); 
            currentUiContext.setFormInputs([]);
        }        
    }


    function exportHandler(){
        if(notesNonSaisie >0 && gridRows.length>0){
            chosenMsgBox = MSG_WARNING_NOTES_EXPORT;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("warning_M"), 
                message:t("not_all_mark_have_been_typed")
            });
        } else {
            setModalOpen(2); 
            setIsDataImport(false); 
            currentUiContext.setFormInputs([]);
        }
    }


    
    function handleImport(importedData){
        console.log("donnees importees", importedData);
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


        if(eleve.matricule == undefined || eleve.matricule.length == 0){
            errorMsg= t('row')+ ' '+ row +': '+ t('enter_student_matricule'); 
            return errorMsg;
        }

        if (eleve.note == undefined || eleve.note.length == 0 || (eleve.note != undefined && eleve.note < 0) || (eleve.note != undefined && eleve.note >= 20)) {
            errorMsg=  t('row')+ ' '+ row +': '+ t('enter_correct_note'); 
            return errorMsg;
        }

       

        return errorMsg;    
    }


    function insertImportedData(eleve){
        //gridData  = [...gridRows];
        var index = listEleves.findIndex((elv)=>elv.matricule==eleve.matricule);
        listEleves[index].note        = eleve.note;
        listEleves[index].deja_saisi  = 0;
        // gridData[index].note          = eleve.note;
        // gridData[index].deja_saisi    = 0;
        NOTES_CHANGED_IDS.push(listEleves[index].id)
        setGridRows(listEleves);
      
    }

    function refreshGrid(){
        setGridRows(gridData);
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
            {(modalOpen==3) && <BackDrop/>}
            {(modalOpen==3) && <AddStudent formMode='consult' cancelHandler={quitForm} />}
            
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

            
            {(modalOpen==5) && <BackDrop/>}
            {(modalOpen==5) &&              
                <PDFTemplate previewCloseHandler={closePreview}>
                    {isMobile?
                        <PDFDownloadLink  document ={<ListNotesEleves pageSet={ElevePageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <ListNotesEleves pageSet={ElevePageSet}/>
                        </PDFViewer>
                    }
                </PDFTemplate>
            } 
            
           
            {(modalOpen==4) && <BackDrop/>}
            {(modalOpen==4) && <LoadingView loadinText={t('traitement')} loadingTextStyle={{color:"white"}}/>}

            <div className={classes.inputRow}>  
                { (props.formMode!='consult')?  
                    <div className={classes.formTitle}>
                        {t('saisie_note_eval_M')}  
                    </div>   
                    :      
                    <div className={classes.formTitle}>
                        {t('look_note_eval_M')}  
                    </div>   
                }             
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

                    <div className={classes.gridTitle} style={{marginLeft:"-5.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('course_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optCours' onChange={coursChangeHandler} className={classes.comboBoxStyle} style={{width:'13.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optCours||[]).map((option)=> {
                                    return(
                                        <option id={option.coef+'_'+option.value+'_'+option.groupeId} value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>

                    <div className={classes.gridTitle} style={{marginLeft:"-3.3vw",}}>                  
                        <div className={classes.gridTitleText}>
                            {t('sequence_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optPeriode' onChange={periodeChangeHandler} className={classes.comboBoxStyle} style={{width:'13.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optPeriode||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>
                   
                                
                    <div className={classes.gridAction}> 
                    {(props.formMode!='consult')&&
                        <CustomButton
                            btnText={t('save')}
                            hasIconImg= {true}
                            imgSrc='images/saveToDisk_trans.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={saveNotesHandler}
                            disable={(isValid==false)}   
                        />
                    }
                         

                        <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printStudentNotesList}
                            disable={(isValid==false)}   
                        />

                    </div>
                        
                </div>
                    
                

               
                <div className={classes.gridDisplay} >
                    <StripedDataGrid
                        rows={gridRows}
                        columns={columns}
                        getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : (params.field==='note')?  params.value < (props.noteMax/2) ? classes.gridNoteRedRowStyle : classes.gridNoteRowStyle : classes.gridRowStyle }
                        
                        onCellClick={(params,event)=>{
                            if(event.ignore) {
                                //console.log(params.row);
                                //handlePresence(params.row)
                            }
                        }}  
                        
                        /* onRowDoubleClick ={(params, event) => {
                            if(!event.ignore){
                                event.defaultMuiPrevented = true;
                                consultRowData(params.row);
                            }
                        }}*/
                        
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

                {(modalOpen==2) &&    
                    <ImportExportData       
                        isImport       = {isDataImport}                      
                        titleText      = {isDataImport? t('marks_import'):t('marks_export')}
                        exportFileName = {"export_notes_"+CURRENT_CLASSE_LABEL}
                        tempFileName   = {"notes_template_"+CURRENT_CLASSE_LABEL}
                        classeLabel    = {CURRENT_CLASSE_LABEL}
                        actionHandler  = {(isDataImport)  ? handleImport    : null} 
                        dataToExport   = {(!isDataImport) ? exportData      : null}
                        importTemplate = {(isDataImport)  ? exportTemplate  : null}
                        cancelHandler  = {quitForm} 
                    />
                }

                
                {(modalOpen==6) &&    
                    <ImportWizard       
                        ImportedData      = {importedData}  
                        dataCheckFunction = {checkImportedData} 
                        insertFunction    = {insertImportedData}
                        // updateGridFct     = {refreshGrid}
                        cancelHandler     = {quitForm} 
                    />
                }
                  
            </div>

            { 
                <div className={classes.infoPresence}>
                    <div className={classes.presentZone}>
                        <div> ({t('notes')+' >= 10'}) : </div>
                        <div> {superieurA10} </div>
                    </div>

                    <div className={classes.absentZone}>
                        <div> ({t('notes')+' < 10'}) : </div>
                        <div> {inferieureA10} </div>
                    </div>

                    <div className={classes.nonSaisiZone}>
                        <div> ({t('non_saisi')}) : </div>
                        <div> {notesNonSaisie} </div>
                    </div>

                    <div style={{marginLeft:"2vw", display:"flex", flexDirection:"row"}}>
                        <CustomButton
                            btnText={t('import_notes')}
                            hasIconImg= {true}
                            imgSrc='images/import.png'
                            imgStyle = {classes.grdBtnImgStyle} 
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            style={{width:"10vw"}}
                            btnClickHandler={importHandler}
                            disable={(isValid==false)}    
                        />

                        <CustomButton
                            btnText={t('export_notes')}
                            hasIconImg= {true}
                            imgSrc='images/export.png'
                            imgStyle = {classes.grdBtnImgStyleP3} 
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            style={{width:"10vw"}}
                            btnClickHandler={exportHandler}
                            disable={(isValid==false)||(notesNonSaisie==TAILLE_GRILLE)}    
                        />

                    </div>



                </div>
            }
          
        </div>
        
    );
} 
export default SaveNotes;