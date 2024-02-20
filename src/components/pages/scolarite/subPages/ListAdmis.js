import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddStudent from "../modals/AddStudent";
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, ajouteZeroAuCasOu} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


let CURRENT_EXAM_ID;
let CURRENT_EXAM_LABEL;


var listElt ={};

function ListAdmis(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [absent, setAbsent]= useState(0);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const [optExam, setOpExams] = useState([]);
 
    

    useEffect(()=> {
        if(gridRows.length ==0){
            CURRENT_EXAM_ID = undefined;
        }    
        getEtabListExams();    
    },[]);



    const getEtabListExams=()=>{
        var tempTable=[{value: -1,      label: (i18n.language=='fr') ? '  Choisir un Examen  ' : '  Select an Exam '  }];

        axiosInstance.post(`list-examen-officiel/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
                console.log("examen",res.data.res);
                res.data.res.map((exam)=>{
                tempTable.push({value:exam.id, label:exam.libelleExam})                
            })      
            setOpExams(tempTable);   
        }) 
    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[];
        list.map((elt)=>{
            listElt={};
            listElt.rang           = ajouteZeroAuCasOu(rang); 
            listElt.id             = elt.id;
            listElt.matricule      = elt.matricule;
            listElt.nom            = elt.nom;
            listElt.prenom         = elt.prenom;
            listElt.displayedName  = elt.nom +' '+elt.prenom;
            listElt.resultat       = elt.resultat=="Echoué" ? t("failed"):t("admis");
            listElt.mention        = elt.mention;
            listElt.moyenne        = elt.moyenne;
            listElt.libelle_classe = elt.libelle_classe;
            listElt.id_classe      = elt.id_classe;
           
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }

      const  getExamStudentResultList=(examId)=>{
        var listEleves;
        setModalOpen(5);
        axiosInstance.post(`list-resultat-examen-officiel/`, {
            id_exam : examId,
        }).then((res)=>{
            setModalOpen(0);
            console.log("resultats",res.data);
            listEleves = [...formatList(res.data.res)];
            console.log("examen",listEleves);
            setGridRows(listEleves);
            console.log(gridRows);
        })  
    }

    function examChangeHandler(e){       
        if(e.target.value > 0){
            setIsValid(true);
            CURRENT_EXAM_ID = e.target.value; 
            CURRENT_EXAM_LABEL = optExam[optExam.findIndex((nivo)=>(nivo.value == CURRENT_EXAM_ID))].label;
            getExamStudentResultList(CURRENT_EXAM_ID);
            console.log(CURRENT_EXAM_LABEL)          
        }else{
            CURRENT_EXAM_ID    = undefined;
            CURRENT_EXAM_LABEL = '';
            setGridRows([]);
            setIsValid(false);
        }
    }
 
/*************************** DataGrid Declaration ***************************/    
    const columnsFr = [
        {
            field          : 'id',
            headerName     : "ID",
            width          : 33,
            editable       : false,
            hide           : true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field           : 'rang',
            headerName      : "N°",
            width           : 33,
            editable        : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'matricule',
            headerName     : "MATRICULE",
            width          : 100,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'displayedName',
            headerName     : "NOM(S) ET PRENOM(S)",
            width          : 200,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'resultat',
            headerName     : "RESULTAT",
            width          : 90,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'mention',
            headerName     : "MENTION",
            width          : 120,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'moyenne',
            headerName     : "MOYENNE",
            width          : 80,
            editable       : false,
            headerClassName:classes.GridColumnStyle,
                
        }
       
    ];


    const columnsEn = [
        {
            field          : 'id',
            headerName     : 'ID',
            width          : 33,
            editable       : false,
            hide           : true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field           : 'rang',
            headerName      : "N°",
            width           : 33,
            editable        : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'matricule',
            headerName     : "REG. ID",
            width          : 100,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'displayedName',
            headerName     : "NAME(S) AND SURNAME(S)",
            width          : 200,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'resultat',
            headerName     : "RESULT",
            width          : 90,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'mention',
            headerName     : "APPRECIATION",
            width          : 120,
            editable       : false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field          : 'moyenne',
            headerName     : "SCORE",
            width          : 80,
            editable       : false,
            headerClassName:classes.GridColumnStyle,
                
        }
       
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
    function consultRowData(row){
        var inputs=[];

        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[2]= row.date_naissance;
        inputs[3]= row.lieu_naissance;
        inputs[4]= row.etab_origine;

        inputs[5]= row.nom_pere;
        inputs[6]= row.email_pere;
        inputs[7]= row.tel_pere;

        inputs[8]= row.nom_mere;
        inputs[9]= row.email_mere;
        inputs[10]= row.tel_mere;

        inputs[11]= row.matricule;
     
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);

    }   
    
    function quitForm() {
        setModalOpen(0)
    }

    function savePresenceHandler(e){

    }


    /********************************** JSX Code **********************************/   
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

    return (
        <div className={classes.formStyleP}>
            {(modalOpen==3) && <BackDrop/>}
            {(modalOpen==3) && <AddStudent formMode='consult' cancelHandler={quitForm} />}

            {(modalOpen==5) && <BackDrop/>}
            {(modalOpen==5) &&
                <div style={{ alignSelf: 'center',position:'absolute', top:'49.3%', fontWeight:'bolder', color:'#fffbfb', zIndex:'1207',marginTop:'-2.7vh', fontSise:'0.9vw'}}> 
                    {t('traitement')}...
                </div>                    
            }
            {(modalOpen==5) &&
                <div style={{   
                    alignSelf: 'center',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '13vw',
                    height: '3.13vh',
                    position: 'absolute',
                    top:'50%',
                    zIndex: '1200',
                    overflow: 'hidden'
                }}
                >
                    <img src='images/Loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
                </div>                    
            }
            <div className={classes.inputRow}>               
                <div className={classes.formTitle}>
                    {t('exam_results_M')}  
                </div>                
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('select_exam_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optExam' onChange={examChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1,marginLeft:'1vw'}}>
                                {(optExam||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>
                   
                                
                    <div className={classes.gridAction}>                       
                        <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={savePresenceHandler}
                            disable={isValid==false}   
                        />
                    </div>
                        
                </div>
                    
                

                {(modalOpen==0) ?
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                            getCellClassName={(params) => (params.field ==='displayedName'||params.field ==='mention')? classes.gridMainRowStyle :  (params.field ==='resultat'&& params.value==t("admis")) ?  classes.gridSuccessRowStyle :  (params.field ==='resultat'&& params.value==t("failed")) ? classes.gridFailedRowStyle : classes.gridRowStyle }
                            
                            onCellClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    ///handlePresence(params.row)
                                }
                            }}  
                            
                        //    onRowDoubleClick ={(params, event) => {
                        //        if(!event.ignore){
                        //             event.defaultMuiPrevented = true;
                        //             consultRowData(params.row);
                        //         }
                        //     }}
                            
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
                    :
                    null
                }
            
            </div>
           
        </div>
        
    );
} 
export default ListAdmis;