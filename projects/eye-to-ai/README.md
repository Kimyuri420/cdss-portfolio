
# EYE TO AI

> 안구 바이오마커 기반 만성질환 위험 분석 및 의료진 스크리닝 서비스

## 1. Project Overview

EYE TO AI는 안구 구조 데이터를 활용하여 당뇨 및 고혈압과의 연관성을 탐색하고, 머신러닝 분석 결과를 Django 기반 웹 서비스와 연결한 의료 IT 팀 프로젝트입니다.

단순한 질환 예측 모델 개발에 그치지 않고 관리자, 의료진, 환자별 서비스 환경을 구성하여 의료 데이터 분석과 사용자 관리가 연결되는 웹 플랫폼을 구현했습니다.

본 프로젝트는 연구 및 학습 목적의 프로토타입이며, 임상적으로 검증된 의료 진단 시스템은 아닙니다.

| 구분 | 내용 |
| --- | --- |
| 프로젝트명 | EYE TO AI |
| 개발 기간 | 1주 |
| 개발 인원 | 5명 |
| 프로젝트 유형 | 의료 IT / 머신러닝 / 웹 서비스 |
| 담당 역할 | 머신러닝 분석 및 Django 백엔드 개발 |
| 예측 대상 | 당뇨, 고혈압 |

## 2. Background & Objectives

### 프로젝트 배경

안과 검진에서 수집되는 정량적 안구 구조 데이터를 활용하여 전신질환과의 연관성을 분석하고, 만성질환 위험군을 탐색할 수 있는 가능성을 확인하고자 했습니다.

### 개발 목표

- 안구 구조 데이터와 만성질환 간 연관성 분석
- 머신러닝 기반 당뇨 및 고혈압 위험 예측 실험
- 의료진 중심의 스크리닝 서비스 구현
- 사용자 역할에 따른 인증 및 접근 권한 관리
- 관리자 중심의 사용자 및 데이터 관리 환경 구축


## 3. Tech Stack

| Category | Technology |
| --- | --- |
| Language | Python, JavaScript |
| Backend | Django 4.x |
| Architecture | MTV (Model-Template-View) |
| Authentication | Django Auth, Custom User, Session |
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Local Database | SQLite |
| Production Database | PostgreSQL (Railway) |
| ORM | Django ORM |
| Personal ML Experiment | Logistic Regression, XGBoost |
| Final Team ML Model | Random Forest |
| Data Processing | pandas, NumPy, scikit-learn |
| Explainable AI | SHAP |
| Visualization | matplotlib, seaborn |
| Report Generation | ReportLab |
| Model Management | joblib |
| Deployment | Railway (PaaS) |
| Version Control | Git, GitHub |

위 기술 스택은 최종 팀 플랫폼의 전체 구성과 개인 머신러닝 실험 환경을 포함합니다.

개인 담당 영역은 Django 기반 인증, 권한 관리, 관리자 시스템 및 머신러닝 실험이며, 최종 Random Forest 모델, SHAP 분석, PDF 리포트 및 Railway 배포는 팀 전체 구현 영역으로 구분합니다.


## 4. My Contributions

### 4.1 Django Architecture

- Django 프로젝트 초기 개발 환경 구성
- accounts, doctor, Patient 앱 분리 작업
- 공통 템플릿 및 URL 구조 구성
- requirements.txt 기반 의존성 관리

### 4.2 Authentication & Authorization

- 커스텀 사용자 모델 구성 및 수정
- 의료진 회원가입 및 로그인 기능 구현
- 관리자 로그인 기능 구현
- 환자 로그인 및 대시보드 연결 작업
- 의료진 가입 승인 및 계정 권한 관리
- 사용자 역할에 따른 접근 제어
- 비밀번호 검증 로직 개선

### 4.3 Administration System

- 관리자 대시보드 구현
- 의료진 계정 목록 및 승인 상태 관리
- 사용자 권한 변경 기능 구현
- 환자 데이터 조회 및 관리 화면 구성
- 사용자 및 환자 데이터 통계 표시
- 관리자 대시보드 차트 연동
- 시스템 로그 표시

### 4.4 AI Service Integration

- 관리자 화면의 AI 모델 정보 표시
- 분석 관련 데이터와 관리자 화면 연동
- 환자 및 분석 데이터 흐름 확인
- 분석 관리 화면 구성 및 수정

### 4.5 Machine Learning Experiment

- 안구 구조 데이터 전처리 및 변수 검토
- 당뇨 및 고혈압 예측 실험
- Logistic Regression 및 XGBoost 모델 실험
- 클래스 불균형 문제 검토
- 정밀도, 재현율, F1, ROC-AUC 비교
- 변수 영향 및 모델 성능 한계 분석

### 4.6 Development Environment

- Git 브랜치 기반 협업
- .gitignore 설정
- Python 캐시 파일 및 로컬 DB 추적 제외
- Git 충돌 해결 및 프로젝트 환경 정리

## 5. System Architecture

Django 기반의 모듈형 웹 서비스 구조로 구성했습니다.

