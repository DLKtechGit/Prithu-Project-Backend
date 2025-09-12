import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from "react-native-vector-icons/Feather";
import LoginSheet from '../../components/ActionSheet/LoginSheet';
import RegisterSheet from '../../components/ActionSheet/RegisterSheet';
import SuccessSheet from '../../components/ActionSheet/SuccessSheet';
import { FONTS } from '../../constants/theme';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/styleSheet';


const ActionSheet = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const refRBSheet = useRef<any>();

    const [activeSheet, setActiveSheet] = useState('');

    const ActionData = [
        {
            icon: "check-circle",
            title: "Success Sheet",
            sheet: 'success',
        },
        {
            icon: "log-out",
            title: "Login Sheet",
            sheet: 'login',
        },
        {
            icon: "file-text",
            title: "Register Sheet",
            sheet: 'register',
        },
    ]

    return (
        <>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={activeSheet === "checkout" ? 430 :
                    activeSheet === "success" ? 250 :
                        activeSheet === "login" ? 390 :
                            activeSheet === "register" ? 480 : 230}
                openDuration={100}
                customStyles={{
                    wrapper: {
                    },
                    container: {
                        backgroundColor: colors.card,
                    },
                    draggableIcon: {
                        marginTop: 10,
                        marginBottom: 0,
                        height: 5,
                        width: 80,
                        backgroundColor: colors.borderColor,
                    }
                }}
            >
                {activeSheet === "success" ?
                    <SuccessSheet /> :
                    activeSheet === "login" ?
                        <LoginSheet sheetRef={refRBSheet} /> :
                        activeSheet === "register" ?
                            <RegisterSheet sheetRef={refRBSheet} />
                            :
                            <SuccessSheet />
                }

            </RBSheet>

            <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
                <View style={{ backgroundColor: colors.background, flex: 1 }}>
                    <Header
                        titleLeft
                        title={'Bottom Sheets'}
                        leftIcon={'back'}
                    />
                    <ScrollView>
                        <View style={[GlobalStyleSheet.container,{padding:15}]}>
                            <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow2, { backgroundColor: colors.card }]}>
                                <View style={[GlobalStyleSheet.cardBody]}>
                                    {ActionData.map((data, index) => {
                                        return (
                                            <Ripple
                                                onPress={() => { setActiveSheet(data.sheet); refRBSheet.current.open() }}
                                                key={index}
                                                style={[{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    paddingHorizontal: 0,
                                                    paddingVertical: 12,
                                                    borderBottomWidth: 1,
                                                    borderColor: 'rgba(0,0,0,0.10)',
                                                },
                                                index === ActionData.length - 1 && {
                                                    borderBottomWidth: 0,
                                                }
                                                ]}
                                            >
                                                <View
                                                    style={{
                                                        height: 30,
                                                        width: 30,
                                                        backgroundColor: colors.background,
                                                        borderRadius: 30,
                                                        marginRight: 12,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <FeatherIcon size={16} color={theme.dark ? '#fff' : '#475A77'} name={data.icon} />
                                                </View>
                                                <Text style={{ ...FONTS.font, flex: 1, color: colors.title }}>{data.title}</Text>
                                                <FeatherIcon color={colors.text} name={'chevron-right'} size={22} />
                                            </Ripple>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
};

export default ActionSheet;