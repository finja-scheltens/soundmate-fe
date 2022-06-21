import {Button, StyleSheet} from 'react-native';
import {View} from '../components/Themed';
import {ResponseType, useAuthRequest} from 'expo-auth-session';
import {useDispatch} from 'react-redux';

const discovery = {
    authorizationEndpoint:
        'https://accounts.spotify.com/authorize'
};

export default function LoginScreen({navigation}: any) {
    const dispatch = useDispatch();

    const [request, response, promptAsync] =
        useAuthRequest(
            {
                responseType: ResponseType.Code,
                clientId: '83bf8873115447d893923470b70d209a',
                scopes: [
                    'user-read-currently-playing',
                    'user-read-recently-played',
                    'user-read-playback-state',
                    'user-top-read',
                    'user-modify-playback-state',
                    'streaming',
                    'user-read-email',
                    'user-read-private',
                ],
                usePKCE: false,
                redirectUri: 'http://10.0.2.2:8080/api/get-user-code/',
            }, discovery
        );


    return (
        <View style={styles.container}>
            <Button onPress={() => {
                promptAsync();
            }} title={'Login'}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
