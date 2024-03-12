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


var CURRENT_ELEVE = {
    //---Infos Perso 
    id:-1,
    matricule : '',
    nom : '',
    prenom : '',
    date_naissance : '',
    lieu_naissance : '',
    adresse : '',
    sexe : 'M',
    photo_url : '',
    age:20,           
    //---Infos Scolaires
    date_entree : '',
    etab_provenance:'',
    classe:'',
    filiere:'',
    redouble : false,
    est_en_regle: false,
    //---Infos des parents
    nom_pere : '',
    email_pere : '',
    tel_pere : '',
    prenom_pere :'',

    nom_mere : '',
    email_mere : '',
    tel_mere : '',
    prenom_mere : '',         
             
};

let tabSexePrim=[];
let tabRedoublePrim=[];
var BASE_MONTANT_VERSE;
var BAESE_MONTANT_RESTANT;

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const OP_SUCCESS  =3;
const MSG_CONFIRM =4;


function AddFraisScolarite(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [montantRestant, setMontantRestant] = useState(Number(0? formatCurrencyInverse(currentUiContext.formInputs[4])>= formatCurrencyInverse(currentUiContext.formInputs[7]) : formatCurrencyInverse(currentUiContext.formInputs[7])-formatCurrencyInverse(currentUiContext.formInputs[4])));
    const [montantVerse, setMontantVerse] = useState(Number(formatCurrencyInverse(currentUiContext.formInputs[4])));
    const selectedTheme = currentUiContext.theme;
    
    useEffect(()=> {
        BASE_MONTANT_VERSE = montantVerse;
        BAESE_MONTANT_RESTANT = montantRestant;

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

    function handleChange(e){
        var frais;
      
        frais = e.target.value;        
        if(frais!=undefined && frais>0) { 
            
            setMontantRestant(BAESE_MONTANT_RESTANT - Number(frais));
            setMontantVerse(BASE_MONTANT_VERSE + Number(frais));
            setIsValid(true);
        } else {
            setMontantRestant(BAESE_MONTANT_RESTANT);
            setMontantVerse(BASE_MONTANT_VERSE);
            setIsValid(false)
        }
    }

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
            if(montantVerse > currentUiContext.formInputs[7]){
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

    /************************************ JSX Code ************************************/

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

            <div style={{display:'flex',flexDirection:'row', width:'97%', marginTop:'7.7vh', justifyContent:'center', height:'4.5vh', backgroundColor:'rgb(23 116 227)', color:'white' /*color:'#eeee5f'*/, alignSelf:'center', alignItems:'center', borderRadius:7}}> 
                <div style={{width:'auto', marginRight:'1vw'}}><b style ={{textTransform:'uppercase'}}>{currentUiContext.formInputs[0]}</b></div>
                <div style={{width:'auto', marginRight:'2vw'}}><b>{currentUiContext.formInputs[1]}</b></div>
                <div style={{width:'7vw', marginRight:'2vw'}}><b style ={{textTransform:'uppercase'}}>{currentUiContext.formInputs[3]}</b></div>
                <div><b>{currentUiContext.formInputs[10]}</b></div>
            </div><br />

            { (()=>{
                    let infos = currentUiContext.formInputs[6];
                    let a_payer = currentUiContext.formInputs[7];
                    console.log(infos)
                    let n = infos.length
                    let montant_deja_paye = currentUiContext.formInputs[4];
                    let ligne = [];
                    let reste = 0?currentUiContext.formInputs[4]>=a_payer : a_payer-currentUiContext.formInputs[4];
                    
                    let montant_affiche = 0;
                    console.log("montant_deja_paye: ",montant_deja_paye)
                    ligne.push(<div key="titre" style={{display:'flex',flexDirection:'row',marginLeft:'2vw'}}><div style={{width:'10vw'}}><b >{t('libelle')}</b></div><div style={{width:'10vw'}}><b>{t('paid')}</b></div><div style={{width:'10vw'}}><b>{t('waited')}</b></div><div style={{width:'10vw'}}><b>{t('beguin_date')} </b></div><div style={{width:'10vw'}}><b> {t('end_date')} </b></div></div>)
                    for(let i=0;i<n;i++){
                        if(montant_deja_paye>0){
                            if(montant_deja_paye<infos[i].montant){
                                    montant_affiche = montant_deja_paye;
                                    montant_deja_paye =0;
                            }
                            else{
                                montant_affiche = infos[i].montant;
                                montant_deja_paye -= infos[i].montant;
                            }
                        }
                        else
                            montant_affiche = 0;
            
                        ligne.push(<div key={"tranche_"+infos[i].id} style={{display:'flex', width:'93%', flexDirection:'row',marginLeft:"2vw",backgroundColor:'#dcecf5', borderBottomStyle:'solid', borderBottomWidth:'1px', borderTopStyle:'solid', borderTopWidth:'1px' }}>
                            <div style={{width:'10vw'}}><b>{infos[i].libelle}</b></div>
                            <div style={{width:'10vw'}}>{montant_affiche}</div>
                            <div style={{width:'10vw'}}>{formatCurrency(infos[i].montant)}</div>
                            <div style={{width:'10vw'}}>{infos[i].date_deb}</div>
                            <div style={{width:'10vw'}}>{infos[i].date_fin}</div>
                            </div>
                        );
                    }
                    
                    ligne.push(<br />)

                        if(reste>0)
                            ligne.push(<div key={"tranche_recap"} style={{marginTop:'-3.3vh', display:'flex',flexDirection:'row', marginLeft:"15.3vw", width:"33vw", backgroundColor:'lightgrey'}}>
                                <div style={{width:'10vw', marginTop:'0.7vh'}}><b>{t("totaux")}</b></div>
                                <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i>{t("paid")} :</i></div>
                                <div style={{width:'10vw',fontSize:'1.1em',color:'green', marginLeft:'-1.7vw'}}><b> {formatCurrency(montantVerse)}</b></div>
                                <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i>{t("waited")} :</i></div>
                                <div style={{width:'10vw', marginLeft:'-0.77vw', marginTop:'0.57vh'}}><b>{formatCurrency(a_payer)}</b></div>
                                <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i>{t("remaning")} :</i></div>
                                <div style={{width:'10vw',color:'red', marginTop:'0.57vh'}}><b>{formatCurrency(montantRestant)}</b></div>
                                </div>
                            );
                        else
                            ligne.push(<div key={"tranche_recap"} style={{marginTop:'-3.3vh', display:'flex',flexDirection:'row', marginLeft:"15.3vw", width:"33vw", backgroundColor:'lightgrey'}}>
                                <div style={{width:'10vw', marginTop:'0.7vh'}}><b>{t("totaux")}</b></div>
                                <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i> {t("paid")} :</i></div>
                                <div style={{width:'10vw',fontSize:'1.1em',color:'green', marginLeft:'-1.7vw'}}><b> {montantVerse}</b></div>
                                <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i> {t("waited")} :</i></div>
                                <div style={{width:'10vw', marginLeft:'-0.77vw', marginTop:'0.57vh'}}><b>{formatCurrency(a_payer)}</b></div>
                                <div style={{width:'10vw', fontSize:'0.93vw', marginTop:'0.7vh', marginLeft:'1vw'}}> <i> {t("remaning")} :</i></div>
                                <div style={{width:'10vw',color:'green', marginTop:'0.57vh'}}><b>{formatCurrency(montantRestant)}</b></div>
                                </div>
                            );
                        
                            ligne.push(<br />)
                            let dates_payements = currentUiContext.formInputs[8].split(',')
                            let montants = currentUiContext.formInputs[9].split(';')
                            n = dates_payements.length;
                            
                            if(currentUiContext.formInputs[8]!==""){

                                ligne.push(<div key="historique" style={{display:'flex',flexDirection:'row',marginLeft:"2vw"}}><div style={{color:'blue',textAlign:'center'}}><b><i>{t("payment_history")} :</i></b></div></div>)
                                ligne.push(<div key="recap" style={{display:'flex',flexDirection:'row', marginLeft:"2vw"}}><div style={{width:'33vw'}}><b>{t("paid_amount")}</b></div><div style={{width:'33vw'}}><b>{t("payment_date")} </b></div></div>)
                            }

                            for(let i=0;i<n;i++){
                                ligne.push(<div key="recap" style={{width:'93%', display:'flex',flexDirection:'row', marginLeft:"2vw", backgroundColor:'#dcecf5', borderBottomStyle:'solid', borderBottomWidth:'1px', borderTopStyle:'solid', borderTopWidth:'1px'}}>
                                    <div style={{width:'33vw'}}><i>{formatCurrency(montants[i])}</i></div>
                                    <div style={{width:'33vw',marginLeft:'1.7vw'}}><i>{dates_payements[i]}</i></div>
                                    </div>
                                )
                            }

                    ligne.push(<br />)
                       
                    ligne.push(
                        (props.formMode!='consult') ?
                            <div className={classes.inputRowLeft}> 
                                <div style={{marginLeft:'10vw', width:'15vw'}}>
                                    <b>{t('write_amount_to_pay')} :  </b>
                                </div>
                                    
                                <div> 
                                    <input id="montant_paye" type="number" min="0" onChange={handleChange} className={classes.inputRowControl + ' formInput medium'}/>
                                </div>
                            </div>
                        :null                        
                    )
                        

                    return ligne;

                    })
                ()}
            <div>
                <input id="idClasse" type="hidden"  value={currentUiContext.formInputs[5]}/>
                <input id="idEleve"  type="hidden"  value={currentUiContext.formInputs[2]}/>
            </div>
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
    

 