import json
import random
from datetime import datetime, timedelta

class DataFactory:
    def __init__(self):
        self.categories = ["mail", "whatsapp", "facebook", "sms", "finance", "fitness"]

    def generate_life_sim(self, days=7):
        sim_data = {cat: [] for cat in self.categories}
        start_date = datetime.now() - timedelta(days=days)

        for day in range(days + 1):
            current_date = start_date + timedelta(days=day)
            
            # 1. Mail (1-3 per day)
            for _ in range(random.randint(1, 3)):
                sim_data["mail"].append({
                    "timestamp": (current_date + timedelta(hours=random.randint(9, 18))).isoformat(),
                    "sender": random.choice(["HR @ TechCorp", "Amazon India", "Family Group", "Travel Booking"]),
                    "subject": random.choice(["Q4 Performance Review", "Your Order is Out for Delivery", "Weekend Trip Details", "Flight Confirmation - AI901"]),
                    "snippet": "Detailed content regarding the subject line for local model to parse..."
                })

            # 2. WhatsApp/Facebook (5-10 per day)
            for _ in range(random.randint(5, 10)):
                sim_data["whatsapp"].append({
                    "timestamp": (current_date + timedelta(hours=random.randint(8, 22))).isoformat(),
                    "sender": random.choice(["Mom", "Rohan", "Project Alpha Group", "Swiggy"]),
                    "text": random.choice(["Are you coming for dinner?", "Did you check the PR?", "Food is on the way", "Bro, check the news", "Send the files"]),
                })

            # 3. Finance (2-5 transactions per day)
            for _ in range(random.randint(2, 5)):
                amount = random.randint(50, 5000)
                sim_data["finance"].append({
                    "timestamp": (current_date + timedelta(hours=random.randint(10, 20))).isoformat(),
                    "type": random.choice(["UPI_DEBIT", "BANK_TRANSFER", "CARD_PAYMENT"]),
                    "amount": amount,
                    "merchant": random.choice(["Starbucks", "Airtel Bill", "HDFC Credit Card", "Zomato", "Shell Petrol"]),
                    "balance_after": 45000 - amount
                })

            # 4. Fitness (1 entry per day)
            sim_data["fitness"].append({
                "date": current_date.strftime("%Y-%m-%d"),
                "steps": random.randint(3000, 12000),
                "heart_rate_avg": random.randint(65, 85),
                "sleep_hours": round(random.uniform(5.5, 8.5), 1),
                "calories_burned": random.randint(1800, 2800)
            })

        return sim_data

if __name__ == "__main__":
    factory = DataFactory()
    sim_data = factory.generate_life_sim(days=30)
    with open("simulation/mock_db.json", "w") as f:
        json.dump(sim_data, f, indent=2)
    print(f"Digital Life Simulation Complete: Generated {len(sim_data['mail'])} events.")
