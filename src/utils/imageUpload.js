export function resizeImageFile(file, options = {}) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
            reject(new Error("請選擇圖片檔案"));
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const maxSize = 1600;
                const ratio = Math.min(
                    1,
                    maxSize / Math.max(image.width, image.height)
                );
                const width = Math.round(image.width * ratio);
                const height = Math.round(image.height * ratio);
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;
                context.drawImage(image, 0, 0, width, height);

                if (options.watermarkText) {
                    const padding = Math.max(24, Math.round(width * 0.026));
                    const fontSize = Math.max(32, Math.round(width * 0.055));
                    const text = options.watermarkText;

                    context.save();
                    context.font = `800 ${fontSize}px Arial, sans-serif`;
                    context.textBaseline = "bottom";

                    const metrics = context.measureText(text);
                    const textWidth = metrics.width;
                    const textHeight = fontSize;
                    const x = width - textWidth - padding;
                    const y = height - padding;

                    context.fillStyle = "rgba(15, 23, 42, 0.34)";
                    context.fillRect(
                        x - padding * 0.55,
                        y - textHeight - padding * 0.35,
                        textWidth + padding * 1.1,
                        textHeight + padding * 0.75
                    );

                    context.fillStyle = "rgba(255, 255, 255, 0.88)";
                    context.fillText(text, x, y);
                    context.restore();
                }

                resolve(canvas.toDataURL("image/jpeg", 0.84));
            };

            image.onerror = () => reject(new Error("圖片讀取失敗"));
            image.src = reader.result;
        };

        reader.onerror = () => reject(new Error("圖片讀取失敗"));
        reader.readAsDataURL(file);
    });
}
