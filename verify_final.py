import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Register new user
        print("Navigating to register page...")
        await page.goto("http://localhost:8000/register.php")
        await page.fill('input[name="username"]', "testuser")
        await page.fill('input[name="password"]', "testpass123")
        await page.fill('input[name="confirm_password"]', "testpass123")
        print("Submitting registration...")
        await page.click('button[type="submit"]')
        
        await page.wait_for_url("**/login.php")
        print("Registered and redirected to login")

        # Login
        await page.fill('input[name="username"]', "testuser")
        await page.fill('input[name="password"]', "testpass123")
        await page.click('button[type="submit"]')
        await page.wait_for_url("**/index.php")
        print("Logged in successfully")

        # Check Movies page
        print("Checking Movies page...")
        await page.goto("http://localhost:8000/movies.php")
        await page.wait_for_selector(".sidebar")
        await page.wait_for_selector(".show-grid")
        await page.screenshot(path="verify_movies.png")
        print("Movies page verified")

        # Check Movie details page
        print("Checking Movie details...")
        await page.wait_for_selector(".card")
        await page.click(".card")
        await page.wait_for_selector("#movieDetails")
        await page.screenshot(path="verify_movie_details.png")
        print("Movie details page verified")

        # Check TV Show details page
        print("Checking TV Show details...")
        await page.goto("http://localhost:8000/index.php")
        await page.wait_for_selector(".card")
        await page.click(".card")
        await page.wait_for_selector("#showDetails")
        await page.screenshot(path="verify_show_details.png")
        print("Show details page verified")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
