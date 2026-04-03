// WGW主题增强脚本
(function() {
  'use strict';

  // 配置
  var DIVIDER_TEXT = '文字游戏世界魔法书';
  var DIVIDER_REPEAT = 6;
  var SCROLL_SPEED = 0.5;

  var dividerContainer = null;
  var dividerItems = [];
  var lastTimestamp = 0;
  var navInitialized = false;
  var dividerInitialized = false;

  // 检查是否为WGW主题
  function isWgwTheme() {
    return document.documentElement.classList.contains('wgw-theme');
  }

  // 渲染导航按钮
  function renderNavButtons() {
    if (!isWgwTheme()) {
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

    if (mobilePrev) mobilePrev.style.display = '';
    if (mobileNext) mobileNext.style.display = '';
    if (desktopPrev) desktopPrev.style.display = '';
    if (desktopNext) desktopNext.style.display = '';
  }

  function hideOriginalNav() {
    var mobilePrev = document.querySelector('.mobile-nav-chapters.previous');
    var mobileNext = document.querySelector('.mobile-nav-chapters.next');
    var desktopPrev = document.querySelector('.nav-chapters.previous');
    var desktopNext = document.querySelector('.nav-chapters.next');

    if (mobilePrev) mobilePrev.style.display = 'none';
    if (mobileNext) mobileNext.style.display = 'none';
    if (desktopPrev) desktopPrev.style.display = 'none';
    if (desktopNext) desktopNext.style.display = 'none';
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

  // 初始化分割线
  function initDivider() {
    if (dividerInitialized) {
      return;
    }

    if (!isWgwTheme()) {
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

    if (dividerContainer) {
      dividerContainer.style.display = '';
      dividerInitialized = true;
      return;
    }

    var charHeight = 20;
    var singleTextHeight = DIVIDER_TEXT.length * charHeight;
    var totalHeight = singleTextHeight * DIVIDER_REPEAT;

    // 创建分割线容器
    dividerContainer = document.createElement('div');
    dividerContainer.id = 'wgw-divider';
    dividerContainer.style.cssText = 'position:absolute;top:0;left:50%;transform:translateX(-50%);width:1em;height:100vh;overflow:hidden;pointer-events:none;user-select:none;z-index:10;font-size:20px;line-height:1;color:rgba(255,255,255,0.5);font-family:zpix,sans-serif;white-space:pre;';
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
    var sidebar = document.querySelector('.sidebar');
    var scrollbox = document.querySelector('.sidebar-scrollbox');
    var chapter = document.querySelector('.sidebar .chapter');

    if (!isWgwTheme()) {
      if (sidebar) {
        sidebar.style.borderRight = '';
        sidebar.style.overflow = '';
        sidebar.style.paddingLeft = '';
      }
      if (scrollbox) {
        scrollbox.style.overflowY = '';
        scrollbox.style.overflowX = '';
        scrollbox.style.scrollbarWidth = '';
        scrollbox.style.scrollbarColor = '';
        scrollbox.style.height = '';
        scrollbox.style.display = '';
        scrollbox.style.maxHeight = '';
      }
      if (chapter) {
        chapter.style.listStyle = '';
        chapter.style.paddingLeft = '';
        chapter.style.marginLeft = '';
      }
      return;
    }

    if (sidebar) {
      sidebar.style.borderRight = '0';
      sidebar.style.overflow = 'visible';
      sidebar.style.paddingLeft = '1em';
    }

    if (scrollbox) {
      scrollbox.style.overflowY = 'auto';
      scrollbox.style.overflowX = 'hidden';
      scrollbox.style.scrollbarWidth = 'none';
      scrollbox.style.scrollbarColor = '';
      scrollbox.style.height = '100%';
      scrollbox.style.display = 'block';
      scrollbox.style.maxHeight = '';
    }

    if (chapter) {
      chapter.style.listStyle = 'none';
      chapter.style.paddingLeft = '1em';
      chapter.style.marginLeft = '0.5em';
    }
  }

  // 语法高亮：处理事件指令格式（JSON变种）
  function highlightEventSyntax(codeElement) {
    var text = codeElement.textContent;
    
    // 高亮规则：
    // 1. @[event_name] - 事件名称（黄色）
    // 2. "key": - 属性名（蓝色）
    // 3. "value" - 字符串值（绿色）
    // 4. 123, true, false, null - 数字和字面量（橙色）
    // 5. # comment - 注释（灰色）
    
    var highlighted = text
      // 注释（必须先处理，避免被其他规则覆盖）
      .replace(/(#[^\n]*)/g, '<span class="hljs-comment">$1</span>')
      // 事件名称 @[event_name]
      .replace(/@\[([^\]]+)\]/g, '<span class="hljs-meta">@[$1]</span>')
      // 属性名 "key":
      .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="hljs-attr">$1</span>$2')
      // 字符串值（不在属性名位置的）
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="hljs-string">$1</span>')
      // 数组/对象中的字符串
      .replace(/\[\s*("(?:[^"\\]|\\.)*")/g, '[<span class="hljs-string">$1</span>')
      .replace(/,\s*("(?:[^"\\]|\\.)*")/g, ', <span class="hljs-string">$1</span>')
      // 数字
      .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="hljs-number">$1</span>')
      .replace(/\[\s*(-?\d+\.?\d*)/g, '[<span class="hljs-number">$1</span>')
      .replace(/,\s*(-?\d+\.?\d*)/g, ', <span class="hljs-number">$1</span>')
      // 布尔值和null
      .replace(/:\s*(true|false|null)\b/g, ': <span class="hljs-literal">$1</span>')
      .replace(/\[\s*(true|false|null)\b/g, '[<span class="hljs-literal">$1</span>')
      .replace(/,\s*(true|false|null)\b/g, ', <span class="hljs-literal">$1</span>');
    
    codeElement.innerHTML = highlighted;
  }

  // 初始化代码高亮
  function initCodeHighlight() {
    // 处理所有未指定语言的代码块和JSON代码块
    var codeBlocks = document.querySelectorAll('pre code:not([class*="language-"]), pre code.language-json');
    
    codeBlocks.forEach(function(codeElement) {
      // 避免重复处理
      if (codeElement.dataset.wgwHighlighted === 'true') {
        return;
      }
      
      codeElement.dataset.wgwHighlighted = 'true';
      highlightEventSyntax(codeElement);
    });
  }

  // 初始化复制按钮
  function initCopyButtons() {
    var buttons = document.querySelectorAll('pre .clip-button');

    buttons.forEach(function(button) {
      if (!button.dataset.wgwOriginalTitle) {
        button.dataset.wgwOriginalTitle = button.getAttribute('title') || '';
      }
      if (!button.dataset.wgwOriginalAriaLabel) {
        button.dataset.wgwOriginalAriaLabel = button.getAttribute('aria-label') || '';
      }

      if (!isWgwTheme()) {
        button.removeAttribute('data-label');
        button.removeAttribute('data-copied');
        if (button._wgwCopyResetTimer) {
          clearTimeout(button._wgwCopyResetTimer);
          button._wgwCopyResetTimer = null;
        }
        button.setAttribute('title', button.dataset.wgwOriginalTitle);
        button.setAttribute('aria-label', button.dataset.wgwOriginalAriaLabel);
        return;
      }

      button.dataset.label = button.dataset.copied === 'true' ? '√已复制' : '复制';
      button.setAttribute('title', button.dataset.label);
      button.setAttribute('aria-label', button.dataset.label);

      if (button.dataset.wgwBound === 'true') {
        return;
      }

      button.dataset.wgwBound = 'true';
      button.addEventListener('click', function() {
        if (!isWgwTheme()) {
          return;
        }

        button.dataset.copied = 'true';
        button.dataset.label = '√已复制';
        button.setAttribute('title', '√已复制');
        button.setAttribute('aria-label', '√已复制');

        if (button._wgwCopyResetTimer) {
          clearTimeout(button._wgwCopyResetTimer);
        }

        button._wgwCopyResetTimer = setTimeout(function() {
          button.dataset.copied = 'false';
          if (isWgwTheme()) {
            button.dataset.label = '复制';
            button.setAttribute('title', '复制');
            button.setAttribute('aria-label', '复制');
          } else {
            button.removeAttribute('data-label');
            button.setAttribute('title', button.dataset.wgwOriginalTitle);
            button.setAttribute('aria-label', button.dataset.wgwOriginalAriaLabel);
          }
        }, 1400);
      });
    });
  }

  // 主题变化处理
  function onThemeChange() {
    navInitialized = false;
    renderNavButtons();
    initDivider();
    fixSidebarSpacing();
    initCopyButtons();
    initCodeHighlight();
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      renderNavButtons();
      initDivider();
      fixSidebarSpacing();
      initCopyButtons();
      initCodeHighlight();
    });
  } else {
    renderNavButtons();
    initDivider();
    fixSidebarSpacing();
    initCopyButtons();
    initCodeHighlight();
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
