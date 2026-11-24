
<p align="center">
  <a href="../README.md">Portfolio Home</a>
</p>

<h1 align="center">DUGN — CDSS Backend</h1>

<p align="center">
  <strong>Backend Engineering · Medical Data · System Integration</strong>
</p>

<p align="center">
  AI 기반 심혈관 진료 의사결정 지원 시스템
</p>

<p align="center">
  2026.08.10 – 2026.10.02 · 4인 팀 프로젝트
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-516AC8?style=for-the-badge&logo=python&logoColor=white">
  <img src="https://img.shields.io/badge/Django-14234A?style=for-the-badge&logo=django&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-516AC8?style=for-the-badge&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Celery-14234A?style=for-the-badge&logo=celery&logoColor=white">
  <img src="https://img.shields.io/badge/Docker-516AC8?style=for-the-badge&logo=docker&logoColor=white">
</p>

---

## Engineering Perspective

의료 데이터의 정합성과 접근 권한을 고려하고,
환자 예약부터 의료진 판독 및 결과 공개까지
하나의 서비스 흐름으로 연결하는 Backend를 구현했습니다.

## Project at a Glance

| Engineering Area | Key Implementation |
| :--- | :--- |
| Backend & API | Django REST API, 의료 업무 로직 |
| Data Integrity | Transaction, Row Lock, 예약 충돌 검사 |
| Access Control | 의료진 서명 및 환자 결과 공개 |
| Medical Data | PostgreSQL, Orthanc, RustFS |
| 3D Processing | CT·Mask 좌표 정렬, Marching Cubes, GLB |
| Async Processing | Celery, RabbitMQ, Redis |
| Infrastructure | Docker Compose, GCP VM |

---

## Explore the Project

### [DUGN — Full Project Overview →](./dugn/README.md)

| Section | Engineering Focus |
| :--- | :--- |
| [01. System Architecture](./dugn/architecture.md) | 시스템 구조 및 설계 의사결정 |
| [02. Backend & API](./dugn/backend-api.md) | 트랜잭션, 동시성 제어, 접근 권한 |
| [03. Medical Data & 3D](./dugn/medical-data.md) | 의료영상 처리 및 3D 생성 |
| [04. Async & Infrastructure](./dugn/async-infra.md) | 비동기 작업 및 서버 환경 |
| [05. Troubleshooting](./dugn/troubleshooting.md) | 기술적 문제 분석 및 해결 |
| [06. Validation & Contributions](./dugn/validation.md) | 테스트 코드 및 개인 기여 증빙 |

---

## Project Materials

- [Notion Portfolio](https://app.notion.com/p/3f60b387fad8816191acdb1eb0f7ac36)
- [Final Presentation](https://drive.google.com/file/d/1jagyOOrqoHlLhwOtsjSue_Fl1Vzs5IBd/view?usp=drivesdk)
- [Demonstration Video - 접근 제한](https://drive.google.com/file/d/1mQFj2CJv3jKBsEk-Uw4sgLknAnSkTGPL/view?usp=drivesdk)

---

<p align="center">
  <strong>DUGN — Engineering for Reliable Medical Data</strong>
</p>

<p align="center">
  <a href="../README.md">← Back to Portfolio</a>
</p>
