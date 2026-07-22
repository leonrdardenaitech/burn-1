import os, subprocess
import imageio_ffmpeg

print('\n[ATLAS CORE - FORGE] Initializing Studio Weld & Crop Protocol...')
exe = imageio_ffmpeg.get_ffmpeg_exe()

# The staging ground for your raw studio clips
d_weld = 'C:/Users/Leonr/Downloads2/AGY_New_Team_HQ/Team3_Breakroom/thisoneKael/weldLobby'

v1 = os.path.join(d_weld, 'studio1111.mp4').replace('\\', '/')
v2 = os.path.join(d_weld, 'studio2222.mp4').replace('\\', '/')
v3 = os.path.join(d_weld, 'studio333.mp4').replace('\\', '/')

out_clean = os.path.join(d_weld, 'studio_master_clean.mp4').replace('\\', '/')
list_txt = os.path.join(d_weld, 'studio_list.txt').replace('\\', '/')

# Build the concatenation manifest in order 1, 2, 3
with open(list_txt, 'w') as f:
    f.write(f"file '{v1}'\n")
    f.write(f"file '{v2}'\n")
    f.write(f"file '{v3}'\n")

print('[ATLAS CORE] Welding clips 1, 2, and 3. Applying scale and watermark crop...')

# Slicing the native watermark and recalculating frames to prevent visual freezing
res = subprocess.run([
    exe, '-y', '-f', 'concat', '-safe', '0', '-i', list_txt,
    '-vf', 'scale=1920:1080,crop=iw:ih-100:0:0',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
    out_clean
], capture_output=True, text=True)

if res.returncode == 0:
    print(f'\n[ATLAS CORE] SUCCESS: Studio Master forged at {out_clean}')
    os.startfile(d_weld)
else:
    print(f'\n[ERROR] Weld Failed: {res.stderr}')