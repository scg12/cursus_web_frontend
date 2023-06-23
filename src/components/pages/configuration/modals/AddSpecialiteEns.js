import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddSpecialiteEns(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [optMatiere, setOptMatiere] = useState([]);
    const [optMatiere2, setOptMatiere2] = useState([]);
    const [optMatiere3, setOptMatiere3] = useState([]);
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
    function getSelectDropDownTextColr() {
        switch(selectedTheme){
            case 'Theme1': return 'rgb(60, 160, 21)';
            case 'Theme2': return 'rgb(64, 49, 165)';
            case 'Theme3': return 'rgb(209, 30, 90)';
            default: return 'rgb(60, 160, 21)';
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
    function createOption2(tabOption,idField, labelField){
        var newTab=[];
        newTab.push({value:"",label:""})
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
        setOptMatiere(createOption(currentUiContext.formInputs[4],'id','libelle'));
        setOptMatiere2(createOption2(currentUiContext.formInputs[4],'id','libelle'));
        setOptMatiere3(createOption2(currentUiContext.formInputs[4],'id','libelle'));
    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var ens;
       
        ens = (document.getElementById('nom').value != undefined) ? document.getElementById('nom').value.trim() : putToEmptyStringIfUndefined(document.getElementById('nom').defaultValue).trim;        
        if(ens.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            {/* <div id='errMsgPlaceHolder'/> */}

            <div className={classes.inputRowLeft}> 
                <h6>
                    {currentUiContext.formInputs[0]+" "+currentUiContext.formInputs[1]}  
                </h6>
                    
                {/* <div> 
                    <input id="nom" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} />
                </div> */}
            </div>

            
                {/* { (()=>{
                    let matieres_spe = currentUiContext.formInputs[3];
                    // let matieres = currentUiContext.formInputs[4];
                    let n = 3;
                    let nb = 0;
                    if (matieres_spe!="")
                      {matieres_spe = matieres_spe.split(",")
                       nb = matieres_spe.length;
                    }
                    let ligne = [],cpt=0,item;
                    for(let i=0;i<n;i++){
                        item=""
                        if(cpt<nb){
                            if(matieres_spe[cpt]!="")
                                item = matieres_spe[cpt]
                        }
                        cpt++;
                        ligne.push(
                            <div style={{marginBottom:'1.3vh'}}> 
                    {<select className={classes.comboBoxStyle} id={"mat_"+(i+1)} style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    >  
                        {                        
                        (optMatiere||[]).map((option)=> {
                            return(
                                item==option.value?
                                <option key={option.value} style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                :
                                <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>}
                </div>
                        );
                    }


                    return ligne;
                })
                ()} */}
                <div className={classes.inputRowLeft}> 
                    <div className={classes.inputRowLabel}>
                        Matiere Spécialité 1 :  
                    </div>
                    <div style={{marginBottom:'1.3vh'}}> 
                        {<select className={classes.comboBoxStyle} id="mat_1" style={{color:getSelectDropDownTextColr(), width:'25vw',borderColor:getSelectDropDownTextColr()}}
                        >  
                            {                        
                            (optMatiere||[]).map((option)=> {
                                return(
                                    currentUiContext.formInputs[5]==option.value?
                                    <option key={option.value} style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                    :
                                    <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>}
                    </div>
                </div>
                <div className={classes.inputRowLeft}> 
                    <div className={classes.inputRowLabel}>
                        Matiere Spécialité 2 :  
                    </div>
                    <div style={{marginBottom:'1.3vh'}}> 
                        {<select className={classes.comboBoxStyle} id="mat_2" style={{color:getSelectDropDownTextColr(), width:'25vw',borderColor:getSelectDropDownTextColr()}}
                        >  
                            {                        
                            (optMatiere2||[]).map((option)=> {
                                return(
                                    currentUiContext.formInputs[6]==option.value?
                                    <option key={option.value} style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                    :
                                    <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>}
                    </div>
                </div>
                <div className={classes.inputRowLeft}> 
                    <div className={classes.inputRowLabel}>
                        Matiere Spécialité 3 :  
                    </div>
                    <div style={{marginBottom:'1.3vh'}}> 
                        {<select className={classes.comboBoxStyle} id="mat_3" style={{color:getSelectDropDownTextColr(), width:'25vw',borderColor:getSelectDropDownTextColr()}}
                        >  
                            {                        
                            (optMatiere2||[]).map((option)=> {
                                return(
                                    currentUiContext.formInputs[7]==option.value?
                                    <option key={option.value} style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                    :
                                    <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>}
                    </div>
                </div>

            <div>
                <input id="idEns" type="hidden"  value={currentUiContext.formInputs[2]}/>
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
 export default AddSpecialiteEns;
 