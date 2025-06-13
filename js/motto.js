function fetchHitokoto() {
    return fetch('https://v1.hitokoto.cn/?k')
        .then(response => {
            if (!response.ok) {
                throw new Error('获取一言数据失败');
            }
            return response.json();
        })
        .then(data => {
            // 处理数据格式
            const formattedData = formatHitokoto(data);
            return formattedData;
        })
        .catch(error => {
            console.error('数据获取错误:', error);
            // 错误 fallback
            return {
                text: '获取一言失败，请重试',
                author: '系统提示'
            };
        });
}

//格式化数据
function formatHitokoto(data) {
    let authorText = '';
    if (data.from_who && data.from) {
        authorText = `${data.from_who}《${data.from}》`;
    } else if (data.from) {
        authorText = `《${data.from}》`;
    } else if (data.from_who) {
        authorText = data.from_who;
    } else {
        authorText = '未知来源';
    }

    return {
        text: data.hitokoto,
        author: authorText
    };
}

//渲染内容
function renderHitokoto() {
    fetchHitokoto()
        .then(formattedData => {
            // 获取DOM元素并插入内容
            document.getElementById('motto-text').textContent = formattedData.text;
            document.getElementById('motto-author').textContent = formattedData.author;
            
            // 添加淡入动画效果
            const container = document.getElementById('motto-container');
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                container.style.opacity = '1';
            }, 50);
        });
}

// 执行渲染
document.addEventListener('DOMContentLoaded', renderHitokoto);

// 添加按钮实现点击刷新
document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>刷新一言';
    document.body.appendChild(refreshBtn);
    refreshBtn.addEventListener('click', renderHitokoto);
});