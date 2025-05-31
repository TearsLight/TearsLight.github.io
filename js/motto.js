// 随机格言功能
const mottos = [
    {
        "text": "即使世界背叛了你，也要记得，有人曾为你跨过星海，折断过光刃。",
        "author": "《星轨回响》"
    },
    {
        "text": "少年的剑永远指向明天，哪怕此刻脚下是深渊，眼中亦有朝阳。",
        "author": "《剑与星尘》"
    },
    {
        "text": "数据会删除记忆，但代码里藏着永不褪色的约定 —— 就像你的笑容曾改写我的程序。",
        "author": "《虚拟夏娃》"
    },
    {
        "text": "魔法少女的裙摆扫过废墟时，破碎的月亮正在重组她们未说完的誓言。",
        "author": "《银月战歌》"
    },
    {
        "text": "游戏终局的存档点不是终点，是你重启世界时，依然选择握住我的手。",
        "author": "《像素诗篇》"
    },
    {
        "text": "当龙鳞映出夕阳，骑士才懂：守护的不是王国，是废墟里盛开的那朵野蔷薇。",
        "author": "《龙脊守望》"
    },
    {
        "text": "学园祭的烟火升空时，所有未说出口的告白都变成了光 —— 即使明天要回到不同的时空。",
        "author": "《时隙物语》"
    },
    {
        "text": "卡牌对战的真谛不是胜率，是当你抽出「奇迹」卡时，对手眼里闪过的光。",
        "author": "《决斗心刻》"
    },
    {
        "text": "异世界的勇者啊，请记住：圣剑斩不断轮回，但眼泪可以融化命运的锁链。",
        "author": "《轮回勇者传》"
    },
    {
        "text": "虚拟偶像的歌声穿透屏幕时，某个少年的房间里，现实与梦想撞碎成了银河。",
        "author": "《全息回响》"
    },
    {
        "text": "忍者的卷轴里写着终极奥义：不是手里剑的轨迹，是跌倒后依然抬头望向樱花的勇气。",
        "author": "《木叶流抄》"
    },
    {
        "text": "机甲驾驶员的遗书总写着同一句话：「能源耗尽前，请把我葬在能看见你微笑的坐标。」",
        "author": "《钢骨星葬》"
    },
    {
        "text": "魔法学院的禁书库里，最强大的咒语永远是：「我相信你存在过的每个瞬间。」",
        "author": "《言灵秘录》"
    },
    {
        "text": "当游戏角色有了自我意识，玩家才明白：我们操控的不是数据，是另一个宇宙的心跳。",
        "author": "《代码悖论》"
    },
    {
        "text": "刀剑神域的终章写着：真正的通关奖励，是你在虚拟世界里刻下的真实温柔。",
        "author": "《电子心碑》"
    },
    {
        "text": "我不说从摇篮到坟墓，只说从张嘴吃饭到闭嘴空盘 —— 每道美食都会被我消灭在口唇之中，这是我的誓言。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "能笑的时候就多笑笑吧，毕竟当你遇到笑不出来的事时，才会明白有些难过是连嘴角都无法勉强的。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "这条路谁都能走，但想长久走下去，注定要与困难为伴。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "美食能让人展露笑容，将所爱之物融入生活，便能收获日常的喜悦与动力。可正因如此，我们才要谨慎地对待这份美好。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "光越夺目，影子越清晰 —— 人啊，往往会被自己的影子囚禁。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "你我相识相遇，不求如长河永恒，即便只是朝露般短暂，也足以让我心怀感激。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "在我人生这本厚重的书中，如今有一页被命名为「恋人的名字」。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "爱上一个人时的幸福是满足的，就像拥有了整个世界的光。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "我们都在各自的困境中跋涉，但此刻，只有此刻，那些困顿仿佛都不存在了。我不再是无助的孩子，也不再是曾经的自己 —— 人生路上，我已能站稳双脚，独自前行。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "「喜欢」是扎根直觉的词，不由意志与理论左右。即便后来能说出万千理由，也早已不是心动那一刻的本能。人类的喜欢本就没有理由，因为它诞生于灵魂的直觉。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "人类本身就是奇迹 —— 没有设计图，没有工匠，却在母腹中孕育出生命。我们不是量产的机器人，所以无法预知「异常」，也无法靠更换零件解决问题。这样混沌又真实地活着，虽困惑胆怯，却也足够美好。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "世界由语言编织，人类也依赖语言而活。若你往好处想，万事皆可向好；若你沉溺悲观，境遇也会随之黯淡。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "生而无奈，本就是人世常态。",
        "author": "《就算，这份爱恋从今夜消失》"
    },
    {
        "text": "伤痛从不会完全消失，因为创伤也有记忆。但痛感终将褪去，人们就是这样带着印记，继续走下去的。",
        "author": "《就算，这份爱恋从今夜消失》"
    }
];

// 从localStorage获取上次显示的格言索引
let lastIndex = localStorage.getItem('lastMottoIndex');
lastIndex = lastIndex !== null ? parseInt(lastIndex) : -1;

// 获取下一个格言索引
function getNextMottoIndex() {
    let nextIndex = lastIndex + 1;
    if (nextIndex >= mottos.length) {
        nextIndex = 0;
    }
    return nextIndex;
}

// 打字效果核心函数
function typeText(element, text, callback) {
    let index = 0;
    const speed = 50; // 打字速度（毫秒/字符）
    const cursor = element.querySelector('.typing-effect::after');
    
    // 清除现有内容
    element.textContent = '';
    
    // 逐字添加文本
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
            // 文本输入完成后隐藏光标
            if (cursor) {
                cursor.style.display = 'none';
            }
            // 执行回调函数（如显示作者）
            if (callback) callback();
        }
    }, speed);
}

// 显示格言（包含打字效果）
function showMottoWithTyping() {
    const nextIndex = getNextMottoIndex();
    const motto = mottos[nextIndex];
    localStorage.setItem('lastMottoIndex', nextIndex);
    
    const mottoContainer = document.getElementById('motto-container');
    const mottoText = document.getElementById('motto-text');
    const mottoAuthor = document.getElementById('motto-author');
    
    if (!mottoContainer || !mottoText || !mottoAuthor) {
        console.error('格言元素不存在');
        return;
    }
    
    // 重置光标显示
    mottoText.style.position = 'relative';
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '|';
    // 先隐藏作者，等文本输入完成后显示
    mottoAuthor.style.display = 'none';
    mottoText.appendChild(cursor);
    
    // 执行打字效果
    typeText(mottoText, motto.text, function() {
        mottoAuthor.textContent = motto.author;
        mottoAuthor.style.display = 'block';
    });
}

// 页面加载时显示格言
showMottoWithTyping();