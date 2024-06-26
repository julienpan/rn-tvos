import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { SectionList, Image, StyleSheet, Text, TouchableHighlight, View, FlatList, ScrollView } from 'react-native';
import datas from './assets/datas/datas.json';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import IPTVScreen from './components/IPTVScreen';

import { Card } from '@rneui/themed';

function HomeScreen() {
  const [focus, setFocus] = useState(null);

  const filmsParGenre = {};

  datas.forEach(film => {
    const genre = film.Genre;
    if (genre in filmsParGenre) {
      filmsParGenre[genre].push(film);
    } else {
      filmsParGenre[genre] = [film];
    }
  });

  const sections = Object.entries(filmsParGenre).map(([genre, films]) => ({
    title: genre,
    data: [{ key: genre, data: films }],
  }));


  return (
    <SectionList style={{ left: 250, backgroundColor: 'black', paddingLeft: 10 }}
      sections={sections}
      keyExtractor={(item: any) => item.data.imdbID}
      renderItem={({ section }) => (
        <View>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          <FlatList
            horizontal
            data={section.data[0].data}
            keyExtractor={(item) => item.imdbID}
            renderItem={({ item }) => (
              <TouchableHighlight
                style={[
                  styles.card,
                ]}
                onPressIn={() => setFocus(item.imdbID)}
                onPressOut={() => setFocus(null)}
              >
                <View style={styles.itemContainer}>
                  <Image
                    source={{ uri: item.Poster }}
                    style={styles.images}
                    resizeMode="cover"
                  />
                  <Text style={styles.title}>{item.Title}</Text>
                </View>
              </TouchableHighlight>
            )}
          />
        </View>
      )}
    />
  );
}

function DrawerScreen() {

  const navigation = useNavigation();

  const menu = ['Home', 'IPTV', 'Search', 'Settings', 'Profile', 'Messages', 'Notifications', 'LogOut'];
  const [focus, setFocus] = useState(null);
  const [currentNav, setCurrentNav] = useState('');

  const handlePress = (item) => {
    console.log('Button Press!', item);

    if (item === 'IPTV') {
      setCurrentNav('IPTV');
      navigation.navigate('IPTV');
    } else if(item === 'Home') {
      setCurrentNav('Home');
      navigation.navigate('Home');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {menu.map((item, index) =>
        <TouchableHighlight 
          key={item} 
          onFocus={() => setFocus(index)} 
          onPress={() => handlePress(item)} 
          underlayColor="transparent"
        >
          <View style={[styles.drawerButton, focus === index ? styles.itemDrawerFocused : null]}>
            <Text style={[styles.itemDrawer, currentNav ===  item ? styles.current : null ,focus === index ? styles.focused : null]}>{item}</Text>
          </View>
        </TouchableHighlight>
      )}
    </ScrollView>
  );
}


export default function App() {

  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{
        headerShown: false,
        swipeEdgeWidth: 0,  // Disable drawer swipe open
        drawerType: 'front', // you can also use 'permanent'
        drawerStyle: {
          backgroundColor: 'black',
          width: 250,
          left: 250,
        },
      }} drawerContent={DrawerScreen}>

        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="IPTV" component={IPTVScreen} />
      </Drawer.Navigator>
    </NavigationContainer >
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  current: {
    color: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  drawerButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  itemDrawer: {
    fontSize: 20,
    color: 'white',
    textAlign:'center'
  },
  itemDrawerFocused: {
    borderColor: 'white',
    borderWidth: 1,
  },
  focused: {
    fontSize: 30
  },
  button: {
    fontSize: 40,
    color: 'red',
  },
  sectionHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  itemContainer: {
    width: 400,
    height: 400,
    margin: 10,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    opacity: 0.2,
  },
  images: {
    width: '100%',
    height: '100%',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    padding: 5,
  },
});

