describe("Love Bonito Web Scraper", () => {
  it("Scrapes data with pagination handling", () => {
    const allData = [];
    let currentPage = 1;
    let hasMorePages = true;
    const maxPages = 50; // Safety limit
    const targetRecords = 100;
    const baseDelay = 1000; // Rate limiting

    function scrapePage() {
      // Add random delay for respectful scraping
      const delay = baseDelay + Math.random() * 1000;
      cy.wait(delay);

      cy.visit(
        `https://www.lovebonito.com/sg/shop-all?stock.is_in_stock=true&page=${currentPage}`,
        {
          failOnStatusCode: true,
          timeout: 30000,
        }
      );

      // Wait for content to load
      cy.get('[data-sentry-component="ProductList"]', {
        timeout: 10000,
      }).should("be.visible");

      cy.get('[data-sentry-component="ProductList"]', {
        timeout: 15000,
      }).should("be.visible");

      // Extract data from current page
      cy.get('[data-testid="product-card-test-id"]')
        .parent()
        .should("have.length.greaterThan", 0) // Ensure products exist
        .each(($card) => {
          const productData = {
            name: $card.find('[data-testid="text-link"]').text().trim(),
            price: $card
              .find("p")
              .filter(function () {
                // Use Cypress.$ to wrap 'this' (the current DOM element in the filter loop)
                // and then test its text content against the regex.
                return /^\s*S\$/.test(Cypress.$(this).text());
              })
              .first()
              .text()
              .trim(),
            productUrl:
              "https://www.lovebonito.com" +
              $card.find('[data-testid="text-link"]').attr("href"),
            imageUrl: $card
              .find('[data-testid="product-card-image"]')
              .attr("src"),
            rating: $card
              .find('[data-testid="product-card-ratings"] p')
              .eq(0)
              .text()
              .trim(),
            numberOfRatings: $card
              .find('[data-testid="product-card-ratings"] p')
              .eq(1)
              .text()
              .trim()
              .replace(/\(|\)/g, ""),
          };

          allData.push(productData);
        })
        .then(() => {
          cy.log(
            `Scraped ${allData.length} records so far from page ${currentPage}`
          );

          // Check if we have enough data or reached max pages
          if (allData.length >= targetRecords || currentPage >= maxPages) {
            hasMorePages = false;
            cy.writeFile("cypress/downloads/scraped-data.json", {
              metadata: {
                totalRecords: allData.length,
                pagesScraped: currentPage,
                scrapedAt: new Date().toISOString(),
              },
              data: allData,
            });
            return;
          }

          // Check for next page button and continue
          cy.get("body").then(($body) => {
            if (
              $body.find('[data-testid="pagination-arrow-test-id"] a[href]')
                .length > 0
            ) {
              currentPage++;
              scrapePage(); // Recursive call for next page
            } else {
              hasMorePages = false;
              cy.writeFile("cypress/downloads/scraped-data.json", {
                metadata: {
                  totalRecords: allData.length,
                  pagesScraped: currentPage,
                  scrapedAt: new Date().toISOString(),
                },
                data: allData,
              });
            }
          });
        });
    }

    scrapePage(); // Start scraping
  });
});
