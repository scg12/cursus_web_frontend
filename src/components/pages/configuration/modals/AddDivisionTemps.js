import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState } from "react";

var cycleLib, cycleDesc;
function AddDivisionTemps(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(false);
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

    function changeHandler() {
        cycleLib = document.getElementById('cycleLib').value;
        cycleDesc = document.getElementById('cycleDesc').value;

        if(cycleLib.length == 0) {
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }

    
    
    return (

        <div className={classes.formModal}>
            <div className={classes.inputRow}> 
                <div className={classes.formTitle}>
                    CREATION DE DIVISION DE TEMPS
                </div>
            </div>

            <div className={classes.inputRow}> 
                <div className={classes.inputRowLabel}>
                    De(heure de debute) :
                </div>
                    
                <div> 
                    <input id="cycleLib" type="text" className={classes.inputRowControl + ' formInput'} onChange={changeHandler} />
                </div>
            </div>

            <div className={classes.inputRow}> 
                <div className={classes.inputRowLabel}>
                    A(heure de fin) :
                </div>
                    
                <div> 
                    <input id="cycleDesc" type="text" className={classes.inputRowControl + ' formInput'} onChange={changeHandler} />
                </div>
            </div>

            <div className={classes.inputRow}> 
                <div className={classes.inputRowLabel}>
                    Action :
                </div>
                    
                <div> 
                    <input id="cycleDesc" type="text" className={classes.inputRowControl + ' formInput'} onChange={changeHandler} />
                </div>
            </div>

            <div className={classes.buttonRow}>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
                <CustomButton
                    btnText='Valider' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? props.addCycleHandler : null}
                    disable={(isValid==false)}
                />
                
            </div>

        </div>
       
    );
}
 
export default AddDivisionTemps;