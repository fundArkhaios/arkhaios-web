#!/bin/bash
# Check if mkcert is installed
if ! command -v mkcert &> /dev/null
then
    echo "mkcert could not be found, please install it."
    exit
fi

# Install the local CA if it's not already done
mkcert -install

# Generate the certificate and key for local.test and funds.local.test
mkcert -key-file local.test.key -cert-file local.test.crt "local.test" "funds.local.test"

# Create the certs directory if it does not exist
mkdir -p ./certs

# Move the generated certificates and key to the ./certs directory
mv local.test.key ./certs/
mv local.test.crt ./certs/

echo "Certificates for local.test and funds.local.test have been generated and moved to the ./certs directory."