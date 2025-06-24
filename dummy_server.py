from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import time
import random
from typing import Dict, List, Any, Optional
from functools import wraps

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS for all domains and routes
CORS(app, origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173","https://case-management.d3ilu3opuyh91j.amplifyapp.com"])

# Helper functions for generating dummy data
def generate_timestamp() -> int:
    """Generate a current Unix timestamp."""
    return int(time.time())

def generate_dummy_pagination(page: int = 1, page_size: int = 20, total_items: int = 100) -> Dict[str, int]:
    """Generate dummy pagination data."""
    total_pages = (total_items + page_size - 1) // page_size
    return {
        "page": page,
        "pageSize": page_size,
        "totalItems": total_items,
        "totalPages": total_pages
    }

def generate_dummy_error(code: str, message: str) -> Dict[str, Any]:
    """Generate a standard error response."""
    return {
        "code": code,
        "message": message,
        "details": {}
    }

def generate_dummy_case_summary() -> Dict[str, Any]:
    """Generate a dummy case summary."""
    statuses = ["NEW", "IN_PROGRESS", "RESOLVED", "ESCALATED", "CLOSED"]
    priorities = ["High", "Medium", "Low"]
    
    return {
        "id": random.randint(1000, 9999),
        "entityId": random.randint(1000, 9999),
        "customerId": random.randint(1000, 9999),
        "status": random.choice(statuses),
        "priority": random.choice(priorities),
        "assignedTo": random.randint(1000, 9999),
        "createdAt": generate_timestamp() - random.randint(0, 86400 * 30),  # Within last 30 days
        "updatedAt": generate_timestamp()
    }

def generate_dummy_case_status_summary() -> Dict[str, Any]:
    """Generate a dummy case status summary."""
    return {
        "status": random.choice(["NEW", "IN_PROGRESS", "RESOLVED", "ESCALATED", "CLOSED"]),
        "count": random.randint(10, 100),
        "growthPercent": round(random.uniform(-20.0, 20.0), 2)
    }

def generate_dummy_comment() -> Dict[str, Any]:
    """Generate a dummy comment."""
    headers = ["Investigation", "Customer Contact", "Resolution", "Note"]
    return {
        "id": random.randint(1000, 9999),
        "authorId": random.randint(1000, 9999),
        "header": random.choice(headers),
        "content": "This is a dummy comment content.",
        "createdAt": generate_timestamp() - random.randint(0, 86400),
        "updatedAt": generate_timestamp()
    }

def generate_dummy_customer() -> Dict[str, Any]:
    """Generate dummy customer data."""
    return {
        "id": random.randint(1000, 9999),
        "name": "John Doe",
        "email": "john.doe@example.com",
        "dob": "01-01-1990",
        "phoneNumber": "+1234567890",
        "accountId": random.randint(1000, 9999),
        "createdAt": generate_timestamp() - random.randint(0, 86400 * 365),
        "updatedAt": generate_timestamp()
    }

def generate_dummy_alert() -> Dict[str, Any]:
    """Generate dummy alert data."""
    return {
        "id": random.randint(1000, 9999),
        "transactionId": random.randint(1000, 9999),
        "anomalies": [
            {
                "id": random.randint(1000, 9999),
                "title": "Suspicious Transaction Pattern",
                "description": "Multiple high-value transactions in short time period",
                "expression": "tx_count > 5 AND tx_value > 1000"
            }
        ],
        "payload": {
            "amount": random.randint(1000, 10000),
            "currency": "USD",
            "merchant": "Example Merchant"
        },
        "caseStatus": random.choice(["REQUIRED", "NOT_REQUIRED"]),
        "createdAt": generate_timestamp()
    }

def generate_dummy_case_detail() -> Dict[str, Any]:
    """Generate dummy case detail."""
    statuses = ["NEW", "IN_PROGRESS", "RESOLVED", "ESCALATED", "CLOSED"]
    priorities = ["High", "Medium", "Low"]
    
    return {
        "id": random.randint(1000, 9999),
        "entityId": random.randint(1000, 9999),
        "customerId": random.randint(1000, 9999),
        "parentAlertId": random.randint(1000, 9999),
        "status": random.choice(statuses),
        "priority": random.choice(priorities),
        "assignedTo": random.randint(1000, 9999),
        "age": "2 days",
        "resolutionType": "Resolved as False Positive",
        "linkedCases": [
            {
                "id": random.randint(1000, 9999),
                "linkedAt": generate_timestamp() - random.randint(0, 86400)
            }
        ],
        "createdAt": generate_timestamp() - random.randint(0, 86400 * 30),
        "updatedAt": generate_timestamp()
    }

# Decorator for logging requests
def log_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger.info(f"Request: {request.method} {request.path}")
        if request.is_json:
            logger.info(f"Request body: {request.get_json()}")
        return f(*args, **kwargs)
    return decorated_function

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify(generate_dummy_error("NOT_FOUND", "Resource not found")), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify(generate_dummy_error("INTERNAL_ERROR", "Internal server error")), 500

# Default route
@app.route('/')
def index():
    return jsonify({
        "name": "FRM Case Management API",
        "version": "1.0.0",
        "status": "running"
    })

# API Endpoints
@app.route('/cases', methods=['GET'])
@log_request
def list_cases():
    # Get query parameters with defaults
    page = int(request.args.get('page', 1))
    page_size = min(int(request.args.get('pageSize', 20)), 100)
    status = request.args.get('status')
    priority = request.args.get('priority')
    
    # Generate dummy data
    cases = [generate_dummy_case_summary() for _ in range(page_size)]
    
    # Apply filters if provided
    if status:
        cases = [case for case in cases if case['status'] == status]
    if priority:
        cases = [case for case in cases if case['priority'] == priority]
    
    return jsonify({
        "data": cases,
        "pagination": generate_dummy_pagination(page, page_size)
    })

@app.route('/cases/summary', methods=['GET'])
@log_request
def get_case_summary():
    # Generate dummy status summaries
    summaries = [generate_dummy_case_status_summary() for _ in range(5)]  # One for each status
    
    return jsonify({
        "data": summaries,
        "totalCases": sum(summary['count'] for summary in summaries),
        "lastUpdated": generate_timestamp()
    })

@app.route('/cases/<int:id>', methods=['GET'])
@log_request
def get_case_detail(id):
    return jsonify(generate_dummy_case_detail())

@app.route('/cases/<int:id>/comments', methods=['GET'])
@log_request
def list_case_comments(id):
    # Get pagination parameters
    page = int(request.args.get('page', 1))
    page_size = min(int(request.args.get('pageSize', 20)), 100)
    
    # Generate dummy comments
    comments = [generate_dummy_comment() for _ in range(page_size)]
    
    return jsonify({
        "data": comments,
        "pagination": generate_dummy_pagination(page, page_size)
    })

@app.route('/cases/<int:id>/comments', methods=['POST'])
@log_request
def create_case_comment(id):
    if not request.is_json:
        return jsonify(generate_dummy_error("INVALID_REQUEST", "Request must be JSON")), 400
    
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['header', 'content']):
        return jsonify(generate_dummy_error("INVALID_REQUEST", "Missing required fields")), 400
    
    # Generate dummy comment with provided data
    comment = generate_dummy_comment()
    comment['header'] = data['header']
    comment['content'] = data['content']
    
    return jsonify(comment), 201

@app.route('/cases/<int:case_id>/comments/<int:comment_id>', methods=['GET'])
@log_request
def get_case_comment(case_id, comment_id):
    return jsonify(generate_dummy_comment())

@app.route('/cases/<int:case_id>/comments/<int:comment_id>', methods=['PUT'])
@log_request
def update_case_comment(case_id, comment_id):
    if not request.is_json:
        return jsonify(generate_dummy_error("INVALID_REQUEST", "Request must be JSON")), 400
    
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['header', 'content']):
        return jsonify(generate_dummy_error("INVALID_REQUEST", "Missing required fields")), 400
    
    # Generate dummy comment with provided data
    comment = generate_dummy_comment()
    comment['header'] = data['header']
    comment['content'] = data['content']
    
    return jsonify(comment)

@app.route('/customers/<int:id>', methods=['GET'])
@log_request
def get_customer(id):
    return jsonify(generate_dummy_customer())

@app.route('/alerts/<int:id>', methods=['GET'])
@log_request
def get_alert(id):
    return jsonify(generate_dummy_alert())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=13000) 
