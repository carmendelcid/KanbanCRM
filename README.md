# 📌 Kanban Board Inteligente & Agente IA Autónomo (Human-in-the-Loop)

## 📖 Descripción

Consiste en una solución integral para la gestión de tareas e incidencias de código dentro de Microsoft Dataverse. 
Este proyecto transforma una tabla estándar en un tablero interactivo, pero va un paso más allá: **integra un Agente de IA que actúa como Desarrollador Junior**. El sistema lee los bugs reportados, genera el código para solucionarlos y, bajo un modelo de supervisión humana (*Human-in-the-Loop*), realiza *commits* y despliegues automáticos directamente en GitHub.

## 🏗️ Arquitectura de Microservicios y Automatización

Este proyecto sigue una arquitectura desacoplada. Puedes consultar el código de los otros microservicios en sus respectivos repositorios:

* **Frontend (Capa de Presentación)** 👉 **[ESTÁS AQUÍ]**
  Componente PCF en React/TypeScript. Interfaz drag-and-drop con visualización dinámica de enlaces a repositorios.
* **Backend (Capa Lógica y Seguridad)** 👉 **[Ver Repositorio del Plugin C#](https://github.com/carmendelcid/KanbanPlugins)**
  Plugin síncrono en C# (.NET) para validación de reglas de negocio (Límites WIP).
* **Agente IA & API REST (Capa de Procesamiento)** 👉 **[Ver Repositorio del Agente Python](https://github.com/carmendelcid/API_Python)**
  Backend en Python (Flask) conectado a LLaMA 3.1 (vía Groq API) para la resolución de código, y a la GitHub API (PyGithub) para la ejecución de *commits* automáticos.
* **Orquestación (Capa de Automatización)**
  Microsoft Power Automate. Gestiona el ciclo de vida de la tarea, actuando como puente entre Dataverse, la IA y GitHub.

## ✨ Características Principales

* **Human-in-the-Loop (HITL):** El despliegue de código está condicionado a la aprobación humana. La IA propone, el humano dispone.
* **Generación de Código Zero-Shot:** La IA analiza el problema descrito en el ticket del Kanban y devuelve código limpio, reparado y listo para producción sin intervención manual.
* **CI/CD Integrado con GitHub:** Una vez aprobada la tarjeta, el sistema realiza un `commit` automático en el repositorio de destino, solucionando el bug.
* **Trazabilidad Total:** El componente Kanban renderiza un botón dinámico ("Ver Commit") que enlaza directamente la tarjeta de Dataverse con el "Diff" exacto de GitHub donde se arregló el error.
* **Optimistic UI:** El movimiento de las tarjetas es instantáneo en la pantalla del usuario antes de que el servidor confirme el cambio en la base de datos, eliminando tiempos de carga visuales.
* **Diseño Corporativo:** Interfaz de usuario construida con Fluent UI (la librería oficial de Microsoft) para mantener la coherencia visual con Dynamics 365 / Power Apps.

## ⚙️ Despliegue y Compilación Local (Frontend PCF)

Para clonar y compilar este entorno de React en local, se requiere Node.js instalado.

```bash
# 1. Instalar las dependencias del proyecto
npm install

# 2. Compilar el código y generar el empaquetado para Dataverse
npm run build
