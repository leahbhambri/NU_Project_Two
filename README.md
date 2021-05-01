# NU_Project_Two

Access to Clean Water

Objective: Using real life data, create and present an interactive dashboard

Source 1: Global Health Data Exchange; Share of deaths from unsafe water sources, 2017 
Source 2: WHO/UNICEF Joint Monitoring Program for Water Supply, Sanitation and Hygiene; People using safely managed drinking water services (% of population)
Source 3: GeoJSON file

Steps:

Data Cleaning: Load two CSV files into Jupyter Notebook for cleaning. Drop NaN rows, select 2017 only, select columns, rename columns, run formula to find percentages, merge tables. Create connection to PGAdmin, connect to database in PGAdmin, select columns for analysis, populate data from merged file to PGAdmin table.

Flask: Import dependencies, set up flask connection, connect json data to flask API route and connect SQl databse to API route. Run session query on PGAdmin data.

Front End HTML Development: Incorporate bootstrap and various css elements to style the html using past activities and homework as base examples.

Dashboard Element - Maps: create a promise function that pulls from two different sources to add our individual data points to geojson data in order to easily incorporate into the mapping visualizations using the leaflet choropleth functions. Added layering in conjunction with a dropdown selection bar for user-driven functionality.

Dashboard Element - Bubble Chart: Created a responsive SVG Scatter Plot with 3 variables for the Y AXIS, appended the data via json and added a tool tip

Outcome: We created an interactive dashboard that displays two maps and one bubble chart. The first choropleth map has a drop down feature so the user can toggle between three different causes of death. The second choropleth map displays the percent of population with access to clean water. Both maps feature tooltips to display the information and have corresponding legends. 

We created a bubble chart that used the same information as the first map. The user can change between causes of death to see the variable change on the Y axis. 
