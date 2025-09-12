import React,{forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { GlobalStyleSheet } from '../../constants/styleSheet';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const SpearkersData = [
    {
        image:IMAGES.storypic1,
        aduio:true,
        name:"Alex Techie",
    },
    {
        image:IMAGES.storypic2,
        aduio:true,
        name:"Lily Learns",
    },
    {
        image:IMAGES.storypic3,
        aduio:false,
        name:"Mia Maven",
    },
    {
        image:IMAGES.storypic4,
        aduio:false,
        name:"Sophia James",
    },
]

const FollowersData = [
    {
        image:IMAGES.storypic1,
        name:"Alex Techie",
    },
    {
        image:IMAGES.storypic2,
        name:"Lily Learns",
    },
    {
        image:IMAGES.storypic3,
        name:"Mia Maven",
    },
    {
        image:IMAGES.storypic4,
        name:"Sophia James",
    },
    {
        image:IMAGES.storypic5,
        name:"Alex Techie",
    },
    {
        image:IMAGES.storypic6,
        name:"Lily Learns",
    },
    {
        image:IMAGES.storypic7,
        name:"Mia Maven",
    },
    {
        image:IMAGES.storypic8,
        name:"Sophia James",
    },
]

const Chatroomsinfo = (props : any, ref: any) => {


    const route = useRoute<any>();
        
    const { data } = route.params;

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
            backgroundStyle={{ backgroundColor: colors.card }}
        >
            <BottomSheetView style={[GlobalStyleSheet.container,{paddingTop:20,flex:1}]}>
                <View style={{alignItems:'center',paddingBottom:20,borderBottomWidth:1,borderColor:colors.border,marginBottom:15}}>
                    <View
                        style={[GlobalStyleSheet.shadow2,{
                            height:60,
                            width:60,
                            borderRadius:50,
                            backgroundColor:COLORS.white,
                            alignItems:'center',
                            justifyContent:'center',
                            marginBottom:10
                        }]}
                    >
                        <Image
                            style={{height:40,width:40}}
                            source={data.image}
                        />
                    </View>
                    <View style={{alignItems:'center',marginHorizontal:40}}>
                        <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                            {data.active === true &&
                                <View style={{ backgroundColor: COLORS.success, width: 10, height: 10, borderRadius: 50}}/>
                            }
                            <Text style={{ ...FONTS.fontMedium,fontSize:14, color: colors.title, lineHeight:22 }}>{data.title}</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',gap:5,justifyContent:'center'}}>
                            <Text numberOfLines={1} style={{ ...FONTS.fontXs, color:colors.title,opacity:.7  }}>{data.accountholder}</Text>
                            <View style={{height:6,width:6,borderRadius:15,backgroundColor:colors.title,opacity:.7}}/>
                            <Text style={{ ...FONTS.fontXs, color:colors.title,opacity:.7  }}>{data.activeuser} Members</Text>
                        </View>
                        <Text style={{ ...FONTS.fontRegular,fontSize:12, color: colors.title,opacity:.4,lineHeight:22,textAlign:'center'}}>{data.description}</Text>
                    </View>
                </View>
                <View style={{paddingBottom:10,borderBottomWidth:1,borderColor:colors.border,marginBottom:20}}>
                    <Text style={{...FONTS.fontSemiBold,fontSize:16,color:colors.title,opacity:.5}}>Spearkers</Text>
                    <View style={{marginVertical:10,alignItems:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:15,justifyContent:'center'}}>
                            {SpearkersData.map((data,index) => {
                                return(
                                    <View
                                        key={index}
                                        style={{alignItems:'center'}}
                                    >
                                        <View
                                            style={[GlobalStyleSheet.shadow2,{
                                                height:70,
                                                width:70,
                                                borderRadius:50,
                                                backgroundColor:COLORS.white,
                                                alignItems:'center',
                                                justifyContent:'center',
                                                marginBottom:10,
                                                borderWidth:1.5,
                                                borderColor:data.aduio === false ? COLORS.danger: COLORS.success
                                            }]}
                                        >
                                            <Image
                                                style={{height:60,width:60,borderRadius:50}}
                                                source={data.image}
                                            />
                                            <View 
                                                style={{
                                                    position:'absolute',
                                                    right:-5,
                                                    bottom:-5,
                                                    height:30,
                                                    width:30,
                                                    borderRadius:50,
                                                    backgroundColor:colors.card,
                                                    alignItems:'center',
                                                    justifyContent:'center'
                                                }}
                                            >
                                                <Image
                                                    style={{height:20,width:20,tintColor:data.aduio === false ? COLORS.danger: COLORS.success}}
                                                    source={data.aduio === false ? IMAGES.audiomute : IMAGES.audio}
                                                />
                                            </View>
                                        </View>
                                        <Text style={{...FONTS.fontRegular,fontSize:14,color:colors.text,opacity:.8}}>{data.name}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:50}} showsVerticalScrollIndicator={false}>
                    <View style={{paddingBottom:10,borderBottomWidth:1,borderColor:colors.border,marginBottom:20}}>
                        <Text style={{...FONTS.fontSemiBold,fontSize:16,color:colors.title,opacity:.5}}>Followers</Text>
                        <View style={{marginVertical:10,alignItems:'center'}}>
                            <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:15,justifyContent:'center'}}>
                                {FollowersData.map((data,index) => {
                                    return(
                                        <View
                                            key={index}
                                            style={{alignItems:'center'}}
                                        >
                                            <View
                                                style={[GlobalStyleSheet.shadow2,{
                                                    height:70,
                                                    width:70,
                                                    borderRadius:50,
                                                    backgroundColor:COLORS.white,
                                                    alignItems:'center',
                                                    justifyContent:'center',
                                                    marginBottom:10,
                                                }]}
                                            >
                                                <Image
                                                    style={{height:60,width:60,borderRadius:50}}
                                                    source={data.image}
                                                />
                                            </View>
                                            <Text style={{...FONTS.fontRegular,fontSize:14,color:colors.text,opacity:.8}}>{data.name}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity
                    onPress={() => {bottomSheetRef.current.close(); navigation.goBack()}}
                    activeOpacity={0.8} 
                    style={[
                        GlobalStyleSheet.shadow2,
                        {
                            padding:5,
                            backgroundColor:COLORS.primary,
                            width:140,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:10,
                            position:'absolute',
                            bottom:45,
                            left:20
                        }
                    ]}
                >
                    <Text style={{...FONTS.fontSemiBold,fontSize:14,color:COLORS.card}}>Leave this room</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    );
};



export default forwardRef(Chatroomsinfo);