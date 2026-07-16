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
       9. 结构解剖 — SVG 折线动态计算 + hover 交互
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
       10. 放大镜透镜（斗拱图片 mousemove 跟踪）
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
       11. 滚动动画（Intersection Observer 通用）
       ======================================================== */
    var revealElements = document.querySelectorAll(
        '.section-header, .origin-content, .detail-item, ' +
        '.reflection-card, .about-card, .performance-layout, .performance-stills, ' +
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

    // 为 detail-item 添加错开延迟
    var detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach(function (item, i) {
        item.classList.add('reveal-delay-' + ((i % 2) + 1));
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
       8. 初始化
       ======================================================== */
    updateNavbar();
    updateBackToTop();

})();
