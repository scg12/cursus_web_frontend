import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddCauseConvocationCD from "../modals/AddCauseConvocationCD";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var causes = [];  

function ConfigCausesConvocationCD(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listCauses()
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
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 250,
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
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        errorDiv.className = null;
        errorDiv.textContent ='';

        document.getElementById('libelle').value = ''
        document.getElementById('description').value = ''

        document.getElementById('libelle').defaultValue = ''
        document.getElementById('description').defaultValue = ''      
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var causes = { 
            id:0, 
            libelle:'',
            description:'' 
        }
        console.log("document.getElementById('description'): ",document.getElementById('description').value)
        causes.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        // causes.description = (document.getElementById('description').value !='') ? putToEmptyStringIfUndefined(document.getElementById('description').value).trim() : putToEmptyStringIfUndefined(document.getElementById('description').defaultValue).trim();  
        causes.description = document.getElementById('description').value;     
        causes.id = document.getElementById('idCause').value;
        return causes;
    }

    function formDataCheck(cycl) {
        var errorMsg='';
        if(cycl.libelle.length == 0){
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
        inputs[0]= row.libelle;
        inputs[1]= row.description;
        inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listCauses(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        causes=[];
        axiosInstance
        .post(`list-causes-convocation-cd/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((cycle)=>{causes.push(cycle)});
            console.log(causes);
            setGridRows(causes);
        })  
    }


    function addNewCause(e) {       
        e.preventDefault();
        var cycl = getFormData();

        if (formDataCheck(cycl).length==0) {                        
            axiosInstance.post(`create-cause-convocation-cd/`, {
                    libelle: cycl.libelle,
                    description: cycl.description,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                causes = []
                res.data.causes.map((cycle)=>{causes.push(cycle)});
                setGridRows(causes);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(cycl);
        }
        
    }
    
    function modifyCause(e) {
        e.preventDefault();
        var cycl = getFormData();
        console.log(cycl);
     
        if (formDataCheck(cycl).length==0) { 
            axiosInstance.post(`update-cause-convocation-cd/`, {
                id: cycl.id,
                libelle: cycl.libelle,
                description: cycl.description,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                causes = []
                res.data.causes.map((cycle)=>{causes.push(cycle)});
                setGridRows(causes);
                ClearForm();
                setModalOpen(0);
            })          

        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(cycl);
        }
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-cause-convocation-cd/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                causes = []
                res.data.causes.map((cycle)=>{causes.push(cycle)});
                setGridRows(causes);
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
            {(modalOpen!=0) && <AddCauseConvocationCD formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewCause : modifyCause} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES CAUSES DE CONVOCATION
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
export default ConfigCausesConvocationCD;