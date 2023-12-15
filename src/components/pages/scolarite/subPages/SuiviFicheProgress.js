import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddClassMeeting from "../modals/AddClassMeeting";
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer } from '@react-pdf/renderer';
import PDFTemplate from '../reports/PDFTemplate';
import AddFicheProgess from '../modals/AddFicheProgess';
import StudentListTemplate from '../reports/StudentListTemplate';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;

let CURRENT_COURS_ID;
let CURRENT_COURS_LABEL;

var pageSet = [];

var listElt={};

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


function SuiviFicheProgress(props) {
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
        setGridRows([]);     
        
    },[]);


    const getEtabListClasses=()=>{
       var tempTable=[{value: '0',      label: (i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  '  }]
       let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
       let classes_user;
       
           classes_user = currentAppContext.infoUser.pp_classes;
           let admin_classes = currentAppContext.infoUser.admin_classes;
           // console.log(pp_classes)
           admin_classes.forEach(classe => {
               if((classes_user.filter( cl => cl.id === classe.id)).length<=0)
                   classes_user.push({"id":classe.id,"libelle":classe.libelle})

           });
       

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
        setOpClasse(tempTable);

    }

    
    const getCoursWithoutFP=(classeId)=>{
        var list_data = '';
        if(classeId!=0){
            axiosInstance.post(`list-cours-classe/`, {
                id_sousetab: currentAppContext.currentEtab,
                id_classe : classeId
            }).then((res)=>{
                console.log(res.data);
                list_data = res.data[0].id_cours;
                console.log(list_data);       
                if(list_data.length > 0){
                    axiosInstance.post(`get-cours-without-FP/`, {
                        ids_cours: list_data,
                    }).then((res)=>{
                        console.log("data returned",res.data);
                        list_data = [...formatList(res.data)];
                        setGridRows(list_data);
                    }) 
                }else{
                    CURRENT_CLASSE_ID = undefined;
                    CURRENT_CLASSE_LABEL='';
                    setGridRows([]);
                    setIsValid(false);
                }        
            }) 
        }         
    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.displayedName  = elt.first_name +' '+elt.last_name;
            listElt.nom = elt.first_name;
            listElt.prenom = elt.last_name;
            listElt.coursLabel = elt.libelle; 
            listElt.classeLabel = CURRENT_CLASSE_LABEL; 
            formattedList.push(listElt);
        })
        return formattedList;
    }


    function dropDownHandler(e){
       var list_cours='';
       var list_data =[];
        if(e.target.value != optClasse[0].value){
            setIsValid(true);
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getCoursWithoutFP(CURRENT_CLASSE_ID);           

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
        field: 'id',
        headerName: 'ID',
        width: 130,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
       
    {
        field: 'displayedName',
        headerName: "NOM DE L'ENSEIGNANT",
        width: 300,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'classeLabel',
        headerName: 'CLASSE',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

  /* {
        field: 'coursId',
        headerName: 'ID_COURS',
        width: 300,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },*/

    {
        field: 'coursLabel',
        headerName: 'COURS',
        width: 300,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: '',
        headerName: 'ACTION',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            return(
                <div className={classes.inputRow} onClick={(event)=>{event.ignore=true;}} style={{color:'blueviolet', cursor:'pointer'}}>
                    {t('upload_file')}
                </div>
            )
        }         
            
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
        field: 'displayedName',
        headerName: "TEACHER'S NAME",
        width: 300,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'classeLabel',
        headerName: 'CLASS',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    /*{
        field: 'coursId',
        headerName: 'ID_COURSE',
        width: 300,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },*/

    {
        field: 'coursLabel',
        headerName: 'COURSE',
        width: 300,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: '',
        headerName: 'ACTION',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            return(
                <div className={classes.inputRow} onClick={(event)=>{event.ignore=true;}} style={{color:'blueviolet', cursor:'pointer'}}>
                    {t('upload_file')}
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
    
    function handleUploadFP(row){   
        CURRENT_COURS_ID = row.id;    
        CURRENT_COURS_LABEL = row.coursLabel;
        currentUiContext.setIsParentMsgBox(false);
        setModalOpen(1);
    }

    
    function quitForm() {
        //ClearForm();
        getCoursWithoutFP(CURRENT_CLASSE_ID);
        setModalOpen(0)
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
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
                return 1;
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
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
                return 1;
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
            {(modalOpen==1) && <AddFicheProgess formMode="special" selectedClasse={{id:CURRENT_CLASSE_ID,label:CURRENT_CLASSE_LABEL}} selectedCours={{id:CURRENT_COURS_ID,label:CURRENT_COURS_LABEL}} cancelHandler={quitForm} />}
            {/*(modalOpen==2) && <AddFicheProgess formMode="special"  cancelHandler={quitForm} />*/}
            
            {(currentUiContext.msgBox.visible == true)  && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && currentUiContext.isParentMsgBox &&
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
                <div className={classes.formTitle}>
                    {t('SUIVI DES FICHES DE PROGRESSION')}  
                </div>                   
               
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('FICHES DE PROGRESSION ENCORE ATTENDUES')}  :
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
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                         
                       {/* <CustomButton
                            btnText={t('Obtenir le modele')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getNotifButtonStyle()}
                            btnTextStyle = {classes.notifBtnTextStyle}
                            btnClickHandler={()=>{setModalOpen(2);}}
                            disable={(isValid==false)}   
                            />*/}

                        <CustomButton
                            btnText={t('Alerter les prof')}
                            hasIconImg= {true}
                            imgSrc='images/alarme.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getNotifButtonStyle()}
                            btnTextStyle = {classes.notifBtnTextStyle}
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
                            getCellClassName={(params) => (params.field==='etatLabel' && params.row.etat ==1)?  classes.clotureStyle: (params.field==='etatLabel' && params.row.etat ==0) ? classes.enCoursStyle : classes.gridRowStyle }
                            //onCellClick={handleDeleteRow}
                            onRowClick={(params,event)=>{
                                if(event.ignore) {
                                    handleUploadFP(params.row)
                                }
                            }}  
                            
                            /*onRowDoubleClick ={(params, event) => {
                                event.defaultMuiPrevented = true;
                                consultRowData(params.row)
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
                  /*  :
                    null
                        */}
            
            </div>
        </div>
        
    );
} 
export default SuiviFicheProgress;