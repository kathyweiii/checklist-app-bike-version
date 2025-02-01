import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { styles } from "../fonts/styles.js";
import { Document, Page, Text, pdf } from "@react-pdf/renderer";

const Result = () => {
  // 假設您從路由中獲取到所需的數據
  const location = useLocation();
  const navigate = useNavigate();

  const {
    CheckItems,
    locationName,
    inspector,
    selectedDate,
    weather,
    roadNames,
    directions,
    roads,
    type,
    activeButtons,
    highlightRemarks,
    userInput,
    uploadedImages,
  } = location.state; // 根據需要調整

  const [onlyNonCompliant, setOnlyNonCompliant] = useState(false);
  const [improvementField, setImprovementField] = useState(false);

  const [selectedRoad, setSelectedRoad] = useState(roads[0]);
  const [currentPageCode, setCurrentPageCode] = useState();
  const [currentPageName, setCurrentPageName] = useState();

  const [isLoading, setIsLoading] = useState(false); // 加载状态

  const pdfRef = useRef(null);

  useEffect(() => {
    setCurrentPageCode(
      `${selectedRoad}-${improvementField}-${onlyNonCompliant}`
    );

    const compliance = onlyNonCompliant
      ? "具交通安全風險之項目"
      : "所有檢核項目";
    const name = `${selectedRoad}-${compliance}`;
    setCurrentPageName(name);
  }, [selectedRoad, onlyNonCompliant, improvementField]);

  const choosingResult = onlyNonCompliant ? userInput : activeButtons;
  const groupedByRoadName = roads.reduce((acc, road) => {
    acc[road] = []; // 初始化每個路名的陣列

    if (choosingResult[road]) {
      Object.keys(choosingResult[road]).forEach((itemId) => {
        const option = activeButtons[road][itemId];
        const remark = userInput[road]?.[itemId] || "";
        const image = uploadedImages[road]?.[itemId] || "";

        acc[road].push({
          id: itemId,
          option: option,
          remark: remark,
          image: image,
        });
      });
    }

    // console.log("acc: ", acc, "len: ", acc.length);
    return acc;
  }, {});

  const handleChange = () => {
    const state = {
      ...location.state,
      activeButtons,
      userInput,
      highlightRemarks,
      uploadedImages,
    };
    navigate("/checklist", { state: { ...state, from: "Result" } });
  };

  // // 切換到指定的路段並等待頁面渲染完成
  const switchToRoadAndGeneratePDF = async (pageCode, index, isOnly) => {
    setSelectedRoad(pageCode); // 切換到該路段
    setOnlyNonCompliant(isOnly);
    console.log(`${pageCode}-false-${isOnly}-pdf-content`);

    await waitForElement(`${pageCode}-false-${isOnly}-pdf-content`);
    await generatePDFForRoad(pageCode, index, isOnly);
  };

  const waitForElement = (id) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const element = document.getElementById(id);
        if (element) {
          clearInterval(interval);
          console.log("element: ", element);

          resolve(element);
        }
      }, 100);
    });
  };

  const generatePDFForRoad = async (pageCode, index, isOnly) => {
    const element = document.getElementById(
      `${pageCode}-false-${isOnly}-pdf-content`
    );
    const canvas = await html2canvas(element);
    const pageWidth = 210 - 20; // A4 的寬度，單位是 mm
    const pageHeight = 297;
    const margin = 10;
    const usablePageHeight = pageHeight - margin * 2;
    let imgYPosition = 0;

    const imgData = canvas.toDataURL("image/png");

    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    if (imgHeight <= usablePageHeight) {
      // 如果內容高度在一頁範圍內，則只添加一頁
      pdfRef.current.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        pageWidth,
        imgHeight
      );
    } else {
      // 如果內容超過一頁，進行分頁裁剪
      const originalCanvas = canvas;
      const ctx = originalCanvas.getContext("2d");

      let remainingHeight = canvas.height;

      while (remainingHeight > 0) {
        if (imgYPosition > 0) {
          pdfRef.current.addPage(); // 添加新頁面
        }

        // 新建一個 canvas，將原始 canvas 中的一部分複製到這個 canvas
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = Math.min(
          (usablePageHeight * canvas.width) / pageWidth,
          remainingHeight
        ); // 高度按比例裁剪

        const tempCtx = tempCanvas.getContext("2d");

        // 從原始 canvas 複製對應位置的圖像到臨時 canvas
        tempCtx.drawImage(
          originalCanvas,
          0,
          imgYPosition,
          canvas.width,
          tempCanvas.height,
          0,
          0,
          canvas.width,
          tempCanvas.height
        );

        // 獲取這一部分的圖像數據
        const tempImgData = tempCanvas.toDataURL("image/png");

        // 將裁剪後的圖像數據插入到 PDF
        pdfRef.current.addImage(
          tempImgData,
          "PNG",
          margin,
          margin,
          pageWidth,
          (tempCanvas.height * pageWidth) / canvas.width
        );

        // 更新剩餘的高度和 Y 偏移量
        remainingHeight -= tempCanvas.height;
        imgYPosition += tempCanvas.height;
      }
    }

    if (index < roadNames.length - 1) {
      pdfRef.current.addPage(); // 如果有下一頁，添加新頁面
    }
  };

  const FirstPDFDocument = () => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>道路安全檢查結果</Text>
        <Text style={styles.subheader}>路口名稱：{locationName}</Text>
        <Text style={styles.subheader}>填列人員：{inspector}</Text>
        <Text style={styles.subheader}>填寫日期：{selectedDate}</Text>
        <Text style={styles.subheader}>天氣：{weather}</Text>
      </Page>
    </Document>
  );

  const generatedMultiplePDF = async (isOnly) => {
    pdfRef.current = new jsPDF("p", "mm", "a4");
    const roads = Object.keys(groupedByRoadName);
    for (let i = 0; i < roads.length; i++) {
      const road = roads[i];
      console.log("generatedMultiplePDF....");

      await switchToRoadAndGeneratePDF(road, i, isOnly); // 切換並生成 PDF
    }
    return pdfRef.current.output("arraybuffer");
  };

  const generatedFirstPDF = async () => {
    const coverPageBlob = await pdf(<FirstPDFDocument />).toBlob();
    const coverPageBytes = await coverPageBlob.arrayBuffer();
    return coverPageBytes;
  };

  const { PDFDocument } = require("pdf-lib");
  const mergePDFs = async (
    coverPageBytes,
    multiPageBytes,
    disclaimerPageBytes
  ) => {
    // 創建一個新的 PDF 文檔來合併
    const finalPdf = await PDFDocument.create();

    // 加載首頁 PDF
    const coverPdfDoc = await PDFDocument.load(coverPageBytes);
    const coverPages = await finalPdf.copyPages(
      coverPdfDoc,
      coverPdfDoc.getPageIndices()
    );
    coverPages.forEach((page) => finalPdf.addPage(page));

    // 加載多頁的 PDF
    const multiPdfDoc = await PDFDocument.load(multiPageBytes);
    const multiPages = await finalPdf.copyPages(
      multiPdfDoc,
      multiPdfDoc.getPageIndices()
    );
    multiPages.forEach((page) => finalPdf.addPage(page));
    return await finalPdf.save();
  };

  const processQueue = async (isOnly) => {
    setIsLoading(true);
    const multiPageBytes = await generatedMultiplePDF(isOnly);
    const coverPageBytes = await generatedFirstPDF();
    // const disclaimerPageBytes = await loadDisclaimerPDF();
    const mergedPdfBytes = await mergePDFs(
      coverPageBytes,
      multiPageBytes
      // disclaimerPageBytes
    );
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${locationName}之${
      isOnly ? "具道路安全問題項目" : "所有檢核項目"
    }.pdf`;
    link.click();
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <div className="top-bar">
        <button
          className="topbar-button topbar-button-left"
          onClick={handleChange}
        >
          <div className="arrow-container">
            <svg
              className="arrow-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M15 19l-7-7 7-7v14z" />
            </svg>
          </div>
          修改檢核內容
        </button>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-message">輸出中...請稍候</div>
        </div>
      )}
      <div
        className="result-container"
        style={{
          opacity: isLoading ? 0 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        <div className="sidebar">
          <h2>路名分頁</h2>
          <ul>
            {roadNames.map((roadName, roadNameIdx) => (
              <li
                key={roadNameIdx}
                className={
                  selectedRoad === `${roadName}-${directions[roadNameIdx]}`
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSelectedRoad(`${roadName}-${directions[roadNameIdx]}`)
                }
              >
                {`${roadName}-${directions[roadNameIdx]}`}
              </li>
            ))}
          </ul>
          <div className="display-section">
            <h2>篩選</h2>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={onlyNonCompliant}
                  onChange={() => setOnlyNonCompliant(!onlyNonCompliant)}
                />
                具交通安全風險
                <br />
                之項目
              </label>
            </div>
          </div>
          <div className="display-section">
            <h2>輸出</h2>
            <button
              className="output-button all"
              onClick={() => processQueue(false)}
              disabled={isLoading}
            >
              <svg
                className="download-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 16l4-5h-3V3h-2v8H8l4 5zm-8 2v2h16v-2H4z" />
              </svg>
              全部檢核結果
            </button>
            <button
              className="output-button problem"
              onClick={() => processQueue(true)}
              disabled={isLoading}
            >
              <svg
                className="download-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 16l4-5h-3V3h-2v8H8l4 5zm-8 2v2h16v-2H4z" />
              </svg>
              安全風險項目
            </button>
          </div>
        </div>

        <div className="result-sheet-content">
          <div id={`${currentPageCode}-pdf-content`}>
            <div className="header-section">
              <h1 className="centered-title">檢核結果</h1>
              <h2 className="centered-page-name">{currentPageName}</h2>
            </div>

            {groupedByRoadName[selectedRoad] &&
            groupedByRoadName[selectedRoad].length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th
                      className="category-header"
                      style={{
                        width: "40px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        backgroundColor: "#e0e0e0",
                        border: "1px solid #ccc",
                      }}
                    >
                      檢查
                      <br />
                      代碼
                    </th>
                    <th
                      style={{
                        verticalAlign: "middle",
                        backgroundColor: "#e0e0e0",
                        border: "1px solid #ccc",
                      }}
                    >
                      檢查細項
                    </th>
                    <th
                      style={{
                        width: "40px",
                        verticalAlign: "middle",
                        backgroundColor: "#e0e0e0",
                        border: "1px solid #ccc",
                      }}
                    >
                      選項
                    </th>
                    <th
                      style={{
                        verticalAlign: "middle",
                        backgroundColor: "#e0e0e0",
                        border: "1px solid #ccc",
                      }}
                    >
                      備註
                    </th>
                    {onlyNonCompliant && (
                      <th
                        style={{
                          width: "40%",
                          verticalAlign: "middle",
                          backgroundColor: "#e0e0e0",
                          border: "1px solid #ccc",
                        }}
                      >
                        改善說明
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {groupedByRoadName[selectedRoad].map((item, index) => {
                    const checkItem = CheckItems.find(
                      (check) => check.id === item.id
                    );
                    return (
                      <tr key={`${item.id}-${index}`}>
                        <td style={{ textAlign: "center" }}>{item.id}</td>
                        <td>
                          <div className="no-break">
                            {typeof checkItem.description === "object"
                              ? type === "intersection"
                                ? checkItem.description.intersection
                                : checkItem.description.road
                              : checkItem.description}
                          </div>
                        </td>

                        <td>
                          {item.option}
                          {item.option === "是" &&
                            checkItem.asterisk === "yes" && (
                              <span className="asterisk">＊</span>
                            )}
                          {item.option === "否" &&
                            checkItem.asterisk === "no" && (
                              <span className="asterisk">＊</span>
                            )}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            boxSizing: "border-box",
                            position: "relative",
                          }}
                        >
                          <div className="remark-display">
                            {item.remark}
                            {Array.isArray(item.image) &&
                              item.image.length > 0 && (
                                <div className="image-gallery">
                                  {item.image.map((imgSrc, idx) => (
                                    <img
                                      key={idx}
                                      src={imgSrc}
                                      alt={`Uploaded ${idx + 1}`}
                                      style={{
                                        maxWidth: "250px",
                                        marginTop: "10px",
                                        position: "relative",
                                        left: onlyNonCompliant ? "-30px" : "0",
                                        zIndex: 1,
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                          </div>
                        </td>
                        {onlyNonCompliant && (
                          <td className="rule-display">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: checkItem.rule || "無說明",
                              }}
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table>
                <tbody>
                  <tr>
                    <td colSpan={onlyNonCompliant ? 5 : 4}>
                      無具交通安全風險之項目。
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Result;
