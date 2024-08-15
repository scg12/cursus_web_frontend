import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import axiosInstance from '../../../../axios';
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

var oldPasswd, newPasswd, pwdConfirm;

function ConfigPswd(props) {
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n }       = useTranslation();

    const selectedTheme         = currentUiContext.theme;
    const [isValid, setIsValid] = useState(false);

    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
      }
    }

/************************************ Handlers ************************************/

    function changeHandler() {
        oldPasswd =  document.getElementById('oldPasswd').value;
        newPasswd =  document.getElementById('newPasswd').value;
        pwdConfirm = document.getElementById('confirmNewPasswd').value;


        if(oldPasswd.length == 0 || newPasswd.length == 0 || pwdConfirm.length == 0) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }


    function modifyPwd(e) {
        e.preventDefault();
        var newPassWordObj = getFormData();
        var errorDiv = document.getElementById('errMsgPlaceHolder');        
     
        if (formDataCheck(newPassWordObj).length==0) { 
            //clearForm(); 
            //alert('Login Modifier avec succes!')
        
           axiosInstance.post(`change-password/`, {
                id_sousetab : currentAppContext.currentEtab,
                id_user     : currentAppContext.idUser,
                old_password: newPassWordObj.oldPasswd,
                new_password: newPassWordObj.newPasswd
                               
            }).then((res)=>{
                console.log(res.data);
                //Retourner le statut de l'action
                errorDiv.className = classes.formSuccessMsg;
                errorDiv.textContent = t("success_modif");               
                //alert('Login Modifier avec succes!')
                //clearForm();              
            })   

        } else {
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(newPassWordObj);
        }

    }
    
    function getFormData(){
       var passwdObj ={
           oldPasswd :'',
           newPasswd :'',
           confrimNewPasswd:''
        }
        passwdObj.oldPasswd = document.getElementById('oldPasswd').value;
        passwdObj.newPasswd = document.getElementById('newPasswd').value;
        passwdObj.confrimNewPasswd = document.getElementById('confirmNewPasswd').value;
        return passwdObj;
    }

    function formDataCheck(passwdObj){
        var errorMsg='';     

        if(passwdObj.newPasswd != passwdObj.confrimNewPasswd) {
            errorMsg= 'La confirmation du nouveau mot de passe ne correspond pas au nouveau mot de passe!';
            return errorMsg;
        }

        if(passwdObj.newPasswd.length<4) {
            errorMsg= 'Votre mot de passe doit contenir au moins 3 caracteres!';
            return errorMsg;
        }
        return  errorMsg;
    }


    function  clearForm(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        errorDiv.className = null;
        errorDiv.textContent ='';

        document.getElementById('oldPasswd').value = '';     
        document.getElementById('newPasswd').value = '';     
        document.getElementById('confirmNewPasswd').value ='';
        setIsValid(false);
    }
    
/************************************ JSX CODE ************************************/
    return (

        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'></div>
            <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                {t("conseil_class_prepa")}
            </div> 
            
            <div className={classes.inputRow}> 
                <div className={classes.inputRowLabel}>
                    Ancien Mot De Passe :
                </div>
                    
                <div> 
                    <input id="oldPasswd" type="password" className={classes.inputRowControl + ' formInput'} onChange={changeHandler}/>
                </div>
            </div>

            <div className={classes.inputRow}> 
                <div className={classes.inputRowLabel}>
                    Nouveau Mot De Passe :
                </div>
                    
                <div> 
                    <input id="newPasswd" type="password" className={classes.inputRowControl + ' formInput'} onChange={changeHandler} />
                </div>
            </div>

            <div className={classes.inputRow}> 
                <div className={classes.inputRowLabel}>
                    Confirmation Nouveau :
                </div>
                    
                <div> 
                    <input id="confirmNewPasswd" type="password" className={classes.inputRowControl + ' formInput'} onChange={changeHandler} />
                </div>
            </div>

            <div className={classes.buttonRow}>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler = {clearForm}

                />
                
                <CustomButton
                    btnText='Valider' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    disable = {(isValid==false)}
                    btnClickHandler = {modifyPwd}
                />
                
            </div>

            
            


   
        </div>
       
     );
 }
 
 export default ConfigPswd;