import React from "react";
import { useContext, useState, useEffect} from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import {isMobile} from 'react-device-detect';
import fontBold from "../../../../fonts/timesBold.ttf";
import fontItalic from "../../../../fonts/timesItalic.ttf";
import { useTranslation } from "react-i18next";
import '../../../../translation/i18n';



Font.register({
    family: "MyBold",
    // fontWeight: '1200', 
    src: fontBold 
  });
  Font.register({
    family: "MyItalic",
    src: fontItalic 
  });

var pageSet = [];

var page = {
    dateText:'',
    leftHeaders:[],
    rightHeaders:[],
    centerHeaders:[],
    pageImages:[],
    pageTitle:'',
    tableHeaderModel:[],
    pageRows:[],
    pageNumber:0,
};

var TAB_VALEURS_PAUSE=[];

function ETTemplate(props){
    const { t, i18n } = useTranslation();
    const [valeurHoraires, setValeurHoraire] = useState([]);
    const [listeJours, setListeJours] = useState([]);
    const [emploisTemps, setEmploiDeTemps] = useState([]);
    const [matiereList, setMatierelist] = useState([]);
    const [profList, setProfList] = useState([]);
    const [isClassET, setIsClassET] = useState(false);
    const [classesET, setClassesET]= useState([])

    
    useEffect(()=> {        
        TAB_VALEURS_PAUSE = createValeurPause()        
        console.log('Liste valeur pause',TAB_VALEURS_PAUSE)
        setValeurHoraire(props.pageSet.valeurHoraires);
        setListeJours(props.pageSet.ListeJours);
        setEmploiDeTemps(props.pageSet.emploiDeTemps);
        setMatierelist(props.pageSet.matieres);
        setProfList(props.pageSet.profs)
        setIsClassET(props.pageSet.isClassET);
        setClassesET(props.pageSet.classesET)
    },[]);
    


    /*------------------------------JS Functions-------------------------------------*/
    function calculMarge(creneau){
        var heure,marge, tabHeureDeb;
        let minutes = calculDureePause(props.pageSet.intervalleMaxTranche)
        tabHeureDeb = creneau.split('_');
        heure = tabHeureDeb[0].split('h');
        // marge = (Evaluate(heure[1])*60/(currentUiContext.TAB_PERIODES.length))/60;
        marge = (Evaluate(heure[1])*90/minutes);
        return Math.floor(marge);
    }

    function computePauseDivSize(dureePauseEnMinutes){
        let minutes = calculDureePause(props.pageSet.dureePause)
        return Math.floor(dureePauseEnMinutes*90/minutes);
        // return Math.floor(dureePauseEnMinutes*60/(currentUiContext.TAB_PERIODES.length))/60;
    }

    function calculDureePause(creneau){
        var tabHeure, tabHeureDeb,tabHeureFin;
        var dureePause=[];
        tabHeure = creneau.split('_');
        tabHeureDeb = tabHeure[0].split('h');
        tabHeureFin = tabHeure[1].split('h');
        // console.log("calculDureePause: ",tabHeureDeb, tabHeureFin);
        tabHeureDeb[0] =Evaluate(tabHeureDeb[0]);
        tabHeureDeb[1] =Evaluate(tabHeureDeb[1]);
        tabHeureFin[0] =Evaluate(tabHeureFin[0]);
        tabHeureFin[1] =Evaluate(tabHeureFin[1]);
        if( tabHeureDeb[0]==tabHeureFin[0]){
            dureePause.push(0);
            dureePause.push(tabHeureFin[1] - tabHeureDeb[1]);
        }else{
            if(tabHeureDeb[1]==tabHeureFin[1]){
                dureePause.push((tabHeureFin[0] -  tabHeureDeb[0]))
                dureePause.push(0); 
            } else{
                dureePause.push(tabHeureFin[0] -  (tabHeureDeb[0]+1));
                dureePause.push((60-tabHeureDeb[1])+tabHeureFin[1]);
            }           

        }
        
        return ((dureePause[0]*60)+ dureePause[1]);
    }

    function Evaluate(val){
        if(val==''||val==' '|| isNaN(val)) return 0;
        else return eval(val);
    
    }

    function createValeurPause(){
        var tabValeurPauses = [];
        var cur_pause=[];
        //currentUiContext.TAB_CRENEAU_PAUSE
        props.pageSet.tabCreneauPause
        .map((pause)=>{cur_pause = pause.split('_');
            tabValeurPauses.push(cur_pause[0]);
            tabValeurPauses.push(cur_pause[1])
        })

        console.log(tabValeurPauses);
        return tabValeurPauses;
    }

    function isValeurPause(valeur){
        if(TAB_VALEURS_PAUSE.findIndex((pause)=>pause==valeur)<0) return false
        else return true; 

    }

    function getMatiere(jourId, tranche){
        var ETJourTab = emploisTemps.filter((et)=>et.id_jour==jourId);
        if(ETJourTab!= undefined){
            var ETJourTranche = ETJourTab.find((et)=> et.libelle == tranche)
            if (ETJourTranche!= undefined){
                var matiereId = ETJourTranche.id_matiere;
                var matiere = matiereList.find((mat)=>mat.codeMatiere == matiereId);
                if (matiere != undefined) return matiere.libelleMatiere;
                else return '';
            } else return ''
        }else return ''
    }

    function getProf(jourId, tranche){
        var ETJourTab = emploisTemps.filter((et)=>et.id_jour==jourId);
        if(ETJourTab!= undefined){
            var ETJourTranche = ETJourTab.find((et)=> et.libelle == tranche)
            if (ETJourTranche!= undefined){
                var profsId = ETJourTranche.id_enseignants;
                if(profsId != undefined || profsId.length != 0){
                    var listNomProfs='';
                    var listProf = [...profList.filter((prof)=> profsId.includes(prof.id))];
                    console.log('profstab',listProf)
                    listProf.map((prof)=>{listNomProfs += prof.nom +' '+ prof.prenom[0]+'.'+' '});
                    return listNomProfs;
                }
                else return '';
            } else return ''
        }else return ''
    }

    function getProfClass(jourId, tranche){
        var ETJourTab = emploisTemps.filter((et)=>et.id_jour==jourId);
        if(ETJourTab!= undefined){
            var ETJourTranche = ETJourTab.find((et)=> et.libelle == tranche)
            if (ETJourTranche!= undefined){
                var classeId = ETJourTranche.id_classe;
                if(classeId != undefined || classeId.length != 0){
                    var nomClass='';
                    nomClass = classesET.find((elt)=>elt.id == classeId).libelle;
                    return nomClass;
                }
                else return '';
            } else return ''
        }else return ''

    }

/*------------------------------JSX Functions-------------------------------------*/
    const PageHeadLeft = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:11, textTransform:"uppercase"}}>{props.page.leftHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:11}}>{props.page.leftHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:11, textTransform:"uppercase"}}>{props.page.leftHeaders[2]}</Text>
            </View>
        );
    }

    const PageHeadRight = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:11, textTransform:"uppercase"}}>{props.page.rightHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:11, textTransform:"uppercase"}}>{props.page.rightHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:11, textTransform:"uppercase"}}>{props.page.rightHeaders[2]}</Text>
            </View>
        );
    }

    
    const PageHeadCenter = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontFamily:"MyBold", fontSize:14, textTransform:'uppercase', fontWeight:'heavy', marginTop:'-0.57vh'}}>{props.page.centerHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:12.5, marginBottom:'0.57vh',marginTop:'0.37vh', fontFamily:"MyItalic"}}>{props.page.centerHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:8.7, marginBottom:'0.77vh'}}>{props.page.centerHeaders[2]}</Text>
            </View>
        );
    }


    const PageLOGO = (props) =>{
        return(
            <View style={props.style}>
                <Image style={props.imagestyle} src={props.imageSrc}/>
            </View>                           
        );
    }

    const LigneValeur = (props) =>{
        return(
            <View style={styles.ligneValeur}>
                { Array.from(props.valeurHoraires,  (hour, index) => (                  
                    index<props.valeurHoraires.length &&
                    <View style={{display:'flex',flexDirection:'row', width:computePauseDivSize(calculDureePause(props.valeurHoraires[index]+"_"+props.valeurHoraires[index+1]))+'vw'}}>
                        {index%2==0&&<Text style={{fontSize:isValeurPause(props.valeurHoraires[index]) ? '0.63vw':'1vw', fontWeight: '700', marginLeft:'-5px', color:isValeurPause(props.valeurHoraires[index]) ? '#5d5d5e': 'black'}}>{props.valeurHoraires[index]}</Text>}
                        {index%2==1&&<Text style={{fontSize:isValeurPause(props.valeurHoraires[index]) ? '0.63vw':'1vw', fontWeight: '700', marginLeft:'5px',  color:isValeurPause(props.valeurHoraires[index]) ? '#5d5d5e': 'black'}}>{props.valeurHoraires[index]}</Text>}
                    </View>                       
                ))}  
            </View>
        );
    }

    const Jour = (props) =>{
        return (
            <View id={props.id} style={styles.jour}> 
                <Text>{props.jourName}</Text>
           </View>
        );
    }

   
   

    return (
        <Document>        
            <Page size="A4"  orientation='landscape' style={styles.page} >
                <View style={styles.header}>
                    <PageHeadLeft  style={styles.headerLeft}   page={props.pageSet}   />
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={props.pageSet.pageImages[0]}/>
                    <PageHeadRight style={styles.headerRight}  page={props.pageSet}  />                                     
                </View>
                
                <PageHeadCenter style={styles.headerCenter} page={props.pageSet}/>
               
                <View style={styles.pageTitleContainer}>
                    <Text style={{fontFamily:"Times-Roman", fontFamily:"MyBold", fontSize:13, textTransform:'uppercase', fontWeight:'heavy'}}>{props.pageSet.pageTitle}</Text>
                </View>
                
                <View style={styles.main}>
                    <LigneValeur valeurHoraires={valeurHoraires}/>
                
                    { Array.from( listeJours,                        
                        (jour, indjour) =>(
                             
                            <View id={jour.id} style={jour.numero_jour==1 ? styles.ligneDebut :jour.numero_jour==5? styles.ligneFin : styles.ligne}> 
                                <Jour jourName={t(jour.libelle)}/>
                                {Array.from(  props.pageSet.ListePeriodes,                        
                                    (periode,index) => (
                                        (periode.duree.includes('B_'))?
                                            <View style={{...styles.DroppableZone, width:computePauseDivSize(calculDureePause(periode.duree.substring(2)))+'vw'}}>
                                                <View style={styles.pauseZone}></View>
                                            </View>
                                            :
                                            props.pageSet.ListeJours[indjour].tranches[index]==1?
                                                <View style={{...styles.DroppableZone,width:computePauseDivSize(calculDureePause(periode.duree))+'vw'}}>
                                                    <View
                                                        id={jour.id+'_'+periode.duree}
                                                        style={{...styles.droppableDivstyle,/*marginLeft:calculMarge(periode.duree.substring(2))+'vw', */}}
                                                    >
                                                        
                                                        <Text style={{color:'black', fontSize:'1vw', textAlign:'center'}}>{getMatiere(jour.id,periode.duree)}</Text>
                                                    </View>
                                                    <View
                                                        id={'P_'+jour.id+'_'+periode.duree}
                                                        style={styles.ProfDroppableDivstyle}
                                                    >
                                                        <Text style={{color:'black', fontSize:'1vw', textAlign:'center'}}>{isClassET? getProf(jour.id,periode.duree):getProfClass(jour.id,periode.duree)}</Text>
                                                    </View>
                                                </View>
                                            :
                                                <View style={{...styles.DroppableZone,width:computePauseDivSize(calculDureePause(periode.duree))+'vw'}}>
                                                    <View style={styles.pauseZone}/>
                                                </View>
                                    
                                        )
                                    )
                                   
                                        
                                }  
                                    
                            </View>       
                        )
                    )}
                    
                    {!isClassET && <Text style={{fontFamily:"Times-Roman", fontFamily:"MyBold", fontSize:12, textTransform:'uppercase', fontWeight:'heavy', marginTop:'3vh'}}>NOMBRE TOTAL D'HEURES : {props.pageSet.nbreHeures} {(props.pageSet.nbreHeures > 1) ? "HEURES":"HEURE" }</Text>}
                </View>
                
                <View style={styles.footer}> 
                    <Text>{1} / {1}</Text> 
                </View>    
            </Page>
          
        </Document>
    );
}

