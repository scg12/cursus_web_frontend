import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddMatiereClasse from "../modals/AddMatiereClasse";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var matieres = [];  
var matieres_etab = [];  

function ConfigMatieresClasse(props) {
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
            field: 'classe',
            headerName: 'Classe',
            width: 130,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'libelle_matieres',
            headerName: 'Matières',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_matieres',
            headerName: 'num',
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
        var matieres = { 
            id_matieres:'', 
            id_classe:'',
        }

        matieres.id_matieres = document.getElementById('idMatieres').value;
        matieres.id_classe = document.getElementById('idClasse').value;
        return matieres;
    }


    function handleEditRow(row){       
        var inputs=[];
        inputs[0]= row.classe;
        inputs[1]= row.libelle_matieres;
        inputs[2]= ","+row.id_matieres;
        inputs[3]= row.id;
        inputs[4]= matieres_etab;
        currentUiContext.setFormInputs(inputs)
        console.log("row: ",row)
        setModalOpen(2);

    }

    function listMatieres(){
        matieres=[];
        matieres_etab=[];
        axiosInstance
        .post(`list-matieres-classe/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.res.map((matiere)=>{matieres.push(matiere)});
            res.data.matieres.map((matiere)=>{matieres_etab.push(matiere)});
            console.log(matieres);
            setGridRows(matieres);
        })  
    }


    function addNewMatiere(e) {       
        e.preventDefault();
        var matier = getFormData();

                        
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
        
        
    }
    
    function modifyMatiere(e) {
        e.preventDefault();
        var matier = getFormData();
        console.log(matier);
     
            axiosInstance.post(`associer-matiere-classe/`, {
                id_matieres: matier.id_matieres,
                id_classe: matier.id_classe,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                matieres = []
                res.data.matieres.map((matiere)=>{matieres.push(matiere)});
                setGridRows(matieres);
                ClearForm();
                setModalOpen(0);
            })          

    }

    function quitForm() {
        ClearForm();
        setModalOpen(0)
    }
   

    /********************************** JSX Code **********************************/   
    return (
        <div className={classes.formStyle}>
            {(modalOpen!=0) && <AddMatiereClasse formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewMatiere : modifyMatiere} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES MATIERES ET CLASSES
                    </div>
                    
                </div>
                : null
            }

            {(modalOpen==0) ?
                <div style={{ height: 300, width: 530 }}>
                    <StripedDataGrid
                        rows={gridRows}
                        columns={columns}
                        getCellClassName={(params) => (params.field==='classe')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default ConfigMatieresClasse;