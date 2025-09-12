import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { GlobalStyleSheet } from '../../../constants/styleSheet';
import { COLORS } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { useTheme } from '@react-navigation/native';
import themeContext from '../../../constants/themeContext';

const Theme = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [thememode, setthememode] = React.useState(theme.dark);

    const { setDarkTheme, setLightTheme } = React.useContext(themeContext);
    
    
   
    
  return (
      <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
          <Header
              title='Set theme'
          />
          <View style={GlobalStyleSheet.container}>
              <TouchableOpacity
                  style={[GlobalStyleSheet.flexalingjust, { marginTop: 20 }]}
                  onPress={() => {
                      setLightTheme()
                      setthememode(false)
                  }}
              >
                  <Text style={[GlobalStyleSheet.textfont, { fontSize: 15, color: colors.title }]}>Light</Text>
                  <View
                      style={[{
                          width: 22,
                          height: 22,
                          borderRadius: 50,
                          borderColor: colors.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                      },
                      thememode == false ? {
                          backgroundColor: '#2979F8',
                          borderWidth: 0
                      }

                          :
                          {
                              borderWidth: 2,

                          }
                      ]}
                  >
                      <View style={{ width: 10, height: 10, backgroundColor: colors.card, borderRadius: 50 }}></View>
                  </View>
              </TouchableOpacity>
             
                <TouchableOpacity
                    style={[GlobalStyleSheet.flexalingjust, { marginTop: 20 }]}
                  onPress={() => {
                        setDarkTheme()
                        setthememode(true)
                    }}
                >
                    <Text style={[GlobalStyleSheet.textfont, { fontSize: 15,color:colors.title }]}>Dark</Text>
                    <View
                        style={[{
                            width: 22,
                            height: 22,
                            borderRadius: 50,
                            borderColor: colors.border,
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        thememode == true ? {
                            backgroundColor: '#2979F8',
                            borderWidth: 0
                        }

                            :
                            {
                                borderWidth: 2,

                            }
                        ]}
                    >
                        <View style={{ width: 10, height: 10, backgroundColor: colors.card, borderRadius: 50 }}></View>
                    </View>
                </TouchableOpacity>
            </View>
      </SafeAreaView>
  )
}

export default Theme;