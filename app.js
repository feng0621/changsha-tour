let selectedDays = 1;
let currentDay = 1;
let selectedPlans = [];
let usedAttractions = new Set(); // 用于跟踪已选择的景点

// 开始规划
function startPlanning() {
    selectedDays = parseInt(document.getElementById("daySelect").value);
    selectedPlans = Array(selectedDays).fill().map(() => ({
        morning: null,
        noon: null,
        evening: null
    }));
    usedAttractions = new Set();

    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
    updateDayTitle();
    renderDayPlan(currentDay);
    updateNavigationButtons();
}

// 更新导航按钮状态
function updateNavigationButtons() {
    const prevBtn = document.getElementById("prevDayBtn");
    const nextBtn = document.getElementById("nextDayBtn");

    prevBtn.classList.toggle("hidden", currentDay === 1);

    if (currentDay === selectedDays) {
        nextBtn.textContent = "完成规划 →";
        nextBtn.onclick = showFinalPlan;
    } else {
        nextBtn.textContent = "下一日 →";
        nextBtn.onclick = nextDay;
    }
}

// 更新当前天数标题
function updateDayTitle() {
    document.getElementById("currentDayTitle").textContent = `第${currentDay}天行程规划`;
}

// 上一天
function prevDay() {
    if (currentDay > 1) {
        currentDay--;
        updateDayTitle();
        renderDayPlan(currentDay);
        updateNavigationButtons();
    }
}

// 下一天
function nextDay() {
    if (currentDay < selectedDays) {
        currentDay++;
        updateDayTitle();
        renderDayPlan(currentDay);
        updateNavigationButtons();
    }
}

// 获取可用的景点（排除已选择的）
function getAvailableAttractions() {
    return changshaData.filter(attraction => !usedAttractions.has(attraction.name));
}

// 渲染某天的规划界面
function renderDayPlan(day) {
    const planDiv = document.getElementById("dayPlans");
    planDiv.innerHTML = "";

    const dayIndex = day - 1;
    const availableAttractions = getAvailableAttractions();

    // 上午选择
    const morningDiv = document.createElement("div");
    morningDiv.className = "time-slot";
    morningDiv.innerHTML = `<h3>🌅 上午行程</h3>`;

    if (selectedPlans[dayIndex].morning) {
        const card = createAttractionCard(selectedPlans[dayIndex].morning, "morning", dayIndex, true);
        morningDiv.appendChild(card);
    } else {
        availableAttractions.forEach(attraction => {
            const card = createAttractionCard(attraction, "morning", dayIndex);
            morningDiv.appendChild(card);
        });
    }
    planDiv.appendChild(morningDiv);

    // 中午选择
    const noonDiv = document.createElement("div");
    noonDiv.className = "time-slot";
    noonDiv.innerHTML = `<h3>🍽️ 中午行程</h3>`;

    if (selectedPlans[dayIndex].noon) {
        const card = createAttractionCard(selectedPlans[dayIndex].noon, "noon", dayIndex, true);
        noonDiv.appendChild(card);
    } else {
        availableAttractions.forEach(attraction => {
            // 如果这个景点已经被选为上午的景点，跳过
            if (selectedPlans[dayIndex].morning && selectedPlans[dayIndex].morning.name === attraction.name) {
                return;
            }
            const card = createAttractionCard(attraction, "noon", dayIndex);
            noonDiv.appendChild(card);
        });
    }
    planDiv.appendChild(noonDiv);

    // 晚上选择
    const eveningDiv = document.createElement("div");
    eveningDiv.className = "time-slot";
    eveningDiv.innerHTML = `<h3>🌃 晚上行程</h3>`;

    if (selectedPlans[dayIndex].evening) {
        const card = createAttractionCard(selectedPlans[dayIndex].evening, "evening", dayIndex, true);
        eveningDiv.appendChild(card);
    } else {
        availableAttractions.forEach(attraction => {
            // 如果这个景点已经被选为上午或中午的景点，跳过
            if ((selectedPlans[dayIndex].morning && selectedPlans[dayIndex].morning.name === attraction.name) ||
                (selectedPlans[dayIndex].noon && selectedPlans[dayIndex].noon.name === attraction.name)) {
                return;
            }
            const card = createAttractionCard(attraction, "evening", dayIndex);
            eveningDiv.appendChild(card);
        });
    }
    planDiv.appendChild(eveningDiv);

    // 显示当前选择
    const currentDiv = document.createElement("div");
    currentDiv.innerHTML = `
        <h3>当前选择</h3>
        <p>上午: ${selectedPlans[dayIndex].morning ? selectedPlans[dayIndex].morning.name : "未选择"}</p>
        <p>中午: ${selectedPlans[dayIndex].noon ? selectedPlans[dayIndex].noon.name : "未选择"}</p>
        <p>晚上: ${selectedPlans[dayIndex].evening ? selectedPlans[dayIndex].evening.name : "未选择"}</p>
    `;
    planDiv.appendChild(currentDiv);
}

