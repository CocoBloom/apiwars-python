from flask import Flask, request, render_template, redirect, session, url_for, escape, flash

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route('/')
def main_page():
    return render_template('index.html');


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )
