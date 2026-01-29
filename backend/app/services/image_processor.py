import cv2
import numpy as np
from PIL import Image
import io
from typing import Optional, Tuple

class ImageProcessor:
    """Service for image preprocessing and enhancement using OpenCV"""
    
    @staticmethod
    def preprocess_image(image_bytes: bytes) -> bytes:
        """
        Preprocess image for better AI detection
        - Resize to optimal size
        - Enhance contrast
        - Denoise
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            Processed image bytes
        """
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("Failed to decode image")
            
            # Resize to standard size (keeping aspect ratio)
            img = ImageProcessor._resize_image(img, max_size=800)
            
            # Enhance image quality
            img = ImageProcessor._enhance_image(img)
            
            # Convert back to bytes
            _, buffer = cv2.imencode('.jpg', img)
            return buffer.tobytes()
            
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return image_bytes  # Return original if processing fails
    
    @staticmethod
    def _resize_image(img: np.ndarray, max_size: int = 800) -> np.ndarray:
        """Resize image while maintaining aspect ratio"""
        height, width = img.shape[:2]
        
        if max(height, width) <= max_size:
            return img
        
        if height > width:
            new_height = max_size
            new_width = int(width * (max_size / height))
        else:
            new_width = max_size
            new_height = int(height * (max_size / width))
        
        return cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
    
    @staticmethod
    def _enhance_image(img: np.ndarray) -> np.ndarray:
        """Enhance image quality for better detection"""
        # Convert to LAB color space
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        # Merge channels
        enhanced = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
        
        # Denoise
        enhanced = cv2.fastNlMeansDenoisingColored(enhanced, None, 10, 10, 7, 21)
        
        return enhanced
    
    @staticmethod
    def detect_object_region(image_bytes: bytes) -> Optional[Tuple[int, int, int, int]]:
        """
        Detect the main object region in the image
        Returns bounding box (x, y, width, height) or None
        """
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return None
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply edge detection
            edges = cv2.Canny(gray, 50, 150)
            
            # Find contours
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if not contours:
                return None
            
            # Find largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest_contour)
            
            return (x, y, w, h)
            
        except Exception as e:
            print(f"Error detecting object region: {e}")
            return None
    
    @staticmethod
    def crop_to_object(image_bytes: bytes) -> bytes:
        """Crop image to focus on the main object"""
        try:
            bbox = ImageProcessor.detect_object_region(image_bytes)
            
            if bbox is None:
                return image_bytes
            
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            x, y, w, h = bbox
            
            # Add padding
            padding = 20
            x = max(0, x - padding)
            y = max(0, y - padding)
            w = min(img.shape[1] - x, w + 2 * padding)
            h = min(img.shape[0] - y, h + 2 * padding)
            
            # Crop
            cropped = img[y:y+h, x:x+w]
            
            # Convert back to bytes
            _, buffer = cv2.imencode('.jpg', cropped)
            return buffer.tobytes()
            
        except Exception as e:
            print(f"Error cropping image: {e}")
            return image_bytes


# Singleton instance
image_processor = ImageProcessor()
