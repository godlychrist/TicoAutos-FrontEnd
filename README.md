# 🏎️ TicoAutos — Frontend

Aplicación web SPA para el marketplace de vehículos **TicoAutos**, construida con **Vue 3** (Composition API) y **Vue Router**. Consume la API REST del backend Laravel para mostrar el catálogo, gestionar vehículos y chatear con vendedores.

> ⚙️ **Backend:** Este frontend se conecta con la API disponible en el repositorio [ticoautos-backend](https://github.com/tu-usuario/ticoautos-backend).

---

## 🛠 Tech Stack

| Tecnología | Versión | Uso |
|---|---|---|
| **Vue.js** | ^3.2 | Framework frontend (SPA) |
| **Vue Router** | ^4.6 | Navegación y guards de autenticación |
| **Axios** | ^1.13 | Cliente HTTP para consumir la API |
| **Vue CLI** | ~5.0 | Build y dev server |
| **Node.js** | LTS | Runtime de JavaScript |

---

## ✅ Requisitos Previos

- **Node.js** (LTS recomendado) → [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Backend corriendo** en `http://127.0.0.1:8000` (ver repo del backend)

```bash
# Verificar instalaciones
node -v     # Node 18+ recomendado
npm -v      # npm 9+
```

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd ticoautos-frontend

# 2. Instalar dependencias
npm install
```

### Configurar URL de la API

La URL del backend está definida en `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});
```

> Si tu backend corre en otro puerto o dominio, modificá esa línea.

---

## ▶️ Ejecución

```bash
# Servidor de desarrollo con hot-reload
npm run serve
```

> La app se abre en `http://localhost:8080`

### Otros comandos

```bash
# Build de producción
npm run build

# Linter
npm run lint
```

---

## 📁 Estructura del Proyecto

```
ticoautos-frontend/src/
├── components/
│   ├── auth/
│   │   ├── loginView.vue              # Pantalla de login/registro
│   │   ├── authBrandSide.vue          # Panel de branding lateral
│   │   ├── authInput.vue              # Input reutilizable (floating label)
│   │   └── socialLogins.vue           # Botones de login social (placeholder)
│   ├── vehicles/
│   │   ├── vehicleListView.vue        # Catálogo con filtros y paginación
│   │   ├── vehicleCard.vue            # Tarjeta individual de vehículo
│   │   ├── vehicleCreateModal.vue     # Modal para crear/editar vehículo
│   │   └── vehicleDetailView.vue      # Vista de detalle del vehículo
│   └── messages/
│       └── messagesView.vue           # Sistema de chat completo
├── composables/
│   ├── useAuth.js                     # Lógica de login/registro/logout
│   ├── useVehicles.js                 # Estado global + CRUD de vehículos
│   └── useMessages.js                 # Lógica de conversaciones y mensajes
├── services/
│   ├── api.js                         # Instancia Axios con interceptores JWT
│   ├── authServices.js                # Endpoints de autenticación
│   ├── vehicleService.js              # Endpoints CRUD de vehículos
│   └── messageServices.js             # Endpoints de mensajería
├── router/
│   └── index.js                       # Rutas y guard de navegación
├── assets/                            # Imágenes, logos, hojas de estilo
├── App.vue                            # Componente raíz + sistema de diseño global
└── main.js                            # Punto de entrada de la app
```

---

## 🗂 Arquitectura de Componentes

```
App.vue
├── loginView.vue ─────────── /login
│   ├── authBrandSide.vue
│   └── authInput.vue
├── vehicleListView.vue ───── /vehicles
│   ├── vehicleCard.vue (×N)
│   └── vehicleCreateModal.vue
├── vehicleDetailView.vue ─── /vehicles/:id
└── messagesView.vue ──────── /messages
```

---

## 🗺 Rutas

| Ruta | Componente | Acceso | Descripción |
|---|---|---|---|
| `/` | — | Público | Redirige a `/login` |
| `/login` | `loginView` | Público | Login y registro |
| `/vehicles` | `vehicleListView` | Público | Catálogo de vehículos |
| `/vehicles/:id` | `vehicleDetailView` | Público | Detalle de un vehículo |
| `/messages` | `messagesView` | 🔒 Privado | Sistema de mensajería |

> Las rutas privadas tienen un **navigation guard** que redirige al login si no hay token JWT en localStorage.

---

## 🧩 Composables (Lógica Reutilizable)

### `useAuth.js`
Gestiona el flujo de autenticación: formulario reactivo, toggle login/registro, almacenamiento de JWT en localStorage, y logout.

### `useVehicles.js`
**Composable principal** — Centraliza todo el estado global de vehículos:
- CRUD completo (crear, editar, eliminar, cambiar estado)
- Filtros de búsqueda y paginación
- Control del modal de creación/edición
- Utilidades: formato de precios, verificación de propiedad, clipboard, navegación condicional

> Los `ref` y `reactive` definidos **fuera** de la función actúan como estado global (singleton).

### `useMessages.js`
Gestiona las conversaciones y el chat: cargar conversaciones, abrir un hilo, enviar mensajes, y el atajo `startChat()` para iniciar un chat desde una tarjeta de vehículo.

---

## 🎨 Sistema de Diseño

El diseño está definido como **CSS custom properties** en `App.vue`:

- **Paleta:** Tema oscuro "Black Cherry" (`#4A0D2B`, `#050507`)
- **Tipografía:** Outfit (sans-serif) + Playfair Display (serif)
- **Efectos:** Glassmorphism, micro-animaciones, sombras con glow
- **Scrollbar:** Personalizado (5px, colores de la paleta)
- **Transiciones:** Cubic-bezier suavizadas, fadeInUp, shimmer, pulse

---

## ⭐ Funcionalidades

### 🔐 Autenticación
- Registro con username y contraseña
- Login con JWT (almacenado en localStorage)
- Validación client-side (contraseña mínima 6 caracteres)
- Logout con limpieza de sesión
- Explorar catálogo sin cuenta

### 🚗 Vehículos
- Catálogo paginado (8 por página)
- Filtros: marca, modelo (búsqueda), rango de año, rango de precio, estado
- Crear vehículo con imagen (JPG, PNG, WebP)
- Editar con preview de imagen existente
- Eliminar con confirmación
- Toggle de estado: Disponible ↔ Vendido (solo dueño)
- Compartir enlace al portapapeles

### 💬 Mensajería
- Chat entre comprador y vendedor por vehículo
- Sidebar con lista de conversaciones
- Apertura directa de chat desde tarjeta/detalle de vehículo
- Detección de mensajes propios vs ajenos (burbujas diferenciadas)
- Toast de errores con auto-dismiss
- Envío con Enter
