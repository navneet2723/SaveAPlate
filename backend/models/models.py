import joblib
from config.config import MODEL_FILENAME, ENCODER_FILENAME

loaded_model = joblib.load(MODEL_FILENAME)
label_encoder = joblib.load(ENCODER_FILENAME)

def get_model_and_encoder():
    """
    Returns the loaded model and label encoder.
    Ensures that the model and encoder are accessible for making predictions
    
    Returns:
        loaded_model: The pre-trained machine learning model.
        label_encoder: The encoder used to transform categorical inputs.
    """
    return loaded_model, label_encoder
