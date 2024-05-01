import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddFraisScolarite from "../modals/AddFraisScolarite";
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import LoadingView from "../../../loadingView/LoadingView";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate,formatCurrency} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer } from '@react-pdf/renderer';
import PDFTemplate from '../../scolarite/reports/PDFTemplate';
import StudentListTemplate from '../../scolarite/reports/StudentListTemplate';
import RecuPaiementFrais from '../reports/RecuPaiementFrais';
import {createPrintingPages} from '../../scolarite/reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
let CURRENT_PAIEMENT;
var ROW_TO_DELETE_ID = undefined;


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
const OP_SUCCESS  =3;
const MSG_CONFIRM =4;

const ROWS_PER_PAGE= 40;
var ElevePageSet=[];

var type_payements = [],eleves = [];
let montant_total_a_payer=0;



function FraisScolarite(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid]     = useState(false);
    const [gridRows, setGridRows]   = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse]  = useState([]);
    const [grdCols, setGrdCols]     = useState([]);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        
        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }
        setGrdCols((i18n.language=='Fr')? columnsFr : columnsEn);
        getEtabListClasses();
        
    },[]);


    function updateGridCols(listTypePaiements){
        if(i18n.language=='fr'){
            var gridCols =[...columnsFr];
        } else {
            var gridCols =[...columnsEn];
        }
            
        var column ={};
      
        listTypePaiements.map((pay, index)=>{
            column = {
                field: pay.libelle,
                headerName: pay.libelle.toUpperCase(),
                width: 97,
                editable: false,
                headerClassName: classes.GridColumnStyle,
                renderCell: (params) => (                   
                   <div>{params.value+" FCFA"}</div>                  
                )
            }

            gridCols.push(column);
        });

        console.log("popo ici", gridCols, listTypePaiements);
        
        gridCols.push({
            field: 'montant',
            headerName: (i18n.language=='fr') ? 'TOTAL VERSE' : 'TOTAL PAID',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params) => (                   
                (parseInt(params.value) < parseInt(params.row.montant_total_a_payer))?
                <b style={{color:'red'}}>{params.value+" FCFA"}</b>
                :
                <b style={{color:'green'}}>{params.value+" FCFA"}</b>                    
            )
        });

        gridCols.push({
            field: 'montant_total_a_payer',
            headerName: (i18n.language=='fr') ? 'TOTAL ATTENDU' : 'AMOUNT TO PAY',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params) => (
                <b style={{fontWeight:"700"}}>{params.value+" FCFA"}</b>
            ),
        });


        gridCols.push({            
            field: 'dates_payements',
            headerName: (i18n.language=='fr') ? 'Date' : 'Date',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle            
        });

        gridCols.push({             
            field: 'montants',
            headerName: (i18n.language=='fr') ? 'MONTANT TOTAL' : 'TOTAL PAID FEES',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle            
        });

        gridCols.push( {            
            field: 'photoUrl',
            headerName: 'Photo',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle            
        });

        gridCols.push({
            field: 'redouble',
            headerName: 'Redouble',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        });
    

        gridCols.push({ 
        
            field: '',
            headerName: 'ACTION',
            width: 67,
            editable: false,
            hide:(props.formMode=='ajout')? false : true,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    (parseInt(params.row.montant) < parseInt(params.row.montant_total_a_payer))?
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
                                    //event.ignore = true;
                                    ROW_TO_DELETE_ID = params.row.id;
                                    chosenMsgBox = OP_SUCCESS;
                                    currentUiContext.showMsgBox({
                                        visible:true, 
                                        msgType:"question", 
                                        msgTitle:t("SUPPRESSION PAIEMENT"), 
                                        message:t("Voulez-vous vraiment supprimer le paiement?")
                                    })
                                }}
                                alt=''
                            />
                        </div>
                    : <b style={{fontWeight:"700", color:"blue" /*color:"#065386"*/}}>{t('acquitted')}</b>
                )}           
                
            }
        );

        setGrdCols(gridCols)

    }

    const getEtabListClasses=()=>{
        var tempTable  = [{value: '0',      label: (i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '  }];

         let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
         console.log(classes)
         let classes_user;
         
         classes_user = currentAppContext.infoUser.intendant_classes;
 
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

    function getListStudentPayements(classeId){
        type_payements = [];
        eleves = [];
        setModalOpen(5);
        axiosInstance
        .post(`list-payement-eleve/`,{
            id_sousetab: currentAppContext.currentEtab,
            id_classe:classeId
        }).then((res)=>{
            res.data.type_payements.map((payement)=>{type_payements.push(payement)});
            res.data.eleves.map((el)=>{eleves.push(el)});
            montant_total_a_payer = res.data.montant_total_a_payer;
            console.log("hdhdhd",type_payements, eleves);
            var elevesPaiment = [...formatList(eleves, type_payements)];
            updateGridCols(type_payements) 
            setGridRows(elevesPaiment);
            setModalOpen(0);
        })  
    }

    

    const formatList=(list, typesPaiements) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id                    = elt.id;
            listElt.displayedName         = elt.nom +' '+elt.prenom;
            listElt.nom                   = elt.nom;
            listElt.prenom                = elt.prenom;
            listElt.age                   = elt.age;
            listElt.rang                  = rang; 
            listElt.presence              = 1; 
            listElt.montant               = formatCurrency(elt.montant);
            listElt.matricule             = elt.matricule;
            listElt.montants              = elt.montants;
            listElt.montant_total_a_payer = formatCurrency(montant_total_a_payer);
            listElt.photoUrl              = elt.photoUrl;
            listElt.redouble              = elt.redouble;
            listElt.montant_par_types     = elt.montant_par_types;
            listElt.dates_payements       = convertDateToUsualDate(elt.dates_payements);

            typesPaiements.map((el, index)=>{
                listElt[el.libelle]   =  formatCurrency(Math.abs(listElt.montant_par_types.split('_')[index]))
            })
            
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }
    
/*************************** DataGrid Declaration ***************************/    
const columnsFr = [
    {
        field: 'id',
        headerName: 'ID',
        width: 100,
        editable: false,
        hide:true,
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

   

   
    ];

    const columnsEn = [

        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            editable: false,
            hide:true,
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
            field: 'displayedName',
            headerName: 'NAME AND SURNAME',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'nom',
            headerName: 'NAME',
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
    function handleEditRow(row){       
        console.log(type_payements)
        var inputs   = [];
        var tranches = [];
        var tranche  = {};
        var recap    = {};

        var totalVerse   = 0;
        var totalAttendu = 0;

        type_payements.map((elt, index)=>{
            tranche  = {};
            tranche.id             =  elt.id;
            tranche.libelle        =  elt.libelle;
            tranche.date_deb       =  elt.date_deb;
            tranche.date_fin       =  elt.date_fin;
            tranche.montantVerse   =  row.montant_par_types.split('_')[index];
            tranche.montantAttendu =  elt.montant;
            tranches.push(tranche); 
            totalVerse   += parseInt(tranche.montantVerse);
            totalAttendu +=  parseInt(tranche.montantAttendu); 
        });

        recap.montantVerse   = totalVerse;
        recap.montantAttendu = totalAttendu;
        recap.montantRestant = totalAttendu-totalVerse;

        inputs[0] = row.nom;
        inputs[1] = row.prenom;
        inputs[3] = row.matricule;
        inputs[4] = row.montant;
        inputs[2] = row.id;
        inputs[5] = CURRENT_CLASSE_ID;
        inputs[6] = type_payements;
        inputs[7] = montant_total_a_payer;
        inputs[8] = row.dates_payements;
        inputs[9] = row.montants;
        inputs[10]= CURRENT_CLASSE_LABEL;
        inputs[11]= row.photoUrl;
        inputs[12]= row.redouble;
        inputs[13]= [...tranches];
        inputs[14]= {...recap};
        inputs[15]= row.age;
        
        currentUiContext.setFormInputs(inputs);
        console.log(row);
        setModalOpen(2);

    }

    function consultRowData(row){
        console.log(type_payements)
        var inputs   = [];
        var tranches = [];
        var tranche  = {};
        var recap    = {};

        var totalVerse   = 0;
        var totalAttendu = 0;

        type_payements.map((elt, index)=>{
            tranche  = {};
            tranche.id             =  elt.id;
            tranche.libelle        =  elt.libelle;
            tranche.date_deb       =  elt.date_deb;
            tranche.date_fin       =  elt.date_fin;
            tranche.montantVerse   =  row.montant_par_types.split('_')[index];
            tranche.montantAttendu =  elt.montant;
            tranches.push(tranche); 
            totalVerse   += parseInt(tranche.montantVerse);
            totalAttendu +=  parseInt(tranche.montantAttendu); 
        });

        recap.montantVerse   = totalVerse;
        recap.montantAttendu = totalAttendu;
        recap.montantRestant = totalAttendu-totalVerse;

        inputs[0] = row.nom;
        inputs[1] = row.prenom;
        inputs[3] = row.matricule;
        inputs[4] = row.montant;
        inputs[2] = row.id;
        inputs[5] = CURRENT_CLASSE_ID;
        inputs[6] = type_payements;
        inputs[7] = montant_total_a_payer;
        inputs[8] = row.dates_payements;
        inputs[9] = row.montants;
        inputs[10]= CURRENT_CLASSE_LABEL;
        inputs[11]= row.photoUrl;
        inputs[12]= row.redouble;
        inputs[13]= [...tranches];
        inputs[14]= {...recap};
        inputs[15]= row.age;
        
        currentUiContext.setFormInputs(inputs);
        console.log(row);
        setModalOpen(3);

    }

    function dropDownClasseChangeHandler(e){
        if(e.target.value != optClasse[0].value){
            setIsValid(true);
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getListStudentPayements(CURRENT_CLASSE_ID);  
            
            console.log(CURRENT_CLASSE_LABEL)          
        }else{
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setGridRows([]);
            setIsValid(false);
        }
    }
    

    function getFormData(){
        var payements = { 
            id:0,
            id_classe:0,
            montant:'',
        }

        payements.id = document.getElementById('idEleve').value;
        payements.id_classe = document.getElementById('idClasse').value;
        payements.montant = document.getElementById('montant_paye').value;
        return payements;
    }

    function addNewFraisScolarite(e) {  
        //--- Pas appele ----     
        /*e.preventDefault();
        var cycl = getFormData();
                        
            axiosInstance.post(`create-cycle/`, {
                libelle: cycl.libelle,
                code: cycl.code,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                eleves = []
                res.data.eleves.map((cycle)=>{eleves.push(cycle)});
                var elevesPaiment = [...formatList(eleves)];
                setGridRows(elevesPaiment);                
                setModalOpen(0);
            }) 
        */
    }

    function updatePaiement(paiement){
        CURRENT_PAIEMENT = {...paiement}
        chosenMsgBox = MSG_CONFIRM;
        currentUiContext.showMsgBox({
            visible:true, 
            msgType:"question", 
            msgTitle:t("CONFIRMATION"), 
            message:t("Voulez-vous vraiment enregistrer ce versement?")
        })
    }

    function modifyFraisScolarite(e) {
        e.preventDefault();
        //var paymnt = getFormData();
        console.log('kilo',CURRENT_PAIEMENT);
        currentUiContext.setIsParentMsgBox(true);
        
        type_payements = [];
        eleves = [];         
        
        axiosInstance.post(`update-payement-eleve/`, {
            id                : CURRENT_PAIEMENT.id,
            montant           : CURRENT_PAIEMENT.montant,
            id_classe         : CURRENT_PAIEMENT.id_classe,
            type_paiement_Id  : CURRENT_PAIEMENT.type_paiement_Id,
            id_sousetab       : currentAppContext.currentEtab,
            id_user           : currentAppContext.idUser

        }).then((res)=>{
            // console.log(res.data);
            // res.data.type_payements.map((payement)=>{type_payements.push(payement)});
            // res.data.eleves.map((el)=>{eleves.push(el)});
            // montant_total_a_payer = res.data.montant_total_a_payer;
            // console.log(type_payements);
            // var elevesPaiment = [...formatList(eleves,type_payements)];
            // setGridRows(elevesPaiment);
            CURRENT_PAIEMENT.numeroRecu = res.data.numeroRecu;
            type_payements = [];
            eleves = [];
            axiosInstance
            .post(`list-payement-eleve/`,{
                id_sousetab: currentAppContext.currentEtab,
                id_classe:CURRENT_CLASSE_ID
            }).then((res)=>{
                res.data.type_payements.map((payement)=>{type_payements.push(payement)});
                res.data.eleves.map((el)=>{eleves.push(el)});
                montant_total_a_payer = res.data.montant_total_a_payer;
                
                
                var elevesPaiment = [...formatList(eleves, type_payements)];
                
                updateGridCols(type_payements) 
                setGridRows(elevesPaiment);

                setModalOpen(0);
                chosenMsgBox = MSG_SUCCESS;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"info", 
                    msgTitle:t("success_operation_M"), 
                    message:t("success_operation")
                });
                
            })  

            //getListStudentPayements(CURRENT_CLASSE_ID)
            
            
        })       
    }

    function handleDeleteRow(rowId){       
        deleteRow(rowId);           
    }

    function quitForm() {
        //ClearForm();
        setModalOpen(0)
    }


    
    function deleteRow(rowId) {
        axiosInstance
        .post(`delete-payement/`, {
            id:rowId,
            id_sousetab: currentAppContext.currentEtab
        }).then((res)=>{
            console.log(res.data.status)
            res.data.payements.map((payement)=>{type_payements.push(payement)});
            setGridRows(type_payements);
        })              
        
    } 
   

    const acceptHandler=(e)=>{
        
        switch(chosenMsgBox){

            case MSG_CONFIRM: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })
                modifyFraisScolarite(e);
                return 1;
            }
            
            case OP_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                handleDeleteRow(ROW_TO_DELETE_ID);
                ROW_TO_DELETE_ID = null;
                return 1;
            }

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                
                printStudentList();
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
            case OP_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                handleDeleteRow(ROW_TO_DELETE_ID);
                ROW_TO_DELETE_ID = null;
                return 1;
            }

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getListStudentPayements(CURRENT_CLASSE_ID); 
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
            // var PRINTING_DATA ={
            //     dateText:'Yaounde, le 14/03/2023',
            //     leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
            //     centerHeaders:["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
            //     rightHeaders:["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
            //     pageImages:["images/collegeVogt.png"],
            //     pageTitle: t("listing_paiement") + CURRENT_CLASSE_LABEL,
            //     tableHeaderModel:["matricule", "nom et prenom(s)", "date naissance", "lieu naissance", "enrole en", "Nom Parent", "nouveau"],
            //     tableData :[...gridRows],
            //     numberEltPerPage:ROWS_PER_PAGE  
            // };

           
            setModalOpen(4);
            ElevePageSet=[];
            //ElevePageSet = createPrintingPages(PRINTING_DATA);
            console.log("ici la",CURRENT_PAIEMENT,gridRows);                    
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
            {(modalOpen==4) &&  
                <PDFTemplate previewCloseHandler={closePreview} loadingText={t("receipt_printing")}>
                    <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                        <RecuPaiementFrais recuInfo={CURRENT_PAIEMENT}/>
                    </PDFViewer>
                </PDFTemplate>
            } 
           
            {(modalOpen >0 && modalOpen<4) && 
                <AddFraisScolarite 
                    currentClasseLabel = {CURRENT_CLASSE_LABEL} 
                    currentClasseId    = {CURRENT_CLASSE_ID} 
                    formMode           = {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  
                    actionHandler      = {(modalOpen==1) ? addNewFraisScolarite : updatePaiement} 
                    cancelHandler      = {quitForm} 
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
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("non")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                    
            }

            {(modalOpen==5) && <LoadingView loadinText={t('traitement')} loadingTextStyle={{color:"white"}}/>}

            <div className={classes.inputRow} >
                {(props.formMode=='ajout')?  
                    <div className={classes.formTitle}>
                        {t('school_fees_payment_M')}  
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
                      
                        <div className={classes.selectZone}>
                            <select id='selectClass1' onChange={dropDownClasseChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                        {/*(props.formMode=='ajout')?
                            <CustomButton
                                btnText={t('New_student')}
                                hasIconImg= {true}
                                imgSrc='images/addNewUserOrg.png'
                                imgStyle = {classes.grdBtnImgStyle}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyle}
                                btnClickHandler={AddNewStudentHandler}
                                disable={(isValid==false)}   
                            />
                            :
                            null
                            */}

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
                       
                    </div>
                        
                </div>
                

                {/*(modalOpen==0) ?*/
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                           // columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                            columns={grdCols}
                            getCellClassName={(params) => (params.field==='displayedName')? classes.gridMainRowStyle : classes.gridRowStyle }
                            //onCellClick={handleDeleteRow}
                            onRowClick={(params,event)=>{
                                if(event.ignore) {
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
export default FraisScolarite;