# apply-image-optimization.ps1
# Run this from inside your mrcap1com repo folder AFTER extracting the zip there.

# Delete the old PNG/JPG originals (now replaced by WebP):
Remove-Item "src\assets\album-art-of-ism.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\album-cold-ass-pimp.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\album-grave.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\album-one-on-one.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\album-ties.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\art-of-ism-bg.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\art-of-ism-bg.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\art-of-ism-hero.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\art-of-ism-poster.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\art-of-ism-qr.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\art-of-ism-title.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\betn-on-me.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\bout-to-blow.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\cap-hero-portrait.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\dear-frank-soundtrack.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\dippin-metaverse.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\h-town-represent.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\hero-bg.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\limitless-bg.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\limitless-cover.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\mr-cap-coin.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\mr-cap-logo.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\mr-cap-mascot.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\mrcap-hero-bg.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\nft-art-of-ism.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\nft-limitless.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\opk-cover.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\pomp-deluxe.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\pomp-standard.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\pomp-studio.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\deshi.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\finti.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\jaspin.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\kelia.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\kolia.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\lola.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\minnie.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\nonah.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\prada.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\sakita.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\self-ai-1.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\self-ai-2.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\self-ai-3.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\self-ai-4.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\skyla.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\trytida.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\tya.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\velata.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\wydaya.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\self-love\yanna.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\social-media-ho-stroll.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\southern-sounds-blog.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\southern-sounds.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\spc-austin-2025.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\the-life-documentary.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\trap-university-logo.png" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\trap-university\backpack.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\trap-university\cropped-hoodie.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\trap-university\leather-jacket.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\trap-university\slides.jpg" -Force -ErrorAction SilentlyContinue
Remove-Item "src\assets\trap-university\white-hoodie.jpg" -Force -ErrorAction SilentlyContinue

Write-Host "Deleted 61 original images. Now run:" -ForegroundColor Green
Write-Host "  git add -A" -ForegroundColor Yellow
Write-Host "  git commit -m 'perf: convert all bundled images to WebP (106MB -> 13MB, 88% smaller)'" -ForegroundColor Yellow
Write-Host "  git push origin main" -ForegroundColor Yellow