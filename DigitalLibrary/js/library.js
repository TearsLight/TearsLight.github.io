// 图书数据
let books = [];
let currentBooks = [];
let currentBook = null;
let currentPage = 0;
let isDarkTheme = false;
let isReaderDark = false;
let isPageMode = false;
let isLoading = false; // 添加加载状态标志

document.addEventListener('DOMContentLoaded', async function() {
    // 显示初始加载页面
    showLoadingScreen('正在初始化图书馆...');
    
    try {
        const response = await fetch('/DigitalLibrary/data/book.json');
        
        if (!response.ok) {
            throw new Error(`HTTP错误，状态码: ${response.status}`);
        }
        
        books = await response.json();
        
        // 规范化书籍对象，添加filename属性
        books = books.map(book => ({
            ...book,
            filename: book.filePath.split('/').pop() // 从filePath提取文件名
        }));
        
        currentBooks = [...books];
        
        // 模拟加载过程
        updateLoadingProgress('加载图书数据中...', 50);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        updateLoadingProgress('渲染图书列表...', 80);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        displayBooks(currentBooks);
        
        updateLoadingProgress('加载完成！', 100);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        hideLoadingScreen();
        
        console.log('图书列表加载成功:', books);
    } catch (e) {
        console.error('无法加载图书列表', e);
        hideLoadingScreen();
        showErrorScreen('无法加载图书列表', e.message);
    }

    // 搜索框回车事件
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBooks();
        }
    });

    // 阅读器滚动翻页
    document.getElementById('pageContent').addEventListener('scroll', function(e) {
        if (!isPageMode && currentBook && currentBook.content) {
            const element = e.target;
            const scrollPercentage = element.scrollTop / (element.scrollHeight - element.clientHeight) * 100;
            const pageIndex = Math.floor(scrollPercentage / (100 / currentBook.content.length));
            if (pageIndex !== currentPage && pageIndex < currentBook.content.length) {
                currentPage = pageIndex;
                updatePageIndicator();
            }
        }
    });
});

// 显示加载屏幕
function showLoadingScreen(message = '加载中...') {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loadingScreen';
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="loading-cat">🐱</div>
            </div>
            <div class="loading-message" id="loadingMessage">${message}</div>
            <div class="loading-progress">
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="progress-text" id="progressText">0%</div>
            </div>
        </div>
    `;
    
    // 添加CSS样式
    if (!document.getElementById('loadingStyles')) {
        const style = document.createElement('style');
        style.id = 'loadingStyles';
        style.textContent = `
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 1;
                transition: opacity 0.5s ease;
            }
            
            .loading-container {
                text-align: center;
                color: white;
                max-width: 400px;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            }
            
            .loading-spinner {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto 2rem;
            }
            
            .spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 3px solid transparent;
                border-top: 3px solid #fff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .spinner-ring:nth-child(2) {
                width: 60px;
                height: 60px;
                top: 10px;
                left: 10px;
                animation-delay: -0.3s;
                border-top-color: #ff9a9e;
            }
            
            .spinner-ring:nth-child(3) {
                width: 40px;
                height: 40px;
                top: 20px;
                left: 20px;
                animation-delay: -0.6s;
                border-top-color: #fecfef;
            }
            
            .loading-cat {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 24px;
                animation: bounce 2s infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translate(-50%, -50%) translateY(0);
                }
                40% {
                    transform: translate(-50%, -50%) translateY(-10px);
                }
                60% {
                    transform: translate(-50%, -50%) translateY(-5px);
                }
            }
            
            .loading-message {
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 1.5rem;
                opacity: 0.9;
            }
            
            .loading-progress {
                width: 100%;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff9a9e, #fecfef);
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 4px;
            }
            
            .progress-text {
                font-size: 0.9rem;
                opacity: 0.8;
            }
            
            .error-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .error-container {
                text-align: center;
                color: white;
                max-width: 500px;
                padding: 2rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            }
            
            .error-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .error-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin-bottom: 1rem;
            }
            
            .error-message {
                font-size: 1rem;
                opacity: 0.8;
                margin-bottom: 1.5rem;
                line-height: 1.5;
            }
            
            .retry-button {
                background: linear-gradient(90deg, #ff9a9e, #fecfef);
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 25px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            }
            
            .retry-button:hover {
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loadingScreen);
    isLoading = true;
}

// 更新加载进度
function updateLoadingProgress(message, progress) {
    const loadingMessage = document.getElementById('loadingMessage');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (loadingMessage) loadingMessage.textContent = message;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;
}

// 隐藏加载屏幕
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
            isLoading = false;
        }, 500);
    }
}

// 显示错误屏幕
function showErrorScreen(title, message) {
    hideLoadingScreen();
    
    const errorScreen = document.createElement('div');
    errorScreen.id = 'errorScreen';
    errorScreen.className = 'error-screen';
    errorScreen.innerHTML = `
        <div class="error-container">
            <div class="error-icon">😿</div>
            <div class="error-title">${title}</div>
            <div class="error-message">${message}</div>
            <button class="retry-button" onclick="retryLoading()">重试</button>
        </div>
    `;
    
    document.body.appendChild(errorScreen);
}

