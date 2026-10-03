# Portafolio de Mauricio Serrano

Sitio en Quarto con diseño propio, publicado en GitHub Pages.

## Editar

- `index.qmd`: presentación, proyectos y contacto.
- `proyectos/*.qmd`: casos de estudio.
- `trayectoria.qmd` y `formacion.qmd`: perfil, formación y certificados.
- `assets/styles.css`: identidad visual y adaptación móvil.
- `assets/site.js`: navegación, filtros, búsqueda de certificados, ejemplo binomial y animaciones con movimiento reducido.
- `assets/certificados/`: documentos originales y vistas previas.
- `assets/social-card.jpg`: imagen social de 1200 × 630.
- `reportes/football/`: copia atribuida del reporte público y sus recursos.

Con Quarto 1.10.18:

```sh
quarto preview
quarto render
python scripts/check_site.py _site
```

Los enlaces internos parten de `/`, porque este sitio se publica en el dominio raíz `madsh26.github.io`.

## Publicación

Repositorio: `Madsh26/Madsh26.github.io`. En Settings → Pages, seleccionar GitHub Actions como fuente. Cada cambio en `main` construye, comprueba enlaces y publica. `_site` es un resultado generado, no se edita ni se guarda en Git.

## Contenido y atribución

La trayectoria se basa en el CV facilitado por Mauricio Serrano. Los casos se basan en los repositorios públicos a octubre de 2026. No se atribuyen métricas comerciales ni tareas individuales no documentadas. El reporte de fútbol acredita a Mauricio Serrano, Andrés Beleño y Carlos Cadena, y conserva las condiciones originales de los datos.

La curva CO es una demostración educativa del modelo binomial; no es la aplicación Shiny completa. El gráfico de control utiliza datos sintéticos y límites ilustrativos. Las demos completas de Shiny y Dash se añadirán cuando estén desplegadas y verificadas.

No publicar microdatos ICFES, archivos privados, credenciales ni datos personales de referencias del CV.

El sitio no ofrece un CV descargable. Las contribuciones de Football fueron confirmadas por Mauricio. El caso Power BI se documentó revisando el informe original del bootcamp.
