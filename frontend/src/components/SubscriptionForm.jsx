import React, { useState } from "react";

const SubscriptionForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "OTT", // 기본값
    cost: "",
    currency: "KRW",
    billingCycle: "MONTHLY",
    nextBillingDate: "",
    usageHours: "",
    sharedCount: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.serviceName || !formData.cost) return;

    onAdd({
      ...formData,
      cost: Number(formData.cost),
      usageHours: Number(formData.usageHours) || 0,
      sharedCount:
        Number(formData.sharedCount) < 1 ? 1 : Number(formData.sharedCount),
      nextBillingDate:
        formData.nextBillingDate === "" ? null : formData.nextBillingDate,
    });

    setFormData({
      serviceName: "",
      category: "OTT",
      cost: "",
      currency: "KRW",
      billingCycle: "MONTHLY",
      nextBillingDate: "",
      usageHours: "",
      sharedCount: 1,
    });
  };

  return (
    <div className="form-container">
      <h3>🔍 구독 진단하기</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "12px", color: "#666" }}>서비스 이름</label>
          <input
            type="text"
            name="serviceName"
            placeholder="예: 넷플릭스, ChatGPT"
            value={formData.serviceName}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "12px", color: "#666" }}>
            카테고리 (분석 기준)
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ fontWeight: "bold", color: "#6c5ce7" }}
          >
            <option value="OTT">📺 OTT (영화/드라마)</option>
            <option value="MUSIC">🎵 음악/오디오</option>
            <option value="WORK">💼 생산성/업무 (AI, 툴)</option>
            <option value="ETC">📦 기타</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>금액</label>
            <input
              type="number"
              name="cost"
              placeholder="20"
              value={formData.cost}
              onChange={handleChange}
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>화폐</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              style={{ marginBottom: 0 }}
            >
              <option value="KRW">₩</option>
              <option value="USD">$</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontSize: "12px", color: "#666" }}>
            월 사용 시간 (대략)
          </label>
          <input
            type="number"
            name="usageHours"
            placeholder="예: 10 (안 쓰면 0)"
            value={formData.usageHours}
            onChange={handleChange}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            background: "#f8f9fa",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>👨‍👩‍👧‍👦</span>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "12px", color: "#666" }}>
              공유 인원 (나 포함)
            </label>
            <input
              type="number"
              name="sharedCount"
              value={formData.sharedCount}
              onChange={handleChange}
              min="1"
              style={{ marginBottom: 0 }}
            />
          </div>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          진단 시작
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
