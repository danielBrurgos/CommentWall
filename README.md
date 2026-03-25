
Comment Wall - Community Platform
Descripción del Proyecto
Comment Wall es una aplicación web interactiva diseñada para la comunicación en tiempo real dentro de una comunidad de desarrolladores. La plataforma permite a los usuarios autenticarse de manera local, publicar mensajes, responder a comentarios existentes creando hilos de conversación y gestionar la visualización mediante un sistema de temas (claro/oscuro).

El proyecto implementa una arquitectura de separación de responsabilidades, gestionando de forma independiente la lógica de la interfaz de usuario (UI), la persistencia de datos y la gestión de sesiones.

Tecnologías Utilizadas
El stack tecnológico ha sido seleccionado para demostrar el dominio de las bases del desarrollo web moderno y el consumo de servicios REST:

Frontend: HTML5 semántico y CSS3 avanzado (Flexbox, Grid, Custom Properties).

Lógica de Programación: JavaScript Vanilla (ES6+) con uso intensivo de Async/Await y manipulación dinámica del DOM.

Persistencia de Datos: JSON-Server como REST API para simular una base de datos persistente en el entorno local.

Recursos Externos: * DiceBear API: Generación dinámica de avatares mediante hashing de nombres de usuario.

Font Awesome: Librería de iconografía técnica.

Inter Font Family: Tipografía optimizada para legibilidad en pantallas.

Características Técnicas
Diseño Adaptativo: Interfaz optimizada mediante Media Queries para una visualización correcta en dispositivos móviles, tablets y monitores de escritorio.

Gestión de Hilos: Capacidad de respuesta anidada (threading) vinculada mediante llaves foráneas (parentId).

Persistencia de Sesión: Uso de localStorage para mantener la identidad del usuario y sus preferencias de tema tras recargar el navegador.

Seguridad Básica: Implementación de funciones de saneamiento para prevenir ataques de Cross-Site Scripting (XSS).

Guía de Instalación y Ejecución
Requisitos Previos
Tener instalado Node.js en su versión LTS.

Un navegador web moderno (Chrome, Firefox o Edge).

Paso 1: Clonar o descargar el proyecto
Descargue los archivos en una carpeta local en su sistema.

Bash
git clone https://github.com/tu-usuario/comment-wall.git
cd comment-wall
Paso 2: Instalación de la API local
Para simular el backend, debe instalar json-server de manera global o ejecutarlo mediante npx.

Bash
npm install -g json-server
Paso 3: Iniciar el servidor de datos
Abra una terminal dentro de la carpeta del proyecto y ejecute el siguiente comando para levantar la base de datos:

Bash
json-server --watch db.json --port 3000
Nota: Mantenga esta terminal abierta durante el uso de la aplicación.

Paso 4: Ejecutar la aplicación
Abra el archivo index.html en su navegador. Se recomienda utilizar la extensión Live Server de Visual Studio Code para una experiencia de desarrollo óptima.

Shutterstock

Estructura de Archivos
index.html: Estructura base y puntos de montaje para el DOM.

style.css: Definición de variables de entorno, temas y reglas de diseño responsivo.

script.js: Lógica de negocio, controladores de eventos y comunicación asíncrona con la API.

db.json: Almacén de datos en formato JSON.

<img width="1880" height="954" alt="image" src="https://github.com/user-attachments/assets/43086278-73b5-4142-92b9-9843d20e69f7" />
