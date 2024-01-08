import React, { useRef, useState, useContext, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, Button, Input, Spinner } from '@ui-kitten/components';
import { useForm, Controller } from "react-hook-form";
import PagerView from 'react-native-pager-view';
import { updateProfile } from 'firebase/auth'
import { UserContext } from '../Context/UserContext';
import { useNavigation } from "@react-navigation/native";
import { getLatLong } from '../../utils/postcodeLookup';
import { GeoPoint, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

function SetupProfileScreen() {
    const { user } = useContext(UserContext);
    const nav = useNavigation()
    const [loading, setLoading] = useState(false);
    const pagerRef = useRef(null);

    const { control, handleSubmit, formState: { errors }, getValues } = useForm({
        defaultValues: {
            avatar: "",
            postcode: ""
        }
    });

    const onSubmit = useCallback(() => {
        const { avatar, postcode } = getValues();
        setLoading(true);
        updateProfile(user, { photoURL: avatar })
            .then(() => {
                return getLatLong(postcode)
            })
            .then((result) => {
                const { latitude, longitude } = result
                const userUid = doc(db, "users", user.uid);
                setDoc(userUid, {
                    username: user.displayName,
                    avatarUrl: user.photoURL,
                    location: new GeoPoint(latitude, longitude),
                    owned: [],
                    wishlist: [],
                    events: []
                });
            })
            .catch((error) => console.error(error))
            .finally(() => {
                nav.navigate('Root Nav', { screen: 'Profile' })
                setLoading(false)
            });
    }, [user, getValues]);

    const goToPage = useCallback((pageNumber) => {
        if (pagerRef.current) {
            pagerRef.current.setPage(pageNumber);
        }
    }, []);

    if (loading) return (
        <Layout style={styles.container}>
            <Spinner size='giant' />
        </Layout>
    );

    return (
        <Layout style={styles.container}>
            <PagerView style={styles.pagerView} initialPage={1} ref={pagerRef}>
                {/* Welcome Page */}
                <View key="1" style={styles.page}>
                    <View style={styles.formContainer}>
                        <Text style={styles.formHeader}>Welcome to SquareUp!</Text>
                        <Text>Your account has been successfully created.</Text>
                        <Button onPress={() => goToPage(1)} style={styles.button}>
                            Set Up Your Profile
                        </Button>
                    </View>
                </View>
                {/* Profile Setup Page */}
                <View key="2" style={styles.page}>
                    <View style={styles.formContainer}>
                        <Text style={styles.formHeader}>Set your avatar!</Text>
                        <Controller
                            control={control}
                            rules={{ required: "Link is required!" }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="Link us your avatar!"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label="Avatar"
                                />
                            )}
                            name="avatar"
                        />
                        {errors.avatar && <Text style={styles.error}>{errors.avatar.message}</Text>}
                        <Button onPress={() => goToPage(2)} style={styles.button}>
                            Next Step
                        </Button>
                    </View>
                </View>
                <View key="3" style={styles.page}>
                    <View style={styles.formContainer}>
                        <Text style={styles.formHeader}>Tell us where you are!</Text>
                        <Controller
                            control={control}
                            rules={{ required: "Postcode is required!" }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="Enter your postcode to find events near you"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label="Postcode"
                                />
                            )}
                            name="postcode"
                        />
                        {errors.avatar && <Text style={styles.error}>{errors.avatar.message}</Text>}
                        <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
                            Complete Profile
                        </Button>
                    </View>
                </View>
            </PagerView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    pagerView: {
        flex: 1,
        width: '100%',
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '90%',
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
    },
    button: {
        marginTop: 15,
    },
    formHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    }
});

export default SetupProfileScreen;
