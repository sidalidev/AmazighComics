"""
Script de génération des panels EP01 via ComfyUI API
Lance ComfyUI d'abord : python3 ~/Dev/ComfyUI/main.py
Puis lance ce script : python3 generate-panels.py
"""

import json
import urllib.request
import urllib.parse
import time
import os
import random

COMFYUI_URL = "http://127.0.0.1:8188"
OUTPUT_DIR = "site/content/episodes/ep01-le-village-insoumis/panels"

# Style de base pour tous les panels
BASE_STYLE = "comic book art style, webtoon, graphic novel, vivid colors, bold outlines, Amazigh Kabyle culture, North African, detailed illustration, high quality, masterpiece"
NEGATIVE = "photorealistic, photograph, 3d render, blurry, low quality, deformed, ugly, watermark, text, logo, signature, nsfw"

# Prompts pour chaque panel de l'EP01
PANELS = [
    {
        "index": 0,
        "prompt": f"panoramic landscape view of Djurdjura mountains at sunrise, golden dawn light, mist covering peaks, olive trees in foreground, small Kabyle village with stone houses in distance, birds flying, Berber geometric patterns border, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 1,
        "prompt": f"Kabyle village perched on hillside, stone houses with red tile roofs, ancient olive tree in center of village square, dirt paths, chickens, warm sunlight, Mediterranean mountain village, welcoming atmosphere, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 2,
        "prompt": f"young Kabyle man 22 years old forging metal at a dark forge, sparks flying, embers glowing orange, muscular arms, concentrated expression, wearing traditional burnous, dramatic lighting from fire, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 3,
        "prompt": f"extreme close-up of strong hands holding a glowing red-hot blade on an anvil, sparks, forge fire reflection, detailed metalwork, dramatic warm lighting, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 4,
        "prompt": f"village council meeting under a massive ancient olive tree, elderly Kabyle men sitting in circle wearing white djellabas, serious grave expressions, cool blue-green atmosphere, stone benches, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 5,
        "prompt": f"elderly Kabyle grandmother standing tall and proud, pointing finger towards mountains, white headscarf, wrinkled wise face, defiant expression, other villagers behind her, earthy warm tones, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 6,
        "prompt": f"young man walking alone through dense cedar forest, dappled sunlight filtering through branches, mysterious atmosphere, green forest path, wearing traditional burnous with shepherd staff, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 7,
        "prompt": f"discovery of hidden cave behind waterfall, ancient Tifinagh script carved on cave walls, mysterious blue glow from inscriptions, young man looking in awe, dramatic lighting, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 8,
        "prompt": f"extreme close-up of ancient Tifinagh inscriptions glowing faintly on dark cave wall, mysterious symbols, Berber geometric patterns, blue and gold light emanating from carvings, dark atmospheric, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
    {
        "index": 9,
        "prompt": f"epic wide shot, young Kabyle man emerging from cave at sunset, dramatic orange and purple sky, holding ancient glowing artifact, wind in burnous, mountains in background, heroic pose, cinematic composition, {BASE_STYLE}",
        "width": 800,
        "height": 500,
    },
]


def build_workflow(prompt, negative_prompt, width, height, seed=None):
    """Construit un workflow ComfyUI basique pour SDXL"""
    if seed is None:
        seed = random.randint(0, 2**32)

    workflow = {
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": 25,
                "cfg": 7.5,
                "sampler_name": "dpmpp_2m",
                "scheduler": "karras",
                "denoise": 1.0,
                "model": ["4", 0],
                "positive": ["6", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0],
            },
        },
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {
                "ckpt_name": "sd_xl_base_1.0.safetensors",
            },
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "width": width,
                "height": height,
                "batch_size": 1,
            },
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": prompt,
                "clip": ["4", 1],
            },
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": negative_prompt,
                "clip": ["4", 1],
            },
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["3", 0],
                "vae": ["4", 2],
            },
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": "amazigh_panel",
                "images": ["8", 0],
            },
        },
    }
    return workflow


def queue_prompt(workflow):
    """Envoie un workflow à ComfyUI"""
    data = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    try:
        resp = urllib.request.urlopen(req)
        return json.loads(resp.read())
    except Exception as e:
        print(f"Erreur: {e}")
        return None


def wait_for_completion(prompt_id):
    """Attend que le prompt soit terminé"""
    while True:
        try:
            resp = urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}")
            history = json.loads(resp.read())
            if prompt_id in history:
                return history[prompt_id]
        except:
            pass
        time.sleep(2)


def get_image(filename, subfolder, folder_type):
    """Récupère une image générée"""
    params = urllib.parse.urlencode({
        "filename": filename,
        "subfolder": subfolder,
        "type": folder_type,
    })
    resp = urllib.request.urlopen(f"{COMFYUI_URL}/view?{params}")
    return resp.read()


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=" * 60)
    print("  AmazighComics — Génération EP01 panels")
    print("=" * 60)

    # Vérifier que ComfyUI tourne
    try:
        urllib.request.urlopen(f"{COMFYUI_URL}/system_stats")
        print("✓ ComfyUI connecté")
    except:
        print("✗ ComfyUI pas accessible. Lance-le d'abord :")
        print("  python3 ~/Dev/ComfyUI/main.py")
        return

    for panel in PANELS:
        idx = panel["index"]
        print(f"\n--- Panel {idx + 1}/10 ---")
        print(f"Prompt: {panel['prompt'][:80]}...")

        workflow = build_workflow(
            prompt=panel["prompt"],
            negative_prompt=NEGATIVE,
            width=panel["width"],
            height=panel["height"],
        )

        result = queue_prompt(workflow)
        if not result:
            print(f"  ✗ Erreur panel {idx}")
            continue

        prompt_id = result["prompt_id"]
        print(f"  → En cours (id: {prompt_id})")

        history = wait_for_completion(prompt_id)

        # Récupérer l'image
        outputs = history.get("outputs", {})
        for node_id, output in outputs.items():
            if "images" in output:
                for img_info in output["images"]:
                    img_data = get_image(
                        img_info["filename"],
                        img_info["subfolder"],
                        img_info["type"],
                    )
                    output_path = os.path.join(OUTPUT_DIR, f"panel-{idx:02d}.png")
                    with open(output_path, "wb") as f:
                        f.write(img_data)
                    print(f"  ✓ Sauvé → {output_path}")

    print("\n" + "=" * 60)
    print("  Génération terminée !")
    print("=" * 60)


if __name__ == "__main__":
    main()
