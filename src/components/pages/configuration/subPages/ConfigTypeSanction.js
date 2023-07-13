import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddTypeSanction from "../modals/AddTypeSanction";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var sanctions = [];  

function ConfigTypeSanction(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listSanctions()
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
            headerName: 'Libelle',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'duree_sanction_unit',
            headerName: 'Type Duree',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'eleve_a_supprimer',
            headerName: 'eleve_a_supprimer',
            width: 100,
            hide: true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'duree',
            headerName: 'Duree',
            width: 80,
            editable: true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'modif',
            headerName: '',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow}>
                        <img src="icons/baseline_edit.png"  
                            width={20} 
                            height={20} 
                            className={classes.cellPointer} 
                            onClick={(event)=> {
                                event.ignore = true;
                            }}
                            alt=''
                        />
                    </div>
                )}           
                
            },

            {
                field: 'id',
                headerName: '',
                width: 33,
                editable: false,
                headerClassName:classes.GridColumnStyle,
                renderCell: (params)=>{
                    return(
                        <div className={classes.inputRow}>
                            <img src="icons/baseline_delete.png"  
                                width={20} 
                                height={20} 
                                className={classes.cellPointer} 
                                alt=''
                            />
                        </div>
                    );
                    
                },
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
        document.getElementById('description').value = ''
        document.getElementById('duree').value = ''
        document.getElementById('exclusion_definitive').value = ''

        document.getElementById('libelle').defaultValue = ''
        document.getElementById('description').defaultValue = ''      
        document.getElementById('duree').defaultValue = ''      
        document.getElementById('exclusion_definitive').defaultValue = ''      
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var sanctions = { 
            id:0, 
            libelle:'',
            description:'',
            type_duree:'',
            duree:0,
            exclusion_definitive:''
        }

        sanctions.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        sanctions.description = (document.getElementById('description').value !='') ? putToEmptyStringIfUndefined(document.getElementById('description').value).trim() : putToEmptyStringIfUndefined(document.getElementById('description').defaultValue).trim();       
        sanctions.type_duree = (document.getElementById('type_duree').value !='') ? putToEmptyStringIfUndefined(document.getElementById('type_duree').value).trim() : putToEmptyStringIfUndefined(document.getElementById('type_duree').defaultValue).trim();       
        sanctions.duree = (document.getElementById('duree').value !='') ? putToEmptyStringIfUndefined(document.getElementById('duree').value).trim() : putToEmptyStringIfUndefined(document.getElementById('duree').defaultValue).trim();       
        sanctions.exclusion_definitive = document.getElementById('exclusion_definitive').checked
        sanctions.id = document.getElementById('idSanction').value;
        return sanctions;
    }

    function formDataCheck(sanct) {
        var errorMsg='';
        if(sanct.libelle.length == 0){
            errorMsg="Veuillez entrer le libellé !";
            return errorMsg;
        }       
        return errorMsg;
    }
    
    function handleDeleteRow(params){
        if(params.field=='id'){
            deleteRow(params.id)            
        }
    }

    function handleEditRow(row){       
        var inputs=[];
        // fields = ["id","libelle","description","duree_sanction_unit","eleve_a_supprimer","duree"]

        inputs[0]= row.libelle;
        inputs[1]= row.description;
        inputs[2]= row.id;
        inputs[3]= row.duree_sanction_unit;
        inputs[4]= row.eleve_a_supprimer;
        inputs[5]= row.duree;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listSanctions(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        sanctions=[];
        axiosInstance
        .post(`list-type-sanctions/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.sanctions.map((cycle)=>{sanctions.push(cycle)});
            console.log(sanctions);
            setGridRows(sanctions);
        })  
    }


    function addNewCycle(e) {       
        e.preventDefault();
        var sanct = getFormData();
        console.log(sanct)
        if (formDataCheck(sanct).length==0) {                        
            axiosInstance.post(`create-type-sanction/`, {
                    libelle: sanct.libelle,
                    description: sanct.description,
                    type_duree: sanct.type_duree,
                    duree: sanct.duree,
                    exclusion_definitive: sanct.exclusion_definitive,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                sanctions = []
                res.data.sanctions.map((cycle)=>{sanctions.push(cycle)});
                setGridRows(sanctions);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(sanct);
        }
        
    }
    
    function modifyCycle(e) {
        e.preventDefault();
        var sanct = getFormData();
        console.log(sanct);
     
        if (formDataCheck(sanct).length==0) { 
            axiosInstance.post(`update-type-sanction/`, {
                id: sanct.id,
                libelle: sanct.libelle,
                description: sanct.description,
                type_duree: sanct.type_duree,
                duree: sanct.duree,
                exclusion_definitive: sanct.exclusion_definitive,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                sanctions = []
                res.data.sanctions.map((cycle)=>{sanctions.push(cycle)});
                setGridRows(sanctions);
                ClearForm();
                setModalOpen(0);
            })          

        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(sanct);
        }
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-type-sanction/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                sanctions = []
                res.data.sanctions.map((cycle)=>{sanctions.push(cycle)});
                setGridRows(sanctions);
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
            {(modalOpen!=0) && <AddTypeSanction formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewCycle : modifyCycle} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES CYCLES
                    </div>
                                
                    <div className={classes.gridAction}> 
                        <CustomButton
                            btnText='+' 
                            buttonStyle={getButtonStyle()}
                            btnTextStyle = {classes.btnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
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
export default ConfigTypeSanction;