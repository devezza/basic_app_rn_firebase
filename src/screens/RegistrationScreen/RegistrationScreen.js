import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../../firebase/config'; // Importa o app do Firebase



export default function RegistrationScreen({ navigation }) {
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = getAuth(app); // Usa o app do Firebase importado
    const firestore = getFirestore(app); // Usa o app do Firebase importado


    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }

    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const uid = userCredential.user.uid;
                const userData = { id: uid, email, user };

                const userRef = doc(firestore, 'user', uid);
                setDoc(userRef, userData)
                    .then(() => {
                        console.log('Usuário criado e adicionado no Firestore:', userData);
                    })
                    .catch((error) => {
                        console.error('Erro ao adicionar usuário no Firestore:', error.message);
                        alert(error.message);
                    });
            })
            .catch((error) => {
                console.error('Erro ao criar usuário:', error.message);
                alert(error.message);
            });
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/conquest-logo.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='User Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setUser(text)}
                    value={user}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Cadastrar</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Já tem uma conta?<Text onPress={onFooterLinkPress} style={styles.footerLink}>Login</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}