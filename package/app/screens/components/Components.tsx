import React from 'react';
import { SafeAreaView, ScrollView, Text, View, Image } from 'react-native';
import FeatherIcon from "react-native-vector-icons/Feather";
import Ripple from 'react-native-material-ripple';
import { useTheme } from '@react-navigation/native';
import { FONTS, IMAGES } from '../../constants/theme';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';

const accordionIco = require('../../assets/images/icons/accordion.png');
const bottomSheet = require('../../assets/images/icons/bottomSheet.png');
const modal = require('../../assets/images/icons/modal.png');
const chart = require('../../assets/images/icons/chart.png');
const divider = require('../../assets/images/icons/divider.png');
const badge = require('../../assets/images/icons/badge.png');
const input = require('../../assets/images/icons/input.png');
const list = require('../../assets/images/icons/list.png');
const pricing = require('../../assets/images/icons/pricing.png');
const share = require('../../assets/images/icons/share.png');
const tabs = require('../../assets/images/icons/tabs.png');
const table = require('../../assets/images/icons/table.png');
const toggle = require('../../assets/images/icons/toggle.png');

const Components = (props : any) => {


    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const ComponentData = [
        {
            icon: accordionIco,
            title: "Accordions List",
            navigate: 'Accordion',
        },
        {
            icon: bottomSheet,
            title: "Bottom Sheets",
            navigate: 'ActionSheet',
        },
        {
            icon: modal,
            title: "Modal Box",
            navigate: 'ActionModals',
        },
        {
            icon: accordionIco,
            title: "Button Styles",
            navigate: 'Buttons',
        },
        {
            icon: badge,
            title: "Badges",
            navigate: 'Badges',
        },
        {
            icon: IMAGES.datepicker,
            title: "Date Picker",
            navigate: 'Datepicker',
        },
        {
            icon: IMAGES.search,
            title: "Search",
            navigate: 'Search2',
        },
        {
            icon: chart,
            title: "Charts",
            navigate: 'Charts',
        },
        {
            icon: accordionIco,
            title: "Header Styles",
            navigate: 'Headers',
        },
        {
            icon: accordionIco,
            title: "Footer Menu Styles",
            navigate: 'Footers',
        },
        {
            icon: input,
            title: "Inputs",
            navigate: 'Inputs',
        },
        {
            icon: list,
            title: "List Styles",
            navigate: 'lists',
        },
        {
            icon: pricing,
            title: "Pricing Pack",
            navigate: 'Pricings',
        },
        {
            icon: divider,
            title: "Seprators",
            navigate: 'DividerElements',
        },
        {
            icon: accordionIco,
            title: "Snackbars",
            navigate: 'Snackbars',
        },
        {
            icon: share,
            title: "Social",
            navigate: 'Socials',
        },
        {
            icon: accordionIco,
            title: "Swipeable",
            navigate: 'Swipeable',
        },
        {
            icon: tabs,
            title: "Tabs",
            navigate: 'Tabs',
        },
        {
            icon: table,
            title: "Table",
            navigate: 'Tables',
        },
        {
            icon: toggle,
            title: "Toggle",
            navigate: 'Toggles',
        },
    ]

    return (
        <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, flex: 1, backgroundColor: colors.card }]}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                }}
            >
                <Header
                    leftIcon={'back'}
                    titleLeft
                    title={'Components'}
                />
                <ScrollView
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{ paddingBottom: 15, paddingTop: 15 }}
                >
                    {ComponentData.map((data, index) => {
                        return (
                            <Ripple
                                onPress={() => props.navigation.navigate(data.navigate)}
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: colors.card,
                                    marginBottom: 5,
                                    marginHorizontal: 15,
                                    paddingHorizontal: 12,
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                    borderRadius:8
                                }}
                            >
                                <View style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 6,
                                    backgroundColor: colors.background,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 10,
                                }}>
                                    <Image
                                        style={{
                                            height: 20,
                                            width: 20,
                                            tintColor:theme.dark ? '#fff' : '#475A77',
                                            resizeMode: 'contain',
                                        }}
                                        source={data.icon}
                                    />
                                </View>
                                <Text style={{ ...FONTS.font, color: colors.title, flex: 1 }}>{data.title}</Text>
                                <FeatherIcon style={{ opacity: .8 }} color={colors.textLight} name={'chevron-right'} size={20} />
                            </Ripple>
                        )
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};


export default Components;
