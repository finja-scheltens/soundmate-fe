import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "../PrimaryButton";
import { AppColors } from "../../constants/AppColors";

interface ModalProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MatchExplanationModal({
  modalVisible,
  setModalVisible,
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
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.explanationHeader}>
              <Text style={styles.explanationHeadline}>
                Erklärung zu Matches
              </Text>
              <Text style={styles.factorExplanation}>
                Dein Musikgeschmack kann in drei Faktoren unterteilt werden. Ein
                hoher Matching-Faktor bedeutet eine starke Überereinstimmung der
                Werte zwischen dir und deinem Match.
              </Text>
            </View>
            <View style={styles.explanationContainer}>
              <View>
                <Text style={styles.factorHeadline}>Novel</Text>
                <Text style={styles.factorExplanation}>
                  Bist du im Herzen ein Musikpionier? Dieser Faktor misst dein
                  Interesse an neuer und unbekannter Musik.
                </Text>
              </View>
              <View>
                <Text style={styles.factorHeadline}>Mainstream</Text>
                <Text style={styles.factorExplanation}>
                  Schwimmst du mit dem Strom? Dieser Faktor zeigt, wie sehr dein
                  Musikgeschmack mit dem der Allgemeinheit übereinstimmt.
                </Text>
              </View>
              <View>
                <Text style={styles.factorHeadline}>Divers</Text>
                <Text style={styles.factorExplanation}>
                  Bist du ein musikalischer Weltenbummler? Dieser Faktor zeigt,
                  wie bunt und vielfältig dein Musikgeschmack über verschiedene
                  Genres hinweg ist.
                </Text>
              </View>
            </View>
          </ScrollView>
          <View>
            <PrimaryButton
              title="Alles klar!"
              onPress={() => {
                setModalVisible(false);
              }}
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
    marginTop: 140,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? -20 : 20,
    paddingBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  explanationHeader: {
    paddingHorizontal: 4,
    gap: 16,
  },
  explanationHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
  },
  explanationContainer: {
    marginTop: 40,
    paddingHorizontal: 4,
    gap: 30,
  },
  factorHeadline: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: AppColors.GREY_900,
    marginBottom: 10,
  },
  factorExplanation: {
    fontSize: 16,
    color: AppColors.GREY_700,
  },
});
