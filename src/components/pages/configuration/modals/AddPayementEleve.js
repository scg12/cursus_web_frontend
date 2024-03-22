import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";


function AddPayementEleve(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const[optCycle, setOptCycle] = useState([]);
    const[optNiveau, setOptNiveau] = useState([]);
    const[optClasse, setOptClasse] = useState([]);
    const selectedTheme = currentUiContext.theme;

    let cycleSelected = "all";
    let niveauSelected = "all";

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
        newTab.push({value:"all",label:"__All__"})
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
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab),'id_cycle','libelle')); 
    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var payement;
       
        payement = (document.getElementById('libelle').value != undefined) ? document.getElementById('libelle').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;        
        if(payement.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }
    function dropDownCycleChangeHandler(e){
        // document.getElementById('idCycleSelected').value = e.target.value;
        // cycleSelected = e.target.value;
        if ( e.target.value == "all"){
            setOptNiveau([]);
            setOptClasse([]);
        }
        else{
            setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((niv)=>niv.id_cycle == e.target.value),'id_niveau','libelle')); 
        // document.getElementById("idNiveauSelected").value = document.getElementById("niveau").value
            // var s_value = createOption(currentAppContext.infoNiveaux.filter((niv)=>niv.id_cycle == document.getElementById("id_niveau").value),'id_niveau','libelle')
            setOptClasse([{value:"all",label:"__All__"}]); 
            // setOptClasse(s_value); 

        }
      }
      function dropDownNiveauChangeHandler(e){
        // document.getElementById('idNiveauSelected').value = e.target.value;
        // niveauSelected = e.target.value;
        if ( e.target.value == "all")
            setOptClasse([])
        else{
            setOptClasse(createOption(currentAppContext.infoClasses.filter((classe)=>classe.id_niveau == e.target.value),'id_classe','libelle')); 
            // document.getElementById("idClasseSelected").value = createOption(currentAppContext.infoClasses.filter((classe)=>classe.id_niveau == e.target.value),'id_classe','libelle')[0].value;
        }
      }
      function dropDownClasseChangeHandler(e){
        // console.log(e)
        // document.getElementById("idClasseSelected").value = e.target.value
      }

    /************************************ JSX Code ************************************/

    return (
        props.formMode=='modif'?
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/> 

            { (()=>{
                    let infos = currentUiContext.formInputs[1].split("²²");
                    let n = infos.length
                    let ligne = [];
                    for(let i=0;i<n;i++){
                        let items = infos[i].split(",")
                        ligne.push(<div key={"key_lib"+items[0]}><label>Libelle:</label>&nbsp;<input libelle="lib" id={"libelle_"+items[0]} type="text" defaultValue={items[1]}/>
                        <input type="checkbox" checkbox="check" id={"checkbox_"+items[0]}/> Supprimer</div>);
                        ligne.push(<div key={"key_montant"+items[0]}><label>montant:</label>&nbsp;<input montant="montant" type="text" id={"montant_"+items[0]} defaultValue={items[2]}/></div>);
                        ligne.push(<div key={"key_deb"+items[0]}><label>Date Debut:</label>&nbsp;<input deb="deb" type="text" id={"deb_"+items[0]} defaultValue={items[4]}/></div>);
                        ligne.push(<div key={"key_fin"+items[0]}><label>Date Fin:</label>&nbsp;<input fin="fin" type="text" id={"fin_"+items[0]} defaultValue={items[5]}/></div>);
                    }


                    return ligne;
                })
                ()}

            <div>
                <input id="idClasse" type="hidden"  defaultValue={currentUiContext.formInputs[2]}/>
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
        :
        <div className={classes.formStyle}>
        <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Cycle :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    {<select className={classes.comboBoxStyle} id="id_cycle" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    onChange={dropDownCycleChangeHandler}
                    >  
                        {/* <option style={{color:'black'}} value="all" selected >__All__</option> */}
                        {                        
                        (optCycle||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>}
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Niveau :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 

                    {<select className={classes.comboBoxStyle} id="id_niveau" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    onChange={dropDownNiveauChangeHandler}
                    >  
                        {                        
                        (optNiveau||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                        
                    </select>}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Classe :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 

                    {<select className={classes.comboBoxStyle} id="id_classe" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    onChange={dropDownClasseChangeHandler}
                    >  
                        {                        
                        (optClasse||[]).map((option)=> {
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
                    <input id="libelle" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Montant :  
                </div>
                    
                <div> 
                    <input id="montant" type="number" min="0" defaultValue="0" className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date début payement :  
                </div>
                    
                <div> 
                    <input id="date_deb" type="text" className={classes.inputRowControl + ' formInput'} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date fin payement :  
                </div>
                    
                <div> 
                    <input id="date_fin" type="text" className={classes.inputRowControl + ' formInput'} />
                </div>
            </div>

            {/* <input id="idCycleSelected" type="text"  defaultValue="all"/>
            <input id="idNiveauSelected" type="text"  defaultValue="all"/>
            <input id="idClasseSelected" type="text"  defaultValue="all"/> */}

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
 export default AddPayementEleve;
 