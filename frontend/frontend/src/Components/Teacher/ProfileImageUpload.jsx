import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

const ProfileImageUpload = ({ onImageCropped }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.3);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback(async (_, croppedAreaPixels) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        onImageCropped(blob);
      }, "image/jpeg");
    };
  }, [imageSrc, onImageCropped]);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="form-control custom-input"
      />

      {imageSrc && (
        <div style={{ position: "relative", height: 280, marginTop: 15 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}
    </>
  );
};

export default ProfileImageUpload;
