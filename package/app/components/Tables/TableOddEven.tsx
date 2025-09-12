import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/styleSheet';

const TableOddEven = () => {

    const { colors } : {colors : any} = useTheme();

    const TableData = [
        {
            name : "John Doe",
            email : "johndoe@gmail.com",
            age : 20,
        },
        {
            name : "John Doe",
            email : "johndoe@gmail.com",
            age : 20,
        },
        {
            name : "John Doe",
            email : "johndoe@gmail.com",
            age : 20,
        },
        {
            name : "John Doe",
            email : "johndoe@gmail.com",
            age : 20,
        },
    ]

    return (
        <>
            <View style={[
                GlobalStyleSheet.card, GlobalStyleSheet.shadow2, { backgroundColor: colors.card, padding: 5 }
            ]}>
                <View
                    style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        flexDirection: 'row',
                    }}
                >
                    <Text style={{...styles.theadItem,color:colors.text,flex:.6,paddingLeft:15}}>Name</Text>
                    <Text style={{...styles.theadItem,color:colors.text}}>Email</Text>
                    <Text style={{...styles.theadItem,color:colors.text,flex:0.5,textAlign:'right',paddingRight:15}}>Age</Text>
                </View>
                {TableData.map((data,index) => {
                    return(
                        <View
                            key={index}
                            style={[{
                                flex: 1,
                                alignSelf: 'stretch',
                                flexDirection: 'row',
                            } , index % 2 === 0 && {
                                backgroundColor : '#eee',
                            }]}
                        >
                            <Text style={[{...styles.tbodyItem,color:colors.title,flex:.6,paddingLeft:15}, index % 2 === 0 && {color : COLORS.title}]}>{data.name}</Text>
                            <Text numberOfLines={1} style={[{...styles.tbodyItem,color:colors.title}, index % 2 === 0 && {color : COLORS.title}]}>{data.email}</Text>
                            <Text style={[{...styles.tbodyItem,color:colors.title,flex:0.5,textAlign:'right',paddingRight:15}, index % 2 === 0 && {color : COLORS.title}]}>{data.age}</Text>
                        </View>
                    )
                })}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    theadItem:{
        flex: 1, 
        alignSelf: 'stretch',
        paddingHorizontal:10,
        paddingVertical:12,
        ...FONTS.font,
        color:COLORS.text,
    },
    tbodyItem:{
        flex: 1, 
        alignSelf: 'stretch',
        paddingHorizontal:10,
        paddingVertical:12,
        ...FONTS.font,
        ...FONTS.fontTitle,
        color:COLORS.title,
    }
})

export default TableOddEven;