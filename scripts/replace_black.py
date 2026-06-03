from PIL import Image
import sys

# Usage: python replace_black.py input.png output.png
# Replaces near-black pixels with #0f0f0f (15,15,15)

def replace_black(input_path, output_path, thresh=30, target=(15,15,15)):
    im = Image.open(input_path).convert('RGBA')
    pixels = im.load()
    w,h = im.size
    for y in range(h):
        for x in range(w):
            r,g,b,a = pixels[x,y]
            # consider near-black if all channels <= thresh
            if r <= thresh and g <= thresh and b <= thresh:
                pixels[x,y] = (target[0], target[1], target[2], a)
    im.save(output_path)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: replace_black.py input.png output.png')
    else:
        replace_black(sys.argv[1], sys.argv[2])
        print('Saved', sys.argv[2])
