# DeepSeek Chat Navigator 🚀

[![GitHub license](https://img.shields.io/github/license/widechaos/deepseek-chat-navigator)](https://github.com/widechaos/deepseek-chat-navigator/blob/main/LICENSE)
[![Greasy Fork](https://img.shields.io/badge/GreasyFork-Install-green)](https://greasyfork.org/zh-CN/scripts/your-script-id)
[![GitHub stars](https://img.shields.io/github/stars/widechaos/deepseek-chat-navigator)](https://github.com/widechaos/deepseek-chat-navigator/stargazers)

✨ **智能DeepSeek对话导航器** - 为DeepSeek AI聊天添加强大的侧边栏导航功能，让长对话浏览变得轻而易举！

---

## 🌟 功能特色

### 🎯 智能导航
- **自动识别**所有提问和回答
- **实时更新**新消息
- **精准定位**到消息开头或结尾

### 🎨 精美界面
- **毛玻璃效果**侧边栏
- **响应式设计**适配各种设备
- **双按钮定位**自由选择位置
- **悬停预览**快速查看内容

### ⚡ 高效操作
- **一键跳转**到关键对话节点
- **智能默认定位**提问→末尾，回答→开头
- **滚动指示器**视觉反馈
- **键盘快捷键支持**（即将推出）

---

## 📸 截图预览

![主界面](screenshots/screenshot-1.png)
*智能侧边栏导航界面*

![定位功能](screenshots/screenshot-2.png)
*双按钮精准定位*

![移动端](screenshots/screenshot-3.png)
*移动设备适配*

---

## 🚀 安装指南

### 方式一：Greasy Fork（推荐）
1. 安装用户脚本管理器：[Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)
2. 访问 [Greasy Fork页面](https://greasyfork.org/zh-CN/scripts/your-script-id)
3. 点击"安装此脚本"
4. 确认安装

### 方式二：直接安装
1. 确保已安装用户脚本管理器
2. 点击此链接安装：⬇️
   [![安装链接](https://img.shields.io/badge/点击安装-DeepSeek_Navigator-blue)](https://github.com/widechaos/deepseek-chat-navigator/raw/main/deepseek-chat-navigator.user.js)

---

## 🔧 使用方法

### 基本操作
1. 访问 [DeepSeek Chat](https://chat.deepseek.com/)
2. 右侧会出现导航侧边栏
3. 点击导航项跳转到对应消息

### 精准定位
- **定位到开头**按钮：滚动到消息起始位置
- **定位到结尾**按钮：滚动到消息结束位置
- **单击导航项**：默认智能定位

### 移动设备
- 显示悬浮展开按钮
- 点击右侧悬浮按钮展开导航
- 支持手势操作

---

## 🛠 技术细节

### 兼容性
- ✅ **浏览器**: Chrome, Firefox, Edge, Safari
- ✅ **脚本管理器**: Tampermonkey, Violentmonkey, Greasemonkey
- ✅ **平台**: Windows, macOS, Linux, Android, iOS
- ✅ **DeepSeek版本**: 支持最新版界面

### 性能优化
- 使用Mutation Observer监听DOM变化
- 防抖处理滚动事件
- 内存泄漏保护
- 异步加载优化

---

## 🤝 参与贡献

欢迎提交Issue和Pull Request！

### 贡献方式
1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 开发环境
```bash
# 克隆项目
git clone https://github.com/widechaos/deepseek-chat-navigator.git
cd deepseek-chat-navigator
