# SvelteKit Project with InversifyJS, TailwindCSS, and shadcn-svelte

This project is a SvelteKit application with dependency injection using InversifyJS, styled with TailwindCSS and shadcn-svelte components.

## Features

- **SvelteKit**: Full-stack web framework with Vite
- **InversifyJS**: Dependency injection container for service management
- **TailwindCSS**: Utility-first CSS framework
- **shadcn-svelte**: High-quality Svelte components built with bits-ui and Tailwind
- **TypeScript**: Type-safe development
- **Mock Login Flow**: Authentication system using Svelte stores

## Project Structure

```
src/
├── lib/
│   ├── components/ui/    # shadcn-svelte components
│   ├── di/               # InversifyJS container configuration
│   ├── services/         # Business logic services
│   ├── stores/           # Svelte stores with DI integration
│   ├── types/            # TypeScript interfaces and symbols
│   └── utils/            # Utility functions
├── routes/               # SvelteKit routes
└── app.html              # HTML template
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Mock Login Flow

The application includes a mock authentication system:

- **Login**: Use any email and password combination
- **Session**: Persists using localStorage
- **Dependency Injection**: AuthService is managed through InversifyJS container
- **State Management**: Uses Svelte stores that integrate with DI container

### Login Form Features

- Email and password input validation
- Loading state during authentication
- Error handling and display
- User profile display after login
- Logout functionality

## Dependency Injection with InversifyJS

Services are registered in `src/lib/di/container.ts`:

```typescript
import { diContainer } from '$lib/di/container';
import { TYPES } from '$lib/types/symbols';

// Get service from container
const authService = diContainer.get<IAuthService>(TYPES.IAuthService);
```

### Available Services

- **IAuthService**: Handles authentication operations (login, logout, get current user)

## Adding New UI Components

This project uses bits-ui for shadcn-svelte components. To add new components:

1. Install the component from bits-ui
2. Create wrapper in `src/lib/components/ui/[component-name]/`
3. Export from index.ts

## Technologies Used

- **SvelteKit**: Meta-framework for Svelte
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **InversifyJS**: Dependency injection
- **reflect-metadata**: Decorator metadata for DI
- **TailwindCSS**: Styling
- **bits-ui**: Svelte component primitives
- **clsx & tailwind-merge**: Class name utilities

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type-check Svelte components
- `npm run check:watch` - Watch mode for type checking

## License

ISC