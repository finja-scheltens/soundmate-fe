import { ImageBackground, Image, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { useEffect, useState } from 'react';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as tokenStore from '../store/actions/token';
import PrimaryButton from '../components/PrimaryButton';
import { AppColors } from '../constants/AppColors';

const discovery = {
    authorizationEndpoint:
        'https://accounts.spotify.com/authorize',
    tokenEndpoint:
        'https://accounts.spotify.com/api/token',
};

export default function LoginScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const [token, setToken] = useState('');

    const [request, response, promptAsync] =
        useAuthRequest(
            {
                responseType: ResponseType.Token,
                clientId: '19e3ddbf461f4f44997f1ffe82a6eddb',
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
                redirectUri: 'exp://127.0.0.1:19000/',
            },
            discovery,
        );

    useEffect(() => {
        if (response?.type === 'success') {
            const { access_token } = response.params;
            setToken(access_token);
        }
    }, [response]);

    useEffect(() => {
        if (token) {
            axios(
                'https://api.spotify.com/v1/me/top/tracks?time_range=short_term', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            }).then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log('error', error.message);
            });

            setTimeout(
                () =>
                    navigation.navigate('Root'),
                500,
            );

            dispatch(tokenStore.addToken(token));
        }
    });

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../assets/images/login-background.png")} resizeMode="cover" style={styles.background} />
            <View style={styles.innerContainer}>
                <Image source={require("../assets/images/logo.png")} style={styles.logo} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Soundmate</Text>
                    <Text style={styles.text}>Lorem ipsum dolar sit amet lorem ipsum dolar sit amet. Lorem ipsum dolar sit.</Text>
                </View>
                <PrimaryButton onPress={() => {
                    promptAsync();
                }} title={'Connect with Spotify'} />
            </View>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: AppColors.DARK_GREY,
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        paddingVertical: 100,
        width: '100%'
    },
    background: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        justifyContent: "center",

    },
    logo: {
        width: 220,
        height: 220,
        marginTop: 30
    },
    textContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20

    }
});
