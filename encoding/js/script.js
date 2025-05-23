document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const message = document.getElementById('message');
    
    // 编码/解码函数
    const encoders = {
        'base64': (text) => btoa(unescape(encodeURIComponent(text))),
        'url': (text) => encodeURI(text),
        'uri': (text) => encodeURIComponent(text),
        'html': (text) => {
            const element = document.createElement('div');
            element.textContent = text;
            return element.innerHTML;
        },
        'json': (text) => JSON.stringify(text)
    };
    
    const decoders = {
        'base64': (text) => decodeURIComponent(escape(atob(text))),
        'url': (text) => decodeURI(text),
        'uri': (text) => decodeURIComponent(text),
        'html': (text) => {
            const element = document.createElement('div');
            element.innerHTML = text;
            return element.textContent;
        },
        'json': (text) => {
            try {
                return JSON.parse(text);
            } catch (e) {
                return text;
            }
        }
    };
    
    // 绑定按钮事件
    document.querySelectorAll('[id^="encode-"]').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.id.split('-')[1];
            processText(type, 'encode');
        });
    });
    
    document.querySelectorAll('[id^="decode-"]').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.id.split('-')[1];
            processText(type, 'decode');
        });
    });
    
    // 处理文本
    function processText(type, action) {
        const text = inputText.value.trim();
        if (!text) {
            showMessage('请输入要处理的文本', 'error');
            return;
        }
        
        try {
            const processor = action === 'encode' ? encoders[type] : decoders[type];
            const result = processor(text);
            outputText.value = result;
            showMessage(`${action.charAt(0).toUpperCase() + action.slice(1)}成功 (${type})`, 'success');
        } catch (error) {
            showMessage(`${action}失败: ${error.message}`, 'error');
        }
    }
    
    // 显示消息
    function showMessage(msg, type) {
        message.textContent = msg;
        message.className = `alert ${type}`;
        message.style.display = 'block';
        
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }
});