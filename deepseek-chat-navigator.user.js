// ==UserScript==
// @name         DeepSeek Chat Navigator
// @namespace    https://github.com/widechaos/deepseek-chat-navigator
// @version      1.2.5
// @description  🚀 智能侧边栏导航，精确定位DeepSeek对话提问和回答！支持开头/结尾双模式定位，长对话浏览神器！
// @author       widechaos
// @match        https://chat.deepseek.com/*
// @match        https://www.deepseek.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @supportURL   https://github.com/widechaos/deepseek-chat-navigator/issues
// @updateURL    https://github.com/widechaos/deepseek-chat-navigator/raw/main/deepseek-chat-navigator.user.js
// @downloadURL  https://github.com/widechaos/deepseek-chat-navigator/raw/main/deepseek-chat-navigator.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .ds-navigator {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 350px;
            max-height: 70vh;
            overflow-y: auto;
            background: rgba(255, 255, 255, 0.98);
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            padding: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .ds-navigator.collapsed {
            width: 50px;
            height: 50px;
            padding: 0;
            overflow: hidden;
        }

        .ds-navigator.collapsed .ds-nav-content {
            display: none;
        }

        .ds-nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f3f4f6;
            position: sticky;
            top: 0;
            background: rgba(255, 255, 255, 0.98);
            z-index: 1;
            backdrop-filter: blur(5px);
        }

        .ds-nav-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
        }

        .ds-nav-toggle {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #6b7280;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .ds-nav-toggle:hover {
            background: #f3f4f6;
            color: #374151;
        }

        .ds-nav-content {
            max-height: calc(70vh - 60px);
            overflow-y: auto;
        }

        .ds-nav-item {
            padding: 12px;
            margin-bottom: 8px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            gap: 8px;
            cursor: pointer;
        }

        .ds-nav-item:hover {
            background: #eff6ff;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
        }

        .ds-nav-item.user {
            border-left-color: #10b981;
        }

        .ds-nav-item.assistant {
            border-left-color: #8b5cf6;
        }

        .ds-nav-item-header {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ds-nav-icon {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .ds-nav-icon.user {
            background: #10b981;
        }

        .ds-nav-icon.assistant {
            background: #8b5cf6;
        }

        .ds-nav-item-info {
            flex: 1;
            min-width: 0;
        }

        .ds-nav-type {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ds-nav-counter {
            background: #3b82f6;
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 10px;
            min-width: 20px;
            text-align: center;
        }

        .ds-nav-item.user .ds-nav-counter {
            background: #10b981;
        }

        .ds-nav-item.assistant .ds-nav-counter {
            background: #8b5cf6;
        }

        .ds-nav-text {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            word-break: break-word;
            margin-bottom: 4px;
        }

        /* 特殊处理代码块的显示 */
        .ds-nav-code-indicator {
            display: inline-block;
            background: #f3f4f6;
            color: #6b7280;
            font-size: 11px;
            padding: 1px 4px;
            border-radius: 3px;
            margin-right: 4px;
            border: 1px solid #e5e7eb;
        }

        .ds-nav-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #9ca3af;
        }

        .ds-nav-buttons {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .ds-nav-item:hover .ds-nav-buttons {
            opacity: 1;
        }

        .ds-nav-button {
            flex: 1;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 500;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }

        .ds-nav-button-start {
            background: #3b82f6;
            color: white;
        }

        .ds-nav-button-start:hover {
            background: #2563eb;
        }

        .ds-nav-button-end {
            background: #8b5cf6;
            color: white;
        }

        .ds-nav-button-end:hover {
            background: #7c3aed;
        }

        .ds-nav-button.user {
            background: #10b981;
        }

        .ds-nav-button.user:hover {
            background: #059669;
        }

        .ds-nav-mini-toggle {
            position: fixed;
            right: 20px;
            top: 80px;
            width: 40px;
            height: 40px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 9998;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
        }

        .ds-nav-mini-toggle:hover {
            background: #2563eb;
            transform: scale(1.05);
        }

        .ds-nav-active {
            background: #dbeafe !important;
            border-left-width: 6px !important;
        }

        .ds-nav-highlight {
            animation: highlight-pulse 2s ease;
        }

        .ds-nav-badge {
            display: inline-block;
            padding: 2px 6px;
            background: #e5e7eb;
            color: #6b7280;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            margin-left: 4px;
        }

        .ds-nav-pair-group {
            margin-bottom: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
        }

        .ds-nav-pair-header {
            background: #f3f4f6;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;
        }

        .ds-nav-pair-number {
            font-size: 12px;
            font-weight: 600;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ds-nav-pair-count {
            background: #3b82f6;
            color: white;
            font-size: 10px;
            padding: 1px 6px;
            border-radius: 10px;
        }

        .ds-nav-pair-content {
            background: white;
        }

        .ds-nav-pair-item {
            border-left: none;
            border-radius: 0;
            margin-bottom: 0;
            border-bottom: 1px solid #f3f4f6;
        }

        .ds-nav-pair-item:last-child {
            border-bottom: none;
        }

        @keyframes highlight-pulse {
            0%, 100% {
                background: #dbeafe;
            }
            50% {
                background: #eff6ff;
            }
        }

        /* 响应式设计 */
        @media (max-width: 1200px) {
            .ds-navigator:not(.collapsed) {
                right: 10px;
                width: 320px;
            }
        }

        @media (max-width: 768px) {
            .ds-navigator:not(.collapsed) {
                width: 280px;
                max-height: 60vh;
            }

            .ds-nav-mini-toggle {
                display: flex;
            }

            .ds-navigator.collapsed {
                display: none;
            }

            .ds-nav-buttons {
                opacity: 1;
            }
        }

        /* 滚动条样式 */
        .ds-nav-content::-webkit-scrollbar {
            width: 6px;
        }

        .ds-nav-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .ds-nav-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .ds-nav-content::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        .ds-navigator-empty {
            text-align: center;
            padding: 30px 15px;
            color: #9ca3af;
            font-size: 14px;
        }
    `);

    class DeepSeekNavigator {
        constructor() {
            this.navigator = null;
            this.miniToggle = null;
            this.isCollapsed = false;
            this.messagePairs = []; // 改为存储对话对
            this.observer = null;
            this.lastScrollTime = 0;
            this.scrollCooldown = 300;
            this.init();
        }

        init() {
            console.log('DeepSeek Navigator 初始化...');
            // 等待页面加载完成
            setTimeout(() => {
                this.createNavigator();
                this.setupObserver();
                this.addMiniToggle();
                this.scanMessages();
                this.bindEvents();
            }, 1000);
        }

        createNavigator() {
            // 创建侧边栏容器
            this.navigator = document.createElement('div');
            this.navigator.className = 'ds-navigator';

            // 侧边栏内容
            this.navigator.innerHTML = `
                <div class="ds-nav-header">
                    <h3 class="ds-nav-title">对话导航</h3>
                    <button class="ds-nav-toggle" title="折叠/展开">📋</button>
                </div>
                <div class="ds-nav-content">
                    <div class="ds-navigator-empty">
                        正在扫描对话消息...
                    </div>
                </div>
            `;

            document.body.appendChild(this.navigator);
            console.log('侧边栏创建完成');
        }

        addMiniToggle() {
            this.miniToggle = document.createElement('button');
            this.miniToggle.className = 'ds-nav-mini-toggle';
            this.miniToggle.innerHTML = '📋';
            this.miniToggle.title = '显示导航';

            document.body.appendChild(this.miniToggle);

            this.miniToggle.addEventListener('click', () => {
                this.isCollapsed = false;
                this.navigator.classList.remove('collapsed');
                this.miniToggle.style.display = 'none';
            });
        }

        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
            this.navigator.classList.toggle('collapsed');

            if (window.innerWidth <= 768) {
                if (this.isCollapsed) {
                    this.miniToggle.style.display = 'flex';
                } else {
                    this.miniToggle.style.display = 'none';
                }
            }
        }

        scanMessages() {
            console.log('正在扫描消息...');

            // 查找用户消息 - 根据你提供的HTML结构
            const userMessages = document.querySelectorAll('div._9663006');
            console.log(`找到用户消息容器: ${userMessages.length}`);

            // 查找AI回复消息
            const assistantMessages = document.querySelectorAll('div._4f9bf79');
            console.log(`找到AI消息容器: ${assistantMessages.length}`);

            this.processMessages(userMessages, assistantMessages);
        }

        processMessages(userContainers, assistantContainers) {
            // 清空现有的对话对
            this.messagePairs = [];

            // 将所有消息容器合并并按DOM顺序排序
            const allContainers = [];

            // 处理用户消息
            userContainers.forEach((container, index) => {
                const textElement = container.querySelector('.fbb737a4');
                if (textElement) {
                    const text = this.cleanHtmlAndExtractText(textElement);
                    if (text && text.length > 0) {
                        const messageId = `ds-user-${Date.now()}-${index}`;
                        container.id = messageId;

                        allContainers.push({
                            id: messageId,
                            element: container,
                            text: text,
                            type: 'user',
                            timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                            domPosition: this.getElementPosition(container)
                        });
                        console.log(`用户消息 ${index}: ${text.substring(0, 50)}...`);
                    }
                }
            });

            // 处理AI回复消息
            assistantContainers.forEach((container, index) => {
                // 获取AI回复文本
                const textElements = container.querySelectorAll('.ds-markdown');
                let text = '';

                textElements.forEach(el => {
                    const elText = this.cleanHtmlAndExtractText(el);
                    if (elText && elText.length > 0) {
                        text += (text ? ' ' : '') + elText;
                    }
                });

                if (!text || text.trim().length === 0) {
                    // 如果没找到.ds-markdown，尝试其他选择器
                    const altElements = container.querySelectorAll('p, span, div');
                    altElements.forEach(el => {
                        const elText = this.cleanHtmlAndExtractText(el);
                        if (elText && elText.length > 0 && !el.closest('.ds-think-content')) {
                            text += (text ? ' ' : '') + elText;
                        }
                    });
                }

                if (text && text.trim().length > 0) {
                    // 提取思考时间
                    let thinkTime = '';
                    const thinkElement = container.querySelector('._5255ff8');
                    if (thinkElement) {
                        thinkTime = thinkElement.textContent.trim();
                    }

                    const messageId = `ds-assistant-${Date.now()}-${index}`;
                    container.id = messageId;

                    allContainers.push({
                        id: messageId,
                        element: container,
                        text: text,
                        type: 'assistant',
                        thinkTime: thinkTime,
                        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                        domPosition: this.getElementPosition(container)
                    });
                    console.log(`AI消息 ${index}: ${text.substring(0, 50)}...`);
                }
            });

            // 按DOM位置排序
            allContainers.sort((a, b) => a.domPosition - b.domPosition);

            // 分组消息为问答对
            this.groupMessagesIntoPairs(allContainers);

            console.log(`处理完成，总共 ${this.messagePairs.length} 个问答对`);
            this.updateNavigation();
        }

        // 获取元素在DOM中的位置
        getElementPosition(element) {
            const rect = element.getBoundingClientRect();
            return rect.top + window.scrollY;
        }

        // 将消息分组为问答对
        groupMessagesIntoPairs(allMessages) {
            let currentPair = null;

            allMessages.forEach((msg, index) => {
                if (msg.type === 'user') {
                    // 如果是用户消息，开始一个新的对话对
                    if (currentPair) {
                        this.messagePairs.push(currentPair);
                    }
                    currentPair = {
                        pairId: `pair-${this.messagePairs.length + 1}`,
                        number: this.messagePairs.length + 1,
                        userMessage: msg,
                        assistantMessages: []
                    };
                } else if (msg.type === 'assistant' && currentPair) {
                    // 如果是AI消息且当前有对话对，将其添加到当前对话对
                    currentPair.assistantMessages.push(msg);
                }
            });

            // 添加最后一个对话对
            if (currentPair) {
                this.messagePairs.push(currentPair);
            }
        }

        // 清理HTML标签并提取文本
        cleanHtmlAndExtractText(element) {
            if (!element) return '';

            // 克隆元素以避免修改原始DOM
            const clonedElement = element.cloneNode(true);

            // 移除所有不需要的HTML标签
            const tagsToRemove = ['script', 'style', 'svg', 'math', 'iframe', 'object', 'embed'];
            tagsToRemove.forEach(tag => {
                clonedElement.querySelectorAll(tag).forEach(el => el.remove());
            });

            // 处理代码块
            const codeBlocks = clonedElement.querySelectorAll('pre, code');
            codeBlocks.forEach(code => {
                // 将代码块替换为简化的指示器
                const codeText = code.textContent || '';
                const indicator = document.createElement('span');
                indicator.className = 'ds-nav-code-indicator';
                indicator.textContent = '[代码]';
                indicator.title = codeText.substring(0, 100) + (codeText.length > 100 ? '...' : '');
                code.parentNode.replaceChild(indicator, code);
            });

            // 处理链接
            const links = clonedElement.querySelectorAll('a');
            links.forEach(link => {
                const linkText = link.textContent || '';
                if (linkText.trim()) {
                    const textNode = document.createTextNode(linkText);
                    link.parentNode.replaceChild(textNode, link);
                } else {
                    link.remove();
                }
            });

            // 处理图片
            const images = clonedElement.querySelectorAll('img');
            images.forEach(img => {
                const altText = img.alt || '图片';
                const textNode = document.createTextNode(`[图片:${altText}]`);
                img.parentNode.replaceChild(textNode, img);
            });

            // 获取纯文本并清理
            let text = clonedElement.textContent || clonedElement.innerText || '';

            // 清理多余空格和换行
            text = text
                .replace(/\s+/g, ' ')
                .replace(/\[代码\]/g, ' [代码] ')  // 给代码指示器加空格
                .trim();

            // 截断并返回
            return text.substring(0, 150);
        }

        // 转义HTML特殊字符，防止XSS
        escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        updateNavigation() {
            const content = this.navigator.querySelector('.ds-nav-content');

            if (this.messagePairs.length === 0) {
                content.innerHTML = '<div class="ds-navigator-empty">暂无对话内容</div>';
                return;
            }

            // 生成对话对HTML
            content.innerHTML = this.messagePairs.map(pair => {
                const pairItems = [];

                // 用户消息
                pairItems.push(`
                    <div class="ds-nav-item user ds-nav-pair-item" data-id="${pair.userMessage.id}">
                        <div class="ds-nav-item-header">
                            <div class="ds-nav-icon user"></div>
                            <div class="ds-nav-item-info">
                                <div class="ds-nav-type">
                                    👤 提问
                                </div>
                                <div class="ds-nav-text" title="${this.escapeHtml(pair.userMessage.text)}">
                                    ${this.escapeHtml(pair.userMessage.text)}
                                </div>
                                <div class="ds-nav-meta">
                                    <span>${pair.userMessage.timestamp || ''}</span>
                                </div>
                            </div>
                        </div>
                        <div class="ds-nav-buttons">
                            <button class="ds-nav-button ds-nav-button-start" data-id="${pair.userMessage.id}" data-position="start">
                                <span>▲</span> 定位到开头
                            </button>
                            <button class="ds-nav-button ds-nav-button-end" data-id="${pair.userMessage.id}" data-position="end">
                                <span>▼</span> 定位到结尾
                            </button>
                        </div>
                    </div>
                `);

                // AI回复消息
                pair.assistantMessages.forEach((assistantMsg, index) => {
                    pairItems.push(`
                        <div class="ds-nav-item assistant ds-nav-pair-item" data-id="${assistantMsg.id}">
                            <div class="ds-nav-item-header">
                                <div class="ds-nav-icon assistant"></div>
                                <div class="ds-nav-item-info">
                                    <div class="ds-nav-type">
                                        🤖 回答
                                        ${assistantMsg.thinkTime ? `<span class="ds-nav-badge">${this.escapeHtml(assistantMsg.thinkTime)}</span>` : ''}
                                    </div>
                                    <div class="ds-nav-text" title="${this.escapeHtml(assistantMsg.text)}">
                                        ${this.escapeHtml(assistantMsg.text)}
                                    </div>
                                    <div class="ds-nav-meta">
                                        <span>${assistantMsg.timestamp || ''}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ds-nav-buttons">
                                <button class="ds-nav-button ds-nav-button-start" data-id="${assistantMsg.id}" data-position="start">
                                    <span>▲</span> 定位到开头
                                </button>
                                <button class="ds-nav-button ds-nav-button-end" data-id="${assistantMsg.id}" data-position="end">
                                    <span>▼</span> 定位到结尾
                                </button>
                            </div>
                        </div>
                    `);
                });

                return `
                    <div class="ds-nav-pair-group" data-pair-id="${pair.pairId}">
                        <div class="ds-nav-pair-header">
                            <div class="ds-nav-pair-number">
                                对话 #${pair.number}
                                <span class="ds-nav-pair-count">${1 + pair.assistantMessages.length}条</span>
                            </div>
                        </div>
                        <div class="ds-nav-pair-content">
                            ${pairItems.join('')}
                        </div>
                    </div>
                `;
            }).join('');

            // 更新标题
            const title = this.navigator.querySelector('.ds-nav-title');
            const totalMessages = this.messagePairs.reduce((sum, pair) =>
                sum + 1 + pair.assistantMessages.length, 0);
            title.textContent = `对话导航 (${this.messagePairs.length}个问答，${totalMessages}条消息)`;
        }

        bindEvents() {
            // 绑定折叠按钮
            const toggleBtn = this.navigator.querySelector('.ds-nav-toggle');
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCollapse();
            });

            // 使用事件委托绑定所有按钮和导航项点击
            this.navigator.addEventListener('click', (e) => {
                e.stopPropagation();

                // 处理按钮点击
                const button = e.target.closest('.ds-nav-button');
                if (button) {
                    const messageId = button.dataset.id;
                    const position = button.dataset.position;
                    console.log(`点击按钮: ${position} 定位到 ${messageId}`);
                    this.scrollToMessage(messageId, position);
                    return;
                }

                // 处理导航项点击（默认定位到开头）
                const navItem = e.target.closest('.ds-nav-item');
                if (navItem) {
                    const messageId = navItem.dataset.id;
                    console.log(`点击导航项: 定位到 ${messageId} 的开头`);
                    this.scrollToMessage(messageId, 'start');
                }
            });
        }

        scrollToMessage(messageId, position = 'start') {
            const now = Date.now();
            if (now - this.lastScrollTime < this.scrollCooldown) {
                return;
            }

            this.lastScrollTime = now;

            console.log(`尝试滚动到消息: ${messageId}, 位置: ${position}`);

            // 在所有对话对中查找消息
            let targetMessage = null;
            let targetPair = null;

            for (const pair of this.messagePairs) {
                if (pair.userMessage.id === messageId) {
                    targetMessage = pair.userMessage;
                    targetPair = pair;
                    break;
                }
                for (const assistantMsg of pair.assistantMessages) {
                    if (assistantMsg.id === messageId) {
                        targetMessage = assistantMsg;
                        targetPair = pair;
                        break;
                    }
                }
                if (targetMessage) break;
            }

            // 如果在缓存中没有找到，尝试在DOM中重新查找
            if (!targetMessage) {
                const element = document.getElementById(messageId);
                if (element) {
                    console.log(`从DOM重新找到元素: ${messageId}`);
                    targetMessage = {
                        id: messageId,
                        element: element
                    };
                }
            }

            if (!targetMessage || !targetMessage.element) {
                console.error(`未找到消息元素: ${messageId}`);
                // 尝试重新扫描
                this.scanMessages();
                return;
            }

            // 移除之前的高亮
            document.querySelectorAll('.ds-nav-active').forEach(el => {
                el.classList.remove('ds-nav-active');
            });

            // 添加当前高亮
            const navItem = this.navigator.querySelector(`[data-id="${messageId}"]`);
            if (navItem) {
                navItem.classList.add('ds-nav-active');

                // 高亮整个对话对
                const pairGroup = navItem.closest('.ds-nav-pair-group');
                if (pairGroup) {
                    pairGroup.style.border = '1px solid #3b82f6';
                    pairGroup.style.boxShadow = '0 0 0 1px rgba(59, 130, 246, 0.1)';

                    // 移除其他对话对的高亮
                    document.querySelectorAll('.ds-nav-pair-group').forEach(group => {
                        if (group !== pairGroup) {
                            group.style.border = '1px solid #e5e7eb';
                            group.style.boxShadow = 'none';
                        }
                    });
                }

                // 确保导航项在导航栏中可见
                navItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // 确保元素在DOM中
            if (!document.body.contains(targetMessage.element)) {
                console.error(`消息元素不在DOM中: ${messageId}`);
                this.scanMessages();
                return;
            }

            // 直接使用 element.scrollIntoView 方法
            const scrollOptions = {
                behavior: 'smooth',
                block: position === 'start' ? 'start' : 'end',
                inline: 'nearest'
            };

            console.log(`使用 scrollIntoView 滚动到元素: ${position}, 选项:`, scrollOptions);
            targetMessage.element.scrollIntoView(scrollOptions);

            // 添加临时高亮效果
            targetMessage.element.classList.add('ds-nav-highlight');
            setTimeout(() => {
                if (targetMessage.element) {
                    targetMessage.element.classList.remove('ds-nav-highlight');
                }
            }, 2000);
        }

        setupObserver() {
            this.observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                // 检查是否是消息相关元素
                                if (node.matches && (
                                    node.matches('div._9663006') ||
                                    node.matches('div._4f9bf79') ||
                                    node.matches('.ds-message') ||
                                    node.querySelector('[data-um-id]') ||
                                    node.querySelector('.fbb737a4') ||
                                    node.querySelector('.ds-markdown')
                                )) {
                                    shouldUpdate = true;
                                }
                            }
                        });
                    }
                });

                if (shouldUpdate) {
                    console.log('检测到新消息，重新扫描...');
                    setTimeout(() => this.scanMessages(), 500);
                }
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 监听滚动，更新当前高亮的消息
            window.addEventListener('scroll', () => {
                this.highlightVisibleMessage();
            });
        }

        highlightVisibleMessage() {
            if (this.messagePairs.length === 0) return;

            // 移除所有高亮
            this.navigator.querySelectorAll('.ds-nav-active').forEach(el => {
                el.classList.remove('ds-nav-active');
            });

            // 重置对话对边框
            document.querySelectorAll('.ds-nav-pair-group').forEach(group => {
                group.style.border = '1px solid #e5e7eb';
                group.style.boxShadow = 'none';
            });

            const viewportHeight = window.innerHeight;
            const viewportMiddle = window.scrollY + (viewportHeight / 2);

            let closestMessage = null;
            let closestDistance = Infinity;
            let closestPair = null;

            // 在所有消息中查找最接近视图中点的消息
            this.messagePairs.forEach(pair => {
                // 检查用户消息
                if (pair.userMessage.element && document.body.contains(pair.userMessage.element)) {
                    const rect = pair.userMessage.element.getBoundingClientRect();
                    if (rect.height > 0) {
                        const elementTop = window.scrollY + rect.top;
                        const elementMiddle = elementTop + (rect.height / 2);
                        const distance = Math.abs(viewportMiddle - elementMiddle);

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestMessage = pair.userMessage;
                            closestPair = pair;
                        }
                    }
                }

                // 检查AI消息
                pair.assistantMessages.forEach(assistantMsg => {
                    if (assistantMsg.element && document.body.contains(assistantMsg.element)) {
                        const rect = assistantMsg.element.getBoundingClientRect();
                        if (rect.height > 0) {
                            const elementTop = window.scrollY + rect.top;
                            const elementMiddle = elementTop + (rect.height / 2);
                            const distance = Math.abs(viewportMiddle - elementMiddle);

                            if (distance < closestDistance) {
                                closestDistance = distance;
                                closestMessage = assistantMsg;
                                closestPair = pair;
                            }
                        }
                    }
                });
            });

            if (closestMessage && closestDistance < viewportHeight) {
                const navItem = this.navigator.querySelector(`[data-id="${closestMessage.id}"]`);
                if (navItem) {
                    navItem.classList.add('ds-nav-active');

                    // 高亮整个对话对
                    const pairGroup = navItem.closest('.ds-nav-pair-group');
                    if (pairGroup) {
                        pairGroup.style.border = '1px solid #3b82f6';
                        pairGroup.style.boxShadow = '0 0 0 1px rgba(59, 130, 246, 0.1)';
                    }
                }
            }
        }

        destroy() {
            if (this.observer) this.observer.disconnect();
            if (this.navigator) this.navigator.remove();
            if (this.miniToggle) this.miniToggle.remove();
        }
    }

    // 启动导航器
    let navigator = null;

    function initNavigator() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOMContentLoaded 事件触发，初始化导航器');
                navigator = new DeepSeekNavigator();
            });
        } else {
            console.log('DOM 已加载，直接初始化导航器');
            navigator = new DeepSeekNavigator();
        }
    }

    // 初始化
    initNavigator();
})();