FROM maven:3.9.9-amazoncorretto-11 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

FROM amazoncorretto:11-alpine-jre

WORKDIR /app
COPY --from=builder /app/target/api-gateway-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
