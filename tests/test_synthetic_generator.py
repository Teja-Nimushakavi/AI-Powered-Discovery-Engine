import os
from src.ingestion.synthetic_generator import SyntheticDataGenerator


def test_synthetic_data_generation():
    generator = SyntheticDataGenerator()
    records = generator.generate_records(count=100)
    assert len(records) == 100
    assert "review_id" in records[0]
    assert "text" in records[0]

    output_path = "./data/raw/test_synthetic.csv"
    generator.generate_csv(output_path, count=50)
    assert os.path.exists(output_path)
