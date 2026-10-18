# Một khu vườn nhỏ, dành riêng cho em ✿

**Bản cập nhật ngày 18/10/2026:** giải nén vào một thư mục mới và mở **index.html** để chạy thử; không cần npm hay máy chủ. Bản này đã có sẵn đúng **config.js, 12 ảnh, ảnh riêng cho thiệp mời, nhạc và câu chữ trong file RAR bạn gửi**. Không cần chép cấu hình mẫu hay chọn ảnh lại. Giữ thư mục cũ làm bản dự phòng.

## Khung ảnh cũ và không gian thơ mộng

Ảnh nhỏ bên trong cả 12 lá thư đã trở về đúng kích thước của bản trước: khung rộng **112px**, ảnh cao **116px** trên máy tính; khung rộng **96px**, ảnh cao **97px** trên màn hình không quá 740px. Không còn quy tắc kéo khung thành 75% chiều ngang. Phần ảnh này không chạy hiệu ứng phóng to; bấm vào vẫn xem được toàn bộ ảnh gốc. Album chính và ảnh riêng của thiệp mời được giữ như bản trau chuốt.

Tim bay liên tục ở mép trang và vùng hình minh họa trong thư; có thêm bong bóng, cánh hoa, đốm sáng, đường sáng chạy quanh hình trái tim và quầng sáng dịu sau hoa. Mỗi lần mở quà, hiện lời chúc, đọc thư, hoa nở hoặc nhận lời hẹn đều có một đợt hiệu ứng nhỏ. Lá thư về trăng, sao và âm nhạc có những hạt trang trí tương ứng.

Các lớp trang trí không nhận chuột hoặc bàn phím. Hạt trang trí nền được tạo một lần, không thêm vòng vẽ JavaScript; các đợt hiệu ứng có giới hạn và được dọn khi đóng thư hoặc rời tab. Có sẵn chế độ ít hiệu ứng và hỗ trợ giảm chuyển động của hệ điều hành.

Chỉnh riêng kích thước ảnh tại **dreamscape.css → mục 01 và 04**; chỉnh hiệu ứng mới tại **dreamscape.css** và **romantic-details.js**. Mức hiệu ứng vẫn chọn trong setup.html, lưu và thay config.js.

## Giao diện đã trau chuốt

- Bộ chữ mới có đầy đủ tiếng Việt, chữ nghiêng thật cho tiêu đề và chữ ký; tất cả phông đã được nhúng để mở offline.
- Nền tím mận, giấy kem và hồng phấn; cỡ chữ, khoảng cách đoạn và nút bấm được chỉnh đồng bộ cho máy tính và điện thoại.
- Màn phong bì đầu vẫn giữ đúng cấu trúc bạn đã chọn. Các câu chữ trong index.html, cấu hình và 12 lá thư được giữ nguyên.
- Dải tiến độ 12 lá thư hiện rõ trang đang đọc và những thư đã hoàn thành. Thư chỉ chuyển sau khi người xem bấm đọc xong.
- Viền sáng, hoa nở, tim và cánh hoa quanh mép, chuyển trang giấy và nét gạch dưới chữ ký. Hiệu ứng có giới hạn, tự dọn khi rời tab và tôn trọng chế độ giảm chuyển động.
- Ảnh có vùng riêng cho chú thích. Lời nhắn bên dưới phong bì của thiệp mời được chừa khoảng cách; ảnh gốc và dữ liệu ảnh không bị sửa.

### Các chỗ chỉnh nhanh

| Muốn sửa | Nơi chỉnh |
| --- | --- |
| Lời chúc, lá thư chính, tên, chú thích ảnh, lời mời | setup.html hoặc config.js |
| 12 lá thư trong hoa | surprises.js |
| Bảng màu chung | polish.css, mục 01 |
| Cỡ chữ và khoảng cách từng phần | polish.css, mục 02–08 |
| Chuyển động và thời gian hiệu ứng CSS | polish.css, mục 09 |
| Mức hiệu ứng, tốc độ chạy ảnh và âm lượng | setup.html, lưu và thay config.js |

Kiểm tra đã thực hiện: cú pháp các file JS; hành trình từ mở quà đến đọc đủ 12 thư, ảnh riêng và quay lại đầu; phát/dừng nhạc và âm lượng; album lặp và tạm dừng; xuất cấu hình; giới hạn và dọn hiệu ứng; dữ liệu ảnh/nhạc/nội dung khớp bản gốc; độ tương phản chữ chính và đủ ký tự tiếng Việt của cả bốn phông. Kiểm tra hành vi dùng mô phỏng DOM và đồng hồ; chưa kiểm tra bằng trình duyệt thực tế trong môi trường này.

## Một ảnh riêng cho lời hẹn, một nút nhỏ để xem lại

