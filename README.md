# DataVisuals-Project

College project

Building an application for viewing of a dataset. The dataset contains information about GDP per capita, Life Expectancy and Population indicators for European Union countries, for the last 15 available years.

The application provides the following:
- automatic download when starting the application of current data on GDP per capita / Life Expectancy / Population for EU countries for the last 15 available years.
- graphical display of evolution for an indicator (GDP/SV/Pop) and a country selected by the user - a SVG (Vector Graphics) element; the type of graph (line, histogram, ...) is optional.
- for the graph from the previous point to display a tooltip showing the year and values for GDP/SV/Pop for the period corresponding to the mouse position
- bubble chart display for a year selected by the user using a canvas element (raster graphic)
- bubble chart animation (display bubble chart successively for all years)
- tabelar display of available data for a year selected by the user (countries on the lines and the indicators on three columns); each cell will be assigned a color (from red to green) based on its distance from the Union's mean. 
