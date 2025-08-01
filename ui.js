// 全局变量
let selectedDays = 1;
let currentDay = 1;
let selectedPlans = [];
let usedAttractions = new Set(); // 跟踪已选景点

// 开始规划
function startPlanning() {
    selectedDays = parseInt(document.getElementById("daySelect").value);
    selectedPlans = Array(selectedDays).fill().map(() => ({
        morning: null,
        noon: null,
        evening: null
    }));
    usedAttractions.clear();

    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
    updateDayTitle();
    renderDayPlan(currentDay);
    updateNavigationButtons();
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

// 渲染当前天的行程
function renderDayPlan(day) {
    const planDiv = document.getElementById("dayPlans");
    planDiv.innerHTML = "";

    const dayIndex = day - 1;

    // 过滤掉已被选的景点
    const availableAttractions = changshaData.filter(
        attraction => !usedAttractions.has(attraction.name)
    );

    // 共用景点渲染函数
    function createTimeSlot(timeLabel, slotName) {
        const timeDiv = document.createElement("div");
        timeDiv.className = "time-slot";
        timeDiv.innerHTML = `<h3>${timeLabel}</h3>`;

        if (availableAttractions.length === 0) {
            timeDiv.innerHTML += `<p>无可选景点</p>`;
        } else {
            availableAttractions.forEach(attraction => {
                const card = document.createElement("div");
                card.className = "attraction-card";
                card.innerHTML = `
                    <h4>${attraction.name}</h4>
                    <p>${attraction.description}</p>
                    <p><em>${attraction.food}</em></p>
                    <button onclick="selectTime('${attraction.name}', ${dayIndex}, '${slotName}')">选择此${timeLabel}</button>
                `;
                timeDiv.appendChild(card);
            });
        }

        planDiv.appendChild(timeDiv);
    }

    // 渲染上午/中午/晚上，每次用同一份数据
    createTimeSlot("🌅 上午行程", "morning");
    createTimeSlot("🍽️ 中午行程", "noon");
    createTimeSlot("🌃 晚上行程", "evening");

    // 显示当前选择
    const currentDiv = document.createElement("div");
    currentDiv.innerHTML = `
        <h3>当前选择</h3>
        <p>上午: ${selectedPlans[dayIndex].morning ? selectedPlans[dayIndex].morning.name : "未选择"}</p>
        <p>中午: ${selectedPlans[dayIndex].noon ? selectedPlans[dayIndex].noon.name : "未选择"}</p>
        <p>晚上: ${selectedPlans[dayIndex].evening ? selectedPlans[dayIndex].evening.name : "未选择"}</p>
        <button onclick="clearDaySelections(${dayIndex})">清除当天选择</button>
    `;
    planDiv.appendChild(currentDiv);
}


// 创建景点卡片（包含上午/中午/晚上按钮）
function createAttractionCard(attraction, dayIndex) {
    const isUsed = usedAttractions.has(attraction.name);
    if (isUsed) return null;

    const card = document.createElement("div");
    card.className = "attraction-card";

    card.innerHTML = `
        <h4>${attraction.name}</h4>
        <p>${attraction.description}</p>
        <p><em>${attraction.food}</em></p>
        <div class="selection-buttons">
            <button onclick="selectTime('${attraction.name}', ${dayIndex}, 'morning')">上午</button>
            <button onclick="selectTime('${attraction.name}', ${dayIndex}, 'noon')">中午</button>
            <button onclick="selectTime('${attraction.name}', ${dayIndex}, 'evening')">晚上</button>
        </div>
    `;
    return card;
}

// 选择景点时间段
function selectTime(name, dayIndex, timeSlot) {
    const attraction = changshaData.find(item => item.name === name);
    if (!attraction) return;

    const oldAttraction = selectedPlans[dayIndex][timeSlot];
    if (oldAttraction) usedAttractions.delete(oldAttraction.name);

    selectedPlans[dayIndex][timeSlot] = attraction;
    usedAttractions.add(attraction.name);

    renderDayPlan(currentDay);
}

// 清除当天所有选择
function clearDaySelections(dayIndex) {
    ['morning', 'noon', 'evening'].forEach(slot => {
        const selected = selectedPlans[dayIndex][slot];
        if (selected) {
            usedAttractions.delete(selected.name);
            selectedPlans[dayIndex][slot] = null;
        }
    });
    renderDayPlan(currentDay);
}

// 更新标题
function updateDayTitle() {
    document.getElementById("currentDayTitle").textContent = `第${currentDay}天行程规划`;
}

// 更新按钮状态
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
