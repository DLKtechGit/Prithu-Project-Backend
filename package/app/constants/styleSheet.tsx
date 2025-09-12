import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from './theme';


export const GlobalStyleSheet = StyleSheet.create({

    loginarea: {
        position: 'relative',
        flex: 1,
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop:35
    },
    cricleGradient1: {
        position: 'absolute',
        top: -50,
        left: -50,
        flex: 1,
        width: 155,
        height: 155,
        transform: [{ rotate: '-120deg' }],
        borderRadius: 100
    },
    cricleGradient2: {
        position: 'absolute',
        bottom: -50,
        right: -50,
        flex: 1,
        width: 155,
        height: 155,
        transform: [{ rotate: '-90deg' }],
        borderRadius: 100
    },
    formtitle: {
        ...FONTS.h3,
        color: COLORS.white,
        marginBottom: 5,
    },
    forndescription: {
        ...FONTS.fontXs,
        color: 'rgba(255, 255, 255, 0.80)',
        width: 285,
        textAlign: 'center',
        marginBottom: 30,
    },
    inputlable: {
        marginBottom: 5,
        ...FONTS.fontSm
    },
    inputBox: {
        height: 48,
        borderRadius: 12,
        paddingLeft: 50,
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    inputimage: {
        position: 'absolute',
        left: 15,
        height: 16,
        width: 16,
        resizeMode: 'contain',
        opacity: .8,
    },
    input: {
        ...FONTS.font,
        padding: 0,
        height: 48,
    },
    btnlink: {
        color: COLORS.primary,
        ...FONTS.fontRegular,
        marginBottom: 20,
        textDecorationLine: 'underline',
    },
    mediabtn: {
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    shadowPrimary: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: .5,
        shadowRadius: 5,
        borderRadius:12,
    },
    image3: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: .1,
        shadowRadius: 15,
    },
    btn: {
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal:20,
    },
    btnTxt: {
        ...FONTS.h6,
        ...FONTS.fontMedium,
        color: COLORS.white,
        textAlign: 'center',
    },
    inputSecureIcon: {
        height: 22,
        width: 22,
        opacity: .8,
    },
    container: {
        padding: 15,
        maxWidth: SIZES.container,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },
    btnicon: {
        width: 32,
        height: 32,
        backgroundColor: '#EFF3FA',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    followbtn: {
        height: 35,
        paddingHorizontal:20,
        borderRadius: 4,
        justifyContent: 'center',
        backgroundColor:'#EFF3FA'
    },
    followbtnTxt: {
        ...FONTS.font,
        ...FONTS.fontRegular,
        color: COLORS.white,
        textAlign: 'center',
    },
    sharebtnTxt: {
        ...FONTS.font,
        ...FONTS.fontRegular,
        color: COLORS.title,
        textAlign: 'center',
    },

    //chatoptionsheet

    TouchableOpacity: {
        flexDirection: 'row',
        marginBottom: 20, 
    },
    image: {
        width: 20,
        height: 20,
        tintColor: 'red',
        resizeMode: 'contain',
    },
    image2: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    text: {
        ...FONTS.font,
        color: 'red',
        marginLeft: 10, 
    },
    
    //flex,aling,just

    flexalingjust: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        
    },
    flexaling: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    //postcard

    postlike: {
        ...FONTS.fontXs,
        ...FONTS.fontMedium,
        color: COLORS.title,
        marginLeft: 10, 
    },

    //reelsitem

    background: {
        backgroundColor: 'rgba(255,255,255,.1)',
        height: 40,
        width: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    Text: {
        ...FONTS.font,
        ...FONTS.fontMedium,
        color: COLORS.white,
        fontSize: 12,
        marginTop: 5,
    },
    
    textfont: {
        ...FONTS.fontSm,
        ...FONTS.fontMedium,
        color: COLORS.title,
    },

    //profiole.js

    textfont2: {
        ...FONTS.h5,
        ...FONTS.fontSemiBold,
        color: COLORS.white   
    },

    titlefont: {
        ...FONTS.fontRegular,
        fontSize: 12,
        color: COLORS.white,
        opacity: .7,
    },

    titlefont2: {
        ...FONTS.fontMedium,
        fontSize: 13,
        color: '#475A77',
        marginLeft: 5, 
    },

    titlefont3: {
        ...FONTS.fontRegular,
        fontSize: 12,
        opacity: .6,
        paddingLeft: 10,
        marginTop: -5

    },

    TouchableOpacity2: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        height: 48,
        justifyContent: 'center',
    },

    headerstyle: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingLeft:5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.10)',
        backgroundColor:'#fff'
    },

    Dot: {
        width: 6,
        height: 6,
        borderRadius: 100,
        backgroundColor: COLORS.title  
    },

    formControl: {
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 15,
    },
    activeInput: {
        borderColor: COLORS.primary,
    },
    label: {
        ...FONTS.font,
        marginBottom: 8,
    },
    inputGroup: {
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    col50: {
        width: '50%',
        paddingHorizontal: 5,
    },
    col33: {
        width: '33.33%',
        paddingHorizontal: 5,
    },
    card: {
        marginBottom: 15,
        backgroundColor: COLORS.white,
        borderRadius:SIZES.radius,
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    cardBody: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    shadow2: {
        shadowColor: "rgba(0,0,0,.5)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
    }
})