package com.noah.backend.controller;

import com.noah.backend.entity.Subscription;
import com.noah.backend.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

	private final SubscriptionService service;

	public SubscriptionController(SubscriptionService service) {
		this.service = service;
	}

	// ============ CRUD ============

	@GetMapping
	public List<Subscription> getAll() {
		return service.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Subscription> getById(@PathVariable Long id) {
		return service.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public Subscription create(@RequestBody Subscription subscription) {
		return service.save(subscription);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Subscription> update(@PathVariable Long id, @RequestBody Subscription subscription) {
		return service.findById(id).map(existing -> {
			subscription.setId(id);
			return ResponseEntity.ok(service.save(subscription));
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		if (service.findById(id).isPresent()) {
			service.deleteById(id);
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.notFound().build();
	}

	// ============ 분석 API ============

	/** 전체 ROI 분석 */
	@GetMapping("/analysis")
	public List<Map<String, Object>> getAnalysis() {
		return service.analyzeAll();
	}

	/** 개별 구독 ROI 분석 */
	@GetMapping("/{id}/analysis")
	public ResponseEntity<Map<String, Object>> getSubscriptionAnalysis(@PathVariable Long id) {
		return service.findById(id).map(sub -> ResponseEntity.ok(service.analyzeSubscription(sub)))
				.orElse(ResponseEntity.notFound().build());
	}

	/** 대시보드 요약 데이터 */
	@GetMapping("/dashboard")
	public Map<String, Object> getDashboard() {
		return service.getDashboard();
	}
}
