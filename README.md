<div align="center">

# SubSync

**Track every subscription. Never get surprised by a charge again.**

![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-build-C71A36?style=flat-square&logo=apachemaven&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

</div>

---

SubSync is a Spring Boot web application for managing recurring subscriptions. Add your services, track billing cycles, and keep everything in one clean dashboard — no more forgotten trials or unexpected charges at the end of the month.

---

## Quick Start

> **Requires:** Java 17+ · Maven 3.6+

```bash
git clone https://github.com/Rayhan-Arrazy/subsync.git
cd subsync/backend/backend
```

Open `src/main/resources/application.properties` and set your database:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/subsync_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

Then run:

```bash
./mvnw spring-boot:run
```

Visit → `http://localhost:8080`

---

## Stack

| | |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot |
| Frontend | HTML · CSS · JavaScript |
| Build | Maven |

---

## Structure

```
subsync/
└── backend/backend/
    └── src/main/
        ├── java/          # Controllers, services, models
        └── resources/     # application.properties, templates
```

---

<div align="center">

Made with Spring Boot · MIT License

</div>
