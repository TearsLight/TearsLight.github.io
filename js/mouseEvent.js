const words = ["从雨", "芳乃", "雷娜", "小春", "吸溜"];
let index = 0;

document.addEventListener('click', function (event) {
    if (index >= words.length) {
        index = 0;
    }
    const popup = document.createElement('div');
    popup.classList.add('popup-text');
    popup.textContent = words[index];
    // 让文字在鼠标旁边显示，可根据需求调整偏移量
    popup.style.left = (event.pageX + 10) + 'px';
    popup.style.top = (event.pageY + 10) + 'px';
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = 0;
        popup.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            popup.remove();
        }, 500);
    }, 100);

    index++;
});    