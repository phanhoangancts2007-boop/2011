# Trang tri ân 20/11

## Chỉnh nội dung
Mở `config.js`: sửa lời tri ân, chữ ký, danh sách ảnh và chú thích.

## Thêm ảnh và nhạc bằng link Google Drive
Mỗi ảnh: Drive > chuột phải > Chia sẻ > "Bất kỳ ai có đường liên kết" > Sao chép liên kết, dán vào `photos` trong `config.js`. Nhạc làm tương tự rồi dán vào `music`. Phải là link từng file, không dùng link thư mục.
Drive có thể chặn khi nhiều người xem cùng lúc. Muốn chắc chắn thì tải file về bỏ vào `assets/` như dưới.

## Hoặc dùng file trong thư mục
- Ảnh: bỏ vào `assets/images/` (01.jpg ... 10.jpg), mỗi ảnh nên dưới 500KB.
- Nhạc: bỏ `nhac.mp3` vào `assets/music/`.

## Đưa lên Render (miễn phí)
1. Tạo repo GitHub, đẩy toàn bộ thư mục này lên.
2. Vào render.com, chọn New > Static Site, nối repo đó.
3. Build Command: để trống. Publish Directory: `.`
4. Bấm Create. Sau vài phút bạn có link dạng `ten-ban-chon.onrender.com`.
Muốn đổi nội dung sau này: sửa file, đẩy lên GitHub, Render tự cập nhật.

## Xem thử trên máy
Chạy `python3 -m http.server` trong thư mục này rồi mở http://localhost:8000