Trong **setup.html → mục 05**, chọn **Một tấm ảnh riêng cho thiệp mời**. Ảnh được nhúng nguyên dữ liệu vào config.js và giữ độc lập với 12 ảnh trong album. Có thể chỉnh chú thích và vị trí trong khung; bấm ảnh trên thiệp để xem nguyên khung gốc. Nếu chưa chọn ảnh, thiệp dùng một khung lời nhắn riêng và không lấy tấm cuối của album.

Sau khi đọc đủ 12 thư, nút quay về đầu được giấu dưới một trái tim nhỏ. Rê chuột hoặc dùng Tab để hiện **Em muốn coi lại hong ???**; trên màn hình cảm ứng, câu hỏi hiện nhẹ để có thể chạm. Nút này cũng có trong thiệp mời. Bấm để khép thiệp, dừng nhạc, đưa nhạc về đầu và quay về màn chạm mở thiệp ban đầu. Toàn bộ ảnh và nội dung được giữ nguyên; tiến độ đọc được đặt lại.

Chữ ký trong thư chính, 12 lá thư và thiệp mời chỉ hiện **Minh Đức**. Màn đầu giữ các câu chữ và cách trình bày đã được cá nhân hóa.

Viền thiệp, dấu sáp, bông hoa đang đến lượt, khung ảnh và lời đáp có thêm chuyển động nhẹ. Trái tim, cánh hoa và ánh sao xuất hiện ở mép khi mở thư hoặc nhận lời hẹn; số hiệu ứng được giới hạn và giản lược khi bật giảm chuyển động.

## Mở đầu giữ nguyên mẫu chạm mở thiệp

Màn đầu giữ đúng mẫu phong bì màu kem, dấu sáp trái tim, lời dẫn và nút mở quà của bản trước. Chạm nút để phát nhạc, phong bì mở rồi vào phần chính; lời chúc xuất hiện sau 3 giây. Chỉnh phần này ở mục 00 của setup.html.

## Vườn 12 bông hoa nằm sau lá thư chính

1. Mở thiệp đầu, đọc lời chúc và lá thư chính.
2. Bấm nhận phần quà tiếp theo để đến vườn 12 nụ hoa. Từng nụ lớn lên và nở, mỗi bông giữ **một lá thư**, theo đúng số 01–12.
3. Bông 01 mở thư 01. Đọc xong, tiếp tục đến thư 02, rồi lần lượt hết cả 12. Những thư chưa đến lượt được khóa để giữ thứ tự; thư đã đọc vẫn có thể mở lại từ bông tương ứng.
4. Mỗi lá thư giữ nguyên hình minh họa và lời nhắn, đồng thời có một ảnh trong album đi cùng. Bấm ảnh để xem nguyên khung gốc; cả 12 ảnh vẫn có trong album và dải ảnh liên tục.
5. Ở thư 12, bấm **Em đã đọc xong, mình đến lời hẹn nhé** để khép các lời nhắn bằng hiệu ứng, rồi tự mở thiệp mời buổi tiệc.

Mỗi trang chờ cô ấy chủ động đọc tiếp. Vườn hoa ở khúc sau không thay màn mở thiệp đầu tiên.

## Đủ mọi phần quà và minh họa đã làm

| Trang | Món quà và minh họa |
| --- | --- |
| 01 | Tulip hồng |
| 02 | Hoa hồng |
| 03 | Hoa cúc |
| 04 | Lavender |
| 05 | Bầu trời sao và chòm sao được thắp sáng |
| 06 | Thỏ ôm trái tim, những vòng dịu dàng lan ra |
| 07 | Lọ điều tốt lành với ánh sáng bay lên |
| 08 | Vầng trăng, biển và lời nhắn bình yên |
| 09 | Hộp nhạc, đĩa nhạc quay và nốt nhạc |
| 10 | Bóng bay điều ước |
| 11 | Phong bì mở và tấm thiệp lời hẹn |
| 12 | Cỏ bốn lá và lời chúc may mắn |

Cả 12 lá thư giữ nguyên đầy đủ các đoạn lời nhắn dài và hình minh họa của bản trước. Các tranh trái tim, vườn trăng, vườn hoa, cành hoa và thỏ vẫn được giữ trong assets. Phong bì ở màn chào cũ được chuyển thành hình kỷ niệm bên lá thư. Album, dải ảnh trong thư và dải ảnh cạnh các trang quà tiếp tục dùng toàn bộ ảnh hiện có.

## Chọn ảnh và chỉnh nội dung

Mở **setup.html**:

- **00:** tiêu đề, lời dẫn và chữ trên nút mở thiệp đầu tiên.
- **01:** tên người nhận/người gửi và lời chúc.
- **02:** đủ 12 ảnh, chú thích, vị trí khuôn mặt và thứ tự. Ảnh được nhúng nguyên dữ liệu; không sửa khuôn mặt hay chỉnh ảnh nguồn. Các bông hoa giữ lá thư. Ảnh đi kèm thư và album chỉ được đổi khung trình bày; cửa sổ xem lớn hiển thị toàn bộ khung ảnh gốc.
- **03:** tông màu, mức chuyển động, nhạc và tốc độ album.
- **04:** lá thư chính và lời nhắn tặng quà.
- **05:** ảnh riêng của thiệp mời, tiêu đề, toàn bộ thư mời, giờ, nơi hẹn, lời nhắc đáng yêu và thời gian chuyển sang thiệp (0,6–3 giây, mặc định 1,6 giây).

