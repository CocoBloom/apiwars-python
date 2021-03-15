import connection


@connection.connection_handler
def get_password(cursor, username):
    query = """
    SELECT user_password 
    FROM registration
    WHERE user_name = %(username)s"""
    cursor.execute(query, {"username": username})
    password = cursor.fetchone()['user_password']
    print(password)
    return password

@connection.connection_handler
def get_usernames(cursor, user_name):
    query = """SELECT user_name FROM users"""
    cursor.execute(query)
    user_names = cursor.fetchall()
    for user in user_names:
        if user['user_name'] == user_name:
            return False
    return True