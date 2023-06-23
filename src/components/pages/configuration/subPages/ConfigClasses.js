import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddClasse from "../modals/AddClasse";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var clases = [];  

function ConfigClasse(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listClasses()
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
        {
            field: 'code',
            headerName: 'Code',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'libelle_cycle',
            headerName: 'Cycle',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_cycle',
            headerName: 'num',
            width: 100,
            editable: false,
            hide: true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'libelle_niveau',
            headerName: 'Niveau',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_niveau',
            headerName: 'num2',
            width: 100,
            editable: false,
            hide: true,
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
        document.getElementById('code').value = ''

        document.getElementById('libelle').defaultValue = ''
        document.getElementById('code').defaultValue = ''      
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var clases = { 
            id:0, 
            libelle:'',
            code:'',
            id_cycle:0,
            id_niveau:0
        }

        clases.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        clases.code = (document.getElementById('code').value !='') ? putToEmptyStringIfUndefined(document.getElementById('code').value).trim() : putToEmptyStringIfUndefined(document.getElementById('code').defaultValue).trim();       
        clases.id = document.getElementById('idClasse').value;
        clases.id_cycle = document.getElementById('idCycleSelected').value;
        clases.id_niveau = document.getElementById('idNiveauSelected').value;
        return clases;
    }

    function formDataCheck(clss) {
        var errorMsg='';
        if(clss.libelle.length == 0){
            errorMsg="Veuillez entrer le libellé du classe !";
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
        inputs[1]= row.code;
        inputs[2]= row.id;
        inputs[3]= row.id_cycle;
        inputs[4]= row.libelle_cycle;
        inputs[5]= row.id_niveau;
        inputs[6]= row.libelle_niveau;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listClasses(){
        // console.log("currentAppContext: ",currentAppContext)
        clases=[];
        axiosInstance
        .post(`list-classes/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((classe)=>{clases.push(classe)});
            console.log(clases);
            setGridRows(clases);
        })  
    }


    function addNewClasse(e) {       
        e.preventDefault();
        var clss = getFormData();

        if (formDataCheck(clss).length==0) {                        
            axiosInstance.post(`create-classe/`, {
                    libelle: clss.libelle,
                    code: clss.code,
                    id_cycle: clss.id_cycle,
                    id_niveau:clss.id_niveau,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                clases = []
                res.data.classes.map((classe)=>{clases.push(classe)});
                setGridRows(clases);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(clss);
        }
        
    }
    
    function modifyClasse(e) {
        e.preventDefault();
        var clss = getFormData();
        console.log(clss);
     
        if (formDataCheck(clss).length==0) { 
            axiosInstance.post(`update-classe/`, {
                id: clss.id,
                libelle: clss.libelle,
                code: clss.code,
                id_cycle: clss.id_cycle,
                id_niveau:clss.id_niveau,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                clases = []
                res.data.classes.map((classe)=>{clases.push(classe)});
                setGridRows(clases);
                ClearForm();
                setModalOpen(0);
            })          

        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(clss);
        }
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer le classe?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-classe/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                clases = []
                res.data.classes.map((classe)=>{clases.push(classe)});
                setGridRows(clases);
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
            {(modalOpen!=0) && <AddClasse formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewClasse : modifyClasse} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES CLASSES
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
export default ConfigClasse;