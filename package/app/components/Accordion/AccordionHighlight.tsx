import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FeatherIcon from "react-native-vector-icons/Feather";
import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

const AccordionHighlight = () => {

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
                paddingVertical:10,
                paddingHorizontal:15,
                backgroundColor: isActive ? COLORS.primary : colors.background,
            }}>
                <Text style={[FONTS.font,FONTS.fontTitle,{color:isActive ? COLORS.white : colors.title,flex:1}]}>{item.title}</Text>
                <View
                    style={[{
                        height:24,
                        width:24,
                        backgroundColor:colors.card,
                        borderRadius:24,
                        alignItems:'center',
                        justifyContent:'center',
                    },isActive && {
                        backgroundColor:'rgba(255,255,255,.15)',
                    }]}
                >
                    <FeatherIcon size={18} color={isActive ? COLORS.white : colors.title} name={isActive ? 'minus' : 'plus'}/>
                </View>
            </View>
        )
    }
    const AccordionBody = (item, _, isActive) => {
        return(
            <View style={{marginBottom:15,marginTop:10,paddingHorizontal:15}}>
                <Text style={[FONTS.fontSm,{color:colors.text,lineHeight:20}]}>{item.content}</Text>
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
                sectionContainerStyle={{marginBottom:6}}
                duration={300}
                activeSections={activeSections}
                onChange={setSections}
                touchableComponent={TouchableOpacity}
                renderHeader={AccordionHeader}
                renderContent={AccordionBody}
            />
        </>
    );
};


export default AccordionHighlight;