const styles = StyleSheet.create({
    page: {
      margin: 0,
      /*textAlign: "justify",
      fontFamily: "Times-Roman",*/
      display: "flex",
      flexDirection: "column",
      justifyContent:'center',
      alignItems:'center',
      width: "98vw",
      height: "100%",  
     
    },

    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignSelf:'flex-start',
        height:  '7%',
        width: "100%",      
    },

    headerLeft:{
        textAlign:'center',
        display: "flex",
        flexDirection: "column",
        justifyContent:'flex-start',
        /*alignItems:'flex-start',*/
        marginTop:"0vh",
        alignSelf:'flex-start',
        /*marginLeft:"-1vw",*/
        width: "43%",
        
    },

    headerRight:{
        textAlign:'center',
        display: "flex",
        flexDirection: "column",
        justifyContent:'flex-end',
        alignItems:'center',
        marginTop:"0vh",
        alignSelf:'flex-start',
        width: "43%",
    },

    pageLogoContainer:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
       
        marginTop:"0vh",
        alignSelf:'flex-end',
        width: "14%",
    },

    imagestyle:{
        width:'13vh',
        height:'12vh',
        borderRadius:3
    },

    headerCenter:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        marginBottom:"2vh",
        height:"4.97%",
        width:'100%',
        borderBottom: "1px solid black",       
    },

    headerCenter1:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        marginBottom:"2vh",
        height:"4vh",
        color:'black',
        width:'100%',
        borderBottom: "1px solid black",      

    },

    dateContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent:'flex-end',
        alignItems:'center',
        width:'97%'
    },

    dateStyle:{
        fontSize:10,
        fontFamily: "Times-Roman",
    }, 

   
    pageTitleContainer:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        width:'auto',
        height:'4vh',
        borderBottom: "1.3px solid black",
        marginBottom:"2vh",       
    },

    titleStyle:{
        fontSize:12,
        fontWeight:'ultrabold',
        textTransform:'uppercase',
        fontFamily:"Times-Roman",
    },

    headerColumnStyle:{
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems:'center',
        width:'97%',
        height:'2.7vh',
        backgroundColor:'rgb(6, 83, 134)',
        textTransform:'uppercase',
        fontSize:8,
        fontWeight:'heavy',
        color:'white'
    },

    Pageheader:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-start',
        marginBottom:'1.7vh',
        marginLeft:'1.7vw'
    },

   
    headercell:{      
        height:'15px',  
        display:"flex", 
        alignItems:'center', 
        flexDirection:"row", 
        fontFamily: "Times-Roman"
    },

    cell:{
        height:'15px',
        display:"flex", 
        alignItems:'center', 
        flexDirection:"row",                 
    },

    row:{
        display: "flex",
        flexDirection: "row",
        fontSize:9,
        color:'black',
        justifyContent:'space-evenly',
        alignItems:"center"
    }, 

    main: {
        display: "flex",
        flexDirection: "column",
        fontSize:9,
        color:'black',
        justifyContent:'flex-start',
        alignItems:"center",
        //textAlign: "center",
        backgroundColor: "white",
        height: "70%",
        width: "97%",
        color:'black',
        paddingLeft:'2vw'
    },
    
    footer: {
        textAlign: "center",
        height: "3.3%",
        width: "100%",
        color: "black",
        fontSize:9
    },

    
    grille: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: 'flex-start',
    },

    ligne:{
        width:'90vw',
        height:'7.7vh',
    
        display:'flex',
        flexDirection: 'row',
        justifyContent:'flex-start',
        
    
        borderTopStyle:"solid",
        borderTopWidth: "1.3px",
    
        borderLeftStyle:"solid",
        borderLeftWidth: "1.3px",
    
        borderRightStyle: "solid",
        borderRightWidth:"1.3px",
    },
    
    ligneDebut:{
        width:'90vw',
        height:'7.7vh',
    
        display:'flex',
        flexDirection: 'row',
        justifyContent:'flex-start',
    
        borderTopStyle:"solid",
        borderTopWidth: "1.3px",
    
        borderLeftStyle:"solid",
        borderLeftWidth: "1.3px",
    
        borderRightStyle: "solid",
        borderRightWidth:"1.3px",

        
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
    },
    
    ligneFin:{
        width:'90vw',
        height:'7.7vh',
    
        display:'flex',
        flexDirection: 'row',
        justifyContent:'flex-start',

        borderStyle:"solid",
        borderWidth: "1.3px",
    
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px',
    },

    ligneValeur:{
        width:'83vw',
        height:'10vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'flex-start',
        marginLeft: '7vw',
        marginBottom:'-8.3vh',
        fontSize: '1.37vh',   
    },

    jour : {
        padding: '3px',
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: '7vw',
        height: '7.7vh',   
       
        fontSize: '0.93vw',
        fontWeight: '400',  
        alignItems: 'center',
        marginRight: '1px',
    
        backgroundColor: 'rgb(107, 106, 106)',
        color:'white',
        
        borderBottomStyle: 'solid',  
        borderBottomWidth: '2.7px',
        borderBottomColor: 'black',
    
        borderRightStyle: 'solid',
        borderRrightWidth: '2.7px',
        borderRightColor:'black',   
        
    },

    matiereTitleStyle:{
        fontSize: '0.78vw',
        fontWeight: '700',
        width: '4.3vw',
        color: 'white',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis', 
    },

    droppedMatiereStyle: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        borderStyle: 'solid',
        fontSize:'0.8vw',
        fontWeight:'100',
        height: '3.3vh',
        width:'100%',
        borderWidth:'1.3px',
        borderRadius:'3px',
        marginRight:'0.27vw',
        color:'white',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
       
    },

    pauseZone :{
        //backgroundColor:'#ee2929',
        backgroundColor:'lightgrey',  
        //background:'repeating-linear-gradient( 45deg,white 0px,white 2px, #ee2929 2px,#ee2929  4px )' ,
        height:'100%',
        width:'100%',
        borderLeftStyle: 'solid',
        borderLeftWidth: '1px',
        borderLeftColor: 'grey',
    
        borderRightStyle: 'solid',
        borderRightWidth:  '1px',
        borderRightColor:'grey',    
    },

    DroppableZone: {
        display : 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    droppableDivstyle: {
        width:'100%',
        height: '6.7vh',
        display:'flex',
        justifyContent: 'center',
    
        //borderBottomStyle: 'solid',
        //borderBottomWidth: '1px',
        
        borderBottomStyle: 'none',
       
    
        borderRightStyle:'solid',
        borderRightWidth: '1px',  
        backgroundColor: "white",
        //backgroundColor: "rgb(247, 243, 240)",

    },

    ProfDroppableDivstyle: {       
        width:'100%',
        height: '8vh',
        display:'flex',
        justifyContent: 'center',


        borderTopStyle: 'none',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',  
    
        borderRightStyle: 'solid',
        borderRightWidth: '1px',  
        //backgroundColor: 'rgb(174, 187, 201)', 
        backgroundColor: 'white', 
    }
   
});

export default ETTemplate;