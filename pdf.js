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