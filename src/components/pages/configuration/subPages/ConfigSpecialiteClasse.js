import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddSpecialiteClasse from "../modals/AddSpecialiteClasse";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var specialites = [];  

function ConfigSpecialiteClasse(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listSpecialites()
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
            headerName: 'Spécialité',
            width: 150,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'libelle_classes',
            headerName: 'Classe(s)',
            width: 150,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'code',
            headerName: 'Code',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_classes',
            headerName: 'num1',
            width: 150,
            editable: false,
            hide:true,
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
        var specialites = { 
            id:0, 
            libelle:'',
            code:'',
            id_classes:'',
        }

        // specialites.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        specialites.id = document.getElementById('idSpecialite').value;
        specialites.libelle = document.getElementById('libelle').value;
        specialites.code = document.getElementById('code').value;
        // specialites.id_classes = document.getElementById('id_classes').value;
        console.log("specialites.code: ",specialites.code )
        let els = document.querySelectorAll('[checkbox]');
        let n = els.length;
        let items = "_";
        for(let i=0;i<n;i++){
            if(els[i].checked){
                let id = (els[i].id).replace("checkbox_","");
                items+=id+"_"
            }
        }
        specialites.id_classes = items;

        return specialites;
    }

    function formDataCheck(special) {
        var errorMsg='';
        // if(special.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du speciale !";
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
        inputs[0]= row.libelle;
        inputs[1]= row.code;
        inputs[3]= ","+row.id_classes+",";
        inputs[2]= row.id;
        inputs[4]= specialites
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listSpecialites(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        specialites=[];
        axiosInstance
        .post(`list-specialites/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((speciale)=>{specialites.push(speciale)});
            console.log(specialites);
            setGridRows(specialites);
        })  
    }


    function addNewSpecialite(e) {       
        e.preventDefault();
        var special = getFormData();
                        
            axiosInstance.post(`create-classe-specialite/`, {
                id_specialite:0, 
                libelle:special.libelle,
                code:special.code,
                id_classes:special.id_classes,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                specialites = []
                res.data.specialites.map((speciale)=>{specialites.push(speciale)});
                setGridRows(specialites);
                ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifySpecialite(e) {
        e.preventDefault();
        var special = getFormData();
        console.log(special);
     
            axiosInstance.post(`associer-classe-specialite/`, {
                id_specialite:special.id, 
                libelle:special.libelle,
                code:special.code,
                id_classes:special.id_classes,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                specialites = []
                res.data.specialites.map((speciale)=>{specialites.push(speciale)});
                setGridRows(specialites);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la spécialité selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-specialite/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                specialites = []
                res.data.specialites.map((speciale)=>{specialites.push(speciale)});
                setGridRows(specialites);
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
            {(modalOpen!=0) && <AddSpecialiteClasse formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewSpecialite : modifySpecialite} cancelHandler={quitForm} />}

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
                            btnClickHandler={()=>{setModalOpen(1);
                                var inputs=[];
                                inputs[0]= "";
                                inputs[1]= "";
                                inputs[2]= "";
                                inputs[3]= "";
                                inputs[4]= specialites;
                                currentUiContext.setFormInputs(inputs)}}
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
export default ConfigSpecialiteClasse;