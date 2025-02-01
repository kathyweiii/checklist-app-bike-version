const CheckItems = [
  {
    id: "A03",
    description:
      "路段路側若有產生大量自行車交通的設施，如工業區、學校、購物中心等，是否有連續性的自行車路網連接？",
    asterisk: "no",
  },
  {
    id: "E06",
    description: "路段機動車輛是否可見沿路行進的自行車或行人？",
    asterisk: "no",
  },
  {
    id: "F27",
    description: "路段車道寬度對於機車（自行車）是否合適？",
    asterisk: "no",
  },
  {
    id: "I15",
    description: {
      intersection:
        "路口行人及自行車專用標誌是否未依照實際人行道及自行車專用道之空間分布情形設置？",
      road: "路段行人及自行車專用標誌是否未依照實際人行道及自行車專用道之空間分布情形設置？",
    },
    asterisk: "yes",
  },
  {
    id: "L03",
    description: {
      intersection:
        "臨近路口若機車停車位須由人行道進出，剩餘人行寬度是否足夠？停放之機車是否不影響行人通行？停車空間是否可與其他空間（例如人行道或自行車道）區別？",
      road: "路段若機車停車位須由人行道進出，剩餘人行寬度是否足夠？停放之機車是否不影響行人通行？停車空間是否可與其他空間（例如人行道或自行車道）區別？",
    },
    asterisk: "no",
  },

  {
    id: "P01",
    description:
      "路段對於自行車及非機動化之交通是否提供適當之專用道或安全保護設施？（專用道或隔離設施）",
    asterisk: "no",
  },
  {
    id: "P02",
    description: "路段自行車停車設施是否妨礙行人或車輛交通？",
    asterisk: "yes",
  },
  {
    id: "E09",
    description: "路口在行人、自行車與機動車輛之間是否確保彼此互視？",
    asterisk: "no",
  },
  {
    id: "O06",
    description:
      "路口設有實體人行道，行人穿越道是否對齊設置路緣斜坡，且斜坡道寬度大於1.5公尺？ 行人和自行車進入路口處的緣石是否低矮？",
    asterisk: "no",
  },
  {
    id: "O11",
    description:
      "路口庇護島的長寬是否足夠讓行人和自行車站立或等待？錯開式(staggered，Z字型)行人穿越之分隔島是否大於2.0公尺，可供輪椅轉向？",
    asterisk: "no",
  },
  {
    id: "P03",
    description: "路口是否有適當的設置自行車穿越道？",
    asterisk: "no",
  },
  {
    id: "P04",
    description: "路口自行車的等候區大小是否足夠？",
    asterisk: "no",
  },
  {
    id: "F18",
    description: "路段上若有慢車道，其寬度是否小於2.8 m？",
    asterisk: "no",
  },
  {
    id: "F23",
    description: "路段機慢車道寬度是否合適?",
    asterisk: "no",
  },
  {
    id: "F34",
    description:
      "路段車道是否有明顯之分隔設計（分隔島或標線）？（包含快車道、慢車道、機車道或自行車道等）",
    asterisk: "no",
  },
  {
    id: "F10",
    description:
      "臨近路口停止線上游50公尺內是否有慢車道、機車專用道或優先道干擾轉向車流？",
    asterisk: "yes",
  },
  {
    id: "F17",
    description:
      "臨近路口停止線上游30公尺內路肩是否小於1 m，避免被誤用為慢車道？",
    asterisk: "no",
  },
  {
    id: "F19",
    description: "臨近路口停止線上游60公尺處，其慢車道寬度是否小於2.8 m？",
    asterisk: "no",
  },
  {
    id: "D02",
    description:
      "路口車流交織情形（包含大型車、小型車、機慢車等相互交織情形）是否嚴重？",
    asterisk: "yes",
  },
  {
    id: "J10",
    description: "設置機慢車停等區時，停等區上游是否有繪製縮小型指向線？",
    asterisk: "no",
  },
  {
    id: "J11",
    description: "無號誌化路口誤設機慢車停等區？",
    asterisk: "yes",
  },
  {
    id: "J12",
    description: "路口非機慢車可行車道誤設機慢車停等區？",
    asterisk: "yes",
  },
  {
    id: "J13",
    description: "路口紅燈允許右轉車道誤設機慢車停等區？",
    asterisk: "yes",
  },
  {
    id: "J15",
    description: "路口機慢車停等區外框標線是否未與鄰近標線整併？",
    asterisk: "yes",
  },
];

export default CheckItems;
