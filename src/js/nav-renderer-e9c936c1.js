// WGW主题渲染脚本
// 用于重新渲染导航按钮、分割线、代码块边框、搜索框边框

(function() {
  'use strict';

  // 分割线配置
  var DIVIDER_TEXT = '文字游戏世界魔法书';
  var DIVIDER_REPEAT = 6;
  var SCROLL_SPEED = 0.5;

  // 边框配置
  var BORDER_FONT_SIZE = 10;
  var CODE_BORDER_TEXT = '代码块';
  var SEARCH_BORDER_TEXT = '搜';
  var CODE_SIDE_PADDING = 4; // 额外像素，确保字符不重合

  var dividerContainer = null;
  var dividerItems = [];
  var lastTimestamp = 0;
  var bordersInitialized = false;

  function renderNavButtons() {
    if (!document.documentElement.classList.contains('wgw-theme')) {
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

    initDivider();
    initBorders();
    fixSidebarSpacing();
  }

  function renderNavPair(prevBtn, nextBtn, type) {
    if (prevBtn) {
      prevBtn.style.color = 'transparent';
      var prevSvg = prevBtn.querySelector('.fa-svg, svg');
      if (prevSvg) prevSvg.style.display = 'none';
    }
    if (nextBtn) {
      nextBtn.style.color = 'transparent';
      var nextSvg = nextBtn.querySelector('.fa-svg, svg');
      if (nextSvg) nextSvg.style.display = 'none';
    }

    var hasPrev = !!prevBtn;

    var navContainer = document.getElementById('wgw-nav-' + type);
    if (!navContainer) {
      navContainer = document.createElement('div');
      navContainer.id = 'wgw-nav-' + type;
      navContainer.className = 'wgw-nav-container';
      document.body.appendChild(navContainer);
    }

    navContainer.innerHTML = '';

    if (hasPrev) {
      navContainer.innerHTML = '<span class="wgw-nav-bracket">[</span><a class="wgw-nav-arrow wgw-nav-prev" href="' + (prevBtn ? prevBtn.href : '#') + '"><</a><span class="wgw-nav-slash">/</span><a class="wgw-nav-arrow wgw-nav-next" href="' + (nextBtn ? nextBtn.href : '#') + '">></a><span class="wgw-nav-bracket">]</span>';
    } else {
      navContainer.innerHTML = '<span class="wgw-nav-bracket">[</span><span class="wgw-nav-disabled">x</span><span class="wgw-nav-slash">/</span><a class="wgw-nav-arrow wgw-nav-next" href="' + (nextBtn ? nextBtn.href : '#') + '">></a><span class="wgw-nav-bracket">]</span>';
    }
  }

  // 分割线
  function initDivider() {
    if (dividerContainer) {
      return;
    }

    var sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width').trim() || '300px';
    var charHeight = 20;
    var singleTextHeight = DIVIDER_TEXT.length * charHeight;
    var totalHeight = singleTextHeight * DIVIDER_REPEAT;

    dividerContainer = document.createElement('div');
    dividerContainer.id = 'wgw-divider';
    dividerContainer.style.cssText = 'position:fixed;top:0;left:' + sidebarWidth + ';transform:translateX(-50%);width:1em;height:' + (totalHeight * 2) + 'px;overflow:hidden;pointer-events:none;user-select:none;z-index:0;font-size:20px;line-height:1;color:rgba(255,255,255,0.22);font-family:zpix,sans-serif;white-space:pre;';
    document.body.appendChild(dividerContainer);

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

  // 代码块和搜索框边框
  function initBorders() {
    if (bordersInitialized) {
      return;
    }

    // 代码块边框
    var codeBlocks = document.querySelectorAll('html.wgw-theme pre');
    codeBlocks.forEach(function(pre) {
      if (pre.querySelector('.wgw-code-border')) {
        return;
      }
      createCodeBlockBorder(pre);
    });

    // 搜索框边框
    var searchWrapper = document.querySelector('html.wgw-theme .search-wrapper');
    if (searchWrapper && !searchWrapper.querySelector('.wgw-search-border')) {
      createSearchBorder(searchWrapper);
    }

    bordersInitialized = true;
  }

  function createCodeBlockBorder(pre) {
    var borderContainer = document.createElement('div');
    borderContainer.className = 'wgw-code-border';
    borderContainer.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:1;';

    var borderSize = BORDER_FONT_SIZE + CODE_SIDE_PADDING;
    var topText = repeatText(CODE_BORDER_TEXT, 50);
    var sideText = CODE_BORDER_TEXT.split('').join('\n') + '\n';
    var sideRepeat = Math.ceil(pre.offsetHeight / (BORDER_FONT_SIZE * 1.2)) + 10;
    var sideTextFull = repeatText(sideText, sideRepeat);

    // 顶部
    var topBorder = document.createElement('div');
    topBorder.style.cssText = 'position:absolute;top:0;left:0;right:0;height:' + borderSize + 'px;font-size:' + BORDER_FONT_SIZE + 'px;line-height:1;color:#fff;white-space:nowrap;overflow:hidden;font-family:zpix,sans-serif;';
    topBorder.textContent = topText;
    borderContainer.appendChild(topBorder);

    // 底部
    var bottomBorder = document.createElement('div');
    bottomBorder.style.cssText = 'position:absolute;bottom:0;left:0;right:0;height:' + borderSize + 'px;font-size:' + BORDER_FONT_SIZE + 'px;line-height:1;color:#fff;white-space:nowrap;overflow:hidden;font-family:zpix,sans-serif;';
    bottomBorder.textContent = topText;
    borderContainer.appendChild(bottomBorder);

    // 左侧
    var leftBorder = document.createElement('div');
    leftBorder.style.cssText = 'position:absolute;top:0;left:0;bottom:0;width:' + borderSize + 'px;font-size:' + BORDER_FONT_SIZE + 'px;line-height:1;color:#fff;white-space:pre;overflow:hidden;font-family:zpix,sans-serif;';
    leftBorder.textContent = sideTextFull;
    borderContainer.appendChild(leftBorder);

    // 右侧
    var rightBorder = document.createElement('div');
    rightBorder.style.cssText = 'position:absolute;top:0;right:0;bottom:0;width:' + borderSize + 'px;font-size:' + BORDER_FONT_SIZE + 'px;line-height:1;color:#fff;white-space:pre;overflow:hidden;font-family:zpix,sans-serif;';
    rightBorder.textContent = sideTextFull;
    borderContainer.appendChild(rightBorder);

    pre.style.position = 'relative';
    pre.appendChild(borderContainer);
  }

  function createSearchBorder(wrapper) {
    var borderContainer = document.createElement('div');
    borderContainer.className = 'wgw-search-border';
    borderContainer.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:1;';

    var borderSize = BORDER_FONT_SIZE;
    var topText = repeatText(SEARCH_BORDER_TEXT, 30);
    var sideText = SEARCH_BORDER_TEXT.split('').join('\n') + '\n';
    var sideRepeat = 20;
    var sideTextFull = repeatText(sideText, sideRepeat);

    // 顶部
    var topBorder = document.createElement('div');
    topBorder.style.cssText = 'position:absolute;top:0;left:0;right:0;height:' + borderSize + 'px;font-size:' + BORDER_FONT_SIZE + 'px;line-height:1;color:#fff;white-space:nowrap;overflow:hidden;font-family:zpix,sans-serif;';
    topBorder.textContent = topText;
    borderContainer.appendChild(topBorder);

    // 底部
    var bottomBorder = document.createElement('div');
    bottomBorder.style.cssText = 'position:absolute;bottom:0;left:0;right:0;height:' + borderSize + 'px;font-size:' + BORDER_FONT_SIZE + 'px;line-height:1;color:#fff;white-space:nowrap;overflow:hidden;font-family:zpix,sans-serif;';
    bottomBorder.textContent = topText;
    borderContainer.appendChild(bottomBorder);

    // 左侧
    var leftBorder = document.createElement('div');
    leftBorder.style.cssText = 'position:absolute;top:0;left:0;bottom:0;width:' + borderSize + 'px;font-size:' + BORDER_FONT_SIZE + 'px;line-height:1;color:#fff;white-space:pre;overflow:hidden;font-family:zpix,sans-serif;';
    leftBorder.textContent = sideTextFull;
    borderContainer.appendChild(leftBorder);

    // 右侧
    var rightBorder = document.createElement('div');
    rightBorder.style.cssText = 'position:absolute;top:0;right:0;bottom:0;width:' + borderSize + 'px;font-size:' + BORDER_FONT_SIZE + 'px;line-height:1;color:#fff;white-space:pre;overflow:hidden;font-family:zpix,sans-serif;';
    rightBorder.textContent = sideTextFull;
    borderContainer.appendChild(rightBorder);

    wrapper.style.position = 'relative';
    wrapper.appendChild(borderContainer);
  }

  function repeatText(text, count) {
    var result = '';
    for (var i = 0; i < count; i++) {
      result += text;
    }
    return result;
  }

  // 修复侧边栏间距和滚动
  function fixSidebarSpacing() {
    var sidebar = document.querySelector('html.wgw-theme .sidebar');
    var scrollbox = document.querySelector('html.wgw-theme .sidebar-scrollbox');
    var chapter = document.querySelector('html.wgw-theme .sidebar .chapter');

    if (sidebar) {
      sidebar.style.borderRight = '0';
    }

    if (scrollbox) {
      scrollbox.style.overflowY = 'auto';
      scrollbox.style.scrollbarWidth = 'thin';
      scrollbox.style.scrollbarColor = 'rgba(255, 255, 255, 0.5) #000';
    }

    if (chapter) {
      chapter.style.listStyle = 'none';
      chapter.style.paddingLeft = '1em';
      chapter.style.marginLeft = '0.5em';
    }

    // 修复 part-title 间距
    var partTitles = document.querySelectorAll('html.wgw-theme .part-title');
    partTitles.forEach(function(el) {
      el.style.paddingLeft = '0.8em';
      el.style.marginLeft = '0';
    });
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavButtons);
  } else {
    renderNavButtons();
  }

  // 监听主题变化
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        renderNavButtons();
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });
})();
