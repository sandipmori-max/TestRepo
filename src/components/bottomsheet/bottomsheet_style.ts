import { StyleSheet } from "react-native";
import { ERP_COLOR_CODE } from "../../utils/constants";

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ERP_COLOR_CODE.ERP_WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  handle: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: ERP_COLOR_CODE.ERP_BORDER_LINE,
    alignSelf: 'center',
    marginBottom: 10,
  },
});