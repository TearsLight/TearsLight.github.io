//一言
document.addEventListener('DOMContentLoaded', function() {
    new Typed('.element', {
        strings: ["钟鼎山林都是梦，人间宠辱休惊。",
            "千叠云山千叠愁，一天明月一天恨。",
            "我是人间惆怅客，知君何事泪纵横，断肠声里忆平生。",
            "渐行渐远渐无书，水阔鱼沉何处问。",
            "琵琶弦上说相思。当时明月在，曾照彩云归。",
            "长恨此身非我有，何时忘却营营。",
            "问君何能尔，何必白头唯醉笑。",
            "花开花落花无悔，缘来缘去缘如水。",
            "人生天地之间，若白驹之过隙，忽然而已。",
            "天地有大美而不言，四时有明法而不议，万物有成理而不说。",
            "达生之情者，不务生之所无以为；达命之情者，不务知之所无奈何 。"
        ],
        typeSpeed: 190,
        backSpeed: 50,
        loop: true,
        showCursor: true
    });
});

//标题
// 保存初始标题
var originalTitle = document.title;
// 窗口失去焦点时（切换到其他标签页）执行的函数
window.onblur = function () {
    document.title = "网页炸了，回来看看叭～";
};
// 窗口获得焦点时（切回该标签页）执行的函数
window.onfocus = function () {
    document.title = originalTitle;
};

// 滚动页面脚本
let currentPage = 0;
let totalPages = 2;
let isScrolling = false;

const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.scroll-dot');
const pageCounter = document.getElementById('pageCounter');

document.addEventListener('wheel', function(e) {
    // e.preventDefault();
    
    if (isScrolling) return;
    
    isScrolling = true;
    
    if (e.deltaY > 0) {
        
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePage();
        }
    } else {
        
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    }
    
    
    setTimeout(() => {
        isScrolling = false;
    }, 800);
});


document.addEventListener('keydown', function(e) {
    if (isScrolling) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePage();
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    }
});


function updatePage() {
    
    pages.forEach((page, index) => {
        page.classList.remove('active', 'prev');
        
        if (index === currentPage) {
            page.classList.add('active');
            page.style.transform = 'translateY(0)';
        } else if (index < currentPage) {
            page.classList.add('prev');
            page.style.transform = 'translateY(-100vh)';
        } else {
            page.style.transform = 'translateY(100vh)';
        }
    });

    
    dots.forEach((dot, index) => {
        if (index === currentPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    
    pageCounter.textContent = `第${currentPage + 1}页 `;

    // Load messages for the current page   
    const currentMessages = pages[currentPage].querySelector('.messages');
    if (currentMessages) {
        currentMessages.classList.add('loading');
        setTimeout(() => {
            currentMessages.classList.remove('loading');
        }, 800);
    }

    
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint && currentPage > 0) {
        scrollHint.style.opacity = '0';
        setTimeout(() => {
            if (scrollHint.parentNode) {
                scrollHint.parentNode.removeChild(scrollHint);
            }
        }, 500);
    }
}


function goToPage(pageIndex) {
    if (pageIndex !== currentPage && !isScrolling) {
        currentPage = pageIndex;
        isScrolling = true;
        updatePage();
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
}


function addNewPage(content) {
    const newPage = document.createElement('div');
    newPage.className = 'page messages';
    newPage.innerHTML = `
        <div class="messages">
            <div class="main">
                ${content}
            </div>
        </div>
    `;
    
    document.getElementById('scrollContainer').appendChild(newPage);
    
    
    const newDot = document.createElement('div');
    newDot.className = 'scroll-dot';
    newDot.onclick = () => goToPage(totalPages);
    document.getElementById('scrollIndicator').appendChild(newDot);
    
    totalPages++;
    
    
    const updatedPages = document.querySelectorAll('.page');
    const updatedDots = document.querySelectorAll('.scroll-dot');
    
    return newPage;
}


let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    if (isScrolling) return;
    
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        isScrolling = true;
        
        if (diff > 0) {
            // Swipe up (next page)
            if (currentPage < totalPages - 1) {
                currentPage++;
                updatePage();
            }
        } else {
            // Swipe down (previous page)
            if (currentPage > 0) {
                currentPage--;
                updatePage();
            }
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updatePage();
});

// Example of adding content dynamically
// addNewPage('<h2>Dynamic Page</h2><p>This was added dynamically!</p>');