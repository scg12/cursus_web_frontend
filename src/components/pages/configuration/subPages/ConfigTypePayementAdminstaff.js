import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddTypePayementAdminstaff from "../modals/AddTypePayementAdminstaff";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var payements = [], type_hierarchies = [];  

function ConfigTypePayementAdminstaff(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listPayements()
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
            field: 'libelle_payement',
            headerName: 'Type Payement',
            width: 150,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'montant',
            headerName: 'Montant',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'entree_sortie_caisee',
            headerName: 'E/S',
            width: 70,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'libelle_h',
            headerName: 'Adminstaff',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_h',
            headerName: 'num',
            width: 100,
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
        var payements = { 
            id:0, 
            libelle_payement:'',
            id_hierarchie:0, 
            montant:0, 
            e_s:'', 
        }

        // payements.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        // payements.code = (document.getElementById('code').value !='') ? putToEmptyStringIfUndefined(document.getElementById('code').value).trim() : putToEmptyStringIfUndefined(document.getElementById('code').defaultValue).trim();       
        payements.libelle_payement = document.getElementById('libelle').value;
        payements.id_hierarchie = document.getElementById('type_h').value;
        payements.montant = document.getElementById('montant').value;
        payements.e_s = document.getElementById('e_s').value;
        payements.id = document.getElementById('idPayement').value;
        return payements;
    }

    function formDataCheck(paymt) {
        var errorMsg='';
        if(paymt.libelle.length == 0){
            errorMsg="Veuillez entrer le libellé du payement !";
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
        inputs[0]= row.libelle_payement;
        inputs[1]= row.id_h;
        inputs[2]= row.id;
        inputs[3]= row.libelle_h;
        inputs[4]= row.montant;
        inputs[5]= row.entree_sortie_caisee;
        inputs[6]= type_hierarchies;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listPayements(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        payements=[];
        type_hierarchies=[];
        axiosInstance
        .post(`list-type-payement-adminstaffs/`,{id_sousetab: currentAppContext.currentEtab,
            id_hierarchie:""}).then((res)=>{
            res.data.payements.map((payement)=>{payements.push(payement)});
            res.data.type_hierarchies.map((t)=>{type_hierarchies.push(t)});
            console.log(payements);
            setGridRows(payements);
        })  
    }


    function addNewPayement(e) {       
        e.preventDefault();
        var paymt = getFormData();
                                   
            axiosInstance.post(`create-type-payement-adminstaff/`, {
                    id:0, 
                    libelle:paymt.libelle_payement,
                    id_hierarchie:paymt.id_hierarchie, 
                    montant:paymt.montant, 
                    entree_sortie_caisee:paymt.e_s, 
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                payements = [];
                type_hierarchies = []
                res.data.payements.map((payement)=>{payements.push(payement)});
                res.data.type_hierarchies.map((t)=>{type_hierarchies.push(t)});
                setGridRows(payements);
                ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifyPayement(e) {
        e.preventDefault();
        var paymt = getFormData();
        console.log(paymt);

            axiosInstance.post(`update-type-payement-adminstaff/`, {
                id:paymt.id, 
                libelle:paymt.libelle_payement,
                id_hierarchie:paymt.id_hierarchie, 
                montant:paymt.montant, 
                entree_sortie_caisee:paymt.e_s, 
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                payements = [];
                type_hierarchies = []
                res.data.payements.map((payement)=>{payements.push(payement)});
                res.data.type_hierarchies.map((t)=>{type_hierarchies.push(t)});
                setGridRows(payements);
                ClearForm();
                setModalOpen(0);
            })    

    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer le payement selectionné?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-type-payement-adminstaff/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                payements = [];
                type_hierarchies = []
                res.data.payements.map((payement)=>{payements.push(payement)});
                res.data.type_hierarchies.map((t)=>{type_hierarchies.push(t)});
                setGridRows(payements);
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
            {(modalOpen!=0) && <AddTypePayementAdminstaff formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewPayement : modifyPayement} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        TYPES PAYEMENTS PERSONNEL ADMINISTRATIF
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
                                inputs[4]= "";
                                inputs[5]= "";
                                inputs[6]= type_hierarchies;
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
                        getCellClassName={(params) => (params.field==='libelle_payement')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default ConfigTypePayementAdminstaff;