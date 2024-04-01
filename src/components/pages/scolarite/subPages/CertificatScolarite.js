import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddStudent from "../modals/AddStudent";
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, grey} from '../../../../store/SharedData/UtilFonctions';


import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import PDFTemplate from '../reports/PDFTemplate'
import {isMobile} from 'react-device-detect';
import ListCertificatScolarite from '../reports/ListCertificatScolarite';
import { useTranslation } from "react-i18next";

let CURRENT_CLASSE_ID;
let CURRENT_CLASSE_LABEL;
var selectedElevesIds = new Array();
var currentTeacherLabel = undefined;
var printedETFileName='';

var listElt ={}


var pageSet = [];

var page = {
    pageTitle:'',
    pageRows:[],
    pageNumber:0,
}

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const ROWS_PER_PAGE= 1;
var ElevePageSet=[];


function CertificatScolarite(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
    const [optClasse, setOpClasse] = useState([]);
    const[imageUrl, setImageUrl] = useState('');
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        
        if(gridRows.length==0){
            CURRENT_CLASSE_ID = undefined;
        }

        var cnv = document.getElementById('output');
        while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
        var cnx = cnv.getContext('2d');
        var url = grey(document.getElementById("logo_url").value,cnv,cnx);
        setImageUrl(url);

        getEtabListClasses();
        
    },[]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;


    const getEtabListClasses=()=>{
        var tempTable=[
            {value: '-1',      label:(i18n.language=='fr') ? '  Choisir une classe  ' : '  Select Class  ' },
            {value: '0',       label:'Toutes les classes'   },           
        ]
        let classes_prof = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
        classes_prof.map((classe)=>{
        tempTable.push({value:classe.id_classe, label:classe.libelle});
        })
        setOpClasse(tempTable);

        // axiosInstance.post(`list-classes/`, {
        //     id_sousetab: currentAppContext.currentEtab,
        // }).then((res)=>{
        //         console.log(res.data);
        //         res.data.map((classe)=>{
        //         tempTable.push({value:classe.id, label:classe.libelle})
        //         setOpClasse(tempTable);
        //         console.log(tempTable);
        //    })         
        // }) 
    }

    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data)]
            console.log(listEleves);
            setGridRows(listEleves);
            console.log(gridRows);
        })  
        return listEleves;     
    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id              = elt.id;
            listElt.displayedName   = elt.nom +' '+elt.prenom;
            listElt.nom             = elt.nom;
            listElt.prenom          = elt.prenom;
            listElt.rang            = rang; 
            listElt.presence        = 1; 
            listElt.matricule       = elt.matricule;
            listElt.date_naissance  = convertDateToUsualDate(elt.date_naissance);
            listElt.lieu_naissance  = elt.lieu_naissance;
            listElt.date_entree     = elt.date_entree;
            listElt.nom_pere        = elt.nom_pere;
            listElt.tel_pere        = elt.tel_pere;    
            listElt.email_pere      = elt.email_pere;
            listElt.nom_mere        = elt.nom_mere;
            listElt.tel_mere        = elt.tel_mere;   
            listElt.email_mere      = elt.email_mere;
            listElt.etab_provenance = elt.etab_provenance;
            listElt.sexe            = elt.sexe;
            listElt.redouble        = (elt.redouble == false) ? "nouveau" : "Redoublant";

            listElt.nom_parent = (elt.nom_pere.length>0) ? elt.nom_pere:elt.nom_mere ;
            listElt.tel_parent = (elt.nom_pere.length>0) ? elt.tel_pere : elt.tel_mere;    
            listElt.email_parent = (elt.nom_pere.length>0) ? elt.email_pere : elt.email_mere;

            
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

    function dropDownHandler(e){
       
        if(!document.getElementById("btnGen").classList.contains("disable")){
            document.getElementById("btnGen").classList.add("disable");
        } 
         
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value; 
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;
            getClassStudentList(CURRENT_CLASSE_ID);   
            console.log(CURRENT_CLASSE_LABEL)          
        }else{            
            CURRENT_CLASSE_ID = undefined;
            CURRENT_CLASSE_LABEL='';
            setIsValid(false);                    
            setGridRows([]);
        }
    }

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
const columnsFr = [
       
    {
        field: 'matricule',
        headerName: 'MATRICULE',
        width: 100,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'displayedName',
        headerName: 'NOM ET PRENOM(S)',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'nom',
        headerName: 'NOM',
        width: 200,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },
   
    {
        field: 'prenom',
        headerName: 'PRENOM',
        width: 200,
        editable: false,
        hide:true,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'date_naissance',
        headerName: 'DATE NAISSANCE',
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'lieu_naissance',
        headerName: 'LIEU NAISANCE',
        width: 120,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    {
        field: 'date_entree',
        headerName: 'DATE ENTREE',
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle,
            
    },

    {
        field: 'nom_parent',
        headerName: 'NOM PARENT',
        width: 200,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field: 'tel_parent',
        headerName: 'TEL. PARENT',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'email_parent',
        headerName: 'EMAIL PARENT',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'nom_pere',
        headerName: 'NOM PERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field: 'tel_pere',
        headerName: 'TEL. PERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'email_pere',
        headerName: 'EMAIL PERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'nom_mere',
        headerName: 'NOM MERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },
    
    {
        field: 'tel_mere',
        headerName: 'TEL. MERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },

    {
        field: 'email_mere',
        headerName: 'EMAIL MERE',
        width: 200,
        hide:true,
        editable: false,
        headerClassName:classes.GridColumnStyle
    },


    {
        field: 'redouble',
        headerName: 'SITUATION',
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle,
            
    },

    {
        field: 'sexe',
        headerName: 'SEXE',
        hide:true,
        width: 110,
        editable: false,
        headerClassName:classes.GridColumnStyle,
            
    },

    {
        field: 'id',
        headerName: '',
        width: 15,
        editable: false,
        hide:(props.formMode=='ajout')? false : true,
        headerClassName:classes.GridColumnStyle,
        renderCell: (params)=>{
            return(
                <div className={classes.inputRow}>
                    <img src="icons/baseline_edit.png"  
                        width={17} 
                        height={17} 
                        className={classes.cellPointer} 
                        onClick={(event)=> {
                            event.ignore = true;
                        }}
                        alt=''
                    />
                </div>
            )}           
            
        },

    ];
    

    const columnsEn = [
       
        {
            field: 'matricule',
            headerName: 'REG. CODE',
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'displayedName',
            headerName: 'NAME AND SURNAME',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'nom',
            headerName: (i18n.lng=='fr')?'NOM':'NAME',
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
       
        {
            field: 'prenom',
            headerName: 'SURNAME',
            width: 200,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'date_naissance',
            headerName: 'BIRTH DATE',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'lieu_naissance',
            headerName:'BIRTH PLACE',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_entree',
            headerName:'REG. YEAR',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
    
        {
            field: 'nom_parent',
            headerName:'PARENT NAME',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'tel_parent',
            headerName:'PARENT TEL.',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'email_parent',
            headerName:'PARENT EMAIL',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'nom_pere',
            headerName:'FATHER NAME',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'tel_pere',
            headerName:'FATHER TEL.',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'email_pere',
            headerName:'FATHER EMAIL',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'nom_mere',
            headerName:'MOTHER NAME',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        
        {
            field: 'tel_mere',
            headerName: 'MOTHER TEL.',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
        {
            field: 'email_mere',
            headerName:'MOTHER EMAIL',
            width: 200,
            hide:true,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
    
    
        {
            field: 'redouble',
            headerName:'SITUATION',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
    
        {
            field: 'sexe',
            headerName:'SEX',
            hide:true,
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
    
        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            hide:(props.formMode=='ajout')? false : true,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow}>
                        <img src="icons/baseline_edit.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            onClick={(event)=> {
                                event.ignore = true;
                            }}
                            alt=''
                        />
                    </div>
                )}           
                
            },
        
        ];

     
/*************************** Theme Functions ***************************/
    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }
    
/*************************** Handler functions ***************************/
    

    function handleDeleteRow(params){
        if(params.field=='id'){
            //console.log(params.row.matricule);
            deleteRow(params.row.matricule);            
        }
    }

    function initFormInputs(){
        var inputs=[];
        inputs[0] = '';
        inputs[1] = '';
        inputs[2] = '';
        inputs[3] = '';
        inputs[4] = '';
        inputs[5] = '';       
        inputs[6] = '';
        inputs[7] = '';        
        inputs[8] = '';
        inputs[9] = '';
        inputs[10]= '';
        inputs[11]= '';
        inputs[12]='';
        inputs[13]= '';
       
        currentUiContext.setFormInputs(inputs)
    }

    function handleEditRow(row){       
        var inputs=[];
        
        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[2]= row.date_naissance;
        inputs[3]= row.lieu_naissance;
        inputs[4]= row.etab_provenance;

        inputs[5]= row.nom_pere;
        inputs[6]= row.email_pere;
        inputs[7]= row.tel_pere;

        inputs[8] = row.nom_mere;
        inputs[9] = row.email_mere;
        inputs[10]= row.tel_mere;

        inputs[11]= row.id;

        inputs[12]=(row.sexe=='masculin'||row.sexe=='M')?'M':'F';
        inputs[13]= (row.redouble=='Redoublant')? 'O': 'N';

        inputs[14]= row.date_entree;

        console.log("laligne",row);
        currentUiContext.setFormInputs(inputs)
        setModalOpen(2);

    }

    function consultRowData(row){
        var inputs=[];
       
        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[2]= row.date_naissance;
        inputs[3]= row.lieu_naissance;
        inputs[4]= row.etab_provenance;

        inputs[5]= row.nom_pere;
        inputs[6]= row.email_pere;
        inputs[7]= row.tel_pere;

        inputs[8] = row.nom_mere;
        inputs[9] = row.email_mere;
        inputs[10]= row.tel_mere;

        inputs[11]= row.id;

        inputs[12]=(row.sexe=='masculin'||row.sexe=='M')?'M':'F';
        inputs[13]= (row.redouble=='Redoublant')? 'O': 'N';

        inputs[14]= row.date_entree;

     
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);

    }

    
    function deleteRow(rowId) {
       // alert(rowId);
        //Message de confirmation
        /*if(window.confirm('Voulez-vous vraiment supprimer la section selectionnée?')){
            //requete  axios de suppression de l'eatab qui a cet id
            axiosInstance
            .post(`delete-etab/`, {
                id:rowId,
            }).then((res)=>{
                console.log(res.data.status)
                 //Mise a jour du tableau
                //setDataState(result)
            })              
        }*/
    } 

    function quitForm() {
        //ClearForm();
        setModalOpen(0)
    }
   
    
    const acceptHandler=()=>{
        switch(chosenMsgBox){

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

            case MSG_WARNING: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
            }
        }        
    }

    const rejectHandler=()=>{
        
    }

    const printStudentList=()=>{
        
        if(document.getElementById("btnGen").classList.contains("disable")) return;

        axiosInstance
        .post(`log-info/`,{
            id_sousetab : currentAppContext.currentEtab,
            id_user     : currentAppContext.idUser,
            message     : "Impression certificat scolarite classe : "+CURRENT_CLASSE_LABEL +" eleves ids :"+ selectedElevesIds[0].join(',')
        
        }).then((res)=>{
          
            if(CURRENT_CLASSE_ID != undefined){
              
                var PRINTING_DATA ={
                    currentClasse: CURRENT_CLASSE_LABEL,
                    anneeScolaire:"2022-2023",
                    nomDirecteur:"ABENA Luc",
                    qualite: "Directeur",
                    schoolName:currentAppContext.currentEtabInfos.libelle,
                    dateText:'Yaounde, le 14/03/2023',
                    leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire","Delegation Regionale du centre", "Delegation Departementale du Mfoundi"],
                    centerHeaders:[currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+', Telephone:'+ currentAppContext.currentEtabInfos.tel],
                    rightHeaders:["Republic Of Cameroon", "Peace-Work-Fatherland","Ministere des enseignement secondaire","Delegation Regionale du centre", "Delegation Departementale du Mfoundi"],
                    pageImages:[imgUrl],
                    pageImagesDefault:[imgUrlDefault],
                    pageTitle: "CERTIFICAT DE SCOLARITE",
                    //tableHeaderModel:["matricule", "nom et prenom(s)", "date naissance", "lieu naissance", "enrole en", "Nom Parent", "nouveau"],
                    tableData :[...gridRows.filter((elt)=>selectedElevesIds[0].includes(elt.id))],
                    numberEltPerPage:ROWS_PER_PAGE 
                };
                printedETFileName ='certificat_scolarite.pdf'
                setModalOpen(4);
                ElevePageSet={};
                //ElevePageSet = [...splitArray([...gridRows], "Liste des eleves de la classe de " + CURRENT_CLASSE_LABEL, ROWS_PER_PAGE)];          
                ElevePageSet = {...PRINTING_DATA};
                document.getElementById("btnGen").classList.add("disable");
                console.log("ici la",ElevePageSet);                    
            } else{
                chosenMsgBox = MSG_WARNING;
                currentUiContext.showMsgBox({
                    visible  : true, 
                    msgType  : "warning", 
                    msgTitle : t("ATTENTION!"), 
                    message  : t("must_select_class")
                })            
            }
        });
    }

    
    const closePreview =()=>{
        selectedElevesIds =[];
        setIsValid(false);                 
        setModalOpen(0);
    }
    

    /********************************** JSX Code **********************************/   
    return (
        <div className={classes.formStyleP}>
            
            {(modalOpen!=0) && <BackDrop/>}
            {(modalOpen==4) &&              
                <PDFTemplate previewCloseHandler={closePreview}>
                    {isMobile?
                        <PDFDownloadLink  document ={<ListCertificatScolarite pageSet={ElevePageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            <ListCertificatScolarite pageSet={ElevePageSet}/>
                        </PDFViewer>
                    }
                </PDFTemplate>
            } 
         
            
            {(currentUiContext.msgBox.visible == true)  && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    imgStyle={classes.msgBoxImgStyle}
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("no")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />               
            }
            <div className={classes.inputRow} >
             
                <div className={classes.formTitle}>
                    {t('print_school_certificate_M')}  
                </div>
                   
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('select_class_M')} :
                        </div>
                      
                        <div className={classes.selectZone} style={{marginLeft:"1vw"}}>
                            <select id='selectClass1' onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option  value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>                          
                        </div>
                    </div>
                    
                                
                    <div className={classes.gridAction}> 
                        {/*(props.formMode=='ajout')?
                            <CustomButton
                                btnText='Nvel. Eleve'
                                hasIconImg= {true}
                                imgSrc='images/addNewUserOrg.png'
                                imgStyle = {classes.grdBtnImgStyle}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyle}
                                btnClickHandler={AddNewStudentHandler}
                                disable={(modalOpen==1||modalOpen==2)}   
                            />
                            :
                            null
                        */}

                        <CustomButton
                            id                 = {"btnGen"}
                            btnText            = {t('imprimer')}
                            hasIconImg         = {true}
                            imgSrc             ='images/printing1.png'
                            imgStyle           = {classes.grdBtnImgStyle}  
                            buttonStyle        = {getGridButtonStyle()}
                            btnTextStyle       = {classes.gridBtnTextStyle}
                            btnClickHandler    = {printStudentList}
                            disabledBtnHandler = {printStudentList}
                            disable            = {(isValid==false)}   
                        />

                        {/*<CustomButton
                            btnText='Importer'
                            hasIconImg= {true}
                            imgSrc='images/import.png'
                            imgStyle = {classes.grdBtnImgStyle} 
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(modalOpen==1||modalOpen==2)}   
                    />*/}
                    </div>
                        
                    </div>
                    
                

                {/*(modalOpen==0) ?*/
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={(i18n.language=='fr') ? columnsFr:columnsEn}

                            checkboxSelection ={(gridRows.length > 0) ? true : false}
                                
                            onSelectionModelChange={(id)=>{
                                selectedElevesIds = new Array(id);
                                // if(selectedElevesIds[0].length>0) setIsValid(true);
                                // else setIsValid(false); 
                                if(selectedElevesIds[0].length>0){
                                    if(document.getElementById("btnGen").classList.contains("disable")){
                                        document.getElementById("btnGen").classList.remove("disable");
                                    }
                                } else  document.getElementById("btnGen").classList.add("disable");                             
                                
                                console.log(selectedElevesIds);
                            }}

                            getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                            onCellClick={handleDeleteRow}
                            onRowClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    handleEditRow(params.row)
                                }
                            }}  
                            
                            onRowDoubleClick ={(params, event) => {
                                event.defaultMuiPrevented = true;
                                consultRowData(params.row)
                            }}
                            
                            //loading={loading}
                            //{...data}
                            sx={{
                                //boxShadow: 2,
                                //border: 2,
                                //borderColor: 'primary.light',
                                '& .MuiDataGrid-cell:hover': {
                                  color: 'primary.main',
                                  border:0,
                                  borderColor:'none'
                                },
                              
                            }}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even ' + classes.gridRowStyle : 'odd '+ classes.gridRowStyle
                            }
                        />
                    </div>
                  /*  :
                    null
                        */}
            
            </div>
        </div>
        
    );
} 
export default CertificatScolarite;