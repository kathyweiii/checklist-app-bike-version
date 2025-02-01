import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [inspector, setInspector] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [weather, setWeather] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState(""); //路口intersection 或 路段section
  const [legCount, setLegCount] = useState("");
  const [roadNames, setRoadNames] = useState([]); //路口裡的各條路的路名
  const [directions, setDirections] = useState([]); //路口裡的各條路的方位

  const navigate = useNavigate();

  const handleIntersectionChange = (event) => {
    const count = event.target.value;
    setLegCount(count);
    setRoadNames(Array.from({ length: count }, () => ""));
    setDirections(Array.from({ length: count }, () => ""));
    if (type === "road") {
      const updatedRoadNames = Array.from({ length: count }, () => location);
      setRoadNames(updatedRoadNames);
    }
  };

  const handleRoadNameChange = (index, value) => {
    const updatedRoadNames = [...roadNames];
    updatedRoadNames[index] = value;
    setRoadNames(updatedRoadNames);
  };

  const handleDirectionChange = (index, value) => {
    const updatedDirections = [...directions];
    updatedDirections[index] = value;
    setDirections(updatedDirections);
  };

  const handleAddNewRoad = () => {
    setRoadNames([...roadNames, ""]);
    setDirections([...directions, ""]);
  };

  const handleSubmit = () => {
    if (!inspector || !selectedDate || !weather || !location || !type) {
      alert("您尚有基本訊息未填");
      return;
    }

    if (
      !legCount ||
      roadNames.some((name) => !name) ||
      directions.some((dir) => !dir)
    ) {
      alert("您尚未填入所有道路資訊");
      return;
    }

    const homePageData = {
      locationName: location,
      inspector,
      selectedDate,
      weather,
      type,
      legCount,
      roadNames,
      directions,
    };

    navigate("/checklist", { state: { ...homePageData, from: "HomePage" } });
  };

  return (
    <div className="container">
      <h1>RSI道路交通安全檢查表</h1>
      <h2>資訊化填寫系統</h2>
      <div className="question">
        <label>填列人員</label>
        <input
          type="text"
          value={inspector}
          onChange={(e) => setInspector(e.target.value)}
          placeholder="輸入填列人員名稱"
        />
      </div>
      <div className="question">
        <label>填寫日期</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          placeholder="選擇填寫日期"
        />
      </div>
      <div className="question">
        <label>天氣狀況</label>
        <input
          type="text"
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          placeholder="輸入天氣狀況"
        />
      </div>
      <div className="question">
        <label>地點名稱</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="輸入地點名稱"
        />
      </div>
      <div className="question">
        <label>選擇類型</label>
        <div className="button-group">
          <button
            className={type === "intersection" ? "active" : ""}
            onClick={() => setType("intersection")}
          >
            路口
          </button>
          <button
            className={type === "road" ? "active" : ""}
            onClick={() => setType("road")}
          >
            路段
          </button>
        </div>
      </div>

      {type === "intersection" && (
        <div>
          <label>路口分岔數</label>
          <select value={legCount} onChange={handleIntersectionChange}>
            <option value="">選擇</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5以上</option>
          </select>

          {roadNames.map((roadName, index) => (
            <div key={index} className="road-entry">
              <input
                type="text"
                value={roadName}
                onChange={(e) => handleRoadNameChange(index, e.target.value)}
                placeholder={`路名及方向 ${index + 1}`}
              />
              <select
                value={directions[index] || ""}
                onChange={(e) => handleDirectionChange(index, e.target.value)}
              >
                <option value="">選擇方向</option>
                <option value="東側">東側</option>
                <option value="西側">西側</option>
                <option value="南側">南側</option>
                <option value="北側">北側</option>
                <option value="東南側">東南側</option>
                <option value="東北側">東北側</option>
                <option value="西南側">西南側</option>
                <option value="西北側">西北側</option>
                <option value="其他">其他</option>
              </select>
            </div>
          ))}
          {legCount === "5" && (
            <button type="button" onClick={handleAddNewRoad}>
              + 新增路名及方向
            </button>
          )}
        </div>
      )}
      {type === "road" && (
        <div>
          <label>道路類型</label>
          <select value={legCount} onChange={handleIntersectionChange}>
            <option value="">選擇類型</option>
            <option value="1">單向道</option>
            <option value="2">雙向道</option>
          </select>

          {roadNames.map((roadName, index) => (
            <div key={index} className="road-entry">
              <label> {`行進方向${index + 1}`} </label>
              <input
                type="text"
                value={roadName || location} // Use location as default
                onChange={(e) => handleRoadNameChange(index, e.target.value)}
                placeholder="請輸入路段名稱"
              />
              <select
                value={directions[index] || ""}
                onChange={(e) => handleDirectionChange(index, e.target.value)}
              >
                <option value="">選擇方向</option>
                <option value="往東">往東</option>
                <option value="往西">往西</option>
                <option value="往南">往南</option>
                <option value="往北">往北</option>
                <option value="往東南">往東南</option>
                <option value="往東北">往東北</option>
                <option value="往西南">往西南</option>
                <option value="往西北">往西北</option>
                <option value="其他">其他</option>
              </select>
            </div>
          ))}
        </div>
      )}
      <div className="submit-button-container">
        <button className="submit-button" onClick={handleSubmit}>
          確定送出
        </button>
      </div>
    </div>
  );
}

export default HomePage;
