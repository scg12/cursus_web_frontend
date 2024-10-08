import React from 'react';
import axiosInstance from '../../../../axios';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

var login;
function ConfigLogin(props) {
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
        login = document.getElementById('login').value;

        if (login.length == 0) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }

    }

    function modifyLogin(e) {
        e.preventDefault();
        var newLogin = getFormData();
        var errorDiv = document.getElementById('errMsgPlaceHolder');
           
        if (formDataCheck(newLogin).length==0) { 
            //clearForm();            
        
           axiosInstance.post(`change-login/`, {
                id_sousetab : currentAppContext.currentEtab,
                id_user     : currentAppContext.idUser,
                new_login: newLogin                
            }).then((res)=>{
                console.log(res.data);
                //Retourner le statut de l'action
                errorDiv.className = classes.formSuccessMsg;
                errorDiv.textContent = t("success_modif"); 
                //clearForm();              
            })       

        } else {
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(login);
        }

    }
    
    function getFormData(){
        return document.getElementById('login').value;
    }

    function formDataCheck(login){
        var errorMsg='';
        var format1 = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        var format2 = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;

        if(!isNaN(login[0])||format1.test(login[0])) {
            errorMsg= 'Votre login doit commencer par un caractere alphabetique!';
            return errorMsg;
        }

        if(format2.test(login)) {
            errorMsg= 'Votre login contient des caracteres non valides!';
            return errorMsg;
        }

        return  errorMsg;
    }


    function  clearForm(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        errorDiv.className = null;
        errorDiv.textContent ='';

        document.getElementById('login').value='';
        setIsValid(false);
    }

    function getConfigTitleColor(){
        switch(selectedTheme){
            case 'Theme1': return "#3ca015" ;
            case 'Theme2': return "#2358bb" ;
            case 'Theme3': return "#d11e5a" ;
            default: return "#3ca015" ;
        }
    }
    
/************************************ JSX CODE ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'></div>
            <div className={classes.inputRowLeft} style={{color:getConfigTitleColor(), fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:getConfigTitleColor(), borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                {t("modif_login")}
            </div> 

            <div className={classes.inputRow}>
                
                <div className={classes.inputRowLabel}>
                    Nouveau Login :
                </div>                    
                <div> 
                    <input id="login" type="text"  className={classes.inputRowControl + ' formInput'}  onChange={changeHandler}/>
                </div>
            </div>
            
            <div className={classes.buttonRow}>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnClickHandler = {clearForm}
                    btnTextStyle = {classes.btnTextStyle}

                />
                
                <CustomButton
                    btnText='Valider' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler = {modifyLogin}
                    disable = {(isValid==false)}

                />
                
            </div>

            

        </div>
       
     );
 }
 
 export default ConfigLogin;