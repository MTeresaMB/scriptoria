# Supabase Storage Setup

Para que la subida de imágenes funcione correctamente en manuscritos y personajes, necesitas crear los siguientes buckets en Supabase Storage.

## Opción 1: Desde el Dashboard de Supabase

1. Entra en tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **Storage** en el menú lateral
3. Haz clic en **New bucket**
4. Crea estos dos buckets:

### Bucket: `manuscript-images`
- **Name**: `manuscript-images`
- **Public bucket**: ✓ (marcado) — para que las URLs de portada sean accesibles públicamente

### Bucket: `character-images`
- **Name**: `character-images`
- **Public bucket**: ✓ (marcado) — para que las fotos de personajes sean accesibles

## Opción 2: SQL (Supabase SQL Editor)

Ejecuta el siguiente SQL en el **SQL Editor** de tu proyecto:

```sql
-- Crear bucket para imágenes de manuscritos (portadas)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manuscript-images',
  'manuscript-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Crear bucket para imágenes de personajes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'character-images',
  'character-images',
  true,
  5242880,  -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para permitir subida autenticada
CREATE POLICY "Users can upload manuscript images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'manuscript-images');

CREATE POLICY "Public read for manuscript images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'manuscript-images');

CREATE POLICY "Users can upload character images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'character-images');

CREATE POLICY "Public read for character images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'character-images');
```

## Nota

Si los buckets no existen, la app guardará el nombre del archivo como fallback (comportamiento anterior). Crear los buckets permite subir imágenes reales y obtener URLs públicas.
