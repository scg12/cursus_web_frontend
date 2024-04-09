import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import fontBold from "../../../../fonts/timesBold.ttf";
import fontItalic from "../../../../fonts/timesItalic.ttf";
import { useTranslation } from "react-i18next";
import Filigrane from "../../../filigrane/Filigrane";
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

 
function ListingNotesTemplate(props){
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
                <Text style={{fontFamily:"Times-Roman", fontSize:12, marginBottom:'0.47vh'}}>{props.page.centerHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:8.7, marginBottom:'0.47vh'}}>{props.page.centerHeaders[2]}</Text>
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
        var width = ["5.7vw","10vw", "37vw"];
        return(
            <View style={props.style}>
                { Array.from(props.listCours,
                    (el, index) => (
                        <View style={{width:index<3? width[index]:"8vw", paddingLeft:index==0?'1vw':"0vw", justifyContent:'flex-start',...styles.headercell}}>   
                            <Text>{el.split('*')[0]}</Text>
                        </View>
                    ))
                }
            </View>
        );
    }


            
    const TableRow = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'5.7vw', justifyContent:'flex-start',...styles.cell}}>  <Text>{props.eleve.rang}      </Text></View>
                <View style={{width:'10vw', justifyContent:'flex-start',...styles.cell}}>                         <Text>{props.eleve.matricule} </Text></View>
                <View style={{width:'37vw', justifyContent:'flex-start',...styles.cell}}><Text>{props.eleve.nom}       </Text></View>
                { Array.from(props.listCours,
                    (el, index) => ((index>=3)&&
                        <View style={{width:'8vw',  justifyContent:'flex-start',...styles.cell}}>                     
                            <Text>{props.eleve[el.split("*")[1]]}</Text>
                        </View>     
                    ))
                }
                         
           </View>
        );        

    }


    function getMainTitle(title){
        var pos   = title.search(/\:/); 
        return title.substr(0,pos+1)
    }

    function getSuffixe(title){
        var pos   = title.search(/\(/); 
        if (pos != -1)  return title.substr(pos);
        else return "";     
        
    }

    function getClassabel(title){
        var pos1   = title.search(/\:/); 
        var pos2   = title.search(/\(/);  
        if(pos2!=-1)  return title.substr(pos1+1,pos2-pos1-1);
        else  return title.substr(pos1+1); 
    }


   

    return (
        <Document>
         { Array.from(props.pageSet,
          (el, index) => (
            <Page size="A4"  orientation="landscape" style={styles.page} key={index}>
                <Filigrane photoStyle ={{width:"57vw", height:"48vw"}} style={{zIndex:0, marginBottom:"-13vh"}} />
                <View style={styles.header}>
                    <PageHeadLeft  style={styles.headerLeft}   page={el}   />
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyleDefault} imageSrc={el.pageImagesDefault[0]}/>
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={el.pageImages[0]}/>
                    
                    <PageHeadRight style={styles.headerRight}  page={el}  />                                     
                </View>
                
                <PageHeadCenter style={styles.headerCenter} page={el}/>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateStyle}>{el.dateText}</Text>
                </View>
                
                <View style={styles.pageTitleContainer}>
                    <Text style={styles.titleStyle}>{getMainTitle(el.pageTitle)} </Text>
                    <Text style={{fontSize:13, fontFamily:"Times-Roman", fontFamily:"MyBold",marginLeft:"0.1vw"}}>{getClassabel(el.pageTitle)}</Text>
                    <Text style={{fontSize:10,marginLeft:"-0.5vw", fontFamily:"Times-Roman", fontFamily:"MyItalic"}}>{getSuffixe(el.pageTitle)}</Text>
                </View>

               <TableHeader style={styles.headerColumnStyle} listCours={el.tableHeaderModel}/>
              
                <View style={styles.main}>
                   { Array.from(el.pageRows,
                        (row, index) => (
                            <TableRow style={styles.row} eleve={row} listCours={el.tableHeaderModel}/>
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
      paddingTop:"3vh"     
    },

    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignSelf:'flex-start',
        height: '10%',
        width: "100%",
           
    },

    headerLeft:{
        textAlign:'center',
        display: "flex",
        flexDirection: "column",
        justifyContent:'flex-start',
        /*alignItems:'flex-start',*/
        marginTop:"0vh",
        alignSelf:'center',
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
        alignSelf:'center',
        width: "43%",
    },

    pageLogoContainer:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
       
        marginBottom:"-0.53vh",
        alignSelf:'flex-end',
        width: "14%",
    },

    imagestyle:{
        position:"absolute",
        top:"-12vh",
        left:0,
        zIndex:2,       
        width :'13vh',
        height:'12vh',
        borderRadius:3,
        marginLeft:"-4.3vw"
    },

    imagestyleDefault:{
        position:"absolute",
        top:"-12vh",
        left:30,
        zIndex:3,       
        width :'13vh',
        height:'12vh',
        borderRadius:3,
        marginLeft:"4.7vw"
    },

    headerCenter:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        marginBottom:"1vh",
        height:"5.7%",
        width:'100%',
        borderBottom: "2px solid black",       
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
        width:'97%',
        marginBottom:"0.3vh"
    },

    dateStyle:{
        fontSize:10,
        fontFamily: "Times-Roman",
    }, 

   
    pageTitleContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignItems:'center',
        width:'auto',
        height:'3.7%',
        borderBottom: "1.3px solid black",
        marginBottom:"1vh",       
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
        // backgroundColor: "white",
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

export default ListingNotesTemplate;