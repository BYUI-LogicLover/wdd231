// Course management module
const CourseManager = {
    FILTER_TYPES: Object.freeze({
        ALL: 'All',
        CSE: 'CSE',
        WDD: 'WDD'
    }),

    courses: [
        { code: "CSE 110", name: "Introduction to Programming", credits: 2, completed: true, type: "CSE" },
        { code: "CSE 111", name: "Programming with Functions", credits: 2, completed: true, type: "CSE" },
        { code: "CSE 210", name: "Programming with Classes", credits: 2, completed: false, type: "CSE" },
        { code: "WDD 130", name: "Web Fundamentals", credits: 2, completed: true, type: "WDD" },
        { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, completed: false, type: "WDD" },
        { code: "WDD 231", name: "Front-end Web Development I", credits: 2, completed: false, type: "WDD" }
    ]
};

class CourseView {
    constructor(containerId, totalCreditsId) {
        this.container = document.getElementById(containerId);
        this.totalCreditsElement = document.getElementById(totalCreditsId);
        
        if (!this.container || !this.totalCreditsElement) {
            throw new Error('Required DOM elements not found');
        }
    }

    createCourseElement(course) {
        const element = document.createElement('div');
        element.className = `course-card${course.completed ? ' completed' : ''}`;
        element.setAttribute('role', 'listitem');
        
        const codeElement = document.createElement('div');
        codeElement.textContent = course.code;
        
        const nameElement = document.createElement('div');
        nameElement.className = `course-name${course.completed ? ' completed' : ''}`;
        nameElement.textContent = course.name;
        
        element.appendChild(codeElement);
        element.appendChild(nameElement);
        
        return element;
    }

    render(courses) {
        this.container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        
        courses.forEach(course => {
            fragment.appendChild(this.createCourseElement(course));
        });

        this.container.appendChild(fragment);
        this.container.setAttribute('role', 'list');
        this.container.classList.add('courses-display');
    }

    updateTotalCredits(credits) {
        this.totalCreditsElement.textContent = `Total Credits: ${credits}`;
    }
}

class CourseController {
    constructor(view) {
        this.view = view;
        this.currentFilter = CourseManager.FILTER_TYPES.ALL;
    }

    filterCourses(filter) {
        return filter === CourseManager.FILTER_TYPES.ALL
            ? CourseManager.courses
            : CourseManager.courses.filter(course => course.type === filter);
    }

    calculateTotalCredits(courses) {
        return courses.reduce((total, course) => total + course.credits, 0);
    }

    updateDisplay(filter = CourseManager.FILTER_TYPES.ALL) {
        const filteredCourses = this.filterCourses(filter);
        const totalCredits = this.calculateTotalCredits(filteredCourses);
        
        this.view.render(filteredCourses);
        this.view.updateTotalCredits(totalCredits);
        this.currentFilter = filter;
    }
}

class FilterButtonManager {
    constructor(controller) {
        this.controller = controller;
        this.buttons = new Map([
            [CourseManager.FILTER_TYPES.ALL, document.getElementById('all-button')],
            [CourseManager.FILTER_TYPES.CSE, document.getElementById('cse-button')],
            [CourseManager.FILTER_TYPES.WDD, document.getElementById('wdd-button')]
        ]);

        if ([...this.buttons.values()].some(button => !button)) {
            throw new Error('One or more filter buttons not found');
        }
    }

    setActiveButton(type) {
        this.buttons.forEach((button, buttonType) => {
            button.classList.toggle('active', buttonType === type);
        });
    }

    initialize() {
        this.buttons.forEach((button, type) => {
            button.addEventListener('click', () => {
                this.setActiveButton(type);
                this.controller.updateDisplay(type);
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const courseView = new CourseView('courses', 'total-credits');
        const courseController = new CourseController(courseView);
        const filterButtons = new FilterButtonManager(courseController);

        courseController.updateDisplay();
        filterButtons.initialize();
    } catch (error) {
        console.error('Failed to initialize course management:', error);
    }
});