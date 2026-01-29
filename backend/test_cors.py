import requests

url = "http://localhost:8000/api/v1/auth/register"
headers = {
    "Origin": "http://localhost:8081",
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "content-type"
}

response = requests.options(url, headers=headers)
print(f"Status Code: {response.status_code}")
print(f"\nResponse Headers:")
for key, value in response.headers.items():
    if 'access-control' in key.lower() or 'cors' in key.lower():
        print(f"  {key}: {value}")
