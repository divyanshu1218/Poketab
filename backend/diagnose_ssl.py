"""
SSL Certificate Diagnostic Tool for Python
Run this to test SSL connectivity and identify issues
"""

import ssl
import socket
import sys
from datetime import datetime

def diagnose_ssl(hostname="pokeapi.co", port=443):
    print("=== SSL Certificate Diagnostics ===")
    print(f"Target: https://{hostname}:{port}\n")
    
    try:
        # Create SSL context
        context = ssl.create_default_context()
        
        # Connect
        with socket.create_connection((hostname, port), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                
                print("=== Certificate Details ===")
                print(f"Subject: {dict(x[0] for x in cert['subject'])}")
                print(f"Issuer: {dict(x[0] for x in cert['issuer'])}")
                print(f"Version: {cert['version']}")
                print(f"Serial Number: {cert['serialNumber']}")
                print(f"Not Before: {cert['notBefore']}")
                print(f"Not After: {cert['notAfter']}")
                print()
                
                print("=== Subject Alternative Names ===")
                for san in cert.get('subjectAltName', []):
                    print(f"  → {san[0]}: {san[1]}")
                print()
                
                print("✅ SSL connection successful!")
                print("Python can verify this certificate.")
                return True
                
    except ssl.SSLCertVerificationError as e:
        print("❌ SSL Certificate Verification Failed!")
        print(f"Error: {e}")
        print()
        print("=== Diagnosis ===")
        print("Python's SSL module cannot verify the certificate chain.")
        print("This usually means:")
        print("  1. Corporate proxy/antivirus is intercepting SSL")
        print("  2. Custom root CA not in Python's trust store")
        print("  3. Outdated certifi bundle")
        print()
        print("=== Recommended Fix ===")
        print("1. Run diagnose_ssl.ps1 to identify the root CA")
        print("2. Export the root CA from Windows Certificate Manager")
        print("3. Merge it with certifi bundle (see ssl_fix_guide.md)")
        return False
        
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return False

def check_certifi():
    print("\n=== Certifi Information ===")
    try:
        import certifi
        print(f"Certifi version: {certifi.__version__}")
        print(f"CA bundle location: {certifi.where()}")
        
        # Check if file exists and is readable
        with open(certifi.where(), 'r') as f:
            lines = f.readlines()
            print(f"CA bundle size: {len(lines)} lines")
            
            # Count certificates
            cert_count = sum(1 for line in lines if '-----BEGIN CERTIFICATE-----' in line)
            print(f"Number of certificates: {cert_count}")
    except ImportError:
        print("⚠️  certifi not installed")
        print("Install with: pip install certifi")
    except Exception as e:
        print(f"Error reading certifi bundle: {e}")

def test_httpx():
    print("\n=== Testing httpx ===")
    try:
        import httpx
        print(f"httpx version: {httpx.__version__}")
        
        # Try synchronous request
        try:
            response = httpx.get("https://pokeapi.co/api/v2/pokemon/pikachu", timeout=10)
            print(f"✅ httpx request successful! Status: {response.status_code}")
        except httpx.ConnectError as e:
            print(f"❌ httpx connection failed: {e}")
    except ImportError:
        print("⚠️  httpx not installed")

if __name__ == "__main__":
    print("Python SSL Diagnostic Tool")
    print(f"Python version: {sys.version}")
    print(f"SSL version: {ssl.OPENSSL_VERSION}\n")
    
    # Run diagnostics
    success = diagnose_ssl()
    check_certifi()
    test_httpx()
    
    print("\n=== Summary ===")
    if success:
        print("✅ No SSL issues detected")
    else:
        print("❌ SSL verification issues detected")
        print("📖 See ssl_fix_guide.md for detailed fix instructions")
