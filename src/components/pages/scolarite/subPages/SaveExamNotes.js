import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AddStudent from "../modals/AddStudent";
import BackDrop from "../../../backDrop/BackDrop";
import MsgBox from '../../../msgBox/MsgBox';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";
import { srRS } from '@mui/material/locale';
// import Webcam from "react-webcam";
let CURRENT_EXAM_ID;
let CURRENT_EXAM_LABEL;

var admisTAB        = [];
var resultatTAB     = [];
var DefaultMentions = [];

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const MSG_CONFIRM =3;

var listElt ={}

function SaveExamNotes(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid]        = useState(false);
    const [gridRows, setGridRows]      = useState([]);
    const [optMention,setOptMention]   = useState([]);
    const [optMentions,setOptMentions] = useState([]);
    const [modalOpen, setModalOpen]    = useState(0); //0 = close, 1=creation, 2=modif
    const [optExam, setOpExams]        = useState([]);
    
    const tabOuiNon =[
        {value:1, label: t('yes')},
        {value:0, label: t('no') },
    ]
    

    useEffect(()=> {
        if(gridRows.length ==0){
            CURRENT_EXAM_ID = undefined;
        }

        listAppreciations();  
        getEtabListExams();    
    },[]);

    function listAppreciations(){
        console.log("currentAppContext.currentEtab: ",currentAppContext.currentEtab)
        var appreciations = [];
        axiosInstance
        .post(`list-appreciations-notes-exam/`,{id_sousetab: currentAppContext.currentEtab}).then((res)=>{
                res.data.map((appreciation)=>{ appreciations.push({
                    value:appreciation.code, 
                    //value:appreciation.libelle, 
                    label:appreciation.libelle, 
                    minNote:appreciation.min_note, 
                    maxNote:appreciation.max_note
                });
            });
            DefaultMentions = [...appreciations];
            console.log("Liste des appreciations", appreciations);
            setOptMention(appreciations);
        })  
    }


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
        var rang          = 1;
        var formattedList = [];
        var elvSize       = list.length;
        var mentionsTab   = [];
        resultatTAB       = [];
        
        list.map((elt)=>{
            resultatTAB.push({
                idEleve   : elt.id,
                admis     : elt.resultat,
                moyenne   : elt.moyenne == "" ? 0.0 : elt.moyenne,
                mention   : elt.mention == "" ? optMention[0].value : elt.mention,                
            }); 

            if(elt.mention == "")
                mentionsTab.push(DefaultMentions);
            else{
                var tempMentions = [...DefaultMentions];
                var mentionIndex = DefaultMentions.findIndex((mention)=>mention.value == elt.mention);
                var cur_mention  = DefaultMentions.find((mention)=>mention.value == elt.mention);
                tempMentions.splice(mentionIndex,1);
                tempMentions.unshift(cur_mention);

                mentionsTab.push(tempMentions);
            }
        });  
        console.log("mentionsTab: ",mentionsTab)
        setOptMentions(mentionsTab);
      
      
        list.map((elt, index)=>{
            listElt={};

            listElt.rang           = rang; 
            listElt.id             = elt.id;
            listElt.matricule      = elt.matricule;
            listElt.nom            = elt.nom;
            listElt.prenom         = elt.prenom;
            listElt.displayedName  = elt.nom +' '+elt.prenom;
            listElt.admis          = resultatTAB[index].admis;
            listElt.moyenne        = resultatTAB[index].moyenne;
            listElt.mention        = resultatTAB[index].mention;
            listElt.libelle_classe = elt.libelle_classe;
            listElt.id_classe      = elt.id_classe;
        
            formattedList.push(listElt);
            rang ++;
        });

        return formattedList;
    }

    const  getExamCandidats=(examId)=>{
        var listEleves = []
        axiosInstance.post(`list-candidats-examen-officiel/`, {
            id_exam : examId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data.res)]
            console.log("gggg",listEleves);
            setGridRows(listEleves);
          
        })  
    }

    function examChangeHandler(e){       
        if(e.target.value > 0){
            setIsValid(true);
            CURRENT_EXAM_ID = e.target.value; 
            CURRENT_EXAM_LABEL = optExam[optExam.findIndex((nivo)=>(nivo.value == CURRENT_EXAM_ID))].label;
            getExamCandidats(CURRENT_EXAM_ID);
            console.log(CURRENT_EXAM_LABEL)          
        }else{
            CURRENT_EXAM_ID    = undefined;
            CURRENT_EXAM_LABEL = '';
            setGridRows([]);
            setIsValid(false);
        }
    }

    function mentionChangeHandler(e, index){
        resultatTAB[index].mention = e.target.value;

        var tabMentions   = [... optMentions];
        var listMentions  = [... optMentions[index]];

        var mention_index    =  listMentions.findIndex((elt)=>elt.value == e.target.value);
        var selected_mention =  listMentions.find((elt)=>elt.value == e.target.value);
        listMentions.splice(mention_index,1);
        listMentions.unshift(selected_mention);
        tabMentions[index]   = listMentions;
        console.log("Mentions", tabMentions);
        setOptMentions(tabMentions);

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
                getExamCandidats(CURRENT_EXAM_ID);
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
            
            case MSG_CONFIRM:{ 
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                });  
                effectiveResultSave();
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
        switch(chosenMsgBox){
            case MSG_CONFIRM: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                });  
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


    
/*************************** DataGrid Declaration ***************************/  

    const columnsFr = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 33,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'matricule',
            headerName: "MATRICULE",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'displayedName',
            headerName: "NOM(S) ET PRENOM(S)",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
      
        { 
            field: 'admis',
            headerName: "ADMIS ?",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(                    
                    <div style={{display:"flex",flexDirection:"row", marginLeft:"0.87vw"}}>
                        <input  type='checkbox' defaultChecked={resultatTAB[params.row.rang-1].admis} onClick={(e)=>{(e.target.checked) ? resultatTAB[params.row.rang-1].admis = true : resultatTAB[params.row.rang-1].admis = false; console.log("tab",resultatTAB);}}/>
                    </div>                     
                )
            }                      
                
        },
        
        {
            field: 'mention',
            headerName: "MENTION",
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div style={{display:"flex",flexDirection:"row", }}>
                        <select onChange={(e)=>{mentionChangeHandler(e,params.row.rang-1);}}  className={classes.comboBoxStyle} style={{width:'7.3vw'}}>
                            {(optMentions[params.row.rang-1]||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>
                    </div>
                )
            }
        },

        {
            field: 'moyenne',
            headerName: "MOYENNE",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div style={{display:"flex",flexDirection:"row",marginLeft:"1.3vw" }}>
                        <input type="text" style={{width:"3vw", fontSize:"0.9vw"}}  defaultValue={resultatTAB[params.row.rang-1].moyenne} onChange={(e)=>{resultatTAB[params.row.rang-1].moyenne = e.target.value; console.log("moyenne",resultatTAB)}}/>
                    </div>
                )
            }
                
        },
       
    ];

    const columnsEn = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 33,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'matricule',
            headerName: "REG. ID",
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nom',
            headerName: "NAME(S) AND SURNAME(S)",
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        { 
            field: 'admis',
            headerName: "RECEIVED ?",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(                    
                    <div style={{display:"flex",flexDirection:"row", marginLeft:"1.3vw"}}>
                        <input id={params.row.id_seq1} type='checkbox' defaultChecked={resultatTAB[params.row.rang-1].admis} onClick={(e)=>{(e.target.checked) ? admisTAB[params.row.rang-1] = params.row.id : admisTAB[params.row.rang-1] = 0;}}/>
                    </div>                      
                )
            }           
                
        },
        {
            field: 'mention',
            headerName: "MENTION",
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div style={{display:"flex",flexDirection:"row", }}>
                        <select onChange={(e)=>{mentionChangeHandler(e,params.row.rang-1);}}  className={classes.comboBoxStyle} style={{width:'7.3vw'}}>
                            {(optMentions[params.row.rang-1]||[]).map((option)=> {
                                return(
                                    <option  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>
                    </div>
                )
            }
        },
        {
            field: 'moyenne',
            headerName: "SCORE",
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            renderCell: (params)=>{
                return(
                    <div style={{display:"flex",flexDirection:"row",marginLeft:"1.3vw" }}>
                        <input type="text" style={{width:"3vw", fontSize:"0.9vw"}}  defaultValue={resultatTAB[params.row.rang-1].moyenne} onChange={(e)=>{resultatTAB[params.row.rang-1].moyenne = e.target.value; console.log("moyenne",resultatTAB)}}/>
                    </div>
                )
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

    function effectiveResultSave(){
        var id_eleves       = [];
        var mention_eleves  = [];
        var moyennes_eleves = [];
        var elvAdmis = resultatTAB.filter((elt)=>elt.admis == true);

        elvAdmis.map((elt)=>{
            id_eleves.push(elt.idEleve);
            mention_eleves.push(elt.mention);
            moyennes_eleves.push(elt.moyenne)
        });

        console.log("resultats", id_eleves, mention_eleves, moyennes_eleves)

        axiosInstance
        .post(`save-resultat-examen-officiel/`,{
            
            id_exam   : CURRENT_EXAM_ID,           
            id_eleves : id_eleves.join("_"),
            mentions  : mention_eleves.join("_"),
            moyennes  : moyennes_eleves.join("_")
        
        }).then((res)=>{
            chosenMsgBox = MSG_SUCCESS;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_add_M"), 
                message:t("success_add")
            })
        });
    }

    function saveExamResultsHandler(){
        chosenMsgBox = MSG_CONFIRM;
        currentUiContext.showMsgBox({
            visible:true, 
            msgType:"question", 
            msgTitle:t("confirm_M"), 
            message:t("save_changes")
        })   
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

    // const WebcamComponent = () => <Webcam />;

    return (
        <div className={classes.formStyleP}>
            {(currentUiContext.msgBox.visible == true)&& <BackDrop/>}
            {(currentUiContext.msgBox.visible == true)&&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("non")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }

          
            <div className={classes.inputRow}>               
                <div className={classes.formTitle}>
                    {t('save_exam_results_M')}  
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
                            btnText={t('save')}
                            hasIconImg= {true}
                            imgSrc='images/saveToDisk_trans.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={saveExamResultsHandler}
                            disable={(modalOpen==1||modalOpen==2)}   
                        />
                    </div>
                        
                </div>
                    
                

                {(modalOpen==0) ?
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
                            getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                            
                            onCellClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    //handlePresence(params.row)
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
        // <Webcam />
        
    );
} 
export default SaveExamNotes;