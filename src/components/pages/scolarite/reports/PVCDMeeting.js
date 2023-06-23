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

function PVCDMeeting(props){
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
                <View style={{width:'8vw',  justifyContent:'center',...styles.headercell}}>      <Text>{props.page.tableHeaderModel[0]}</Text></View>
                <View style={{width:'23vw', justifyContent:'flex-start',...styles.headercell}}>  <Text>{props.page.tableHeaderModel[1]}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.headercell}}>      <Text>{props.page.tableHeaderModel[2]}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.headercell}}>  <Text>{props.page.tableHeaderModel[3]}</Text></View>
                <View style={{width:'8vw', justifyContent:'center',...styles.headercell}}>       <Text>{props.page.tableHeaderModel[4]}</Text></View>
                <View style={{width:'14vw', justifyContent:'flex-start', ...styles.headercell}}> <Text>{props.page.tableHeaderModel[5]}</Text></View>
                <View style={{width:'7vw',  justifyContent:'center',...styles.headercell}}>  <Text>{props.page.tableHeaderModel[6]}</Text></View>
            </View>
        );
    }

    const TableRow = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'8vw', justifyContent:'center',...styles.cell}}>       <Text >{'y254p037'}               </Text></View>
                <View style={{width:'23vw', justifyContent:'flex-start',...styles.cell}}>  <Text >{props.eleve.nom}           </Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.cell}}>      <Text>{props.eleve.date_naissance} </Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.cell}}>  <Text>{props.eleve.lieu_naissance} </Text></View>
                <View style={{width:'8vw', justifyContent:'center',...styles.cell}}>       <Text>{props.eleve.date_entree}    </Text></View>
                <View style={{width:'14vw', justifyContent:'flex-start', ...styles.cell}}> <Text>{props.eleve.nom_pere}       </Text></View>
                <View style={{width:'7vw',  justifyContent:'center',...styles.cell}}>  <Text>{(props.eleve.redouble=='nouveau') ? "non" :"oui"}</Text></View>
           </View>
        );        

    }

   const PVText = (props) =>{
       return(
            <View style={{display:"flex", flexDirection:"column", justifyContent:"flex-start"}}>
                <View style={{display:"flex", flexDirection:"row"}}>
                    <Text style={{fontSize:12, textAlign:'justify'}}>En la date du {props.date}, s'est tenue a {props.time}, dans les locaux du {props.schoolName}, sis au quartier {props.quartier}({props.ville}),un conseil de discipline.</Text>
                </View>

                <View style={{display:"flex", flexDirection:"row", marginTop:"0.7vh"}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Etaient convoques a ce conseil, les eleves dont les noms suivent accompagnes chacun par le motif de sa convocation.</Text>
                </View> 
                <View style={{display:"flex", flexDirection:"column",}}>
                    { Array.from(props.eleveConvoques,
                        (eleve, index) => (
                            <View style={{display:"flex", flexDirection:"row", marginLeft:"3vw"}}>
                                <Text style={{fontSize:12, width:"50vw", textAlign:'justify' }}>- {eleve.nom} : </Text>
                                <Text style={{fontSize:12, fontFamily:"MyBold"}}> pour {eleve.decisionLabel}</Text>
                            </View> 
                        ))
                    }
                </View> 

                <View style={{display:"flex", flexDirection:"row", marginTop:"0.7vh"}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Les principales decisions arretees a l'issu de ce conseil de classe sont les suivantes:</Text>
                </View> 
                
                <View style={{display:"flex", flexDirection:"row"}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>{props.compteRendu}</Text>
                </View>
               
               
                <View style={{display:"flex", flexDirection:"row",marginTop:"0.7vh"}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Les decisions prises specifiquement pour certains eleves sont les suivantes :</Text>
                </View> 
                <View style={{display:"flex", flexDirection:"column",}}>
                    { Array.from(props.elevesDecisions,
                        (eleve, index) => (
                            <View style={{display:"flex", flexDirection:"row", marginLeft:"3vw"}}>
                                <Text style={{fontSize:12, width:"50vw", textAlign:'justify' }}>- {eleve.nom} : </Text>
                                <Text style={{fontSize:12, fontFamily:"MyBold"}}>{eleve.decisionLabel}</Text>
                            </View> 
                        ))
                    }
                </View> 

                <View style={{display:"flex", flexDirection:"row", marginTop:"0.7vh"}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Ont effectivement participer a ce conseil de classe, les enseignants dont les noms suivent:</Text>
                </View>

                <View style={{display:"flex", flexDirection:"column",}}>
                    { Array.from(props.participants,
                        (participant, index) => (
                            <View style={{display:"flex", flexDirection:"row",marginLeft:"3vw"}}>
                                <Text style={{fontSize:12, width:"50vw", textAlign:'justify'}}>- {participant.nom} :</Text>
                                <Text style={{fontSize:12,}}> {participant.role} </Text>
                            </View> 
                        ))
                    }
                </View> 

                <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginRight:"12vw"}}>
                    <Image style={{width:"23vw", height:"23vw"}} src={'images/cachet.png'}/>                       
                </View>

                <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginRight:"12vw"}}>
                    <Text style={{fontSize:12}}> {props.ville}, le {props.date}</Text>                       
                </View>         

            </View>
        );
   }

    return (
        <Document>
        
            <Page size="A4"  style={styles.page} >
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
                    <PVText date        = {props.pageSet.date} 
                        time            = {props.pageSet.time}
                        schoolName      = {props.pageSet.schoolName}
                        quartier        = {props.pageSet.quartier}
                        ville           = {props.pageSet.ville}
                        //typeMeeting     = {props.pageSet.typeMeeting}
                        compteRendu     = {props.pageSet.compteRendu}
                        //successMark     = {props.pageSet.successMark}
                        //exclusionMark   = {props.pageSet.exclusionMark}
                        eleveConvoques  = {props.pageSet.eleveConvoques}
                        elevesDecisions = {props.pageSet.elevesDecisions}
                        participants    = {props.pageSet.participants}
                    />
                  
                </View>
              
                <View style={styles.footer}> 
                    <Text>{props.pageSet.pageNumber} / {props.pageSet.length}</Text> 
                </View>    
            </Page>
          ))
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
        paddingLeft:'2vw'
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

export default PVCDMeeting;