from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

def init_db():
    """Initialize the database and create the seats table if it doesn't exist."""
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS seats (
                    seat_id INTEGER PRIMARY KEY,
                    is_booked INTEGER NOT NULL
                )''')
    
    # Check if the seats table is empty, if so populate it with unbooked seats
    c.execute("SELECT COUNT(*) FROM seats")
    if c.fetchone()[0] == 0:
        for seat_id in range(1, 81):  # Create 80 seats
            c.execute("INSERT INTO seats (seat_id, is_booked) VALUES (?, ?)", (seat_id, 0))
    conn.commit()
    conn.close()

@app.route('/api/seats', methods=['GET'])
def get_seats():
    """Return the booking status of all seats."""
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("SELECT is_booked FROM seats")
        seats = [row[0] for row in c.fetchall()]
        conn.close()
        return jsonify({'seats': seats}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/book', methods=['POST'])
def book_seats():
    """Book a number of seats and return the booked seat IDs."""
    try:
        num_seats = request.json['seats']
        if not isinstance(num_seats, int) or num_seats <= 0:
            return jsonify({'error': 'Invalid number of seats requested'}), 400

        conn = sqlite3.connect('database.db')
        c = conn.cursor()

        def find_row_seats(num_seats):
            """Find available seats in the same row."""
            for row in range(12):
                start = row * 7
                end = start + 7 if row < 11 else start + 3  
                c.execute("SELECT seat_id FROM seats WHERE seat_id >= ? AND seat_id < ? AND is_booked = 0", (start+1, end+1))
                available_seats = c.fetchall()
                if len(available_seats) >= num_seats:
                    return [seat[0] for seat in available_seats[:num_seats]]
            return []

        def find_nearby_seats(num_seats):
            """Find any available seats if row seats are not available."""
            c.execute("SELECT seat_id FROM seats WHERE is_booked = 0")
            available_seats = [seat[0] for seat in c.fetchall()]
            return available_seats[:num_seats] if len(available_seats) >= num_seats else []

        seats_to_book = find_row_seats(num_seats) or find_nearby_seats(num_seats)

        if seats_to_book:
            for seat_id in seats_to_book:
                c.execute("UPDATE seats SET is_booked = 1 WHERE seat_id = ?", (seat_id,))
            conn.commit()
            booked_seats = {'booked': seats_to_book}
        else:
            booked_seats = {'booked': []}  # No seats available

        conn.close()
        return jsonify(booked_seats), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize the database
init_db()

if __name__ == '__main__':
    app.run(debug=True)
