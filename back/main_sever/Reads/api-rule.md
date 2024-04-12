의미를 바로 알아볼 수 있도록 작성하고, 소문자를 사용한다.
❌ GET /users/writing
❌ GET /users/Post-Comments
⭕ GET /users/post-comments

URI가 길어지는 경우 언더바(_) 대신 하이픈(-)을 사용한다.
❌ GET /users/profile_image
⭕ GET /users/profile-image

마지막에 슬래시(/)를 포함하지 않는다.
후행 슬래시(/)는 의미가 전혀 없고 혼란을 야기할 수 있다.
❌ GET /users/
⭕ GET /users

리소스에 대한 행위를 HTTP Method로 표현한다.

URI에 HTTP Method가 포함되서는 안된다.
❌ get/users/
⭕ GET /users/
resource는 동사가 포함되서는 안되고 명사를 사용한다.
❌ GET /users/show/1
⭕ GET /users/1
파일 확장자는 URI에 포함시키지 않는다.
❌ GET /users/photo.jpg
⭕ GET /users/photo (이때, payload의 포맷은 headers에 accept를 사용한다.)

URI 사이에 연관 관계가 있는 경우 /리소스/고유ID/관계 있는 리소스 순으로 작성한다.
❌ GET /users/profile/{user_id}
⭕ GET /users/{user_id}/profile

URI에 작성되는 영어를 복수형으로 작성한다.
❌ GET /product
⭕ GET /products

