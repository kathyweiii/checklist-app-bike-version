import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { logDOM } from "@testing-library/react";

const Result = () => {
  // 假設您從路由中獲取到所需的數據
  const location = useLocation();
  const navigate = useNavigate();

  const {
    CheckItems,
    locationName,
    roadNames,
    directions,
    roads,
    activeButtons,
    highlightRemarks,
    userInput,
    uploadedImages,
  } = location.state; // 根據需要調整
  // console.log("state: ", location.state);

  const [onlyNonCompliant, setOnlyNonCompliant] = useState(false);
  const [improvementField, setImprovementField] = useState(false);

  const [improvementInputs, setImprovementInputs] = useState({});

  const [selectedRoad, setSelectedRoad] = useState(roads[0]);
  const [currentPageCode, setCurrentPageCode] = useState();
  const [currentPageName, setCurrentPageName] = useState();

  const [outputList, setOutputList] = useState([]);

  const [notInList, setNotInList] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // 加载状态

  const pdfRef = useRef(null);

  // 從 local storage 加載數據
  // useEffect(() => {
  //   console.log("location.state from: ", location.state?.from);
  //   console.log("@Rusult state: ", location.state);

  //   if (location.state?.from === "CheckList") {
  //     localStorage.removeItem("outputData");
  //     console.log("delete outputData");
  //   } else if (location.state?.from === "Output") {
  //     const { outputList, improvementInputs } = location.state;
  //     setOutputList(outputList);
  //     setImprovementInputs(improvementInputs);
  //   }
  //   else {
  //     ///從output按上一頁回到result: 從location.state或localStorage撈improvementInputs和outputList
  //     const loadedData = localStorage.getItem("outputData");
  //     console.log("loadedData: ", loadedData);

  //     if (loadedData) {
  //       if (Array.isArray(loadedData.outputList)) {
  //         setOutputList(loadedData.outputList);
  //         console.log("outputList: ", loadedData.outputList);
  //       }
  //       if (Array.isArray(loadedData.improvementInputs)) {
  //         setImprovementInputs(loadedData.improvementInputs);
  //         console.log(
  //           "location.state?.improvementInputs: ",
  //           location.state?.improvementInputs
  //         );
  //       }
  //     }
  //   }
  // }, []);

  useEffect(() => {
    setCurrentPageCode(
      `${selectedRoad}-${improvementField}-${onlyNonCompliant}`
    );

    const compliance = onlyNonCompliant ? "具道路安全問題項目" : "所有檢核項目";
    //  const improvement = improvementField ? "含改善措施之" : "不含改善措施之";
    const name = `${selectedRoad}-${compliance}`;
    setCurrentPageName(name);
  }, [selectedRoad, onlyNonCompliant, improvementField]);

  // useEffect(() => {
  //   // const currentPage = `${selectedRoad}-${improvementField}${onlyNonCompliant}`;
  //   // 查找当前页面是否已经在输出列表中
  //   const existingPage = outputList.find(
  //     (output) => output.code === currentPageCode
  //   );

  //   const stripUnnecessaryElements = (htmlString) => {
  //     // 剔除無關的 <button> 元素
  //     return htmlString.replace(
  //       /<button[^>]*class="toggle-improvement-btn"[^>]*>.*?<\/button>/g,
  //       ""
  //     );
  //   };
  //   // 获取当前页面的内容
  //   const contentElement = document.getElementById(
  //     `${currentPageCode}-pdf-content`
  //   );
  //   const contentHTML = contentElement?.outerHTML || "";

  //   // 移除 <button> 等無關元素後的 HTML
  //   const strippedExistingContent = existingPage
  //     ? stripUnnecessaryElements(existingPage.content)
  //     : "";
  //   const strippedCurrentContent = stripUnnecessaryElements(contentHTML);

  //   // 获取当前页面的 improvementInputs
  //   const currentImprovementInputs = improvementInputs[currentPageCode] || {};

  //   // 比较 improvementInputs 是否有变化
  //   const existingImprovementInputs = existingPage?.improvementInputs || {};

  //   const improvementInputsChanged =
  //     JSON.stringify(currentImprovementInputs) !==
  //     JSON.stringify(existingImprovementInputs);

  //   // 判断内容是否有更新或不存在于输出列表中
  //   if (
  //     !existingPage ||
  //     (existingPage && strippedExistingContent !== strippedCurrentContent) ||
  //     improvementInputsChanged
  //   ) {
  //     setNotInList(true); // 需要更新
  //   } else {
  //     setNotInList(false); // 不需要更新
  //   }
  // }, [
  //   selectedRoad,
  //   onlyNonCompliant,
  //   improvementField,
  //   outputList,
  //   improvementInputs,
  //   currentPageCode,
  // ]);

  // useEffect(() => {
  //   let blinkInterval;

  //   if (notInList) {
  //     blinkInterval = setInterval(() => {
  //       setIsBlinking((prev) => !prev);
  //     }, 1100); // 每 500 毫秒闪烁一次
  //   } else {
  //     setIsBlinking(false);
  //   }

  //   return () => clearInterval(blinkInterval); // 清除定时器
  // }, [notInList]);

  const choosingResult = onlyNonCompliant ? highlightRemarks : activeButtons;
  const groupedByRoadName = roadNames.reduce((acc, roadName, roadNameIdx) => {
    acc[`${roadName}-${directions[roadNameIdx]}`] = []; // 初始化每個路名的陣列

    // 遍歷 highlightRemarks 的每個 sheet
    Object.keys(choosingResult).forEach((sheet) => {
      Object.keys(choosingResult[sheet]).forEach((key) => {
        const [itemId, correspondingRoad] = key.split(":"); // 分割為項目和路名-方向

        const option = activeButtons[sheet]?.[`${itemId}:${correspondingRoad}`];
        const remark = userInput[sheet]?.[`${itemId}:${correspondingRoad}`];

        if (correspondingRoad === `${roadName}-${directions[roadNameIdx]}`) {
          acc[`${roadName}-${directions[roadNameIdx]}`].push({
            id: itemId,
            option: option,
            remark: remark,
          });
        }
      });
    });
    // console.log("acc: ", acc, "len: ", acc.length);
    return acc;
  }, {});

  const handleImprovemnetInput = (itemId, inputValue) => {
    setImprovementInputs((prev) => ({
      ...prev,
      [selectedRoad]: {
        ...prev[selectedRoad],
        [itemId]: inputValue,
      },
    }));
    // console.log(improvementInputs);
  };

  const handleChange = () => {
    const state = { ...location.state };
    navigate("/checklist", { state: { ...state, from: "Result" } });
  };

  const handleAddToOutputList = () => {
    // 获取当前显示的内容
    const contentElement = document.getElementById(
      `${currentPageCode}-pdf-content`
    );
    const clonedElement = contentElement.cloneNode(true);
    const toggleButton = clonedElement.querySelector(".toggle-improvement-btn");
    if (toggleButton) {
      toggleButton.remove(); // 從克隆結構中移除該按鈕
    }
    const contentHTML = clonedElement.outerHTML;

    // const contentHTML = contentElement?.outerHTML || "";

    // 构建新项
    const newItem = {
      code: currentPageCode,
      name: currentPageName,
      content: contentHTML, // 保存 HTML 字符串
    };

    setOutputList((prevList) => {
      // 检查 name 是否已存在
      const existingIndex = prevList.findIndex(
        (item) => item.code === newItem.code
      );

      // 如果 name 存在，替换内容；否则，添加新的项
      if (existingIndex !== -1) {
        const updatedList = [...prevList];
        updatedList[existingIndex] = newItem;
        console.log("Updated existing output item: ", updatedList);
        return updatedList;
      } else {
        const newList = [...prevList, newItem];
        console.log("Added new output item: ", newList);
        return newList;
      }
    });

    // if (addedToListElement) {
    //   addedToListElement.style.display = "";
    // }
    // if (toggleButtonElement) {
    //   toggleButtonElement.style.display = "";
    // }
    console.log("After adding, notInList:", notInList);
  };

  const handleViewOutputList = () => {
    const resultData = {
      ...location.state,
      outputList,
      improvementInputs,
    };
    navigate("/outputlist", { state: { ...resultData, from: "Result" } });

    localStorage.setItem(
      "outputData",
      JSON.stringify({ outputList, improvementInputs })
    );
    console.log("Saved improvementInputs: ", improvementInputs);
  };

  const toggleButtonRef = useRef();

  // // 切換到指定的路段並等待頁面渲染完成
  const switchToRoadAndGeneratePDF = async (pageCode, index, isOnly) => {
    setSelectedRoad(pageCode); // 切換到該路段
    console.log(`${pageCode}-false-${isOnly}-pdf-content`);

    await waitForElement(`${pageCode}-false-${isOnly}-pdf-content`);
    // await waitForElement(`${pageCode}-false-false-pdf-content`);
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
    // const element = document.getElementById(
    //   `${pageCode}-false-false-pdf-content`
    // );
    console.log("element: ", element);

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = 210 - 20; // A4 寬度 - 邊距
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdfRef.current.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight); // 添加圖片到 PDF

    if (index < roadNames.length - 1) {
      pdfRef.current.addPage(); // 如果有下一頁，添加新頁面
    }
  };

  const processQueue = async (isOnly) => {
    pdfRef.current = new jsPDF("p", "mm", "a4");
    setIsLoading(true); // 開始生成 PDF
    setOnlyNonCompliant(isOnly);
    const roads = Object.keys(groupedByRoadName);

    for (let i = 0; i < roads.length; i++) {
      const road = roads[i];

      await switchToRoadAndGeneratePDF(road, i, isOnly); // 切換並生成 PDF
    }
    const compliance = isOnly ? "具道路安全問題項目" : "所有檢核項目";
    pdfRef.current.save(`${locationName}之${compliance}.pdf`); // 保存最終的 PDF
    setIsLoading(false); // 結束生成
  };

  return (
    <div>
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
        {/* <button
          className="topbar-button topbar-button-right"
          onClick={handleViewOutputList}
        >
          檢視輸出列表
          <div className="arrow-container">
            <svg
              className="arrow-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7V5z" />
            </svg>
          </div>
        </button> */}
      </div>
      <div className="result-container">
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

          {/* 顯示區域 */}
          <div className="display-section">
            <h2>篩選</h2>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={onlyNonCompliant}
                  onChange={() => setOnlyNonCompliant(!onlyNonCompliant)}
                />
                具道路安全問題項目
              </label>
            </div>
          </div>
          <div className="display-section">
            <h2>輸出</h2>
            {/* <div className="output-button-container">
              <button
                className={`output-button ${
                  isBlinking ? "blinking" : ""
                } adding`}
                onClick={handleAddToOutputList}
              >
                <svg
                  className="plus-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                </svg>
                加入輸出列表
              </button>

              {outputList?.length > 0 && (
                <div className="output-count">{outputList?.length}</div>
              )}
            </div>
            <button className="output-button output" onClick={downloadPDF}>
              <svg
                className="download-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 16l4-5h-3V3h-2v8H8l4 5zm-8 2v2h16v-2H4z" />
              </svg>
              輸出當前頁面
            </button> */}
            <button
              className="output-button all"
              onClick={() => processQueue(false)}
              // onClick={processQueue}
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
              安全問題項目
            </button>
          </div>
        </div>

        <div className="sheet-content">
          {groupedByRoadName[selectedRoad] &&
          groupedByRoadName[selectedRoad].length > 0 ? (
            <div id={`${currentPageCode}-pdf-content`}>
              <div className="header-section">
                {/* {!notInList && (
                  <span className="added-to-list">已加入列表</span>
                )} */}
                <h1 className="centered-title">檢核結果</h1>
                <h2 className="centered-page-name">{currentPageName}</h2>
              </div>

              {/* <button
                className="toggle-improvement-btn"
                ref={toggleButtonRef}
                onClick={() => setImprovementField(!improvementField)}
              >
                {improvementField ? "-" : "+"}
              </button> */}

              <table>
                <thead>
                  <tr>
                    <th className="category-header">檢查代碼</th>
                    <th>檢查細項</th>
                    <th>選項</th>
                    <th>備註</th>
                    {/* {improvementField && <th>改善內容</th>} */}
                    {onlyNonCompliant && <th>改善說明</th>}
                  </tr>
                </thead>
                <tbody>
                  {groupedByRoadName[selectedRoad].map((item) => {
                    // 根據 item 獲取對應的 CheckItems 項目
                    const checkItem = Object.values(CheckItems)
                      .flat()
                      .find((check) => check.id === item.id);

                    return (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{checkItem.description}</td>
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
                        <td>
                          <div className="remark-display">{item.remark}</div>
                        </td>
                        {/* {improvementField && (
                          <td className="improvement-cell">
                            <textarea
                              type="text"
                              placeholder="請輸入改善內容"
                              value={
                                improvementInputs[selectedRoad]?.[item.id] || ""
                              }
                              onChange={(e) =>
                                handleImprovemnetInput(item.id, e.target.value)
                              }
                            />
                          </td>
                        )} */}
                        {onlyNonCompliant && (
                          <td className="rule-display">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: checkItem.rule || "無說明",
                              }}
                            />
                          </td> // 新增改善說明列內容
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>該路名下沒有勾選任何打星號的項目。</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
