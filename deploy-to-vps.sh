#!/bin/bash
# ==============================================================================
# Script Sinkronisasi / Deploy Source Code dari Komputer Lokal ke VPS
# ==============================================================================

if [ -z "$1" ]; then
    echo "⚠️ Penggunaan: ./deploy-to-vps.sh [IP_VPS_ANDA]"
    echo "Contoh: ./deploy-to-vps.sh 103.123.45.67"
    exit 1
fi

VPS_IP=$1
VPS_USER=${2:-"root"}
DEST_DIR="/var/www/miracleweb"

echo "🚀 Memulai proses upload ke VPS ($VPS_USER@$VPS_IP:$DEST_DIR)..."

# Pastikan folder tujuan ada di VPS
ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "mkdir -p $DEST_DIR"

# Rsync file project tanpa node_modules dan cache
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '.DS_Store' \
    ./ "$VPS_USER@$VPS_IP:$DEST_DIR/"

echo "📦 Menginstall dependencies & build di server VPS..."
ssh "$VPS_USER@$VPS_IP" "bash -c '
    cd $DEST_DIR && \
    npm install && \
    npm run build && \
    pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js && \
    pm2 save
'"

echo "🎉 DEPLOY BERHASIL! Website telah terupdate dan aktif di VPS."
