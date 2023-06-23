import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddMatricule from "../modals/AddMatricule";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var matricules = [];  

function ConfigMatricule(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listMatricules()
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
            field: 'libelle_etab',
            headerName: 'Etablissement',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'format_matricule',
            headerName: 'Format Matricule',
            width: 180,
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
        var matricules = { 
            id:0, 
            fixe:'',
            nombre:'',
            annee:'',
            format:'',
            matricule_partage:'0'
        }

        matricules.fixe = (document.getElementById('fixe').value !='') ? putToEmptyStringIfUndefined(document.getElementById('fixe').value).trim() : putToEmptyStringIfUndefined(document.getElementById('fixe').defaultValue).trim();
        matricules.nombre = (document.getElementById('nombre').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nombre').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nombre').defaultValue).trim();       
        matricules.annee = (document.getElementById('annee').value !='') ? putToEmptyStringIfUndefined(document.getElementById('annee').value).trim() : putToEmptyStringIfUndefined(document.getElementById('annee').defaultValue).trim();       
        matricules.format = (document.getElementById('format').value !='') ? putToEmptyStringIfUndefined(document.getElementById('format').value).trim() : putToEmptyStringIfUndefined(document.getElementById('format').defaultValue).trim();       
        matricules.id = document.getElementById('idEtab').value;
        matricules.matricule_partage = document.getElementById('matricule_partage').value;
        return matricules;
    }

    function formDataCheck(mat) {
        var errorMsg='';
        if(!(mat.format.length == 3 && mat.format.includes("F")&& mat.format.includes("Y")&& mat.format.includes("N"))){
            errorMsg="Format in correct!";
            return errorMsg;
        }
        return errorMsg;
    }
    
    function handleDeleteRow(params){
        if(params.field=='id'){
            AttribuerMatriculeEleves(params.id)            
        }
    }

    function handleEditRow(row){       
        var inputs=[];
        inputs[0]= row.libelle_etab;
        inputs[1]= row.format_matricule;
        inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listMatricules(){
        matricules=[];
        axiosInstance
        .post(`list-matricules/`).then((res)=>{
            res.data.map((matricule)=>{matricules.push(matricule)});
            console.log(matricules);
            setGridRows(matricules);
        })  
    }


    function addNewMatricule(e) {       
        e.preventDefault();
        var mat = getFormData();

        if (formDataCheck(mat).length==0) {                        
            axiosInstance.post(`create-matricule/`, {
                    libelle: mat.libelle,
                    code: mat.code,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                matricules = []
                res.data.matricules.map((matricule)=>{matricules.push(matricule)});
                setGridRows(matricules);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(mat);
        }
        
    }
    
    function modifyMatricule(e) {
        e.preventDefault();
        var mat = getFormData();
        console.log(mat);
        if (formDataCheck(mat).length==0) { 
            axiosInstance.post(`definition-matricule/`, {

                id_sousetab: mat.id,
                fixe: mat.fixe,
                nombre: mat.nombre,
                annee: "22",
                mat_format: mat.format,
                matricule_partage: mat.matricule_partage,
                // id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                matricules = []
                res.data.matricules.map((matricule)=>{matricules.push(matricule)});
                setGridRows(matricules);
                ClearForm();
                setModalOpen(0);
            }) 
        } else {
                    var errorDiv = document.getElementById('errMsgPlaceHolder');
                    errorDiv.className = classes.errorMsg;
                    errorDiv.textContent = formDataCheck(mat);
                }         
    }

    function AttribuerMatriculeEleves(rowId) {
        //Message de confirmation
        // if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`attribution-matricule/`, {
                id_sousetab:rowId,
                // id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                matricules = []
                res.data.matricules.map((matricule)=>{matricules.push(matricule)});
                setGridRows(matricules);
            })              
        // }
    } 
    function quitForm() {
        ClearForm();
        setModalOpen(0)
    }
   

    /********************************** JSX Code **********************************/   
    return (
        <div className={classes.formStyle}>
            {(modalOpen!=0) && <AddMatricule formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewMatricule : modifyMatricule} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES FROMATS DE MATRICULES
                    </div>
                                
                    {/* <div className={classes.gridAction}> 
                        <CustomButton
                            btnText='+' 
                            buttonStyle={getButtonStyle()}
                            btnTextStyle = {classes.btnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(modalOpen==1||modalOpen==2)}   
                        />
                    </div> */}
                    
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
export default ConfigMatricule;