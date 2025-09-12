import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomNavigation from './BottomNavigation';
import { SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
// import Sidebar from '../layout/Sidebar';


const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {

    const { colors }: {colors : any} = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <Drawer.Navigator
                initialRouteName='BottomNavigation'
                screenOptions={{
                    headerShown: false,
                    drawerStyle:{
                        backgroundColor: colors.card,
                        borderTopRightRadius:30,
                        borderBottomRightRadius:30
                    },
                }}
                // drawerContent={(props) => {
                //     return <Sidebar navigation={props.navigation} />
                // }}
            >
                <Drawer.Screen name='BottomNavigation' component={BottomNavigation} />
            </Drawer.Navigator>
        </SafeAreaView>
    );
};


export default DrawerNavigation;