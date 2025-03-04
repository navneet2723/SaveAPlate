import pandas as pd
from models.models import get_model_and_encoder

def predict_points(area_input, age_value=30, is_housed_value=1):
    """
    Predicts the points based on the provided input features.
    
    Args:
        area_input (str): The name of the area to be encoded and used as input.
        age_value (int, optional): The age of the individual. Defaults to 30.
        is_housed_value (int, optional): Indicates whether the individual is housed (1 for True, 0 for False). Defaults to 1.
        
    Returns:
        int: The predicted points as an integer value.
    """  
    model, label_encoder = get_model_and_encoder()
    
    area_encoded = label_encoder.transform([area_input])[0]
    
    features = {
        "area_encoded": area_encoded,
        "age": age_value,
        "is_housed": is_housed_value
    }

    feature_names = model.feature_names_in_  
    input_data = pd.DataFrame([features], columns=feature_names)  

    predicted_points = model.predict(input_data)
    return int(predicted_points[0])