// 重试加载
function retryLoading() {
    const errorScreen = document.getElementById('errorScreen');
    if (errorScreen) {
        errorScreen.remove();
    }
    window.location.reload();
}

// 显示书籍内容加载状态
function showBookLoadingState() {
    const pageContent = document.getElementById('pageContent');
    pageContent.innerHTML = `
        <div class="book-loading">
            <div class="book-loading-spinner">
                <div class="loading-cat">🐱</div>
                <div class="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
            </div>
            <div class="book-loading-text">正在加载书籍内容...</div>
        </div>
    `;
    
    // 添加书籍加载样式
    if (!document.getElementById('bookLoadingStyles')) {
        const style = document.createElement('style');
        style.id = 'bookLoadingStyles';
        style.textContent = `
            .book-loading {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
                color: #666;
            }
            
            .book-loading-spinner {
                display: flex;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .book-loading .loading-cat {
                font-size: 2rem;
                margin-right: 0.5rem;
                animation: bounce 2s infinite;
            }
            
            .loading-dots span {
                animation: blink 1.4s infinite both;
                font-size: 2rem;
                font-weight: bold;
            }
            
            .loading-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .loading-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes blink {
                0%, 80%, 100% {
                    opacity: 0;
                }
                40% {
                    opacity: 1;
                }
            }
            
            .book-loading-text {
                font-size: 1.1rem;
                color: #888;
            }
        `;
        document.head.appendChild(style);
    }
}

// 显示图书
function displayBooks(booksToShow) {
    const bookGrid = document.getElementById('bookGrid');
    
    if (isLoading) {
        return; // 如果正在加载中，不执行显示操作
    }
    
    bookGrid.innerHTML = '';

    if (booksToShow.length === 0) {
        bookGrid.innerHTML = '<div class="empty-message">没有找到匹配的图书喵（︶^︶）</div>';
        return;
    }

    booksToShow.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="book-cover" style="background: linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})">${book.icon}</div>
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        `;
        bookCard.addEventListener('click', () => openReader(book));
        bookGrid.appendChild(bookCard);
    });
}

// 随机颜色生成
function getRandomColor() {
    const colors = ['#ff9a9e', '#fecfef', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3', '#d299c2', '#fef9d7'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 搜索图书
function searchBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    if (query.trim() === '') {
        currentBooks = [...books];
    } else {
        currentBooks = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
    }
    displayBooks(currentBooks);
}

// 分类筛选
function filterBooks(category) {
    if (category === 'all') {
        currentBooks = [...books];
    } else {
        currentBooks = books.filter(book => book.category === category);
    }
    displayBooks(currentBooks);
}

// 切换主题
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    document.querySelector('.theme-toggle').textContent = isDarkTheme ? '☀️' : '🌙';
}

// 打开阅读器
function openReader(book) {
    // 验证book对象是否有效
    if (!book) {
        console.error('错误：未提供有效的书籍对象');
        return;
    }
    
    currentBook = book;
    currentPage = 0;

    console.log('准备打开阅读器:', book.title);
    document.getElementById('readerModal').style.display = 'block';
    document.getElementById('readerTitle').textContent = book.title;
    
    // 显示加载状态
    showBookLoadingState();
    
    // 调用改进后的加载函数
    loadBookContent(book);
}

// 关闭阅读器
function closeReader() {
    document.getElementById('readerModal').style.display = 'none';
    currentBook = null;
}

// 加载页面内容
function loadPage() {
    if (!currentBook || !currentBook.content || currentBook.content.length === 0) {
        console.error('错误：无法加载页面 - 没有有效的书籍内容');
        document.getElementById('pageContent').innerHTML = '没有可显示的内容喵<(￣ c￣)y▂ξ';
        return;
    }

    const pageContent = document.getElementById('pageContent');
    
    if (isPageMode) {
        // 分页模式：每次只显示一章
        if (currentPage >= 0 && currentPage < currentBook.content.length) {
            const chapter = currentBook.content[currentPage];
            pageContent.innerHTML = formatChapterContent(chapter);
        } else {
            pageContent.innerHTML = '章节不存在喵w(ﾟДﾟ)w';
        }
    } else {
        // 滚动模式：显示整本书
        const allChapters = currentBook.content.map(chapter => 
            `<div class="chapter">${formatChapterContent(chapter)}</div>`
        ).join('');
        pageContent.innerHTML = allChapters;
        
        // 滚动到当前页
        const scrollPosition = (currentPage / currentBook.content.length) * pageContent.scrollHeight;
        pageContent.scrollTo({ top: scrollPosition, behavior: 'instant' });
    }
    
    updatePageIndicator();
}

// 格式化章节内容
function formatChapterContent(chapter) {
    // 处理章节标题和内容
    const lines = chapter.split('\n');
    const title = lines[0]; // 第一行为标题
    const content = lines.slice(1).join('<br><br>'); // 其余为内容
    
    return `
        <h2 class="chapter-title">${title}</h2>
        <div class="chapter-content">${content}</div>
    `;
}

// 改进的书籍内容加载函数
function loadBookContent(book) {
    if (!book || !book.filename) {
        console.error('错误：书籍对象或文件名无效', book);
        document.getElementById('pageContent').innerHTML = '书籍加载失败，请重试';
        return;
    }

    if (!book.content) {
        console.log('开始加载书籍:', book.filename);
        const filePath = `/DigitalLibrary/Books/${book.filename}`;
        
        // 显示加载进度
        updateBookLoadingProgress('正在连接服务器...', 10);
        
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP错误，状态码: ${response.status}`);
                }
                updateBookLoadingProgress('正在下载内容...', 30);
                return response.text();
            })
            .then(text => {
                updateBookLoadingProgress('正在解析章节...', 60);
                
                setTimeout(() => { // 模拟处理时间
                    console.log('书籍内容加载成功，开始解析章节...');
                    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
                    const chapters = [];
                    let currentChapter = "";

                    // 从书籍配置中获取章节识别正则
                    const regexPattern = book.chapterRegex || '^(第[一二三四五六七八九十百]+章|第\\d+章|.+章)';
                    const chapterRegex = new RegExp(regexPattern);

                    lines.forEach(line => {
                        if (chapterRegex.test(line)) {
                            if (currentChapter) chapters.push(currentChapter);
                            currentChapter = line;
                        } else {
                            currentChapter += '\n' + line;
                        }
                    });
                    if (currentChapter) chapters.push(currentChapter);

                    book.content = chapters;
                    console.log(`成功解析 ${chapters.length} 个章节`);
                    
                    updateBookLoadingProgress('加载完成！', 100);
                    setTimeout(() => {
                        loadPage();
                    }, 500);
                }, 300);
            })
            .catch(err => {
                console.error("加载书籍内容失败：", err);
                document.getElementById('pageContent').innerHTML = `
                    <div class="error-message">
                        <div class="error-icon">😿</div>
                        <div class="error-title">加载失败喵~</div>
                        <div class="error-details">
                            错误: ${err.message}<br>
                            尝试加载的文件: ${book.filename}
                        </div>
                        <button class="retry-button" onclick="loadBookContent(currentBook)">重试</button>
                    </div>
                `;
            });
    } else {
        console.log('使用缓存的书籍内容');
        loadPage();
    }
}

