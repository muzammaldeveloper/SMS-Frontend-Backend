from ..extentions import db,bcrypt

class AdminModel(db.Model):
    __tablename__ = 'admins'
    
    admin_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    
    # plain password convert to hash password
    def setpassword(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # check hash password with plain password
    def checkpassword(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)