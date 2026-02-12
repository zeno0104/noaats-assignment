import React, { useState, useEffect } from "react";

const SubscriptionItem = ({ item, onDelete, onUpdate, exchangeRate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    serviceName: item.serviceName,
    category: item.category || "OTT",
    cost: item.cost,
    currency: item.currency || "KRW",
    billingCycle: item.billingCycle,
    nextBillingDate: item.nextBillingDate || "",
    usageHours: item.usageHours || 0,
    sharedCount: item.sharedCount || 1,
  });

  useEffect(() => {
    setEditData({
      serviceName: item.serviceName,
      category: item.category || "OTT",
      cost: item.cost,
      currency: item.currency || "KRW",
      billingCycle: item.billingCycle,
      nextBillingDate: item.nextBillingDate || "",
      usageHours: item.usageHours || 0,
      sharedCount: item.sharedCount || 1,
    });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = () => {
    onUpdate(item.id, {
      ...editData,
      cost: Number(editData.cost),
      usageHours: Number(editData.usageHours) || 0,
      sharedCount:
        Number(editData.sharedCount) < 1 ? 1 : Number(editData.sharedCount),
      nextBillingDate:
        editData.nextBillingDate === "" ? null : editData.nextBillingDate,
    });
    setIsEditing(false);
  };

  // ==========================
  // 🧠 ROI 분석 알고리즘 (핵심!)
  // ==========================

  // 1. 실제 비용 계산 (환율 적용)
  let totalCostKrw = Number(item.cost);
  if (item.currency === "USD") totalCostKrw = item.cost * exchangeRate;
  if (item.billingCycle === "YEARLY") totalCostKrw = totalCostKrw / 12;

  // 2. 내 부담금 (N빵)
  const sharedCount = item.sharedCount || 1;
  const myRealCost = totalCostKrw / sharedCount;

  // 3. 단위당 비용 (시간당 비용)
  const usage = item.usageHours || 0;
  const costPerHour = usage > 0 ? Math.round(myRealCost / usage) : myRealCost;

  // 4. 시장 기준가 (Benchmark) 설정
  let benchmarkPrice = 0;
  let benchmarkName = "";

  switch (item.category) {
    case "OTT": // 넷플릭스 등
      benchmarkPrice = 15000; // 영화 티켓 1장 가격
      benchmarkName = "영화 티켓";
      break;
    case "MUSIC": // 멜론, 스포티파이
      benchmarkPrice = 500; // 코노 1곡 or 시간당 라디오 가치
      benchmarkName = "코인노래방 1곡";
      break;
    case "WORK": // ChatGPT, Claude
      benchmarkPrice = 9860; // 2024 최저시급 (내 시간을 아껴줌)
      benchmarkName = "최저시급";
      break;
    default: // ETC
      benchmarkPrice = 3000; // 커피 한 잔
      benchmarkName = "커피 한 잔";
  }

  // 5. 판독 로직 (Good / Bad 결정)
  let status = "NORMAL"; // SOSO
  let message = "";
  let badgeColor = "#95a5a6";

  if (usage === 0) {
    status = "BAD";
    message = "💸 100% 손해! 기부천사세요?";
    badgeColor = "#e74c3c"; // Red
  } else if (costPerHour > benchmarkPrice) {
    status = "BAD";
    message = `🚨 ${benchmarkName}보다 비싸게 쓰는 중!`;
    badgeColor = "#e74c3c";
  } else {
    status = "GOOD";
    message = `✅ ${benchmarkName}보다 이득! 훌륭합니다.`;
    badgeColor = "#2ecc71"; // Green
  }

  // 공유 제안 메시지
  const shareSuggestion =
    sharedCount === 1 && status === "BAD"
      ? `💡 4명 공유시 월 ${Math.round(
          totalCostKrw / 4
        ).toLocaleString()}원! (ROI 상승)`
      : null;

  const searchUrl = `https://www.google.com/search?q=${item.serviceName}+해지+방법`;

  return (
    <div className="sub-card" style={{ borderLeft: `6px solid ${badgeColor}` }}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            name="serviceName"
            value={editData.serviceName}
            onChange={handleChange}
            placeholder="서비스명"
            style={{ marginBottom: "5px" }}
          />
          <select
            name="category"
            value={editData.category}
            onChange={handleChange}
            style={{ marginBottom: "5px" }}
          >
            <option value="OTT">OTT</option>
            <option value="MUSIC">음악</option>
            <option value="WORK">업무</option>
            <option value="ETC">기타</option>
          </select>
          <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
            <input
              type="number"
              name="cost"
              value={editData.cost}
              onChange={handleChange}
              style={{ flex: 2 }}
            />
            <select
              name="currency"
              value={editData.currency}
              onChange={handleChange}
              style={{ flex: 1 }}
            >
              <option value="KRW">₩</option>
              <option value="USD">$</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginBottom: "5px",
            }}
          >
            <label style={{ fontSize: "0.8rem" }}>공유:</label>
            <input
              type="number"
              name="sharedCount"
              value={editData.sharedCount}
              onChange={handleChange}
              min="1"
              style={{ width: "50px" }}
            />
            <label style={{ fontSize: "0.8rem" }}>시간:</label>
            <input
              type="number"
              name="usageHours"
              value={editData.usageHours}
              onChange={handleChange}
              style={{ width: "50px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                background: "#6c5ce7",
                color: "white",
                border: "none",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                background: "#b2bec3",
                color: "white",
                border: "none",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card-header">
            <h4>{item.serviceName}</h4>
            <div className="btn-group">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️
              </button>
              <button className="delete-btn" onClick={() => onDelete(item.id)}>
                🗑️
              </button>
            </div>
          </div>

          <div className="card-body">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "end",
                marginBottom: "10px",
              }}
            >
              <span className="cost">
                {item.currency === "USD" ? "$" : "₩"}{" "}
                {Number(item.cost).toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#888",
                  background: "#f1f2f6",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {item.category} / {usage}시간
              </span>
            </div>

            {/* 분석 결과 박스 */}
            <div
              style={{
                background: "#fafafa",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
                border: `1px solid ${badgeColor}30`,
              }}
            >
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
                시간당 비용
              </p>
              <p
                style={{
                  margin: "2px 0",
                  fontSize: "1.3rem",
                  fontWeight: "800",
                  color: badgeColor,
                }}
              >
                {Math.round(costPerHour).toLocaleString()}원
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: status === "BAD" ? "#e74c3c" : "#2ecc71",
                }}
              >
                {message}
              </p>
            </div>

            {/* 공유 제안 (호구 탈출 솔루션) */}
            {shareSuggestion && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "0.8rem",
                  color: "#1967d2",
                  background: "#e8f0fe",
                  padding: "5px",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                {shareSuggestion}
              </div>
            )}

            {/* N빵 정보 */}
            {sharedCount > 1 && (
              <div
                style={{
                  marginTop: "5px",
                  textAlign: "right",
                  fontSize: "0.8rem",
                  color: "#1967d2",
                }}
              >
                👥 {sharedCount}명 공유 중 (내 부담: ₩
                {Math.round(myRealCost).toLocaleString()})
              </div>
            )}

            {/* 해지 버튼 (심각할 때만) */}
            {status === "BAD" && sharedCount === 1 && (
              <a
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    background: "#ff7675",
                    color: "white",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  📉 호구 탈출하러 가기 (해지)
                </button>
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionItem;
