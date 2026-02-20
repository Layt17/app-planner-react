import { useEffect, useState, useRef } from "react";

interface FloatingStar {
  id: number;
  x: number;
  y: number;
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  visible: boolean;
}

interface TextSparkle {
  id: number;
  x: number;
  y: number;
}

interface StarTrail {
  id: number;
  x: number;
  y: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
}

export const FloatingStarC = () => {
  const [star, setStar] = useState<FloatingStar | null>(null);
  const [textSparkles, setTextSparkles] = useState<TextSparkle[]>([]);
  const [trails, setTrails] = useState<StarTrail[]>([]);
  const [explosion, setExplosion] = useState<Explosion | null>(null);
  const starIdRef = useRef(0);
  const textIdRef = useRef(0);
  const trailIdRef = useRef(0);
  const starTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const starVanishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const trailIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const starRef = useRef<FloatingStar | null>(null);

  // Создаёт летающый текст "молодец!"
  const createTextSparkles = (startX: number, startY: number) => {
    // Находим элемент названия текущего дня
    const dayNameElement = document.querySelector(".today-name") as HTMLElement;
    let targetX = startX;
    let targetY = startY - 100;

    if (dayNameElement) {
      const rect = dayNameElement.getBoundingClientRect();
      // Поскольку текст позиционирован как fixed, используем viewport координаты
      // и учитываем что текст центрируется через transform-origin
      const textWidth = 60; // примерная ширина слова "молодец!"
      const textHeight = 20; // примерная высота текста
      targetX = rect.left + rect.width / 2 - textWidth / 2;
      targetY = rect.top + rect.height / 2 - textHeight / 2;
    }

    const newSparkles: Array<TextSparkle & { offsetX: number; offsetY: number }> = [];
    const numSparkles = 1; // Одно слово летит к названию дня

    for (let i = 0; i < numSparkles; i++) {
      // Смещение от стартовой позиции к целевой позиции
      const offsetX = targetX - startX;
      const offsetY = targetY - startY;

      newSparkles.push({
        id: textIdRef.current++,
        x: startX,
        y: startY,
        offsetX,
        offsetY,
      });
    }

    setTextSparkles((prev) => [...prev, ...newSparkles] as TextSparkle[]);

    // Применяем цветовое мерцание к названию дня когда текст попадает в него (на 50ms раньше)
    setTimeout(() => {
      if (dayNameElement) {
        dayNameElement.style.animation = "none";
        // Trigger reflow to restart animation
        void dayNameElement.offsetWidth;
        dayNameElement.style.animation = "dayNameGlow 0.6s ease-in-out forwards";
      }
    }, 950);

    // Удаляем текст после анимации
    setTimeout(() => {
      setTextSparkles((prev) =>
        prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id))
      );
      // Удаляем мерцание со стилей
      if (dayNameElement) {
        dayNameElement.style.animation = "";
      }
    }, 1650);
  };

  // Добавляет шлейф за звездой
  const addTrail = (x: number, y: number) => {
    setTrails((prev) => {
      const newTrail = { id: trailIdRef.current++, x, y };
      const updated = [...prev, newTrail];

      // Удаляем старые шлейфы (максимум 15)
      if (updated.length > 15) {
        return updated.slice(-15);
      }
      return updated;
    });
  };

  // Показывает новую звезду
  const showNewStar = () => {
    const newStarId = starIdRef.current++;

    // Выбираем сторону и координаты
    const side = Math.floor(Math.random() * 4);
    let startX, startY;

    const endX = Math.random() * (window.innerWidth - 40);
    const endY = Math.random() * (window.innerHeight - 40);

    switch (side) {
      case 0: // Сверху
        startX = Math.random() * window.innerWidth;
        startY = -40;
        break;
      case 1: // Снизу
        startX = Math.random() * window.innerWidth;
        startY = window.innerHeight;
        break;
      case 2: // Слева
        startX = -40;
        startY = Math.random() * window.innerHeight;
        break;
      case 3: // Справа
        startX = window.innerWidth;
        startY = Math.random() * window.innerHeight;
        break;
      default:
        startX = 0;
        startY = 0;
    }

    const newStar: FloatingStar = {
      id: newStarId,
      x: endX,
      y: endY,
      startX: `${startX}px`,
      startY: `${startY}px`,
      endX: `${endX}px`,
      endY: `${endY}px`,
      visible: true,
    };

    setStar(newStar);
    starRef.current = newStar;

    // Создаём шлейф во время полёта
    let progress = 0;
    if (trailIntervalRef.current) clearInterval(trailIntervalRef.current);

    trailIntervalRef.current = setInterval(() => {
      progress += 0.1;
      if (progress > 1) {
        if (trailIntervalRef.current) clearInterval(trailIntervalRef.current);
        return;
      }

      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;
      addTrail(currentX, currentY);
    }, 30);

    // Звезда исчезает через 5.6 сек (0.6s полёт + 5s стояния)
    starVanishTimeoutRef.current = setTimeout(() => {
      setStar((prev) =>
        prev && prev.id === newStarId ? { ...prev, visible: false } : prev
      );
    }, 5600);

    // Удаляем звезду из DOM через 5.9 сек (0.6s полёт + 5s стояния + 0.3s исчезновение)
    starTimeoutRef.current = setTimeout(() => {
      setStar((prev) => (prev && prev.id === newStarId ? null : prev));
    }, 5900);
  };

  // Обработчик клика на кораблик
  const handleStarClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (star && star.visible) {
      const explosionX = star.x + 20;
      const explosionY = star.y + 20;

      // Показываем взрыв
      const explosionId = Math.random();
      setExplosion({
        id: explosionId,
        x: explosionX,
        y: explosionY,
      });

      // Создаём текст из взрыва
      createTextSparkles(explosionX, explosionY);

      // Убираем взрыв через 1 сек
      setTimeout(() => {
        setExplosion(null);
      }, 1000);

      // Удаляем кораблик
      if (starTimeoutRef.current) clearTimeout(starTimeoutRef.current);
      if (starVanishTimeoutRef.current) clearTimeout(starVanishTimeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (trailIntervalRef.current) clearInterval(trailIntervalRef.current);
      setStar(null);
      starRef.current = null;

      // Перезапускаем интервал - новый кораблик появится через 10 сек
      intervalRef.current = setInterval(() => {
        showNewStar();
      }, 10000);
    }
  };

  // Запускаем интервал для появления звёзд каждые 10 секунд
  useEffect(() => {
    showNewStar();

    intervalRef.current = setInterval(() => {
      showNewStar();
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (starTimeoutRef.current) clearTimeout(starTimeoutRef.current);
      if (starVanishTimeoutRef.current) clearTimeout(starVanishTimeoutRef.current);
      if (trailIntervalRef.current) clearInterval(trailIntervalRef.current);
    };
  }, []);

  return (
    <>
      {star && (
        <button
          className={`floating-star ${star.visible ? "visible" : "hidden"}`}
          style={{
            left: "0",
            top: "0",
            "--startX": star.startX,
            "--startY": star.startY,
            "--endX": star.endX,
            "--endY": star.endY,
          } as React.CSSProperties}
          onClick={handleStarClick}
          onTouchEnd={handleStarClick}
        >
          ⛵
        </button>
      )}

      {explosion && (
        <div
          className="explosion"
          style={{
            left: `${explosion.x}px`,
            top: `${explosion.y}px`,
          }}
        >
          💥
        </div>
      )}

      {trails.map((trail) => (
        <div
          key={trail.id}
          className="star-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
          }}
        >
          ✨
        </div>
      ))}

      {textSparkles.map((sparkle: any) => {
        return (
          <div
            key={sparkle.id}
            className="text-sparkle"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              "--tx": `${sparkle.offsetX}px`,
              "--ty": `${sparkle.offsetY}px`,
            } as React.CSSProperties}
          >
            молодец!
          </div>
        );
      })}
    </>
  );
};
