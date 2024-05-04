import React from 'react';
import ReactDOM from 'react-dom';
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
import {convertDateToUsualDate,ajouteZeroAuCasOu} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import PDFTemplate from '../reports/PDFTemplate';
import {isMobile} from 'react-device-detect';
import StudentList from '../reports/StudentList';
import AddExam from '../modals/AddExam';
import StudentListTemplate from '../reports/StudentListTemplate';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
var CURRENT_ANNEE_SCOLAIRE;
var ROW_TO_DELETE_ID;

var listElt ={};
 
var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const MSG_CONFIRM =3;
const MSG_SUCCESS_DELETE =4;
const ROWS_PER_PAGE= 40;
var ElevePageSet=[];
var printedETFileName ='';


function NewOfficialExam(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

  
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse] = useState([]);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {  
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }
        getListExams();        
    },[]);

   
    const  getListExams=()=>{
        var listExams = []
        axiosInstance.post(`list-examen-officiel/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
            console.log("list Exams",res.data);
            listExams = [...formatList(res.data.res)]
            console.log(listExams);
            setGridRows(listExams);
            console.log(gridRows);
        })  
    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.rang              = ajouteZeroAuCasOu(rang);
            listElt.id                = elt.id;
            listElt.libelleExam       = elt.libelleExam;
            listElt.classes           = elt.classes;
            listElt.idNiveau          = elt.id_niveau;
            listElt.libelleNiveau     = elt.libelle_niveau;
            listElt.idClasses         = elt.id_classes;
            listElt.libelleClasses    = elt.libelle_classes.split('_').join(',');
            
            formattedList.push(listElt); 
            rang ++;          
        });
        return formattedList;
    }

/*************************** DataGrid Declaration ***************************/    
const columnsFr = [
    {
        field          : 'id',
        headerName     : 'ID',
        width          : 200,
        editable       : false,
        hide           : true,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field          : 'rang',
        headerName     : 'N°',
        width          : 50,
        editable       : false,
        headerClassName:classes.GridColumnStyle
    },
       
    {
        field          : 'libelleExam',
        headerName     : 'NOM EXAMEN',
        width          : 150,
        editable       : false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field          : 'idNiveau',
        headerName     : 'NIVEAU',
        width          : 80,
        editable       : false,
        hide           : true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field          : 'libelleNiveau',
        headerName     : 'NIVEAU',
        width          : 80,
        editable       : false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field          : 'libelleClasses',
        headerName     : 'CLASSES',
        width          : 150,
        editable       : false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field          : 'idClasses',
        headerName     : 'CLASSES',
        hide           : true,
        width          : 150,
        editable       : false,
        headerClassName:classes.GridColumnStyle
    },
   
    {
        field          : '',
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

                    <img src="icons/baseline_delete.png"  
                        width={17} 
                        height={17} 
                        style={{marginLeft:"1vw"}}
                        className={classes.cellPointer} 
                        onClick={(event)=> {
                            deleteRowConfirm(params.row.id);
                         }}
                        alt=''
                    />  

                </div>
            )}           
            
        },
    ];

    const columnsEn = [
        {
            field          : 'id',
            headerName     : 'ID',
            width          : 200,
            editable       : false,
            hide           : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field          : 'rang',
            headerName     : 'N°',
            width          : 50,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
       
        {
            field          : 'libelleExam',
            headerName     : 'EXAM NAME',
            width          : 150,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          : 'idNiveau',
            headerName     : 'LEVEL',
            width          : 80,
            editable       : false,
            hide           : true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          : 'libelleNiveau',
            headerName     : 'LEVEL',
            width          : 80,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          : 'libelleClasses',
            headerName     : 'CLASSES',
            width          : 150,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field          : 'idClasses',
            headerName     : 'CLASSES',
            hide           : true,
            width          : 150,
            editable       : false,
            hide           : true,
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

                        <img src="icons/baseline_delete.png"  
                            width={17} 
                            height={17} 
                            style={{marginLeft:"1vw"}}
                            className={classes.cellPointer} 
                            onClick={(event)=> {
                               deleteRowConfirm(params.row.id);
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
    

    function handleDeleteRow(params){
        if(params.field=='id'){
            //console.log(params.row.matricule);
            deleteRowConfirm(params.row.id);            
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
        inputs[1]= row.libelleExam;
        inputs[2]= row.idNiveau;
        inputs[3]= row.libelleNiveau;
        inputs[4]= row.idClasses;
        inputs[5]= row.libelleClasses;
 
        console.log("laligne",row);
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function consultRowData(row){
        var inputs=[];
   
        inputs[0]= row.id;
        inputs[1]= row.libelleExam;
        inputs[2]= row.idNiveau;
        inputs[3]= row.libelleNiveau;
        inputs[4]= row.idClasses;
        inputs[5]= row.libelleClasses;
     
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);
    }

    function addNewExam(exam) {       
        console.log('Ajout',exam);

        axiosInstance.post(`create-examen-officiel/`, {
            libelle     : exam.libelle,
            niveau      : exam.niveau,
            classes     : exam.classes,
            id_sousetab : exam.id_sousetab,
            id_user     : currentAppContext.idUser           
        }).then((res)=>{
            console.log(res.data);           
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")
            })
        })      
    }
    
    function modifyExam(exam) {
        console.log('Modif',exam);     
        axiosInstance.post(`update-examen-officiel/`, {
            id          : exam.id_exam,
            libelle     : exam.libelle,
            niveau      : exam.niveau,
            classes     : exam.classes,
            id_sousetab : currentAppContext.currentEtab,
            id_user     : currentAppContext.idUser
        }).then((res)=>{
            console.log(res.data);
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_modif_M"), 
                message:t("success_modif")
            })
        })
    }

    function deleteRowConfirm(rowId) {
        ROW_TO_DELETE_ID = rowId;

        chosenMsgBox = MSG_CONFIRM;
        currentUiContext.showMsgBox({
            visible:true, 
            msgType  : "question", 
            msgTitle : t("confirm_M"), 
            message  : t("confirm_delete")
        })
    } 

   

    function deleteExam(rowId){
        return new Promise(function(resolve, reject){
            axiosInstance
            .post(`delete-examen-officiel/`, {
                id:rowId,
                id_sousetab : currentAppContext.currentEtab,
                id_user     : currentAppContext.idUser
            }).then((res)=>{
                console.log(res.data.status)
                resolve(1);
            },(res)=>{
                console.log(res.data.status)
                reject(0);
            })     

        })       
    }

    function quitForm() {
        //ClearForm();
        setModalOpen(0)
    }
   
    function AddNewExamHandler(e){
        setModalOpen(1); 
        initFormInputs();
        // if(CURRENT_CLASSE_ID != undefined){
           
        // } else{
        //     chosenMsgBox = MSG_WARNING;
        //     currentUiContext.showMsgBox({
        //         visible  : true, 
        //         msgType  : "warning", 
        //         msgTitle : t("ATTENTION!"), 
        //         message  : t("must_select_class")
        //     })            
        // }
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
                getListExams(); 
                return 1;
            }

            // case MSG_SUCCESS_DELETE: {
            //     currentUiContext.showMsgBox({
            //         visible:false, 
            //         msgType:"", 
            //         msgTitle:"", 
            //         message:""
            //     }) 
            //     return 1;
            // }

            case MSG_WARNING: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }

            case MSG_CONFIRM: 
            {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                });  
                deleteExam(ROW_TO_DELETE_ID).then(()=>{
                    chosenMsgBox = MSG_SUCCESS;
                    currentUiContext.showMsgBox({
                        visible  : true, 
                        msgType  : "info", 
                        msgTitle : t("success_modif_M"), 
                        message  : t("success_modif")
                    });                    
                    return 1;
                });                
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
            case MSG_CONFIRM: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                });  
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
            printedETFileName = 'Liste_eleves('+CURRENT_CLASSE_LABEL+').pdf';
            setModalOpen(4);
            ElevePageSet=[];
            //ElevePageSet = [...splitArray([...gridRows], "Liste des eleves de la classe de " + CURRENT_CLASSE_LABEL, ROWS_PER_PAGE)];          
            ElevePageSet = createPrintingPages(PRINTING_DATA,i18n.language);
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
                <AddExam 
                    formMode     = {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  
                    actionHandler= {(modalOpen==1) ?  addNewExam : modifyExam } 
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
                    buttonAcceptText = {(currentUiContext.msgBox.msgType == "question")? t("yes") : t("ok") }
                    buttonRejectText = {t("no")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            
            <div className={classes.inputRow} >               
                <div className={classes.formTitle}>
                    {t("enreg_exams_M")} {t("session_M")}:{CURRENT_ANNEE_SCOLAIRE}  
                </div>                  
            </div>

            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('exams_list_M')}  
                        </div>
                      
                        {/* <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select id='selectClass1' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div> */}
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                       
                        <CustomButton
                            btnText={t('new_exam')}
                            hasIconImg= {true}
                            imgSrc='images/NewEvaluation.png'
                            imgStyle = {classes.grdBtnImgStyleP}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={AddNewExamHandler}
                            style={{width:"fit-content", paddingLeft:'0.3vw', paddingRight:'0.7vw'}}
                        />
                      
                        {/* <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printStudentList}
                            disable={(isValid==false)}   
                        />

                        */}
                    </div>
                        
                </div>
                    
                

             
                <div className={classes.gridDisplay} >
                    <StripedDataGrid
                        
                        rows={gridRows}
                        columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                        getCellClassName={(params) => (params.field==='libelleExam')? classes.gridMainRowStyle : classes.gridRowStyle }
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
            </div>
        </div>
        
    );
} 
export default NewOfficialExam;