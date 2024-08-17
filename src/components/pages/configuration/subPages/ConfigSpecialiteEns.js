import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddSpecialiteEns from "../modals/AddSpecialiteEns";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';


var enseignants = [], matieres=[];  

function ConfigSpecialiteEns(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listEns()
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
            field: 'nom',
            headerName: 'Nom',
            width: 140,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'prenom',
            headerName: 'Prenom',
            width: 140,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_user',
            headerName: 'ID',
            width: 140,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_matieres_enseignees',
            headerName: 'num',
            width: 140,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_spe1',
            headerName: 'num2',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_spe2',
            headerName: 'num3',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_spe3',
            headerName: 'num4',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'liste_matieres_enseignees',
            headerName: 'Matières Enseignées',
            width: 200,
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

    function getConfigTitleColor(){
        switch(selectedTheme){
            case 'Theme1': return "#3ca015" ;
            case 'Theme2': return "#2358bb" ;
            case 'Theme3': return "#d11e5a" ;
            default: return "#3ca015" ;
        }
    }
    
/*************************** Handler functions ***************************/
    function ClearForm(){        
        // var errorDiv = document.getElementById('errMsgPlaceHolder');
        // errorDiv.className = null;
        // errorDiv.textContent ='';

        // document.getElementById('nom').value = ''
        // document.getElementById('code').value = ''

        // document.getElementById('nom').defaultValue = ''
        // document.getElementById('code').defaultValue = ''      
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var enseignants = { 
            id:0, 
            id_matiere1:0,
            id_matiere2:0,
            id_matiere3:0, 
        }

        enseignants.id = document.getElementById('idEns').value;
        enseignants.id_matiere1 = document.getElementById('mat_1').value;
        enseignants.id_matiere2 = document.getElementById('mat_2').value;
        enseignants.id_matiere3 = document.getElementById('mat_3').value;
        return enseignants;
    }

    function formDataCheck(enseig) {
        var errorMsg='';
        // if(enseig.nom.length == 0){
        //     errorMsg="Veuillez entrer le libellé du enseignant !";
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
        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[3]= row.id_matieres_enseignees;
        inputs[4]= matieres;
        inputs[5]= row.id_spe1;
        inputs[6]= row.id_spe2;
        inputs[7]= row.id_spe3;
        inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listEns(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        enseignants=[];
        matieres=[];
        axiosInstance
        .post(`list-enseignant-matieres-specialites/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.res.map((enseignant)=>{enseignants.push(enseignant)});
            res.data.matieres.map((m)=>{matieres.push(m)});
            console.log(enseignants);
            setGridRows(enseignants);
        })  
    }


    function addNewEns(e) {       
        e.preventDefault();
        var enseig = getFormData();
                        
            axiosInstance.post(`create-enseignant/`, {
                    nom: enseig.nom,
                    code: enseig.code,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                enseignants = []
                res.data.enseignants.map((enseignant)=>{enseignants.push(enseignant)});
                setGridRows(enseignants);
                ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifyEns(e) {
        e.preventDefault();
        var enseig = getFormData();
        console.log("voici le gars:",enseig);
     
            axiosInstance.post(`update-enseignant-matieres-specialites/`, {
                id: enseig.id,
                id_matiere1: enseig.id_matiere1,
                id_matiere2: enseig.id_matiere2,
                id_matiere3: enseig.id_matiere3,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                enseignants = [];
                matieres= []
                res.data.res.map((enseignant)=>{enseignants.push(enseignant)});
                res.data.matieres.map((m)=>{matieres.push(m)});
                setGridRows(enseignants);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-enseignant/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                enseignants = []
                res.data.enseignants.map((enseignant)=>{enseignants.push(enseignant)});
                setGridRows(enseignants);
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
            <div className={classes.inputRowLeft} style={{color:getConfigTitleColor(), fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:getConfigTitleColor(), borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                {t("gest_matSpe_ens")}
            </div>
            
            {(modalOpen!=0) && <AddSpecialiteEns formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewEns : modifyEns} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES ENSEIGNANTS
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
                        getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default ConfigSpecialiteEns;