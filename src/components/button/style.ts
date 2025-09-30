import { StyleSheet } from "react-native";
import { ERP_COLOR_CODE } from "../../utils/constants";

export const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: ERP_COLOR_CODE.ERP_WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});