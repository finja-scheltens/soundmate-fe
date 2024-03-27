import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "./PrimaryButton";
import { AppColors } from "../constants/AppColors";

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
          <View style={styles.explanationHeader}>
            <Text style={styles.explanationHeadline}>Erklärung zu Matches</Text>
            <Text>Novel? Mainstream? Divers?</Text>
          </View>

          <View style={styles.explanationContainer}>
            <View>
              <Text style={styles.factorHeadline}>Novel</Text>
              <Text>Lorem ipsum dolar sit amet</Text>
            </View>
            <View>
              <Text style={styles.factorHeadline}>Mainstream</Text>
              <Text>Lorem ipsum dolar sit amet</Text>
            </View>
            <View>
              <Text style={styles.factorHeadline}>Divers</Text>
              <Text>Lorem ipsum dolar sit amet</Text>
            </View>
          </View>
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
    paddingTop: -20,
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
    flex: 1,
    display: "flex",
    flexDirection: "column",
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
});
