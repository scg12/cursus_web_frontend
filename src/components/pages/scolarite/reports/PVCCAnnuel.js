import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import fontBold from "../../../../fonts/timesBold.ttf";
import fontItalic from "../../../../fonts/timesItalic.ttf";
import Filigrane from "../../../filigrane/Filigrane";
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

function PVCCAnnuel(props){
    const { t, i18n } = useTranslation();

    function getNextClassLabel(nextClasseId){
        var nextClasse = props.pageSet.nextClasses.find((elt)=>elt.value == nextClasseId);
        if(nextClasse!=undefined) return nextClasse.label;
        else return '';
    }



    const PageHeadLeft = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.leftHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10}}>{props.page.leftHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.leftHeaders[2]}</Text>
            </View>
        );
    }

    const PageHeadRight = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.rightHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.rightHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.rightHeaders[2]}</Text>
            </View>
        );
    }

    
    const PageHeadCenter = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontFamily:"MyBold", fontSize:12, textTransform:'uppercase', fontWeight:'heavy'}}>{props.page.centerHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:12}}>{props.page.centerHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:8.7}}>{props.page.centerHeaders[2]}</Text>
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

    const TableHeader = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontSize:12, width:"17vw", textAlign:'left'   }}>  {t('form_nom')}           </Text>
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify' }}>  {t('form_dateNaiss')}     </Text>
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify' }}>  {t("form_lieuNaiss")}     </Text>
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify' }}>  {t("form_lieuNaiss")}     </Text>
                <Text style={{fontSize:12, width:"3vw", textAlign:'justify' }}>  {t("redoublant")}         </Text>
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify' }}>  {t("decision_conseil")}   </Text> 
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify' }}>  {t("promotion")}          </Text>  
            </View>
        );
    }

    const TableRow = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontSize:12, width:"17vw", textAlign:'left'   }}> {eleve.nom}                                                           </Text>  
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify' }}> {eleve.date_naissance}                                                </Text>
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify' }}> {eleve.lieu_naissance}                                                </Text>
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify' }}> {eleve.redouble}                                                      </Text>
                <Text style={{fontSize:12, width:"3vw", textAlign:'justify' }}> {12/*eleve.moyenne*/}                                                 </Text>
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify', fontFamily:"MyBold"}}>{props.elevesDecisions[index]}                     </Text>
                <Text style={{fontSize:12, width:"7vw", textAlign:'justify', fontFamily:"MyBold"}}>{getNextClassLabel(props.elevesPromotions[index])} </Text>              
           </View>
        );        

    }

   

    return (
        <Document>
         { Array.from(props.pageSet,
          (el, index) => (
            <Page size="A4"  style={styles.page} key={index}>
                <Filigrane photoStyle ={{width:"76vw", height:"70vw"}} style={{zIndex:0}} />                    
                <View style={styles.header}>
                    <PageHeadLeft  style={styles.headerLeft}   page={el}   />
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={el.pageImages[0]}/>
                    <PageHeadRight style={styles.headerRight}  page={el}  />                                     
                </View>
                
                <PageHeadCenter style={styles.headerCenter} page={el}/>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateStyle}>{el.dateText}</Text>
                </View>
                
                <View style={styles.pageTitleContainer}>
                    <Text style={styles.titleStyle}>{el.pageTitle}</Text>
                </View>

                
               
                <View style={styles.main}>
                    <TableHeader style={styles.headerColumnStyle} page={el}/>
                   { Array.from(el.pageRows,
                        (row, index) => (
                            <TableRow style={styles.row} eleve={row}/>
                        ))
                   } 
                </View>
              
                <View style={styles.footer}> 
                    <Text>{el.pageNumber} / {props.pageSet.length}</Text> 
                </View>    
            </Page>
          ))}
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
        height: '7%',
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
        width:'12vw',
        height:'11vw',
        borderRadius:3
    },

    headerCenter:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        marginBottom:"2vh",
        height:"4.7%",
        width:'100%',
        borderBottom: "2px solid black",       
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
        height:'2%',
        borderBottom: "1.3px solid black",
        marginBottom:"3vh",       
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
        width:'87%',
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
        width:'87%',
        justifyContent:'space-evenly',
        alignItems:"center",
        borderLeftStyle :"solid",
        borderRightStyle:"solid",
        borderBottomStyle:"solid",
        borderTopStyle:"none",
        borderLeftWidth:1,
        borderRightWidth:1,
        borderBottomWidth:1,
    }, 

    main: {
        display:"flex",
        justifyContent:"flex-start",
        alignItems:"center",
        textAlign: "center",
        /*backgroundColor: "white",*/
        height: "70%",
        width: "100%",
        color:'black',
    },
    
    footer: {
        textAlign: "center",
        height: "3.3%",
        width: "100%",
        color: "black",
        fontSize:9
    },

    
   /* text: {
      margin: 12,
      fontSize: 12,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },*/
  
  });

export default PVCCAnnuel;