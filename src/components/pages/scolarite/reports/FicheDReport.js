import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
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
  
};

function FicheDReport(props){
    const { t, i18n } = useTranslation();


    const PageHeadLeft = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.leftHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10}}>{props.data.leftHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.leftHeaders[2]}</Text>
            </View>
        );
    }

    const PageHeadRight = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.rightHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.rightHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.rightHeaders[2]}</Text>
            </View>
        );
    }

    
    const PageHeadCenter = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontFamily:"MyBold", fontSize:12, textTransform:'uppercase', fontWeight:'heavy'}}>{props.data.centerHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:12}}>{props.data.centerHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:8.7}}>{props.data.centerHeaders[2]}</Text>
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

    const AbsenceHeader = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'5vw',  justifyContent:'flex-start',...styles.headercell}}>      <Text>{props.data.absencesHeaderModel[0]}</Text></View>
                <View style={{width:'10vw', justifyContent:'flex-start',...styles.headercell}}>   <Text>{props.data.absencesHeaderModel[1]}</Text></View>
                <View style={{width:'37vw', paddingLeft:'3vw', justifyContent:'flex-start',...styles.headercell}}>  <Text>{props.data.absencesHeaderModel[2]}</Text></View>
                <View style={{width:'8vw',  justifyContent:'flex-end',...styles.headercell}}>   <Text>{props.data.absencesHeaderModel[3]}</Text></View>
            </View>
        );
    }

    const AbsenceRow = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'5.7vw',  paddingLeft:'1.3vw', justifyContent:'center',...styles.cell}}>       <Text >{props.row.date}        </Text></View>
                <View style={{width:'10vw', justifyContent:'center',...styles.cell}}>       <Text >{props.row.nb_heures}   </Text></View>
                <View style={{width:'37vw', justifyContent:'flex-start',...styles.cell}}>  <Text >{props.row.justifie}         </Text></View>
                <View style={{width:'8vw',  justifyContent:'flex-start',...styles.cell}}>   <Text >{props.row.non_justifie}        </Text></View>               
           </View>
        );        

    }

    const SanctionHeader = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'5vw',  justifyContent:'flex-start',...styles.headercell}}>   <Text>{props.data.sanctionsHeaderModel[0]}</Text></View>
                <View style={{width:'10vw', justifyContent:'flex-start',...styles.headercell}}>   <Text>{props.data.sanctionsHeaderModel[1]}</Text></View>
                <View style={{width:'37vw', paddingLeft:'3vw', justifyContent:'flex-start',...styles.headercell}}>  <Text>{props.data.sanctionsHeaderModel[2]}</Text></View>
            </View>
        );
    }

    const SanctionRow = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'10vw', justifyContent:'center',...styles.cell}}>      <Text>{props.row.date}   </Text></View>
                <View style={{width:'37vw', justifyContent:'flex-start',...styles.cell}}>  <Text> {props.row.libelle}         </Text></View>
                <View style={{width:'8vw',  justifyContent:'flex-start',...styles.cell}}>  <Text>{props.row.duree}{props.row.unite} </Text></View>               
           </View>
        );        

    }


    const Photo = (props) =>{
        return(            
            <Image style={props.photoStyle} src={props.imageSrc}/>                                    
        );
    }

    const EleveInfo = (props) =>{
        return(
            <View style={{display:"flex", flexDirection:"row", width:"80%"}}>
                <Photo photoStyle ={styles.photoStyle} imageSrc={'images/profile.png'}/>
                <View style={{display:"flex", flexDirection:"column"}}>
                    <Text>{props.eleve.nom}</Text>
                    <Text>{props.classeLabel}</Text>
                    <Text>{props.eleve.age}</Text>
                </View>
                <View style={{display:"flex", flexDirection:"column"}}>
                    <Text>{props.eleve.matricule}</Text>
                    <Text>{props.eleve.redouble}</Text>
                </View>
                {/* <View style={{width:'5.7vw',  paddingLeft:'1.3vw', justifyContent:'center',...styles.cell}}>       <Text >{props.eleve.rang}        </Text></View>
                <View style={{width:'10vw', justifyContent:'center',...styles.cell}}>       <Text >{props.eleve.matricule}   </Text></View>
                <View style={{width:'37vw', justifyContent:'flex-start',...styles.cell}}>  <Text >{props.eleve.nom}         </Text></View>
                <View style={{width:'8vw',  justifyContent:'flex-start',...styles.cell}}>   <Text >{props.eleve.note}        </Text></View>                */}
           </View>
        );        

    }


   

    return (
        <Document>
        
            <Page size="A4"  style={styles.page} key={1}>
                <View style={styles.header}>
                    <PageHeadLeft  style={styles.headerLeft}  data={props.pageSet}   />
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={props.pageSet.pageImages[0]}/>
                    <PageHeadRight style={styles.headerRight} data={props.pageSet}  />                                     
                </View>
                
                <PageHeadCenter style={styles.headerCenter} data={props.pageSet}/>
                
                
                <View style={styles.pageTitleContainer}>
                    <Text style={styles.titleStyle}>{props.pageSet.pageTitle}</Text>
                </View>

                <View style={styles.eleveInfoContainer}>
                    <EleveInfo eleve={props.pageSet.eleveInfo} classeLabel={props.pageSet.classeLabel}></EleveInfo>
                </View>

                <AbsenceHeader style={styles.headerColumnStyle} data={props.pageSet}/>
               
                <View style={styles.main}>
                   { Array.from(props.pageSet.absencesData,
                        (absence, index) => (
                            <AbsenceRow style={styles.row} row={absence}/>
                        ))
                   } 
                </View>


                <SanctionHeader style={styles.headerColumnStyle} data={props.pageSet}/>
               
                <View style={styles.main}>
                   { Array.from(props.pageSet.sanctionsData,
                        (sanction, index) => (
                            <SanctionRow style={styles.row} row={sanction}/>
                        ))
                   } 
                </View>
              
                <View style={styles.footer}> 
                    <Text>{1} / {props.pageSet.length}</Text> 
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

    photoStyle:{
        width:'10vw',
        height:'10vw',
        borderRadius:3
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
        justifyContent:'space-evenly',
        alignItems:"center"
    }, 

    main: {
        textAlign: "center",
        backgroundColor: "white",
        height: "70%",
        width: "97%",
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

export default FicheDReport;