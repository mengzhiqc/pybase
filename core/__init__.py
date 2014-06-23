# -*- encoding: utf8 -*-
from flask import Flask, g
from configs.config import config
from flask_debugtoolbar import DebugToolbarExtension
from flask.ext.sqlalchemy import SQLAlchemy

def createApp(config_name):

    template_folder = '../oauth/templates'
    static_folder = '../oauth/static'


    if config[config_name].TEMPLATE_FOLDER :
        template_folder = config[config_name].TEMPLATE_FOLDER

    if config[config_name].TEMPLATE_FOLDER :
        static_folder = config[config_name].STATIC_FOLDER

    app = Flask(__name__,template_folder=template_folder,static_folder=static_folder)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    return app

app = createApp("development") # [ development | test | production ]

db = SQLAlchemy(app)
toolbar = DebugToolbarExtension(app)
