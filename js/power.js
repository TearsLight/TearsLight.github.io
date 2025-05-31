const launchDate = new Date(2025,5,31,17,0,0); // 设置网站上线日期

function updateWebsiteAge() {
    const now = new Date();
    const diffMs = now - launchDate;
    
    // 计算年、月、日、时、分、秒
    const years = Math.floor(diffMs / 31536000000);
    const months = Math.floor((diffMs % 31536000000) / 2592000000);
    const days = Math.floor((diffMs % 2592000000) / 86400000);
    const hours = Math.floor((diffMs % 86400000) / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    // 格式化显示
    let ageString = "网站已运行：";
    if (years > 0) ageString += `${years}年`;
    if (months > 0) ageString += `${months}月`;
    if (days > 0) ageString += `${days}天`;
    ageString += `${hours}时${minutes}分${seconds}秒`;
    
    document.getElementById('website-age').textContent = ageString;
}

// 初始化显示
updateWebsiteAge();
// 每秒更新一次
setInterval(updateWebsiteAge, 1000);

// 随机格言功能
const mottos = [
    {
        text: "成功不是终点，失败也并非末日，重要的是继续前进的勇气。",
        author: "温斯顿·丘吉尔"
    },
    {
        text: "生活不是等待暴风雨过去，而是学会在雨中跳舞。",
        author: "维维安·格林"
    },
    {
        text: "只有在字典中，成功才会出现在工作之前。",
        author: "马克·吐温"
    },
    {
        text: "不要为成功而努力，要为做一个有价值的人而努力。",
        author: "阿尔伯特·爱因斯坦"
    },
    {
        text: "你今天所做的事情，决定了你明天的样子。",
        author: "罗伯特·T·清崎"
    },
    {
        text: "唯一的限制就是你自己设定的那些。",
        author: "未知"
    },
    {
        text: "成功的关键在于开始行动。开始的关键在于将复杂的大任务分解成可管理的小步骤，然后开始做第一个步骤。",
        author: "马克·吐温"
    }
];

// 从localStorage获取上次显示的格言索引
let lastIndex = localStorage.getItem('lastMottoIndex');
lastIndex = lastIndex !== null ? parseInt(lastIndex) : -1;

// 获取下一个格言索引（循环显示）
function getNextMottoIndex() {
    let nextIndex = lastIndex + 1;
    if (nextIndex >= mottos.length) {
        nextIndex = 0;
    }
    return nextIndex;
}

// 显示随机格言
function showRandomMotto() {
    // 使用循环显示而非完全随机，确保每条格言都会显示
    const nextIndex = getNextMottoIndex();
    const motto = mottos[nextIndex];
    
    // 存储当前索引
    localStorage.setItem('lastMottoIndex', nextIndex);
    
    // 获取DOM元素
    const mottoContainer = document.getElementById('motto-container');
    const mottoText = document.getElementById('motto-text');
    const mottoAuthor = document.getElementById('motto-author');
    
    // 添加淡出动画
    mottoContainer.style.opacity = '0';
    mottoContainer.style.transition = 'opacity 0.5s ease';
    
    // 淡出后更新内容
    setTimeout(() => {
        mottoText.textContent = motto.text;
        mottoAuthor.textContent = motto.author;
        
        // 添加淡入动画
        mottoContainer.style.opacity = '1';
    }, 500);
}

// 页面加载时显示格言
window.addEventListener('load', showRandomMotto);