from flask import Blueprint, request, jsonify
from ..models.admin_model import AdminModel
from ..extentions import db,bcrypt,jwt
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError
from ..schemas.admin_schema import AdminSchema

admin_router = Blueprint("admin_router",__name__)


@admin_router.route("/add-admin", methods=["POST"])
def add_admin():
    try:
        schema = AdminSchema()
        data = schema.load(request.get_json() or request.form)

        admin = AdminModel(
            name=data['name'],
            email=data['email']
        )
        admin.setpassword(data['password'])  

        db.session.add(admin)
        db.session.commit()
            
        return jsonify({"message": "Admin added successfully", "admin_id": admin.admin_id}), 201
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
        db.session.rollback()
        return jsonify({"error": "Failed to add admin", "message": str(e)}), 500
    
    
@admin_router.route("/get-admins", methods=["GET"])
@jwt_required()
def get_admins():

    admin = AdminModel.query.all()
    admin_list = []

    for adm in admin:
        admin_info = {
            "id": adm.admin_id,
            "name": adm.name,
            "email": adm.email
        }
        admin_list.append(admin_info)
    

    return jsonify({"admins": admin_list}), 200



@admin_router.route("/update-admin/<int:admin_id>", methods=["PUT"])
@jwt_required()
def update_admin(admin_id):
    try:
        admin = AdminModel.query.get(admin_id)
        if not admin:
            return jsonify({"message": "Admin not found"}), 404
        
        schema =AdminSchema(partial=True)
        data = schema.load(request.get_json() or request.form)  
        
        if "name" in data:
            admin.name = data.get("name")
        if "email" in data:
            admin.email = data.get("email")
        if "password" in data and data.get("password"):
            admin.setpassword(data.get("password"))

        db.session.commit()

        return jsonify({"message": f"Admin {admin_id} updated successfully"}), 200
    except ValidationError as err:
        return jsonify({"errors":"Validation errors", "messages": err.messages}), 400 
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred", "error": str(e)}), 500


@admin_router.route("/delete-admin/<int:admin_id>", methods=["DELETE"])
@jwt_required()
def delete_admin(admin_id):

    admin = AdminModel.query.get(admin_id)
    if not admin:
        return jsonify({"message": "Admin not found"}), 404
    
    db.session.delete(admin)
    db.session.commit()

    return jsonify({"message": f"Admin {admin_id} deleted successfully"}), 200