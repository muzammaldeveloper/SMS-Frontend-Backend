from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models.teacher_model import TeacherModel
from ..extentions import db
from ..schemas.teacher_schema import TeacherSchema
from marshmallow import ValidationError

teacher_router = Blueprint("teacher_router",__name__)

@teacher_router.route("/add-teacher", methods=["POST"])
@jwt_required()
def add_teacher():
    try:
        schema = TeacherSchema()
        data = schema.load(request.get_json() or request.form)

        teacher = TeacherModel(
            name=data['name'],
            email=data['email'],
            subject=data['subject']
        )

        db.session.add(teacher)
        db.session.commit()

        return jsonify({"message": "Teacher added successfully", "teacher_id": teacher.teacher_id}), 201
    
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
        return jsonify({"error": "Failed to add teacher", "message": str(e)}), 500



@teacher_router.route("/get-teachers", methods=["GET"])
@jwt_required()
def get_teachers():
    
    teacher = TeacherModel.query.all()
    teacher_list = []
    for tea in teacher:
        teacher_info = {
            "id": tea.teacher_id,
            "name": tea.name,
            "email": tea.email,
            "subject": tea.subject
        }
        teacher_list.append(teacher_info)

    return jsonify({"teachers": teacher_list}), 200

@teacher_router.route("/update-teacher/<int:teacher_id>", methods=["PUT"])
@jwt_required()
def update_teacher(teacher_id):
    try:
        teacher = TeacherModel.query.get(teacher_id)

        if not teacher:
            return jsonify({"message": "Teacher not found"}), 404
        
        schema = TeacherSchema(partial=True)
        data = schema.load(request.get_json() or request.form)
        
        for key, value in data.items():
            setattr(teacher, key, value)
        
        db.session.commit()

        return jsonify({"message": f"Teacher {teacher_id} updated successfully"}), 200
    
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
        return jsonify({"error": "Failed to update teacher", "message": str(e)}), 500



@teacher_router.route("/delete-teacher/<int:teacher_id>", methods=["DELETE"])
@jwt_required()
def delete_teacher(teacher_id):

    teacher = TeacherModel.query.get(teacher_id)
    
    if not teacher:
        return jsonify({"message": "Teacher not found"}), 404
    
    db.session.delete(teacher)
    db.session.commit()

    return jsonify({"message": f"Teacher {teacher_id} deleted successfully"}), 200