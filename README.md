# Concept Sketch

### Concept

- Test-Driven-Development(JEST)
- atomic

### Function

- 다크모드
- 할 일 todo
    - 카테고리
- 공부시간 기록
    - 랭킹
- 알림
- 소셜 로그인

# 와이어 프레임

[Figma Link](https://www.figma.com/design/FvVKjj38B4qAYZgnN3ygKl/ExtremeTodo-wireframe)

# 기능명세

### 전체

1. 뽀모도로, 쉬는시간 설정 값 lcoalStorage에 저장
2. unmount될 때 현재 뽀모도로 진행시간 값을 localStorage에 저장

*로그인을 안했을 때*

1. 랭킹 기능 사용 불가(집계에서도 제외)
2. DB가 아닌 localstorage에 할 일 저장
3. 당일에 한 일

### 타이머

1. 현재시간
2. 뽀모도로 집중시간 
20, 25, 30, 35, 40 분 
3. 쉬는시간 5, 10, 15 분 
4. 일시정지/재개 - 쉬는 시간 추가 
5. 누적 공부시간(뽀모도로의 진행에 따라 자동 측정) 
6. 누적 쉬는 시간(자동 측정)
7. 쉬는 시간 끝나면 뽀모도로 자동 재개

### 할일

1. 할 일 작성
    1. 내용, 소요시간, 카테고리, 완료여부(false)
2. 완료했을 때 done = true/false
    1. DONE 완료된 할일
    2. TODO 해야할 일 
3. 할 일 수정
    1. 내용, 소요시간, 카테고리
4. 할 일 삭제
5. 할 일 불러오기
6. 소요시간을 반영한 진행도 표시 - 5분단위
ex) 60분 소요 태스크를 5분 했을 경우 8.3% 진행
7. 뽀모도로 만료 시 현재 할 일 자동삭제
8. 현재 할 일 자동삭제 시 다음 할 일 자동으로 현재 할 일 목록으로 반영
9. 순서 변경 하기

### 추이

1. 일간 추이 :: 어제 내 공부시간 vs 오늘 내 공부시간 +-
2. 주간 추이 :: 지난 주 vs 이번 주 내 공부시간 +-
3. 월간 추이 :: 지난 달 내 공부시간 vs 이번 달 내 공부시간 +-

작동방식 : 

1. 새벽 5시가 땡 하고 되면 `오늘 데이터`는 어제 데이터에 저장
2. `오늘 데이터`는 이번 주 데이터에 더해주기(누적 값)
3. `오늘 데이터`는 이번 달 데이터에 더해주기(누적 값)
4. 일요일/월요일의 새벽 5시가 되면 `이번 주 데이터`는 `지난 주 데이터`
5. 이번 주 데이터는 다시 초기화
6. 01일 새벽 5시가 되면 `이번 달 데이터`는 `지난 달 데이터`로 저장되고
7. 이번 달 데이터는 다시 초기화

### 설정

- 라이트모드/다크모드
- 의지박약박멸모드 ON/OFF
- 초기화

### 소셜로그인

- 로그인(회원가입 겸)
- 로그아웃
- 회원탈퇴(?)

# 사용 스택

- 스택
    
    ### 언어
    
    - Typescript
    
    ### 스택
    
    - React
    - React Beautiful DnD
    - RxJS
    - Axios
    - Emotion
    - apexcharts
    - date-fns
    - react-popper
    - react-day-picker
    - @tanstack/react-query
    
    ### 테스트 툴
    
    - JEST
    - RTL
    
    ### 협업 툴
    
    - github
    - notion

# 코드 컨벤션

