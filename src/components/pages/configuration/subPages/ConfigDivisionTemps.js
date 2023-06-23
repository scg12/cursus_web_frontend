import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState } from "react";
import Select from 'react-select';
//import "@progress/kendo-theme-material/dist/all.css";
import {Grid, GridColumn} from "@progress/kendo-react-grid";
import {process} from "@progress/kendo-data-query";
import AddDivisionTemps from "../modals/AddDivisionTemps";


var cycleLib, cycleDesc;
function ConfigDivisionTemps(props) {
    
    const currentUiContext = useContext(UiContext);
    const [modalOpen, setModalOpen] = useState(false);
    const selectedTheme = currentUiContext.theme;

    const optCycle=[
        {value:0, label:'Section Anglophone'},
        {value:1, label:'Section Francophone'}
    ]

    var sectAng = [
        { libelle:  '1er Cycle Anglophone',       description: '1er Cycle section Anglophone', id: 1},
        { libelle:  '2nd Cycle Anglophone',       description: '2nd Cycle section Anglophone', id: 2},
    ];    
    
    
    var sectFran = [
        { libelle:  '1er Cycle Francophone',       description: '1er Cycle section Francophone', id: 1},
        { libelle:  '2nd Cycle Francophone',       description: '2nd Cycle section Francophone', id: 2},
    ];    

    var tabCycles =[
        sectAng,
        sectFran
    ];

    var cycles = tabCycles[0]

    const [dataState, setDataState] = useState(tabCycles[optCycle[0].value]);
    const [result, setResult] = useState(tabCycles[optCycle[0].value]);
    
   

   
    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
            case 'Theme1': return classes.Theme1_Btnstyle ;
            case 'Theme2': return classes.Theme2_Btnstyle ;
            case 'Theme3': return classes.Theme3_Btnstyle ;
            default: return classes.Theme1_Btnstyle ;
        }
    }
   

    const customStyles = {

        option: base => ({
            ...base,
            /*color: getSelectDropDownTextColr()*/
          }),

        control: base => ({
          ...base,
          height:27,
          minHeight: 27,
          width:'14vw',
          minwidth:'14vw',
          fontSize:'0.9vw',
          fontWeight:'500',
        }),

        singleValue: base => ({
            ...base,
            /*color: getSelectDropDownTextColr()*/
        })
    };

     
    const ActionCell = (props) =>{

        function modifyRow(){
            alert(props.dataItem['libelle']);
            setModalOpen(true).then(
                document.getElementById('cycleLib').value = props.dataItem['libelle'],
                document.getElementById('cycleDesc').value = props.dataItem['description']
            );

            /*const libCycle = document.querySelector('#cycleLib');
            const descCycle = document.querySelector('#cycleDesc');*/

            

            
           
            
           
        }
    
        function deleteRow() {
            //alert(props.dataItem[props.field]);
        }

        return (
            <div className={classes.tableCell}>
                <td> <img src="icons/baseline_edit.png"  width={20} height={20} className={classes.cellPointer} onClick={modifyRow}/> </td>
                <td> <img src="icons/baseline_delete.png"  width={20} height={20} className={classes.cellPointer} onClick={deleteRow}/> </td>
            </div>
        );
    }

    /*function dataChangeHandler(event) {
        setDataState(event.dataState)
        setResult(process(cycles,event.dataState))

    }*/
    function dataChangeHandler(event) {
        setDataState(event.dataState)
        //setResult(process(cycles,event.dataState))

    }

    function dropDownHandler(e) {
        var index = e.value;
        cycles = tabCycles[index]
        setDataState(cycles)
        //setResult(process(cycles,cycles))
    }

    function addNewCycle() {
        // Recuperation et test des donnees,
        if(formDataCheck()) {
             // Ajout des donnees cote serveur (axios),

            // Apres cela, mise a jour du tableau cycles,
            var index = cycles.length
            cycles.push({libelle:cycleLib, description:cycleDesc, id:index});

            //Mise a jour du useState avec ce tableau,
            setDataState(cycles)

            //Desactivation du Backdrop.
            setModalOpen(false);

        }

       

    }

    function formDataCheck() {
        var formDataOk = true;
        cycleLib = document.getElementById('cycleLib').value;
        cycleDesc = document.getElementById('cycleDesc').value;

        

        if (cycleLib.length == 0) {
            alert("Veuillez entrer le libellé de la section !");
            formDataOk= false;
        }

        return formDataOk;
    }
    

    function quitForm() {
        setModalOpen(false)
    }

    function selectionChangeHandler(e) {
        alert('lalalala');
    }
   
    
    return (

        <div className={classes.formStyle}>
            {/*<AddCycle addCycleHandler={addNewCycle} cancelHandler={quitForm}/>*/}
            {modalOpen && <AddDivisionTemps addCycleHandler={addNewCycle} cancelHandler={quitForm}/>}
            
            <div className={classes.gridTitleRow}> 
                <div className={classes.gridTitle}>
                    DIVISIONS DE TEMPS 
                </div>

                <div>
                    <Select options={optCycle}
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={optCycle[0]}
                        styles={customStyles}
                        onChange={dropDownHandler} 
                    />
                </div>
                
                <div className={classes.gridAction}> 
                    <CustomButton
                        btnText='Nvlle Division' 
                        buttonStyle={getButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={()=>setModalOpen(true)}
                        disable={(modalOpen==true)}   
                    />
                </div>
                
            </div>

            
            <div className={classes.gridDisplay}>
                <Grid 
                    data ={dataState}
                    onDataStateChange = {dataChangeHandler}
                    onSelectionChange = {selectionChangeHandler}
                    selectable = {true}
                    
                   /* {...dataState}*/

                >
                    <GridColumn className={classes.GridColumn} field="libelle" title="LIBELLE CYCLE"></GridColumn>
                    <GridColumn  field="description" title="DESCRIPTION"></GridColumn>
                    <GridColumn  field="id" title="ACTION" cell={ActionCell}></GridColumn>
                </Grid>
                
            </div>

        </div>
       
    );
 }
 
 export default ConfigDivisionTemps;