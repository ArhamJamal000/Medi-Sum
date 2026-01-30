import os
print("Downloading TrOCR model for baking into Docker image...")
try:
    from transformers import TrOCRProcessor, VisionEncoderDecoderModel
    TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
    VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten')
    print("Mdl downloaded successfully.")
except ImportError:
    print("Transformers not installed, skipping model download.")
except Exception as e:
    print(f"Error downloading model: {e}")
