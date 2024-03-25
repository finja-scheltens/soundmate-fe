import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";
import { AppColors } from "../constants/AppColors";

interface SearchBarProps {
  clicked: boolean;
  searchPhrase: string;
  setSearchPhrase: (phrase: string) => void;
  setClicked: (clicked: boolean) => void;
}

export default function SearchBar({
  clicked,
  searchPhrase,
  setSearchPhrase,
  setClicked,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, clicked && styles.searchBar_clicked]}>
        <Feather
          name="search"
          size={16}
          color={AppColors.GREY_500}
          style={{ marginLeft: 3 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Suchen"
          placeholderTextColor={AppColors.GREY_500}
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {clicked && searchPhrase && (
          <Octicons
            name="x-circle-fill"
            size={18}
            color={AppColors.GREY_500}
            suppressHighlighting={true}
            onPress={() => {
              setSearchPhrase("");
            }}
          />
        )}
      </View>
      {clicked && (
        <View style={styles.cancelButton}>
          <Button
            title="Abbrechen"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    gap: 4,
  },
  searchBar: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    flexDirection: "row",
    backgroundColor: AppColors.GREY_200,
    borderRadius: 10,
    alignItems: "center",
  },
  searchBar_clicked: {
    flexShrink: 1,
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 18,
    marginLeft: 8,
    flex: 1,
  },
  cancelButton: {
    flexGrow: 1,
    marginRight: -8,
  },
});
