import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";
import Select from 'react-select'


function AddGroupe(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [optGroupe, setOptGroupe] = useState();
    const [matieres, setMatieres] = useState([]);
    const [idGroupe, setIdGroupe] = useState("");
    const [idCours, setIdCours] = useState("");
    const [cpteGroupe, setCpteGroupes] = useState(0);
    const [changeGroupeSelected, setChangeGroupeSelected] = useState();
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

    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
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
    useEffect(()=> {
        if(props.formMode=='modif'){
            let liste_groupes = currentUiContext.formInputs[1].split(",");
            let ids_groupes = currentUiContext.formInputs[3].split("_");

        // console.log("ids_groupes: ",ids_groupes)
        setOptGroupe(createOption(liste_groupes,ids_groupes));
        if(liste_groupes.length>0){
            setChangeGroupeSelected({value:ids_groupes[0],label:liste_groupes[0]});
            setIdGroupe(ids_groupes[0]);
            let item = currentUiContext.formInputs[8].split("²²")[0]
            setIdCours("_"+item+"_")
        }
            let c_in_groupe = currentUiContext.formInputs[7];
        setMatieres(c_in_groupe.split("²²")[num_groupe].split(","));


        }
        else{
            setIsValid(props.formMode=='creation')
            setIdCours("_")
        }
    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        let checked = e.target.checked;
        let item = e.target.id;

        let cours = document.getElementById('idCours').value;
        if(item.includes("*"))
            item = item.replace("*","")

        if(checked)
            cours+=item+"_";
        else
            cours = cours.replace("_"+item+"_","_")
        setIdCours(cours);
        

    }
    function dropDownGrSpeChangeHandler(e){
       document.getElementById('grp_spe').value = e.value
    }
    function dropDownGroupeChangeHandler(e){
        
        let idg = e.value;
        let ids_groupes = currentUiContext.formInputs[3].split("_");
        num_groupe = 0;
        let continu = true;
        while (continu == true){
            if (idg==ids_groupes[num_groupe])
                continu = false;
            num_groupe++;
        }
        if(num_groupe>0) num_groupe--;
        setCpteGroupes(num_groupe);
        setChangeGroupeSelected(e);
        setIdGroupe(idg);
        let item = currentUiContext.formInputs[8].split("²²")[num_groupe]
        setIdCours("_"+item+"_")
        let c_in_groupe = currentUiContext.formInputs[7];
        let ids_c_in_groupe = currentUiContext.formInputs[8];
        // console.log("update: ",c_in_groupe.split("²²")[num_groupe],ids_c_in_groupe.split("²²")[num_groupe])
        setMatieres(c_in_groupe.split("²²")[num_groupe].split(","));

        let cbx = document.getElementsByTagName("input")
        for(let i =0;i<cbx.length;i++){
            let el = cbx[i].id
            if(cbx[i].type == "checkbox" && el.includes("*") )
                {
                    cbx[i].checked = false
                }
            else 
            cbx[i].checked = true

        }
      }

    /************************************ JSX Code ************************************/

    return (
        props.formMode==="modif"?<div className={classes.formStyle}>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                {currentUiContext.formInputs[0]}  
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
              <div className={classes.inputRowLabel}>
                    
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    <Select
                        options={optGroupe}
                        className={classes.selectStyle +' slctClasseStat'}
                        classNamePrefix="select"
                        value={changeGroupeSelected}
                        // styles={customStyles}
                        onChange={dropDownGroupeChangeHandler} 
                    />
                </div>
            </div> 
            <div className={classes.inputRowLeft}> 
              <div className={classes.inputRowLabel}>
                    Groupe de Specialité ?  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    <Select
                        options={optGrpSpe}
                        className={classes.selectStyle +' slctClasseStat'}
                        classNamePrefix="select"
                        defaultValue={optGrpSpe[0]}
                        // styles={customStyles}
                        onChange={dropDownGrSpeChangeHandler} 
                    />
                </div>
            </div>
                <div> 
                 
                </div>
            
            <div>
                <input id="idGroupe" type="hidden"  defaultValue={idGroupe}/>
                <input id="idCours" type="hidden"  defaultValue={idCours}/>
                <input id="idClasse" type="hidden"  defaultValue={currentUiContext.formInputs[9]}/>
                <input id="grp_spe" type="hidden"  defaultValue="0"/>
                <input id="newGroup" type="hidden" defaultValue="" />

            </div>
{ (()=>{    

                    // let lib_classe = currentUiContext.formInputs[0];
                    // let id_classe = currentUiContext.formInputs[9];
                    // let liste_groupes = currentUiContext.formInputs[1];
                    // let ids_groupes = currentUiContext.formInputs[3];
                    // let nbg = currentUiContext.formInputs[2];
                    // let nb_cours_ng = currentUiContext.formInputs[6];
                    // let c_in_groupe = currentUiContext.formInputs[7].split("²²");
                    let liste_cours = currentUiContext.formInputs[4].split(",");
                    let ids_cours = currentUiContext.formInputs[5].split("_");
                    let ids_c_in_groupe = currentUiContext.formInputs[8].split("²²");
                    // console.log(liste_groupes,ids_groupes)
                    let table = [];
                    
                    let nb = matieres.length;
                    console.log(ids_cours[0],ids_cours[0]=='')
                    // console.log("nb: ",nb)
                    let nc = ids_cours.length;
                    for(let i=0;i<nb;i++){
                    table.push(<div key={matieres[i]} ><input id={ids_c_in_groupe[cpteGroupe].split("_")[i]} type="checkbox" defaultChecked="true"
                    onClick={handleChange}
                    />{matieres[i]}</div>);
                    }
                    if (nc>=1 && ids_cours[0] !='')
                        for(let i=0;i<nc;i++){
                        table.push(<div key={i+nb}><input id={ids_cours[i]+"*"} type="checkbox"
                        onClick={handleChange}
                        />{liste_cours[i]}</div>);
                        }

                    return table;

                })

                ()}

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

                <CustomButton
                    btnText='Supprimer?'
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? props.actionHandler : null}
                    // btnClickHandler={(isValid) ? props.actionHandler : null}
                    disable={!isValid}
                />
                
            </div>
            
        </div>:
        <div className={classes.formStyle}>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                {currentUiContext.formInputs[0]}  
                </div>
            </div>
            
            <input id="idClasse" type="hidden"  defaultValue={currentUiContext.formInputs[9]}/>
            <input id="grp_spe" type="hidden"  defaultValue="0"/>
            <input id="idCours" type="hidden"  defaultValue={idCours}/>
            <input id="idGroupe" type="hidden"  defaultValue="0"/>


            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Nouveau Groupe :  
                </div> 
                <div> 
                    <input id="newGroup" type="text" className={classes.inputRowControl + ' formInput'}  defaultValue="" />
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
              <div className={classes.inputRowLabel}>
                    Groupe de Specialité ?  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    <Select
                        options={optGrpSpe}
                        className={classes.selectStyle +' slctClasseStat'}
                        classNamePrefix="select"
                        defaultValue={optGrpSpe[0]}
                        // styles={customStyles}
                        onChange={dropDownGrSpeChangeHandler} 
                    />
                </div>
            </div>

            { (()=>{

                
                let liste_cours = currentUiContext.formInputs[4].split(",");
                let ids_cours = currentUiContext.formInputs[5].split("_");
                // console.log(liste_groupes,ids_groupes)
                let table = [];

                // let nb = matieres.length;
                // console.log("nb: ",nb)
                let nc = ids_cours.length;
                // for(let i=0;i<nb;i++){
                // table.push(<div key={matieres[i]} ><input id={ids_c_in_groupe[cpteGroupe].split("_")[i]} type="checkbox" defaultChecked="true"
                // onClick={handleChange}
                // />{matieres[i]}</div>);
                // }
                if (nc>=1 && ids_cours[0] !='')
                for(let i=0;i<nc;i++){
                    table.push(<div key={liste_cours[i]}><input id={ids_cours[i]+"*"} type="checkbox"
                    onClick={handleChange}
                    />{liste_cours[i]}</div>);
                }

                return table;

                })

                ()}

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
 export default AddGroupe;
 