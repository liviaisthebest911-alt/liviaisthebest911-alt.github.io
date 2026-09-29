---
layout: post
title: "Mối liên hệ giữa Đạo hàm và Thuật toán Tối ưu"
date: 2026-09-30
description: Cùng sinh viên Khoa học Máy tính áp dụng Toán học vào Thuật toán.
tags: [Math, Algorithms, Java, VNU-HUS]
math: true
---

Chào mừng đến với trang blog toán học và lập trình của **Olive June Math**. Hôm nay, chúng ta sẽ áp dụng các công cụ từ Đại số Tuyến tính và Giải tích để hiểu sâu hơn về độ phức tạp của thuật toán — một phần kiến thức cực kỳ quan trọng trong môn Cấu trúc Dữ liệu và Giải thuật (DSA).

## Khái niệm hàm Big-O và Đạo hàm

Trong phân tích thời gian chạy, thay vì đếm số phép toán tuyệt đối, chúng ta thường sử dụng giới hạn hàm:

$$\lim_{n \to \infty} \frac{f(n)}{g(n)} = c$$

<blockquote class="callout theorem">
Nếu giới hạn trên là một hằng số $c > 0$, ta nói $f(n) \in \Theta(g(n))$. Để chứng minh điều này nhanh chóng, Quy tắc L'Hôpital từ giải tích là vũ khí mạnh nhất.
</blockquote>

<blockquote class="callout proof">
Xét $f(n) = \log(n!)$ và $g(n) = n \log n$. Bằng xấp xỉ Stirling, $\ln(n!) \approx n \ln n - n$, suy ra chúng có cùng tốc độ tăng trưởng.
</blockquote>

## Minh họa trực quan Bubble Sort

Để thấy rõ sự khác biệt của $O(n^2)$, hãy thử Widget sắp xếp dưới đây (code thuần Javascript, không dùng thư viện ngoài):

{% include sort-visualizer.html id="demo-1" %}

<blockquote class="callout tip">
<strong>Tip Lập Trình Java:</strong> Khi thực thi trong Java, biến nên được đặt tên rõ nghĩa bằng tiếng Anh theo quy ước chuẩn. Ví dụ: `int arraySize` thay vì `int kichThuoc`.
</blockquote>

### Code minh họa (Java)

Hiệu ứng cửa sổ Editor tự động nhận diện ngôn ngữ và highlight:

```java
public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}