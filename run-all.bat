@echo off
echo Dang khoi dong SSB Fullstack...

concurrently ^
  "cd ssb-backend && npm run start:dev" ^
  "cd ssb-frontend && npm run dev" ^
  --names "BACKEND" "NEXTJS" ^
  --prefix-colors "red" "cyan"