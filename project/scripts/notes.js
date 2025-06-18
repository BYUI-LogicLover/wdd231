// Notes management system
class NotesManager {
    constructor() {
        this.data = null;
        this.dataFile = 'data/notes.json';
        this.currentEditingId = null;
        this.filteredNotes = [];
        this.initializeEventListeners();
    }
    
    async loadData() {
        try {
            const response = await fetch(this.dataFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
            this.filteredNotes = [...this.data.notes];
            return this.data;
        } catch (error) {
            console.error('Error loading notes data:', error);
            
            // Try to load from localStorage as fallback
            try {
                const savedData = localStorage.getItem('aws-study-notes');
                if (savedData) {
                    this.data = JSON.parse(savedData);
                    this.filteredNotes = [...this.data.notes];
                    console.log('Data loaded from localStorage');
                    return this.data;
                }
            } catch (storageError) {
                console.error('Error loading from localStorage:', storageError);
            }
            
            // Initialize with empty data if file doesn't exist and no localStorage
            this.data = {
                notes: [],
                categories: {},
                totalNotes: 0,
                lastUpdated: new Date().toISOString()
            };
            this.filteredNotes = [];
            return this.data;
        }
    }
    
    async saveData() {
        try {
            // Update metadata
            this.data.totalNotes = this.data.notes.length;
            this.data.lastUpdated = new Date().toISOString();
            
            // Update categories count
            this.data.categories = {};
            this.data.notes.forEach(note => {
                if (note.category) {
                    this.data.categories[note.category] = (this.data.categories[note.category] || 0) + 1;
                }
            });
            
            // Save to localStorage for client-side persistence
            localStorage.setItem('aws-study-notes', JSON.stringify(this.data));
            console.log('Data saved to localStorage');
            
            // Update filtered notes
            this.filteredNotes = [...this.data.notes];
            this.applyFilters();
            
            return true;
        } catch (error) {
            console.error('Error saving notes data:', error);
            return false;
        }
    }
    
    generateId() {
        return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    async createNote(noteData) {
        const newNote = {
            id: this.generateId(),
            title: noteData.title,
            category: noteData.category || 'Other',
            certification: noteData.certification || '',
            content: noteData.content,
            tags: noteData.tags ? noteData.tags.split(',').map(tag => tag.trim()) : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.data.notes.unshift(newNote);
        await this.saveData();
        this.renderNotes();
        this.updateStats();
        this.updateCategories();
        
        return newNote;
    }
    
    async updateNote(id, noteData) {
        const noteIndex = this.data.notes.findIndex(note => note.id === id);
        if (noteIndex === -1) return false;
        
        const existingNote = this.data.notes[noteIndex];
        const updatedNote = {
            ...existingNote,
            title: noteData.title,
            category: noteData.category || 'Other',
            certification: noteData.certification || '',
            content: noteData.content,
            tags: noteData.tags ? noteData.tags.split(',').map(tag => tag.trim()) : [],
            updatedAt: new Date().toISOString()
        };
        
        this.data.notes[noteIndex] = updatedNote;
        await this.saveData();
        this.renderNotes();
        this.updateStats();
        this.updateCategories();
        
        return updatedNote;
    }
    
    async deleteNote(id) {
        const noteIndex = this.data.notes.findIndex(note => note.id === id);
        if (noteIndex === -1) return false;
        
        this.data.notes.splice(noteIndex, 1);
        await this.saveData();
        this.renderNotes();
        this.updateStats();
        this.updateCategories();
        
        return true;
    }
    
    formatDate(isoString) {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    truncateContent(content, maxLength = 150) {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    }
    
    renderNoteCard(note) {
        const tagsList = note.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const certificationBadge = note.certification ? 
            `<span class="cert-badge">${note.certification}</span>` : '';
        
        return `
            <div class="note-card" data-id="${note.id}">
                <div class="note-header">
                    <div class="note-title-row">
                        <h3 class="note-title">${note.title}</h3>
                        <div class="note-actions">
                            <button class="btn-icon" onclick="editNote('${note.id}')" title="Edit">✏️</button>
                            <button class="btn-icon" onclick="deleteNote('${note.id}')" title="Delete">🗑️</button>
                        </div>
                    </div>
                    <div class="note-meta">
                        <span class="note-category">${note.category}</span>
                        ${certificationBadge}
                        <span class="note-date">Updated: ${this.formatDate(note.updatedAt)}</span>
                    </div>
                </div>
                <div class="note-content">
                    ${this.truncateContent(note.content)}
                </div>
                <div class="note-footer">
                    <div class="note-tags">${tagsList}</div>
                    <button class="btn-small btn-outline" onclick="viewNote('${note.id}')">View Full</button>
                </div>
            </div>
        `;
    }
    
    renderNotes() {
        const container = document.getElementById('notesContainer');
        const noNotes = document.getElementById('noNotes');
        const notesCount = document.getElementById('notesCount');
        
        if (this.filteredNotes.length === 0) {
            container.style.display = 'none';
            noNotes.style.display = 'block';
            notesCount.textContent = '0 notes';
        } else {
            container.style.display = 'grid';
            noNotes.style.display = 'none';
            notesCount.textContent = `${this.filteredNotes.length} notes`;
            
            const notesHTML = this.filteredNotes.map(note => this.renderNoteCard(note)).join('');
            container.innerHTML = notesHTML;
        }
    }
    
    updateStats() {
        const totalNotesEl = document.getElementById('totalNotes');
        const totalCategoriesEl = document.getElementById('totalCategories');
        const lastUpdatedEl = document.getElementById('lastUpdated');
        
        if (totalNotesEl) totalNotesEl.textContent = this.data.totalNotes;
        if (totalCategoriesEl) totalCategoriesEl.textContent = Object.keys(this.data.categories).length;
        if (lastUpdatedEl) lastUpdatedEl.textContent = this.formatDate(this.data.lastUpdated);
    }
    
    updateCategories() {
        const categoryList = document.getElementById('categoryList');
        if (!categoryList) return;
        
        const categoriesHTML = Object.entries(this.data.categories)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, count]) => `
                <li class="category-item">
                    <a href="#" data-category="${category}">
                        <span>${category}</span>
                        <span class="category-count">${count}</span>
                    </a>
                </li>
            `).join('');
        
        categoryList.innerHTML = `
            <li class="category-item">
                <a href="#" data-category="" class="active">
                    <span>All Categories</span>
                    <span class="category-count">${this.data.totalNotes}</span>
                </a>
            </li>
            ${categoriesHTML}
        `;
    }
    
    applyFilters() {
        const searchTerm = document.getElementById('searchNotes').value.toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter').value;
        const certificationFilter = document.getElementById('certificationFilter').value;
        
        this.filteredNotes = this.data.notes.filter(note => {
            const matchesSearch = !searchTerm || 
                note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm) ||
                note.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !categoryFilter || note.category === categoryFilter;
            const matchesCertification = !certificationFilter || note.certification === certificationFilter;
            
            return matchesSearch && matchesCategory && matchesCertification;
        });
        
        this.renderNotes();
    }
    
