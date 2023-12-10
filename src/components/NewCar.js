import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, ScrollView, Alert, Modal, TouchableWithoutFeedback, Keyboard, Image } from "react-native";
import { Text, Button, Block, Icon, Input, theme, NavBar } from "galio-framework";
import CarService from "../services/cars.js";
import GarageService from "../services/garages.js";
import ImagePicker from 'react-native-image-picker';

const NewCar = ({ navigation }) => {
  const [garages, setGarages] = useState([]);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showCarForm, setShowCarForm] = useState(false);
  const [showGarageForm, setShowGarageForm] = useState(false);
  const [selectedCarImage, setSelectedCarImage] = useState(null);
  const [selectedGarageImage, setSelectedGarageImage] = useState(null);

  const initialCarFormState = {
    name: "",
    owner: "",
    licensePlate: "",
    date: "data_valor",
    garage: "garagem_valor",
    ownerPhone: "telefone_proprietario_valor",
  };

  const initialGarageFormState = {
    name: "",
    address: "",
    image: "",
  };

  const [carForm, setCarForm] = useState(initialCarFormState);
  const [garageForm, setGarageForm] = useState(initialGarageFormState);

  const pickCarImage = () => {
    const options = {
      title: 'Escolher imagem do carro',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('Usuário cancelou a escolha da imagem');
      } else if (response.error) {
        console.log('Erro ao escolher imagem:', response.error);
      } else {
        setSelectedCarImage({ uri: response.uri });
        setCarForm({ ...carForm, image: response.uri });
      }
    });
  };

  const pickGarageImage = () => {
    const options = {
      title: 'Escolher imagem da garagem',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('Usuário cancelou a escolha da imagem');
      } else if (response.error) {
        console.log('Erro ao escolher imagem:', response.error);
      } else {
        setSelectedGarageImage({ uri: response.uri });
        setGarageForm({ ...garageForm, image: response.uri });
      }
    });
  };

  const handleInputChange = (field, value) => {
    setGarageForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleAddEntity = (entityType) => {
    if (entityType === "Car") {
      setShowCarForm(true);
    } else {
      setShowGarageForm(true);
    }
  };

  const handleServiceError = (message, error) => {
    console.error(message, error);
    setError({ message, error });
    showAlert("error", message);
  };

  const handleSaveEntity = async (entityType) => {
    const form = entityType === "Car" ? carForm : garageForm;
    console.log("Dados do formulário:", form);

    const service = entityType === "Car" ? CarService : GarageService;

    try {
      await service.createCar(form);

      if (entityType === "Car") {
        setShowCarForm(false);
        setCarForm(initialCarFormState);
        fetchCars();
      } else {
        setShowGarageForm(false);
        setGarageForm(initialGarageFormState);
        fetchGarages();
      }

      showAlert("success", `${entityType} adicionado com sucesso.`);
    } catch (error) {
      const errorMessage = `Erro ao salvar ${entityType.toLowerCase()}.`;

      if (error.response) {
        console.error("Response data:", error.response.data);
        showAlert("error", errorMessage);
      } else {
        console.error("Error creating car:", error);
        handleServiceError(errorMessage, error);
      }
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
                      onChangeText={(text) => handleInputChange("name", text)}
                    />
                    <Input
                      label="Endereço"
                      placeholder="Endereço da garagem"
                      value={garageForm.address}
                      onChangeText={(text) => handleInputChange("address", text)}
                    />
                    <Input
                      label="Imagem"
                      placeholder="Clique para escolher uma imagem"
                      value={garageForm.image}
                      onFocus={pickGarageImage}
                      editable={false}
                    />
                    <View style={styles.container}>
                      <Button title="Escolher Imagem" onPress={pickGarageImage} />
                      {selectedGarageImage && <Image source={selectedGarageImage} style={styles.image} />}
                    </View>
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
