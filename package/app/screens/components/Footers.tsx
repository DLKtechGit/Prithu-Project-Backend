import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import Header from '../../layout/Header';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import ListItem from '../../components/list/ListItem';

const Footers = (props : any) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const FooterData = [
        {
            title: "Footer Style 1",
            navigate: 'TabStyle1',
        },
        {
            title: "Footer Style 2",
            navigate: 'TabStyle2',
        },
        {
            title: "Footer Style 3",
            navigate: 'TabStyle3',
        },
        {
            title: "Footer Style 4",
            navigate: 'TabStyle4',
        },
    ]

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                }}
            >
                <Header title={'Footer styles'} titleLeft leftIcon={'back'} />
                <ScrollView>
                    <View style={[GlobalStyleSheet.container,{padding:15}]}>
                        <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow2, { backgroundColor: colors.card }]}>
                            <View style={GlobalStyleSheet.cardBody}>
                                {FooterData.map((data:any, index) => {
                                    return (
                                        <ListItem
                                            key={index}
                                            title={data.title}
                                            onPress={() => props.navigation.navigate(data.navigate)}
                                        />
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};



export default Footers;