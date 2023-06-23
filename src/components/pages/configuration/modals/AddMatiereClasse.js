import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import { toDataSourceRequest } from '@progress/kendo-data-query';


function AddMatiere(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        // console.log(currentAppContext.formInputs[1])
    },[]);

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
        // console.log(e.target.id,document.getElementById(e.target.id).checked);
        let checked = e.target.checked;
        // let checked =document.getElementById(e.target.id).checked;
        let matieres = document.getElementById('idMatieres').value;
        console.log("avant: ",matieres);
        let item = e.target.id;
        if(checked){
            // if(matieres.length==0)
            //     matieres+= ","+item+",";
            // else
                matieres+= item+",";
        }
        else { console.log("enleve lui: ",","+item+",")
        matieres = matieres.replace(","+item+",",",");}
        document.getElementById('idMatieres').value = matieres;
        console.log(matieres);
        // setUpdateMatieres(matieres);
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                {currentUiContext.formInputs[0]}  
                </div>
            </div>

            <div>
                <input id="idClasse" type="hidden"  defaultValue={currentUiContext.formInputs[3]}/><br />
                <input id="idMatieres" type="hidden"  defaultValue={currentUiContext.formInputs[2]}/>
            </div>
            <div>
                { (()=>{
                    let matieres = currentUiContext.formInputs[1].split(",");
                    let id_matieres = currentUiContext.formInputs[2].split(",");
                    let matieres_etab = currentUiContext.formInputs[4];
                    let n= matieres_etab.length -1;
                    let checkboxes = [];
                    for (let i=0;i<n;i++){
                        if (id_matieres.includes(matieres_etab[i].id+""))
                            checkboxes.push(<div key={matieres_etab[i].id}><input id={matieres_etab[i].id} type="checkbox" defaultChecked 
                            onClick={handleChange}
                            />  {matieres_etab[i].libelle}</div>)
                        else
                            checkboxes.push(<div key={matieres_etab[i].id}><input  id={matieres_etab[i].id} type="checkbox" 
                            onClick={handleChange}
                            />  {matieres_etab[i].libelle}</div>)
                    }
                    return checkboxes;
                })

                ()}
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
 export default AddMatiere;
 