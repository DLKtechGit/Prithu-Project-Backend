import { View, Text, Image, TouchableOpacity, } from 'react-native'
import React from 'react'
import { FONTS, IMAGES } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/styleSheet'
import { useNavigation } from '@react-navigation/native'

const HomeHeader = ({ theme } : any) => {
    
    const { colors } = theme;

    const navigation = useNavigation<any>();
    
    return (
        <View style={[GlobalStyleSheet.flexalingjust, { height: 50 }]}>
            <View>
                <Image
                    style={{width:120,height:55,resizeMode:'contain' }}
                    source={theme.dark ? IMAGES.logo4 : IMAGES.logo4 }
                /> 
            </View>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={[GlobalStyleSheet.btnicon, { marginRight: 10, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : '#EFF3FA'}]}
                    onPress={() => navigation.navigate('createpost')}
                >
                    <Image
                        style={{ width: 16, height: 16, tintColor: theme.dark ? '#fff':'#475A77' }}
                        source={IMAGES.plus}
                    />
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={[GlobalStyleSheet.btnicon, { marginRight: 10, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : '#EFF3FA' }]}
                    onPress={() => navigation.navigate('notification')}
                >
                    <Image
                        style={{ width: 20, height: 20, tintColor: theme.dark ? '#fff' : '#475A77' }}
                        source={IMAGES.bell}
                    />
                </TouchableOpacity> */}

                {/* <TouchableOpacity
                    style={[GlobalStyleSheet.btnicon, { backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : '#EFF3FA' }]}
                    onPress={() => navigation.navigate('Components')}
                >
                    <Image
                        style={{ width: 20, height: 20, tintColor: theme.dark ? '#fff' : '#475A77' }}
                        source={IMAGES.components}
                    />
                </TouchableOpacity> */}
            </View>
        </View>
    )
}

export default HomeHeader