export function initSortWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = container.querySelector('.sort-canvas');
    const ctx = canvas.getContext('2d');
    const btnPlay = container.querySelector('.btn-play');
    const btnShuffle = container.querySelector('.btn-shuffle');
    const sizeSlider = container.querySelector('.size-slider');
    const speedSlider = container.querySelector('.speed-slider');
    const algoSelect = container.querySelector('.algo-select');

    let array = [];
    let isSorting = false;
    let abortController = new AbortController();

    function resize() {
        canvas.width = container.clientWidth;
        drawArray();
    }
    window.addEventListener('resize', resize);

    function initArray() {
        if(isSorting) return;
        const size = parseInt(sizeSlider.value);
        array = Array.from({length: size}, () => Math.random() * 0.9 + 0.1);
        drawArray();
    }

    function drawArray(highlightIndices = [], swapIndices = []) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width / array.length;
        const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
        const accent2 = getComputedStyle(document.body).getPropertyValue('--accent-2').trim();

        for (let i = 0; i < array.length; i++) {
            ctx.fillStyle = swapIndices.includes(i) ? '#e2637a' : highlightIndices.includes(i) ? accent2 : accent;
            const h = array[i] * canvas.height;
            ctx.fillRect(i * w, canvas.height - h, w - 1, h);
        }
    }

    const sleep = () => new Promise(res => {
        const speed = 101 - parseInt(speedSlider.value); // 1 to 100ms
        setTimeout(res, speed);
    });

    async function checkAbort(signal) { if(signal.aborted) throw new Error('aborted'); await sleep(); }

    // Thuật toán: Bubble Sort
    async function* bubbleSort(arr) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                yield { highlight: [j, j+1] };
                if (arr[j] > arr[j+1]) {
                    [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                    yield { swap: [j, j+1] };
                }
            }
        }
    }

    // Thuật toán: Selection Sort
    async function* selectionSort(arr) {
        for (let i = 0; i < arr.length; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
                yield { highlight: [minIdx, j] };
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                yield { swap: [i, minIdx] };
            }
        }
    }

    async function runAlgorithm() {
        if(isSorting) { abortController.abort(); isSorting = false; btnPlay.innerText = "Chạy"; return; }

        isSorting = true;
        btnPlay.innerText = "Dừng";
        abortController = new AbortController();
        const signal = abortController.signal;

        const algo = algoSelect.value;
        let generator = algo === 'bubble' ? bubbleSort(array) : selectionSort(array);
        // Có thể bổ sung generator cho insertion/quick sort tương tự...

        try {
            for await (const state of generator) {
                await checkAbort(signal);
                drawArray(state.highlight || [], state.swap || []);
            }
            drawArray(); // Xong, vẽ lại bình thường
        } catch (e) {
            // Dừng đột ngột
        }

        isSorting = false;
        btnPlay.innerText = "Chạy";
    }

    sizeSlider.addEventListener('input', initArray);
    btnShuffle.addEventListener('click', initArray);
    btnPlay.addEventListener('click', runAlgorithm);

    resize();
    initArray();
}