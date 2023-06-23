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
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer } from '@react-pdf/renderer';
import PDFTemplate from '../../scolarite/reports/PDFTemplate';
import StudentListTemplate from '../../scolarite/reports/StudentListTemplate';
import {createPrintingPages} from '../../scolarite/reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
var ROW_TO_DELETE_ID = undefined;

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

    function getListStudentPayements(classeId){
        type_payements = [];
        eleves = [];
        axiosInstance
        .post(`list-payement-eleve/`,{
            id_sousetab: currentAppContext.currentEtab,
            id_classe:classeId
        }).then((res)=>{
            res.data.type_payements.map((payement)=>{type_payements.push(payement)});
            res.data.eleves.map((el)=>{eleves.push(el)});
            montant_total_a_payer = res.data.montant_total_a_payer;
            console.log(type_payements);
            var elevesPaiment = [...formatList(eleves)];
            setGridRows(elevesPaiment);
        })  
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
            listElt.montant = elt.montant;
            listElt.matricule = elt.matricule;
            listElt.montants = elt.montants;
            listElt.dates_payements = convertDateToUsualDate(elt.dates_payements);
            
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

    {
        field: 'montant',
        headerName: 'MONTANT VERSE',
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params) => (
            params.value < montant_total_a_payer?
            <b style={{color:'red'}}>{params.value}</b>
            :
            <b style={{color:'green'}}>{params.value}</b>
        ),
    },
    {
        field: 'dates_payements',
        headerName: 'Date',
        width: 120,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'montants',
        headerName: 'Montant',
        width: 120,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: '',
        headerName: '',
        width: 15,
        editable: false,
        hide:(props.formMode=='ajout')? false : true,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            return(
                (params.row.montant < montant_total_a_payer)?
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
                :null
            )}           
            
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
    
        {
            field: 'montant',
            headerName: 'PAID FEES',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params) => (
                params.value < montant_total_a_payer?
                <b style={{color:'red'}}>{params.value}</b>
                :
                <b style={{color:'green'}}>{params.value}</b>
            ),
        },
        {
            field: 'dates_payements',
            headerName: 'DATE',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'montants',
            headerName: 'MONTANT',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: '',
            headerName: '',
            width: 15,
            editable: false,
            hide:(props.formMode=='ajout')? false : true,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    (params.row.montant < montant_total_a_payer)?
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
                                    msgTitle:t("PAIEMENT DELETION"), 
                                    message:t("Are you sure you want to delete this paiement?")
                                })
                               // handleDeleteRow(params)
                            }}
                            alt=''
                        />
                    </div>
                    :
                    null
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
    function handleEditRow(row){       
        console.log(type_payements)
        var inputs=[];
        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[3]= row.matricule;
        inputs[4]= row.montant;
        inputs[2]= row.id;
        inputs[5]= CURRENT_CLASSE_ID;
        inputs[6]= type_payements;
        inputs[7]= montant_total_a_payer;
        inputs[8]= row.dates_payements;
        inputs[9]= row.montants;
        inputs[10]= CURRENT_CLASSE_LABEL;
        
        currentUiContext.setFormInputs(inputs);
        console.log(row);
        setModalOpen(2);

    }

    function consultRowData(row){
        var inputs=[];
       
        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[3]= row.matricule;
        inputs[4]= row.montant;
        inputs[2]= row.id;
        inputs[5]= CURRENT_CLASSE_ID;
        inputs[6]= type_payements;
        inputs[7]= montant_total_a_payer;
        inputs[8]= row.dates_payements;
        inputs[9]= row.montants;
        inputs[10]= CURRENT_CLASSE_LABEL;

     
        currentUiContext.setFormInputs(inputs)
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
        e.preventDefault();
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
        
    }

    function updatePaiement(){
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
        var paymnt = getFormData();
        console.log('kilo',paymnt);
        type_payements = [];
        eleves = [];         

        axiosInstance.post(`update-payement-eleve/`, {
            id: paymnt.id,
            montant: paymnt.montant,
            id_classe: paymnt.id_classe,

        }).then((res)=>{
            console.log(res.data);
            res.data.type_payements.map((payement)=>{type_payements.push(payement)});
            res.data.eleves.map((el)=>{eleves.push(el)});
            montant_total_a_payer = res.data.montant_total_a_payer;
            console.log(type_payements);
            var elevesPaiment = [...formatList(eleves)];
            setGridRows(elevesPaiment);
            
            setModalOpen(0);
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_operation_M"), 
                message:t("success_operation")
            })
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
            {(modalOpen==4) &&  <PDFTemplate previewCloseHandler={closePreview}><PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}><StudentListTemplate pageSet={ElevePageSet}/></PDFViewer></PDFTemplate>} 
            {/*(modalOpen==4) && <StudentList pageSet={ElevePageSet}/>*/}
            {(modalOpen >0 && modalOpen<4) && <AddFraisScolarite currentClasseLabel={"4eA1"} currentClasseId={1} formMode= {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  actionHandler={(modalOpen==1) ? addNewFraisScolarite : updatePaiement} cancelHandler={quitForm} />}
            
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
            <div className={classes.inputRow} >
                {(props.formMode=='ajout')?  
                    <div className={classes.formTitle}>
                        {t('GESTION DU PAIEMENT DES FRAIS DE SCOLARITE')}  
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
                

                {/*(modalOpen==0) ?*/
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
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