import React from 'react';
import classess from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddClassesPassages(props) {
    const currentUiContext = useContext(UiContext);
    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [temps, setTemps] = useState([]);


    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classess.Theme1_Btnstyle ;
        case 'Theme2': return classess.Theme2_Btnstyle ;
        case 'Theme3': return classess.Theme3_Btnstyle ;
        default: return classess.Theme1_Btnstyle ;
      }
    }

    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classess.Theme1_BtnstyleSmall ;
        case 'Theme2': return classess.Theme2_BtnstyleSmall ;
        case 'Theme3': return classess.Theme3_BtnstyleSmall ;
        default: return classess.Theme1_BtnstyleSmall ;
      }
    }

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var cycle;
       
        cycle = (document.getElementById('libelle').defaultValue != undefined) ? document.getElementById('libelle').defaultValue.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;        
        if(cycle.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }

    useEffect(()=> {
        setTemps([{defaultValue:"jours",label:"Jours"},{defaultValue:"heures",label:"Heures"}]);

    },[])

    /************************************ JSX Code ************************************/

    return (
        <div className={classess.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <div className={classess.inputRowLeft}> 
                <div className={classess.inputRowLabel}>
                    Classe :  
                </div>
                    
                <div> 
                    <input id="classe" type="text" className={classess.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} />
                </div>
            </div>
            
            { (()=>{
                        let classes = [];
                        let lib_classes = [];
                        let table = [];
                        let data = [];
                        let passe = false;


                    if (currentUiContext.formInputs[3]!==""){
                        classes = currentUiContext.formInputs[3].split(",");
                        lib_classes = currentUiContext.formInputs[4].split(",");
                        let n = classes.length;
                        for (let i=0;i<n;i++){

                            passe = false;
                            if (currentUiContext.formInputs[1]!==""){
                                data = currentUiContext.formInputs[1].split(",");
                                let m = data.length;
                                for (let j=0;j<m;j++){
                                    if(classes[i]===data[j]){
                                        passe = true;
                                        break;
                                    }   
                                }
                                if(passe){
                                    table.push(<div>{lib_classes[i]} <input className={classess.inputRowLeft} type="checkbox" checkbox="check" defaultChecked id={"checkbox_"+classes[i]} />
                                    </div>)
                                }
                                else{
                                    table.push(<div>{lib_classes[i]} <input className={classess.inputRowLeft} type="checkbox" checkbox="check" id={"checkbox_"+classes[i]} />
                                </div>)
                                }
                            }
                            else{
                                table.push(<div>{lib_classes[i]} <input className={classess.inputRowLeft} type="checkbox" checkbox="check" id={"checkbox_"+classes[i]} />
                            </div>)
                            }
                        }
                    }
                    return table;
                })

            ()}
            <div>
                <input id="idClasse" type="hidden"  defaultValue={currentUiContext.formInputs[2]}/>
            </div>
            {/* <input
                    class ="checkbox"
                    type="checkbox"
                  /> */}
            <div className={classess.buttonRow}>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classess.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
                <CustomButton
                    btnText={(props.formMode=='creation') ? 'Valider':'Modifier'} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classess.btnTextStyle}
                    btnClickHandler={(isValid) ? props.actionHandler : null}
                    disable={!isValid}
                />
                
            </div>

            

        </div>
       
     );
 }
 export default AddClassesPassages;
 