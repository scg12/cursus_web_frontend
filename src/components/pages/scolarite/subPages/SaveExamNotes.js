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
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRRENT_COURS_ID;
let SELECTED_DATE;

var listElt ={
    rang:1, 
    presence:1, 
    matricule:"", 
    nom: '', 
    date_naissance: '', 
    lieu_naissance:'', 
    date_entree:'', 
    nom_pere: '',  
    redouble: '',  
    id:1,
}

function SaveExamNotes(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [present, setPresent]= useState(0);
    const [absent, setAbsent]= useState(0);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const [optClasse, setOpClasse] = useState([]);
    const [optCours, setOpCours] = useState([]);
    const [optDate, setOpDate] = useState([]);
    

    useEffect(()=> {
        if(gridRows.length ==0){
            CURRENT_CLASSE_ID = undefined;
        }    
        getEtabListClasses();    
        getCoursClasse(currentAppContext.currentEtab, 0);
        getDateCours(0);
    },[]);



    const getEtabListClasses=()=>{
        var tempTable=[{value: '0',      label:'Choisir une classe'    }];

        axiosInstance.post(`list-classes/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
                console.log(res.data);
                res.data.map((classe)=>{
                tempTable.push({value:classe.id, label:classe.libelle})
                setOpClasse(tempTable);
            })         
        }) 
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
            setPresent(listEleves.length)
            console.log(gridRows);
        })  
        return listEleves;     
    }

    function getCoursClasse(sousEtabId, classeId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  ----- Choisir un cours ----- ' : ' ------ Select course ------ '  }]
        var tabCours;    
       
        if(classeId!=0){
            tabCours = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
            tabCours.map((cours)=>{
                tempTable.push({value:cours.id_cours, label:cours.libelle_cours});
            })

        }       
        
        console.log('cours',tabCours,tempTable);
        setOpCours(tempTable);
        
        if( document.getElementById('optCours').options[0]!= undefined)
        document.getElementById('optCours').options[0].selected=true;     
    }


    function getDateCours(coursId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  --- Choisir une date --- ' : ' --- Select Date --- '  }]
        var tabDateCours;  

        tabDateCours = [
            {label:'11/04/2023', value:1},
            {label:'12/03/2023', value:2},
            {label:'10/02/2023', value:3},
            {label:'05/02/2023', value:4},
        ];
       
        if(coursId!=0){
            //tabCours = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
            tabDateCours.map((dateCours)=>{
                tempTable.push(dateCours);
            })

        } 
        
        setGridRows([]);
        setPresent(0);
        setAbsent(0); 
        setOpDate(tempTable);
        
        if( document.getElementById('optDate').options[0]!= undefined)
        document.getElementById('optDate').options[0].selected=true;

    }

    function classeChangeHandler(e){       
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value;
            getCoursClasse(currentAppContext.currentEtab, CURRENT_CLASSE_ID);
        }else{
            CURRENT_CLASSE_ID = undefined;
            getCoursClasse(currentAppContext.currentEtab, 0);
            getDateCours(0);
        }
    }

   
    function coursChangeHandler(e){
        if(e.target.value != optCours[0].value){
            CURRRENT_COURS_ID = e.target.value;
            getDateCours(CURRRENT_COURS_ID);            
            
        } else {
            CURRRENT_COURS_ID = undefined;
            //document.getElementById('optClasse').options[0].selected=true;
            getDateCours(0);
        }
    }

    function dateChangeHandler(e){
        if(e.target.value != optCours[0].value){
            SELECTED_DATE = e.target.label;
            var grdRows = getClassStudentList(CURRENT_CLASSE_ID);
            var presents =  getPresentCount(grdRows);
            var absents = getAbsentCount(grdRows);
            
            setGridRows(grdRows);
            setPresent(presents);
            setAbsent(absents);  
            
        } else {
            //document.getElementById('optClasse').options[0].selected=true;
            //getCoursClasse(currentAppContext.currentEtab, 0);
            SELECTED_DATE = undefined;
            setGridRows([]);
            setPresent(0);
            setAbsent(0); 
        }
    }


    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.nom  = elt.nom +' '+elt.prenom;
            listElt.rang = rang; 
            listElt.presence = 1; 
            listElt.matricule = elt.matricule;
            listElt.date_naissance = convertDateToUsualDate(elt.date_naissance);
            listElt.lieu_naissance = elt.lieu_naissance;
            listElt.date_entree = convertDateToUsualDate(elt.date_entree);
            listElt.nom_pere = elt.nom_pere;
            listElt.redouble = (elt.redouble == false) ? "nouveau" : "Redoublant"; 
            formattedList.push(listElt);
            rang ++;

        })
        return formattedList;
    }
    
/*************************** DataGrid Declaration ***************************/    
    const columns = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'presence',
            headerName: t('present')+'?',
            width: 50,
            editable: false,
            headerClassName:classes.GridColumnStyle,
           
            renderCell: (params)=>{
                return(
                    (params.value == 1)?
                    <div className={classes.inputRow}>
                        <img src="images/check_trans.png"  
                            width={17} 
                            height={13} 
                            className={classes.cellPointer} 
                           /* onClick={(event)=> {
                                event.ignore = true;
                            }}*/
                            alt=''
                        />
                    </div>
                    :
                    <div className={classes.inputRow} >
                        <img src="images/delete.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            /*onClick={(event)=> {
                                event.ignore = true;
                            }}*/
                            alt=''
                        />
                    </div>

                    
                )
            }         
        },
       
        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_naissance',
            headerName: t('form_dateNaiss_M'),
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'lieu_naissance',
            headerName: t('form_lieuNaiss_M'),
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_entree',
            headerName: t('date_entree_M'),
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
        {
            field: 'nom_pere',
            headerName: t('nom_parent_M'),
            width: 200,
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
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            hide:(props.formMode=='ajout')? false : true,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow}>
                        <img src="icons/baseline_delete.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            //onClick={deleteRow}
                            alt=''
                        />
                    </div>
                );
                
            }
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


    function getPresentCount(tab){
        var countPresent = 0;
        for(var i=0; i<tab.length;i++){
            if(tab[i].presence == 1) countPresent++;
        }
        return countPresent;
    }

    function getAbsentCount(tab){
        var countAbsent = 0;
        for(var i=0; i<tab.length;i++){
            if(tab[i].presence == 0) countAbsent++;
        }
        return countAbsent;
    } 
   
    function handlePresence(params){
        console.log(params);
        if(params.presence == 0) {
            params.presence = 1;
            setPresent(present+1);
            setAbsent(absent-1);
        }
        else{
            params.presence = 0;
            setPresent(present-1);
            setAbsent(absent+1);
        } 
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
            <div className={classes.inputRow}>               
                <div className={classes.formTitle}>
                    {t('look_students_presence_M')}  
                </div>                
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('class_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optClasse' onChange={classeChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1,marginLeft:'1vw'}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>

                    <div className={classes.gridTitle} style={{marginLeft:"-5.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('course_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optCours' onChange={coursChangeHandler} className={classes.comboBoxStyle} style={{width:'13.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optCours||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>

                    <div className={classes.gridTitle} style={{marginLeft:"-3.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optDate' onChange={dateChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optDate||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>


                   
                                
                    <div className={classes.gridAction}> 
                        {(props.formMode=='appel')?
                            <CustomButton
                                btnText={t('save')}
                                hasIconImg= {true}
                                imgSrc='images/saveToDisk_trans.png'
                                imgStyle = {classes.grdBtnImgStyle}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyle}
                                btnClickHandler={savePresenceHandler}
                                disable={(modalOpen==1||modalOpen==2)}   
                            />
                            :
                            null
                        }

                        <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(modalOpen==1||modalOpen==2)}   
                        />

                    </div>
                        
                </div>
                    
                

                {(modalOpen==0) ?
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={columns}
                            getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                            
                            onCellClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    handlePresence(params.row)
                                }
                            }}  
                            
                           onRowDoubleClick ={(params, event) => {
                               if(!event.ignore){
                                    event.defaultMuiPrevented = true;
                                    consultRowData(params.row);
                                }
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
                    :
                    null
                }
            
            </div>
            <div className={classes.infoPresence}>
                <div className={classes.presentZone}>
                    <div> {t('present')}(s) :</div>
                    <div> {present} </div>
                </div>

                <div className={classes.absentZone}>
                    <div> {t('absent')}(s) :</div>
                    <div> {absent} </div>
                </div>
            </div>
        </div>
        
    );
} 
export default SaveExamNotes;