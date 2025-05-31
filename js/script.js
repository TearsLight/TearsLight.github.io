let currentPage = 0;
let totalPages = 4;
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

    
    pageCounter.textContent = `Page ${currentPage + 1} of ${totalPages}`;

    
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