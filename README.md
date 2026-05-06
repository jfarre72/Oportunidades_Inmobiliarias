# Charcas al 2500 — Landing de propiedad

Sitio estático de una sola página con la ficha completa del departamento de **Charcas al 2500**, Recoleta. Listo para desplegar en Vercel.

## Estructura

```
.
├── index.html      # Página principal
├── styles.css      # Estilos
├── script.js       # Galería con auto-carga + lightbox
├── vercel.json     # Configuración de Vercel
└── images/         # Fotos de la propiedad (1.jpg, 2.jpg, ...)
```

## Agregar las fotos

Ubicá las imágenes en la carpeta `images/` con nombres numerados secuencialmente:

```
images/1.jpg
images/2.jpg
images/3.jpg
...
```

La galería las detecta automáticamente (hasta 30) y se detiene en la primera que falte. Soporta `.jpg`, `.jpeg`, `.png` y `.webp`. La **primera imagen** se muestra destacada (más grande) en la galería.

## Desarrollo local

```bash
npx serve .
# o
python3 -m http.server 8000
```

## Deploy en Vercel

1. Importar el repositorio en [vercel.com](https://vercel.com/new).
2. Framework preset: **Other** (HTML estático).
3. Build command: *(vacío)*
4. Output directory: `.`
5. Deploy.
