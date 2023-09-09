import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native";
import { ColorAssets } from "../../utils/app-assets";
import Icon from "react-native-vector-icons/FontAwesome";

const CustomTextInput = ({isHaveTitle,title, secureTextEntry, placeholder, onChangeText, iconName, fillText, showHide, valueText, condition }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [statusPass, setStatusPass] = useState(true)
  const [checkValidate, setCheckValidate] = useState(false)
  const checkEmty = () => {
    if (!fillText || (!condition && condition != undefined)) {
      setCheckValidate(true)
    } else {
      setCheckValidate(false)
    }
  }
  return (
   <View style={{marginVertical:8,  width: "100%",}}>
          {isHaveTitle?   <Text style={styles.title}>{title}</Text>:<View></View>}

     <View style={[styles.container, isFocused ? styles.boxInputFocus : (checkValidate ? styles.boxInputBlur : styles.boxInput)]}>
      {iconName ? <View style={{ width: 25, alignItems: 'center' }}>
        <Icon name={iconName} size={21} color={isFocused ? ColorAssets.greenColor : (fillText ? '#000' : '#999')} />
      </View> : <View></View>}
      <TextInput
        style={styles.input}
        
        value={valueText}
        secureTextEntry={secureTextEntry ? statusPass : false}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType="ascii-capable"
        onFocus={() => setIsFocused(true)}
        onBlur={() => { checkEmty(); setIsFocused(false) }}
      />
      {showHide ? <TouchableOpacity onPress={() => { setStatusPass(!statusPass) }} style={{ alignItems: 'center', width: 25 }}>
        {statusPass ? <Icon name="eye-slash" size={21} color={isFocused ? ColorAssets.greenColor : (valueText ? '#000' : '#999')} /> : <Icon name="eye" size={21} color={isFocused ? ColorAssets.greenColor : (valueText ? '#000' : '#999')} />}
      </TouchableOpacity> : <View></View>}

    </View>
   </View>
  );
};

const CustomTextInput2 = ({ keyboardType,valueText,textPlaceHolder,isHaveHandle,onChangeText }) => {
  return (
    
    <View style={styles.container2}>
      <TextInput style={styles.input}
        value={valueText}
        keyboardType={keyboardType}
      placeholder={textPlaceHolder}  onChangeText={onChangeText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
  },
  input: {
    width: "85%",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 16,
    fontSize: 16,
  },
  container2: {
    marginVertical:8,
    width: "48%",
    backgroundColor: ColorAssets.greyColor200,
    borderRadius: 20,
    flexDirection: "row",
  },
  title: {
    fontSize: 17,
    width: "100%",
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
  },
  boxInput: {
    backgroundColor: ColorAssets.greyColor200,
  },
  boxInputFocus: {
    backgroundColor: '#EDFAF2',
    borderWidth: 2,
    borderColor: ColorAssets.greenColor,
  },
  boxInputBlur: {
    backgroundColor: '#FFCCBC',
    borderWidth: 2,
    borderColor: '#FF5722',
  },

});

export { CustomTextInput, CustomTextInput2 };
