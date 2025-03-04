from fastapi import FastAPI
from pydantic import BaseModel
from service.service import predict_points
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

class InputData(BaseModel):
    """
    Input data structure for prediction requests.
    
    Attributes:
        area (str): The name of the area.
        age (int): The age of the individual (default is 30).
        is_housed (bool): Whether the individual is housed (default is True).
    """
    area: str
    age: int = 30
    is_housed: bool = True


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/api/areas")
def get_areas():
    """
    Endpoint to retrieve a list of predefined areas.
    
    Returns:
        dict: A dictionary containing a list of area names.
    """
    areas = [
        "Jayanagar", "Rajajinagar", "Koramangala", "Whitefield", 
        "Indiranagar", "Malleshwaram", "Marathahalli", "HSR Layout", 
        "BTM Layout", "Basavanagudi", "Banashankari", "Electronic City", 
        "Yelahanka", "Hebbal", "JP Nagar", "KR Puram"
    ]
    return {"areas": areas}

@app.post("/predict")
def get_prediction(data: InputData):
    """
    Endpoint to predict points based on the input data.
    
    Args:
        data (InputData): Input data provided by the user (area, age, and housing status).
    
    Returns:
        dict: A dictionary containing the predicted points.
    """
    predicted_points = predict_points(data.area, data.age, data.is_housed)
    return {"predicted_points": predicted_points}
