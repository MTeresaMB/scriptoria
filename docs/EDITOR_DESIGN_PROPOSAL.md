# Propuesta de Diseño del Editor

## 🎯 Filosofía de Diseño

El editor debe ser **minimalista pero potente**, enfocándose en la experiencia de escritura mientras mantiene todas las herramientas necesarias accesibles sin distracciones.

---

## 📐 Estructura Visual Propuesta

### 1. **Layout Principal**

```
┌─────────────────────────────────────────────────────────────┐
│  [Header Compacto]                                           │
│  [Chapter Title] [Status] [Stats] [Save] [Settings] [Full]   │
├─────────────────────────────────────────────────────────────┤
│  [Toolbar Contextual - Solo cuando se necesita]             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│              [Área de Escritura Centrada]                     │
│              (con opciones de ancho configurable)             │
│                                                               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  [Footer Mínimo: Stats + Shortcuts]                          │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Modos de Visualización**

#### **Modo Normal**
- Header compacto con información esencial
- Toolbar contextual (aparece al seleccionar texto)
- Sidebar colapsable a la derecha
- Footer con estadísticas básicas

#### **Modo Enfocado (Focus Mode)**
- Header minimalista (solo título y save)
- Sin toolbar visible (aparece flotante al seleccionar)
- Sin sidebar
- Fondo más oscuro para reducir fatiga visual

#### **Modo Distracción Libre (Distraction-Free)**
- Pantalla completa
- Solo texto centrado
- Header flotante que aparece al hacer hover
- Sin elementos de UI visibles

#### **Modo Lectura (Reading Mode)**
- Similar a un libro/artículo
- Tipografía optimizada para lectura
- Sin elementos de edición
- Navegación por capítulos visible

---

## 🎨 Mejoras de Diseño Propuestas

### 1. **Header Inteligente**

**Características:**
- **Compacto por defecto**: Solo muestra título y botón de guardar
- **Expandible**: Al hacer hover o click, muestra más opciones
- **Contextual**: Cambia según el modo activo
- **Estados visuales claros**: 
  - Guardado: ✓ verde
  - Sin guardar: ⚠️ amarillo parpadeante
  - Guardando: spinner

**Layout:**
```
[← Capítulo Anterior] [Título del Capítulo] [Capítulo Siguiente →]
[Status Badge] [Word Count] [Reading Time] [Last Saved: 2m ago]
[Search] [Info] [Export] [Settings] [Focus] [Save]
```

### 2. **Toolbar Contextual Flotante**

**Concepto:**
- No visible por defecto
- Aparece al seleccionar texto (como Medium, Notion)
- Se posiciona cerca del texto seleccionado
- Incluye solo acciones relevantes al contexto

**Acciones:**
- Formato básico (Bold, Italic)
- Enlaces
- Comentarios/Notas (futuro)
- Resaltar

### 3. **Sidebar Mejorada**

**Organización:**
```
┌─────────────────────┐
│ Chapter Info    [×] │
├─────────────────────┤
│ 📝 Info Básica      │
│   - Título          │
│   - Número          │
│   - Status          │
│                     │
│ 📊 Estadísticas    │
│   - Palabras        │
│   - Caracteres      │
│   - Tiempo lectura  │
│                     │
│ 📈 Análisis        │
│   - Legibilidad     │
│   - Diálogo/Narraci │
│                     │
│ 🔗 Navegación      │
│   [← Anterior]      │
│   [Siguiente →]    │
│                     │
│ 📚 Manuscrito      │
│   - Ver manuscrito  │
│   - Ver todos       │
└─────────────────────┘
```

**Características:**
- Colapsable con animación suave
- Pestañas para organizar información
- Resizable (drag para cambiar ancho)
- Persistencia de estado

### 4. **Área de Escritura Mejorada**

**Mejoras:**
- **Línea guía de escritura**: Línea horizontal sutil que sigue el cursor
- **Márgenes inteligentes**: Se ajustan según el ancho de columna
- **Tipografía mejorada**: 
  - Fuente serif para modo lectura
  - Fuente sans-serif para edición
  - Espaciado de línea configurable
- **Tema de color personalizable**:
  - Modo oscuro (actual)
  - Modo claro
  - Modo sepia (para reducir fatiga)
  - Modo alto contraste

### 5. **Footer Informativo**

**Información mostrada:**
- Estadísticas en tiempo real (palabras, caracteres)
- Indicador de guardado automático
- Atajos de teclado contextuales
- Progreso del capítulo (si hay meta de palabras)

---

## ⚡ Características Adicionales Propuestas

### 1. **Sistema de Comentarios/Notas**
- Agregar notas inline al texto
- Útil para revisiones y recordatorios
- Visualización como badges en el margen

### 2. **Objetivos y Metas**
- Meta de palabras por capítulo
- Barra de progreso visual
- Notificaciones al alcanzar metas

### 3. **Temas y Personalización**
- Múltiples temas de color
- Fuentes personalizables
- Espaciado configurable
- Guardado de preferencias

### 4. **Navegación Mejorada**
- Mini-mapa del documento (como VS Code)
- Navegación por secciones/headings
- Búsqueda avanzada con filtros

### 5. **Análisis Avanzado**
- Análisis de ritmo narrativo
- Detección de repeticiones
- Sugerencias de vocabulario
- Análisis de diálogos vs narración

### 6. **Colaboración (Futuro)**
- Comentarios compartidos
- Sugerencias de edición
- Historial de cambios detallado

---

## 🎯 Prioridades de Implementación

### **Fase 1: Mejoras Core (Alta Prioridad)**
1. ✅ Header compacto e inteligente
2. ✅ Toolbar contextual flotante
3. ✅ Sidebar mejorada con pestañas
4. ✅ Modos de visualización mejorados
5. ✅ Footer informativo

### **Fase 2: Personalización (Media Prioridad)**
1. Temas de color (oscuro, claro, sepia)
2. Fuentes personalizables
3. Configuración de espaciado
4. Persistencia de preferencias

### **Fase 3: Características Avanzadas (Baja Prioridad)**
1. Sistema de comentarios/notas
2. Objetivos y metas
3. Mini-mapa del documento
4. Análisis avanzado

---

## 🔧 Mejoras Técnicas

### 1. **Performance**
- Lazy loading de componentes pesados
- Virtualización para documentos largos
- Debounce en actualizaciones de estadísticas

### 2. **Accesibilidad**
- Navegación completa por teclado
- Soporte para lectores de pantalla
- Contraste mejorado
- Tamaños de fuente escalables

### 3. **Responsive Design**
- Adaptación a tablets
- Modo móvil optimizado (solo lectura/edición básica)

---

## 📱 Comparación con Editores Populares

### **Inspiración de:**
- **Notion**: Toolbar contextual, sidebar organizada
- **Medium**: Editor minimalista, focus en contenido
- **Scrivener**: Organización por secciones, análisis
- **Google Docs**: Colaboración, comentarios
- **Obsidian**: Navegación, búsqueda avanzada

---

## 🎨 Paleta de Colores Propuesta

### **Modo Oscuro (Actual)**
- Fondo: `slate-900`
- Editor: `slate-800`
- Texto: `slate-100`
- Acento: `purple-600`

### **Modo Claro**
- Fondo: `gray-50`
- Editor: `white`
- Texto: `gray-900`
- Acento: `purple-600`

### **Modo Sepia**
- Fondo: `amber-50`
- Editor: `amber-100`
- Texto: `amber-900`
- Acento: `purple-600`

---

## 🚀 Próximos Pasos

1. **Revisar propuesta** con el equipo/usuario
2. **Priorizar características** según necesidades
3. **Crear mockups** de las mejoras principales
4. **Implementar Fase 1** (mejoras core)
5. **Iterar** basado en feedback

---

## 💡 Ideas Adicionales

- **Modo Zen**: Solo texto, sin UI, música ambiente opcional
- **Modo Pomodoro**: Integración con técnica Pomodoro
- **Exportación mejorada**: Preview antes de exportar
- **Plantillas**: Plantillas para diferentes tipos de capítulos
- **Sugerencias inteligentes**: IA para sugerencias de escritura (futuro)
