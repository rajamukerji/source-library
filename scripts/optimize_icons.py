from pathlib import Path
from PIL import Image

BASE = Path("/home/ubuntu/source-library/assets/images")
TARGETS = [
    ("icon.png", (1024, 1024)),
    ("splash-icon.png", (1024, 1024)),
    ("favicon.png", (512, 512)),
    ("android-icon-foreground.png", (1024, 1024)),
]

for name, size in TARGETS:
    path = BASE / name
    image = Image.open(path).convert("RGBA")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    x = (size[0] - image.width) // 2
    y = (size[1] - image.height) // 2
    canvas.paste(image, (x, y), image)
    canvas.save(path, optimize=True)
    print(f"optimized {name}: {path.stat().st_size / 1024:.1f}KB")
