#!/bin/sh
set -e

echo "Iniciando Migracoes..."
npx prisma db push

npx prisma db seed

echo "Pronto para iniciar o servidor!"
echo "Iniciando Servidor na porta ${PORT:-10000}..."
exec npm start
