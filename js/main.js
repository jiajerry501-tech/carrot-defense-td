(function () {
    'use strict';

    let game = null;

    function init() {
        if (game) return;

        try {
            game = new Game();
            window.__game = game;
            console.log('[Main] 游戏加载完成 - 选择关卡开始');
        } catch (err) {
            console.error('[Main] 初始化失败:', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
