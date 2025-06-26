from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Start WebDriver
driver = webdriver.Chrome()
driver.maximize_window()

# Open ERP Login Page
driver.get("http://localhost:5173/")

try:
    wait = WebDriverWait(driver, 10)

    # --- Login ---
    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    password_input = wait.until(EC.presence_of_element_located((By.NAME, "password")))
    email_input.send_keys("admin@gmail.com")
    password_input.send_keys("admin")

    login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]")))
    login_button.click()

    # --- Verify Home Page Loaded ---
    welcome_text = wait.until(EC.presence_of_element_located((By.XPATH, "//h2[contains(text(),'Welcome, Admin')]")))
    print("✅ Login successful and Home Page loaded.")

    # --- Check Sidebar Items ---
    sidebar_items = ["Home", "My Profile", "Leave Requests", "Salary Slips", "My Attendance", "Tasks / Projects", "Announcements"]
    for item in sidebar_items:
        wait.until(EC.presence_of_element_located((By.XPATH, f"//span[contains(text(), '{item}')]")))
        print(f"✅ Sidebar '{item}' visible.")

    # --- Check Quick Action Buttons ---
    quick_buttons = ["My Profile", "Apply Leave", "Attendance", "My Tasks", "Salary Slip", "Announcements"]
    for btn in quick_buttons:
        wait.until(EC.presence_of_element_located((By.XPATH, f"//button[contains(text(), '{btn}')]")))
        print(f"✅ Quick button '{btn}' found.")

except Exception as e:
    print("❌ Test failed:", str(e))

finally:
    time.sleep(5)
    driver.quit()
