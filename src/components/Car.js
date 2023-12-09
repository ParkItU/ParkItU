import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { Text, Button, Block, NavBar, Icon, theme, Card } from "galio-framework";
import carService from "../services/cars.js";

export default function Cars({ navigation }) {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await carService.getAllCars(page);
        setCars((prevCars) => [...prevCars, ...data]);
        setError(null);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
        setError({ message: "Erro ao carregar carros.", error });
        setAlert({ type: "error", message: "Erro ao carregar carros." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const deleteCar = async (carId) => {
    try {
      const confirmed = window.confirm("Tem certeza que deseja excluir este carro?");
      if (!confirmed) return;

      await carService.deleteCar(carId);
      const updatedCars = cars.filter((car) => car.id !== carId);
      setCars(updatedCars);
      showAlert("success", "Carro excluído com sucesso.");
    } catch (error) {
      console.error("Error deleting car:", error);
      setError({ message: "Erro ao deletar carro.", error });
      showAlert("error", "Erro ao deletar carro.");
    }
  };

  const renderCars = () => {
    return cars.map((car) => (
      <Card
        key={car.id}
        flex
        style={styles.card}
        title={car.name}
        caption={car.owner}
        location={car.date}
        image={car.image.url}
        imageStyle={styles.carImage}
        borderless={true}
        shadowColor={theme.COLORS.INFO}
        imageBlockStyle={{ padding: theme.SIZES.BASE / 2 }}
        imageStyle={styles.cardImageRadius}
      >
        <Block style={styles.cardDescription}>
          <Text size={20} style={styles.text2}>
            {car.licensePlate}
          </Text>
          <Icon
            onPress={() => deleteCar(car.id)}
            onlyIcon
            name="trash"
            family="feather"
            style={styles.deleteIcon}
            iconSize={theme.SIZES.BASE}
            color={theme.COLORS.ERROR}
          />
        </Block>
      </Card>
    ));
  };

  return (
    <Block safe flex>
      <NavBar
        title="Veículos"
        style={styles.navbar}
        titleStyle={styles.navTitle}
        leftIconColor={theme.COLORS.BLACK}
        rightIconColor={theme.COLORS.INFO}
        left={<Icon
          name="chevron-left"
          family="feather"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />}
        right={
          <Button
            onlyIcon
            icon="plus"
            iconFamily="feather"
            iconSize={theme.SIZES.BASE}
            color={theme.COLORS.WHITE}
            iconColor={theme.COLORS.INFO}
            onPress={() => navigation.navigate("Novo Carro")}
          />
        }
      />
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <Text style={styles.loadingText}>Carregando...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error.message}</Text>
        ) : (
          renderCars()
        )}
        {alert && (
          <Text style={alert.type === "error" ? styles.errorText : styles.successText}>
            {alert.message}
          </Text>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </Block>
  );
}

const styles = StyleSheet.create({
  navTitle: {
    alignSelf: "flex-start",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: theme.COLORS.WHITE,
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE / 2,
    marginHorizontal: theme.SIZES.BASE / 2,
    borderRadius: theme.SIZES.BASE,
    shadowColor: theme.COLORS.BLACK,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImageRadius: {
    borderRadius: theme.SIZES.BASE / 2,
    marginBottom: theme.SIZES.BASE / 2,
    marginTop: theme.SIZES.BASE / 2,
  },
  carImage: {
    width: "auto",
    height: 200,
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2,
    margin: theme.SIZES.BASE / 2,
    flexDirection: "column",
    alignItems: "center",
  },
  text2: {
    color: theme.COLORS.ICON,
    textAlign: "center",
    marginTop: theme.SIZES.BASE / 2,
  },
  errorText: {
    color: theme.COLORS.ERROR,
    textAlign: "center",
    marginTop: theme.SIZES.BASE,
  },
  successText: {
    color: theme.COLORS.SUCCESS,
    textAlign: "center",
    marginTop: theme.SIZES.BASE,
  },
  navBar: {
    backgroundColor: theme.COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    color: theme.COLORS.INFO,
    textAlign: "center",
    marginTop: theme.SIZES.BASE,
  },
  actionButton: {
    marginVertical: theme.SIZES.BASE / 2,
  },
  navbar: {
    backgroundColor: theme.COLORS.INFO,
  },
  deleteIcon: {
    color: "red",
    alignSelf: "flex-end",
  },
});
