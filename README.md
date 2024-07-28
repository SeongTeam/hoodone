## Project : Small Quest

A CRUD communiuty where uses can
- enjoy other user's Quest post, 
- evaluate other user's result of Quest
- Create Quest.

Quest is a post which creator request for other user to do small something .

Community is managed based on Quest ticket which user consumes when create Quest and gets when user's result is evaluated to success


## Getting Started
### Requirments
- Node.js
- cloudinary accounts 
- postgres DB

### Installation

1. git clone 

2. Navigate to both the frontend and backend directories: 

3. install npm package

4. rename .env,example to .env and fill in the environment variables in both directories. 
- Backend: Use `.env.local` or `.env.server`. The app uses "cross-env NODE_ENV=..." to reference the appropriate file.
- You can modify the .env file selection in `back/main-server/package.json`.

5. Build the applications:
Backend:

```
back/main-server $ npm run build
```

Frontend:
```
front $ npm run build
```

6. Build the applications:
Backend:
```
back/main-server $ npm run start
```

Frontend:
```
front $ npm run start
```
    
## Technical Stack

### Common
[![Common](https://skillicons.dev/icons?i=ts,git)](https://skillicons.dev)
- TypeScript 
- git

### FrontEnd
[![Common](https://skillicons.dev/icons?i=nextjs,reat,)](https://skillicons.dev)
- Next.js 
- Chakra-UI
- Cloudinary

### Backend 
[![Common](https://skillicons.dev/icons?i=nestjs,)](https://skillicons.dev)

- Nest.js
- TypeORM, 

### DataBase
[![Common](https://skillicons.dev/icons?i=postgresql,)](https://skillicons.dev)

- postgresSQL,

## Deployment
- Hostend on AWS EC2 

## Structure

### Front

```mermaid 
block-beta
    block:FrontEnd:1
        columns 2
        name1{{"Frontend"}}:2
        block:component:2
            columns 2
            cc["client-component"]:1 
            sc["server-component"]:1
        end
        sa["server-action"]:1
        lib["fetch-lib"] :1
        alib["auth-lib"]:2
    end 
```

### Backend

```mermaid
block-beta
    block:Backend:1
        columns 2
        name2{{"Backend"}}:2
        block:NestDecorator:2
            columns 1
            mid["Middleware"]:1
            guard["Guard"]:1
            ic["Interceptor"]:1
            pipe["Pipe"]:1
        end
        block:AppModule:2
            appModule{{"App Module"}}:1
            AM["Auth"]:1
            UM["User"]:1
            PM["Post"]:1
            CM["Comment"]:1
            Etc["etc..."]:1

        end
        TypeORM:2
    end
```