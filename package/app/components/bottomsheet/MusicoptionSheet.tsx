import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { FONTS, IMAGES, SIZES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


const postimage = [
    {
        id: "17",
        image: IMAGES.storypic5
    },
    {
        id: "18",
        image: IMAGES.storypic6
    },
    {
        id: "19",
        image: IMAGES.storypic7
    },
    {
        id: "20",
        image: IMAGES.storypic8
    },
    {
        id: "21",
        image: IMAGES.storypic9
    },
    {
        id: "22",
        image: IMAGES.storypic10
    },
    {
        id: "23",
        image: IMAGES.storypic11
    },
    {
        id: "24",
        image: IMAGES.storypic12
    },
    {
        id: "25",
        image: IMAGES.storypic13
    },
    {
        id: "26",
        image: IMAGES.storypic14
    },
    {
        id: "27",
        image: IMAGES.storypic15
    },
    {
        id: "28",
        image: IMAGES.profilepic15
    },
    {
        id: "1",
        image: IMAGES.profilepic1
    },
    {
        id: "2",
        image: IMAGES.profilepic2
    },
    {
        id: "3",
        image: IMAGES.profilepic3
    },
    {
        id: "4",
        image: IMAGES.profilepic4
    },
    {
        id: "5",
        image: IMAGES.storypic2
    },
    {
        id: "6",
        image: IMAGES.storypic3
    },
    {
        id: "7",
        image: IMAGES.storypic4
    },
    {
        id: "8",
        image: IMAGES.storypic1
    },
    {
        id: "9",
        image: IMAGES.profilepic5
    },
    {
        id: "10",
        image: IMAGES.profilepic6
    },
    {
        id: "11",
        image: IMAGES.profilepic7
    },
    {
        id: "12",
        image: IMAGES.profilepic8
    },
    {
        id: "13",
        image: IMAGES.profilepic9
    },
    {
        id: "14",
        image: IMAGES.profilepic10
    },
    {
        id: "15",
        image: IMAGES.profilepic11
    },
    {
        id: "16",
        image: IMAGES.profile2
    },
];

const MusicoptionSheet = (props:any, ref:any) => {
    // ref
    const bottomSheetRef = useRef<any>(null);

    // variables
    const snapPoints = useMemo(() => [700], []);

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

    const navigation = useNavigation<any>();

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

            <BottomSheetView>
                <View style={[GlobalStyleSheet.flexaling, { paddingHorizontal: 15 }]}>
                    <Text style={{ flex: 1, ...FONTS.fontMedium, ...FONTS.h5, color: colors.title }}>Gallery</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('WriteCaption')}
                        style={{ padding: 10 }}
                    >
                        <Image
                            style={{ height: 24, width: 24, tintColor: colors.title }}
                            source={IMAGES.write}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ padding: 10 }}
                    >
                        <Image
                            style={{ height: 24, width: 24, tintColor: colors.title }}
                            source={IMAGES.camera}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {postimage.map((item, index) => {
                            return (
                                <View
                                    key={index}
                                    style={{ width: '25%', height: SIZES.width / 4, padding: 1 }}
                                >
                                    <TouchableOpacity
                                        // onPress={() => {
                                        //     setimageurl(item.image)
                                        // }}
                                        onPress={() => navigation.navigate('CreateStory')} 
                                    >
                                        <Image
                                            style={{ width: '100%', height: '100%' }}
                                            source={item.image}
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </BottomSheetView>
        </BottomSheet>
    );
};



export default forwardRef(MusicoptionSheet);