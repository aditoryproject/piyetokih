#!/bin/bash
# ==============================================================================
# Script Otomasi Instalasi Server VPS - Film PIYE TO KIH? (Miracle Pictures)
# OS Support: Ubuntu 20.04 / 22.04 / 24.04 LTS, Debian 11 / 12
# ==============================================================================

set -e

echo "🚀 Memulai Instalasi Server Web Miracle Pictures..."

# 1. Update OS Packages
echo "📦 [1/6] Memperbarui paket sistem..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw nginx certbot python3-certbot-nginx

# 2. Install Node.js 20 LTS
echo "🟢 [2/6] Memasang Node.js v20 LTS & npm..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "Versi Node.js: $(node -v)"
echo "Versi NPM: $(npm -v)"

# 3. Install PM2 Process Manager Global
echo "⚡ [3/6] Memasang PM2 Process Manager..."
sudo npm install -g pm2

# 4. Setup Firewall
echo "🛡️ [4/6] Mengonfigurasi UFW Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable || true

# 5. Konfigurasi Nginx
echo "🌐 [5/6] Mengonfigurasi Nginx Reverse Proxy..."
DOMAIN_NAME=${1:-"piyetokihfilm.com"}

sudo tee /etc/nginx/sites-available/miracleweb > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME *.$DOMAIN_NAME;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/miracleweb /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Server Nginx berhasil dikonfigurasi untuk domain: $DOMAIN_NAME (termasuk subdomain *.$DOMAIN_NAME)"
echo ""
echo "🎉 PERSYARATAN SERVER SELESAI DIPASANG!"
echo "Langkah selanjutnya:"
echo "1. Upload source code ke folder /var/www/miracleweb"
echo "2. Jalankan: cd /var/www/miracleweb && npm install && npm run build"
echo "3. Jalankan: pm2 start ecosystem.config.js && pm2 save && pm2 startup"
echo "4. (Opsional) Pasang SSL HTTPS: sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
