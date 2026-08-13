---
layout: post
title: "4 tính chất cơ bản của OOP trong Java"
date: 2026-08-13 09:00:00 +0700
categories: [java, lap-trinh]
tags: [java, oop, sinh-vien-nam-nhat]
excerpt: "Tổng hợp ngắn gọn 4 trụ cột của lập trình hướng đối tượng — Tính đóng gói, Kế thừa, Đa hình, Trừu tượng — kèm ví dụ code Java thực tế."
---

Khi mới học Java, mình từng nghĩ OOP (Object-Oriented Programming) chỉ là "gói dữ liệu vào
class cho gọn". Sau vài tuần thực hành, mình nhận ra 4 tính chất cốt lõi của OOP thực ra là
một cách tư duy để mô hình hoá thế giới thực thành code dễ mở rộng, dễ bảo trì. Bài viết này
tóm tắt lại những gì mình đã học, kèm ví dụ minh hoạ.

> "Đóng gói tốt không phải là giấu code khỏi người khác, mà là giấu sự phức tạp không cần
> thiết khỏi phần còn lại của chương trình." — một câu mình rất tâm đắc khi đọc tài liệu OOP.

## 1. Tính đóng gói (Encapsulation)

Đóng gói nghĩa là ẩn dữ liệu nội bộ của một class, chỉ cho phép truy cập thông qua các
phương thức công khai (`getter`/`setter`). Điều này giúp kiểm soát cách dữ liệu được thay đổi.

```java
public class TaiKhoanNganHang {
    private double soDu; // dữ liệu private, không truy cập trực tiếp từ bên ngoài

    public TaiKhoanNganHang(double soDuBanDau) {
        this.soDu = soDuBanDau;
    }

    public double getSoDu() {
        return soDu;
    }

    public void napTien(double soTien) {
        if (soTien > 0) {
            this.soDu += soTien;
        }
    }
}
```

Nhờ `private`, không ai có thể gán trực tiếp `soDu = -1000` từ bên ngoài — mọi thay đổi đều
phải đi qua phương thức `napTien()`, nơi mình có thể kiểm tra điều kiện hợp lệ.

## 2. Tính kế thừa (Inheritance)

Kế thừa cho phép một class con (`subclass`) tái sử dụng thuộc tính và phương thức của class
cha (`superclass`), đồng thời có thể mở rộng thêm.

```java
public class DongVat {
    protected String ten;

    public DongVat(String ten) {
        this.ten = ten;
    }

    public void an() {
        System.out.println(ten + " đang ăn.");
    }
}

public class Cho extends DongVat {
    public Cho(String ten) {
        super(ten);
    }

    public void sua() {
        System.out.println(ten + " đang sủa: Gâu gâu!");
    }
}
```

`Cho` kế thừa toàn bộ từ `DongVat` (thuộc tính `ten`, phương thức `an()`) mà không cần viết
lại, chỉ cần bổ sung hành vi riêng như `sua()`.

## 3. Tính đa hình (Polymorphism)

Đa hình cho phép cùng một phương thức nhưng có hành vi khác nhau tuỳ vào đối tượng gọi nó.
Cách phổ biến nhất là **ghi đè phương thức** (`method overriding`).

```java
public class ConVat {
    public void keu() {
        System.out.println("Con vật phát ra âm thanh.");
    }
}

public class Meo extends ConVat {
    @Override
    public void keu() {
        System.out.println("Meo meo!");
    }
}

public class Vit extends ConVat {
    @Override
    public void keu() {
        System.out.println("Cạc cạc!");
    }
}
```

Khi lặp qua một danh sách `List<ConVat>` chứa cả `Meo` và `Vit`, gọi `keu()` trên từng phần
tử sẽ tự động chạy đúng phiên bản đã ghi đè — đây chính là sức mạnh của đa hình, giúp code
linh hoạt hơn khi thêm loại động vật mới mà không cần sửa logic cũ.

## 4. Tính trừu tượng (Abstraction)

Trừu tượng nghĩa là chỉ hiển thị những đặc điểm cần thiết, ẩn đi chi tiết triển khai phức tạp.
Java hỗ trợ điều này qua `abstract class` và `interface`.

```java
public abstract class HinhHoc {
    public abstract double tinhDienTich();

    public void hienThiThongTin() {
        System.out.println("Diện tích: " + tinhDienTich());
    }
}

public class HinhTron extends HinhHoc {
    private double banKinh;

    public HinhTron(double banKinh) {
        this.banKinh = banKinh;
    }

    @Override
    public double tinhDienTich() {
        return Math.PI * banKinh * banKinh;
    }
}
```

Người dùng class `HinhTron` chỉ cần gọi `tinhDienTich()` mà không cần biết công thức bên
trong được tính như thế nào — đó là bản chất của trừu tượng.

## Sơ đồ tổng quan

Dưới đây là sơ đồ mình tự vẽ để tổng hợp lại 4 tính chất (nhớ đổi đường dẫn ảnh khi bạn có
file thật, ví dụ đặt ảnh trong thư mục `assets/img/`):

![Sơ đồ 4 tính chất OOP trong Java](/assets/img/oop-java-overview.png "Tổng quan 4 tính chất OOP")

## Tổng kết

| Tính chất | Mục đích chính |
|---|---|
| Đóng gói | Kiểm soát truy cập dữ liệu |
| Kế thừa | Tái sử dụng code |
| Đa hình | Linh hoạt hành vi theo đối tượng |
| Trừu tượng | Ẩn chi tiết phức tạp |

Hiểu rõ 4 tính chất này là nền tảng để đọc hiểu và thiết kế các hệ thống Java lớn hơn sau
này. Bài viết sau mình sẽ thử áp dụng cả 4 tính chất vào một bài tập nhỏ: quản lý thư viện
sách bằng Java.