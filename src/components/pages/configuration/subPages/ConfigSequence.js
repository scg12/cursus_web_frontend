import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddSequence from "../modals/AddSequence";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { ConsoleView } from 'react-device-detect';
import { useTranslation } from 'react-i18next';


var sequences = [], trimestres = [];  

function ConfigSequence(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listSequences()
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
            headerName: 'Séquence',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'is_active',
            headerName: 'Actif?',
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params) => (
                params.value===true?
                <label>Yes</label>
                :
                <label>No</label>
            ),
        },
        {
            field: 'libelle_trimestre',
            headerName: 'Trimestre',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_trimestre',
            headerName: 'num',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_deb',
            headerName: 'Date Début',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_fin',
            headerName: 'Date Fin',
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

    function getConfigTitleColor(){
        switch(selectedTheme){
            case 'Theme1': return "#3ca015" ;
            case 'Theme2': return "#2358bb" ;
            case 'Theme3': return "#d11e5a" ;
            default: return "#3ca015" ;
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
        var seqs = { 
            id:0, 
            libelle:'',
            id_tr:'',
            date_deb:'',
            date_fin:'',
            is_active:false,
            numero:0,
        }

        seqs.id = document.getElementById('idSequence').value;
        seqs.libelle = document.getElementById('libelle').value;
        seqs.date_deb = document.getElementById('date_deb').value;
        seqs.date_fin = document.getElementById('date_fin').value;
        seqs.is_active = document.getElementById('is_active').checked;
        seqs.id_tr = document.getElementById('id_trimestre').value;
        console.log(document.getElementById('id_trimestre').value)
        return seqs;
    }

    function formDataCheck(sequ) {
        var errorMsg='';
        // if(sequ.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du trimestre !";
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
        inputs[1]= row.is_active;
        inputs[3]= row.id_trimestre;
        inputs[4]= row.date_deb;
        inputs[5]= row.date_fin;
        inputs[2]= row.id;
        inputs[6]= trimestres;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listSequences(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        sequences=[];
        trimestres=[];
        axiosInstance
        .post(`list-sequences/`,{id_sousetab: currentAppContext.currentEtab,
            id_trimestre:""}).then((res)=>{
            res.data.sequences.map((seq)=>{sequences.push(seq)});
            res.data.trimestres.map((t)=>{trimestres.push(t)});
            console.log(res.data);
            setGridRows(sequences);
        })  
    }


    function addNewSequence(seqInfo) {       
        //e.preventDefault();
        //var sequ = getFormData();
           console.log("A l'entree",seqInfo);
            sequences = [];
            trimestres = [];   
           
            axiosInstance.post(`create-sequence/`, {
                    id:seqInfo.id, 
                    libelle:seqInfo.libelle,
                    id_trimestre:seqInfo.id_tr,
                    date_deb:seqInfo.date_deb,
                    date_fin:seqInfo.date_fin,
                    is_active:seqInfo.is_active,
                    numero:0,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                res.data.sequences.map((seq)=>{sequences.push(seq)});
                res.data.trimestres.map((t)=>{trimestres.push(t)});
                setGridRows(sequences);
                ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifySequence(seqInfo) {
        //e.preventDefault();
        //var sequ = getFormData();
        //console.log(sequ);
            console.log("A l'entree",seqInfo);
            sequences = [];
            trimestres = [];
            axiosInstance.post(`update-sequence/`, {
                id:seqInfo.id, 
                libelle:seqInfo.libelle,
                id_trimestre:seqInfo.id_tr,
                date_deb:seqInfo.date_deb,
                date_fin:seqInfo.date_fin,
                is_active:seqInfo.is_active,
                numero:0,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                res.data.sequences.map((seq)=>{sequences.push(seq)});
                res.data.trimestres.map((t)=>{trimestres.push(t)});
                setGridRows(sequences);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la séquence selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            sequences = [];
            trimestres = [];
            axiosInstance
            .post(`delete-sequence/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                res.data.sequences.map((seq)=>{sequences.push(seq)});
                res.data.trimestres.map((t)=>{trimestres.push(t)});
                setGridRows(sequences);
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
                {t("gest_sequence")}
            </div>
            
            {(modalOpen!=0) && <AddSequence formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewSequence : modifySequence} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES SEQUENCES
                    </div>
                                
                    <div className={classes.gridAction}> 
                        <CustomButton
                            btnText='Ajouter' 
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
                                inputs[6]= trimestres;
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
export default ConfigSequence;