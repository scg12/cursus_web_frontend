import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddClassMeeting from "../modals/AddClassMeeting";
import LoadingView from '../../../loadingView/LoadingView';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, ajouteZeroAuCasOu, darkGrey, getTodayDate} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import {isMobile} from 'react-device-detect';
import PDFTemplate from '../reports/PDFTemplate';
import StudentList from '../reports/StudentList';
import PVCCMeeting from '../reports/PVCCMeeting';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";

var CURRENT_MEETING = {};
let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;

let CURRENT_PROF_PP_ID;
let CURRENT_PROF_PP_USERID;
let CURRENT_PROF_PP_LABEL;

var printedETFileName    ='';
var SEQUENCES_DISPO      =[];
var TRIMESTRES_DISPO     =[];
var ANNEE_DISPO          =[];

var DEFAULT_MEMBERS      =[]; 
var OTHER_MEMBERS        =[];
var PRESENTS_MEMBERS     =[];

var DEFAULT_MEMBERS_ADD  =[]; 
var PRESENTS_MEMBERS_ADD =[];
var OTHER_MEMBERS_ADD    =[];

var INFO_ELEVES          =[];
var LIST_NEXT_CLASSES    ='';

var LIST_CONSEILS_INFOS    =[];
var LIST_ELEVES            =[];
var CURRENT_ANNEE_SCOLAIRE ='';

var CCA_CREATED = false;



var listElt ={};

var MEETING ={};

var pageSet =[];

var page = {
    pageTitle:'',
    pageRows:[],
    pageNumber:0,
}

var chosenMsgBox;
const MSG_SUCCESS_CREATE       = 1;
const MSG_SUCCESS_UPDATE       = 2;
const MSG_SUCCESS_UPDATE_PRINT = 3;
const MSG_WARNING              = 4;
const MSG_CONFIRM              = 5;

const ROWS_PER_PAGE            = 40;
const FIRST_PAGE_ROWS_COUNT    = 20;

var CCPageSet=[];


