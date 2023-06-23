import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import {Grid, GridColumn} from "@progress/kendo-react-grid";

import AddEtab from "../modals/AddEtab";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var etablissements = [];  

function ConfigGen(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        // console.log(currentAppContext)
        listEtabs()
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
        //{ field: 'id', headerName: 'ID', width: 90, hide:true },
        {
            field: 'libelle',
            headerName: 'Nom Etablissement',
            width: 180,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'type_sousetab',
            headerName: 'Type Etab..',
            width: 140,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nom_fondateur',
            headerName: 'Fondateur',
            width: 140,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'tel',
            headerName: 'Telephone',
            width: 120,
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
                                //onClick={deleteRow}
                                alt=''
                            />
                        </div>
                    );
                    
                },
            },
        {
            field: 'date_creation',
            headerName: 'Date de Creation',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },        
        {
            field: 'devise',
            headerName: 'Devise',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'localisation',
            headerName: 'Localisation',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'bp',
            headerName: 'BP',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle

        },
        {
            field: 'langue',
            headerName: 'Langue',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'site_web',
            headerName: 'Site web',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'logo_url',
            headerName: 'Logo',
            width: 110,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },

        /*{
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },*/
      ];

    //   const rows = [
    //     { libelle: 'Lycee Leclerc', nom_fondateur: 'Jon Elomo', tel: '237 678 95 25 63',  id: 1 },
    //     { libelle: 'Lycee Joss', nom_fondateur: 'Ateba Bilayi', tel: '237 678 75 35 63',  id: 2 },
    //     { libelle: 'Lycee Akwa', nom_fondateur: 'Menyengue Simplice', tel: '237 675 60 35 63',id: 3 },
    //   ];

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
        document.getElementById('date_creation').value = ''
        document.getElementById('nom_fondateur').value = ''
        document.getElementById('localisation').value = ''
        document.getElementById('bp').value = ''
        document.getElementById('email').value = ''
        document.getElementById('tel').value = ''
        document.getElementById('devise').value = ''
        document.getElementById('site_web').value = ''

        document.getElementById('libelle').defaultValue = ''
        document.getElementById('date_creation').defaultValue = ''
        document.getElementById('nom_fondateur').defaultValue = ''
        document.getElementById('localisation').defaultValue = ''
        document.getElementById('bp').defaultValue = ''
        document.getElementById('email').defaultValue = ''
        document.getElementById('tel').defaultValue = ''
        document.getElementById('devise').defaultValue = ''
        document.getElementById('site_web').defaultValue = ''       
    }

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function getFormData(){
        var etablissement = { 
            id:0, 
            libelle:'',
            type_sousetab:'',
            date_creation:'',
            nom_fondateur:'',
            localisation:'',
            bp:'',
            email:'',
            tel:'',
            devise:'',
            logo:'',
            langue:'fr',
            site_web:'' 
        }
        let logoElt = document.getElementById('logo')
        if (document.getElementById('logo') !== null)
            etablissement.logo = document.getElementById('logo').src;
        console.log("logo:",document.getElementById('logo'))
        etablissement.id = document.getElementById('idEtab').value;
        etablissement.type_sousetab = document.getElementById('typeSousetab').value;
        etablissement.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        etablissement.date_creation = (document.getElementById('date_creation').value !='') ? putToEmptyStringIfUndefined(document.getElementById('date_creation').value).trim() : putToEmptyStringIfUndefined(document.getElementById('date_creation').defaultValue).trim();
        etablissement.nom_fondateur = (document.getElementById('nom_fondateur').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nom_fondateur').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nom_fondateur').defaultValue).trim();
        etablissement.localisation = (document.getElementById('localisation').value != '') ? putToEmptyStringIfUndefined(document.getElementById('localisation').value).trim() : putToEmptyStringIfUndefined(document.getElementById('localisation').defaultValue).trim();
        etablissement.bp = (document.getElementById('bp').value != '') ? putToEmptyStringIfUndefined(document.getElementById('bp').value).trim() : putToEmptyStringIfUndefined(document.getElementById('bp').defaultValue).trim();
        etablissement.email = (document.getElementById('email').value != '') ? putToEmptyStringIfUndefined(document.getElementById('email').value).trim() : putToEmptyStringIfUndefined(document.getElementById('email').defaultValue).trim();
        etablissement.tel = (document.getElementById('tel').value != '' ) ? putToEmptyStringIfUndefined(document.getElementById('tel').value).trim() : putToEmptyStringIfUndefined(document.getElementById('tel').defaultValue).trim();
        etablissement.devise = (document.getElementById('devise').value != '') ? putToEmptyStringIfUndefined(document.getElementById('devise').value).trim() : putToEmptyStringIfUndefined(document.getElementById('devise').defaultValue).trim();
        etablissement.langue= document.getElementById('codeLangue').value;
        etablissement.site_web = (document.getElementById('site_web').value != '') ? putToEmptyStringIfUndefined(document.getElementById('site_web').value).trim() : putToEmptyStringIfUndefined(document.getElementById('site_web').defaultValue).trim();        
        return etablissement;
    }

    function formDataCheck(etablismnt) {
        var errorMsg='';
        if(etablismnt.libelle.length == 0){
            errorMsg="Veuillez entrer le Nom de l'etablissement !";
            return errorMsg;
        }

        if (etablismnt.nom_fondateur == 0) {
            errorMsg="Veuillez entrer le Nom du fondateur de l'etablissement !";
            return errorMsg;
        }

        if(etablismnt.date_creation.length == 0) {
            errorMsg="Veuillez entrer une date de creation valide !";
            return errorMsg;
        } 

        if(!((isNaN(etablismnt.date_creation) && (!isNaN(Date.parse(etablismnt.date_creation)))))){
            errorMsg="Veuillez entrer une date de creation valide !";
            return errorMsg;
        }

        if(etablismnt.email.length != 0 && !etablismnt.email.includes('@')){
            errorMsg="Veuillez entrer une adresse mail valide !";
            return errorMsg;
        }    
        
        if(etablismnt.site_web.length != 0 && etablismnt.site_web.indexOf('www.')!=0){
            errorMsg="Veuillez entrer un nom de site web  valide !";
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
        inputs[0]= row.libelle;
        inputs[1]= row.date_creation;
        inputs[2]= row.nom_fondateur;
        inputs[3]= row.devise;
        inputs[4]= row.localisation;
        inputs[5]= row.bp;
        inputs[6]= row.email;
        inputs[7]= row.tel;
        inputs[8]= row.langue;
        inputs[9]= row.site_web;
        inputs[10]= row.id;
        inputs[11]= row.logo_url;
        inputs[12]= row.type_sousetab;
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listEtabs(){
        etablissements=[];
        axiosInstance
        .post(`list-sousetabs/`,{id_annee: currentAppContext.currentYear}).then((res)=>{
            res.data.map((etab)=>{etablissements.push(etab)});
            setGridRows(etablissements);
            console.log(etablissements);
        })  
    }


    function addNewEtab(e) {       
        e.preventDefault();
        var etablismnt = getFormData();
       // console.log(etablismnt);

        if (formDataCheck(etablismnt).length==0) {                        
            axiosInstance.post(`create-sousetab/`, {
                    libelle: etablismnt.libelle,
                    type_sousetab: etablismnt.type_sousetab,
                    date_creation: etablismnt.date_creation,
                    nom_fondateur:  etablismnt.nom_fondateur,
                    localisation: etablismnt.localisation,
                    bp: etablismnt.bp,
                    email: etablismnt.email,
                    tel: etablismnt.tel,
                    devise: etablismnt.devise,
                    logo: etablismnt.logo,
                    langue: etablismnt.langue,
                    site_web: etablismnt.site_web,
                    id_annee: currentAppContext.currentYear
            }).then((res)=>{
                console.log(res.data);
                etablissements = []
                res.data.etabs.map((etab)=>{etablissements.push(etab)});
                setGridRows(etablissements);
                ClearForm();
                setModalOpen(0);
            }) 
            
        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(etablismnt);
        }
        
    }
    
    function modifyEtab(e) {
        e.preventDefault();
        var etablismnt = getFormData();
        console.log(etablismnt);
     
        if (formDataCheck(etablismnt).length==0) { 
            axiosInstance.post(`update-sousetab/`, {
                id: etablismnt.id,
                libelle: etablismnt.libelle,
                type_sousetab: etablismnt.type_sousetab,
                date_creation: etablismnt.date_creation,
                nom_fondateur:  etablismnt.nom_fondateur,
                localisation: etablismnt.localisation,
                bp: etablismnt.bp,
                email: etablismnt.email,
                tel: etablismnt.tel,
                devise: etablismnt.devise,
                logo: etablismnt.logo,
                langue: etablismnt.langue,
                site_web: etablismnt.site_web,
                id_annee: currentAppContext.currentYear
            }).then((res)=>{
                console.log(res.data);
                etablissements = []
                res.data.etabs.map((etab)=>{etablissements.push(etab)});
                setGridRows(etablissements);
                ClearForm();
                setModalOpen(0);
            })          

        } else {
            var errorDiv = document.getElementById('errMsgPlaceHolder');
            errorDiv.className = classes.errorMsg;
            errorDiv.textContent = formDataCheck(etablismnt);
        }
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-sousetab/`, {
                id:rowId,
                id_annee: currentAppContext.currentYear
            }).then((res)=>{
                console.log(res.data.status)
                etablissements = []
                res.data.etabs.map((etab)=>{etablissements.push(etab)});
                setGridRows(etablissements);
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
            {(modalOpen!=0) && <AddEtab formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewEtab : modifyEtab} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES ETABLISSEMENTS
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
                        onCellClick={handleDeleteRow}
                        onRowClick={(params,event)=>{
                            if(event.ignore) {
                                //console.log(params.row);
                                handleEditRow(params.row)
                            }
                        }}                
                        
                        //loading={loading}
                        //{...data}
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
export default ConfigGen;