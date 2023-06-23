import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddClasseExamen from "../modals/AddClasseExamen";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var classses = [], chaine = "_", nb_click=0;  

function ConfigClasseExamen(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listClassesExamens()
    },[]);


    const ODD_OPACITY = 0.2;
    
    const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
      [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
        '&.Mui-selected': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
          '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY +
                theme.palette.action.selectedOpacity +
                theme.palette.action.hoverOpacity,
            ),
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
              ),
            },
          },
        },
      },
    }));

    
    
/*************************** DataGrid Declaration ***************************/    
    const columns = [
        {
            field: 'libelle',
            headerName: 'Classe',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        // {
        //     field: 'is_classe_examen',
        //     headerName: 'Classe Examen?',
        //     width: 180,
        //     editable: false,
        //     hide:true,
        //     headerClassName:classes.GridColumnStyle
        // },
        {
            field: 'is_classe_examen',
            headerName: 'Classe Examen?',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params) => (
                <input type="checkbox"
                checked={(params.value===true)?true:false}
                onClick={(event)=> {
                        event.ignore = true;
                        handleClickCheckbox(params)
                    }
                    }
              />
            ),
        },
      ];
/*************************** Theme Functions ***************************/

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
    
/*************************** Handler functions ***************************/
    function ClearForm(){        
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        errorDiv.className = null;
        errorDiv.textContent ='';

        document.getElementById('libelle').value = ''
        // document.getElementById('code').value = ''

        document.getElementById('libelle').defaultValue = ''
        // document.getElementById('code').defaultValue = ''      
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var classses = { 
            id:0, 
            libelle:'',
            code:'' 
        }

        classses.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        // classses.code = (document.getElementById('code').value !='') ? putToEmptyStringIfUndefined(document.getElementById('code').value).trim() : putToEmptyStringIfUndefined(document.getElementById('code').defaultValue).trim();       
        // classses.id = document.getElementById('idCycle').value;
        return classses;
    }

    function formDataCheck(clss) {
        var errorMsg='';
        // if(clss.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du classse !";
        //     return errorMsg;
        // }       
        return errorMsg;
    }
    
    function handleDeleteRow(params){
        if(params.field=='id'){
            deleteRow(params.id)            
        }
    }
    function handleClickCheckbox(params){
        // if(e.hasFocus == true)
        var checked;
        // var index = classses.findIndex((ligne)=>ligne.id === params.id)
        console.log("PLP: ",chaine.includes(params.id+"_"))
            if(params.is_classe_examen == true){
                params.is_classe_examen = false;

                checked = false;
                chaine = chaine.replace("_"+params.id+"_","_")
                console.log("ici _"+params.id+"_")
            }
            else{
                if(nb_click%2 == 1)
                {
                    params.is_classe_examen = true
                    checked = true;
                    if (chaine.includes("_"+params.id+"_")==false)
                        chaine += params.id+"_"
                    console.log("la "+params.id+"_")
                }
            }
            nb_click++;
        console.log(chaine)
    }
    

    function handleEditRow(row){       
        var inputs=[];
        // inputs[0]= row.libelle;
        // inputs[1]= row.code;
        // inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listClassesExamens(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        classses=[];
        axiosInstance
        .post(`list-classes-examens/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((classse)=>{classses.push(classse)});
            chaine = "_";
            classses.forEach(element => {
                if (element.is_classe_examen==true)
                    chaine +=element.id+"_"
            });
            // classses = res.data.filter((c)=>c.is_classe_examen==true);
            console.log(chaine);
            setGridRows(classses);
        })  
    }


    function addNewCycle(e) {       
        e.preventDefault();
        var clss = getFormData();

        if (formDataCheck(clss).length==0) {                        
            axiosInstance.post(`list-classes-examens/`, {
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                classses = []
                res.data.classses.map((classse)=>{classses.push(classse)});
                setGridRows(classses);
                ClearForm();
                setModalOpen(1);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(clss);
        }
        
    }
    
    function modifyClasseExamen(e) {
        e.preventDefault();
            console.log("CHAINE Mo: ",chaine)
            axiosInstance.post(`set-classe-examen/`, {
                id_classes:chaine,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                classses = []
                chaine = "_";
                res.data.classes.map((classse)=>{classses.push(classse)});
                classses.forEach(element => {
                    if (element.is_classe_examen==true)
                    chaine +=element.id+"_"
                });
                setGridRows(classses);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-classse/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                classses = []
                res.data.classses.map((classse)=>{classses.push(classse)});
                setGridRows(classses);
            })              
        }
    } 
    function quitForm() {
        ClearForm();
        setModalOpen(0)
    }
   

    /********************************** JSX Code **********************************/   
    return (
        <div className={classes.formStyle}>
            {(modalOpen!=0) && <AddClasseExamen formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewCycle : modifyClasseExamen} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES CLASSES D'EXAMEN
                    </div>
                                
                    <div className={classes.gridAction}> 
                        <CustomButton
                            btnText='Mettre à Jour'
                            buttonStyle={getButtonStyle()}
                            btnTextStyle = {classes.btnTextStyle}
                            // btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            btnClickHandler={modifyClasseExamen}
                            disable={(modalOpen==1||modalOpen==2)}
                        />
                    </div>
                    
                </div>
                : null
            }

            {(modalOpen==0) ?
                <div style={{ height: 300, width: 530 }}>
                    <StripedDataGrid
                        rows={gridRows}
                        columns={columns}
                        // checkboxSelection
                        GRID_CHECKBOX_SELECTION_COL_DEF
                        getCellClassName={(params) => (params.field==='libelle')? classes.gridMainRowStyle : classes.gridRowStyle }
                        onCellClick={handleDeleteRow}
                        onRowClick={(params,event)=>{
                            if(event.ignore) {
                                // handleEditRow(params.row)
                                handleClickCheckbox(params.row)
                            }
                        }}                
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even ' + classes.gridRowStyle : 'odd '+ classes.gridRowStyle
                        }
                    />
                </div>
                :
                null
            }
            {(modalOpen==1) ?
                <div style={{ height: 300, width: 530 }}>
                    <StripedDataGrid
                        rows={gridRows}
                        columns={columns}
                        getCellClassName={(params) => (params.field==='libelle')? classes.gridMainRowStyle : classes.gridRowStyle }
                        onCellClick={handleDeleteRow}
                        onRowClick={(params,event)=>{
                            if(event.ignore) {
                                handleEditRow(params.row)
                            }
                        }}                
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even ' + classes.gridRowStyle : 'odd '+ classes.gridRowStyle
                        }
                    />
                </div>
                :
                null
            }
         
        </div>
        
    );
} 
export default ConfigClasseExamen;