import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddSequence(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const selectedTheme = currentUiContext.theme;
    const [opt, setOpt] = useState([]);



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

    useEffect(()=> {
        setOpt(createOption(currentUiContext.formInputs[6],'id','libelle')); 
    
    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var sequence;
       
        sequence = (document.getElementById('libelle').value != undefined) ? document.getElementById('libelle').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;        
        if(sequence.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }

    function actionHandler(){
        var seqs = { 
            id:document.getElementById('idSequence').value, 
            libelle:document.getElementById('libelle').value,
            id_tr:document.getElementById('id_trimestre').value,
            date_deb:document.getElementById('date_deb').value,
            date_fin:document.getElementById('date_fin').value,
            is_active:document.getElementById('is_active').checked ? "1":"0",
            //numero:0,
        }

        // seqs.id = document.getElementById('idSequence').value;
        // seqs.libelle = document.getElementById('libelle').value;
        // seqs.date_deb = document.getElementById('date_deb').value;
        // seqs.date_fin = document.getElementById('date_fin').value;
        // seqs.is_active = document.getElementById('is_active').checked;
        // seqs.id_tr = document.getElementById('id_trimestre').value;

        console.log("sequence:",seqs)

        props.actionHandler(seqs);
    }

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


            {/* <div className={classes.inputRowLeft} style={{marginBottom:'1.3vh', marginTop:'1.3vh'}}> 
                <div className={classes.inputRowLabel}>
                    Trimestre :  
                </div>
                <div > 
                    {<select className={classes.comboBoxStyle} id="id_trimestre" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    >  
                        {                        
                        (opt||[]).map((option)=> {
                            return(
                                currentUiContext.formInputs[3]==option.value?
                                <option key={option.value} style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                :
                                <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>}
                </div>
            </div> */}

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date Début :  
                </div>
                    
                <div> 
                    <input id="date_deb" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[4]}/>
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date Fin :  
                </div>
                    
                <div> 
                    <input id="date_fin" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[5]}/>
                </div>
            </div>

            {/* <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Pourcentage :  
                </div>
                    
                <div> 
                    <input id="pourcentage" type="number" className={classes.inputRowControl} style={{width:'3.3vw', height:'1.5rem'}} onChange={handleChange} defaultValue={currentUiContext.formInputs[5]}/> %
                </div>
            </div> */}

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Activé :  
                </div>
                    
                <div> 
                    {currentUiContext.formInputs[1]==true?
                        <input id="is_active" type="checkbox" defaultChecked style={{height:'3vh', width:'3vh'}} />
                        :
                        <input  id="is_active" type="checkbox" style={{height:'3vh', width:'3vh'}} />
                    }
                </div>
            </div>

            <div>
                <input id="idSequence" type="hidden"  value={currentUiContext.formInputs[2]}/>
                {/* <input id="trimestre" type="text"  defaultValue={currentUiContext.formInputs[3]}/> */}
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
                    btnClickHandler={(isValid) ? actionHandler : null}
                    disable={!isValid}
                />
                
            </div>

            

        </div>
       
     );
 }
 export default AddSequence;
 