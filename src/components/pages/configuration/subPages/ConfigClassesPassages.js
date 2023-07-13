import React from 'react';
import classess from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddClassesPassages from "../modals/AddClassesPassages";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var classes = [];  

function ConfigClassesPassages(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listClasses()
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
            headerName: 'Libelle',
            width: 100,
            editable: false,
            headerClassName:classess.GridColumnStyle
        },
        {
            field: 'libelle_classes_passage_possibles',
            headerName: 'Classes de passage Possibles',
            width: 200,
            editable: false,
            headerClassName:classess.GridColumnStyle
        },
        {
            field: 'libelle_classes_passage_disponibles',
            headerName: 'libelle_classes_passage_disponibles',
            width: 200,
            hide: true,
            headerClassName:classess.GridColumnStyle
        },
        {
            field: 'id_classes_passage_disponibles',
            headerName: 'id_classes_passage_disponibles',
            width: 200,
            hide: true,
            headerClassName:classess.GridColumnStyle
        },
        {
            field: 'id_classes_suivantes',
            headerName: 'id_classes_suivantes',
            width: 200,
            hide: true,
            headerClassName:classess.GridColumnStyle
        },
        
        {
            field: 'modif',
            headerName: '',
            width: 33,
            editable: false,
            headerClassName:classess.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classess.inputRow}>
                        <img src="icons/baseline_edit.png"  
                            width={20} 
                            height={20} 
                            className={classess.cellPointer} 
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
            //     headerClassName:classess.GridColumnStyle,
            //     renderCell: (params)=>{
            //         return(
            //             <div className={classess.inputRow}>
            //                 <img src="icons/baseline_delete.png"  
            //                     width={20} 
            //                     height={20} 
            //                     className={classess.cellPointer} 
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
        case 'Theme1': return classess.Theme1_Btnstyle ;
        case 'Theme2': return classess.Theme2_Btnstyle ;
        case 'Theme3': return classess.Theme3_Btnstyle ;
        default: return classess.Theme1_Btnstyle ;
      }
    }

    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classess.Theme1_BtnstyleSmall ;
        case 'Theme2': return classess.Theme2_BtnstyleSmall ;
        case 'Theme3': return classess.Theme3_BtnstyleSmall ;
        default: return classess.Theme1_BtnstyleSmall ;
      }
    }
    
/*************************** Handler functions ***************************/
    function ClearForm(){        
        // var errorDiv = document.getElementById('errMsgPlaceHolder');
        // errorDiv.className = null;
        // errorDiv.textContent ='';

        // document.getElementById('libelle').value = ''

        // document.getElementById('libelle').defaultValue = ''   
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var clss = { 
            id:0, 
            id_classes_possibles:'',
        }

        clss.id = document.getElementById('idClasse').value;

        let els = document.querySelectorAll('[checkbox]');
        let n = els.length;
        let items = "";
        for(let i=0;i<n;i++){
            if(els[i].checked){
                let id = (els[i].id).replace("checkbox_","");
                items+=id+","
            }
        }
        clss.id_classes_possibles = items;

        return clss;
    }

    function formDataCheck(clas) {
        // var errorMsg='';
        // if(clas.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé !";
        //     return errorMsg;
        // }       
        // return errorMsg;
    }
    
    function handleDeleteRow(params){
        if(params.field=='id'){
            deleteRow(params.id)            
        }
    }

    function handleEditRow(row){       
        var inputs=[];
        // fields = ["id","libelle","description","duree_sanction_unit","eleve_a_supprimer","duree"]

        inputs[0]= row.libelle;
        inputs[1]= row.id_classes_suivantes;
        inputs[2]= row.id;
        inputs[3]= row.id_classes_passage_disponibles;
        inputs[4]= row.libelle_classes_passage_disponibles;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listClasses(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        classes=[];
        axiosInstance
        .post(`list-classes-prochaines/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.res.map((classe)=>{classes.push(classe)});
            console.log(classes);
            setGridRows(classes);
        })  
    }


    function addNewCycle(e) {       
        e.preventDefault();
        var clas = getFormData();
        console.log(clas)
        if (formDataCheck(clas).length==0) {                        
            axiosInstance.post(`create-type-sanction/`, {
                    libelle: clas.libelle,
                    description: clas.description,
                    type_duree: clas.type_duree,
                    duree: clas.duree,
                    exclusion_definitive: clas.exclusion_definitive,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                classes = []
                res.data.res.map((classe)=>{classes.push(classe)});
                setGridRows(classes);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classess.errorMsg;
            errorDiv.textContent = formDataCheck(clas);
        }
        
    }
    
    function modifyCycle(e) {
        e.preventDefault();
        var clas = getFormData();
        console.log(clas);
     
            axiosInstance.post(`set-classes-prochaines/`, {
                id_classe: clas.id,
                id_classes_possibles: clas.id_classes_possibles,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                classes = []
                res.data.res.map((classe)=>{classes.push(classe)});
                setGridRows(classes);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-type-sanction/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                classes = []
                res.data.res.map((classe)=>{classes.push(classe)});
                setGridRows(classes);
            })              
        }
    } 
    function quitForm() {
        ClearForm();
        setModalOpen(0)
    }
   

    /********************************** JSX Code **********************************/   
    return (
        <div className={classess.formStyle}>
            {(modalOpen!=0) && <AddClassesPassages formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewCycle : modifyCycle} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classess.gridTitleRow}> 
                    <div className={classess.gridTitle}>
                        LISTE DES CLASSES POUR L'ANNEE PROCHAINE
                    </div>
                                
                    {/* <div className={classess.gridAction}> 
                        <CustomButton
                            btnText='+' 
                            buttonStyle={getButtonStyle()}
                            btnTextStyle = {classess.btnTextStyle}
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
                        getCellClassName={(params) => (params.field==='libelle')? classess.gridMainRowStyle : classess.gridRowStyle }
                        onCellClick={handleDeleteRow}
                        onRowClick={(params,event)=>{
                            if(event.ignore) {
                                handleEditRow(params.row)
                            }
                        }}                
                        getRowClassName={(params) =>
                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even ' + classess.gridRowStyle : 'odd '+ classess.gridRowStyle
                        }
                    />
                </div>
                :
                null
            }
         
        </div>
        
    );
} 
export default ConfigClassesPassages;