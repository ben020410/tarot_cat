<p align="center">
  <h1 align="center">🃏 타로보는 고양이 🐱</h1>
  <p align="center">
    <h3 align="center">🎖️ 2024 CO-SHOW 전시 부스 참여 (총 방문객: 450명) 🎖️</h3>
  </p>
  <p align="center">
    <a>2024.11.20.~11.22. | 교육부, 한국연구재단/첨단분야 혁신융합대학 사업단 협의회 주최</a>
  </p>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/1f01c60a-6ae4-4865-9d16-e2b4d18ec81b" width="700">
  </p>
</p>
<br>

## :smile_cat: Introducing the Tarot Cat
<p align="center">
  <img src="https://github.com/user-attachments/assets/52a4781e-d56e-4b80-8154-2533a37868d0" width="310" height="300"/>
  <img src="https://github.com/user-attachments/assets/b7f5bb4f-2f84-4b2a-8bd5-fa8f14e832c1" width="320" height="300"/>
</p>

**타로보는 고양이**는 OpenAI API를 활용하여 **타로 점술의 형식으로 개인화된 답변을 제공하는 수익형 웹 서비스**입니다. <br>
사용자가 입력 창에 **고민거리**를 입력하면, 타로보는 고양이는 랜덤하게 뽑은 3장의 타로 카드 내용을 종합하여 **고민거리를 해결할 수 있도록 조언**합니다. <br>
<br>
<br>

## :desktop_computer: Logical Architecture
<p align="center">
  <img src="https://github.com/user-attachments/assets/b0ae4ec1-a149-4b31-bb6f-c570982a5001" width="700">
</p>

### 서비스 구현>
- **Node.js:** Backend의 핵심 요소이며, Javascript 코드를 웹 브라우저 바깥에서 실행하게 해주는 **런타임 환경**입니다.
  - Node.js의 openai 모듈을 통해 OpenAI API를 사용할 수 있습니다.
  - OpenAI API는 사용자의 입력(고민거리)을 받아 이에 해당하는 답변을 JSON 형식으로 반환하며, 해당 JSON 답변을 다시 Node.js에서 전처리하여 카드 번호를 매칭하고 '카드별 설명'과 '종합적인 조언'으로 나눕니다.
- **Express.js:** Node.js를 위한 **웹 프레임워크**입니다.
- **HTML, JS, CSS:** Frontend를 구성하며, 각각 **화면 구성**(HTML), **기능**(JS), **디자인**(CSS)을 담당합니다.

### 배포 환경>
- **AWS Lambda:** Backend code를 실행시키는 **서버리스(serverless) 컴퓨팅 플랫폼**입니다. Backend code는 Lambda 함수에 저장되는데, 이 Lambda 함수는 Backend logic **요청이 있을 때만 서버가 실행되어** 컴퓨팅 자원을 절약할 수 있습니다.
  - Node.js의 serverless-http 모듈을 통해 Backend와 Lambda 함수가 연결되었습니다.
- **AWS API Gateway:** API를 생성, 배포, 관리하는 **서비스**입니다. API Gateway에 Lambda 함수를 연결하여 관리를 용이하게 하고 하단에 언급된 **CORS 정책의 위반을 방지**합니다.
- **Cloudflare Pages:** Frontend를 배포한 **클라우드 기반의 정적 사이트 호스팅 및 배포 서비스**입니다.
  - Frontend/Backend가 배포되는 도메인이 다르다보니 **CORS(Cross-Origin Resource Sharing)로 인해 도메인 간의 자원 접근이 제한**됩니다. 이 CORS 정책의 위반을 방지하기 위해 AWS API Gateway를 사용했습니다.
 
### 수익화>
- Kakao AdFit, Google AdSense 등의 모듈을 Frontend에 추가하여 광고 수익을 창출합니다.
- 프로토타입의 서비스의 경우 광고 모듈을 추가하지 않았습니다.

<br>

## :hammer_and_wrench: Troubleshooting Cases
#### 개발 과정에서 발생했던 몇가지 Troubleshooting 사례입니다.
- **답변 전처리 개선**
  - 초기에는 Backend의 OpenAI API에서 생성된 답변을 줄글의 형태로 받아 정규 표현식, 구분자 등을 사용해 parsing하는 과정으로 전처리가 진행되었으나, 줄글이 정확히 분리되지 못해 카드 하나의 설명 란에 글이 몰리는 현상 등이 발생하였습니다.
  - 이 문제의 경우 **Prompt에 JSON 형태의 응답을 요청하는 내용을 추가**하여 정확도를 크게 개선할 수 있었습니다.
- **Live Server의 강제 새로고침 문제 해결**
  - 로컬 환경에서 Frontend와 Backend를 연동할 때, VS Code의 extension 중 Live Server을 이용하여 테스트를 진행했습니다. 이때 Backend의 답변은 잘 생성하지만 Frontend에서 **응답이 표시되었다가 순식간에 사라지는 문제**가 발생했습니다.
  - 이는 Live Server의 자동 새로고침 설정으로 인한 것으로 파악되었는데, 추후 배포에는 문제가 없다고 판단하여 로컬 환경에서 실행할 때 **새로고침 요청 시 확인 메시지를 띄우게 하여** 해당 이벤트가 발생하는 것을 방지했습니다.
- **CORS 정책 위반 문제 해결**
  - Frontend는 Cloudflare Pages를 통해 문제 없이 배포되었으나, Backend 코드를 Lambda 함수에서 실행할 시 **CORS 정책의 위반 문제**가 발생했습니다.
  - 이의 해결을 위해 각 로직마다 CORS 헤더를 Backend 코드에 추가하였으나, 문제가 여전히 지속되어 **AWS API Gateway를 도입**했습니다.
<br>

## :globe_with_meridians: Releases
**v1.0.0** / 2024-09-03: 프로토타입 배포 <br>
<br>
<br>

## :information_source: Informations
#### 개발 기간: 2024-08-31 ~ 2024-09-03 (4일)
- 8/31(Sat)~9/1(Sun): 서비스 기획 및 구상
- 9/1(Sun)~9/2(Mon): Backend 구현
- 9/2(Mon): Frontend 구현 및 로컬 환경에서 Backend 연동
- 9/3(Tue): 프로토타입 배포

본 서비스는 현재 개인 API KEY로 token을 사용하고 있어 **예고 없이 API 연동이 해제될 수 있습니다.** <br>
해당 상황 발생 시 프로토타입 테스트를 원하는 사용자께서는 [Issues](https://github.com/ben020410/tarot_cat/issues)에 글을 남겨주시기 바랍니다.
