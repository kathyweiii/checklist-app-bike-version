import { Font, StyleSheet } from "@react-pdf/renderer";
const noto = require("./NotoSansTC-VariableFont_wght.ttf");

Font.register({
  family: "NotoSans",
  src: noto,
});

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
  },
  header: {
    fontFamily: "NotoSans",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: 400,
  },
  subheader: {
    fontFamily: "NotoSans",
    fontSize: 14,
    marginBottom: 10,
  },
  text: {
    fontFamily: "NotoSans",
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 10,
    textAlign: "left",
    // maxWidth: 550, // 設定文本的最大寬度以符合 A4 頁面的寬度
  },
});
