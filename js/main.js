/* ============================================================
   古韵新生 — 皇城相府社会实践展示网站
   交互脚本
   ============================================================ */

(function () {
    'use strict';

    /* ========================================================
       DOM 引用
       ======================================================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.getElementById('backToTop');

    /* ========================================================
       1. 导航栏滚动变化
       ======================================================== */
    function updateNavbar() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });

    /* ========================================================
       2. 手机端菜单切换
       ======================================================== */
    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');

        // 汉堡菜单动画：三横变叉号
        var spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // 点击导航链接后关闭手机菜单
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
            var spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    /* ========================================================
       3. 回到顶部按钮
       ======================================================== */
    function updateBackToTop() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateBackToTop, { passive: true });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========================================================
       4. 首屏向下滚动提示
       ======================================================== */
    var scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
        scrollHint.addEventListener('click', function () {
            var originSection = document.getElementById('origin');
            if (originSection) {
                originSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ========================================================
       5. 图片热点交互
       ======================================================== */
    var hotspotDots = document.querySelectorAll('.hotspot-dot');
    var hotspotContainer = document.querySelector('.hotspot-image-container');
    var activeDot = null; // 当前移动端激活的热点

    /**
     * 关闭所有热点的 tooltip（移动端用）
     */
    function closeAllTooltips() {
        hotspotDots.forEach(function (dot) {
            dot.classList.remove('active');
        });
        activeDot = null;
    }

    /**
     * 判断是否为触摸设备
     */
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // 移动端：点击热点切换 tooltip 显示/隐藏
    if (isTouchDevice()) {
        hotspotDots.forEach(function (dot) {
            dot.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (dot === activeDot) {
                    // 再次点击同一个点 → 关闭
                    closeAllTooltips();
                } else {
                    // 点击新热点 → 关闭旧热点，打开新热点
                    closeAllTooltips();
                    dot.classList.add('active');
                    activeDot = dot;
                }
            });
        });

        // 点击图片空白区域 → 关闭所有 tooltip
        if (hotspotContainer) {
            hotspotContainer.addEventListener('click', function (e) {
                if (!e.target.closest('.hotspot-dot')) {
                    closeAllTooltips();
                }
            });
        }

        // 点击页面其他区域 → 关闭 tooltip
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.hotspot-dot') && !e.target.closest('.hotspot-tooltip')) {
                closeAllTooltips();
            }
        });
    }

    /* ========================================================
       6. 缩略图导航（为后续多张图片预留）
       ======================================================== */
    var thumbBtns = document.querySelectorAll('.thumb-btn');
    var mainImage = document.getElementById('hotspotMainImage');

    thumbBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var imageSrc = this.getAttribute('data-image');

            // 更新激活状态
            thumbBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            // 切换主图
            if (mainImage && imageSrc) {
                mainImage.src = imageSrc;
            }

            // 切换图片后关闭所有 tooltip
            closeAllTooltips();
        });
    });

    /* ========================================================
       7. 蓝图 HUD — 数据线动态计算 + 交互
       ======================================================== */
    var bpDataPoints = document.querySelectorAll('.bp-data-point');
    var bpViewer = document.querySelector('.blueprint-image-container');

    /**
     * 根据数据点的 X 坐标和延伸方向，动态计算水平线的宽度
     */
    function updateBlueprintLines() {
        if (!bpViewer) return;

        var containerWidth = bpViewer.offsetWidth;

        bpDataPoints.forEach(function (point) {
            var lineH = point.querySelector('.bp-line-h');
            if (!lineH) return;

            // 读取数据点的 left 百分比
            var leftPercent = parseFloat(point.style.left) / 100;
            var markerX = containerWidth * leftPercent;

            var isLeft = lineH.classList.contains('bp-line-left');

            if (isLeft) {
                // 向左延伸：从标记点到左边缘
                var lineWidth = markerX;
                lineH.style.width = lineWidth + 'px';
                lineH.style.right = 'auto';
                lineH.style.left = '0';
                // 将线定位到标记点并向左
                lineH.style.transform = 'translate(-100%, -50%)';
            } else {
                // 向右延伸：从标记点到右边缘
                var lineWidthR = containerWidth - markerX;
                lineH.style.width = lineWidthR + 'px';
                lineH.style.left = 'auto';
                lineH.style.right = '0';
                lineH.style.transform = 'translateY(-50%)';
            }
        });
    }

    // 初始计算
    updateBlueprintLines();

    // 窗口缩放时重新计算
    var bpResizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(bpResizeTimer);
        bpResizeTimer = setTimeout(updateBlueprintLines, 200);
    });

    // 移动端触摸交互
    if (isTouchDevice()) {
        var activeBpPoint = null;

        function closeAllBpPanels() {
            bpDataPoints.forEach(function (p) {
                p.classList.remove('active');
            });
            activeBpPoint = null;
        }

        bpDataPoints.forEach(function (point) {
            point.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (point === activeBpPoint) {
                    closeAllBpPanels();
                } else {
                    closeAllBpPanels();
                    point.classList.add('active');
                    activeBpPoint = point;
                }
            });
        });

        // 点击空白关闭
        if (bpViewer) {
            bpViewer.addEventListener('click', function (e) {
                if (!e.target.closest('.bp-data-point')) {
                    closeAllBpPanels();
                }
            });
        }

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.bp-data-point') && !e.target.closest('.bp-panel')) {
                closeAllBpPanels();
            }
        });
    }

    /* ========================================================
       8. 卷轴画展开（Intersection Observer 触发）
       ======================================================== */
    var scrollPainting = document.getElementById('scrollPainting');
    var scrollRevealClip = document.getElementById('scrollRevealClip');
    var gardenTextPanel = document.getElementById('gardenTextPanel');

    if (scrollPainting && scrollRevealClip) {
        var gardenObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // 1) 卷轴框淡入
                    scrollPainting.classList.add('visible');
                    // 2) clip-path 展开（稍延迟，让卷轴框先出现）
                    setTimeout(function () {
                        scrollRevealClip.classList.add('revealed');
                    }, 200);
                    // 3) 竖排文字延迟淡入（等画卷展开后）
                    if (gardenTextPanel) {
                        gardenTextPanel.classList.add('visible');
                    }
                    // 只触发一次
                    gardenObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        gardenObserver.observe(scrollPainting);
    }

    /* ========================================================
       9. 人文表演 · Scrollytelling 滚动叙事
       ======================================================== */
    var scrollyVideo = document.getElementById('scrollyVideo');
    var scrollyVideoWrap = document.getElementById('scrollyVideoWrap');
    var scrollyOverlay = document.getElementById('scrollyOverlay');
    var scrollyCards = document.querySelectorAll('.scrolly-card');
    var audioToggle = document.getElementById('audioToggle');

    if (scrollyVideo && scrollyCards.length > 0) {

        /* ---- 视频加载完成后获取总时长 ---- */
        var videoDuration = 480; // 默认 8 分钟
        scrollyVideo.addEventListener('loadedmetadata', function () {
            videoDuration = scrollyVideo.duration;
            // 卡片4 的 data-time="end" → 设为视频末尾前 0.5 秒
            var exitCard = document.querySelector('.scrolly-card--exit');
            if (exitCard) {
                exitCard.setAttribute('data-time', Math.max(0, videoDuration - 0.5));
            }
        });

        /* ---- IntersectionObserver：检测卡片进入视口中心 ---- */
        var currentActiveCard = null;

        var cardObserver = new IntersectionObserver(function (entries) {
            // 找出当前交叉比例最高的卡片
            var bestEntry = null;
            var bestRatio = 0;

            entries.forEach(function (entry) {
                // 更新内部记录
                if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
                    bestRatio = entry.intersectionRatio;
                    bestEntry = entry;
                }
            });

            if (bestEntry) {
                var card = bestEntry.target;
                var time = card.getAttribute('data-time');

                // 切换激活卡片样式
                if (currentActiveCard && currentActiveCard !== card) {
                    currentActiveCard.classList.remove('active');
                }
                card.classList.add('active');
                currentActiveCard = card;

                // 跳转视频时间
                var targetTime = parseFloat(time);
                if (!isNaN(targetTime) && Math.abs(scrollyVideo.currentTime - targetTime) > 0.8) {
                    scrollyVideo.currentTime = targetTime;
                }

                // 卡片4：加深遮罩
                if (card.classList.contains('scrolly-card--exit')) {
                    scrollyOverlay.classList.add('darken');
                } else {
                    scrollyOverlay.classList.remove('darken');
                }
            }
        }, {
            threshold: [0, 0.3, 0.5, 0.7, 0.9],
            rootMargin: '-20% 0px -20% 0px'
        });

        // 观察所有卡片
        scrollyCards.forEach(function (card) {
            cardObserver.observe(card);
        });

        /* ---- 音频开关 ---- */
        if (audioToggle) {
            audioToggle.addEventListener('click', function () {
                if (scrollyVideo.muted) {
                    // 开启声音
                    scrollyVideo.muted = false;
                    audioToggle.classList.add('unmuted');
                    audioToggle.querySelector('.audio-label').textContent = '关闭原声';
                } else {
                    // 关闭声音
                    scrollyVideo.muted = true;
                    audioToggle.classList.remove('unmuted');
                    audioToggle.querySelector('.audio-label').textContent = '开启原声';
                }
            });
        }

        /* ---- 确保视频在视口内时持续播放 ---- */
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (scrollyVideo.paused) {
                        scrollyVideo.play().catch(function () {});
                    }
                } else {
                    // 离开板块时暂停以节省资源
                    scrollyVideo.pause();
                }
            });
        }, { threshold: 0.05 });

        if (scrollyVideoWrap) {
            sectionObserver.observe(scrollyVideoWrap);
        }
    }

    /* ========================================================
       9.5 相府元宇宙 — GSAP ScrollTrigger 时空跃迁 + Minimap 联动
       ======================================================== */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        var matrixViewport = document.getElementById('matrixViewport');
        var matrixMinimap = document.getElementById('matrixMinimap');
        var matrixPanorama = document.getElementById('matrixPanorama');

        if (matrixViewport && matrixMinimap) {

            /* ---- ScrollTrigger 四阶段动画（含 onUpdate 控制 minimap 交互开关）---- */
            var minimapActive = false;
            var sectionLeft = false; // 跟踪板块是否已被离开
            var panoramaHoverTween = null; // 追踪鼠标悬浮动画引用

            var matrixTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#matrix',
                    start: 'top top',
                    end: '+=350%',
                    scrub: 1.5,
                    pin: '#matrixViewport',
                    onUpdate: function (self) {
                        if (self.progress > 0.72 && !minimapActive && !sectionLeft) {
                            minimapActive = true;
                            // 清除所有强制隐藏样式，让 GSAP 时间轴控制
                            matrixMinimap.style.visibility = '';
                            matrixMinimap.style.opacity = '';
                            matrixMinimap.style.pointerEvents = 'auto';
                        } else if (self.progress <= 0.72 && minimapActive) {
                            minimapActive = false;
                            matrixMinimap.style.pointerEvents = 'none';
                            // 杀死鼠标悬浮动画，避免覆写时间轴
                            if (panoramaHoverTween) {
                                panoramaHoverTween.kill();
                                panoramaHoverTween = null;
                            }
                            // 用 gsap.set 重置全景图 —— 不 kill，不 overwrite，让时间轴继续控制
                            if (matrixPanorama) {
                                gsap.set(matrixPanorama, {
                                    scale: 1,
                                    xPercent: 0,
                                    yPercent: 0,
                                    transformOrigin: '50% 50%'
                                });
                            }
                        }
                    }
                }
            });

            // 阶段〇：深色背景 + 标题 → 卫星图从暗色中渐现
            matrixTl
                .fromTo('.matrix-satellite', {
                    opacity: 0,
                    scale: 1.06
                }, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.7,
                    ease: 'power2.out'
                })

            // 标题在卫星图亮起后微微淡化但仍可见
                .to(['#matrixHeader', '#matrixScrollHint'], {
                    opacity: 0.2,
                    duration: 0.4
                }, '-=0.2')

            // 阶段一：卫星图完整呈现后 → 旅游地图叠层浮现
                .to('#matrixMapOverlay', {
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power1.inOut'
                })

            // 阶段二：镜头坠入 — 卫星图+地图 放大5倍并淡出，全景图 从1.5倍缩小到1并淡入
                .to(['.matrix-satellite', '#matrixMapOverlay'], {
                    scale: 5,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.in'
                }, 'zoom')
                .fromTo('#matrixPanorama', {
                    scale: 1.5,
                    opacity: 0
                }, {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out'
                }, 'zoom+=0.12')
                .to(['#matrixHeader', '#matrixScrollHint'], {
                    opacity: 0,
                    duration: 0.25
                }, 'zoom+=0.08')

            // 阶段三：全景锁定为背景，旅游地图缩小飞入右下角成为雷达小地图
                .fromTo('#matrixMinimap', {
                    scale: 3,
                    opacity: 0
                }, {
                    scale: 1,
                    opacity: 1,
                    duration: 1.3,
                    ease: 'back.out(1.4)'
                }, 'minimap')

            /* ---- Minimap 鼠标联动全景图（IDW 插值映射）---- */
            var minimapFrame = matrixMinimap.querySelector('.minimap-frame');
            if (minimapFrame && matrixPanorama) {
                var ZOOM_LEVEL = 1.5; // 全景放大倍数

                // 4 个基准锚点：minimap坐标(0~1) → 全景图焦点(0~1)
                // 透视关系约逆时针旋转90°，线性映射会错位，用 IDW 插值解决
                var anchorPoints = [
                    { map: {x: 0.88, y: 0.18}, pan: {x: 0.15, y: 0.35} },  // A: 地图右上城楼 → 全景左上城楼
                    { map: {x: 0.85, y: 0.88}, pan: {x: 0.68, y: 0.22} },  // B: 地图右下城楼 → 全景右上城楼
                    { map: {x: 0.28, y: 0.82}, pan: {x: 0.90, y: 0.70} },  // C: 御书楼大道 → 全景右侧中下部
                    { map: {x: 0.55, y: 0.55}, pan: {x: 0.50, y: 0.55} }   // D: 中心院落
                ];

                /**
                 * IDW（反距离加权）插值映射
                 * 距离越近的锚点权重越大，保证在锚点处映射精确
                 */
                function calculatePanPosition(mx, my) {
                    var totalWeight = 0;
                    var panX = 0, panY = 0;

                    for (var i = 0; i < anchorPoints.length; i++) {
                        var dx = mx - anchorPoints[i].map.x;
                        var dy = my - anchorPoints[i].map.y;
                        // 平方距离加权 —— 更贴近锚点，过渡更锐利
                        var distSq = dx * dx + dy * dy;
                        var weight = 1 / Math.max(distSq, 0.000001);

                        panX += anchorPoints[i].pan.x * weight;
                        panY += anchorPoints[i].pan.y * weight;
                        totalWeight += weight;
                    }

                    return {
                        x: panX / totalWeight,
                        y: panY / totalWeight
                    };
                }

                minimapFrame.addEventListener('mousemove', function (e) {
                    if (!minimapActive) return;

                    var rect = this.getBoundingClientRect();
                    var mx = (e.clientX - rect.left) / rect.width;
                    var my = (e.clientY - rect.top) / rect.height;

                    // IDW 插值计算全景图焦点坐标
                    var focus = calculatePanPosition(mx, my);

                    // 焦点映射为全景图偏移量
                    var offsetX = (0.5 - focus.x) * (ZOOM_LEVEL - 1) * 100;
                    var offsetY = (0.5 - focus.y) * (ZOOM_LEVEL - 1) * 100;

                    // 保存引用：先 kill 旧动画，再创建新的（只影响自己的悬浮动画，不伤时间轴）
                    if (panoramaHoverTween) {
                        panoramaHoverTween.kill();
                    }
                    panoramaHoverTween = gsap.to(matrixPanorama, {
                        scale: ZOOM_LEVEL,
                        xPercent: offsetX,
                        yPercent: offsetY,
                        transformOrigin: '50% 50%',
                        duration: 0.5,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                });

                minimapFrame.addEventListener('mouseleave', function () {
                    if (!minimapActive) return;

                    // 先 kill 悬浮动画再回中，仅覆盖自己的 hover tween
                    if (panoramaHoverTween) {
                        panoramaHoverTween.kill();
                        panoramaHoverTween = null;
                    }
                    gsap.to(matrixPanorama, {
                        scale: 1,
                        xPercent: 0,
                        yPercent: 0,
                        transformOrigin: '50% 50%',
                        duration: 0.8,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                });
            }

            /* ---- 离开/重进板块时控制 minimap ---- */
            var matrixSection = document.getElementById('matrix');
            if (matrixSection) {
                var matrixLeaveObserver = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) {
                            // 板块离开视口 → 强制隐藏 minimap
                            sectionLeft = true;
                            minimapActive = false;
                            // 多重保障隐藏：visibility + opacity + pointerEvents
                            matrixMinimap.style.visibility = 'hidden';
                            matrixMinimap.style.opacity = '0';
                            matrixMinimap.style.pointerEvents = 'none';
                            // 杀死鼠标悬浮动画
                            if (panoramaHoverTween) {
                                panoramaHoverTween.kill();
                                panoramaHoverTween = null;
                            }
                            // 用 gsap.set 重置全景图 — 不伤时间轴
                            if (matrixPanorama) {
                                gsap.set(matrixPanorama, {
                                    scale: 1,
                                    xPercent: 0,
                                    yPercent: 0,
                                    transformOrigin: '50% 50%'
                                });
                            }
                        } else {
                            // 板块重新进入视口 → 清除强制隐藏，让时间轴 onUpdate 决定何时显示
                            sectionLeft = false;
                            matrixMinimap.style.visibility = '';
                            // 注意：不在此处清 opacity —— 由 onUpdate 在进度 >72% 时清
                            // 这样避免了"刚进板块 minimap 就闪现"的问题
                        }
                    });
                }, { threshold: 0.1 });
                matrixLeaveObserver.observe(matrixSection);
            }
        }
    } else {
        // GSAP 未加载时的降级方案：所有图层正常显示
        console.warn('GSAP/ScrollTrigger 未加载，相府元宇宙动画跳过。请检查网络连接。');
        // 降级：确保图层可见
        var fallbackLayers = ['.matrix-satellite', '#matrixMapOverlay', '#matrixPanorama'];
        fallbackLayers.forEach(function (sel) {
            var el = document.querySelector(sel);
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
        var header = document.getElementById('matrixHeader');
        var hint = document.getElementById('matrixScrollHint');
        if (header) header.style.opacity = '1';
        if (hint) hint.style.opacity = '1';
    }

    /* ========================================================
       10. 结构解剖 — SVG 折线动态计算 + hover 交互
       ======================================================== */
    var anatomySvg = document.getElementById('anatomySvg');
    var anatomyImageArea = document.getElementById('anatomyImageArea');
    var anatomyMarkers = document.querySelectorAll('.anatomy-marker');
    var anatomyCards = document.querySelectorAll('.anatomy-card');

    /**
     * 根据 marker 和 card 的实际位置，更新 SVG 折线坐标
     */
    function updateAnatomyLines() {
        if (!anatomySvg || !anatomyImageArea) return;

        var imgRect = anatomyImageArea.getBoundingClientRect();
        var svgW = imgRect.width;
        var svgH = imgRect.height;

        anatomySvg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);

        anatomyMarkers.forEach(function (marker) {
            var id = marker.getAttribute('data-anatomy');
            var card = document.querySelector('.anatomy-card[data-anatomy="' + id + '"]');
            var line = document.getElementById('line-' + id);
            if (!card || !line) return;

            var mRect = marker.getBoundingClientRect();
            var cRect = card.getBoundingClientRect();

            // 标靶中心（相对图片区左上角）
            var mx = mRect.left + mRect.width / 2 - imgRect.left;
            var my = mRect.top + mRect.height / 2 - imgRect.top;

            // 卡片顶部连接点
            var cx = cRect.left + cRect.width / 2 - imgRect.left;
            var cy = cRect.top - imgRect.top;

            // 折点 Y：图片底部到卡片顶部之间 40% 处
            var gap = cy - svgH;
            var bendY = svgH + gap * 0.4;
            if (bendY < svgH + 4) bendY = svgH + 4;

            var points = mx + ',' + my + ' ' + mx + ',' + bendY + ' ' + cx + ',' + cy;
            line.setAttribute('points', points);
        });
    }

    // 初始计算 + 尺寸变化重新计算
    updateAnatomyLines();
    var anatomyResizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(anatomyResizeTimer);
        anatomyResizeTimer = setTimeout(updateAnatomyLines, 250);
    });

    // 图片加载完成后重新计算（图片未加载时高度为 0）
    var anatomyImage = document.getElementById('anatomyImage');
    if (anatomyImage) {
        anatomyImage.addEventListener('load', updateAnatomyLines);
    }

    // ---- hover / touch 交互 ----
    function activateAnatomy(id) {
        // 激活对应标靶
        anatomyMarkers.forEach(function (m) {
            if (m.getAttribute('data-anatomy') === id) m.classList.add('active');
        });
        // 激活对应连线
        var line = document.getElementById('line-' + id);
        if (line) line.classList.add('active');
        // 激活对应卡片
        anatomyCards.forEach(function (c) {
            if (c.getAttribute('data-anatomy') === id) c.classList.add('active');
        });
    }

    function deactivateAllAnatomy() {
        anatomyMarkers.forEach(function (m) { m.classList.remove('active'); });
        document.querySelectorAll('.anatomy-line').forEach(function (l) { l.classList.remove('active'); });
        anatomyCards.forEach(function (c) { c.classList.remove('active'); });
    }

    // 桌面 hover
    anatomyMarkers.forEach(function (marker) {
        marker.addEventListener('mouseenter', function () {
            var id = this.getAttribute('data-anatomy');
            updateAnatomyLines(); // 确保坐标最新
            activateAnatomy(id);
        });
        marker.addEventListener('mouseleave', function () {
            deactivateAllAnatomy();
        });
    });

    // 卡片也响应 hover（保持激活）
    anatomyCards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            var id = this.getAttribute('data-anatomy');
            updateAnatomyLines();
            activateAnatomy(id);
        });
        card.addEventListener('mouseleave', function () {
            deactivateAllAnatomy();
        });
    });

    // 移动端 touch
    if (isTouchDevice()) {
        var activeAnatomyId = null;

        function handleAnatomyTap(el) {
            var id = el.getAttribute('data-anatomy');
            if (id === activeAnatomyId) {
                deactivateAllAnatomy();
                activeAnatomyId = null;
            } else {
                updateAnatomyLines();
                deactivateAllAnatomy();
                activateAnatomy(id);
                activeAnatomyId = id;
            }
        }

        anatomyMarkers.forEach(function (m) {
            m.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                handleAnatomyTap(this);
            });
        });

        anatomyCards.forEach(function (c) {
            c.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                handleAnatomyTap(this);
            });
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.anatomy-marker') && !e.target.closest('.anatomy-card')) {
                deactivateAllAnatomy();
                activeAnatomyId = null;
            }
        });
    }

    /* ========================================================
       11. 放大镜透镜（斗拱图片 mousemove 跟踪）
       ======================================================== */
    var anatomyLens = document.getElementById('anatomyLens');
    var anatomyImgEl = document.getElementById('anatomyImage');
    var anatomyImgArea = document.getElementById('anatomyImageArea');

    if (anatomyLens && anatomyImgEl && anatomyImgArea) {
        var ZOOM = 2.5;
        var LENS_SIZE = 180;

        function showLens() {
            anatomyLens.style.backgroundImage = 'url(' + anatomyImgEl.src + ')';
            anatomyLens.classList.add('visible');
        }

        function hideLens() {
            anatomyLens.classList.remove('visible');
        }

        function moveLens(e) {
            var imgRect = anatomyImgEl.getBoundingClientRect();
            var imgW = imgRect.width;
            var imgH = imgRect.height;

            var rx = (e.clientX - imgRect.left) / imgW;
            var ry = (e.clientY - imgRect.top) / imgH;

            var lensX = Math.max(0, Math.min(e.clientX - imgRect.left, imgW));
            var lensY = Math.max(0, Math.min(e.clientY - imgRect.top, imgH));

            anatomyLens.style.left = lensX + 'px';
            anatomyLens.style.top = lensY + 'px';

            var bgX = (LENS_SIZE / 2) - (rx * imgW * ZOOM);
            var bgY = (LENS_SIZE / 2) - (ry * imgH * ZOOM);

            anatomyLens.style.backgroundSize = (imgW * ZOOM) + 'px ' + (imgH * ZOOM) + 'px';
            anatomyLens.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
        }

        anatomyImgArea.addEventListener('mouseenter', showLens);
        anatomyImgArea.addEventListener('mousemove', moveLens);
        anatomyImgArea.addEventListener('mouseleave', hideLens);
    }

    /* ========================================================
       12. 滚动动画（Intersection Observer 通用）
       ======================================================== */
    var revealElements = document.querySelectorAll(
        '.section-header, .origin-content, ' +
        '.reflection-card, .about-card, ' +
        '.scroll-mount, .hotspot-caption, .hotspot-thumbnails, ' +
        '.blueprint-frame, .blueprint-caption, ' +
        '.scroll-painting-layout, ' +
        '.anatomy-viewer'
    );

    // 为这些元素添加 reveal 类
    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    // 为 reflection-card 添加错开延迟
    var reflectionCards = document.querySelectorAll('.reflection-card');
    reflectionCards.forEach(function (card, i) {
        card.classList.add('reveal-delay-' + (Math.min(i, 3) + 1));
    });

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // 只触发一次
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // 降级方案：不支持 IntersectionObserver 的浏览器直接显示所有元素
        document.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ========================================================
       13. 初始化
       ======================================================== */
    updateNavbar();
    updateBackToTop();

})();
