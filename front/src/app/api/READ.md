hoodone backend 서버 API를 호출하는 기능만 존재해야 하는 폴더



중요:
본문을 읽을 때 사용되는 메서드는 딱 하나만 사용할 수 있습니다.

response.text()를 사용해 응답을 얻었다면 본문의 콘텐츠는 모두 처리 된 상태이기 때문에 response.json()은 동작하지 않습니다.

``` script
let text = await response.text(); // 응답 본문이 소비됩니다.
let parsed = await response.json(); // 실패
```