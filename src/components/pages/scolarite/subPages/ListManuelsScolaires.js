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
import {convertDateToUsualDate, ajouteZeroAuCasOu, getTodayDate, darkGrey} from '../../../../store/SharedData/UtilFonctions';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import PDFTemplate from '../reports/PDFTemplate';
import {isMobile} from 'react-device-detect';
import ListManuels from '../reports/ListManuels';
import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";
import AddManuel from '../modals/AddManuel';


let CURRENT_NIVEAU_ID;
let CURRENT_NIVEAU_LABEL;

var listElt ={};
var pageSet = [];

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const MSG_CONFIRM =3;

const ROWS_PER_PAGE= 40;
var ElevePageSet=[];
var printedETFileName ='';
var selected_niveau;
var ROW_TO_DELETE_ID;



function ListManuelsScolaires(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext   = useContext(UiContext);
    const currentAppContext  = useContext(AppContext);
    const selectedTheme      = currentUiContext.theme;

    const [isValid, setIsValid]      = useState(false);
    const [gridRows, setGridRows]    = useState([]);
    const [modalOpen, setModalOpen]  = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optNiveau, setOptNiveau]  = useState([]);
    const [imageUrl, setImageUrl]    = useState('');
    

    useEffect(()=> {        
        if(gridRows.length==0){
            CURRENT_NIVEAU_ID = undefined;
        }

        var cnv = document.getElementById('output');
        while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
        var cnx = cnv.getContext('2d');
        var url = darkGrey(document.getElementById("logo_url").value,cnv,cnx);
        setImageUrl(url);

        getEtabNiveaux();        
    },[]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;

    function getEtabNiveaux(){
        var tempTable=[]
        var tabNiveau=[];
        var tempTable=[{value: -1,      label: (i18n.language=='fr') ? '  Choisir un niveau  ' : '  Select level  '  }];
        
        tabNiveau =  currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == currentAppContext.currentEtab)
        
        tabNiveau.map((classe)=>{
        tempTable.push({value:classe.id_niveau, label:classe.libelle});
        });
        CURRENT_NIVEAU_ID = tempTable[0].value;
        setOptNiveau(tempTable);
    }

    

    const  getListManuel=(niveauId)=>{
        var listNiveaux = [];        
        axiosInstance.post(`list-manuel-scolaires/`, {
            id_niveau: niveauId,
        }).then((res)=>{
            console.log(res.data);
            listNiveaux = [...formatList(res.data.res)]
            console.log(listNiveaux);
            setGridRows(listNiveaux);
            console.log(gridRows);
        })  
     
    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList = [];
        list.map((elt)=>{
            listElt={};
            listElt.rang            = ajouteZeroAuCasOu(rang); 
            listElt.id              = elt.id;
            listElt.livre           = elt.livre;
            listElt.nom             = elt.nom;
            listElt.description     = elt.description;
            listElt.prix            = elt.prix;
            listElt.id_classes      = elt.id_classes;
            listElt.libelle_classes = elt.libelle_classes;          
            formattedList.push(listElt);
            rang ++;
        });

        return formattedList;
    }


    function dropDownHandler(e){
        if(e.target.value > 0){
            setIsValid(true);
            CURRENT_NIVEAU_ID = e.target.value; 
            CURRENT_NIVEAU_LABEL = optNiveau[optNiveau.findIndex((nivo)=>(nivo.value == CURRENT_NIVEAU_ID))].label;
            getListManuel(CURRENT_NIVEAU_ID);
            console.log(CURRENT_NIVEAU_LABEL)          
        }else{
            CURRENT_NIVEAU_ID = undefined;
            CURRENT_NIVEAU_LABEL='';
            setGridRows([]);
            setIsValid(false);
        }
    }
 
