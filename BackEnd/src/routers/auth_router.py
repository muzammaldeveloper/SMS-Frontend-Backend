from flask import Blueprint, request, jsonify
from marshmallow import ValidationError 
from ..extentions import db, bcrypt, jwt
from ..models.admin_model import AdminModel
from ..schemas.auth_schema import RegisterSchema, LoginSchema  
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


auth_router = Blueprint("auth_router",__name__)


@auth_router.route("/register", methods=["POST"])
def register():
    try:
    
        schema = RegisterSchema()
        data = schema.load(request.get_json() or request.form)

        # Check duplicate email
        existing_admin = AdminModel.query.filter_by(email=data['email']).first()
        if existing_admin:
            return jsonify({"error": "Email already registered"}), 409

        new_admin = AdminModel(
            name=data['name'],
            email=data['email']
        )
        new_admin.setpassword(data['password'])

        db.session.add(new_admin)
        db.session.commit()
        
        return jsonify({
            "message": "Admin registered successfully",
            "admin_id": new_admin.admin_id
        }), 201
    
    except ValidationError as err:
        return jsonify({"error": "Validation failed", "messages": err.messages}), 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Registration failed", "message": str(e)}), 500
    
    


@auth_router.route("/login", methods=["POST"])
def login():
    try:
        schema = LoginSchema()
        
        data = schema.load(request.get_json() or request.form)

        admin = AdminModel.query.filter_by(email=data['email']).first()

        if not admin:
            return jsonify({"error": "Invalid credentials"}), 401
        
        if not admin.checkpassword(data['password']):
            return jsonify({"error": "Invalid credentials"}), 401
        
        token = create_access_token(identity=str(admin.admin_id))

        return jsonify({
            "message": "Login successful",
            "token": token,
            "admin": {
                "id": admin.admin_id,
                "name": admin.name,
                "email": admin.email
            }
        }), 200
    
    except ValidationError as err:
        error_messages = []
        for field, messages in err.messages.items():
            if isinstance(messages, list):
                error_messages.extend([f"{field}: {msg}" for msg in messages])
            else:
                error_messages.append(f"{field}: {messages}")
        error_text = ", ".join(error_messages)
        return jsonify({"error": error_text or "Validation failed"}), 400
    
    except Exception as e:
        return jsonify({"error": "Login failed", "message": str(e)}), 500
    


@auth_router.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    current_user = get_jwt_identity()
    return jsonify({
        "message": "User logged out successfully",
        "user": current_user
    }), 200