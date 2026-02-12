package com.noah.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "subscriptions")
public class Subscription {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String serviceName;
	private int cost;
	private String currency; // "KRW", "USD"
	private String billingCycle;
	private LocalDate nextBillingDate;

	private int usageHours; // 사용량
	private int sharedCount; // 공유 인원

	// 🆕 분석을 위한 카테고리 (OTT, MUSIC, WORK, ETC)
	private String category;
}