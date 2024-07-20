# Overview

This directory contains shared code and resources used by both the backend and frontend projects of the Hoodone application.

## Directory Structure

- `enums/` : Contains The Enum data.
- `response-dto/`: Contains the Data Transfer Object (DTO) classes for API responses.
- `index.ts`: The entry point file that exports all the shared DTOs.
- `package.json`: The configuration file for the `hoodone-shared` package.
- `tsconfig.json`: The TypeScript configuration file for the `shared` directory.

## Usage

The `shared` project is used by both the backend and frontend projects to share common code and resources.

This project is shared by Project references of TS. 

Both Back and Front set alias path of `shared` as `@/sharedModule`, So just import common resource by using alais path.

### Example
```typescript
import { AuthApiResponseDto } from '@/sharedModule/response-dto/auth-api-response.dto';
```


# Notes

- Make sure to keep the shared code and DTOs generic and reusable across both the backend and frontend projects.

- When adding new files or directories to the `shared` directory, update the `index.ts` file to export the new additions.

