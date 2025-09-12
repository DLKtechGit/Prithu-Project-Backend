import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { FONTS, IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

const LanguageData = [
    {
        id: "1",
        text: "Indian",
    },
    {
        id: "2",
        text: "English",
    },
    {
        id: "3",
        text: "German",
    },
    {
        id: "4",
        text: "Italian",
    },
    {
        id: "5",
        text: "Spanish"
    },
]


const LanguageSheet = (props:any, ref:any) => {
    // ref
    const bottomSheetRef = useRef<any>(null);

    // variables
    const snapPoints = useMemo(() => ['40%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index:any) => {
        console.log('handleSheetChanges', index);
    }, []);

    // renders
    const renderBackdrop = useCallback(
        (props : any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
    );


    useImperativeHandle(ref, () => ({
        // methods connected to `ref`
        openSheet: () => { openSheet() }
    }))
    // internal method
    const openSheet = () => {
        bottomSheetRef.current.snapToIndex(0)
    }

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            enablePanDownToClose={true}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            handleStyle={{ top: 0 }}
            handleIndicatorStyle={{ backgroundColor: colors.border, width: 92 }}
        >

            <BottomSheetView style={[GlobalStyleSheet.container, { marginTop: 10 }]}>
                {LanguageData.map((data:any, index:any) => {
                    return (
                        <View key={index} style={{ marginHorizontal: -15 }}>
                            <TouchableOpacity
                                onPress={() => { props.setLanguage(data.text); bottomSheetRef.current.snapToIndex(-1) }}
                                style={[GlobalStyleSheet.flexalingjust, { height: 48, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.10)', marginHorizontal: 15 }]}
                            >
                                <View style={GlobalStyleSheet.flexaling}>
                                    <Text style={[GlobalStyleSheet.textfont, { fontSize: 15, marginLeft: 10, }]}>{data.text}</Text>
                                </View>
                                <Image
                                    style={[GlobalStyleSheet.image2, { height: 12, width: 12, resizeMode: 'contain' }]}
                                    source={IMAGES.rigtharrow}
                                />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </BottomSheetView>
        </BottomSheet>
    );
};



export default forwardRef(LanguageSheet);