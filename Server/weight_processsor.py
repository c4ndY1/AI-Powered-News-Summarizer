import json
import os
from datetime import datetime

class WeightProcessor:
    def __init__(self, input_file="Data/category_weightages2.json", output_file="Data/category_weightages.json", log_file="Data/interaction_logs.txt"):
        self.input_file = input_file
        self.output_file = output_file
        self.log_file = log_file
        
        # Define interaction impacts
        self.interaction_impacts = {
            'like': 0.02,      # Increase by 2%
            'dislike': -0.02,  # Decrease by 2%
            'read': 0.01,      # Increase by 1%
            'play': 0.005      # Increase by 0.5%
        }
        
        self.weights = self.load_weights()

    def load_weights(self):
        try:
            if os.path.exists(self.input_file):
                with open(self.input_file, 'r') as f:
                    data = json.load(f)
                    return data.get("vector", {})
            else:
                print(f"Input file {self.input_file} not found.")
                return {}
        except Exception as e:
            print(f"Error loading weights: {str(e)}")
            return {}

    def normalize_weights(self):
        """Normalize weights to ensure they sum to 1"""
        total = sum(self.weights.values())
        if total > 0:
            for category in self.weights:
                self.weights[category] = round(self.weights[category] / total, 4)

    def save_weights(self):
        try:
            # Ensure the directory exists before saving
            os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
            with open(self.output_file, 'w') as f:
                json.dump(self.weights, f, indent=2)
            print(f"Weights saved to {self.output_file}")
        except Exception as e:
            print(f"Error saving weights: {str(e)}")

    def log_interaction(self, action, category, old_weight, new_weight):
        try:
            # Ensure the directory exists before logging
            os.makedirs(os.path.dirname(self.log_file), exist_ok=True)
            log_entry = (f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - "
                        f"Action: {action}, Category: {category}, "
                        f"Weight change: {old_weight:.4f} -> {new_weight:.4f}\n")
            
            with open(self.log_file, 'a') as f:
                f.write(log_entry)
        except Exception as e:
            print(f"Error logging interaction: {str(e)}")

    def update_weight(self, action, category):
        if category not in self.weights:
            print(f"Invalid category: {category}")
            return False

        if action not in self.interaction_impacts:
            print(f"Invalid action: {action}")
            return False

        old_weight = self.weights[category]
        impact = self.interaction_impacts[action]

        # Update target category weight
        if action in ['like', 'read', 'play']:
            new_weight = old_weight * (1 + impact)
        else:  # dislike
            new_weight = old_weight * (1 - abs(impact))

        # Ensure minimum weight
        new_weight = max(0, new_weight)  # Allows weight to reach 0
        self.weights[category] = new_weight

        # Normalize all weights
        self.normalize_weights()

        # Save the updated weights
        self.save_weights()

        # Log the interaction
        self.log_interaction(action, category, old_weight, self.weights[category])

        print(f"\nUpdated weight for {category}: {old_weight:.4f} -> {self.weights[category]:.4f}")
        return True

    def process_input(self):
        try:
            with open(self.input_file, 'r') as f:
                data = json.load(f)
                action = data.get("action", None)
                category = data.get("category", None)

                if not action or not category:
                    print("Input must include both 'action' and 'category'.")
                    return
                
                self.update_weight(action, category)
        except Exception as e:
            print(f"Error processing input: {str(e)}")

def main():
    processor = WeightProcessor()
    processor.process_input()

if __name__ == "__main__":
    main()