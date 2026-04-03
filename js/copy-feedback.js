// 复制按钮反馈功能
(function() {
  'use strict';

  // 等待DOM加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 查找所有复制按钮
    var clipButtons = document.querySelectorAll('.clip-button');
    
    clipButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        var btn = this;
        
        // 添加已复制类
        btn.classList.add('wgw-copied');
        
        // 1.5秒后恢复原状
        setTimeout(function() {
          btn.classList.remove('wgw-copied');
        }, 1500);
      });
    });
  });
})();
