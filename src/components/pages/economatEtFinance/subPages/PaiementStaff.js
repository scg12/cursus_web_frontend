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
import AddPaiementStaff from "../modals/AddPaiementStaff";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, ajouteZeroAuCasOu} from '../../../../store/SharedData/UtilFonctions';

import {isMobile} from 'react-device-detect';
//import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_DESTINATAIRE_ID;
let CURRENT_DESTINATAIRE_LABEL;
var PAIEMENT_TO_CLOSE_ID;
var CURRENT_QUALITE;

var listElt ={}



var chosenMsgBox;
const MSG_SUCCESS  = 1;
const MSG_WARNING  = 2;
const MSG_CONFIRM  = 3;


function PaiementStaff(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        
        if(gridRows.length==0){
            CURRENT_DESTINATAIRE_ID = undefined;
        }

        getNonClosedPaiement();       
    },[]);

   
    const  getUserQualite=(userId)=>{
        return new Promise(function(resolve, reject){
            axiosInstance.post(`get-user-qualite/`, {
                id_sousetab : currentAppContext.currentEtab,
                user_id     : userId
            }).then((res)=>{
                console.log("qualite",res.data.res[0].qualite);
                resolve(res.data.res[0].qualite);
            })
        })
    }
   
    const  getNonClosedPaiement=()=>{
        var listEleves = []
        axiosInstance.post(`list-payement-en-cours/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data.res)]
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
            listElt.displayedName  = elt.nom +' '+elt.prenom;
            listElt.nom            = elt.nom;
            listElt.prenom         = elt.prenom;
            listElt.userId         = elt.userId;
            listElt.montant        = elt.montant;
            listElt.date           = elt.date;
            listElt.status         = elt.status == 'accepted' ? t("accepted") :t("initiated") ;
            listElt.rang           = ajouteZeroAuCasOu(rang); 
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    function closePaiementHandler(e, userId, idPaiement){
        PAIEMENT_TO_CLOSE_ID = idPaiement
        getUserQualite(userId).then((qualite)=>{
            CURRENT_QUALITE = qualite
            chosenMsgBox = MSG_CONFIRM;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("confirm_M"), 
                message:t("confirm_paiement_close")
            });

        })
       
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
            field: 'displayedName',
            headerName: "NOM(S) ET PRENOM(S)",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'montant',
            headerName: "MONTANT",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },    
        {
            field: 'date',
            headerName: "INITIE LE",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'status',
            headerName: "ETAT",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'userId',
            headerName: "UserID",
            width: 100,
            editable: false,
            hide    : true,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field          : '',
            headerName: 'ACTION',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow} style={{cursor:"pointer"}}>
                        {(params.row.status==t("accepted")) &&
                           <div onClick={(e)=>closePaiementHandler(e,params.row.userId,params.row.id)} style={{color:'blue'}}>{t("close_paiement")}</div>
                        }
                    </div>
                )}           
                
            },
        
    
    ];

    const columnsEn = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
       
        {
            field: 'displayedName',
            headerName: "NAME(S) AND SURNAME(S)",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'montant',
            headerName: "AMOUNT TO PAY",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },    
        {
            field: 'date',
            headerName: "INITIATED ON",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'status',
            headerName: "STATUS",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'userId',
            headerName: "UserID",
            width: 100,
            editable: false,
            hide    : true,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field          : '',
            headerName: 'ACTION',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow} style={{cursor:"pointer"}}>
                        {(params.row.status==t("accepted")) &&
                            <div onClick={(e)=>closePaiementHandler(e,params.row.userId,params.row.id)} style={{color:'blue'}}>{t("close_paiement")}</div>
                        }
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

    function initierPaiement(paiement) {       
        console.log('Ajout',paiement);
           
        axiosInstance.post(`initier-payement-personnel/`, {
            type_personnel : paiement.type_personnel,
            id_user        : paiement.id_user,
            montant        : paiement.montant,
            id_sousetab    : currentAppContext.currentEtab
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

    
    const  closeUserPaiement=(IdPaiement)=>{
        console.log("qualite",CURRENT_QUALITE, CURRENT_QUALITE.length)
        var listEleves = []
        axiosInstance.post(`cloturer-payement/`, {
            type_personnel     : CURRENT_QUALITE.trim(),
            id_payement_initie : IdPaiement,
            id_sousetab        : currentAppContext.currentEtab
           
        }).then((res)=>{
            console.log(res.data);
            getNonClosedPaiement();
        })  
        return listEleves;     
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
   
    function initiatePaiement(e){
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
                getNonClosedPaiement();   
                return 1;
            }


            case MSG_CONFIRM: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                closeUserPaiement(PAIEMENT_TO_CLOSE_ID);   
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

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getNonClosedPaiement();   
                return 1;
            }


            case MSG_CONFIRM: {
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

    const printStudentList=()=>{
        
         if(CURRENT_DESTINATAIRE_ID != undefined){
        //     var PRINTING_DATA ={
        //         dateText:'Yaounde, le 14/03/2023',
        //         leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
        //         centerHeaders:["College francois xavier vogt", "Ora et Labora","BP 125 Yaounde, Telephone:222 25 26 53"],
        //         rightHeaders:["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", "Annee scolaire 2022-2023"],
        //         pageImages:["images/collegeVogt.png"],
        //         pageTitle: "Liste des eleves de la classe de " + CURRENT_DESTINATAIRE_LABEL,
        //         tableHeaderModel:["matricule", "nom et prenom(s)", "date naissance", "lieu naissance", "enrole en", "Nom Parent", "nouveau"],
        //         tableData :[...gridRows],
        //         numberEltPerPage:ROWS_PER_PAGE  
        //     };
        //     printedETFileName = 'Liste_eleves('+CURRENT_DESTINATAIRE_LABEL+').pdf';
        //     setModalOpen(4);
        //     ElevePageSet=[];
        //     //ElevePageSet = [...splitArray([...gridRows], "Liste des eleves de la classe de " + CURRENT_DESTINATAIRE_LABEL, ROWS_PER_PAGE)];          
        //     ElevePageSet = createPrintingPages(PRINTING_DATA);
        //     console.log("ici la",ElevePageSet,gridRows);                    
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
            {(modalOpen >0 && modalOpen<3) && 
                <AddPaiementStaff 
                    formMode      = {(modalOpen==1) ? 'creation': 'consult'}  
                    actionHandler = {initierPaiement} 
                    cancelHandler = {quitForm}
                />
            }
            
            {(modalOpen!=0) && <BackDrop/>}
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
                    {t('paiement_personnel_M')} 
                </div>
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('list_of_waiting_M')}  
                        </div>
                      
                        {/* <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select id='selectClass1' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optDestinataire||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div> */}
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                     
                        <CustomButton
                            btnText={t('new_paiement')}
                            hasIconImg= {true}
                            imgSrc='images/addSalaireProf.png'
                            //imgSrc='images/addNewUserOrg.png'
                            imgStyle = {classes.grdBtnImgStyleP}  
                            buttonStyle={getGridButtonStyle()}
                            style={{width:"10.3vw", height:"4.3vh"}}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={initiatePaiement}
                            // disable={(isValid==false)}   
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
                        /> */}

                        {/* <CustomButton
                            btnText={t('importer')}
                            hasIconImg= {true}
                            imgSrc='images/import.png'
                            imgStyle = {classes.grdBtnImgStyle} 
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(isValid==false)}    
                        /> */}
                    </div>
                        
                </div>
                    
                

             
                <div className={classes.gridDisplay} >
                    <StripedDataGrid
                        
                        rows={gridRows}
                        columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                        getCellClassName={(params) => (params.field==='displayedName')? classes.gridMainRowStyle : (params.field==='status'&& params.value== t('initiated'))? classes.gridMainRowStyle : (params.field==='status'&& params.value==t('accepted'))? classes.gridAcceptedRowStyle : classes.gridRowStyle }
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
export default PaiementStaff;