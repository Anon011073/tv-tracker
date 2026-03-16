import asyncio
from playwright.async_api import async_playwright
import time

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Unique username to avoid conflicts
        username = f"testuser_{int(time.time())}"
        
        # Register
        print(f"Registering user: {username}")
        await page.goto("http://localhost:8000/register.php")
        await page.fill('input[name="username"]', username)
        await page.fill('input[name="password"]', "testpass123")
        await page.fill('input[name="confirm_password"]', "testpass123")
        await page.click('button[type="submit"]')
        
        # Should redirect to login
        await page.wait_for_url("**/login.php*")
        print("Registration successful, redirected to login.")

        # Login
        await page.fill('input[name="username"]', username)
        await page.fill('input[name="password"]', "testpass123")
        await page.click('button[type="submit"]')
        
        # Should redirect to index
        await page.wait_for_url("**/index.php")
        print("Login successful, redirected to index.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
