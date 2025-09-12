import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import Header from '../../layout/Header';
import { FONTS } from '../../constants/theme';
import ClassicAccordion from '../../components/Accordion/ClassicAccordion';
import AccordionHighlight from '../../components/Accordion/AccordionHighlight';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';

const AccordionScreen = () => {

    const { colors } : {colors : any} = useTheme();

    return (
        <SafeAreaView style={{flex:1,backgroundColor:colors.card}}>
            <View
                style={{
                    flex:1,
                    backgroundColor:colors.background,
                }}
            >
                <Header 
                    titleLeft 
                    title={'Accordions List'} 
                    leftIcon={'back'}
                />
                <ScrollView>
                    <View style={[GlobalStyleSheet.container,{padding:15}]}>
                        <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow2,{backgroundColor:colors.card}]}>
                            <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor:'rgba(0, 0, 0, 0.10)'}]}>
                                <Text style={{...FONTS.h6,color:colors.title}}>Classic Accordion</Text>
                            </View>
                            <View style={GlobalStyleSheet.cardBody}>
                                <ClassicAccordion/>
                            </View>
                        </View>
                        <View style={[GlobalStyleSheet.card,GlobalStyleSheet.shadow,{backgroundColor:colors.card}]}>
                            <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: 'rgba(0, 0, 0, 0.10)' }]}>
                                <Text style={{...FONTS.h6,color:colors.title}}>Accordion Highlight</Text>
                            </View>
                            <View style={GlobalStyleSheet.cardBody}>
                                <AccordionHighlight/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default AccordionScreen;