"""
Simplified test for /scan endpoint
"""
import requests

url = "http://localhost:8000/api/v1/pokemon/scan"

# Login
login_response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    json={"username": "Divyanshu1218", "password": "abcd@1234"}
)

token = login_response.json()['access_token']
headers = {"Authorization": f"Bearer {token}"}

# Scan
with open('mockimage.png', 'rb') as f:
    files = {'file': ('mockimage.png', f, 'image/png')}
    response = requests.post(url, files=files, headers=headers)

print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
