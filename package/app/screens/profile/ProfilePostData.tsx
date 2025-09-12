import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { IMAGES, FONTS, COLORS } from '../../constants/theme';

const ProfilePostData = ({ ProfilepicData, navigation } : any) => {
    return (
        <View style={{ marginTop: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
            {ProfilepicData.map((data:any, index:any) => {
                return (
                    <View
                        key={index}
                        style={[{ width: '33.33%' }]}
                    >
                        <TouchableOpacity style={{ padding: 2 }}
                            onPress={() => navigation.navigate('ProfilePost')}
                        >
                            <Image
                                style={{ width: '100%', height: null, aspectRatio: 1 / 1 }}
                                source={data.image}
                            />
                            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.20)', position: 'absolute', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 3, bottom: 10, left: 10 }}>
                                <Image
                                    style={{ width: 10, height: 10, resizeMode: 'contain', tintColor: '#fff' }}
                                    source={IMAGES.like}
                                />
                                <Text style={{ ...FONTS.fontRegular, fontSize: 10, color: COLORS.white, lineHeight: 14 }}>{data.like}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    )
}

export default ProfilePostData;