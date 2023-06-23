import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import MsgBox from '../../../msgBox/MsgBox';
import AddStudent from "../modals/AddStudent";
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";



let CURRENT_CLASSE_ID;
let CURRENT_COURS_ID;
let CURRENT_SEQUENCE_ID;

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

var listEleves;
var listNotes;
var supA10 = 0;
var infA10 = 0;

var chosenMsgBox;
const MSG_SUCCESS_NOTES =11;
const MSG_WARNING_NOTES =12;
const MSG_ERROR_NOTES   =13;



function SaveNotes(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [dataSaved, setDataSaved] = useState(false);
    const [superieurA10, setSuperieurA10]= useState(0);
    const [inferieureA10, setInferieureA10]= useState(0);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const [optClasse, setOpClasse] = useState([]);
    const [optCours, setOpCours] = useState([]);
    const [optPeriode, setOptPeriode] = useState([]);
    

    useEffect(()=> {        
        currentUiContext.setIsParentMsgBox(false);

        if(gridRows.length ==0){
            CURRENT_CLASSE_ID = undefined;
        }    
        getEtabListClasses();    
        getCoursClasse(currentAppContext.currentEtab, 0);
        getActivatedEvalPeriods(0);
        // ici on va activer ca lorsqu'on va charger le notes precedentes
        // setSuperieurA10(nbreSup10);
        // setInferieureA10(nbreInf10)
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

    const  getClassStudentListWithNotes=(classId, coursId, sequenceId)=>{
        listEleves = []; 
        axiosInstance.post(`eleves-notes-cours-sequence/`, {
            id_classe: classId,
            id_cours: coursId,
            id_sequence:sequenceId
        }).then((res)=>{
            listEleves = [...res.data];
            console.log("LES LISTE",listEleves);
            setGridRows(listEleves);          
            calculTendance();  
        })  
    }

    function getNotesCoursSequence(coursId, sequenceId){
        listNotes=[]
        axiosInstance.post(`list-notes-cours-sequence/`, {
            id_cours: coursId,
            id_sequence: sequenceId
        }).then((res)=>{
            console.log("notes",res.data.notes);
            listNotes = [...res.data.notes];
        })  
   
    }

    function getCoursClasse(sousEtabId, classeId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  ----- Choisir un cours ----- ' : ' ------ Select course ------ '  }]
        var tabCours;    
       
        if(classeId!=0){
            tabCours = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
            tabCours.map((cours)=>{
                tempTable.push({value:cours.id_cours, label:cours.libelle_cours});
            })

            console.log("liste cours", tabCours);

        }       
        
        console.log('cours',tabCours,tempTable);
        setOpCours(tempTable);
        
        if( document.getElementById('optCours').options[0]!= undefined)
        document.getElementById('optCours').options[0].selected=true;     
    }

    function getActivatedEvalPeriods(coursId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  - Choisir une periode - ' : ' - Select period - '  }]
        var tabSequences;  

        if(coursId!=0){
            axiosInstance.post(`list-sequences/`, {
                id_sousetab: currentAppContext.currentEtab,
                id_trimestre:""
            }).then((res)=>{   
                
                tabSequences = [...res.data.sequences];    
                     
                res.data.sequences.map((seq)=>{
                    if(seq.is_active == true){
                        tempTable.push({value:seq.id, label:seq.libelle});
                    }                              
                })
    
                setOptPeriode(tempTable); 
    
                if(tabSequences.length==0){
                    chosenMsgBox = MSG_WARNING_NOTES;
                    currentUiContext.showMsgBox({
                        visible:true, 
                        msgType:"info", 
                        msgTitle:t("error_M"), 
                        message:t("no_activated_period")
                    }) 
        
                }
            })

        }
            
        setGridRows([]);

        //setSuperieurA10(0);
        //setInferieureA10(0); 
       
        
        if( document.getElementById('optPeriode').options[0]!= undefined)
        document.getElementById('optPeriode').options[0].selected=true;
    }

    function classeChangeHandler(e){       
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value;
            getCoursClasse(currentAppContext.currentEtab, CURRENT_CLASSE_ID);
        }else{
            CURRENT_CLASSE_ID = undefined;
            getCoursClasse(currentAppContext.currentEtab, 0);
            getActivatedEvalPeriods(0);
        }
    }

   
    function coursChangeHandler(e){
        if(e.target.value != optCours[0].value){
            CURRENT_COURS_ID = e.target.value;
            getActivatedEvalPeriods(CURRENT_COURS_ID);            
            
        } else {
            CURRENT_COURS_ID = undefined;
            //document.getElementById('optClasse').options[0].selected=true;
            getActivatedEvalPeriods(0);
        }
    }

    function periodeChangeHandler(e){
        if(e.target.value != optPeriode[0].value){
            CURRENT_SEQUENCE_ID = e.target.value;
            getClassStudentListWithNotes(CURRENT_CLASSE_ID, CURRENT_COURS_ID,CURRENT_SEQUENCE_ID);   
            //On pourra mettre les >10 et <10
            /*setSuperieurA10(presents);
            setInferieureA10(absents); */ 
        } else {
            CURRENT_SEQUENCE_ID = undefined;
            setGridRows([]);
           /* setSuperieurA10(0);
            setInferieureA10(0); */
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
            listElt.matricule = elt.matricule;
            listElt.note = '00'; 
            // listElt.date_naissance = convertDateToUsualDate(elt.date_naissance);
            // listElt.lieu_naissance = elt.lieu_naissance;
            // listElt.date_entree = convertDateToUsualDate(elt.date_entree);
            // listElt.nom_pere = elt.nom_pere;
            // listElt.redouble = (elt.redouble == false) ? "nouveau" : "Redoublant"; 
            formattedList.push(listElt);
            rang ++;

        })
        return formattedList;
    }

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
    function quitForm() {
        setModalOpen(0)
    }


    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);
                setGridRows([]);
                // setSuperieurA10(0);
                // setInferieureA10(0);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }        
    }

    const rejectHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_NOTES: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_NOTES :{
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }
        
    }

    function saveNotesHandler(e){
        var notes=[];
        
        setModalOpen(4);
        listEleves.map((eleve)=>notes.push(eleve.note));
        axiosInstance.post(`save-classe-note/`, {
            id_classe : CURRENT_CLASSE_ID,
            id_cours : CURRENT_COURS_ID,
            id_groupe : 1, //a remplacer
            id_sequence : CURRENT_SEQUENCE_ID,
            coef : 3, //a remplacer
            notes : notes.join('_')
        }).then((res)=>{
            calculTendance();
            setModalOpen(0);
            setDataSaved(true)
            console.log(res.data);
            chosenMsgBox = MSG_SUCCESS_NOTES;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_operation_M"), 
                message:t("success_operation")
            })   
        })  

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
   
   

    function updateNoteColor(e){
        console.log(e)
        var note = e.target.value;
        var idnote = e.target.id;
        var index = listEleves.findIndex((eleve)=>eleve.id==idnote)
        if(note > props.noteMax || isNaN(note)){
            document.getElementById(idnote).value = 'ERR';
            document.getElementById(idnote).style.color='red';
            listEleves[index].note = 0
            
        } else {
            listEleves[index].note = note
            document.getElementById(idnote).value = note;
            if(note >=props.noteMax/2) {
                document.getElementById(idnote).style.color='black';  
                supA10+=1;             
            }
            else {
                document.getElementById(idnote).style.color='red';  
                infA10+=1             
            }

        }
        setGridRows(listEleves);
       /* if(e){}
            setSuperieurA10(supA10);
            setInferieureA10(infA10);
        }*/
     
    }

    function calculTendance(){
        var supA10, infA10;
        supA10 = 0; infA10 = 0;
        listEleves.map((eleve)=>{(eleve.note>=10)? supA10++ : infA10++});
        setSuperieurA10(supA10); setInferieureA10(infA10);
    }

    function updateNotesResults(e){
        var note = e.target.value;
        var suivant = e.target.id+1;
        if(note >=props.noteMax/2) {
            setSuperieurA10(superieurA10+1);
            document.getElementById(suivant).focus();
        }else{
            setInferieureA10(inferieureA10+1);
            document.getElementById(suivant).focus();
        }
    }

    function moveOnMax(e,currentField, nextField){
        if(nextField!=null){
            e = e || window.event;
            if(e.keyCode != 9){
                if(currentField.value.length >= currentField.maxLength){
                    nextField.focus();
                }
            }
        }
     
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
            field: 'note',
            headerName: t('note_M')+'/'+props.noteMax,
            width: 80,
           // editable: (props.formMode!='consult')? true : false,
            headerClassName: classes.GridColumnStyle,  
           renderCell: (params)=>{
            return(
                <div style={{display:"flex", flexDirection:"row",  justifyContent:"center", alignItems:'center', width:"60vw", height:"2vw", borderRadius:'3px', borderStyle:"solid", borderWidth:"1px", marginTop:"1vh", marginBottom:'1vh', borderColor:'#065386'}}>
                    <input type='text' id={params.row.id} onChange={updateNoteColor} /*onBlur={updateNotesResults}*/  defaultValue={params.row.note} style={{textAlign:'center', fontSize:'0.9vw', color:params.row.note >10? 'black':'red'}}/>
                </div>
            )}                     
        },
            
    ];
    

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
            
            {(currentUiContext.msgBox.visible == true) && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {currentUiContext.msgBox.msgType == "question" ? t('yes'):t('ok')}
                    buttonRejectText = {t('no')}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            
           
            {(modalOpen==4) && <BackDrop/>}
            {(modalOpen==4) &&
                <div style={{ alignSelf: 'center',position:'absolute', top:'50%', fontWeight:'bolder', color:'#fffbfb', zIndex:'1207',marginTop:'-2.7vh', fontSise:'0.9vw'}}> 
                    {t('loading')}...
                </div>                    
            }
            {(modalOpen==4) &&
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
                { (props.formMode!='consult')?  
                    <div className={classes.formTitle}>
                        {t('saisie_note_eval_M')}  
                    </div>   
                    :      
                    <div className={classes.formTitle}>
                        {t('look_note_eval_M')}  
                    </div>   
                }             
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

                    <div className={classes.gridTitle} style={{marginLeft:"-3.3vw",}}>                  
                        <div className={classes.gridTitleText}>
                            {t('sequence_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optPeriode' onChange={periodeChangeHandler} className={classes.comboBoxStyle} style={{width:'13.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optPeriode||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>
                   
                                
                    <div className={classes.gridAction}> 
                    {(props.formMode!='consult')&&
                        <CustomButton
                            btnText={t('save')}
                            hasIconImg= {true}
                            imgSrc='images/saveToDisk_trans.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={saveNotesHandler}
                            disable={(modalOpen==1||modalOpen==2)}   
                        />
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
                    
                

               
                <div className={classes.gridDisplay} >
                    <StripedDataGrid
                        rows={gridRows}
                        columns={columns}
                        getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : (params.field==='note')?  params.value < (props.noteMax/2) ? classes.gridNoteRedRowStyle : classes.gridNoteRowStyle : classes.gridRowStyle }
                        
                        onCellClick={(params,event)=>{
                            if(event.ignore) {
                                //console.log(params.row);
                                //handlePresence(params.row)
                            }
                        }}  
                        
                        /* onRowDoubleClick ={(params, event) => {
                            if(!event.ignore){
                                event.defaultMuiPrevented = true;
                                consultRowData(params.row);
                            }
                        }}*/
                        
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
                  
            </div>

            { 
                <div className={classes.infoPresence}>
                    <div className={classes.presentZone}>
                        <div> ({t('Notes >= 10')}) : </div>
                        <div> {superieurA10} </div>
                    </div>

                    <div className={classes.absentZone}>
                        <div> ({t('Notes < 10')}) : </div>
                        <div> {inferieureA10} </div>
                    </div>
                </div>
            }
          
        </div>
        
    );
} 
export default SaveNotes;