import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import MsgBox from '../../../msgBox/MsgBox';
import MultiSelect from '../../../multiSelect/MultiSelect';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {changeDateIntoMMJJAAAA, formatCurrency} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRRENT_COURS_ID;
let SELECTED_DATE;

var listElt ={}

var JOUR_DEB="", MOIS_DEB="", YEAR_DEB="", DATEDEB_VERIF='';
var JOUR_FIN="", MOIS_FIN="", YEAR_FIN="", DATEFIN_VERIF='';

var listEleves;


var chosenMsgBox;
const MSG_SUCCESS_RECAP =11;
const MSG_WARNING_RECAP =12;
const MSG_ERROR_RECAP   =13;
const MultiSelectId     ='MS-2';


var LIST_GEN_PAIEMENTS;
var LIST_GEN_ELEVES;
var LISTE_FILTRE;

var tempTable;
var list_initiale_eleves;
var list_destinataire    = "";
var list_destinataires_ids = "";




function EtatsPaiement(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
   
    const [gridRows, setGridRows] = useState([]);
    const [absent, setAbsent]= useState(0);
    const [modalOpen, setModalOpen  ]      = useState(0); //0 = close, 1=creation, 2=modif
    const [optClasses, setOpClasses ]      = useState([]);
    const [isDateFull, setIsDateFull]      = useState(false);
    const [totalPaye,  setTotalPaye ]      = useState(0);
    const [totalAttendu, setTotalAttendu]  = useState(0);
    const [totalRestant, setTotalRestant]  = useState(0);
    const [listEleves,   setListEleves  ]  = useState([]);
   
   
    

    useEffect(()=> {
        currentUiContext.setIsParentMsgBox(false);
        if(gridRows.length ==0){
            CURRENT_CLASSE_ID = undefined;
        }    
        getEtabListClasses();    
    },[]);



    const getEtabListClasses=()=>{
        var tempTable=[{value: -1 ,      label:(i18n.language=='fr')? "------- Choisir ------":"------- Select ------"}];

        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
        console.log(classes)
        let classes_user;
        if(currentAppContext.infoUser.is_prof_only) 
            classes_user = currentAppContext.infoUser.prof_classes;
        else{
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
           
        setOpClasses(tempTable); 
    }


    function classChangeHandler(e){
        if(e.target.value > 0){
            setListEleves([]);
            getClassListPaiements(e.target.value);
        }else{
            
            setGridRows([]);
            setListEleves([]);
            document.getElementById("searchText").value ="";
        }
    }

   
    function searchTextChangeHandler(e){
        var name = e.target.value;
        setListEleves(LIST_GEN_ELEVES);
        console.log("fffff",name,listEleves);
        
        var matchedEleves =  LIST_GEN_ELEVES.filter((elt)=>elt.label.toLowerCase().includes(name.toLowerCase()));
        LISTE_FILTRE      =  LIST_GEN_PAIEMENTS.filter((elt)=>elt.displayedName.toLowerCase().includes(name.toLowerCase()));
        
        setListEleves(matchedEleves);
        setGridRows(LISTE_FILTRE);
        calculTotaux(LISTE_FILTRE);
        
    }

    function validateSelectionHandler(e){
        var name = document.getElementById("searchText").value;
        LISTE_FILTRE = LIST_GEN_PAIEMENTS.filter((elt)=>elt.displayedName.toLowerCase().includes(name.toLowerCase()));
        setGridRows(LISTE_FILTRE);
        calculTotaux(LISTE_FILTRE);
        setListEleves([]);
    }



    const  getClassListPaiements=(classeId)=>{
        var listEleves = []
        axiosInstance.post(`bilan-paiement-frais-scolarite/`, {
            id_classe: classeId,
            date_deb : "",
            date_fin : ""
        }).then((res)=>{
            console.log(res.data);
            listEleves           = [...formatListEleves(res.data.res)];
            LIST_GEN_PAIEMENTS   = [...formatListPaie(res.data.res)];
            LIST_GEN_ELEVES      = [...listEleves];
            
            calculTotaux(LIST_GEN_PAIEMENTS);
            console.log(listEleves);

            //setListEleves(listEleves);
            setGridRows(LIST_GEN_PAIEMENTS);
            console.log(gridRows);
        })  
        return listEleves;     
    }

    const formatListPaie=(list) =>{
        var formattedList = [];
        var rang = 1;
        list.map((elt)=>{
            listElt={};
            listElt.id                        = elt.id;
            listElt.matricule                 = elt.matricule;
            listElt.displayedName             = elt.nom +' '+elt.prenom;           
            listElt.nom                       = elt.nom;
            listElt.prenom                    = elt.prenom;
            listElt.displayedMontant          = formatCurrency(elt.montant)+' FCFA';

            listElt.montantToPay              = elt.total_tranches;
            listElt.montantPaye               = elt.montant;
            listElt.montantRestant            = elt.total_tranches - elt.montant;

            listElt.displayedMontantToPay     = formatCurrency( listElt.montantToPay) +' FCFA';
            listElt.displayedMontantPaye      = formatCurrency(listElt.montantPaye)   +' FCFA';
            listElt.displayedMontantRestant   = formatCurrency(listElt.montantRestant)+' FCFA';
            listElt.rang                      = rang;
            formattedList.push(listElt);  
            rang++;          
        });

       return formattedList;
    }

    function formatListEleves(list){
        var formattedList = [];       
        list.map((elt)=>{
            listElt = {};
            listElt.id         = elt.id;
            listElt.matricule  = elt.matricule;
            listElt.label      = elt.nom +' '+elt.prenom;           
            formattedList.push(listElt);                     
        });

       return formattedList;
    }


    function calculTotaux(list){
        var sommPaye    = 0;
        var sommAPayer  = 0;
        var sommRestant = 0;

        list.map((elt)=>{
            sommPaye   = sommPaye    + elt.montantPaye;
            sommAPayer = sommAPayer  + elt.montantToPay;
            sommRestant= sommRestant + elt.montantRestant;
        });
        setTotalPaye(sommPaye);
        setTotalAttendu(sommAPayer);
        setTotalRestant(sommRestant);
    }

    // function getJourDebAndFilter(e){
    //     setGridRows([]);
    //     JOUR_DEB = e.target.value;
    //     DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
    //     console.log("date verif",gridRows);
    //     if(DATEDEB_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
    //     else filterPaiement(LISTE_FILTRE,'',DATEFIN_VERIF);
    // }

    // function getJourFinAndFilter(e){
    //     setGridRows([]);
    //     JOUR_FIN = e.target.value;
    //     DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
    //     if(DATEFIN_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
    //     else filterPaiement(LISTE_FILTRE, '', DATEDEB_VERIF);
    // }

    // function getMoisDebAndFilter(e, dateFin){
    //     setGridRows([]);
    //     MOIS_DEB = e.target.value;
    //     DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
    //     console.log("date verif",DATEDEB_VERIF);
    //     if(DATEDEB_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
    //     else filterPaiement(LISTE_FILTRE, '', DATEFIN_VERIF);
    // }

    // function getMoisFinAndFilter(e){
    //     setGridRows([]);
    //     MOIS_FIN = e.target.value;
    //     DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
    //     if(DATEFIN_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
    //     else filterPaiement(LISTE_FILTRE, DATEDEB_VERIF, '');
    // }


    // function getYearDebAndFilter(e){
    //     setGridRows([]);
    //     YEAR_DEB = e.target.value;
    //     DATEDEB_VERIF = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
    //     console.log("date verif",DATEDEB_VERIF);
    //     if(DATEDEB_VERIF.length==10) filterPaiement(LISTE_FILTRE,DATEDEB_VERIF,DATEFIN_VERIF);
    //     else filterPaiement(LISTE_FILTRE, '', DATEFIN_VERIF);
    // }

    // function getYearFinAndFilter(e){
    //     setGridRows([]);
    //     YEAR_FIN = e.target.value;
    //     DATEFIN_VERIF = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
    //     if(DATEFIN_VERIF.length==10) filterPaiement(LISTE_FILTRE,'',DATEFIN_VERIF);
    //     else filterPaiement(LISTE_FILTRE, '', '');
    // }

    // function filterPaiement(list, dateDeb, dateFin){
    //     var resultList = [...list];
    //     console.log('filtre ici',list, dateDeb, dateFin);
       

    //     if(dateDeb != '' && dateFin == ''){
    //         resultList = list.filter((elt)=>new Date(changeDateIntoMMJJAAAA(elt.date.split(' ')[0])) >= new Date(changeDateIntoMMJJAAAA(dateDeb)));
    //     }

    //     if(dateDeb == '' && dateFin != ''){
    //         resultList = list.filter((elt)=>new Date(changeDateIntoMMJJAAAA(elt.date.split(' ')[0])) <= new Date(changeDateIntoMMJJAAAA(dateFin)));
    //     }

    //     if(dateDeb != '' && dateFin != ''){
    //         resultList = list.filter((elt)=>(new Date(changeDateIntoMMJJAAAA(elt.date.split(' ')[0])) >= new Date(changeDateIntoMMJJAAAA(dateDeb)) && new Date(changeDateIntoMMJJAAAA(elt.date.split(' ')[0])) <= new Date(changeDateIntoMMJJAAAA(dateFin))));
    //     }

    //     setGridRows(resultList);
    //     calculTotaux(resultList);       
    //     return resultList;

    // }


    
/*************************** DataGrid Declaration ***************************/    
    const columnsFr = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'id',
            headerName: 'ID',
            width: 33,
            editable: false,
            hide : true,
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
            headerName: 'NOM(S) ET PRENOM(S)',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedMontantPaye',
            headerName: 'MONTANT PAYE',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'montantPaye',
            headerName: 'MONTANT PAYE',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedMontantRestant',
            headerName: 'MONTANT RESTANT',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'montantRestant',
            headerName: 'MONTANT RESTANT',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedMontantToPay',
            headerName: 'MONTANT A PAYER',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'montantToPay',
            headerName: 'MONTANT A PAYER',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
      
    ];

    const columnsEn = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'id',
            headerName: 'ID',
            width: 33,
            editable: false,
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'matricule',
            headerName: 'REG. ID',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedName',
            headerName: 'NAME(S) ET SURMES(S)',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedMontantPaye',
            headerName: 'AMOUNT PAID',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'montantPaye',
            headerName: 'AMOUNT PAID',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedMontantRestant',
            headerName: 'AMOUNT REMAINING',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'montantRestant',
            headerName: 'AMOUNT REMAINING',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'montantToPay',
            headerName: 'AMOUNT TO PAY',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'displayedMontantToPay',
            headerName: 'AMOUNT TO PAY',
            width: 120,
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
    function consultRowData(row){
        var inputs=[];

        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[2]= row.date_naissance;
        inputs[3]= row.lieu_naissance;
        inputs[4]= row.etab_origine;

        inputs[5]= row.nom_pere;
        inputs[6]= row.email_pere;
        inputs[7]= row.tel_pere;

        inputs[8]= row.nom_mere;
        inputs[9]= row.email_mere;
        inputs[10]= row.tel_mere;

        inputs[11]= row.matricule;
     
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);

    }   
    
    function quitForm() {
        setModalOpen(0)
    }

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


    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);
                setGridRows([]);
                setTotalPaye(0);
                setAbsent(0);
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

            case MSG_SUCCESS_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_RECAP :{
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
            {(modalOpen==3) && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {currentUiContext.msgBox.msgType == "question" ? t('yes'):t('ok')}
                    buttonRejectText = {t('no')}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            <div className={classes.inputRow}>               
                <div className={classes.formTitle}>
                    {t('etats_frais_scolarite_M')}  
                </div>                
            </div>
            <div className={classes.formGridContent}>              
                <div className={classes.gridTitleRow}>                        
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText} style={{width:"5vw"}}>
                            {t('class_M')} :
                        </div>
                
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <MultiSelect
                                id                  = {MultiSelectId}
                                //-----Fields-----
                                optData             = {optClasses}
                                fetchedData         = {listEleves}
                                selectionMode       = {"single"}
                            
                                //-----Handler-----
                                optionChangeHandler     = {classChangeHandler}
                                searchTextChangeHandler = {searchTextChangeHandler}
                                selectValidatedHandler  = {validateSelectionHandler}
                            
                                //-----Styles-----
                                searchInputStyle    = {{fontSize:"0.87vw", height:"4.7vh"}}
                                searchInputStyleP   = {{height:"4vh", width:"13vw"}}
                                comboBoxStyle       = {{width:"13vw", height:"4vh", border:"solid 2px #8eb1ec", fontSize:"1vw", borderRadius:"3px"}}
                                dataFieldStyle      = {{minHeight:"5vh", borderRadius:"1vh", height:"fit-content", maxHeight:"53vw", overflowY:"scroll", border:"solid 1px gray", fontSize:"0.8vw", fontWeight:100, backgroundColor:"whitesmoke", position:"absolute", top:"22.3vh", width:"13vw"}}
                                MSContainerStyle    = {{/*border:"solid 1px grey",*/ padding:"1vh", marginRight:"1vh", marginBottom:"-1vh"}}
                            />
                    
                        </div>
                    </div>
                       
                    {/* <div className={classes.gridTitle} style={{marginLeft:"1vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_deb')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                           
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour_deb"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_deb"), document.getElementById("mois_deb"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourDebAndFilter} style={{width:'1.3vw', fontSize:'1vw', height:'1.3vw', marginLeft:'-2vw', color:'#065386', fontWeight:'bold'}} />/
                                <input id="mois_deb"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_deb"), document.getElementById("anne_deb"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisDebAndFilter} style={{width:'1.4vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw', color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne_deb"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_deb"), document.getElementById("jour_fin"))}}                                     maxLength={4}     className={classes.inputRowControl }  onChange={getYearDebAndFilter} style={{width:'2.7vw', fontSize:'1vw', height:'1.3vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold'}}  />
                            </div> 
                            
                                    
                        </div>
                        
                    </div> */}

                    {/* <div className={classes.gridTitle} style={{marginLeft:"-3.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_fin')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                           
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour_fin"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_fin"), document.getElementById("mois_fin"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourFinAndFilter} style={{width:'1.3vw', fontSize:'1vw', height:'1.3vw', marginLeft:'-2vw', color:'#065386', fontWeight:'bold'}} />/
                                <input id="mois_fin"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_fin"), document.getElementById("anne_fin"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisFinAndFilter} style={{width:'1.4vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw', color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne_fin"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_fin"), null)}}                                     maxLength={4}     className={classes.inputRowControl }  onChange={getYearFinAndFilter} style={{width:'2.7vw', fontSize:'1vw', height:'1.3vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold'}}  />
                            </div> 
                            
                                    
                        </div>
                       
                    </div> */}
                    


                   
                                
                    <div className={classes.gridAction}> 
                        
                        <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(modalOpen==1||modalOpen==2)}   
                        />

                    </div>
                        
                </div>
                    
                

                {(modalOpen==0) ?
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                            getCellClassName={(params) => (params.field==='displayedName')? classes.gridMainRowStyle : classes.gridRowStyle }
                            
                            onCellClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    //handlePresence(params.row)
                                }
                            }}  
                            
                           onRowDoubleClick ={(params, event) => {
                               if(!event.ignore){
                                    event.defaultMuiPrevented = true;
                                    consultRowData(params.row);
                                }
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
                    :
                    null
                }
            
            </div>
            <div style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", fontWeight:"800", fontSize:"0.97VW",marginRight:"3vw"}}>
                <div style={{dislay:"flex", flexDirection:"row", color:"green", marginLeft:"3vw"}}>
                    <div> {t('total_paye_M')} : {formatCurrency(totalPaye)} FCFA</div>
                </div>

                <div style={{dislay:"flex", flexDirection:"row", color:"red", marginLeft:"3vw"}}>
                    <div> {t('total_restant_M')} : {formatCurrency(totalRestant)} FCFA</div>
                </div>

                <div style={{dislay:"flex", flexDirection:"row", color:"black", marginLeft:"3vw"}}>
                    <div> {t('total_attendu_M')} : {formatCurrency(totalAttendu)} FCFA</div>
                </div>
                        
            </div>
        </div>
        
    );
} 
export default EtatsPaiement;