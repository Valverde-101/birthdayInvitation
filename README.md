# Sitio Web de Invitación de Cumpleaños

Una hermosa e interactiva invitación digital de cumpleaños. Este sitio web responsivo presenta animaciones, soporte bilingüe (inglés/español) y un sistema RSVP fácil de usar.

![Preview of the invitation website](media/og-image.jpg)

## Características

- 🎬 Saludo con video/animación llamativo  
- 🌍 Soporte bilingüe (inglés e hindi)  
- 📝 Formulario RSVP interactivo con integración de FormSpree  
- 🗺️ Mapa de ubicación interactivo con Google Maps  
- 🎉 Animaciones de celebración (confeti y globos)  
- 📱 Diseño totalmente responsivo para todos los dispositivos  
- 🔄 Validación de formulario y manejo de errores  

## Demo en Vivo

Visita la invitación en vivo en: [https://shubhshackyard.github.io/birthdayInvitation/](https://shubhshackyard.github.io/birthdayInvitation/)

## Tecnologías Utilizadas

- HTML5  
- CSS3 (con animaciones)  
- JavaScript (vanilla)  
- FormSpree (gestión de formularios)  
- GitHub Pages (hospedaje)  

## Configuración e Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/shubhshackyard/birthdayInvitation.git
   cd birthdayInvitation
   ```

2. **Probar localmente**
   - Abre `index.html` en tu navegador para probar el sitio localmente  
   - O usa un servidor local: `python -m http.server` y visita `http://localhost:8000`

3. **Desplegar en GitHub Pages**
   - Sube los cambios a la rama `main`  
   - GitHub Actions desplegará automáticamente tu sitio  

## Guía de Personalización

### Información Básica

Edita lo siguiente en `index.html`:
- Nombre, fecha y detalles del evento  
- Información de la ubicación y mapa incrustado  
- Información de contacto  

### Recursos Multimedia

Reemplaza los siguientes archivos en la carpeta `media`:
- `birthday-video.mp4` - Video principal de bienvenida  
- `birthday-animation.gif` - Animación de respaldo si el video no se carga  
- `video-placeholder.jpg` - Imagen de portada del video  
- `og-image.jpg` - Imagen de vista previa para compartir en redes sociales  
- `favicon.ico` y archivos relacionados - Ícono del sitio web  

### Integración del Formulario

El formulario RSVP está configurado para funcionar con FormSpree. Para usar tu propio formulario:  
1. Crea una cuenta en [FormSpree.io](https://formspree.io/)  
2. Actualiza la URL de acción del formulario en `index.html`  

### Estilos

La apariencia del sitio puede personalizarse editando:
- `styles.css` - Para colores, fuentes, espaciado, etc.  
- Agrega animaciones personalizadas modificando las funciones de animación en `script.js`  

## Compatibilidad con Navegadores

- Chrome, Firefox, Safari, Edge (últimas versiones)  
- Navegadores móviles en iOS y Android  
- Incluye compatibilidad con navegadores antiguos  

## Créditos

- Animaciones impulsadas por Web Animations API  
- Íconos del conjunto de Emojis  
- Integración del mapa vía Google Maps  
- Gestión de formularios por FormSpree  

## Licencia

Este proyecto está disponible para uso personal y educativo. Para uso comercial, por favor contacta al autor.

---

Creado de formato inicial [ShubhShackyard](https://github.com/shubhshackyard)
