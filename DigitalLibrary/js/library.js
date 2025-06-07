// 图书数据
let books = [];
let currentBooks = [];
let currentBook = null;
let currentPage = 0;
let isDarkTheme = false;
let isReaderDark = false;
let isPageMode = false;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/DigitalLibrary/data/book.json');
        books = await response.json();
        
        // 规范化书籍对象，添加filename属性
        books = books.map(book => ({
            ...book,
            filename: book.filePath.split('/').pop() // 从filePath提取文件名
        }));
        
        currentBooks = [...books];
        displayBooks(currentBooks);
        console.log('图书列表加载成功:', books);
    } catch (e) {
        console.error('无法加载图书列表', e);
        document.getElementById('bookGrid').innerHTML = '<div class="error-message">无法加载图书列表</div>';
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

// 显示图书
function displayBooks(booksToShow) {
    const bookGrid = document.getElementById('bookGrid');
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

function loadBookContent(book) {
    if (!book || !book.filename) {
        console.error('错误：书籍对象或文件名无效', book);
        document.getElementById('pageContent').innerHTML = '书籍加载失败，请重试';
        return;
    }

    if (!book.content) {
        console.log('开始加载书籍:', book.filename);
        const filePath = `/DigitalLibrary/Books/${book.filename}`;
        
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP错误，状态码: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
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
                loadPage();
            })
            .catch(err => {
                console.error("加载书籍内容失败：", err);
                document.getElementById('pageContent').innerHTML = `
                    <div class="error-message">
                        加载失败喵~<br>
                        错误: ${err.message}<br>
                        尝试加载的文件: ${book.filename}
                    </div>
                `;
            });
    } else {
        console.log('使用缓存的书籍内容');
        loadPage();
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

function loadTxtBook(title, author, category, icon, path) {
    fetch(path)
        .then(res => res.text())
        .then(text => {
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
            displayBooks(currentBooks); // 重新渲染图书列表
        })
        .catch(err => console.error(`加载 ${title} 失败喵╥﹏╥...：`, err));
}    