function ConseilClasse(props) {
    const { t, i18n }                   = useTranslation();
    const currentUiContext              = useContext(UiContext);
    const currentAppContext             = useContext(AppContext);

    const [isValid, setIsValid]         = useState(false);
    const [gridMeeting, setGridMeeting] = useState([]);
    const [modalOpen, setModalOpen]     = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse]      = useState([]);
    const [isLoading, setIsloading]     = useState(false);
    const[LoadingVisible,setLoadingVisible] = useState(false);
    const[imageUrl, setImageUrl]        = useState('');
    const selectedTheme                 = currentUiContext.theme;

    useEffect(()=> {
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        if(gridMeeting.length==0)  CURRENT_CLASSE_ID = undefined;
       
        var cnv = document.getElementById('output');
        while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
        var cnx = cnv.getContext('2d');
        var url = darkGrey(document.getElementById("logo_url").value,cnv,cnx);
        setImageUrl(url);

        getEtabListClasses();
    },[]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;

  
    function getClassMeetingData(classId){
        var listConseils = []; CCA_CREATED = false;
        setModalOpen(5);
        axiosInstance.post(`list-conseil-classes/`, {
            id_classe: classId,
            id_sousetab: currentAppContext.currentEtab
        }).then((res)=>{
            console.log("donnees",res.data);
            if(res.data!= undefined && res.data!=null){
                LIST_CONSEILS_INFOS = [...res.data.conseil_classes];

                CURRENT_PROF_PP_ID      = res.data.prof_principal.id;
                CURRENT_PROF_PP_USERID  = res.data.prof_principal.user_id;
                CURRENT_PROF_PP_LABEL   = res.data.prof_principal.nom;
                
                DEFAULT_MEMBERS_ADD  = [...res.data.enseignants_classe];
                OTHER_MEMBERS_ADD    = [...res.data.autres_enseignants];
                PRESENTS_MEMBERS_ADD = [...res.data.enseignants_classe];

                SEQUENCES_DISPO   =  createLabelValueTableDejaTenu(res.data.seqs_dispo);
                TRIMESTRES_DISPO  =  createLabelValueTableDejaTenu(res.data.trims_dispo);
                
                ANNEE_DISPO       = [{value:-1,label:t("annee")+' '+CURRENT_ANNEE_SCOLAIRE}];

                listConseils = [...formatList(res.data.conseil_classes,res.data.prof_principal,res.data.seqs_dispo, res.data.trims_dispo)]
                console.log(listConseils);                
            }

            axiosInstance.post(`get-classes-prochaines/`, {
                id_classe: classId,
            }).then((res)=>{

                console.log("classes prochaines",res.data);
                LIST_NEXT_CLASSES = createLabelValueTable(res.data.next_classes);

                axiosInstance.post(`list-eleves/`, {
                    id_classe: classId,
                }).then((res)=>{
                    console.log(res.data);
                    LIST_ELEVES = [...getElevesTab(res.data)];
                   
                   
                    setGridMeeting(listConseils);
                    console.log(gridMeeting);
                    
                    setIsloading(false)
                    setModalOpen(0);
                });
                
            });           
     
        });
    }


    
    const getEtabListClasses=()=>{
        var tempTable=[{value: '0',      label: (i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '  }];
        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
        console.log(classes)
        let classes_user;
        if(currentAppContext.infoUser.is_pp){
            if(currentAppContext.infoUser.is_prof_only) 
                classes_user = currentAppContext.infoUser.pp_classes;
            else{
                // On verifie que admin_classes inclut pp_classes sinon on lui ajoute pp_classes
                classes_user = currentAppContext.infoUser.admin_classes;
                let pp_classes = currentAppContext.infoUser.pp_classes;
                // console.log(pp_classes)
                pp_classes.forEach(classe => {
                    if((classes_user.filter( cl => cl.id === classe.id)).length<=0)
                        classes_user.push({"id":classe.id,"libelle":classe.libelle})

                });
            }
        }
        else{
            classes_user = currentAppContext.infoUser.admin_classes;
        }
            
        classes_user.forEach(classe => {
        console.log(classe.id);
        if((classes.filter( cl => cl.id_classe === classe.id)).length>0){
            // classes_user.push({"id":classe.id,"libelle":classe.libelle})
            tempTable.push({value:classe.id, label:classe.libelle})
        }

        });
           
        setOpClasse(tempTable);
        // axiosInstance.post(`list-classes/`, {
        //     id_sousetab: currentAppContext.currentEtab,
        // }).then((res)=>{
        //         console.log(res.data);
        //         res.data.map((classe)=>{
        //         tempTable.push({value:classe.id, label:classe.libelle})
        //         setOpClasse(tempTable);
        //         console.log(tempTable);
        //    })         
        // }) 
    }

    const getNextClassPossibles =(classeId) =>{
        axiosInstance.post(`get-classes-prochaines/`, {
            id_classe: classeId,
        }).then((res)=>{
            console.log("classes prochaines",res.data);
            LIST_NEXT_CLASSES = createLabelValueTable(res.data.next_classes);
               
        }) 

    }

    const  getClassStudentList=(classId)=>{
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            LIST_ELEVES = [...getElevesTab(res.data)];
            
        })  
    }


    function getElevesTab(elevesTab){
        var tabEleves = [{value:0,label:"- Choisir un eleve -"}]
        var new_eleve;
        elevesTab.map((eleve)=>{
            new_eleve = {};
            new_eleve.value = eleve.id;
            new_eleve.label = eleve.nom +' '+eleve.prenom;
            tabEleves.push(new_eleve);       
        })
        return tabEleves;
    }

    const getListConseilClasse =(classeId,sousEtabId)=>{
        var listConseils = []; CCA_CREATED = false;
        axiosInstance.post(`list-conseil-classes/`, {
            id_classe: classeId,
            id_sousetab: sousEtabId
        }).then((res)=>{
            console.log("donnees",res.data);
            if(res.data!= undefined && res.data!=null){
                LIST_CONSEILS_INFOS = [...res.data.conseil_classes];

                CURRENT_PROF_PP_ID      = res.data.prof_principal.id;
                CURRENT_PROF_PP_USERID  = res.data.prof_principal.user_id;
                CURRENT_PROF_PP_LABEL   = res.data.prof_principal.nom;
                
                DEFAULT_MEMBERS_ADD  = [...res.data.enseignants_classe];
                OTHER_MEMBERS_ADD    = [...res.data.autres_enseignants];
                PRESENTS_MEMBERS_ADD = [...res.data.enseignants_classe];

                SEQUENCES_DISPO   =  createLabelValueTableDejaTenu(res.data.seqs_dispo);
                TRIMESTRES_DISPO  =  createLabelValueTableDejaTenu(res.data.trims_dispo);
                
                ANNEE_DISPO       = [{value:-1,label:t("annee")+' '+CURRENT_ANNEE_SCOLAIRE}];

                listConseils = [...formatList(res.data.conseil_classes,res.data.prof_principal,res.data.seqs_dispo, res.data.trims_dispo)]
                console.log(listConseils);                
            }
     
            setGridMeeting(listConseils);
            console.log(gridMeeting);
            
           // setIsloading(false);
        })  
    }


    function formatList(listConseil,ProfInfo,seqInfos,trimInfos){
        var rang = 1;
        var formattedList =[]
        listConseil.map((elt)=>{
            listElt={};
            listElt.id              = elt.id;
            listElt.date_prevue     = elt.date_prevue;
            listElt.heure_prevue    = elt.heure_prevue;
            listElt.type_conseil    = elt.type_conseil;
            listElt.id_type_conseil = elt.id_type_conseil;
            listElt.nom             = (ProfInfo!= undefined && ProfInfo!= {})?  ProfInfo.nom : t("non_defini");
            listElt.user_id         = ProfInfo.user_id;
            listElt.rang            = ajouteZeroAuCasOu(rang); 
            listElt.status          = elt.status; 
            listElt.resume_general_decisions = elt.resume_general_decisions;
            listElt.periodeId       = elt.id_type_conseil;
            listElt.periode         = getPeriodeLabel(elt.type_conseil, listElt.periodeId, seqInfos, trimInfos);
            listElt.etatLabel       = (elt.status == 0) ? t('en_cours') :t('cloture');
            listElt.date_effective  = (elt.status == 1) ? elt.date_effective : "";      
            formattedList.push(listElt);            
            rang ++;
        })
        return formattedList;
    }



    function createLabelValueTableDejaTenu(tab){
        var resultTab = [];
        if(tab.length>0){
            tab.map((elt)=>{
                resultTab.push({value:elt.id, label:elt.libelle, deja_tenu:elt.deja_tenu});
            })
        }
        return resultTab;
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

    
    function createLabelValueTableWithUserS(tab, present, etat){
        var resultTab = [];
        if(tab.length>0){
            tab.map((elt)=>{
                resultTab.push({value:elt.id_user, label:elt.nom, role:elt.type, present:present, etat:etat});
            })
        }
        return resultTab;
    }
    

    function getPeriodeLabel(typePeriode, idPeriode, listSequence, listTrimestres){
        var foundedPeriode={id:-1, libelle:''};     
        
        if(listSequence   == undefined) listSequence   = [];
        if(listTrimestres == undefined) listTrimestres = [];
           
        switch(typePeriode){
            case "sequentiel":{
                foundedPeriode = listSequence.find((seq)=>(seq.id==idPeriode));
                break; 
            }

            case "trimestriel":{
                foundedPeriode = listTrimestres.find((trim)=>(trim.id==idPeriode));
                break; 
            }

            case "annuel":{
                foundedPeriode = {id:-1, libelle:CURRENT_ANNEE_SCOLAIRE};
                CCA_CREATED = true;
                break; 
            }
         
        }
       
        if (foundedPeriode == undefined) return "";
        else return foundedPeriode.libelle;
    }


    function dropDownHandler(e){
        //console.log(e.target.value)
        var grdRows;
        if(e.target.value != optClasse[0].value){
            
            setIsValid(true);
            
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse.find((classe)=>(classe.value == CURRENT_CLASSE_ID)).label;
            
          
            // getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab);
            // getNextClassPossibles(CURRENT_CLASSE_ID); 
            // getClassStudentList(CURRENT_CLASSE_ID); 
            getClassMeetingData(CURRENT_CLASSE_ID)
            
              
        } else {
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setGridMeeting([]);
            setIsValid(false);
        }
    }

/*************************** DataGrid Declaration ***************************/ 
const columnsFr = [
    {
        field: 'id',
        headerName: 'ID',
        width: 20,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'rang',
        headerName: 'N°',
        width: 50,
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
        headerName: 'HEURE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'type_conseil',
        headerName: 'TYPE DE CONSEIL',
        width: 130,
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

    
 

    {
        field: 'nom',
        headerName: 'PROF PRINCIPAL',
        width: 180,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'user_id',
        headerName: 'PROF PRINCIPAL',
        width: 50,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field          : 'resume_general_decisions',
        headerName     : 'DECISION',
        width          : 50,
        editable       : false,
        hide           : true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'status',
        headerName: 'ETAT',
        width: 50,
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

    {
        field: 'Action',
        headerName: 'ACTION',
        width: 80,
        editable: false,
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
            field          :'id',
            headerName     :'ID',
            width          :50,
            hide           :true,
            editable       :false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          :'rang',
            headerName     :'N°',
            width          :50,
            editable       :false,
            headerClassName:classes.GridColumnStyle
        },
           
        {
            field          :'date_prevue',
            headerName     :'MEETING DATE',
            width          :100,
            editable       :false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          :'heure_prevue',
            headerName     :'HOUR',
            width          :100,
            editable       :false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          :'type_conseil',
            headerName     :'MEETING PURPOSE',
            width          :130,
            editable       :false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field          :'id_type_conseil',
            headerName     :'MEETING PURPOSE',
            width          :50,
            editable       :false,
            hide           :true,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field          :'periode',
            headerName     :'PERIODE',
            width          :100,
            editable       :false,
            headerClassName:classes.GridColumnStyle
        },
    
       
    
        {
            field          :'nom',
            headerName     :'HEAD TEACHER',
            width          :180,
            editable       :false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          :'user_id',
            headerName     :'PROF PRINCIPAL',
            width          :50,
            editable       :false,
            hide           :true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          :'resume_general_decisions',
            headerName     :'DECISION',
            width          :170,
            editable       :false,
            hide           :true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          :'status',
            headerName     :'STATUS',
            width          :50,
            editable       :false,
            hide           :true,
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
            field          :'date_effective',
            headerName     :'EFFECTIVE DATE',
            width          :120,
            editable       :false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'Action',
            headerName: 'ACTION',
            width: 80,
            editable: false,
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
    function setEditMeetingGlobalData(meeting){
        return new Promise(function(resolve, reject){
            DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(meeting.membres, true, 1);
            OTHER_MEMBERS     =  createLabelValueTableWithUserS(meeting.membres_a_ajouter,false, -1);
            PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(meeting.membres_presents,true, 0);
            INFO_ELEVES       =  meeting.info_eleves;
            resolve(1);
        });

    }

    function setConsultMeetingGlobalData(meeting){
        return new Promise(function(resolve, reject){
            DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(meeting.membres, true, 1);
            OTHER_MEMBERS     =  createLabelValueTableWithUserS(meeting.membres_a_ajouter,false, -1);
            PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(meeting.membres_presents,true, 1);
            INFO_ELEVES       =  meeting.info_eleves;
            resolve(1);
        });

    }

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
        var CURRENT_CC    =  LIST_CONSEILS_INFOS.find((cd)=>cd.id == row.id);
        console.log("hhhjki",CURRENT_CC.membres_presents, CURRENT_CC.info_eleves);

        setEditMeetingGlobalData(CURRENT_CC).then(()=>{
            inputs[0] = row.id;
            inputs[1] = row.date_prevue;
            inputs[2] = row.heure_prevue;
            inputs[3] = row.type_conseil;
            inputs[4] = row.id_type_conseil;
            
            inputs[5] = row.periode;
            inputs[6] = row.nom;
            inputs[7] = row.user_id;

            inputs[8]  = row.status;
            inputs[9]  = row.statusLabel;
            inputs[10] = [...INFO_ELEVES];
            inputs[11] = row.resume_general_decisions;
    
    
            currentUiContext.setFormInputs(inputs);

            console.log("laligne",row, currentUiContext.formInputs);
            setModalOpen(2);       

        });
      
        // DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(CURRENT_CC.membres, true, 1);
        // OTHER_MEMBERS     =  createLabelValueTableWithUserS(CURRENT_CC.membres_a_ajouter,false, -1);
        // PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(CURRENT_CC.membres_presents,true, 0);
        // INFO_ELEVES       =  CURRENT_CC.info_eleves;
    }

    function consultRowData(row){
        
        var inputs=[];
        var CURRENT_CC    =  LIST_CONSEILS_INFOS.find((cd)=>cd.id == row.id);
        setConsultMeetingGlobalData(CURRENT_CC).then(()=>{
            inputs[0] = row.id;
            inputs[1] = row.date_prevue;
            inputs[2] = row.heure_prevue;
            inputs[3] = row.type_conseil;
            inputs[4] = row.id_type_conseil;
            
            inputs[5] = row.periode;
            inputs[6] = row.nom;
            inputs[7] = row.user_id;
    
            inputs[8]  = row.status;
            inputs[9]  = row.statusLabel;
            inputs[10] = [...INFO_ELEVES];
            inputs[11] = row.resume_general_decisions;
    
            console.log("laligne",row, currentUiContext.formInputs);  
            currentUiContext.setFormInputs(inputs)
            setModalOpen(3);
        });
      
        // DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(CURRENT_CC.membres, true, 1);
        // OTHER_MEMBERS     =  createLabelValueTableWithUserS(CURRENT_CC.membres_a_ajouter,false, -1);
        // PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(CURRENT_CC.membres_presents,true, 0);
        // INFO_ELEVES       =  CURRENT_CC.info_eleves;
    }

    function getTypeConseil(code){
        switch(code){
            case '1': return "sequentiel" ;
            case '2': return "trimestriel" ;
            case '3': return "annuel";
        }
    }

    function getMembresId(tab){
        var tabResults = [];
        tab.map((elt)=>{
            tabResults.push(elt.value);
        })

        return tabResults.join("²²")
    }

    function getMembreRoles(tab){
        var tabResults = [];
        tab.map((elt)=>{
            tabResults.push(elt.role);
        })
        return tabResults.join("²²")
    }

    function createGridData(list){
        var listData = [];
        var listDataElt;

        if(list.length>0){
            list.map((elt)=>{
                listDataElt = {};
               
                listDataElt.id = elt.id;
                listDataElt.rang = elt.rang;
                listDataElt.date_prevue = elt.date_prevue;
                listDataElt.heure_prevue = elt.heure_prevue;
                listDataElt.type_conseil = elt.type_conseil;
                listDataElt.id_type_conseil = elt.id_type_conseil;
                listDataElt.periode = elt.periode;
                listDataElt.nom = elt.nom; 
                listDataElt.user_id = elt.user_id;
                listDataElt.status = elt.status;
                listDataElt.etatLabel = elt.etatLabel;
                listDataElt.date_effective = elt.date_effective;
                listDataElt.periode = elt.periode;
                listDataElt.periode = elt.periode;
                listDataElt.periode = elt.periode;

                listData.push(listDataElt)
            })
        }

        return listData
    }
  

    function addClassMeeting(meeting) {       
        console.log('Ajout',meeting);
        CURRENT_MEETING = meeting;
        setIsloading(true);
        axiosInstance.post(`create-conseil-classe/`, {
            id_sousetab     : meeting.id_sousetab,
            id_user         : currentAppContext.idUser,
            id_classe       : meeting.classeId,
            id_pp           : meeting.profPrincipalId,
            id_pp_user      : meeting.currentPpUserId,
            type_conseil    : meeting.type_conseilId,
            date_prevue     : meeting.date,
            heure_prevue    : meeting.heure,
            id_periode      : meeting.id_periode,
            alerter_membres : meeting.alerter_membres,
            id_membres      : meeting.id_membres,
            roles_membres   : meeting.roles_membres,
            membres_presents: meeting.membre_presents
            
        }).then((res)=>{
           var gridData = formatList(res.data.conseil_classes, res.data.prof_principal, res.data.seqs_dispo, res.data.trims_dispo)
            setGridMeeting(gridData);
            console.log(res.data);
            setIsloading(false);
            setModalOpen(0);
            chosenMsgBox = MSG_SUCCESS_CREATE;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")
            })
        })    
    }

    function modifyClassMeeting(meeting) {
        console.log('Modif',meeting);
        CURRENT_MEETING = meeting;       
      
        setIsloading(true);
        axiosInstance.post(`update-conseil-classe/`, {
            id_conseil_classe              : meeting.id_conseil_classe,
            id_sousetab                    : meeting.id_sousetab,
            id_user                        : currentAppContext.idUser,
            id_classe                      : meeting.classeId,
            id_pp                          : meeting.profPrincipalId,
            id_pp_user                     : meeting.currentPpUserId,
            type_conseil                   : meeting.type_conseilId,
            date_prevue                    : meeting.date,
            heure_prevue                   : meeting.heure,
            date_effective                 : meeting.date_effective,
            id_periode                     : meeting.id_periode,
            alerter_membres                : meeting.alerter_membres,
            id_membres                     : meeting.id_membres,
            roles_membres                  : meeting.roles_membres,
            
            id_eleves                      : meeting.id_eleves,
            list_decisions_conseil_eleves  : meeting.list_decisions_conseil_eleves,
            list_classes_promotions_eleves : meeting.list_classes_promotions_eleves,
            resume_general_decisions       : meeting.resume_general_decisions,
            membre_presents                : meeting.membre_presents,
            to_close                       : meeting.to_close

        }).then((res)=>{
           var gridData = createGridData(res.data.conseil_classes)
            setGridMeeting(gridData);
            console.log(res.data);
            setIsloading(false);
           //setModalOpen(0);
           if(meeting.to_close==1){                
            chosenMsgBox = MSG_SUCCESS_UPDATE_PRINT;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("success_add_M"), 
                message:t("success_add") + ' '+ t("print_pv") + '?'
            });
            //setModalOpen(0);
            } else {
                chosenMsgBox = MSG_SUCCESS_UPDATE;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"info", 
                    msgTitle:t("success_add_M"), 
                    message:t("success_add")
                })
            }
           
        })    
    }


    function meetingClosureHandler(meeting){
        CURRENT_MEETING = meeting; 
        if(CURRENT_MEETING.status == 1){
            chosenMsgBox = MSG_CONFIRM;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("confirm_meeting_closure_M"), 
                message:t("confirm_meeting_closure")
            });
        }
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

    function setMeetingGlobalData(){
        return new Promise(function(resolve, reject){
            DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(DEFAULT_MEMBERS_ADD,   true,   1);
            OTHER_MEMBERS     =  createLabelValueTableWithUserS(OTHER_MEMBERS_ADD,     false, -1);
            PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(PRESENTS_MEMBERS_ADD,  true,   0);
            resolve(1);
        });

    }


   
    function AddNewMeetingHandler(e){       
        if(CURRENT_CLASSE_ID != undefined){  
            setMeetingGlobalData().then(()=>{
                setModalOpen(1); 
                initFormInputs();
            })       
            // DEFAULT_MEMBERS   =  createLabelValueTableWithUserS(DEFAULT_MEMBERS_ADD,   true,   1);
            // OTHER_MEMBERS     =  createLabelValueTableWithUserS(OTHER_MEMBERS_ADD,     false, -1);
            // PRESENTS_MEMBERS  =  createLabelValueTableWithUserS(PRESENTS_MEMBERS_ADD,  true,   0);
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

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_CREATE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //setModalOpen(4); //debut de l'impression
                //printMeetingReport()
                getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab);  
                return 1;
            }

            case MSG_SUCCESS_UPDATE:{
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab);  
                //setModalOpen(0); 
                return 1;
            }

            case MSG_SUCCESS_UPDATE_PRINT:{
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab); 
                printMeetingReport() 
                //setModalOpen(0); 
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

            case MSG_CONFIRM: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                modifyClassMeeting(CURRENT_MEETING);
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

            case MSG_SUCCESS_CREATE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_SUCCESS_UPDATE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_SUCCESS_UPDATE_PRINT: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getListConseilClasse(CURRENT_CLASSE_ID, currentAppContext.currentEtab);
                setModalOpen(0); 
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

            case MSG_CONFIRM: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                // modifyClassMeeting(CURRENT_MEETING);
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

    function printReport(meeting){
        CURRENT_MEETING = meeting;
        console.log("Impression", meeting);
        printMeetingReport();
    }

    function createSudentDecison(ElevesList, eltsPerPage){
        var pagNumber = 1;
        for(var i = 0; i < ElevesList.length; i+eltsPerPage){
            var subTable = ElevesList.splice(i,i+eltsPerPage);
            page.pageRows = [...subTable];
            page.pageNumber = pagNumber;
            pageSet.push(page);
            // index = index + eltsPerPage
            pagNumber++;
        }
    
    }

    const printMeetingReport=()=>{
        var Page_data, countOtherPage;
        var tabPagesData = [];
        var firstElts, firstDecisions, firstPromotions;
        var infosEleves, elevesDecisions, elevesPromotions;

       

        if(CURRENT_CLASSE_ID != undefined){
            if(CURRENT_MEETING.type_conseilId=='annuel'){
                console.log("ccAnnuel pododoo")
                infosEleves      = [...CURRENT_MEETING.infoGeneralesEleves];
                elevesDecisions  = [...CURRENT_MEETING.listDecisions];
                elevesPromotions = [...CURRENT_MEETING.listPromotions];
        
        
                countOtherPage   =  (infosEleves.length-FIRST_PAGE_ROWS_COUNT)/ROWS_PER_PAGE;
                firstElts        =  infosEleves.splice(0,FIRST_PAGE_ROWS_COUNT);
                firstDecisions   =  elevesDecisions.splice(0,FIRST_PAGE_ROWS_COUNT);
                firstPromotions  =  elevesPromotions.splice(0,FIRST_PAGE_ROWS_COUNT);

                for (var i=0; i<countOtherPage; i++){
                    Page_data = {}
                   
                    Page_data.otherPageElts       = [...infosEleves.splice(0,ROWS_PER_PAGE)];
                    Page_data.otherPageDecisions  = [...elevesDecisions.splice(0,ROWS_PER_PAGE)];
                    Page_data.otherPagePromotions = [...elevesPromotions.splice(0,ROWS_PER_PAGE)];
    
                    tabPagesData.push(Page_data);
    
                }

            } else {
                countOtherPage   = 1;
                infosEleves      = [];
                firstElts        = [];
                firstDecisions   = [];
                firstPromotions  = [];
                elevesDecisions  = [];
                elevesPromotions = [];
            }
           

            var PRINTING_DATA = {
                date                : CURRENT_MEETING.date,
                time                : CURRENT_MEETING.heure,
                schoolName          : currentAppContext.currentEtabInfos.libelle,
                quartier            : 'Mvolye',
                ville               : 'Yaounde',

                leftHeaders         : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders       : [currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+'  Telephone:'+ currentAppContext.currentEtabInfos.tel],
                rightHeaders        : ["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", t("annee_scolaire")+' '+ currentAppContext.activatedYear.libelle],
                
                pageImages          : [imgUrl],
                pageImagesDefault   : [imgUrlDefault],
                pageTitle           : "Proces verbal du conseil de classe de la classe de  " + CURRENT_CLASSE_LABEL,
                tableHeaderModel    : [t('form_nom'), t('form_dateNaiss'), t("form_lieuNaiss"), t('moyenne'), t("redoublant"), t("decision_conseil"), t("promotion")],
                
                typeMeeting         : CURRENT_MEETING.type_conseilId,
                compteRendu         : CURRENT_MEETING.resume_general_decisions,
               
                eleveGeneralInfos   : [...CURRENT_MEETING.infoGeneralesEleves], 
                elevesDecisions     : [...CURRENT_MEETING.listDecisions],
                elevesPromotions    : [...CURRENT_MEETING.listPromotions],

                firstPageElt        : firstElts,
                firstPageDecisions  : firstDecisions,
                firstPagePromotions : firstPromotions,

                participants        : [...CURRENT_MEETING.listParticipants],
                nextClasses         : [...CURRENT_MEETING.classProm ],
                              
                numberEltPerPage    : ROWS_PER_PAGE,
                otherPageCount      : countOtherPage,
                pagesElt            : [...tabPagesData]               
            };

            printedETFileName = "PV_Conseil_classe("+CURRENT_CLASSE_LABEL+").pdf"
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
            {(modalOpen >0 && modalOpen<4) && 
                <AddClassMeeting 
                    cca_created        = {CCA_CREATED}
                    defaultMembres     = {DEFAULT_MEMBERS}  
                    otherMembres       = {OTHER_MEMBERS} 
                    presentsMembres    = {PRESENTS_MEMBERS} 
                    sequencesDispo     = {SEQUENCES_DISPO} 
                    trimestresDispo    = {TRIMESTRES_DISPO} 
                    anneDispo          = {ANNEE_DISPO} 
                    currentPpUserId    = {CURRENT_PROF_PP_USERID} 
                    currentPpId        = {CURRENT_PROF_PP_ID} 
                    currentPpLabel     = {CURRENT_PROF_PP_LABEL} 
                    currentClasseLabel = {CURRENT_CLASSE_LABEL} 
                    currentClasseId    = {CURRENT_CLASSE_ID} 
                    nextClasses        = {LIST_NEXT_CLASSES}
                    eleves             = {[...LIST_ELEVES]}
                    formMode           = {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  
                    actionHandler      = {(modalOpen==1) ? addClassMeeting : modifyClassMeeting} 
                    closeHandler       = {meetingClosureHandler}
                    printReportHandler = {printReport}
                    cancelHandler      = {quitForm}
                />
            }
            {(modalOpen==4) && 
                <PDFTemplate previewCloseHandler={closePreview}>
                    { isMobile?
                        <PDFDownloadLink  document ={ <PVCCMeeting pageSet={CCPageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "":  <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>                    
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <PVCCMeeting pageSet={CCPageSet}/>
                        </PDFViewer>
                    }
                </PDFTemplate>
            } 
            
            {(currentUiContext.msgBox.visible == true)  && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) &&
                <MsgBox 
                    msgTitle    = {currentUiContext.msgBox.msgTitle} 
                    msgType     = {currentUiContext.msgBox.msgType} 
                    message     = {currentUiContext.msgBox.message} 
                    customImg   = {true}
                    customStyle = {true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {(currentUiContext.msgBox.msgType  == "question")? t("yes") : t("ok")}
                    buttonRejectText = {t("no")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />               
            }

            {(isLoading) && 
                <LoadingView loadinText={t('traitement')} 
                    loadingTextStyle={{fontSize:'1.2vw', marginTop:'-5.7vh', fontWeight:'800', color:'#4d4848',}}   
                    loadingImgStyle={{ top:'54.3vh', backgroundColor:'white'}}
                />
            }

            {(modalOpen==5) && <LoadingView loadinText={t('loading')} loadingTextStyle={{color:"white"}}/>}
            

            

            <div className={classes.inputRow} >
                {(props.formMode=='ajout')?  
                    <div className={classes.formTitle}>
                        {t('gest_conseilC_M')}  
                    </div>
                    :
                    <div className={classes.formTitle}>
                        {t('consult_conseilC_M')} 
                    </div>
                }
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('conseilC_list_M')}  :
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
                                btnText={t('New_one')}
                                hasIconImg= {true}
                                imgSrc='images/ConseilClasse.png'
                                imgStyle = {classes.grdBtnImgStyleP}  
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
                            getCellClassName={(params) => 
                                (params.field==='etatLabel' && params.row.status==1)?  
                                classes.clotureStyle 
                                : (params.field==='etatLabel' && params.row.status==0) ? 
                                classes.enCoursStyle 
                                : (params.field==='type_conseil'|| params.field==='date_effective') ? 
                                classes.gridRowStyleBOLD 
                                : (params.field==='nom') ?
                                  classes.GridColumnStyleStart : classes.gridRowStyle                             
                            }
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
export default ConseilClasse;