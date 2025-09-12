import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Feather  ,FontAwesome } from '@expo/vector-icons';
import {  Snackbar } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import ListStyle1 from '../../components/list/ListStyle1';
import { GlobalStyleSheet } from '../../constants/styleSheet';



const Snackbars = () => {

    const theme = useTheme();
    const {colors} : {colors : any} = theme;
	
	const [visible, setVisible] = React.useState(false);
	const [snackText, setSnackText] = React.useState("");
	const [snackType, setSnackType] = React.useState("");
	
	const onDismissSnackBar = () => setVisible(false);

    const onToggleSnackBar = (type:any,text:any) => {
		setSnackText(text);
		setSnackType(type);
		setVisible(!visible);
	};

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
				<Header 
					title={'Snackbars'} 
					leftIcon={'back'}
				/>
                <ScrollView>
                    <View style={{ ...GlobalStyleSheet.container }}>
                        <View style={[GlobalStyleSheet.card, { backgroundColor: colors.card }]}>
                            <View style={GlobalStyleSheet.cardBody}>
                                <ListStyle1
                                    onPress={() => onToggleSnackBar('success',"Something's wrong!")}
                                    arrowRight
                                    icon={<FontAwesome size={16} color={colors.card} name={'check'} />}
                                    title={'Confirmation Snackbar'}
                                />
                                <ListStyle1
                                    onPress={() => onToggleSnackBar('warning',"Something's wrong!")}
                                    arrowRight
                                    icon={<FontAwesome size={16} color={colors.card} name={'warning'} />}
                                    title={'Warning Snackbar'}
                                />
                                <ListStyle1
                                    onPress={() => onToggleSnackBar('info',"We're on it")}
                                    arrowRight
                                    icon={<FontAwesome size={16} color={colors.card} name={'refresh'} />}
                                    title={'Loading Snackbar'}
                                />
                                <ListStyle1
                                    onPress={() => onToggleSnackBar('error',"Error Occured")}
                                    arrowRight
                                    icon={<FontAwesome size={16} color={colors.card} name={'close'} />}
                                    title={'Error Snackbar'}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
			<Snackbar
				visible={visible}
				onDismiss={onDismissSnackBar}
			>
				{snackText}
			</Snackbar>
        </SafeAreaView>
    );
};


export default Snackbars;