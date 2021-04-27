#################################################
# IMPORT DEPENDENCIES
#################################################

# import numpy as np
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from sqlalchemy import Column, Integer, String, Float
# from flask_pymongo import PyMongo
from flask import Flask, current_app, flash, jsonify, make_response, render_template, redirect, request, url_for
from flask_cors import CORS
import json
from config import password
import os
#do i need a declarative base?

#################################################
# # Database Setup to serve sqlite
# ###############################################
engine = create_engine(f'postgresql://postgres:{password}@localhost:5432/water_data_db')
# inspector = inspect(engine)
# print(inspector.get_table_names())
# reflect an existing database into a new model
Base = automap_base()
# # reflect the tables
Base.prepare(engine, reflect=True)
# Do I need this?
# Base.metadata.create_all(engine)
# print(Base.classes.keys())
# Save reference to the table
Sanitation = Base.classes.sanitation


#################################################
# Flask Setup
#################################################

app = Flask(__name__)
CORS(app)

########################################################
# 1. LANDING PAGE FOR DASHBOARD (WHAT THE USER WILL SEE)
########################################################

@app.route("/")
def index():
    return "Welcome to the DashBoard"

################################################################################
# API PAGE TO HOLD GEOJSON DATA (LEAH WILL LINK TO THIS - END USER WILL NOT SEE)
################################################################################

country_list = []
with open("Resources/countries_selection_for_import.json", 'r') as f: 
    country_list = json.loads(f.read())
task = country_list


@app.route('/api/v1.0/country_coords')
def country_cords():
    return(task)

##############################################################################
# API PAGE TO HOLD WATER DATA (LEAH WILL LINK TO THIS - END USER WILL NOT SEE)
# Similar to Titanic exercise
##############################################################################

@app.route("/api/v1.0/water_data")
def water_data():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of country code, access to clear water in 2017, percent of death for three factors"""
    # Query all water data
    results = session.query(Sanitation.entity, Sanitation.code, Sanitation.unsafe_water_perct, Sanitation.unsafe_sanitation_perct, Sanitation.no_handwashing_perct, Sanitation.safe_water_2017).all()

    # session.close()

#pull in read SQL into pandas instead of ORM

    # Create a dictionary from the row data and append to a list of all water info
    water_data = []
    for country_name, country_code, unsafe_water_perct, unsafe_sanitation_perct, no_handwashing_perct, safe_water_2017 in results:
        
        water_dict = {}
        water_dict["entity"] = country_name
        water_dict["code"] = country_code
        water_dict["unsafe_water_perct"] = unsafe_water_perct
        water_dict["unsafe_sanitation_perct"] = unsafe_sanitation_perct
        water_dict["no_handwashing_perct"] = no_handwashing_perct
        water_dict["safe_water_2017"] = safe_water_2017
        water_data.append(water_dict)
    
    session.close()
    
    return jsonify(water_data)

if __name__ == '__main__':
    app.run(debug=True)


##use pandas to pull it in from SQLITE, and to to_json (a dataframe method) hint: orient records, add resource


#select properties from the features, and use leaflet to do all that. 