import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "./api/axios";
import SubscriptionForm from "./components/SubscriptionForm";
import SubscriptionList from "./components/SubscriptionList";

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(1450);

  useEffect(() => {
    fetchSubscriptions();
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await res.json();
      setExchangeRate(data.rates.KRW);
    } catch (error) {
      console.error("환율 로드 실패", error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("/subscriptions");
      setSubscriptions(response.data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("데이터 로드 실패", error);
    }
  };

  const handleAdd = async (data) => {
    try {
      await axios.post("/subscriptions", data);
      await fetchSubscriptions();
    } catch (error) {
      alert("추가 실패!");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`/subscriptions/${id}`, updatedData);
      await fetchSubscriptions();
    } catch (error) {
      alert("수정 실패!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/subscriptions/${id}`);
      await fetchSubscriptions();
    } catch (error) {
      alert("삭제 실패!");
    }
  };

  const totalMonthlyCostKrw = subscriptions.reduce((acc, cur) => {
    let costKrw = cur.cost;
    if (cur.currency === "USD") costKrw = cur.cost * exchangeRate;
    // 내가 내는 몫(N빵)만 합산
    costKrw = costKrw / (cur.sharedCount || 1);
    if (cur.billingCycle === "YEARLY") costKrw = costKrw / 12;
    return acc + costKrw;
  }, 0);

  return (
    <div className="app-container">
      <header>
        <h1>
          📊 구독 가성비 판독기{" "}
          <span style={{ fontSize: "0.6em", color: "#a29bfe" }}>
            (ROI Analyzer)
          </span>
        </h1>
        <div className="summary-banner">
          <p>이번 달 나의 실질 구독료</p>
          <h2>₩ {Math.round(totalMonthlyCostKrw).toLocaleString()}</h2>
          <span className="rate-info">
            USD: ₩{exchangeRate.toLocaleString()}
          </span>
        </div>
      </header>

      <main>
        <section className="left-panel">
          <SubscriptionForm onAdd={handleAdd} />
        </section>

        <section className="right-panel">
          <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
            분석 리포트{" "}
            <span style={{ color: "#6c5ce7" }}>({subscriptions.length})</span>
          </h2>
          <SubscriptionList
            subscriptions={subscriptions}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            exchangeRate={exchangeRate}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
