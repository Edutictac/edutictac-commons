"""Limitador de peticiones en memoria (ventana deslizante por clave)."""
import threading
import time
from collections import defaultdict, deque


class RateLimiter:
    def __init__(self, max_calls: int, window_seconds: float):
        self.max_calls = max_calls
        self.window_seconds = window_seconds
        self._lock = threading.Lock()
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._last_sweep = time.monotonic()

    def _sweep(self, now: float) -> None:
        """Elimina claus sense hits dins la finestra perquè no creixen sense límit."""
        if now - self._last_sweep < self.window_seconds:
            return
        for key, queue in list(self._hits.items()):
            while queue and now - queue[0] > self.window_seconds:
                queue.popleft()
            if not queue:
                del self._hits[key]
        self._last_sweep = now

    def __call__(self, key: str) -> bool:
        """Devuelve True si la petición debe rechazarse (límite superado)."""
        now = time.monotonic()
        with self._lock:
            self._sweep(now)
            q = self._hits[key]
            while q and now - q[0] > self.window_seconds:
                q.popleft()
            if len(q) >= self.max_calls:
                return True
            q.append(now)
            return False
