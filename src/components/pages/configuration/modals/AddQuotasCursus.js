import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddQuotasCursus(props) {
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

    useEffect(()=> {
        let id_hierarchies="_",quotas_cursus="_";
        let total = 0;
        currentUiContext.formInputs[0].forEach(q =>{
            id_hierarchies +=q.id+"_";
            quotas_cursus +=q.quota_cursus+"_";
            total += parseFloat(q.quota_cursus)
        })
        if(total <=100) { 
            setIsValid(true)
        } else {
            setIsValid(false)
        }
        document.getElementById("idHierarchies").value=id_hierarchies;
        document.getElementById("quotas").value=quotas_cursus;
    },[]);

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){ console.log(e.target.value,e.target.id)
        let quota;
        let id = e.target.id;
        let value = e.target.value;
       quota =  document.getElementsByTagName('input');

       let info =document.getElementById("idHierarchies").value;
       let n = quota.length;
       let total=0.0;
       let position = 0;
       let quotas_cursus="_";
       for(let i=0;i<n;i++){
        if(isNaN(quota[i].value)==false){
            quotas_cursus +=quota[i].value+"_";
            total = total + parseFloat(quota[i].value)
        }
       }
       document.getElementById("quotas").value=quotas_cursus;
        if(total <=100) { 
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }

    /************************************ JSX Code ************************************/

    return ( 
        <div className={classes.formStyle}>
            { (()=>{
                    let quotas = currentUiContext.formInputs[0];
                    let ligne = [];
                    quotas.forEach(quota => {
                        ligne.push(<div key={quota.id}><label>{quota.libelle}</label>&nbsp;   
                        <input id={quota.id} type="number" min="0" max="100" defaultValue={quota.quota_cursus} onChange={handleChange} /></div>);
                    });

                    return ligne;
                })
                ()}
            <input type="text" id="idHierarchies" defaultValue="" />
            <input type="text" id="quotas" defaultValue="" />
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
 export default AddQuotasCursus;
 