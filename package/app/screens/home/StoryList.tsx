import { View,  FlatList } from 'react-native'
import React from 'react'
import { IMAGES } from '../../constants/theme';
import StoryItem from '../../components/story/StoryItem';
import { useTheme } from '@react-navigation/native';

const StoryData = [
    {
        id: '1',
        title: 'Add story',
        image: IMAGES.profile,
        storyItem : [
            IMAGES.profilepic1,
            IMAGES.profilepic2,
        ] 
    },
    {
        id: '2',
        title: 'Alex Techie',
        image: IMAGES.storypic2,
        storyItem : [
            IMAGES.profilepic10,
            IMAGES.profilepic11,
            IMAGES.profilepic12,
            IMAGES.profilepic13,
            IMAGES.profilepic14,
            IMAGES.profilepic15,
        ] 
    },
    {
        id: '3',
        title: 'Lily Learns',
        image: IMAGES.storypic3,
        storyItem : [
            IMAGES.profilepic3,
            IMAGES.profilepic4,
            IMAGES.profilepic5,
            IMAGES.profilepic7,
            IMAGES.profilepic8,
            IMAGES.profilepic9,
        ] 
    },
    {
        id: '4',
        title: 'Mia Maven',
        image: IMAGES.storypic4,
        storyItem : [
            IMAGES.profilepic16,
            IMAGES.profilepic17,
            IMAGES.profilepic18,
            IMAGES.profilepic19,
            IMAGES.profilepic20,
            IMAGES.profilepic21,
        ] 
    },
    {
        id: '5',
        title: 'Sophia Techie',
        image: IMAGES.storypic1,
        storyItem : [
            IMAGES.profilepic22,
            IMAGES.profilepic5,
            IMAGES.profilepic7,
            IMAGES.profilepic8,
            IMAGES.profilepic9,
        ] 
    },
    {
        id: '6',
        title: 'Herry Maven',
        image: IMAGES.profilepic7,
        storyItem : [
            IMAGES.profilepic13,
            IMAGES.profilepic14,
            IMAGES.profilepic15,
            IMAGES.profilepic3,
            IMAGES.profilepic4,
            IMAGES.profilepic5,
        ] 
    },
    {
        id: '7',
        title: 'Anan Learns',
        image: IMAGES.profilepic9,
        storyItem : [
            IMAGES.profilepic13,
            IMAGES.profilepic14,
        ] 
    },
    {
        id: '8',
        title: 'David Miten',
        image: IMAGES.profilepic5,
        storyItem : [
            IMAGES.profilepic1,
            IMAGES.profilepic2,
        ] 
    },
];


const StoryList = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <View style={{marginHorizontal:-15}}>
            <FlatList
                contentContainerStyle={{paddingLeft:10,paddingTop:5}}  
                horizontal
                data={StoryData}
                renderItem={({ item }) => {
                    return (
                        <StoryItem
                            title={item.title}
                            image={item.image}
                            storyItem={item.storyItem}
                            id={ item.id}
                        />
                    );
                }}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor:colors.border}}
            />
        </View>
    )
}

export default StoryList