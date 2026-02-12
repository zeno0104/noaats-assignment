package com.noah.backend.repository;

import com.noah.backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
	// 필요한 경우 여기에 커스텀 쿼리 추가 (지금은 기본 기능만으로 충분)
}