// 创建景点卡片
function createAttractionCard(attraction, timeSlot, dayIndex, isSelected = false) {
    const card = document.createElement("div");
    card.className = "attraction-card";
    if (isSelected) {
        card.classList.add("selected");
    }

    card.innerHTML = `
        <h4>${attraction.name}</h4>
        <p>${attraction.description}</p>
        <p><small>${attraction.food}</small></p>
    `;

    card.onclick = () => {
        if (!isSelected) {
            // 如果是取消选择
            if (selectedPlans[dayIndex][timeSlot] && selectedPlans[dayIndex][timeSlot].name === attraction.name) {
                selectedPlans[dayIndex][timeSlot] = null;
                usedAttractions.delete(attraction.name);
            } else {
                // 如果是新选择
                // 先取消之前的选择（如果有）
                if (selectedPlans[dayIndex][timeSlot]) {
                    usedAttractions.delete(selectedPlans[dayIndex][timeSlot].name);
                }
                selectedPlans[dayIndex][timeSlot] = attraction;
                usedAttractions.add(attraction.name);
            }
            renderDayPlan(currentDay);
        }
    };

    return card;
}

// 显示最终行程
function showFinalPlan() {
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");

    const planDiv = document.getElementById("planDisplay");
    planDiv.innerHTML = "";

    selectedPlans.forEach((dayPlan, index) => {
        const dayDiv = document.createElement("div");
        dayDiv.className = "plan-day";
        dayDiv.innerHTML = `
            <h3>📅 第 ${index + 1} 天</h3>
            <div class="plan-item">
                <h4>🌅 上午: ${dayPlan.morning ? dayPlan.morning.name : "未安排"}</h4>
                <p>${dayPlan.morning ? dayPlan.morning.description : ""}</p>
                <p><em>${dayPlan.morning ? dayPlan.morning.food : ""}</em></p>
            </div>
            <div class="plan-item">
                <h4>🍽️ 中午: ${dayPlan.noon ? dayPlan.noon.name : "未安排"}</h4>
                <p>${dayPlan.noon ? dayPlan.noon.description : ""}</p>
                <p><em>${dayPlan.noon ? dayPlan.noon.food : ""}</em></p>
            </div>
            <div class="plan-item">
                <h4>🌃 晚上: ${dayPlan.evening ? dayPlan.evening.name : "未安排"}</h4>
                <p>${dayPlan.evening ? dayPlan.evening.description : ""}</p>
                <p><em>${dayPlan.evening ? dayPlan.evening.food : ""}</em></p>
            </div>
            <hr/>
        `;
        planDiv.appendChild(dayDiv);
    });
}

// 返回修改行程
function backToPlanning() {
    document.getElementById("step3").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
    updateDayTitle();
    renderDayPlan(currentDay);
    updateNavigationButtons();
}

