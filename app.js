// 主应用初始化和其他功能

// 重置规划器
function resetPlanner() {
    document.getElementById("step3").classList.add("hidden");
    document.getElementById("step1").classList.remove("hidden");
    currentDay = 1;
    selectedDays = 1;
    selectedPlans = [];
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function () {
    console.log('长沙旅游助手已加载完成');

    // 可以在这里添加一些初始化逻辑
    // 比如检查本地存储、设置默认值等

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function (e) {
        // ESC键返回上一步
        if (e.key === 'Escape') {
            const step2 = document.getElementById('step2');
            const step3 = document.getElementById('step3');

            if (!step3.classList.contains('hidden')) {
                backToPlanning();
            } else if (!step2.classList.contains('hidden')) {
                resetPlanner();
            }
        }

        // 左右箭头键切换天数（仅在规划阶段）
        if (!document.getElementById('step2').classList.contains('hidden')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevDay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextDay();
            }
        }
    });
});

// 错误处理函数
function handleError(error, context) {
    console.error(`错误发生在 ${context}:`, error);
    alert(`操作失败：${context}。请刷新页面重试。`);
}

// 数据验证函数
function validatePlan(dayPlan) {
    return dayPlan && (dayPlan.morning || dayPlan.noon || dayPlan.evening);
}

// 获取行程统计信息
function getPlanStatistics() {
    let totalAttractions = 0;
    let filledTimeSlots = 0;
    let totalTimeSlots = selectedDays * 3;

    selectedPlans.forEach(dayPlan => {
        if (dayPlan.morning) {
            totalAttractions++;
            filledTimeSlots++;
        }
        if (dayPlan.noon) {
            totalAttractions++;
            filledTimeSlots++;
        }
        if (dayPlan.evening) {
            totalAttractions++;
            filledTimeSlots++;
        }
    });

    return {
        totalAttractions,
        filledTimeSlots,
        totalTimeSlots,
        completionRate: Math.round((filledTimeSlots / totalTimeSlots) * 100)
    };
}