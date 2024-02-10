import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate, formatCurrency} from '../../../../store/SharedData/UtilFonctions';
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

var JOUR, MOIS, YEAR, DATE_VERIF;
var tabAbsenceCours;
var listEleves;

var chosenMsgBox;
const MSG_SUCCESS_RECAP =11;
const MSG_WARNING_RECAP =12;
const MSG_ERROR_RECAP   =13;



function RecapSorties(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [total_paye, setTotalPaye]= useState(0);
    const [absent, setAbsent]= useState(0);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const [optClasse, setOpClasse] = useState([]);
    const [optCours, setOpCours] = useState([]);
    const [optDate, setOpDate] = useState([]);
    const [isDateFull, setIsDateFull]=useState(false);
    const[courseSelected, setCourseSelected] = useState(false);
    

    useEffect(()=> {
        currentUiContext.setIsParentMsgBox(false);
        if(gridRows.length ==0){
            CURRENT_CLASSE_ID = undefined;
        }    
        getEtabListClasses();    
    },[]);



    const getEtabListClasses=()=>{
        var tempTable=[{value: '0',      label:(i18n.language=='fr')? "Tous":"All"}];

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

      const  getClassStudentList=(classeId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classeId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data)]
            console.log(listEleves);
            setGridRows(listEleves);
            setTotalPaye(listEleves.length)
            console.log(gridRows);
        })  
        return listEleves;     
    }

    function getStudentWithAbsence(coursId, classeId){
        listEleves = []; tabAbsenceCours=[];
        axiosInstance.post(`list-eleves-absences/`, {
            id_classe: classeId,
            id_cours: coursId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data.eleves)]
            tabAbsenceCours = [...res.data.absences_eleves]
            console.log(listEleves);
            // setGridRows(listEleves);
            // setPresent(listEleves.length)
            console.log(gridRows);
        })  

    }

    function getAbsenceCours(coursId, classeId){     
        if(coursId==0){
            setGridRows([]);
            setTotalPaye(0);
            setAbsent(0); 

        } else{
            getStudentWithAbsence(coursId, classeId);            
        }
    
    }

    function classeChangeHandler(e){       
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value;
           
           
        }else{
            CURRENT_CLASSE_ID = undefined;
            getAbsenceCours(0,CURRENT_CLASSE_ID);

            setCourseSelected(false)
            setIsDateFull(false); 
            JOUR = ''; MOIS = ''; YEAR =''; DATE_VERIF='';
            getAbsenceCours(0, CURRENT_CLASSE_ID);
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
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'presence',
            headerName: "POSTE",
            width: 150,
            editable: false,
            headerClassName:classes.GridColumnStyle,           
              
        },       
       
        {
            field: 'nom',
            headerName: 'NOM(S) ET PRENOM(S)',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'date_naissance',
            headerName: 'MONTANT PAYE',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'lieu_naissance',
            headerName: 'DATE PAIEMENT',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
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
            hide : true,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'presence',
            headerName: "POSITION",
            width: 150,
            editable: false,
            headerClassName:classes.GridColumnStyle,           
              
        },       
       
        {
            field: 'nom',
            headerName: 'NAME(S) ET SURMES(S)',
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'date_naissance',
            headerName: 'SALARY PAID',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'lieu_naissance',
            headerName: 'PAYMENT DATE',
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
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
           // setTotalPaye(present+1);
            setAbsent(absent-1);
        }
        else{
            params.presence = 0;
            //setTotalPaye(present-1);
            setAbsent(absent+1);
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

    function getJourAndCheck(e){
        setGridRows([]);
        JOUR = e.target.value;
        DATE_VERIF = YEAR+'-'+MOIS+'-'+JOUR;
        if(DATE_VERIF.length==10) setIsDateFull(true);
        else setIsDateFull(false);

    }

    function getMoisAndCheck(e){
        setGridRows([]);
        MOIS = e.target.value;
        DATE_VERIF = YEAR+'-'+MOIS+'-'+JOUR;
        if(DATE_VERIF.length==10) setIsDateFull(true);
        else setIsDateFull(false);
    }

    function getYearAndCheck(e){
        setGridRows([]);
        YEAR = e.target.value;
        DATE_VERIF = YEAR+'-'+MOIS+'-'+JOUR;
        if(DATE_VERIF.length==10) setIsDateFull(true);
        else setIsDateFull(false);
    }

    function getStudentCheckList(){
        console.log("les dates",DATE_VERIF,tabAbsenceCours)
        var index ;
        
        if(DATE_VERIF.length==0 ||!((isNaN(DATE_VERIF) && (!isNaN(Date.parse(DATE_VERIF)))))){
           
            chosenMsgBox = MSG_WARNING_RECAP;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"danger", 
                msgTitle:t("error_M"),
                message:t("enter_good_meeting_date")
            }) 
           
        }else{
            if(tabAbsenceCours.find((abs)=>abs.date==DATE_VERIF)==undefined){
                chosenMsgBox = MSG_WARNING_RECAP;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"warning", 
                    msgTitle:t("warning_M"), 
                    message:t("la date fournie ne correspond pas a une date de cours!")
                }) 

            } else {
                var absencesJour = [...tabAbsenceCours.filter((abs)=>abs.date == DATE_VERIF)];
                absencesJour.map((elt1)=>{
                    index = listEleves.findIndex((elt2)=>elt2.id == elt1.eleves[0]);
                    console.log(index)
                    if(index!=undefined && index!=-1) listEleves[index].presence = 0;
                    
                })
                setGridRows(listEleves);
                setTotalPaye(listEleves.length-absencesJour.length);
                setAbsent(absencesJour.length);
            }
        }
    }

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);
                setGridRows([]);
                setTotalPaye(0);
                setAbsent(0);
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

            case MSG_SUCCESS_RECAP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_RECAP :{
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
            <div className={classes.inputRow}>               
                <div className={classes.formTitle}>
                    {t('bilan_paiement_staff_M')}  
                </div>                
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('personnel_M')} :
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
 
                  
                    <div className={classes.gridTitle} style={{marginLeft:"1vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_deb')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                            {/*<select id='optDate' onChange={dateChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optDate||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>*/} 
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourAndCheck} style={{width:'1.3vw', fontSize:'1.17vw', height:'1.3vw', marginLeft:'-2vw', color:'#065386', fontWeight:'bold'}} />/
                                <input id="mois"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisAndCheck} style={{width:'1.4vw', fontSize:'1.17vw', height:'1.3vw', marginLeft:'0vw', color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), null)}}     maxLength={4}     className={classes.inputRowControl }  onChange={getYearAndCheck}style={{width:'2.7vw', fontSize:'1vw', height:'1.17vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold'}}  />
                            </div>  
                            
                                    
                        </div>
                        {isDateFull && <img src={(i18n.language=='fr')? "images/verifier1_trans.png":"images/verifier2_trans.png"} onClick={getStudentCheckList}  style={{width:'7.3vw', height:'6.7vh', marginTop:"-1.13vh", borderRadius:'1vw', marginBottom:(i18n.language=='fr')?'-0.87vh':'-1.3vh'}}/>}
                    </div>

                    <div className={classes.gridTitle} style={{marginLeft:"-3.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('date_fin')} :
                        </div>
                    
                        <div className={classes.selectZone}>
                            {/*<select id='optDate' onChange={dateChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optDate||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>*/} 
                            <div style ={{display:'flex', flexDirection:'row', marginLeft:'2.3vw', marginBottom:'-1vh'}}> 
                                <input id="jour"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getJourAndCheck} style={{width:'1.3vw', fontSize:'1.17vw', height:'1.3vw', marginLeft:'-2vw', color:'#065386', fontWeight:'bold'}} />/
                                <input id="mois"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}      maxLength={2}     className={classes.inputRowControl }  onChange={getMoisAndCheck} style={{width:'1.4vw', fontSize:'1.17vw', height:'1.3vw', marginLeft:'0vw', color:'#065386', fontWeight:'bold'}}/>/
                                <input id="anne"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), null)}}     maxLength={4}     className={classes.inputRowControl }  onChange={getYearAndCheck}style={{width:'2.7vw', fontSize:'1vw', height:'1.17vw', marginRight:'1.3vw', color:'#065386', fontWeight:'bold'}}  />
                            </div>  
                            
                                    
                        </div>
                        {isDateFull && <img src={(i18n.language=='fr')? "images/verifier1_trans.png":"images/verifier2_trans.png"} onClick={getStudentCheckList}  style={{width:'7.3vw', height:'6.7vh', marginTop:"-1.13vh", borderRadius:'1vw', marginBottom:(i18n.language=='fr')?'-0.87vh':'-1.3vh'}}/>}
                    </div>
                    


                   
                                
                    <div className={classes.gridAction}> 
                        {(props.formMode=='appel')?
                            <CustomButton
                                btnText={t('save')}
                                hasIconImg= {true}
                                imgSrc='images/checkp_trans.png'
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
                            columns={(i18n.language =='fr') ? columnsFr : columnsEn}
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
            <div style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"center", color:"black", fontWeight:"800", fontSize:"0.97VW",marginRight:"3vw"}}>
                <div> {t('total_paye_M')} :</div>
                <div style={{marginLeft:"0.3vw"}}> {formatCurrency(total_paye)} FCFA</div>          
            </div>
        </div>
        
    );
} 
export default RecapSorties;