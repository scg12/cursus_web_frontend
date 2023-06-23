import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import Select from 'react-select'


const baseURL = 'http://127.0.0.1:8000/';

function AddClasse(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const selectedTheme = currentUiContext.theme;
    const[optCycle, setOptCycle] = useState([]);
    const[optNiveau, setOptNiveau] = useState([]);
    const[changeCycleSelected, setChangeCycleSelected] = useState('');
    const[changeNiveauSelected, setChangeNiveauSelected] = useState('');

    const customStyles = {

        control: base => ({
            ...base,
            height:27,
            minHeight: 27,
            width:'10vw',
            minwidth:'10vw',
            fontSize:'0.9vw',
            fontWeight:'500',     
          }),
          placeholder:base => ({
              ...base,
              marginTop:'-3.3vh',
              fontSize: '1vw'
          }),
          indicatorsContainer:(base,state) => ({
              ...base,
              height: state.isSelected ?'5vh': '5vh',
              marginTop: state.isSelected ? '-1.3vh' :'-1.3vh',
              alignSelf: state.isSelected ? 'center' : 'center',
          }),
          indicatorSeparator:(base,state) => ({
              ...base,
              height: state.isSelected ? '3.7vh': '3.7vh',
              marginTop: state.isSelected ? '-0.7vh' : '-0.7vh'
          }),        
          dropdownIndicator:(base,state) => ({
              ...base,
              marginTop: state.isSelected ? '-2.7vh' : '-2.7vh',
              fontSize: state.isSelected ? '1vw' : '1vw'
          }),        
          singleValue: (base,state) => ({
              ...base,
              marginTop: state.isSelected ? '-3.7vh' : '-3.7vh',
              fontSize:  state.isSelected ? '0.9vw' : '0.9vw',
              fontWeight: state.isSelected ? '670' : '670'
          })
        }


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
        // props.formMode=='modif'
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab),'id_cycle','libelle')); 
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle ==currentUiContext.formInputs[3] ),'id_niveau','libelle')); 
        if(props.formMode=='modif'){
            setChangeCycleSelected({value:currentUiContext.formInputs[3],label:currentUiContext.formInputs[4]})
            setChangeNiveauSelected({value:currentUiContext.formInputs[5],label:currentUiContext.formInputs[6]})
        }
        else{
            setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab),'id_cycle','libelle')[0]);
            setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == currentAppContext.currentEtab),'id_niveau','libelle')[0]);
        
        }
    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var niveau;
       
        niveau = (document.getElementById('libelle').value != undefined) ? document.getElementById('libelle').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;        
        if(niveau.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }
    function dropDownCycleChangeHandler(e){
        document.getElementById('idCycleSelected').value = e.value;
        // setOptCycle(null);
        // setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab),'id_cycle','libelle')); 
        setOptNiveau(null);
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_cycle == e.value),'id_cycle','libelle')[0]);
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),"id_niveau","libelle"));
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),'id_niveau','libelle')[0]);
        document.getElementById('idNiveauSelected').value = createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),'id_niveau','libelle')[0].value;
        
    }

      function dropDownNiveauChangeHandler(e){
        document.getElementById('idNiveauSelected').value = e.value;
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_niveau == e.value),'id_niveau','libelle')[0]);
        // setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_cycle == e.value),'id_cycle','libelle')[0]);
      }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Cycle :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    <Select
                        options={optCycle}
                        className={classes.selectStyle +' slctClasseStat'}
                        classNamePrefix="select"
                        value={changeCycleSelected}
                        styles={customStyles}
                        onChange={dropDownCycleChangeHandler} 
                    />
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Niveau :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    <Select
                        options={optNiveau}
                        className={classes.selectStyle +' slctClasseStat'}
                        classNamePrefix="select"
                        value={changeNiveauSelected}
                        styles={customStyles}
                        onChange={dropDownNiveauChangeHandler} 
                    />
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
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
                <input id="idClasse" type="hidden"  defaultValue={currentUiContext.formInputs[2]}/>
                <input id="idCycleSelected" type="hidden"  defaultValue={changeCycleSelected.value}/>
                <input id="idNiveauSelected" type="hidden"  defaultValue={changeNiveauSelected.value}/>

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
 export default AddClasse;
 