let selectedDays = 0;
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
    usedAttractions.clear(); // 重置已选景点

    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
    updateDayTitle();
    renderDayPlan(currentDay);
    updateNavigationButtons();
}

function prevDay() {
    if (currentDay > 1) {
        currentDay--;
        updateDayTitle();
        renderDayPlan(currentDay);
        updateNavigationButtons();
    }
}

function nextDay() {
    if (currentDay < selectedDays) {
        currentDay++;
        updateDayTitle();
        renderDayPlan(currentDay);
        updateNavigationButtons();
    }
}

function updateDayTitle() {
    document.getElementById("dayTitle").textContent = `第 ${currentDay} 天行程 (共 ${selectedDays} 天)`;
}

function updateNavigationButtons() {
    document.getElementById("prevDay").disabled = currentDay === 1;
    document.getElementById("nextDay").disabled = currentDay === selectedDays;
    document.getElementById("finishBtn").style.display = currentDay === selectedDays ? "block" : "none";
}

function createAttractionCard(attraction, dayIndex) {
    const card = document.createElement("div");
    card.className = "card";

    const isUsed = usedAttractions.has(attraction.name);
    if (isUsed) return null;

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

function selectTime(name, dayIndex, timeSlot) {
    const attraction = changshaData.find(item => item.name === name);
    if (!attraction) return;

    const oldAttraction = selectedPlans[dayIndex][timeSlot];
    if (oldAttraction) usedAttractions.delete(oldAttraction.name);

    selectedPlans[dayIndex][timeSlot] = attraction;
    usedAttractions.add(attraction.name);

    renderDayPlan(currentDay);
}

function clearDaySelections(dayIndex) {
    ['morning', 'noon', 'evening'].forEach(slot => {
        if (selectedPlans[dayIndex][slot]) {
            usedAttractions.delete(selectedPlans[dayIndex][slot].name);
            selectedPlans[dayIndex][slot] = null;
        }
    });
    renderDayPlan(dayIndex + 1);
}

function renderDayPlan(day) {
    const planDiv = document.getElementById("dayPlans");
    planDiv.innerHTML = "";

    const dayIndex = day - 1;

    const allAttractionsDiv = document.createElement("div");
    allAttractionsDiv.innerHTML = `<h3>可选景点</h3>`;

    const gridContainer = document.createElement("div");
    gridContainer.className = "attraction-grid";

    const availableAttractions = changshaData.filter(
        attraction => !usedAttractions.has(attraction.name)
    );

    if (availableAttractions.length === 0) {
        allAttractionsDiv.innerHTML += `<p>所有景点已选择完毕</p>`;
    } else {
        availableAttractions.forEach(attraction => {
            const card = createAttractionCard(attraction, dayIndex);
            if (card) gridContainer.appendChild(card);
        });
    }

    allAttractionsDiv.appendChild(gridContainer);
    planDiv.appendChild(allAttractionsDiv);

    const currentDiv = document.createElement("div");
    currentDiv.className = "current-selection";
    currentDiv.innerHTML = `
        <h3>当前选择</h3>
        <p>上午: ${selectedPlans[dayIndex].morning ? selectedPlans[dayIndex].morning.name : "未选择"}</p>
        <p>中午: ${selectedPlans[dayIndex].noon ? selectedPlans[dayIndex].noon.name : "未选择"}</p>
        <p>晚上: ${selectedPlans[dayIndex].evening ? selectedPlans[dayIndex].evening.name : "未选择"}</p>
        <button onclick="clearDaySelections(${dayIndex})">清除当天选择</button>
    `;
    planDiv.appendChild(currentDiv);
}

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
                <h4>🌅 上午: ${dayPlan.morning ? dayPlan.morning.name : "未定"}</h4>
                <p>${dayPlan.morning ? dayPlan.morning.description : ""}</p>
                <p><em>${dayPlan.morning ? dayPlan.morning.food : ""}</em></p>
            </div>
            <div class="plan-item">
                <h4>🍽️ 中午: ${dayPlan.noon ? dayPlan.noon.name : "未定"}</h4>
                <p>${dayPlan.noon ? dayPlan.noon.description : ""}</p>
                <p><em>${dayPlan.noon ? dayPlan.noon.food : ""}</em></p>
            </div>
            <div class="plan-item">
                <h4>🌃 晚上: ${dayPlan.evening ? dayPlan.evening.name : "未定"}</h4>
                <p>${dayPlan.evening ? dayPlan.evening.description : ""}</p>
                <p><em>${dayPlan.evening ? dayPlan.evening.food : ""}</em></p>
            </div>
            <hr/>
        `;
        planDiv.appendChild(dayDiv);
    });
}

function backToPlanning() {
    document.getElementById("step3").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
    updateDayTitle();
    renderDayPlan(currentDay);
    updateNavigationButtons();
}