// 文本换行处理函数
function splitTextToLines(doc, text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';

    for (let word of words) {
        const testLine = currentLine + word;
        const testWidth = doc.getTextWidth(testLine);

        if (testWidth > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }

    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    return lines;
}

// 下载PDF - 修复中文支持版本
function downloadPDF() {
    try {
        const downloadBtn = document.getElementById('downloadBtn');

        // 禁用按钮，显示加载状态
        downloadBtn.disabled = true;
        downloadBtn.textContent = '正在生成PDF...';
        downloadBtn.classList.add('loading');

        // 创建一个HTML字符串用于打印
        let htmlContent = `
            <html>
            <head>
                <meta charset="UTF-8">
                <title>长沙旅游行程</title>
                <style>
                    body { 
                        font-family: 'Microsoft YaHei', SimHei, sans-serif; 
                        margin: 20px; 
                        line-height: 1.6;
                        color: #333;
                    }
                    h1 { 
                        color: #e74c3c; 
                        text-align: center; 
                        border-bottom: 2px solid #e74c3c;
                        padding-bottom: 10px;
                    }
                    h2 { 
                        color: #e74c3c; 
                        margin-top: 30px;
                        border-left: 4px solid #e74c3c;
                        padding-left: 10px;
                    }
                    h3 { 
                        color: #2c3e50; 
                        margin-top: 20px;
                    }
                    .day-section { 
                        margin-bottom: 30px; 
                        page-break-inside: avoid;
                    }
                    .time-section { 
                        margin-bottom: 15px; 
                        padding: 10px;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                    }
                    .attraction-name { 
                        font-weight: bold; 
                        color: #e74c3c;
                        font-size: 14px;
                    }
                    .description { 
                        margin: 5px 0; 
                        color: #555;
                    }
                    .food-info { 
                        font-style: italic; 
                        color: #666;
                        font-size: 12px;
                    }
                    .meta-info {
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        margin-bottom: 30px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        color: #999;
                        font-size: 10px;
                    }
                    @media print {
                        body { margin: 15px; }
                        .day-section { page-break-after: auto; }
                    }
                </style>
            </head>
            <body>
                <h1>🌶️ 长沙旅游行程计划</h1>
                <div class="meta-info">
                    行程天数：${selectedDays}天 | 生成时间：${new Date().toLocaleString('zh-CN')}
                </div>
        `;

        selectedPlans.forEach((dayPlan, index) => {
            htmlContent += `<div class="day-section">`;
            htmlContent += `<h2>📅 第 ${index + 1} 天</h2>`;

            // 上午行程
            if (dayPlan.morning) {
                htmlContent += `
                    <div class="time-section">
                        <h3>🌅 上午</h3>
                        <div class="attraction-name">${dayPlan.morning.name}</div>
                        <div class="description">${dayPlan.morning.description}</div>
                        <div class="food-info">${dayPlan.morning.food}</div>
                    </div>
                `;
            }

            // 中午行程
            if (dayPlan.noon) {
                htmlContent += `
                    <div class="time-section">
                        <h3>🍽️ 中午</h3>
                        <div class="attraction-name">${dayPlan.noon.name}</div>
                        <div class="description">${dayPlan.noon.description}</div>
                        <div class="food-info">${dayPlan.noon.food}</div>
                    </div>
                `;
            }

            // 晚上行程
            if (dayPlan.evening) {
                htmlContent += `
                    <div class="time-section">
                        <h3>🌃 晚上</h3>
                        <div class="attraction-name">${dayPlan.evening.name}</div>
                        <div class="description">${dayPlan.evening.description}</div>
                        <div class="food-info">${dayPlan.evening.food}</div>
                    </div>
                `;
            }

            htmlContent += `</div>`;
        });

        htmlContent += `
                <div class="footer">
                    Created by 长沙旅游助手 | 祝您旅途愉快！
                </div>
            </body>
            </html>
        `;

        // 创建新窗口并打印
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // 等待内容加载完成后自动打印
        printWindow.onload = function () {
            printWindow.print();
            // 打印对话框关闭后关闭窗口
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        };

        // 恢复按钮状态
        setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.textContent = '📄 下载 PDF 行程单';
            downloadBtn.classList.remove('loading');
        }, 1000);

    } catch (error) {
        console.error('PDF生成失败:', error);
        alert('PDF生成失败，请重试');

        // 恢复按钮状态
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.disabled = false;
        downloadBtn.textContent = '📄 下载 PDF 行程单';
        downloadBtn.classList.remove('loading');
    }
}

// 重置规划器
function resetPlanner() {
    document.getElementById("step3").classList.add("hidden");
    document.getElementById("step1").classList.remove("hidden");
    currentDay = 1;
}