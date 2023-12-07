import React from "react";
import { View, Image, StyleSheet, StatusBar } from "react-native";
import { Text } from 'galio-framework'
import { Button } from "react-native";

import carService from "../services/cars.js";
import { useEffect, useState } from "react";

export default function Car({ car, navigation }) {
  const [cars, setCars] = useState([]);

  useEffect(async () => {
    const data = await carService.getAllCars(car);
    setCars(data);
  }, []);

  async function deleteCars(car) {
    const data = await carService.getAllCars(car);
    setCars(data);
  }

  return (
    <View>
      <View style={styles.addButton}>
        <Button title="+" onPress={() => navigation.navigate("Novo Carro")} />
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          {cars.map((car, index) => (
            <View style={styles.content} key={index}>
              <Text p muted style={styles.text}>{car.carName}</Text>
              <Text style={styles.text2}>{car.carOwner}</Text>
              <Text style={styles.text2}>{car.licensePlate}</Text>
              <Text style={styles.text2}>{car.dateTime}</Text>
              <Button title="Remover" onPress={() => deleteCars()} />
            </View>
          ))}
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 35,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    alignSelf: "center",
  },
  carImage: {
    width: "70%",
    height: 200,
    resizeMode: "stretch",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  text2: {
    marginTop: 5,
    marginLeft: 10,
    color: "black",
    height: "100%",
  },
  addButton: {
    marginBottom: 20,
    width: "30%",
    alignSelf: "center",
  },
  text: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 10,
  },
  card: {
    margin: 30,
  },
});
