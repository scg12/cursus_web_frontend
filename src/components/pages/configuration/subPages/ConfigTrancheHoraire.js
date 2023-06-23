import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddTrancheHoraire from "../modals/AddTrancheHoraire";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var tranches = [],duree_periode=0,pauses=[];  

function ConfigTrancheHoraire(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listTranches()
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
            headerName: 'Jour',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'heure_deb',
            headerName: 'Heure Deb',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'heure_fin',
            headerName: 'Heure Fin',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_tranches',
            headerName: 'num',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'libelle_tranches',
            headerName: 'num2',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'type_tranches',
            headerName: 'num3',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'h_debs',
            headerName: 'num4',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'h_fins',
            headerName: 'num5',
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
        var tranches = { 
            id:0, 
            type_tranches_list:'',
            id_tranches_list:'', 
            heure_list:'',
            a_change:'',
        }

        tranches.id = document.getElementById('idJour').value;
        tranches.type_tranches_list = document.getElementById('type_tranches_list').value;
        tranches.id_tranches_list = document.getElementById('id_tranches_list').value;
        tranches.heure_list = document.getElementById('heure_list').value;
        tranches.a_change = document.getElementById('a_change').value;

        return tranches;
    }

    function formDataCheck(tranch) {
        var errorMsg='';
        // if(tranch.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du tranche !";
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
        inputs[1]= row.id_tranches;
        inputs[3]= row.libelle_tranches;
        inputs[4]= row.type_tranches;
        inputs[5]= pauses;
        inputs[6]= duree_periode;
        inputs[7]= row.h_debs;
        inputs[8]= row.h_fins;
        inputs[9]= row.heure_deb;
        inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listTranches(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        tranches=[];
        duree_periode=0;
        pauses=[];
        axiosInstance
        .post(`list-tranche-horaires/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.jours.map((tranche)=>{tranches.push(tranche)});
            duree_periode = res.data.duree_periode
            res.data.pauses.map((p)=>{pauses.push(p)});
            console.log(tranches);
            setGridRows(tranches);
        })  
    }


    function addNewTranche(e) {       
        e.preventDefault();
        var tranch = getFormData();
                        
            axiosInstance.post(`create-tranche/`, {
                    libelle: tranch.libelle,
                    code: tranch.code,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                tranches = []
                res.data.tranches.map((tranche)=>{tranches.push(tranche)});
                setGridRows(tranches);
                ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifyTranche(e) {
        e.preventDefault();
        var tranch = getFormData();
        console.log(tranch);
            tranches=[];
            duree_periode=0;
            pauses=[];
            axiosInstance.post(`set-tranche-horaire/`, {
                id: tranch.id,
                id_tranches_list: tranch.id_tranches_list,
                type_tranches_list: tranch.type_tranches_list,  
                heure_list: tranch.heure_list,
                a_change: tranch.a_change,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                res.data.jours.map((tranche)=>{tranches.push(tranche)});
                duree_periode = res.data.duree_periode
                res.data.pauses.map((p)=>{pauses.push(p)});
                setGridRows(tranches);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-tranche/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                tranches = []
                res.data.tranches.map((tranche)=>{tranches.push(tranche)});
                setGridRows(tranches);
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
            {(modalOpen!=0) && <AddTrancheHoraire formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewTranche : modifyTranche} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES JOURS
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
export default ConfigTrancheHoraire;