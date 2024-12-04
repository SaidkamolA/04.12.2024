import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image } from 'react-native'; 
import CharactersScreen from './Characters';
import EpisodesScreen from './Episodes';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen  
          name="Персонажи"
          component={CharactersScreen} 
          options={{
            title: "Персонажи",
            tabBarIcon: () => <Image source={require('./assets/icons8-rick-sanchez-20.png')} />
          }} 
        />
        <Tab.Screen 
          name="Эпизоды" 
          component={EpisodesScreen}
          options={{
            title:'Эпизоды',
            tabBarIcon:()=><Image source={require('./assets/icons8-episode-20.png')}/>
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
