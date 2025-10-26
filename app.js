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

function loadCharts(stats) {
    // 用戶增長趨勢圖
    if (charts.userGrowth) charts.userGrowth.destroy();
    const userGrowthCtx = document.getElementById('user-growth-chart');
    charts.userGrowth = new Chart(userGrowthCtx, {
        type: 'line',
        data: {
            labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
            datasets: [{
                label: '新增用戶',
                data: [12, 19, 15, 25, 22, 30, 28],
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
    
    // 模式使用分布圖
    if (charts.modeDistribution) charts.modeDistribution.destroy();
    const modeDistributionCtx = document.getElementById('mode-distribution-chart');
    charts.modeDistribution = new Chart(modeDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['一鍵生成', 'AI顧問', 'IP人設規劃'],
            datasets: [{
                data: [45, 35, 20],
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
}

async function loadRecentActivities() {
    try {
        // 載入最近活動
        const activitiesHtml = `
            <div class="activity-item">
                <div class="activity-icon">👤</div>
                <div>
                    <strong>新用戶註冊</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: #64748b;">3 分鐘前</p>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">💬</div>
                <div>
                    <strong>用戶開始AI顧問對話</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: #64748b;">15 分鐘前</p>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">📝</div>
                <div>
                    <strong>新腳本生成</strong>
                    <p style="margin: 0; font-size: 0.875rem; color: #64748b;">30 分鐘前</p>
                </div>
            </div>
        `;
        document.getElementById('recent-activities').innerHTML = activitiesHtml;
    } catch (error) {
        console.error('載入活動失敗:', error);
    }
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
            cardsContainer.innerHTML = data.users.map(user => `
                <div class="mobile-card">
                    <div class="mobile-card-header">
                        <span class="mobile-card-title">${user.name || '未命名用戶'}</span>
                        <span class="mobile-card-badge">用戶</span>
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
                        <span class="mobile-card-label">註冊時間</span>
                        <span class="mobile-card-value">${formatDate(user.created_at)}</span>
                    </div>
                    <div class="mobile-card-actions">
                        <button class="btn-action btn-view" onclick="viewUser('${user.user_id}')" type="button">查看詳情</button>
                    </div>
                </div>
            `).join('');
            
            tableContainer.appendChild(cardsContainer);
        } else {
            // 桌面版：表格佈局
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = data.users.map(user => `
                <tr>
                    <td>${user.user_id.substring(0, 12)}...</td>
                    <td>${user.email}</td>
                    <td>${user.name || '-'}</td>
                    <td>${formatDate(user.created_at)}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                        <button class="btn-action btn-view" onclick="viewUser('${user.user_id}')" type="button">查看</button>
                    </td>
                </tr>
            `).join('');
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
        // 載入模式統計數據
        document.getElementById('mode1-count').textContent = '0';
        document.getElementById('mode1-success').textContent = '0%';
        document.getElementById('mode2-count').textContent = '0';
        document.getElementById('mode2-avg').textContent = '0';
        document.getElementById('mode3-count').textContent = '0';
        document.getElementById('mode3-profile').textContent = '0';
        
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
                        data: [5, 15, 20, 10],
                        backgroundColor: '#3b82f6'
                    },
                    {
                        label: 'AI顧問',
                        data: [3, 12, 15, 8],
                        backgroundColor: '#8b5cf6'
                    },
                    {
                        label: 'IP人設規劃',
                        data: [2, 8, 10, 5],
                        backgroundColor: '#f59e0b'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2
            }
        });
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
        
        // 獲取所有用戶
        const usersResponse = await fetch(`${API_BASE_URL}/admin/users`);
        const usersData = await usersResponse.json();
        
        if (!usersData.users || usersData.users.length === 0) {
            if (isMobile) {
                tableContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">暫無對話記錄</div>';
            } else {
                document.getElementById('conversations-table-body').innerHTML = 
                    '<tr><td colspan="6" style="text-align: center; padding: 2rem;">暫無對話記錄</td></tr>';
            }
            return;
        }
        
        // 為每個用戶獲取對話記錄
        let allConversations = [];
        for (const user of usersData.users) {
            try {
                const convResponse = await fetch(`${API_BASE_URL}/user/conversations/${user.user_id}`);
                if (convResponse.ok) {
                    const convData = await convResponse.json();
                    if (convData.conversations && convData.conversations.length > 0) {
                        convData.conversations.forEach(conv => {
                            allConversations.push({
                                user_id: user.user_id,
                                mode: conv.conversation_type || 'AI顧問',
                                summary: conv.summary || '對話記錄',
                                message_count: conv.message_count || 0,
                                created_at: conv.created_at
                            });
                        });
                    }
                }
            } catch (e) {
                console.error(`獲取用戶 ${user.user_id} 的對話記錄失敗:`, e);
            }
        }
        
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
        
        // 獲取所有用戶
        const usersResponse = await fetch(`${API_BASE_URL}/admin/users`);
        const usersData = await usersResponse.json();
        
        if (!usersData.users || usersData.users.length === 0) {
            if (isMobile) {
                tableContainer.innerHTML = '<div style="text-align: center; padding: 2rem;">暫無腳本記錄</div>';
            } else {
                document.getElementById('scripts-table-body').innerHTML = 
                    '<tr><td colspan="7" style="text-align: center; padding: 2rem;">暫無腳本記錄</td></tr>';
            }
            return;
        }
        
        // 為每個用戶獲取腳本
        let allScripts = [];
        for (const user of usersData.users) {
            try {
                const scriptsResponse = await fetch(`${API_BASE_URL}/scripts/my?user_id=${user.user_id}`);
                if (scriptsResponse.ok) {
                    const scriptsData = await scriptsResponse.json();
                    if (scriptsData.scripts && scriptsData.scripts.length > 0) {
                        scriptsData.scripts.forEach(script => {
                            allScripts.push({
                                id: script.id,
                                user_id: user.user_id,
                                title: script.title || script.name || '未命名腳本',
                                platform: script.platform || '未設定',
                                category: script.topic || '未分類',
                                content: script.content || '',
                                created_at: script.created_at || script.createdAt
                            });
                        });
                    }
                }
            } catch (e) {
                console.error(`獲取用戶 ${user.user_id} 的腳本失敗:`, e);
            }
        }
        
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
                        <span class="mobile-card-title">${script.title}</span>
                        <span class="mobile-card-badge">${script.platform}</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">用戶ID</span>
                        <span class="mobile-card-value">${script.user_id.substring(0, 16)}...</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="mobile-card-label">分類</span>
                        <span class="mobile-card-value">${script.category}</span>
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
                    <td>${script.title}</td>
                    <td>${script.platform}</td>
                    <td>${script.category}</td>
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
        
    } catch (error) {
        console.error('載入腳本失敗:', error);
        showToast('載入腳本失敗', 'error');
    }
}

// ===== 生成記錄 =====
async function loadGenerations() {
    try {
        // 檢測是否為手機版
        const isMobile = window.innerWidth <= 768;
        const tableContainer = document.querySelector('#generations .table-container');
        
        // TODO: 實現生成記錄API
        setTimeout(() => {
            const mockGenerations = [
                {
                    id: 'gen123...',
                    user_id: 'user123...',
                    platform: '抖音',
                    category: '美食',
                    type: '帳號定位',
                    created_at: new Date()
                }
            ];
            
            if (isMobile) {
                // 手機版：卡片式佈局
                tableContainer.innerHTML = '';
                const cardsContainer = document.createElement('div');
                cardsContainer.className = 'mobile-cards-container';
                
                cardsContainer.innerHTML = mockGenerations.map(gen => `
                    <div class="mobile-card">
                        <div class="mobile-card-header">
                            <span class="mobile-card-title">${gen.type}</span>
                            <span class="mobile-card-badge">${gen.platform}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">生成ID</span>
                            <span class="mobile-card-value">${gen.id}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">用戶ID</span>
                            <span class="mobile-card-value">${gen.user_id}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">分類</span>
                            <span class="mobile-card-value">${gen.category}</span>
                        </div>
                        <div class="mobile-card-row">
                            <span class="mobile-card-label">時間</span>
                            <span class="mobile-card-value">${formatDate(gen.created_at)}</span>
                        </div>
                    </div>
                `).join('');
                
                tableContainer.appendChild(cardsContainer);
            } else {
                // 桌面版：表格佈局
                const tbody = document.getElementById('generations-table-body');
                tbody.innerHTML = mockGenerations.map(gen => `
                    <tr>
                        <td>${gen.id}</td>
                        <td>${gen.user_id}</td>
                        <td>${gen.platform}</td>
                        <td>${gen.category}</td>
                        <td>${gen.type}</td>
                        <td>${formatDate(gen.created_at)}</td>
                    </tr>
                `).join('');
            }
        }, 1000);
    } catch (error) {
        console.error('載入生成記錄失敗:', error);
        showToast('載入生成記錄失敗', 'error');
    }
}

// ===== 數據分析 =====
async function loadAnalytics() {
    try {
        // 平台使用分布
        if (charts.platform) charts.platform.destroy();
        const platformCtx = document.getElementById('platform-chart');
        charts.platform = new Chart(platformCtx, {
            type: 'pie',
            data: {
                labels: ['抖音', '小紅書', 'Instagram', 'YouTube'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6', '#ef4444']
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
                labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
                datasets: [{
                    label: '使用次數',
                    data: [120, 150, 180, 145, 200, 220, 180],
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
                labels: ['第1週', '第2週', '第3週', '第4週'],
                datasets: [{
                    label: '活躍用戶數',
                    data: [50, 65, 70, 85],
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
                labels: ['美食', '旅遊', '時尚', '教育', '其他'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
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
 