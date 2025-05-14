const titleElement = document.getElementById('title');
const leftTitle = '喜欢爸爸还是喜欢妈妈';
const rightTitle = '喜欢妈妈还是喜欢爸爸';

document.addEventListener('mousemove', function (event) {
    const windowWidth = window.innerWidth;
    const mouseX = event.clientX;

    if (mouseX < windowWidth / 2) {
        titleElement.textContent = leftTitle;
    } else {
        titleElement.textContent = rightTitle;
    }
});    