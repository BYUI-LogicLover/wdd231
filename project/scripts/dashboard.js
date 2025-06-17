// Dashboard data management
class DashboardManager {
    constructor() {
        this.data = null;
        this.dataFile = 'data/dashboard.json';
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
            console.error('Error loading dashboard data:', error);
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
            console.error('Error saving dashboard data:', error);
            return false;
        }
    }
    
    renderStats() {
        if (!this.data) return;
        
        const stats = this.data.stats;
        
        // Update stats overview
        const statsOverview = document.querySelector('.stats-overview');
        if (statsOverview) {
            statsOverview.innerHTML = `
                <div class="stat-card">
                    <h3>Total Study Hours</h3>
                    <div class="number">${stats.totalStudyHours}</div>
                    <div class="change positive">${stats.studyHoursChange}</div>
                </div>
                <div class="stat-card">
                    <h3>Certifications Earned</h3>
                    <div class="number">${stats.certificationsEarned}</div>
                    <div class="change neutral">${stats.certificationsList.join(', ')}</div>
                </div>
                <div class="stat-card">
                    <h3>Practice Test Average</h3>
                    <div class="number">${stats.practiceTestAverage}%</div>
                    <div class="change positive">${stats.practiceTestChange}</div>
                </div>
                <div class="stat-card">
                    <h3>Days Until Next Exam</h3>
                    <div class="number">${stats.daysUntilNextExam}</div>
                    <div class="change neutral">${stats.nextExamName}</div>
                </div>
            `;
        }
    }
    
    renderUpcomingExams() {
        if (!this.data) return;
        
        const upcomingExams = document.querySelector('.upcoming-exams');
        if (upcomingExams) {
            const examsHTML = this.data.upcomingExams.map(exam => `
                <div class="exam-item">
                    <span class="exam-name">${exam.name}</span>
                    <span class="exam-date">${exam.date}</span>
                </div>
            `).join('');
            
            upcomingExams.innerHTML = `
                <h3>📅 Upcoming Exams</h3>
                ${examsHTML}
            `;
        }
    }
    
    renderActiveCertifications() {
        if (!this.data) return;
        
        const activeCertCard = document.querySelector('.card .card-content');
        if (activeCertCard && activeCertCard.parentElement.querySelector('h2').textContent === 'Active Certifications') {
            const certsHTML = this.data.activeCertifications.map(cert => `
                <div class="cert-item">
                    <div class="cert-info">
                        <h4>${cert.name}</h4>
                        <p>Target: ${cert.targetDate}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${cert.progress}%"></div>
                        </div>
                        <div class="progress-text">${cert.progress}% Complete</div>
                    </div>
                    <div class="cert-status">
                        <span class="status-badge status-${cert.status.toLowerCase()}">${cert.status}</span>
                    </div>
                </div>
            `).join('');
            
            activeCertCard.innerHTML = certsHTML;
        }
    }
    
    renderStudySessions() {
        if (!this.data) return;
        
        const studySessionsCard = document.querySelectorAll('.card .card-content')[1];
        if (studySessionsCard) {
            const sessionsHTML = this.data.studySessions.map(session => `
                <div class="study-session">
                    <div>
                        <div class="session-date">${session.date}</div>
                        <div class="session-duration">${session.duration}</div>
                    </div>
                    <div class="session-score ${session.scoreClass}">${session.score}%</div>
                </div>
            `).join('');
            
            studySessionsCard.innerHTML = sessionsHTML;
        }
    }
    
    renderEarnedCertifications() {
        if (!this.data) return;
        
        const earnedCertCard = document.querySelectorAll('.card .card-content')[2];
        if (earnedCertCard) {
            const certsHTML = this.data.earnedCertifications.map(cert => `
                <div class="cert-item">
                    <div class="cert-info">
                        <h4>${cert.name}</h4>
                        <p>Earned: ${cert.earnedDate}</p>
                        <p>Expires: ${cert.expirationDate}</p>
                    </div>
                    <div class="cert-status">
                        <span class="status-badge status-completed">${cert.status}</span>
                    </div>
                </div>
            `).join('');
            
            earnedCertCard.innerHTML = certsHTML;
        }
    }
    
    async render() {
        await this.loadData();
        if (this.data) {
            this.renderStats();
            this.renderUpcomingExams();
            this.renderActiveCertifications();
            this.renderStudySessions();
            this.renderEarnedCertifications();
        }
    }
    
    // Method to update study hours
    async updateStudyHours(hours) {
        if (this.data) {
            this.data.stats.totalStudyHours += hours;
            await this.saveData(this.data);
            this.renderStats();
        }
    }
    
    // Method to add new study session
    async addStudySession(session) {
        if (this.data) {
            this.data.studySessions.unshift(session);
            // Keep only last 5 sessions
            if (this.data.studySessions.length > 5) {
                this.data.studySessions = this.data.studySessions.slice(0, 5);
            }
            await this.saveData(this.data);
            this.renderStudySessions();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const dashboardManager = new DashboardManager();
    await dashboardManager.render();
    
    // Make dashboard manager globally available for other scripts
    window.dashboardManager = dashboardManager;
});