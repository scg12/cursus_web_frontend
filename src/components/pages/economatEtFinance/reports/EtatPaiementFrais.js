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

function StudentListTemplate(props){
    const { t, i18n } = useTranslation();


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
                <View style={{width:'5vw',   marginLeft:"-1.7vh",justifyContent:'center',...styles.headercell}}><Text>{props.page.tableHeaderModel[0]}</Text></View>
                <View style={{width:'10vw',   marginLeft:"-2.7vh", justifyContent:'flex-start',...styles.headercell}}><Text>{props.page.tableHeaderModel[1]}</Text></View>
                <View style={{width:'23vw',  marginLeft:"-2vh", justifyContent:'flex-start',...styles.headercell}}><Text>{props.page.tableHeaderModel[2]}</Text></View>
                <View style={{width:'12vw',  marginLeft:"-1.3vh", justifyContent:'flex-start',...styles.headercell}}><Text>{props.page.tableHeaderModel[3]}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.headercell}}><Text>{props.page.tableHeaderModel[4]}</Text></View>
                <View style={{width:'12vw', marginLeft:"-3vh", justifyContent:'flex-start', ...styles.headercell}}><Text>{props.page.tableHeaderModel[5]}</Text></View>
                {/* <View style={{width:'12vw',  justifyContent:'center',...styles.headercell}}>  <Text>{props.page.tableHeaderModel[6]}</Text></View> */}
            </View>
        );
    }

    const TableRow = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'5vw', justifyContent:'center',...styles.cell}}><Text>{props.eleve.rang}</Text></View>
                <View style={{width:'10vw', marginLeft:"-2vw", justifyContent:'center',...styles.cell}}><Text>{props.eleve.matricule}</Text></View>
                <View style={{marginLeft:"2vw",width:'23vw', justifyContent:'flex-start',...styles.cell}}><Text>{props.eleve.displayedName}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.cell}}><Text>{props.eleve.displayedMontantPaye} </Text></View>
                <View style={{width:'12vw', justifyContent:'center',...styles.cell}}><Text>{props.eleve.displayedMontantRestant}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start', ...styles.cell}}> <Text>{props.eleve.displayedMontantToPay}</Text></View>
           </View>
        );        

    }

    const Resumer = (props) =>{
        return(
            <View style={{display:"flex", flexDirection:"row", fontFamily:"Times-Roman", justifyContent:"center", alignItems:"center", width:"100%", height:"2.3vh",fontSize:10, fontWeight:"bold", marginTop:"3vh", color:"white", backgroundColor:"black"}}>
                <View style={{display:"flex", flexDirection:"row",}}>
                    <Text>{t("total_paye_M")}: </Text>       
                    <Text>{props.bilan.totalPaye+" FCFA"} </Text>     
                </View>

                <View style={{display:"flex", flexDirection:"row",marginLeft:"3vh"}}>
                    <Text>{t("total_restant_M")}: </Text>       
                    <Text>{props.bilan.totalRestant+" FCFA"} </Text>     
                </View>

                <View style={{display:"flex", flexDirection:"row",marginLeft:"3vh"}}>
                    <Text>{t("total_attendu_M")}: </Text>       
                    <Text>{props.bilan.totalAttendu+" FCFA"} </Text>     
                </View>
               
           </View>
        );        

    }

   

    return (
        <Document>
         { Array.from(props.pageSet,
          (el, index) => (
            <Page size="A4"  style={styles.page} key={index}>
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

                {(index==0 && el.filterString.length> 0) &&     
                    <View style={{display:"flex", flexDirection:"row", marginTop:"-1vh", }}>                           
                        <Text style={{fontSize:12, fontFamily:"MyBold"}}>{el.filterString}</Text> 
                    </View>
                }

                <TableHeader style={styles.headerColumnStyle} page={el}/>
               
                <View style={styles.main}>
                   { Array.from(el.pageRows,
                        (row) => (
                            <TableRow style={styles.row} eleve={row}/>                           
                        ))
                   } 
                   {(index == props.pageSet.length-1) &&
                     <Resumer bilan={el.bilans}  />
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
        width:'97%',
        height:'2.3vh',
        backgroundColor:'#414244',
        textTransform:'uppercase',
        fontSize:8.7,
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
        alignItems:"center",
        width:"97%"
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

export default StudentListTemplate;