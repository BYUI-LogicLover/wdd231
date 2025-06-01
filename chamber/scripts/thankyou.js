// Get URL parameters and display application information
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const appInfoDiv = document.getElementById('application-info');
    
    // Create application info display
    let infoHTML = '<div class="info-grid">';
    
    // Helper function to format field names
    function formatFieldName(fieldName) {
        const fieldMappings = {
            'firstName': 'First Name',
            'lastName': 'Last Name',
            'orgTitle': 'Organizational Title',
            'email': 'Email Address',
            'phone': 'Mobile Phone',
            'orgName': 'Business/Organization Name',
            'membershipLevel': 'Membership Level',
            'description': 'Business Description',
            'timestamp': 'Application Submitted'
        };
        return fieldMappings[fieldName] || fieldName;
    }
    
    // Helper function to format membership level
    function formatMembershipLevel(level) {
        const levelMappings = {
            'NP': 'NP Membership (Non-Profit - No Fee)',
            'Bronze': 'Bronze Membership',
            'Silver': 'Silver Membership',
            'Gold': 'Gold Membership'
        };
        return levelMappings[level] || level;
    }
    
    // Helper function to format timestamp
    function formatTimestamp(timestamp) {
        if (!timestamp) return 'Not available';
        try {
            const date = new Date(timestamp);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return timestamp;
        }
    }
    
    // Display all submitted form data
    for (const [key, value] of urlParams.entries()) {
        if (value.trim() !== '') {
            let displayValue = value;
            
            // Format special fields
            if (key === 'membershipLevel') {
                displayValue = formatMembershipLevel(value);
            } else if (key === 'timestamp') {
                displayValue = formatTimestamp(value);
            }
            
            infoHTML += `
                <div class="info-item">
                    <strong>${formatFieldName(key)}:</strong>
                    <span>${displayValue}</span>
                </div>
            `;
        }
    }
    
    infoHTML += '</div>';
    
    // If no parameters found, show a default message
    if (urlParams.toString() === '') {
        infoHTML = '<p class="no-data">No application data found. Please submit your application through our <a href="join.html">membership form</a>.</p>';
    }
    
    appInfoDiv.innerHTML = infoHTML;
});