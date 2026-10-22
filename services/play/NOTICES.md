# EduTicTac Play — avisos de terceros

Las librerías H5P runtime vendorizadas en `h5p-libraries/` conservan sus
`library.json` y proceden de los repositorios oficiales de H5P. El prototipo
usa `H5P.MultiChoice`, `H5P.TrueFalse`, `H5P.MemoryGame`, `H5P.DragQuestion`, `H5P.AdvancedText`, `H5P.Question`, `H5P.JoubelUI`, `H5P.Transition`,
`H5P.FontIcons` y `FontAwesome`.

`H5P.QuestionSet` 1.20.31 y `H5P.Video` 1.6.2 proceden de los repositorios
oficiales `h5p/h5p-question-set` y `h5p/h5p-video`, respectivamente, y se
distribuyen bajo MIT. QuestionSet se usa como contenedor de actividades
compatibles y emite la calificación agregada del reto mediante xAPI.

`H5P.TrueFalse` 1.8 procede del repositorio oficial `h5p/h5p-true-false` y se
distribuye bajo MIT. Se conservan sus metadatos, scripts, estilos y SVG.

`H5P.MemoryGame` 1.3 y `H5P.Components` 1.0 se distribuyen bajo MIT.
`H5P.Timer` 0.4 declara dominio público en su `library.json`.

`H5P.DragQuestion` 1.15, `H5P.AdvancedText` 1.1 y el envoltorio `jQuery.ui`
1.10 se incluyen para la actividad Relacionar. Sus metadatos upstream declaran
licencias compatibles (MIT para DragQuestion/AdvancedText y MIT para jQuery UI).

`H5P.Blanks` 1.14 procede del repositorio oficial `h5p/h5p-blanks` y se
distribuye bajo MIT. `H5P.TextUtilities` 1.3 declara dominio público en su
`library.json`. Ambas librerías se incluyen para Rellenar huecos.

`H5P.FindTheWords` 1.4 procede de `jithin-space/h5p-find-the-words`. Su
`library.json` declara MIT, mientras que el repositorio de origen incluye
GPL-3.0 para el conjunto; se conserva `LICENSE-GPL-3.0` junto a la librería y
se debe revisar la licencia global del producto antes de publicar una release.

`H5P.DragText` 1.10 procede del repositorio oficial `h5p/h5p-drag-text` y se
distribuye bajo MIT. Sus dependencias locales son `jQuery.ui`, `H5P.JoubelUI`,
`H5P.Question`, `H5P.Components` y `FontAwesome`.

`H5P.MarkTheWords` 1.11 procede del repositorio oficial
`h5p/h5p-mark-the-words` y se distribuye bajo MIT. Sus dependencias locales
son `H5P.JoubelUI`, `H5P.Question` y `FontAwesome`.

`H5P.Dialogcards` 1.9 procede del repositorio oficial `h5p/h5p-dialogcards` y
se distribuye bajo MIT. Sus dependencias locales son `H5P.JoubelUI`,
`H5P.Audio`, `H5P.Components` y `FontAwesome`.

`H5P.Crossword` 0.7 procede de `otacke/h5p-crossword` y se distribuye bajo
MIT. Sus dependencias locales son `H5P.Question`, `H5P.JoubelUI` y `H5P.Image`.
`H5P.Image` 1.1 procede de `h5p/h5p-image`; su aviso MIT se conserva en el
README incluido junto a la librería.

El reproductor `h5p-standalone` 3.8.2 se distribuye bajo MIT. Sus recursos
están en `assets/`; el aviso de licencia se conserva en la documentación del
paquete upstream.

Antes de publicar una release se debe generar un inventario SPDX/SBOM y revisar
los avisos y licencias de cada versión concreta.

La interfície pròpia de Play usa Vue 3.5.44 (MIT), compilat localment amb les
dependències compartides de Commons. La llicència del runtime es distribuïx en
`public/assets/ui/licenses/vue-MIT.txt`. No substituïx el reproductor H5P ni
canvia les llicències de les activitats o biblioteques anteriors.
