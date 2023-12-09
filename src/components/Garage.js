import React, { Component } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { theme, Text, Block, NavBar, Button, Icon } from "galio-framework";
import GarageService from "../services/garages";

class Garage extends Component {
  state = {
    garagesList: [],
    error: null,
    highlightedGarageId: null,
    loading: false,
  };

  componentDidMount() {
    this.fetchGarages();
  }

  fetchGarages = async () => {
    try {
      this.setState({ loading: true });
      const garagesData = await GarageService.getAllGarages();
      this.setState({ garagesList: garagesData, error: null });
    } catch (error) {
      console.error("Error fetching garages:", error);
      this.setState({ error: "Erro ao carregar garagens." });
    } finally {
      this.setState({ loading: false });
    }
  };

  confirmDeleteGarage = (garage) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir a garagem "${garage.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => this.handleDeleteGarage(garage),
        },
      ],
      { cancelable: true }
    );
  };

  handleDeleteGarage = async (garage) => {
    try {
      await GarageService.deleteGarage(garage.id);

      const updatedGarages = this.state.garagesList.filter(
        (item) => item.id !== garage.id
      );
      this.setState({ garagesList: updatedGarages, error: null });
    } catch (error) {
      console.error("Error deleting garage:", error);
      this.setState({ error: "Erro ao deletar garagem." });
    }
  };


  renderGarages = () => {
    const { garagesList, highlightedGarageId } = this.state;
    const { navigation } = this.props;

    return garagesList.map((garage, index) => (
      <Block key={index} style={styles.container}>
        <Block style={styles.card}>
          <Block style={styles.imageContainer}>
            {garage.image && garage.image.url ? (
              <Image style={styles.image} source={{ uri: garage.image.url }} />
            ) : (
              <Text style={styles.errorText}>Imagem não disponível</Text>
            )}
            <TouchableOpacity
              onPress={() => this.confirmDeleteGarage(garage)}
              style={[
                styles.deleteButton,
                highlightedGarageId === garage.id && styles.highlightedDeleteButton,
              ]}
              onTouchStart={() => this.setState({ highlightedGarageId: garage.id })}
              onTouchEnd={() => this.setState({ highlightedGarageId: null })}
            >
              <Icon
                name="trash"
                family="feather"
                size={theme.SIZES.BASE}
                color={theme.COLORS.ERROR}
                style={styles.deleteIcon}
              />
            </TouchableOpacity>
          </Block>
          <Block style={styles.content}>
            <Block style={styles.titleContainer}>
              <Text h4 style={styles.text}>
                {garage.name}
              </Text>
            </Block>
            <Text style={styles.text2}>{garage.address}</Text>
            <Button style={styles.button} onPress={() => navigation.navigate("Carros")}>
              Ver Veículos
            </Button>
          </Block>
        </Block>
      </Block>
    ));
  };

  render() {
    const { error, loading } = this.state;
    const { navigation } = this.props;

    return (
      <Block safe flex>
        <NavBar
          style={styles.navbar}
          title="Garagens"
          titleStyle={styles.navTitle}
          leftIconColor={theme.COLORS.WHITE}
          rightIconColor={theme.COLORS.INFO}
          backgroundColor={theme.COLORS.INFO}
          iconColor={theme.COLORS.WHITE}
          left={<Icon name="menu" family="feather" size={24} color={theme.COLORS.WHITE} />}
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
        <ScrollView>
          {loading ? (
            <ActivityIndicator size="large" color={theme.COLORS.INFO} style={styles.loadingIndicator} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            this.renderGarages()
          )}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: theme.SIZES.BASE * 20,
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE * 2,
    borderRadius: theme.SIZES.BASE,
    shadowColor: "black",
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: theme.SIZES.BASE * 20,
    height: theme.SIZES.BASE * 12,
    borderRadius: theme.SIZES.BASE / 2,
    marginBottom: theme.SIZES.BASE,
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: theme.COLORS.INFO,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  highlightedDeleteButton: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
  },
  deleteIcon: {
    color: "red",
  },
  content: {
    flex: 1,
    padding: theme.SIZES.BASE,
    flexDirection: "column",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: theme.COLORS.BLACK,
    fontWeight: "bold",
  },
  text2: {
    color: theme.COLORS.BLACK,
    marginBottom: theme.SIZES.BASE,
  },
  errorText: {
    color: theme.COLORS.ERROR,
    textAlign: "center",
    marginTop: theme.SIZES.BASE,
  },
  loadingIndicator: {
    marginTop: theme.SIZES.BASE,
  },
  navTitle: {
    alignSelf: "flex-start",
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: theme.COLORS.WHITE,
  },
  navbar: {
    backgroundColor: theme.COLORS.INFO,
  },
});

export default Garage;
