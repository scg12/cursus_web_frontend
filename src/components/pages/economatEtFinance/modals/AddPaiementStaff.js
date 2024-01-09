import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { fontSize } from '@mui/system';
import { useTranslation } from "react-i18next";


let tabSexePrim=[];
let tabRedoublePrim=[];
var BASE_MONTANT_VERSE;
var BAESE_MONTANT_RESTANT;

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const OP_SUCCESS  =3;
const MSG_CONFIRM =4;


function AddPaiementStaff(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [montantRestant, setMontantRestant] = useState(Number(0?currentUiContext.formInputs[4]>=currentUiContext.formInputs[7] : currentUiContext.formInputs[7]-currentUiContext.formInputs[4]));
    const [optQualite, setOptQualite]       = useState([]);
    const [optUser, setOptUser]             = useState([]);
    const [listPaiements, setListPaiements] = useState([]);
    const selectedTheme = currentUiContext.theme;
    
    useEffect(()=> {
        setOptQualite(tabQualite);
    //    setListPaiements(tabLastPaiement2);
        setOptUser(tabUser);

    },[])

    var tabQualite =[
        {value:1, label:"Enseignant"},
        {value:2, label:"Administration"},
    ];

    var tabUser =[
        {value:1, label:"MBARGA Lucas"},
        {value:2, label:"ADAMA Traore"},
        {value:2, label:"MAGNE ODETTE"},
    ];

    var tabLastPaiement1 = [
        {rang:"1", montant:"120 000", date:"12/05/2023" },
        {rang:"2", montant:"120 000", date:"12/04/2023" },
        {rang:"3", montant:"120 000", date:"12/03/2023" },
        {rang:"4", montant:"120 000", date:"12/02/2023" },
    ];

    var tabLastPaiement2 = [
        {rang:"1", montant:"80 000", date:"12/05/2023" },
        {rang:"2", montant:"60 000", date:"12/04/2023" },
        {rang:"3", montant:"80 000", date:"12/03/2023" },
        {rang:"4", montant:"80 000", date:"12/02/2023" },
    ];

    var tabLastPaiement3 = [
        {rang:"1", montant:"75 000", date:"12/05/2023" },
        {rang:"2", montant:"60 000", date:"12/04/2023" },
        {rang:"3", montant:"80 000", date:"12/03/2023" },
        {rang:"4", montant:"80 000", date:"12/02/2023" },
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
    
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var frais;
      
        frais = e.target.value;        
        if(frais!=undefined && frais>0) { 
            
          
            setIsValid(true);
        } else {
          
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

    function qualiteChangeHandler(){

    }

    function userChangeHandler(){
        setListPaiements(tabLastPaiement1);
    }

    /************************************ JSX Code ************************************/

    const LignePaiementHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'grey', flexDirection:'row', alignSelf:"center", height:'3.7vh', width:'89%', fontSize:'0.93vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black', marginTop:"-2vh"}}>
                <div style={{width:'7vw',marginLeft:"1vw"}}>    {t("N°")}        </div>
                <div style={{width:'7vw'}}>      {t("date")}      </div> 
                <div style={{width:'12vw'}}>{t("paid_amount")}   </div>   
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
                        <select id='optQualite' defaultValue={1} onChange={userChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'1.73rem',width:'19vw'}}>
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
                    <input id="montant_paye" type="number" min="0" onChange={handleChange} className={classes.inputRowControl + ' formInput medium'}/>
                </div>
            </div>

           <div>
                <input id="idClasse" type="hidden"  value={currentUiContext.formInputs[5]}/>
                <input id="idEleve" type="hidden"  value={currentUiContext.formInputs[2]}/>
            </div>

            
            <div className={classes.buttonRow} style={{alignSelf:'center', width:'20vw', marginBottom:"3vh"}}>
                
                <CustomButton
                    btnText={(props.formMode=='creation') ? t('init_paiement'):t('save')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? actionHandler : null}
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
    

 