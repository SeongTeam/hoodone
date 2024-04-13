## useCase 사용 이유
1. "Circular Dependency(순환 종속성)"를 피하기 위해서 (와전하게는 할 수 없었다)
2. service에 집중인적인 기능을 추가해서 관라하기 위해
3. 계층분리를 통해서 service와 controller 2개에 치중되지 않도록 하기 위해 

## useCase
1. controller에서 호출하여서 사용한다
2. 다른 module에서 import할때 사용된다.
3. 최대한 Exception 로직 정의한다. 

## service
1. 핵심적인 기능을 정의한다. 
2. DB에 관한 기능을 정의한다. 
3. 서드파티 사용치 최대한 service에서 사용한다.
4. service에서 QureyRunner을 이용한 트렌잭션을 관리한다.
5. Exception 로직 사용을 지양한다. (DB의 에러가 그대로 노출되어서 보안에 취약한 정보가 client에게 보내질 가능성이 있다)

useCase: controller와 service 중간에서 의존성을 분리하기 위해 사용
계층을 분리하기 위해, useCase만을 공유 시켜서 핵심 로직인 service 파일 보호
추후 변경이 있을시 service와 useCase만을 관리하도록

