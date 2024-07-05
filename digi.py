python
# Import the DigiBoard library
from digiboard import DigiBoard

# Create a new DigiBoard object
board = DigiBoard()

# Connect to the DigiBoard
board.connect()

# Set the display brightness
board.set_brightness(100)

# Set the display text
board.set_text("Hello, world!")

# Set the display color
board.set_color(255, 0, 0)  # Red

# Display an image
board.display_image("image.jpg")

# Play a sound
board.play_sound("sound.wav")

# Get the current temperature
temperature = board.get_temperature()
print(f"Temperature: {temperature} degrees Celsius")

# Disconnect from the DigiBoard
board.disconnect()