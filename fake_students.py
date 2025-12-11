"""
Fake Students Generator
Creates 50 simulated students that join a quiz game
"""

import requests
import random
import time

# Configuration
BASE_URL = "http://192.168.1.12:3000"
NUM_STUDENTS = 50

# Student name lists for generating realistic names
FIRST_NAMES = [
    "Alex", "Emma", "Noah", "Olivia", "Liam", "Ava", "Ethan", "Sophia", "Mason", "Isabella",
    "Lucas", "Mia", "Oliver", "Charlotte", "Elijah", "Amelia", "James", "Harper", "Benjamin", "Evelyn",
    "William", "Abigail", "Henry", "Emily", "Sebastian", "Elizabeth", "Jack", "Sofia", "Michael", "Avery",
    "Daniel", "Ella", "Matthew", "Scarlett", "Jackson", "Grace", "Samuel", "Chloe", "David", "Victoria",
    "Joseph", "Riley", "Carter", "Aria", "Owen", "Lily", "Wyatt", "Aubrey", "John", "Zoey"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
]

AVATARS = [
    'funny', 'cute', 'mysterious', 'smart', 'cool', 'ninja', 'robot', 'alien',
    'wizard', 'unicorn', 'lion', 'ghost', 'panda', 'rocket', 'star', 'crown',
    'dragon', 'fox', 'bear', 'koala'
]

class FakeStudent:
    def __init__(self, student_id, pin):
        self.student_id = student_id
        self.pin = pin
        self.name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        self.avatar = random.choice(AVATARS)
        self.player_id = None
        
    def join_game(self):
        """Join the quiz game"""
        try:
            response = requests.post(
                f"{BASE_URL}/api/student_join",
                json={
                    "pin": self.pin,
                    "name": self.name,
                    "avatar": self.avatar
                },
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("ok"):
                    self.player_id = data.get("player_id")
                    print(f"✅ {self.name} ({self.avatar}) joined successfully!")
                    return True
                else:
                    print(f"❌ {self.name} failed to join: {data.get('error', 'Unknown error')}")
                    return False
            else:
                print(f"❌ {self.name} failed to join: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ {self.name} error: {str(e)}")
            return False

def create_fake_students(pin, num_students=50, delay=0.1):
    """Create and join fake students"""
    print(f"\n🎮 Creating {num_students} fake students for PIN: {pin}\n")
    
    students = []
    successful = 0
    
    for i in range(num_students):
        student = FakeStudent(i + 1, pin)
        
        if student.join_game():
            students.append(student)
            successful += 1
        
        # Small delay to avoid overwhelming the server
        time.sleep(delay)
    
    print(f"\n✨ Summary: {successful}/{num_students} students joined successfully!\n")
    return students

def main():
    print("=" * 60)
    print("🎓 FAKE STUDENTS GENERATOR")
    print("=" * 60)
    
    # Get PIN from user
    pin = input("\nEnter the game PIN: ").strip()
    
    if not pin:
        print("❌ Error: PIN cannot be empty!")
        return
    
    # Ask for number of students
    try:
        num = input(f"Number of students to create (default: {NUM_STUDENTS}): ").strip()
        if num:
            num_students = int(num)
        else:
            num_students = NUM_STUDENTS
    except ValueError:
        print(f"Invalid number, using default: {NUM_STUDENTS}")
        num_students = NUM_STUDENTS
    
    # Create students
    students = create_fake_students(pin, num_students)
    
    print("\n💡 Tip: The students are now in the lobby waiting for the quiz to start!")
    print("💡 You can start the quiz from the teacher page.\n")
    
    # Keep the script running
    input("Press Enter to exit and disconnect all fake students...")
    print("\n👋 Goodbye!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Interrupted by user. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
