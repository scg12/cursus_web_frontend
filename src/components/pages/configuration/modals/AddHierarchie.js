import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddHierarchie(props) {
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
        var hierarchie;
       
        hierarchie = (document.getElementById('libelleHierarchie').value != undefined) ? document.getElementById('libelleHierarchie').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelleHierarchie').defaultValue).trim;        
        if(hierarchie.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }
    function handleChange2(e){
        let checked = e.target.checked;
        if (checked==true) 
            document.getElementById('isAdministratif').value = "1";
        else
            document.getElementById('isAdministratif').value = "0";
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>
            {currentUiContext.formInputs[2]!==0?
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Hierarchie :  
                </div>
                    
                <div> 
                    <input id="libelleHierarchie" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} />
                </div>
            </div>:
            <div className={classes.inputRowLeft}> 
            <div className={classes.inputRowLabel}>
                Hierarchie :  
            </div>
                
            <div>
                <label className={classes.inputRowControl + ' formInput'}>{currentUiContext.formInputs[0]}</label>
                {/* <input id="libelleHierarchie" type="text" contentEditable={false} className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} /> */}
            </div>
        </div>

}
            {currentUiContext.formInputs[2]!==0?
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Administratif :  
                </div>
                    
                <div>
                    {currentUiContext.formInputs[1]=="1"?
                    <input type="checkbox" defaultChecked onChange={handleChange2} /> 
                    :
                    <input type="checkbox" onChange={handleChange2} /> 
                    }
                </div>
            </div>:
            null
            }

            {currentUiContext.formInputs[2]!==0?
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Rang :  
                </div>                    
                <div>
                    <input id="rang" type="number" min="0" className={classes.inputRowControl + ' formInput'} defaultValue={currentUiContext.formInputs[3]}/>
                    <input id="rang" type="hidden" className={classes.inputRowControl + ' formInput'} defaultValue="0"/>
                    </div>
            </div>
            :
            <input id="rang" type="hidden" className={classes.inputRowControl + ' formInput'} defaultValue="0"/>
            }
            <div>
                <input id="idHierarchie" type="hidden"  value={currentUiContext.formInputs[2]}/>
                <input id="isAdministratif" type="hidden"  value={currentUiContext.formInputs[1]}/>
            </div>
            <div className={classes.buttonRow}>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
                {currentUiContext.formInputs[2]!==0?
                <CustomButton
                    btnText={(props.formMode=='creation') ? 'Valider':'Modifier'} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? props.actionHandler : null}
                    disable={!isValid}
                />:
                null
               }
            </div>
                

            

        </div>
       
     );
 }
 export default AddHierarchie;
 