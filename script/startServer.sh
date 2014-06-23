#!/bin/bash
uwsgi -x uwsgi.xml -d /tmp/uwsgi.log --plugin python  --enable-threads
