'use strict';

(function() {
    // === КОНФИГУРАЦИЯ И СОСТОЯНИЕ ===
    const CONFIG = {
        drawDelay: 50, // мс между кликами
    };

    let state = {
        tool: null, // 'arc', 'entrance', 'centerSegment', 'centerCircle'
        points: []
    };

    // Используем существующую систему уведомлений
    function showError(msg) {
        if (window.appChrome && window.appChrome.notification) {
            window.appChrome.notification('error', msg);
        } else {
            alert(msg); // Fallback
        }
    }

    function showInfo(msg) {
        if (window.appChrome && window.appChrome.notification) {
            window.appChrome.notification('info', msg);
        }
    }

    // === МАТЕМАТИЧЕСКИЕ ФУНКЦИИ ===

    function getDistance(p1, p2) {
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    function getMidPoint(p1, p2) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
    }

    function getCircleCenter(p1, p2, p3) {
        let x1 = p1.x, y1 = p1.y;
        let x2 = p2.x, y2 = p2.y;
        let x3 = p3.x, y3 = p3.y;

        let D = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
        if (D === 0) return null;

        let Ux = ((x1**2 + y1**2) * (y2 - y3) + (x2**2 + y2**2) * (y3 - y1) + (x3**2 + y3**2) * (y1 - y2)) / D;
        let Uy = ((x1**2 + y1**2) * (x3 - x2) + (x2**2 + y2**2) * (x1 - x3) + (x3**2 + y3**2) * (x2 - x1)) / D;

        return { x: Ux, y: Uy };
    }

    function normalizeAngle(angle) {
        let a = angle % (2 * Math.PI);
        return a < 0 ? a + 2 * Math.PI : a;
    }

    function getArcPoints(p1, p2, p3, steps = 20) {
        const center = getCircleCenter(p1, p2, p3);

        if (!center) {
            let pts = [];
            for (let i = 0; i <= steps; i++) {
                let t = i / steps;
                pts.push({
                    x: p1.x + (p3.x - p1.x) * t,
                    y: p1.y + (p3.y - p1.y) * t
                });
            }
            return pts;
        }

        const radius = getDistance(center, p1);
        const a1 = Math.atan2(p1.y - center.y, p1.x - center.x);
        const a2 = Math.atan2(p2.y - center.y, p2.x - center.x);
        const a3 = Math.atan2(p3.y - center.y, p3.x - center.x);
        const ang1 = normalizeAngle(a1);
        const ang2 = normalizeAngle(a2);
        const ang3 = normalizeAngle(a3);
        const dist_1_2 = (ang2 - ang1 + 2 * Math.PI) % (2 * Math.PI);
        const dist_1_3 = (ang3 - ang1 + 2 * Math.PI) % (2 * Math.PI);
        const isCCW = dist_1_2 < dist_1_3;
        let points = [];
        let totalAngle;

        if (isCCW) {
            totalAngle = dist_1_3;
        } else {
            totalAngle = dist_1_3 - 2 * Math.PI;
        }

        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            let currentTheta = a1 + (totalAngle * t);
            points.push({
                x: center.x + radius * Math.cos(currentTheta),
                y: center.y + radius * Math.sin(currentTheta)
            });
        }
        return points;
    }

    // Используем существующую функцию симуляции клика
    function simulateClick(x, y) {
        if (window.appChrome && window.appChrome.simulateClickByPoint) {
            window.appChrome.simulateClickByPoint(x, y);
        }
    }

    function simulateHover(x, y) {
        let el = document.elementFromPoint(x, y);
        if (el) {
             el.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true, cancelable: true, clientX: x, clientY: y
            }));
        }
    }

    function resetState() {
        if (state.tool) showInfo("Инструмент сброшен");
        state.tool = null;
        state.points = [];
    }

    // === ИНСТРУМЕНТЫ ===
    function toolCenterSegment() {
        if (state.points.length < 2) return;
        let center = getMidPoint(state.points[0], state.points[1]);
        simulateHover(center.x, center.y);
        showInfo("Курсор наведен на центр");
        resetState();
    }

    function toolCenterCircle() {
        if (state.points.length < 3) return;
        let center = getCircleCenter(state.points[0], state.points[1], state.points[2]);
        if (center) {
            simulateHover(center.x, center.y);
            showInfo("Курсор наведен на центр окружности");
        } else {
            showError("Невозможно найти центр (точки на одной прямой)");
        }
        resetState();
    }

    function toolEntrances() {
        if (state.points.length < 2) return;
        let countStr = prompt("Разметка подъездов\nВведите количество подъездов:", "5");
        if (countStr === null) {
            resetState();
            return;
        }
        let n = parseInt(countStr);
        if (isNaN(n) || n < 1) {
            showError("Некорректное число");
            resetState();
            return;
        }
        let p1 = state.points[0];
        let p2 = state.points[1];
        let dx = (p2.x - p1.x) / (n - 1);
        let dy = (p2.y - p1.y) / (n - 1);
        if (n === 1) {
            simulateClick(p1.x, p1.y);
        } else {
            for (let i = 0; i < n; i++) {
                setTimeout(() => {
                    simulateClick(p1.x + dx * i, p1.y + dy * i);
                }, i * CONFIG.drawDelay);
            }
        }
        resetState();
    }

    function toolArc() {
        if (state.points.length < 3) return;
        let arcPoints = getArcPoints(state.points[0], state.points[1], state.points[2]);
        showInfo(`Рисуем ${arcPoints.length} узлов...`);
        arcPoints.forEach((pt, idx) => {
            setTimeout(() => {
                simulateClick(pt.x, pt.y);
            }, idx * CONFIG.drawDelay);
        });
        resetState();
    }

    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.code === 'Escape') {
            resetState();
            return;
        }
        if (e.altKey && !e.shiftKey && e.code === 'KeyC') {
            e.preventDefault();
            state.tool = 'centerSegment';
            state.points = [];
            showInfo("Инструмент: Центр отрезка. Кликните 2 точки.");
        }
        if (e.altKey && e.shiftKey && e.code === 'KeyC') {
            e.preventDefault();
            state.tool = 'centerCircle';
            state.points = [];
            showInfo("Инструмент: Центр окружности. Кликните 3 точки.");
        }
        if (e.altKey && !e.shiftKey && e.code === 'KeyE') {
            e.preventDefault();
            state.tool = 'entrance';
            state.points = [];
            showInfo("Инструмент: Подъезды. Кликните начало и конец.");
        }
        if (e.altKey && e.code === 'KeyD') {
            e.preventDefault();
            state.tool = 'arc';
            state.points = [];
            showInfo("Инструмент: Дуга по 3 точкам. (1:Старт, 2:Изгиб, 3:Финиш)");
        }
    });

    document.addEventListener('click', (e) => {
        if (!state.tool) return;
        state.points.push({ x: e.clientX, y: e.clientY });
        let required = 0;
        if (state.tool === 'centerSegment' || state.tool === 'entrance') required = 2;
        if (state.tool === 'centerCircle' || state.tool === 'arc') required = 3;
        if (state.points.length < required) {
            showInfo(`Точка ${state.points.length} / ${required}`);
        } else {
            switch(state.tool) {
                case 'centerSegment': toolCenterSegment(); break;
                case 'centerCircle': toolCenterCircle(); break;
                case 'entrance': toolEntrances(); break;
                case 'arc': toolArc(); break;
            }
        }
    }, true);
})();