/*************************** DataGrid Declaration ***************************/    
const columnsFr = [
    
    {
        field: 'id',
        headerName: 'ID',
        width: 50,
        editable: false,
        hide: true,
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
        field: 'livre',
        headerName: 'NOM DU MANUEL',
        width: 180,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'description',
        headerName: 'DESCRIPTION',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'prix',
        headerName: 'PRIX',
        width: 150,
        editable: false,
        // hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'libelle_classes',
        headerName: 'CLASSES CIBLES',
        width: 150,
        editable: false,
        //hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'id_classes',
        headerName: 'CLASSES CIBLES',
        width: 150,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: '',
        headerName: ' ACTION',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            
            return(
               
                <div className={classes.inputRow} style={{marginLeft:"-1vw"}}>
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
        field: 'id',
        headerName: 'ID',
        width: 50,
        editable: false,
        hide: true,
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
        field: 'livre',
        headerName: 'MANUAL NAME',
        width: 180,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'description',
        headerName: 'DESCRIPTION',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'prix',
        headerName: 'PRICE',
        width: 150,
        editable: false,
        // hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'libelle_classes',
        headerName: 'ASSOCIATED CLASSES ',
        width: 150,
        editable: false,
        //hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'id_classes',
        headerName: 'ASSOCIATED CLASSES',
        width: 150,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },


    {
        field: '',
        headerName: ' ACTION',
        width: 80,
        editable: false,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            
            return(
              
                <div className={classes.inputRow} style={{marginLeft:"-1vw"}}>
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
                            deleteRowConfirm(params.row.id);
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
        
        inputs[0] = row.id;
        inputs[1] = row.livre;
        inputs[2] = row.description;
        inputs[3] = row.prix;
        inputs[4] = row.id_classes;
        inputs[5] = row.libelle_classes;
        
        console.log("laligne",row);
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);
    }

    function consultRowData(row){
        var inputs=[];
       
        inputs[0] = row.id;
        inputs[1] = row.livre;
        inputs[2] = row.description;
        inputs[3] = row.prix;
        inputs[4] = row.id_classes;
        inputs[5] = row.libelle_classes;
     
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);
    }


    function addNewManuel(manuel) {       
        console.log('Ajout',manuel);
           
        axiosInstance.post(`create-manuel-scolaire/`, {
            id_classes  : manuel.id_classes,
            id_sousetab : manuel.id_sousetab,
            id_niveau   : manuel.id_niveau,
            data        : manuel.data,
            id_user     : currentAppContext.idUser

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
    
    function modifyManuel(manuel) {
        console.log('Modif',manuel);
     
        axiosInstance.post(`update-manuel-scolaire/`, {
            id_manuel   : manuel.id_manuel,
            id_sousetab : currentAppContext.currentEtab,
            id_classes  : manuel.id_classes,
            data        : manuel.data,
            id_user     : currentAppContext.idUser

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

    function deleteRowConfirm(rowId) {
        ROW_TO_DELETE_ID = rowId;

        chosenMsgBox = MSG_CONFIRM;
        currentUiContext.showMsgBox({
            visible:true, 
            msgType  : "question", 
            msgTitle : t("confirm_M"), 
            message  : t("confirm_delete")
        });
       
    } 

    function deleteManuel(rowId){
        return new Promise(function(resolve, reject){
            axiosInstance
            .post(`delete-manuel-scolaire/`, {
                id_manuel          : rowId,
                id_classe_courante : '',               
                portee             : "niveau",
                id_user     : currentAppContext.idUser,
                id_sousetab : currentAppContext.currentEtab
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
   
    function addNewManuelHandler(e){
        if(CURRENT_NIVEAU_ID != undefined){
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
                getListManuel(CURRENT_NIVEAU_ID); 
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
            
            case MSG_CONFIRM: 
            {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                });  
                deleteManuel(ROW_TO_DELETE_ID).then(()=>{
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
        
        if(CURRENT_NIVEAU_ID != undefined){
            var PRINTING_DATA ={
                dateText          : 'Yaounde, ' + t('le')+' '+ getTodayDate(),
                leftHeaders       : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders     : [currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+'  Telephone:'+ currentAppContext.currentEtabInfos.tel],
                rightHeaders      : ["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", t("annee_scolaire")+' '+ currentAppContext.activatedYear.libelle],
                pageImages        : [imgUrl], 
                pageImagesDefault : [imgUrlDefault],
                pageTitle         : t("list_manuels")+ ' ' + t('for') +' '+ CURRENT_NIVEAU_LABEL,
                tableHeaderModel  : ["N°", t("manual_name"), t("description"), t("prix"), t("classes")],
                tableData         : [...gridRows],
                numberEltPerPage  : ROWS_PER_PAGE  
            };
            printedETFileName = 'Liste_manuels('+CURRENT_NIVEAU_LABEL+').pdf';
            setModalOpen(4);
            ElevePageSet=[];
           
            ElevePageSet = createPrintingPages(PRINTING_DATA, i18n.language);
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
                <AddManuel 
                    formMode         = {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'} 
                    currentLevel     = {CURRENT_NIVEAU_ID}
                    currentLeveLabel = {CURRENT_NIVEAU_LABEL} 
                    actionHandler    = {(modalOpen==1) ? addNewManuel : modifyManuel} 
                    cancelHandler    = {quitForm}
                />
            }
            {(modalOpen==4) &&              
                <PDFTemplate previewCloseHandler={closePreview}>
                    {isMobile?
                        <PDFDownloadLink  document ={<ListManuels pageSet={ElevePageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <ListManuels pageSet={ElevePageSet}/>
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
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("non")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            <div className={classes.inputRow} >
                <div className={classes.formTitle}>
                    {t('consult_document_list_M')} 
                </div>
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle} style={{width:"43vw"}}>                  
                        <div className={classes.gridTitleText} >
                            {t('document_list_M')}  :
                        </div>
                      
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select id='selectClass1' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optNiveau||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>
                    </div>
                    
                                
                    <div className={classes.gridAction}>
                        <CustomButton
                            btnText={t('new_manuel')}
                            hasIconImg= {true}
                            imgSrc='images/addBookP.png'
                            imgStyle = {classes.grdBtnImgStyleP}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={addNewManuelHandler}                             
                            style={{width:"10vw"}} 
                            disable={(isValid==false)}
                        />                        
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
                    <StripedDataGrid
                        
                        rows={gridRows}
                        columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                        getCellClassName={(params) => (params.field==='livre')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default ListManuelsScolaires;