    showNoteForm(noteId = null) {
        const modal = document.getElementById('noteModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('noteForm');
        
        this.currentEditingId = noteId;
        
        if (noteId) {
            // Edit mode
            const note = this.data.notes.find(n => n.id === noteId);
            if (!note) return;
            
            modalTitle.textContent = 'Edit Note';
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteCategory').value = note.category;
            document.getElementById('noteCertification').value = note.certification;
            document.getElementById('noteContent').value = note.content;
            document.getElementById('noteTags').value = note.tags.join(', ');
        } else {
            // Add mode
            modalTitle.textContent = 'Add New Note';
            form.reset();
        }
        
        modal.style.display = 'flex';
        document.getElementById('noteTitle').focus();
    }
    
    hideNoteForm() {
        const modal = document.getElementById('noteModal');
        modal.style.display = 'none';
        this.currentEditingId = null;
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const noteData = {
            title: document.getElementById('noteTitle').value.trim(),
            category: document.getElementById('noteCategory').value,
            certification: document.getElementById('noteCertification').value,
            content: document.getElementById('noteContent').value.trim(),
            tags: document.getElementById('noteTags').value.trim()
        };
        
        if (!noteData.title || !noteData.content) {
            alert('Title and content are required!');
            return;
        }
        
        try {
            if (this.currentEditingId) {
                await this.updateNote(this.currentEditingId, noteData);
            } else {
                await this.createNote(noteData);
            }
            
            this.hideNoteForm();
            this.showMessage('Note saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving note:', error);
            this.showMessage('Error saving note. Please try again.', 'error');
        }
    }
    
    showDeleteConfirmation(noteId) {
        this.currentEditingId = noteId;
        const modal = document.getElementById('deleteModal');
        modal.style.display = 'flex';
    }
    
    hideDeleteConfirmation() {
        const modal = document.getElementById('deleteModal');
        modal.style.display = 'none';
        this.currentEditingId = null;
    }
    
    async confirmDelete() {
        if (!this.currentEditingId) return;
        
        try {
            await this.deleteNote(this.currentEditingId);
            this.hideDeleteConfirmation();
            this.showMessage('Note deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting note:', error);
            this.showMessage('Error deleting note. Please try again.', 'error');
        }
    }
    
    showMessage(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    exportNotes() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `aws-study-notes-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showMessage('Notes exported successfully!', 'success');
    }
    
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Search and filters
            document.getElementById('searchNotes')?.addEventListener('input', () => this.applyFilters());
            document.getElementById('categoryFilter')?.addEventListener('change', () => this.applyFilters());
            document.getElementById('certificationFilter')?.addEventListener('change', () => this.applyFilters());
            
            // Modal controls
            document.getElementById('addNoteBtn')?.addEventListener('click', () => this.showNoteForm());
            document.getElementById('closeModal')?.addEventListener('click', () => this.hideNoteForm());
            document.getElementById('cancelNote')?.addEventListener('click', () => this.hideNoteForm());
            
            // Delete modal
            document.getElementById('closeDeleteModal')?.addEventListener('click', () => this.hideDeleteConfirmation());
            document.getElementById('cancelDelete')?.addEventListener('click', () => this.hideDeleteConfirmation());
            document.getElementById('confirmDelete')?.addEventListener('click', () => this.confirmDelete());
            
            // Form submission
            document.getElementById('noteForm')?.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Export functionality
            document.getElementById('exportNotes')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportNotes();
            });
            
            // Category filter clicks
            document.addEventListener('click', (e) => {
                if (e.target.closest('[data-category]')) {
                    e.preventDefault();
                    const category = e.target.closest('[data-category]').dataset.category;
                    document.getElementById('categoryFilter').value = category;
                    this.applyFilters();
                    
                    // Update active state
                    document.querySelectorAll('[data-category]').forEach(el => el.classList.remove('active'));
                    e.target.closest('[data-category]').classList.add('active');
                }
            });
            
            // Close modal on outside click
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    if (e.target.id === 'noteModal') this.hideNoteForm();
                    if (e.target.id === 'deleteModal') this.hideDeleteConfirmation();
                }
            });
        });
    }
    
    async render() {
        await this.loadData();
        this.renderNotes();
        this.updateStats();
        this.updateCategories();
    }
}

// Global functions for button clicks
function showNoteForm() {
    window.notesManager.showNoteForm();
}

function closeNoteModal() {
    window.notesManager.hideNoteForm();
}

function editNote(id) {
    window.notesManager.showNoteForm(id);
}

function deleteNote(id) {
    window.notesManager.showDeleteConfirmation(id);
}

function viewNote(id) {
    const note = window.notesManager.data.notes.find(n => n.id === id);
    if (!note) return;
    
    // Create a view modal (simplified version)
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>${note.title}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="note-meta" style="margin-bottom: 1rem;">
                    <span class="note-category">${note.category}</span>
                    ${note.certification ? `<span class="cert-badge">${note.certification}</span>` : ''}
                    <span class="note-date">Updated: ${window.notesManager.formatDate(note.updatedAt)}</span>
                </div>
                <div class="note-content" style="white-space: pre-wrap; line-height: 1.6;">
                    ${note.content}
                </div>
                <div class="note-tags" style="margin-top: 1rem;">
                    ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Initialize notes manager when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const notesManager = new NotesManager();
    await notesManager.render();
    
    // Make notes manager globally available
    window.notesManager = notesManager;
});