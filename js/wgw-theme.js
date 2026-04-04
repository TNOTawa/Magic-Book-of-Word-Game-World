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
    
    // 使用更精确的逐行处理方式
    var lines = text.split('\n');
    var highlighted = lines.map(function(line) {
      // 跳过空行
      if (!line.trim()) {
        return line;
      }
      
      var result = line;
      var hasEventTag = /@\[/.test(line);
      
      // 1. 处理双井号注释 ## 和单井号注释 #（但要避免事件名和字符串内的 #）
      if (!hasEventTag && /^\s*##/.test(line)) {
        // 整行双井号注释
        return '<span class="hljs-comment">' + line + '</span>';
      }
      
      // 2. 先处理事件名称 @[event_name]（包括 @[#raw_commend] 这种情况）
      if (hasEventTag) {
        result = result.replace(/@\[([^\]]+)\]/g, '<span class="hljs-meta">@[$1]</span>');
      }
      
      // 3. 处理单井号注释（整行或行尾，但要避免字符串内的 #）
      if (!hasEventTag && /^\s*#[^#]/.test(line)) {
        return '<span class="hljs-comment">' + line + '</span>';
      }
      
      // 4. 处理 @[event] "string" 或 @[event] true 这种单参数格式
      result = result.replace(/<span class="hljs-meta">@\[([^\]]+)\]<\/span>(\s+)("([^"\\]|\\.)*")/g, function(match, event, sp, str) {
        return '<span class="hljs-meta">@[' + event + ']</span>' + sp + '<span class="hljs-string">' + str + '</span>';
      });
      result = result.replace(/<span class="hljs-meta">@\[([^\]]+)\]<\/span>(\s+)(true|false|null)\b/g, function(match, event, sp, literal) {
        return '<span class="hljs-meta">@[' + event + ']</span>' + sp + '<span class="hljs-literal">' + literal + '</span>';
      });
      result = result.replace(/<span class="hljs-meta">@\[([^\]]+)\]<\/span>(\s+)(-?\d+\.?\d*)/g, function(match, event, sp, num) {
        return '<span class="hljs-meta">@[' + event + ']</span>' + sp + '<span class="hljs-number">' + num + '</span>';
      });
      
      // 5. 处理 "key": value 格式（包括变量引用 "v:xxx" 和开关 "s:xxx"）
      result = result.replace(/("([^"\\]|\\.)*")(\s*)(:)(\s*)("([^"\\]|\\.)*")/g, function(match, key, k1, sp1, colon, sp2, value) {
        return '<span class="hljs-attr">' + key + '</span>' + sp1 + colon + sp2 + '<span class="hljs-string">' + value + '</span>';
      });
      
      // 6. 处理 "key": 数字
      result = result.replace(/("([^"\\]|\\.)*")(\s*)(:)(\s*)(-?\d+\.?\d*)/g, function(match, key, k1, sp1, colon, sp2, num) {
        return '<span class="hljs-attr">' + key + '</span>' + sp1 + colon + sp2 + '<span class="hljs-number">' + num + '</span>';
      });
      
      // 7. 处理 "key": true/false/null
      result = result.replace(/("([^"\\]|\\.)*")(\s*)(:)(\s*)(true|false|null)\b/g, function(match, key, k1, sp1, colon, sp2, literal) {
        return '<span class="hljs-attr">' + key + '</span>' + sp1 + colon + sp2 + '<span class="hljs-literal">' + literal + '</span>';
      });
      
      // 8. 处理数组中的字符串（包括变量引用）
      result = result.replace(/\[(\s*)("([^"\\]|\\.)*")/g, function(match, sp, str) {
        return '[' + sp + '<span class="hljs-string">' + str + '</span>';
      });
      result = result.replace(/,(\s*)("([^"\\]|\\.)*")/g, function(match, sp, str) {
        return ',' + sp + '<span class="hljs-string">' + str + '</span>';
      });
      
      // 9. 处理数组中的数字
      result = result.replace(/\[(\s*)(-?\d+\.?\d*)/g, function(match, sp, num) {
        return '[' + sp + '<span class="hljs-number">' + num + '</span>';
      });
      result = result.replace(/,(\s*)(-?\d+\.?\d*)(?=\s*[,\]])/g, function(match, sp, num) {
        return ',' + sp + '<span class="hljs-number">' + num + '</span>';
      });
      
      // 10. 处理数组中的 null/true/false
      result = result.replace(/\[(\s*)(true|false|null)\b/g, function(match, sp, literal) {
        return '[' + sp + '<span class="hljs-literal">' + literal + '</span>';
      });
      result = result.replace(/,(\s*)(true|false|null)\b/g, function(match, sp, literal) {
        return ',' + sp + '<span class="hljs-literal">' + literal + '</span>';
      });
      
      // 11. 处理裸变量名（不带引号的标识符，如 [X, Y]）
      // 只在数组上下文中处理，避免误匹配
      result = result.replace(/\[(\s*)([A-Za-z_]\w*)/g, function(match, sp, varName) {
        return '[' + sp + '<span class="hljs-name">' + varName + '</span>';
      });
      result = result.replace(/,(\s*)([A-Za-z_]\w*)(?=\s*[,\]])/g, function(match, sp, varName) {
        return ',' + sp + '<span class="hljs-name">' + varName + '</span>';
      });
      
      return result;
    }).join('\n');
    
    codeElement.innerHTML = highlighted;
  }

  // 初始化代码块边框
  function initCodeBlockBorders() {
    if (!isWgwTheme()) {
      // 移除所有边框元素
      document.querySelectorAll('.wgw-code-border').forEach(function(el) {
        el.remove();
      });
      return;
    }

    var preBlocks = document.querySelectorAll('pre');
    
    preBlocks.forEach(function(pre) {
      // 避免重复处理
      if (pre.dataset.wgwBorderInit === 'true') {
        return;
      }
      
      pre.dataset.wgwBorderInit = 'true';
      
      // 创建边框容器
      var borderTop = document.createElement('div');
      borderTop.className = 'wgw-code-border wgw-code-border-top';
      borderTop.textContent = '代码块'.repeat(40);
      
      var borderBottom = document.createElement('div');
      borderBottom.className = 'wgw-code-border wgw-code-border-bottom';
      borderBottom.textContent = '代码块'.repeat(40);
      
      var borderLeft = document.createElement('div');
      borderLeft.className = 'wgw-code-border wgw-code-border-left';
      
      var borderRight = document.createElement('div');
      borderRight.className = 'wgw-code-border wgw-code-border-right';
      
      // 插入边框
      pre.insertBefore(borderTop, pre.firstChild);
      pre.insertBefore(borderBottom, null);
      pre.insertBefore(borderLeft, pre.firstChild);
      pre.insertBefore(borderRight, null);
      
      // 动态计算左右边框高度
      function updateVerticalBorders() {
        var height = pre.offsetHeight;
        var borderSize = 10; // --wgw-border-font-size
        var lineHeight = borderSize;
        var repeatCount = Math.ceil((height - borderSize * 2) / lineHeight) + 5; // 额外添加5行确保覆盖
        
        var verticalText = '';
        for (var i = 0; i < repeatCount; i++) {
          verticalText += '代\n码\n块\n';
        }
        
        borderLeft.textContent = verticalText;
        borderRight.textContent = verticalText;
      }
      
      // 初始化
      updateVerticalBorders();
      
      // 监听尺寸变化
      if (typeof ResizeObserver !== 'undefined') {
        var resizeObserver = new ResizeObserver(function() {
          updateVerticalBorders();
        });
        resizeObserver.observe(pre);
      }
    });
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
    initCodeBlockBorders();
    initCodeHighlight();
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      renderNavButtons();
      initDivider();
      fixSidebarSpacing();
      initCopyButtons();
      initCodeBlockBorders();
      initCodeHighlight();
    });
  } else {
    renderNavButtons();
    initDivider();
    fixSidebarSpacing();
    initCopyButtons();
    initCodeBlockBorders();
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
