from marshmallow import Schema, fields, validate

class AttendanceSchema(Schema):
    student_id = fields.Int(required=True, validate=validate.Range(min=1))
    date = fields.Date(required=False)  # Optional, defaults to today
    status = fields.Bool(required=True)  # True = Present, False = Absent
    attendance_id = fields.Int(required=False)
    