// 更新书籍加载进度
function updateBookLoadingProgress(message, progress) {
    const bookLoadingText = document.querySelector('.book-loading-text');
    if (bookLoadingText) {
        bookLoadingText.textContent = `${message} (${progress}%)`;
    }
}

// 上一页
function prevPage() {
    if (currentBook && currentPage > 0) {
        currentPage--;
        loadPage();
        updatePageIndicator();
    }
}

// 下一页
function nextPage() {
    if (currentBook && currentPage < currentBook.content.length - 1) {
        currentPage++;
        loadPage();
        updatePageIndicator();
    }
}

// 更新页码指示器
function updatePageIndicator() {
    if (currentBook && currentBook.content) {
        document.getElementById('pageIndicator').textContent = 
            `第 ${currentPage + 1} 页 / 共 ${currentBook.content.length} 页`;
    }
}

// 切换阅读器主题
function toggleReaderTheme() {
    isReaderDark = !isReaderDark;
    const readerContent = document.getElementById('readerContent');
    if (isReaderDark) {
        readerContent.style.background = '#2c3e50';
        readerContent.style.color = 'white';
    } else {
        readerContent.style.background = 'white';
        readerContent.style.color = 'black';
    }
}

// 切换翻页模式
function changePageMode() {
    isPageMode = !isPageMode;
    loadPage();
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (document.getElementById('readerModal').style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        } else if (e.key === 'Escape') {
            closeReader();
        }
    }
});

// 改进的TXT书籍加载函数
function loadTxtBook(title, author, category, icon, path) {
    showLoadingScreen(`正在加载 ${title}...`);
    
    fetch(path)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP错误，状态码: ${res.status}`);
            }
            updateLoadingProgress('正在处理文本...', 50);
            return res.text();
        })
        .then(text => {
            updateLoadingProgress('正在分析段落...', 80);
            
            const paragraphs = text
                .split(/\n\s*\n/) // 空行分段
                .map(p => p.trim())
                .filter(p => p.length > 0);

            const book = {
                id: books.length + 1,
                title: title,
                author: author,
                category: category,
                icon: icon,
                filePath: path,  // 保留原始路径
                filename: path.split('/').pop(),  // 添加filename属性
                content: paragraphs
            };

            books.push(book);
            currentBooks = [...books];
            
            updateLoadingProgress('更新图书列表...', 100);
            
            setTimeout(() => {
                displayBooks(currentBooks); // 重新渲染图书列表
                hideLoadingScreen();
            }, 500);
        })
        .catch(err => {
            console.error(`加载 ${title} 失败喵╥﹏╥...：`, err);
            showErrorScreen(`加载 ${title} 失败`, err.message);
        });
}