import { createDrawerNavigator } from '@react-navigation/drawer';
import App from '../App';
import SearchScreen from './SearchScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ navigation }) => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={App} />
            <Drawer.Screen name="Recherche" component={SearchScreen} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;