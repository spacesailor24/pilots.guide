#!/bin/bash

echo "🚀 Setting up Pilot's Guide Database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.local.example .env
  echo "⚠️  Please update .env with your Discord OAuth credentials"
fi

echo "✅ Database is running!"
echo ""
echo "Next steps:"
echo "1. Run: pnpm prisma migrate dev"
echo "2. Run: pnpm prisma db seed (after creating seed file)"
echo ""
echo "Database URL: postgresql://pilotsguide:pilotsguide_password@localhost:5432/pilotsguide"
echo ""
echo "To stop the database: docker-compose down"
echo "To stop and remove data: docker-compose down -v"