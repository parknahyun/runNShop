# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
# Windows(CRLF) 체크아웃 대비
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew
COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /src/build/libs/*.jar app.jar
EXPOSE 8080
# Lightsail 컨테이너는 서비스 메모리를 공유하므로 힙을 제한
ENV JAVA_TOOL_OPTIONS="-Xmx384m"
ENTRYPOINT ["java", "-jar", "app.jar"]
