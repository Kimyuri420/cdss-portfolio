
<p align="center">
  <a href="../../README.md">Portfolio Home</a>
</p>

<h1 align="center">DUGN</h1>

<p align="center">
  <strong>Backend Engineering · Medical Data · System Integration</strong>
</p>

<p align="center">
  AI 기반 심혈관 진료 의사결정 지원 시스템 (CDSS)
</p>

<p align="center">
  2026.08.10 – 2026.10.02 · 4인 팀 프로젝트
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-516AC8?style=for-the-badge&logo=python&logoColor=white">
  <img src="https://img.shields.io/badge/Django-14234A?style=for-the-badge&logo=django&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-516AC8?style=for-the-badge&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Orthanc-14234A?style=for-the-badge">
  <img src="https://img.shields.io/badge/RustFS-516AC8?style=for-the-badge">
  <img src="https://img.shields.io/badge/Celery-14234A?style=for-the-badge&logo=celery&logoColor=white">
</p>

---

## Engineering Perspective

> 의료 데이터의 정합성과 접근 권한을 고려하고,
> 환자 예약부터 의료진 판독 및 결과 공개까지
> 하나의 서비스 흐름으로 연결하는 백엔드를 구현했습니다.

## Project Overview

DUGN은 의료영상과 AI 분석 결과를 활용하여
의료진의 심혈관 질환 판독을 지원하고,
환자에게 진료 예약 및 검사 결과를 제공하는
임상 의사결정 지원 시스템입니다.

| 항목 | 내용 |
| :--- | :--- |
| 개발 기간 | 2026.08.10 – 2026.10.02 |
| 팀 구성 | 4명 |
| 담당 역할 | Backend Developer |
| 담당 범위 | Django 백엔드 전체 개발 |
| 의료진 서비스 | React Web |
| 환자 서비스 | Flutter Mobile |

## My Engineering Contributions

| Engineering Area | My Work |
| :--- | :--- |
| Backend & API | Django REST API 및 비즈니스 로직 구현 |
| Data Integrity | 예약 슬롯 생성, 트랜잭션 및 충돌 검사 |
| Access Control | 의료진 서명 및 공개 상태 기반 환자 결과 제공 |
| Medical Data | PostgreSQL, Orthanc, RustFS 연동 |
| 3D Processing | CT·Mask 좌표 정렬 및 GLB 생성 |
| System Integration | 의료진 Web, 환자 App, AI 결과 연계 |
| Infrastructure | GCP VM 환경 및 메모리 병목 대응 |

---

## Explore the Project

각 항목을 선택하면 상세 구현 내용과 기술적인 설계 근거를 확인할 수 있습니다.

| Section | Description |
| :--- | :--- |
| [01. System Architecture](./architecture.md) | 전체 시스템 구조 및 기술 선택 이유 |
| [02. Backend & API](./backend-api.md) | API, 예약, 인증, 결과 공개 |
| [03. Medical Data & 3D](./medical-data.md) | 의료영상, 저장소, 좌표 처리 |
| [04. Async & Infrastructure](./async-infra.md) | 비동기 작업 및 서버 환경 |
| [05. Troubleshooting](./troubleshooting.md) | 문제 분석 및 해결 과정 |
| [06. Validation & Contributions](./validation.md) | 핵심 코드, 테스트 및 구현 증빙 |

---

## Project Materials

- [Notion 포트폴리오](https://app.notion.com/p/3f60b387fad8816191acdb1eb0f7ac36)
- [최종 발표 자료](https://drive.google.com/file/d/1jagyOOrqoHlLhwOtsjSue_Fl1Vzs5IBd/view?usp=drivesdk)
- [전체 시연영상 (접근 제한)](https://drive.google.com/file/d/1mQFj2CJv3jKBsEk-Uw4sgLknAnSkTGPL/view?usp=drivesdk)

---

<p align="center">
  <strong>DUGN — Backend · Medical Data · Data Integrity</strong>
</p>

<p align="center">
  <a href="../../README.md">← Back to Portfolio</a>
</p>
