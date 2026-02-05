// 制度改正時はここを書き換える
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

function processData() {
    const results = [];
    const forms = document.querySelectorAll('.trainee-form');
    let hasAnyInput = false;
    let errorOccurred = false;

    forms.forEach(form => {
        const i = form.dataset.index;
        const name = form.querySelector('.name').value;
        const group = form.querySelector('.group').value;
        const enDate = form.querySelector('.en-date').value;
        const asDate = form.querySelector('.as-date').value;
        const type = form.querySelector(`input[name="type-${i}"]:checked`).value;

        // 全空欄チェック用
        if (name || group || enDate || asDate) hasAnyInput = true;

        // 部分入力チェック
        const fields = [name, group, enDate, asDate];
        const filledCount = fields.filter(f => f !== "").length;
        if (filledCount > 0 && filledCount < 4) {
            alert(`実習生 ${i} の情報が不足しています。`);
            errorOccurred = true;
            return;
        }

        if (filledCount === 4) {
            const rules = MASTER_RULES[type];
            rules.forEach(rule => {
                const baseDateStr = (rule.base === "en-date") ? enDate : asDate;
                let targetDate = new Date(baseDateStr);

                if (rule.offset === "1year-prev") {
                    targetDate.setFullYear(targetDate.getFullYear() + 1);
                    targetDate.setDate(targetDate.getDate() - 1);
                } else {
                    targetDate.setDate(targetDate.getDate() + rule.offset);
                }

                results.push({
                    date: targetDate,
                    dateStr: targetDate.toLocaleDateString('ja-JP'),
                    text: `${rule.label} (${name})`
                });
            });
        }
    });

    if (!hasAnyInput) {
        alert("情報を入力してください。");
        return;
    }
    if (errorOccurred) return;

    // 日付順にソート
    results.sort((a, b) => a.date - b.date);

    // 出力
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = results.map(r => `<div class="result-item">${r.dateStr} ： ${r.text}</div>`).join('');
    
    // 実行日表示
    document.getElementById('current-date').innerText = `出力日時: ${new Date().toLocaleString('ja-JP')}`;
}
