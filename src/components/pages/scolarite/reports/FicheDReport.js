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
                <Text style={{fontFamily:"MyBold", fontSize:12, textTransform:'uppercase', fontWeight:'heavy'}}>{props.data.centerHeaders[0]}</Text>
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
                <View style={{width:'5.7vw',  justifyContent:'flex-start',...styles.headercell}}> <Text style={{fontWeight:'heavy'}}>{props.data.absencesHeaderModel[0]}</Text></View>
                <View style={{width:'20vw', justifyContent:'center',...styles.headercell}}>   <Text style={{fontWeight:'heavy'}}>{props.data.absencesHeaderModel[1]}</Text></View>
                <View style={{width:'27vw', justifyContent:'flex-start',...styles.headercell}}>   <Text style={{fontWeight:'heavy'}}>{props.data.absencesHeaderModel[2]}</Text></View>
                <View style={{width:'10vw',  justifyContent:'flex-end',...styles.headercell}}>    <Text style={{fontWeight:'heavy'}}>{props.data.absencesHeaderModel[3]}</Text></View>
            </View>
        );
    }

    const AbsenceRow = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'5.7vw',justifyContent:'center',...styles.cell}}> <Text style={{textAlign:"left"}}>{props.row.date} </Text></View>
                <View style={{width:'22vw', justifyContent:'center',...styles.cell}}> <Text style={{textAlign:"justify"}}>{props.row.nb_heures}    </Text></View>
                <View style={{width:'28vw', justifyContent:'flex-start', marginLeft:"2vw",...styles.cell}}> <Text style={{textAlign:"justify"}}>{props.row.justifie}     </Text></View>
                <View style={{width:'10vw', justifyContent:'center',...styles.cell}}> <Text style={{textAlign:"justify"}} >{props.row.non_justifie} </Text></View>               
           </View>
        );        

    }

    

    const SanctionHeader = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'10.7vw', marginLeft:"-7.9vw", justifyContent:'flex-start',...styles.headercell}}>   <Text style={{fontWeight:'heavy'}}>{props.data.sanctionsHeaderModel[0]}</Text></View>
                <View style={{width:'25vw', justifyContent:'flex-start',...styles.headercell}}>   <Text style={{fontWeight:'heavy'}}>{props.data.sanctionsHeaderModel[1]}</Text></View>
                <View style={{width:'8vw', paddingLeft:'3vw', justifyContent:'flex-start',...styles.headercell}}>  <Text style={{fontWeight:'heavy'}}>{props.data.sanctionsHeaderModel[2]}</Text></View>
            </View>
        );
    }

    const SanctionRow = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'5.7vw', marginLeft:"-5.7vw", justifyContent:'center',...styles.cell}}>      <Text style={{textAlign:"left"}}>{props.row.date}   </Text></View>
                <View style={{width:'37vw',  marginLeft:"-3vw",  justifyContent:'center',...styles.cell}}>  <Text style={{textAlign:"justify"}}> {props.row.libelle}         </Text></View>
                <View style={{width:'8vw',  marginLeft:"7vw",   justifyContent:'flex-start',...styles.cell}}>  <Text style={{textAlign:"justify"}}>{props.row.duree}{props.row.unite} </Text></View>               
           </View>
        );        

    }

    const EmptyRow = (props) =>{
        return(
            <View style={{display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderBottom: "1px solid black", width:"97%"}}>
               <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"Times-Roman"}}> R. A.S </Text>
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
            <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-start",marginBottom:"3vh", width:'100%'}}>
                <Photo photoStyle ={{...styles.photoStyle,borderStyle:"solid", borderWidth:"1px", marginRight:"2vw", borderRadius:3}} imageSrc={props.eleve.photo_url.length>0? props.eleve.photo_url : 'images/photo4Fois4P.png'}/>
                
                <View style={{display:"flex", flexDirection:"row", backgroundColor:"lightgray", padding:7, borderRadius:3, width:"100%", marginRight:"3vw"}}> 
                    <View style={{display:"flex", flexDirection:"column", height:"5vh"}}>
                        <View style={{display:"flex",flexDirection:"row"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>NOM :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.nom+' '+props.eleve.prenom}  </Text>
                        </View>
                    
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>CLASSE :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.classeLabel}  </Text>
                        </View>
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>AGE :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.age}  </Text>
                        </View>                   
                    </View>
                
                    <View style={{display:"flex", flexDirection:"column", height:"2vh", marginLeft:"2vw", paddingBottom:"2.7vh", alignSelf:"flex-end"}}>
                        <View style={{display:"flex",flexDirection:"row"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>MATRICULE :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.matricule}</Text>
                        </View>
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy' , fontFamily:"MyBold"}}>REDOUBLANT :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{(props.eleve.redouble)?"Oui":"Non"}</Text>
                        </View>                    
                    </View>
                </View>
                
            </View>
        );     

    }


   

    return (
        <Document>
        
            <Page size="A4"  style={styles.page} key={1}>
                <Filigrane photoStyle ={{width:"76vw", height:"70vw"}} style={{zIndex:0}}/>                    
                <View style={styles.header}>
                    <PageHeadLeft  style={styles.headerLeft}  data={props.pageSet}   />
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={props.pageSet.pageImages[0]}/>
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyleDefault} imageSrc={props.pageSet.pageImagesDefault[0]}/>
                    <PageHeadRight style={styles.headerRight} data={props.pageSet}  />                                     
                </View>
                
                <PageHeadCenter style={styles.headerCenter} data={props.pageSet}/>
                
                
                <View style={styles.pageTitleContainer}>
                    <Text style={styles.titleStyle}>{props.pageSet.pageTitle}</Text>
                </View>

                <View style={{display:"flex", flexDirection:"row", marginBottom:"2vh" }}>
                    <Text style={{fontSize:"1.3vh", textTransform:'uppercase', fontWeight:'heavy', fontFamily:"Times-Roman" /*fontFamily:"MyBold"*/}}>Periode du :</Text>
                    <Text style={{fontSize:"1.3vh", textTransform:'uppercase', fontWeight:'heavy', fontFamily:"MyBold", marginRight:"0.7vw"}}>{props.pageSet.date_debut}</Text>
                    <Text style={{fontSize:"1.3vh", textTransform:'uppercase', fontWeight:'heavy', fontFamily:"Times-Roman"/*fontFamily:"MyBold"*/}}>Au :</Text>
                    <Text style={{fontSize:"1.3vh", textTransform:'uppercase', fontWeight:'heavy', fontFamily:"MyBold"}}>{props.pageSet.date_fin}</Text>
                </View>

                <View style={styles.main}>                    
                    <EleveInfo eleve={props.pageSet.eleveInfo} classeLabel={props.pageSet.classeLabel}/>
                   
                    <AbsenceHeader style={styles.headerColumnStyle} data={props.pageSet}/> 
                    {(props.pageSet.absencesData.length ==0)&&<EmptyRow/>}                       
                    
                    { Array.from(props.pageSet.absencesData,
                        (absence, index) => (
                            <AbsenceRow style={styles.row} row={absence}/>
                        ))
                    } 

                    <SanctionHeader style={{...styles.headerColumnStyle,marginTop:"2vh"}} data={props.pageSet}/>              
                    {(props.pageSet.sanctionsData.length ==0)&&<EmptyRow/>}
                    { Array.from(props.pageSet.sanctionsData,
                        (sanction, index) => (
                            <SanctionRow style={styles.row} row={sanction}/>
                        ))
                    } 
               
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

    imagestyleDefault:{
        position:"absolute",
        top:"-9.7vh",
        left:0,
        zIndex:2,       
        width :'14vw',
        height:'13vw',
        borderRadius:3,
        marginLeft:"-7vw"
    },

    imagestyle:{
        position:"absolute",
        top:"-9.7vh",
        left:30,
        zIndex:3,       
        width :'14vw',
        height:'13vw',
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
        width:'13vw',
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
        marginBottom:"1vh",   
            
    },

    titleStyle:{
        fontSize:12,
        fontWeight:'ultrabold',
        textTransform:'uppercase',
        fontFamily:"Times-Roman",
        fontFamily:"Times-Roman", 
        fontFamily:"MyBold", 
        fontSize:12, 
        textTransform:'uppercase', 
        fontWeight:'heavy'
    },

    headerColumnStyle:{
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems:'center',
        width:'97%',
        height:'2.3vh',
       // backgroundColor:'rgb(6, 83, 134)',
        backgroundColor:'black',
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
        alignItems:"center",
        borderBottom: "1px solid black",
        width:"97%"
    }, 

    main: {
        display:"flex",
        flexDirection:"column",
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

export default FicheDReport;