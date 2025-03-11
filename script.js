// 页面切换功能
function switchScreen(screenId) {
    // 隐藏所有屏幕
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('opening-story1').style.display = 'none';
    document.getElementById('opening-story2').style.display = 'none';
    document.getElementById('opening-story3').style.display = 'none';
    document.getElementById('opening-story4').style.display = 'none';
    document.getElementById('opening-story5').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('editor-screen').style.display = 'none';
    
    // 显示目标屏幕
    document.getElementById(screenId).style.display = 'block';
}

// 初始化事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // Export 按钮点击事件
    const exportButton = document.querySelector('.button13');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            switchScreen('editor-screen');
        });
    }

    // New Post 按钮点击事件
    const newPostButton = document.querySelector('.new-post-button');
    if (newPostButton) {
        newPostButton.addEventListener('click', function() {
            switchScreen('editor-screen');
        });
    }

    // 其他按钮事件监听
    const buttonContainer = document.getElementById("buttonContainer");
    if (buttonContainer) {
        buttonContainer.addEventListener("click", function(e) {
            // Add your code here
        });
    }
}); 