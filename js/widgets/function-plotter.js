export function initPlotWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = container.querySelector('.plot-canvas');
    const ctx = canvas.getContext('2d');
    const input = container.querySelector('.func-input');
    const btn = container.querySelector('.btn-plot');

    let scale = 40, offsetX = 0, offsetY = 0;
    let isDragging = false, lastX, lastY;

    // --- Parser toán học an toàn (Không eval) ---
    function safeEval(expr, xValue) {
        // Hỗ trợ cơ bản: +, -, *, /, ^, sin, cos, x
        // Tokenizer đơn giản
        const tokens = expr.replace(/\s+/g, '').match(/(sin|cos|x|\d+\.?\d*|[\+\-\*\/\^\(\)])/g) || [];
        // Shunting-yard giản lược (Bỏ qua xử lý lỗi chi tiết để tối ưu độ dài)
        let out = [], op = [];
        const prec = {'+':1, '-':1, '*':2, '/':2, '^':3, 'sin':4, 'cos':4};

        tokens.forEach(t => {
            if (!isNaN(t)) out.push(parseFloat(t));
            else if (t === 'x') out.push(xValue);
            else if (t === '(') op.push(t);
            else if (t === ')') {
                while(op.length && op[op.length-1] !== '(') out.push(op.pop());
                op.pop();
            }
            else {
                while(op.length && prec[op[op.length-1]] >= prec[t] && t !== '^') out.push(op.pop());
                op.push(t);
            }
        });
        while(op.length) out.push(op.pop());

        // RPN Evaluator
        let stack = [];
        out.forEach(t => {
            if (typeof t === 'number') stack.push(t);
            else if (t === 'sin') stack.push(Math.sin(stack.pop()));
            else if (t === 'cos') stack.push(Math.cos(stack.pop()));
            else {
                let b = stack.pop(), a = stack.pop();
                if(t==='+') stack.push(a+b); else if(t==='-') stack.push(a-b);
                else if(t==='*') stack.push(a*b); else if(t==='/') stack.push(a/b);
                else if(t==='^') stack.push(Math.pow(a,b));
            }
        });
        return stack[0] || 0;
    }

    function draw() {
        canvas.width = container.clientWidth;
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Vẽ lưới và trục tọa độ
        const originX = w/2 + offsetX, originY = h/2 + offsetY;
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border').trim();
        ctx.beginPath();
        ctx.moveTo(0, originY); ctx.lineTo(w, originY); // Trục X
        ctx.moveTo(originX, 0); ctx.lineTo(originX, h); // Trục Y
        ctx.stroke();

        // Vẽ đồ thị
        const expr = input.value || '0';
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
        ctx.lineWidth = 2;
        ctx.beginPath();

        let first = true;
        for (let px = 0; px < w; px++) {
            const mathX = (px - originX) / scale;
            try {
                const mathY = safeEval(expr, mathX);
                const py = originY - mathY * scale;
                if(isNaN(py)) continue;
                if (first) { ctx.moveTo(px, py); first = false; }
                else { ctx.lineTo(px, py); }
            } catch (e) { break; }
        }
        ctx.stroke();
    }

    // Tương tác chuột
    canvas.addEventListener('mousedown', e => { isDragging = true; lastX = e.offsetX; lastY = e.offsetY; });
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
    canvas.addEventListener('mousemove', e => {
        if (!isDragging) return;
        offsetX += e.offsetX - lastX; offsetY += e.offsetY - lastY;
        lastX = e.offsetX; lastY = e.offsetY;
        draw();
    });
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const zoom = Math.exp(-e.deltaY * 0.001);
        scale *= zoom;
        draw();
    });

    btn.addEventListener('click', draw);
    input.addEventListener('keydown', e => e.key === 'Enter' && draw());

    // Khởi tạo kích thước ban đầu
    setTimeout(draw, 100);
}