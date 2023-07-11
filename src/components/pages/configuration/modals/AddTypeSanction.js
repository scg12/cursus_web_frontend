import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddTypeSanction(props) {
    const currentUiContext = useContext(UiContext);
    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [temps, setTemps] = useState([]);


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
        var cycle;
       
        cycle = (document.getElementById('libelle').value != undefined) ? document.getElementById('libelle').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;        
        if(cycle.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }

    useEffect(()=> {
        setTemps([{value:"jours",label:"Jours"},{value:"heures",label:"Heures"}]);

    },[])

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Libelle :  
                </div>
                    
                <div> 
                    <input id="libelle" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} />
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Description :  
                </div>
                    
                <div> 
                    <input id="description" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[1]}/>
                </div>
            </div>
            <div style={{marginBottom:'1.3vh'}}> 
                        {<select className={classes.comboBoxStyle} id="type_duree" style={{width:'25vw'}}
                        >  
                            {                        
                            (temps||[]).map((option)=> {
                                return(
                                    currentUiContext.formInputs[3]==option.value?
                                    <option key={option.value} style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                    :
                                    <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>}
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Duree :  
                </div>
                    
                <div> 
                    <input id="duree" type="number" min="0" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[5]}/>
                </div>
            </div>
            {currentUiContext.formInputs[4]?
            <div>Provoque une exclusion définitive <input className={classes.inputRowLeft} type="checkbox" defaultChecked checkbox={"exclusion_definitive"} id="exclusion_definitive"/>
            </div>
            :
            <div>Provoque une exclusion définitive<input className={classes.inputRowLeft} type="checkbox" checkbox={"exclusion_definitive"} id="exclusion_definitive"/>
            </div>
            }
            <div>
                <input id="idSanction" type="hidden"  value={currentUiContext.formInputs[2]}/>
            </div>
            {/* <input
                    class ="checkbox"
                    type="checkbox"
                  /> */}
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
 export default AddTypeSanction;
 