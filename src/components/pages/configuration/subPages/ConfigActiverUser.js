import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';

import AddActiverUser from "../modals/AddActiverUser";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


var users = [] ,chaine = ",", nb_click=0; 

function ConfigActiverUser(props) {
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
            field: 'is_active',
            headerName: 'Reactiver?',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params) => (
                <input type="checkbox"
                checked={(params.value===true)?true:false}
                onClick={(event)=> {
                        event.ignore = true;
                        handleClickCheckbox(params)
                    }
                    }
              />
            ),
        },
        {
            field: 'nom',
            headerName: 'Nom',
            width: 140,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'prenom',
            headerName: 'Prénom',
            width: 140,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'login',
            headerName: 'Login',
            width: 140,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'sexe',
            headerName: 'Sexe',
            width: 70,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 140,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
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
        var users = { 
            id:0, 
            libelle:'',
            code:'' 
        }

        // users.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        // users.code = (document.getElementById('code').value !='') ? putToEmptyStringIfUndefined(document.getElementById('code').value).trim() : putToEmptyStringIfUndefined(document.getElementById('code').defaultValue).trim();       
        // users.id = document.getElementById('idusre').value;
        return users;
    }

    function formDataCheck(usr) {
        var errorMsg='';
        // if(usr.libelle.length == 0){
        //     errorMsg="Veuillez entrer le libellé du user !";
        //     return errorMsg;
        // }       
        return errorMsg;
    }
    function handleClickCheckbox(params){
        // if(e.hasFocus == true)
        var checked;
            if(params.is_active == true){
                params.is_active = false;

                checked = false;
                chaine = chaine.replace(","+params.id+",",",")
                console.log("ici ,"+params.id+",")
            }
            else{
                if(nb_click%2 == 1)
                {
                    params.is_active = true
                    checked = true;
                    if (chaine.includes(","+params.id+",")==false)
                        chaine += params.id+","
                    console.log("la "+params.id+",")
                }
            }
            nb_click++;
        console.log(chaine)
    }
    
    function handleDeleteRow(params){
        if(params.field=='id'){
            deleteRow(params.id)            
        }
    }

    function handleEditRow(row){       
        var inputs=[];
        inputs[0]= row.libelle;
        inputs[1]= row.code;
        inputs[2]= row.id;
        
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function listUsers(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        users=[];
        axiosInstance
        .post(`list-users-desactives/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
            res.data.map((user)=>{users.push(user)});
            console.log(users);
            setGridRows(users);
        })  
    }

    function addNewUser(e) {       
        e.preventDefault();
        var usr = getFormData();
                        
            axiosInstance.post(`create-usre/`, {
                    libelle: usr.libelle,
                    code: usr.code,
                    id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                users = []
                res.data.users.map((usre)=>{users.push(usre)});
                setGridRows(users);
                ClearForm();
                setModalOpen(0);
            }) 
        
    }
    
    function modifyUser(e) {
        e.preventDefault();
        console.log(chaine);
     
            axiosInstance.post(`update-user-desactive/`, {
                id_users:chaine,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data);
                users = [];
                chaine=","
                res.data.map((user)=>{users.push(user)});
                setGridRows(users);
                ClearForm();
                setModalOpen(0);
            })          
    }

    function deleteRow(rowId) {
        //Message de confirmation
        if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-user/`, {
                id:rowId,
                id_sousetab: currentAppContext.currentEtab
            }).then((res)=>{
                console.log(res.data.status)
                users = []
                res.data.users.map((user)=>{users.push(user)});
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
            {(modalOpen!=0) && <AddActiverUser formMode= {(modalOpen==1) ? 'creation': 'modif'}  actionHandler={(modalOpen==1) ? addNewUser : modifyUser} cancelHandler={quitForm} />}

            {(modalOpen==0) ?
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>
                        LISTE DES UTILISATEURS DESACTIVES
                    </div>

                    <div className={classes.gridAction}> 
                        <CustomButton
                            btnText='Mettre à Jour'
                            buttonStyle={getButtonStyle()}
                            btnTextStyle = {classes.btnTextStyle}
                            btnClickHandler={modifyUser}
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
                                // handleEditRow(params.row)
                                handleClickCheckbox(params.row)
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
export default ConfigActiverUser;