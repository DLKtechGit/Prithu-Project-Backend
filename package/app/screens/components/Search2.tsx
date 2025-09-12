import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';

import Search from '../../components/Search/Search';
import FeatherIcon from "react-native-vector-icons/Feather";
import { GlobalStyleSheet } from '../../constants/styleSheet';

const Search2 = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: colors.background,
                    }}
                >
                    <View
                        style={[{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 2,
                                height: 2,
                            },
                            shadowOpacity: .1,
                            shadowRadius: 5,
                        }, Platform.OS === "ios" && {
                            backgroundColor: colors.card,
                        }]}
                    >
                        <Header
                            titleLeft
                            title={'Search'}
                            leftIcon={'back'}
                        />
                    </View>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow, { backgroundColor: colors.card }]}>
                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: colors.border }]}>
                                    <Text style={{ ...FONTS.h6, color: colors.title }}>Search Styles</Text>
                                </View>
                                <View style={GlobalStyleSheet.cardBody}>
                                  <Search
                                      placeholder={"Search Best items for You"}
                                  />
                                  <Search
                                      btnRounded
                                      placeholder={"Search Best items for You"}
                                  />
                                  <Search
                                      border
                                      placeholder={"Search Best items for You"}
                                  />
                                </View>
                            </View>
                            <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow, { backgroundColor: colors.card }]}>
                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: colors.border }]}>
                                    <Text style={{ ...FONTS.h6, color: colors.title }}>Icon With Search Styles</Text>
                                </View>
                                <View style={GlobalStyleSheet.cardBody}>
                                  <Search
                                      placeholder={"Search Best items for You"}
                                      icon={<FeatherIcon size={20} color={COLORS.primary} name={'search'} />}
                                  />
                                  <Search
                                      btnRounded
                                      placeholder={"Search Best items for You"}
                                      icon={<FeatherIcon size={20} color={COLORS.primary} name={'search'} />}
                                  />
                                  <Search
                                      border
                                      placeholder={"Search Best items for You"}
                                      icon={<FeatherIcon size={20} color={COLORS.primary} name={'search'} />}
                                  />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
};


export default Search2;