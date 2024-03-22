import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import fontBold from "../../fonts/timesBold.ttf";
import fontItalic from "../../fonts/timesItalic.ttf";
import '../../translation/i18n';

Font.register({
  family: "MyBold",
  // fontWeight: '1200', 
  src: fontBold 
});

Font.register({
  family: "MyItalic",
  src: fontItalic 
});



function Filigrane(props){
    const { t, i18n } = useTranslation();

    return (              
        <View  style={{...styles.filigraneStyle, ...props.style}} key={0}>
           <Image style={props.photoStyle} src={props.imageSrc}/>            
        </View>       
        
    );
}

const styles = StyleSheet.create({
    filigraneStyle: {
        width         : "100%",
        height        : "100%",
        position      : "absolute",
        top           : 0,
        left          : 0,
        zIndex        : 0,
        display       : "flex",
        flexDirection : "column",
        justifyContent: "center",
        alignItems    : "center"
    },
  });

export default Filigrane;