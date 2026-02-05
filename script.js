// 1. 日付計算のルール設定
const MASTER_RULES = {
    first: [
        { label: "手続き①", offset: -30, base: "en-date" },
        { label: "手続き②", offset: -10, base: "en-date" },
        { label: "手続き③", offset: 7, base: "as-date" },
        { label: "手続き④", offset: -90, base: "en-date" },
        { label: "手続き⑤", offset: "1year-prev", base: "en-date" }
    ],
    second: [
        { label: "手続き⑥", offset: -30, base: "en-date" },
        { label: "手続き⑦", offset: -10, base: "en-date" },
        { label: "手続き⑧", offset: 7, base: "as-date" },
        { label: "手続き⑨", offset: -90, base: "en-date" },
        { label: "手続き⑩", offset: "1year-prev", base: "en-date" }
    ]
};

// 2. ページ読み込み時のアニメーション（GSAP）
window.onload = () => {
    gsap.to(".trainee-form", {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });
};

// 3. 処理開始ボタンが押された時の動作
function processData() {
    const results = [];
    const forms = document.querySelectorAll('.trainee-form');
    let hasAnyInput = false;

    forms.forEach(form => {
        const i = form.dataset.index;
        const name = form.querySelector('.name').value;
        const enDate = form.querySelector('.en-date').value;
        const asDate = form.querySelector('.as-date').value;
        const type = form.querySelector(`input[name="type-${i}"]:checked`).value;

        if (name || enDate || asDate) {
            if (!name || !enDate || !asDate) {
                alert(`実習生 ${i} の入力が不完全です。`);
                return;
            }
            hasAnyInput = true;

            const rules = MASTER_RULES[type];
            rules.forEach(rule => {
                let d = new Date(rule.base === "en-date" ? enDate : asDate);
                if (rule.offset === "1year-prev") {
                    d.setFullYear(d.getFullYear() + 1);
                    d.setDate(d.getDate() - 1);
                } else {
                    d.setDate(d.getDate() + rule.offset);
                }
                results.push({ date: d, text: `${d.toLocaleDateString('ja-JP')} : ${rule.label} (${name})` });
            });
        }
    });

    if (!hasAnyInput) {
        alert("情報を入力してください。");
        return;
    }

    // 日付順ソート
    results.sort((a, b) => a.date - b.date);

    // HTMLに書き出し
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = results.map(r => `<div class="result-item">${r.text}</div>`).join('');
    document.getElementById('current-date').innerText = `出力日: ${new Date().toLocaleDateString()}`;

    // ★結果表示のアニメーション（GSAP）
    gsap.to("#result-area", { opacity: 1, duration: 0.5 });
    gsap.to(".result-item", { opacity: 1, x: 20, stagger: 0.05, delay: 0.2 });
}
