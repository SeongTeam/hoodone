# Overview

This directory contains shared code and resources used by both the backend and frontend projects of the Hoodone application.

## Directory Structure

- `response-dto/`: Contains the Data Transfer Object (DTO) classes for API responses.
  - `auth-api-response.dto.ts`: DTO class for authentication API responses.
  - `comment-api-response.dto.ts`: DTO class for comment API responses.
  - `post-api-reponse.dto.ts`: DTO class for post API responses.
- `index.ts`: The entry point file that exports all the shared DTOs.
- `package.json`: The configuration file for the `hoodone-shared` package.
- `tsconfig.json`: The TypeScript configuration file for the `shared` directory.

## Usage

The `hoodone-shared` package is used by both the backend and frontend projects to share common code and resources.

### Backend Usage

In the backend project (`back/main_sever`), the `hoodone-shared` package is linked using `npm link`. To use the shared DTOs in the backend code, import them from the `hoodone-shared` package:

```typescript
import { AuthApiResponseDto } from "hoodone-shared";
```

# Development

When making changes to the shared code in the `shared` directory, you need to rebuild the package and update the links in the backend and frontend projects.

1. Make the necessary changes to the code in the `shared` directory.

2. Rebuild the `hoodone-shared` package by running the following command in the `shared` directory:

```bash
npm run build
```

3. Update the links in the backend and frontend projects by running the following command in their respective directories:

```bash
npm link hoodone-shared
```

4. Restart the development servers of the backend and frontend projects to reflect the changes.

# Notes

- The `hoodone-shared` package is not published to the npm registry. It is intended for internal use within the Hoodone application.

- Make sure to keep the shared code and DTOs generic and reusable across both the backend and frontend projects.

- When adding new files or directories to the `shared` directory, update the `index.ts` file to export the new additions.
