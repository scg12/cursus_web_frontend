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
import BatchPhotoProg from "../modals/BatchPhotoProg";
import BatchPhotoPic from "../modals/BatchPhotoPic";
import MultiSelect from '../../../multiSelect/MultiSelect';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, ajouteZeroAuCasOu} from '../../../../store/SharedData/UtilFonctions';

import {isMobile} from 'react-device-detect';
//import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
var LIST_GENERALE_ELEVES;

var listElt = {}
var tempTable;
var list_initiale_eleves;
var MultiSelectId = "searchRecipient"

var SELECTED_BATCHPHOTO_ID;
var CURRENT_PHOTO_LIST;


var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const MSG_CONFIRM =3;



function WebcamCapture(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid]       = useState(false);
    const [gridRows, setGridRows]     = useState([]);
    const [modalOpen, setModalOpen]   = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasses, setOptClasses] = useState(false);
    const [listEleves, setListEleves] = useState([]);
    const [multiSelectVisible, setMultiSelectVisible] = useState(false);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        currentUiContext.setIsParentMsgBox(true);          
        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }
        getListProgrammations(); 
    },[]);

    var tabPlanif = [
        {id:1,  rang:1, libelle:"Photo Identite", description:"ggggggggg", date_creation:"12/05/2024", etat:0, etatLabel:"En cours" },
        {id:2,  rang:2, libelle:"Photo Identite", description:"ggggggggg", date_creation:"12/05/2024", etat:0, etatLabel:"En cours" },
        {id:3,  rang:3, libelle:"Photo Identite", description:"ggggggggg", date_creation:"12/05/2024", etat:1, etatLabel:"Cloture " },
    ]

    const getListProgrammations=()=>{
        var listProg;
        axiosInstance.post(`get-liste-programmations-photo/`, {
            id_setab: currentAppContext.currentEtab,
        }).then((res)=>{
            console.log(res.data);
            listProg = [...formatList(res.data.res)];         
            console.log("programmations",listProg);
            setGridRows(listProg);
        })
    }


    const formatList=(list) =>{
        var listElt;       
        var formattedList =[]
        var rang = 1;
        list.map((elt)=>{
            listElt = {};
            listElt.rang          = ajouteZeroAuCasOu(rang);
            listElt.id            = elt.id;
            listElt.libelle       = elt.libelle;
            listElt.description   = elt.but;
            listElt.date_creation = elt.date;
            listElt.etat          = elt.etat;
            listElt.etatLabel     = elt.etat==0? t('en_cours'):t('cloture');  
            listElt.elvPhotos     = elt.elvPhotos;       
            formattedList.push(listElt); 
            rang++;                       
        });
        return formattedList;
    }

    const formatBatchPhotoList=(list) =>{
        var listElt;
        var tabelt=[];
        var rang = 1;
        
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id           = elt.id;
            listElt.label        = elt.nom +' '+elt.prenom;
            listElt.nom          = elt.nom;
            listElt.matricule    = elt.matricule;
            listElt.classeLabel  = elt.classe_libelle;
            listElt.classeId     = elt.classe_id;           
            listElt.prenom       = elt.prenom; 
            listElt.rang         = ajouteZeroAuCasOu(rang);           
            tabelt.push(false);              
            formattedList.push(listElt);  
            rang++;          
        });  

        return formattedList;
    }

    function startBatchPhoto(row){
        SELECTED_BATCHPHOTO_ID = row.id;
        CURRENT_PHOTO_LIST     = [...row.elvPhotos];
        setModalOpen(3);
    }

    function lookBatchPhoto(row){
        SELECTED_BATCHPHOTO_ID = row.id;
        CURRENT_PHOTO_LIST     = [...row.elvPhotos];
        setModalOpen(4);
    }

    function editBatchPhoto(row){
        var inputs=[]; 
        SELECTED_BATCHPHOTO_ID = row.id;
        CURRENT_PHOTO_LIST     = [...formatBatchPhotoList(row.elvPhotos)];
              
        inputs[0]= row.id;
        inputs[1]= row.libelle;
        inputs[2]= row.description;
        inputs[3]= row.date_creation;
        inputs[4]= row.etat;

        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);
    }

    function deleteBatchPhoto(rowId){
        SELECTED_BATCHPHOTO_ID = rowId;

        chosenMsgBox = MSG_CONFIRM;
        currentUiContext.showMsgBox({
            visible:true, 
            msgType  : "question", 
            msgTitle : t("confirm_M"), 
            message  : t("confirm_delete")
        });
       
    }

    /*************************** DataGrid Declaration ***************************/    
    const columnsFr = [
        {
            field: 'rang',
            headerName: "N°",
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'id',
            headerName: "ID",
            width: 50,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'libelle',
            headerName: "LIBELLE",
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'description',
            headerName: "DESCRIPTION",
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
       

        {
            field: 'date_creation',
            headerName: "DATE CREATION",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'etat',
            headerName: "ETAT",
            width: 100,
            editable: false,
            hide: true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'etatLabel',
            headerName: "ETAT",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'elvPhotos',
            headerName: "PHOTOS_OBJ",
            width: 100,
            editable: false,
            hide: true,
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
                    <div className={classes.inputRow}>
                        {params.row.etat==0?
                            <div style={{width:"5.7vw"}}>
                                <img src="images/ApPhoto.png"  
                                    width={18} 
                                    height={18}
                                    title={t('start_photo')} 
                                    className={classes.cellPointer} 
                                    onClick={(e)=> {
                                        startBatchPhoto(params.row);
                                    }}
                                    alt=''
                                />
                            </div>
                            :
                            <div style={{width:"fit-content", marginLeft:"-4.7vw"}}>
                                <img src="images/lookPhoto4x4.png"  
                                    width={23} 
                                    height={23} 
                                    title={t('look_photo')}
                                    className={classes.cellPointer} 
                                    onClick={(event)=> {
                                        lookBatchPhoto(params.row);
                                    }}
                                    alt=''
                                />
                            </div>
                        }

                        {params.row.etat==0 &&
                            <div style={{width:"5.7vw"}}>
                                <img src="icons/baseline_edit.png"  
                                    width={17} 
                                    height={17} 
                                    title={t('modify')}
                                    className={classes.cellPointer} 
                                    onClick={(event)=> {
                                        editBatchPhoto(params.row);
                                    }}
                                    alt=''
                                />

                            </div>
                        }

                        {params.row.etat==0 &&
                            <div style={{width:"5.7vw"}}>
                                <img src="icons/baseline_delete.png"  
                                    width={17} 
                                    height={17} 
                                    title={t('delete')}
                                    className={classes.cellPointer} 
                                    onClick={(e)=> {
                                        deleteBatchPhoto(params.row.id)
                                    }}
                                    alt=''
                                />
                            </div>
                        }
                        
                    </div>
                ) 
            }          
                
        },

       
        
    ];

    const columnsEn = [
        {
            field: 'rang',
            headerName: "N°",
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'id',
            headerName: "ID",
            width: 50,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },


        {
            field: 'libelle',
            headerName: "LABEL",
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'description',
            headerName: "DESCRIPTION",
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
       

        {
            field: 'date_creation',
            headerName: "CREATION DATE",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'etat',
            headerName: "STATUS",
            width: 100,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'etatLabel',
            headerName: "STATUS",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'elvPhotos',
            headerName: "PHOTOS_OBJ",
            width: 100,
            editable: false,
            hide: true,
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
                    <div className={classes.inputRow}>
                        {params.row.etat==0?
                            <div style={{width:"5.7vw"}}>
                                <img src="images/ApPhoto.png"  
                                    width={18} 
                                    height={18}
                                    title={t('start_photo')} 
                                    className={classes.cellPointer} 
                                    onClick={(event)=> {
                                        startBatchPhoto(params.row.id);
                                    }}
                                    alt=''
                                />
                            </div>
                            :
                            <div style={{width:"fit-content", marginLeft:"-4.7vw"}}>
                                <img src="images/lookPhoto4x4.png"  
                                    width={25} 
                                    height={25} 
                                    title={t('look_photo')}
                                    className={classes.cellPointer} 
                                    onClick={(event)=> {
                                        lookBatchPhoto(params.row.id);
                                    }}
                                    alt=''
                                />
                            </div>
                        }
                        
                        {params.row.etat==0 &&
                            <div style={{width:"5.7vw"}}>
                                <img src="icons/baseline_edit.png"  
                                    width={17} 
                                    height={17} 
                                    title={t('modify')}
                                    className={classes.cellPointer} 
                                    onClick={(event)=> {
                                        editBatchPhoto(params.row.id);
                                    }}
                                    alt=''
                                />
                            </div>
                        }
                        
                        {params.row.etat==0 &&
                            <div style={{width:"5.7vw"}}>
                                <img src="icons/baseline_delete.png"  
                                    width={17} 
                                    height={17} 
                                    title={t('delete')}
                                    className={classes.cellPointer} 
                                    onClick={(event)=> {
                                        deleteBatchPhoto(params.row.id)
                                    }}
                                    alt=''
                                />
                            </div>
                        }
                        
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
   
    function consultRowData(row){
        var inputs=[];       
        inputs[0]= row.date;
        inputs[1]= row.emetteur;
        inputs[2]= row.displayedName;
        inputs[3]= row.titre_message;
        inputs[4]= row.message;

        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);
    }


    function saveBatchPhoto(CURRENT_BATCH_PHOTO) { 

        console.log('Ajout',CURRENT_BATCH_PHOTO);
        
        axiosInstance.post(`liste-eleves-pour-photo/`, {
            libelle       : CURRENT_BATCH_PHOTO.libelle,
            but           : CURRENT_BATCH_PHOTO.but,
            date          : CURRENT_BATCH_PHOTO.date,
            id_sousetab   : CURRENT_BATCH_PHOTO.id_sousetab,
            id_classe     : CURRENT_BATCH_PHOTO.id_classe,
            id_eleves     : CURRENT_BATCH_PHOTO.id_eleves,
            etat          : CURRENT_BATCH_PHOTO.etat,
        }).then((res)=>{
            console.log(res.data);

            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")
            });
        })      
    }


    
    // function saveBatchPhoto(CURRENT_BATCH_PHOTO) { 

    //     console.log('Ajout',CURRENT_BATCH_PHOTO);
    //     //var listEleves = [];
    //     axiosInstance.post(`liste-eleves-pour-photo/`, {
    //         libelle     : CURRENT_BATCH_PHOTO.libelle,
    //         but         : CURRENT_BATCH_PHOTO.but,
    //         id_sousetab : CURRENT_BATCH_PHOTO.id_sousetab,
    //         id_classe   : CURRENT_BATCH_PHOTO.id_classe,
    //         id_eleves   : CURRENT_BATCH_PHOTO.id_eleves,
    //     }).then((res)=>{
    //         console.log(res.data);

    //         chosenMsgBox = MSG_SUCCESS;
    //         currentUiContext.showMsgBox({
    //             visible:true, 
    //             msgType:"info", 
    //             msgTitle:t("success_add_M"), 
    //             message:t("success_add")
    //         });
    //     })      
    // }

    
    function updateBatchPhoto(CURRENT_BATCH_PHOTO) { 

        console.log('update',CURRENT_BATCH_PHOTO);
        //var listEleves = [];
        axiosInstance.post(`update-liste-eleves-pour-photo/`, {          
            id_liste    : CURRENT_BATCH_PHOTO.id_liste,
            libelle     : CURRENT_BATCH_PHOTO.libelle,
            but         : CURRENT_BATCH_PHOTO.but,
            id_eleves   : CURRENT_BATCH_PHOTO.id_eleves,
            // id_sousetab : CURRENT_BATCH_PHOTO.id_sousetab,
            // id_classe   : CURRENT_BATCH_PHOTO.id_classe,
        }).then((res)=>{
            console.log(res.data);

            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")
            });
        })      
    }
    
  

    function delBatchPhoto(rowId){
        return new Promise(function(resolve, reject){
            axiosInstance
            .post(`delete-liste-eleves-pour-photo/`, {
                id : rowId,
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
        getListProgrammations();
        setModalOpen(0);
        currentUiContext.setIsParentMsgBox(true);
    }
   
    function sendParentMsgHandler(e){
        setModalOpen(1); 
        initFormInputs();
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
                getListProgrammations(); 
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
                
                delBatchPhoto(SELECTED_BATCHPHOTO_ID).then(()=>{
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
              
                return 1;
            }

            case MSG_CONFIRM: 
            {  currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                });  
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
            {(modalOpen!=0) && <BackDrop style={{height:"100vh"}}/>}
            {(modalOpen == 1) && 
                <BatchPhotoProg 
                    formMode      = 'creation'
                    photoList     = {[]}
                    actionHandler = {saveBatchPhoto} 
                    cancelHandler = {quitForm}
                />
            }

            {(modalOpen == 2) && 
                <BatchPhotoProg 
                    batchPhotoId  = {SELECTED_BATCHPHOTO_ID}
                    photoList     = {CURRENT_PHOTO_LIST}
                    formMode      = 'modif'  
                    actionHandler = {updateBatchPhoto} 
                    cancelHandler = {quitForm}
                />
            }

            {(modalOpen == 3) && 
                <BatchPhotoPic 
                    batchPhotoId  = {SELECTED_BATCHPHOTO_ID}
                    photoList     = {CURRENT_PHOTO_LIST}
                    formMode      = 'creation'  
                    actionHandler = {updateBatchPhoto} 
                    cancelHandler = {quitForm}
                />
            }

            {(modalOpen == 4) && 
                <BatchPhotoPic 
                    batchPhotoId  = {SELECTED_BATCHPHOTO_ID}
                    photoList     = {CURRENT_PHOTO_LIST}
                    formMode      = 'none'  
                    actionHandler = {deleteBatchPhoto} 
                    cancelHandler = {quitForm}
                />
            }
            
            {(modalOpen!=0) && <BackDrop style={{height:"100vh"}}/>}
            {(currentUiContext.msgBox.visible == true)&& <BackDrop style={{height:"100vh"}}/>}
            {(currentUiContext.msgBox.visible == true && currentUiContext.isParentMsgBox)&&
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
                    {t('creation_planification_M')} 
                </div>
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('planification_list_M')}  :
                        </div>                     
                        
                    </div>
                    
                                
                    <div className={classes.gridAction}>
                       <CustomButton
                            btnText={t('new_prog_photo')}
                            hasIconImg= {true}
                            imgSrc='images/newBatchPhoto.png'
                            //imgSrc='images/addNewUserOrg.png'
                            imgStyle = {classes.grdBtnImgStyleP}  
                            buttonStyle={getGridButtonStyle()}
                            style={{width:"12.3vw", height:"4.3vh"}}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={sendParentMsgHandler}
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
                                //handleEditRow(params.row)
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
export default WebcamCapture;