// Resources data management
class ResourcesManager {
    constructor() {
        this.data = null;
        this.dataFile = 'data/resources.json';
        this.currentFilter = 'All';
    }
    
    async loadData() {
        try {
            const response = await fetch(this.dataFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Error loading resources data:', error);
            return null;
        }
    }
    
    async saveData(data) {
        try {
            // In a real application, this would send data to a server
            // For now, we'll just update the local data and log
            this.data = data;
            console.log('Data would be saved to server:', data);
            return true;
        } catch (error) {
            console.error('Error saving resources data:', error);
            return false;
        }
    }
    
    renderCategories() {
        if (!this.data) return;
        
        const categoryList = document.querySelector('.category-list');
        if (categoryList) {
            const categoriesHTML = this.data.categories.map((category, index) => `
                <li class="category-item">
                    <a href="#" ${index === 0 ? 'class="active"' : ''}>
                        <span>${category.icon} ${category.name}</span>
                        <span class="category-count">${category.count}</span>
                    </a>
                </li>
            `).join('');
            
            categoryList.innerHTML = categoriesHTML;
        }
    }
    
    renderQuickLinks() {
        if (!this.data) return;
        
        const quickLinksList = document.querySelectorAll('.category-list')[1];
        if (quickLinksList) {
            const linksHTML = this.data.quickLinks.map(link => `
                <li class="category-item">
                    <a href="#">${link.icon} ${link.name}</a>
                </li>
            `).join('');
            
            quickLinksList.innerHTML = linksHTML;
        }
    }
    
    renderRecentActivity() {
        if (!this.data) return;
        
        const recentActivity = document.querySelector('.recent-activity');
        if (recentActivity) {
            const activitiesHTML = this.data.recentActivity.map(activity => `
                <div class="recent-item">${activity}</div>
            `).join('');
            
            recentActivity.innerHTML = `
                <h4>📚 Recent Activity</h4>
                ${activitiesHTML}
            `;
        }
    }
    
    renderCertTags() {
        if (!this.data) return;
        
        const certFilter = document.querySelector('.cert-filter');
        if (certFilter) {
            const tagsHTML = this.data.certTags.map((tag, index) => `
                <span class="cert-tag ${index === 0 ? 'active' : ''}">${tag}</span>
            `).join('');
            
            certFilter.innerHTML = tagsHTML;
        }
    }
    
    renderFilterOptions() {
        if (!this.data) return;
        
        const filterSelects = document.querySelectorAll('.filter-select');
        if (filterSelects.length >= 3) {
            // Types filter
            filterSelects[0].innerHTML = this.data.filterOptions.types.map(type => 
                `<option>${type}</option>`
            ).join('');
            
            // Levels filter
            filterSelects[1].innerHTML = this.data.filterOptions.levels.map(level => 
                `<option>${level}</option>`
            ).join('');
            
            // Certifications filter
            filterSelects[2].innerHTML = this.data.filterOptions.certifications.map(cert => 
                `<option>${cert}</option>`
            ).join('');
        }
    }
    
    renderDifficultyDots(difficulty) {
        let dotsHTML = '';
        for (let i = 1; i <= 5; i++) {
            dotsHTML += `<div class="difficulty-dot ${i <= difficulty ? 'filled' : ''}"></div>`;
        }
        return dotsHTML;
    }
    
    renderResourceCard(resource) {
        const metaItems = [];
        if (resource.duration) metaItems.push(`⏱️ ${resource.duration}`);
        if (resource.instructor) metaItems.push(`👨‍🏫 ${resource.instructor}`);
        if (resource.questions) metaItems.push(`📝 ${resource.questions}`);
        if (resource.pages) metaItems.push(`📄 ${resource.pages}`);
        if (resource.handson) metaItems.push(`🛠️ ${resource.handson}`);
        if (resource.source) metaItems.push(`📖 ${resource.source}`);
        if (resource.language) metaItems.push(`💻 ${resource.language}`);
        if (resource.certification) metaItems.push(`🏷️ ${resource.certification}`);
        
        const progressIndicator = resource.progress > 0 ? 
            `<div class="progress-indicator" style="width: ${resource.progress}%"></div>` : '';
        
        return `
            <div class="resource-card">
                <span class="resource-type ${resource.typeClass}">${resource.type}</span>
                <div class="resource-header">
                    <h3 class="resource-title">${resource.title}</h3>
                    <div class="resource-meta">
                        ${metaItems.map(item => `<span>${item}</span>`).join('')}
                    </div>
                    <p class="resource-description">${resource.description}</p>
                </div>
                <div class="resource-footer">
                    <div class="difficulty">
                        <span>Difficulty:</span>
                        <div class="difficulty-dots">
                            ${this.renderDifficultyDots(resource.difficulty)}
                        </div>
                    </div>
                    <div class="resource-actions">
                        <button class="btn-small btn-outline">🔖</button>
                        <a href="#" class="btn-small btn-primary">${resource.actionText}</a>
                    </div>
                </div>
                ${progressIndicator}
            </div>
        `;
    }
    
    renderBookmarkedResources() {
        if (!this.data) return;
        
        const bookmarkedSection = document.querySelector('.bookmarked-section .resources-grid');
        if (bookmarkedSection) {
            const resourcesHTML = this.data.bookmarkedResources.map(resource => 
                this.renderResourceCard(resource)
            ).join('');
            
            bookmarkedSection.innerHTML = resourcesHTML;
        }
        
        // Update results count
        const resultsCount = document.querySelector('.bookmarked-section .results-count');
        if (resultsCount) {
            resultsCount.textContent = `${this.data.bookmarkedResources.length} resources`;
        }
    }
    
    renderAllResources() {
        if (!this.data) return;
        
        const allResourcesGrid = document.querySelector('.main-content .resources-grid:last-child');
        if (allResourcesGrid) {
            const resourcesHTML = this.data.allResources.map(resource => 
                this.renderResourceCard(resource)
            ).join('');
            
            allResourcesGrid.innerHTML = resourcesHTML;
        }
        
        // Update results count
        const allResultsCount = document.querySelector('.section-header .results-count');
        if (allResultsCount) {
            allResultsCount.textContent = `${this.data.allResources.length} resources found`;
        }
    }
    
    setupEventListeners() {
        // Certificate tag filtering
        document.querySelectorAll('.cert-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                document.querySelectorAll('.cert-tag').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.textContent;
                // In a real app, this would filter the resources
                console.log('Filter changed to:', this.currentFilter);
            });
        });

        // Category selection
        document.querySelectorAll('.category-item a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.category-item a').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                console.log('Category selected:', e.target.textContent);
            });
        });
        
        // Bookmark buttons
        document.querySelectorAll('.btn-outline').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = e.target.closest('.resource-card');
                const title = card.querySelector('.resource-title').textContent;
                this.toggleBookmark(title);
            });
        });
    }
    
    async toggleBookmark(title) {
        if (!this.data) return;
        
        // Find resource in allResources
        const resource = this.data.allResources.find(r => r.title === title);
        if (resource) {
            // Check if already bookmarked
            const bookmarkIndex = this.data.bookmarkedResources.findIndex(r => r.title === title);
            
            if (bookmarkIndex >= 0) {
                // Remove from bookmarks
                this.data.bookmarkedResources.splice(bookmarkIndex, 1);
                console.log('Removed bookmark:', title);
            } else {
                // Add to bookmarks
                this.data.bookmarkedResources.push(resource);
                console.log('Added bookmark:', title);
            }
            
            await this.saveData(this.data);
            this.renderBookmarkedResources();
        }
    }
    
    async render() {
        await this.loadData();
        if (this.data) {
            this.renderCategories();
            this.renderQuickLinks();
            this.renderRecentActivity();
            this.renderCertTags();
            this.renderFilterOptions();
            this.renderBookmarkedResources();
            this.renderAllResources();
            this.setupEventListeners();
        }
    }
}

// Initialize resources manager when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const resourcesManager = new ResourcesManager();
    await resourcesManager.render();
    
    // Make resources manager globally available for other scripts
    window.resourcesManager = resourcesManager;
});