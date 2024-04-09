import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import BackDrop from "../../../backDrop/BackDrop";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ListingNotesTemplate from '../reports/ListingNotesTemplate';
import PDFTemplate from '../reports/PDFTemplate';
import DownloadTemplate from '../../../downloadTemplate/DownloadTemplate';
import {isMobile} from 'react-device-detect';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {createPrintingPages} from '../reports/PrintingModule';
import {convertDateToUsualDate, ajouteZeroAuCasOu, getTodayDate, darkGrey} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


let CURRENT_CLASSE_ID;
let CURRRENT_COURS_ID;
let CURRENT_SEQUENCE_ID;
var CURRENT_CLASSE_LABEL;
var CURRENT_SEQUENCE_LABEL;
var printedETFileName='';


var listEleves;
var listNotes;
var listCours;
var listCoursTitle;
var coursIdTab=[];

var chosenMsgBox;
const MSG_SUCCESS_NOTES =11;
const MSG_WARNING_NOTES =12;
const MSG_ERROR_NOTES   =13;

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

const ROWS_PER_PAGE= 40;
var ElevePageSet=[];

function ListingNotes(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid]       = useState(false);
    const [gridRows, setGridRows]     = useState([]);
    const [present, setPresent]       = useState(0);
    const [absent, setAbsent]         = useState(0);
    const [modalOpen, setModalOpen]   = useState(0); //0 = close, 1=creation, 2=modif
    const [optClasse, setOpClasse]    = useState([]);
    const [optPeriode, setOptPeriode] = useState([]);
    const [tabCours, setTabCours]     = useState([]);
    const [grdCols, setGrdCols]       = useState([]);
    const[imageUrl, setImageUrl] = useState('');
   
    

    useEffect(()=> {
        if(gridRows.length ==0){
            CURRENT_CLASSE_ID = undefined;
        }    

        var cnv = document.getElementById('output');
        while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
        var cnx = cnv.getContext('2d');
        var url = darkGrey(document.getElementById("logo_url").value,cnv,cnx);
        setImageUrl(url);

        getEtabListClasses();    
        getActivatedEvalPeriods(0);
        setGrdCols(columns);
    },[]);

    const imgUrl = document.getElementById("etab_logo").src;
    const imgUrlDefault = imageUrl;

    
    const columns = [
        {
            field: 'id',
            headerName: 'id',
            width: 33,
            editable: false,
            hide:true,
            headerClassName:classes.GridColumnStyle
        },
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
        
    ];


    const getEtabListClasses=()=>{
        var tempTable=[{value: '0',      label:'Choisir une classe'    }];

        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
        console.log(classes)
        let classes_user;
        if(currentAppContext.infoUser.is_prof_only) 
            classes_user = currentAppContext.infoUser.prof_classes;
        else{
            classes_user = currentAppContext.infoUser.admin_classes;
            let prof_classes = currentAppContext.infoUser.prof_classes;
            // console.log(pp_classes)
            prof_classes.forEach(classe => {
                if((classes_user.filter( cl => cl.id === classe.id)).length<=0)
                    classes_user.push({"id":classe.id,"libelle":classe.libelle})

            });
        }

        let n = classes_user.length;
        let m = classes.length;
        let i = 0;
        let j = 0;
       while(i<n){
        j = 0;
        while(j<m){
            if(classes_user[i].id==classes[j].id_classe){
                tempTable.push({value:classes_user[i].id, label:classes_user[i].libelle})
                break;
            }
            j++;
        }
        i++;
       }
       setOpClasse(tempTable); 

    }

    const  getClassStudentList=(classId)=>{
        listEleves = []
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


    const  getStudentsNotes=(classId, periode)=>{
        listNotes = []
        axiosInstance.post(`eleves-notes-sequence/`, {
            id_classe  : classId,
            id_sequence: periode,
            id_sousetab: currentAppContext.currentEtab,
            id_user    : currentAppContext.idUser,

        }).then((res)=>{
            console.log("Notes:",res.data);
            listNotes = [...res.data];
            updateGridCols(listCours);
            updateStudentsNote(listNotes);
        })
    }

    function updateStudentsNote(notes){
        var notesElev;
        var idNote = 'id_note';
        var ch = 'note_';
        console.log("A l'entree",notes);
        if(notes.length>0){
            if(listEleves.length>0){
                listEleves.map((elev)=>{
                    notesElev = notes.filter((noteElv)=>noteElv.eleves[0]==elev.id);
                    console.log("Notes de l'elv", notesElev);
                    if(notesElev!=-1||notesElev!=undefined){
                        notesElev.map((note)=>{
                            idNote = idNote + note.cours[0]; 
                            ch = ch + note.cours[0];
                            if(note.cours[0] == elev[idNote]) {
                                elev[ch] = note.score;
                            }                           
                            idNote = 'id_note'; ch = 'note_';
                        })
                    }
                })

                console.log("eleves updates:",listEleves);
                setGridRows(listEleves);
            }

        } else {
            if(listEleves.length>0){
                listEleves.map((elev)=>{
                    listCours.map((cours)=>{
                        ch = ch + (cours.value);
                        idNote = idNote + (cours.value)
                        elev[idNote] = cours.value;
        
                        elev[ch]='00';
                        ch = 'note_';
                        idNote = 'id_note';
                    })

                })
            }else{
                setGridRows([]);
            }

        }
    }


    function getCoursClasse(sousEtabId, classeId){
        var tabCours = [];
        listCours = [];  
        if(classeId!=0){
            tabCours = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
            tabCours.map((cours)=>{
                listCours.push({value:cours.id_cours, label:cours.libelle_cours});
            })
        }     
        console.log('cours',listCours);            
    }


    function classeChangeHandler(e){       
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value;
            CURRENT_CLASSE_LABEL = optClasse[optClasse.findIndex((classe)=>(classe.value == CURRENT_CLASSE_ID))].label;

            getCoursClasse(currentAppContext.currentEtab, CURRENT_CLASSE_ID);
            console.log("cours ici:",listCours)
            updateGridCols(listCours);
            console.log("colonnes", grdCols);
            getClassStudentList(CURRENT_CLASSE_ID);
            getActivatedEvalPeriods(-1);

        }else{
            CURRENT_CLASSE_ID = undefined;
            getCoursClasse(currentAppContext.currentEtab, 0);
            updateGridCols(listCours)
            getActivatedEvalPeriods(0);
            setGridRows([]);
        }
    }

    function evaluationChangeHandler(e){
        if(e.target.value != optPeriode[0].value){
            CURRENT_SEQUENCE_ID = e.target.value;
            CURRENT_SEQUENCE_LABEL = optPeriode[optPeriode.findIndex((period)=>(period.value == CURRENT_SEQUENCE_ID))].label;
            getStudentsNotes(CURRENT_CLASSE_ID, CURRENT_SEQUENCE_ID); 
            setIsValid(true);           
        } else {
            CURRENT_SEQUENCE_ID = undefined;
            setIsValid(false);
            updateStudentsNote([]);
        }
    }


    const formatList=(list) =>{
        var rang = 1;
        var ch = 'note_';
        var idNote = 'id_note';
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.nom  = elt.nom +' '+elt.prenom;
            listElt.rang = ajouteZeroAuCasOu(rang);            
            listElt.matricule = elt.matricule;
            listCours.map((cours)=>{
                ch = ch + (cours.value);
                idNote = idNote + (cours.value)
                listElt[idNote] = cours.value;

                listElt[ch]='00';
                ch = 'note_';
                idNote = 'id_note';
            })
           
            formattedList.push(listElt);
            rang ++;
        })
        return formattedList;
    }


    function updateGridCols(listCours){
        var gridCols =[...columns];
        var column ={};
        listCoursTitle=[];

        if(listCours.length>0){
            listCours.map((crs, index)=>{
                column = {
                    field: 'note_'+ (crs.value),
                    headerName: crs.label,
                    width: 97,
                    editable: false,
                    headerClassName: classes.GridColumnStyle,
                }

                gridCols.push(column);
                coursIdTab.push(crs.value);
            });
           
        }
       
        gridCols.map((elt, index)=>{if(index!=0) listCoursTitle.push(elt.headerName+'*'+elt.field)});
        setGrdCols(gridCols);
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

        } else {
            setOptPeriode(tempTable); 
        }
        
        if( document.getElementById('optPeriode').options[0]!= undefined)
            document.getElementById('optPeriode').options[0].selected=true;
    }


    const printStudentListingNotes=()=>{
        if(CURRENT_CLASSE_ID != undefined){
            var PRINTING_DATA ={
                dateText          : 'Yaounde, ' + t('le')+' '+ getTodayDate(),
                leftHeaders       : ["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire"],
                centerHeaders     : [currentAppContext.currentEtabInfos.libelle, currentAppContext.currentEtabInfos.devise, currentAppContext.currentEtabInfos.bp+'  Telephone:'+ currentAppContext.currentEtabInfos.tel],
                rightHeaders      : ["Delegation Regionale du centre", "Delegation Departementale du Mfoundi", t("annee_scolaire")+' '+ currentAppContext.activatedYear.libelle],
                pageImages        : [imgUrl], 
                pageImagesDefault : [imgUrlDefault],
                pageTitle         : t("note_recap")+' '+ CURRENT_SEQUENCE_LABEL+" classe : " + CURRENT_CLASSE_LABEL,
                tableHeaderModel  : [...listCoursTitle],
                tableData         : [...gridRows],
                numberEltPerPage  : ROWS_PER_PAGE 
            };
            printedETFileName = 'ListingNotes_' +'('+ CURRENT_CLASSE_LABEL+').pdf';
            setModalOpen(4);
            ElevePageSet=[];           
            ElevePageSet = createPrintingPages(PRINTING_DATA, i18n.language);
            console.log("ici la",ElevePageSet);                    
        } else{
            chosenMsgBox = MSG_WARNING_NOTES;
            currentUiContext.showMsgBox({
                visible  : true, 
                msgType  : "warning", 
                msgTitle : t("warning_M"), 
                message  : t("must_select_class")
            })            
        }      
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

    const closePreview =()=>{
        setIsValid(false);                 
        setModalOpen(0);
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
            {(modalOpen==4) && <BackDrop/>}
            {(modalOpen==4) &&              
                <PDFTemplate previewCloseHandler={closePreview}>
                    {isMobile?
                        <PDFDownloadLink  document ={<ListingNotesTemplate pageSet={ElevePageSet}/>} fileName={printedETFileName}>
                            {({blob, url, loading, error})=> loading ? "": <DownloadTemplate fileBlobString={url} fileName={printedETFileName}/>}
                        </PDFDownloadLink>
                        :
                        <PDFViewer style={{height: "80vh" , width: "100%" , display:'flex', flexDirection:'column', justifyContent:'center',  display: "flex"}}>
                            {<ListingNotesTemplate pageSet={ElevePageSet}/>}
                        </PDFViewer>
                    }
                </PDFTemplate>
            } 

            <div className={classes.inputRow}>  
                <div className={classes.formTitle}>
                    {t('look_note_eval_M')}  
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


                    <div className={classes.gridTitle} style={{marginLeft:"-3.3vw",}}>                  
                        <div className={classes.gridTitleText}>
                            {t('sequence_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optPeriode' onChange={evaluationChangeHandler} className={classes.comboBoxStyle} style={{width:'13.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optPeriode||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>
                   
                                
                    <div className={classes.gridAction}> 
                    {/*(props.formMode!='consult')&&
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
                            */}
                         

                        <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={printStudentListingNotes}
                            disable={isValid==false}   
                        />

                    </div>
                        
                </div>
                    
                

                
                <div className={classes.gridDisplay} >
                    <StripedDataGrid
                        rows={gridRows}
                        columns={(grdCols.length==0)? columns:grdCols}
                        getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : (!isNaN(params.value) && (params.field != 'rang'))?  params.value < 10 ? classes.gridNoteRedRowStyle : classes.gridNoteRowStyle : classes.gridRowStyle }
                        
                        /*onCellClick={(params,event)=>{
                            if(event.ignore) {
                                //console.log(params.row);
                                handlePresence(params.row)
                            }
                        }}*/  
                        
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
          
        </div>
        
    );
} 
export default ListingNotes;