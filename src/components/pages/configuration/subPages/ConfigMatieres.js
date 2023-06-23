import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddMatiere from "../modals/AddMatiere";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var matieres = [];  

function ConfigMatieres(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listMatieres()
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
            headerName: 'Matière',
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
        var matieres = { 
            id:0, 
            libelle:'',
            code:'' 
        }

        matieres.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        matieres.code = (document.getElementById('code').value !='') ? putToEmptyStringIfUndefined(document.getElementById('code').value).trim() : putToEmptyStringIfUndefined(document.getElementById('code').defaultValue).trim();       
        matieres.id = document.getElementById('idMatiere').value;
        return matieres;
    }

    function formDataCheck(matier) {
        var errorMsg='';
        if(matier.libelle.length == 0){
            errorMsg="Veuillez entrer le libellé du matiere !";
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
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listMatieres(){
        matieres=[];
        axiosInstance
        .post(`list-matieres/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((matiere)=>{matieres.push(matiere)});
            console.log(matieres);
            setGridRows(matieres);
        })  
    }


    function addNewMatiere(e) {       
        e.preventDefault();
        var matier = getFormData();

        if (formDataCheck(matier).length==0) {                        
            axiosInstance.post(`create-matiere/`, {
                    libelle: matier.libelle,
                    code: matier.code,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                matieres = []
                res.data.matieres.map((matiere)=>{matieres.push(matiere)});
                setGridRows(matieres);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(matier);
        }
        
    }
    
    function modifyMatiere(e) {
        e.preventDefault();
        var matier = getFormData();
        console.log(matier);
     
        if (formDataCheck(matier).length==0) { 
            axiosInstance.post(`update-matiere/`, {
                id: matier.id,
                libelle: matier.libelle,
                code: matier.code,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                matieres = []
                res.data.matieres.map((matiere)=>{matieres.push(matiere)});
                setGridRows(matieres);
                ClearForm();
                setModalOpen(0);
            })          

        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(matier);
        }
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la Matière selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-matiere/`, {
                id:rowId,
                id_classe:"",
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                matieres = []
                res.data.matieres.map((matiere)=>{matieres.push(matiere)});
                setGridRows(matieres);
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
            {(modalOpen!=0) && <AddMatiere formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewMatiere : modifyMatiere} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES MATIERES
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
export default ConfigMatieres;