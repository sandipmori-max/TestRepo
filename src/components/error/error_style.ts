import { StyleSheet } from "react-native";
import { ERP_COLOR_CODE } from "../../utils/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  errorImage: {
    width: 380,
    height: 280,
    marginBottom: 10,
  },
  errorText: {
    color: ERP_COLOR_CODE.ERP_ERROR,
    fontSize: 14,
    fontWeight: '500',
  },
});