import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";


function AddConditionRedoublementExclusion(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [optNiveau, setOptNiveau] = useState([]);
    // const [typeCond, setTypeCond] = useState([]);

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

    function createOption(tabOption,idField, labelField){
        var newTab=[];
        for(var i=0; i< tabOption.length; i++){
            var obj={
                value: tabOption[i][idField],
                label: tabOption[i][labelField]
            }
            newTab.push(obj);
        }
        return newTab;
    }

    useEffect(()=> {
        console.log(currentAppContext.infoNiveaux,currentUiContext.currentEtab);
        // setTypeCond([{value:"Redoublement",label:"Redoublement"},{value:"Exclusion Définitive",label:"Exclusion Définitive"}]);
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((etab)=>etab.id_setab ==currentAppContext.currentEtab ),'id_niveau','libelle')); 

    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var cycle;
       
        cycle = (document.getElementById('age').value != undefined) ? document.getElementById('age').value.trim() : putToEmptyStringIfUndefined(document.getElementById('age').defaultValue).trim;        
        if(cycle.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <h6>------- Conditions Exclusion ------</h6>
            <div style={{marginBottom:'1.3vh'}}> 
                        {<select className={classes.comboBoxStyle} id="niveau" style={{width:'25vw'}}
                        >  
                            {                        
                            (optNiveau||[]).map((option)=> {
                                return(
                                    currentUiContext.formInputs[6]==option.value?
                                    <option key={option.value} style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                    :
                                    <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>}
                    </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Age max:  
                </div>
                    
                <div> 
                    <input id="age" type="number" min="0" onChange={handleChange} className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[1]}/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Heures absences max:  
                </div>
                    
                <div> 
                    <input id="heure" type="number" min="0" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[2]}/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Nombre jours exclusion max :  
                </div>
                    
                <div> 
                    <input id="jour_exclusion" type="number" min="0" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[3]}/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Moyenne min:  
                </div>
                    
                <div> 
                    <input id="moyenne" type="number" min="0" max="20" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[4]}/>
                </div>
            </div>
            <h6>------- Moyenne minimum passage classe supérieur ------</h6>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Moyenne min:  
                </div>
                    
                <div> 
                    <input id="moyenne_passage" type="number" min="0" max="20" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[7]}/>
                </div>
            </div>

            <div>
                {/* (Redoublement: age inf,heures absences inf, nombres jours exclusion inf, moyenne sup)<br />
                (Exclusion: age sup,heures absences sup, nombres jours exclusion sup, moyenne inf) */}
                <input id="idCondition" type="hidden"  value={currentUiContext.formInputs[5]}/>
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
 export default AddConditionRedoublementExclusion;
 