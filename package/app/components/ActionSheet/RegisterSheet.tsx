import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from "react-native-vector-icons/Feather";
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import CustomInput from '../Input/CustomInput';
import Button from '../button/Button';
import { GlobalStyleSheet } from '../../constants/styleSheet';


const RegisterSheet = ({sheetRef} : any) => {

    const { colors } : {colors : any} = useTheme();

    return (
        <View style={GlobalStyleSheet.container}>
            <View
                style={{
                    flexDirection:'row',
                    alignItems:'center',
                    paddingBottom:15,
                    marginBottom:20,
                    borderBottomWidth:1,
                    borderBottomColor:colors.border,
                    paddingTop:15
                }}
            >
                <Text style={{flex:1,...FONTS.h6,color:colors.title}}>Register</Text>
                <TouchableOpacity
                    onPress={() => sheetRef.current.close()}
                    style={{
                        height:32,
                        width:32,
                        borderRadius:32,
                        backgroundColor:colors.background,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    <FeatherIcon size={20} color={colors.title} name="x"/>
                </TouchableOpacity>
            </View>
            <View style={{marginBottom:15}}>
                <Text style={{...FONTS.font,color:colors.title,marginBottom:4}}>Username</Text>
                <CustomInput
                    value={''}    
                    placeholder={'Type Username Here'}
                      onChangeText={(value : any)=> console.log(value)}
                />
            </View>
            <View style={{marginBottom:15}}>
                <Text style={{...FONTS.font,color:colors.title,marginBottom:4}}>Email</Text>
                <CustomInput
                    value={''}    
                    placeholder={'Type Email Here'}
                      onChangeText={(value : any)=> console.log(value)}
                />
            </View>
            <View style={{marginBottom:25}}>
                <Text style={{...FONTS.font,color:colors.title,marginBottom:4}}>Password</Text>
                <CustomInput
                    value={''}   
                    type="password" 
                    placeholder={'Type Password Here'}
                      onChangeText={(value : any)=> console.log(value)}
                />
            </View>
            <Button 
                title={'Register'}
                color={COLORS.primary}
            />
        </View>
    );
};



export default RegisterSheet;