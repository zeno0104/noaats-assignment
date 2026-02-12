package com.noah.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOriginPatterns("http://localhost:5173", // 로컬 개발 환경
				"https://*.vercel.app" // ⭐️ 핵심: Vercel의 모든 주소 자동 허용
		).allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 모든 요청 방식 허용
				.allowedHeaders("*").allowCredentials(true).maxAge(3600);
	}
}