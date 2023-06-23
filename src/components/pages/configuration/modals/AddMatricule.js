import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddMatricule(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const selectedTheme = currentUiContext.theme;


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

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        // let fixe,nombre,annee,format;
        // fixe = (document.getElementById('fixe').value != undefined) ? document.getElementById('fixe').value.trim() : putToEmptyStringIfUndefined(document.getElementById('fixe').defaultValue).trim;        
        // nombre = (document.getElementById('nombre').value != undefined) ? document.getElementById('nombre').value.trim() : putToEmptyStringIfUndefined(document.getElementById('nombre').defaultValue).trim;        
        let annee = (document.getElementById('annee').value != undefined) ? document.getElementById('annee').value.trim() : putToEmptyStringIfUndefined(document.getElementById('annee').defaultValue).trim;        
        // format = (document.getElementById('format').value != undefined) ? document.getElementById('format').value.trim() : putToEmptyStringIfUndefined(document.getElementById('format').defaultValue).trim;        
        console.log(document.getElementById('annee').value)
        // console.log(fixe,nombre,annee,format)
        // if(fixe.length == 0 || nombre.length == 0 || annee.length == 0 )//||!(format.length == 3 && format.includes("F")&& format.includes("Y")&& format.includes("N"))) 
        // { 
        //     setIsValid(false)
        // } else {
        //     setIsValid(true)
        // }
        // setIsValid(true)

    }

    function handleChange2(e){
        let checked = e.target.checked;
        if (checked)
            document.getElementById('matricule_partage').value = "1";
        else 
            document.getElementById('matricule_partage').value = "0";

    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                {currentUiContext.formInputs[0]}  
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Partie Fixe(F) :  
                </div>
                    
                <div> 
                    <input id="fixe" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue=""/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Nombre de Chiffres(N) :  
                </div>
                    
                <div> 
                    <input id="nombre" type="number" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue="5"/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Partie pour l'année(Y) :  
                </div>
                    
                <div> 
                    <input id="annee" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue="22"/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Format Matricule :  
                </div>
                    
                <div> 
                    <input id="format" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue="FNY"/>
                </div>
            </div>
            <div> 
                 Matricule partagé par tous les établissements <input type="checkbox"  onChange={handleChange2} />
                </div>
            <div>
                <input id="idEtab" type="hidden"  value={currentUiContext.formInputs[2]}/>
                <input id="matricule_partage" type="hidden"  value="0"/>
            </div>

            <div className={classes.buttonRow}>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
                <CustomButton
                    btnText={(props.formMode=='creation') ? 'Valider':'Modifier'} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? props.actionHandler : null}
                    disable={!isValid}
                />
                
            </div>

            

        </div>
       
     );
 }
 export default AddMatricule;
 