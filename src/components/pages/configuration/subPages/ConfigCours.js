import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddCours from "../modals/AddCours";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var courss = [];  

function ConfigCours(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listCours()
    },[]);


    const ODD_OPACITY = 0.2;
    let id_cours ="";
    let id_matieres ="";
    let info_cours ="";
    
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
            field: 'libelle_cours',
            headerName: 'Cours',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'libelle_classe',
            headerName: 'Classe',
            width: 130,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'libelle_matieres',
            headerName: 'matieres',
            width: 130,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'definis',
            headerName: 'Définis',
            width: 70,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'prevus',
            headerName: 'Prévus',
            width: 70,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_cours',
            headerName: 'num1',
            width: 70,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_matieres',
            headerName: 'num2',
            width: 70,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'info_cours',
            headerName: 'info_cours',
            width: 70,
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
        var courss = { 
            id:0, 
            libelle:'',
            coef:'',
            qh:'',
            qa:'' 
        }

        // courss.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        // courss.code = (document.getElementById('code').value !='') ? putToEmptyStringIfUndefined(document.getElementById('code').value).trim() : putToEmptyStringIfUndefined(document.getElementById('code').defaultValue).trim();       
        courss.id = document.getElementById('idClasse').value;
        courss.libelle = document.getElementById('libelle').value;
        courss.coef = document.getElementById('coef').value;
        courss.qh = document.getElementById('qh').value;
        courss.qa = document.getElementById('qa').value;
        return courss;
    }
    
    function handleDeleteRow(params){
        if(params.field=='id'){
            deleteRow(params.id)            
        }
    }

    function handleEditRow(row){       
        var inputs=[];
        inputs[0]= row.libelle_matieres;
        inputs[1]= row.libelle_cours;
        inputs[2]= row.id_cours;
        inputs[3]= row.id_matieres;
        inputs[4]= row.libelle_classe;
        inputs[5]= row.id;
        inputs[6]= (row.id_matieres).split("_").length;
        inputs[7]= (row.info_cours);
        console.log(inputs);
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listCours(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        courss=[];
        axiosInstance
        .post(`list-cours/`,{id_sousetab: currentAppContext.currentEtab,id_classe:""}).then((res)=>{
            res.data.map((cours)=>{courss.push(cours)});
            console.log(courss);
            setGridRows(courss);
        })  
    }


    function addNewcours(e) {       
        e.preventDefault();
        var crs = getFormData();
                   
            axiosInstance.post(`create-cours/`, {
                    id_classe:crs.id,
                    libelles: crs.libelle,
                    coefs: crs.coef,
                    qhs: crs.qh,
                    qas: crs.qa,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                courss = []
                // res.data.courss.map((cours)=>{courss.push(cours)});
                // setGridRows(courss);
                // ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifycours(e) {
        e.preventDefault();
        var crs = getFormData();
        console.log(crs);
     
            axiosInstance.post(`create-cours/`, {
                    id_classe:crs.id,
                    libelles: crs.libelle,
                    coefs: crs.coef,
                    qhs: crs.qh,
                    qas: crs.qa,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                courss = []
                res.data.cours.map((cours)=>{courss.push(cours)});
                setGridRows(courss);
                // ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-cours/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                courss = []
                res.data.courss.map((cours)=>{courss.push(cours)});
                setGridRows(courss);
            })              
        }
    } 
    function quitForm() {
        // ClearForm();
        setModalOpen(0)
    }
   

    /********************************** JSX Code **********************************/   
    return (
        <div className={classes.formStyle}>
            {(modalOpen!=0) && <AddCours formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewcours : modifycours} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES COURS
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
                        // onCellClick={handleDeleteRow}
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
export default ConfigCours;