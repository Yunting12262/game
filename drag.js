document.addEventListener('DOMContentLoaded', () => {
    console.log('初始化拖拽功能...');
    
    // 获取所有缩略图和编辑区域的clips
    const thumbnails = document.querySelectorAll('.thumbnail');
    const clipSlots = document.querySelectorAll('.clip-slot');
    const editingArea = document.querySelector('.editing-area');
    const clipsContainer = document.querySelector('.clips');
    const reviewingArea = document.querySelector('.reviewing-area');
    const exportButton = document.querySelector('.export-button');
    const previewArea = document.querySelector('.preview-area');
    const backButton = document.querySelector('.back-button');
    const newPostButton = document.querySelector('.new-post-button');

    // 用于跟踪已使用的缩略图
    const usedThumbnails = new Set();
    
    // 跟踪当前回合和资金
    let currentRound = 0;
    let totalFunds = 0;
    
    // 初始化时启用New Post按钮
    if (newPostButton) {
        newPostButton.style.pointerEvents = 'auto';
        newPostButton.style.opacity = '1';
        console.log('New Post按钮已启用');
    }
    
    // 跟踪每个回合的视频序列
    const roundSequences = [];
    
    // 定义每轮的视频素材
    const roundVideos = {
        0: ['r1c1.mp4', 'r1c2.mp4', 'r1c3.mp4', 'r1c4.mp4'],
        1: ['r2c1.mp4', 'r2c2.mp4', 'r2c3.mp4'],
        2: ['r3c1.mp4', 'r3c2.mp4', 'r3c3.mp4', 'r3c4.mp4'],
        3: ['r4c1.mp4', 'r4c2.mp4', 'r4c3.mp4', 'r4c4.mp4'],
        4: ['r5c1.mp4', 'r5c2.mp4', 'r5c3.mp4', 'r5c4.mp4']
    };
    
    // 定义每轮的标题
    const roundTitles = {
        0: "Round1: Actor's scandal",
        1: "Round2: Public welfare illusion",
        2: "Round3: Hospital Incident",
        3: "Round4: School Event",
        4: "Round5: Final Story"
    };

    // 定义浏览量映射
    const viewsMapping = {
        // 第一轮
        '1234': '100',
        '134': '100',
        '1342': '999+',
        '1324': '999+',
        '123': '999+',
        '132': '999+',
        '1432': '9999+',
        '1423': '9999+',
        '143': '9999+',
        '142': '9999+',
        '124': '9999+',
        '14': '9999+',
        '4321': '9999+',
        '432': '9999+',
        '43': '9999+',
        '42': '9999+',
        
        // 第二轮
        '123': '100',
        '213': '100',
        '231': '100',
        '12': '100',
        '13': '9999+',
        '132': '9999+',
        '312': '100',
        '321': '100',
        '31': '100',
        '21': '100'
    };

    // 定义资金映射
    const fundsMapping = {
        // 第一轮
        '1234': 10000,
        '134': 10000,
        '1342': 10000,
        '1324': 10000,
        '123': 10000,
        '132': 10000,
        '1432': 5000,
        '1423': 5000,
        '143': 5000,
        '142': 5000,
        '124': 5000,
        '14': 5000,
        '4321': 1000,
        '432': 1000,
        '43': 1000,
        '42': 1000,
        
        // 第二轮
        '123': 1000,
        '213': 1000,
        '231': 1000,
        '12': 1000,
        '13': 4000,
        '132': 4000,
        '312': 100,
        '321': 100,
        '31': 100,
        '21': 100
    };

    // 定义视频序列对应的标题
    const clipTitles = {
        // 第一轮
        '1234': {
            text: '"The actor\'s scandal is a misunderstanding, and the truth is restored!"',
            type: 'positive'
        },
        '134': {
            text: '"The actor\'s scandal is a misunderstanding, and the truth is restored!"',
            type: 'positive'
        },
        '1342': {
            text: '"The actor\'s scandal is a misunderstanding, and the truth is restored!"',
            type: 'positive'
        },
        '1324': {
            text: '"The actor\'s scandal is a misunderstanding, and the truth is restored!"',
            type: 'positive'
        },
        '123': {
            text: '"The actor\'s scandal is a misunderstanding, and the truth is restored!"',
            type: 'positive'
        },
        '132': {
            text: '"The actor\'s scandal is a misunderstanding, and the truth is restored!"',
            type: 'positive'
        },
        '1432': {
            text: '"The actor\'s scandal continues, but the situation is not as bad as rumored."',
            type: 'neutral'
        },
        '1423': {
            text: '"The actor\'s scandal continues, but the situation is not as bad as rumored."',
            type: 'neutral'
        },
        '143': {
            text: '"The actor\'s scandal continues, but the situation is not as bad as rumored."',
            type: 'neutral'
        },
        '142': {
            text: '"The actor\'s scandal continues, but the situation is not as bad as rumored."',
            type: 'neutral'
        },
        '124': {
            text: '"The actor\'s scandal continues, but the situation is not as bad as rumored."',
            type: 'neutral'
        },
        '14': {
            text: '"The actor\'s scandal continues, but the situation is not as bad as rumored."',
            type: 'neutral'
        },
        '4321': {
            text: '"The actor\'s scandal is true! The evidence is conclusive!"',
            type: 'negative'
        },
        '432': {
            text: '"The actor\'s scandal is true! The evidence is conclusive!"',
            type: 'negative'
        },
        '43': {
            text: '"The actor\'s scandal is true! The evidence is conclusive!"',
            type: 'negative'
        },
        '42': {
            text: '"The actor\'s scandal is true! The evidence is conclusive!"',
            type: 'negative'
        },
        
        // 第二轮
        '123': {
            text: '"The restaurant fulfills its public welfare commitment, and the charity window warms people\'s hearts!"',
            type: 'positive'
        },
        '213': {
            text: '"The restaurant fulfills its public welfare commitment, and the charity window warms people\'s hearts!"',
            type: 'positive'
        },
        '231': {
            text: '"The restaurant fulfills its public welfare commitment, and the charity window warms people\'s hearts!"',
            type: 'positive'
        },
        '12': {
            text: '"The restaurant fulfills its public welfare commitment, and the charity window warms people\'s hearts!"',
            type: 'positive'
        },
        '13': {
            text: '"The worker inquired about the charity meal but was unexpectedly driven away by the waiter?"',
            type: 'negative'
        },
        '132': {
            text: '"The worker inquired about the charity meal but was unexpectedly driven away by the waiter?"',
            type: 'negative'
        },
        '312': {
            text: '"The restaurant fulfills its public welfare commitment, and the charity window warms people\'s hearts!"',
            type: 'neutral'
        },
        '321': {
            text: '"The restaurant fulfills its public welfare commitment, and the charity window warms people\'s hearts!"',
            type: 'neutral'
        },
        '31': {
            text: '"The restaurant fulfills its public welfare commitment, and the charity window warms people\'s hearts!"',
            type: 'neutral'
        },
        '21': {
            text: '"The restaurant fulfills its public welfare commitment, and the charity window warms people\'s hearts!"',
            type: 'neutral'
        }
    };

    // 确保找到所有必要的元素
    if (!thumbnails.length) {
        console.error('未找到缩略图元素');
        return;
    } else {
        console.log(`找到 ${thumbnails.length} 个缩略图`);
    }
    
    if (!clipSlots.length) {
        console.error('未找到clip-slot元素');
        return;
    } else {
        console.log(`找到 ${clipSlots.length} 个clip-slot`);
    }
    
    if (!editingArea) {
        console.error('未找到editing-area元素');
        return;
    }

    if (!reviewingArea) {
        console.error('未找到reviewing-area元素');
        return;
    }

    // 检查当前的视频顺序并显示对应的标题
    const checkClipSequence = () => {
        // 获取所有已填充的clip slots
        const filledSlots = Array.from(clipSlots).filter(slot => slot.classList.contains('filled') && !slot.classList.contains('disabled'));
        
        // 如果所有clip slots都已填充或者最后一个slot被禁用且其他slots都已填充
        const lastSlotDisabled = clipSlots[clipSlots.length - 1].classList.contains('disabled');
        const requiredFilledCount = lastSlotDisabled ? clipSlots.length - 1 : clipSlots.length;
        
        if (filledSlots.length >= requiredFilledCount) {
            // 获取当前的视频顺序
            let sequence = '';
            filledSlots.forEach(slot => {
                // 从视频元素中获取原始缩略图ID
                const video = slot.querySelector('video');
                if (video && video.dataset.thumbnailId) {
                    // 从thumbnail-X中提取X
                    const thumbnailNum = video.dataset.thumbnailId.split('-')[1];
                    sequence += (parseInt(thumbnailNum) + 1); // 转换为1-based索引
                }
            });
            
            console.log('当前视频顺序:', sequence);
            
            // 检查是否有匹配的标题
            if (clipTitles[sequence]) {
                showClipTitle(clipTitles[sequence]);
            } else {
                // 如果没有精确匹配，清除标题
                clearClipTitle();
            }
        } else {
            // 如果没有足够的clips，清除标题
            clearClipTitle();
        }
    };
    
    // 显示剪辑标题
    const showClipTitle = (titleData) => {
        // 清除现有标题
        clearClipTitle();
        
        // 创建标题元素
        const titleElement = document.createElement('div');
        titleElement.className = `clip-title ${titleData.type}`;
        
        // 显示完整的标题文本
        titleElement.textContent = titleData.text;
        
        // 添加到reviewing area
        reviewingArea.appendChild(titleElement);
    };
    
    // 清除剪辑标题
    const clearClipTitle = () => {
        const existingTitle = reviewingArea.querySelector('.clip-title');
        if (existingTitle) {
            existingTitle.remove();
        }
    };

    // 创建提示框
    const createAlert = (message) => {
        const alert = document.createElement('div');
        alert.style.position = 'fixed';
        alert.style.top = '50%';
        alert.style.left = '50%';
        alert.style.transform = 'translate(-50%, -50%)';
        alert.style.backgroundColor = '#fff';
        alert.style.padding = '20px';
        alert.style.borderRadius = '5px';
        alert.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        alert.style.zIndex = '1000';
        alert.textContent = message;
        
        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '确定';
        closeBtn.style.marginTop = '10px';
        closeBtn.style.padding = '5px 15px';
        closeBtn.style.display = 'block';
        closeBtn.style.margin = '10px auto 0';
        closeBtn.onclick = () => alert.remove();
        
        alert.appendChild(closeBtn);
        document.body.appendChild(alert);
        
        // 3秒后自动关闭
        setTimeout(() => alert.remove(), 3000);
    };

    // 自动将第一个视频放入第一个clip slot
    const autoFillFirstClip = () => {
        // 只在第一轮自动填充
        if (currentRound !== 0) {
            console.log('非第一轮，不自动填充第一个clip slot');
            return;
        }
        
        if (thumbnails.length > 0 && clipSlots.length > 0) {
            const firstThumbnail = thumbnails[0];
            const firstClipSlot = clipSlots[0];
            
            // 获取视频源
            const videoElement = firstThumbnail.querySelector('video');
            if (videoElement && videoElement.querySelector('source')) {
                const videoSrc = videoElement.querySelector('source').getAttribute('src');
                
                // 创建新的视频元素
                const newVideo = document.createElement('video');
                newVideo.className = 'clip-video';
                newVideo.autoplay = true;
                newVideo.loop = true;
                newVideo.muted = true;
                newVideo.playsinline = true;
                newVideo.dataset.thumbnailId = firstThumbnail.id; // 存储原始缩略图ID
                
                // 添加视频源
                const source = document.createElement('source');
                source.src = videoSrc;
                source.type = 'video/mp4';
                newVideo.appendChild(source);
                
                // 清空slot并添加视频
                firstClipSlot.innerHTML = '';
                firstClipSlot.appendChild(newVideo);
                firstClipSlot.classList.add('filled');
                firstClipSlot.classList.add('fixed');
                
                // 加载并播放视频
                newVideo.load();
                newVideo.play().catch(e => console.error('视频播放失败:', e));
                
                console.log('自动填充第一个clip slot完成');
            }
        }
    };

    // 初始化函数 - 根据当前回合设置初始状态
    const initializeRound = () => {
        console.log(`初始化第${currentRound + 1}轮...`);
        
        // 第一轮：自动填充第一个clip并添加rub键到最后一个clip
        if (currentRound === 0) {
            // 自动填充第一个clip
            autoFillFirstClip();
            
            // 为最后一个clip slot添加rub图标
            const lastClipSlot = clipSlots[clipSlots.length - 1];
            const rubIconBg = createRubIcon(lastClipSlot);
            lastClipSlot.appendChild(rubIconBg);
        } else {
            // 非第一轮：移除第一个clip slot的fixed类
            if (clipSlots.length > 0) {
                clipSlots[0].classList.remove('fixed');
                console.log('移除第一个clip slot的fixed类');
            }
        }
        
        // 更新缩略图视频
        updateThumbnailVideos(currentRound);
    };

    // 创建rub图标
    const createRubIcon = (slot) => {
        const rubIconBg = document.createElement('div');
        rubIconBg.className = 'rub-icon-bg';
        
        const rubIcon = document.createElement('div');
        rubIcon.className = 'rub-icon';
        
        rubIconBg.appendChild(rubIcon);
        
        rubIconBg.addEventListener('click', () => {
            // 删除后禁用该slot
            slot.classList.add('disabled');
            slot.innerHTML = '';
            slot.classList.remove('filled');
            slot.appendChild(rubIconBg);
            console.log('删除并禁用clip slot');
            checkClipSequence();
        });
        
        return rubIconBg;
    };

    // 为每个缩略图添加唯一ID和拖拽功能
    thumbnails.forEach((thumbnail, index) => {
        // 设置唯一ID
        thumbnail.id = `thumbnail-${index}`;
        console.log(`设置缩略图ID: ${thumbnail.id}`);
        
        // 只在第一轮时为第一个视频添加特殊处理
        if (index === 0 && currentRound === 0) {
            thumbnail.addEventListener('mousedown', (e) => {
                // 只在第一轮时阻止拖拽
                if (currentRound === 0) {
                    e.preventDefault();
                    createAlert('第一轮中，第一个视频已固定，无法拖拽');
                }
            });
            // 将第一个视频标记为已使用（仅在第一轮）
            usedThumbnails.add(thumbnail.id);
            console.log('第一轮：第一个视频已标记为已使用');
        }
        
        thumbnail.addEventListener('dragstart', (e) => {
            // 检查视频是否已被使用
            if (usedThumbnails.has(thumbnail.id)) {
                e.preventDefault();
                createAlert('此视频已被使用，请选择其他视频');
                return;
            }
            
            e.dataTransfer.setData('text/plain', thumbnail.id);
            thumbnail.classList.add('dragging');
            console.log(`开始拖拽缩略图: ${thumbnail.id}`);
        });

        thumbnail.addEventListener('dragend', () => {
            thumbnail.classList.remove('dragging');
            console.log(`结束拖拽缩略图: ${thumbnail.id}`);
        });
    });

    // 为clip slots添加拖拽事件
    clipSlots.forEach((slot, index) => {
        slot.addEventListener('dragover', (e) => {
            // 第一轮时，跳过第一个slot
            if (currentRound === 0 && index === 0) {
                return;
            }
            
            if (slot.classList.contains('disabled') || slot.classList.contains('filled')) {
                return;
            }
            
            e.preventDefault();
            slot.classList.add('droppable');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('droppable');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            
            // 第一轮时，跳过第一个slot
            if (currentRound === 0 && index === 0) {
                return;
            }
            
            if (slot.classList.contains('disabled') || slot.classList.contains('filled')) {
                return;
            }
            
            slot.classList.remove('droppable');
            
            const thumbnailId = e.dataTransfer.getData('text/plain');
            const thumbnail = document.getElementById(thumbnailId);
            
            if (thumbnail && !usedThumbnails.has(thumbnailId)) {
                console.log(`将缩略图 ${thumbnailId} 放入clip slot ${index}`);
                
                // 标记缩略图为已使用
                usedThumbnails.add(thumbnailId);
                
                const videoElement = thumbnail.querySelector('video');
                if (videoElement && videoElement.querySelector('source')) {
                    const videoSrc = videoElement.querySelector('source').getAttribute('src');
                    
                    slot.innerHTML = '';
                    
                    const newVideo = document.createElement('video');
                    newVideo.className = 'clip-video';
                    newVideo.autoplay = true;
                    newVideo.loop = true;
                    newVideo.muted = true;
                    newVideo.playsinline = true;
                    newVideo.dataset.thumbnailId = thumbnailId;
                    
                    const source = document.createElement('source');
                    source.src = videoSrc;
                    source.type = 'video/mp4';
                    newVideo.appendChild(source);
                    
                    const closeButton = document.createElement('div');
                    closeButton.className = 'clip-close';
                    closeButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // 移除已使用标记
                        usedThumbnails.delete(thumbnailId);
                        slot.innerHTML = '';
                        slot.classList.remove('filled');
                        
                        // 如果是最后一个slot，重新添加rub图标
                        if (index === clipSlots.length - 1) {
                            const rubIconBg = createRubIcon(slot);
                            slot.appendChild(rubIconBg);
                        }
                        
                        checkClipSequence();
                    });
                    
                    slot.appendChild(newVideo);
                    slot.appendChild(closeButton);
                    slot.classList.add('filled');
                    
                    newVideo.load();
                    newVideo.play().catch(e => console.error('视频播放失败:', e));
                    
                    checkClipSequence();
                }
            }
        });
        
        // 最后一个slot添加rub图标点击事件
        if (index === clipSlots.length - 1) {
            const rubIconBg = createRubIcon(slot);
            slot.appendChild(rubIconBg);
        }
    });
    
    // 初始检查视频顺序
    setTimeout(checkClipSequence, 500);
    
    // 修改export按钮点击事件
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            // 获取当前的视频序列和标题
            const filledSlots = Array.from(clipSlots).filter(slot => slot.classList.contains('filled') && !slot.classList.contains('disabled'));
            let sequence = '';
            const videoSources = [];
            
            filledSlots.forEach(slot => {
                const video = slot.querySelector('video');
                if (video && video.dataset.thumbnailId) {
                    const thumbnailNum = video.dataset.thumbnailId.split('-')[1];
                    sequence += (parseInt(thumbnailNum) + 1);
                    
                    // 保存视频源
                    const source = video.querySelector('source');
                    if (source) {
                        videoSources.push(source.src);
                    }
                }
            });

            // 获取当前标题
            const currentTitle = clipTitles[sequence];
            if (currentTitle) {
                // 保存当前回合的序列信息
                roundSequences.push({
                    sequence: sequence,
                    title: currentTitle,
                    videoSources: videoSources
                });
                
                // 隐藏编辑区域
                document.getElementById('editor-screen').style.display = 'none';
                // 显示预览区域
                previewArea.style.display = 'block';
                
                // 设置预览标题和描述
                const previewTitle = previewArea.querySelector('.preview-title');
                const previewSubtitle = document.querySelector('.preview-subtitle');
                if (previewTitle && currentTitle) {
                    // 设置完整标题文本，包含引号
                    previewTitle.textContent = `"${currentTitle.text.split('"')[1]}"`;
                    
                    // 设置描述文本
                    if (previewSubtitle && currentTitle.description) {
                        previewSubtitle.textContent = currentTitle.description;
                    } else if (previewSubtitle) {
                        previewSubtitle.textContent = "";
                    }
                }
                
                // 清空并填充视频容器
                const videoContainer = previewArea.querySelector('.video-container');
                if (videoContainer) {
                    videoContainer.innerHTML = '';
                    filledSlots.forEach(slot => {
                        const originalVideo = slot.querySelector('video');
                        if (originalVideo) {
                            const previewVideo = originalVideo.cloneNode(true);
                            const videoWrapper = document.createElement('div');
                            videoWrapper.className = 'video-wrapper';
                            videoWrapper.appendChild(previewVideo);
                            videoContainer.appendChild(videoWrapper);
                            previewVideo.play().catch(e => console.error('预览视频播放失败:', e));
                        }
                    });
                }
                
                // 更新标题栏
                const roundTitle = previewArea.querySelector('.round-title');
                if (roundTitle) {
                    roundTitle.textContent = document.querySelector('.header-title').textContent || 'Round 3: Delivery Man Accident';
                }
                
                // 更新预览界面的资金显示
                const fundsAmount = previewArea.querySelector('.funds-amount');
                if (fundsAmount) {
                    fundsAmount.textContent = `+${fundsMapping[sequence]}`;
                }
                
                console.log('预览模式已激活');
                
                // 添加返回主界面的功能
                const uploadButton = previewArea.querySelector('.upload-button');
                if (uploadButton) {
                    uploadButton.addEventListener('click', () => {
                        // 隐藏预览区域
                        previewArea.style.display = 'none';
                        
                        // 更新回合计数
                        currentRound++;
                        
                        // 更新总资金
                        if (currentTitle) {
                            totalFunds += fundsMapping[sequence];
                        }
                        
                        // 显示游戏主界面
                        document.getElementById('game-screen').style.display = 'block';
                        
                        // 更新进度计数
                        const progressCount = document.querySelector('.progress-count');
                        if (progressCount) {
                            progressCount.textContent = `${currentRound}/5`;
                        }
                        
                        // 更新进度数字的激活状态
                        const progressNumbers = document.querySelectorAll('.number');
                        if (progressNumbers) {
                            // 移除所有active类
                            progressNumbers.forEach(num => num.classList.remove('active'));
                            
                            // 只为当前回合的数字添加active类
                            if (currentRound > 0 && currentRound <= progressNumbers.length) {
                                progressNumbers[currentRound - 1].classList.add('active');
                            }
                        }
                        
                        // 确保启用New Post按钮，允许进入下一轮
                        if (newPostButton) {
                            console.log('启用New Post按钮');
                            newPostButton.style.pointerEvents = 'auto';
                            newPostButton.style.opacity = '1';
                            // 添加一个明确的类来标记按钮已启用
                            newPostButton.classList.add('enabled');
                        }
                        
                        // 更新moral图标
                        const moralityMeter = document.querySelector('.morality-meter');
                        if (moralityMeter) {
                            // 清除现有内容
                            const meterContent = moralityMeter.querySelector('.meter');
                            if (meterContent) {
                                meterContent.innerHTML = '';
                                
                                // 创建图标容器
                                const iconContainer = document.createElement('div');
                                iconContainer.className = 'moral-icon';
                                
                                // 根据视频类型设置不同的图标
                                if (currentTitle.type === 'positive') {
                                    // 使用上升图标
                                    iconContainer.innerHTML = `<img src="up.svg" alt="Positive" width="100%" height="100%">`;
                                } else if (currentTitle.type === 'negative') {
                                    // 使用下降图标
                                    iconContainer.innerHTML = `<img src="down1.svg" alt="Negative" width="100%" height="100%">`;
                                } else {
                                    // 使用平稳图标
                                    iconContainer.innerHTML = `<img src="flat.svg" alt="Neutral" width="100%" height="100%">`;
                                }
                                
                                meterContent.appendChild(iconContainer);
                            }
                        }
                        
                        // 更新资金显示
                        const fundsMeter = document.querySelector('.funds-meter');
                        if (fundsMeter) {
                            // 清除现有内容
                            fundsMeter.innerHTML = '';
                            
                            // 创建资金显示
                            const currentFundsSpan = document.createElement('span');
                            currentFundsSpan.className = 'current-funds';
                            currentFundsSpan.textContent = totalFunds;
                            
                            fundsMeter.appendChild(currentFundsSpan);
                        }
                        
                        // 更新主界面视频封面和标题
                        updateMainScreenVideo();
                        
                        console.log('返回游戏主界面，当前回合:', currentRound, '总资金:', totalFunds);
                    }, { once: true }); // 确保事件只触发一次
                }
            } else {
                createAlert('请先完成视频序列编排');
            }
        });
    }

    // 更新主界面视频封面和标题
    function updateMainScreenVideo() {
        if (roundSequences.length === 0) return;
        
        // 获取最新一轮的视频序列
        const latestRound = roundSequences[roundSequences.length - 1];
        
        // 更新视频封面
        const videoPlaceholder = document.querySelector('.video-placeholder');
        if (videoPlaceholder && latestRound.videoSources.length > 0) {
            // 清空现有内容
            videoPlaceholder.innerHTML = '';
            
            // 创建视频元素
            const video = document.createElement('video');
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsinline = true;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            
            // 添加视频源
            const source = document.createElement('source');
            source.src = latestRound.videoSources[0]; // 使用第一个视频
            source.type = 'video/mp4';
            video.appendChild(source);
            
            videoPlaceholder.appendChild(video);
            
            // 加载并播放视频
            video.load();
            video.play().catch(e => console.error('主界面视频播放失败:', e));
        }
        
        // 更新视频标题
        const videoCaption = document.querySelector('.video-caption');
        if (videoCaption && latestRound.title) {
            videoCaption.textContent = `"${latestRound.title.text.split('"')[1]}"`;
        }
        
        // 更新浏览量
        const viewsCountElement = document.querySelector('.views-count');
        if (viewsCountElement && latestRound) {
            viewsCountElement.textContent = viewsMapping[latestRound.sequence];
        }
    }

    // 添加返回按钮事件
    if (backButton) {
        backButton.addEventListener('click', () => {
            // 隐藏预览区域
            previewArea.style.display = 'none';
            // 显示编辑区域
            document.getElementById('editor-screen').style.display = 'block';
            console.log('返回编辑模式');
        });
    }

    // 添加关闭按钮事件
    const closeButton = previewArea.querySelector('.window-controls .close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            // 隐藏预览区域
            previewArea.style.display = 'none';
            // 显示编辑区域
            document.getElementById('editor-screen').style.display = 'block';
            console.log('关闭预览模式');
        });
    }
    
    // 添加New Post按钮点击事件
    if (newPostButton) {
        console.log('设置New Post按钮点击事件');
        newPostButton.addEventListener('click', () => {
            console.log('New Post按钮被点击，当前回合:', currentRound);
            // 只有在完成上一轮后才能开始新一轮
            if (currentRound < 5) {
                // 切换到编辑器界面
                document.getElementById('game-screen').style.display = 'none';
                document.getElementById('editor-screen').style.display = 'block';
                
                // 更新编辑器标题
                const nextRound = currentRound + 1;
                const headerTitle = document.querySelector('.header-title');
                if (headerTitle) {
                    headerTitle.textContent = roundTitles[currentRound] || `Round${nextRound}: New Story`;
                }
                
                // 清空编辑区域
                clearEditingArea();
                
                // 更新视频素材
                updateThumbnailVideos(currentRound);
                
                // 根据当前回合设置特定功能
                if (currentRound === 0) {
                    // 第一轮：自动填充第一个clip并添加rub键到最后一个clip
                    setTimeout(() => {
                        autoFillFirstClip();
                        
                        // 为最后一个clip slot添加rub图标
                        const lastClipSlot = clipSlots[clipSlots.length - 1];
                        const rubIconBg = createRubIcon(lastClipSlot);
                        lastClipSlot.appendChild(rubIconBg);
                    }, 500);
                }
                
                console.log('进入第', nextRound, '轮编辑');
            } else {
                // 如果已经完成所有回合，显示游戏结束信息
                createAlert('All rounds completed!');
            }
        });
    }
    
    // 更新缩略图视频
    function updateThumbnailVideos(round) {
        console.log(`更新第${round + 1}轮的缩略图视频，可用视频:`, roundVideos[round]);
        const videos = roundVideos[round] || [];
        const thumbnailVideos = document.querySelectorAll('.thumbnail-video');
        
        console.log(`找到 ${thumbnailVideos.length} 个缩略图视频元素`);
        
        // 重置已使用缩略图集合
        usedThumbnails.clear();
        
        thumbnailVideos.forEach((video, index) => {
            const thumbnailContainer = video.closest('.thumbnail');
            
            // 第二轮且是最后一个视频时，禁用该缩略图
            if (round === 1 && index === 3) {
                if (thumbnailContainer) {
                    thumbnailContainer.classList.add('disabled');
                    console.log(`第二轮：禁用第${index + 1}个缩略图`);
                    
                    // 清除视频源
                    const source = video.querySelector('source');
                    if (source) {
                        source.removeAttribute('src');
                        video.load(); // 重新加载视频以清除
                    }
                }
                return;
            }
            
            if (index < videos.length) {
                const source = video.querySelector('source');
                if (source) {
                    source.src = videos[index];
                    video.load(); // 重新加载视频
                }
                // 确保缩略图可用
                if (thumbnailContainer) {
                    thumbnailContainer.classList.remove('disabled');
                    console.log(`启用第${index + 1}个缩略图，视频源: ${videos[index]}`);
                }
            } else {
                // 如果没有对应的视频，禁用该缩略图
                if (thumbnailContainer) {
                    thumbnailContainer.classList.add('disabled');
                    console.log(`禁用第${index + 1}个缩略图，没有对应视频`);
                }
            }
        });
        
        // 第一轮时，将第一个视频标记为已使用
        if (round === 0) {
            if (thumbnails.length > 0) {
                usedThumbnails.add(thumbnails[0].id);
                console.log('第一轮：第一个视频已标记为已使用');
            }
        }
        
        // 确保所有clip slots都可用（除了特殊处理的）
        clipSlots.forEach((slot, index) => {
            // 只有在第二轮且是最后一个slot时才禁用
            if (round === 1 && index === clipSlots.length - 1) {
                slot.classList.add('disabled');
                console.log('第二轮：禁用最后一个clip slot');
            } else {
                // 其他情况下移除disabled类
                slot.classList.remove('disabled');
            }
        });
        
        // 最后检查一次，确保在第二轮中，第四个视频框的视频源被正确清除
        if (round === 1 && thumbnailVideos.length >= 4) {
            const fourthVideo = thumbnailVideos[3];
            const source = fourthVideo.querySelector('source');
            if (source && source.hasAttribute('src')) {
                console.log('警告：第二轮中，第四个视频框的视频源未被清除，强制清除');
                source.removeAttribute('src');
                fourthVideo.load();
            } else {
                console.log('确认：第二轮中，第四个视频框的视频源已被清除');
            }
        }
    }
    
    // 清空编辑区域
    function clearEditingArea() {
        // 清空所有clip-slot
        clipSlots.forEach(slot => {
            while (slot.firstChild) {
                slot.removeChild(slot.firstChild);
            }
            // 移除filled和fixed类
            slot.classList.remove('filled');
            slot.classList.remove('fixed');
        });
        
        // 清除标题显示
        clearClipTitle();
    }
    
    // 初始化第一轮
    initializeRound();
    
    console.log('拖拽功能初始化完成');
}); 