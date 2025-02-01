// const CheckItems = {
//   A: [
//     {
//       id: "A01",
//       description:
//         "路側若有產生大量車輛交通的設施，如醫院、購物中心、加油站等，道路層級是否合適？",
//       asterisk: "no",
//     },
//     {
//       id: "A02",
//       description:
//         "路側若有產生大量行人交通的設施，如學校、購物中心等，是否有連續性的步道互相連通？",
//       asterisk: "no",
//     },
//     {
//       id: "A03",
//       description:
//         "行路側若有產生大量自行車交通的設施，如學校、購物中心等，是否有連續性的自行車路網連接？",
//       asterisk: "no",
//     },
//     {
//       id: "A04",
//       description: "路側若為商業區，道路是否負擔穿越性交通？",
//       asterisk: "yes",
//     },

//     {
//       id: "A05",
//       description:
//         "路側若為商業區，路側是否視野清楚，以減少穿越性交通對用路人造成的危險",
//       asterisk: "no",
//     },
//   ],
//   B: [
//     {
//       id: "B06",
//       description: "駕駛人所必須的做的判斷決策是否依照邏輯、清楚的順序？",
//       asterisk: "no",
//     },
//     {
//       id: "F01",
//       description:
//         "駕駛人行經路口前，是否能識別前方交岔路口？路口若位於道路轉彎處時，其視線是否良好？鄰近路口或路段為下（上）坡或連續上（下）坡，其視線（坡度過陡或緩和曲線長度不足，而看不清楚路口狀況）是否良好？",
//       asterisk: "no",
//     },
//     {
//       id: "F05",
//       description:
//         "設置有「讓」標線（標誌）的非行車管制號誌臨近路口（支道），位於距交叉口最短停車視距（Ss）公尺的位置，往橫交主次要道路（幹道）左右方向（Dy）公尺的視距三角內，是否有障礙物或建物遮蔽？",
//       asterisk: "yes",
//     },
//     {
//       id: "G08",
//       description:
//         "臨近路口/路段之路型配置（包含車道數、停車空間、行人空間及分隔設施等）是否適當？",
//       asterisk: "no",
//     },
//     { id: "G09", description: "路口左轉的車流量是否過大？", asterisk: "no" },
//   ],
//   C: [
//     {
//       id: "B01",
//       description:
//         "道路橫斷面設計是否包含適當之路肩或停車空間，以提供故障車輛、公車等使用？",
//       asterisk: "no",
//     },
//     {
//       id: "B02",
//       description:
//         "幹道與集散道路相交之路口有否考慮槽化，以引導轉向車輛穿越主要車流？",
//       asterisk: "no",
//     },
//     { id: "D01", description: "路口交通流量是否龐大？", asterisk: "yes" },
//     {
//       id: "D02",
//       description:
//         "車流交織情形（包含大型車、小型車、機車等相互交織情形）是否嚴重？",
//       asterisk: "yes",
//     },
//     { id: "D03", description: "路口左轉的車流量是否過大？", asterisk: "yes" },
//   ],
//   D: [
//     {
//       id: "G31",
//       description:
//         "同一時相穿越交叉口（含橫向紅燈右轉）的車輛，其下游車道數是否大於或等於上游車道數？",
//       asterisk: "no",
//     },
//     {
//       id: "K13",
//       description: "禁止進入標誌未設置於道路禁止方向之右側或兩側。",
//       asterisk: "yes",
//     },
//     {
//       id: "L21",
//       description:
//         "交叉口遠端右方若設置有機慢車待轉區，待轉區是否位於上下游車道邊線外？",
//       asterisk: "no",
//     },
//     {
//       id: "L22",
//       description: "交叉口遠端右方若設置有機慢車待轉區，機車待轉區設置位置不當",
//       asterisk: "yes",
//     },
//     {
//       id: "L23",
//       description:
//         "交叉口遠端右方若設置有機慢車待轉區，機車待轉區占用到橫向直行車流軌跡（停等交叉撞之可能）",
//       asterisk: "yes",
//     },
//   ],
// };

