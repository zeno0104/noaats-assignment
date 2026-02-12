# 1. 빌드 단계 (Gradle을 이용해 jar 파일 생성)
FROM gradle:jdk17-alpine AS builder
WORKDIR /app
COPY . .
# 테스트는 건너뛰고 빌드만 진행 (속도 향상 및 오류 방지)
RUN gradle build --no-daemon -x test

# 2. 실행 단계 (가벼운 Java 실행 환경만 가져옴)
FROM openjdk:21-alpine
WORKDIR /app
# 빌드 단계에서 만든 jar 파일을 복사해옴
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]