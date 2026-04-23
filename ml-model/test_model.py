import pickle

import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split


FEATURES = ["analytical", "creativity", "social", "tech"]


def load_artifacts():
    with open("model.pkl", "rb") as model_file:
        model = pickle.load(model_file)

    with open("encoder.pkl", "rb") as encoder_file:
        encoder = pickle.load(encoder_file)

    return model, encoder


def evaluate_model(model, encoder):
    df = pd.read_csv("career_data.csv")
    X = df[FEATURES]
    y = encoder.transform(df["career"])

    _, X_test, _, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    y_pred = model.predict(X_test)

    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\nClassification report:")
    print(classification_report(y_test, y_pred, target_names=encoder.classes_))

    print("Confusion matrix:")
    print(confusion_matrix(y_test, y_pred))


def test_sample_predictions(model, encoder):
    samples = pd.DataFrame(
        [
            {"analytical": 5, "creativity": 2, "social": 2, "tech": 5},
            {"analytical": 4.5, "creativity": 2.5, "social": 2.0, "tech": 4.8},
            {"analytical": 5, "creativity": 3, "social": 2, "tech": 5},
            {"analytical": 2, "creativity": 5, "social": 3, "tech": 2},
            {"analytical": 3, "creativity": 4, "social": 5, "tech": 1},
            {"analytical": 4, "creativity": 3, "social": 4, "tech": 3},
            {"analytical": 3, "creativity": 3, "social": 5, "tech": 2},
        ]
    )

    predictions = encoder.inverse_transform(model.predict(samples))
    probabilities = model.predict_proba(samples)

    print("\nSample predictions:")
    for sample, prediction in zip(samples.to_dict("records"), predictions):
        print(f"{sample} => {prediction}")

    print("\nTop career matches:")
    for sample, sample_probs in zip(samples.to_dict("records"), probabilities):
        matches = [
            {"career": career, "match": round(probability * 100)}
            for career, probability in zip(encoder.classes_, sample_probs)
        ]
        matches.sort(key=lambda item: item["match"], reverse=True)

        print(f"\nInput: {sample}")
        print(matches[:3])


if __name__ == "__main__":
    career_model, label_encoder = load_artifacts()
    evaluate_model(career_model, label_encoder)
    test_sample_predictions(career_model, label_encoder)
