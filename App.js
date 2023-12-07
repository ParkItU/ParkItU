import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Garage from "./src/components/Garage";
import Car from "./src/components/Car";
import NewCar from "./src/components/NewCar";

const garages = [
  {
    nameGarage: "Soft Park",
    imageGarage:
      "https://www.agenciabrasilia.df.gov.br/wp-conteudo/uploads/2020/09/FOTO-BRENO-ESAKI-AG%C3%8ANCIA-SA%C3%9ADE-1-1-768x512.jpg",
    adressGarage: "Rua Itabaiana, 123",
  }
];

const cars = [
  {
    carName: "",
    licensePlate: "",
    carOwner: "",
    carImage: "",
    dateTime: "",
  },
];


const ListGarages = ({ navigation }) => {
  const [garageslist, setGaragesList] = useState(garages);

  return (
    <ScrollView>
      {garageslist.map((garage, index) => (
        <Garage key={index} garage={garage} navigation={navigation} />
      ))}
    </ScrollView>
  );
};

const ListCars = ({ navigation }) => {
  const [carslist, setCarsList] = useState(cars);

  return (
    <ScrollView>
      {carslist.map((car, index) => (
        <Car key={index} car={car} navigation={navigation} />
      ))}
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Garagem" component={ListGarages} />
        <Stack.Screen name="Carros" component={ListCars} />
        <Stack.Screen name="Novo Carro" component={NewCar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

