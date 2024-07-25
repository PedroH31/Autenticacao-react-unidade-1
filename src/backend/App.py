from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'  # SQLite database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Initialize CORS
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    products = db.relationship('Product', backref='owner', lazy=True)

# Product model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

def init_db():
    with app.app_context():
        db.create_all()

# Routes
@app.route('/api/register/', methods=['POST'])
def register():
    data = request.json
    user = User(email=data['email'], username=data['username'], password=data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login/', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/logout/', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/products/', methods=['GET', 'POST'])
def manage_products():
    if request.method == 'GET':
        user_id = request.args.get('user_id')  
        if not user_id:
            return jsonify({'message': 'User ID is required'}), 400
        
        products = Product.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price
        } for p in products])

    if request.method == 'POST':
        user_id = request.json.get('userId')
        if user_id:
            data = request.json
            product = Product(name=data['name'], description=data['description'], price=data['price'], user_id=user_id)
            db.session.add(product)
            db.session.commit()

            return jsonify({'message': 'Product added successfully'}), 201
        
        return jsonify({'message': 'User ID is missing'}), 401

@app.route('/api/products/<int:product_id>/', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()

    return jsonify({'message': 'Product deleted successfully'}), 200

@app.route('/api/products/<int:product_id>/', methods=['PUT'])
def update_product(product_id):
    data = request.json
    product = Product.query.get_or_404(product_id)

    user_id = data.get('user_id')

    product.name = data['name']
    product.description = data['description']
    product.price = data['price']

    db.session.commit()

    return jsonify({'message': 'Product updated successfully'}), 200


if __name__ == '__main__':
    init_db()
    app.run(debug=True)