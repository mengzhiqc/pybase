# -*- encoding: utf8 -*-

import os

class Config:

    SECRET_KEY = os.environ.get('SECRET_KEY') or 'godblessc1asa234s2e'
    SQLALCHEMY_COMMIT_ON_TEARDOWN = False
    #SQLALCHEMY_ECHO = True

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql://dada:123456@localhost/dada'

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'mysql://root:casacasa@localhost/pepsi'

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'mysql://root:casacasa@localhost/pepsi'

config = {
    'development': DevelopmentConfig,
    'test': TestConfig,
    'production': ProductionConfig,

    'default': DevelopmentConfig
}
