import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddAnnee(props) {
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
        // var config;
       
        // config = (document.getElementById('libelle').value != undefined) ? document.getElementById('libelle').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;        
        // if(config.length == 0) { 
        //     setIsValid(false)
        // } else {
        //     setIsValid(true)
        // }
    }

    function handleChange2(e){
        let checked = e.target.checked;
        document.getElementById('has_group_matiere').value = checked;
    }
    function handleChange3(e){
        let checked = e.target.checked;
        document.getElementById('utilise_coef').value = checked;
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date Début :  
                </div>
                    
                <div> 
                    <input id="date_deb" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} />
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date Fin :  
                </div>
                    
                <div> 
                    <input id="date_fin" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[1]}/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Durée Période :  
                </div>
                    
                <div> 
                    <input id="duree_periode" defaultValue={currentUiContext.formInputs[2]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    # Trimestres :  
                </div>
                    
                <div> 
                    <input id="nombre_trimestres" defaultValue={currentUiContext.formInputs[3]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    # Séquences :  
                </div>
                    
                <div> 
                    <input id="nombre_sequences" defaultValue={currentUiContext.formInputs[4]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Notation sur :  
                </div>
                    
                <div> 
                    <input id="notation_sur" defaultValue={currentUiContext.formInputs[5]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Matières classées en groupe :  
                </div>
                    
                <div> 
                {currentUiContext.formInputs[6]==true?
                    <input type="checkbox" defaultChecked className={classes.inputRowControl + ' formInput'} onClick={handleChange2}  />
                :
                <input type="checkbox" className={classes.inputRowControl + ' formInput'} onClick={handleChange2}  />

                }
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Appellation Bulletin :  
                </div>
                    
                <div> 
                    <input id="appellation_bulletin" defaultValue={currentUiContext.formInputs[7]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Utilisation des coefficients :  
                </div>
                    
                <div> 
                {currentUiContext.formInputs[8].includes("oef")?
                    <input type="checkbox" defaultChecked className={classes.inputRowControl + ' formInput'} onClick={handleChange3}  />
                :
                <input  type="checkbox" className={classes.inputRowControl + ' formInput'} onClick={handleChange3}  />

                }
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Appellation Coef :  
                </div>
                    
                <div> 
                    <input id="appellation_coef" defaultValue={currentUiContext.formInputs[9]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Appellation Elève :  
                </div>
                    
                <div> 
                    <input id="appellation_apprenant" defaultValue={currentUiContext.formInputs[10]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Appellation Formateur :  
                </div>
                    
                <div> 
                    <input id="appellation_formateur" defaultValue={currentUiContext.formInputs[11]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Appellation Séquence :  
                </div>
                    
                <div> 
                    <input id="appellation_sequence" defaultValue={currentUiContext.formInputs[12]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Appellation Module :  
                </div>
                    
                <div> 
                    <input id="appellation_module" defaultValue={currentUiContext.formInputs[13]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Appellation Chapitre :  
                </div>
                    
                <div> 
                    <input id="appellation_chapitre" defaultValue={currentUiContext.formInputs[14]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Appellation Leçon :  
                </div>
                    
                <div> 
                    <input id="appellation_lecon" defaultValue={currentUiContext.formInputs[15]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Abbréviation Module :  
                </div>
                    
                <div> 
                    <input id="abbreviation_module" defaultValue={currentUiContext.formInputs[16]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Abbréviation Chapitre :  
                </div>
                    
                <div> 
                    <input id="abbreviation_chapitre" defaultValue={currentUiContext.formInputs[17]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Abbréviation Leçon :  
                </div>
                    
                <div> 
                    <input id="abbreviation_lecon" defaultValue={currentUiContext.formInputs[18]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange}  />
                </div>
            </div>


            <div>
                <input id="idEtab" type="hidden"  value={currentUiContext.formInputs[19]}/>
                <input id="has_group_matiere" type="hidden"  defaultValue={currentUiContext.formInputs[6]==true}/>
                <input id="utilise_coef" type="hidden"  defaultValue={currentUiContext.formInputs[8].includes("oef")}/>
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
 export default AddAnnee;
 