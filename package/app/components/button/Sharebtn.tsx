import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useTheme } from '@react-navigation/native';


export const Sharebtn = (props) => {

    const { title, onPress, white } = props;

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <TouchableOpacity
            onPress={onPress}
        >    
            <View
                style={[GlobalStyleSheet.followbtn, { backgroundColor:theme.dark ? 'rgba(255,255,255,.1)': white === true ? '#fff': '#EFF3FA' }]}
            >
                <Text style={[GlobalStyleSheet.sharebtnTxt,{color:colors.title}]}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}


export default Sharebtn

