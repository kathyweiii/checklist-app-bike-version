import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckList.css";
import CheckItems from "../data/CheckItem";
import { tabNames } from "../data/TabNames";

function CheckList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { locationName, type, roadNames, directions } = location.state || {}; //如果没有传入 state，则使用默认值

  // 默认值
  const defaultLocationName = "某地點";
  const defaultType = "intersection";
  const defaultLegCount = 3;
  const defaultRoadNames = ["路名1", "路名2", "路名3"];
  const defaultDirections = ["東側", "南側", "西側"];

  const currentLocationName = locationName || defaultLocationName;
  const currentType = type || defaultType;
  const currentRoadNames = roadNames || defaultLegCount;
  // console.log("currentRoadNames: ", currentRoadNames);
  const currentDirections = directions || defaultDirections;

  const initialSheets = ["A", "B", "C", "D"];
  const [activeSheet, setActiveSheet] = useState(initialSheets[0]);

  const [activeButtons, setActiveButtons] = useState({});
  const [userInput, setUserInput] = useState({});
  const [highlightRemarks, setHighlightRemarks] = useState({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});
  const roads = currentRoadNames.map(
    (road, index) => `${road}-${currentDirections[index]}`
  );

  const [activeRoad, setActiveRoad] = useState(roads[0]);

  const choosingSheet = () => {
    if (currentType === "intersection") {
      return initialSheets;
    } else {
      return ["A"];
    }
  };

  // 從 local storage 加載數據
  useEffect(() => {
    console.log("from: ", location.state?.from);

    if (location.state?.from === "HomePage") {
      localStorage.removeItem("checklistData");
      console.log("delete checklistData");
    } else {
      const loadedData = localStorage.getItem("checklistData");
      if (loadedData) {
        const parsedData = JSON.parse(loadedData);
        setActiveButtons(parsedData.activeButtons || {});
        setUserInput(parsedData.userInput || {});
        setHighlightRemarks(parsedData.highlightRemarks || {});
        setUploadedImages(parsedData.uploadedImages || {});
      }
    }
  }, [location]);

  //送出按鈕
  useEffect(() => {
    const checkFormValidity = () => {
      const totalCheckAmount = choosingSheet().reduce((sum, sheet) => {
        const sheetItemCount =
          CheckItems[sheet].length * currentRoadNames.length;
        return sum + sheetItemCount;
      }, 0);

      const totalActiveButtons = Object.values(activeButtons).reduce(
        (sum, item) => {
          return sum + Object.keys(item).length;
        },
        0
      );

      const allOptionsSelected = totalActiveButtons === totalCheckAmount;

      const allRemarkFilled = initialSheets.every((sheet) => {
        const remarksForSheet = highlightRemarks[sheet] || {};

        // 如果highlightRemark有值，繼續檢查是否所有的值都為 false (true：有需要新增備註)
        return Object.values(remarksForSheet).every((highlight) => !highlight);
      });

      setIsSubmitEnabled(allOptionsSelected && allRemarkFilled);

      // console.log(
      //   "allOptionsSelected: ",
      //   allOptionsSelected,
      //   " allRemarkFilled: ",
      //   allRemarkFilled,
      //   "isSubmitEnabled: ",
      //   isSubmitEnabled
      // );
      // console.log("active: ", totalActiveButtons);
      // console.log("total: ", totalCheckAmount);
    };

    checkFormValidity();
  }, [activeButtons, highlightRemarks]);

  const handleChangeRoad = (road) => {
    setActiveRoad(road);
    setActiveSheet(choosingSheet()[0]);
  };

  // 插入图片
  const insertImage = (itemId, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageSrc = reader.result;
      setUploadedImages((prev) => {
        const currentRoadImages = prev[activeRoad] || {}; // 確保有一個對象
        const currentItemImages = currentRoadImages[itemId] || []; // 確保有一個數組

        return {
          ...prev,
          [activeRoad]: {
            ...currentRoadImages,
            [itemId]: [...currentItemImages, imageSrc],
          },
        };
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    console.log("uploadedImages: ", uploadedImages);
  }, [uploadedImages]);

  useEffect(() => {
    console.log("activeButtons: ", activeButtons);
  }, [activeButtons]);

  // const handleImageUpload = (e, remarkId) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = function (upload) {
  //       const imgElement = document.createElement("img");
  //       imgElement.src = upload.target.result;
  //       imgElement.className = "uploaded-image";

  //       // 选择对应的remark-cell并将图片插入到textarea的下方
  //       const remarkCell = document.querySelector(`#remark-${remarkId}`);
  //       const imagePreview = document.createElement("div");
  //       imagePreview.className = "image-preview";
  //       imagePreview.appendChild(imgElement);

  //       remarkCell.parentNode.appendChild(imagePreview);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const toggleButton = (itemId, option) => {
    // 獲取當前的 item 的索引
    const itemIndex = CheckItems[activeSheet].findIndex(
      (item) => item.id === itemId
    );
    const currentItem = CheckItems[activeSheet][itemIndex];

    setActiveButtons((prev) => {
      const updatedButtons = {
        ...prev,
        [activeRoad]: {
          ...prev[activeRoad],
          [itemId]: option,
        },
      };
      console.log("Updated active button: ", updatedButtons);
      return updatedButtons;
    });

    // 檢查是否需要高亮備註
    const shouldHighlight =
      (option === "是" && currentItem?.asterisk === "yes") ||
      (option === "否" &&
        currentItem?.asterisk === "no" &&
        (!userInput[activeRoad]?.[itemId] ||
          userInput[activeRoad]?.[itemId].trim() === ""));
    // console.log("shouldHighlight: ", shouldHighlight);

    if (shouldHighlight) {
      setHighlightRemarks((prev) => {
        const updatedRemarks = {
          ...prev,
          [activeRoad]: {
            ...prev[activeRoad],
            [itemId]: true,
          },
        };
        console.log("highlight: ", updatedRemarks);

        return updatedRemarks;
      });
    } else {
      setHighlightRemarks((prev) => {
        const updatedRemarks = {
          ...prev,
          [activeRoad]: {
            ...prev[activeRoad],
            [itemId]: false,
          },
        };
        console.log("highlight: ", updatedRemarks);

        return updatedRemarks;
      });
    }
  };

  const handleInputChange = (itemId, inputValue) => {
    // 更新備註情況至userInput
    setUserInput((prev) => ({
      ...prev,
      [activeRoad]: {
        ...prev[activeRoad],
        [itemId]: inputValue,
      },
    }));

    // 更新highlightRemark
    setHighlightRemarks((prev) => {
      const updatedRemarks = {
        ...prev,
        [activeRoad]: {
          ...prev[activeRoad],
          [itemId]: inputValue ? false : true,
        },
      };
      return updatedRemarks;
      // console.log("highlight: ", highlightRemarks);
    });
  };

  const handleSubmit = () => {
    const checkListData = {
      ...location.state,
      CheckItems,
      roads,
      activeButtons,
      highlightRemarks,
      userInput,
      uploadedImages,
    };

    if (isSubmitEnabled) {
      localStorage.setItem(
        "checklistData",
        JSON.stringify({
          roads,
          activeButtons,
          highlightRemarks,
          userInput,
          uploadedImages,
        })
      );
      console.log(
        "checklistData: ",
        roads,
        activeButtons,
        highlightRemarks,
        userInput,
        uploadedImages
      );
      navigate("/result", { state: { ...checkListData, from: "CheckList" } });
    }
  };
  // 保存數據到 local storage
  const saveData = () => {
    const dataToSave = {
      roads,
      activeButtons,
      userInput,
      highlightRemarks,
      uploadedImages,
    };
    // 檢查是否有數據需要保存
    if (
      Object.keys(dataToSave.activeButtons).length === 0 &&
      Object.keys(dataToSave.userInput).length === 0 &&
      Object.keys(dataToSave.highlightRemarks).length === 0 &&
      Object.keys(dataToSave.uploadedImages).length === 0
    ) {
      alert("沒有資料可以保存！");
      return; // 如果沒有資料，則返回
    }

    localStorage.setItem("checklistData", JSON.stringify(dataToSave));
    alert("資料已保存！");
    // testLocalStorage(dataToSave); // 呼叫測試函數
  };
  const testLocalStorage = (dataToSave) => {
    const savedData = localStorage.getItem("checklistData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log("Saved Data:", parsedData);
      console.log("Expected Data:", dataToSave);
      console.assert(
        JSON.stringify(parsedData) === JSON.stringify(dataToSave),
        "資料保存測試失敗！"
      );
      alert("資料保存測試成功！");
    } else {
      console.error("沒有找到保存的資料！");
    }
  };
  const deleteData = () => {
    const savedData = localStorage.getItem("checklistData");
    if (savedData) {
      localStorage.removeItem("checklistData");
      alert("已刪除保存的資料！");
    } else {
      alert("沒有保存的資料可以刪除！");
    }
  };

  return (
    <div className="checklist-container">
      <div className="road-tabs">
        {roads.map((road, index) => (
          <button
            key={road}
            className={`road-tab-button ${activeRoad === road ? "active" : ""}`}
            onClick={() => handleChangeRoad(road)}
          >
            {road}
          </button>
        ))}
      </div>

      {/* 顯示分頁標籤 */}
      <div className="tabs">
        {choosingSheet().map((sheet, index) => (
          <button
            key={sheet}
            className={`tab-button ${activeSheet === sheet ? "active" : ""}`}
            onClick={() => setActiveSheet(sheet)}
          >
            {tabNames[sheet]}
          </button>
        ))}
      </div>

      {/* 顯示當前分頁的表格 */}
      <div className="sheet-content">
        <table className="checklist-header">
          <thead>
            <tr>
              <th className="category-header">檢查代碼</th>
              <th className="description-header">檢查細項</th>
              <th colSpan="2">選項及備註</th>
            </tr>
          </thead>
          <tbody>
            {CheckItems[activeSheet].map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td className="description-cell">{item.description}</td>

                <React.Fragment key={`${item.id}:${activeRoad}`}>
                  {/* 选项 */}
                  <td className="option-cell">
                    <div className="option-section">
                      <div className="options">
                        {["無需", "是", "否"].map((label) => (
                          <div key={`${activeRoad}:${item.id}=${label}`}>
                            <button
                              className={`bullet-button ${
                                activeButtons[activeRoad]?.[item.id] === label
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => toggleButton(item.id, label)}
                            ></button>
                            <span>
                              {label}
                              {label === "是" && item.asterisk === "yes" && (
                                <span className="asterisk">＊</span>
                              )}
                              {label === "否" && item.asterisk === "no" && (
                                <span className="asterisk">＊</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  {/* 备注 */}
                  <td className="remark-cell" id={`remark-${item.id}`}>
                    <div className="remark-wrapper">
                      <textarea
                        className={`remark ${
                          highlightRemarks[activeRoad]?.[item.id]
                            ? "highlight"
                            : ""
                        }`}
                        placeholder="備註"
                        value={userInput[activeRoad]?.[item.id] || ""}
                        onChange={(e) =>
                          handleInputChange(item.id, e.target.value)
                        }
                      />
                      <div className="image-preview">
                        {Array.isArray(uploadedImages[activeRoad]?.[item.id]) &&
                          uploadedImages[activeRoad][item.id].map(
                            (src, idx) => (
                              <img
                                key={idx}
                                src={src}
                                alt="uploaded"
                                className="uploaded-image"
                              />
                            )
                          )}
                      </div>
                    </div>
                    <label className="upload-image-label">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          insertImage(item.id, e.target.files[0])
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        className="upload-icon"
                      >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-11-8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm6 6H6l2.25-3 1.75 2.25 2.5-3.75L17 17z" />
                      </svg>
                    </label>
                  </td>
                </React.Fragment>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 保存和送出按鈕 */}
      <div className="buttons">
        <button className="save-button" onClick={saveData}>
          保存
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
          title={
            isSubmitEnabled
              ? ""
              : Object.values(activeButtons).some((options) =>
                  Object.values(options).some((option) => !option)
                )
              ? "您尚有選項未選擇"
              : "您尚有備註未填"
          }
          className={!isSubmitEnabled ? "disabled" : "saveAndSubmit-button"}
        >
          保存並送出
        </button>
        <button className="delete-button" onClick={deleteData}>
          刪除保存的資料
        </button>
      </div>
    </div>
  );
}

export default CheckList;
