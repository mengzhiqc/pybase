from setuptools import setup

setup(
    name="IMDaDa",
    version="1.0",
    install_requires=[
        "flask",
        "MySQL-python",
        "flask-sqlalchemy",
        "redis",
        "hiredis",
        "flask-wtf",
        "Flask-Login",
        "Flask-OAuth",
        "Flask-uploads",
        "Flask-OAuthlib",
        "flask-debugtoolbar"
    ],
)
