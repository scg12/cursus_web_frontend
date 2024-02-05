import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate, formatCurrency} from '../../../../store/SharedData/UtilFonctions';
import { fontSize } from '@mui/system';
import { useTranslation } from "react-i18next";


let CURRENT_QUALITE_ID;
let CURRENT_QUALITE_LABEL;
let CURRENT_PAIEMENT;
let USER_TO_PAY_ID;
let SALAIRE_TO_PAY;


var listElt = {}

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const OP_SUCCESS  =3;
const MSG_CONFIRM =4;


function AddPaiementStaff(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [optQualite, setOptQualite]       = useState([]);
    const [optUser, setOptUser]             = useState([]);
    const [listPaiements, setListPaiements] = useState([]);
    const [listPaiementsInities, setListPaiementsInities] = useState([]);
    const selectedTheme = currentUiContext.theme;
    
    useEffect(()=> {
        setOptQualite(tabQualite);
        CURRENT_QUALITE_ID    = tabQualite[0].value; 
        CURRENT_QUALITE_LABEL = tabQualite[0].label; 
        getListPersonnel(currentAppContext.currentEtab, CURRENT_QUALITE_ID);
    },[]);

    var tabQualite =[
        {value:"enseignant", label:i18n.language=='fr'? "Enseignant" : "Teacher"},
        {value:"administration", label:i18n.language=='fr'? "Administration" : "Administration"}
    ]

    const  getListPersonnel=(sousEtabId, qualiteId)=>{
        axiosInstance.post(`list-personnel/`, {
            id_sousetab: sousEtabId,
        }).then((res)=>{
            console.log(res.data);
            if(qualiteId == "enseignant"){
                formatListEns(res.data.enseignants)
            } else {
                formatListAdm(res.data.adminstaffs)
            } 
        })  
    }

    const formatListEns=(list) =>{       
        var tabUser=[{value: "",      label: (i18n.language=='fr') ? '  ----  Choisir un Enseignant ----  ' : '   ---- Select a Teacher ---- '  }];
        list.map((elt)=>{
            listElt={};
            listElt.value          = elt.id; 
            listElt.label          = elt.nom +' '+elt.prenom;
            listElt.salaire        = elt.salaire;
            listElt.id_ens         = elt.id_ens;            
            tabUser.push(listElt);
        })
        setOptUser(tabUser);
    }


    const formatListAdm=(list) =>{
         var adm_fonctions         = "";
        var salaire_fonctions     = 0;
        var list_salaire_fonction = "";
        var adm_data;
        var tabUser=[{value: "",      label: (i18n.language=='fr') ? ' ---- Choisir un Administratif ---- ' : '---- Select an admin Staff member ---- '  }];
        list.map((elt)=>{
            listElt = {};
            listElt.value          = elt.id; 
            listElt.label          = elt.nom +' '+elt.prenom;
            listElt.id_ens         = elt.id_ens;       
            listElt.is_prof        = elt.is_prof ; 
            listElt.adm_data       = elt.admin_data;
            adm_data               = elt.admin_data;

            adm_data.map((elt, index)=>{
                if(index < adm_data.length-1){
                    adm_fonctions         = adm_fonctions + elt.hierarchie + ', ';
                    list_salaire_fonction = list_salaire_fonction + elt.salaire +'_';
                } else {
                    adm_fonctions         = adm_fonctions + elt.hierarchie;
                    list_salaire_fonction = list_salaire_fonction + elt.salaire;
                } 
                    salaire_fonctions     = salaire_fonctions + elt.salaire;
            })
            
            console.log("fonctions", adm_fonctions);
            
            listElt.list_salaire_fonction = list_salaire_fonction;
            listElt.salaire_fonctions     = salaire_fonctions;
            listElt.salaire_prof          = listElt.is_prof ? elt.salaire_prof : 0;
            listElt.salaire               = listElt.salaire_fonctions +  listElt.salaire_prof;

            listElt.fonctions             = adm_fonctions; 
            listElt.fonctions_Gen         = listElt.is_prof ? adm_fonctions + ", " + t("teacher") : adm_fonctions ; 

            
            listElt.type_salaire          = listElt.is_prof  ? elt.type_salaire_prof : ""; 
            listElt.portee_salaire        = elt.admin_data.portee_salaire;
            
            adm_fonctions         = '';
            list_salaire_fonction = "";
            salaire_fonctions     = 0;
            
            tabUser.push(listElt);
        })
        setOptUser(tabUser);
    }

    var tabLastPaiement1 = [
        {rang:"1", montant:"120 000", date:"12/05/2023" },
        {rang:"2", montant:"120 000", date:"12/04/2023" },
        {rang:"3", montant:"120 000", date:"12/03/2023" },
        {rang:"4", montant:"120 000", date:"12/02/2023" },
    ];
 
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
    function getSelectDropDownTextColr() {
        switch(selectedTheme){
            case 'Theme1': return 'rgb(60, 160, 21)';
            case 'Theme2': return 'rgb(64, 49, 165)';
            case 'Theme3': return 'rgb(209, 30, 90)';
            default: return 'rgb(60, 160, 21)';
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

    
    /************************************ Handlers ************************************/
    
    function actionHandler(){
        
        var payements = { 
            id:0,
            id_classe:0,
            montant:'',
        }

        payements.id = document.getElementById('idEleve').value;
        payements.id_classe = document.getElementById('idClasse').value;
        payements.montant = document.getElementById('montant_paye').value;
        
        if(payements.montant<0) {
            chosenMsgBox = MSG_WARNING;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"warning", 
                msgTitle:t("warning_M"), 
                message:t("Le montant saisi est incorrect!")
            });

        }else{
            if(2 > currentUiContext.formInputs[7]){
                chosenMsgBox = MSG_WARNING;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"warning", 
                    msgTitle:t("warning_M"), 
                    message:t("Le montant saisi est incorrect!")
                });

            }else{
               props.actionHandler();               
            }
        }
    
    }

    function getListingPaiementUser(userId){
        var tabPaiements = [];
        
        axiosInstance.post(`list-payements-effectues-for-a-user/`, {
            type_personnel : CURRENT_QUALITE_ID,
            id_user        : userId
        }).then((res)=>{
            console.log("listing",res.data.res);
            var listingPaiements = res.data.res;
            listingPaiements.map((elt, index)=>{
                tabPaiements.push({rang:index+1, montant:elt.montant, date:elt.date})
            })
            setListPaiements(tabPaiements);
        })
    }

    function getNonAcceptedPaiement(userId){
        var tabPaiements = [];
        
        axiosInstance.post(`list-payements-initie-for-a-user/`, {
            id_user        : userId
        }).then((res)=>{
            console.log("listing_inities",res.data.res);
            var listingPaiements = res.data.res;
            listingPaiements.map((elt, index)=>{
                tabPaiements.push({rang:index+1, montant:elt.montant, date:elt.date})
            })
            setListPaiementsInities(tabPaiements);
        })
    }


    function qualiteChangeHandler(e){
        CURRENT_QUALITE_ID = e.target.value; 
        CURRENT_QUALITE_LABEL = optQualite[optQualite.findIndex((classe)=>(classe.value == CURRENT_QUALITE_ID))].label;
        getListPersonnel(currentAppContext.currentEtab, CURRENT_QUALITE_ID);
        document.getElementById("optUser").options[0].selected = true; 
    }

    function userChangeHandler(e){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        if(e.target.value.length>0){

            errorDiv.className   = null;
            errorDiv.textContent = "";

            var user_to_pay = optUser.find((user)=>user.value == e.target.value);
            USER_TO_PAY_ID  = user_to_pay.value;
            SALAIRE_TO_PAY  = user_to_pay.salaire;

            var salaireFormatted = formatCurrency(SALAIRE_TO_PAY);
            document.getElementById("montant_a_paye").value =  salaireFormatted;
            
            getListingPaiementUser(user_to_pay.value);  
            getNonAcceptedPaiement(user_to_pay.value);       
            setIsValid(true);
        } else {

            USER_TO_PAY_ID = undefined;
            SALAIRE_TO_PAY = 0;
            document.getElementById("montant_a_paye").value = 0;

            setListPaiements([]);
            setListPaiementsInities([]);
           
            errorDiv.className   = null;
            errorDiv.textContent = "";
            setIsValid(false);
        }
            
    }

    function manageInitPaiement(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',CURRENT_PAIEMENT);
        getFormData();
        console.log('apres:',CURRENT_PAIEMENT);

        var fomCheckErrorStr =  formDataCheck1(CURRENT_PAIEMENT);
        
        if(fomCheckErrorStr.length == 0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
            props.actionHandler(CURRENT_PAIEMENT);  
    
        } else {
            errorDiv.textContent = fomCheckErrorStr;
            errorDiv.className   = classes.formErrorMsg;            
        }
    }

    function getFormData(){
        CURRENT_PAIEMENT = {};
        CURRENT_PAIEMENT.type_personnel = CURRENT_QUALITE_ID;
        CURRENT_PAIEMENT.id_user        = USER_TO_PAY_ID;
        CURRENT_PAIEMENT.montant        = SALAIRE_TO_PAY;
    }

    function formDataCheck1(){
        var errorMsg='';

        if(listPaiementsInities.length>0){
            errorMsg= t('exist_non_accepted_paiement'); 
            setIsValid(false);
            return errorMsg;
        }

        // if(manuel.nomLivre.length == 0){
        //     errorMsg= t('enter_manuel_name'); 
        //     return errorMsg;
        // }

        // if (manuel.prix.length == 0) {
        //     errorMsg= t('enter_manuel_price'); 
        //     return errorMsg;
        // }

        // if(isNaN(manuel.prix)) {
        //     errorMsg= t('enter_correct_manuel_price'); 
        //     return errorMsg;
        // } 


        // if(manuel.id_classes.length == 0 ){
        //     errorMsg= t('no_manuel_classes_selected');  
        //     return errorMsg;       
        // }    
        return errorMsg;
    }

    /************************************ JSX Code ************************************/

    const LignePaiementHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'grey', flexDirection:'row', alignSelf:"center", height:'3.7vh', width:'89%', fontSize:'0.93vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black', marginTop:"-2vh"}}>
                <div style={{width:'7vw',marginLeft:"1vw"}}>    {t("N°")}        </div>
                <div style={{width:'7vw', marginLeft:"-3vw"}}>  {t("date_versement")}      </div> 
                <div style={{width:'12vw', marginLeft:"3vw"}}>{t("paid_amount")}   </div>   
            </div>
        );
    }

    const LignePaiement=(props)=>{
       
        return(
            <div style={{display:'flex', color:'black', backgroundColor: (props.rowIndex % 2==0) ? 'white':'#e2e8f0cf', flexDirection:'row', height: 'fit-content',width:'90%', fontSize:'0.87vw', alignItems:'center', alignSelf:"center", borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'3vw', textAlign:'center'}}>                             
                    {props.rang}                     
                </div>

                <div style={{width:'12vw', textAlign:'center'}}>                             
                    {props.date}                     
                </div>

                <div style={{width:'12vw', fontSize:"0.83vw", fontWeight:'bold', marginLeft:"1.3vw"}}>         
                    {props.montant}                     
                </div>
               
            </div>
        );
    }


    return (
        <div className={'card '+ classes.formContainerPP}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='pay fees' className={classes.formHeaderImg} src='images/addSalaireProf.png'/>
                </div>
                {(props.formMode == 'creation'||props.formMode == 'modif')  ?                
                    <div className={classes.formMainTitle} >
                        {t("new_paiement_M")}
                    </div>               
                :
                    <div className={classes.formMainTitle} >
                       {t("new_paiement_M")} 
                    </div>
                
                }                
            </div>

            <div id='errMsgPlaceHolder'/>

            <div style={{display:'flex',flexDirection:'row', width:'97%',   marginTop:'10.7vh', justifyContent:'center', height:'12.3vh', alignSelf:'center', alignItems:'center', borderRadius:7}}> 
                <div className={classes.inputRowLeft} style={{marginLeft:'1vw', marginBottom:"4vh"}}> 
                    <div style={{width:'8vw', marginRight:"4vw",fontWeight:570}}>
                        {t('qualite')}:  
                    </div>
                        
                    <div style={{marginBottom:'0vh', marginLeft:'1vw'}}>                         
                        <select id='optQualite' defaultValue={1} onChange={qualiteChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'1.73rem',width:'12vw'}}>
                            {(optQualite||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>
                    </div>                            
                        
                </div>

                <div className={classes.inputRowLeft} style={{marginLeft:'-1vw', marginBottom:"4vh"}}> 
                    <div style={{width:'7vw', marginRight:"4vw",fontWeight:570}}>
                        {t('nom')}:  
                    </div>
                        
                    <div style={{marginBottom:'0vh', marginLeft:'1vw'}}>                         
                        <select id='optUser' defaultValue={1} onChange={userChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'1.73rem',width:'19vw'}}>
                            {(optUser||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>
                    </div>                            
                        
                </div>
            </div>
            <div className={classes.inputRowLeft} style={{marginBottom:"3vh"}}> 
                <div style={{marginLeft:'10vw', width:'10.7vw'}}>
                    <b>{t('amount_to_pay')} :  </b>
                </div>
                    
                <div> 
                    <input id="montant_a_paye" type="number" min="0"  disabled={true} className={classes.inputRowControl + ' formInput medium'} style={{textAlign:"center", color:'black', fontWeight:"bold",}}/>
                    <input  type="label" value={"FCFA"} style={{ width:"3.7vw",fontSize:'1.23vw', color:'black', fontWeight:"bold", border:"none"}} />
                </div>
            </div>

          

            
            <div className={classes.buttonRow} style={{alignSelf:'center', width:'20vw', marginBottom:"3vh"}}>
                
                <CustomButton
                    btnText={(props.formMode=='creation') ? t('init_paiement'):t('save')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={manageInitPaiement}
                    style ={{width:"12vw"}}
                    disable={!isValid}
                />

                <CustomButton
                    btnText={t('cancel')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />

                {/* <CustomButton
                    btnText={t('imprimer')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? actionHandler : null}
                   
                /> */}
                    
                
            </div>

            {(listPaiements.length > 0)&&<div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignSelf:"center", width:"90%", marginBottom:"2vh", borderTop:"solid 2px black", fontWeight:"bold"}}>{t("liste_paiements")}</div>}
            {(listPaiements.length > 0)&& <LignePaiementHeader/>}
            
            {(listPaiements.length > 0)&&            
                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"scroll", minHeight:"3vh", maxHeight:"20vh", height:"auto", paddingBottom:"2vh"}}>
                    {listPaiements.map((elt, index)=>{
                        return(
                            <LignePaiement rowIndex={index} rang={index+1} montant={elt.montant} date={elt.date} />
                        )
                        
                    })}
                </div>
            }

        </div>
        
    );
}
export default AddPaiementStaff;
    

 