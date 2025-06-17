// Date formatting configuration
const DATE_FORMAT_OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

// Function to update copyright year
const updateCopyrightYear = () => {
    const copyrightElement = document.getElementById('currentYear');
    if (copyrightElement) {
        copyrightElement.textContent = new Date().getFullYear();
    }
};

// Function to update last modified date
const updateLastModified = () => {
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        const formattedDate = new Date(document.lastModified)
            .toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
        lastModifiedElement.textContent = formattedDate;
    }
};

// Initialize both date elements
const initializeDateElements = () => {
    updateCopyrightYear();
    updateLastModified();
};

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDateElements);