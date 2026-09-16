# EduTicTac Play — avisos de terceros

Las librerías H5P runtime vendorizadas en `h5p-libraries/` conservan sus
`library.json` y proceden de los repositorios oficiales de H5P. El prototipo
usa `H5P.MultiChoice`, `H5P.TrueFalse`, `H5P.MemoryGame`, `H5P.DragQuestion`, `H5P.AdvancedText`, `H5P.Question`, `H5P.JoubelUI`, `H5P.Transition`,
`H5P.FontIcons` y `FontAwesome`.

`H5P.TrueFalse` 1.8 procede del repositorio oficial `h5p/h5p-true-false` y se
distribuye bajo MIT. Se conservan sus metadatos, scripts, estilos y SVG.

`H5P.MemoryGame` 1.3 y `H5P.Components` 1.0 se distribuyen bajo MIT.
`H5P.Timer` 0.4 declara dominio público en su `library.json`.

`H5P.DragQuestion` 1.15, `H5P.AdvancedText` 1.1 y el envoltorio `jQuery.ui`
1.10 se incluyen para la actividad Relacionar. Sus metadatos upstream declaran
licencias compatibles (MIT para DragQuestion/AdvancedText y MIT para jQuery UI).

El reproductor `h5p-standalone` 3.8.2 se distribuye bajo MIT. Sus recursos
están en `assets/`; el aviso de licencia se conserva en la documentación del
paquete upstream.

Antes de publicar una release se debe generar un inventario SPDX/SBOM y revisar
los avisos y licencias de cada versión concreta.
