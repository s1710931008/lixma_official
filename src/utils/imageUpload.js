export function resizeImageFile(file) {
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

                resolve(canvas.toDataURL("image/jpeg", 0.84));
            };

            image.onerror = () => reject(new Error("圖片讀取失敗"));
            image.src = reader.result;
        };

        reader.onerror = () => reject(new Error("圖片讀取失敗"));
        reader.readAsDataURL(file);
    });
}
