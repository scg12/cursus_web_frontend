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

function StudentCursus(props){
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
                <Photo photoStyle ={{...styles.photoStyle,alignSelf:"center", borderStyle:"solid", borderWidth:"1px", marginRight:"2vw", borderRadius:3}} imageSrc={props.eleve.photo_url.length>0? props.eleve.photo_url : 'images/photo4Fois4P.png'}/>
                
                <View style={{display:"flex", flexDirection:"row", backgroundColor:"lightgray", padding:7, borderRadius:3, width:"100%", marginRight:"3vw", paddingBottom:"3vh"}}> 
                    <View style={{display:"flex", flexDirection:"column", height:"5vh"}}>
                        <View style={{display:"flex",flexDirection:"row"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>{t('nom_M')} :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.nom+' '+props.eleve.prenom}  </Text>
                        </View>
                    
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>{t('class_M')} :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.classeLabel}  </Text>
                        </View>
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>{t("entree_M")}  :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.date_entree}  </Text>
                        </View>                   
                    </View>
                
                    <View style={{display:"flex", flexDirection:"column", height:"2vh", marginLeft:"2vw", paddingBottom:"2.7vh", alignSelf:"flex-end"}}>
                        <View style={{display:"flex",flexDirection:"row"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>{t('matricule_M')} :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.matricule}</Text>
                        </View>
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy' , fontFamily:"MyBold"}}>{t('sortie_M')}  :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{/*(props.eleve.redouble)?"Oui":"Non"*/}</Text>
                        </View>                    
                    </View>

                    <View style={{display:"flex", flexDirection:"column", height:"2vh", marginLeft:"2vw", paddingBottom:"2.7vh", alignSelf:"flex-end"}}>
                        <View style={{display:"flex",flexDirection:"row"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold"}}>AGE :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.age}</Text>
                        </View>
                    </View>
                </View>
                
            </View>
        );     

    }


    const DossierRow = (props) =>{
        return(
            <View style={{display:"flex", flexDirection:"column", justifyContent:"center", width:"100%", marginBottom:"2vh"}}>
               <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-start", marginBottom:"1vh"}}>
                    <Text style={{fontWeight:'heavy', color:"black", fontFamily:"MyBold", textTransform:"uppercase", fontSize:"1.3vh" }}>{props.row.annee+' : '+ props.row.classe}</Text>
               </View>

                <View style={{display:"flex", fontSize:"1.3vh", flexDirection:"row", height:"2.5vh", width:"100%", backgroundColor:"black", borderColor:"white", borderWidth:"1px", borderStyle:"solid"}}>
                    <View style={{display:"flex", width:"50%", justifyContent:"center", alignItems:"center", flexDirection:"row",  }}>
                        <Text style={{fontWeight:'heavy', color:"white", }}>{t('disciplin_history_M')}</Text>
                    </View>
                    <View style={{width:"0vw", height:"100%", borderColor:"white", borderWidth:"1px", borderStyle:"solid"}}></View>
                    <View style={{display:"flex", width:"50%", justifyContent:"center", alignItems:"center", flexDirection:"row", }}>
                        <Text style={{fontWeight:'heavy', color:"white"}}>{t('academic_history_M')}</Text>
                    </View>                    
                </View>

                <View style={{display:"flex", fontSize:"1vh", flexDirection:"row", height:"2.5vh", width:"100%", backgroundColor:"lightgray", borderColor:"black", borderWidth:"1px", borderStyle:"solid"}}>
                    <View style={{display:"flex", flexDirection:"row", width:"50%" }}>
                        <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", width:"50%"}}><Text style={{fontWeight:'heavy', fontFamily:"MyBold", fontSize:"1.3vh"}}>{t('annual_result')}</Text></View>
                        <View style={{width:"0vw", height:"100%", borderColor:"black", borderWidth:"1px", borderStyle:"solid"}}></View>
                        <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", width:"50%"}}><Text style={{fontWeight:'heavy', fontFamily:"MyBold", fontSize:"1.3vh"}}>{t('exam_result')}  </Text></View>
                    </View>
                    <View style={{width:"0vw", height:"100%", borderColor:"black", borderWidth:"1px", borderStyle:"solid"}}></View>

                    <View style={{display:"flex", flexDirection:"row",justifyContent:"center", width:"50%"}}>
                        <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", width:"50%"}}><Text style={{fontWeight:'heavy', fontFamily:"MyBold", fontSize:"1.3vh"}}>{t('absences')}</Text></View>
                        <View style={{width:"0vw", height:"100%", borderColor:"black", borderWidth:"1px", borderStyle:"solid"}}></View>
                        <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", width:"50%"}}><Text style={{fontWeight:'heavy', fontFamily:"MyBold", fontSize:"1.3vh"}}>{t('sanctions')}</Text></View>
                    </View>                    
                </View>

                <View style={{display:"flex", fontSize:"1vh", flexDirection:"row", width:"100%", height:"2.5vh", width:"100%", /*backgroundColor:"white",*/ borderColor:"black", borderWidth:"1px", borderStyle:"solid"}}>
                    <View style={{display:"flex", flexDirection:"row", width:"50%"}}>
                        <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", width:"50%"}}><Text style={{fontWeight:'heavy'}}>{props.row.resultat_annuel}</Text></View>
                        <View style={{width:"0vw", height:"100%", borderColor:"black", borderWidth:"1px", borderStyle:"solid"}}></View>
                        <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", width:"50%"}}><Text style={{fontWeight:'heavy'}}>{props.row.classe_examen? props.row.examen+'('+ props.row.resultat_exam +' '+ props.row.mention_examen+')' :'R.A.S'}  </Text></View>
                    </View>
                    <View style={{width:"0vw", height:"100%", borderColor:"black", borderWidth:"1px", borderStyle:"solid"}}></View>
                    <View style={{display:"flex", flexDirection:"row", width:"50%",justifyContent:"center", width:"50%"}}>
                        <View style={{display:"flex", flexDirection:"row",justifyContent:"center", alignItems:"center", width:"50%"}}><Text style={{fontWeight:'heavy'}}>{t("justified")} :  <Text style={{color:'green', marginRight:'0.3vw'}}>{props.row.absences_j}h </Text> {t("non_justified")} :  <Text style={{color:'red'}}> {props.row.absences_nj}h</Text></Text></View>
                        <View style={{width:"0vw", height:"100%", borderColor:"black", borderWidth:"1px", borderStyle:"solid"}}></View>
                        <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"50%"}}>
                            { Array.from(props.row.sanctions.split("_"),
                                (sanction, index) => (
                                    <View style={{display:"flex", flexDirection:"row", justifyContent:"center",  alignSelf:props.row.sanctions.split("_").length == 1 ? "center":"flex-start"}}>
                                        <Text style={{width:"100%"}}>
                                            {sanction} 
                                        </Text>
                                    </View>                            
                                ))
                            } 
                            
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

                <View style={{display:"flex", width:"100vw", flexDirection:"row", justifyContent:"flex-end", alignItems:"center", marginRight:"3vw", marginBottom:"1vh" }}>
                    <Text style={{fontSize:"1.3vh", /*textTransform:'uppercase',*/ fontWeight:'heavy', fontFamily:"Times-Roman"}}>{props.pageSet.dateText}</Text>
                </View>
                
                
                <View style={styles.pageTitleContainer}>
                    <Text style={styles.titleStyle}>{props.pageSet.pageTitle}</Text>
                </View>
                

                <View style={styles.main}>                    
                    <EleveInfo eleve={props.pageSet.eleveData.eleveInfo} classeLabel={props.pageSet.classeLabel}/>
                    
                    { Array.from(props.pageSet.eleveData.dossierEleve,
                        (dossier, index) => (
                            <DossierRow style={styles.row} row={dossier}/>                            
                        ))
                    } 
                   
                    {/* <DossierRow style={styles.headerColumnStyle} data={props.pageSet}/> 
                    {(props.pageSet.absencesData.length ==0)&&<EmptyRow/>}                        */}
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
        marginBottom:"1.3vh",
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
        marginBottom:"2vh",   
            
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

export default StudentCursus;