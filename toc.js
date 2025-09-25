// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="首页.html"><strong aria-hidden="true">1.</strong> 首页</a></li><li class="chapter-item expanded affix "><li class="part-title">事件</li><li class="chapter-item expanded "><a href="events/物件操作.html"><strong aria-hidden="true">2.</strong> 物件操作</a></li><li class="chapter-item expanded "><a href="events/打字机.html"><strong aria-hidden="true">3.</strong> 打字机</a></li><li class="chapter-item expanded "><a href="events/能力设定.html"><strong aria-hidden="true">4.</strong> 能力设定</a></li><li class="chapter-item expanded "><a href="events/游戏机制.html"><strong aria-hidden="true">5.</strong> 游戏机制</a></li><li class="chapter-item expanded "><a href="events/点唱机.html"><strong aria-hidden="true">6.</strong> 点唱机</a></li><li class="chapter-item expanded "><a href="events/镜头.html"><strong aria-hidden="true">7.</strong> 镜头</a></li><li class="chapter-item expanded "><a href="events/提示.html"><strong aria-hidden="true">8.</strong> 提示</a></li><li class="chapter-item expanded "><a href="events/系统.html"><strong aria-hidden="true">9.</strong> 系统</a></li><li class="chapter-item expanded "><a href="events/代数.html"><strong aria-hidden="true">10.</strong> 代数</a></li><li class="chapter-item expanded "><a href="events/条件.html"><strong aria-hidden="true">11.</strong> 条件</a></li><li class="chapter-item expanded "><a href="events/备注.html"><strong aria-hidden="true">12.</strong> 备注</a></li><li class="chapter-item expanded "><a href="events/特殊指令.html"><strong aria-hidden="true">13.</strong> 特殊指令</a></li><li class="chapter-item expanded affix "><li class="part-title">特殊写法</li><li class="chapter-item expanded "><a href="special/如何将变量代入参数.html"><strong aria-hidden="true">14.</strong> 如何将变量代入参数</a></li><li class="chapter-item expanded "><a href="special/打字机的高级用法.html"><strong aria-hidden="true">15.</strong> 打字机的高级用法</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
