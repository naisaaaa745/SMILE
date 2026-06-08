import json
import sqlite3
from app import app, DATABASE, init_db

def test_smile_backend():
    # Setup clean test db
    init_db()
    
    # Use Flask test client
    with app.test_client() as client:
        # 1. Clean the users table first to avoid duplicate errors from previous runs
        with sqlite3.connect(DATABASE) as conn:
            conn.execute("DELETE FROM users WHERE username = 'testuser'")
            conn.commit()
            
        # 2. Test Register
        print("Testing POST /api/register...")
        resp = client.post('/api/register', json={
            "username": "testuser",
            "password": "mypassword123",
            "jenis_disabilitas": "Tunarungu"
        })
        print(f"Register status: {resp.status_code}, data: {resp.get_data(as_text=True)}")
        assert resp.status_code == 201
        
        # Test Duplicate Register
        print("Testing POST /api/register (duplicate)...")
        resp = client.post('/api/register', json={
            "username": "testuser",
            "password": "mypassword123",
            "jenis_disabilitas": "Tunarungu"
        })
        print(f"Duplicate Register status: {resp.status_code}, data: {resp.get_data(as_text=True)}")
        assert resp.status_code == 400
        
        # 3. Test Signin Success
        print("Testing POST /api/signin (success)...")
        resp = client.post('/api/signin', json={
            "username": "testuser",
            "password": "mypassword123"
        })
        print(f"Signin success status: {resp.status_code}, data: {resp.get_data(as_text=True)}")
        assert resp.status_code == 200
        
        # Test Signin Fail
        print("Testing POST /api/signin (failure)...")
        resp = client.post('/api/signin', json={
            "username": "testuser",
            "password": "wrongpassword"
        })
        print(f"Signin failure status: {resp.status_code}, data: {resp.get_data(as_text=True)}")
        assert resp.status_code == 401
        
        # 4. Test Text STT
        print("Testing POST /api/talkspace/stt (text)...")
        resp = client.post('/api/talkspace/stt', json={
            "text": "halo"
        })
        print(f"STT text status: {resp.status_code}, data: {resp.get_data(as_text=True)}")
        assert resp.status_code == 200
        assert "Halo!" in resp.get_json()["reply"]

        print("All local endpoint tests passed successfully!")

if __name__ == "__main__":
    test_smile_backend()
