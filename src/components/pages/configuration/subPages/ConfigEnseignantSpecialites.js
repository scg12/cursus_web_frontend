import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddEnseignantSpecialites from "../modals/AddEnseignantSpecialites";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';


var matieres = [], groupes=[] ,enseignants=[];

function ConfigEnseignantSpecialites(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listEnsSpe()
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
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id',
            headerName: 'id',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'prenom',
            headerName: 'Prénom',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'code_ens',
            headerName: 'Code Ens.',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },


        {
            field: 'liste_matieres_enseignees',
            headerName: 'Matiere(s) enseignée(s)',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_user',
            headerName: 'id_user',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_spe1',
            headerName: 'id_spe1',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_spe2',
            headerName: 'id_spe2',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'id_spe3',
            headerName: 'id_spe3',
            width: 100,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        // {
        //     field: 'liste_libelles_cours_groupe',
        //     headerName: 'Cours Groupés',
        //     width: 180,
        //     editable: false,
        //     hide:true,
        //     headerClassName:classes.GridColumnStyle
        // },
        // {
        //     field: 'liste_ids_cours_groupe',
        //     headerName: 'num3',
        //     width: 180,
        //     editable: false,
        //     hide:true,
        //     headerClassName:classes.GridColumnStyle
        // },
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

            // {
            //     field: 'id',
            //     headerName: '',
            //     width: 33,
            //     editable: false,
            //     headerClassName:classes.GridColumnStyle,
            //     renderCell: (params)=>{
            //         return(
            //             <div className={classes.inputRow}>
            //                 <img src="icons/baseline_delete.png"  
            //                     width={20} 
            //                     height={20} 
            //                     className={classes.cellPointer} 
            //                     alt=''
            //                 />
            //             </div>
            //         );
                    
            //     },
            // },
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
        console.log("data:",currentUiContext.formInputs);
        
        var infos = { 
            id : 0,
            id_spe1:0, 
            id_spe2:0,
            id_spe3:0,
        }

        /*infos.id = document.getElementById('id_ens').value;
        infos.id_spe1 = document.getElementById('id_spe1').value;
        infos.id_spe2 = document.getElementById('id_spe2').value;
        infos.id_spe3 = document.getElementById('id_spe3').value;*/

        infos.id = currentUiContext.formInputs[0];
        infos.id_spe1 = currentUiContext.formInputs[3];
        infos.id_spe2 = currentUiContext.formInputs[4];
        infos.id_spe3 = currentUiContext.formInputs[5];
        return infos;
    }

    function formDataCheck(info) {
        // var errorMsg='';
        // if(info.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du groupe !";
        //     return errorMsg;
        // }       
        // return errorMsg;
    }
    
    function handleDeleteRow(row){
        var inputs=[];
        inputs[0]= row.id;
        inputs[1]= row.nom;
        inputs[2]= row.prenom;
        inputs[3]= row.id_spe1;
        inputs[4]= row.id_spe2;
        inputs[5]= row.id_spe3;        
        inputs[6]= row.matieres;        
        inputs[7]= row.id_user;        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(1);
    }

    function handleEditRow(row){       
        var inputs=[];
        inputs[0]= row.id;
        inputs[1]= row.nom;
        inputs[2]= row.prenom;
        inputs[3]= row.id_spe1;
        inputs[4]= row.id_spe2;
        inputs[5]= row.id_spe3;   
        inputs[6]= matieres;        
        inputs[7]= row.id_user; 
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listEnsSpe(){
        matieres=[];
        enseignants=[];
        axiosInstance
        .post(`list-enseignant-matieres-specialites/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            // console.log(res.data.res);
            res.data.res.map((ens)=>{enseignants.push(ens)});
            res.data.matieres.map((m)=>{matieres.push(m)});
            // console.log(groupes);
            setGridRows(enseignants);
        })  
    }


    function addNewGroupe(e) {       
        e.preventDefault();
        var info = getFormData();
                     
            axiosInstance.post(`update-groupe/`, {
                id_groupe : info.idGroupe,
                id_cours:info.idCours, 
                id_classe:info.idClasse,
                info_spe:info.info_spe,
                supprimer:info.supprimer,
                new_groupe:info.new_groupe,
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
    
    function modifyEnseignant(info) {
       // e.preventDefault();
       // var info = getFormData();
        console.log("voici le gars",info);
        matieres=[];
        enseignants=[];
     
            axiosInstance.post(`update-enseignant-matieres-specialites/`, {
                id : info.id,
                id_matiere1:info.id_spe1, 
                id_matiere2:info.id_spe2, 
                id_matiere3:info.id_spe3, 
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                res.data.res.map((ens)=>{enseignants.push(ens)});
                res.data.matieres.map((m)=>{matieres.push(m)});
                setGridRows(enseignants);
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
            <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                {t("gest_ens_Spe")}
            </div>  
            {(modalOpen!=0) && <AddEnseignantSpecialites formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewGroupe : modifyEnseignant} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        DEFINITION MATIERE(S) SPECIALITE ENSEIGNANT
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
                        //onCellClick={(params,event)=>handleDeleteRow(params.row)}
                        onRowClick={(params,event)=>{
                            if(event.ignore) {
                                handleEditRow(params.row)
                            }
                        }}   
                        
                        onRowDoubleClick ={(params, event) => {
                            event.defaultMuiPrevented = true;
                            handleEditRow(params.row)
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
export default ConfigEnseignantSpecialites;