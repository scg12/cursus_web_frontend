import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import Select from 'react-select'

function AddNiveau(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const selectedTheme = currentUiContext.theme;
    const[optCycle, setOptCycle] = useState([]);
    const[changeCycleSelected, setChangeCycleSelected] = useState('');

    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
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
        // props.formMode=='modif'
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab),'id_cycle','libelle')); 
        // if(props.formMode=='modif')
        //     setChangeCycleSelected({value:currentUiContext.formInputs[3],label:currentUiContext.formInputs[4]})
        // else
        //     setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab),'id_cycle','libelle')[0]);
    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var niveau;
       
        niveau = (document.getElementById('libelle').value != undefined) ? document.getElementById('libelle').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;        
        if(niveau.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }
    function dropDownCycleChangeHandler(e){
        document.getElementById('idCycleSelected').value = e.value;
        // currentAppContext.setCurrentCycle(e.value);
        // setOptCycle(null);
        // setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab),'id_cycle','libelle')); 
        // setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_cycle == e.value),'id_cycle','libelle')[0]);
      }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Cycle :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    {<select className={classes.comboBoxStyle} style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    onChange={dropDownCycleChangeHandler}
                    >
                        {(optCycle||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>}
                </div>
            </div> 

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
                    Code :  
                </div>
                    
                <div> 
                    <input id="code" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[1]}/>
                </div>
            </div>
            <div>
                <input id="idNiveau" type="hidden"  value={currentUiContext.formInputs[2]}/>
                <input id="idCycleSelected" type="hidden"  value={changeCycleSelected.value}/>

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
 export default AddNiveau;
 