import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer } from '@react-pdf/renderer';
import PDFTemplate from '../reports/PDFTemplate';
import CritSequentiel from '../modals/CritSequentiel';
import BulletinSequence from '../reports/BulletinSequence';
import {useTranslation} from "react-i18next";



var chosenMsgBox;
const MSG_SUCCESS_NOTES =11;
const MSG_WARNING_NOTES =12;
const MSG_ERROR_NOTES   =13;

var CURRENT_ANNEE_SCOLAIRE;

let CURRENT_CLASSE_ID;
let CURRENT_PERIOD_ID;
let CURRENT_TYPE_BULLETIN_ID;
let CURRENT_CLASSE_LABEL;
var selectedElevesIds = new Array();

var listElt    = {};
var listEleves = [];
var pageSet    = [];

var page = {
    pageTitle:'',
    pageRows:[],
    pageNumber:0,
}

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const ROWS_PER_PAGE= 40;
var ElevePageSet={};

var tabSequences    = [];
var tabTrimestres   = [];
var tabCurrentAnnee = [];

var LIST_SEQUENCE   = [];
var LIST_TRIMESTRES = [];


function PrintStudentReport(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const [isValid, setIsValid]     = useState(false);
    const [gridRows, setGridRows]   = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse]  = useState([]);
    const [optPeriode, setOptPeriode]       = useState([]);
    const [optTypeReport, setOptTypeReport] = useState([]);
    const [typeBulletin, setTypeBulletin] = useState(1);
    const selectedTheme = currentUiContext.theme;

    const tabPeriode =[
        {value:0, label:(i18n.language=='fr') ? ' Choisir une periode ' :'  Select a period  '},
        {value:1, label:' sequence '},
        {value:2, label:' Trimestre '},
        {value:3, label:' Annuel '},

    ]

    const tabTypReport =[
        {value:1, label:t('bulletin_sequentiel') },
        {value:2, label:t('bulletin_trimestriel')},
        {value:3, label:t('bulletin_annuel')     },

    ]

    useEffect(()=> {
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        setOptTypeReport(tabTypReport);
       
        getActivatedSequences();
        getActivatedTrimestres();
        getActivatedAnnee();

        getActivatedEvalPeriods(1);

        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
            CURRENT_PERIOD_ID = undefined;
        }

        getEtabListClasses();
        
    },[]);

    const getEtabListClasses=()=>{
       var tempTable=[{value: '0',      label:(i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '    }]
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

    function getTodayDate(){
        var annee = new Date().getFullYear();
        var mm  = (new Date().getMonth()+1).length==1 ? '0'+(new Date().getMonth()+1) : (new Date().getMonth()+1);
        var jj = (new Date().getDate()).length==1 ? '0'+(new Date().getDate()) : (new Date().getDate())
        return annee+'-'+ mm+'-'+jj;
    }

    const  getClassStudentList=(classId)=>{
        listEleves = []
        axiosInstance.post(`eleves-situation-financiere/`, {
            id_classe: classId,
            date_limite:getTodayDate()
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data.eleves)]
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
            listElt.id = elt.id;
            listElt.nom = elt.nom;
            listElt.rang = rang; 
            listElt.matricule = elt.matricule;
            listElt.date_naissance = convertDateToUsualDate(elt.date_naissance);
            listElt.lieu_naissance = elt.lieu_naissance;
            listElt.date_entree = elt.date_entree;
            listElt.nom_pere = elt.nom_pere;
            listElt.nom_pere = elt.nom_mere;           
            listElt.en_regle = elt.en_regle ;
            listElt.en_regle_Header = (elt.en_regle == true) ? t("yes") : t("no");
            listElt.nom_parent = (elt.nom_pere.length>0) ? elt.nom_pere:elt.nom_mere ;           
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    function filterEleves(e){
        var list =[]
        var enRegle = e.target.checked;      
        console.log("check", enRegle);
        setGridRows(listEleves.filter((elt)=>elt.en_regle==enRegle));         
    }

    function changeBulletinType(typeBulletin){
        setTypeBulletin(typeBulletin);
        getActivatedEvalPeriods(typeBulletin);
    }

    function getActivatedSequences(){
        var tempTable=[];
        
        axiosInstance.post(`list-sequences/`, {
            id_sousetab: currentAppContext.currentEtab,
            id_trimestre:""
        }).then((res)=>{                   
            tempTable = [...res.data.sequences];                         
            tempTable.map((seq)=>{
                if(seq.is_active == true){
                    tabSequences.push({value:seq.id, label:seq.libelle});
                    LIST_SEQUENCE.push(seq);
                }                              
            })    
        })
        
    }

    function getActivatedTrimestres(){
        var tempTable = []
              
        axiosInstance.post(`list-trimestres/`, {
            id_sousetab: currentAppContext.currentEtab,
            id_trimestre:""
        }).then((res)=>{    
            tabTrimestres = [];               
            tempTable = [...res.data];                         
            tempTable.map((seq)=>{
                if(seq.is_active == true){
                    tabTrimestres.push({value:seq.id, label:seq.libelle});
                    LIST_TRIMESTRES.push(seq);
                }                              
            })    
        })
    }

    function getActivatedAnnee(){
        tabCurrentAnnee = [{value: 0,      label: t("annee")+ ' '+ CURRENT_ANNEE_SCOLAIRE  }]       
    }


    function getActivatedEvalPeriods(typebultin){      
        switch(typebultin){
            case 1: {console.log("ici1"); setOptPeriode(tabSequences);    return;} 
            case 2: {console.log("ici2"); setOptPeriode(tabTrimestres);   return;}
            case 3: {console.log("ici3"); setOptPeriode(tabCurrentAnnee); return;}
        }    
    }

    function getTrimSequences(trimId){
        var cur_trim = LIST_TRIMESTRES.find((trim)=> trim.id==trimId);
        if(cur_trim != undefined){
           var list_cur_seq = LIST_SEQUENCE.filter((seq)=>(seq.date_deb >= cur_trim.date_deb) && (seq.date_fin <= cur_trim.date_fin))
            if(list_cur_seq!=undefined) return list_cur_seq;
            else return [];
        } else return [];
    }


    function dropDownHandler(e){
       
        var grdRows;
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getClassStudentList(CURRENT_CLASSE_ID); 
            setIsValid(true);
            
            console.log(CURRENT_CLASSE_LABEL)          
        }else{
           
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setIsValid(false);
            setGridRows([]);
        }
    }

    function dropDownTypeReportHandler(e){
        CURRENT_TYPE_BULLETIN_ID = parseInt(e.target.value);
        console.log("type bulletin",CURRENT_TYPE_BULLETIN_ID)
        changeBulletinType(CURRENT_TYPE_BULLETIN_ID);    
    }

    
    function dropDownPeriodHandler(e){
        if(e.target.value != optPeriode[0].value){
            CURRENT_PERIOD_ID = e.target.value;            
        }else{
            CURRENT_PERIOD_ID = undefined;           
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
        field: 'nom',
        headerName: 'NOM ET PRENOM(S)',
        width: 200,
        editable: false,
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
        field: 'en_regle_Header',
        headerName: 'EN REGLES ?',
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle,
            
    },

    {
        field: 'id',
        headerName: '',
        width: 15,
        editable: false,
        hide : true,
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
            field: 'nom',
            headerName: 'NAME AND SURNAME',
            width: 200,
            editable: false,
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
            field: 'en_regle_Header',
            headerName:'FEES PAID ?',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
    
        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:true,
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

    function getNotifButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_notifButtonStyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_notifButtonStyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P;
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

    function handleEditRow(row){       
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

    const acceptHandler=()=>{
        switch(chosenMsgBox){

            case MSG_SUCCESS_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING_NOTES: {
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
            setModalOpen(5);
            let formData = new FormData();
           
            formData.append('id_classe',CURRENT_CLASSE_ID);
            formData.append('id_sequence',CURRENT_PERIOD_ID);
            formData.append('id_eleves',selectedElevesIds[0].join('_'));

            const config = {headers:{'Content-Type':'multipart/form-data'}};
            axiosInstance
            .post(`imprimer-bulletin-classe/`,formData,config)
            .then((response) => {  
               // setModalOpen(0);              
                ElevePageSet={};
                ElevePageSet.effectif = listEleves.length;
                ElevePageSet.eleveNotes = [... response.data.eleve_results];
                ElevePageSet.noteRecaps = [... response.data.note_recap_results];
                ElevePageSet.groupeRecaps = [... response.data.groupe_recap_results];
                ElevePageSet.entete_fr ={... response.data.entete_fr};
                ElevePageSet.entete_en ={... response.data.entete_en};
                ElevePageSet.titreBulletin ={... response.data.titre_bulletin};
                ElevePageSet.etabLogo = "images/collegeVogt.png";
                ElevePageSet.profPrincipal = 'MESSI Martin';
                ElevePageSet.classeLabel = CURRENT_CLASSE_LABEL;                
                console.log("ici la",ElevePageSet,gridRows);  
                setModalOpen(4);               
            })          
                          
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

    const closePreview =()=>{
        selectedElevesIds =[];
        setIsValid(false);                 
        setModalOpen(0);
    }

    function genSeqBulletin(criteria){
        setModalOpen(5);
        axiosInstance.post(`generer-bulletin-classe/`, {
            id_sousetab : currentAppContext.currentEtab,
            id_classe   : CURRENT_CLASSE_ID,
            id_sequence : CURRENT_PERIOD_ID,
            // sous la forme 1²²2...
            id_matieres_ne_pouvant_manquer : criteria.id_matieres_ne_pouvant_manquer,
            nb_max_matieres_sans_note      : criteria.nb_max_matieres_sans_note,
            nb_max_coefs_manquants         : criteria.nb_max_coefs_manquants           
        }).then((res)=>{
            setModalOpen(1);    
            
            // chosenMsgBox = MSG_WARNING_NOTES;
            // currentUiContext.showMsgBox({
            //     visible:true, 
            //     msgType:"info", 
            //     msgTitle:t("error_M"), 
            //     message:t("no_activated_period")
            // })       
           
        })
    }

    function genTrimBulletin(){
        setModalOpen(5);
        axiosInstance.post(`generer-bulletin-trimestre-classe/`, {
            id_sousetab  : currentAppContext.currentEtab,
            id_classe    : CURRENT_CLASSE_ID,
            id_trimestre : CURRENT_PERIOD_ID  ,
        }).then((res)=>{
            setModalOpen(2);    
            // tabTrimestres = [];               
            // tempTable = [...res.data];                         
            // tempTable.map((seq)=>{
            //     if(seq.is_active == true){
            //         tabTrimestres.push({value:seq.id, label:seq.libelle});
            //     }                              
            // })    
           
        })
    }

    function genYearBulletin(){
        setModalOpen(5);
        axiosInstance.post(`generer-bulletin-annee-classe/`, {
            id_sousetab : currentAppContext.currentEtab,
            id_classe   : CURRENT_CLASSE_ID,
        }).then((res)=>{
            setModalOpen(3);    
            // tabTrimestres = [];               
            // tempTable = [...res.data];                         
            // tempTable.map((seq)=>{
            //     if(seq.is_active == true){
            //         tabTrimestres.push({value:seq.id, label:seq.libelle});
            //     }                              
            // })    
           
        })
    }


    const generateBulletinHandler=(criteria)=>{       
        switch(typeBulletin){
            case 1:{
                if(criteria=="none") setModalOpen(3);
                else genSeqBulletin(criteria);
                return;
            }            

            case 2:{
                if(criteria=="none") {
                    setModalOpen(6);
                }
                else genTrimBulletin(criteria);
                return;
            }

            case 3:{
                if(criteria=="none") {
                    
                    setModalOpen(6);
                }
                else genYearBulletin(criteria);
                return;
            }
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
        <div className={classes.formStyleP}>
            
            {(modalOpen!=0) && <BackDrop/>}
            {(modalOpen==4) && <PDFTemplate previewCloseHandler={closePreview}><PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}><BulletinSequence data={ElevePageSet}/></PDFViewer></PDFTemplate>} 
            
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

            {(modalOpen==5) && <BackDrop/>}
            {(modalOpen==5) &&
                <div style={{ alignSelf: 'center',position:'absolute', top:'50%', fontWeight:'bolder', color:'#fffbfb', zIndex:'1207',marginTop:'-2.7vh', fontSise:'0.9vw'}}> 
                    {t('traitement')}...
                </div>                    
            }
            {(modalOpen==5) &&
                <div style={{   
                    alignSelf: 'center',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '13vw',
                    height: '3.13vh',
                    position: 'absolute',
                    top:'50%',
                    zIndex: '1200',
                    overflow: 'hidden'
                }}
                >
                    <img src='images/Loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
                </div>                    
            }

            <div className={classes.inputRow} >
                <div className={classes.formTitle}>
                    {t('print_bulletin_M')}  
                </div>
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle} style={{width:"77vw"}}> 
                                                             
                        <div className={classes.gridTitleText} style={{width:"5.7vw", fontSize:"0.87vw"}}>
                            {t('class_M')} :
                        </div>
                    
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select onChange={dropDownHandler} id='selectClass1' className={classes.comboBoxStyle} style={{width:'10.3vw', marginBottom:1, marginLeft:"-1vw"}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>
                        

                       
                            <div className={classes.gridTitleText} style={{width:"9.7vw", fontSize:"0.87vw", marginLeft:"1vw"}}>
                                {t('type_bulletin_M')} :
                            </div>
                        
                            <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                                <select onChange={dropDownTypeReportHandler} id='optPeriode' className={classes.comboBoxStyle} style={{width:'10.3vw', marginBottom:1, marginLeft:"-2vw"}}>
                                    {(optTypeReport||[]).map((option)=> {
                                        return(
                                            <option  value={option.value}>{option.label}</option>
                                        );
                                    })}
                                </select>                          
                            </div>
                       

                       
                            <div className={classes.gridTitleText} style={{marginLeft:'1vw',width:"5.7vw", fontSize:"0.87vw"}}>
                                {t('period_M')} :
                            </div>
                        
                            <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                                <select onChange={dropDownPeriodHandler} id='optPeriode' className={classes.comboBoxStyle} style={{width:'7.3vw', marginBottom:1, marginLeft:"-1vw"}}>
                                    {(optPeriode||[]).map((option)=> {
                                        return(
                                            <option  value={option.value}>{option.label}</option>
                                        );
                                    })}
                                </select>                          
                            </div>
                       
                        <div style={{display:"flex", flexDirection:"row", marginLeft:"2vw", marginRight:"-2vw" }}>
                            <input type="checkbox" onClick={filterEleves}/> 
                            <div style={{marginLeft:"0.3vw", width:"17vw"}}>{t('paid_fees')}</div>
                        </div>
 
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                        {/* {(props.formMode =="generation") &&
                            <CustomButton
                                btnText={t('criteres')}
                                hasIconImg= {true}
                                imgSrc='images/checkCriteres.png'
                                imgStyle = {classes.grdBtnImgStyleP}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyle}
                                btnClickHandler={openCriterModal}
                                disable={(isValid==false)}   
                            />
                        } */}
                      
                       
                    
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
                    </div>
                        
                </div>
                    
                

               
                <div className={classes.gridDisplay} >
                    {(modalOpen!=0) && <BackDrop/>}
                    {(modalOpen==3) &&  
                        <CritSequentiel 
                            classeId={CURRENT_CLASSE_ID}  
                            cancelHandler   = {()=>setModalOpen(0)}
                            generateHandler = {generateBulletinHandler}
                        />
                    } 

                    <StripedDataGrid
                        rows={gridRows}
                        columns={(i18n.language == 'fr') ? columnsFr : columnsEn}

                        checkboxSelection = {true}
                            
                        onSelectionModelChange={(id)=>{
                            selectedElevesIds = new Array(id);
                            if(selectedElevesIds[0].length>0) setIsValid(true);
                            else setIsValid(false);
                            console.log("selections",selectedElevesIds);
                        }}


                        /* getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                        onCellClick={handleDeleteRow}
                        onRowClick={(params,event)=>{
                            if(event.ignore) {
                                //console.log(params.row);
                                handleEditRow(params.row)
                            }
                        }}*/  
                        
                        // onRowDoubleClick ={(params, event) => {
                        //     event.defaultMuiPrevented = true;
                        //     consultRowData(params.row)
                        // }}
                        
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
export default PrintStudentReport;