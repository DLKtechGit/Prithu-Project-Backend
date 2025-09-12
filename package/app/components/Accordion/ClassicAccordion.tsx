import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FeatherIcon from "react-native-vector-icons/Feather";
import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

const ClassicAccordion = () => {

    const { colors } : {colors : any} = useTheme();

    const [activeSections, setActiveSections] = useState([0]);
    const setSections = (sections) => {
        setActiveSections(
        sections.includes(undefined) ? [] : sections
        );
    };
    
    const SECTIONS = [
        {
            title: 'What is a social app?',
            content: 'A social app is a software application designed for social interaction, allowing users to connect with each other, share content, and communicate online.',
        },
        {
            title: 'Are social apps free to use?',
            content: 'Many social apps are free to download and use, but some offer premium features for a fee or have in-app purchases.',
        },
        {
            title: 'Do social apps have age restrictions?',
            content: 'Yes, many social apps have age restrictions, typically requiring users to be at least 13 or 16 years old. These restrictions are in place to comply with child privacy laws.',
        },
        {
            title: 'How do I with friends on a social app?',
            content: 'Social apps often allow you to search for friends by their username, email, or phone number. Some apps also suggest friends based on your contacts or mutual connections.',
        },
    ];

    const AccordionHeader = (item, _, isActive) => {
        return(
            <View style={{
                flexDirection:'row',
                alignItems:'center',
                paddingVertical:12,
            }}>
                <View
                    style={{
                        height:26,
                        width:26,
                        borderRadius:26,
                        backgroundColor:COLORS.secondary,
                        marginRight:12,
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    <FeatherIcon size={16} color={COLORS.white} name={isActive ? 'minus' : 'plus'}/>
                </View>
                <Text style={[FONTS.font,FONTS.fontTitle,{color:colors.title,flex:1}]}>{item.title}</Text>
            </View>
        )
    }
    const AccordionBody = (item, _, isActive) => {
        return(
            <View style={{marginBottom:15,paddingLeft:38}}>
                <Text style={[FONTS.fontSm,{color:colors.text,lineHeight:20}]}>{item.content}</Text>
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
                duration={300}
                sectionContainerStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor:'rgba(0, 0, 0, 0.10)',
                    paddingVertical:4,
                }}
                activeSections={activeSections}
                onChange={setSections}
                touchableComponent={TouchableOpacity}
                renderHeader={AccordionHeader}
                renderContent={AccordionBody}
            />
        </>
    );
};


export default ClassicAccordion;