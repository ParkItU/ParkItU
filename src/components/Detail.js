import React from "react";
import { View, Text, Image, StyleSheet, Button, StatusBar } from "react-native"

const Detail = ({ detail, navigation }) => {
    return (
        <View>
            <View style={styles.container}>
                <View>
                    <Text style={styles.text}>{detail.carName}</Text>
                </View>
                <View style={styles.center}>
                    <Image source={{ uri: detail.carImage }} style={styles.carImage} />
                </View>
                <View style={styles.text2}>
                    <Text>{detail.carOwner}</Text>
                    <Text>{detail.licensePlate}</Text>
                    <Text>{detail.garageName}</Text>
                    <Text>{detail.dateTime}</Text>
                </View>
                <View style={styles.delButton}>
                    <Button title="Remover"
                        onPress={() => navigation.navigate("")} />
                    <StatusBar style="auto" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 35,
        backgroundColor: "white",
        width: "100%",
        borderRadius: 20,
        alignSelf: "center",
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
    },
    carImage: {
        width: "70%",
        height: 200,
        resizeMode: "stretch",
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 10,
        color: "black",
        alignSelf: "center",
        color: "black",
    },
    text2: {
        fontSize: 16,
        color: "black",
        padding: 10,
    },
    delButton: {
        margin: 20,
        width: "30%",
        alignSelf: "center",
    }
});

export default Detail;