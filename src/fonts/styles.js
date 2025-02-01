import { Font, StyleSheet } from "@react-pdf/renderer";

Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: `${process.env.PUBLIC_URL}/fonts/NotoSansTC-Regular.ttf`,
      fontWeight: "normal",
    },
    {
      src: `${process.env.PUBLIC_URL}/fonts/NotoSansTC-SemiBold.ttf`,
      fontWeight: "bold",
    },
  ],
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
    fontWeight: "bold",
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