- 컨벤션
    1. **관심사분리 적용**
    2. Compound-Component 패턴을 적용한다.
    e.g. [https://velog.io/@yesbb/객체지향의-관점으로-바라본-리액트-고급-패턴-Compound-component-Render-props](https://velog.io/@yesbb/%EA%B0%9D%EC%B2%B4%EC%A7%80%ED%96%A5%EC%9D%98-%EA%B4%80%EC%A0%90%EC%9C%BC%EB%A1%9C-%EB%B0%94%EB%9D%BC%EB%B3%B8-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B3%A0%EA%B8%89-%ED%8C%A8%ED%84%B4-Compound-component-Render-props)
        
        e.g. [https://fe-developers.kakaoent.com/2022/220731-composition-component/#3-2-메인-컴포넌트-구현](https://fe-developers.kakaoent.com/2022/220731-composition-component/#3-2-%EB%A9%94%EC%9D%B8-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EA%B5%AC%ED%98%84)
        
    3. 고차 컴포넌트
        1. Render props 패턴을 적용한다.
        e.g. [https://velog.io/@yesbb/객체지향의-관점으로-바라본-리액트-고급-패턴-Compound-component-Render-props](https://velog.io/@yesbb/%EA%B0%9D%EC%B2%B4%EC%A7%80%ED%96%A5%EC%9D%98-%EA%B4%80%EC%A0%90%EC%9C%BC%EB%A1%9C-%EB%B0%94%EB%9D%BC%EB%B3%B8-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B3%A0%EA%B8%89-%ED%8C%A8%ED%84%B4-Compound-component-Render-props)
    4. 아토믹 패턴 적용
        
        https://fe-developers.kakaoent.com/2022/220505-how-page-part-use-atomic-design-system/
        
    5. Interface는 I를 붙인다.
    6. 컴포넌트, Class는 PascalCase
        1. 컴포넌트는 파일 이름도 PascalCase
        2. 컴포넌트 이외의 파일은 camelCase
    7. 상수는 UPPERCASE
        1. 일반 변수, props, 함수는 camelCase
    8. 커스텀 훅은 앞에 ‘use’ 사용
    9. Atom 요소는 뒤에 Atom 붙이기 ex)`ContainerAtom`
    10. 하나의 컴포넌트 내에 동일한 디자인 단위가 2개 이상 사용되면 그 다음 단계의 디자인 단위로 분류한다. ex) atom이 2개 이상 사용되면 molecule로, molecule이 2개 이상 사용되면 organism으로 분류한다.
    11. 반복되어 import되는 이름을 줄이기 위해 각 폴더에 index.js 파일을 만든다.
        - 적용방법
            
            ```jsx
            // pages/Classroom.jsx
            import React from 'react'
            import Gamestart from '../../components/GameStart';
            import { useNavigate } from "react-router-dom";
            
            function Classroom() {
              const navigate = useNavigate();
              return (
                <Gamestart roomname="classroom"></Gamestart>
              )
            }
            
            export default Classroom;
            ```
            
            ```jsx
            // pages/index.jsx
            export { default as Title } from "./title";
            export { default as MyRoom } from "./myroom";
            export { default as Schoolzone } from "./schoolzone";
            ```
            
            ```jsx
            // App.js
            import {
              Classroom,
              Lib,
              MyRoom,
              School,
              Schoolcafeteria,
              Schoolzone,
              Scienceroom,
              Title,
              Toilet,
              Tutorial,
            } from "./pages";
            ```
            
    
    ### 테스트 코드 컨벤션
    
    1. Describe - Context - It 패턴으로 작성한다.
        1. 셋업 문제로 Describe - Describe - It 로 작성한다. 즉, 두 번째 Describe가 Context 역할이다.
    2. 1번 Describe는 최상위 항목의 이름을 표기한다.
        1. 예1) Welcome.tsx ⇒ 1번 Describe는 ‘Welcome’으로 한다.
        2. 예2) useExample.ts ⇒ 1번 Describe는 ‘useExample’로 한다.
    3. 2번 Describe(Context)는 분기, 상황을 표기한다.
        1. 예1) Welcome.tsx ⇒ 로그인 했을 때와 안 했을 때를 분기 ⇒ ‘로그인을 한 경우’, ‘로그인을 안 했을 경우’
        2. 예2) 비동기 처리 ⇒ ‘요청이 실패 한다면’
    4. 3번 It은 최종적인 행동, 결과를 설명한다.
        1. 예1) Welcome.tsx ⇒ ‘로그인 버튼이 렌더링 한다.’, ‘로그아웃 버튼과 셋팅 버튼을 렌더링 한다.’
    5. 모든 구문은 명사 제외하고 한글로 작성하고, 하나의 Describe - Context -It을 이어서 읽었을 때 깔끔한 문장이 될 수 있도록 작성한다.
    6. test 파일은 src/test 안에 src dependency와 동일하게 작성
        
        ```jsx
        L test
            L atoms
                L BasicBtnAtom.test.ts
            L components
                L Welcome.test.ts
        ```
        

# 화면 구성

https://www.figma.com/design/FvVKjj38B4qAYZgnN3ygKl/ExtremeTodo-wireframe?node-id=0-1

### 프로토타입(상호작용 가능)

https://www.figma.com/proto/FvVKjj38B4qAYZgnN3ygKl/ExtremeTodo-wireframe?page-id=0%3A1&node-id=1%3A5&viewport=486%2C377%2C0.26&scaling=scale-down&starting-point-node-id=1%3A5

# 모듈

# 할 일

### 첫 번째 페이지

- 로그인 했을 때 / 안 했을 때 (동규)
    - 했을 때 → 로그아웃 / 설정
    - 안 했을 때 → 구글 로그인 버튼

### 두 번째 페이지

- 투 두(희정)
    - 시간 지남에 따라서 완료 상태 바로 표현
    - 휴식 시간 화면 구현
        - 저희 Extreme Todo는 Extreme이라는 특별한 모드가 있습니다. 지금 막 가입을 하셨다면 기본적으로 켜져있습니다.
        - 이 모드일 때 쉬는시간을 지키 않는 경우 해당 Todo가 삭제되는 패널티가 있습니다.
        - todo가 끝나지 않았고, 뽀모도로 쉬는시간이 되었을 때 → 휴식(중) 표시
        - todo가 끝났을 때 → 다음 todo 표시 (시작버튼)
        
        | Mode | Extreme | Normal |
        | --- | --- | --- |
        | todo가 끝났을 때 | 패널티 없음 | 패널티 없음 |
        | todo가 끝나지 않았고, 뽀모도로 쉬는시간이 되었을 때 | 쉬는 시간 안지키면 진행 중인 todo 강제 SKIP의 패널티 부여 | 패널티 없음 |
- 시계(희정)
- add Todo 팝업 (모달 - 동규)
    - 달력구현
    - 카테고리 키보드 입력
    - 뽀모도로 인터벌 설정 (소요시간)
- TodoList 팝업 (모달 - 동규)
    - DnD로 Todo 순서 수정
    - 편집 기능
    - 날짜별로 분류

### 세 번째 페이지

- 집중 시간 추이(희정)
    - 하루, 일주일, 한 달 전 집중 시간과 비교
- 카테고리별 랭킹(희정)
    - 선택한 카테고리에 대해 다른 사람에 비해 얼마나 집중했는지 가시화
