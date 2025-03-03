
#!/bin/bash

# Check if the certificate is already installed
CERT_DIR="/etc/letsencrypt/live/projectparadox.in"
if sudo ls "$CERT_DIR/fullchain.pem" > /dev/null 2>&1; then
  echo "Certificate already installed. Skipping Nginx and Certbot setup."
else
  # Update the system
  sudo yum update -y

  # Install Nginx
  sudo yum install -y nginx

  # Start and enable Nginx
  sudo systemctl start nginx
  sudo systemctl enable nginx

  # Install Certbot for Let's Encrypt
  sudo yum install -y certbot python3-certbot-nginx

# Configure Nginx as a reverse proxy
sudo bash -c 'cat <<EOT > /etc/nginx/conf.d/app.conf
server {
    listen 80;
    server_name projectparadox.in;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOT'

  # Reload Nginx to apply the configuration
  sudo systemctl reload nginx

  # Obtain SSL/TLS certificate from Let's Encrypt
  sudo certbot --nginx -d projectparadox.in --non-interactive --agree-tos --email rachit9910102312@gmail.com

  # Configure automatic certificate renewal
  echo "0 0 * * * /usr/bin/certbot renew --quiet" | sudo tee -a /etc/crontab > /dev/null
fi