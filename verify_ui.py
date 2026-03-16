import asyncio
from playwright.async_api import async_playwright
import time

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        username = f"ui_test_{int(time.time())}"
        
        # Register
        await page.goto("http://localhost:8000/register.php")
        await page.fill('input[name="username"]', username)
        await page.fill('input[name="password"]', "password")
        await page.fill('input[name="confirm_password"]', "password")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/login.php*")

        # Login
        await page.fill('input[name="username"]', username)
        await page.fill('input[name="password"]', "password")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/index.php")

        # Homepage Screenshot
        print("Capturing index.php...")
        await page.screenshot(path="final_index.png", full_page=True)
        
        # Verify default sort
        sort_val = await page.eval_on_selector("#sortBy", "el => el.value")
        print(f"Default sort value: {sort_val}")
        if sort_val == "first_air_date.desc":
            print("SUCCESS: Default sort is Latest Aired.")
        else:
            print("FAILURE: Default sort is NOT Latest Aired.")

        # Movies page
        print("Capturing movies.php...")
        await page.goto("http://localhost:8000/movies.php")
        await page.wait_for_selector(".top-nav")
        await page.screenshot(path="final_movies.png", full_page=True)

        # Show details page
        print("Capturing show.php...")
        await page.goto("http://localhost:8000/index.php")
        await page.wait_for_selector(".card")
        await page.click(".card")
        await page.wait_for_selector("#showDetails")
        await page.screenshot(path="final_show.png", full_page=True)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
