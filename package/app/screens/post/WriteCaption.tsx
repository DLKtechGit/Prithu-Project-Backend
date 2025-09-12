import React from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { FONTS, COLORS, IMAGES } from '../../constants/theme';
import { TextInput } from 'react-native-gesture-handler';
import { GlobalStyleSheet } from '../../constants/styleSheet';

const ColoesData = [
    {
        id: '1',
        backgroundColor:COLORS.primary
    },
    {
        id: '2',
        backgroundColor: '#f151a7'
    },
    {
        id: '3',
        backgroundColor: '#00abc5'
    },
    {
        id: '4',
        backgroundColor: '#8c55e2'
    },
    {
        id: '5',
        backgroundColor: '#050020'
    },
];

const WriteCaption = () => {

    const [color, setcolor] = React.useState<any>(COLORS.primary);

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

  return (
    <SafeAreaView style={[GlobalStyleSheet.container,{padding:0, backgroundColor:colors.card,flex:1}]}>
        <Header
            title="Write Caption"
            post={true}
            homepage={true}
        />
        <KeyboardAvoidingView
          style={{flex: 1}}
          //behavior={Platform.OS === 'ios' ? 'padding' : ''}
        >
              <View style={{
                  width: '100%',
                  flex:1,
                  backgroundColor:color,
                  justifyContent:'center',
                  paddingVertical:30
              }}>
                  <TextInput
                      multiline
                      placeholderTextColor={'rgba(255,255,255,.5)'}
                      placeholder='Write a Caption'
                      style={{ ...FONTS.h3,textAlignVertical:'center',color: '#fff', width: '100%', height: '100%', textAlign: 'center', paddingHorizontal: 20}}
                  />
              </View>
          <Text style={[GlobalStyleSheet.headerstyle, { ...FONTS.fontMedium, ...FONTS.h5,paddingVertical: 10, paddingLeft: 15, marginBottom: 10, backgroundColor:colors.card,borderBottomColor:colors.border,color:colors.title }]}>Colors</Text>
          <View style={[GlobalStyleSheet.flexaling,{paddingHorizontal:15,paddingBottom:30}]}>
            {ColoesData.map((data,index) => {
                return (
                    <View key={index}>
                        <TouchableOpacity
                            onPress={() => {
                                setcolor(data.backgroundColor)
                            }}
                        >
                            <View style={{ backgroundColor: data.backgroundColor, height: 30, width: 30, borderRadius: 50, marginRight: 10,alignItems:'center',justifyContent:'center' }}>
                                {data.backgroundColor == color &&
                                    <Image
                                        style={[GlobalStyleSheet.image2, { tintColor: COLORS.white, width: 18, height: 18 }]}
                                        source={IMAGES.check}
                                    />
                                }
                                </View>
                        </TouchableOpacity>
                    </View>     
                )
            })}   
          </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default WriteCaption;