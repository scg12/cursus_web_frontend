import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";
import Select from 'react-select'

var formData=[];
var tabMatiere1,tabMatiere2,tabMatiere3;

var id_spe1 = '';
var id_spe2 = '';
var id_spe3 = '';
var matieres = '';

var libelle1 = '';
var libelle2 = '';
var libelle3 = '';

function AddEnseignantSpecialites(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [optMatiere1, setOptMatiere1] = useState();
    const [optMatiere2, setOptMatiere2] = useState();
    const [optMatiere3, setOptMatiere3] = useState();
    // const [optGroupe, setOptGroupe] = useState();
    // const [matieres, setMatieres] = useState([]);
    // const [idGroupe, setIdGroupe] = useState("");
    // const [idCours, setIdCours] = useState("");
    // const [cpteGroupe, setCpteGroupes] = useState(0);
    const [changeSpe1Selected, setChangeSpe1Selected] = useState();
    const [changeSpe2Selected, setChangeSpe2Selected] = useState();
    const [changeSpe3Selected, setChangeSpe3Selected] = useState();
    const selectedTheme = currentUiContext.theme;

    let num_groupe = 0;
    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
      }
    }

    
    let optGrpSpe=[{value:"0",label:"Non"},{value:"1",label:"Oui"}]
    let matiereVide={value:"-1",label:"----------"}

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
    function createOption(libellesOption,idsOption){
        var newTab=[];
        for(var i=0; i< libellesOption.length; i++){
            var obj={
                value: idsOption[i],
                label: libellesOption[i]
            }
            newTab.push(obj);
        }
        return newTab;
    }
    function createOption2(libellesOption){
        var newTab=[];
        newTab.push(matiereVide);
        for(var i=0; i< libellesOption.length; i++){
            var obj={
                value: libellesOption[i].id,
                label: libellesOption[i].libelle
            }
            newTab.push(obj);
        }
        return newTab;
    }
function getLibelleMatiereFromId(id,matieres){
    var libelle="";
    for(var i=0; i< matieres.length; i++){
        if(matieres[i].id==id){
            libelle = matieres[i].libelle
            break;
        }
    }
    return libelle;
}
    useEffect(()=> {
       
        tabMatiere1 = createOption2(currentUiContext.formInputs[6]);
        tabMatiere2 = createOption2(currentUiContext.formInputs[6]);
        tabMatiere3 = createOption2(currentUiContext.formInputs[6]);

        id_spe1 = currentUiContext.formInputs[3];
        id_spe2 = currentUiContext.formInputs[4];
        id_spe3 = currentUiContext.formInputs[5];
        matieres = currentUiContext.formInputs[6];
        console.log("**** ",currentUiContext.formInputs[6], id_spe1);

        if(id_spe1!=''){
            var index = tabMatiere1.findIndex((mat)=>mat.value == id_spe1)
            var matiere = tabMatiere1[index];
            tabMatiere1.splice(index,1);
            tabMatiere1.unshift(matiere);
        }

        if(id_spe2!=''){
            var index = tabMatiere2.findIndex((mat)=>mat.value == id_spe2)
            var matiere = tabMatiere2[index];
            tabMatiere2.splice(index,1);
            tabMatiere2.unshift(matiere);
        }

        if(id_spe3!=''){
            var index = tabMatiere3.findIndex((mat)=>mat.value == id_spe3)
            var matiere = tabMatiere3[index];
            tabMatiere3.splice(index,1);
            tabMatiere3.unshift(matiere);
        }


       
      
        setOptMatiere1(tabMatiere1);
        setOptMatiere2(tabMatiere2);
        setOptMatiere3(tabMatiere3);

        

        // libelle1 = getLibelleMatiereFromId(id_spe1,matieres);
        // libelle2 = getLibelleMatiereFromId(id_spe2,matieres);
        // libelle3 = getLibelleMatiereFromId(id_spe3,matieres);

        
    },[])

    /************************************ Handlers ************************************/

   

    function dropDownSpe1ChangeHandler(e){
        document.getElementById('id_spe1').value = e.target.value;
        formData[3]= e.target.value;
    }

    function dropDownSpe2ChangeHandler(e){
        document.getElementById('id_spe2').value = e.target.value;
        formData[4]= e.target.value;
    }

    function dropDownSpe3ChangeHandler(e){
        document.getElementById('id_spe3').value = e.target.value;
        formData[5]= e.target.value;
    }


    function actionHandler(e){
        var infos = { 
            id : document.getElementById('id_ens').value ,
            id_spe1:document.getElementById('id_spe1').value, 
            id_spe2:document.getElementById('id_spe2').value,
            id_spe3:document.getElementById('id_spe3').value,
        }
        console.log("donnees",infos)
        props.actionHandler(infos)
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div className={classes.inputRowCenter}> 
                <div className={classes.inputRowLabel}>
                <h5>{currentUiContext.formInputs[1]}  {currentUiContext.formInputs[2]} </h5>
                 <br />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    <h6>Matière1:</h6>
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    <select id='selectMatiere1'   onChange={dropDownSpe1ChangeHandler} className={classes.comboBoxStyle} style={{width:'20.3vw', marginBottom:1}}>
                        {(optMatiere1||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                   
                </div>
            </div> 
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    <h6>Matière2:</h6>
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    <select id='selectMatiere2'  onChange={dropDownSpe2ChangeHandler} className={classes.comboBoxStyle} style={{width:'20.3vw', marginBottom:1}}>
                        {(optMatiere2||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>                    
                </div>
            </div> 
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    <h6>Matière3:</h6>
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    <select id='selectMatiere3'  onChange={dropDownSpe3ChangeHandler} className={classes.comboBoxStyle} style={{width:'20.3vw', marginBottom:1}}>
                        {(optMatiere3||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>                    
                </div>
            </div> 
            
            <div>
                <input id="id_ens" type="hidden"   defaultValue={currentUiContext.formInputs[0]}/>
                <input id="id_spe1" type="hidden"  defaultValue={currentUiContext.formInputs[3]}/><br />
                <input id="id_spe2" type="hidden"  defaultValue={currentUiContext.formInputs[4]}/><br />
                <input id="id_spe3" type="hidden"  defaultValue={currentUiContext.formInputs[5]}/>
                <input id="id_user" type="hidden"  defaultValue={currentUiContext.formInputs[7]}/>

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
 export default AddEnseignantSpecialites;
 