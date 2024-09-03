## Introducing the "Tarot Cat"
<img src="https://github.com/user-attachments/assets/52a4781e-d56e-4b80-8154-2533a37868d0" width="400" height="385"/>
<img src="https://github.com/user-attachments/assets/b7f5bb4f-2f84-4b2a-8bd5-fa8f14e832c1" width="410" height="385"/>
<br>
<br>

**타로보는 고양이**는 OpenAI API를 활용하여 **타로 점술의 형식으로 개인화된 답변을 제공하는 수익형 웹 서비스**입니다. <br>
사용자가 입력 창에 **고민거리**를 입력하면, 타로보는 고양이는 랜덤하게 뽑은 3장의 타로 카드 내용을 종합하여 **고민거리를 해결할 수 있도록 조언**합니다. <br>
<br>
<br>

## Logical Architecture
<img src="https://github.com/user-attachments/assets/a9480387-b4d6-4a69-98da-6f10b7e33f1e" width="800" height="490"/> <br>

### 서비스 구현>
- **Node.js:** Backend의 핵심 요소이며, Javascript 코드를 웹 브라우저 바깥에서 실행하게 해주는 **런타임 환경**입니다.
  - Node.js의 openai 모듈을 통해 OpenAI API를 사용할 수 있습니다.
  - OpenAI API는 사용자의 입력(고민거리)을 받아 이에 해당하는 답변을 JSON 형식으로 반환하며, 해당 JSON 답변을 다시 Node.js에서 전처리하여 카드 번호를 매칭하고 '카드별 설명'과 '종합적인 조언'으로 나눕니다.
- **Express.js:** Node.js를 위한 **웹 프레임워크**입니다.
- **HTML, JS, CSS:** Frontend를 구성하며, 각각 **화면 구성**(HTML), **기능**(JS), **디자인**(CSS)을 담당합니다.

### 배포 환경>
- **AWS Lambda:** Backend code를 실행시키는 **서버리스(serverless) 컴퓨팅 플랫폼**입니다. Backend code는 Lambda 함수에 저장되는데, 이 Lambda 함수는 Backend logic **요청이 있을 때만 서버가 실행되어** 컴퓨팅 자원을 절약할 수 있습니다.
- **AWS API Gateway:** API를 생성, 배포, 관리하는 **서비스**입니다. API Gateway에 Lambda 함수를 연결하여 관리를 용이하게 하고 하단에 언급된 **CORS 정책의 위반을 방지**합니다.
- **Cloudflare Pages:** Frontend를 배포한 **클라우드 기반의 정적 사이트 호스팅 및 배포 서비스**입니다.
  - Frontend/Backend가 배포되는 도메인이 다르다보니 **CORS(Cross-Origin Resource Sharing)로 인해 도메인 간의 자원 접근을 제한**됩니다. 이 CORS 정책의 위반을 방지하기 위해 특정 CORS 헤더를 Node.js 코드에 추가하였으며 AWS API Gateway를 사용했습니다.

<br>

## Troubleshooting Cases
#### 개발 과정에서 발생했던 몇가지 Troubleshooting 사례입니다.
- 사례1
- 사례2
- 사례3
- 사례4
<br>

## Releases
**v1.0.0** / 2024-09-03: 프로토타입 배포 <br>
<br>
<br>

## Informations
#### 개발 기간: 2024-08-31 ~ 2024-09-03 (4일)
- 8/31(Sat)~9/1(Sun): 서비스 기획 및 구상
- 9/1(Sun)~9/2(Mon): 백엔드 구현
- 9/2(Mon): 프론트엔드 구현 및 백엔드 연동
- 9/3(Tue): 프로토타입 배포

본 서비스는 현재 개인 API KEY로 token을 사용하고 있어 **예고 없이 API 연동이 해제될 수 있습니다.** <br>
해당 상황 발생 시 프로토타입 테스트를 원하는 사용자께서는 [Issues](https://github.com/ben020410/tarot_cat/issues)에 글을 남겨주시기 바랍니다.
