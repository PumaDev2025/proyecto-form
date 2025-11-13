"""
Generador de Iconos para PWA
Este script genera todos los iconos necesarios para la aplicación PWA
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Crea un icono con el tamaño especificado"""
    
    # Crear imagen con fondo degradado
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Crear fondo con color sólido (azul oscuro)
    background_color = (44, 62, 80)  # #2c3e50
    draw.rectangle([(0, 0), (size, size)], fill=background_color)
    
    # Dibujar un círculo interno
    circle_color = (52, 152, 219)  # #3498db
    margin = size // 6
    circle_bbox = [(margin, margin), (size - margin, size - margin)]
    draw.ellipse(circle_bbox, fill=circle_color)
    
    # Agregar emoji/símbolo
    # Para un icono simple, dibujamos una marca de verificación
    check_color = (255, 255, 255)
    check_width = max(3, size // 40)
    
    # Puntos de la marca de verificación
    center_x = size // 2
    center_y = size // 2
    check_size = size // 4
    
    # Parte corta de la marca
    points1 = [
        (center_x - check_size//2, center_y),
        (center_x - check_size//4, center_y + check_size//2)
    ]
    draw.line(points1, fill=check_color, width=check_width)
    
    # Parte larga de la marca
    points2 = [
        (center_x - check_size//4, center_y + check_size//2),
        (center_x + check_size//2, center_y - check_size//3)
    ]
    draw.line(points2, fill=check_color, width=check_width)
    
    # Guardar imagen
    img.save(output_path, 'PNG', quality=100)
    print(f"✓ Icono creado: {output_path} ({size}x{size})")

def main():
    """Función principal para generar todos los iconos"""
    
    # Tamaños necesarios para PWA
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    print("Generando iconos para PWA...")
    print("-" * 50)
    
    for size in sizes:
        filename = f"icon-{size}.png"
        create_icon(size, filename)
    
    print("-" * 50)
    print(f"✓ {len(sizes)} iconos generados exitosamente")
    print("\nIconos creados:")
    for size in sizes:
        print(f"  - icon-{size}.png")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("ERROR: Se requiere la librería Pillow (PIL)")
        print("Instálala con: pip install Pillow")
        print("\nAlternativamente, puedes:")
        print("1. Crear los iconos manualmente usando cualquier editor de imágenes")
        print("2. Usar un generador online como: https://www.pwabuilder.com/imageGenerator")
        print("3. Usar tu logo de empresa existente")
        print("\nTamaños requeridos: 72, 96, 128, 144, 152, 192, 384, 512 píxeles")
