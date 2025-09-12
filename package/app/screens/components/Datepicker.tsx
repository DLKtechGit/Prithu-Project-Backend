import React, { useEffect, useState } from 'react';
import { Image, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import { GlobalStyleSheet } from '../../constants/styleSheet';


const Datepicker = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [date, setDate] = useState<any>(new Date())

    const onChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode:any) => {
        DateTimePickerAndroid.open({
            value:date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const [date1, setDate1] = useState<any>(new Date())

    const [open, setOpen] = useState<any>(false)

    const [selected, setSelected] = useState('');

    const [selected1, setSelected1] = useState('');

    const [modalVisible, setModalVisible] = useState(false);

    const getDayName = (dateString: string | number | Date) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' }); // Adjust locale and options as needed
    };


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
                            title={'Datepicker'}
                            leftIcon={'back'}
                        />
                    </View>
                    <ScrollView>
                        <View style={GlobalStyleSheet.container}>
                            <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow, { backgroundColor: colors.card }]}>
                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: colors.border }]}>
                                    <Text style={{ ...FONTS.h6, color: colors.title }}>Date Modal</Text>
                                </View>
                                <View style={GlobalStyleSheet.cardBody}>
                                    <TouchableOpacity
                                        onPress={showDatepicker}
                                        activeOpacity={0.5}
                                        style={{
                                            width:'100%',
                                            height:45,
                                            backgroundColor:colors.background,
                                            borderWidth:1,
                                            borderColor:theme.dark ? COLORS.white : COLORS.border,
                                            borderRadius:SIZES.radius_sm,
                                            paddingHorizontal:20,
                                            flexDirection:'row',
                                            alignItems:'center',
                                            gap:15
                                        }}
                                    >
                                        <Image
                                            style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.secondary :COLORS.primary}]}
                                            source={IMAGES.calendar}
                                        />
                                       <Text style={{...FONTS.fontRegular,fontSize:14,color:colors.title}}>{date.toLocaleDateString()}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow, { backgroundColor: colors.card }]}>
                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: colors.border }]}>
                                    <Text style={{ ...FONTS.h6, color: colors.title }}>Time Modal</Text>
                                </View>
                                <View style={GlobalStyleSheet.cardBody}>
                                    <TouchableOpacity
                                        onPress={showTimepicker} 
                                        activeOpacity={0.5}
                                        style={{
                                            width:'100%',
                                            height:45,
                                            backgroundColor:colors.input,
                                            borderWidth:1,
                                            borderColor:theme.dark ? COLORS.white : COLORS.border,
                                            borderRadius:SIZES.radius_sm,
                                            paddingHorizontal:20,
                                            flexDirection:'row',
                                            alignItems:'center',
                                            gap:15
                                        }}
                                    >
                                        <Image
                                            style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.secondary :COLORS.primary,opacity:.5}]}
                                            source={IMAGES.time}
                                        />
                                       <Text style={{...FONTS.fontRegular,fontSize:14,color:colors.title}}>{date.toLocaleTimeString()}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow, { backgroundColor: colors.card }]}>
                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: colors.border }]}>
                                    <Text style={{ ...FONTS.h6, color: colors.title }}>Calendar Modal</Text>
                                </View>
                                <View style={GlobalStyleSheet.cardBody}>
                                    <TouchableOpacity
                                        onPress={() =>  setModalVisible(true)}
                                        activeOpacity={0.5}
                                        style={{
                                            width:'100%',
                                            height:45,
                                            backgroundColor:colors.background,
                                            borderWidth:1,
                                            borderColor:theme.dark ? COLORS.white : COLORS.border,
                                            borderRadius:SIZES.radius_sm,
                                            paddingHorizontal:20,
                                            flexDirection:'row',
                                            alignItems:'center',
                                            gap:10,
                                        }}
                                    >
                                        <Image
                                            style={[GlobalStyleSheet.image3,{tintColor:theme.dark ? COLORS.secondary :COLORS.primary,opacity:0.5}]}
                                            source={IMAGES.datepicker}
                                        />
                                        <Text style={{...FONTS.fontRegular,fontSize:14,color:colors.title}}>{selected ? getDayName(selected) : 'Select a day'}</Text>
                                    </TouchableOpacity>
                                    <Modal
                                        transparent={true}
                                        visible={modalVisible}
                                        animationType="slide"
                                        onRequestClose={() => setModalVisible(false)}
                                    >
                                        <View style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            position: 'relative',
                                        }}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                onPress={() => setModalVisible(false)}
                                                style={{
                                                    position: 'absolute',
                                                    height: '100%',
                                                    width: '100%',
                                                    backgroundColor: 'rgba(0,0,0,.3)',
                                                }}
                                            />
                                                <View style={{
                                                    alignItems: 'center',
                                                    paddingHorizontal: 30,
                                                    paddingVertical: 20,
                                                    paddingBottom: 30,
                                                    backgroundColor: colors.card,
                                                    marginHorizontal: 30,
                                                    maxWidth: 340,
                                                    borderRadius: SIZES.radius,
                                                }}>
                                                    <Calendar
                                                        onDayPress={(day:any) => {
                                                            setSelected(day.dateString);
                                                        }}
                                                        markedDates={{
                                                            [selected]: { selected: true, disableTouchEvent: true, selectedDotColor:COLORS.primary }
                                                        }}
                                                        theme={{
                                                            backgroundColor:colors.card,
                                                            calendarBackground:colors.card,
                                                            dayTextColor:colors.title,
                                                        }}
                                                    />
                                                </View>
                                        </View>
                                    </Modal>
                                </View>
                            </View>
                            <View style={[GlobalStyleSheet.card, GlobalStyleSheet.shadow, { backgroundColor: colors.card }]}>
                                <View style={[GlobalStyleSheet.cardHeader, { borderBottomColor: colors.border }]}>
                                    <Text style={{ ...FONTS.h6, color: colors.title }}>Calendar</Text>
                                </View>
                                <View style={GlobalStyleSheet.cardBody}>
                                <Calendar
                                    onDayPress={(day: { dateString: any; }) => {
                                        setSelected1(day.dateString);
                                    }}
                                    markedDates={{
                                        [selected1]: {selected1: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                                    }}
                                    theme={{
                                        backgroundColor:colors.card,
                                        calendarBackground:colors.card,
                                        dayTextColor:colors.title,
                                    }}
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

export default Datepicker;