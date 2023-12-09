import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Button, Block, NavBar, Icon, Input, theme } from "galio-framework";
import CarService from "../services/cars.js";
import GarageService from "../services/garages.js";

const NewCar = ({ navigation }) => {
  const [garages, setGarages] = useState([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showCarForm, setShowCarForm] = useState(false);
  const [showGarageForm, setShowGarageForm] = useState(false);

  const initialCarFormState = {
    name: "",
    owner: "",
    licensePlate: "",
    date: "",
    image: "",
    garageName: "",
  };

  const initialGarageFormState = {
    name: "",
    address: "",
    image: "",
  };

  const [carForm, setCarForm] = useState(initialCarFormState);
  const [garageForm, setGarageForm] = useState(initialGarageFormState);

  useEffect(() => {
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    try {
      const garagesData = await GarageService.getAllGarages();
      setGarages(garagesData);
    } catch (error) {
      handleServiceError("Erro ao carregar garagens.", error);
    }
  };

  const handleServiceError = (message, error) => {
    console.error(message, error);
    setError({ message, error });
    showAlert("error", message);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const deleteEntity = async (entityType, entityId) => {
    try {
      const confirmed = await new Promise((resolve) =>
        Alert.alert(
          `Confirmar Exclusão de ${entityType}`,
          `Tem certeza que deseja excluir este ${entityType.toLowerCase()}?`,
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            { text: "Excluir", onPress: () => resolve(true) },
          ],
          { cancelable: true }
        )
      );

      if (!confirmed) return;

      await (entityType === "Car" ? CarService.deleteCar(entityId) : GarageService.deleteGarage(entityId));

      const updatedEntities = garages.filter((entity) => entity.id !== entityId);
      setGarages(updatedEntities);
      showAlert("success", `${entityType} excluído com sucesso.`);
    } catch (error) {
      const errorMessage = `Erro ao deletar ${entityType.toLowerCase()}.`;
      handleServiceError(errorMessage, error);
    }
  };

  const handleAddEntity = (entityType) => {
    if (entityType === "Car") {
      setShowCarForm(true);
    } else {
      setShowGarageForm(true);
    }
  };

  const handleSaveEntity = async (entityType) => {
    const form = entityType === "Car" ? carForm : garageForm;
    console.log("Dados do formulário:", form);

    const service = entityType === "Car" ? CarService : GarageService;

    try {
      await service.createGarage(form);

      if (entityType === "Car") {
        setShowCarForm(false);
        setCarForm(initialCarFormState);
      } else {
        setShowGarageForm(false);
        setGarageForm(initialGarageFormState);
        fetchGarages();
      }

      showAlert("success", `${entityType} adicionado com sucesso.`);
    } catch (error) {
      const errorMessage = `Erro ao salvar ${entityType.toLowerCase()}.`;
      handleServiceError(errorMessage, error);
    }
  };


  const handleImageChange = (entityType, image) => {
    if (entityType === "Car") {
      setCarForm({ ...carForm, image });
    } else {
      setGarageForm({ ...garageForm, image });
    }
  };

  return (
    <Block safe flex>
      <NavBar
        title="Cadastro"
        titleStyle={styles.navTitle}
        leftIconColor="white"
        rightIconColor="black"
        style={styles.navbar}
        left={
          <Icon
            name="chevron-left"
            family="feather"
            size={24}
            color="white"
            onPress={() => navigation.goBack()}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <>
          <Block style={styles.previewContainer}>
            <Block style={styles.card}>
              <Icon
                family="MaterialIcons"
                name="directions-car"
                size={80}
                color={theme.COLORS.ICON}
                style={styles.previewIcon}
              />
              <Text h5 style={styles.previewTitle}>
                Cadastro de Veículo
              </Text>
              <Text style={styles.previewDescription}>
                Clique no botão abaixo para adicionar um novo carro à sua frota.
              </Text>
              <Button onPress={() => handleAddEntity("Car")} style={styles.previewButton}>
                Novo
              </Button>
            </Block>
            <View style={{ marginVertical: 20 }} />
          </Block>
          <Block style={styles.previewContainer}>
            <Block style={styles.card}>
              <Icon
                family="MaterialIcons"
                name="home"
                size={80}
                color={theme.COLORS.ICON}
                style={styles.previewIcon}
              />
              <Text h5 style={styles.previewTitle}>
                Cadastro de Garagem
              </Text>
              <Text style={styles.previewDescription}>
                Clique no botão abaixo para adicionar uma nova garagem à sua lista.
              </Text>
              <Button onPress={() => handleAddEntity("Garage")} style={styles.previewButton}>
                Novo
              </Button>
            </Block>
            <View style={{ marginVertical: 20 }} />
          </Block>
          {showCarForm && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showCarForm}
              onRequestClose={() => setShowCarForm(false)}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.modalContainer}>
                  <Block style={styles.modalContent}>
                    <Text h5 style={styles.modalTitle}>
                      Cadastro de Carro
                    </Text>
                    <Input
                      label="Nome"
                      placeholder="Nome do carro"
                      value={carForm.name}
                      onChangeText={(text) => setCarForm({ ...carForm, name: text })}
                    />
                    <Input
                      label="Proprietário"
                      placeholder="Nome do proprietário"
                      value={carForm.owner}
                      onChangeText={(text) => setCarForm({ ...carForm, owner: text })}
                    />
                    <Input
                      label="Placa"
                      placeholder="Placa do carro"
                      value={carForm.licensePlate}
                      onChangeText={(text) => setCarForm({ ...carForm, licensePlate: text })}
                    />
                    <Input
                      label="Data"
                      placeholder="Data do carro"
                      value={carForm.date}
                      onChangeText={(text) => setCarForm({ ...carForm, date: text })}
                    />
                    <Input
                      label="Imagem"
                      placeholder="URL da imagem do carro"
                      value={carForm.image}
                      onChangeText={(text) => setCarForm({ ...carForm, image: text })}
                    />
                    <Input
                      label="Garagem"
                      placeholder="Nome da garagem do carro"
                      value={carForm.garageName}
                      onChangeText={(text) => setCarForm({ ...carForm, garageName: text })}
                    />
                    <Button onPress={() => handleSaveEntity("Car")} style={styles.modalButton}>
                      Adicionar Veículo
                    </Button>
                    <Button onPress={() => setShowCarForm(false)} style={styles.modalButton} color="warning">
                      Cancelar
                    </Button>
                  </Block>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
          {showGarageForm && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showGarageForm}
              onRequestClose={() => setShowGarageForm(false)}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.modalContainer}>
                  <Block style={styles.modalContent}>
                    <Text h5 style={styles.modalTitle}>
                      Cadastro de Garagem
                    </Text>
                    <Input
                      label="Nome"
                      placeholder="Nome da garagem"
                      value={garageForm.name}
                      onChangeText={(text) => setGarageForm({ ...garageForm, name: text })}
                    />
                    <Input
                      label="Endereço"
                      placeholder="Endereço da garagem"
                      value={garageForm.address}
                      onChangeText={(text) => setGarageForm({ ...garageForm, address: text })}
                    />
                    <Input
                      label="Imagem"
                      placeholder="URL da imagem da garagem"
                      value={garageForm.image}
                      onChangeText={(text) => setGarageForm({ ...garageForm, image: text })}
                    />
                    <Button onPress={() => handleSaveEntity("Garage")} style={styles.modalButton}>
                      Adicionar Garagem
                    </Button>
                    <Button onPress={() => setShowGarageForm(false)} style={styles.modalButton} color="warning">
                      Cancelar
                    </Button>
                  </Block>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </>
        {alert && (
          <Text style={alert.type === "error" ? styles.errorText : styles.successText}>
            {alert.message}
          </Text>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </Block>
  );
};


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",

    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: theme.SIZES.BASE / 2,
    padding: theme.SIZES.BASE,
    width: "80%",
    alignSelf: "center",

  },
  modalTitle: {
    marginBottom: theme.SIZES.BASE,
    textAlign: "center",
  },
  modalButton: {
    marginVertical: theme.SIZES.BASE / 2,
    color: "white",
    backgroundColor: theme.COLORS.INFO,
    borderRadius: theme.SIZES.BASE / 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2,
  },
  container: {
    marginBottom: 35,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    alignSelf: "center",
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: theme.COLORS.BLACK,
    shadowRadius: 4,
    elevation: 2,
    padding: theme.SIZES.BASE,
    width: "80%",
    alignItems: "center",
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
  button: {
    alignSelf: "flex-end",
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2,
    margin: theme.SIZES.BASE / 2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: theme.SIZES.BASE / 2,
  },
  navTitle: {
    alignSelf: "flex-start",
    marginLeft: 10,
    fontWeight: "bold",
    alignItems: "center",
    fontSize: 20,
    color: theme.COLORS.WHITE,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.SIZES.BASE * 2,
  },
  previewIcon: {
    marginBottom: theme.SIZES.BASE,
  },
  previewTitle: {
    marginBottom: theme.SIZES.BASE / 2,
    fontWeight: "bold",
    color: theme.COLORS.BLACK,
  },
  previewDescription: {
    textAlign: "center",
    marginBottom: theme.SIZES.BASE,
    color: theme.COLORS.BLACK,
  },
  previewButton: {
    width: "50%",
    backgroundColor: theme.COLORS.INFO,
    borderRadius: theme.SIZES.BASE / 2,
  },
  navbar: {
    backgroundColor: theme.COLORS.INFO,
  },
});

export default NewCar;
