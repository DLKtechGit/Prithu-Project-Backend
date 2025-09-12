import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import PostCard from '../../components/PostCard';
import { IMAGES, SIZES, VIDEO } from '../../constants/theme';

const postList = [
    {
        id: "1",
        name: "Grace Gadget",
        image: IMAGES.profile2,
        date: "8 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic1,
            }
        ],
        like: "128",
        comment: "28",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: false,
    },
    {
        id: "2",
        name: "Shopia Greek",
        image: IMAGES.storypic3,
        date: "3 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic2,
            },
            {
                image: IMAGES.profilepic3,
            },
            {
                image: IMAGES.profilepic4,
            },
        ],
        like: "128",
        comment: "25",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "3",
        name: "sophia james",
        image: IMAGES.profilepic7,
        date: "12 hourse ago",
        reelsvideo: VIDEO.video1,
        like: "120",
        comment: "40",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: false,
    },
    {
        id: "4",
        name: "Alex Techie",
        image: IMAGES.storypic1,
        date: "1 hourse ago",
        postimage: [
            {
                image: IMAGES.storypic8,
            },
            {
                image: IMAGES.storypic7,
            },
            {
                image: IMAGES.storypic6,
            },
        ],
        like: "100",
        comment: "10",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "5",
        name: "Sophia James",
        image: IMAGES.profilepic7,
        date: "15 hourse ago",
        postimage: [
            {
                image: IMAGES.storypic13,
            }
        ],
        like: "150",
        comment: "60",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "6",
        name: "Mia Maven",
        image: IMAGES.profilepic9,
        date: "22 hourse ago",
        caption: '"May your coffee be hot\n and your eyeliner even."',
        background: "#8c55e2",
        like: "160",
        comment: "90",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "7",
        name: "Lily Learns",
        image: IMAGES.profilepic5,
        date: "20 hourse ago",
        postimage: [
            {
                image: IMAGES.storypic9,
            }
        ],
        like: "180",
        comment: "60",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "8",
        name: "Herry Learns",
        image: IMAGES.profilepic10,
        date: "22 hourse ago",
        postimage: [
            {
                image: IMAGES.storypic10,
            }
        ],
        like: "130",
        comment: "68",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: false,
    },
    {
        id: "9",
        name: "Deepesh Gour",
        image: IMAGES.storypic5,
        date: "22 hourse ago",
        postimage: [
            {
                image: IMAGES.storypic11,
            }
        ],
        like: "130",
        comment: "68",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: true,
    },
    {
        id: "10",
        name: "Yatin Xarma",
        image: IMAGES.storypic10,
        date: "10 hourse ago",
        postimage: [
            {
                image: IMAGES.storypic12,
            }
        ],
        like: "150",
        comment: "100",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: false,
    },
    {
        id: "11",
        name: "Mukesh Xarma",
        image: IMAGES.storypic12,
        date: "23 hourse ago",
        postimage: [
            {
                image: IMAGES.profilepic12,
            }
        ],
        like: "130",
        comment: "68",
        posttitle: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        posttag: "#Nature #Photography #Ballon",
        hasStory: false,
    },
];

const PostList = (props:any, ref:any) => {

    const [visibleBoxes, setVisibleBoxes] = useState<any>([]);
    

    useImperativeHandle(ref, () => ({
        handleScroll: (e:any) => { handleScroll(e) }
    }))

    const handleScroll = (event:any) => {
        const scrollY = event.nativeEvent.contentOffset.y;

        const visibleBoxIds = postList
            .map((box) => {
                const boxRef = boxRefs.current[box.id];
                if (!boxRef) return null;
                const boxY = boxRef.y;
                const boxHeight = boxRef.height;

                if (boxY < scrollY + SIZES.height / 1.5 && boxY + boxHeight > scrollY) {
                    return box.id;
                }

                return null;
            })
            .filter((id) => id !== null);

        setVisibleBoxes(visibleBoxIds);
    };

    const boxRefs = useRef<any>({});

    const handleBoxLayout = (id:any) => (event:any) => {
        const pageY = event.nativeEvent.layout.y;
        const height = event.nativeEvent.layout.height;
        boxRefs.current[id] = { y: pageY, height };
    };

    return (
        <View>
            {postList.map((postList:any, _) => {
                return (
                    <View
                        key={postList.id}
                        onLayout={handleBoxLayout(postList.id)}
                    >
                        <PostCard
                            id={postList.id}
                            name={postList.name}
                            profileimage={postList.image}
                            date={postList.date}
                            postimage={postList.postimage}
                            like={postList.like}
                            comment={postList.comment}
                            posttitle={postList.posttitle}
                            posttag={postList.posttag}
                            sheetRef={props.sheetRef}
                            optionSheet={props.optionSheet}
                            hasStory={postList.hasStory}
                            reelsvideo={postList.reelsvideo}
                            caption={postList.caption}
                            background={postList.background}
                            visibleBoxes={visibleBoxes}
                        />
                    </View>
                );
            })}

        </View>
    )
}

export default forwardRef(PostList);