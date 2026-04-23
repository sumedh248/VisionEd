import pandas as pd
import random

career_profiles = {
    "Software Engineer": [5, 2, 2, 5],
    "Data Scientist": [5, 3, 2, 5],
    "Designer": [2, 5, 3, 2],
    "Psychologist": [3, 4, 5, 1],
    "Business Analyst": [4, 3, 4, 3],
    "Teacher": [3, 3, 5, 2],
    "Entrepreneur": [4, 4, 4, 3],
}

data = []

for career, base in career_profiles.items():
    for _ in range(150):  # 150 samples per career
        sample = [min(5, max(1, val + random.uniform(-1, 1))) for val in base]
        data.append(sample + [career])

df = pd.DataFrame(data, columns=["analytical", "creativity", "social", "tech", "career"])

df.to_csv("career_data.csv", index=False)

print("Dataset created!")