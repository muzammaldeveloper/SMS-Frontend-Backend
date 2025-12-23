from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models.student_model import StudentModel
from ..extentions import db
from ..schemas.student_schema import StudentSchema
from marshmallow import ValidationError

student_router = Blueprint("student_router",__name__)

@student_router.route("/add-students", methods=["POST"])
@jwt_required()
def add_student():
        try:
            schema = StudentSchema()
            data = schema.load(request.form or request.get_json())

            name = data.get("name")
            age = data.get("age")
            grade = data.get("grade")
            department = data.get("department")
            email = data.get("email")
            phon = data.get("phon")
            teacher_id = data.get("teacher_id")

            student = StudentModel(
                name=name,
                age=age,
                grade=grade,
                department=department,
                email=email,
                phon=phon,
                teacher_id=teacher_id
            )

            db.session.add(student)
            db.session.commit()

            return jsonify({"message": "Student added successfully"}), 201
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
            return jsonify({"message": "An error occurred", "error": str(e)}), 500


@student_router.route("/get-students", methods=["GET"])
@jwt_required()
def get_students():

    student = StudentModel.query.all()
    student_list = []
    for stu in student:
        student_info = {
            "id": stu.student_id,
            "name": stu.name,
            "age": stu.age,
            "grade": stu.grade,
            "department": stu.department,
            "email": stu.email,
            "phon": stu.phon,
            "teacher_id": stu.teacher_id
        }
        student_list.append(student_info)

    return jsonify({"students": student_list}), 200


@student_router.route("/update-student/<int:student_id>", methods=["PUT"])
@jwt_required()
def update_student(student_id):
    try:
        student = StudentModel.query.get(student_id)

        if not student:
            return jsonify({"message": "Student not found"}), 404
        
        schema = StudentSchema(partial=True)
        data = schema.load(request.get_json() or request.form)
        
        for key, value in data.items():
            setattr(student, key, value)

        db.session.commit()

        return jsonify({"message": f"Student {student_id} updated successfully"}), 200
    
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
        return jsonify({"error": "Failed to update student", "message": str(e)}), 500
    


@student_router.route("/delete-student/<int:student_id>", methods=["DELETE"])
@jwt_required()
def delete_student(student_id):

    student = StudentModel.query.get(student_id)

    if not student:
        return jsonify({"message": "Student not found"}), 404
    
    db.session.delete(student)
    db.session.commit()

    return jsonify({"message": f"Student {student_id} deleted successfully"}), 200
