#!/bin/bash

echo "🔄 Pushing schema changes..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npx tsx prisma/seed.ts

echo "✅ Database seed completed!"