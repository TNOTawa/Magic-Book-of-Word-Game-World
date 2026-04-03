// WGW主题渲染脚本
// 用于重新渲染导航按钮、分割线

(function() {
  'use strict';

  // 分割线配置
  var DIVIDER_TEXT = '文字游戏世界魔法书';
  var DIVIDER_REPEAT = 6;
  var SCROLL_SPEED = 0.5;

  var dividerContainer = null;
  var dividerItems = [];
  var lastTimestamp = 0;
  var navInitialized = false;
  var dividerInitialized = false;

  function isWgwTheme() {
    return document.documentElement.classList.contains('wgw-theme');
  }

  function renderNavButtons() {
    if (!isWgwTheme()) {
      // 如果不是WGW主题，隐藏自定义导航
      hideCustomNav();
      showOriginalNav();
      return;
    }

    var mobilePrev = document.querySelector('.mobile-nav-chapters.previous');
    var mobileNext = document.querySelector('.mobile-nav-chapters.next');
    var desktopPrev = document.querySelector('.nav-chapters.previous');
    var desktopNext = document.querySelector('.nav-chapters.next');

    var hasMobile = mobilePrev || mobileNext;
    var hasDesktop = desktopPrev || desktopNext;

    if (hasMobile) {
      renderNavPair(mobilePrev, mobileNext, 'mobile');
    }

    if (hasDesktop) {
      renderNavPair(desktopPrev, desktopNext, 'desktop');
    }

    hideOriginalNav();
    navInitialized = true;
  }

  function hideCustomNav() {
    var mobileNav = document.getElementById('wgw-nav-mobile');
    var desktopNav = document.getElementById('wgw-nav-desktop');
    if (mobileNav) mobileNav.style.display = 'none';
    if (desktopNav) desktopNav.style.display = 'none';
  }

  function showOriginalNav() {
    var mobilePrev = document.querySelector('.mobile-nav-chapters.previous');
    var mobileNext = document.querySelector('.mobile-nav-chapters.next');
    var desktopPrev = document.querySelector('.nav-chapters.previous');
    var desktopNext = document.querySelector('.nav-chapters.next');

    if (mobilePrev) {
      mobilePrev.style.display = '';
      mobilePrev.style.color = '';
      var svg = mobilePrev.querySelector('.fa-svg, svg');
      if (svg) svg.style.display = '';
    }
    if (mobileNext) {
      mobileNext.style.display = '';
      mobileNext.style.color = '';
      var svg2 = mobileNext.querySelector('.fa-svg, svg');
      if (svg2) svg2.style.display = '';
    }
    if (desktopPrev) {
      desktopPrev.style.display = '';
      desktopPrev.style.color = '';
      var svg3 = desktopPrev.querySelector('.fa-svg, svg');
      if (svg3) svg3.style.display = '';
    }
    if (desktopNext) {
      desktopNext.style.display = '';
      desktopNext.style.color = '';
      var svg4 = desktopNext.querySelector('.fa-svg, svg');
      if (svg4) svg4.style.display = '';
    }
  }

  function hideOriginalNav() {
    var mobilePrev = document.querySelector('.mobile-nav-chapters.previous');
    var mobileNext = document.querySelector('.mobile-nav-chapters.next');
    var desktopPrev = document.querySelector('.nav-chapters.previous');
    var desktopNext = document.querySelector('.nav-chapters.next');

    if (mobilePrev) {
      mobilePrev.style.display = 'none';
    }
    if (mobileNext) {
      mobileNext.style.display = 'none';
    }
    if (desktopPrev) {
      desktopPrev.style.display = 'none';
    }
    if (desktopNext) {
      desktopNext.style.display = 'none';
    }
  }

  function renderNavPair(prevBtn, nextBtn, type) {
    var hasPrev = !!prevBtn;

    var navContainer = document.getElementById('wgw-nav-' + type);
    if (!navContainer) {
      navContainer = document.createElement('div');
      navContainer.id = 'wgw-nav-' + type;
      navContainer.className = 'wgw-nav-container';
      document.body.appendChild(navContainer);
    }

    navContainer.style.display = 'flex';
    navContainer.innerHTML = '';

    if (hasPrev) {
      navContainer.innerHTML = '<span class="wgw-nav-bracket">[</span><a class="wgw-nav-arrow wgw-nav-prev" href="' + (prevBtn ? prevBtn.href : '#') + '"><</a><span class="wgw-nav-slash">/</span><a class="wgw-nav-arrow wgw-nav-next" href="' + (nextBtn ? nextBtn.href : '#') + '">></a><span class="wgw-nav-bracket">]</span>';
    } else {
      navContainer.innerHTML = '<span class="wgw-nav-bracket">[</span><span class="wgw-nav-disabled">x</span><span class="wgw-nav-slash">/</span><a class="wgw-nav-arrow wgw-nav-next" href="' + (nextBtn ? nextBtn.href : '#') + '">></a><span class="wgw-nav-bracket">]</span>';
    }
  }

  // 分割线
  function initDivider() {
    if (dividerInitialized) {
      return;
    }

    if (!isWgwTheme()) {
      // 非WGW主题时隐藏分割线
      if (dividerContainer) {
        dividerContainer.style.display = 'none';
      }
      return;
    }

    var resizeHandle = document.getElementById('mdbook-sidebar-resize-handle');
    if (!resizeHandle) {
      setTimeout(initDivider, 100);
      return;
    }

    // 显示分割线
    if (dividerContainer) {
      dividerContainer.style.display = '';
      dividerInitialized = true;
      return;
    }

    var charHeight = 20;
    var singleTextHeight = DIVIDER_TEXT.length * charHeight;
    var totalHeight = singleTextHeight * DIVIDER_REPEAT;

    // 创建分割线容器，作为 resizeHandle 的子元素
    dividerContainer = document.createElement('div');
    dividerContainer.id = 'wgw-divider';
    dividerContainer.style.cssText = 'position:absolute;top:0;left:50%;transform:translateX(-50%);width:1em;height:100vh;overflow:hidden;pointer-events:none;user-select:none;z-index:10;font-size:20px;line-height:1;color:rgba(255,255,255,0.22);font-family:zpix,sans-serif;white-space:pre;';
    resizeHandle.appendChild(dividerContainer);

    var fullText = '';
    for (var i = 0; i < DIVIDER_REPEAT; i++) {
      fullText += DIVIDER_TEXT.split('').join('\n') + '\n';
    }

    for (var j = 0; j < 2; j++) {
      var item = document.createElement('div');
      item.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);width:1em;white-space:pre;';
      item.textContent = fullText;
      item.style.top = (j * totalHeight) + 'px';
      dividerContainer.appendChild(item);
      dividerItems.push({
        element: item,
        baseTop: j * totalHeight
      });
    }

    dividerInitialized = true;
    lastTimestamp = performance.now();
    requestAnimationFrame(animateDivider);
  }

  function animateDivider(timestamp) {
    if (!dividerContainer) {
      return;
    }

    var delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    var singleTextHeight = DIVIDER_TEXT.length * 20;
    var totalHeight = singleTextHeight * DIVIDER_REPEAT;

    for (var i = 0; i < dividerItems.length; i++) {
      var item = dividerItems[i];
      item.baseTop -= SCROLL_SPEED * delta * 60;

      if (item.baseTop < -totalHeight) {
        item.baseTop += totalHeight * 2;
      }

      item.element.style.top = item.baseTop + 'px';
    }

    requestAnimationFrame(animateDivider);
  }

  // 修复侧边栏间距和滚动
  function fixSidebarSpacing() {
    if (!isWgwTheme()) {
      return;
    }

    var sidebar = document.querySelector('html.wgw-theme .sidebar');
    var scrollbox = document.querySelector('html.wgw-theme .sidebar-scrollbox');
    var chapter = document.querySelector('html.wgw-theme .sidebar .chapter');

    if (sidebar) {
      sidebar.style.borderRight = '0';
      sidebar.style.overflow = 'visible';
    }

    if (scrollbox) {
      scrollbox.style.overflowY = 'auto';
      scrollbox.style.overflowX = 'hidden';
      scrollbox.style.scrollbarWidth = 'thin';
      scrollbox.style.scrollbarColor = 'rgba(255, 255, 255, 0.5) #000';
      scrollbox.style.height = '100%';
      scrollbox.style.display = 'block';
      scrollbox.style.maxHeight = '';
    }

    if (chapter) {
      chapter.style.listStyle = 'none';
      chapter.style.paddingLeft = '1em';
      chapter.style.marginLeft = '0.5em';
    }

    var partTitles = document.querySelectorAll('html.wgw-theme .part-title');
    partTitles.forEach(function(el) {
      el.style.paddingLeft = '0.8em';
      el.style.marginLeft = '0';
    });
  }

  // 主题变化处理
  function onThemeChange() {
    navInitialized = false;
    renderNavButtons();
    initDivider();
    fixSidebarSpacing();
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      renderNavButtons();
      initDivider();
      fixSidebarSpacing();
    });
  } else {
    renderNavButtons();
    initDivider();
    fixSidebarSpacing();
  }

  // 监听主题变化
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        onThemeChange();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
})();
