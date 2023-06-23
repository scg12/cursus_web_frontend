import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddHierarchie from "../modals/AddHierarchie";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var hierarchies = [];  

function ConfigHierarchie(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listHierarchies()
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
            field: 'libelle_hierarchie',
            headerName: 'Hierarchie',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'quota_cursus',
            headerName: 'Quota Cursus',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'is_adminstaff',
            headerName: 'Administratif?',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'is_enseignant',
            headerName: 'Enseignant?',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'rang',
            headerName: 'Rang',
            width: 100,
            editable: false,
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
        // var errorDiv = document.getElementById('errMsgPlaceHolder');
        // errorDiv.className = null;
        // errorDiv.textContent ='';

        // document.getElementById('libelle').value = ''
        // document.getElementById('code').value = ''

        // document.getElementById('libelle').defaultValue = ''
        // document.getElementById('code').defaultValue = ''      
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var hierarchies = { 
            id_hierarchie:0,
            libelle_hierarchie:'',
            is_adminstaff:'', 
            rang:'', 
        }

        hierarchies.libelle_hierarchie = (document.getElementById('libelleHierarchie').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelleHierarchie').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelleHierarchie').defaultValue).trim();
        hierarchies.id_hierarchie = document.getElementById('idHierarchie').value;
        hierarchies.is_adminstaff = document.getElementById('isAdministratif').value;
        hierarchies.rang = document.getElementById('rang').value;
        return hierarchies;
    }

    function formDataCheck(hier) {
        var errorMsg='';
        // if(hier.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du hierarchie !";
        //     return errorMsg;
        // }       
        // return errorMsg;
    }
    
    function handleDeleteRow(params){
        if(params.field=='id'){
            deleteRow(params.id)            
        }
    }

    function handleEditRow(row){       
        var inputs=[];
        inputs[0]= row.libelle_hierarchie;
        inputs[1]= row.is_adminstaff;
        inputs[2]= row.id;
        inputs[3]= row.rang;
        console.log("INPUTS: ",inputs)

        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listHierarchies(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        hierarchies=[];
        axiosInstance
        .post(`list-hierarchies/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((hierarchie)=>{hierarchies.push(hierarchie)});
            console.log(hierarchies);
            setGridRows(hierarchies);
        })
    }


    function addNewHierarchie(e) {       
        e.preventDefault();
        var hier = getFormData();
                   console.log(hier);   
            axiosInstance.post(`create-hierarchie/`, {
                    libelle_hierarchie:hier.libelle_hierarchie,
                    is_adminstaff:hier.is_adminstaff, 
                    rang:hier.rang, 
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                hierarchies = []
                res.data.hierarchies.map((hierarchie)=>{hierarchies.push(hierarchie)});
                setGridRows(hierarchies);
                ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifyHierarchie(e) {
        e.preventDefault();
        var hier = getFormData();
        console.log(hier);
     
            axiosInstance.post(`update-hierarchie/`, {
                id:hier.id_hierarchie,
                libelle_hierarchie:hier.libelle_hierarchie,
                is_adminstaff:hier.is_adminstaff, 
                rang:hier.rang, 
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                hierarchies = []
                res.data.hierarchies.map((hierarchie)=>{hierarchies.push(hierarchie)});
                setGridRows(hierarchies);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-hierarchie/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                hierarchies = []
                res.data.hierarchies.map((hierarchie)=>{hierarchies.push(hierarchie)});
                setGridRows(hierarchies);
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
            {(modalOpen!=0) && <AddHierarchie formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewHierarchie : modifyHierarchie} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES HIERARCHIES
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
                        getCellClassName={(params) => (params.field==='libelle_hierarchie')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default ConfigHierarchie;