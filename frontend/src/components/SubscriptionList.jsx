import React from "react";
import SubscriptionItem from "./SubscriptionItem";

// ✅ props에 onUpdate가 확실히 있어야 합니다.
const SubscriptionList = ({
  subscriptions,
  onDelete,
  onUpdate,
  exchangeRate,
}) => {
  if (subscriptions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#b2bec3" }}>
        <p>등록된 구독이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="list-grid">
      {subscriptions.map((item) => (
        <SubscriptionItem
          key={item.id}
          item={item}
          onDelete={onDelete}
          // ✅ 범인 해결: 여기서 onUpdate를 Item에게 전달합니다!
          onUpdate={onUpdate}
          exchangeRate={exchangeRate}
        />
      ))}
    </div>
  );
};

export default SubscriptionList;
