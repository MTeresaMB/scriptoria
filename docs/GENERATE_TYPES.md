# Generar Tipos de TypeScript desde Supabase

## Opción 1: Usando npx (Recomendado - No requiere instalación)

1. Obtén tu **Project ID** de Supabase:
   - Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
   - Ve a Settings → General
   - Copia el **Reference ID** (es tu Project ID)

2. Actualiza el script en `package.json`:

   ```json
   "generate:types": "npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/database.ts"
   ```

3. **Primero, autentícate con Supabase** (solo la primera vez):

   ```bash
   npx -y supabase login
   ``
   Esto abrirá tu navegador para autenticarte.

4. Ejecuta el comando

   ```bash
   npm run generate:types
   ```

   **Nota:** El flag `-y` en el script acepta automáticamente la instalación de paquetes.

## Opción 2: Instalar Supabase CLI con Scoop (Windows)

1. Instala Scoop si no lo tienes:

   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. Instala Supabase CLI:

   ```bash
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

3. Inicia sesión:

   ```bash
   supabase login
   ```

4. Genera los tipos:

   ```bash
   supabase gen types typescript --project-id TU_PROJECT_ID > src/types/database.ts
   ```

## Opción 3: Descargar binario directamente

1. Descarga el binario desde: <https://github.com/supabase/cli/releases>
2. Extrae y añade a tu PATH
3. Ejecuta el comando de generación

## Nota Importante

- Reemplaza `TU_PROJECT_ID` con tu Project ID real
- Ejecuta este comando cada vez que añadas o modifiques tablas en Supabase
- El archivo `src/types/database.ts` se sobrescribirá con los nuevos tipos
