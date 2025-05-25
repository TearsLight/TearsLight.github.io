// Encoding and Decoding Functions
        function encodeText(method) {
            const input = document.getElementById('inputText').value;
            const output = document.getElementById('outputText');
            
            if (!input.trim()) {
                alert('Please enter text to encode');
                return;
            }
            
            try {
                let result = '';
                
                switch(method) {
                    case 'url':
                        result = encodeURIComponent(input);
                        break;
                    case 'urlPartial':
                        result = encodeURI(input);
                        break;
                    case 'base64':
                        result = btoa(unescape(encodeURIComponent(input)));
                        break;
                    case 'base64Safe':
                        result = btoa(unescape(encodeURIComponent(input)))
                            .replace(/\+/g, '-')
                            .replace(/\//g, '_')
                            .replace(/=/g, '');
                        break;
                    case 'hex':
                        result = Array.from(new TextEncoder().encode(input))
                            .map(b => b.toString(16).padStart(2, '0'))
                            .join('');
                        break;
                    case 'html10':
                        result = input.replace(/[\u0080-\uFFFF]/g, function(match) {
                            return '&#' + match.charCodeAt(0) + ';';
                        });
                        break;
                    case 'htmlSpecial':
                        result = input
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#039;');
                        break;
                    case 'js8':
                        result = input.split('').map(char => 
                            '\\' + char.charCodeAt(0).toString(8).padStart(3, '0')
                        ).join('');
                        break;
                    case 'js16':
                        result = input.split('').map(char => 
                            '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')
                        ).join('');
                        break;
                    case 'unicode':
                        result = input.split('').map(char => 
                            '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0')
                        ).join('');
                        break;
                    case 'stringCharCode':
                        result = 'String.fromCharCode(' + 
                            input.split('').map(char => char.charCodeAt(0)).join(',') + 
                            ')';
                        break;
                    default:
                        result = 'Encoding method not implemented';
                }
                
                output.value = result;
            } catch (error) {
                output.value = 'Error: ' + error.message;
            }
        }

        function decodeText(method) {
            const input = document.getElementById('inputText').value;
            const output = document.getElementById('outputText');
            
            if (!input.trim()) {
                alert('Please enter text to decode');
                return;
            }
            
            try {
                let result = '';
                
                switch(method) {
                    case 'url':
                        result = decodeURIComponent(input);
                        break;
                    case 'base64':
                        result = decodeURIComponent(escape(atob(input)));
                        break;
                    case 'hex':
                        const hexPairs = input.match(/.{1,2}/g) || [];
                        const bytes = hexPairs.map(hex => parseInt(hex, 16));
                        result = new TextDecoder().decode(new Uint8Array(bytes));
                        break;
                    case 'html10':
                        result = input.replace(/&#(\d+);/g, function(match, dec) {
                            return String.fromCharCode(dec);
                        });
                        break;
                    case 'html16':
                        result = input.replace(/&#x([0-9a-fA-F]+);/g, function(match, hex) {
                            return String.fromCharCode(parseInt(hex, 16));
                        });
                        break;
                    case 'html16Dec':
                        result = input
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/&#039;/g, "'");
                        break;
                    case 'js8':
                        result = input.replace(/\\(\d{3})/g, function(match, octal) {
                            return String.fromCharCode(parseInt(octal, 8));
                        });
                        break;
                    case 'js16':
                        result = input.replace(/\\u([0-9a-fA-F]{4})/g, function(match, hex) {
                            return String.fromCharCode(parseInt(hex, 16));
                        });
                        break;
                    case 'unicode':
                        result = input.replace(/\\u([0-9a-fA-F]{4})/g, function(match, hex) {
                            return String.fromCharCode(parseInt(hex, 16));
                        });
                        break;
                    default:
                        result = 'Decoding method not implemented';
                }
                
                output.value = result;
            } catch (error) {
                output.value = 'Error: ' + error.message;
            }
        }

        function executeDirectly() {
            const input = document.getElementById('inputText').value;
            const output = document.getElementById('outputText');
            
            try {
                const result = eval(input);
                output.value = String(result);
            } catch (error) {
                output.value = 'Execution Error: ' + error.message;
            }
        }

        function swapInputOutput() {
            const input = document.getElementById('inputText');
            const output = document.getElementById('outputText');
            
            const temp = input.value;
            input.value = output.value;
            output.value = temp;
        }

        function copyToClipboard() {
            const output = document.getElementById('outputText');
            
            if (!output.value.trim()) {
                alert('No result to copy');
                return;
            }
            
            output.select();
            document.execCommand('copy');
            
            // Visual feedback
            const originalBg = output.style.backgroundColor;
            output.style.backgroundColor = '#d4edda';
            setTimeout(() => {
                output.style.backgroundColor = originalBg;
            }, 500);
            
            alert('Result copied to clipboard!');
        }

        function clearAll() {
            document.getElementById('inputText').value = '';
            document.getElementById('outputText').value = '';
        }

        // Initialize with focus on input
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('inputText').focus();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        swapInputOutput();
                        break;
                    case 'l':
                        e.preventDefault();
                        clearAll();
                        break;
                }
            }
        });