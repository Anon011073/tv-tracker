import asyncio
import time
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()
        
        timestamp = int(time.time())
        username = f"user_{timestamp}"
        password = "password123"

        # Register new user
        print(f"Registering user: {username}")
        await page.goto("http://localhost:8000/register.php")
        await page.fill('input[name="username"]', username)
        await page.fill('input[name="password"]', password)
        await page.fill('input[name="confirm_password"]', password)
        await page.click('button[type="submit"]')
        
        try:
            await page.wait_for_url("**/login.php*", timeout=5000)
            print("Registration successful (redirected to login)")
        except Exception as e:
            print("Registration failed or did not redirect to login")
            await page.screenshot(path="debug_register_fail.png")
            await browser.close()
            return

        # Login
        print(f"Logging in as: {username}")
        await page.fill('input[name="username"]', username)
        await page.fill('input[name="password"]', password)
        await page.click('button[type="submit"]')
        
        try:
            await page.wait_for_url("**/index.php", timeout=5000)
            print("Login successful (redirected to index)")
        except Exception as e:
            print("Login failed")
            await page.screenshot(path="debug_login_fail.png")
            await browser.close()
            return

        # Check Home page
        await page.wait_for_selector(".main-layout")
        await page.wait_for_selector(".sidebar")
        await page.screenshot(path="verify_home_final.png")
        print("Home page verified")

        # Check Movies page
        print("Checking Movies page...")
        await page.goto("http://localhost:8000/movies.php")
        await page.wait_for_selector(".show-grid")
        # Ensure no sidebar on movies page
        sidebars = await page.query_selector_all(".sidebar")
        if len(sidebars) == 0:
            print("Confirmed: No sidebar on Movies page")
        else:
            print("Warning: Sidebar found on Movies page")
            
        await page.screenshot(path="verify_movies_final.png")
        print("Movies page verified")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
