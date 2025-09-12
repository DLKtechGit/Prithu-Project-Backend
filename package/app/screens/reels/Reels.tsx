import React, {  useRef  } from 'react'
import {SafeAreaView } from 'react-native';
import Reelsitem from '../../components/Reelsitem';
import Swiper from 'react-native-swiper';
import { IMAGES, VIDEO } from '../../constants/theme';
import Header from '../../layout/Header';
import PostShareSheet from '../../components/bottomsheet/PostShareSheet';

const ReelsData = [
  {
    id: '1',
    like: '456K',
    comment: '56K',
    save: '512',
    send: '30k',
    image:IMAGES.storypic2,
    holder: "Lily Learns",
    text: 'Hoe to speak the right and good public and very nice and very very nice?',
    music: 'podcast - janjipodcast',
    //reelsimage:IMAGES.profilepic5,
    reelsvideo: VIDEO.video1,
    hasStory: false,
  },
  {
    id: '2',
    like: '230K',
    comment: '59K',
    save: '1K',
    send: '60k',
    image: IMAGES.storypic3,
    holder: "Mia Maven",
    text: 'Have a good day and good morning and very nice and very very nice?',
    music: 'Atif Aslam - Khair Mangda',
    //reelsimage: IMAGES.profilepic7,
    reelsvideo: VIDEO.video2,
    hasStory: true,

  },
  {
    id: '3',
    like: '200K',
    comment: '509K',
    save: '12K',
    send: '66k',
    image: IMAGES.storypic4,
    holder: "Herry Maven",
    text: 'Have a good day and good morning and very nice and very very nice?',
    music: 'Oonchi Oonchi - manan bhardwaj',
    //reelsimage: IMAGES.profilepic7,
    reelsvideo: VIDEO.video3,
    hasStory: false,

  },
  {
    id: '4',
    like: '210K',
    comment: '30K',
    save: '15K',
    send: '68k',
    image: IMAGES.profilepic7,
    holder: "Anan Learns",
    text: 'Have a good day and good morning and very nice and very very nice?',
    music: 'Heart Brak - Soumya Mukherjee',
    //reelsimage: IMAGES.profilepic7,
    reelsvideo: VIDEO.video4,
    hasStory: true,

  },

]

const Reels = () => {

  const sheetRef = useRef<any>();

  return (
    <SafeAreaView style={{flex:1}}>
      
      <Header
        title='Reels'
        transparent={true}
      />
      <Swiper
        horizontal={false}
        showsButtons={false}
        showsPagination={false}
        loop={false}
      >
        {ReelsData.map((data:any, index) => {
            return(
              
              <Reelsitem
                key={index}
                like={data.like}
                comment={data.comment}
                save={data.save}
                send={data.send}
                image={data.image}
                holder={data.holder}
                text={data.text}
                music={data.music}
                reelsimage={data.reelsimage}
                sheetRef={sheetRef}
                reelsvideo={data.reelsvideo}
                hasStory={data.hasStory}
                
              />
          
            )
        })}
 
      </Swiper>
      <PostShareSheet
        ref={sheetRef}
      />
   </SafeAreaView>
  )
}

export default Reels;