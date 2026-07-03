# Bé Học Tiếng Anh

Web app học tiếng Anh cho trẻ lớp 1-2 theo lộ trình Pre-A1. App chạy local trên Windows, có hồ sơ bé, roadmap, bài học nghe-nói, quiz, lưu tiến độ trên trình duyệt, dashboard phụ huynh và màn hình admin cơ bản.

## Cách chạy nhanh trên Windows

1. Mở thư mục project.
2. Double-click `run.bat`.
3. Chờ cửa sổ chạy xong bước kiểm tra.
4. Trình duyệt sẽ tự mở `http://localhost:3000`.

Nếu trình duyệt không tự mở, sếp Tuấn mở Chrome/Edge rồi nhập:

```text
http://localhost:3000
```

## Nếu báo thiếu Node.js

Sếp cài Node.js bản LTS tại:

```text
https://nodejs.org
```

Sau đó double-click lại `run.bat`.

## Cách chạy bằng terminal

```bash
npm install
npm run dev
```

## Chức năng đã có

- Trang chủ tiếng Việt theo phong cách web học có phí.
- Tạo hồ sơ bé, chọn lớp 1 hoặc lớp 2.
- Roadmap 20 bài cho mỗi lớp, tổng 40 bài học.
- Mỗi bài có tối thiểu 8 từ vựng kèm nghĩa, ví dụ và hình/emoji minh họa.
- Mỗi bài có 24 câu mẫu luyện nói theo dạng hỏi-đáp ngắn.
- Mỗi bài có 3 tình huống hội thoại: ở lớp, ở nhà và mini role-play.
- Có quy trình học 12 phút: warm-up, listen, speak, role-play.
- Màn bài học dạng game qua màn, mỗi màn chỉ có một nhiệm vụ lớn:
  - Chuẩn bị: cô giáo giới thiệu nhiệm vụ.
  - Màn 1: bấm thẻ từ, nghe từng từ và qua thẻ tiếp theo.
  - Màn 2: hỏi đáp giao tiếp tự nhiên như `What's your name?` → `My name is Anna.`, `How are you?` → `I am happy.`
  - Màn 3: nghe câu mẫu, bé nói lại rồi bấm xác nhận.
  - Nhận thưởng: hiện cúp, sao, nút làm quiz hoặc chơi lại.
- Có video YouTube nhúng theo chủ đề.
- Có nút nghe cho chủ đề, từ vựng, câu ví dụ, câu mẫu và hội thoại.
- Có 3 chế độ giọng đọc: tự nhiên, nghe chậm, lặp 2 lần.
- Quiz 5 câu mỗi bài.
- Lưu điểm, sao, số lần làm và thời gian học bằng `localStorage`.
- Dashboard phụ huynh.
- Admin cơ bản để xem lesson, vocabulary và quiz.

## Lưu ý về video và âm thanh

- Video cần có mạng Internet vì đang nhúng từ YouTube.
- Nếu video không hiện, sếp kiểm tra mạng hoặc thử mở bằng Chrome/Edge.
- Nút nghe dùng Web Speech của trình duyệt. Chất lượng giọng phụ thuộc voice tiếng Anh có sẵn trên máy/trình duyệt.
- App đã ưu tiên voice tiếng Anh tự nhiên hơn nếu máy có sẵn và mặc định đọc chậm hơn để bé dễ nhại lại.

## Cấu trúc chính

```text
app/                 Màn hình chính và style global
components/ui/       Component giao diện dùng lại
lib/                 Dữ liệu seed và hàm tiện ích
types/               Kiểu dữ liệu TypeScript
supabase/            Migration và seed mẫu
docs/                Hướng dẫn deploy
```
