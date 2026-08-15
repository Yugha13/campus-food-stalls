from PIL import Image

def upscale(input_path, output_path, scale_factor=2):
    try:
        img = Image.open(input_path)
        new_size = (int(img.width * scale_factor), int(img.height * scale_factor))
        # Use LANCZOS for high-quality downsampling/upsampling
        upscaled_img = img.resize(new_size, Image.Resampling.LANCZOS)
        upscaled_img.save(output_path, quality=100)
        print(f"Successfully upscaled to {new_size}")
    except Exception as e:
        print(f"Error: {e}")

upscale('apps/mobile/public/lpu.png', 'apps/mobile/public/lpu.png', 2.5)
