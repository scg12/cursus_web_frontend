import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddPayementEleve from "../modals/AddPayementEleve";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var payements = [];  

function ConfigPayementEleve(props) {
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
            field: 'classe',
            headerName: 'Classe',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'total',
            headerName: 'Total',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'info_tranches',
            headerName: 'infos',
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
        var payements = { 
            id:0, 
            libelles:'',
            montants:'',
            date_debs:'', 
            date_fins:'',
            tranches_a_delete:""
        }

        payements.id = document.getElementById('idClasse').value;
        let els = document.querySelectorAll('[libelle]');
        let n = els.length;
        let items = "²²";
        for(let i=0;i<n;i++){
            let id = (els[i].id).replace("libelle_","");
            items+=id+","+els[i].value+"²²"
        }
        payements.libelles = items

        els = document.querySelectorAll('[montant]');
        items = "²²";
        for(let i=0;i<n;i++){
            let id = (els[i].id).replace("montant_","");
            items+=id+","+els[i].value+"²²"
        }
        payements.montants = items

        els = document.querySelectorAll('[deb]');
        items = "²²";
        for(let i=0;i<n;i++){
            let id = (els[i].id).replace("deb_","");
            items+=id+","+els[i].value+"²²"
        }
        payements.date_debs = items

        els = document.querySelectorAll('[fin]');
        items = "²²";
        for(let i=0;i<n;i++){
            let id = (els[i].id).replace("fin_","");
            items+=id+","+els[i].value+"²²"
        }
        payements.date_fins = items

        els = document.querySelectorAll('[checkbox]');
        items = "²²";
        for(let i=0;i<n;i++){
            if(els[i].checked){
                let id = (els[i].id).replace("checkbox_","");
                items+=id+"²²"
            }
        }
        payements.tranches_a_delete = items

        return payements;
    }

    function formDataCheck(payemt) {
        var errorMsg='';
        if(payemt.libelle.length == 0){
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
        inputs[0]= row.classe;
        inputs[1]= row.info_tranches;
        inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listPayements(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        payements=[];
        axiosInstance
        .post(`list-type-payement-eleve/`,{id_sousetab: currentAppContext.currentEtab,
            id_cycle:"",
            id_niveau:"",
            id_classes:""}).then((res)=>{
            res.data.map((payement)=>{payements.push(payement)});
            console.log(payements);
            setGridRows(payements);
        })  
    }


    function addNewPayement(e) {       
        e.preventDefault();
        // var payemt = getFormData();
        var payements = {
            id_cycle:0,
            id_niveau:0,
            id_classe:0, 
            libelle:"",
            montant:0,
            date_deb:'',
            date_fin:'',
            id_sousetab:currentAppContext.currentEtab
        }
        payements.id_cycle = document.getElementById('id_cycle').value;
        payements.id_niveau = document.getElementById('id_niveau').value;
        payements.id_classe = document.getElementById('id_classe').value;
        payements.libelle = document.getElementById('libelle').value;
        payements.montant = document.getElementById('montant').value;
        payements.date_deb = document.getElementById('date_deb').value;
        payements.date_fin = document.getElementById('date_fin').value;
        
        console.log(payements)
            axiosInstance.post(`create-type-payement-eleve/`, {
                id_cycle : payements.id_cycle,
                id_niveau : payements.id_niveau,
                id_classe :payements.id_classe,
                libelle :payements.libelle,
                montant :payements.montant,
                date_deb :payements.date_deb,
                date_fin :payements.date_fin,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                payements = []
                res.data.payements.map((payement)=>{payements.push(payement)});
                setGridRows(payements);
                ClearForm();
                setModalOpen(0);
            }) 
            
        
    }
    
    function modifyPayement(e) {
        e.preventDefault();
        var payemt = getFormData();
        console.log(payemt);
     

            axiosInstance.post(`update-type-payement-eleve/`, {
                id_classe:payemt.id, 
                libelles:payemt.libelles,
                montants:payemt.montants,
                date_debs:payemt.date_debs, 
                date_fins:payemt.date_debs,
                tranches_a_delete:payemt.tranches_a_delete,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                payements = []
                res.data.payements.map((payement)=>{payements.push(payement)});
                setGridRows(payements);
                ClearForm();
                setModalOpen(0);
            })          

    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer le payement selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-type-payement-eleve/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                payements = []
                res.data.payements.map((payement)=>{payements.push(payement)});
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
            {(modalOpen!=0) && <AddPayementEleve formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewPayement : modifyPayement} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES TYPES DE PAYEMENTS ELEVES
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
                        getCellClassName={(params) => (params.field==='classe')? classes.gridMainRowStyle : classes.gridRowStyle }
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
export default ConfigPayementEleve;