# Love Bonito Web Scraper

## Description

This project is a web scraper that extracts data from the Love Bonito website. It uses Cypress for end-to-end testing and web scraping.

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/kwaich/lb-web-scaper
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

## Usage

1.  Configure the scraping script if needed:

    *   Modify the `cypress/e2e/webscraper.cy.js` file to target specific products or categories.
    *   Adjust the selectors and data extraction logic as needed.

2.  Run the scraper:

    ```bash
    npx cypress run
    ```

3.  The scraped data will be saved in the `cypress/downloads/scraped-data.json` file.

## Approach and Design

This web scraper uses Cypress to automate the process of extracting product data from the Love Bonito website. The script navigates through multiple pages, extracts relevant information from each product card, and saves the data in a JSON file.

Key aspects of the design include:

*   **Pagination Handling:** Iterates through multiple pages using the "next page" button.
*   **Data Extraction:** Extracts product name, price, URL, image URL, rating, and number of ratings.
*   **Rate Limiting:** Includes a random delay between page visits to avoid overloading the server.
*   **Data Storage:** Stores the scraped data in `cypress/downloads/scraped-data.json` with metadata.
*   **Target Records:** Stops scraping when a target number of records (100) or a maximum number of pages (50) is reached.

## Technologies Used

*   Cypress
*   Node.js
*   JavaScript

## License

This project is licensed under the MIT License.
