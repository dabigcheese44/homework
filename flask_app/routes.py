# Author: Prof. MM Ghassemi <ghassem3@msu.edu>
from flask import current_app as app
from flask import render_template, redirect, request
from flask import send_from_directory
from .utils.database.database  import database
from werkzeug.datastructures import ImmutableMultiDict
from pprint import pprint
import json
import random
db = database()

@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	x     = random.choice(['I started university when I was a wee lad of 15 years.','I have a pet sparrow.','I write poetry.'])
	return render_template('home.html', fun_fact = x)

@app.route('/projects')
def projects():
	return render_template('projects.html')

@app.route('/piano')
def piano():
	return render_template('piano.html')

@app.route('/resume')
def resume():
	resume_data = db.getResumeData()
	pprint(resume_data)
	return render_template('resume.html', resume_data = resume_data)

@app.route('/processfeedback', methods=['POST'])
def processfeedback():
	feedback = request.form

	db.query('''
		INSERT INTO feedback (name, email, comment)
		VALUES (%s, %s, %s)
	''', [feedback['name'], feedback['email'], feedback['comment']])

	feedback_entries = db.query('SELECT * FROM feedback')

	return render_template('processfeedback.html', feedback_entries=feedback_entries)
from flask import send_from_directory

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/main/images', 'favicon.ico', mimetype='image/vnd.microsoft.icon')




