import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddUser from "../modals/AddUser";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';


var users = [],adminstaffs=[],infos="";  

function ConfigUser(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        listUsers()
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
            width: 130,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'prenom',
            headerName: 'Prénom',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'login',
            headerName: 'login',
            width: 120,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'pwd',
            headerName: 'num2',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'sexe',
            headerName: 'Sexe',
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'tel1',
            headerName: 'Tel1',
            width: 150,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'tel2',
            headerName: 'Tel2',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_entree',
            headerName: 'Date Entree',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_sortie',
            headerName: 'Date Sortie',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'email',
            headerName: 'email',
            width: 100,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id_responsabilites',
            headerName: 'num',
            width: 50,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'is_enseignant',
            headerName: 'Enseignant?',
            width: 90,
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
        var users = { 
            id:0, 
            nom:'',
            code:'' 
        }

        // users.nom = (document.getElementById('nom').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nom').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nom').defaultValue).trim();
        // users.code = (document.getElementById('code').value !='') ? putToEmptyStringIfUndefined(document.getElementById('code').value).trim() : putToEmptyStringIfUndefined(document.getElementById('code').defaultValue).trim();       
        // users.id = document.getElementById('idCycle').value;
        return users;
    }

    function formDataCheck(usr) {
        var errorMsg='';
        // if(usr.nom.length == 0){
        //     errorMsg="Veuillez entrer le libellé du cycle !";
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
        console.log("id_reponsabilites: ",row.id_responsabilites)  
        var inputs=[];
        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[3]= row.id_responsabilites;
        inputs[4]= row.is_enseignant;
        inputs[5]= adminstaffs;
        inputs[6]= row.login;
        inputs[7]= row.pwd;
        inputs[8]= row.sexe;
        inputs[9]= row.date_entree;
        inputs[10]= row.date_sortie;
        inputs[11]= row.tel1;
        inputs[12]= row.tel2;
        inputs[13]= row.is_enseignant;
        inputs[14]= row.is_active;
        inputs[15]= row.email;
        inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listUsers(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        users=[];
        adminstaffs=[];
        axiosInstance
        .post(`list-user-roles/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.res.map((user)=>{users.push(user)});
            res.data.adminstaffs.map((ad)=>{adminstaffs.push(ad)});
            console.log(users);
            setGridRows(users);
        })  
    }


    function addNewUser(e) {       
        e.preventDefault();
        // var usr = getFormData();
        let n = adminstaffs.length;
        let items,el    ;
        infos = "";
        for(let i=0;i<n;i++){
            el = document.getElementById(`checkbox_${adminstaffs[i].id}`);
            console.log(el.id);
            let current;
            if (el.checked){
            infos+="²²"+adminstaffs[i].id+":";
              items = document.querySelectorAll(`[checkbox=checkbox_${adminstaffs[i].id}]`);
              let nb = items.length;
              for(let j=0;j<nb;j++)
              {
                if(items[j].checked){
                    current = (items[j].id).replace("classe_","")
                     infos+=current+","
                }
              }

            }
        }
        console.log(infos)
        console.log(document.getElementById('checkbox_ens').checked);
                        
            axiosInstance.post(`create-user/`, {
                    infos: infos,
                    login:document.getElementById('login').value,
                    pwd:document.getElementById('pwd1').value,
                    nom:document.getElementById('nom').value,
                    prenom:document.getElementById('prenom').value,
                    email:document.getElementById('email').value,
                    sexe:document.getElementById('sexe').value,
                    date_entree:document.getElementById('date_entree').value,
                    date_sortie:document.getElementById('date_sortie').value,
                    tel1:document.getElementById('tel1').value,
                    tel2:document.getElementById('tel2').value,
                    is_enseignant:document.getElementById('checkbox_ens').checked,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                users = [];
                adminstaffs = [];
                res.data.res.map((user)=>{users.push(user)});
                res.data.adminstaffs.map((ad)=>{adminstaffs.push(ad)});

                setGridRows(users);
                ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifyUSer(e) {
        e.preventDefault();
        let n = adminstaffs.length;
        let items,el    ;
        infos = "";
        for(let i=0;i<n;i++){
            el = document.getElementById(`checkbox_${adminstaffs[i].id}`);
            console.log(el.id);
            let current;
            if (el.checked){
            infos+="²²"+adminstaffs[i].id+":";
              items = document.querySelectorAll(`[checkbox=checkbox_${adminstaffs[i].id}]`);
              let nb = items.length;
              for(let j=0;j<nb;j++)
              {
                if(items[j].checked){
                    current = (items[j].id).replace("classe_","")
                     infos+=current+","
                }
              }

            }
        }
        let pwd = document.getElementById('pwd1').value;
        if (pwd =="aaaa") pwd = ''
     
            axiosInstance.post(`associer-user-roles/`, {
                id_user:document.getElementById('idUser').value,
                infos: infos,
                login:document.getElementById('login').value,
                pwd:pwd,
                nom:document.getElementById('nom').value,
                prenom:document.getElementById('prenom').value,
                email:document.getElementById('email').value,
                sexe:document.getElementById('sexe').value,
                date_entree:document.getElementById('date_entree').value,
                date_sortie:document.getElementById('date_sortie').value,
                tel1:document.getElementById('tel1').value,
                tel2:document.getElementById('tel2').value,
                is_enseignant:document.getElementById('checkbox_ens').checked,
                is_active:document.getElementById('is_active').checked,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                users = [];
                adminstaffs = [];
                res.data.res.map((user)=>{users.push(user)});
                res.data.adminstaffs.map((ad)=>{adminstaffs.push(ad)});

                setGridRows(users);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm("Voulez-vous vraiment supprimer l'user selectionnée?")){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-user/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                users = [];
                adminstaffs = [];
                res.data.res.map((user)=>{users.push(user)});
                res.data.adminstaffs.map((ad)=>{adminstaffs.push(ad)});

                setGridRows(users);
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
                {t("gest_users")}
            </div>  
            {(modalOpen!=0) && <AddUser formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewUser : modifyUSer} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES UTILISATEURS
                    </div>
                                
                    <div className={classes.gridAction}> 
                        <CustomButton
                            btnText='Ajouter' 
                            buttonStyle={getButtonStyle()}
                            btnTextStyle = {classes.btnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1);var inputs=[];
                                inputs[0]= '';
                                inputs[1]= '';
                                inputs[3]= '';
                                inputs[4]= '';
                                inputs[5]= adminstaffs;
                                inputs[6]= '';
                                inputs[7]= '';
                                inputs[8]= '';
                                inputs[9]= '';
                                inputs[10]= '';
                                inputs[11]= '';
                                inputs[12]= '';
                                inputs[13]= '';
                                inputs[14]= '';
                                inputs[15]= '';
                                inputs[2]= ''; currentUiContext.setFormInputs(inputs)}}
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
                        getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                        onCellClick={handleDeleteRow}
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
export default ConfigUser;