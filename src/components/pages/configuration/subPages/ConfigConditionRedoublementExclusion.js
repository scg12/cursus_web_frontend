import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddConditionRedoublementExclusion from "../modals/AddConditionRedoublementExclusion";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';


var conditions = [];  

function ConfigConditionRedoublementExclusion(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listCycles()
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
            field: 'niveau',
            headerName: 'Niveau',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_niveau',
            headerName: 'id_Niveau',
            width: 50,
            hide: true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'moyenne_passage_min',
            headerName: 'moyenne_passage_min',
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'age',
            headerName: 'Age Max',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'heure_nj_max',
            headerName: 'Heure absence Max',
            width: 130,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nbjours_exclusion_max',
            headerName: 'Nombre Jour Exclusion Max',
            width: 130,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'moyenne_min',
            headerName: 'Moyenne Min',
            width: 130,
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
   
    
/*************************** Handler functions ***************************/
    function ClearForm(){        
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        errorDiv.className = null;
        errorDiv.textContent ='';

        document.getElementById('niveau').value = ''
        document.getElementById('age').value = ''
        document.getElementById('heure').value = ''
        document.getElementById('jour_exclusion').value = ''
        document.getElementById('moyenne').value = ''

        document.getElementById('niveau').defaultValue = ''
        document.getElementById('age').defaultValue = ''   
        document.getElementById('heure').defaultValue = ''
        document.getElementById('jour_exclusion').defaultValue = ''
        document.getElementById('moyenne').defaultValue = ''   
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var conditions = { 
            id:0, 
            niveau:'',
            age:0,
            heure:0, 
            jour_exclusion:0,
            moyenne:0,
            moyenne_passage:0,
        }
        conditions.niveau = document.getElementById('niveau').value;
        console.log("conditions.niveau: ",conditions.niveau)

        conditions.age = (document.getElementById('age').value !='') ? putToEmptyStringIfUndefined(document.getElementById('age').value).trim() : putToEmptyStringIfUndefined(document.getElementById('age').defaultValue).trim();       
        conditions.heure = (document.getElementById('heure').value !='') ? putToEmptyStringIfUndefined(document.getElementById('heure').value).trim() : putToEmptyStringIfUndefined(document.getElementById('heure').defaultValue).trim();
        conditions.jour_exclusion = (document.getElementById('jour_exclusion').value !='') ? putToEmptyStringIfUndefined(document.getElementById('jour_exclusion').value).trim() : putToEmptyStringIfUndefined(document.getElementById('jour_exclusion').defaultValue).trim();
        conditions.moyenne = (document.getElementById('moyenne').value !='') ? putToEmptyStringIfUndefined(document.getElementById('moyenne').value).trim() : putToEmptyStringIfUndefined(document.getElementById('moyenne').defaultValue).trim();
        conditions.moyenne_passage = (document.getElementById('moyenne_passage').value !='') ? putToEmptyStringIfUndefined(document.getElementById('moyenne_passage').value).trim() : putToEmptyStringIfUndefined(document.getElementById('moyenne_passage').defaultValue).trim();
        conditions.id = document.getElementById('idCondition').value;
        return conditions;
    }

    function formDataCheck(cnd) {
        var errorMsg='';
        if(cnd.niveau.length == 0){
            errorMsg="Veuillez entrer le libellé !";
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
        inputs[0]= row.niveau;
        inputs[1]= row.age;
        inputs[2]= row.heure_nj_max;
        inputs[3]= row.nbjours_exclusion_max;
        inputs[4]= row.moyenne_min;
        inputs[5]= row.id;
        inputs[6]= row.id_niveau;
        inputs[7]= row.moyenne_passage_min;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listCycles(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        conditions=[];
        axiosInstance
        .post(`list-conditions-redoubblement-exclu/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.res.map((cond)=>{conditions.push(cond)});
            console.log(conditions);
            setGridRows(conditions);
        })  
    }


    function addNewCycle(e) {       
        e.preventDefault();
        var cnd = getFormData();
        
        if (formDataCheck(cnd).length==0) {                        
            axiosInstance.post(`create-condition-redoubblement-exclu/`, {
                    niveau: cnd.niveau,
                    age: cnd.age,
                    moyenne_passage: cnd.moyenne_passage,
                    heure: cnd.heure,
                    jour_exclusion: cnd.jour_exclusion,
                    moyenne: cnd.moyenne,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                conditions = []
                res.data.conditions.map((cond)=>{conditions.push(cond)});
                setGridRows(conditions);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(cnd);
        }
        
    }
    
    function modifyCycle(e) {
        e.preventDefault();
        var cnd = getFormData();
        console.log(cnd);
     
        if (formDataCheck(cnd).length==0) { 
            axiosInstance.post(`update-condition-redoubblement-exclu/`, {
                id: cnd.id,
                niveau: cnd.niveau,
                age: cnd.age,
                moyenne_passage: cnd.moyenne_passage,
                heure: cnd.heure,
                jour_exclusion: cnd.jour_exclusion,
                moyenne: cnd.moyenne,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                conditions = []
                res.data.conditions.map((cond)=>{conditions.push(cond)});
                setGridRows(conditions);
                ClearForm();
                setModalOpen(0);
            })          

        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(cnd);
        }
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-condition-redoubblement-exclu/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                conditions = []
                res.data.conditions.map((cond)=>{conditions.push(cond)});
                setGridRows(conditions);
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
                {t("redoublmnt_cond")}
            </div>
            
            {(modalOpen!=0) && <AddConditionRedoublementExclusion formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewCycle : modifyCycle} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        CONDITION DE REDOUBLEMENT EXCLUSION DEFINITIVE
                    </div>
                                
                    <div className={classes.gridAction}> 
                        <CustomButton
                            btnText={t('add')} 
                            buttonStyle={getButtonStyle()}
                            btnTextStyle = {classes.btnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(modalOpen==1||modalOpen==2)} 
                            style={{marginLeft:"1vw"}}  
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
                        getCellClassName={(params) => (params.field==='niveau')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default ConfigConditionRedoublementExclusion;