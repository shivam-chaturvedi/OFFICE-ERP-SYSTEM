from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Optional: prevent Unicode error when printing symbols
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Initialize Edge browser
driver = webdriver.Edge()
driver.get("http://localhost:5174/login")  # ✅ Replace with your actual URL
driver.maximize_window()

# Wait for the page to load
wait = WebDriverWait(driver, 10)

try:
    # Wait for Email input
    email_field = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Email']")))
    password_field = driver.find_element(By.XPATH, "//input[@placeholder='Password']")
    login_button = driver.find_element(By.XPATH, "//button[contains(text(),'Login')]")

    # ✅ Enter credentials
    email_field.send_keys("admin@tac.com")
    password_field.send_keys("admin123")

    # Click login
    login_button.click()

    # Wait for some post-login element (adjust to your actual page)
    time.sleep(3)

    print("✅ TC_LP_01: Login Test Passed")

except Exception as e:
    print("❌ TC_LP_01: Login Test Failed -", e)

finally:
    # Close the browser
    driver.quit()
