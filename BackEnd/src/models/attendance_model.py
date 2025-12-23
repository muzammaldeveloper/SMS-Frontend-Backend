from ..extentions import db
from datetime import date

class AttendanceModel(db.Model):
    __tablename__ = 'attendances'
    
    attendance_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)
    date = db.Column(db.Date, default=date.today, nullable=False)
    status = db.Column(db.Boolean, default=False, nullable=False)  # e.g., 'Present', 'Absent'

    # Establish relationship with StudentModel
    # student = db.relationship('StudentModel', backref=db.backref('attendances', lazy=True))
    
    #stringent constraint to prevent duplicate attendance records for the same student on the same date
    __table_args__ = (
        db.UniqueConstraint('student_id', 'date', name='unique_student_date'),)
    
