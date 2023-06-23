import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddGroupe from "../modals/AddGroupe";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var groupes = [];  

function ConfigGroupe(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listGroupes()
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
            field: 'libelle_classe',
            headerName: 'Classe',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'liste_libelles_groupe',
            headerName: 'Groupes définis',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nb_groupes',
            headerName: '# Groupes définis',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'liste_ids_groupe',
            headerName: 'num',
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'liste_libelles_cours',
            headerName: 'ungrouped',
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'liste_ids_cours',
            headerName: 'num2',
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'nb_cours_non_groupes',
            headerName: '# Cours sans Groupe',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'liste_libelles_cours_groupe',
            headerName: 'Cours Groupés',
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'liste_ids_cours_groupe',
            headerName: 'num3',
            width: 180,
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
        var groupes = { 
            idGroupe : 0,
            idCours:0, 
            idClasse:'',
            grp_spe:0,
            supprimer:0,
            new_groupe:''
        }

        groupes.idGroupe = document.getElementById('idGroupe').value;
        groupes.idCours = document.getElementById('idCours').value;
        groupes.idClasse = document.getElementById('idClasse').value;
        groupes.grp_spe = document.getElementById('grp_spe').value;
        groupes.new_groupe = document.getElementById('newGroup').value;
        return groupes;
    }

    function formDataCheck(grp) {
        // var errorMsg='';
        // if(grp.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du groupe !";
        //     return errorMsg;
        // }       
        // return errorMsg;
    }
    
    function handleDeleteRow(row){
        var inputs=[];
        inputs[0]= row.libelle_classe;
        inputs[1]= row.liste_libelles_groupe;
        inputs[2]= row.nb_groupes;
        inputs[3]= row.liste_ids_groupe;
        inputs[4]= row.liste_libelles_cours;
        inputs[5]= row.liste_ids_cours;
        inputs[6]= row.nb_cours_non_groupes;
        inputs[7]= row.liste_libelles_cours_groupe;
        inputs[8]= row.liste_ids_cours_groupe;
        inputs[9]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(1);
    }

    function handleEditRow(row){       
        var inputs=[];
        inputs[0]= row.libelle_classe;
        inputs[1]= row.liste_libelles_groupe;
        inputs[2]= row.nb_groupes;
        inputs[3]= row.liste_ids_groupe;
        inputs[4]= row.liste_libelles_cours;
        inputs[5]= row.liste_ids_cours;
        inputs[6]= row.nb_cours_non_groupes;
        inputs[7]= row.liste_libelles_cours_groupe;
        inputs[8]= row.liste_ids_cours_groupe;
        inputs[9]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listGroupes(){
        groupes=[];
        axiosInstance
        .post(`list-groupes/`,{id_sousetab: currentAppContext.currentEtab,id_classe:""}).then((res)=>{
            res.data.map((groupe)=>{groupes.push(groupe)});
            console.log(groupes);
            setGridRows(groupes);
        })  
    }


    function addNewGroupe(e) {       
        e.preventDefault();
        var grp = getFormData();
                     
            axiosInstance.post(`update-groupe/`, {
                id_groupe : grp.idGroupe,
                id_cours:grp.idCours, 
                id_classe:grp.idClasse,
                grp_spe:grp.grp_spe,
                supprimer:grp.supprimer,
                new_groupe:grp.new_groupe,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                groupes = []
                // res.data.groupes.map((groupe)=>{groupes.push(groupe)});
                // setGridRows(groupes);
                ClearForm();
                setModalOpen(0);
            }) 
            
        
    }
    
    function modifyGroupe(e) {
        e.preventDefault();
        var grp = getFormData();
        console.log(grp);
     
            axiosInstance.post(`update-groupe/`, {
                id_groupe : grp.idGroupe,
                id_cours:grp.idCours, 
                id_classe:grp.idClasse,
                grp_spe:grp.grp_spe,
                supprimer:"1",
                new_groupe:grp.new_groupe,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                groupes = []
                // res.data.groupes.map((groupe)=>{groupes.push(groupe)});
                // setGridRows(groupes);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-groupe/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                groupes = []
                res.data.groupes.map((groupe)=>{groupes.push(groupe)});
                setGridRows(groupes);
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
            {(modalOpen!=0) && <AddGroupe formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewGroupe : modifyGroupe} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES GROUPES DE MATIERES
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
                        getCellClassName={(params) => (params.field==='libelle_classe')? classes.gridMainRowStyle : classes.gridRowStyle }
                        onCellClick={(params,event)=>handleDeleteRow(params.row)}
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
export default ConfigGroupe;