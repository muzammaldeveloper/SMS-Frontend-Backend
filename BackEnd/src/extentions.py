# creat data base 
from flask_sqlalchemy import SQLAlchemy
#creat jwt manager
from flask_jwt_extended import JWTManager
#  import Dcript
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()