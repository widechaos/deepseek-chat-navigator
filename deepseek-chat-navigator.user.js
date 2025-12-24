// ==UserScript==
// @name         DeepSeek Chat Navigator
// @namespace    https://github.com/widechaos/deepseek-chat-navigator
// @version      1.2.3
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
            this.messages = [];
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
            this.messages = [];
            let userMessageCount = 0;
            let assistantMessageCount = 0;

            // 处理用户消息
            userContainers.forEach((container, index) => {
                // 获取用户消息文本
                const textElement = container.querySelector('.fbb737a4');
                if (textElement) {
                    const text = this.extractText(textElement);
                    if (text && text.length > 0) {
                        const messageId = `ds-user-${Date.now()}-${index}`;
                        container.id = messageId;

                        this.messages.push({
                            id: messageId,
                            element: container,
                            text: text,
                            type: 'user',
                            index: index + 1,
                            timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })
                        });
                        userMessageCount++;
                        console.log(`用户消息 ${index}: ${text.substring(0, 50)}...`);
                    }
                } else {
                    console.log(`用户消息容器 ${index} 没有找到文本元素`);
                }
            });

            // 处理AI回复消息
            assistantContainers.forEach((container, index) => {
                // 获取AI回复文本
                const textElements = container.querySelectorAll('.ds-markdown');
                let text = '';

                textElements.forEach(el => {
                    const elText = this.extractText(el);
                    if (elText && elText.length > 0) {
                        text += (text ? ' ' : '') + elText;
                    }
                });

                if (!text || text.trim().length === 0) {
                    // 如果没找到.ds-markdown，尝试其他选择器
                    const altElements = container.querySelectorAll('p, span, div');
                    altElements.forEach(el => {
                        const elText = el.textContent.trim();
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

                    this.messages.push({
                        id: messageId,
                        element: container,
                        text: text,
                        type: 'assistant',
                        index: userContainers.length + index + 1,
                        thinkTime: thinkTime,
                        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })
                    });
                    assistantMessageCount++;
                    console.log(`AI消息 ${index}: ${text.substring(0, 50)}...`);
                } else {
                    console.log(`AI消息容器 ${index} 没有找到文本内容`);
                }
            });

            // 根据DOM位置排序
            this.messages.sort((a, b) => {
                const rectA = a.element.getBoundingClientRect();
                const rectB = b.element.getBoundingClientRect();
                return rectA.top - rectB.top;
            });

            // 更新索引
            this.messages.forEach((msg, idx) => {
                msg.displayIndex = idx + 1;
            });

            console.log(`处理完成，总共 ${this.messages.length} 条消息 (${userMessageCount}用户/${assistantMessageCount}AI)`);
            this.updateNavigation();
        }

        extractText(element) {
            if (!element) return '';
            const text = element.textContent || element.innerText || '';
            return text
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 150);
        }

        updateNavigation() {
            const content = this.navigator.querySelector('.ds-nav-content');

            if (this.messages.length === 0) {
                content.innerHTML = '<div class="ds-navigator-empty">暂无对话内容</div>';
                return;
            }

            content.innerHTML = this.messages.map(msg => `
                <div class="ds-nav-item ${msg.type}" data-id="${msg.id}">
                    <div class="ds-nav-item-header">
                        <div class="ds-nav-icon ${msg.type}"></div>
                        <div class="ds-nav-item-info">
                            <div class="ds-nav-type">
                                ${msg.type === 'user' ? '👤 提问' : '🤖 回答'}
                                ${msg.thinkTime ? `<span class="ds-nav-badge">${msg.thinkTime}</span>` : ''}
                            </div>
                            <div class="ds-nav-text" title="${msg.text}">${msg.text}</div>
                            <div class="ds-nav-meta">
                                <span>消息 #${msg.displayIndex}</span>
                                <span>${msg.timestamp || ''}</span>
                            </div>
                        </div>
                        <div class="ds-nav-counter">${msg.displayIndex}</div>
                    </div>
                    <div class="ds-nav-buttons">
                        <button class="ds-nav-button ds-nav-button-start" data-id="${msg.id}" data-position="start">
                            <span>▲</span> 定位到开头
                        </button>
                        <button class="ds-nav-button ds-nav-button-end" data-id="${msg.id}" data-position="end">
                            <span>▼</span> 定位到结尾
                        </button>
                    </div>
                </div>
            `).join('');

            // 更新标题
            const title = this.navigator.querySelector('.ds-nav-title');
            const userCount = this.messages.filter(m => m.type === 'user').length;
            const assistantCount = this.messages.filter(m => m.type === 'assistant').length;
            title.textContent = `对话导航 (${userCount}问/${assistantCount}答)`;
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

            // 先尝试从缓存中查找
            let message = this.messages.find(m => m.id === messageId);

            // 如果缓存中没有，尝试在DOM中重新查找
            if (!message) {
                const element = document.getElementById(messageId);
                if (element) {
                    console.log(`从DOM重新找到元素: ${messageId}`);
                    message = {
                        id: messageId,
                        element: element,
                        type: element.classList.contains('user') ? 'user' : 'assistant'
                    };
                }
            }

            if (!message || !message.element) {
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
                // 确保导航项在导航栏中可见
                navItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // 确保元素在DOM中
            if (!document.body.contains(message.element)) {
                console.error(`消息元素不在DOM中: ${messageId}`);
                this.scanMessages();
                return;
            }

            // 直接使用 element.scrollIntoView 方法 - 这是最简单可靠的方法
            // 根据 position 参数选择不同的 block 选项
            const scrollOptions = {
                behavior: 'smooth',
                block: position === 'start' ? 'start' : 'end',
                inline: 'nearest'
            };

            console.log(`使用 scrollIntoView 滚动到元素: ${position}, 选项:`, scrollOptions);
            message.element.scrollIntoView(scrollOptions);

            // 添加临时高亮效果
            message.element.classList.add('ds-nav-highlight');
            setTimeout(() => {
                if (message.element) {
                    message.element.classList.remove('ds-nav-highlight');
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
            if (this.messages.length === 0) return;

            // 移除所有高亮
            this.navigator.querySelectorAll('.ds-nav-active').forEach(el => {
                el.classList.remove('ds-nav-active');
            });

            const viewportHeight = window.innerHeight;
            const viewportMiddle = window.scrollY + (viewportHeight / 2);

            let closestMessage = null;
            let closestDistance = Infinity;

            this.messages.forEach(msg => {
                if (msg.element && document.body.contains(msg.element)) {
                    const rect = msg.element.getBoundingClientRect();
                    if (rect.height > 0) {
                        const elementTop = window.scrollY + rect.top;
                        const elementMiddle = elementTop + (rect.height / 2);
                        const distance = Math.abs(viewportMiddle - elementMiddle);

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestMessage = msg;
                        }
                    }
                }
            });

            if (closestMessage && closestDistance < viewportHeight) {
                const navItem = this.navigator.querySelector(`[data-id="${closestMessage.id}"]`);
                if (navItem) {
                    navItem.classList.add('ds-nav-active');
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
