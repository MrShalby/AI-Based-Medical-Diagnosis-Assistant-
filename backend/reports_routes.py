from flask import request, jsonify
from auth_simple import require_auth, get_user_by_id

# Store reports in memory (in a real app, this would be in a database)
diagnosis_reports = {}

def get_user_reports():
    return diagnosis_reports

def init_reports_routes(app):
    @app.route('/api/reports', methods=['POST'])
    @require_auth
    def save_report():
        user = get_user_by_id(request.user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        report_data = request.json
        report_data['id'] = str(len(diagnosis_reports.get(request.user_id, [])) + 1)
        report_data['user_id'] = request.user_id

        if request.user_id not in diagnosis_reports:
            diagnosis_reports[request.user_id] = []

        diagnosis_reports[request.user_id].append(report_data)
        return jsonify(report_data), 201

    @app.route('/api/reports', methods=['GET'])
    @require_auth
    def get_user_reports():
        user = get_user_by_id(request.user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_reports = diagnosis_reports.get(request.user_id, [])
        return jsonify(user_reports)

    return app