Bấm lưu để tải config.js. Chép file đó vào thư mục website, thay cấu hình cũ; giữ đúng tên **config.js**, bỏ phần (1) nếu trình duyệt tự thêm. Sau đó mở lại index.html hoặc nhấn Ctrl + F5.

Nên chọn đủ 12 ảnh để mỗi lá thư có một ảnh đi kèm riêng. Nếu chưa đủ, những ô còn thiếu dùng tranh minh họa có sẵn; các ảnh đã thêm vẫn giữ đúng vị trí. Nếu một ảnh bị lỗi tải, ô ảnh được giữ lại và có thể thử mở ảnh lớn; dữ liệu nguồn không bị xóa.

Giới hạn: JPG/PNG/WEBP, 8 MB mỗi ảnh, tối đa 24 MB tổng dữ liệu và 12 ảnh. Trang thiết lập chỉ tạo file trên máy.

## Thư mời buổi tiệc

Thư mời mời cô ấy xuống dưới, nơi có một chàng trai đợi với món quà đặc biệt và buổi tiệc nhỏ đã chuẩn bị. Bạn có thể sửa toàn bộ nội dung trong mục 05. Giờ/nơi hẹn/lời nhắc để trống sẽ được ẩn.

Nút **Em xuống gặp anh đây** chỉ hiện một lời đáp ngọt ngào trên trang; không gửi tin nhắn hay thông báo. Các hoa đã đọc vẫn mở lại đúng lá thư. Nút trái tim bí mật ở phần kết đưa toàn bộ câu chuyện về màn chạm mở thiệp đầu tiên.

Để xem riêng thư mời đã lưu, dùng liên kết trong mục 05 hoặc mở **index.html?preview=invitation**. Khi gửi cho người nhận, dùng index.html để đi trọn hành trình.

## Chuyển động và âm thanh

Mẫu mở đầu là thiệp phong bì như bản cũ. Vườn hoa được đặt ở phần sau lá thư chính. Các hiệu ứng tim, bong bóng, cánh hoa, bướm và sao của những phần sau vẫn được giữ. Cùng một album 12 ảnh chạy xuyên qua lời chúc, thư và quà; có nút dừng riêng.

Nhạc bắt đầu từ lần bấm mở thiệp đầu tiên. Nếu trình duyệt chưa phát được, bấm nút phát để thử lại; vườn hoa vẫn nở. Điều khiển nhạc trên trang chính có phát/dừng và âm lượng. Thiết bị bật giảm chuyển động sẽ có phiên bản giản lược; các ảnh và nội dung vẫn đủ.

Tất cả font tiếng Việt và hình trang trí đều có sẵn trong gói để chạy offline.

## Đưa lên GitHub Pages

Tải toàn bộ các tệp đã giải nén và thư mục assets lên website, dùng config.js đã cá nhân hóa. Giữ index.html ở thư mục gốc. Các tệp chính gồm:

- index.html, styles.css, romance.css, experience.css, surprises.css, invitation.css, welcome.css, garden.css, romantic-details.css
- app.js, welcome.js, garden.js, romantic-details.js, album.js, love-effects.js, surprises.js, config.js
- music.mp3, assets/, FONT_LICENSE.txt
- setup.html, setup.js, studio.css để chỉnh nội dung, chọn ảnh riêng cho thiệp mời và dùng lại

Ảnh nhúng trong config.js sẽ trở thành một phần của website khi bạn đưa các tệp lên hosting.

## Kiểm tra

Đã kiểm tra cú pháp, ID, tài nguyên và SVG; mô phỏng đủ mẫu mở thiệp cũ, vườn 12 bông hoa/12 lá thư, ảnh lớn, nhạc, các thứ tự cố định, đọc lại, tạm khép rồi đọc tiếp, ngăn bấm trùng, đọc hết mới chuyển sang thiệp, hủy chuyển cảnh khi xem lại, giảm chuyển động và tương thích cấu hình cũ. Đã đối chiếu để giữ nguyên mọi lời nhắn, bộ minh họa cũ và dữ liệu 12 ảnh khi xuất cấu hình.

Đã kiểm tra thêm: ảnh thiệp mời tách khỏi album, lưu/xóa ảnh riêng vẫn giữ đủ 12 ảnh, chữ ký Minh Đức, nút bí mật về đúng màn đầu, hủy bộ hẹn giờ khi khởi động lại, đóng các cửa sổ ảnh/thư đang mở và giới hạn hiệu ứng.

Phiên này chưa có công cụ kiểm tra giao diện bằng trình duyệt thực tế. Hãy mở thử trên máy và điện thoại trước khi gửi.
