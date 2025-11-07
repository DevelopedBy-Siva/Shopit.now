FROM maven:3.9.4-amazoncorretto-11 AS builder

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM amazoncorretto:11-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar shopitnow-0.0.1-SNAPSHOT.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "shopitnow-0.0.1-SNAPSHOT.jar"]
