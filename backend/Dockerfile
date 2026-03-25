FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /workspace/app
COPY gradlew ./
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY src src

# Grant execution rights and build the applicaton skipping tests
RUN chmod +x ./gradlew
RUN ./gradlew build -x test

FROM eclipse-temurin:17-jre-jammy
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
VOLUME /tmp
COPY --from=build /workspace/app/build/libs/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
