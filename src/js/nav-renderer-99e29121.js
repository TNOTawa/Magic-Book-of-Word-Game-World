// WGW主题导航渲染脚本
// 用于重新渲染 [ < / > ] 导航按钮

(function() {
  'use strict';

  function renderNavButtons() {
    if (!document.documentElement.classList.contains('wgw-theme')) {
      return;
    }

    // 获取所有导航按钮
    var mobilePrev = document.querySelector('.mobile-nav-chapters.previous');
    var mobileNext = document.querySelector('.mobile-nav-chapters.next');
    var desktopPrev = document.querySelector('.nav-chapters.previous');
    var desktopNext = document.querySelector('.nav-chapters.next');

    // 检查是否存在导航按钮
    var hasMobile = mobilePrev || mobileNext;
    var hasDesktop = desktopPrev || desktopNext;

    // 渲染移动端导航
    if (hasMobile) {
      renderNavPair(mobilePrev, mobileNext, 'mobile');
    }

    // 渲染桌面端导航
    if (hasDesktop) {
      renderNavPair(desktopPrev, desktopNext, 'desktop');
    }
  }

  function renderNavPair(prevBtn, nextBtn, type) {
    // 隐藏原始按钮内容
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

    // 检查是否有上一页（判断是否为首页）
    var hasPrev = !!prevBtn;

    // 创建或更新导航容器
    var navContainer = document.getElementById('wgw-nav-' + type);
    if (!navContainer) {
      navContainer = document.createElement('div');
      navContainer.id = 'wgw-nav-' + type;
      navContainer.className = 'wgw-nav-container';
      document.body.appendChild(navContainer);
    }

    // 清空现有内容
    navContainer.innerHTML = '';

    if (hasPrev) {
      // 有上一页：显示 [ < / > ]
      navContainer.innerHTML = '<span class="wgw-nav-bracket">[</span><a class="wgw-nav-arrow wgw-nav-prev" href="' + (prevBtn ? prevBtn.href : '#') + '"><</a><span class="wgw-nav-slash">/</span><a class="wgw-nav-arrow wgw-nav-next" href="' + (nextBtn ? nextBtn.href : '#') + '">></a><span class="wgw-nav-bracket">]</span>';
    } else {
      // 首页：显示 [ x / > ]
      navContainer.innerHTML = '<span class="wgw-nav-bracket">[</span><span class="wgw-nav-disabled">x</span><span class="wgw-nav-slash">/</span><a class="wgw-nav-arrow wgw-nav-next" href="' + (nextBtn ? nextBtn.href : '#') + '">></a><span class="wgw-nav-bracket">]</span>';
    }
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
