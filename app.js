// API 基礎 URL
const API_BASE_URL = 'https://aivideobackend.zeabur.app/api';

// 全域變數
let charts = {};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    updateTime();
    setInterval(updateTime, 1000);
    loadOverview();
    
    // 監聽視窗大小改變，重新載入當前頁面數據以切換佈局
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const activeSection = document.querySelector('.section.active');
            if (activeSection) {
                loadSectionData(activeSection.id);
            }
        }, 300);
    });
});

// 導航控制
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // 更新導航狀態
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // 更新頁面標題
    const titles = {
        'overview': '數據概覽',
        'users': '用戶管理',
        'modes': '模式分析',
        'conversations': '對話記錄',
        'scripts': '腳本管理',
        'generations': '生成記錄',
        'analytics': '數據分析'
    };
    document.getElementById('page-title').textContent = titles[section];
    
    // 顯示對應區塊
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
    
    // 載入對應數據
    loadSectionData(section);
}

function loadSectionData(section) {
    switch(section) {
        case 'overview':
            loadOverview();
            break;
        case 'users':
            loadUsers();
            break;
        case 'modes':
            loadModes();
            break;
        case 'conversations':
            loadConversations();
            break;
        case 'scripts':
            loadScripts();
            break;
        case 'generations':
            loadGenerations();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// 更新時間
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

// 重新整理數據
function refreshData() {
    const activeSection = document.querySelector('.section.active').id;
    loadSectionData(activeSection);
    showToast('數據已重新整理', 'success');
}

// Toast 提示
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== 數據概覽 =====
async function loadOverview() {
    try {
        // 載入統計數據
        const statsResponse = await fetch(`${API_BASE_URL}/admin/statistics`);
        const stats = await statsResponse.json();
        
        document.getElementById('total-users').textContent = stats.total_users || 0;
        document.getElementById('total-conversations').textContent = stats.total_conversations || 0;
        document.getElementById('total-scripts').textContent = stats.total_scripts || 0;
        document.getElementById('total-positioning').textContent = stats.total_positioning || 0;
        
        // 載入圖表數據
        loadCharts(stats);
        loadRecentActivities();
    } catch (error) {
        console.error('載入概覽數據失敗:', error);
        showToast('載入數據失敗', 'error');
    }
}

async function loadCharts(stats) {
    try {
        // 調用 API 獲取模式統計
        const response = await fetch(`${API_BASE_URL}/admin/mode-statistics`);
        const modeData = await response.json();
        
        // 用戶增長趨勢圖 - 暫時使用統計數據替代（需要 API 支援）
        if (charts.userGrowth) charts.userGrowth.destroy();
        const userGrowthCtx = document.getElementById('user-growth-chart');
        charts.userGrowth = new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
                datasets: [{
                    label: '新增用戶',
                    data: [0, 0, 0, 0, 0, 0, stats?.today_users || 0],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        
        // 模式使用分布圖 - 使用真實數據
        if (charts.modeDistribution) charts.modeDistribution.destroy();
        const modeDistributionCtx = document.getElementById('mode-distribution-chart');
        const modeStats = modeData.mode_stats || {};
        charts.modeDistribution = new Chart(modeDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['一鍵生成', 'AI顧問', 'IP人設規劃'],
                datasets: [{
                    data: [
                        modeStats.mode1_quick_generate?.count || 0,
                        modeStats.mode2_ai_consultant?.count || 0,
                        modeStats.mode3_ip_planning?.count || 0
                    ],
                    backgroundColor: [
                        '#3b82f6',
                        '#8b5cf6',
                        '#f59e0b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2
            }
        });
    } catch (error) {
        console.error('載入圖表失敗:', error);
    }
}

async function loadRecentActivities() {
    try {
        // 調用真實 API
        const response = await fetch(`${API_BASE_URL}/admin/user-activities`);
        const data = await response.json();
        const activities = data.activities || [];
        
        // 載入最近活動
        let activitiesHtml = '';
        
        if (activities.length > 0) {
            activitiesHtml = activities.map(activity => {
                // 計算時間差
                const timeAgo = calculateTimeAgo(activity.time);
                
                return `
                    <div class="activity-item">
                        <div class="activity-icon">${activity.icon}</div>
                        <div>
                            <strong>${activity.type}</strong>
                            <p style="margin: 0; font-size: 0.875rem; color: #64748b;">
                                ${activity.title || activity.name || ''} - ${timeAgo}
                            </p>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            activitiesHtml = '<div class="empty-state" style="text-align: center; color: #64748b;">暫無活動記錄</div>';
        }
        
        document.getElementById('recent-activities').innerHTML = activitiesHtml;
    } catch (error) {
        console.error('載入活動失敗:', error);
        document.getElementById('recent-activities').innerHTML = '<div class="empty-state" style="text-align: center; color: #64748b;">載入活動失敗</div>';
    }
}

function calculateTimeAgo(timeString) {
    if (!timeString) return '未知時間';
    
    const now = new Date();
    const time = new Date(timeString);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} 天前`;
    if (hours > 0) return `${hours} 小時前`;
    if (minutes > 0) return `${minutes} 分鐘前`;
    return '剛剛';
}

// ===== 用戶管理 =====
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        const data = await response.json();
        
        // 檢測是否為手機版
        const isMobile = window.innerWidth <= 768;
        const tableContainer = document.querySelector('.table-container');
        
        if (isMobile) {
            // 手機版：卡片式佈局
            // 清空表格內容
            tableContainer.innerHTML = '';
            
            // 創建卡片容器
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'mobile-cards-container';
            
            // 添加卡片
            cardsContainer.innerHTML = data.users.map(user => {
                const isSubscribed = user.is_subscribed !== false;
                const subscribeStatus = isSubscribed ? '已訂閱' : '未訂閱';
                
                return `
                <div class="mobile-card">
                    <div class="mobile-card-header">
                        <span class="mobile-card-title">${user.name || '未命名用戶'}</span>
                        <span class="mobile-card-badge ${isSubscribed ? 'badge-success' : 'badge-danger'}">${subscribeStatus}</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">用戶ID</span>
                        <span class="mobile-card-value">${user.user_id.substring(0, 16)}...</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">Email</span>
                        <span class="mobile-card-value">${user.email}</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">訂閱狀態</span>
                        <span class="mobile-card-value" id="mobile-subscribe-status-${user.user_id}">${subscribeStatus}</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">註冊時間</span>
                        <span class="mobile-card-value">${formatDate(user.created_at)}</span>
                    </div>
                    <div class="mobile-card-actions">
                        <button class="btn-action ${isSubscribed ? 'btn-danger' : 'btn-success'}" 
                                onclick="toggleSubscribe('${user.user_id}', ${!isSubscribed})" 
                                type="button">
                            ${isSubscribed ? '❌ 取消訂閱' : '✅ 啟用訂閱'}
                        </button>
                        <button class="btn-action btn-view" onclick="viewUser('${user.user_id}')" type="button">查看詳情</button>
                    </div>
                </div>
            `;
            }).join('');
            
            tableContainer.appendChild(cardsContainer);
        } else {
            // 桌面版：表格佈局
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = data.users.map(user => {
                const isSubscribed = user.is_subscribed !== false; // 預設為已訂閱
                const subscribeStatus = isSubscribed ? 
                    '<span class="badge badge-success">已訂閱</span>' : 
                    '<span class="badge badge-danger">未訂閱</span>';
                
                return `
                <tr>
                    <td>${user.user_id.substring(0, 12)}...</td>
                    <td>${user.email}</td>
                    <td>${user.name || '-'}</td>
                    <td id="subscribe-status-${user.user_id}">${subscribeStatus}</td>
                    <td>${formatDate(user.created_at)}</td>
                    <td>${user.conversation_count || 0}</td>
                    <td>${user.script_count || 0}</td>
                    <td>
                        <button class="btn-action btn-subscribe ${isSubscribed ? 'btn-danger' : 'btn-success'}" 
                                onclick="toggleSubscribe('${user.user_id}', ${!isSubscribed})" 
                                type="button">
                            ${isSubscribed ? '❌ 取消訂閱' : '✅ 啟用訂閱'}
                        </button>
                        <button class="btn-action btn-view" onclick="viewUser('${user.user_id}')" type="button">查看</button>
                    </td>
                </tr>
            `;
            }).join('');
        }
        
        // 添加匯出按鈕
        const actionsDiv = document.querySelector('#users .section-actions');
        if (actionsDiv) {
            let exportBtn = actionsDiv.querySelector('.btn-export');
            if (!exportBtn) {
                exportBtn = document.createElement('button');
                exportBtn.className = 'btn btn-secondary btn-export';
                exportBtn.innerHTML = '<i class="icon">📥</i> 匯出 CSV';
                exportBtn.onclick = () => exportCSV('users');
                actionsDiv.insertBefore(exportBtn, actionsDiv.firstChild);
            }
        }
    } catch (error) {
        console.error('載入用戶失敗:', error);
        showToast('載入用戶數據失敗', 'error');
    }
}

function filterUsers() {
    const search = document.getElementById('user-search').value.toLowerCase();
    const platform = document.getElementById('user-filter-platform').value;
    
    const rows = document.querySelectorAll('#users-table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const shouldShow = text.includes(search) && (!platform || row.textContent.includes(platform));
        row.style.display = shouldShow ? '' : 'none';
    });
}

function viewUser(userId) {
    // 檢查按鈕是否被禁用
    if (event && event.target.disabled) return;
    
    // 顯示用戶詳情
    alert(`查看用戶詳情\n用戶ID: ${userId}`);
    
    // 可以進一步實現跳轉到詳情頁或打開彈窗
    showToast('正在載入用戶詳細資訊...', 'info');
}

// ===== 模式分析 =====
async function loadModes() {
    try {
        // 調用真實 API
        const response = await fetch(`${API_BASE_URL}/admin/mode-statistics`);
        const data = await response.json();
        
        // 更新模式統計數據
        const mode1 = data.mode_stats.mode1_quick_generate;
        const mode2 = data.mode_stats.mode2_ai_consultant;
        const mode3 = data.mode_stats.mode3_ip_planning;
        
        document.getElementById('mode1-count').textContent = mode1.count || 0;
        document.getElementById('mode1-success').textContent = mode1.success_rate ? `${mode1.success_rate}%` : '0%';
        document.getElementById('mode2-count').textContent = mode2.count || 0;
        document.getElementById('mode2-avg').textContent = mode2.avg_turns ? `${mode2.avg_turns}` : '0';
        document.getElementById('mode3-count').textContent = mode3.count || 0;
        document.getElementById('mode3-profile').textContent = mode3.profiles_generated || 0;
        
        // 使用真實時間分布數據
        const timeDist = data.time_distribution;
        
        // 載入模式使用時間分布圖
        if (charts.modeTime) charts.modeTime.destroy();
        const modeTimeCtx = document.getElementById('mode-time-chart');
        charts.modeTime = new Chart(modeTimeCtx, {
            type: 'bar',
            data: {
                labels: ['00:00-06:00', '06:00-12:00', '12:00-18:00', '18:00-24:00'],
                datasets: [
                    {
                        label: '一鍵生成',
                        data: [
                            timeDist['00:00-06:00'] || 0,
                            timeDist['06:00-12:00'] || 0,
                            timeDist['12:00-18:00'] || 0,
                            timeDist['18:00-24:00'] || 0
                        ],
                        backgroundColor: '#3b82f6'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2
            }
        });
        
        // 添加匯出按鈕
        const exportBtn = document.querySelector('#modes .section-actions')?.querySelector('.btn');
        if (!exportBtn) {
            const actionsDiv = document.querySelector('#modes .section-actions');
            if (actionsDiv) {
                const btn = document.createElement('button');
                btn.className = 'btn btn-secondary';
                btn.innerHTML = '<i class="icon">📥</i> 匯出 CSV';
                btn.onclick = () => exportCSV('modes');
                actionsDiv.insertBefore(btn, actionsDiv.firstChild);
            }
        }
    } catch (error) {
        console.error('載入模式分析失敗:', error);
        showToast('載入模式分析失敗', 'error');
    }
}

// ===== 對話記錄 =====
async function loadConversations() {
    try {
        const filter = document.getElementById('conversation-filter').value;
        
        // 檢測是否為手機版
        const isMobile = window.innerWidth <= 768;
        const tableContainer = document.querySelector('#conversations .table-container');
        
        // 直接獲取所有對話記錄
        const response = await fetch(`${API_BASE_URL}/admin/conversations`);
        const data = await response.json();
        const allConversations = data.conversations || [];
        
        // 顯示對話記錄
        if (allConversations.length === 0) {
            if (isMobile) {
                tableContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">暫無對話記錄</div>';
            } else {
                document.getElementById('conversations-table-body').innerHTML = 
                    '<tr><td colspan="6" style="text-align: center; padding: 2rem;">暫無對話記錄</td></tr>';
            }
            return;
        }
        
        if (isMobile) {
            // 手機版：卡片式佈局
            tableContainer.innerHTML = '';
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'mobile-cards-container';
            
            cardsContainer.innerHTML = allConversations.map(conv => `
                <div class="mobile-card">
                    <div class="mobile-card-header">
                        <span class="mobile-card-title">${conv.mode}</span>
                        <span class="mobile-card-badge">${conv.message_count} 條消息</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">用戶ID</span>
                        <span class="mobile-card-value">${conv.user_id.substring(0, 16)}...</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">對話摘要</span>
                        <span class="mobile-card-value">${conv.summary.substring(0, 40)}...</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">時間</span>
                        <span class="mobile-card-value">${formatDate(conv.created_at)}</span>
                    </div>
                    <div class="mobile-card-actions">
                        <button class="btn-action btn-view" onclick="viewConversation('${conv.user_id}', '${conv.mode}')" type="button">查看詳情</button>
                    </div>
                </div>
            `).join('');
            
            tableContainer.appendChild(cardsContainer);
        } else {
            // 桌面版：表格佈局
            const tbody = document.getElementById('conversations-table-body');
            tbody.innerHTML = allConversations.map(conv => `
                <tr>
                    <td>${conv.user_id.substring(0, 12)}...</td>
                    <td>${conv.mode}</td>
                    <td>${conv.summary.substring(0, 30)}...</td>
                    <td>${conv.message_count}</td>
                    <td>${formatDate(conv.created_at)}</td>
                    <td>
                        <button class="btn-action btn-view" onclick="viewConversation('${conv.user_id}', '${conv.mode}')" type="button">查看</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // 添加匯出按鈕
        const actionsDiv = document.querySelector('#conversations .section-actions');
        if (actionsDiv) {
            let exportBtn = actionsDiv.querySelector('.btn-export');
            if (!exportBtn) {
                exportBtn = document.createElement('button');
                exportBtn.className = 'btn btn-secondary btn-export';
                exportBtn.innerHTML = '<i class="icon">📥</i> 匯出 CSV';
                exportBtn.onclick = () => exportCSV('conversations');
                actionsDiv.insertBefore(exportBtn, actionsDiv.firstChild);
            }
        }
        
    } catch (error) {
        console.error('載入對話記錄失敗:', error);
        showToast('載入對話記錄失敗', 'error');
        const isMobile = window.innerWidth <= 768;
        const tableContainer = document.querySelector('#conversations .table-container');
        if (isMobile) {
            tableContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">載入失敗</div>';
        } else {
            document.getElementById('conversations-table-body').innerHTML = 
                '<tr><td colspan="6" style="text-align: center; padding: 2rem;">載入失敗</td></tr>';
        }
    }
}

// 查看對話詳情
function viewConversation(userId, mode) {
    // 打開彈窗
    const modal = document.getElementById('conversation-modal');
    modal.classList.add('active');
    
    // 顯示載入中
    const content = document.getElementById('conversation-detail-content');
    content.innerHTML = '<p>載入對話內容中...</p>';
    
    // 模擬對話數據（實際應該從API獲取）
    const mockMessages = [
        {
            role: 'user',
            content: '我想要開始做短影音，應該怎麼開始？',
            time: '2025-01-10 10:30:00'
        },
        {
            role: 'ai',
            content: '很高興為您服務！開始做短影音之前，我需要了解幾個問題：\n1. 您想在哪個平台發布？（抖音、小紅書、Instagram等）\n2. 您的目標受眾是誰？\n3. 您想創作什麼類型的內容？（美食、旅遊、教育等）',
            time: '2025-01-10 10:30:15'
        },
        {
            role: 'user',
            content: '我想在抖音上做美食類的短影音，目標受眾是年輕女性。',
            time: '2025-01-10 10:31:00'
        },
        {
            role: 'ai',
            content: '很棒的方向！針對抖音美食內容，我建議：\n\n🎯 帳號定位：年輕女性的美食探索日記\n📝 內容方向：\n- 快速美食製作（3-5分鐘內）\n- 網紅美食探店\n- 在家就能做的餐廳級料理\n\n🔥 熱門標籤：#美食日常 #在家做飯 #美食探店',
            time: '2025-01-10 10:31:30'
        }
    ];
    
    // 渲染對話內容
    setTimeout(() => {
        let messagesHtml = '<div class="conversation-detail">';
        mockMessages.forEach(msg => {
            messagesHtml += `
                <div class="message-item ${msg.role}">
                    <div class="message-header">
                        <span class="message-role">${msg.role === 'user' ? '👤 用戶' : '🤖 AI助理'}</span>
                        <span class="message-time">${msg.time}</span>
                    </div>
                    <div class="message-content">${msg.content}</div>
                </div>
            `;
        });
        messagesHtml += '</div>';
        content.innerHTML = messagesHtml;
    }, 500);
}

// 關閉彈窗
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// 查看腳本（通過索引）
function viewScriptByIdx(index) {
    const script = window.allScripts?.[index];
    if (!script) {
        showToast('找不到腳本', 'error');
        return;
    }
    
    // 打開彈窗
    const modal = document.getElementById('script-modal');
    modal.classList.add('active');
    
    // 顯示載入中
    const content = document.getElementById('script-detail-content');
    content.innerHTML = '<p>載入腳本詳情中...</p>';
    
    // 渲染腳本內容
    setTimeout(() => {
        content.innerHTML = `
            <div class="script-detail">
                <div class="script-info">
                    <div class="script-info-item">
                        <span class="script-info-label">腳本標題</span>
                        <span class="script-info-value">${script.title}</span>
                    </div>
                    <div class="script-info-item">
                        <span class="script-info-label">平台</span>
                        <span class="script-info-value">${script.platform}</span>
                    </div>
                    <div class="script-info-item">
                        <span class="script-info-label">分類</span>
                        <span class="script-info-value">${script.category}</span>
                    </div>
                    <div class="script-info-item">
                        <span class="script-info-label">創建時間</span>
                        <span class="script-info-value">${formatDate(script.created_at)}</span>
                    </div>
                </div>
                
                <div class="script-content">
                    <h4>📝 腳本內容</h4>
                    <div class="script-text">${script.content || '無內容'}</div>
                </div>
            </div>
        `;
    }, 100);
}

// 查看腳本（舊版兼容）
function viewScript(scriptId, scriptContent, scriptTitle) {
    viewScriptByIdx(0); // 簡單處理，實際應該根據ID查找
}

// 刪除腳本
function deleteScript(scriptId) {
    if (confirm('確定要刪除這個腳本嗎？')) {
        alert(`刪除腳本\n腳本ID: ${scriptId}`);
        showToast('腳本已刪除', 'success');
        // TODO: 實現真實的刪除API調用
        // loadScripts(); // 重新載入列表
    }
}

// ===== 腳本管理 =====
async function loadScripts() {
    try {
        // 檢測是否為手機版
        const isMobile = window.innerWidth <= 768;
        const tableContainer = document.querySelector('#scripts .table-container');
        
        // 直接獲取所有腳本
        const response = await fetch(`${API_BASE_URL}/admin/scripts`);
        const data = await response.json();
        const allScripts = data.scripts || [];
        
        // 顯示腳本
        if (allScripts.length === 0) {
            if (isMobile) {
                tableContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">暫無腳本記錄</div>';
            } else {
                document.getElementById('scripts-table-body').innerHTML = 
                    '<tr><td colspan="7" style="text-align: center; padding: 2rem;">暫無腳本記錄</td></tr>';
            }
            return;
        }
        
        if (isMobile) {
            // 手機版：卡片式佈局
            tableContainer.innerHTML = '';
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'mobile-cards-container';
            
            cardsContainer.innerHTML = allScripts.map((script, index) => `
                <div class="mobile-card">
                    <div class="mobile-card-header">
                        <span class="mobile-card-title">${script.title || script.name || '未命名腳本'}</span>
                        <span class="mobile-card-badge">${script.platform || '未設定'}</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">用戶ID</span>
                        <span class="mobile-card-value">${script.user_id.substring(0, 16)}...</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">分類</span>
                        <span class="mobile-card-value">${script.category || script.topic || '未分類'}</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">時間</span>
                        <span class="mobile-card-value">${formatDate(script.created_at)}</span>
                    </div>
                    <div class="mobile-card-actions">
                        <button class="btn-action btn-view" onclick="viewScriptByIdx(${index})" type="button">查看</button>
                        <button class="btn-action btn-delete" onclick="deleteScript(${script.id})" type="button">刪除</button>
                    </div>
                </div>
            `).join('');
            
            tableContainer.appendChild(cardsContainer);
        } else {
            // 桌面版：表格佈局
            const tbody = document.getElementById('scripts-table-body');
            tbody.innerHTML = allScripts.map((script, index) => `
                <tr>
                    <td>${script.id}</td>
                    <td>${script.user_id.substring(0, 12)}...</td>
                    <td>${script.title || script.name || '未命名腳本'}</td>
                    <td>${script.platform || '未設定'}</td>
                    <td>${script.category || script.topic || '未分類'}</td>
                    <td>${formatDate(script.created_at)}</td>
                    <td>
                        <button class="btn-action btn-view" onclick="viewScriptByIdx(${index})" type="button">查看</button>
                        <button class="btn-action btn-delete" onclick="deleteScript(${script.id})" type="button">刪除</button>
                    </td>
                </tr>
            `).join('');
        }
        
        // 保存腳本數據供查看功能使用
        window.allScripts = allScripts;
        
        // 添加匯出按鈕
        const actionsDiv = document.querySelector('#scripts .section-actions');
        if (actionsDiv) {
            let exportBtn = actionsDiv.querySelector('.btn-export');
            if (!exportBtn) {
                exportBtn = document.createElement('button');
                exportBtn.className = 'btn btn-secondary btn-export';
                exportBtn.innerHTML = '<i class="icon">📥</i> 匯出 CSV';
                exportBtn.onclick = () => exportCSV('scripts');
                actionsDiv.insertBefore(exportBtn, actionsDiv.firstChild);
            }
        }
        
    } catch (error) {
        console.error('載入腳本失敗:', error);
        showToast('載入腳本失敗', 'error');
    }
}

// ===== 生成記錄 =====
async function loadGenerations() {
    try {
        // 調用真實 API
        const response = await fetch(`${API_BASE_URL}/admin/generations`);
        const data = await response.json();
        const generations = data.generations || [];
        
        // 檢測是否為手機版
        const isMobile = window.innerWidth <= 768;
        const tableContainer = document.querySelector('#generations .table-container');
        
        if (isMobile) {
            // 手機版：卡片式佈局
            tableContainer.innerHTML = '';
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'mobile-cards-container';
            
            if (generations.length > 0) {
                cardsContainer.innerHTML = generations.map(gen => `
                    <div class="mobile-card">
                        <div class="mobile-card-header">
                            <span class="mobile-card-title">${gen.type || '生成記錄'}</span>
                            <span class="mobile-card-badge">${gen.platform}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">生成ID</span>
                            <span class="mobile-card-value">${gen.id}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">用戶</span>
                            <span class="mobile-card-value">${gen.user_name}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">主題</span>
                            <span class="mobile-card-value">${gen.topic}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">時間</span>
                            <span class="mobile-card-value">${formatDate(gen.created_at)}</span>
                        </div>
                    </div>
                `).join('');
            } else {
                cardsContainer.innerHTML = '<div class="empty-state">暫無生成記錄</div>';
            }
            
            tableContainer.appendChild(cardsContainer);
        } else {
            // 桌面版：表格佈局
            const tbody = document.getElementById('generations-table-body');
            if (generations.length > 0) {
                tbody.innerHTML = generations.map(gen => `
                    <tr>
                        <td>${gen.id}</td>
                        <td>${gen.user_name}</td>
                        <td>${gen.platform}</td>
                        <td>${gen.topic}</td>
                        <td>${gen.type}</td>
                        <td>${formatDate(gen.created_at)}</td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">暫無生成記錄</td></tr>';
            }
        }
        
        // 添加匯出按鈕
        const actionsDiv = document.querySelector('#generations .section-actions');
        if (actionsDiv) {
            let exportBtn = actionsDiv.querySelector('.btn-export');
            if (!exportBtn) {
                exportBtn = document.createElement('button');
                exportBtn.className = 'btn btn-secondary btn-export';
                exportBtn.innerHTML = '<i class="icon">📥</i> 匯出 CSV';
                exportBtn.onclick = () => exportCSV('generations');
                actionsDiv.insertBefore(exportBtn, actionsDiv.firstChild);
            }
        }
    } catch (error) {
        console.error('載入生成記錄失敗:', error);
        showToast('載入生成記錄失敗', 'error');
    }
}

// ===== 數據分析 =====
async function loadAnalytics() {
    try {
        // 調用真實 API
        const response = await fetch(`${API_BASE_URL}/admin/analytics-data`);
        const data = await response.json();
        
        // 平台使用分布
        if (charts.platform) charts.platform.destroy();
        const platformCtx = document.getElementById('platform-chart');
        charts.platform = new Chart(platformCtx, {
            type: 'pie',
            data: {
                labels: data.platform?.labels || ['暫無數據'],
                datasets: [{
                    data: data.platform?.data || [1],
                    backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#10b981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2
            }
        });
        
        // 時間段使用分析
        if (charts.timeUsage) charts.timeUsage.destroy();
        const timeUsageCtx = document.getElementById('time-usage-chart');
        charts.timeUsage = new Chart(timeUsageCtx, {
            type: 'bar',
            data: {
                labels: data.time_usage?.labels || ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
                datasets: [{
                    label: '使用次數',
                    data: data.time_usage?.data || [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: '#10b981'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2
            }
        });
        
        // 用戶活躍度
        if (charts.activity) charts.activity.destroy();
        const activityCtx = document.getElementById('activity-chart');
        charts.activity = new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: data.activity?.labels || ['第1週', '第2週', '第3週', '第4週'],
                datasets: [{
                    label: '活躍用戶數',
                    data: data.activity?.data || [0, 0, 0, 0],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2
            }
        });
        
        // 內容類型分布
        if (charts.contentType) charts.contentType.destroy();
        const contentTypeCtx = document.getElementById('content-type-chart');
        charts.contentType = new Chart(contentTypeCtx, {
            type: 'doughnut',
            data: {
                labels: data.content_type?.labels || ['暫無數據'],
                datasets: [{
                    data: data.content_type?.data || [1],
                    backgroundColor: [
                        '#3b82f6',
                        '#8b5cf6',
                        '#ec4899',
                        '#f59e0b',
                        '#10b981'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2
            }
        });
    } catch (error) {
        console.error('載入分析數據失敗:', error);
        showToast('載入分析數據失敗', 'error');
    }
}

// ===== 工具函數 =====
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 手機版側邊欄控制
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// 點擊側邊欄外部時關閉
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (sidebar && mobileMenuBtn) {
        // 如果在手機版且側邊欄打開
        if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            // 如果點擊的不是側邊欄內部和按鈕
            if (!sidebar.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    }
});

// ===== 訂閱管理功能 =====
async function toggleSubscribe(userId, subscribe) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/subscription`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_subscribed: subscribe })
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast(subscribe ? '已啟用訂閱' : '已取消訂閱', 'success');
            
            // 更新 UI
            updateSubscribeUI(userId, subscribe);
        } else {
            const error = await response.json();
            showToast(error.error || '操作失敗', 'error');
        }
    } catch (error) {
        console.error('修改訂閱狀態失敗:', error);
        showToast('修改訂閱狀態失敗', 'error');
    }
}

function updateSubscribeUI(userId, isSubscribed) {
    // 更新桌面版
    const statusCell = document.getElementById(`subscribe-status-${userId}`);
    if (statusCell) {
        statusCell.innerHTML = isSubscribed ? 
            '<span class="badge badge-success">已訂閱</span>' : 
            '<span class="badge badge-danger">未訂閱</span>';
    }
    
    // 更新手機版
    const mobileStatusCell = document.getElementById(`mobile-subscribe-status-${userId}`);
    if (mobileStatusCell) {
        mobileStatusCell.textContent = isSubscribed ? '已訂閱' : '未訂閱';
    }
    
    // 更新按鈕
    const rows = document.querySelectorAll(`[id^='${userId}']`);
    rows.forEach(row => {
        const parentRow = row.closest('tr') || row.closest('.mobile-card');
        if (parentRow) {
            const buttons = parentRow.querySelectorAll('.btn-subscribe');
            buttons.forEach(btn => {
                btn.textContent = isSubscribed ? '❌ 取消訂閱' : '✅ 啟用訂閱';
                btn.className = `btn-action btn-subscribe ${isSubscribed ? 'btn-danger' : 'btn-success'}`;
                btn.setAttribute('onclick', `toggleSubscribe('${userId}', ${!isSubscribed})`);
            });
        }
    });
    
    // 重新載入列表以更新所有數據
    loadUsers();
}

// ===== CSV 匯出功能 =====
async function exportCSV(type) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/export/${type}`);
        const blob = await response.blob();
        
        // 創建下載連結
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast(`已匯出 ${type}.csv`, 'success');
    } catch (error) {
        console.error('匯出 CSV 失敗:', error);
        showToast('匯出 CSV 失敗', 'error');
    }
}
 