FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /workspace/app
COPY gradlew ./
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY src src

# Grant execution rights and build the applicaton skipping tests
RUN chmod +x ./gradlew
RUN ./gradlew build -x test

FROM eclipse-temurin:17-jdk-jammy
RUN apt-get update && apt-get install -y curl tzdata && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Seoul
WORKDIR /app
COPY --from=build /workspace/app .
ENTRYPOINT ["java","-jar","/app/build/libs/backend-0.0.1-SNAPSHOT.jar"]
