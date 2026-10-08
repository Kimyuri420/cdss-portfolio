# 김유리 | 프로젝트 포트폴리오

의료 데이터를 다루는 팀 프로젝트에서 **백엔드의 업무 규칙·권한·데이터 연결**과 **의료진이 사용하는 웹·모바일 화면**을 개발했습니다. 아래에는 프로젝트마다 제가 맡은 범위와 판단 근거를 분리해 정리했습니다.

## 프로젝트

| 프로젝트 | 사용 기술 | 내가 맡은 부분 | 상세 |
| --- | --- | --- | --- |
| **DUGN · 심혈관 CDSS** | Python, Django REST Framework, PostgreSQL, DICOM | 의료진 일정·예약 충돌, 판독 후 결과 공개, 의료영상·3D 데이터 API | [CDSS 백엔드 사례](projects/cdss-backend.md) |
| **EYE TO AI · 안구 데이터** | Python, scikit-learn, Django | 당뇨·고혈압 모델 실험과 평가, 로그인·권한·관리자 기능 | [안구 프로젝트 사례](projects/eye-to-ai.md) |
| **관상동맥 판독 지원 웹** | React | 환자 대시보드, 영상 뷰어 제어, 확대와 병변 박스 좌표, 다크 모드 | [React 사례](projects/coronary-web-react.md) |
| **맥(脈)가이버 모바일** | Flutter | 의료진 환자 조회, 채팅·협진, 일정·할 일, 텍스트·음성 메모 | [Flutter 사례](projects/macgyver-flutter.md) |

React 웹과 Flutter 앱은 관상동맥 협착 탐지라는 주제를 웹·모바일에서 다룬 **각각의 팀 프로젝트 단계**입니다. DUGN은 이후의 통합 CDSS 프로젝트로, 제 역할은 백엔드에 집중했습니다. 같은 주제라도 프로젝트별 구현과 제 담당 범위를 구분했습니다.

## 읽는 순서

- **백엔드·서비스 설계:** [DUGN의 예약, 결과 공개, 의료영상 처리](projects/cdss-backend.md)
- **데이터 분석과 인증:** [EYE TO AI의 모델 평가와 관리자 기능](projects/eye-to-ai.md)
- **프론트엔드:** [React 영상 뷰어](projects/coronary-web-react.md) → [Flutter 의료진 업무 앱](projects/macgyver-flutter.md)

각 상세 페이지에 최종 발표 자료와 가능한 시연영상을 연결했습니다. 공유드라이브 링크는 계정별 접근 권한이 필요할 수 있습니다. 팀 전체 소스나 발표 성과를 제 단독 구현으로 표기하지 않았으며, 의료 AI 결과는 검증 범위와 한계를 함께 적었습니다.
