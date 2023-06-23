import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState } from "react";
//import "@progress/kendo-theme-material/dist/all.css";
import {Grid, GridColumn} from "@progress/kendo-react-grid";
import AddSection from "../modals/AddSection";


var sectionLib,sectionDesc;
function ConfigSection(props) {
    
    const currentUiContext = useContext(UiContext);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;
    
    const sections = [
        { libelle:  'Snow',       description: 'description', id: 0},
        { libelle:  'Lannister',  description: 'Cersei',      id: 1},
    ];   
    
    const [dataState, setDataState] = useState(sections);

    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
      }
    }

    function addNewSection() {
       
        // Recuperation et test des donnees,
        if (formDataCheck()) {    

            // Ajout des donnees cote serveur (axios),

            // Apres cela, mise a jour du tableau sections,
            var index = sections.length
            sections.push({libelle:sectionLib, description:sectionDesc, id:index});
           
            //Mise a jour du useState avec section,
            setDataState(sections)

            //Desactivation du Backdrop.
            setModalOpen(0);

        }

    }

    function modifySection() {
       
        // Recuperation et test des donnees,
        if (formDataCheck()) {    

            // Ajout des donnees cote serveur (axios),

            // Apres cela, mise a jour du tableau sections,
           // var index = sections.length
           // sections.push({libelle:sectionLib, description:sectionDesc, id:index});
           
            //Mise a jour du useState avec section,
            //setDataState(sections)

            //Desactivation du Backdrop.
            //setModalOpen(0);

        }

    }

    function formDataCheck() {
        var formDataOk = true;
        var sectionLibModif, sectionDescModif;

        sectionLib = document.getElementById('sectionLib').value;
        sectionDesc = document.getElementById('sectionDesc').value;

        sectionLibModif = document.getElementById('sectionLib').placeholder;
        sectionDescModif = document.getElementById('sectionDesc').placeholder;

        if(modalOpen==2) {
            if (sectionLibModif.length > 0) sectionLib = sectionLibModif;
            if (sectionDescModif.length > 0) sectionDesc = sectionDescModif
        }

        if (sectionLib.length == 0) {
            alert("Veuillez entrer le libellé de la section !");
            formDataOk= false;
        }

        return formDataOk;
    }
    
    function quitForm() {
        setModalOpen(0)
    }

    
    const ActionCell = (props) =>{
        
        function modifyRow(){
            var inputs=[]
            alert(props.dataItem[props.field]);
            inputs[0]= props.dataItem['libelle'];
            inputs[1]= props.dataItem['description']
            currentUiContext.setFormInputs(inputs)
            //document.getElementById('sectionLib').value =  document.getElementById('HsectionLib').value
            //document.getElementById('sectionDesc').value = document.getElementById('HsectionDesc').value
            setModalOpen(2);

        }
    
        function deleteRow() {
            //Message de confirmation
            alert('Voulez-vous vraiment supprimer la section selectionnée?')
            //Suppression cote serveur axios et retour des donnees supprimee
            
            //Mise a jour du tableau des sections
            var id = props.dataItem[props.field]
            sections.pop({libelle:sections[id].libelle, description:sections[id].description, id:id})
            
            //Mise a jour du useState
            setDataState(sections)
        }    

        return (
            <div className={classes.tableCell}>
                <td> <img src="icons/baseline_edit.png"  width={20} height={20} className={classes.cellPointer} onClick={modifyRow}/> </td>
                <td> <img src="icons/baseline_delete.png"  width={20} height={20} className={classes.cellPointer} onClick={deleteRow}/> </td>

            </div>            
        )

    }
    
    return (
        <div className={classes.formStyle}>
            { (modalOpen!=0) && <AddSection formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewSection : modifySection} cancelHandler={quitForm} />}
            
            <div className={classes.gridTitleRow}> 
                <div className={classes.gridTitle}>
                    LISTE DES SECTIONS 
                </div>
                              
                <div className={classes.gridAction}> 
                    <CustomButton
                        btnText='Nvlle Section' 
                        buttonStyle={getButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                        disable={(modalOpen==1||modalOpen==2)}   
                    />
                </div>
                
            </div>

            <div className={classes.gridDisplay}>
                <Grid data ={dataState}>
                    <GridColumn className={classes.GridColumn} field="libelle" title="LIBELLE SECTION"></GridColumn>
                    <GridColumn  field="description" title="DESCRIPTION"></GridColumn>
                    <GridColumn  field="id" title="ACTION" cell={ActionCell}></GridColumn>
                </Grid>

            </div>
            
        </div>
       
       
    );
 }
 
 export default ConfigSection;