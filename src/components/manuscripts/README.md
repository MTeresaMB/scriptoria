# Manuscripts Components

Estructura optimizada y refactorizada de los componentes de manuscritos siguiendo buenas prácticas de React.

## Estructura de Carpetas

```
manuscripts/
├── components/          # Componentes reutilizables
│   ├── DeleteConfirmModal.tsx
│   └── GenreSelect.tsx
├── hooks/              # Hooks personalizados
│   ├── useGenres.ts
│   └── useManuscriptForm.ts
├── utils/              # Utilidades y helpers
│   └── formatters.ts
├── ManuscriptCard.tsx  # Componente de tarjeta
├── ManuscriptForm.tsx # Formulario de creación/edición
├── ManuscriptsList.tsx # Lista de manuscritos
└── index.ts           # Barrel exports
```

## Componentes

### `ManuscriptCard`

Componente que muestra una tarjeta individual de manuscrito.

- **Props**: `manuscript`, `onEdit`, `onDelete`, `onView`
- **Optimizado**: Usa `React.memo` para evitar re-renders innecesarios
- **Utilidades**: Usa funciones de `utils/formatters.ts`

### `ManuscriptForm`

Formulario para crear y editar manuscritos.

- **Props**: `initialDataForm`, `onSubmit`, `onCancel`
- **Hooks**: Usa `useManuscriptForm` y `useGenres`
- **Componentes**: Usa `GenreSelect` para el selector de géneros

### `ManuscriptsList`

Lista de todos los manuscritos del usuario.

- **Props**: `onCreateNewManuscript`
- **Hooks**: Usa `useManuscripts`
- **Optimizado**: Usa `useCallback` para handlers

## Hooks

### `useGenres`

Hook para cargar géneros desde la base de datos.

```typescript
const { genres, isLoading, error } = useGenres();
```

### `useManuscriptForm`

Hook que maneja toda la lógica del formulario.

```typescript
const { formData, isSubmitting, error, handleInputChange, handleSubmit } = useManuscriptForm({
  initialData,
  onSuccess,
});
```

## Utilidades

### `formatters.ts`

Funciones de formateo:

- `formatDate(date: string)`: Formatea fechas
- `formatWordCount(count: number)`: Formatea contadores de palabras
- `getStatusColor(status: string)`: Obtiene clases CSS para estados
- `calculateProgress(wordCount: number, target?: number)`: Calcula progreso

## Buenas Prácticas Aplicadas

1. **Separación de responsabilidades**: Lógica separada de presentación
2. **Hooks personalizados**: Lógica reutilizable extraída a hooks
3. **Componentes pequeños**: Componentes enfocados en una sola responsabilidad
4. **Optimización**: Uso de `React.memo` y `useCallback` donde es apropiado
5. **Type Safety**: TypeScript estricto en todos los componentes
6. **Barrel Exports**: Exportaciones centralizadas en `index.ts`
