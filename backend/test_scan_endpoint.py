"""
Test the complete /scan endpoint with mockimage.png
"""
import requests
import json

# API endpoint
url = "http://localhost:8000/api/v1/pokemon/scan"

# Read the image
with open('mockimage.png', 'rb') as f:
    files = {'file': ('mockimage.png', f, 'image/png')}
    
    # Get auth token first
    login_url = "http://localhost:8000/api/v1/auth/login"
    login_data = {
        "username": "Divyanshu1218",
        "password": "abcd@1234"
    }
    
    print("1. Logging in...")
    login_response = requests.post(login_url, json=login_data)
    
    if login_response.status_code == 200:
        token = login_response.json()['access_token']
        print(f"   ✓ Login successful! Token: {token[:20]}...")
        
        # Test scan endpoint
        headers = {"Authorization": f"Bearer {token}"}
        
        print("\n2. Scanning Pokemon image...")
        print(f"   Endpoint: {url}")
        print(f"   Image: mockimage.png (8265 bytes)")
        
        scan_response = requests.post(url, files=files, headers=headers)
        
        print(f"\n3. Response Status: {scan_response.status_code}")
        
        if scan_response.status_code == 200:
            data = scan_response.json()
            print("\n✓ SCAN SUCCESSFUL!")
            print(json.dumps(data, indent=2))
            
            # Verify data structure
            if 'name' in data:
                print(f"\n🎉 Pokemon identified: {data['name']}")
                print(f"   Types: {', '.join(data.get('types', []))}")
                print(f"   Abilities: {', '.join(data.get('abilities', []))}")
                print(f"   Sprite: {data.get('sprite', 'N/A')}")
        else:
            print("\n✗ SCAN FAILED!")
            print(f"Error: {scan_response.text}")
    else:
        print(f"   ✗ Login failed: {login_response.text}")
