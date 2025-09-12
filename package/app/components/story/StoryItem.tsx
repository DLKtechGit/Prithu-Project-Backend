import React from 'react';
import {TouchableOpacity,Text,Image,View } from 'react-native';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';	


const StoryItem = ({ title, image, id,storyItem } : any) => {


    const navigation = useNavigation<any>();
    
    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return(
        
        <TouchableOpacity
            onPress={()=>{id == "1" ?
                 navigation.navigate('AddStory')
                :
                navigation.navigate('status',{
                    name:title,
                    image:image,
                    statusData: storyItem
                })
            }}
            style={{marginRight:10,alignItems:'center'}}
        
        >
           
            <View style={{ marginRight: 5 }}>
                    {id == "1" ? 
                        <View>
                            <Image
                                style={{ width: 65, height: 65, borderRadius: 50 }}
                                source={image}
                            />
                        </View>
                        :
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Image
                                style={{ width: 65, height: 65, borderRadius: 50 }}
                                source={image}
                            />
                            <Image
                                style={{ width: 75, height: 75, position: 'absolute',resizeMode:'contain'}}
                                source={IMAGES.cricle}
                            />
                        </View>
                    }
                    {id == "1" ?
                        <View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AddStory')}
                                style={{position:'absolute',bottom:-4,right:0}}
                            >
                            <View style={{ width: 22, height: 22, backgroundColor: theme.dark ? '#112036' :'#fff', alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}>
                                    <LinearGradient
                                        colors={[ '#40ACEA', '#002B43']}
                                        style={{ width: 20, height: 20, alignItems: 'center', borderRadius: 50, justifyContent: 'center' }}
                                    >
                                        <Image
                                            style={{width:12,height:12,tintColor:'#fff'}}
                                            source={IMAGES.plus}
                                        />
                                    </LinearGradient>
                                </View>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
            </View>
            <Text style={{...FONTS.fontMedium, color:colors.title, fontSize:10,marginTop:5}}>{title}</Text>
        </TouchableOpacity>
    );
}

export default StoryItem