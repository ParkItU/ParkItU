// Garage.js
import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Alert } from "react-native";
import { theme, withGalio, GalioProvider, Text, Block, NavBar, Button, Icon, } from 'galio-framework';
import GarageService from '../services/garages'; // Importe o serviço

class Garage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      garagesList: [],
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const garagesData = await GarageService.getAllGarages();
      this.setState({ garagesList: garagesData, error: null });
    } catch (error) {
      console.error('Error fetching garages:', error);
      this.setState({ error: 'Erro ao carregar garagens.' });
    }
  }

  confirmAndDeleteGarage = async (garage) => {
    const confirmMessage = `Deseja realmente excluir a garagem "${garage.name}"?`;

    Alert.alert(
      'Confirmar Exclusão',
      confirmMessage,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => await this.deleteGarage(garage),
        },
      ],
      { cancelable: true }
    );
  };

  deleteGarage = async (garage) => {
    try {
      await GarageService.deleteGarage(garage.id);

      const updatedGarages = this.state.garagesList.filter(item => item.id !== garage.id);
      this.setState({ garagesList: updatedGarages, error: null });
    } catch (error) {
      console.error('Error deleting garage:', error);
      this.setState({ error: 'Erro ao deletar garagem.' });
    }
  };

  renderGarages = () => {
    const { garagesList } = this.state;
    const { navigation } = this.props;

    return garagesList.map((garage, index) => (
      <Block key={index} style={styles.container}>
        <Block style={styles.card}>
          <Block style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: garage.image.url }} />
            <TouchableOpacity
              onPress={() => this.confirmAndDeleteGarage(garage)}
              style={styles.deleteButton}
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
              <Text h4 style={styles.text}>{garage.name}</Text>
            </Block>
            <Text style={styles.text2}>{garage.address}</Text>
            <Button style={styles.button} onPress={() => navigation.navigate("Carros")}>
              Ver Carros
            </Button>
          </Block>
        </Block>
      </Block>
    ));
  };

  render() {
    const { error } = this.state;
    const { navigation } = this.props;

    return (
      <Block safe flex>
        <NavBar
          title="Minhas Garagens"
          titleStyle={{ alignSelf: 'flex-start', marginLeft: 10, fontWeight: 'bold', color: theme.COLORS.ICON }}
          leftIconColor={theme.COLORS.MUTED}
          rightIconColor={theme.COLORS.ICON}
          left={(
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon
                name="menu"
                family="feather"
                size={theme.SIZES.BASE}
                color={theme.COLORS.ICON}
              />
            </TouchableOpacity>
          )}
          right={(
            <Button
              onlyIcon
              icon="plus"
              iconFamily="feather"
              iconSize={theme.SIZES.BASE}
              color={theme.COLORS.ICON}
              onPress={() => navigation.navigate("Novo Carro")}
            />
          )}
          style={Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : null}
        />
        <ScrollView>
          {error ? (
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: theme.SIZES.BASE * 20,
    height: theme.SIZES.BASE * 20,
    borderRadius: theme.SIZES.BASE / 2,
    marginBottom: theme.SIZES.BASE,
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: theme.COLORS.ICON,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: "red",
  },
  text: {
    color: theme.COLORS.ICON,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: theme.SIZES.BASE * 20,
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE * 2,
    borderRadius: theme.SIZES.BASE,
    shadowColor: 'black',
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: theme.SIZES.BASE * 2,
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SIZES.BASE,
  },
  text2: {
    color: theme.COLORS.ICON,
  },
  errorText: {
    color: theme.COLORS.ERROR,
    textAlign: 'center',
    marginTop: theme.SIZES.BASE,
  },
});

export default Garage;
