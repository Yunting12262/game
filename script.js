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
    document.querySelector('.preview-area').style.display = 'none';
    
    // 显示目标屏幕
    if (screenId === 'preview-area') {
        document.querySelector('.preview-area').style.display = 'block';
        startPreviewTutorial();
    } else {
        document.getElementById(screenId).style.display = 'block';
    }

    // 如果切换到游戏屏幕，根据情况显示不同的教程
    if (screenId === 'game-screen') {
        // 如果是第一次进入游戏页面，显示初始教程
        if (!hasShownTutorial) {
            startTutorial();
        }
        // 如果已经完成了第一个视频的上传，显示回合结束后的教程
        else if (hasShownPreviewTutorial && !hasShownPostRoundTutorial) {
            setTimeout(() => {
                startPostRoundTutorial();
            }, 100);
        }
    }
    // 如果切换到编辑器屏幕，开始编辑器教程
    else if (screenId === 'editor-screen') {
        startEditorTutorial();
    }
}

// 教程控制
let currentTutorial = 0;
let hasShownTutorial = false;  // 添加标记来追踪初始教程是否已显示
let hasShownEditorTutorial = false;  // 添加标记来追踪编辑器教程是否已显示
let hasShownPreviewTutorial = false;  // 添加标记来追踪预览教程是否已显示
let hasShownPostRoundTutorial = false;  // 添加标记来追踪回合结束后的教程是否已显示

function startTutorial() {
    if (!hasShownTutorial) {
        currentTutorial = 1;
        showTutorial(1);
        hasShownTutorial = true;
    }
}

function showTutorial(number) {
    // 隐藏所有教程
    document.querySelectorAll('.tutorial-overlay').forEach(overlay => {
        overlay.style.display = 'none';
    });

    // 显示当前教程
    const tutorial = document.getElementById(`tutorial-${number}`);
    if (tutorial) {
        // 如果是第二个教程，先确保第一个教程的遮罩完全隐藏
        if (number === 2) {
            const firstTutorial = document.getElementById('tutorial-1');
            if (firstTutorial) {
                firstTutorial.style.display = 'none';
                firstTutorial.style.opacity = '0';
            }
            // 短暂延迟后显示第二个教程
            setTimeout(() => {
                tutorial.style.display = 'block';
            }, 50);
        } else {
            tutorial.style.display = 'block';
        }
    }
}

function nextTutorial(current) {
    // 如果是第一个教程，特殊处理
    if (current === 1) {
        const firstTutorial = document.getElementById('tutorial-1');
        if (firstTutorial) {
            firstTutorial.style.opacity = '0';
            firstTutorial.style.display = 'none';
        }
    }
    
    // 隐藏当前教程
    const currentTutorialElement = document.getElementById(`tutorial-${current}`);
    if (currentTutorialElement) {
        currentTutorialElement.style.display = 'none';
    }
    
    if (current < 4) {
        // 显示下一个教程
        showTutorial(current + 1);
    }
}

// 编辑器教程控制
function startEditorTutorial() {
    if (!hasShownEditorTutorial) {
        showEditorTutorial(1);
        hasShownEditorTutorial = true;
    }
}

function showEditorTutorial(number) {
    // 隐藏所有教程
    document.querySelectorAll('.tutorial-overlay').forEach(overlay => {
        overlay.style.display = 'none';
    });

    // 显示当前教程
    const tutorial = document.getElementById(`editor-tutorial-${number}`);
    if (tutorial) {
        tutorial.style.display = 'block';
    }
}

function nextEditorTutorial(current) {
    // 隐藏当前教程
    const currentTutorialElement = document.getElementById(`editor-tutorial-${current}`);
    if (currentTutorialElement) {
        currentTutorialElement.style.display = 'none';
    }
    
    if (current < 3) {
        // 显示下一个教程
        showEditorTutorial(current + 1);
    }
}

// 预览教程控制
function startPreviewTutorial() {
    if (!hasShownPreviewTutorial) {
        showPreviewTutorial(1);
        hasShownPreviewTutorial = true;
    }
}

function showPreviewTutorial(number) {
    // 隐藏所有教程
    document.querySelectorAll('.tutorial-overlay').forEach(overlay => {
        overlay.style.display = 'none';
    });

    // 显示当前教程
    const tutorial = document.getElementById(`preview-tutorial-${number}`);
    if (tutorial) {
        tutorial.style.display = 'block';
    }
}

function nextPreviewTutorial(current) {
    // 隐藏当前教程
    const currentTutorialElement = document.getElementById(`preview-tutorial-${current}`);
    if (currentTutorialElement) {
        currentTutorialElement.style.display = 'none';
    }
    
    if (current < 3) {
        // 显示下一个教程
        showPreviewTutorial(current + 1);
    }
}

// 回合结束后的教程控制
function startPostRoundTutorial() {
    if (!hasShownPostRoundTutorial) {
        showPostRoundTutorial(1);
        hasShownPostRoundTutorial = true;
    }
}

function showPostRoundTutorial(number) {
    // 隐藏所有教程
    document.querySelectorAll('.tutorial-overlay').forEach(overlay => {
        overlay.style.display = 'none';
    });

    // 显示当前教程
    const tutorial = document.getElementById(`post-round-tutorial-${number}`);
    if (tutorial) {
        tutorial.style.display = 'block';
    }
}

function nextPostRoundTutorial(current) {
    // 隐藏当前教程
    const currentTutorialElement = document.getElementById(`post-round-tutorial-${current}`);
    if (currentTutorialElement) {
        currentTutorialElement.style.display = 'none';
    }
    
    if (current < 3) {
        // 显示下一个教程
        showPostRoundTutorial(current + 1);
    }
}

// 初始化事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // Export 按钮点击事件
    const exportButton = document.querySelector('.export-button');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            switchScreen('preview-area');
        });
    }

    // New Post 按钮点击事件
    const newPostButton = document.querySelector('.new-post-button');
    if (newPostButton) {
        newPostButton.addEventListener('click', function() {
            switchScreen('editor-screen');
        });
    }

    // Upload 按钮点击事件
    const uploadButton = document.querySelector('.upload-button');
    if (uploadButton) {
        uploadButton.addEventListener('click', function() {
            hasShownPreviewTutorial = true;  // 标记预览教程已显示
            switchScreen('game-screen');  // 返回游戏主页面
        });
    }

    // Back 按钮点击事件
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
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