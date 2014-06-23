# -*- encoding: utf8 -*-
from core import app
import oauth.views

app.config['DEBUG_TB_HOSTS'] = '127.0.0.1'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
