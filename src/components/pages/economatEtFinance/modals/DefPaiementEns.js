import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import {isMobile} from 'react-device-detect';
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate, formatCurrency} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


var CURRENT_PAIEMENT = {};
var CURRENT_ANNEE_SCOLAIRE;




function DefPaiementEns(props) {
    const { t, i18n }    = useTranslation();
    
    const currentUiContext   = useContext(UiContext);
    const currentAppContext  = useContext(AppContext);
    const selectedTheme      = currentUiContext.theme;
    const [optContrat,  setOptContrat]      = useState(tabContrat);
    const [typeContrat, setTypeContrat]     = useState("permanent");
    
    var tabContrat =[
        {value:"permanent", label:t("permanent")},
        {value:"vacataire", label:t("vacataire")}, 
    ]


    useEffect(()=> {        
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        console.log("les inputs",currentUiContext.formInputs)
        
        var currrentContrat =  currentUiContext.formInputs[4];  
        var indexContrat    = tabContrat.findIndex((elt)=>elt.value==currrentContrat);
        console.log("value", indexContrat, currrentContrat)
        if(indexContrat>=0) {
            var cur_Contrat = tabContrat[indexContrat];
            tabContrat.splice(indexContrat,1);
            tabContrat.unshift(cur_Contrat);
            setOptContrat(tabContrat);
            setTypeContrat(currrentContrat);
        } else {
            setOptContrat(tabContrat);
            setTypeContrat("permanent");
        }
        
    },[]);


    function updatePaiementAdm(){
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
        CURRENT_PAIEMENT.id_sousetab    = currentAppContext.currentEtab;  
        CURRENT_PAIEMENT.type_personnel = "enseignant"; 
        CURRENT_PAIEMENT.type_salaire   = typeContrat;
  
        CURRENT_PAIEMENT.portee_salaire = "locale";
        CURRENT_PAIEMENT.id_user        = currentUiContext.formInputs[0].split('_')[0];
        CURRENT_PAIEMENT.id_ens         = currentUiContext.formInputs[0].split('_')[1];
        CURRENT_PAIEMENT.salaire        =  parseInt(document.getElementById("salaire_prof").value);
   
        CURRENT_PAIEMENT.is_salaire_total                   = true
        CURRENT_PAIEMENT.tab_salaire                        = ""
        CURRENT_PAIEMENT.is_enseignant                      = true;
        CURRENT_PAIEMENT.id_adminstaff_enseignant           = ""
        CURRENT_PAIEMENT.type_salaire_adminstaff_enseignant = typeContrat;
        CURRENT_PAIEMENT.salaire_adminstaff_enseignant      = "";  
    }

    function formDataCheck1(manuel){       
        var errorMsg='';
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


    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
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

    function contratChangeHandler(e){
        setTypeContrat(e.target.value);
    }

   
    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formCanvas} style={{width:"37vw", height:"50vh"}}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImgP} src='images/confSalaire.png'/>
                </div>
               
                <div className={classes.formMainTitle} >
                    {t("def_paiemennt_ens_M")}
                </div>
            </div>

               
            <div id='errMsgPlaceHolder'/> 
        
            <div id="AjoutEleveEtape1" className={classes.etape} /*onLoad={()=>{moveToLeft()}}*/>
              

                <div className={classes.inputRow} style ={{justifyContent:"flex-start"}}>
                    <div className={classes.groupInfo} style={{paddingTop:"2.3vh"}}>                       
                        <div className={classes.inputRowLeft} style={{height:'4.7vh', marginBottom:"3vh"}}> 
                            <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                            <div className={classes.inputRowLabelP} style={{fontWeight:570, }}>
                                {t("form_nom") + " "+t('and')+" " + t('form_prenom')}: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'-3vw'}}>  
                                <input id="niveau" type="text"    className={classes.inputRowControl }  defaultValue={currentUiContext.formInputs[1]} style={{width:'15vw', textAlign:'left', height:'1.3vw', fontSize:'1.23vw', marginLeft:'0vw', color:'#494646'}} />
                            </div>
                        </div>

                        <div className={classes.inputRowLeft} style={{marginBottom:"3vh"}}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("type_paiement")}:
                            </div>

                            <div style={{display:'flex', flexDirection:"row", justifyContent:"flex-start", flexWrap:"wrap", width:"13vw"}}> 
                                <select id='selectTypePaiement' onChange={contratChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-2.3vw', height:'1.87vw',width:'23vw'}}>
                                    {(optContrat||[]).map((option)=> {
                                        return(
                                            <option  style={{textAlign:"left"}}  value={option.value}>{option.label}</option>
                                        );
                                    })}
                                </select>                              
                            </div>    

                        </div>
                        
                       
                        <div className={classes.inputRowLeft}> 
                                
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {(typeContrat == "permanent") ? t("salaire"): t("montant_quota")}:
                            </div>
                                
                            <div> 
                                <input id="salaire_prof" type="number" defaultValue={formatCurrency(currentUiContext.formInputs[2])}   style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'10vw'}}/>
                                <input  type="label" value={"FCFA"} style={{ width:"3.7vw",fontSize:'1.23vw', color:'#494646', border:"none"}} />
                            </div>
                        </div>
                          
 
                    </div>

                </div>
                    
            </div>
        
        
            <div className={classes.formButtonRow} style={{justifyContent:"flex-end"}}>
                <CustomButton
                    btnText= {t("cancel")}
                    // hasIconImg= {true}
                    // imgSrc='images/etape1.png'
                    imgStyle = {classes.frmBtnImgStyle1}   
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                    // disable={(isValid==false)}
                />
                
                {(props.formMode == 'creation') &&
                    <CustomButton
                        btnText={t("save")}
                        // hasIconImg= {true}
                        // imgSrc='images/etape2.png'
                        imgStyle = {classes.frmBtnImgStyle2} 
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={updatePaiementAdm}
                        // disable={(isValid==false)}
                    />
                }

                {(props.formMode == 'modif') &&
                    <CustomButton 
                        btnText={t("modify")}
                        // hasIconImg= {true}
                        // imgSrc='images/etape2.png'
                        imgStyle = {classes.frmBtnImgStyle2} 
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={updatePaiementAdm}
                        // disable={(isValid==false)}
                    />  
                }    
      
            </div>

        </div>
       
    );
 }
 export default DefPaiementEns;
 