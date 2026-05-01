# TalentStack

TalentStack is an AI-powered career acceleration web application designed to help students, recent graduates, career switchers, and job seekers discover career paths, prepare for opportunities, and manage job applications in one centralized platform.

Unlike traditional job boards that mainly focus on active postings, TalentStack emphasizes career discovery, personalized job matching, skill mapping, application tracking, and interview preparation. The platform helps users understand how their education, skills, certifications, and experience connect to real-world career opportunities.

## Project Description
```
TalentStack was created to bridge the gap between education and employment. Many students and job seekers struggle to understand how their major, minor, skills, or previous experience translate into actual career paths. TalentStack provides a structured platform where users can create a profile, upload resume information, explore career paths, receive job recommendations, track applications, and prepare for interviews.

TalentStack is an all-in-one AI-powered career acceleration platform that combines career discovery, resume-based job matching, application tracking, interview preparation, notifications, and a networking-style communication layer. :contentReference[oaicite:0]{index=0}
```

## Features (Both Implemented and Planned)
```
User Account System
- User registration
- User login and logout
- Password storage using hashed credentials
- Account status tracking
- Last password change display

User Profile
- Create and update user profile information
- Store user details such as:
  - Full name
  - Major
  - Minor
  - Graduation year
  - Demographic information
  - Profile photo
- Use profile data to generate career matches

Resume Upload and Parsing
- Upload a resume or career-related information
- Extract skills, education, and experience
- Match resume data against job listings
- Generate personalized job recommendations

Career Path Matching
- Map majors, minors, and skills to relevant career paths
- Display career path information such as:
  - Related majors
  - Required skills
  - Certifications
  - Salary ranges
  - Experience expectations

Job Listings and Recommendations
- View recommended jobs based on profile and resume data
- Save jobs for later
- Search for jobs based on user preferences
- Display job details including:
  - Job title
  - Company
  - Required skills
  - Experience level
  - Source URL
  - Match score

Application Tracking
- Create job applications
- Edit existing applications
- Delete applications
- Track application status
- Store application notes
- View applications from a dashboard
- Track deadlines, follow-ups, and relevant dates

Interview Preparation
- Generate AI-assisted interview questions
- Tailor interview questions to specific roles or companies
- Help users prepare for unfamiliar interview formats

Messaging
- Send messages to companies or employers
- View message history
- Mark messages as read

Notifications
- Receive notifications for important career and application events
- Mark notifications as read
- Dismiss notifications
- Receive application-related updates

Settings and Preferences
- Update user preferences
- Save job search preferences
- Configure privacy settings
- Configure email alerts
- Change language settings
- Enable or disable dark mode

Calendar Feature
- View dates relevant to specific job applications
- Track important application-related deadlines

Dark Mode
- Full dark mode support across the application
- Improved accessibility and user customization
```

# How to run 

Run these commands in a docker terminal: 
docker pull njohnstmpl/talentstack:1.0.4​
docker run -p 8080:8080 njohnstmpl/talentstack:1.0.4

Navigate to this web address in your browser: 
http://localhost:8080

Note: Running this project requires that the device is connected and authenticated to the server via the tailscale mesh vpn. To make a request to add your device, create an issue on GitHub. The static frontend is availible at this link: https://cis3296s26.github.io/final-project-03-TalentStack/


Project Board:
https://github.com/orgs/cis3296s26/projects/39/views/2

# How to contribute
Follow this project board to know the latest status of the project: https://github.com/orgs/cis3296s26/projects/39/views/2

### How to build
- Use this github repository: https://github.com/cis3296s26/final-project-03-TalentStack.git
- Currently, the branch scrum3-mergedproject contains the fully functional project
- Main contains the latest frontend additions to the project
- aibranch contains the implementation of the Interview Prep tool, which will be implemented next
- JDK release at or newer than 17 is required
- The latest version of Intellij is prefered
- Any additional dependencies or libraries should be downloaded when building, but they may need to be added manually
- If running in Intellij, create a Maven Run Configuration with the following settings
    - Run Command: spring-boot:run
    - Working Directory: ~\final-project-03-TalentStack\TalentStack
      <img width="1973" height="1697" alt="image" src="https://github.com/user-attachments/assets/cbf43fd3-a456-4772-aee1-436ac9ba75bc" />

- When running, the project should compile and run in Spring
