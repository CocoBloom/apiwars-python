from flask import Flask, request, render_template, redirect, session, url_for, escape, flash
from functools import wraps
import data_manager
import os
import util

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route('/')
def main_page():
    return render_template('index.html');


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        if data_manager.get_usernames(email) is False:
            psw = util.hash_password(password)
            reg_password = data_manager.get_password(email)
            is_matching = util.verify_password(password, reg_password)
            if is_matching:
                session['email'] = request.form['email']
                return redirect(url_for('main_page'))
            else:
                message = "Wrong e-mail or password!"
                return render_template('login_fail.html', message=message)
        else:
            message = "Wrong e-mail or password!"
            return render_template('login_fail.html', message=message)
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect(url_for('main_page'))


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )
