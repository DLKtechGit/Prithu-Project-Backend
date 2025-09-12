import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { FONTS, IMAGES } from '../../constants/theme';
import Button from '../../components/button/Button';
import { useNavigation } from '@react-navigation/native';

const ShareData = [
    {
        id: '1',
        title: 'Alex Techie',
        image: IMAGES.storypic1,
        text: "alex_techie_2123",
        hasStory: false,
    },
    {
        id: '2',
        title: 'Lily Learns',
        image: IMAGES.storypic2,
        text: "your_lily@123",
        hasStory: true,
    },
    {
        id: '3',
        title: 'Mia Maven',
        image: IMAGES.storypic3,
        text: "mia-meaver_420",
        hasStory: false,
    },
    {
        id: '4',
        title: 'Sophia James',
        image: IMAGES.storypic4,
        text: "sophia_james",
        hasStory: true,
    },
    {
        id: '5',
        title: 'Deepesh gaur',
        image: IMAGES.storypic1,
        text: "deepesh_gaur22",
        hasStory: false,
    },
    {
        id: '6',
        title: 'Alex Techie',
        image: IMAGES.storypic4,
        text: "alex_techie_2123",
        hasStory: false,
    },
    {
        id: '7',
        title: 'Lily Learns',
        image: IMAGES.storypic2,
        text: "your_lily@123",
        hasStory: false,
    },
    {
        id: '8',
        title: 'Mia Maven',
        image: IMAGES.storypic3,
        text: "mia-meaver_420",
        hasStory: false,
    },
    {
        id: '9',
        title: 'Sophia James',
        image: IMAGES.storypic4,
        text: "sophia_james",
        hasStory: false,
    },
    {
        id: '10',
        title: 'Deepesh gaur',
        image: IMAGES.storypic1,
        text: "deepesh_gaur22",
        hasStory: false,
    },
    {
        id: '11',
        title: 'Alex Techie',
        image: IMAGES.storypic2,
        text: "alex_techie_2123",
        hasStory: true,
    },
];

const Item = ({ title, image, text, hasStory, navigation, theme } : any) => {

    const [isChecked, setIsChecked] = useState(false);

    return (

        <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                marginBottom: 10,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:10 }}>
                <View>
                    <TouchableOpacity

                        onPress={() => {
                            hasStory == false ?
                                navigation.navigate('AnotherProfile')
                                :
                                navigation.navigate('status', {
                                    name: title,
                                    image: image,
                                    statusData: [IMAGES.profilepic11, IMAGES.profilepic12]
                                })
                        }}

                        style={{ marginRight: 10 }}
                    >

                        {
                            hasStory == true ?
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 50, height: 50, borderRadius: 50 }}
                                        source={image}
                                    />
                                    <Image
                                        style={{ width: 58, height: 58, position: 'absolute', resizeMode: 'contain' }}
                                        source={IMAGES.cricle}
                                    />
                                </View>
                                :
                                <View>
                                    <Image
                                        style={{ width: 50, height: 50, borderRadius: 50 }}
                                        source={image}
                                    />
                                </View>
                        }

                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: theme.colors.title }}>{title}</Text>
                    <Text style={{ ...FONTS.fontXs, color: theme.colors.text }}>{text}</Text>
                </View>
            </View>
            
            <View
                style={[{
                    borderWidth: 2,
                    width: 22,
                    height: 22,
                    borderRadius: 50,
                    borderColor: theme.colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',

                }, isChecked == true && {
                    backgroundColor: '#2979F8',
                    borderWidth: 0
                }]}
            >
                <View style={{ width: 10, height: 10, backgroundColor: theme.colors.card, borderRadius: 50 }}></View>
            </View>
            
        </TouchableOpacity>
    )
}

const PostShareSheet = (props : any, ref: any) => {
    // ref
    const bottomSheetRef = useRef<any>(null);

    // variables
    const snapPoints = useMemo(() => ['75%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index : any) => {
        console.log('handleSheetChanges', index);
        if (index === -1) {
            Keyboard.dismiss();
        }
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

    const navigation = useNavigation<any>();

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
            keyboardBehavior='interactive'
            android_keyboardInputMode={'adjustResize'}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            handleStyle={{ top: 0 }}
            handleIndicatorStyle={{ backgroundColor:colors.border, width: 92 }}
            backgroundStyle={{ backgroundColor: colors.card,flex:1 }}
        >
            <BottomSheetTextInput
                placeholder='Search here...'
                placeholderTextColor={colors.placeholder}
                style={[
                    GlobalStyleSheet.inputBox,GlobalStyleSheet.container, {
                        padding:0,
                        backgroundColor: colors.input,
                        paddingLeft: 25,
                        // marginHorizontal: 15
                    },
                ]}
            />
            <View style={[GlobalStyleSheet.container,{ flex: 1,padding:0 }]}>
                <BottomSheetFlatList
                    showsVerticalScrollIndicator={false}
                    data={ShareData}
                    renderItem={({ item }) =>
                        <Item
                            title={item.title}
                            image={item.image}
                            text={item.text}
                            hasStory={item.hasStory}
                            navigation={navigation}
                            theme={theme}
                        />
                    }
                    keyExtractor={item => item.id}
                />
                <View style={{ paddingHorizontal: 30, paddingBottom: 10 }}>
                    <Button
                        title="Send"
                    />
                </View>
            </View>
        </BottomSheet>
    );
};



export default forwardRef(PostShareSheet);