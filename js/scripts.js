/*
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. 
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/.
 * Copyright (c) 2016 Julian Garnier
 */

function createButtonLink(href = '#', text = '按钮', color = '#007bff', hoverColor = '#0056b3') {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;

  // **先设置所有样式和事件**
  link.style.cssText = `
    display: inline-block;
    padding: 10px 20px;
    background-color: ${color};
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
    /* 初始隐藏（可选） */
    opacity: 0;
    transform: translateY(20px); /* 初始位移，实现进场动画 */
  `;

  // 鼠标悬停样式
  link.addEventListener('mouseover', () => {
    link.style.backgroundColor = hoverColor;
  });

  link.addEventListener('mouseout', () => {
    link.style.backgroundColor = color;
  });

  // **最后插入页面**
  document.body.appendChild(link);

  // **添加进场动画（可选）**
  setTimeout(() => {
    link.style.opacity = 1;
    link.style.transform = 'translateY(0)';
  }, 0); // 0ms 确保渲染后立即执行动画

  return link;
}
 


window.onload = function() {

  var messagesEl = /** @type {HTMLElement} */(document.querySelector('.messages'));
  var typingSpeed = 20;
  var loadingText = '<b>•</b><b>•</b><b>•</b>';
  var messageIndex = 0;

  var getCurrentTime = function() {
    var date = new Date();
    var hours =  date.getHours();
    var minutes =  date.getMinutes();
    var current = hours + (minutes * .01);
    if (current >= 5 && current < 7) return '晨光初绽时与你相遇，愿这抹清新的问候，如晨露般滋润你的心灵，开启活力满满的一天！';
    if (current >= 7 && current < 11) return '阳光正好，微风不燥，愿此刻的你，在学习探索中汲取能量，工作学习皆顺遂，朝着目标大步迈进！';
    if (current >= 11 && current < 13) return '忙碌了半天，来这里稍作停歇吧！愿这份问候化作温暖的午餐，驱散疲惫，让你元气满满再出发！';
    if (current >= 13 && current < 18) return '午后时光，最是惬意。愿你在生活的字里行间，寻得一丝灵感，收获一份从容，度过悠闲又充实的下午！';
    if (current >= 18 && current < 20) return '夕阳西下，余晖满天，感谢此刻与你相逢。愿归家路上皆是温柔，卸下一天的疲惫，享受夜晚的宁静！';
    if (current >=20 || current < 5 ) return '当星辰点亮夜空，很高兴你来到这里。愿今日的美好，成为你深夜的陪伴，做个甜甜的梦，迎接明日曙光！';
  }

  var messages = [
    '欢迎来到这片数字花园！❤️',
    '每一个板块都是一朵精心培育的花朵😎',
    '每一次互动都是一场奇妙的邂逅😊',
    '愿你漫步其中时❤️',
    '被美好与惊喜环绕😋',
    '享受这独一无二的浏览时光！😙',
    getCurrentTime(),
    'Ciallo～(∠・ω<)⌒☆',
    '<a href="/blog/index.html" class="botton-link">访问博客</a>',
  ]

  var getFontSize = function() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  }

  var pxToRem = function(px) {
    return px / getFontSize() + 'rem';
  }

  var createBubbleElements = function(message, position) {
    var bubbleEl = document.createElement('div');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = `0`;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  }

  var getDimentions = function(elements) {
    const messageW = elements.message.offsetWidth + 2;
    const messageH = elements.message.offsetHeight;
    const messageS = getComputedStyle(elements.bubble);
    const paddingTop = Math.ceil(parseFloat(messageS.paddingTop));
    const paddingLeft = Math.ceil(parseFloat(messageS.paddingLeft));
    return {
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(messageW + paddingLeft * 2),
        h: pxToRem(messageH + paddingTop * 2)
      },
      message: {
        w: pxToRem(messageW),
        h: pxToRem(messageH)
      }
    }
  }

  var sendMessage = function(message, position) {
    if(message=== 'button') {
      const button = createButtonLink(message.href, message.text);
      message = button.outerHTML;
    }
    var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
    var elements = createBubbleElements(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    var dimensions = getDimentions(elements);
    elements.message.style.display = 'block';
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = `1`;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0ch', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function(i) {return (i * 100) + 50}
    });
    setTimeout(function() {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w ],
        height: [dimensions.loading.h, dimensions.bubble.h ],
        marginTop: 0,
        marginLeft: 0,
        begin: function() {
          if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
        },
      })
    }, loadingDuration - 50);
  }

  var sendMessages = function() {
    var message = messages[messageIndex];
    if (!message) return;
    sendMessage(message);
    ++messageIndex;
    setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
  }

  sendMessages();

}
