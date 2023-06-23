import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddQuotasCursus from "../modals/AddQuotasCursus";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var quotas = [];  

function ConfigQuotasCursus(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listQuotas()
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
            headerName: 'Hierarchie',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'quota_cursus',
            headerName: 'Quota',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'rang',
            headerName: 'Rang',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        // {
        //     field: 'modif',
        //     headerName: '',
        //     width: 33,
        //     editable: false,
        //     headerClassName:classes.GridColumnStyle,
        //     renderCell: (params)=>{
        //         return(
        //             <div className={classes.inputRow}>
        //                 <img src="icons/baseline_edit.png"  
        //                     width={20} 
        //                     height={20} 
        //                     className={classes.cellPointer} 
        //                     onClick={(event)=> {
        //                         event.ignore = true;
        //                     }}
        //                     alt=''
        //                 />
        //             </div>
        //         )}           
                
        //     },

        //     {
        //         field: 'id',
        //         headerName: '',
        //         width: 33,
        //         editable: false,
        //         headerClassName:classes.GridColumnStyle,
        //         renderCell: (params)=>{
        //             return(
        //                 <div className={classes.inputRow}>
        //                     <img src="icons/baseline_delete.png"  
        //                         width={20} 
        //                         height={20} 
        //                         className={classes.cellPointer} 
        //                         alt=''
        //                     />
        //                 </div>
        //             );
                    
        //         },
        //     },
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
        var quotas = { 
            id_hierarchies:'', 
            quotas:'',
        }
        quotas.id_hierarchies = document.getElementById('idHierarchies').value;
        quotas.quotas = document.getElementById('quotas').value;
        return quotas;
    }

    function formDataCheck(quot) {
        var errorMsg='';
        // if(quot.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du quota !";
        //     return errorMsg;
        // }       
        return errorMsg;
    }
    
    function handleDeleteRow(params){
        if(params.field=='id'){
            deleteRow(params.id)            
        }
    }

    function handleEditRow(row){       
        var inputs=[];
        // inputs[0]= row.libelle;
        // inputs[1]= row.code;
        // inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listQuotas(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        quotas=[];
        axiosInstance
        .post(`list-quota-cursus/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((quota)=>{quotas.push(quota)});
            console.log(quotas);
            setGridRows(quotas);
        })  
    }


    function updateQuotas(e) {       
        e.preventDefault();
        var quot = getFormData();

                    
            axiosInstance.post(`set-quota-cursus/`, {
                    id_hierarchies: quot.id_hierarchies,
                    quotas: quot.quotas,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                quotas = []
                res.data.quotas.map((quota)=>{quotas.push(quota)});
                setGridRows(quotas);
                // ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifyCycle(e) {
        e.preventDefault();
        var quot = getFormData();
        console.log(quot);
     
            axiosInstance.post(`update-quota/`, {
                id: quot.id,
                libelle: quot.libelle,
                code: quot.code,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                quotas = []
                res.data.quotas.map((quota)=>{quotas.push(quota)});
                setGridRows(quotas);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-quota/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                quotas = []
                res.data.quotas.map((quota)=>{quotas.push(quota)});
                setGridRows(quotas);
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
            {(modalOpen!=0) && <AddQuotasCursus formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? updateQuotas : modifyCycle} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES QUOTAS CURSUS
                    </div>
                                
                    <div className={classes.gridAction}> 
                        <CustomButton
                            btnText='Mettre à Jour' 
                            buttonStyle={getButtonStyle()}
                            btnTextStyle = {classes.btnTextStyle}
                            btnClickHandler={()=>{var inputs=[];
                                inputs[0]= quotas;                             
                                currentUiContext.setFormInputs(inputs);setModalOpen(1); }}
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
export default ConfigQuotasCursus;