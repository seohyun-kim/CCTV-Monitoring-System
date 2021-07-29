# CCTV-Monitoring-System
 CCTV-Monitoring-System (가상 데이터)
 
#### project ver.1  (2021-07-05) -----[ver.1 DB 블로그 이동](https://seohyun-kim.github.io/CCTV_ver_1/) /  [ver.1 app 블로그 이동](https://seohyun-kim.github.io/CCTV_ver_1_app/)
    버튼 클릭시 ajax를 이용해 페이지 새로고침 없이 데이터 일부 변경(DB재 접근)
#### project ver.2.1  (2021-07-10) ----- [ver.2.1 블로그 이동](https://seohyun-kim.github.io/CCTV_ver.2.1/)
    사용자로부터 날짜(기간) 입력받아 기간 내 차량, 사람 수 단순합 조회, 기간 내 전체 데이터 조회
  
#### project ver.2.2  (2021-07-15) ----- [ver.2.2 블로그 이동](https://seohyun-kim.github.io/CCTV_ver.2.2/)  

    Ajax Fetch API로 수정 / 조회한 데이터 chart로 출력 추가 / 로그인 기능 추가 / session 관리  
    
#### project ver.3 (2021-07-22) ----- [ver.3 블로그 이동](https://seohyun-kim.github.io/CCTV-ver.3/)  

``` 
백엔드에서 감시 중 데이터 급증 시 사용자에게 알람기능 제공
```

#### project ver.3.1  (2021-07-29)  ----- [ver.3.1 FeedBack](https://seohyun-kim.github.io/CCTV.ver.3.1(feedback)/)  / [ver.3 그누보드 적용](https://seohyun-kim.github.io/gnuboard/)
```
trigger query 수정 / mysql-events 사용
그누보드 게시판 오픈소스 적용해보고 호환성 체크  
```


<br />  

📌 목표  (2021-08-12)

```
기존 코드 수정
 - trigger query를 최근 데이터를 가지고 처리하도록 수정
 - 일별, 요일별, 월간, 등등 통계치에 대한 대표값을 보여주는 테이블들 생성
 - 스케줄러 대신 mysql-events로 처리하는 방법으로 수정
 
실제 데이터로 페이지 설계
 - 로그인 세션, 데이터 분석 등등
 
영상팀에서 호출할 수 있는 API 생성
 - 인증절차 삽입
 
(AWS없이 리눅스 서버에 구축하게 될 예정)
```

   
