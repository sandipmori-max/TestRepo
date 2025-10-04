import React, { useEffect } from "react";
import { View } from "react-native";
import { getDBConnection, isPinEnabled } from "../../../utils/sqlite";
import FullViewLoader from "../../../components/loader/FullViewLoader";

const StartupScreen = ({ navigation }: any) => {

  useEffect(() => {
    const checkPin = async () => {
      const db = await getDBConnection();
      const enabled = await isPinEnabled(db);
      if (enabled) {
        navigation.replace("PinVerify");
      } else {
        navigation.replace("Drawer");
      }
    };
    checkPin();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <FullViewLoader />
    </View>
  );
};

export default StartupScreen;
