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
import ParentsMsg from "../modals/ParentsMsg";
import MultiSelect from '../../../multiSelect/MultiSelect';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, ajouteZeroAuCasOu} from '../../../../store/SharedData/UtilFonctions';

import {isMobile} from 'react-device-detect';
//import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
var LIST_GENERALE_ELEVES = [];

var listElt = {}
var tempTable;
var list_initiale_eleves;
var MultiSelectId = "searchRecipient"


var list_destinataire    = "";
var list_destinataires_ids = "";



var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;

var MOUSE_INSIDE_DROPDOWN = false;



function RelationAvcParents(props) {
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
        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }
        getEtabListClasses(); 
    },[]);

   

    const getEtabListClasses=()=>{
        tempTable=[{value: -1,      label: (i18n.language=='fr') ? ' -- Choisir Classe -- ' : '-- Select Classe --'  }]
        let classes_user;
        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);

        if(currentAppContext.infoUser.is_prof_only) 
            classes_user = currentAppContext.infoUser.prof_classes;
        else {
            classes_user = currentAppContext.infoUser.admin_classes;
            let prof_classes = currentAppContext.infoUser.prof_classes;
          
            prof_classes.forEach(classe => {
                if((classes_user.filter( cl => cl.id === classe.id)).length<=0)
                    classes_user.push({"id":classe.id,"libelle":classe.libelle})

            });
        }

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
        setOptClasses(tempTable);
    }

    function classChangeHandler(e){
        if(e.target.value > 0){
            getClassStudentList(e.target.value);
            document.getElementById("searchText").value ="";
        }else{
            setListEleves([]);
            setGridRows([]);
            document.getElementById("searchText").value ="";
        }
    }


    const  getClassStudentList=(classId)=>{
        var listEleves       = [];
        LIST_GENERALE_ELEVES = [];
        axiosInstance.post(`get-message-parent/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves           = [...formatListEleves(res.data.res)];
            LIST_GENERALE_ELEVES = [...formatListEleves(res.data.res)];

            list_initiale_eleves = [...listEleves];
            console.log(listEleves);
            setListEleves([]);
            setGridRows(listEleves);
        })
    }

    function getListMessages(classeId){
        var listEleves = []
        axiosInstance.post(`get-message-parent/`, {
            id_classe: classeId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatListEleves(res.data.res)]         
            console.log("toto ",listEleves);
            setGridRows(listEleves);
        }) 
    }


    const formatListEleves=(list) =>{
        var listElt;       
        var formattedList =[]
        var rang = 1;
        list.map((elt)=>{
            listElt = {};
            listElt.rang          = ajouteZeroAuCasOu(rang);
            listElt.id            = elt.id+"_"+rang;
            listElt.label         = elt.nom +' '+elt.prenom;
            listElt.displayedName = elt.nom +' '+elt.prenom;
            listElt.nom           = elt.nom;
            listElt.prenom        = elt.prenom;
            listElt.matricule     = elt.matricule;
            listElt.date          = (elt.msg.length==0) ? "":elt.msg.split('&&')[4];
            listElt.emetteur      = (elt.msg.length==0) ? "":elt.msg.split('&&')[1];
            listElt.titre_message = (elt.msg.length==0) ? "":elt.msg.split('&&')[2];
            listElt.message       = (elt.msg.length==0) ? "":elt.msg.split('&&')[3];
            formattedList.push(listElt); 
            rang++;                       
        });
        return formattedList;
    }

    function searchTextChangeHandler(e){
        var name = e.target.value;
        console.log("fffff",name,LIST_GENERALE_ELEVES)
        //var tabEleves     = [...listEleves];        
        var matchedEleves =  LIST_GENERALE_ELEVES.filter((elt)=>elt.displayedName.toLowerCase().includes(name.toLowerCase()));
        setGridRows(matchedEleves);
        setListEleves(matchedEleves);
    }


    function validateSelectionHandler(e){
        list_destinataire      = document.getElementById("hidden2_"+MultiSelectId).value;
        list_destinataires_ids = document.getElementById("hidden1_"+MultiSelectId).value;

        var searchedName       =  document.getElementById("searchText").value;
        var matchedEleves =  LIST_GENERALE_ELEVES.filter((elt)=>elt.displayedName.toLowerCase().includes(searchedName.toLowerCase()));
        setListEleves([]);
        setGridRows(matchedEleves);
        setMultiSelectVisible(false);
        
        // setListEleves([]);
        // setOptClasses(tempTable);
        // setMultiSelectVisible(false);
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
            field: 'date',
            headerName: "DATE",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'emetteur',
            headerName: "EMETTEUR",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
       
        {
            field: 'displayedName',
            headerName: "DESTINATAIRE",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },  

        {
            field: 'titre_message',
            headerName: "TITRE MESSAGE",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        }
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
            field: 'date',
            headerName: "DATE",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'emetteur',
            headerName: "SENDER",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
       
        {
            field: 'displayedName',
            headerName: "RECIPIENT",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },  

        {
            field: 'titre_message',
            headerName: "MESSAGE TITLE",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        }
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


    function saveMsg(CURRENT_COMM) {       
        console.log('Ajout',CURRENT_COMM);
        var listEleves = [];
        axiosInstance.post(`save-msg-parent/`, {
            id_sousetab : CURRENT_COMM.id_sousetab,
            sujet       : CURRENT_COMM.sujet,
            message     : CURRENT_COMM.message,
            date        : CURRENT_COMM.date, 
            emetteur    : CURRENT_COMM.emetteur,
            id_eleves   : CURRENT_COMM.id_eleves,
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
            // listEleves = [...formatList(res.data.comms)]
            // setGridRows(listEleves);
        })      
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
                getListMessages(CURRENT_CLASSE_ID); 
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
        <div className={classes.formStyleP} onClick={()=>{if(!MOUSE_INSIDE_DROPDOWN && listEleves.length>0) {document.getElementById("hidden1_"+MultiSelectId).value = ""; setListEleves([]);}}}>
            {(modalOpen!=0) && <BackDrop style={{height:"100vh"}}/>}
            {(modalOpen >0 && modalOpen<3) && 
                <ParentsMsg 
                    formMode      = {(modalOpen==1) ? 'creation': 'consult'}  
                    actionHandler = {saveMsg} 
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
                    {t('MSG_parent_M')} 
                </div>
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle} style={{width:"47vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('sent_Msg_by_class_M')}  :
                        </div>
                      
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <MultiSelect
                                id                  = {MultiSelectId}
                                //-----Fields-----
                                optData             = {optClasses}
                                fetchedData         = {listEleves}
                                selectionMode       = {"single"}
                                placeholder         = {"--- "+t("name_to_seach")+" ---"}
                            
                                //-----Handler-----
                                optionChangeHandler     = {classChangeHandler      }
                                searchTextChangeHandler = {searchTextChangeHandler }
                                selectValidatedHandler  = {validateSelectionHandler}
                                mouseLeave              = {()=>{MOUSE_INSIDE_DROPDOWN = false}}
                                mouseEnter              = {()=>{MOUSE_INSIDE_DROPDOWN = true }}

                            
                                //-----Styles-----
                                searchInputStyle    = {{fontSize:"0.87vw", height:"4.7vh"}}
                                searchInputStyleP   = {{height:"4vh",backgroundColor:"ghostwhite"}}
                                comboBoxStyle       = {{width:"13vw", height:"4vh", border:"solid 2px #8eb1ec", fontSize:"1vw", borderRadius:"3px"}}
                                dataFieldStyle      = {{minHeight:"5vh", borderRadius:"1vh", height:"fit-content", maxHeight:"53vw", overflowY:"scroll", border:"solid 1px gray", fontSize:"0.8vw", fontWeight:100, backgroundColor:"whitesmoke", position:"absolute", top:"22.3vh", width:"13vw"}}
                                MSContainerStyle    = {{/*border:"solid 1px grey",*/ padding:"1vh", marginRight:"1vh", marginBottom:"-1vh"}}
                            />
                           
                        </div>
                    </div>
                    
                                
                    <div className={classes.gridAction}>
                       <CustomButton
                            btnText={t('envoi_msg')}
                            hasIconImg= {true}
                            imgSrc='images/Sms.png'
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
export default RelationAvcParents;