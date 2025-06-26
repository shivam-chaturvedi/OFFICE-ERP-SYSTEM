import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Setup
driver = webdriver.Chrome()
driver.maximize_window()
wait = WebDriverWait(driver, 10)

# Create screenshot folder if not exists
screenshot_dir = "screenshots"
os.makedirs(screenshot_dir, exist_ok=True)

try:
    # Step 1: Open ERP login page
    driver.get("http://localhost:5173/")
    
    # Step 2: Login
    wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys("admin@gmail.com")
    wait.until(EC.presence_of_element_located((By.NAME, "password"))).send_keys("admin")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]"))).click()
    time.sleep(2)

    # Step 3: Navigate to "My Attendance"
    wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "My Attendance"))).click()
    time.sleep(2)
    driver.save_screenshot(os.path.join(screenshot_dir, "1_attendance_page_loaded.png"))

    # Step 4: Try clicking "Mark Present" if it's visible
    try:
        mark_present_btn = driver.find_element(By.XPATH, "//button[contains(text(),'Mark Present')]")
        if mark_present_btn.is_enabled():
            mark_present_btn.click()
            print("[INFO] Marked as Present.")
            time.sleep(2)
            driver.save_screenshot(os.path.join(screenshot_dir, "2_marked_present.png"))
        else:
            print("[INFO] 'Mark Present' button is disabled.")
    except:
        print("[INFO] 'Mark Present' button not found – possibly already marked.")

    # Step 5: Check status text
    status_span = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//span[contains(text(),'Marked as Present') or contains(text(),'Marked as Absent') or contains(text(),'Not marked yet')]")
    ))
    status_text = status_span.text
    print(f"[INFO] Status text: {status_text}")
    
    assert "Marked as" in status_text or "Not marked" in status_text, "[FAIL] Status not showing properly"
    print("[PASS] Attendance status is correct.")
    driver.save_screenshot(os.path.join(screenshot_dir, "3_status_checked.png"))

    # Step 6: Click "Export CSV"
    export_btn = driver.find_element(By.XPATH, "//button[contains(text(),'Export CSV')]")
    assert export_btn.is_displayed() and export_btn.is_enabled(), "[FAIL] Export CSV button not clickable"
    export_btn.click()
    print("[PASS] Export CSV button clicked.")
    driver.save_screenshot(os.path.join(screenshot_dir, "4_export_csv_clicked.png"))

except Exception as e:
    print("[FAIL] Attendance test error:", str(e))

finally:
    time.sleep(2)
    driver.quit()
