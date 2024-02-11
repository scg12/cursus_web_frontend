import React from 'react';

import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import MultiSelect from '../../../multiSelect/MultiSelect';
import { useContext, useState, useEffect } from "react";
import {isMobile} from 'react-device-detect';
import axiosInstance from '../../../../axios';
import axios from 'axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {getTodayDate, changeDateIntoMMJJAAAA} from '../../../../store/SharedData/UtilFonctions';



var chosenMsgBox;
const MSG_SUCCESS_FP = 1;
const MSG_WARNING_FP = 2;
const MSG_ERROR_FP   = 3;
const MultiSelectId  = "MS-4"

var CURRENT_COMM;
var CURRENT_CLASSE_ID;
var CURRENT_CLASSE_LABEL;

var list_destinataire      = "";
var list_destinataires_ids = "";
var precDest_ids           = ""
var msgTitle               = "";
var msgDesciption          = "";

var tempTable;
var list_initiale_eleves;

function ParentsMsg(props) {
    const { t, i18n }       = useTranslation();
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme     = currentUiContext.theme;
    const [multiSelectVisible, setMultiSelectVisible] = useState(false);
    const [optClasses, setOptClasses] = useState(false);
    const [listEleves, setListEleves] = useState([]);
    const [gridRows, setGridRows]     = useState([]);
    const [listDestinataires, setListDestinataires] = useState("");
    
    

    
 
    useEffect(()=> {
        precDest_ids = "";
        currentUiContext.setIsParentMsgBox(false);   
        getEtabListClasses(); 
    },[]);


    const getEtabListClasses=()=>{
        tempTable=[{value: -1,      label: (i18n.language=='fr') ? ' --- Choisir --- ' : '--- Select ---'  }]
        let classes_user;
        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);

        if(currentAppContext.infoUser.is_prof_only) 
            classes_user = currentAppContext.infoUser.prof_classes;
        else {
            classes_user = currentAppContext.infoUser.admin_classes;
            let prof_classes = currentAppContext.infoUser.prof_classes;
            // console.log(pp_classes)
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

    
    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
      }
    }

    
    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }


    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
      }
    }

    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
      }
    }

    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
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

   
    /************************************ Handlers ************************************/    
    function moveOnMax(e,currentField, nextField){
        if(nextField!=null){
            e = e || window.event;
            if(e.keyCode != 9){
                if(currentField.value.length >= currentField.maxLength){
                    nextField.focus();
                }
            }
        }
     
    }
    
    function addDestinataire(e){
        setMultiSelectVisible(true);
    }


    function sendMsg(e){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',CURRENT_COMM);
        getFormData();
        console.log('apres:',CURRENT_COMM);

        var fomCheckErrorStr =  formDataCheck1(CURRENT_COMM);
        
        if(fomCheckErrorStr.length == 0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
           props.actionHandler(CURRENT_COMM);  
    
        } else {
            errorDiv.textContent = fomCheckErrorStr;
            errorDiv.className   = classes.formErrorMsg;            
        }
    }

    function getFormData(){
        CURRENT_COMM = {};
        CURRENT_COMM.id_sousetab  = currentAppContext.currentEtab;
        CURRENT_COMM.sujet        = msgTitle;
        CURRENT_COMM.message      = msgDesciption;
        CURRENT_COMM.date         = getTodayDate(); 
        CURRENT_COMM.emetteur     = currentAppContext.infoUser.user_name;
        CURRENT_COMM.id_eleves    = getIdDestinataires(listDestinataires,list_destinataires_ids);
        precDest_ids ="";
    }

    function getIdDestinataires(destinataires, destinatairesId){
        var tabDestinataires   = destinataires.split(',');
        var tabDestinatairesId = destinatairesId.split('_');

        console.log("destinataires", tabDestinatairesId, tabDestinataires);
        var ids_destinataires  = "";

        tabDestinataires.map((elt1, index)=>{
            var dest = tabDestinatairesId.find((elt2)=>elt2.split('*')[1] == elt1)

            if(index <tabDestinataires.length-1){
                ids_destinataires = ids_destinataires + dest.split('*')[0]+'_';
            } else {
                ids_destinataires = ids_destinataires + dest.split('*')[0];
            }

        });

        console.log("destinataires", ids_destinataires);
        return ids_destinataires;
    }


    function formDataCheck1(){
        var errorMsg='';

        if(CURRENT_COMM.id_eleves.length == 0) {
            errorMsg=t("enter_msg_recipient");
            return errorMsg;
        } 
       
        if(CURRENT_COMM.sujet.length == 0) {
            errorMsg=t("enter_msg_subject");
            return errorMsg;
        } 

        if(CURRENT_COMM.message.length == 0) {
            errorMsg=t("enter_correct_msg");
            return errorMsg;
        } 

       
        return errorMsg;
    }

    function getMsgTitle(e){
        msgTitle = e.target.value;
    }

   

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_FP: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);
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

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_FP: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
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

    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data)]
            list_initiale_eleves = [...listEleves];
            console.log(listEleves);
            setListEleves(listEleves);
        }) 
          
    }

    const formatList=(list) =>{
        var listElt;
        var tabelt=[];
        var rang = 1;
        var formattedList =[{id:-1, label:t('all'), nom:"", prenom:""}]
        list.map((elt)=>{
            listElt={};
            listElt.id           = elt.id;
            listElt.label        = elt.nom +' '+elt.prenom;
            listElt.nom          = elt.nom;
            listElt.matricule    = elt.matricule;
            listElt.classeId     = CURRENT_CLASSE_ID;
            listElt.classeLabel  = CURRENT_CLASSE_LABEL;
            listElt.prenom       = elt.prenom; 
            listElt.rang         = rang;           
            tabelt.push(false);              
            formattedList.push(listElt);  
            rang++;          
        });  

        return formattedList;
    }



    function classChangeHandler(e){
        if(e.target.value > 0){
            CURRENT_CLASSE_ID    = e.target.value;
            CURRENT_CLASSE_LABEL = optClasses.find((elv)=>elv.value == CURRENT_CLASSE_ID).label;
            getClassStudentList(e.target.value);
        }else{
            CURRENT_CLASSE_ID    = undefined;
            CURRENT_CLASSE_LABEL = undefined;
            setListEleves([]);
        }
    }

    function searchTextChangeHandler(e){
        var name = e.target.value;
        var matchedEleves =  list_initiale_eleves.filter((elt)=>elt.label.toLowerCase().includes(name.toLowerCase()));
        setListEleves(matchedEleves);
    }

    function validateSelectionHandler(e){       
        var gridData    = [...gridRows];
        precDest_ids    =  document.getElementById("hidden1_"+MultiSelectId).value;       
        var tabIdEleves = precDest_ids.split('_');
        console.log("elves", listEleves, precDest_ids)

        tabIdEleves.map((Elv)=>{
            var idElv = Elv.split('*')[0];
            var eleve = listEleves.find((elt)=>(elt.id == idElv));
            gridData.push(eleve);

        });        

        precDest_ids = "";
        setGridRows(gridData);       
        setListEleves([]);        
        setMultiSelectVisible(false);
        
    }

    function checkCharacters(e){       
        var regx = /^[A-Za-z0-9]+$/;
        e = e || window.event;
        if(regx.test(e.key)||e.keyCode==32){
            e.preventDefault();
            return false
        } 
    }

    function recipientChangeHandler(e){
        setListDestinataires(e.target.value);
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
            field: 'matricule',
            headerName: "MATRICULE",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },       
       
        {
            field: 'label',
            headerName: "NOM(S) ET PRENOM(S)",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },  

        {
            field: 'classeLabel',
            headerName: "CLASSE",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'classeId',
            headerName: "CLASSE",
            width: 110,
            editable: false,
            hide : true,
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
                        <div style={{}}>
                            <img src="icons/baseline_delete.png"  
                                width={17} 
                                height={17} 
                                className={classes.cellPointer} 
                                onClick={(event)=> {
                                //deleteRowConfirm(params.row.id);
                                }}
                                alt=''
                            />
                        </div>
                        
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
            field: 'matricule',
            headerName: "MATRICULE",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },       
       
        {
            field: 'displayedName',
            headerName: "NOM(S) ET PRENOM(S)",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },  

        {
            field: 'classeLabel',
            headerName: "CLASSE",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'classeId',
            headerName: "CLASSE",
            width: 110,
            editable: false,
            hide : true,
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
                        <div style={{}}>
                            <img src="icons/baseline_delete.png"  
                                width={17} 
                                height={17} 
                                className={classes.cellPointer} 
                                onClick={(event)=> {
                                //deleteRowConfirm(params.row.id);
                                }}
                                alt=''
                            />
                        </div>
                        
                    </div>
                ) 
            }          
                
        },
    ];
    
    /************************************ JSX Code ************************************/

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
        <div className={'card '+ classes.formContainerP4P}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/newBatchPhoto.png'/>
                </div>
                {props.formMode == "consult" ?         
                    <div className={classes.formMainTitle} >
                        {t("consultation_programmation_M")}
                    </div>
                    :
                    <div className={classes.formMainTitle} >
                        {t("new_prog_photo_M")}
                    </div>
                }                
            </div>

            <div id='errMsgPlaceHolder'/>

            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox && <BackDrop style={{height:'100vh'}}/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
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
            

          
            <div className={classes.formGridContent}>

            <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"7vh", marginLeft:"0vw", height:'2.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("photo_object")}:
                    </div>

                    {!(props.formMode=="consult")&&
                        <div> 
                            <input id="photoObject" type="text" onChange = {getMsgTitle}  className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-3.3vw', height:'1.3rem', width:'20vw', fontSize:'1.13vw', color:'#898585'}}/>
                        </div>
                    }

                    {(props.formMode=="consult")&&   
                        <div> 
                            <input id="photoObject" type="text" onChange = {getMsgTitle}  className={classes.inputRowControl}  disabled={true} defaultValue={currentUiContext.formInputs[1]} style={{marginLeft:'-8.3vw', height:'1.3rem', width:'20vw', fontSize:'1.13vw', color:'#898585', textOverflow:"ellipsis"}}/>
                        </div>
                    }
                </div>

                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"3vh", marginBottom:"3vh",  marginLeft:"0vw", height:'2.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("photo_desc")}:
                    </div>

                    {!(props.formMode=="consult")&&
                        <div> 
                            <input id="photoDesc" type="text" onChange = {getMsgTitle}  className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-3.3vw', height:'1.3rem', width:'20vw', fontSize:'1.13vw', color:'#898585'}}/>
                        </div>
                    }

                    {(props.formMode=="consult")&&   
                        <div> 
                            <input id="photoDesc" type="text" onChange = {getMsgTitle}  className={classes.inputRowControl}  disabled={true} defaultValue={currentUiContext.formInputs[1]} style={{marginLeft:'-8.3vw', height:'1.3rem', width:'20vw', fontSize:'1.13vw', color:'#898585', textOverflow:"ellipsis"}}/>
                        </div>
                    }
                </div>


              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle} style={{width:"70vw"}}>                  
                        <div className={classes.gridTitleText} >
                            {t('student_to_take_photo_M')}  :
                        </div>  

                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                        <MultiSelect
                                id                  = {MultiSelectId}
                                //-----Fields-----
                                optData             = {optClasses}
                                fetchedData         = {listEleves}
                                selectionMode       = {"multiple"}
                            
                                //-----Handler-----
                                optionChangeHandler     = {classChangeHandler}
                                searchTextChangeHandler = {searchTextChangeHandler}
                                selectValidatedHandler  = {validateSelectionHandler}
                            
                                //-----Styles-----
                                searchInputStyleP    = {{width:"13vw",height:"3.7vh", fontSize:"0.8vw"}}
                                comboBoxStyle       = {{width:"15vw", height:"3.7vh", marginBottom:"-1vh", border:"solid 1px #8eb1ec", fontSize:"0.8vw", borderRadius:"3px"}}
                                dataFieldStyle      = {{width:"15vw",minHeight:"5vh", borderRadius:"1vh", height:"fit-content", maxHeight:"63vh", overflowY:"scroll", border:"solid 1px gray", fontSize:"0.8vw", backgroundColor:"whitesmoke", position:"absolute", top:"15.7vh", fontWeight:"100"}}
                                MSContainerStyle    = {{/*border:"solid 1px grey",*/ paddingTop:"3vh", marginRight:"1vh"}}
                            />
                           
                        </div>                   
                        
                    </div>
                    
                        
                </div>
                    
                

             
                <div className={classes.gridDisplayP} >
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
                            //consultRowData(params.row)
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
                   
            <div className={classes.formButtonRowP}>
                <CustomButton
                    btnText={t('cancel')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                {!(props.formMode=="consult")&&
                    <CustomButton
                        btnText={t('save')}
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={sendMsg}
                        //disable={(isDownload) ? !isDownload :!fileSelected}
                    />
                }
            </div>

        </div>
       
    );
 }
 export default ParentsMsg;
 