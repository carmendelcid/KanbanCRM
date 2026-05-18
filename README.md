# 📌 Kanban Board Inteligente - Proyecto Principal (Frontend PCF)

## 📖 Descripción
Consiste en una solución integral para la gestión de tareas dentro de Microsoft Dataverse. 

Este repositorio en concreto aloja el **Frontend**: un componente de código (PCF) que transforma la vista estándar de tabla en un tablero interactivo (Kanban) con funcionalidad de "arrastrar y soltar" e interfaz en tiempo real.

## 🏗️ Arquitectura de Microservicios (Full-Stack)
Este proyecto sigue una arquitectura desacoplada de tres capas. Puedes consultar el código de los otros microservicios en sus respectivos repositorios:

1. **Frontend (Capa de Presentación) 👉 [ESTÁS AQUÍ]**
   - Componente PCF en **React** y **TypeScript**.
2. **Backend (Capa Lógica y Seguridad) 👉 [Ver Repositorio](https://github.com/carmendelcid/KanbanPlugins)**
   - Plugin síncrono en **C# (.NET)** que actúa como guardián de reglas de negocio (Límites WIP).
3. **Inteligencia Artificial (Capa de Procesamiento) 👉 [Ver Repositorio](https://github.com/carmendelcid/API_Python)**
   - API REST en **Python (Flask)** conectada a **LLaMA 3 (Groq)** para analizar el rendimiento al finalizar tareas.

## ✨ Características del Frontend
- **Drag & Drop Fluido:** Implementado mediante `hello-pangea/dnd` para una experiencia de usuario natural.
- **Diseño Corporativo:** Interfaz de usuario construida con **Fluent UI** (la librería oficial de Microsoft) para mantener la coherencia visual con Dynamics 365 / Power Apps.
- **Optimistic UI:** El movimiento de las tarjetas es instantáneo en la pantalla del usuario antes de que el servidor confirme el cambio en la base de datos, eliminando tiempos de carga visuales.

## ⚙️ Despliegue y Compilación Local
Para clonar y compilar este entorno de React en local, se requiere Node.js instalado.

```bash
# 1. Instalar las dependencias del proyecto
npm install

# 2. Compilar el código y generar el empaquetado para Dataverse
npm run build
