import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate, formatCurrency,formatCurrencyInverse} from '../../../../store/SharedData/UtilFonctions';
import { fontSize } from '@mui/system';
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';


var CURRENT_PAIEMENT = {};


var BASE_MONTANT_VERSE;
var BASE_MONTANT_RESTANT;
var CURRENT_TRANCHE_TO_PAY = {};

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const OP_SUCCESS  =3;
const MSG_CONFIRM =4;


function AddFraisScolarite(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(false);
    const [montantRestant, setMontantRestant] = useState(Number(0? formatCurrencyInverse(currentUiContext.formInputs[4])>= formatCurrencyInverse(currentUiContext.formInputs[7]) : formatCurrencyInverse(currentUiContext.formInputs[7])-formatCurrencyInverse(currentUiContext.formInputs[4])));
    const [montantVerse, setMontantVerse]     = useState(Number(formatCurrencyInverse(currentUiContext.formInputs[4])));
    const [isLoading, setIsLoading]           = useState(false);
    const [recap, setRecap]                   = useState(currentUiContext.formInputs[14]);
    const [trancheToPay, setTrancheToPay]     = useState(currentUiContext.formInputs[13].find((elt)=>elt.montantVerse < elt.montantAttendu));
    const [listing_dates_payements, setListing_dates_payements] = useState(currentUiContext.formInputs[8].split(','));
    const [listing_montants, setListing_montants]               = useState(currentUiContext.formInputs[9].split(';'));
    const selectedTheme = currentUiContext.theme;
    
    useEffect(()=> {
        BASE_MONTANT_VERSE   = montantVerse;
        BASE_MONTANT_RESTANT = montantRestant;

       currentUiContext.setIsParentMsgBox(false);

       console.log("Tranche a payer",trancheToPay)

    },[])

    
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
    
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function formDataCheck1(){       
        var errorMsg='';
   
        if( CURRENT_PAIEMENT.montant<0) {
            errorMsg=t("incorrect_amount_value");
            setIsValid(false);
            return errorMsg;
        } 

        if(CURRENT_PAIEMENT.montant > trancheToPay.montantAttendu) {
            errorMsg=t("topay_over_waited_for_tranch");
            setIsValid(false);
            return errorMsg;
        } 

        return errorMsg;  
    }

    function handleChange(e){
        var frais;
        var objRecap = {};
        var errorDiv = document.getElementById('errMsgPlaceHolder');
      
        frais = e.target.value;   
        var totalVerse =  parseInt(frais) +  parseInt(trancheToPay.montantVerse); 
        
        console.log("fdfdfdf",totalVerse, trancheToPay.montantVerse, trancheToPay.montantAttendu)
       
        if(frais!="" && frais!=undefined && frais>0 && totalVerse  <= trancheToPay.montantAttendu) { 
            objRecap.montantVerse   = BASE_MONTANT_VERSE + Number(frais);
            objRecap.montantAttendu = recap.montantAttendu;
            objRecap.montantRestant = BASE_MONTANT_RESTANT - Number(frais);
            
            setRecap(objRecap);

            errorDiv.className = null;
            errorDiv.textContent = '';
            setIsValid(true);
 
        } else {
            objRecap.montantVerse   = BASE_MONTANT_VERSE ;
            objRecap.montantAttendu = recap.montantAttendu;
            objRecap.montantRestant = BASE_MONTANT_RESTANT ;

            setRecap(objRecap);

            setMontantRestant(BASE_MONTANT_RESTANT);
            setMontantVerse(BASE_MONTANT_VERSE);
            setIsValid(false); 
            
            if(totalVerse  > trancheToPay.montantAttendu) { 
                errorDiv.className   = classes.formErrorMsg;
                errorDiv.textContent = t("topay_over_waited_for_tranch");;
            }
        }
    }

    function actionHandler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        getFormData();

        if(formDataCheck1().length==0){

            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
                setIsValid(true);
            } 

            //setIsLoading(true);
            props.actionHandler(CURRENT_PAIEMENT);         
      
        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1();
        }

    }

    function getFormData(){
        CURRENT_PAIEMENT = {}
        CURRENT_PAIEMENT.id               = currentUiContext.formInputs[2];
        CURRENT_PAIEMENT.montant          = document.getElementById("montant_paye").value;
        CURRENT_PAIEMENT.id_classe        = props.currentClasseId;
        CURRENT_PAIEMENT.type_paiement_Id = trancheToPay.id;
    }

    /************************************ JSX Code ************************************/

    const LigneHeader=(props)=>{
        return(
            <div key="titre" style={{display:'flex',flexDirection:'row',marginLeft:'2vw'}}>
                <div style={{width:'10vw'}}><b>{t('libelle')}</b></div>
                <div style={{width:'10vw'}}><b>{t('paid')}</b></div>
                <div style={{width:'10vw'}}><b>{t('waited')}</b></div>
                <div style={{width:'10vw'}}><b>{t('beguin_date')} </b></div>
                <div style={{width:'10vw'}}><b> {t('end_date')} </b></div>
            </div>
        );
    }


    const LigneTranche=(props)=>{
        return(
            <div key={"tranche_"+props.tranche.id} style={{display:'flex', width:'93%', flexDirection:'row',marginLeft:"2vw",backgroundColor:'#dcecf5', borderBottomStyle:'solid', borderBottomWidth:'1px', borderTopStyle:'solid', borderTopWidth:'1px' }}>
                <div style={{width:'10vw'}}><b>{props.tranche.libelle}</b></div>
                <div style={{width:'10vw'}}>{props.tranche.montantVerse}</div>
                <div style={{width:'10vw'}}>{props.tranche.montantAttendu}</div>
                <div style={{width:'10vw'}}>{props.tranche.date_deb}</div>
                <div style={{width:'10vw'}}>{props.tranche.date_fin}</div>
            </div>
        );
    }

    const LigneRecap=(props)=>{
        return(
            <div key={"tranche_recap"} style={{marginTop:'-3.3vh', display:'flex',flexDirection:'row', marginLeft:"15.3vw", width:"33vw", backgroundColor:'lightgrey'}}>
                    <div style={{width:'10vw', marginTop:'0.7vh'}}><b>{t("totaux")}</b></div>
                    <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i>{t("paid")} :</i></div>
                    <div style={{width:'10vw',fontSize:'1.1em',color:'green', marginLeft:'-1.7vw'}}><b id="recap_verse"> {formatCurrency(props.recap.montantVerse)}</b></div>
                    <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i>{t("waited")} :</i></div>
                    <div style={{width:'10vw', marginLeft:'-0.77vw', marginTop:'0.57vh'}}><b>{formatCurrency(props.recap.montantAttendu)}</b></div>
                    <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i>{t("remaning")} :</i></div>
                    <div  style={{width:'10vw',color:'red', marginTop:'0.57vh'}}><b id="recap_reste">{formatCurrency(props.recap.montantRestant)}</b></div>
            </div>
        );
    }

    const LigneListing =(props)=>{
        return(
            <div key="listing" style={{width:'93%', display:'flex',flexDirection:'row', marginLeft:"2vw", backgroundColor:'#dcecf5', borderBottomStyle:'solid', borderBottomWidth:'1px', borderTopStyle:'solid', borderTopWidth:'1px'}}>
                <div style={{width:'33vw'}}><i>{formatCurrency(props.montants)}</i></div>
                <div style={{width:'33vw',marginLeft:'1.7vw'}}><i>{props.dates_payements}</i></div>
            </div>
        );
    }



    return (
        <div className={'card '+ classes.formContainerPP}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='pay fees' className={classes.formHeaderImg} src='images/SchoolFees.png'/>
                </div>
                {(props.formMode == 'creation'||props.formMode == 'modif')  ?                
                    <div className={classes.formMainTitle} >
                        {t("fee_payment_M")}
                    </div>               
                :
                    <div className={classes.formMainTitle} >
                       {t("paiement_history_M")} 
                    </div>                
                }                
            </div>

            <div id='errMsgPlaceHolder'/>
            {currentUiContext.isParentMsgBox && 
                <BackDrop id="backDrop" style={{height:"100%"}}/>
            }
            
            {currentUiContext.isParentMsgBox && 
                <div id="loadingText" style={{alignSelf: 'center',position:'absolute', top:'49.3%', fontWeight:'bolder', color:'#fffbfb', zIndex:'1207',marginTop:'-2.7vh', fontSise:'0.9vw'}}> 
                    {t('traitement')}...
                </div> 
            }                 
            
            {currentUiContext.isParentMsgBox && 
                <div id="loadingBar" style={{  
                    display:"none", 
                    alignSelf: 'center',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '13vw',
                    height: '3.13vh',
                    position: 'absolute',
                    top:'50%',
                    zIndex: '1200',
                    overflow: 'hidden'
                }}
                >
                    <img id="imgloading" src='images/Loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
                </div> 
            }                   
            


           
            <div style={{display:"flex", flexDirection:"row", marginRight:'-3.7vw', marginLeft:'0.7vw', marginTop:'7.7vh', marginBottom:"3vh",  width:'97%', height:'13.3vh', justifyContent:"flex-start", backgroundColor:'rgb(23 116 227)', color:'white',  borderRadius:7}}>
                <div style={{marginLeft:'2vw', marginRight:"1vw", paddingTop:"0.7vh"}}>
                    <img alt='student' className={classes.photoStyleP} src={currentUiContext.formInputs[11].length>0? currentUiContext.formInputs[11] : 'images/photo4Fois4P.png'}/>
                </div>   

                <div className={classes.studentInfoP}>
                
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <div style={{fontWeight:'700', marginRight:'0.3vw', width:"4.7vw"}}> {t('nom_M')} : </div> {<div>{currentUiContext.formInputs[0]+' '+currentUiContext.formInputs[1]}</div>}
                    </div>

                    <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignSelf:"center"}}>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                                <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('class_M')} : </div> 
                                <div style={{fontWeight:'700', marginRight:'0.3vw', width:"4.7vw"}}> {t('age_M')} : </div> 
                            </div>
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                                <div>{props.currentClasseLabel}</div>
                                <div>{"12 ans"}</div>
                            </div>

                        </div>

                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                                <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'10vw'}}> {t('matricule_M')}  :    </div> 
                                <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'10vw'}}> {t('redoublant_M')} : </div> 
                            </div>
                            <div style={{display:'flex', flexDirection:'column', justifyContent:'flex-start'}}>
                                <div> {currentUiContext.formInputs[3]}</div>
                                <div> {(currentUiContext.formInputs[12]==false)? t('no'):t('yes')}</div> 
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div style={{width:'93%', display:'flex',flexDirection:'row', marginLeft:"2vw", backgroundColor:'#dcecf5', borderBottomStyle:'solid', borderBottomWidth:'1px', borderTopStyle:'solid', borderTopWidth:'1px'}}></div>
            
            <LigneHeader/>

            {currentUiContext.formInputs[13].map((pay)=>{
                return  <LigneTranche tranche ={pay} />
                })            
            }

            <br />

            <LigneRecap recap={recap}/>

            <br />
            
        
            <div>
                <input id="idClasse" type="hidden"  value={currentUiContext.formInputs[5]}/>
                <input id="idEleve"  type="hidden"  value={currentUiContext.formInputs[2]}/>
            </div>

            {(currentUiContext.formInputs[8]!=="")&&
                <div key="historique" style={{display:'flex',flexDirection:'row',marginLeft:"2vw"}}>
                    <div style={{color:'blue',textAlign:'center'}}><b><i>{t("payment_history")} :</i></b></div>
                </div>
            }

            {(currentUiContext.formInputs[8]!=="")&&
                <div key="recap" style={{display:'flex',flexDirection:'row', marginLeft:"2vw"}}>
                    <div style={{width:'33vw'}}><b>{t("paid_amount")}</b></div>
                    <div style={{width:'33vw'}}><b>{t("payment_date")} </b></div>
                </div>
            }

             {(currentUiContext.formInputs[8]!=="")&&
                <div style={{display:"flex", flexDirection:"column", paddingTop:"1vh", paddingBottom:"1vh", width:"97%",justifyContent:"center", height:"20vh", overflowY:"scroll"}}>
                    {listing_dates_payements.map((elt, index)=>{
                        return <LigneListing montants={listing_montants[index]} dates_payements={listing_dates_payements[index]} />
                    })}
                </div>
            } 

            <br />
            { (props.formMode!='consult') ?
                    <div className={classes.inputRowLeft}> 
                        <div style={{marginLeft:'2vw', width:'15vw'}}>
                            <b>{t('write_amount_to_pay')} :  </b>
                        </div>
                            
                        <div> 
                            <input id="montant_paye" type="number" min="0" onChange={handleChange} className={classes.inputRowControl + ' formInput small'}/>
                        </div>

                        <div style={{marginLeft:'1.7vw', width:'27vw'}}>
                            <b>{t('tranche_correspondante')} :</b> {trancheToPay.libelle} 
                        </div>
                    </div>
                :null  
            }           
            
            <div className={classes.buttonRow} style={{alignSelf:'center', width:'27vw'}}>
                <CustomButton
                    btnText={t('cancel')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
              
                <CustomButton
                    btnText={(props.formMode=='creation') ? t('apply'):t('save')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? actionHandler : null}
                    disable={!isValid}
                />

                <CustomButton
                    btnText={t('imprimer')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? actionHandler : null}
                   
                />  
                
            </div>

            

        </div>
        
    );
}
export default AddFraisScolarite;
    

 