package com.noah.backend.controller;

import com.noah.backend.entity.Subscription;
import com.noah.backend.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

	private final SubscriptionRepository subscriptionRepository;

	@GetMapping
	public List<Subscription> getAllSubscriptions() {
		return subscriptionRepository.findAll();
	}

	@PostMapping
	public Subscription createSubscription(@RequestBody Subscription subscription) {
		if (subscription.getCurrency() == null)
			subscription.setCurrency("KRW");
		if (subscription.getSharedCount() <= 0)
			subscription.setSharedCount(1);
		if (subscription.getCategory() == null)
			subscription.setCategory("ETC"); // 기본값

		return subscriptionRepository.save(subscription);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Subscription> updateSubscription(@PathVariable("id") Long id,
			@RequestBody Subscription updatedSub) {
		return subscriptionRepository.findById(id).map(sub -> {
			sub.setServiceName(updatedSub.getServiceName());
			sub.setCost(updatedSub.getCost());
			sub.setCurrency(updatedSub.getCurrency());
			sub.setBillingCycle(updatedSub.getBillingCycle());
			sub.setNextBillingDate(updatedSub.getNextBillingDate());
			sub.setUsageHours(updatedSub.getUsageHours());

			int count = updatedSub.getSharedCount() <= 0 ? 1 : updatedSub.getSharedCount();
			sub.setSharedCount(count);

			sub.setCategory(updatedSub.getCategory()); // 카테고리 수정

			return ResponseEntity.ok(subscriptionRepository.save(sub));
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteSubscription(@PathVariable("id") Long id) {
		if (subscriptionRepository.existsById(id)) {
			subscriptionRepository.deleteById(id);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}
}