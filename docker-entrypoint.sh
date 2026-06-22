#!/bin/sh

# Kiá»ƒm tra xem cÃ³ cáº¥u hÃ¬nh DATABASE_URL hay khÃ´ng
if [ -n "$DATABASE_URL" ]; then
  echo "--- 1. Äang kiá»ƒm tra káº¿t ná»‘i Database... ---"
  node scripts/wait-for-db.js
  
  echo "--- 2. Cháº¡y DB Migration (Create Schema & Seed)... ---"
  npm run db:migrate
fi

echo "--- 3. Khá»Ÿi Ä‘á»™ng á»©ng dá»¥ng... ---"
exec "$@"
