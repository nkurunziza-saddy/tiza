# luu

luu is a mini library system that provides a web interface and a desktop application for managing library resources. It includes features like book management, user management, and lending functionalities.

## Contributions

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## Code Structure

The codebase is organized into the following main directories:

- `apps/`: Contains the web and desktop applications.
- `libs/`: Contains shared libraries and components.
- `packages/`: Contains reusable packages and utilities.

- For starting the desktop application, run:

  ```bash
  cd apps/desktop
  pnpm install
  pnpm run db:init
  pnpm run tauri dev
  ```
