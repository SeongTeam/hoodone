# 댓글 기능


1. post 안에 모든 댓글을 가지자 (모든 댓글이란 댓글 대댓글)
2. 모든 댓글을 추가와 삭제할때 댓글 카운트 변동
3. post 상세 보기를 할 떄 댓글을 가지고 오기 => 서버에서 댓글과 대댓글을 정려해서 보내주기 


### 구현된 기능
1. 댓글 생성 
    - author(즉 user)와 관계 형성
    - post에 댓글이 one to many로 관계 형성
    - post.commentCount + 1
2. 대댓글 상성
    - author(즉 user)와 관계 형성
    - post에 대댓글이 one to many로 관계 형성
    - post.commentCount + 1
    - 부모 댓글(대댓글을 단 댓글을 뜻합니다.)에 대댓글 ID 저장