const CheckItems = {
  A: [
    {
      id: "C03",
      description: "路段最高速限標誌（限5）是否設置？",
      asterisk: "no",
      rule: `
    <p>設置規則第85條</p>
    <p>設於以標誌或標線規定最高速限路段起點及行車管制號誌路口遠端適當距離處，其限制之時速由主管機關參照路線設計、道路狀況、交通量、肇事資料及其他因素定之。設置位置以行車方向右側為主，但為利於車輛駕駛人辨認，單向三車道以上或特殊狀況可增設於左側；若容易被大型車遮擋，必要時標誌可重複設置。本標誌與第179條速率限制標字得同時或擇一設置。</p>
    
    <p><strong>以下是相關規範表：</strong></p>
    
    <table border="1" style="border-collapse: collapse; text-align: center; width: 100%;">
      <thead>
        <tr>
          <th>服務水準</th>
          <th>設置標誌</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>設置地點</td>
          <td>路口或重要設施</td>
        </tr>
        <tr>
          <td>參考因素</td>
          <td>道路狀況、肇事資料等</td>
        </tr>
      </tbody>
    </table>
    
    <br/>
    <p><strong>備註：</strong>該標誌可重複設置以確保清晰辨識</p>
  `,
    },
    {
      id: "C04",
      description: "路段車輛行駛速率是否恰當？",
      asterisk: "no",
      rule: `
      <p>交通工程規範之第一章總則（P5）</p>
      <p>行駛速率：道路兩點間之距離除以扣除延滯時間後之實際行駛時間。</p>
      <p>交通工程規範之第二章交通調查（P17 C2.5）</p>
      <p>旅行時間調查：調查路段旅行時間與交通停滯情形。</p>
  
      <br/>
  
      <p><strong>備註：</strong>該調查可用於分析交通狀況並規劃交通改善措施。</p>
    `,
    },
  ],
  B: [
    {
      id: "G08",
      description:
        "臨近路口/路段之路型配置（包含車道數、停車空間、行人空間及分隔設施等）是否適當？",
      asterisk: "no",
      rule: `
    <p>2011年台灣公路容量手冊之第13章市區號誌化路口（Ch13.6.1）</p>
    <p><strong>服務水準之標準</strong></p>
    <table border="1" style="border-collapse: collapse; text-align: center; width: 100%;">
      <thead>
        <tr>
          <th>服務水準</th>
          <th>平均停等延滯時間 d (秒/車)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>A</td>
          <td>d ≦ 15</td>
        </tr>
        <tr>
          <td>B</td>
          <td>15 ≦ d ≦ 30</td>
        </tr>
        <tr>
          <td>C</td>
          <td>30 ≦ d ≦ 45</td>
        </tr>
        <tr>
          <td>D</td>
          <td>45 ≦ d ≦ 60</td>
        </tr>
        <tr>
          <td>E</td>
          <td>60 ≦ d ≦ 80</td>
        </tr>
        <tr>
          <td>F</td>
          <td>d > 80</td>
        </tr>
      </tbody>
    </table>
    <br/>
    <p><strong>資料來源：</strong>2011年台灣公路容量手冊第16章市區幹道</p>
    <p>市區幹道之服務水準劃分標準係為速限50、60、70公里/小時的道路所訂定，在此廠區道路並不適用。</p>
    <p>本計畫暫以速限一半作為可接受及不可接受服務水準的界線：</p>
    <ul>
      <li><strong>可接受</strong>：V ≧ 15km/h</li>
      <li><strong>不可接受</strong>：V ＜ 15km/h</li>
    </ul>
  `,
    },
  ],
  C: [
    {
      id: "D03",
      description: "路口左轉的車流量是否過大？",
      asterisk: "yes",
      rule: `  <strong>交通工程規範之第二章交通調查（P7 C2.3.1）</strong><br>
    交叉路口交通量調查：蒐集交叉路口交通量、流向分布及交通組成，作為交叉路口號誌設計、槽化設計、容量與服務水準分析及研擬交通改善計畫之用。<br>
    <strong>高雄市政府交通局（105-06-01公佈）</strong><br>
    左轉保護時相設置需考量左轉車流量及有無佈設專用車道等條件限制，高雄市規劃左轉保護時相，除轉向量需達<strong>15%以上</strong>，另道路條件單向車道數需大於等於三車道以上，可佈設左轉專用車道，始配置左轉保護時相。<br><br>
    資料來源：<br>
    <a href="https://www.tbkc.gov.tw/Message/Bulletin/News?ID=f590faf3-3397-4098-9ab7-50b6ee1d54fe" target="_blank">
      https://www.tbkc.gov.tw/Message/Bulletin/News?ID=f590faf3-3397-4098-9ab7-50b6ee1d54fe
    </a><br>
    <a href="http://ebooks.lib.ntu.edu.tw/1_file/iot/1448_106418/5371883871.pdf" target="_blank">
      http://ebooks.lib.ntu.edu.tw/1_file/iot/1448_106418/5371883871.pdf
    </a>
  `,
    },
  ],
  D: [
    {
      id: "K13",
      description:
        "路口遠端禁止進入之路口之禁止進入標誌未設置於禁止方向之右側或兩側。",
      asterisk: "yes",
      rule: `<p>可能的情況及對應之標誌類型如下：</p>
      <ol>
        <li>車道數2以上時之禁制及遵行標誌。</li>
        <li>用於警示車行方向左方狀況之警告標誌。</li>
      </ol>
      <p>車行方向左側有分隔島或分隔設施，則設置於分隔島或分隔設施上。</p>
      
      
    `,
    },
    {
      id: "L21",
      description:
        "路口遠端右方若設置有機慢車待轉區，待轉區是否位於上下游車道邊線外？",
      asterisk: "no",
      rule: `
    <p>標誌標線號誌設置規則第191條第3巷第1款</p>
    <p>以上下游車道邊線之連線做為判斷依據或以軟體進行軌跡驗證。</p>
   
  `,
    },
  ],
};

export default CheckItems;
