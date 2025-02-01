import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./OutputList.css"; // 添加CSS

const OutputList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [thumbnails, setThumbnails] = useState([]);
  const [outputList, setOutputList] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { locationName } = location.state;
  //   console.log(location.state);

  useEffect(() => {
    // 从 location.state 或 localStorage 获取输出数据
    const parsedData =
      location.state?.newState ||
      JSON.parse(localStorage.getItem("outputData")) ||
      {};

    setOutputList(parsedData?.outputList || []);
  }, [location.state]);

  // 生成缩略图
  useEffect(() => {
    const createThumbnailsAndPdf = async () => {
      const newPdf = new jsPDF("p", "mm", "a4"); // 创建 PDF 实例
      const margin = 10;
      const pdfWidth = newPdf.internal.pageSize.getWidth() - 2 * margin;

      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.opacity = "0";
      hiddenContainer.style.position = "absolute";
      hiddenContainer.style.top = "0";
      hiddenContainer.style.left = "0";
      document.body.appendChild(hiddenContainer);

      const thumbList = await Promise.all(
        outputList.map(async (output, index) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = output.content;
          hiddenContainer.appendChild(tempDiv);
          // document.body.appendChild(tempDiv);

          const canvas = await html2canvas(tempDiv);
          const image = canvas.toDataURL("image/png");
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          // 在 PDF 中添加图片
          if (index > 0) newPdf.addPage();
          newPdf.addImage(image, "PNG", margin, margin, pdfWidth, pdfHeight);

          hiddenContainer.removeChild(tempDiv);
          // document.body.removeChild(tempDiv);

          return { id: index, name: output.name, image };
        })
      );
      document.body.removeChild(hiddenContainer);
      setThumbnails(thumbList);
      setPdf(newPdf);
      setIsLoading(false);
    };

    if (outputList.length > 0) {
      createThumbnailsAndPdf();
    }
  }, [outputList]);

  const handleThumbName = (thumbName) => {
    const parts = thumbName.split("-");
    return (
      <>
        {`${parts[0]}-${parts[1]}`}
        <br />
        {`${parts[2]}`}
      </>
    );
  };

  const handleChange = () => {
    const state = { ...location.state, outputList };
    navigate("/result", { state: { ...state, from: "Output" } });
  };

  const downloadList = async () => {
    if (pdf) {
      pdf.save(`${locationName}檢核結果.pdf`);
    } else {
      alert("PDF尚未完成");
    }
  };

  const handleRemoveItem = (id) => {
    const updatedList = outputList.filter((_, index) => index !== id);
    setOutputList(updatedList); // 更新outputList
    setThumbnails((prevThumbnails) =>
      prevThumbnails.filter((thumb) => thumb.id !== id)
    ); // 更新缩略图
  };

  return (
    <div className="output-container">
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
          修改輸出列表
        </button>
        <button
          className="topbar-button topbar-button-right"
          onClick={downloadList}
        >
          輸出所有列表
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
        </button>
      </div>
      <h1>輸出列表</h1>
      {isLoading ? (
        <div className="loading-indicator">正在生成列表，請稍候...</div>
      ) : (
        <div className="thumbnails-container">
          {thumbnails.map((thumb) => (
            <div key={thumb.id} className="thumbnail">
              <h2>{handleThumbName(thumb.name)}</h2>
              <img
                src={thumb.image}
                alt={thumb.name}
                className="thumbnail-image"
              />
              <button
                className="thumbDelete-button"
                onClick={() => handleRemoveItem(thumb.id)}
              >
                <div className="thumbDelete-icon-container">
                  <svg
                    className="thumbDelete-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="red"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="8"
                      y1="8"
                      x2="16"
                      y2="16"
                      stroke="red"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="16"
                      x2="16"
                      y2="8"
                      stroke="red"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutputList;
