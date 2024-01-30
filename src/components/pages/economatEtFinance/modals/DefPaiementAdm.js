import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import {isMobile} from 'react-device-detect';
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


var CURRENT_ELEVE = {};
var CURRENT_ANNEE_SCOLAIRE;
var CURRENT_PAIEMENT;
var TABCLASSE     = [];
var tabSalaireFonctions;


function DefPaiementAdm(props) {
    const { t, i18n }    = useTranslation();
    
    const currentUiContext   = useContext(UiContext);
    const currentAppContext  = useContext(AppContext);
    const selectedTheme      = currentUiContext.theme;
    const [optContrat,  setOptContrat]      = useState(tabContrat);
    const [typeContrat, setTypeContrat]     = useState("permanent");
    const [isAdmOnly, setIsAdmOnly]         = useState(!currentUiContext.formInputs[6]);
    const [montantTotal, setMontantTotal]   = useState(currentUiContext.formInputs[3]);
    const [fonctions, setFonctions]         = useState([])
    
    var tabContrat =[
        {value:"permanent", label:t("permanent")},
        {value:"vacataire", label:t("vacataire")}, 
    ]


    useEffect(()=> {        
        CURRENT_ANNEE_SCOLAIRE  = document.getElementById("activated_annee").options[0].label;
        var tabFonctions        = currentUiContext.formInputs[8].split(",");
        tabSalaireFonctions     = currentUiContext.formInputs[9].split("_");
        
        setFonctions(tabFonctions);
      
        var currrentContrat =  currentUiContext.formInputs[7];  
        var indexContrat    = tabContrat.findIndex((elt)=>elt.value==currrentContrat);
        
        if(indexContrat >= 0) {
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

    function createSalairesHierarchie(fonctionsAdm, adm_data){
        var idHier_sal = "";
        console.log("hierrarchie",fonctionsAdm, adm_data);
        fonctionsAdm.map((fct, index)=>{
            var admElt = adm_data.find((elt)=>elt.hierarchie.trim() == fct.trim());
            console.log("trove",adm_data,admElt,fct);

            if(index < fonctionsAdm.length-1){
                idHier_sal = idHier_sal + admElt.id_adminstaff+"²²"+document.getElementById("adm_salaire_"+index).value + '_';
            } else {
                idHier_sal = idHier_sal + admElt.id_adminstaff+"²²"+document.getElementById("adm_salaire_"+index).value;
            }
        })
        console.log("list Salaires", idHier_sal);
        return idHier_sal
    }

    function getFormData(){
        
        CURRENT_PAIEMENT = {};
        CURRENT_PAIEMENT.id_sousetab    = currentAppContext.currentEtab;  
        CURRENT_PAIEMENT.type_personnel = "administaff"; 
        CURRENT_PAIEMENT.type_salaire   = typeContrat;
  
        CURRENT_PAIEMENT.portee_salaire = "locale";
        CURRENT_PAIEMENT.id_user        = currentUiContext.formInputs[0].split('_')[0];
        CURRENT_PAIEMENT.id_ens         = currentUiContext.formInputs[0].split('_')[1];
        CURRENT_PAIEMENT.salaire        = montantTotal
   
        CURRENT_PAIEMENT.is_salaire_total                   = false;
        CURRENT_PAIEMENT.tab_salaire                        = createSalairesHierarchie(fonctions, currentUiContext.formInputs[10]);
        CURRENT_PAIEMENT.is_enseignant                      = !isAdmOnly;
        CURRENT_PAIEMENT.id_adminstaff_enseignant           = currentUiContext.formInputs[0].split('_')[1];
        CURRENT_PAIEMENT.type_salaire_adminstaff_enseignant = typeContrat;
        CURRENT_PAIEMENT.salaire_adminstaff_enseignant      = !isAdmOnly ? parseInt(document.getElementById("salaire_prof").value) : 0;  
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
        
        var sommeTotale = 0; 
        fonctions.map((elt,index)=>{
            sommeTotale = sommeTotale + parseInt(document.getElementById("adm_salaire_"+index).value);
        })
        setMontantTotal(sommeTotale);
        
    }

    function calculSalaireTotal(isAdmOnly, typeContrat){
        var sommeTotale = 0;
        

        fonctions.map((elt,index)=>{
            sommeTotale = sommeTotale + parseInt(document.getElementById("adm_salaire_"+index).value);
        })

        if(isAdmOnly == false){
            console.log("hdhdhhdh");
            sommeTotale = 0; 
            fonctions.map((elt,index)=>{
                sommeTotale = sommeTotale + parseInt(document.getElementById("adm_salaire_"+index).value);
            })
        
            if(typeContrat=="permanent"){ 
                sommeTotale = sommeTotale + parseInt(document.getElementById("salaire_prof").value);
            } else {
                sommeTotale = sommeTotale + parseInt(document.getElementById("quota").value);
            }
        }

       setMontantTotal(sommeTotale);
       console.log("icic",sommeTotale )

    }

   
    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formCanvas} style={{width:"37vw", height:isAdmOnly? (38 + fonctions.length*7)+"vh":(63 + fonctions.length*5)+"vh"}}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImgP} src='images/confSalaire.png'/>
                </div>
                <div className={classes.formMainTitle} >
                    {t("def_paiemennt_adm_M")}
                </div>
            </div>

               
            <div id='errMsgPlaceHolder'/> 
        
            <div id="AjoutEleveEtape1" className={classes.etape} /*onLoad={()=>{moveToLeft()}}*/>
              

                <div className={classes.inputRow} style ={{justifyContent:"flex-start"}}>
                    <div className={classes.groupInfo} style={{paddingTop:"2.3vh"}}>                       
                        <div className={classes.inputRowLeft} style={{height:'4.7vh', marginBottom:"1vh"}}> 
                            <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                            <div className={classes.inputRowLabelP} style={{fontWeight:570, }}>
                            {t("form_nom") + " "+t('and')+" " + t('form_prenom')}: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'-3vw'}}>  
                                <input id="niveau" type="text"    className={classes.inputRowControl }  defaultValue={currentUiContext.formInputs[1]} style={{width:'15vw', textAlign:'left', height:'1.3vw', fontSize:'1.23vw', marginLeft:'0vw', color:'#494646'}} />
                            </div>
                        </div>

                        <div className={classes.inputRowLeft} style={{height:'4.7vh', marginBottom:"2vh"}}> 
                            <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                            <div className={classes.inputRowLabelP} style={{fontWeight:570, width:"15vw"}}>
                                {t("personnel_adm_excl")}?: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'0vw', display:"flex", flexDirection:"row",}}>  
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <input type="radio"  name="pers_adm" checked={isAdmOnly} /*onClick={()=>{isAdmOnly? setIsAdmOnly(false) : setIsAdmOnly(true)}}*//>
                                    <div>{t('yes')}</div>
                                </div>

                                <div style={{display:"flex", flexDirection:"row", marginLeft:"3vw"}}>
                                    <input type="radio"  name="pers_adm" checked={!isAdmOnly}  /*onClick={()=>{isAdmOnly? setIsAdmOnly(false) : setIsAdmOnly(true)}}*//>
                                    <div>{t('no')}</div>
                                </div>
                            </div>
                        </div>

                       

                        { 
                            fonctions.map((fonct_adm, index)=>{
                                return(
                                    <div className={classes.inputRowLeft} style={{marginBottom:"0.3vh"}}> 
                                        <div className={classes.inputRowLabel} style={{fontWeight:570,marginRight:'1.7vw'}}>
                                            {fonct_adm}:
                                        </div>

                                        <div style={{marginBottom:'0.7vh', marginLeft:'0vw'}}>  
                                            <input id={"adm_salaire_"+index} type="number"  onChange={(e)=> calculSalaireTotal(isAdmOnly,typeContrat)} defaultValue={tabSalaireFonctions[index]}   className={classes.inputRowControl }   style={{width:'10vw', textAlign:'left', height:'1.3vw', fontSize:'1vw', marginLeft:'1vw', color:'#494646'}} />
                                            <input  type="label" value={"FCFA"} style={{ width:"3.7vw",fontSize:'1.23vw', color:'#494646', border:"none"}} />
                                        </div>
     
                                    </div>
                                );                                

                            })
                           
                        }
                        
                        {!isAdmOnly &&
                            <div className={classes.inputRowLeft} style={{marginBottom:"3vh"}}> 
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    {t("teacher")}:
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
                        }

                        {
                            (!isAdmOnly) &&
                            <div className={classes.inputRowLeft}> 
                            
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    { typeContrat == "permanent" ? t("salaire"):t("montant_quota")}:
                                </div>
                                 
                                <div> 
                                    <input id="salaire_prof" type="number" onChange={(e)=> calculSalaireTotal(isAdmOnly,typeContrat)} defaultValue={currentUiContext.formInputs[2]== undefined ? 0 : currentUiContext.formInputs[2]} disabled={(props.formMode == 'consult')? true:false}   style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'10vw'}}/>
                                    <input  type="label" value={"FCFA"} style={{ width:"3.7vw",fontSize:'1.23vw', color:'#494646', border:"none"}} />
                                </div>
                            </div>
                        }
                            
                        {/* {    
                            (!isAdmOnly && typeContrat == "vacataire") &&
                            <div className={classes.inputRowLeft}> 
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    {t("montant_quota")}:
                                </div>
                                    
                                <div style={{display:"flex", flexDirection:"row"}}> 
                                    <input id="quota" type="number" onChange={(e)=> calculSalaireTotal(isAdmOnly,typeContrat)} defaultValue={currentUiContext.formInputs[2]==undefined? 0 :currentUiContext.formInputs[2]} disabled={(props.formMode == 'consult')? true:false}  style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'10vw'}}/>
                                    <input  type="label" value={"FCFA"} style={{ width:"3.7vw",fontSize:'1.23vw', color:'#494646', border:"none"}} />
                                </div>
                            </div>
                        } */}

                        
                        <div className={classes.inputRowLeft} style={{height:'4.7vh', marginBottom:"2vh"}}> 
                            <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                            <div className={classes.inputRowLabelP} style={{fontWeight:570, }}>
                                {t("salaire_globale")}: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'-5vw', display:"flex", flexDirection:"row"}}>  
                                <input id="salaire_total" type="number" value={montantTotal}   disabled={true} className={classes.inputRowControl }  style={{width:'10vw', textAlign:'left', height:'1.3vw', fontSize:'1.3vw', marginLeft:'0vw',  fontWeight:"bold", color: "black"}} />
                                <input  type="label" value={"FCFA"} style={{ width:"3.7vw",fontSize:'1.23vw', fontWeight:"bold", color:"black", border:"none"}} />
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
 export default DefPaiementAdm;
 