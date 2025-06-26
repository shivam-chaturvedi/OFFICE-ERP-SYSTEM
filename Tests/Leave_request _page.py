from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
import time
import os

# Create screenshots folder
os.makedirs("screenshots", exist_ok=True)

# Initialize WebDriver
driver = webdriver.Chrome()
driver.maximize_window()
wait = WebDriverWait(driver, 5)

# Unique reason using timestamp
timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
reason_text = f"Medical emergency – doctor recommended 2-day rest due to fever ({timestamp})"

try:
    # Step 1: Open login page
    driver.get("http://localhost:5173/")
    print("[STEP] Opened login page.")

    # Step 2: Login
    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    password_input = wait.until(EC.presence_of_element_located((By.NAME, "password")))
    email_input.send_keys("admin@gmail.com")
    password_input.send_keys("admin")
    login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]")))
    login_button.click()
    print("[STEP] Submitted login form.")

    # Screenshot after login
    time.sleep(.5)
    driver.save_screenshot("screenshots/1_after_login.png")

    # Step 3: Confirm login success
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(),'Welcome')]")))
    print("[PASS] Login successful.")

    # Step 4: Navigate to Leave Requests
    leave_menu = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Leave Requests")))
    leave_menu.click()
    print("[STEP] Navigated to Leave Request page.")

    time.sleep(.5)
    driver.save_screenshot("screenshots/2_leave_request_page.png")

    # Step 5: Fill the leave request form
    start_date = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Select start datetime']")))
    end_date = driver.find_element(By.XPATH, "//input[@placeholder='Select end datetime']")
    reason_input = driver.find_element(By.XPATH, "//input[@placeholder='Reason for leave']")
    leave_type_dropdown = driver.find_element(By.TAG_NAME, "select")

    start_date.send_keys("2025-06-27 10:00 AM")
    end_date.send_keys("2025-06-28 06:00 PM")
    reason_input.send_keys(reason_text)

    # Select leave type
    Select(leave_type_dropdown).select_by_visible_text("Sick Leave")

    # Submit the form
    apply_button = driver.find_element(By.XPATH, "//button[text()='Apply Leave']")
    apply_button.click()
    print("[STEP] Submitted leave request.")

    # Step 6: Verify leave in the table
    time.sleep(.5)
    leave_history = wait.until(EC.presence_of_element_located((By.XPATH, "//table")))

    # Debug output
    print("[DEBUG] Table contents:\n", leave_history.text)
    driver.save_screenshot("screenshots/3_leave_table.png")

    # Assertions
    assert "Sick Leave" in leave_history.text, "[FAIL] 'Sick Leave' not found in table"
    assert "Medical emergency" in leave_history.text, "[FAIL] Leave reason not found in table"

    print("[PASS] Leave request with reason submitted and verified successfully.")

except Exception as e:
    print("[FAIL] Test failed:", str(e))

finally:
    time.sleep(.5)
    driver.quit()
