from PIL import Image
import sys

def make_transparent(input_path, output_path, thresh=30):
    im = Image.open(input_path).convert('RGBA')
    pixels = im.load()
    w,h = im.size
    for y in range(h):
        for x in range(w):
            r,g,b,a = pixels[x,y]
            if r <= thresh and g <= thresh and b <= thresh:
                pixels[x,y] = (r,g,b,0)
    im.save(output_path)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: make_transparent.py input.png output.png')
    else:
        make_transparent(sys.argv[1], sys.argv[2])
        print('Saved', sys.argv[2])
