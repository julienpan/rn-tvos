import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { useIsFocused } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { Card } from '@rneui/base';

export default function IPTVScreen() {
    const [videoURL, setVideoURL] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const isFocused = useIsFocused();
    const videoRef = React.useRef(null);

    const [videoURLs, setVideoURLs] = useState([]);

    useEffect(() => {
        if (isFocused) {
            fetchVideoURL();
        } else {
            // Pause the video when leaving the screen
            if (videoRef.current) {
                videoRef.current.pauseAsync();
            }
        }
        // Clean up the video URL when the component is unmounted
        return () => {
            setVideoURL('');
        };
    }, [isFocused]);

    const fetchVideoURL = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/iptv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ m3uLink: 'https://iptv-org.github.io/iptv/countries/fr.m3u' }), // Change to your m3u link
            });
            const data = await response.json();
            // Set only the first video URL from the playlist
            setVideoURLs(data.videoURLs);
        } catch (error) {
            console.error('Error fetching video URL:', error);
        }
    };

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
    };

    const [focus, setFocus] = useState('');
    const [currentV, setCurrentV] = useState('');

    const handlePressIn = (item) => {
        console.log(item);
        setCurrentV(item);
        setVideoURL(item);
    }

    return (
        <View style={styles.container}>
            <FlatList
                numColumns={2}
                bounces={false}
                bouncesZoom={false}
                style={styles.list}
                data={videoURLs}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }: any) => (
                    <TouchableHighlight style={currentV == item ? styles.cardFocus : styles.card} onFocus={() => setFocus(index)} onPress={() => handlePressIn(item)}>
                        <View>
                            <Text style={focus == index ? styles.text : { color: 'white' }}>Chaîne {index + 1}</Text>
                        </View>
                    </TouchableHighlight>
                )}
            >
            </FlatList>
            {videoURL ? (
                <Video
                    ref={videoRef}
                    source={{ uri: videoURL }}
                    style={styles.video}
                    shouldPlay
                    useNativeControls // Use native controls for the video
                    isMuted={isMuted}
                    resizeMode={ResizeMode.CONTAIN}
                />
            ) : (
                <Text style={styles.loadingText}>Loading...</Text>
            )}
            <TouchableOpacity style={styles.muteButton} onPress={handleMuteToggle}>
                <Text style={styles.muteButtonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
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
    cardFocus: {
        borderWidth: 1,
        borderColor: 'red',
        width: 100,
        height: 100,
        overflow: 'hidden',
        padding: 10,
    },
    card: {
        borderWidth: 1,
        borderColor: 'white',
        width: 100,
        height: 100,
        overflow: 'hidden',
        padding: 10,
    },
    text: {
        color: 'red',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
    },
    video: {
        position: 'absolute',
        backgroundColor: 'white',
        width: '70%',
        height: '100%',
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
});
