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
import InternMsg from "../modals/InternMsg";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';

import {isMobile} from 'react-device-detect';
//import {createPrintingPages} from '../reports/PrintingModule';
import { useTranslation } from "react-i18next";


let CURRENT_DESTINATAIRE_ID;
let CURRENT_DESTINATAIRE_LABEL;

var listElt ={}



var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const ROWS_PER_PAGE= 40;
var ElevePageSet=[];
var printedETFileName ='';


function NewComIntern(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optDestinataire, setOpDestinataire] = useState([]);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        
        if(gridRows.length==0){
            CURRENT_DESTINATAIRE_ID = undefined;
        }
        currentUiContext.setIsParentMsgBox(false);

        setOpDestinataire(tabDestinataires);
        CURRENT_DESTINATAIRE_ID    = tabDestinataires[0].value; 
        CURRENT_DESTINATAIRE_LABEL = tabDestinataires[0].label;        
    },[]);

    var tabDestinataires =[
        {value:0, label:i18n.language=='fr'? "Tous" : "All"},
        {value:1, label:i18n.language=='fr'? "Enseignants" : "Teachers"},
        {value:2, label:i18n.language=='fr'? "Administration" : "Administration"}
    ]

   
    const  getListCommInternes=()=>{
        var listEleves = []
        axiosInstance.post(`list-msg-interne/`, {
            
        }).then((res)=>{
            console.log("commInternes",res.data.comms);
            listEleves = [...formatList(res.data.comms)]
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
            listElt.id_emetteur    = elt.id_emetteur;
            listElt.displayedName  = elt.nom +' '+elt.prenom;
            listElt.nom            = elt.nom;
            listElt.prenom         = elt.prenom;
            listElt.destinataires  = elt.destinataires;
            listElt.titreMsg       = elt.titreMsg;
            listElt.message        = elt.message;
            listElt.validite       = elt.validite;
            listElt.rang           = rang; 
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }


    function dropDownHandler(e){  
        CURRENT_DESTINATAIRE_ID = e.target.value; 
        CURRENT_DESTINATAIRE_LABEL = optDestinataire[optDestinataire.findIndex((classe)=>(classe.value == CURRENT_DESTINATAIRE_ID))].label;
        getListCommInternes(CURRENT_DESTINATAIRE_ID);   
        console.log(CURRENT_DESTINATAIRE_LABEL) 
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
            field: 'id_emetteur',
            headerName: "EMETTEUR",
            width: 100,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedName',
            headerName: "EMETTEUR",
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'destinataires',
            headerName: "DESTINATAIRE(S)",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },    
        {
            field: 'titreMsg',
            headerName: "TITRE MESSAGE",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'validite',
            headerName:"VALIDE JUSQU'AU",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
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
            field: 'id_emetteur',
            headerName: "MSG SENDER",
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedName',
            headerName: "MSG SENDER",
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'destinataires',
            headerName: "MSG RECEIVER(S)",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },    
        {
            field: 'titreMsg',
            headerName: "MSG TITLE",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'validite',
            headerName:"VALID UNTIL",
            width: 100,
            editable: false,
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

    function saveMsg(CURRENT_COMM) {       
        console.log('Ajout',CURRENT_COMM);
           
        axiosInstance.post(`save-msg-interne/`, {
            id_sousetab          : CURRENT_COMM.id_sousetab,
            sujet                : CURRENT_COMM.sujet,
            message              : CURRENT_COMM.message,
            date                 : CURRENT_COMM.date, 
            emetteur             : CURRENT_COMM.emetteur,
            date_debut_validite  : CURRENT_COMM.date_debut_validite,
            date_fin_validite    : CURRENT_COMM.date_fin_validite,
            id_destinataires     : CURRENT_COMM.id_destinataires,
            msgType              : CURRENT_COMM.msgType,            
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
    
    function modifyStudent(eleve) {
        console.log('Modif',eleve);
     
        axiosInstance.post(`update-eleve/`, {
            id_classe : CURRENT_DESTINATAIRE_ID,
            id : eleve.id, 
            matricule : eleve.matricule, 
            nom : eleve.nom,
            adresse : eleve.adresse,
            prenom : eleve.prenom, 
            sexe : eleve.sexe,
            date_naissance : eleve.date_naissance,
            lieu_naissance : eleve.lieu_naissance,
            date_entree : eleve.date_entree,
            nom_pere : eleve.nom_pere,
            prenom_pere : eleve.prenom_pere, 
            nom_mere : eleve.nom_mere,
            prenom_mere : eleve.prenom_mere, 
            tel_pere : eleve.tel_pere,    
            tel_mere : eleve.tel_mere,    
            email_pere : eleve.email_pere,
            email_mere : eleve.email_mere,
            photo_url : eleve.photo_url, 
            redouble : (eleve.redouble == "O") ? true : false,
            age :  eleve.age,
            est_en_regle : eleve.est_en_regle,
            etab_provenance : eleve.etab_provenance, 

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
   
    function saveNewMsgHandler(e){
        if(CURRENT_DESTINATAIRE_ID != undefined){
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
                getListCommInternes(CURRENT_DESTINATAIRE_ID); 
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
            {(modalOpen!=0) && <BackDrop style={{height:"100vh"}}/>}
            {(modalOpen >0 && modalOpen<3) && 
                <InternMsg 
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
                    {t('comm_interne_M')} 
                </div>
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('destinataire_M')}  :
                        </div>
                      
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select id='selectClass1' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optDestinataire||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                     
                        <CustomButton
                            btnText={t('nouv_communique')}
                            hasIconImg= {true}
                            imgSrc='images/NewComInterne.png'
                            //imgSrc='images/addNewUserOrg.png'
                            imgStyle = {classes.grdBtnImgStyleP}  
                            buttonStyle={getGridButtonStyle()}
                            style={{width:"12.3vw", height:"4.3vh"}}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={saveNewMsgHandler}
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
                        getCellClassName={(params) => (params.field==='displayedName')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default NewComIntern;