### <span style="color:#ffd33d"> 아래 convention은 2024.04.09일 이후 push되는 모든 nest.js가 지켜야 하는 규칙이다.
 </span> <br>

## 함수 & 메서드 규칙
1. do some thing을 규칙을 사용한다.  `ex) getUser, deleteUser()`
2. camelCase를 사용한다.
3. 메서드인 경우 class 명이 중복해서 들어갈 필요 없다.(단 더 직관적인 변수를 만들기 위해서는 사용가능) <br><br>
    A.  일반적인 예시 `ex) class UserService인 경우` 
    ``` javascript
    class UserService {
    /* UserService는 User에 관한 서비스, User가 중복해서 들어갈 필요x */
    getUserSettings(event) { 
        // ...
    }

    /* `userService.getSettings()`로 사용하는 것이 효율적 */
    getSettings(event) {  
        // ...
    }
    } 
    ```
    
    B. 구분하기 위해서 사용가능 `ex) CommentsService 댓글과 대댓글` 
    ``` javascript
    class CommentsService{
    
        createComment(){// 댓글을 생성
            // ...
        } 
        createReplyComment(){// 대댓글 생성
            // ...
        } 
    }

   
    ``` 
    C. 반환하는 값이 복수형일때 
    ``` javascript
    class PostUseCase {
        getPostsByEmail(): Promise<PostModel[]>
        {}

    }
    ```

4. A/HC/LC 패턴 적용
    ```
    prefix? + action (A) + high context (HC) + low context? (LC)
    ```
    |Name|prefix|Action|Hight context|low context|
    |----|:------:|:----:|:-----------:|:---------:|
    |getUser|(x)|User||
    |getUserMessage|(x)|get|User|Message|
    |shouldDisplayMessage|should|Display|Message|
    |isPaymentEnabled|is|Enabled|Payment|
5. bool값을 반환한다면 (true 또는 false를 반환한다면)'has'또는 'is'를 제일 앞에 붙이자



## 클래스 규칙
1. 명사만 사용한다
2. PascalCase를 사용한다.
3. 파일 1개에 1개에 클래스만 사용한다. (단 특정 클래스에서만 사용될 Enum은 동일한 파일안에 정의 가능) <br>
    A. 파일 명은 클래스명이어야 한다. ex) name.type.ts 형식 


## 변수 구칙
1. 타입이 bool이라면 맨 앞에 'is'를 붙이지
## 상수변수  규칙

