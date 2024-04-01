import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import { useContext, useState, useEffect } from "react";
import AppContext from "../../store/AppContext";
import { useTranslation } from "react-i18next";
import fontBold from "../../fonts/timesBold.ttf";
import fontItalic from "../../fonts/timesItalic.ttf";
import '../../translation/i18n';
import { grey } from '../../store/SharedData/UtilFonctions'
import {MarvinImage,GrayScale} from "../../store/SharedData/MarvinJ"

Font.register({
  family: "MyBold",
  // fontWeight: '1200', 
  src: fontBold 
});

Font.register({
  family: "MyItalic",
  src: fontItalic 
});



var image, cnv;
function Filigrane(props){
  const { t, i18n } = useTranslation();
  const[imgUrl, setImgUrl] = useState('');
  const currentAppContext = useContext(AppContext);

  // let imgUrl = document.getElementById("logo_url")!=undefined ? document.getElementById("logo_url").value:"";
  useEffect(()=> {       
    cnv = document.getElementById('output');
    while(cnv.firstChild) cnv.removeChild(cnv.firstChild);
    var cnx = cnv.getContext('2d');
    var url = grey(document.getElementById("logo_url").value,cnv,cnx);
    setImgUrl(url);
  },[]);

 

    return (    
      (imgUrl!=undefined && imgUrl!="") &&
        <View  style={{...styles.filigraneStyle, ...props.style}} key={0}>
          <Image style={props.photoStyle} src={imgUrl} />            
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
        alignItems    : "center",
        
    },

  });

export default Filigrane;