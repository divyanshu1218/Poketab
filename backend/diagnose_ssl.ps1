# SSL Certificate Diagnostic Script
# Run this to identify the root cause of SSL verification failures

$url = "pokeapi.co"
$port = 443

Write-Host "=== SSL Certificate Diagnostics ===" -ForegroundColor Cyan
Write-Host "Target: https://$url" -ForegroundColor Yellow
Write-Host ""

try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect($url, $port)

    $sslStream = New-Object System.Net.Security.SslStream($tcpClient.GetStream(), $false)
    $sslStream.AuthenticateAsClient($url)

    $cert = $sslStream.RemoteCertificate
    $cert2 = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($cert)

    Write-Host "=== Certificate Details ===" -ForegroundColor Green
    Write-Host "Subject    : $($cert2.Subject)"
    Write-Host "Issuer     : $($cert2.Issuer)"
    Write-Host "Thumbprint : $($cert2.Thumbprint)"
    Write-Host "Valid From : $($cert2.NotBefore)"
    Write-Host "Valid To   : $($cert2.NotAfter)"
    Write-Host ""

    Write-Host "=== Certificate Chain ===" -ForegroundColor Green
    $chain = New-Object System.Security.Cryptography.X509Certificates.X509Chain
    $chain.Build($cert2) | Out-Null

    $chainElements = @()
    foreach ($element in $chain.ChainElements) {
        $chainElements += $element.Certificate
        Write-Host "  → $($element.Certificate.Subject)"
    }
    Write-Host ""

    # Get root CA
    $rootCA = $chainElements[-1]
    Write-Host "=== Root CA Identified ===" -ForegroundColor Yellow
    Write-Host "Subject: $($rootCA.Subject)"
    Write-Host "Issuer: $($rootCA.Issuer)"
    Write-Host ""

    # Check if it's a known interceptor
    $interceptors = @("Zscaler", "Fortinet", "Kaspersky", "McAfee", "Avast", "Netskope", "Palo Alto", "Cisco")
    $isIntercepted = $false
    foreach ($interceptor in $interceptors) {
        if ($rootCA.Subject -like "*$interceptor*" -or $rootCA.Issuer -like "*$interceptor*") {
            Write-Host "⚠️  SSL INTERCEPTION DETECTED: $interceptor" -ForegroundColor Red
            $isIntercepted = $true
            break
        }
    }

    if (-not $isIntercepted) {
        Write-Host "ℹ️  No known SSL interceptor detected" -ForegroundColor Cyan
    }

    Write-Host ""
    Write-Host "=== Recommended Action ===" -ForegroundColor Yellow
    if ($isIntercepted) {
        Write-Host "1. Export the root CA from Windows Certificate Manager (certmgr.msc)"
        Write-Host "2. Navigate to: Trusted Root Certification Authorities → Certificates"
        Write-Host "3. Find: $($rootCA.Subject)"
        Write-Host "4. Right-click → All Tasks → Export → Base-64 encoded X.509"
        Write-Host "5. Save to: C:\temp\custom_root_ca.cer"
    } else {
        Write-Host "1. Update certifi: pip install --upgrade certifi"
        Write-Host "2. If issue persists, export root CA as described in ssl_fix_guide.md"
    }

    $sslStream.Close()
    $tcpClient.Close()

} catch {
    Write-Host "❌ Error connecting to $url" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Review the output above"
Write-Host "2. Follow the recommended action"
Write-Host "3. See ssl_fix_guide.md for detailed instructions"
