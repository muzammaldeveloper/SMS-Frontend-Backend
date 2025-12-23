from marshmallow import Schema, fields, validate

class StudentSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    age = fields.Int(required=True, validate=validate.Range(min=1))
    grade = fields.Str(required=True, validate=validate.Length(min=1, max=10))
    department = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True, validate=validate.Length(max=100))
    phon = fields.Str(required=True, validate=validate.Length(min=7, max=15))
    teacher_id = fields.Int(required=False)