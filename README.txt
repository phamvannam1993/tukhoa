Chép đè 2 file này vào dự án hiện tại:
- app/api/keywords/research/route.ts
- components/KeywordTool.tsx

Sau đó chạy:
rm -rf .next
npm run build
pm2 restart tukhoa-web --update-env

Kiểm tra API:
curl -X POST http://127.0.0.1:3000/api/keywords/research -H 'Content-Type: application/json' -d '{"seed":"toán lớp 1","sources":["google","youtube"],"language":"vi"}'
