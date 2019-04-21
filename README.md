# A-Survey
## Introduction

설문조사 관리 웹 어플리케이션입니다.

## Period

2018년 10월 20일 ~ 11월 2일

## Installation

### [Server](https://github.com/kimkyeseung/A-survey-api)
```
git clone https://github.com/kimkyeseung/A-survey-api.git
```
에디터에서 `Start Debugging` 을 실행합니다.

### Client
```
git clone https://github.com/kimkyeseung/A-survey.git
npm install
npm start
```
브라우저에서 <http://localhost:8080/>으로 접속합니다.

## Tech Stack

### Server
 - ASP.net Core 2.1로 제작되었습니다.
 - MongoDB를 이용하여 데이터베이스를 설계하였습니다.
 - JWT 토큰과 localStorage를 이용하여 로그인 세션유지를 하였습니다.

### Client
- 자바스크립트(ES2015+), Vue.JS를 기본으로 제작하였습니다.
- 타입스크립트를 이용하여 엄격한 타입을 적용하였습니다.
	- [vue-class-component](https://github.com/vuejs/vue-class-component)
	- [vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators)
	- [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
- Vuex 라이브러리를 사용한 Flux 아키텍처 기반 설계를 하였습니다.
- Less CSS 전처리기를 적용하였습니다.
- e-chart를 이용하여 설문 결과를 시각화시켜 보여줍니다. (Pie 차트, Bar 차트)

## Feature
- 설문지를 작성할 수 있습니다.
- 작성중이던 설문지를 이어서 작성할 수 있습니다.
- **드래그 앤 드랍**으로 작성 중인 설문지의 질문 항목의 순서를 변경할 수 있습니다.
- 주소 형태로 설문지를 배포할 수 있습니다.
- 설문지의 답변 내용을 사용자 별로 자세히 조회할 수 있습니다.
- 설문지의 답변 유형을 **예/아니오**, **한 개 선택**, **여러개 선택** 중 선택할 수 있습니다.

## Account
id: admin
pw: 1234

## Version Control
- Client, Server의 GIT Repository를 구분하여 독립적인 관리를 하였습니다.

## Epilogue
프로젝트 완성의 목적이 아니라 **vue**와 **vuex**, **typescript** 및 **ASP.net**의 숙달, 그리고 스타일 가이드에 맞춘 코드 구현이 목적인 프로젝트여서 들인 시간에 비해 전체적인 스타일 및 기능 구현의 완성도가 높지는 않습니다. 

기능의 추가나 테크닉보다는 코드의 가독성 및 재사용성을 많이 신경써서 작업하였습니다. 
  