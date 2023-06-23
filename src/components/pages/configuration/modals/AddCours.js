import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";

function AddCours(props) {
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
        // var cycle;
        let libelle = document.querySelectorAll('input[role="libelle"]');
        let coef = document.querySelectorAll('input[role="coef"]');
        let qh = document.querySelectorAll('input[role="qh"]');
        let qa = document.querySelectorAll('input[role="qa"]');
        let res_libelle="";
        let res_coef="";
        let res_qh="";
        let res_qa="";
        libelle.forEach(i =>{
            console.log(i.name,i.value)
            res_libelle+=i.name+"--"+i.value+"²²"
        })
        coef.forEach(i =>{
            res_coef+=i.value+"²²"

        })
        qh.forEach(i =>{
            res_qh+=i.value+"²²"
        })
        qa.forEach(i =>{
            res_qa+=i.value+"²²"
        })
        document.getElementById("libelle").value = res_libelle;
        document.getElementById("coef").value = res_coef;
        document.getElementById("qh").value = res_qh;
        document.getElementById("qa").value = res_qa;
        console.log("res_libelle: ",res_libelle)
        console.log("res_coef: ",res_coef)
        console.log("res_qh: ",res_qh)
        console.log("res_qa: ",res_qa)
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                {currentUiContext.formInputs[4]}  
                </div>
            </div>

            <div>
            <input id="libelle" type="text"  defaultValue=""/>
            <input id="coef" type="text"  defaultValue=""/>
            <input id="qh" type="text"  defaultValue=""/>
            <input id="qa" type="text"  defaultValue=""/>
            <input id="idClasse" type="text"  defaultValue={currentUiContext.formInputs[5]}/>

                {/* <input id="libelleMatieres" type="text"  defaultValue={currentUiContext.formInputs[0]}/> <br />
                <input id="libelleCours" type="text"  defaultValue={currentUiContext.formInputs[1]}/> <br />
                <input id="idCours" type="text"  defaultValue={currentUiContext.formInputs[2]}/><br />
                <input id="idMatieres" type="text"  defaultValue={currentUiContext.formInputs[3]}/><br />
                <input id="libelleClasse" type="text"  defaultValue={currentUiContext.formInputs[4]}/><br />
                <input id="nbre" type="text"  defaultValue={currentUiContext.formInputs[6]}/>
                <input id="infoCours" type="text"  defaultValue={currentUiContext.formInputs[7]}/> */}
            </div>
            <div>
                { (()=>{
                    let matieres = currentUiContext.formInputs[0].split(",");
                    let cours = currentUiContext.formInputs[1].split(",");
                    let id_cours = currentUiContext.formInputs[2].split("_");
                    let id_matieres = currentUiContext.formInputs[3].split("_");
                    let n= currentUiContext.formInputs[6];
                    let info_cours = currentUiContext.formInputs[7].split("²²");
                    let table = [];
                    console.log(id_cours)
                    table.push(<div key={"key01"}><input type="text" disabled defaultValue="Cours"/><input type="text" disabled defaultValue="Coef"/>
                    <input type="text" disabled defaultValue="Quota Hebdo"/><input type="text" disabled defaultValue="Quota Annuel"/></div>)
                    for (let i=0;i<n;i++){
                        // if(i==0) table.push(<div>);
                        let data;
                        // if (id_cours[i].length >0)id_matieres
                            data = info_cours[i].split(",");
                            table.push(<div key={matieres[i]}><input name={id_matieres[i]} role="libelle" id={id_matieres[i]} maxLength={10} type="text"  defaultValue={matieres[i]}
                            onBlur={handleChange}/> 
                            <input type="number" role="coef" name={id_matieres[i]+"_coef"} maxLength={10} onBlur={handleChange} defaultValue={data[0]}/>
                            <input type="number" role="qh" name={id_matieres[i]+"_qh"} maxLength={10} onBlur={handleChange} defaultValue={data[1]}/>
                            <input type="number" role="qa" name={id_matieres[i]+"_qa"} maxLength={10} onBlur={handleChange} defaultValue={data[2]}/>
                            </div>)
                        // if(i==n-1) table.push(</table>);

                    }
                    return table;
                })

                ()}
            </div>
            {/* <div className={classes.inputRowLeft}> 
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
                <input id="idCycle" type="hidden"  value={currentUiContext.formInputs[2]}/>
            </div> */}
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
 export default AddCours;
 