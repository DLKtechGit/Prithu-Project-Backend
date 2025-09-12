import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomInput from '../Input/CustomInput';
import Button from '../button/Button';

const LoginModal = ({close}) => {

    const { colors } : {colors : any} = useTheme();

    return (
        <>
            <View
                style={{
                    backgroundColor:colors.card,
                    maxWidth:330,
                    width:'100%',
                    paddingHorizontal:20,
                    paddingVertical: 20,
                    borderRadius:SIZES.radius
                }}
            >
                <View
                    style={{
                        flexDirection:'row',
                        alignItems:'center',
                        paddingBottom:15,
                        marginBottom:20,
                        borderBottomWidth:1,
                        borderBottomColor:colors.border,
                    }}
                >
                    <Text style={{flex:1,...FONTS.h6,color:colors.title}}>Sign In</Text>
                    <TouchableOpacity
                        onPress={() => close(false)}
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
                    title={'Login'}
                    color={COLORS.primary}
                />
            </View>
        </>
    );
};



export default LoginModal;