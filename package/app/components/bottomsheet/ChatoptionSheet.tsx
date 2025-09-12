import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { IMAGES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

const ChatoptionSheet = (props:any, ref:any) => {

    // const { block, deleteChat} = props;

    // ref
    const bottomSheetRef = useRef<any>(null);

    // variables
    const snapPoints = useMemo(() => [props.block === false ? 100 : props.deleteChat === false? 130: 180], []);

    // callbacks
    const handleSheetChanges = useCallback((index:any) => {
        console.log('handleSheetChanges', index);
    }, []);

    // renders
    const renderBackdrop = useCallback(
        (props: any) => (
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
            handleStyle={{ top:0 }}
            handleIndicatorStyle={{ backgroundColor: colors.border, width: 92 }}
            backgroundStyle={{ backgroundColor: colors.card }}
        >
            <BottomSheetView  style={GlobalStyleSheet.container}>
                <TouchableOpacity style={GlobalStyleSheet.TouchableOpacity}>
                    <Image
                        style={GlobalStyleSheet.image}
                        source={IMAGES.info}
                    />
                    <Text style={GlobalStyleSheet.text}>Report</Text>
                </TouchableOpacity>

                {props.block === false ?
                    
                    null
                    :
                    <TouchableOpacity style={GlobalStyleSheet.TouchableOpacity}>
                        <Image
                            style={GlobalStyleSheet.image}
                            source={IMAGES.block}
                        />
                        <Text style={GlobalStyleSheet.text}>Block</Text>
                    </TouchableOpacity>
                }
                {props.deleteChat === false ?
                    null
                    :
                    <TouchableOpacity style={GlobalStyleSheet.TouchableOpacity}>
                        <Image
                            style={[GlobalStyleSheet.image,{tintColor:colors.title}]}
                            source={IMAGES.delete}
                            />
                        <Text style={[GlobalStyleSheet.text,{color:colors.title}]}>Delete chat</Text>
                    </TouchableOpacity>
                }
            </BottomSheetView >

        </BottomSheet>
    );
};



export default forwardRef(ChatoptionSheet);