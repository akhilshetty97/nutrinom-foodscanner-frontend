import React, { Component, useContext} from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import History from '../screens/History';
import Scan from '../screens/Scan';
import Profile from '../screens/Profile';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {AuthContext} from '../contexts/AuthContext.js';

const Tab = createBottomTabNavigator();

export class TabNavigation extends Component {
   // Set the context type for the class component
   static contextType = AuthContext;

    render() {
    // Access context through this.context
    const user = this.context.user;
      return (
          <Tab.Navigator   
          screenOptions={{
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
            headerShown:false,
            tabBarStyle: {
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: '#f4f4f4'
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500'
              }
          }}>
              <Tab.Screen name="Scan" component={Scan} 
                options={{
                    tabBarIcon: ({color, size, focused}) => (
                        focused?<Ionicons name="barcode" size={24} color="black" />:<Ionicons name="barcode-outline" size={24} color="black" />   
      )}}
              />
              <Tab.Screen name="History" component={History} 
                    options={{
                    tabBarIcon: ({color, size, focused}) => (
                        focused?<FontAwesome name="list-ul" size={20} color="black" />:<Feather name="list" size={24} color="black" />  
        )}}
              />
              <Tab.Screen
                  name="Profile"
                  component={Profile}
                  options={{
                    tabBarIcon: ({ color, size, focused }) =>
                      user?.profile_img ? (
                        <Image
                          source={{ uri: user.profile_img }}
                          style={{
                            width: 28, 
                            height: 28,
                            borderRadius: 12, 
                          }}
                        />
                      ) : focused ? (
                        <FontAwesome name="user" size={22} color="black" />
                      ) : (
                        <FontAwesome name="user-o" size={20} color="black" />
                      ),
                  }}
                />
          </Tab.Navigator>
      )
    }
  }

  export default TabNavigation;