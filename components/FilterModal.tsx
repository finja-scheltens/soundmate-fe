import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AppColors } from "../constants/AppColors";
import { GenderType, GenreData } from "../types";

import SecondaryButton from "../components/SecondaryButton";
import Badge from "../components/Badge";
import PrimaryButton from "./PrimaryButton";

interface ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  usersData: {
    topGenres?: GenreData[];
  };
  savedSelectedGenres: string[];
  savedSelectedGenders: GenderType[];
  onApplyFilters: (
    selectedGenres: string[],
    selectedGender: GenderType[]
  ) => void;
}

export default function FilterModal({
  modalVisible,
  usersData,
  savedSelectedGenres,
  savedSelectedGenders,
  setModalVisible,
  onApplyFilters,
}: ModalProps) {
  const [tempSelectedGenres, setTempSelectedGenres] = useState<string[]>([]);
  const [tempSelectedGenders, setTempSelectedGenders] = useState<GenderType[]>(
    []
  );

  useEffect(() => {
    if (modalVisible) {
      setTempSelectedGenres(savedSelectedGenres);
      setTempSelectedGenders(savedSelectedGenders);
    }
  }, [modalVisible]);

  const toggleGenreSelection = (genre: string) => {
    if (tempSelectedGenres.includes(genre)) {
      setTempSelectedGenres(tempSelectedGenres.filter(g => g !== genre));
    } else {
      setTempSelectedGenres([...tempSelectedGenres, genre]);
    }
  };

  const toggleGenderSelection = (gender: GenderType) => {
    if (tempSelectedGenders.includes(gender)) {
      setTempSelectedGenders(tempSelectedGenders.filter(g => g !== gender));
    } else {
      setTempSelectedGenders([...tempSelectedGenders, gender]);
    }
  };
  const handleResetFilters = () => {
    setTempSelectedGenres([]);
    setTempSelectedGenders([]);
  };

  const handleApplyFilters = () => {
    onApplyFilters(tempSelectedGenres, tempSelectedGenders);
    setModalVisible(false);
  };

  const handleCancelFilters = () => {
    setModalVisible(false);
  };

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
          <View style={styles.filterHeader}>
            <Text style={styles.filterHeadline}>Filter</Text>
            <Button title="Zurücksetzen" onPress={handleResetFilters} />
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.filterContainer}>
              <View style={styles.filterOptions}>
                <View>
                  <Text style={styles.genreHeadline}>Genres</Text>
                  <View style={styles.genres}>
                    {usersData.topGenres
                      ?.sort((a: GenreData, b: GenreData) =>
                        a.name.localeCompare(b.name)
                      )
                      .map((genre: GenreData, index: number) => (
                        <Badge
                          key={index}
                          text={genre.name}
                          selected={tempSelectedGenres.includes(genre.name)}
                          onPress={() => toggleGenreSelection(genre.name)}
                        />
                      ))}
                  </View>
                </View>
                <View>
                  <Text style={styles.genreHeadline}>Geschlecht</Text>
                  <View style={styles.genres}>
                    {Object.entries(GenderType).map(([key, value], index) => (
                      <Badge
                        key={index}
                        text={value}
                        selected={tempSelectedGenders.includes(
                          key as GenderType
                        )}
                        onPress={() => toggleGenderSelection(key as GenderType)}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.filterButtons}>
            <SecondaryButton
              title="Abbrechen"
              style={{ flex: 1 }}
              onPress={handleCancelFilters}
            />
            <PrimaryButton
              title="Anwenden"
              style={{ flex: 1 }}
              onPress={handleApplyFilters}
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
    paddingTop: -20,
  },
  filterHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 14,
    shadowColor: AppColors.GREY_900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
});