| Module | Responsibility |
| --- | --- |
| config | 프로젝트 설정 및 URL 구성 |
| accounts | 사용자 인증, 계정 및 관리자 기능 |
| doctor | 의료진 업무 및 분석 결과 조회 |
| Patient | 환자 서비스 및 예약 관련 기능 |
| analysis | AI 분석 정보 및 관리 |
| ml_model | 머신러닝 예측 관련 기능 |

개인 담당 영역은 accounts 앱을 중심으로 한 인증, 권한 관리 및 관리자 시스템이며, 다른 앱과의 데이터 연결 및 초기 구조 구성에도 참여했습니다.

## 6. Authentication Workflow

1. 사용자가 회원가입 또는 로그인을 요청합니다.
2. Django 인증 시스템을 통해 사용자 정보를 검증합니다.
3. 의료진 계정의 경우 승인 상태를 확인합니다.
4. 사용자 역할 및 권한에 따라 접근 범위를 구분합니다.
5. 사용자 유형에 맞는 대시보드로 연결합니다.

의료진 가입과 실제 서비스 접근을 분리하여 관리자가 승인 여부를 관리할 수 있도록 구성했습니다.

## 7. Machine Learning Results

다음은 개인 초기 Logistic Regression 실험 결과입니다.

| Disease | ROC-AUC | Precision | Recall | F1 |
| --- | ---: | ---: | ---: | ---: |
| Diabetes | 0.60 | 0.20 | 0.54 | 0.29 |
| Hypertension | 0.59 | 0.28 | 0.55 | 0.37 |

### Result Analysis

- 클래스 불균형으로 인해 정확도만으로 모델 성능을 평가하기 어려웠습니다.
- 당뇨 모델은 재현율 대비 정밀도가 낮아 오탐 문제가 나타났습니다.
- 클래스 가중치와 임계값 조정 과정에서 정밀도와 재현율 간의 균형을 검토했습니다.
- 안구 구조 변수만으로 만성질환을 예측하는 데 한계가 있음을 확인했습니다.

위 결과는 개인 초기 실험 결과이며, 최종 팀 모델의 성능과 구분됩니다.

## 8. Engineering Highlights

### 사용자 인증과 권한 관리

사용자의 신원을 확인하는 인증 과정과 서비스 접근 범위를 결정하는 권한 관리 과정을 구분했습니다.

### 의료진 승인 프로세스

의료진 회원가입 이후 관리자가 승인 상태를 관리하도록 구성하여 가입과 서비스 접근을 분리했습니다.

### 관리자 통합 관리

사용자, 환자, AI 모델 정보 및 시스템 로그를 관리자 환경에서 확인할 수 있도록 관련 화면과 데이터를 연결했습니다.

### 모듈 단위 개발

Django 앱을 기능별로 구분하여 팀원 간 담당 영역을 분리하고 서비스 기능을 연결했습니다.

## 9. Technical Documentation

| Document | Description |
| --- | --- |
| [System Architecture](./architecture.md) | Django 구조 및 데이터 흐름 |
| [Authentication](./authentication.md) | 사용자 인증 및 권한 관리 |
| [Administration System](./admin-system.md) | 관리자 시스템 구현 |
| [AI Integration](./ai-integration.md) | AI 서비스 데이터 연동 |
| [ML Experiment](./ml-experiment.md) | 머신러닝 실험 및 평가 |
| [Troubleshooting](./troubleshooting.md) | 문제 해결 및 개선 경험 |

## 10. Project Resources

- [Notion Portfolio](https://app.notion.com/p/3f60b387fad8810cbd0bfe8e7f02b650)
- [Machine Learning Presentation](https://drive.google.com/file/d/1bTtQJRYK0mqAZUFNnmMvoHNdnBZ8dDFG/view)
- [Platform Presentation](https://drive.google.com/file/d/1tgNf8M-XuqKN_QSud_ycv44pdD3pkll_/view)

일부 자료는 공유 권한에 따라 접근이 제한될 수 있습니다.

## 11. Retrospective

이번 프로젝트를 통해 머신러닝 모델 개발뿐만 아니라 분석 결과를 실제 웹 서비스의 사용자 및 데이터 관리 구조와 연결하는 경험을 쌓았습니다.

특히 Django 기반 사용자 인증, 의료진 승인, 권한 관리 및 관리자 시스템을 구현하면서 백엔드 개발에 대한 관심을 구체화할 수 있었습니다.

향후에는 다음과 같은 개선을 고려할 수 있습니다.

- 세분화된 역할 기반 접근 제어
- 인증 및 권한 관련 자동화 테스트
- 승인 요청의 HTTP 메서드 및 대상 계정 검증 강화
- 시스템 로그의 감사 추적 기능 강화
- 머신러닝 모델의 외부 데이터 검증
- 데이터베이스 및 서비스 운영 환경 개선

---

본 문서는 팀 프로젝트의 전체 소스 코드를 복제한 것이 아닌 개인 기여도 중심의 기술 포트폴리오입니다.

팀 공동 구현 영역과 개인 담당 영역을 구분하여 작성했으며, 다른 팀원의 작업을 개인 단독 성과로 소개하지 않습니다.
