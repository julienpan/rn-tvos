import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

export default function IPTVScreen() {
    const [videoURL, setVideoURL] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // État pour suivre l'état de chargement de la vidéo
    const isFocused = useIsFocused();
    const videoRef = useRef(null);

    const [videoURLs, setVideoURLs] = useState([]);
    const [focusIndex, setFocusIndex] = useState(-1);

    useEffect(() => {

        if (isFocused) {
            fetchVideoURL();
        } else {
            pauseVideo();
        }
        return () => setVideoURL('');
    }, [isFocused]);

    const fetchVideoURL = async () => {
        try {
            setIsLoading(true); // Activer l'indicateur de chargement
            const response = await fetch('http://localhost:3000/api/iptv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ m3uLink: 'https://iptv-org.github.io/iptv/countries/fr.m3u' }),
            });
            const data = await response.json();
            setVideoURLs(data.videoURLs);
            setVideoURL(data.videoURLs[0]);
            setFocusIndex(0);
        } catch (error) {
            console.error('Error fetching video URL:', error);
        } finally {
            setIsLoading(false); // Désactiver l'indicateur de chargement
        }
    };

    const pauseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pauseAsync();
        }
    };

    const handleMuteToggle = () => {
        setIsMuted(prev => !prev);
    };

    const handlePressIn = async (item, index) => {
        setFocusIndex(index);
        setIsLoading(true); // Activer l'indicateur de chargement lors du changement de chaîne
        setVideoURL(item);
    };

    const handlePlaybackStatusUpdate = (status) => {
        if (status.isLoaded && !status.isPlaying) {
            setIsLoading(false); // Désactiver l'indicateur de chargement lorsque la vidéo est chargée
        }
    };

    // const handleQualityChange = (resolution) => {
    //     // Remplacer la résolution de la vidéo dans l'URL avec la nouvelle résolution sélectionnée
    //     console.log(resolution);
    //     let newURL = videoURL.replace(/(\/playlist_\d+p)\.m3u8$/, '/playlist_' + resolution + '.m3u8');
    //     console.log(newURL);
    //     setVideoURL(newURL);
    // };

    return (
        <View style={styles.container}>
            {/* Afficher l'indicateur de chargement si isLoading est true */}
            {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
            <FlatList
                numColumns={2}
                bounces={false}
                bouncesZoom={false}
                style={styles.list}
                data={videoURLs}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <TouchableHighlight
                        style={[styles.card, focusIndex === index && styles.cardFocus]}
                        onPress={() => handlePressIn(item, index)}
                    >
                        <Text style={[styles.text, focusIndex === index && styles.textFocus]}>Chaîne {index + 1}</Text>
                    </TouchableHighlight>
                )}
            />
            {videoURL ? (
                <Video
                    ref={videoRef}
                    source={{ uri: videoURL }}
                    style={styles.video}
                    shouldPlay
                    useNativeControls
                    isMuted={isMuted}
                    resizeMode={ResizeMode.CONTAIN}

                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate} // Ajoutez cet événement pour surveiller l'état de la lecture de la vidéo
                />
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    list: {
        marginLeft: 250,
    },
    card: {
        borderWidth: 1,
        borderColor: 'white',
        width: 100,
        height: 100,
        overflow: 'hidden',
        padding: 10,
    },
    cardFocus: {
        borderColor: 'red',
    },
    text: {
        color: 'white',
    },
    textFocus: {
        color: 'red',
    },
    loadingText: {
        position: 'absolute',
        color: 'green',
        fontSize: 30,
        left: '50%',
        top: '50%',
    },
    video: {
        position: 'absolute',
        // backgroundColor: 'white',
        width: '70%',
        height: '80%',
        left: 500
    },
    muteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderRadius: 8,
    },
    muteButtonText: {
        color: 'white',
        fontSize: 16,
    },
    qualityButtons: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        flexDirection: 'row',
    },
    qualityButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderRadius: 8,
        marginRight: 10,
    },
    qualityButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
