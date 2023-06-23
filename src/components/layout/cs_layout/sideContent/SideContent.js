import React, {useState, useEffect} from 'react'

import Select from 'react-select'
import { Component, useContext } from "react";
import UiContext from '../../../../store/UiContext';
import AppContext from '../../../../store/AppContext';
import CustomCalendar from '../../../CustomCalendar/CustomCalendar'

import { useTranslation } from "react-i18next";
import '../../../../translation/i18n'

import 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css';
import classes from './SideContent.module.css';


function SideContent(props) {

    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const[optEtab, setOpEtab] = useState([]);
    const[optAnnee, setOpAnnee] = useState([]);
    const[optCycle, setOptCycle] = useState([]);
    const[optNiveau, setOptNiveau] = useState([]);
    const[idAnnee, setIdAnnee] = useState([]);
    const[idEtab, setIdEtab] = useState([]);
    const[changeCycleSelected, setChangeCycleSelected] = useState('');
    const[changeEtabSelected, setChangeEtabSelected] = useState('');
    const[changeAnneeSelected, setChangeAnneeSelected] = useState('');
    const[changeNiveauSelected, setChangeNiveauSelected] = useState('');

    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };

    function getCurrentTheme()
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_sideContent;
            case 'Theme2': return classes.Theme2_sideContent;
            case 'Theme3': return classes.Theme3_sideContent;
            default: return classes.Theme1_sideContent;
        }
    }


    function getCurrentThemeSideLabel()
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_sideContentLabel;
            case 'Theme2': return classes.Theme2_sideContentLabel;
            case 'Theme3': return classes.Theme3_sideContentLabel;
            default: return classes.Theme1_sideContentLabel;
        }
    }
    let id_etab_init = 0;
    let id_annee_init = 0;
    

    useEffect(()=> {
        id_etab_init = currentAppContext.idEtabInit;
        id_annee_init = currentAppContext.activatedYear.id_annee;
        setOpAnnee(createOption(currentAppContext.infoAnnees,"id_annee","libelle"));
        // console.log("id_annee_init: ",id_annee_init)
        // console.log("POPO: ",currentAppContext.infoAnnees.filter((ann)=>ann.id_annee==id_annee_init));
        setChangeAnneeSelected(createOption(currentAppContext.infoAnnees.filter((ann)=>ann.id_annee==id_annee_init),"id_annee","libelle"));
        console.log("id_etab_init: ",id_etab_init)
        setIdAnnee(id_annee_init);
        setIdEtab(id_etab_init);
        currentAppContext.setCurrentYear(id_annee_init);
        currentAppContext.setCurrentEtab(id_etab_init);
        setOpEtab(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == id_annee_init),'id_setab','libelle')); 
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab_init),'id_cycle','libelle')); 
        // console.log("BOBO: ",currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab_init))
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == id_etab_init),"id_niveau","libelle"));
        setChangeEtabSelected(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == id_annee_init),'id_cycle','libelle')[0]);
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab_init),'id_cycle','libelle')[0]);
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == id_etab_init),'id_cycle','libelle')[0]);
        // console.log("currentYear: ",currentAppContext.currentYear," currentEtab: ", currentAppContext.currentEtab);
    },[])
  
 
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

    function onChangeAnneeHandler(e){
        setIdAnnee(idAnnee);
        setOpAnnee(null);
        setOpEtab(null);

        currentAppContext.setCurrentYear(idAnnee);

        setOptCycle(null);
        setOptNiveau(null);

        setOpAnnee(createOption(currentAppContext.infoAnnees,'id_annee','libelle')); 
        setChangeAnneeSelected(createOption(currentAppContext.infoAnnees.filter((ann)=>ann.id_annee == e.value),'id_annee','libelle'));

        let etabs = currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == e.value);
        let id_etab = null;
        if (etabs.length >0)
            // setIdEtab(createOption(etabs,'id_cycle','libelle')[0].value);
            // id_etab = createOption(etabs,'id_cycle','libelle')[0].value;
            id_etab = etabs[0].id_setab;
        // console.log("id_etab: ",id_etab)
        currentAppContext.setCurrentEtab(id_etab);
        // console.log("currentYear: ",currentAppContext.currentYear," currentEtab: ", currentAppContext.currentEtab);
        
        setOpEtab(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == e.value),'id_setab','libelle')); 
        setChangeEtabSelected(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == e.value),'id_cycle','libelle')[0]); 
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab),'id_cycle','libelle')); 
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == id_etab),"id_niveau","libelle"));
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab),'id_cycle','libelle')[0]);
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == id_etab),'id_cycle','libelle')[0]);

    }
    function onChangeSectionHandler(e){
        setIdEtab(e.value);
        currentAppContext.setCurrentEtab(e.value);
        setOpEtab(null);
        setOptCycle(null);
        setOptNiveau(null);
        setOpEtab(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == idAnnee),'id_setab','libelle')); 
        setChangeEtabSelected(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_setab == e.value),'id_cycle','libelle')); 
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == e.value),'id_cycle','libelle')); 
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == e.value),"id_niveau","libelle"));
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == e.value),'id_cycle','libelle')[0]);
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == e.value),'id_cycle','libelle')[0]);

    }
    function onChangeCycleHandler(e){
        setOptCycle(null);
        setOptNiveau(null);
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == idEtab),'id_cycle','libelle')); 
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),"id_niveau","libelle"));
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_cycle == e.value),'id_cycle','libelle')[0]);
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),'id_cycle','libelle')[0]);
    }

    function onChangeNiveauHandler(e){
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),'id_cycle','libelle')[0]);
    }
          
    return (

        <div /*style={{backgroundImage:"images/sideImg.jpeg"}}*/> 
            <CustomCalendar/>
            <div className= {classes.mainInfosStyle}>

                <div> 
                    <label className= {getCurrentThemeSideLabel() +' '+ classes.upperCase}> 
                        {t("annee_scolaire")}
                    </label> 
                </div>

                <div id='annee' > 
                    <select className={classes.comboBoxStyle} style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}>
                        {(optAnnee||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>
                
                <div> 
                    <label className= {getCurrentThemeSideLabel() +' '+ classes.upperCase}> 
                        {t("etablissement")}
                    </label> 
                </div>
                <div id='section'>
                    <select className={classes.comboBoxStyle} style={{color:getSelectDropDownTextColr(), width:'14.3vw',borderColor:getSelectDropDownTextColr()}}>
                        {(optEtab||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>

                <div> 
                    <label className= {getCurrentThemeSideLabel() +' '+ classes.upperCase}> 
                        {t("trimestre")} 
                    </label> 
                </div>
                <div id='trimestre'>
                    <select className={classes.comboBoxStyle} style={{color:getSelectDropDownTextColr(), width:'14.3vw',borderColor:getSelectDropDownTextColr()}}>
                        {(optCycle||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>

               {/* <div> 
                    <label className= {getCurrentThemeSideLabel() +' '+ classes.upperCase}> 
                        {t("sequence")} 
                    </label> 
                </div>
                
                <div id='sequence'>
                    <select className={classes.comboBoxStyle} style={{color:getSelectDropDownTextColr(), width:'14.3vw',borderColor:getSelectDropDownTextColr()}}>
                        {(optNiveau||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                    </div>*/
                }
           
            </div>
        </div>
    );
}


export default SideContent;