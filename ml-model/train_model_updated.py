
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle

# Load updated CSE dataset
df = pd.read_csv("career_data_cse.csv")

# Updated feature columns
X = df[[
    "programming", "algorithms", "os_networks", "dbms", "oop",
    "computer_architecture", "software_engineering", "cyber_security",
    "machine_learning", "cloud_computing", "compiler_design",
    "computer_graphics"
]]

y = df["career"]

# Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train model (deterministic with fixed random_state)
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X, y_encoded)

# Save model and encoder
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(le, open("encoder.pkl", "wb"))

print("CSE career model trained successfully!")
