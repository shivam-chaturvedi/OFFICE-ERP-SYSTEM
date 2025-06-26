from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)
driver.maximize_window()

try:
    # Step 1: Login
    driver.get("http://localhost:5173/")
    wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys("admin@gmail.com")
    wait.until(EC.presence_of_element_located((By.NAME, "password"))).send_keys("admin")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]"))).click()
    time.sleep(2)

    # Step 2: Navigate to Salary Slips
    wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Salary Slips"))).click()
    time.sleep(2)
    driver.save_screenshot("salary_slip_page.png")

    # Step 3: Select Month
    month_dropdown = wait.until(EC.presence_of_element_located((By.TAG_NAME, "select")))
    select = Select(month_dropdown)
    select.select_by_visible_text("March 2025")
    time.sleep(2)

    # Step 4: Validate Salary Info
    page_text = driver.find_element(By.TAG_NAME, "body").text
    assert "Basic Salary ₹30000" in page_text
    assert "HRA ₹10000" in page_text
    assert "Medical Allowance ₹2000" in page_text
    assert "Deductions (PF) -₹3600" in page_text
    assert "Deductions (Tax) -₹2000" in page_text
    assert "Net Salary ₹36400" in page_text
    print("[PASS] Salary values are correct.")

    # Step 5: Print Button
    print_button = driver.find_element(By.XPATH, "//button[contains(text(),'Print Salary Slip')]")
    assert print_button.is_displayed() and print_button.is_enabled()
    print("[PASS] Print Salary Slip button is present and clickable.")

except Exception as e:
    print("[FAIL] Test failed:", e)

finally:
    driver.quit()
 