# SGD Académico · Sistema de Gestión Documental

Aplicación web para organizar y consultar el archivo documental académico de las gestiones **2023, 2024 y 2025**. Cada gestión agrupa cuatro módulos: **Dictámenes**, **Programaciones Especiales**, **Correspondencia Recibida** y **Auxiliatura**. La correspondencia se divide en **Mesa de Exámenes** y **Cursos de Verano**.

## Características

- Panel de control con indicadores, distribución por gestión y módulo, y actividad reciente.
- Navegación por gestión y módulo desde una barra lateral responsive.
- Alta, edición y eliminación de registros con validación de formulario.
- Búsqueda independiente por carrera, código y descripción.
- Ordenamiento por columnas y paginación configurable.
- Tabla de escritorio y tarjetas en móvil.
- Exportación a Word (`.docx`) del listado filtrado, con encabezado institucional, fecha de generación y numeración de páginas.
- Persistencia local automática en el navegador; no requiere servidor ni base de datos.
- Datos de demostración precargados para las tres gestiones.

## Tecnologías

- React 19 + TypeScript
- Vite 8
- React Router 7
- `docx` + `file-saver` para la exportación
- `lucide-react` para la iconografía
- Inter Variable como tipografía
- CSS propio con diseño responsive

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Ejecución

```bash
npm install
npm run dev
```

Abre la dirección que muestra Vite (por defecto `http://localhost:5173`).

### Compilación para producción

```bash
npm run build
npm run preview
```

El resultado se genera en `dist/`.

## Rutas principales

| Ruta | Contenido |
| --- | --- |
| `/` | Panel de control |
| `/gestion/:gestion` | Resumen de una gestión |
| `/gestion/:gestion/correspondencia` | Selección Mesa de Exámenes / Cursos de Verano |
| `/gestion/:gestion/correspondencia/:tipo` | Tabla de correspondencia |
| `/gestion/:gestion/:modulo` | Tabla de un módulo |

Gestiones válidas: `2023`, `2024`, `2025`. Módulos: `dictamenes`, `programaciones`, `correspondencia`, `auxiliatura`.

## Datos y persistencia

Los registros se guardan en `localStorage` con la clave `sgd-academico.records.v1`. En el primer inicio se cargan los datos de demostración definidos en `src/data/seed.ts`.

Para restablecer el archivo desde el navegador:

1. Abre las herramientas de desarrollo (F12).
2. En la consola ejecuta `localStorage.removeItem("sgd-academico.records.v1")`.
3. Recarga la página.

Los datos son propios de cada navegador y dispositivo. Para compartir la información entre usuarios se requeriría conectar una API o base de datos.

## Personalización

- **Institución:** edita `INSTITUTION` en `src/types.ts` (nombre, vicerrectorado, oficina y sistema). Estos datos aparecen en la interfaz y en los reportes Word.
- **Carreras:** edita el arreglo `CAREERS` en `src/types.ts`.
- **Módulos y tipos:** nombres, descripciones y colores en `MODULE_META` y `TIPO_META` de `src/types.ts`.
- **Datos iniciales:** modifica o amplía `src/data/seed.ts`.
- **Diseño:** variables de color y tipografía en `src/styles/base.css`; estilos por área en `src/styles/`.

## Exportación Word

Cada módulo incluye el botón **Exportar Word**. El documento generado contiene:

- Encabezado institucional repetido en cada página.
- `GESTIÓN: <año>` y `TIPO: <módulo o tipo de correspondencia>`.
- Tabla con Carrera, Nro. de Dictamen o Código y Descripción.
- Cantidad de registros y aviso cuando se aplicaron filtros.
- Fecha de generación y `Página X de Y` en el pie.

La exportación usa los registros que cumplen los filtros activos y respeta el orden actual de la tabla.

## Despliegue

La aplicación usa `BrowserRouter`. Al publicar la carpeta `dist/` en un hosting estático, configura una redirección de todas las rutas hacia `index.html` para evitar errores 404 al recargar.

Ejemplos:

- **Netlify:** crea `public/_redirects` con `/* /index.html 200`.
- **Vercel:** agrega una reescritura de `/(.*)` a `/index.html`.
- **Nginx:** usa `try_files $uri $uri/ /index.html;`.

## Estructura

```text
src/
  components/   Componentes de interfaz reutilizables
  context/      Estado de registros y notificaciones
  data/         Datos de demostración
  hooks/        Lógica de filtros, orden y paginación
  lib/          Formato de fechas, exportación Word y utilidades
  pages/        Vistas principales
  styles/       Hojas de estilo por área
  types.ts      Tipos, metadatos y configuración institucional
```
