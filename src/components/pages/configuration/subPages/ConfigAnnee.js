import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddAnnee from "../modals/AddAnnee";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var configs = [];  

function ConfigAnnee(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listConfigAnnees()
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
            field: 'date_deb',
            headerName: 'Date Début',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_fin',
            headerName: 'date_fin',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'duree_periode',
            headerName: "Durée d'une Période",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nombre_trimestres',
            headerName: "# Trimestres",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nombre_sequences',
            headerName: "# Séquences",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'notation_sur',
            headerName: "Notation sur",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'has_group_matiere',
            headerName: "Matières Classées en groupe",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'appellation_bulletin',
            headerName: "Appellation des bulletins",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'utilise_coef',
            headerName: "Utilisation des coefs",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'appellation_coef',
            headerName: "Appellation Coefs",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'appellation_apprenant',
            headerName: "Appellation Elève",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'appellation_formateur',
            headerName: "Appellation Formateur",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'appellation_sequence',
            headerName: "Appellation Séquence",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'appellation_module',
            headerName: "Appellation Module",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'appellation_chapitre',
            headerName: "Appellation Chapitre",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'appellation_lecon',
            headerName: "Appellation Leçon",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'abbreviation_module',
            headerName: "Abbréviation module",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'abbreviation_chapitre',
            headerName: "Abbréviation Chapitre",
            width: 180,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'abbreviation_lecon',
            headerName: "Abbréviation Leçon",
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
        var configs = { 
            id:0,        
            date_deb:"",
            date_fin:"",
            duree_periode:"",
            nombre_trimestres:"",
            nombre_sequences:"",
            notation_sur:"",
            has_group_matiere:"",
            appellation_bulletin:"",
            utilise_coef:"",
            appellation_coef:"",
            appellation_apprenant:"",
            appellation_formateur:"",
            appellation_sequence:"",
            appellation_module:"",
            appellation_chapitre:"",
            appellation_lecon:"",
            abbreviation_module:"",
            abbreviation_chapitre:"",
            abbreviation_lecon:"",
        }

        configs.date_deb = (document.getElementById('date_deb').value !='') ? putToEmptyStringIfUndefined(document.getElementById('date_deb').value).trim() : putToEmptyStringIfUndefined(document.getElementById('date_deb').defaultValue).trim();
        configs.date_fin = (document.getElementById('date_fin').value !='') ? putToEmptyStringIfUndefined(document.getElementById('date_fin').value).trim() : putToEmptyStringIfUndefined(document.getElementById('date_fin').defaultValue).trim();       
        configs.duree_periode = (document.getElementById('duree_periode').value !='') ? putToEmptyStringIfUndefined(document.getElementById('duree_periode').value).trim() : putToEmptyStringIfUndefined(document.getElementById('duree_periode').defaultValue).trim();       
        configs.nombre_trimestres = (document.getElementById('nombre_trimestres').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nombre_trimestres').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nombre_trimestres').defaultValue).trim();       
        configs.nombre_sequences = (document.getElementById('nombre_sequences').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nombre_sequences').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nombre_sequences').defaultValue).trim();       
        configs.notation_sur = (document.getElementById('notation_sur').value !='') ? putToEmptyStringIfUndefined(document.getElementById('notation_sur').value).trim() : putToEmptyStringIfUndefined(document.getElementById('notation_sur').defaultValue).trim();       
        // configs.has_group_matiere = (document.getElementById('has_group_matiere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('has_group_matiere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('has_group_matiere').defaultValue).trim();       
        configs.appellation_bulletin = (document.getElementById('appellation_bulletin').value !='') ? putToEmptyStringIfUndefined(document.getElementById('appellation_bulletin').value).trim() : putToEmptyStringIfUndefined(document.getElementById('appellation_bulletin').defaultValue).trim();       
        // configs.utilise_coef = (document.getElementById('utilise_coef').value !='') ? putToEmptyStringIfUndefined(document.getElementById('utilise_coef').value).trim() : putToEmptyStringIfUndefined(document.getElementById('utilise_coef').defaultValue).trim();       
        configs.appellation_coef = (document.getElementById('appellation_coef').value !='') ? putToEmptyStringIfUndefined(document.getElementById('appellation_coef').value).trim() : putToEmptyStringIfUndefined(document.getElementById('appellation_coef').defaultValue).trim();       
        configs.appellation_apprenant = (document.getElementById('appellation_apprenant').value !='') ? putToEmptyStringIfUndefined(document.getElementById('appellation_apprenant').value).trim() : putToEmptyStringIfUndefined(document.getElementById('appellation_apprenant').defaultValue).trim();       
        configs.appellation_formateur = (document.getElementById('appellation_formateur').value !='') ? putToEmptyStringIfUndefined(document.getElementById('appellation_formateur').value).trim() : putToEmptyStringIfUndefined(document.getElementById('appellation_formateur').defaultValue).trim();       
        configs.appellation_sequence = (document.getElementById('appellation_sequence').value !='') ? putToEmptyStringIfUndefined(document.getElementById('appellation_sequence').value).trim() : putToEmptyStringIfUndefined(document.getElementById('appellation_sequence').defaultValue).trim();       
        configs.appellation_module = (document.getElementById('appellation_module').value !='') ? putToEmptyStringIfUndefined(document.getElementById('appellation_module').value).trim() : putToEmptyStringIfUndefined(document.getElementById('appellation_module').defaultValue).trim();       
        configs.appellation_chapitre = (document.getElementById('appellation_chapitre').value !='') ? putToEmptyStringIfUndefined(document.getElementById('appellation_chapitre').value).trim() : putToEmptyStringIfUndefined(document.getElementById('appellation_chapitre').defaultValue).trim();       
        configs.appellation_lecon = (document.getElementById('appellation_lecon').value !='') ? putToEmptyStringIfUndefined(document.getElementById('appellation_lecon').value).trim() : putToEmptyStringIfUndefined(document.getElementById('appellation_lecon').defaultValue).trim();       
        configs.abbreviation_module = (document.getElementById('abbreviation_module').value !='') ? putToEmptyStringIfUndefined(document.getElementById('abbreviation_module').value).trim() : putToEmptyStringIfUndefined(document.getElementById('abbreviation_module').defaultValue).trim();       
        configs.abbreviation_chapitre = (document.getElementById('abbreviation_chapitre').value !='') ? putToEmptyStringIfUndefined(document.getElementById('abbreviation_chapitre').value).trim() : putToEmptyStringIfUndefined(document.getElementById('abbreviation_chapitre').defaultValue).trim();       
        configs.abbreviation_lecon = (document.getElementById('abbreviation_lecon').value !='') ? putToEmptyStringIfUndefined(document.getElementById('abbreviation_lecon').value).trim() : putToEmptyStringIfUndefined(document.getElementById('abbreviation_lecon').defaultValue).trim();       
        configs.utilise_coef = document.getElementById('utilise_coef').value;
        configs.has_group_matiere = document.getElementById('has_group_matiere').value;
        configs.id = document.getElementById('idEtab').value;
        return configs;
    }

    function formDataCheck(conf) {
        var errorMsg='';
        // if(conf.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du config !";
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
        inputs[0]= row.date_deb;
        inputs[1]= row.date_fin;
        inputs[2]= row.duree_periode;
        inputs[3]= row.nombre_trimestres;
        inputs[4]= row.nombre_sequences;
        inputs[5]= row.notation_sur;
        inputs[6]= row.has_group_matiere;
        inputs[7]= row.appellation_bulletin;
        inputs[8]= row.utilise_coef;
        inputs[9]= row.appellation_coef;
        inputs[10]= row.appellation_apprenant;
        inputs[11]= row.appellation_formateur;
        inputs[12]= row.appellation_sequence;
        inputs[13]= row.appellation_module;
        inputs[14]= row.appellation_chapitre;
        inputs[15]= row.appellation_lecon;
        inputs[16]= row.abbreviation_module;
        inputs[17]= row.abbreviation_chapitre;
        inputs[18]= row.abbreviation_lecon;
        inputs[19]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listConfigAnnees(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        configs=[];
        axiosInstance
        .post(`list-config-annee/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((config)=>{configs.push(config)});
            console.log(configs);
            setGridRows(configs);
        })  
    }


    function addNewCycle(e) {       
        e.preventDefault();
        var conf = getFormData();

        if (formDataCheck(conf).length==0) {                        
            axiosInstance.post(`create-config-annee/`, {
                    libelle: conf.libelle,
                    code: conf.code,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                configs = []
                res.data.configs.map((config)=>{configs.push(config)});
                setGridRows(configs);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(conf);
        }
        
    }
    
    function modifyConfigAnnee(e) {
        e.preventDefault();
        var conf = getFormData();
        console.log(conf);
     
        if (formDataCheck(conf).length==0) { 
            axiosInstance.post(`create-config-annee/`, {
                id_sousetab:conf.id,        
                date_deb:conf.date_deb,
                date_fin:conf.date_fin,
                duree_periode:conf.duree_periode,
                nombre_trimestres:conf.nombre_trimestres,
                nombre_sequences:conf.nombre_sequences,
                notation_sur:conf.notation_sur,
                has_group_matiere:conf.has_group_matiere,
                appellation_bulletin:conf.appellation_bulletin,
                utilise_coef:conf.utilise_coef,
                appellation_coef:conf.appellation_coef,
                appellation_apprenant:conf.appellation_apprenant,
                appellation_formateur:conf.appellation_formateur,
                appellation_sequence:conf.appellation_sequence,
                appellation_module:conf.appellation_module,
                appellation_chapitre:conf.appellation_chapitre,
                appellation_lecon:conf.appellation_lecon,
                abbreviation_module:conf.abbreviation_module,
                abbreviation_chapitre:conf.abbreviation_chapitre,
                abbreviation_lecon:conf.abbreviation_lecon,
                operation:"update"
            }).then((res)=>{
                console.log(res.data);
                configs = []
                res.data.configs.map((config)=>{configs.push(config)});
                setGridRows(configs);
                ClearForm();
                setModalOpen(0);
            })          

        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(conf);
        }
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-config-annee/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                configs = []
                res.data.configs.map((config)=>{configs.push(config)});
                setGridRows(configs);
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
            {(modalOpen!=0) && <AddAnnee formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewCycle : modifyConfigAnnee} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        CONFIGURATIONS
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
export default ConfigAnnee;