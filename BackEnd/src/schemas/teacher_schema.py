from marshmallow import Schema, fields, validate

class TeacherSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True, validate=validate.Length(max=100))
    subject = fields.Str(required=True, validate=validate.Length(min=1, max=50))