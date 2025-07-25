# Build stage
FROM gradle:8.7-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar

# Production stage
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
