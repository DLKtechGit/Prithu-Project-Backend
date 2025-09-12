import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { FONTS, IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

const SongoptionSheet = (props: any, ref:any) => {
    // ref
    const bottomSheetRef = useRef<any>(null);

    // variables
    const snapPoints = useMemo(() => [120], []);

    // callbacks
    const handleSheetChanges = useCallback((index: any) => {
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

    const [show, setshow] = React.useState(true);

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
            backgroundStyle={{ backgroundColor: colors.card }}
        >
            <BottomSheetView style={GlobalStyleSheet.container}>
                <TouchableOpacity style={GlobalStyleSheet.TouchableOpacity}>
                    <Image
                        style={GlobalStyleSheet.image}
                        source={IMAGES.info}
                    />
                    <Text style={GlobalStyleSheet.text}>Report audio</Text>
                </TouchableOpacity>

                {props.unseved === false ?
                    <TouchableOpacity style={GlobalStyleSheet.TouchableOpacity}
                        onPress={() => {
                            setshow(!show)
                        }}
                    >
                        <Image
                            style={[GlobalStyleSheet.image, { tintColor: colors.title }]}
                            source={
                                show
                                    ?
                                    IMAGES.save2
                                    :
                                    IMAGES.save
                            }
                        />
                        <Text style={[GlobalStyleSheet.text, { color: colors.title }]}>Unseved audio</Text>
                    </TouchableOpacity>

                    :

                    <TouchableOpacity style={GlobalStyleSheet.TouchableOpacity}
                        onPress={() => {
                            setshow(!show)
                        }}
                    >
                        <Image
                            style={[GlobalStyleSheet.image, { tintColor: colors.title }]}
                            source={
                                show
                                    ?
                                    IMAGES.save
                                    :
                                    IMAGES.save2
                            }
                        />
                        <Text style={[GlobalStyleSheet.text, { color: colors.title }]}>Save audio</Text>
                    </TouchableOpacity>
                }
            </BottomSheetView>
        </BottomSheet>
    );
};



export default forwardRef(SongoptionSheet);