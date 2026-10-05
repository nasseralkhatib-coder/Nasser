#!/usr/bin/env python3
import os
import sys
import subprocess
import zipfile
import shutil
import argparse

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(ROOT_DIR)

parser = argparse.ArgumentParser(description="Package website downloads")
parser.add_argument("--type", choices=["dist", "source", "all"], default="all", help="What to package: dist, source, or all")
args = parser.parse_args()

target_type = args.type

PUBLIC_DOWNLOADS = os.path.join(ROOT_DIR, "public", "downloads")
os.makedirs(PUBLIC_DOWNLOADS, exist_ok=True)

DIST_DIR = os.path.join(ROOT_DIR, "dist")
DIST_DOWNLOADS = os.path.join(DIST_DIR, "downloads")

# Build and package dist if requested
if target_type in ("dist", "all"):
    print("1. Cleaning dist and building production app via vite build...")
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR, ignore_errors=True)
    subprocess.run(["npm", "run", "build"], check=True)
    import time
    time.sleep(1)

    # Guarantee all public images are definitely in dist/images
    public_images = os.path.join(ROOT_DIR, "public", "images")
    dist_images = os.path.join(DIST_DIR, "images")
    if os.path.exists(public_images):
        for root, _, files in os.walk(public_images):
            for f in files:
                src_f = os.path.join(root, f)
                rel_p = os.path.relpath(src_f, public_images)
                dst_f = os.path.join(dist_images, rel_p)
                os.makedirs(os.path.dirname(dst_f), exist_ok=True)
                if not os.path.exists(dst_f):
                    shutil.copy2(src_f, dst_f)

    os.makedirs(DIST_DOWNLOADS, exist_ok=True)

    # Remove any stale files with non-ASCII or deprecated names from dist
    for stale_name in [
        "INSTRUCTIONS_تعليمات_الرفع_على_الاستضافة.txt",
        "images/حاويات.jpg"
    ]:
        stale_path = os.path.join(DIST_DIR, stale_name)
        if os.path.exists(stale_path):
            try:
                os.remove(stale_path)
            except Exception:
                pass

    # Add hosting instructions file inside dist/ with clean ASCII filename
    instructions_content = """========================================================================
دليل رفع وتشغيل موقع شركة كميزون كميكال التجارية على الاستضافة (Hosting)
========================================================================

هذا المجلد يحتوي على كافة ملفات ومجلدات الموقع الجاهزة للنشر المباشر:
- index.html (الصفحة الرئيسية لكامل التطبيق - مهيأة بروابط نسبية تعمل مباشرة)
- مجلد assets/ (ملفات الجافاسكربت والتنسيقات المضغوطة والمحسنة)
- مجلد images/ (كافة صور الشاحنات، المستودعات، الحاويات، ومنتجات الكيماويات)
- ملف .htaccess (لتوجيه الروابط بدون أخطاء 404 على خوادم Apache / cPanel)

طريقة الرفع على الاستضافة (cPanel / Hostinger / GoDaddy / أي استضافة):
------------------------------------------------------------------------
1. قم بفك الضغط عن هذا الملف (kemizone_website_hosting_dist.zip) على جهازك.
2. ادخل إلى لوحة تحكم الاستضافة الخاصة بك (مثلاً: cPanel -> File Manager).
3. افتح المجلد الرئيسي للموقع والذي يكون عادة باسم:
   public_html  أو  www  أو  httpdocs
4. ارفع كافة الملفات والمجلدات الموجودة هنا (index.html, assets, images, .htaccess).
5. افتح نطاقك (الدومين) في المتصفح، وسيعمل الموقع بالكامل فوراً وبسرعة فائقة.

ملاحظات:
- الموقع مبني بنظام Single Page Application (SPA) عالي السرعة، وجميع الصور مدمجة محلياً ومرفوعة مسبقاً.
- لأي استفسار تقني، تواصل مع فريق كميزون: nasser.alkhatib@kemizone.com
========================================================================
"""
    with open(os.path.join(DIST_DIR, "README_HOSTING.txt"), "w", encoding="utf-8") as f:
        f.write(instructions_content)

    hosting_zip_path = os.path.join(PUBLIC_DOWNLOADS, "kemizone_website_hosting_dist.zip")
    print(f"2. Creating {hosting_zip_path}...")
    with zipfile.ZipFile(hosting_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(DIST_DIR):
            # Do not include the downloads zip inside itself
            if "downloads" in dirs:
                dirs.remove("downloads")
            if ".git" in dirs:
                dirs.remove(".git")
            for file in sorted(files):
                # Skip temporary, log, or internal hidden files
                if file.endswith(".zip") or file.endswith(".log") or file == ".gitignore":
                    continue
                file_path = os.path.join(root, file)
                if not os.path.exists(file_path):
                    continue
                arcname = os.path.relpath(file_path, DIST_DIR).replace("\\", "/")
                # Ensure arcname is valid ASCII and clean
                try:
                    arcname.encode("ascii")
                except UnicodeEncodeError:
                    print(f"Skipping non-ASCII filename to protect Windows extraction: {arcname}")
                    continue
                zipf.write(file_path, arcname)

    print(f"Hosting zip size: {os.path.getsize(hosting_zip_path) / (1024*1024):.2f} MB")
    if os.path.exists(DIST_DOWNLOADS):
        shutil.copy(hosting_zip_path, os.path.join(DIST_DOWNLOADS, "kemizone_website_hosting_dist.zip"))

# Package source code if requested
if target_type in ("source", "all"):
    source_zip_path = os.path.join(PUBLIC_DOWNLOADS, "kemizone_source_code.zip")
    print(f"Packaging source code to {source_zip_path}...")

    source_instructions = """========================================================================
السورس كود الكامل لمشروع موقع شركة كميزون كميكال التجارية (Kemizone Source Code)
========================================================================

المتطلبات:
- Node.js (الإصدار 18 أو 20 أو أحدث)
- npm

طريقة التشغيل للتطوير والتعديل (Development):
------------------------------------------------------------------------
1. افتح موجه الأوامر (Terminal) داخل مجلد المشروع.
2. نفّذ الأمر التالي لتثبيت الحزم:
   npm install

3. نفّذ الأمر التالي لتشغيل خادم التطوير المحلي:
   npm run dev

4. سيظهر رابط محلي مثل http://localhost:3000 لفتح وتعديل الموقع محلياً.

طريقة بناء نسخة الإنتاج (Production Build):
------------------------------------------------------------------------
   npm run build
- سيتم إنشاء مجلد dist/ يحتوي على النسخة النهائية الجاهزة للاستضافة.
========================================================================
"""
    with open(os.path.join(ROOT_DIR, "README_SOURCE_CODE.txt"), "w", encoding="utf-8") as f:
        f.write(source_instructions)

    ignore_dirs = {
        "node_modules", "dist", ".git", ".next", ".cache", "tmp", "__pycache__"
    }

    with zipfile.ZipFile(source_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(ROOT_DIR):
            # Filter out ignored directories
            dirs[:] = [d for d in dirs if d not in ignore_dirs and not d.startswith(".")]
            # Also skip public/downloads to avoid recursive zips
            rel_root = os.path.relpath(root, ROOT_DIR)
            if rel_root.startswith("public/downloads") or rel_root.startswith("dist"):
                continue
            for file in files:
                if file.endswith(".zip") or file.endswith(".log"):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, ROOT_DIR)
                zipf.write(file_path, arcname)

    print(f"Source Code zip size: {os.path.getsize(source_zip_path) / (1024*1024):.2f} MB")
    if os.path.exists(DIST_DOWNLOADS):
        shutil.copy(source_zip_path, os.path.join(DIST_DOWNLOADS, "kemizone_source_code.zip"))

    # Also generate text bundle for quick viewing/downloading
    source_txt_path = os.path.join(PUBLIC_DOWNLOADS, "kemizone_source_code.txt")
    print(f"Generating source code text bundle to {source_txt_path}...")
    with open(source_txt_path, "w", encoding="utf-8") as out_txt:
        out_txt.write("================================================================================\n")
        out_txt.write("KEMIZONE CHEMICAL COMMERCIAL CO. - COMPLETE SOURCE CODE REPOSITORY\n")
        out_txt.write("Official Contact: nasser.alkhatib@kemizone.com\n")
        out_txt.write("================================================================================\n\n")
        
        text_extensions = {".ts", ".tsx", ".js", ".jsx", ".json", ".html", ".css", ".md", ".txt", ".py", ".svg"}
        for root, dirs, files in os.walk(ROOT_DIR):
            dirs[:] = [d for d in dirs if d not in ignore_dirs and not d.startswith(".")]
            rel_root = os.path.relpath(root, ROOT_DIR)
            if rel_root.startswith("public/downloads") or rel_root.startswith("dist"):
                continue
            for file in sorted(files):
                ext = os.path.splitext(file)[1].lower()
                if ext in text_extensions and not file.endswith(".zip") and not file.endswith(".log"):
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, ROOT_DIR)
                    try:
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as f_in:
                            content = f_in.read()
                        out_txt.write(f"\n{'='*80}\nFILE: {rel_path}\n{'='*80}\n")
                        out_txt.write(content + "\n")
                    except Exception as e:
                        print(f"Could not read {rel_path} for text bundle: {e}")
                        
    if os.path.exists(DIST_DOWNLOADS):
        shutil.copy(source_txt_path, os.path.join(DIST_DOWNLOADS, "kemizone_source_code.txt"))

print("Packaging completed successfully!")
