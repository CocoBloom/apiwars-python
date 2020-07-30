from flask import Flask, render_template, redirect, request

app = Flask(__name__)
saved_data = {}


@app.route('/')
def main_page():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(
        debug=True,  # Allow verbose error reports
        port=5000  # Set custom port
    )
