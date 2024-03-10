import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AppColors } from "../constants/AppColors";
import { GenreData } from "../types";

import SecondaryButton from "../components/SecondaryButton";
import Badge from "../components/Badge";
import PrimaryButton from "./PrimaryButton";

interface ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  usersData: {
    topGenres?: GenreData[];
  };
}

export default function FilterModal({
  modalVisible,
  setModalVisible,
  usersData,
}: ModalProps) {
  return (
    <Modal
      animationType="fade"
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <SafeAreaProvider style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
        <SafeAreaView style={styles.modalView}>
          <Text style={styles.filterHeadline}>Filter</Text>
          <View style={styles.filterContainer}>
            <View style={styles.filterOptions}>
              <View>
                <Text style={styles.genreHeadline}>Deine Top Genres</Text>
                <View style={styles.genres}>
                  {usersData.topGenres?.map(
                    (genre: GenreData, index: number) => (
                      <Badge key={index} text={genre.name} clickable={true} />
                    )
                  )}
                </View>
              </View>
              <View>
                <Text style={styles.genreHeadline}>Geschlecht</Text>
                <View style={styles.genres}>
                  <Badge text="Männlich" clickable={true} />
                  <Badge text="Weiblich" clickable={true} />
                  <Badge text="Divers" clickable={true} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.filterButtons}>
            <SecondaryButton
              title="Abbrechen"
              style={{ flex: 1 }}
              onPress={() => {
                setModalVisible(false);
              }}
            />
            <PrimaryButton
              title="Anwenden"
              style={{ flex: 1 }}
              onPress={() => {}}
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 140,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: -20,
  },
  filterHeadline: {
    fontFamily: "Inter-Bold",
    textAlign: "center",
    fontSize: 22,
  },
  filterContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 40,
  },
  filterOptions: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  genreHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
    marginBottom: 10,
  },
  genres: {
    marginTop: 12,
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 14,
  },
});
