from marshmallow import Schema, fields, validate

class AdminSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True, validate=validate.Length(max=100))
    password = fields.Str(required=True, validate=validate.Length(min=6))  