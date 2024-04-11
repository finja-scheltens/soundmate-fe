import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";

import { AppColors } from "../../constants/AppColors";
import { GenderType, GenreData, UserLocation } from "../../types";

import SecondaryButton from "../SecondaryButton";
import Badge from "../Badge";
import PrimaryButton from "../PrimaryButton";

interface ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  usersData: {
    topGenres?: GenreData[];
  };
  savedSelectedGenres: string[];
  savedSelectedGenders: GenderType[];
  savedDistanceValue: number | undefined;
  savedDistanceFilterEnabled: boolean;
  userLocation: UserLocation["location"];
  onApplyFilters: (
    selectedGenres: string[],
    selectedGender: GenderType[],
    distanceValue: number | undefined,
    distanceFilterEnabled: boolean
  ) => void;
}

export default function FilterModal({
  modalVisible,
  usersData,
  savedSelectedGenres,
  savedSelectedGenders,
  savedDistanceValue,
  savedDistanceFilterEnabled,
  userLocation,
  setModalVisible,
  onApplyFilters,
}: ModalProps) {
  const [tempSelectedGenres, setTempSelectedGenres] = useState<string[]>([]);
  const [tempSelectedGenders, setTempSelectedGenders] = useState<GenderType[]>(
    []
  );
  const [tempDistanceValue, setTempDistanceValue] = useState<
    number | undefined
  >(10);
  const [tempIsRadiusEnabled, setTempIsRadiusEnabled] = useState(false);

  useEffect(() => {
    // enable radius filter only when location access is permitted
    userLocation === null
      ? setTempIsRadiusEnabled(false)
      : setTempIsRadiusEnabled(savedDistanceFilterEnabled);
  }, [userLocation]);

  useEffect(() => {
    if (modalVisible) {
      setTempSelectedGenres(savedSelectedGenres);
      setTempSelectedGenders(savedSelectedGenders);
      setTempDistanceValue(savedDistanceValue);
      setTempIsRadiusEnabled(savedDistanceFilterEnabled);
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

  const toggleSwitch = () => {
    setTempIsRadiusEnabled(previousState => !previousState);
  };

  const handleDisabledClick = () => {
    if (userLocation === null) {
      Alert.alert(
        "Standortdienste aus",
        "Gehe in die Einstellungen und prüfe, ob Soundmate auf deinen Standort zugreifen darf.",
        [{ text: "OK" }]
      );
    }
  };

  const handleResetFilters = () => {
    setTempSelectedGenres([]);
    setTempSelectedGenders([]);
    setTempIsRadiusEnabled(false);
  };

  const handleApplyFilters = () => {
    onApplyFilters(
      tempSelectedGenres,
      tempSelectedGenders,
      tempDistanceValue,
      tempIsRadiusEnabled
    );
    setModalVisible(false);
  };

  const handleCancelFilters = () => {
    setModalVisible(false);
  };

  // disable slider if either the switch is deactivated or user location is not available
  const isRadiusSliderDisabled = !tempIsRadiusEnabled || userLocation === null;

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
            <TouchableOpacity hitSlop={15} onPress={handleResetFilters}>
              <Text style={styles.resetFilterButtonText}>Zurücksetzen</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.filterContainer}>
              <View style={styles.filterOptions}>
                <View>
                  <Text style={styles.optionHeadline}>Genres</Text>
                  <View style={styles.options}>
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
                  <Text style={styles.optionHeadline}>Geschlecht</Text>
                  <View style={styles.options}>
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
                <View>
                  <View style={styles.radiusHeader}>
                    <Text style={styles.optionHeadline}>Radius</Text>
                    <Text style={styles.radiusValue}>
                      {tempDistanceValue} km
                    </Text>
                  </View>
                  <Slider
                    minimumValue={1}
                    maximumValue={400}
                    step={10}
                    disabled={isRadiusSliderDisabled}
                    minimumTrackTintColor={
                      isRadiusSliderDisabled
                        ? AppColors.GREY_500
                        : AppColors.SECONDARY
                    }
                    maximumTrackTintColor={AppColors.GREY_200}
                    thumbTintColor={
                      isRadiusSliderDisabled
                        ? AppColors.GREY_500
                        : AppColors.SECONDARY
                    }
                    value={tempDistanceValue}
                    onValueChange={value => setTempDistanceValue(value)}
                  />
                  <View style={styles.radiusSwitchContainer}>
                    <Text style={styles.radiusSwitchText}>
                      Zeige nur Matches in diesem Radius
                    </Text>
                    <TouchableOpacity
                      hitSlop={15}
                      onPress={handleDisabledClick}
                    >
                      <Switch
                        trackColor={{
                          false: AppColors.GREY_200,
                          true: AppColors.SECONDARY,
                        }}
                        style={{
                          ...(userLocation === null && { opacity: 0.5 }),
                          ...(Platform.OS === "android" && {
                            transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }],
                          }),
                        }}
                        thumbColor="white"
                        ios_backgroundColor={AppColors.GREY_300}
                        disabled={userLocation === null}
                        value={tempIsRadiusEnabled}
                        onValueChange={toggleSwitch}
                      />
                    </TouchableOpacity>
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
    marginTop: 120,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: -20,
    paddingBottom: 10,
  },
  filterHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.GREY_200,
    zIndex: 1000,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  filterHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
  },
  resetFilterButtonText: {
    color: AppColors.SECONDARY,
    fontSize: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  filterContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 30,
  },
  filterOptions: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  optionHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
    marginBottom: 10,
  },
  options: {
    marginTop: 12,
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  radiusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  radiusValue: {
    fontWeight: "600",
    color: AppColors.GREY_700,
  },
  radiusSwitchContainer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  radiusSwitchText: {
    color: AppColors.GREY_900,
    fontSize: 16,
    flexWrap: "wrap",
    flex: 1,
  },
  filterButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 14,
    paddingTop: 14,
    paddingHorizontal: 20,
    borderTopColor: AppColors.GREY_200,
    borderTopWidth: 1,
  },
});
