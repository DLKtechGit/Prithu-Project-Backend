import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { FONTS } from '../../constants/theme';

const CustomInput = (props) => {

    const { colors } : {colors : any} = useTheme();

    const [passwordShow , setPasswordShow ] = useState(true);
    
    const handndleShowPassword = () => {
        setPasswordShow(!passwordShow);
    }

    return (
        <>
            <View style={{position:'relative',justifyContent:'center'}}>
                <View style={{
                    position:'absolute',
                    height: 48,
                    width:48,
                    alignItems:'center',
                    justifyContent:'center',
                    zIndex:1,

                    //top:16,
                }}>
                    {props.icon && props.icon}
                </View>
                <TextInput
                    secureTextEntry={props.type === "password" ? passwordShow : false}
                    style={[{
                        ...FONTS.font,
                        fontSize:14,
                        height:53,
                        borderWidth: 1,
                        borderRadius:12,
                        color:colors.title,
                        borderColor:colors.input,
                        paddingVertical:12,
                        backgroundColor:colors.input,
                        paddingHorizontal:15,
                    }, props.icon && {
                        paddingLeft:50,
                    },props.inputLg && {
                        height:65,
                        paddingVertical:18,
                    },props.inputSm && {
                        paddingVertical:7,
                        height:45,
                    },props.inputRounded && {
                        borderRadius:30,
                    },props.inputBorder && {
                        borderWidth:0,
                        borderBottomWidth:1,
                        borderRadius:0,
                        backgroundColor:colors.card,
                    }]}
                    placeholderTextColor={colors.text}
                    placeholder={props.placeholder}
                    onChangeText={props.onChangeText}
                    //value={props.value}
                />
                {props.type === "password" &&
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="Password"
                        accessibilityHint="Password show and hidden"
                        onPress={() => handndleShowPassword()}
                        style={styles.eyeIcon}>
                        <FeatherIcon color={colors.text} size={18} name={passwordShow ? 'eye-off' : 'eye'}/>
                    </TouchableOpacity>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    
    eyeIcon:{
        position:'absolute',
        height:50,
        width:50,
        alignItems:'center',
        justifyContent:'center',
        right:0,
        zIndex:1,
        top:0,
    }
})

export default CustomInput;