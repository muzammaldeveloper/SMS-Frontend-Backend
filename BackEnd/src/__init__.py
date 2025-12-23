
from flask import Flask
from flask_cors import CORS
from .extentions import db, jwt, bcrypt

# routers
from .routers.students_router import student_router
from .routers.teachers_router import teacher_router
from .routers.attendance_router import attendance_router
from .routers.admin_router import admin_router
from .routers.auth_router import auth_router

# models
from .models.student_model import StudentModel
from .models.teacher_model import TeacherModel
from .models.attendance_model import AttendanceModel
from .models.admin_model import AdminModel

# token time extend
from datetime import timedelta

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    #Register blueprints
    app.register_blueprint(student_router, url_prefix="/api")
    app.register_blueprint(teacher_router, url_prefix="/api")
    app.register_blueprint(attendance_router, url_prefix="/api")
    app.register_blueprint(admin_router, url_prefix="/api")
    app.register_blueprint(auth_router, url_prefix="/api")

    # configure
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/sms_task1'
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change this to a secure key in production
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        db.create_all()

    return app